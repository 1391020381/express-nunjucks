define(function (require, exports, module) {
    
    var method = require("./method");
    var normalPageView = require('../common/bilog').normalPageView
    require("../cmd-lib/myDialog");
    require('../cmd-lib/toast');
    var loginCallback = null   // 保存调用登录dialog 时传入的函数 并在 登录成功后调用
    var touristLoginCallback = null // 保存游客登录的传入的回调函数
    var IframeMessenger = require('./iframe/iframe-messenger');
   var IframeMessengerList = {
    I_SHARE: new IframeMessenger({
        clientId: 'MAIN_I_SHARE_LOGIN',
        projectName: 'I_SHARE',
        ssoId: 'I_SHARE_SSO_LOGIN',
    }),
    I_SHARE_T0URIST_PURCHASE:new IframeMessenger({
        clientId: 'MAIN_I_SHARE_T0URIST_PURCHASE',
        projectName: 'I_SHARE',
        ssoId: 'I_SHARE_SSO_T0URIST_PURCHASE',
}),
I_SHARE_T0URIST_LOGIN:new IframeMessenger({
    clientId: 'MAIN_I_SHARE_T0URIST_LOGIN',
    projectName: 'I_SHARE',
    ssoId: 'I_SHARE_SSO_T0URIST_LOGIN'
})
   }

    function initIframeParams(successFun,iframeId,params){
       
        // 操作需等iframe加载完毕
        var $iframe =  $('#'+iframeId)[0]    
        // 建立通信
        IframeMessengerList[iframeId].addTarget($iframe);
       setTimeout(function(){
        IframeMessengerList[iframeId].send({a:'123123123'})
       },1000)
        // 发送初始数据
        $iframe.onload = function () {
            IframeMessengerList[iframeId].send({
                // 窗口打开
                isOpen: true,
                // 分类id
                cid: params.clsId,
                // 资料id
                fid: params.fid,
                callback:params.callback
            });
        }

        // 监听消息
        IframeMessengerList[iframeId].listen(function (res) {
            console.log('客户端监听-数据', res);
            if (res.userData) {
             //   loginInSuccess(res.userData, res.formData, successFun)
            } else {
               // loginInFail(res.formData);
            }
        })

        // 关闭弹窗按钮
        $('.dialog-box .close-btn').on('click',function () {
            // 主动关闭弹窗-需通知登录中心
            IframeMessengerList[iframeId].send({isOpen: false});
            closeRewardPop()
        })
    }
    function showLoginDialog(params,callback){
        loginCallback = callback
        var loginDialog = $('#login-dialog')
        normalPageView('loginResultPage')
        
        $("#dialog-box").dialog({
            html: loginDialog.html(),
            'closeOnClickModal': false
        }).open(initIframeParams(callback,'I_SHARE',params));
      }
      function showTouristPurchaseDialog(params, callback){ // 游客购买的回调函数
        touristLoginCallback = callback
        var touristPurchaseDialog = $('#tourist-purchase-dialog')
        $("#dialog-box").dialog({
            html: touristPurchaseDialog.html(),
            'closeOnClickModal': false
        }).open(initIframeParams(callback,'I_SHARE_T0URIST_PURCHASE',params)); 
      }
      function closeRewardPop(){
        $(".common-bgMask").hide();
        $(".detail-bg-mask").hide();
        $('#dialog-box').hide();
    }

    $('#dialog-box').on('click','.close-btn',function(e){
        closeRewardPop();
    })
      return {
        showLoginDialog:showLoginDialog,
        showTouristPurchaseDialog:showTouristPurchaseDialog
      }
});