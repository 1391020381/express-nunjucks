define("dist/earth/init-debug", [ "./fixedTopBar-debug", "../cmd-lib/toast-debug", "../application/suspension-debug", "../application/method-debug", "../application/checkLogin-debug", "../application/api-debug", "../application/urlConfig-debug", "../application/login-debug", "../application/loginOperationLogic-debug", "../cmd-lib/jqueryMd5-debug", "../common/bindphone-debug", "../cmd-lib/myDialog-debug", "../application/iframe/iframe-messenger-debug", "../application/iframe/messenger-debug", "../common/baidu-statistics-debug", "../application/app-debug", "../application/element-debug", "../application/template-debug", "../application/extend-debug", "../application/loadSentry-debug", "../application/effect-debug", "../common/loginType-debug", "../application/helper-debug", "../application/single-login-debug", "../cmd-lib/util-debug" ], function(require, exports, module) {
    require("./fixedTopBar-debug");
    require("../cmd-lib/toast-debug");
    require("../application/suspension-debug");
    var utils = require("../cmd-lib/util-debug");
    var isLogin = require("../application/effect-debug").isLogin;
    var isAutoLogin = false;
    var callback = null;
    isLogin(callback, isAutoLogin);
});