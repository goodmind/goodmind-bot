import math from 'mathjs';

import Command from '../../lib/command';

/**
 * @class
 */
export default class CalcCommand extends Command {
    /**
     * @static
     */
    static validateArgs = [
        {
            name: 'Expression',
            question: 'Enter expression: '
        }
    ];

    /**
     * @method
     */
    start() {
        let expr = this.args.join(' ');

        try {
            let result = math.format(math.eval(expr), {
                precision: 14
            }).toString();

            this.dialogue.reply(result);
        } catch(e) {
            this.dialogue.reply(e.message);
        }
    }
}
