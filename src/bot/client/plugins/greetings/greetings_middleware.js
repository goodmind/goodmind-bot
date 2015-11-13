import Middleware from './../../lib/middleware';

/**
 * @class
 */
export default class GreetingsMiddleware extends Middleware {
    /**
     * @method
     * @param message
     * @param next
     * @returns {Promise}
     * @private
     */
    async _thread(message, next) {
        if (this.context.chat.id === -38157152) {
            return next();
        }

        let bot = this.client.profile;
        let user = message.new_chat_participant || message.left_chat_participant;

        if (message.new_chat_participant) {
            if (bot.id === user.id) {
                await this.context.broadcast('Хули я тут делаю?');
                return;
            }

            await this.context.broadcast('Ооо полинчик вернулся');
            await this.context.broadcast('и тебе добрый вечер');
        }

        if (message.left_chat_participant) {
            await this.context.broadcast('ну и иди нахуй!');
        }

        next();
    }
}
