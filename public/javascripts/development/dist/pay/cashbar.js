/*! ishare_pc_website
*author:Jersey */

define("dist/pay/cashbar",[],function(a,b,c){function d(){WeixinJSBridge.invoke("getBrandWCPayRequest",{appId:window.wechatPayData.appId,timeStamp:window.wechatPayData.timeStamp,nonceStr:window.wechatPayData.nonceStr,"package":window.wechatPayData["package"],signType:window.wechatPayData.signType,paySign:window.wechatPayData.paySign},function(a){var b=$("#ip-goodsType").val(),c="成功购买爱问共享资料VIP";if(1==b&&(c="成功购买资料"),8==b&&(c="成功购买下载特权"),"get_brand_wcpay_request:ok"==a.err_msg){var d='<div class="pay-success-main">\n        <h2 class="success-title v-middle">恭喜你</h2>\n        <p>'+c+"</p>\n    </div>";$(".pay-result").html(d)}else{var d='<div class="pay-success-main">\n        <h2 class="cancel-title v-middle">您已取消支付！</h2>\n        <p></p>\n    </div>';$(".pay-result").html(d)}})}function e(){"undefined"==typeof WeixinJSBridge?document.addEventListener?document.addEventListener("WeixinJSBridgeReady",d,!1):document.attachEvent&&(document.attachEvent("WeixinJSBridgeReady",d),document.attachEvent("onWeixinJSBridgeReady",d)):d()}$(function(){var a=navigator.userAgent.toLowerCase();if(-1!=a.indexOf("micromessenger")){var b=$("#ip-vip").val();if(b){var c='<div class="pay-success-main">\n        <h2 class="cancel-title v-middle">'+b+"</h2>\n    </div>";return void $(".pay-result").html(c)}var d=$("#ip-appId").val(),f=$("#ip-timeStamp").val(),g=$("#ip-nonceStr").val(),h=$("#ip-prepay_id").val(),i=$("#ip-paySign").val();d&&f&&g&&h&&i&&(window.wechatPayData={appId:d,timeStamp:f,nonceStr:g,"package":"prepay_id="+h,signType:"MD5",paySign:i},e())}else-1!=a.indexOf("alipayclient")||$(".pay-result").html("请使用微信或支付宝支付!")})});
//# sourceMappingURL=dist/js-source-map/ishare-web-pc.js.map