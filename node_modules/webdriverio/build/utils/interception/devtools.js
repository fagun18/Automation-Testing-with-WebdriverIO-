import fs from 'node:fs/promises';
import path from 'node:path';
import logger from '@wdio/logger';
import Interception from './index.js';
import { containsHeaderObject } from '../index.js';
import { ERROR_REASON } from '../../constants.js';
import { CDP_SESSIONS, SESSION_MOCKS } from '../../commands/browser/mock.js';
const log = logger('webdriverio');
export default class DevtoolsInterception extends Interception {
    restored = false;
    static handleRequestInterception(client, mocks) {
        return async (event) => {
            // responseHeaders and responseStatusCode are only present in Response stage
            // https://chromedevtools.github.io/devtools-protocol/tot/Fetch/#event-requestPaused
            const isRequest = !event.responseHeaders && !event.responseErrorReason;
            event.responseStatusCode ||= event.responseErrorReason ? 0 : 200;
            event.responseHeaders ||= [];
            const responseHeaders = event.responseHeaders.reduce((headers, { name, value }) => {
                headers[name] = value;
                return headers;
            }, {});
            let mockResponded = false;
            for (const mock of mocks) {
                /**
                 * skip response mocks in Request stage
                 */
                if (isRequest && (mock.respondOverwrites.length === 0 || // nothing to do in Request stage
                    (!mock.respondOverwrites[0].errorReason && // skip if not going to abort a request
                        // or want to fetch response
                        mock.respondOverwrites[0].params &&
                        mock.respondOverwrites[0].params.fetchResponse !== false))) {
                    continue;
                }
                /**
                 * match mock url
                 */
                if (!Interception.isMatchingRequest(mock.url, event.request.url)) {
                    continue;
                }
                /**
                 * Add statusCode and responseHeaders to request to be used in expect-webdriverio
                 */
                event.request.statusCode = event.responseStatusCode;
                event.request.responseHeaders = { ...responseHeaders };
                /**
                 * match filter options
                 */
                if (filterMethod(event.request.method, mock.filterOptions.method) ||
                    filterHeaders(event.request.headers, mock.filterOptions.requestHeaders) ||
                    filterHeaders(responseHeaders, mock.filterOptions.headers) ||
                    filterRequest(event.request.postData, mock.filterOptions.postData) ||
                    filterStatusCode(event.responseStatusCode, mock.filterOptions.statusCode)) {
                    continue;
                }
                mock.emit('request', event);
                const { requestId, request, responseStatusCode } = event;
                const { body, base64Encoded = undefined } = isRequest ? { body: '' } : await client.send('Fetch.getResponseBody', { requestId }).catch(/* istanbul ignore next */ () => ({}));
                request.body = base64Encoded ? Buffer.from(body, 'base64').toString('utf8') : body;
                const contentTypeHeader = Object.keys(responseHeaders).find(h => h.toLowerCase() === 'content-type') || '';
                const responseContentType = responseHeaders[contentTypeHeader];
                request.body = responseContentType && responseContentType.includes('application/json')
                    ? tryParseJson(request.body)
                    : request.body;
                mock.matches.push(request);
                /**
                 * no stubbing if no overwrites were defined
                 */
                if (mockResponded || mock.respondOverwrites.length === 0) {
                    mock.emit('match', request);
                    mock.emit('continue', requestId);
                    continue;
                }
                const { errorReason, overwrite, params = {} } = mock.respondOverwrites[0].sticky
                    ? mock.respondOverwrites[0]
                    : mock.respondOverwrites.shift() || {};
                /**
                 * when response is modified
                 */
                if (overwrite !== undefined) {
                    let newBody = overwrite;
                    if (typeof overwrite === 'function') {
                        newBody = await overwrite(request, client);
                    }
                    const isBodyUndefined = typeof newBody === 'undefined';
                    if (isBodyUndefined) {
                        newBody = '';
                    }
                    if (typeof newBody !== 'string') {
                        newBody = JSON.stringify(newBody);
                    }
                    let responseCode = typeof params.statusCode === 'function' ? params.statusCode(request) : params.statusCode || responseStatusCode;
                    let responseHeaders = [
                        ...event.responseHeaders,
                        ...Object.entries(typeof params.headers === 'function' ? params.headers(request) : params.headers || {}).map(([name, value]) => ({ name, value }))
                    ];
                    /**
                     * check if local file and load it
                     */
                    const responseFilePath = path.isAbsolute(newBody) ? newBody : path.join(process.cwd(), newBody);
                    const responseFileAccessible = await fs.access(responseFilePath).then(() => true, () => false);
                    if (newBody.length > 0 && responseFileAccessible) {
                        newBody = (await fs.readFile(responseFilePath));
                    }
                    else if (newBody.startsWith('http')) {
                        responseCode = 301;
                        /**
                         * filter out possible available location header
                         */
                        responseHeaders = responseHeaders.filter(({ name }) => name.toLowerCase() !== 'location');
                        responseHeaders.push({ name: 'Location', value: newBody });
                    }
                    request.mockedResponse = newBody;
                    mock.emit('match', request);
                    const overwriteData = { requestId, responseCode, responseHeaders, body: isBodyUndefined ? undefined : newBody };
                    mock.emit('overwrite', overwriteData);
                    mockResponded = true;
                    const body = typeof overwriteData.body === 'undefined'
                        ? undefined
                        : (overwriteData.body instanceof Buffer
                            ? overwriteData.body
                            : Buffer.from(overwriteData.body, 'utf8')).toString('base64');
                    await client.send('Fetch.fulfillRequest', {
                        ...overwriteData,
                        body
                    }).catch(/* istanbul ignore next */ logFetchError);
                    continue;
                }
                /**
                 * when request is aborted
                 */
                if (errorReason) {
                    const failData = { requestId, errorReason };
                    mock.emit('fail', failData);
                    mockResponded = true;
                    await client.send('Fetch.failRequest', failData).catch(/* istanbul ignore next */ logFetchError);
                    continue;
                }
            }
            if (!mockResponded) {
                return client.send('Fetch.continueRequest', { requestId: event.requestId }).catch(/* istanbul ignore next */ logFetchError);
            }
        };
    }
    /**
     * allows access to all requests made with given pattern
     */
    get calls() {
        return this.matches;
    }
    /**
     * Resets all information stored in the `mock.calls` set.
     */
    clear() {
        this.matches = [];
    }
    /**
     * Does everything that `mock.clear()` does, and also
     * removes any mocked return values or implementations.
     * Restored mock does not emit events and could not mock responses
     */
    async restore(sessionMocks = SESSION_MOCKS, cdpSessions = CDP_SESSIONS) {
        this.clear();
        this.respondOverwrites = [];
        this.restored = true;
        const handle = await this.browser.getWindowHandle();
        log.trace(`Restoring mock for ${handle}`);
        sessionMocks[handle].delete(this);
        if (sessionMocks[handle].size) {
            return;
        }
        log.trace(`Disabling fetch domain for ${handle}`);
        return cdpSessions[handle].send('Fetch.disable')
            .then(() => {
            delete sessionMocks[handle];
            delete cdpSessions[handle];
        }).catch(/* istanbul ignore next */ logFetchError);
    }
    /**
     * Always respond with same overwrite
     * @param {*} overwrites  payload to overwrite the response
     * @param {*} params      additional respond parameters to overwrite
     */
    respond(overwrite, params = {}) {
        this.ensureNotRestored();
        this.respondOverwrites.push({ overwrite, params, sticky: true });
    }
    /**
     * Respond request once with given overwrite
     * @param {*} overwrites  payload to overwrite the response
     * @param {*} params      additional respond parameters to overwrite
     */
    respondOnce(overwrite, params = {}) {
        this.ensureNotRestored();
        this.respondOverwrites.push({ overwrite, params });
    }
    /**
     * Abort the request with an error code
     * @param {string} errorCode  error code of the response
     */
    abort(errorReason, sticky = true) {
        this.ensureNotRestored();
        if (typeof errorReason !== 'string' || !ERROR_REASON.includes(errorReason)) {
            throw new Error(`Invalid value for errorReason, allowed are: ${ERROR_REASON.join(', ')}`);
        }
        this.respondOverwrites.push({ errorReason, sticky });
    }
    /**
     * Abort the request once with an error code
     * @param {string} errorReason  error code of the response
     */
    abortOnce(errorReason) {
        this.abort(errorReason, false);
    }
    ensureNotRestored() {
        if (this.restored) {
            throw new Error('This can\'t be done on restored mock');
        }
    }
}
const filterMethod = (method, expected) => {
    if (typeof expected === 'undefined') {
        return false;
    }
    if (typeof expected === 'function') {
        return expected(method) !== true;
    }
    return expected.toLowerCase() !== method.toLowerCase();
};
const filterHeaders = (responseHeaders, expected) => {
    if (typeof expected === 'undefined') {
        return false;
    }
    if (typeof expected === 'function') {
        return expected(responseHeaders) !== true;
    }
    return !containsHeaderObject(responseHeaders, expected);
};
const filterRequest = (postData, expected) => {
    if (typeof expected === 'undefined') {
        return false;
    }
    if (typeof expected === 'function') {
        return expected(postData) !== true;
    }
    return postData !== expected;
};
const filterStatusCode = (statusCode, expected) => {
    if (typeof expected === 'undefined') {
        return false;
    }
    if (typeof expected === 'function') {
        return expected(statusCode) !== true;
    }
    return statusCode !== expected;
};
const tryParseJson = (body) => {
    try {
        return JSON.parse(body) || body;
    }
    catch {
        return body;
    }
};
const logFetchError = (err) => {
    /* istanbul ignore next */
    log.debug(err?.message);
};
