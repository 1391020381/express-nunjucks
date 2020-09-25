define(function(require , exports , module){
    require("../cmd-lib/toast2");
    require('../common/baidu-statistics.js').initBaiduStatistics('17cdd3f409f282dc0eeb3785fcf78a66')
    var api = require('../application/api');
    var method = require("../application/method");
    var code = method.getParam('code')
    var orderNo = method.getParam('orderNo');
    var platformCode = method.getParam('platformCode');//平台编码
    var host = method.getParam('host');//域名来源
    var checkStatus =  method.getParam('checkStatus')
    var isWeChat =  window.pageConfig.page&&window.pageConfig.page.isWeChat
    var isAliPay = window.pageConfig.page&&window.pageConfig.page.isAliPay
    var urlConfig = require('../application/urlConfig')
//    var  handleBaiduStatisticsPush = require('../common/baidu-statistics.js').handleBaiduStatisticsPush
     var env = window.env 
     var urlList = {
         dev:'//dev-ishare.iask.com.cn',
         test:'//test-ishare.iask.com.cn',
         pre:'//pre-ishare.iask.com.cn',
         prod:'//ishare.iask.sina.com.cn'
     }
   console.log('env:',env,urlList[env])
 
    scanOrderInfo()
    function scanOrderInfo() {
        $.ajax({
            url:  urlList[env] + api.pay.scanOrderInfo,
            type: "POST",
            data: JSON.stringify({
                orderNo:orderNo,
                code:code,
                payType:isWeChat== 'true'?'wechat':'alipay',
                host:location.origin
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (res) {
                console.log('scanOrderInfo:',res)
               if(res.code == '0'){
                var payPrice = (method.getParam('payPrice')/100).toFixed(2)
                var goodsName = method.getParam('goodsName')
                if(payPrice!=='0.00'){
                    $('.pay-price .price').text(payPrice)
                }
                if(goodsName){
                    $('.goodsName').text(goodsName)
                }
                console.log('needRedirect:',res.data.needRedirect)
                  if(res.data.needRedirect){
                      setTimeout(function(){
                        location.href = res.data.returnUrl
                        return
                      },200)
                  }else{
                    $(".payment").removeClass('hide');
                    if(isWeChat == 'true'){
                        wechatPay(res.data.appId,res.data.timeStamp,res.data.nonceStr,res.data.prepayId,res.data.paySign)
                    }else if(isAliPay == 'true'){
                        aliPay(res.data.aliPayUrl)
                    }
                  } 
               }else{
                $.toast({
                    text:res.msg||'scanOrderInfo错误',
                    delay : 3000,
                }) 
               }
            },
            error:function(error){
                console.log('scanOrderInfo:',error)
                $.toast({
                    text:error.msg||'scanOrderInfo错误',
                    delay : 3000,
                }) 
            }
        })
    }
    function wechatPay(appId,timeStamp,nonceStr,package,paySign){  // prepayId 对应 package
        console.log('wechatPay:',appId,timeStamp,nonceStr,package,paySign)
        function onBridgeReady(){
            WeixinJSBridge.invoke(
               'getBrandWCPayRequest', {
                  "appId":appId,     //公众号名称，由商户传入     
                  "timeStamp":timeStamp,         //时间戳，自1970年以来的秒数     
                  "nonceStr":nonceStr, //随机串     
                  "package":"prepay_id=" +package,     
                  "signType":"MD5",         //微信签名方式：     
                  "paySign":paySign //微信签名 
               },
               function(res){
                   console.log('wechatPay:',res)
               if(res.err_msg == "get_brand_wcpay_request:ok"){ // 支付成功
                getOrderStatus(orderNo)
               }else if(res.err_msg == "get_brand_wcpay_request:fail"){ // 支付失败
                console.log('wechatPay支付失败:',res)
                    $.toast({
                        text:"支付失败",
                        delay : 3000,
                    }) 
                    getOrderStatus(orderNo)
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
        // sessionStorage.setItem("aliString", aliString);
        // location.href = location.origin + '/pay/aliPayMidPage'
        $('.payment').html(aliString)
        $('form').attr("target","_blank")
    }
    function getOrderStatus(orderNo){
        if(platformCode=='m'){ //m端跳转公共的支付空白页 然后跳相关的页面(m端付费文档微信浏览器)
            var redirectUrl=host+"/node/payInfo?orderNo="+orderNo+"&mark=wx";
            // location.href='http://ishare.iask.sina.com.cn/pay/payRedirect?redirectUrl='+encodeURIComponent(redirectUrl); 
            location.href= urlConfig.ajaxUrl + '/pay/payRedirect?redirectUrl='+encodeURIComponent(redirectUrl); 
        }else{ //直接跳结果 urlConfig
            // location.href  ='http://ishare.iask.sina.com.cn/pay/paymentresult?orderNo=' + orderNo
            location.href  = urlConfig.ajaxUrl +'/pay/paymentresult?orderNo=' + orderNo
        }
   
    }
  
    $(document).on('click','.pay-confirm',function(e){
        console.log('pay-confirm-start')
        scanOrderInfo()
        console.log('pay-confirm-end')
    })
});