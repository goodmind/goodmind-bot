import nconf from 'nconf';

import { attr, belongsTo, model, type } from './model';

import GroupChat from './group_chat';
import User from './user';

/**
 * @class
 */
@belongsTo(GroupChat.model, 'chat', 'groupChatId', 'id')
@model
@attr('id', type.string().default(function() {
    return `${this.userId}_${this.groupChatId}`;
}), true)
@attr('groupChatId', Number)
@attr('userId', Number)
export default class Conversation {
    /**
     * @static
     * @type {string}
     * @private
     */
    static _tableName = 'Conversation';

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
}
