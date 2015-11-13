/**
 * @class
 */
export class CommandNotFoundError extends Error {
    /**
     * @constructs
     */
    constructor() {
        super({commandNotFound: true});

        console.error('CommandNotFoundError');
    }
}

/**
 * @class
 */
export class CommandAccessDeniedError extends Error {
    /**
     * @constructs
     */
    constructor() {
        super({commandAccessDenied: true});

        console.error('CommandAccessDeniedError');
    }
}

/**
 * @class
 */
export class CommandUnknownError extends Error {
    /**
     * @constructs
     */
    constructor() {
        super({commandUnknownError: true});

        console.error('CommandUnknownError');
    }
}
