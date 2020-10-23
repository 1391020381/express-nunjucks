define("dist/feedback/init", [ "../application/effect", "../application/checkLogin", "../application/api", "../application/urlConfig", "../application/method", "../application/login", "../cmd-lib/jqueryMd5", "../common/bilog", "base64", "../cmd-lib/util", "../report/config", "../cmd-lib/myDialog", "../cmd-lib/toast", "../common/bindphone", "../common/baidu-statistics", "./index", "../application/suspension", "../application/app", "../application/element", "../application/template", "../application/extend", "../application/helper" ], function(require, exports, module) {
    var isLogin = require("../application/effect").isLogin;
    var isAutoLogin = true;
    var callback = null;
    isLogin(callback, isAutoLogin);
    require("./index");
    require("../application/suspension");
});