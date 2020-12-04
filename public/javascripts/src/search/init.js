define(function(require , exports , module){
    var isLogin = require('../application/effect.js').isLogin;
    var isAutoLogin = false;
    var callback = null;
    isLogin(callback,isAutoLogin)
    require('./search');
    require('./banner')
    
    require('../application/suspension')
    
});