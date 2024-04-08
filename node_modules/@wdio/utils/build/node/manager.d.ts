import type { Options, Capabilities } from '@wdio/types';
export declare function setupDriver(options: Omit<Options.WebDriver, 'capabilities'>, caps: Capabilities.RemoteCapabilities): Promise<unknown[] | undefined>;
export declare function setupBrowser(options: Omit<Options.WebDriver, 'capabilities'>, caps: Capabilities.RemoteCapabilities): Promise<unknown[]> | undefined;
//# sourceMappingURL=manager.d.ts.map