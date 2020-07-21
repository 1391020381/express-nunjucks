define("dist/feedback/init", [ "../application/effect", "../application/checkLogin", "../application/api", "../application/method", "./index", "../application/suspension", "../application/app", "../application/element", "../application/template", "../application/extend", "../common/bilog", "base64", "../cmd-lib/util", "../report/config", "../application/helper", "//static3.iask.cn/resource/js/plugins/pc.iask.login.min", "../cmd-lib/toast" ], function(require, exports, module) {
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