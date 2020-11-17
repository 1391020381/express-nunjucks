define(function(require , exports , module){
    require("./fixedTopBar");
    require('../cmd-lib/toast');
    var utils = require("../cmd-lib/util");
    var isLogin = require('../application/effect.js').isLogin;
    var isAutoLogin = false;
    var callback = null;
    isLogin(callback, isAutoLogin);
 });