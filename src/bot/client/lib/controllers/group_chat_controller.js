import misc from '../../../../lib/utils/misc';

import GroupChat from '../models/group_chat';

/**
 * @class
 */
export default class GroupChatController {
    /**
     * @constructs
     * @param chat
     * @param {BotClient} botClient
     */
    constructor(chat, botClient) {
        /**
         * @member {BotClient}
         * @private
         */
        this._botClient = botClient;

        /**
         * @member {Object}
         */
        this.peers = {};

        /**
         * @member {number}
         */
        this.id = chat.id;
    }

    /**
     * @method
     * @returns {Object}
     */
    getPeers() {
        return this.peers;
    }

    /**
     * @method
     * @param id
     * @returns {*}
     */
    getPeerById(id) {
        if (id > 0) {
            return this.peers[id];
        }
    }

    /**
     * @method
     * @param peer
     * @returns {*}
     */
    addPeer(peer) {
        if (misc.isUser(peer.from)) {
            this.peers[peer.from.id] = peer;

            return peer;
        }
    }
}
