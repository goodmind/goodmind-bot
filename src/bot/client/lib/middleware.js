import { EventEmitter } from 'events';

/**
 * @class
 */
export default class Middleware extends EventEmitter {
    /**
     * @constructs
     * @param {ConversationController} context
     */
    constructor(context) {
        super();

        /**
         * @member {ConversationController}
         */
        this.context = context;

        /**
         * @member {BotClient}
         */
        this.client = context._botClient;

        this.setMaxListeners(1000);

        this.on('message', this._thread);
    }

    /**
     * @method
     * @param message
     * @param next
     * @private
     */
    _thread(message, next) {
        console.log('threaded message', message);

        next();
    }
}