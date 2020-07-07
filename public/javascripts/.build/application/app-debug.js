define("dist/application/app-debug", [ "./method-debug", "./element-debug", "./template-debug", "./extend-debug", "../common/bilog-debug", "base64-debug", "../cmd-lib/util-debug", "../report/config-debug", "../report/init-debug", "../report/handler-debug", "../report/columns-debug", "./helper-debug", "//static3.iask.cn/resource/js/plugins/pc.iask.login.min-debug" ], function(require, exports, module) {
    var method = require("./method-debug");
    require("./element-debug");
    require("./extend-debug");
    var bilog = require("../common/bilog-debug");
    require("../report/init-debug");
    window.template = require("./template-debug");
    require("./helper-debug");
    require("//static3.iask.cn/resource/js/plugins/pc.iask.login.min-debug.js");
    //此方法是为了解决外部登录找不到此方法
    window.getCookie = method.getCookie;
    return {
        method: method,
        v: "1.0.1",
        bilog: bilog
    };
});