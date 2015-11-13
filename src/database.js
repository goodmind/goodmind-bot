import thinky from 'thinky';

/**
 * Database config
 *
 * @type {{host: (*|string), port: (Number|number), db: (*|string)}}
 */
var dbConfig = {
    host: process.env.RDB_HOST || 'localhost',
    port: parseInt(process.env.RDB_PORT) || 28015,
    db  : process.env.RDB_DB || 'telegram2'
};

/**
 * @type {object}
 */
var _thinky = thinky(dbConfig);

/**
 * @type {object}
 */
export var r = _thinky.r;

/**
 * @type {object}
 */
export var type = _thinky.type;

export default _thinky;
