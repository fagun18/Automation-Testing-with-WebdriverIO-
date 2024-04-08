import EventEmitter from 'node:events';
import { minimatch } from 'minimatch';
import Timer from '../Timer.js';
export default class Interception extends EventEmitter {
    url;
    filterOptions;
    browser;
    respondOverwrites = [];
    matches = [];
    constructor(url, filterOptions = {}, browser) {
        super();
        this.url = url;
        this.filterOptions = filterOptions;
        this.browser = browser;
    }
    waitForResponse({ timeout = this.browser.options.waitforTimeout, interval = this.browser.options.waitforInterval, timeoutMsg, } = {}) {
        /*!
         * ensure that timeout and interval are set properly
         */
        if (typeof timeout !== 'number') {
            timeout = this.browser.options.waitforTimeout;
        }
        if (typeof interval !== 'number') {
            interval = this.browser.options.waitforInterval;
        }
        /* istanbul ignore next */
        const fn = async () => this.calls && (await this.calls).length > 0;
        const timer = new Timer(interval, timeout, fn, true);
        return this.browser.call(() => timer.catch((e) => {
            if (e.message === 'timeout') {
                if (typeof timeoutMsg === 'string') {
                    throw new Error(timeoutMsg);
                }
                throw new Error(`waitForResponse timed out after ${timeout}ms`);
            }
            throw new Error(`waitForResponse failed with the following reason: ${(e && e.message) || e}`);
        }));
    }
    static isMatchingRequest(expectedUrl, actualUrl) {
        if (typeof expectedUrl === 'string') {
            return minimatch(actualUrl, expectedUrl);
        }
        if (expectedUrl instanceof RegExp) {
            return Boolean(actualUrl.match(expectedUrl));
        }
        throw new Error(`Unexpected type for mock url: ${expectedUrl}`);
    }
}
