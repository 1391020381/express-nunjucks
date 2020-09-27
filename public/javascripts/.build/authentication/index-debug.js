define("dist/authentication/index-debug", [ "./fixedTopBar-debug", "../cmd-lib/toast-debug", "../cmd-lib/util-debug", "../application/effect-debug", "../application/checkLogin-debug", "../application/api-debug", "../application/urlConfig-debug", "../application/method-debug", "../application/login-debug", "../cmd-lib/jqueryMd5-debug", "../common/bilog-debug", "base64-debug", "../report/config-debug", "../cmd-lib/myDialog-debug", "../common/bindphone-debug", "../common/baidu-statistics-debug" ], function(require, exports, module) {
    require("./fixedTopBar-debug");
    require("../cmd-lib/toast-debug");
    var utils = require("../cmd-lib/util-debug");
    var isLogin = require("../application/effect-debug").isLogin;
    var isAutoLogin = false;
    var callback = null;
    isLogin(callback, isAutoLogin);
});