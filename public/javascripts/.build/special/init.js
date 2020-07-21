define("dist/special/init", [ "../application/effect", "../application/checkLogin", "../application/api", "../application/method", "../cmd-lib/toast", "./bottomBar", "./content", "../application/suspension", "../application/app", "../application/element", "../application/template", "../application/extend", "../common/bilog", "base64", "../cmd-lib/util", "../report/config", "../application/helper", "//static3.iask.cn/resource/js/plugins/pc.iask.login.min" ], function(require, exports, module) {
    var isLogin = require("../application/effect").isLogin;
    var isAutoLogin = false;
    var callback = null;
    isLogin(callback, isAutoLogin);
    require("../cmd-lib/toast");
    require("./bottomBar");
    require("./content");
    // require("../common/userMoreMsg")
    require("../application/suspension");
});