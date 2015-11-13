import nconf from 'nconf';
import _ from 'lodash';
import { EventEmitter } from 'events';

import Middleware from '../middleware';
import connect from '../connect';

import GreetingsMiddleware from '../../plugins/greetings/greetings_middleware';
import CommandMiddleware from '../../plugins/command/command_middleware';
import LogMiddleware from '../../plugins/log/log_middleware';

import Conversation from '../models/conversation';

/**
 * @class
 */
export default class ConversationController extends EventEmitter {
    /**
     * @constructs
     *
     * @param chat
     * @param from
     * @param {BotClient} botClient
     */
    constructor(chat, from, botClient) {
        super();

        /**
         * @member {BotClient}
         * @private
         */
        this._botClient = botClient;

        /**
         * @member {object}
         * @private
         */
        this._middleware = connect(this, ::this._thread);

        /**
         * @member {Array}
         * @private
         */
        this._messages = [];

        /**
         * @member {object}
         */
        this.chat = chat;

        /**
         * @member {object}
         */
        this.from = from;

        this.setMaxListeners(1000);

        this._start();
    }

    /**
     * @method
     * @private
     */
    _start() {
        let app = this._middleware;

        app.use(CommandMiddleware);
        app.use(GreetingsMiddleware);
        app.use(LogMiddleware);

        this.on('message', app);
    }

    /**
     * @method
     *
     * @param message
     * @private
     */
    _thread(message) {
        this._messages.push(message);
    }

    /**
     * @method
     *
     * @param text
     * @param additional
     * @param messages
     * @returns {Promise}
     */
    reply(text, additional, messages = this._messages) {
        return this._botClient.sendMessage(Object.assign({
            chat_id: this.chat.id,
            text,
            reply_to_message_id: messages[0].message_id
        }, additional));
    }

    /**
     * @method
     *
     * @param text
     * @param additional
     * @returns {Promise}
     */
    broadcast(text, additional) {
        return this._botClient.sendMessage(Object.assign({
            chat_id: this.chat.id,
            text
        }, additional));
    }
}
