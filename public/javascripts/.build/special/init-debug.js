define("dist/special/init-debug", [ "../application/effect-debug", "../application/checkLogin-debug", "../application/api-debug", "../application/urlConfig-debug", "../application/method-debug", "../application/login-debug", "../application/loginOperationLogic-debug", "../cmd-lib/jqueryMd5-debug", "../common/bindphone-debug", "../cmd-lib/myDialog-debug", "../cmd-lib/toast-debug", "../application/iframe/iframe-messenger-debug", "../application/iframe/messenger-debug", "../common/baidu-statistics-debug", "../common/loginType-debug", "../common/associateWords-debug", "./bottomBar-debug", "./content-debug", "swiper-debug", "../common/template/swiper_tmp-debug.html", "../common/recommendConfigInfo-debug", "../application/suspension-debug", "../application/app-debug", "../application/element-debug", "../application/template-debug", "../application/extend-debug", "../common/bilogReport-debug", "../application/helper-debug", "../application/single-login-debug" ], function(require, exports, module) {
    var isLogin = require("../application/effect-debug").isLogin;
    var isAutoLogin = false;
    var callback = null;
    isLogin(callback, isAutoLogin);
    require("../cmd-lib/toast-debug");
    require("./bottomBar-debug");
    require("./content-debug");
    require("../application/suspension-debug");
    trackEvent("NE030", "pageTypeView", "page", {
        pageID: "TP",
        pageName: "专题页"
    });
});