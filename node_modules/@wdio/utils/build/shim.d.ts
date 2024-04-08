import type { Frameworks } from '@wdio/types';
export declare function executeHooksWithArgs<T>(this: any, hookName: string, hooks?: Function | Function[], args?: any[]): Promise<(T | Error)[]>;
/**
 * wrap command to enable before and after command to be executed
 * @param commandName name of the command (e.g. getTitle)
 * @param fn          command function
 */
export declare function wrapCommand<T>(commandName: string, fn: Function): (...args: any) => Promise<T>;
/**
 * execute test or hook asynchronously
 *
 * @param  {Function} fn         spec or hook method
 * @param  {object}   retries    { limit: number, attempts: number }
 * @param  {Array}    args       arguments passed to hook
 * @param  {number}   timeout    The maximum time (in milliseconds) to wait for the function to complete
 * @return {Promise}             that gets resolved once test/hook is done or was retried enough
 */
export declare function executeAsync(this: any, fn: Function, retries: Frameworks.TestRetries, args?: any[], timeout?: number): Promise<unknown>;
//# sourceMappingURL=shim.d.ts.map