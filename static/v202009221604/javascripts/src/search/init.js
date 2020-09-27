define(function(require , exports , module){
    // var $ = require("$");
    // require("../cmd-lib/tab");
    // require("../cmd-lib/toast");
    // require("../cmd-lib/myDialog");
    // require("./effect");
    // require("./report");
    // require("./pay");
    // require("./login");
    var isLogin = require('../application/effect.js').isLogin;
    var isAutoLogin = false;
    var callback = null;
    isLogin(callback,isAutoLogin)
    require('./search');
    require('./banner')
    require('../common/bilog')
    require('../application/suspension')
    // require("../common/baidu-statistics");
});