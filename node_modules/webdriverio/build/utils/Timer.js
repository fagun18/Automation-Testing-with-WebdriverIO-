const TIMEOUT_ERROR = 'timeout';
const NOOP = () => { };
/**
 * Promise-based Timer. Execute fn every tick.
 * When fn is resolved — timer will stop
 * @param {number} delay - delay between ticks
 * @param {number} timeout - after that time timer will stop
 * @param {Function} fn - function that returns promise. will execute every tick
 * @param {boolean} leading - should be function invoked on start
 * @return {promise} Promise-based Timer.
 */
class Timer {
    _delay;
    _timeout;
    _fn;
    _leading;
    _conditionExecutedCnt = 0;
    _resolve = NOOP;
    _reject = NOOP;
    _startTime;
    _ticks = 0;
    _timeoutId;
    _mainTimeoutId;
    _lastError;
    constructor(_delay, _timeout, _fn, _leading = false) {
        this._delay = _delay;
        this._timeout = _timeout;
        this._fn = _fn;
        this._leading = _leading;
        const retPromise = new Promise((resolve, reject) => {
            this._resolve = resolve;
            this._reject = reject;
        });
        this._start();
        return retPromise;
    }
    _start() {
        this._startTime = Date.now();
        if (this._leading) {
            this._tick();
        }
        else {
            this._timeoutId = setTimeout(this._tick.bind(this), this._delay);
        }
        this._mainTimeoutId = setTimeout(() => {
            /**
             * make sure that condition was executed at least once
             */
            if (!this._wasConditionExecuted()) {
                return;
            }
            const reason = this._lastError || new Error(TIMEOUT_ERROR);
            this._reject(reason);
            this._stop();
        }, this._timeout);
    }
    _stop() {
        if (this._timeoutId) {
            clearTimeout(this._timeoutId);
        }
        delete this._timeoutId;
    }
    _stopMain() {
        if (this._mainTimeoutId) {
            clearTimeout(this._mainTimeoutId);
        }
    }
    _tick() {
        const result = this._fn();
        if (typeof result.then !== 'function') {
            if (!result) {
                return this._checkCondition(new Error(TIMEOUT_ERROR));
            }
            return this._checkCondition(undefined, result);
        }
        result.then((res) => this._checkCondition(undefined, res), (err) => this._checkCondition(err));
    }
    _checkCondition(err, res) {
        ++this._conditionExecutedCnt;
        this._lastError = err;
        // resolve timer only on truthy values
        if (res) {
            this._resolve(res);
            this._stop();
            this._stopMain();
            return;
        }
        // autocorrect timer
        const diff = (Date.now() - (this._startTime || 0)) - (this._ticks++ * this._delay);
        const delay = Math.max(0, this._delay - diff);
        // clear old timeoutID
        this._stop();
        // check if we have time to one more tick
        if (this._hasTime(delay)) {
            this._timeoutId = setTimeout(this._tick.bind(this), delay);
        }
        else {
            this._stopMain();
            const reason = this._lastError || new Error(TIMEOUT_ERROR);
            this._reject(reason);
        }
    }
    _hasTime(delay) {
        return (Date.now() - (this._startTime || 0) + delay) <= this._timeout;
    }
    _wasConditionExecuted() {
        return this._conditionExecutedCnt > 0;
    }
}
export default Timer;
