import _ from 'lodash';
import os from 'os';

import Command from '../../lib/command';

/**
 * @class
 */
export default class StatusCommand extends Command {
    /**
     * @static
     */
    static accessControl = {
        'start': ['admin']
    };

    /**
     * @method
     * @returns {Promise.<string>}
     */
    async start() {
        var versions = _.reduce(process.versions, function(result, version, module) {
            result += `${module}: ${version}\n`;

            return result;
        }, '');

        await this.dialogue.reply(`Used MEM: ${ Math.floor((os.totalmem()-os.freemem()) / 1024 / 1024) }/${ Math.floor(os.totalmem() / 1024 / 1024) }MB`);
        return versions;
    }
}
