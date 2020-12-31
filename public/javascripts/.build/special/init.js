define("dist/special/init", [ "../application/effect", "../application/checkLogin", "../application/api", "../application/urlConfig", "../application/method", "../application/login", "../application/loginOperationLogic", "../cmd-lib/jqueryMd5", "../common/bindphone", "../cmd-lib/myDialog", "../cmd-lib/toast", "../application/iframe/iframe-messenger", "../application/iframe/messenger", "../common/baidu-statistics", "../common/loginType", "./bottomBar", "./content", "../application/suspension", "../application/app", "../application/element", "../application/template", "../application/extend", "../application/loadSentry", "../application/helper", "../application/single-login" ], function(require, exports, module) {
    var isLogin = require("../application/effect").isLogin;
    var isAutoLogin = false;
    var callback = null;
    isLogin(callback, isAutoLogin);
    require("../cmd-lib/toast");
    require("./bottomBar");
    require("./content");
    require("../application/suspension");
    iask_web.track_event("NE030", "pageTypeView", "page", {
        pageID: "TP",
        pageName: "专题页"
    });
});