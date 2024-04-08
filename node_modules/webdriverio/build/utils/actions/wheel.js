import BaseAction from './base.js';
const DEFAULT_SCROLL_PARAMS = {
    x: 0,
    y: 0,
    deltaX: 0,
    deltaY: 0,
    duration: 0
};
export default class WheelAction extends BaseAction {
    constructor(instance, params) {
        super(instance, 'wheel', params);
    }
    /**
     * Scrolls a page to given coordinates or origin.
     */
    scroll(params) {
        this.sequence.push({ type: 'scroll', ...DEFAULT_SCROLL_PARAMS, ...params });
        return this;
    }
}
