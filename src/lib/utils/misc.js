import colors from 'colors';

/** @namespace misc */
var misc = {
    /**
     * @memberof misc
     * @param user
     */
    fullName(user) {
        return user.last_name ? `${user.first_name} ${user.last_name}` : `${user.first_name}`;
    },

    /**
     * @memberof misc
     * @param user
     * @param color
     */
    username(user, color) {
        return user.username ? `${color ? '@'.magenta : '@'}${user.username}` : '';
    },

    /**
     * @memberof misc
     * @param chat
     */
    chat(chat) {
        if (chat.id < 0) {
            return chat.title;
        }

        return `${this.fullName(chat)} ${this.username(chat)}`;
    },

    /**
     * @memberof misc
     * @param user
     */
    isUser(user) {
        return user.id > 0;
    },

    /**
     * @memberof misc
     * @param chat
     */
    isChat(chat) {
        return chat.id < 0;
    },

    /**
     * @memberof misc
     * @param classObj
     * @param methodName
     */
    isMethodExists(classObj, methodName) {
        return 'string' === typeof Object.getOwnPropertyNames(classObj.prototype).filter(v => v === methodName)[0];
    }
};

export default misc;
