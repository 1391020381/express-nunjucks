define("dist/feedback/init-debug", [ "../application/effect-debug", "../application/checkLogin-debug", "../application/api-debug", "../application/method-debug", "../application/login-debug", "../cmd-lib/jqueryMd5-debug", "../application/iframe/iframe-parent-debug", "../application/iframe/messenger-debug", "../common/bilog-debug", "base64-debug", "../cmd-lib/util-debug", "../report/config-debug", "../cmd-lib/myDialog-debug", "../cmd-lib/toast-debug", "../common/bindphone-debug", "../common/baidu-statistics-debug", "./index-debug", "../application/suspension-debug", "../application/app-debug", "../application/element-debug", "../application/template-debug", "../application/extend-debug", "../application/helper-debug" ], function(require, exports, module) {
    var isLogin = require("../application/effect-debug").isLogin;
    var isAutoLogin = true;
    var callback = null;
    isLogin(callback, isAutoLogin);
    // require('./buyUnlogin')
    require("./index-debug");
    // require('./fixedTopBar')
    // require("../common/userMoreMsg")
    require("../application/suspension-debug");
});