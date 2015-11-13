import nconf from 'nconf';

import configure from '../configure';

/**
 * Creates application
 * @class
 */
export default class Application {
    /**
     * @constructs
     *
     * @param BootLogger
     * @param Logger
     * @param Bot
     */
    constructor(BootLogger, Logger, Bot) {
        /**
         * @member {BootLogger}
         */
        this.bootLogger = new BootLogger;
        this.bootLogger.level = 'ok';

        /**
         * @member {Promise}
         */
        this.promise = configure(this.bootLogger)
            .then(() => {
                /**
                 * @member {Logger}
                 */
                this.logger = new Logger;
                return this.bootstrap(Bot);
            })
            .then(() => this.start());
    }

    /**
     * @method
     * @param Bot
     *
     * @returns {Promise}
     */
    async bootstrap(Bot) {
        /**
         * @member {string}
         */
        this.token = nconf.get('token');

        /**
         * @member {Bot}
         */
        this.bot = new Bot(this.token, this.logger);

        this.bot.client.on('error', ::this.errorHandler);
        this.bot.client.on('log message', ::this.logger.message);

        process.on('uncaughtException', ::this.errorHandler);
    }

    /**
     * @method
     *
     * @returns {Promise.<String>}
     */
    async start() {
        this.bootLogger.ok('Starting application...');

        if (process.env.PORT) {
            this.bot.client.setWebhook(`https://example.com/${this.bot.client.token}/updates`);
        }

        await this.bot.start();
        return 'Bot started';
    }

    /**
     * @method
     *
     * @param err
     */
    errorHandler(err) {
        this.bootLogger.level = 'failed';
        this.bootLogger.failed(err);
    }
}
