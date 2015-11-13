import nconf from 'nconf';

/**
 * @class
 */
export default class Command {
    /**
     * @type {Array}
     * @static
     */
    static validateArgs = [];

    /**
     * @type {Object}
     * @static
     */
    static accessControl = {
        'start': ['any']
    };

    /**
     * @constructs
     * @param {DialogueController} dialogue
     * @param {EventEmitter} compensator
     * @param {Array} args
     * @param {AccessManager} accessController
     */
    constructor(dialogue, compensator, args, accessController) {
        /**
         * @member {DialogueController}
         */
        this.dialogue = dialogue;

        /**
         * @member {EventEmitter}
         */
        this.compensator = compensator;

        /**
         * @member {ConversationController}
         */
        this.context = dialogue.context;

        /**
         * @member {Array}
         */
        this.args = args;

        /**
         * @member {AccessManager}
         */
        this.accessController = accessController;

        /**
         * @member {object}
         */
        this.message = dialogue.messages[0];

        /**
         * @member {object}
         */
        this.user = this.message.from;

        console.log(this.args);
    }

    /**
     * @method
     */
    start() {

    }
}
