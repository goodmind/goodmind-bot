import request from 'request';
import TelegramAdapter from './bot/client/lib/adapters/telegram_adapter';

var client = new TelegramAdapter('101007265:AAHRSQH7y-YLs94fLkS-2TuxtlTKd80D4mk');

/**
 * Manually pulling from server and sends request to webhook.
 * @class
 */
class Updater {
    /**
     * @static
     *
     * @type {boolean}
     * @private
     */
    static _polling = false;

    /**
     * @static
     *
     * @type {number}
     * @private
     */
    static _offset = 0;

    /**
     * @method
     * @static
     *
     * @private
     * @returns {Promise}
     */
    static async _poll() {
        var body = await client.getUpdates({
            offset: Updater._offset,
            timeout: 60
        });

        if (body.ok) {
            let updates = body.result;

            updates.forEach((update) => {
                if (update.update_id >= Updater._offset) {
                    Updater._offset = update.update_id + 1;

                    request.post({
                        url: 'http://localhost:3000/updates',
                        json: true,
                        body: update
                    }, (err, res, body) => {
                        if (err) console.error(err);
                        console.log('update', body);
                    });
                }
            });
        }

        if (Updater._polling) {
            Updater._poll();
        }
    }

    /**
     * @method
     * @static
     */
    static start() {
        Updater._poll();
        Updater._polling = true;
    }
}

Updater.start();