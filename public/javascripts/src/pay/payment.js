define(function(require , exports , module){
    require("../cmd-lib/toast");
    require('../common/baidu-statistics.js').initBaiduStatistics('17cdd3f409f282dc0eeb3785fcf78a66')
    var api = require('../application/api');
    var method = require("../application/method");
    var code = method.getParam('code')
    var orderNo = method.getParam('orderNo');
    var checkStatus =  method.getParam('checkStatus')
    var isWeChat =  window.pageConfig.page&&window.pageConfig.page.isWeChat
    var isAliPay = window.pageConfig.page&&window.pageConfig.page.isAliPay
//    var  handleBaiduStatisticsPush = require('../common/baidu-statistics.js').handleBaiduStatisticsPush
   console.log('scanOrderInfo-start')
   alert(method.getParam('payPrice'))
   alert('goodsName-1:',method.getParam('goodsName'))
    scanOrderInfo()
    function scanOrderInfo() {
        $.ajax({
            url: api.pay.scanOrderInfo,
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
               alert('payPrice-2:',method.getParam('payPrice'))
                alert('goodsName-2:',method.getParam('goodsName'))
                var payPrice = (method.getParam('payPrice')/100).toFixed(2)
                var goodsName = method.getParam('goodsName')
                if(payPrice){
                    $('.pay-price .price').text(payPrice)
                }
                if(goodsName){
                    $('.goodsName').text(goodsName)
                }
                  if(res.data.needRedirect){
                      location.href = res.data.returnUrl
                      return
                  } 
                  if(isWeChat == 'true'){
                    wechatPay(res.data.appId,res.data.timeStamp,res.data.nonceStr,res.data.prepayId,res.data.paySign)
                }else if(isAliPay == 'true'){
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
                console.log('scanOrderInfo:',error)
                $.toast({
                    text:error||'scanOrderInfo错误',
                    delay : 3000,
                }) 
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
                  "package":"prepay_id=" +package,     
                  "signType":"MD5",         //微信签名方式：     
                  "paySign":paySign //微信签名 
               },
               function(res){
                   console.log('wechatPay:',res)
               if(res.err_msg == "get_brand_wcpay_request:ok"){ // 支付成功
                // if(checkStatus == 8){
                //     handleBaiduStatisticsPush('payFileResult',{payresult:1,orderid:orderNo,orderpaytype:'wechat'})
                // }
                // if(checkStatus == 10 || checkStatus == 13){
                //     handleBaiduStatisticsPush('payVipResult',{payresult:1,orderid:orderNo,orderpaytype:'wechat'})
                // }
                getOrderStatus(orderNo)
               }else if(res.err_msg == "get_brand_wcpay_request:fail"){ // 支付失败
            //    if(checkStatus == 8){
            //     handleBaiduStatisticsPush('payFileResult',{payresult:0,orderid:orderNo,orderpaytype:'wechat'})
            //    }
            //    if(checkStatus ==10 || checkStatus==13){
            //     handleBaiduStatisticsPush('payVipResult',{payresult:0,orderid:orderNo,orderpaytype:'wechat'})
            //    }
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
        location.href  = location.origin + '/pay/paymentresult?orderNo=' + orderNo
    }
  
    $(document).on('click','.pay-confirm',function(e){
        console.log('pay-confirm-start')
        scanOrderInfo()
        console.log('pay-confirm-end')
    })
});