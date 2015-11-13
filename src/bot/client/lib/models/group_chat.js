import _ from 'lodash';

import { attr, model, type } from './model';
import misc from '../../../../lib/utils/misc';

/**
 * @class
 */
@model
@attr('id', type.number(), true)
@attr('title', type.string())
@attr('first_name', type.string().optional())
@attr('last_name', type.string().optional())
@attr('username', type.string().optional())
export default class GroupChat {
    /**
     * @static
     * @type {string}
     * @private
     */
    static _tableName = 'GroupChat';

    /**
     * @static
     * @type {Object}
     * @private
     */
    static _primary = {};

    /**
     * @static
     * @type {Object}
     * @private
     */
    static _attrs = {};

    /**
     * @static
     * @type {{flag: boolean, chats: {}}}
     * @private
     */
    static _unsync = {
        flag: false,
        chats: {}
    };

    /**
     * @constructs
     * @param chat
     */
    constructor(chat) {
        /**
         * @member
         */
        this._raw = chat;

        /**
         * @member {number}
         */
        this.id = chat.id;

        if (misc.isChat(chat)) {
            /**
             * @member {string}
             */
            this.title = chat.title;
        } else {
            /**
             * @member {string}
             */
            this.first_name = chat.first_name;

            /**
             * @member {string}
             */
            this.last_name = chat.last_name;

            /**
             * @member {string}
             */
            this.username = chat.username;
        }
    }

    /**
     * @method
     * @param value
     * @returns {boolean}
     */
    static set unsync(value) {
        GroupChat._unsync.flag = !!value;
        return true;
    }

    /**
     * @method
     * @returns {boolean}
     */
    static get unsync() {
        return GroupChat._unsync.flag;
    }

    /**
     * @method
     * @returns {Promise}
     */
    async sync() {
        var chat = _.omit(_.clone(this, true), _.isUndefined);
        var chatPromise = GroupChat.getOrUpdate(this.id, chat);
        var synchronizedChat;

        if (GroupChat.unsync) {
            if (GroupChat._unsync.chats[this.id]) {
                synchronizedChat = Object.assign(GroupChat._unsync.chats[this.id], {_unsynced: true});
            } else {
                synchronizedChat = chat;
            }
        } else {
            synchronizedChat = await chatPromise;
        }

        GroupChat._unsync.chats[this.id] = synchronizedChat;

        return GroupChat._unsync.chats[this.id];
    }
}
