import Command from '../../lib/command';

import _ from 'lodash';

/**
 * @class
 */
export default class WipeCommand extends Command {
    /**
     * @static
     */
    static validateArgs = [
        {
            name: 'Number',
            question: 'Enter number: '
        },

        {
            name: 'Username',
            question: 'Enter username: '
        }
    ];

    /**
     * @static
     */
    static accessControl = {
        'start': ['any'],
        'stop': ['admin']
    };

    /**
     * @method
     */
    start() {
        let that = this;

        if(_.isUndefined(this.args[1])) {
            /**
             * @member {Array}
             */
            this.args = this.args[0].split(' ');

            console.log(this.args);
        }

        /**
         * @member {object}
         */
        this.command = {
            breakLoop: false,
            timeout: 200,
            reply: true,

            wipeId: that.user.id,
            wipeEnded: false,
            wipeLimit: 666
        };

        this.command.answers = [
            'Кекс чтоли от слова',
            'с подли... какой подливой',
            'аллах? эт кто?))',
            'тралить? эт че такое',
            'траллировать слово такое где взял',
            'а в телеграме што одни двачи седят',
            'и нах мне быть дваче',
            'прям тян-тян',
            'опа-на нихрена пошли животные',
            'вы че... я такой не буду говорить меня не поймут...',
            'кек чо хотел написать кекс?',
            'ты если такие слова пишешь пиши расшифровку чтоб мне было понятно',
            'полинчик вернулся',
            'и тебе добрый вечер',
            'Хех мда',
            'Ыыы',
            'KDE, конпеляция, ленакс',
            'Лал кок сес лол пок',
            'Кек лол сас лол лал',
            'pls',
            'rip',
            'hi',
            'pAZZO',
            '!цитата 5',
            '!echo кок пок',
            'хахахаахахахахахахахах',
            'такс такс такс',
            'што тут у нас',
            'мемы мемы мемыы',
            'хахах',
            'наканецта'
        ];

        this.compensator.on('message', this.cancel);

        this.dialogue.on('message', (message) => {
            if (this.command.reply) {
                let answer = this.command.answers[_.random(0, this.command.answers.length - 1)];

                this.dialogue.reply(answer, {
                    reply_to_message_id: message.message_id
                });

                return false;
            }
        });

        this.startWipe();
    }

    /**
     * @method
     * @returns {Promise}
     */
    async startWipe() {
        this.dialogue._botClient.preventLogging = true;
        var times = parseInt(this.args[0], 10);

        if (times <= this.command.wipeLimit) {
            await this.dialogue.reply('Начинаю вайп...');

            for (let i = 1, ln = times; i <= ln; i++) setTimeout((i, times) => {
                if (this.command.breakLoop) return;

                let answer = this.command.answers[_.random(0, this.command.answers.length - 1)];

                this.dialogue.broadcast(
                    (this.args[1] ?
                        (_.startsWith(this.args[1], '@') ?
                            `${this.args[1]} ` :
                            `@${this.args[1]} `) :
                        ''
                    ) + answer);

                if (i === times) {
                    setTimeout(() => this.stopWipe(this.message.message_id), 1000);
                }
            }, i * this.command.timeout, i, times);
        } else if (Number.isNaN(times)) {
            this.dialogue.reply('Not a number');
        } else {
            this.dialogue.reply('Too much number');
        }
    }

    /**
     * @method
     * @param {number} id
     * @returns {Promise}
     */
    async stopWipe(id) {
        this.command.reply = false;

        this.dialogue._botClient.preventLogging = false;

        await this.dialogue.reply('Останавливаю вайп...');
        return this.dialogue.reply('Вайп окончен');
    }

    /**
     * @method
     * @param message
     * @returns {boolean}
     */
    cancel(message) {
        if (!this.command.breakLoop) {
            this.command.breakLoop = this.accessController.hasAccess('stop') || this.command.wipeId === message.from.id;

            if (this.command.breakLoop) {
                this.stopWipe(message.message_id);
            }

            return false;
        }
    }
}
