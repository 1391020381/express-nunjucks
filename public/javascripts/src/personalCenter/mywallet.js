define(function (require, exports, module) {
    var type = window.pageConfig&&window.pageConfig.page.type
    var getUserCentreInfo = require('./home.js').getUserCentreInfo
    if(type=='mywallet'){
        $("#dialog-box").dialog({
            html: $('#mywallet-tip-dialog').html(),
        }).open();
        getUserCentreInfo()
    }
});