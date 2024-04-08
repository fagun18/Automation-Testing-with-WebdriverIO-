/**
 * used to wrap mocha, jasmine test frameworks functions (`it`, `beforeEach` and other)
 * with WebdriverIO before/after Test/Hook hooks.
 * Entrypoint is `wrapGlobalTestMethod`, other functions are exported for testing purposes.
 *
 * NOTE: not used by cucumber test framework. `testFnWrapper` is called directly there
 */
import { filterSpecArgs } from '../utils.js';
import { testFnWrapper } from './testFnWrapper.js';
const MOCHA_COMMANDS = ['skip', 'only'];
/**
 * runs a hook and execute before/after hook
 *
 * @param  {Function} hookFn        function that was passed to the framework hook
 * @param  {Function} origFn        original framework hook function
 * @param  {Function} beforeFn      before hook
 * @param  {Function} beforeFnArgs  function that returns args for `beforeFn`
 * @param  {Function} afterFn       after hook
 * @param  {Function} afterArgsFn   function that returns args for `afterFn`
 * @param  {string}   cid           cid
 * @param  {number}   repeatTest    number of retries if hook fails
 * @return {Function}               wrapped framework hook function
 */
export const runHook = function (hookFn, origFn, beforeFn, beforeFnArgs, afterFn, afterFnArgs, cid, repeatTest, timeout) {
    const wrappedHook = function (...hookFnArgs) {
        return testFnWrapper.call(this, 'Hook', {
            specFn: hookFn,
            specFnArgs: filterSpecArgs(hookFnArgs)
        }, {
            beforeFn,
            beforeFnArgs
        }, {
            afterFn,
            afterFnArgs
        }, cid, repeatTest, origFn.name);
    };
    /**
     * make sure Mocha grabs the correct hook function body
     */
    wrappedHook.toString = () => hookFn.toString();
    return origFn(wrappedHook, timeout);
};
/**
 * runs a spec function (test function)
 *
 * @param  {string}   specTitle     test description
 * @param  {Function} specFn        test function that got passed in from the user
 * @param  {Function} origFn        original framework test function
 * @param  {Function} beforeFn      before hook
 * @param  {Function} beforeFnArgs  function that returns args for `beforeFn`
 * @param  {Function} afterFn       after hook
 * @param  {Function} afterFnArgs   function that returns args for `afterFn`
 * @param  {string}   cid           cid
 * @param  {number}   repeatTest    number of retries if test fails
 * @return {Function}               wrapped test function
 */
export const runSpec = function (specTitle, specFn, origFn, beforeFn, beforeFnArgs, afterFn, afterFnArgs, cid, repeatTest, timeout) {
    const wrappedFn = function (...specFnArgs) {
        return testFnWrapper.call(this, 'Test', {
            specFn,
            specFnArgs: filterSpecArgs(specFnArgs)
        }, {
            beforeFn,
            beforeFnArgs
        }, {
            afterFn,
            afterFnArgs
        }, cid, repeatTest);
    };
    /**
     * make sure Mocha grabs the correct test function body
     */
    wrappedFn.toString = () => specFn.toString();
    return origFn(specTitle, wrappedFn, timeout);
};
/**
 * wraps hooks and test function of a framework within a fiber context
 *
 * @param  {Function} origFn               original framework function
 * @param  {Boolean}  isSpec               whether or not origFn is a spec
 * @param  {string[]} testInterfaceFnNames command that runs specs, e.g. `it`, `it.only` or `fit`
 * @param  {Function} beforeFn             before hook
 * @param  {Function} beforeFnArgs         function that returns args for `beforeFn`
 * @param  {Function} afterFn              after hook
 * @param  {Function} afterArgsFn          function that returns args for `afterFn`
 * @param  {string}   cid                  cid
 * @return {Function}                      wrapped test/hook function
 */
export const wrapTestFunction = function (origFn, isSpec, beforeFn, beforeArgsFn, afterFn, afterArgsFn, cid) {
    return function (...specArguments) {
        /**
         * Variadic arguments:
         * [title, fn], [title], [fn]
         * [title, fn, retryCnt], [title, retryCnt], [fn, retryCnt]
         */
        let retryCnt = typeof specArguments[specArguments.length - 1] === 'number'
            ? specArguments.pop() :
            0;
        /**
         * Jasmine uses a timeout value as last parameter, in this case the arguments
         * should be [title, fn, timeout, retryCnt]
         */
        // @ts-expect-error
        let timeout = globalThis.jasmine?.DEFAULT_TIMEOUT_INTERVAL;
        // @ts-expect-error
        if (globalThis.jasmine) {
            // if we have [title, fn, timeout, retryCnt]
            if (typeof specArguments[specArguments.length - 1] === 'number') {
                timeout = specArguments.pop();
                // if we have [title, fn, timeout]
            }
            else {
                timeout = retryCnt;
                retryCnt = 0;
            }
        }
        const specFn = typeof specArguments[0] === 'function' ? specArguments.shift()
            : (typeof specArguments[1] === 'function' ? specArguments[1] : undefined);
        const specTitle = specArguments[0];
        if (isSpec) {
            if (specFn) {
                return runSpec(specTitle, specFn, origFn, beforeFn, beforeArgsFn, afterFn, afterArgsFn, cid, retryCnt, timeout);
            }
            /**
             * if specFn is undefined we are dealing with a pending function
             */
            return origFn(specTitle);
        }
        return runHook(specFn, origFn, beforeFn, beforeArgsFn, afterFn, afterArgsFn, cid, retryCnt, timeout);
    };
};
/**
 * Wraps global test function like `it`.
 *
 * The scope parameter is used in the qunit framework since all functions are bound to global.QUnit instead of global
 *
 * @param  {boolean}  isTest        is `origFn` test function, otherwise hook
 * @param  {Function} beforeFn      before hook
 * @param  {Function} beforeFnArgs  function that returns args for `beforeFn`
 * @param  {Function} afterFn       after hook
 * @param  {Function} afterArgsFn   function that returns args for `afterFn`
 * @param  {string}   fnName        test interface command to wrap, e.g. `beforeEach`
 * @param  {string}   cid           cid
 * @param  {Object}   scope         the scope to run command from, defaults to global
 */
export const wrapGlobalTestMethod = function (isSpec, beforeFn, beforeArgsFn, afterFn, afterArgsFn, fnName, cid, scope = globalThis) {
    const origFn = scope[fnName];
    scope[fnName] = wrapTestFunction(origFn, isSpec, beforeFn, beforeArgsFn, afterFn, afterArgsFn, cid);
    addMochaCommands(origFn, scope[fnName]);
};
/**
 * support `it.skip` and `it.only` for the Mocha framework
 * @param {Function} origFn original function
 * @param {function} newFn  wrapped function
 */
function addMochaCommands(origFn, newFn) {
    MOCHA_COMMANDS.forEach((commandName) => {
        if (typeof origFn[commandName] === 'function') {
            newFn[commandName] = origFn[commandName];
        }
    });
}
