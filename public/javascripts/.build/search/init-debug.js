define("dist/search/init-debug", [ "../application/effect-debug", "../application/checkLogin-debug", "../application/api-debug", "../application/method-debug", "../application/login-debug", "../cmd-lib/jqueryMd5-debug", "../common/bilog-debug", "base64-debug", "../cmd-lib/util-debug", "../report/config-debug", "../cmd-lib/myDialog-debug", "../cmd-lib/toast-debug", "../common/bindphone-debug", "../common/baidu-statistics-debug", "./search-debug", "swiper-debug", "./banner-debug", "../common/template/swiper_tmp-debug.html", "../common/recommendConfigInfo-debug", "../application/suspension-debug", "../application/app-debug", "../application/element-debug", "../application/template-debug", "../application/extend-debug", "../application/helper-debug" ], function(require, exports, module) {
    // var $ = require("$");
    // require("../cmd-lib/tab");
    // require("../cmd-lib/toast");
    // require("../cmd-lib/myDialog");
    // require("./effect");
    // require("./report");
    // require("./pay");
    // require("./login");
    var isLogin = require("../application/effect-debug").isLogin;
    var isAutoLogin = false;
    var callback = null;
    isLogin(callback, isAutoLogin);
    require("./search-debug");
    require("./banner-debug");
    require("../common/bilog-debug");
    require("../application/suspension-debug");
});