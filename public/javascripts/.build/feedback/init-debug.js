define("dist/feedback/init-debug", [ "../application/effect-debug", "../application/checkLogin-debug", "../application/api-debug", "../application/urlConfig-debug", "../application/method-debug", "../application/login-debug", "../application/loginOperationLogic-debug", "../cmd-lib/jqueryMd5-debug", "../common/bindphone-debug", "../cmd-lib/myDialog-debug", "../cmd-lib/toast-debug", "../application/iframe/iframe-messenger-debug", "../application/iframe/messenger-debug", "../common/baidu-statistics-debug", "../common/loginType-debug", "../common/associateWords-debug", "./index-debug", "../application/suspension-debug", "../application/app-debug", "../application/element-debug", "../application/template-debug", "../application/extend-debug", "../common/bilogReport-debug", "../application/helper-debug", "../application/single-login-debug" ], function(require, exports, module) {
    var isLogin = require("../application/effect-debug").isLogin;
    var isAutoLogin = true;
    var callback = null;
    isLogin(callback, isAutoLogin);
    require("./index-debug");
    require("../application/suspension-debug");
});