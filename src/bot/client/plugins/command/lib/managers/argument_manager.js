import _ from 'lodash';

/**
 * @class
 */
export default class ArgumentManager {
    /**
     * @constructs
     * @param {Array} validateArgs
     * @param {Array} args
     * @param {DialogueController} dialogue
     * @returns {Promise}
     */
    constructor(validateArgs, args, dialogue) {
        /**
         * @member {Array}
         */
        this.args = args;

        /**
         * @member {Array}
         */
        this.validateArgs = validateArgs;

        /**
         * @member {DialogueController}
         */
        this.dialogue = dialogue;

        return new Promise((resolve, reject) => {
            if (_.isEmpty(this.validateArgs)) {
                resolve([]);
            }

            if (_.isEmpty(this.args[0])) {
                var questions = [];

                (function(resolve) {
                    var validateArgs = this.validateArgs;
                    var readline = this.dialogue;

                    var args = validateArgs.values();

                    async function next(el) {
                        let element = el || args.next();

                        if(!element.done) {
                            let arg = element.value;
                            let question = await readline.ask(arg.question, arg.reply_markup);

                            if (arg.reply_markup && arg.reply_markup.keyboard && !_.includes(_.flatten(arg.reply_markup.keyboard, true), question.text)) {
                                return next(element);
                            }

                            questions.push(question.text);

                            return next();
                        }

                        if(element.done) {
                            resolve(questions);
                        }
                    }

                    next();
                }.bind(this))(resolve);
            } else {
                this.args.shift();
                resolve(this.args);
            }
        });
    }
}