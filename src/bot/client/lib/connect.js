import merge from 'utils-merge';
import Middleware from './middleware';

var proto = {};
var defer = typeof setImmediate === 'function'
    ? setImmediate
    : function(fn){ process.nextTick(fn.bind.apply(fn, arguments)) };

/**
 * @param value
 * @returns {*}
 */
proto.use = function use(value) {
    if (Middleware === Object.getPrototypeOf(value)) {
        return this.stack.add(new value(this.context));
    }

    return this.stack.add(value);
};

/**
 * @param message
 * @private
 */
proto._handle = function _handle(message) {
    var stack = this.stack;
    var finalHandler = this.finalHandler;

    var iterator = stack.values();

    function next() {
        var layer = iterator.next();

        if (layer.done) {
            return defer(finalHandler, message);
        }

        layer.value.emit('message', message, next);
    }

    next();
};

/**
 * @param {ConversationController} context
 * @param finalHandler
 * @returns {app}
 */
export default function connect(context, finalHandler) {
    /**
     * @class app
     * @param message
     */
    function app(message) {
        app._handle(message);
    }

    merge(app, proto);

    /**
     * @type {Set}
     * @memberof app
     */
    app.stack = new Set();

    /**
     * @type {ConversationController}
     * @memberof app
     */
    app.context = context;

    /**
     * @memberof app
     */
    app.finalHandler = finalHandler;

    return app;
}

