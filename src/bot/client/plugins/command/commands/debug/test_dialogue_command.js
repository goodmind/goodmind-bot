import Command from '../../lib/command';

/**
 * @class
 */
export default class TestDialogueCommand extends Command {
    /**
     * @static
     */
    static validateArgs = [
        {
            name: 'Number',
            question: 'Enter number from 1..3: ',
            reply_markup: {
                keyboard: [
                    ['1'], ['2'], ['3']
                ],
                selective: true
            }
        },
        {
            name: 'Number',
            question: 'Enter number from 4..6: ',
            reply_markup: {
                keyboard: [
                    ['4'], ['5'], ['6']
                ],
                selective: true
            }
        },
        {
            name: 'Number',
            question: 'Enter number from 7..9: ',
            reply_markup: {
                keyboard: [
                    ['7'], ['8'], ['9']
                ],
                selective: true
            }
        }
    ];

    /**
     * @static
     */
    static accessControl = {
        'start': ['any']
    };

    /**
     * @method
     */
    start() {
        this.dialogue.on('message', (message) => {
            this.dialogue.reply(`Your text: ${message.text}
Your args: ${this.args.join(', ')}`);
        });

        this.compensator.on('message', () => {
            this.dialogue.reply('шо за хуйня.', {
                reply_markup: {
                    hide_keyboard: true
                }
            });
        });
    }
}