import _ from 'lodash';

import DialogueController from '../../../../lib/controllers/dialogue_controller';
import { CommandNotFoundError, CommandAccessDeniedError } from '../utils/errors';

import * as util from '../utils/util';
import * as o from 'util';

/**
 * @class
 */
export default class CommandDialogueController extends DialogueController {
    /**
     * @constructs
     * @param {ConversationController} context
     * @param message
     */
    constructor(context, message) {
        super(context, message);

        this.on('command', (err, message) => {
            if (err instanceof CommandNotFoundError) {
                return;
            }

            if (err instanceof CommandAccessDeniedError) {
                this.reply('Permission denied');

                return;
            }
        });

        this.setMaxListeners(1000);

        this._waitForCancel();
    }

    /**
     * @method
     * @private
     */
    _start() {
        this.context.on('message', (message) => {
            if (!util.isCommand(message)) {
                this.messages.push(message);
                this.emit('message', message);
            }
        });
    }

    /**
     * @method
     * @private
     */
    _waitForCancel() {
        this.context.on('message', (message) => {
            if (util.isCancel(message)) {
                this.cancel(message);

                return;
            }

            if (util.isCommand(message)) {
                this.cancel(message);
            }
        });
    }

    /**
     * @method
     * @param message
     */
    cancel(message) {
        this.emit('cancel', message);
        this.stop();
    }
}
