import type { Options } from '@wdio/types';
/**
 * create `browser` object with capabilities and environment flags before session is started
 * so that Mocha/Jasmine users can filter their specs based on flags or use capabilities in test titles
 */
export default class ProtocolStub {
    static newSession(options: Options.WebDriver): Promise<any>;
    /**
     * added just in case user wants to somehow reload webdriver or devtools session
     * before it was started.
     */
    static reloadSession(): void;
    static attachToSession(options: never, modifier?: Function): any;
}
//# sourceMappingURL=protocol-stub.d.ts.map