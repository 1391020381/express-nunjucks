define(function(require , exports , module){
    var isLogin = require('../application/effect.js').isLogin;
    var isAutoLogin = false;
    var callback = null;
    isLogin(callback,isAutoLogin)
    require('../cmd-lib/toast');
    require("./bottomBar.js");
    require("./content.js");
    // require("../common/userMoreMsg")
    require('../application/suspension')
});