import type { WrapperMethods, SpecFunction, BeforeHookParam, AfterHookParam } from './types.js';
declare global {
    var _wdioDynamicJasmineResultErrorList: any | undefined;
    var _jasmineTestResult: any | undefined;
}
/**
 * wraps test framework spec/hook function with WebdriverIO before/after hooks
 *
 * @param   {string} type           Test/Step or Hook
 * @param   {object} spec           specFn and specFnArgs
 * @param   {object} before         beforeFn and beforeFnArgs
 * @param   {object} after          afterFn and afterFnArgs
 * @param   {string} cid            cid
 * @param   {number} repeatTest     number of retries if test fails
 * @param   {string} hookName       the hook name
 * @param   {number} timeout        the maximum time (in milliseconds) to wait for
 * @return  {*}                     specFn result
 */
export declare const testFnWrapper: (this: unknown, args_0: string, args_1: SpecFunction, args_2: BeforeHookParam<unknown>, args_3: AfterHookParam<unknown>, args_4: string, args_5: number, args_6?: string | undefined, args_7?: number | undefined) => Promise<any>;
/**
 * wraps test framework spec/hook function with WebdriverIO before/after hooks
 *
 * @param   {object} wrapFunctions  executeHooksWithArgs, executeAsync, runSync
 * @param   {string} type           Test/Step or Hook
 * @param   {object} spec           specFn and specFnArgs array
 * @param   {object} before         beforeFn and beforeFnArgs function
 * @param   {object} after          afterFn and afterFnArgs function
 * @param   {string} cid            cid
 * @param   {number} repeatTest     number of retries if test fails
 * @param   {string} hookName       the hook name
 * @param   {number} timeout        the maximum time (in milliseconds) to wait for
 * @return  {*}                     specFn result
 */
export declare const testFrameworkFnWrapper: (this: unknown, { executeHooksWithArgs, executeAsync }: WrapperMethods, type: string, { specFn, specFnArgs }: SpecFunction, { beforeFn, beforeFnArgs }: BeforeHookParam<unknown>, { afterFn, afterFnArgs }: AfterHookParam<unknown>, cid: string, repeatTest?: number, hookName?: string, timeout?: number) => Promise<any>;
/**
 * Filter out internal stacktraces. exporting to allow testing of the function
 * @param   {string} stack Stacktrace
 * @returns {string}
 */
export declare const filterStackTrace: (stack: string) => string;
//# sourceMappingURL=testFnWrapper.d.ts.map