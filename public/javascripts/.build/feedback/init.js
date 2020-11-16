define("dist/feedback/init", [ "../application/effect", "../application/checkLogin", "../application/api", "../application/urlConfig", "../application/method", "../application/login", "../common/bilog", "base64", "../cmd-lib/util", "../report/config", "../cmd-lib/myDialog", "../cmd-lib/toast", "../application/iframe/iframe-messenger", "../application/iframe/messenger", "../common/baidu-statistics", "./index", "../application/suspension", "../application/app", "../application/element", "../application/template", "../application/extend", "../application/helper", "../application/single-login" ], function(require, exports, module) {
    var isLogin = require("../application/effect").isLogin;
    var isAutoLogin = true;
    var callback = null;
    isLogin(callback, isAutoLogin);
    require("./index");
    require("../application/suspension");
});