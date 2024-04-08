import { KeyAction, PointerAction, WheelAction } from '../../utils/actions/index.js';
export function action(type, opts) {
    if (type === 'key') {
        return new KeyAction(this, opts);
    }
    if (type === 'pointer') {
        return new PointerAction(this, opts);
    }
    if (type === 'wheel') {
        return new WheelAction(this, opts);
    }
    throw new Error(`Unsupported action type "${type}", supported are "key", "pointer", "wheel"`);
}
