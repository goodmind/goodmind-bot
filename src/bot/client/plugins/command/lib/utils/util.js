import _ from 'lodash';

import ArgumentManager from './../managers/argument_manager';
import AccessManager from './../managers/access_manager';

import misc from '../../../../../../lib/utils/misc';
import { CommandAccessDeniedError, CommandUnknownError } from './errors';

/**
 * @namespace util
 */

/**
 * @function
 * @memberof util
 *
 * @param source
 * @returns {*[]}
 * @private
 */
function _splitString(source) {
    let index = source.indexOf(' ');
    let s1 = '', s2 = '';

    if (index !== -1) {
        s1 = source.substring(0, source.indexOf(' ')).toLowerCase();
        s2 = source.substring(index + 1, source.length);
    }

    return [s1, s2];
}

/**
 * @function
 * @memberof util
 *
 * @param message
 * @returns {boolean}
 */
export function isCancel(message) {
    return _.startsWith(message.text, '/cancel');
}

/**
 * @function
 * @memberof util
 *
 * @param message
 * @returns {boolean}
 */
export function isCommand(message) {
    return _.startsWith(message.text, '/');
}

/**
 * @function
 * @memberof util
 *
 * @param text
 * @returns {*[]}
 */
export function splitCommand(text) {
    let args = _splitString(text);

    return [
        args,
        (args[0] || text).split('@')[0]
    ];
}

/**
 * @function
 * @memberof util
 *
 * @param {CommandDialogueController} dialogue
 * @param constructor
 * @param {EventEmitter} compensator
 * @param {Array} fakeArgs
 * @returns {Promise}
 */
export async function registerResponseFor(dialogue, constructor, compensator, fakeArgs) {
    let message = dialogue.messages[0];
    let accessControl = new AccessManager(constructor.accessControl, message.from);

    if (accessControl.hasAccess('start')) {
        let args = await new ArgumentManager(constructor.validateArgs, fakeArgs, dialogue);
        let commandInstance = Reflect.construct(constructor, [
            dialogue,
            compensator,
            args,
            accessControl
        ]);

        console.time('commandExecution');
        let result = misc.isMethodExists(constructor, 'start') && await commandInstance.start();

        if(_.isEmpty(result)) {
            throw new CommandUnknownError;
        }

        return result;
    } else {
        throw new CommandAccessDeniedError;
    }
}
