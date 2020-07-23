define(function(require , exports , module){

    var isLogin = require('../application/effect.js').isLogin;
    var isAutoLogin = true;
    var callback = null;
    isLogin(callback,isAutoLogin)
    // require('./buyUnlogin')
    require('./index')
    // require('./fixedTopBar')
    // require("../common/userMoreMsg")
    require('../application/suspension')
});