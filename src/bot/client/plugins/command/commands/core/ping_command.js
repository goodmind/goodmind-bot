import Command from '../../lib/command';

/**
 * @class
 */
export default class PingCommand extends Command {
    /**
     * @method
     * @returns {string}
     */
    start() {
        return 'Pong.';
    }
}
