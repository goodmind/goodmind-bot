import { EventEmitter } from 'events';
import request from 'request';
import _ from 'lodash';
import fs from 'fs';

/**
 * @class
 */
export default class TelegramAdapter extends EventEmitter {
    /**
     * @constructs
     *
     * @param {string} token
     */
    constructor(token) {
        super();

        /**
         * @member {string}
         */
        this.token = token;

        /**
         * @member {string}
         */
        this.baseUrl = 'https://api.telegram.org/bot' + this.token;

        this.setMaxListeners(1000);
    }

    /**
     * @method
     *
     * @param method
     * @param data
     * @returns {Promise}
     * @private
     */
    _request(method,
             data) {
        return new Promise((resolve,
                            reject) => {
            var options = {
                url: `${this.baseUrl}/${method}`,
                json: true
            };

            data = _.omit(data, _.isUndefined);
            _.assign(options, (!_.isUndefined(_.find(data, value => value instanceof fs.ReadStream)) ? {
                formData: data
            } : {
                form: _.mapValues(data, (value) => {
                    return _.isPlainObject(value) ? JSON.stringify(value) : value.toString();
                })
            }));

            console.time('httpRequest');
            request.post(options, (err, response, body) => {
                if (err) {
                    reject(err);
                    this.emit('error', err);
                }

                if (!body.ok) {
                    reject(body);
                    this.emit('error', body);
                }

                resolve(body);
                this.emit('response', response);
                console.timeEnd('httpRequest');
            });
        });
    }

    /**
     * @method
     *
     * @param first
     * @param limit
     * @param timeout
     * @returns {Promise}
     */
    getUpdates(first,
               limit,
               timeout) {
        let options = _.isObject(first) ?
            first : {
            offset: first,
            limit: limit,
            timeout: timeout
        };
        return this._request('getUpdates', options);
    }

    /**
     * @method
     *
     * @param first
     * @returns {Promise}
     */
    setWebhook(first) {
        let options = _.isObject(first) ?
            first : {
                url: first
            };
        return this._request('setWebhook', options);
    }

    /**
     * @method
     *
     * @returns {Promise}
     */
    getMe() {
        return this._request('getMe');
    }

    /**
     * @method
     *
     * @param first
     * @param text
     * @param disable_web_page_preview
     * @param reply_to_message_id
     * @param reply_markup
     * @returns {Promise}
     */
    sendMessage(first,
                text,
                disable_web_page_preview,
                reply_to_message_id,
                reply_markup) {
        let options = _.isObject(first) ?
            first : {
            chat_id: first,
            text: text || 'null-guarded; Your method is sending empty text.',
            disable_web_page_preview: disable_web_page_preview,
            reply_to_message_id: reply_to_message_id,
            reply_markup: reply_markup
        };
        return this._request('sendMessage', options);
    }

    /**
     * @method
     *
     * @param first
     * @param from_chat_id
     * @param message_id
     * @returns {Promise}
     */
    forwardMessage(first,
                   from_chat_id,
                   message_id) {
        let options = _.isObject(first) ?
            first : {
            chat_id: first,
            from_chat_id: from_chat_id,
            message_id: message_id
        };
        return this._request('forwardMessage', options);
    }

    /**
     * @method
     *
     * @param first
     * @param photo
     * @param caption
     * @param reply_to_message_id
     * @param reply_markup
     * @returns {Promise}
     */
    sendPhoto(first,
              photo,
              caption,
              reply_to_message_id,
              reply_markup) {
        let options = _.isObject(first) ?
            first : {
            chat_id: first,
            photo: photo,
            caption: caption,
            reply_to_message_id: reply_to_message_id,
            reply_markup: reply_markup
        };
        return this._request('sendPhoto', options);
    }

    /**
     * @method
     *
     * @param first
     * @param audio
     * @param reply_to_message_id
     * @param reply_markup
     * @returns {Promise}
     */
    sendAudio(first,
              audio,
              reply_to_message_id,
              reply_markup) {
        let options = _.isObject(first) ?
            first : {
            chat_id: first,
            audio: audio,
            reply_to_message_id: reply_to_message_id,
            reply_markup: reply_markup
        };
        return this._request('sendAudio', options);
    }

    /**
     * @method
     *
     * @param first
     * @param document
     * @param reply_to_message_id
     * @param reply_markup
     * @returns {Promise}
     */
    sendDocument(first,
                 document,
                 reply_to_message_id,
                 reply_markup) {
        let options = _.isObject(first) ?
            first : {
            chat_id: first,
            document: document,
            reply_to_message_id: reply_to_message_id,
            reply_markup: reply_markup
        };
        return this._request('sendDocument', options);
    }

    /**
     * @method
     *
     * @param first
     * @param sticker
     * @param reply_to_message_id
     * @param reply_markup
     * @returns {Promise}
     */
    sendSticker(first,
                sticker,
                reply_to_message_id,
                reply_markup) {
        let options = _.isObject(first) ?
            first : {
            chat_id: first,
            sticker: sticker,
            reply_to_message_id: reply_to_message_id,
            reply_markup: reply_markup
        };
        return this._request('sendSticker', options);
    }

    /**
     * @method
     *
     * @param first
     * @param video
     * @param reply_to_message_id
     * @param reply_markup
     * @returns {Promise}
     */
    sendVideo(first,
              video,
              reply_to_message_id,
              reply_markup) {
        let options = _.isObject(first) ?
            first : {
            chat_id: first,
            video: video,
            reply_to_message_id: reply_to_message_id,
            reply_markup: reply_markup
        };
        return this._request('sendVideo', options);
    }

    /**
     * @method
     *
     * @param first
     * @param latitude
     * @param longitude
     * @param reply_to_message_id
     * @param reply_markup
     * @returns {Promise}
     */
    sendLocation(first,
                 latitude,
                 longitude,
                 reply_to_message_id,
                 reply_markup) {
        let options = _.isObject(first) ?
            first : {
            chat_id: first,
            longitude: longitude,
            latitude: latitude,
            reply_to_message_id: reply_to_message_id,
            reply_markup: reply_markup
        };
        return this._request('sendLocation', options);
    }

    /**
     * @method
     *
     * @param first
     * @param action
     * @returns {Promise}
     */
    sendChatAction(first,
                   action) {
        let options = _.isObject(first) ?
            first : {
            chat_id: first,
            action: action
        };
        return this._request('sendChatAction', options);
    }

    /**
     * @method
     *
     * @param first
     * @param offset
     * @param limit
     * @returns {Promise}
     */
    getUserProfilePhotos(first,
                         offset,
                         limit) {
        let options = _.isObject(first) ?
            first : {
            user_id: first,
            offset: offset,
            limit: limit
        };
        return this._request('getUserProfilePhotos', options);
    }
}
