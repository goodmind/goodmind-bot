import _ from 'lodash';
import uuid from 'node-uuid';
import { EventEmitter } from 'events';

/**
 * @class
 */
export default class DialogueController extends EventEmitter {
    /**
     * @constructs
     * @param {ConversationController} context
     * @param message
     */
    constructor(context, message) {
        super();

        this.uuid = uuid.v1();

        /**
         * @member {ConversationController}
         */
        this.context = context;

        /**
         * @member {Array}
         */
        this.messages = [message];

        /**
         * @member {BotClient}
         * @private
         */
        this._botClient = context._botClient;

        this.setMaxListeners(1000);
        this._start();
    }

    /**
     * @method
     * @param text
     * @param additional
     * @returns {*|Promise}
     */
    reply(text, additional) {
        return this.context.reply(text, additional, this.messages);
    }

    /**
     * @method
     * @param text
     * @param additional
     * @returns {*|Promise}
     */
    broadcast(text, additional) {
        return this.context.broadcast(text, additional);
    }

    /**
     * @method
     * @param question
     * @param replyMarkup
     * @returns {Promise}
     */
    ask(question, replyMarkup) {
        return new Promise((resolve, reject) => {
            this.once('message', (message) => {
                resolve(message);
            });

            return this._botClient.sendMessage({
                chat_id: this.context.chat.id,
                text: question,
                reply_to_message_id: this.messages[0].message_id,
                reply_markup: _.isUndefined(replyMarkup) ? {
                    force_reply: true,
                    selective: true
                } : replyMarkup
            });
        });
    }

    /**
     * @method
     * @private
     */
    _start() {
        this.context.on('message', (message) => {
            this.messages.push(message);
            this.emit('message', message);
        });
    }

    /**
     * Remove all listeners.
     * @method
     */
    stop() {
        this.removeAllListeners();
    }
}
