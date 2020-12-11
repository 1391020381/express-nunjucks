define("dist/authentication/index", [ "./fixedTopBar", "../cmd-lib/toast", "../cmd-lib/util", "../application/effect", "../application/checkLogin", "../application/api", "../application/urlConfig", "../application/method", "../application/login", "../cmd-lib/myDialog", "../application/iframe/iframe-messenger", "../application/iframe/messenger", "../common/baidu-statistics", "../common/loginType" ], function(require, exports, module) {
    require("./fixedTopBar");
    require("../cmd-lib/toast");
    var utils = require("../cmd-lib/util");
    var isLogin = require("../application/effect").isLogin;
    var isAutoLogin = false;
    var callback = null;
    isLogin(callback, isAutoLogin);
});