import http from 'node:http';
import https from 'node:https';
import { performance } from 'node:perf_hooks';
import got from 'got';
import WebDriverRequest, { RequestLibError } from './index.js';
const agents = {
    http: new http.Agent({ keepAlive: true }),
    https: new https.Agent({ keepAlive: true })
};
export default class NodeJSRequest extends WebDriverRequest {
    constructor(method, endpoint, body, isHubCommand = false) {
        super(method, endpoint, body, isHubCommand);
        this.defaultAgents = agents;
    }
    async _libRequest(url, opts) {
        try {
            return (await got(url, opts));
        }
        catch (err) {
            if (!(err instanceof Error)) {
                throw new RequestLibError(err.message || err);
            }
            throw err;
        }
    }
    _libPerformanceNow() {
        return performance.now();
    }
}
