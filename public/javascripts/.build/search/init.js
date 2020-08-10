define("dist/search/init", [ "../application/effect", "../application/checkLogin", "../application/api", "../application/method", "../application/login", "../cmd-lib/jqueryMd5", "../application/iframe/iframe-parent", "../application/iframe/messenger", "../common/bilog", "base64", "../cmd-lib/util", "../report/config", "../cmd-lib/myDialog", "../cmd-lib/toast", "../common/bindphone", "../common/baidu-statistics", "./search", "swiper", "./banner", "../common/template/swiper_tmp.html", "../common/recommendConfigInfo", "../application/suspension", "../application/app", "../application/element", "../application/template", "../application/extend", "../application/helper" ], function(require, exports, module) {
    // var $ = require("$");
    // require("../cmd-lib/tab");
    // require("../cmd-lib/toast");
    // require("../cmd-lib/myDialog");
    // require("./effect");
    // require("./report");
    // require("./pay");
    // require("./login");
    var isLogin = require("../application/effect").isLogin;
    var isAutoLogin = false;
    var callback = null;
    isLogin(callback, isAutoLogin);
    require("./search");
    require("./banner");
    require("../common/bilog");
    require("../application/suspension");
});