import User from './user';
import GroupChat from './group_chat';

/**
 * @class
 */
export default class Message {
    /**
     * @constructs
     * @param message
     */
    constructor(message) {
        Object.assign(this, message);

        this._raw = message;

        if (message.reply_to_message) {
            /**
             * @member {Message}
             */
            this.reply_to_message = new Message(message.reply_to_message);
        }

        /**
         * @member {GroupChat}
         */
        this.chat = new GroupChat(message.chat);

        /**
         * @member {User}
         */
        this.from = new User(message.from);
    }

    /**
     * @method
     * @returns {Promise.<Message>}
     */
    async sync() {
        if (this.reply_to_message) {
            this.reply_to_message = await this.reply_to_message.sync();
        }

        this.chat = await this.chat.sync();
        this.from = await this.from.sync();

        return this;
    }
}