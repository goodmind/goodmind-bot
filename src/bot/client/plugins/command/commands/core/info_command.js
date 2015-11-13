import _ from 'lodash';
import emoji from 'node-emoji';

import GroupChat from '../../../../lib/models/group_chat';
import Command from '../../lib/command';
import misc from '../../../../../../lib/utils/misc';

/**
 * @class
 */
export default class InfoCommand extends Command {
    /**
     * @static
     */
    static accessControl = {
        'start': ['any'],
        'sessions': ['admin']
    };

    /**
     * @method
     * @returns {Promise.<string>}
     */
    async start() {
        /**
         * @param peers
         * @returns {Function}
         * @private
         */
        function _peers(peers) {
            let keys = Object.keys(peers);

            return (result, peer, peerId) => {
                result += `\n${_.last(keys) === peerId ? '└──' : '├──'} ${emoji.get(':bust_in_silhouette:')} #${peerId}: ${misc.fullName(peer.from)} ${misc.username(peer.from)}`;

                return result;
            }
        }

        /**
         * @param sessions
         * @returns {Function}
         * @private
         */
        function _sessions(sessions) {
            return (result, synchronizedSession) => {
                let chat = sessions[synchronizedSession.id];
                let chatId = synchronizedSession.id;
                let peers = _.reduce(chat.peers, _peers(chat.peers), '');

                result += `┌${emoji.get(':bust' + (chat.peers[chatId] ? '' : 's') + '_in_silhouette:')} #${chatId} ${misc.chat(synchronizedSession)}${chat.peers[chatId] ? '' : `: ${peers}`}\n\n`;

                return result;
            }
        }

        if (this.accessController.hasAccess('sessions')) {
            let sessions = this.context._botClient._sessions;
            let synchronizedSessions = await Promise.all(_.map(sessions, function(val, key) {
                return GroupChat.model.get(parseInt(key, 10));
            }));

            let result = _.reduce(synchronizedSessions, _sessions(sessions), '');

            await this.dialogue.reply(`Sessions:\n${result}`);
        }

        return `
${this.context.chat.title ? `Chat ID: ${this.context.chat.id}
Chat name: ${this.context.chat.title}` : ''}
Your name: ${misc.fullName(this.user)}
Your username: ${misc.username(this.user)}
Your ID: ${this.user.id}
Your role: ${this.user.role}
        `;
    }
}
