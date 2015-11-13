import nconf from 'nconf';

import TelegramAdapter from './lib/adapters/telegram_adapter';
import UpdatesClient from './updates_client';
import UpdatesServer from '../server/updates_server';

import Message from './lib/models/message';

import GroupChatController from './lib/controllers/group_chat_controller';
import ConversationController from './lib/controllers/conversation_controller';

/**
 * @class
 */
export default class BotClient extends TelegramAdapter {
    /**
     * @constructs
     *
     * @param {string} token
     * @param {Logger} logger
     */
    constructor(token, logger) {
        super(token);

        /**
         * @member {boolean}
         */
        this.isWebhook = false;

        /**
         * @member {boolean}
         */
        this.preventLogging = false;

        /**
         * @member {Object.<number, GroupChatController>}
         * @private
         */
        this._sessions = {};

        /**
         * @member {Logger}
         */
        this.logger = logger;

        /**
         * @member {{id: number, first_name: string, username: string}}
         */
        this.profile = {
            id: 0,
            first_name: '',
            username: ''
        };

        /**
         * @member {number}
         */
        this.uptime = (Date.now() / 1000);

        this.setMaxListeners(1000);
    }

    /**
     * @method
     *
     * @param update
     *
     * @returns {Promise}
     * @private
     */
    async _messageParse(update) {
        var from = update.message.from;
        var chat = update.message.chat;

        var synchoronizedMessage = new Message(update.message);

        if (chat.id in this._sessions) {
            if (from.id in this._sessions[chat.id].getPeers()) {
                this._sessions[chat.id]
                    .getPeerById(from.id)
                    .emit('message', synchoronizedMessage);
            } else {
                let conversation = new ConversationController(chat, from, this);

                this._sessions[chat.id]
                    .addPeer(conversation)
                    .emit('message', synchoronizedMessage);
            }
        } else {
            this._sessions[chat.id] = new GroupChatController(chat, this);
            this._messageParse(update);
        }
    }

    /**
     * @method
     *
     * @returns {Promise}
     */
    async start() {
        let updates;
        this.profile = (await this.getMe()).result;

        if (this.isWebhook) {
            updates = new UpdatesServer(this);
        } else {
            updates = new UpdatesClient(this);
        }

        updates.on('update', ::this._messageParse);
    }

    /**
     * @method
     *
     * @returns {Promise}
     */
    deleteWebhook() {
        this.logger.level = 'debug';
        this.logger.debug('deleting webhook...');

        return super.setWebhook('').then(() => {
            process.exit(0);
        });
    }

    /**
     * @method
     *
     * @param url
     * @returns {Promise}
     */
    setWebhook(url) {
        process.on('SIGINT', ::this.deleteWebhook);
        process.on('SIGTERM', ::this.deleteWebhook);
        process.on('exit', ::this.deleteWebhook);

        this.isWebhook = true;
        this.logger.level = 'debug';
        this.logger.debug('attaching webhook...');

        return super.setWebhook(url)
            .catch((err) => {
                console.log('error', err);
                this.logger.level = 'error';
                this.logger.error(err.description);
            })
            .then((res) => {
                console.log('debug', res);
                this.logger.level = 'debug';
                this.logger.debug(res.description, url);
            });
    }

    /**
     * @method
     *
     * @param first
     * @param text
     * @param disable_web_page_preview
     * @param reply_to_message_id
     * @param reply_markup
     *
     * @returns {Promise}
     */
    sendMessage(first,
                text,
                disable_web_page_preview,
                reply_to_message_id,
                reply_markup) {
        return super.sendMessage(first, text, disable_web_page_preview, reply_to_message_id, reply_markup)
            .then((update) => {
                if (!this.preventLogging) {
                    this.logger.level = 'sentMessage';
                    this.logger.sentMessage(null, update.result);
                }
            })
            .catch((e) => console.log('error', e));
    }
}
