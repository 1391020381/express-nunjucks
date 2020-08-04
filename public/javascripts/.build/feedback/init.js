define("dist/feedback/init", [ "../application/effect", "../application/checkLogin", "../application/api", "../application/method", "../application/login", "../cmd-lib/jqueryMd5", "../application/iframe/iframe-parent", "../application/iframe/messenger", "../cmd-lib/myDialog", "../cmd-lib/toast", "../common/bindphone", "../common/baidu-statistics", "../common/bilog", "base64", "../cmd-lib/util", "../report/config", "./index", "../application/suspension", "../application/app", "../application/element", "../application/template", "../application/extend", "../application/helper" ], function(require, exports, module) {
    var isLogin = require("../application/effect").isLogin;
    var isAutoLogin = true;
    var callback = null;
    isLogin(callback, isAutoLogin);
    // require('./buyUnlogin')
    require("./index");
    // require('./fixedTopBar')
    // require("../common/userMoreMsg")
    require("../application/suspension");
});