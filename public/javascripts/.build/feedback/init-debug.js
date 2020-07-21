define("dist/feedback/init-debug", [ "../application/effect-debug", "../application/checkLogin-debug", "../application/api-debug", "../application/method-debug", "./index-debug", "../application/suspension-debug", "../application/app-debug", "../application/element-debug", "../application/template-debug", "../application/extend-debug", "../common/bilog-debug", "base64-debug", "../cmd-lib/util-debug", "../report/config-debug", "../application/helper-debug", "//static3.iask.cn/resource/js/plugins/pc.iask.login.min-debug", "../cmd-lib/toast-debug" ], function(require, exports, module) {
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