define(function (require, exports, module) {
    var type = window.pageConfig&&window.pageConfig.page.type
    var getUserCentreInfo = require('./home.js').getUserCentreInfo
    var isLogin = require('../application/effect.js').isLogin
    if(type=='mywallet'){
        isLogin(initCallback)
    }
    function initCallback(userInfo){
        $("#dialog-box").dialog({
            html: $('#mywallet-tip-dialog').html(),
        }).open();
        getUserCentreInfo(userInfo)
    }
});