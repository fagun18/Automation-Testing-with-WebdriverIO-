let EnvRequestLib;
export default class RequestFactory {
    static async getInstance(method, endpoint, body, isHubCommand = false) {
        if (!EnvRequestLib) {
            EnvRequestLib = process?.versions?.node
                ? (await import('./node.js')).default
                : (await import('./browser.js')).default;
        }
        return new EnvRequestLib(method, endpoint, body, isHubCommand);
    }
}
export class URLFactory {
    static async getInstance(uri) {
        if (process?.versions?.node) {
            const { URL } = await import('node:url');
            return new URL(uri);
        }
        return new window.URL(uri);
    }
}
