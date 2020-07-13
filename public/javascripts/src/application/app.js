define(function (require, exports, module) {
    var method = require("./method");
    require("./element");
    require("./extend");
    var bilog=require("../common/bilog");
   // require('../report/init');
   require('./effect.js')
    window.template = require("./template");
    require("./helper");
    require('//static3.iask.cn/resource/js/plugins/pc.iask.login.min.js');
   

    //此方法是为了解决外部登录找不到此方法
    window.getCookie = method.getCookie;
    return {
        method: method,
        v: "1.0.1",
        bilog:bilog
    }
});