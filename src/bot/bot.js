import BotClient from './client/bot_client';
import nconf from 'nconf';

/**
 * Creates bot.
 *
 * @class
 */
export default class Bot {
    /**
     * @constructs
     *
     * @param {string} token
     * @param {Logger} logger
     */
    constructor(token, logger) {
        if(!token) {
            throw 'Token is undefined';
        }

        /**
         * @member {BotClient}
         */
        this.client = new BotClient(token, logger);

        /**
         * @member {Logger}
         */
        this.logger = logger;
    }

    /**
     * @method
     *
     * @returns {Promise}
     */
    async start() {
        await this.client.start();

        this.logger.level = 'debug';
        this.logger.debug(this.client.profile);
    }
}
