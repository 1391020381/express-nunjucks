define("dist/upload/init", [ "./fixedTopBar", "./upload", "../application/suspension", "../application/method", "../application/checkLogin", "../application/api", "../application/urlConfig", "../application/login", "../cmd-lib/jqueryMd5", "../common/bilog", "base64", "../cmd-lib/util", "../report/config", "../cmd-lib/myDialog", "../cmd-lib/toast", "../common/bindphone", "../common/baidu-statistics", "../application/app", "../application/element", "../application/template", "../application/extend", "../application/effect", "../application/helper", "../cmd-lib/upload/Q", "../cmd-lib/upload/Q.Uploader", "./template/list.html", "./template/list_pravite.html", "./banner", "swiper", "../common/template/swiper_tmp.html", "../common/recommendConfigInfo" ], function(require, exports, module) {
    require("./fixedTopBar");
    require("./upload");
    require("../application/suspension");
    require("./banner");
});