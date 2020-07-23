define(function (require, exports, module) {
    var type = window.pageConfig&&window.pageConfig.page.type
    var getUserCentreInfo = require('./home.js').getUserCentreInfo
    var isLogin = require('../application/effect.js').isLogin
    if(type=='mywallet'){
        isLogin(initCallback,true)
    }
    function initCallback(){
        $("#dialog-box").dialog({
            html: $('#mywallet-tip-dialog').html(),
        }).open();
        getUserCentreInfo()
    }
});