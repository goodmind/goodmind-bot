import { VM } from 'vm2';
import _ from 'lodash';

import Command from '../../lib/command';

/**
 * @class
 */
export default class JsCommand extends Command {
    /**
     * @static
     */
    static validateArgs = [
        {
            name: 'Code',
            question: 'Enter code: '
        }
    ];

    /**
     * @static
     */
    static accessControl = {
        'start': ['admin']
    };

    /**
     * @method
     */
    start() {
        var sandbox = new VM({
            timeout: 1000,
            sandbox: {
                message: _.clone(this.message, true)
            }
        });

        var code = this.args.join(' ');

        try {
            this.dialogue.reply(sandbox.run(code).toString());
        } catch(e) {
            this.dialogue.reply(e.message);
        }
    }
}
