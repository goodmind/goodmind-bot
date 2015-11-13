import Command from '../../lib/command';

/**
 * @class
 */
export default class UpdateDBCommand extends Command {
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
        let message = await this.message.sync();

        console.log(message, this.message);

        try {
            return JSON.stringify(message);
        } catch(e) {
            return e.message;
        }
    }
}
