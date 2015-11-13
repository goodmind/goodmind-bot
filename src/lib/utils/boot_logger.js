import winston from 'winston';
import colors from 'colors';
import _ from 'lodash';

import util from 'util';

/**
 * Custom levels.
 *
 * @type {{levels: *, colors: *}}
 */
export var customLevels = {
    levels: Object.assign(winston.config.syslog.levels, {
        ok: 9,
        failed: 8
    }),

    colors: Object.assign(winston.config.syslog.colors, {
        ok: 'green',
        failed: 'red'
    })
};

/**
 * @param options
 * @returns {*}
 */
export function formatter(options) {
    var prefix = winston.config.colorize(options.level, options.level.toUpperCase().bold);
    var meta = _.isEmpty(options.meta) ? '' : util.inspect(options.meta, {colors: true});

    return `[ ${prefix} ] ${options.message} ${meta}`;
}

/**
 * Implements boot logger.
 *
 * @class
 */
export default class BootLogger extends winston.Logger {
    /**
     * @constructs
     */
    constructor() {
        super({
            level: 'debug',
            levels: customLevels.levels,
            colors: customLevels.colors,

            transports: [
                new (winston.transports.Console)({
                    colorize: true,
                    prettyPrint: true,
                    formatter
                })
            ],

            exitOnError: false
        });
    }
}
