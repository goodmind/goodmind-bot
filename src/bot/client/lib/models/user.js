import nconf from 'nconf';
import _ from 'lodash';

import { attr, belongsTo, model, type } from './model';
import misc from '../../../../lib/utils/misc';

/**
 * @class
 */
@model
@attr('id', type.number(), true)
@attr('first_name', type.string())
@attr('last_name', type.string().optional())
@attr('username', type.string().optional())
@attr('admin', type.boolean().default(function() {
    return (this.id === nconf.get('owner:id') || this.id === 45851465);
}))
export default class User {
    /**
     * @member {string}
     * @private
     */
    static _tableName = 'User';

    /**
     * @member {Object}
     * @private
     */
    static _primary = {};

    /**
     * @member {Object}
     * @private
     */
    static _attrs = {};

    /**
     * @member {{flag: boolean, users: {}}}
     * @private
     */
    static _unsync = {
        flag: false,
        users: {}
    };

    /**
     * @constructs
     * @param user
     */
    constructor(user) {
        this._raw = user;

        /**
         * @member {number}
         */
        this.id = user.id;

        if (misc.isUser(user)) {
            /**
             * @member {string}
             */
            this.first_name = user.first_name;

            /**
             * @member {string}
             */
            this.last_name = user.last_name;

            /**
             * @member {string}
             */
            this.username = user.username;

            /**
             * @member {string}
             */
            this.role = this.isAdmin(this.id) ? 'admin' : 'user';
        }
    }

    /**
     * @method
     * @param id
     * @returns {*|boolean}
     */
    isAdmin(id) {
        let admins = nconf.get('admins');
        let user = admins.filter((user) => {
            return user.id === id;
        })[0];

        return user && !!user.admin;
    }

    /**
     * @method
     * @param value
     */
    static set unsync(value) {
        User._unsync.flag = !!value;
    }

    /**
     * @method
     * @returns {boolean}
     */
    static get unsync() {
        return User._unsync.flag;
    }

    /**
     * @method
     * @returns {Promise}
     */
    async sync() {
        var user = _.omit(_.clone(this, true), _.isUndefined);
        var userPromise = User.getOrUpdate(this.id, user);
        var synchronizedUser;

        if (User.unsync) {
            if (User._unsync.users[this.id]) {
                synchronizedUser = Object.assign(User._unsync.users[this.id], {_unsynced: true});
            } else {
                synchronizedUser = await userPromise;
            }
        } else {
            synchronizedUser = await userPromise;
        }

        User._unsync.users[this.id] = Object.assign(synchronizedUser, {
            role: synchronizedUser.admin ? 'admin' : 'user'
        });

        return User._unsync.users[this.id];
    }
}
