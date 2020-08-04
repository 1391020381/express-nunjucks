define("dist/earth/init", [ "./fixedTopBar", "../cmd-lib/toast", "../application/suspension", "../application/method", "../application/checkLogin", "../application/api", "../application/login", "../cmd-lib/jqueryMd5", "../application/iframe/iframe-parent", "../application/iframe/messenger", "../cmd-lib/myDialog", "../common/bindphone", "../common/baidu-statistics", "../common/bilog", "base64", "../cmd-lib/util", "../report/config", "../application/app", "../application/element", "../application/template", "../application/extend", "../application/effect", "../application/helper" ], function(require, exports, module) {
    require("./fixedTopBar");
    require("../cmd-lib/toast");
    require("../application/suspension");
    var utils = require("../cmd-lib/util");
    var isLogin = require("../application/effect").isLogin;
    var isAutoLogin = false;
    var callback = null;
    isLogin(callback, isAutoLogin);
});