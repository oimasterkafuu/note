const ErrorCodes = {
    SUCCESS: 1000,
    INTERNAL_ERROR: 1001,
    ALREADY_LOGGED_IN: 2000,
    USERNAME_OR_PASSWORD_EMPTY: 2001,
    USERNAME_OR_PASSWORD_INCORRECT: 2002,
    USERNAME_INVALID: 2003,
    USERNAME_TAKEN: 2004,
    NOT_LOGGED_IN: 3000,
    NOTE_NOT_FOUND: 3001
}

const ErrorText = {
    1000: "成功",
    1001: "内部错误",
    2000: "您已经登录",
    2001: "用户名或密码为空",
    2002: "用户名或密码错误",
    2003: "用户名无效",
    2004: "用户名已被占用",
    3000: "您还未登录",
    3001: "笔记不存在"
}

