import _ from 'lodash';

import database from '../../../../database';
import { type } from '../../../../database';

export { type };

/** @namespace model */

/**
 * @param target
 * @returns {*}
 */
export function model(target) {
    /**
     * @class Model
     * @memberof! model
     */
    target.model = database.createModel(target._tableName, target._attrs, target._primary);

    Object.assign(target, {
        /**
         * @memberof! Model
         * @returns {Promise}
         */
        async getOrCreate(primaryKey, schema) {
            var model = target.model;
            var action = model.get(primaryKey);

            try {
                return await action.run();
            } catch(e) {
                let _model = new model(schema);
                return _model.save();
            }
        },

        /**
         * @memberof! Model
         * @returns {Promise}
         */
        async getOrUpdate(primaryKey, schema) {
            var model = target.model;
            var action = model.get(primaryKey);

            try {
                let document = await action.run();
                let update = {};

                _(_.difference(
                    _.keys(
                        _.clone(document, true)
                    ),
                    _.keys(
                        _.clone(schema, true)
                    )
                )).forEach(val => {
                    if (!schema[val]) {
                        update[val] = undefined;
                        return;
                    }

                    update[val] = document[val] || schema[val];
                });

                if (!_.isEqual(_.clone(document, true), _.clone(schema, true))) {
                    _.merge(update, schema);
                }

                if (_.isPlainObject(update) && !_.isEmpty(update)) {
                    let doc = await action.run();
                        doc = await doc.merge(update).save();

                    return doc || document;
                }

                return document;
            } catch(e) {
                let _model = new model(schema);
                return _model.save();
            }
        }
    });
}

/**
 * @function attr
 * @memberof! model
 *
 * @param field
 * @param type
 * @param primary
 *
 * @returns {Function}
 */
export function attr(field, type, primary) {
    return function decorator(target) {
        target._attrs[field] = type;

        if (primary) {
            target._primary.pk = field;
        }
    }
}

/**
 * @function hasOne
 * @memberof! model
 *
 * @param Model
 * @param fieldName
 * @param leftKey
 * @param rightKey
 * @param options
 *
 * @returns {Function}
 */
export function hasOne(Model, fieldName, leftKey, rightKey, options) {
    return function decorator(target) {
        target.model.hasOne(Model, fieldName, leftKey, rightKey, options);
    }
}

/**
 * @function belongsTo
 * @memberof! model
 *
 * @param Model
 * @param fieldName
 * @param leftKey
 * @param rightKey
 * @param options
 *
 * @returns {Function}
 */
export function belongsTo(Model, fieldName, leftKey, rightKey, options) {
    return function decorator(target) {
        target.model.belongsTo(Model, fieldName, leftKey, rightKey, options);
    }
}
