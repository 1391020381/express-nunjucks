define("dist/upload/init", [ "./upload", "../application/suspension", "../application/method", "../application/checkLogin", "../application/api", "../application/urlConfig", "../application/login", "../cmd-lib/myDialog", "../cmd-lib/toast", "../application/iframe/iframe-messenger", "../application/iframe/messenger", "../common/baidu-statistics", "../application/app", "../application/element", "../application/template", "../application/extend", "../application/loadSentry", "../application/effect", "../common/loginType", "../application/helper", "../application/single-login", "./fixedTopBar", "../cmd-lib/upload/Q", "../cmd-lib/upload/Q.Uploader", "../cmd-lib/util", "./template/list.html", "./template/list_pravite.html", "./banner", "swiper", "../common/template/swiper_tmp.html", "../common/recommendConfigInfo" ], function(require, exports, module) {
    // require('./fixedTopBar')
    require("./upload");
    require("../application/suspension");
    require("./banner");
});