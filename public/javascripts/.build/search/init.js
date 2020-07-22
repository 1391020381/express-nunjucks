define("dist/search/init", [ "../application/effect", "../application/checkLogin", "../application/api", "../application/method", "./search", "swiper", "../common/bilog", "base64", "../cmd-lib/util", "../report/config", "./banner", "../common/template/swiper_tmp.html", "../common/recommendConfigInfo", "../application/suspension", "../application/app", "../application/element", "../application/template", "../application/extend", "../application/helper", "//static3.iask.cn/resource/js/plugins/pc.iask.login.min" ], function(require, exports, module) {
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