define("dist/earth/init", [ "./fixedTopBar", "../cmd-lib/toast", "../application/suspension", "../application/method", "../application/checkLogin", "../application/api", "../application/urlConfig", "../application/login", "../application/loginOperationLogic", "../cmd-lib/jqueryMd5", "../common/bindphone", "../cmd-lib/myDialog", "../application/iframe/iframe-messenger", "../application/iframe/messenger", "../common/baidu-statistics", "../application/app", "../application/element", "../application/template", "../application/extend", "../application/effect", "../common/loginType", "../application/helper", "../application/single-login", "../cmd-lib/util" ], function(require, exports, module) {
    require("./fixedTopBar");
    require("../cmd-lib/toast");
    require("../application/suspension");
    var utils = require("../cmd-lib/util");
    var isLogin = require("../application/effect").isLogin;
    var isAutoLogin = false;
    var callback = null;
    isLogin(callback, isAutoLogin);
});