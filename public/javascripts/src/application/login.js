define(function (require, exports, module) {

    var method = require("./method");
    var normalPageView = require('../common/bilog').normalPageView
    require("../cmd-lib/myDialog");
    require('../cmd-lib/toast');


    var IframeMessenger = require('./iframe/iframe-messenger');

    var IframeMessengerList = {
        I_SHARE: new IframeMessenger({
            clientId: 'MAIN_I_SHARE_LOGIN',
            projectName: 'I_SHARE',
            ssoId: 'I_SHARE_SSO_LOGIN',
        }),
        I_SHARE_T0URIST_PURCHASE: new IframeMessenger({
            clientId: 'MAIN_I_SHARE_T0URIST_PURCHASE',
            projectName: 'I_SHARE',
            ssoId: 'I_SHARE_SSO_T0URIST_PURCHASE',
        }),
        I_SHARE_T0URIST_LOGIN: new IframeMessenger({
            clientId: 'MAIN_I_SHARE_T0URIST_LOGIN',
            projectName: 'I_SHARE',
            ssoId: 'I_SHARE_SSO_T0URIST_LOGIN'
        })
    }

    function initIframeParams(successFun, iframeId, params) {
        // 操作需等iframe加载完毕
        var $iframe = $('#' + iframeId)[0]

        // 建立通信
        IframeMessengerList[iframeId].addTarget($iframe);
        // 发送初始数据
        $iframe.onload = function () {
            console.log('$iframe.onload:', IframeMessengerList[iframeId])

            IframeMessengerList[iframeId].send({
                // 窗口打开
                isOpen: true,
                // 分类id
                cid: params.clsId,
                // 资料id
                fid: params.fid,
                jsId:params.jsId
            });
        }

        // 监听消息
        IframeMessengerList[iframeId].listen(function (res) {
            console.log('客户端监听-数据', res);
            if (res.userData) {
                loginInSuccess(res.userData, res.formData, successFun)
            } else {
                loginInFail(res.formData);
            }
        })

        // 关闭弹窗按钮
        $('.dialog-box .close-btn').on('click', function () {
            // 主动关闭弹窗-需通知登录中心
            IframeMessengerList[iframeId].send({isOpen: false});
            closeRewardPop()
        })
    }

    function showLoginDialog(params, callback) {

        var loginDialog = $('#login-dialog')
        normalPageView('loginResultPage')
        $.extend(params, {jsId:method.getLoginSessionId()||'xxxxxxxxxxxxxxxxx'});
        $("#dialog-box").dialog({
            html: loginDialog.html(),
            'closeOnClickModal': false
        }).open(initIframeParams(callback, 'I_SHARE', params));
    }

    function showTouristPurchaseDialog(params, callback) { // 游客购买的回调函数

        var touristPurchaseDialog = $('#tourist-purchase-dialog')
        $("#dialog-box").dialog({
            html: touristPurchaseDialog.html(),
            'closeOnClickModal': false
        }).open(initIframeParams(callback, 'I_SHARE_T0URIST_PURCHASE', params));
    }

    function showTouristLogin(params,callback){
        var loginDom = $('#tourist-login').html()
        $('.carding-info-bottom.unloginStatus .qrWrap').html(loginDom)
        $('#tourist-login').remove()
        initIframeParams(callback, 'I_SHARE_T0URIST_LOGIN', params)
    }
    function closeRewardPop() {
        $(".common-bgMask").hide();
        $(".detail-bg-mask").hide();
        $('#dialog-box').hide();
    }
    function loginInSuccess(userData, loginType, successFun){
        window.loginType = loginType  // 获取用户信息时埋点需要
        method.setCookieWithExpPath("cuk", userData.access_token, userData.expires_in * 1000, "/");
        $.ajaxSetup({
            headers: {
                'Authrization': method.getCookie('cuk')
            }
        });
        successFun&&successFun()
        closeRewardPop()
    }
    function loginInFail(loginType){
        closeRewardPop()
    }
    $('#dialog-box').on('click', '.close-btn', function (e) {
        closeRewardPop();
    })
    $(document).on('click', '.tourist-purchase-dialog .tabs .tab', function (e) {
        var dataType = $(this).attr('data-type')
        $(' .tourist-purchase-dialog .tabs .tab').removeClass('tab-active')
        $(this).addClass('tab-active')
        if (dataType == 'tourist-purchase') {
            $('.tourist-purchase-dialog #I_SHARE_T0URIST_PURCHASE').hide()
            $('.tourist-purchase-dialog .tourist-purchase-content').show()
        }
        if (dataType == 'login-purchase') {
            $('.tourist-purchase-dialog .tourist-purchase-content').hide()
            $('.tourist-purchase-dialog #I_SHARE_T0URIST_PURCHASE').show()
        }
    })
    return {
        showLoginDialog: showLoginDialog,
        showTouristPurchaseDialog: showTouristPurchaseDialog,
        showTouristLogin:showTouristLogin
    }
});