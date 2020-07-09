define("dist/upload/init", [ "./fixedTopBar", "./upload", "../application/suspension", "../application/method", "../application/checkLogin", "../application/api", "../application/app", "../application/element", "../application/template", "../application/extend", "../common/bilog", "base64", "../cmd-lib/util", "../report/config", "../application/helper", "//static3.iask.cn/resource/js/plugins/pc.iask.login.min", "../cmd-lib/toast", "../cmd-lib/upload/Q", "../cmd-lib/upload/Q.Uploader", "./template/list.html", "./template/list_pravite.html" ], function(require, exports, module) {
    require("./fixedTopBar");
    require("./upload");
    require("../application/suspension");
});