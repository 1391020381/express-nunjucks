define(function(require , exports , module){
    require("../cmd-lib/toast");
    var api = require('../application/api');
    var method = require("../application/method");
    var orderNo = method.getParam('orderNo');
    var code = method.getParam('code')
    var isWeChat =  window.pageConfig.page&&window.pageConfig.page.isWeChat
    var isAliPay = window.pageConfig.page&&window.pageConfig.page.isAliPay
    scanOrderInfo()
    function scanOrderInfo() {
        $.ajax({
            url: api.pay.scanOrderInfo,
            type: "POST",
            data: JSON.stringify({
                orderNo:orderNo,
                code:code,
                payType:isWeChat?'wechat':'alipay',
                host:location.host
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (res) {
               if(res.code == '0'){
                  if(res.data.returnUrl){
                      location.href = res.data.returnUrl
                  } 
                  if(isWeChat){
                    wechatPay(res.data.appId,res.data.timeStamp,res.data.nonceStr,res.data.prepayId,res.data.paySign)
                }else if(isAliPay){
                    aliPay(res.data.aliPayUrl)
                }
               }else{
                $.toast({
                    text:res.msg||'scanOrderInfo错误',
                    delay : 3000,
                }) 
               }
            },
            error:function(error){
                console.log('queryUserBindInfo:',error)
            }
        })
    }
    function wechatPay(appId,timeStamp,nonceStr,package,paySign){  // prepayId 对应 package
        function onBridgeReady(){
            WeixinJSBridge.invoke(
               'getBrandWCPayRequest', {
                  "appId":appId,     //公众号名称，由商户传入     
                  "timeStamp":timeStamp,         //时间戳，自1970年以来的秒数     
                  "nonceStr":nonceStr, //随机串     
                  "package":package,     
                  "signType":"MD5",         //微信签名方式：     
                  "paySign":paySign //微信签名 
               },
               function(res){
               if(res.err_msg == "get_brand_wcpay_request:ok"){ // 支付成功
                 getOrderStatus()
               }else if(res.err_msg == "get_brand_wcpay_request:fail"){ // 支付失败
                $.toast({
                    text:"支付失败",
                    delay : 3000,
                }) 
               }
            }); 
         }
         if (typeof WeixinJSBridge == "undefined"){
            if( document.addEventListener ){
                document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
            }else if (document.attachEvent){
                document.attachEvent('WeixinJSBridgeReady', onBridgeReady); 
                document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
            }
         }else{
            onBridgeReady();
         }
    }
    function aliPay(aliString){
        $('body').append(aliString)
        $('form').attr("target","_blank")
    }
    function getOrderStatus(){
        $.ajax({
            url: api.order.getOrderStatus,
            type: "POST",
            data: JSON.stringify({
                orderNo:orderNo
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (res) {
               if(res.code == 0){
                if(res.data == '2'){ // 支付成功
                    location.href  = location.host + '/pay/paymentresult?orderNo=' + orderNo
               }else if(res.data =='3'||res.data =='5'){  // 支付失败页面
                    getOrderStatus()
               }
               }
            },
            error:function(error){
                console.log('getOrderStatus:',error)
            }
        })
    }

    $('.pay-confirm').click(function(e){
        scanOrderInfo()
    })
});