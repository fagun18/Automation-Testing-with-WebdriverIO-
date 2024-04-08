import zip from 'lodash.zip';
import clone from 'lodash.clonedeep';
import { webdriverMonad, wrapCommand } from '@wdio/utils';
import { multiremoteHandler } from './middlewares.js';
import { getPrototype } from './utils/index.js';
/**
 * Multiremote class
 */
export default class MultiRemote {
    instances = {};
    baseInstance;
    sessionId;
    /**
     * add instance to multibrowser instance
     */
    async addInstance(browserName, client) {
        this.instances[browserName] = await client;
        return this.instances[browserName];
    }
    /**
     * modifier for multibrowser instance
     */
    modifier(wrapperClient) {
        const propertiesObject = {};
        propertiesObject.commandList = { value: wrapperClient.commandList };
        propertiesObject.options = { value: wrapperClient.options };
        propertiesObject.getInstance = {
            value: (browserName) => this.instances[browserName]
        };
        for (const commandName of wrapperClient.commandList) {
            propertiesObject[commandName] = {
                value: this.commandWrapper(commandName),
                configurable: true
            };
        }
        propertiesObject.__propertiesObject__ = {
            value: propertiesObject
        };
        this.baseInstance = new MultiRemoteDriver(this.instances, propertiesObject);
        const client = Object.create(this.baseInstance, propertiesObject);
        /**
         * attach instances to wrapper client
         * ToDo(Christian): deprecate and remove
         */
        for (const [identifier, instance] of Object.entries(this.instances)) {
            client[identifier] = instance;
        }
        return client;
    }
    /**
     * helper method to generate element objects from results, so that we can call, e.g.
     *
     * ```
     * const elem = $('#elem')
     * elem.getHTML()
     * ```
     *
     * or in case multiremote is used
     *
     * ```
     * const elems = $$('div')
     * elems[0].getHTML()
     * ```
     */
    static elementWrapper(instances, result, propertiesObject, scope) {
        const prototype = { ...propertiesObject, ...clone(getPrototype('element')), scope: { value: 'element' } };
        const element = webdriverMonad({}, (client) => {
            /**
             * attach instances to wrapper client
             */
            for (const [i, identifier] of Object.entries(Object.keys(instances))) {
                // @ts-expect-error ToDo(Christian): deprecate
                client[identifier] = result[i];
            }
            client.instances = Object.keys(instances);
            client.isMultiremote = true;
            client.selector = result[0] ? result[0].selector : null;
            // @ts-expect-error ToDo(Christian): remove eventually
            delete client.sessionId;
            return client;
        }, prototype);
        // @ts-ignore
        return element(this.sessionId, multiremoteHandler(scope.commandWrapper.bind(scope)));
    }
    /**
     * handle commands for multiremote instances
     */
    commandWrapper(commandName) {
        const instances = this.instances;
        const self = this;
        if (commandName === 'getInstance') {
            return function (browserName) {
                if (!this[browserName]) {
                    throw new Error(`Multiremote object has no instance named "${browserName}"`);
                }
                return this[browserName];
            };
        }
        return wrapCommand(commandName, async function (...args) {
            const mElem = this;
            const scope = this.selector
                ? Object.entries(mElem.instances.reduce((ins, instanceName) => (
                // @ts-expect-error ToDo(Christian): deprecate
                { ...ins, [instanceName]: mElem[instanceName] }), {}))
                : Object.entries(instances);
            const result = await Promise.all(scope.map(([, instance]) => instance[commandName](...args)));
            /**
             * return element object to call commands directly
             */
            if (commandName === '$') {
                const elem = MultiRemote.elementWrapper(instances, result, this.__propertiesObject__, self);
                return elem;
            }
            else if (commandName === '$$') {
                const zippedResult = zip(...result);
                return zippedResult.map((singleResult) => MultiRemote.elementWrapper(instances, singleResult, this.__propertiesObject__, self));
            }
            return result;
        });
    }
}
/**
 * event listener class that propagates events to sub drivers
 */
/* istanbul ignore next */
export class MultiRemoteDriver {
    instances;
    isMultiremote = true;
    __propertiesObject__;
    constructor(instances, propertiesObject) {
        this.instances = Object.keys(instances);
        this.__propertiesObject__ = propertiesObject;
    }
    on(eventName, emitter) {
        this.instances.forEach((instanceName) => this.getInstance(instanceName).on(eventName, emitter));
        return undefined;
    }
    once(eventName, emitter) {
        this.instances.forEach((instanceName) => this.getInstance(instanceName).once(eventName, emitter));
        return undefined;
    }
    emit(eventName, emitter) {
        return this.instances.map((instanceName) => this.getInstance(instanceName).emit(eventName, emitter)).some(Boolean);
    }
    eventNames() {
        return this.instances.map((instanceName) => this.getInstance(instanceName).eventNames()); // special behavior of event methods for multiremote
    }
    getMaxListeners() {
        return this.instances.map((instanceName) => this.getInstance(instanceName).getMaxListeners()); // special behavior of event methods for multiremote
    }
    listenerCount(eventName) {
        return this.instances.map((instanceName) => this.getInstance(instanceName).listenerCount(eventName)); // special behavior of event methods for multiremote
    }
    listeners(eventName) {
        return this.instances.map((instanceName) => this.getInstance(instanceName).listeners(eventName)).reduce((prev, cur) => {
            prev.concat(cur);
            return prev;
        }, []);
    }
    removeListener(eventName, emitter) {
        this.instances.forEach((instanceName) => this.getInstance(instanceName).removeListener(eventName, emitter));
        return undefined;
    }
    removeAllListeners(eventName) {
        this.instances.forEach((instanceName) => this.getInstance(instanceName).removeAllListeners(eventName));
        return undefined;
    }
}
