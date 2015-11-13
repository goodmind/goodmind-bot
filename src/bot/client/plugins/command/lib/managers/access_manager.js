import _ from 'lodash';
import misc from '../../../../../../lib/utils/misc';

/**
 * @class
 */
export default class AccessManager {
    /**
     * @constructs
     * @param accessControl
     * @param user
     */
    constructor(accessControl, user) {
        /**
         * @member {object}
         */
        this.accessControl = accessControl;

        /**
         * @member {object}
         */
        this.user = user;
    }

    /**
     * @method
     * @param method
     * @returns {boolean}
     */
    hasAccess(method) {
        var rules = this.accessControl[method];
        var hasAccess = rules.filter(rule => {
            return this.user.role === 'admin' || rule === this.user.role || rule === 'any';
        })[0];

        return !!hasAccess;
    }
}