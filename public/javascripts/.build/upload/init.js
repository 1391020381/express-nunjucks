define("dist/upload/init", [ "./fixedTopBar", "./upload", "../application/suspension", "../application/method", "../application/checkLogin", "../application/api", "../application/login", "../cmd-lib/jqueryMd5", "../cmd-lib/myDialog", "../cmd-lib/toast", "../common/bindphone", "../common/baidu-statistics", "../common/bilog", "base64", "../cmd-lib/util", "../report/config", "../application/app", "../application/element", "../application/template", "../application/extend", "../application/effect", "../application/helper", "../cmd-lib/upload/Q", "../cmd-lib/upload/Q.Uploader", "./template/list.html", "./template/list_pravite.html" ], function(require, exports, module) {
    require("./fixedTopBar");
    require("./upload");
    require("../application/suspension");
});