define(function (require, exports, module) {

    var method = require('./method');
    var loginInit = require('./loginOperationLogic').loginInit;
    var getLoginQrcode = require('./loginOperationLogic').getLoginQrcode
    require('../cmd-lib/myDialog');
    require('../cmd-lib/toast');
    function showLoginDialog(params, callback) {
        trackEvent('NE006', 'modelView', 'view', {
            moduleID: 'login',
            moduleName: '登录弹窗'
        });
        var loginDialog = $('#login-dialog');
        $('#dialog-box').dialog({
            html: loginDialog.html(),
            'closeOnClickModal': false
        }).open(loginInit(params, callback));
    }

    function showTouristPurchaseDialog(params, callback) { // 游客购买的回调函数
        trackEvent('NE006', 'modelView', 'view', {
            moduleID: 'login',
            moduleName: '登录弹窗'
        });
        var touristPurchaseDialog = $('#tourist-purchase-dialog');
        $('#dialog-box').dialog({
            html: touristPurchaseDialog.html(),
            'closeOnClickModal': false
        }).open(loginInit(params, callback));
    }

    function showTouristLogin(params, callback) {
        var loginDom = $('#tourist-login').html();
        $('.carding-info-bottom.unloginStatus .qrWrap').html(loginDom);
        $('#tourist-login').remove();
        getLoginQrcode(params.cid, params.fid, '', true, callback)
    }
    return {
        showLoginDialog: showLoginDialog,
        showTouristPurchaseDialog: showTouristPurchaseDialog,
        showTouristLogin: showTouristLogin
    };
});
