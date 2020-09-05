define("dist/authentication/index", [ "./fixedTopBar", "../cmd-lib/toast", "../cmd-lib/util", "../application/effect", "../application/checkLogin", "../application/api", "../application/method", "../application/login", "../cmd-lib/jqueryMd5", "../common/bilog", "base64", "../report/config", "../cmd-lib/myDialog", "../common/bindphone", "../common/baidu-statistics" ], function(require, exports, module) {
    require("./fixedTopBar");
    require("../cmd-lib/toast");
    var utils = require("../cmd-lib/util");
    var isLogin = require("../application/effect").isLogin;
    var isAutoLogin = false;
    var callback = null;
    isLogin(callback, isAutoLogin);
});