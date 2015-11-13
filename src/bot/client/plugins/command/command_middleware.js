import _ from 'lodash';
import { EventEmitter } from 'events';

import TestDialogueCommand from './commands/debug/test_dialogue_command';
import UpdateDBCommand from './commands/debug/update_db_command';
import StatusCommand from './commands/core/status_command';
import StartCommand from './commands/core/start_command';
import QuoteCommand from './commands/core/quote_command';
import PingCommand from './commands/core/ping_command';
import HelpCommand from './commands/core/help_command';
import WipeCommand from './commands/extra/wipe_command';
import CalcCommand from './commands/core/calc_command';
import InfoCommand from './commands/core/info_command';
import JsCommand from './commands/core/js_command';

import CommandDialogueController from './lib/controllers/command_dialogue_controller';
import { CommandNotFoundError } from './lib/utils/errors';

import Middleware from './../../lib/middleware';
import GroupChat from '../../lib/models/group_chat';
import User from '../../lib/models/user';

import * as util from './lib/utils/util';

/**
 * @class
 */
export default class CommandMiddleware extends Middleware {
    /**
     * @constructs
     * @param {ConversationController} context
     */
    constructor(context) {
        super(context);

        /**
         * @member {string}
         */
        this.event = 'command';
    }

    /**
     * @method
     * @param message
     * @param next
     * @private
     */
    async _thread(message, next) {
        if (util.isCancel(message)) {
            return;
        }

        if (util.isCommand(message)) {
            let dialogue = new CommandDialogueController(this.context, message);
            let compensator = new EventEmitter();

            let [args, commandName] = util.splitCommand(message.text);

            dialogue.on('cancel', function(newMessage) {
                dialogue = null;

                console.log(`Command ${commandName} was cancelled.`);
                compensator.emit('message', newMessage);
            });

            try {
                let answer = await this._handleCommand(commandName, dialogue, compensator, args);

                await dialogue.reply(answer);
                dialogue.emit(this.event, null, message);
            } catch(e) {
                dialogue.emit(this.event, e, message);
            } finally {
                console.timeEnd('commandExecution');
            }
        }

        next();
    }

    async _handleCommand(name, dialogue, compensator, args) {
        var message = dialogue.messages[0];

        if (message.reply_to_message && message.reply_to_message.text) {
            args[0] = name;
            args[1] = message.reply_to_message.text;
        }

        function registerResponseFor(constructor, fakeArgs) {
            return util.registerResponseFor(dialogue, constructor, compensator, fakeArgs)
        }

        switch(name) {
            case '/test_dialogue':
                return registerResponseFor(TestDialogueCommand, args);

            case '/update_db':
                return registerResponseFor(UpdateDBCommand, args);

            case '/status':
                return registerResponseFor(StatusCommand, args);

            case '/start':
                return registerResponseFor(StartCommand, args);

            case '/quote':
                return registerResponseFor(QuoteCommand, args);

            case '/ping':
                return registerResponseFor(PingCommand, args);

            case '/help':
                return registerResponseFor(HelpCommand, args);

            case '/wipe':
                return registerResponseFor(WipeCommand, args);

            case '/calc':
                return registerResponseFor(CalcCommand, args);

            case '/info':
                return registerResponseFor(InfoCommand, args);

            case '/js':
                return registerResponseFor(JsCommand, args);

            default:
                this.client.logger.level = 'debug';
                this.client.logger.debug(`Command ${name} not found`);

                throw new CommandNotFoundError;
        }
    }
}
