// Remember to update error-codes.js

export enum ErrorCodes {
    // main
    SUCCESS = 1000,
    INTERNAL_ERROR = 1001,
    // users
    ALREADY_LOGGED_IN = 2000,
    USERNAME_OR_PASSWORD_EMPTY = 2001,
    USERNAME_OR_PASSWORD_INCORRECT = 2002,
    USERNAME_INVALID = 2003,
    USERNAME_TAKEN = 2004,
    // notes
    NOT_LOGGED_IN = 3000,
    NOTE_NOT_FOUND = 3001
}

