import ky from 'ky';
import logger from '@wdio/logger';
import WebDriverRequest from './index.js';
const log = logger('webdriver');
const UNSUPPORTED_OPTS = [
    'agent',
    'responseType',
    'searchParams',
];
export default class BrowserRequest extends WebDriverRequest {
    constructor(method, endpoint, body, isHubCommand = false) {
        super(method, endpoint, body, isHubCommand);
    }
    async _createOptions(options, sessionId) {
        return super._createOptions(options, sessionId, true);
    }
    async _libRequest(url, options) {
        const kyOptions = {};
        for (const opt of Object.keys(options)) {
            if (typeof options[opt] !== 'undefined' &&
                UNSUPPORTED_OPTS.includes(opt) &&
                options[opt] !== this.defaultOptions[opt]) {
                log.info(`Browser-based webdriver does not support the '${String(opt)}' option; behavior may be unexpected`);
                continue;
            }
            // @ts-expect-error
            kyOptions[opt] = options[opt];
        }
        if (options.username && options.password) {
            const encodedAuth = Buffer.from(`${options.username}:${options.password}`, 'utf8').toString('base64');
            kyOptions.headers = {
                ...kyOptions.headers,
                Authorization: `Basic ${encodedAuth}`
            };
        }
        const res = await ky(url, kyOptions);
        return {
            statusCode: res.status,
            body: await res.json(),
        };
    }
    _libPerformanceNow() {
        return performance.now();
    }
}
