define("dist/earth/init-debug", [ "./fixedTopBar-debug", "../cmd-lib/toast-debug", "../application/suspension-debug", "../application/method-debug", "../application/checkLogin-debug", "../application/api-debug", "../application/app-debug", "../application/element-debug", "../application/template-debug", "../application/extend-debug", "../common/bilog-debug", "base64-debug", "../cmd-lib/util-debug", "../report/config-debug", "../application/effect-debug", "../application/helper-debug", "//static3.iask.cn/resource/js/plugins/pc.iask.login.min-debug" ], function(require, exports, module) {
    require("./fixedTopBar-debug");
    require("../cmd-lib/toast-debug");
    require("../application/suspension-debug");
    var utils = require("../cmd-lib/util-debug");
    var isLogin = require("../application/effect-debug").isLogin;
    var isAutoLogin = false;
    var callback = null;
    isLogin(callback, isAutoLogin);
});