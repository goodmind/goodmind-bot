import Middleware from './../../lib/middleware';

/**
 * @class
 */
export default class LogMiddleware extends Middleware {
    /**
     * @constructs
     * @param {ConversationController} context
     */
    constructor(context) {
        super(context);

        /**
         * @member {string}
         */
        this.event = 'log';
    }

    /**
     * @method
     * @param message
     * @param next
     * @private
     */
    async _thread(message, next) {
        this.client.logger.level = 'message';

        if (!this.client.preventLogging) {
            this.client.emit(`${this.event} message`, message._raw.chat, message._raw);
        }

        next();
    }
}
