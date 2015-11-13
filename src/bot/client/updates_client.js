import { EventEmitter } from 'events';
import _ from 'lodash';

import BotClient from './bot_client';

/**
 * @class
 */
export default class UpdatesClient extends EventEmitter {
    /**
     * @constructs
     * @param {BotClient} botClient
     */
    constructor(botClient) {
        super();

        /**
         * @member {BotClient}
         * @private
         */
        this._botClient = botClient;

        /**
         * @member {boolean}
         * @private
         */
        this._polling = false;

        /**
         * @member {number}
         * @private
         */
        this._offset = 0;

        this.setMaxListeners(1000);
        this._start();
    }

    /**
     * @method
     *
     * @returns {Promise}
     * @private
     */
    async _poll() {
        var body = await this._botClient.getUpdates({
            offset: this._offset,
            limit: 100,
            timeout: 60
        });

        if (body.ok) {
            let updates = body.result;

            updates.forEach((update) => {
                if (update.update_id >= this._offset) {
                    this._offset = update.update_id + 1;

                    if (update.message.date >= this._botClient.uptime) {
                        this.emit('update', update);
                    }
                }
            });
        }

        if (this._polling) {
            this._poll();
        }
    }

    /**
     * @method
     *
     * @returns {UpdatesClient}
     * @private
     */
    _start() {
        this._poll();
        this._polling = true;

        return this;
    }
}