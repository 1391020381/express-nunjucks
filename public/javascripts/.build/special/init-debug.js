define("dist/special/init-debug", [ "../application/effect-debug", "../application/checkLogin-debug", "../application/api-debug", "../application/urlConfig-debug", "../application/method-debug", "../application/login-debug", "../common/bilog-debug", "base64-debug", "../cmd-lib/util-debug", "../report/config-debug", "../cmd-lib/myDialog-debug", "../cmd-lib/toast-debug", "../application/iframe/iframe-messenger-debug", "../application/iframe/messenger-debug", "../common/baidu-statistics-debug", "./bottomBar-debug", "./content-debug", "../application/suspension-debug", "../application/app-debug", "../application/element-debug", "../application/template-debug", "../application/extend-debug", "../application/helper-debug", "../application/single-login-debug", "../method-debug", "../api-debug", "../login/checkLogin-debug" ], function(require, exports, module) {
    var isLogin = require("../application/effect-debug").isLogin;
    var isAutoLogin = false;
    var callback = null;
    isLogin(callback, isAutoLogin);
    require("../cmd-lib/toast-debug");
    require("./bottomBar-debug");
    require("./content-debug");
    // require("../common/userMoreMsg")
    require("../application/suspension-debug");
});