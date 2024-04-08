import BaseAction from './base.js';
const ORIGIN_DEFAULT = 'viewport';
const BUTTON_DEFAULT = 0;
const POINTER_TYPE_DEFAULT = 'mouse';
const UP_PARAM_DEFAULTS = {
    button: BUTTON_DEFAULT
};
const PARAM_DEFAULTS = {
    ...UP_PARAM_DEFAULTS,
    width: 0,
    height: 0,
    pressure: 0,
    tangentialPressure: 0,
    tiltX: 0,
    tiltY: 0,
    twist: 0,
    altitudeAngle: 0,
    azimuthAngle: 0
};
const MOVE_PARAM_DEFAULTS = {
    x: 0,
    y: 0,
    duration: 100,
    origin: ORIGIN_DEFAULT
};
export default class PointerAction extends BaseAction {
    constructor(instance, params = {}) {
        if (!params.parameters) {
            params.parameters = { pointerType: POINTER_TYPE_DEFAULT };
        }
        super(instance, 'pointer', params);
    }
    move(params = {}, y) {
        const seq = {
            type: 'pointerMove',
            // default params
            ...PARAM_DEFAULTS,
            ...UP_PARAM_DEFAULTS,
            ...MOVE_PARAM_DEFAULTS,
        };
        if (typeof params === 'number') {
            Object.assign(seq, { x: params, y });
        }
        else if (params) {
            Object.assign(seq, params);
        }
        this.sequence.push(seq);
        return this;
    }
    up(params = UP_PARAM_DEFAULTS) {
        this.sequence.push({
            type: 'pointerUp',
            button: typeof params === 'string'
                ? params === 'right' ? 2 : (params === 'middle' ? 1 : 0)
                : params.button
        });
        return this;
    }
    down(params = {}) {
        this.sequence.push({
            type: 'pointerDown',
            ...PARAM_DEFAULTS,
            ...(typeof params === 'string'
                ? { button: params === 'right' ? 2 : (params === 'middle' ? 1 : 0) }
                : params)
        });
        return this;
    }
    /**
     * An action that cancels this pointer's current input.
     */
    cancel() {
        this.sequence.push({ type: 'pointerCancel' });
        return this;
    }
}
