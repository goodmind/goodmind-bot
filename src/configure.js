import nconf from 'nconf';
import path from 'path';

import User from './bot/client/lib/models/user';

nconf.argv().env();

/**
 * @function
 *
 * @param {BootLogger} logger
 */
export default async function configure(logger) {
    let env = nconf.get('NODE_ENV') || 'production';

    /**
     * @function
     *
     * @returns {Promise}
     */
    async function setup() {
        let configPath = path.join(__dirname, `../var/config/${env}.json`);
        let logPath = path.join(__dirname, '../var/log/messages/');

        nconf.argv().env().file({
            file: configPath
        });

        nconf.set('owner:id', null);
        nconf.set('log:path', logPath);

        //nconf.save(() => logger.ok('Configuration saved'));
        nconf.set('token', nconf.get(`${env.toUpperCase()}_TOKEN`));
        nconf.set('admins', await User.model.filter({admin: true}).run());
    }

    await setup();

    logger.ok('NODE_ENV: ' + env);
    logger.ok('TOKEN: ' + nconf.get('token'));
    logger.ok('Configuration setupped');
}
