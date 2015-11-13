import winston from 'winston';
import colors from 'colors';
import mkdirp from 'mkdirp';
import nconf from 'nconf';
import path from 'path';
import util from 'util';
import _ from 'lodash';

import misc from './misc';

/**
 * Custom levels.
 *
 * @type {{levels: *, colors: *}}
 */
export var customLevels = {
    levels: Object.assign(winston.config.syslog.levels, {
        message: 9,
        sentMessage: 8
    }),

    colors: Object.assign(winston.config.syslog.colors, {
        message: 'green',
        sentMessage: 'red'
    })
};

/**
 * @param options
 * @returns {*}
 */
export function formatter(options) {
    var prefix = winston.config.colorize(options.level, options.level);
    var meta = _.isEmpty(options.meta) ? '' : util.inspect(options.meta, {colors: true});

    if (options.meta.message_id) {
        var msg = options.meta;
        var buffer = [];

        if (msg.message_id) {
            prefix = winston.config.colorize(options.level, options.level === 'message' ? '>>>' : '<<<');
            buffer.push(`${'#'.gray}${msg.message_id.toString().blue}`);
        }

        if (options.meta.chat.id === options.meta.from.id) {
            buffer.push('(private)'.gray);
        }

        if (msg.text) {
            buffer.push(msg.text);
        } else if (msg.new_chat_participant) {
            buffer.push(`(invited user ${misc.fullName(msg.new_chat_participant)})`);
        } else if (msg.left_chat_participant) {
            buffer.push(`(kicked user ${misc.fullName(msg.left_chat_participant)})`);
        } else if (msg.new_chat_title) {
            buffer.push(`(renamed chat to ${msg.new_chat_title})`);
        } else if (msg.audio) {
            buffer.push('(audio)');
        } else if (msg.document) {
            buffer.push('(document)');
        } else if (msg.photo) {
            buffer.push('(photo)');
        } else if (msg.sticker) {
            buffer.push('(sticker)');
        } else if (msg.video) {
            buffer.push('(video)');
        } else if (msg.contact) {
            buffer.push(`(contact: ${msg.contact.first_name} ${msg.contact.phone_number}`);
        } else if (msg.location) {
            buffer.push(`(location: ${msg.location.longitute} ${msg.location.latitude}`);
        } else {
            buffer.push('(no text)');
        }

        if (msg.forward_from) {
            buffer.push(`${'from'.yellow.bold} ${misc.fullName(msg.forward_from)}${misc.username(msg.forward_from, true)}${'#'.gray}${msg.forward_from.id}`);
        }

        buffer.push(`${'by'.yellow.bold} ${misc.fullName(msg.from)}${misc.username(msg.from, true)}${'#'.gray}${msg.from.id}`);

        if (msg.chat.title) {
            buffer.push(`${'in'.yellow.bold} ${msg.chat.title}${'#'.gray}${msg.chat.id.toString().blue}`);
        }

        return `${prefix} ${buffer.join(' ')}`;
    }

    return `(${prefix}) ${options.message} ${meta}`;
}

/**
 * @param options
 * @returns {*}
 */
export function formatWithoutColors(options) {
    var prefix = options.level === 'message' ? '>>>' : '<<<';

    if (options.meta.message_id) {
        var msg = options.meta;
        var date = new Date(msg.date * 1000);
        var buffer = [];

        if (msg.message_id) {
            buffer.push(`#${msg.message_id}`);
        }

        if (options.meta.chat.id === options.meta.from.id) {
            buffer.push('(private)');
        }

        buffer.push(`(${date})`);

        if (msg.text) {
            buffer.push(msg.text);
        } else if (msg.new_chat_participant) {
            buffer.push(`(invited user ${misc.fullName(msg.new_chat_participant)})`);
        } else if (msg.left_chat_participant) {
            buffer.push(`(kicked user ${misc.fullName(msg.left_chat_participant)})`);
        } else if (msg.new_chat_title) {
            buffer.push(`(renamed chat to ${msg.new_chat_title})`);
        } else if (msg.audio) {
            buffer.push('(audio)');
        } else if (msg.document) {
            buffer.push('(document)');
        } else if (msg.photo) {
            buffer.push('(photo)');
        } else if (msg.sticker) {
            buffer.push('(sticker)');
        } else if (msg.video) {
            buffer.push('(video)');
        } else if (msg.contact) {
            buffer.push(`(contact: ${msg.contact.first_name} ${msg.contact.phone_number}`);
        } else if (msg.location) {
            buffer.push(`(location: ${msg.location.longitute} ${msg.location.latitude}`);
        } else {
            buffer.push('(no text)');
        }

        if (msg.forward_from) {
            buffer.push(`from ${misc.fullName(msg.forward_from)}${misc.username(msg.forward_from)}#${msg.forward_from.id}`);
        }

        buffer.push(`by ${misc.fullName(msg.from)}${misc.username(msg.from)}#${msg.from.id}`);

        if (msg.chat.title) {
            buffer.push(`in ${msg.chat.title}#${msg.chat.id}`);
        }

        return `${prefix} ${buffer.join(' ')}`;
    }
}

/**
 * Implements logger.
 *
 * @class
 */
export default class Logger extends winston.Logger {
    /**
     * @constructs
     */
    constructor() {
        var messagesLogPath = nconf.get('log:path');

        super({
            level: 'debug',
            levels: customLevels.levels,
            colors: customLevels.colors,

            transports: [
                new (winston.transports.Console)({
                    colorize: true,
                    prettyPrint: true,
                    formatter
                }),

                new (winston.transports.DailyRotateFile)({
                    name: 'message-file',
                    level: 'message',
                    dirname: messagesLogPath,
                    filename: 'messages',
                    datePattern: '.yyyy-MM-ddTHH',
                    json: false,
                    formatter: formatWithoutColors
                })
            ],

            exitOnError: false
        });

        mkdirp(messagesLogPath, (err) => {
            if (err) throw err;

            /**
             * @member {string}
             */
            this.level = 'debug';
            this.debug('Create log directory');
        });
    }
}
