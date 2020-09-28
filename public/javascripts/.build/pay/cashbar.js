define("dist/pay/cashbar", [], function(require, exports, module) {
    // var $ = require("$");
    // require("../common/baidu-statistics");
    $(function() {
        var ua = navigator.userAgent.toLowerCase();
        if (ua.indexOf("micromessenger") != -1) {
            var tip = $("#ip-vip").val();
            if (tip) {
                var cnt = '<div class="pay-success-main">\n' + '        <h2 class="cancel-title v-middle">' + tip + "</h2>\n" + "    </div>";
                $(".pay-result").html(cnt);
                return;
            }
            var appId = $("#ip-appId").val();
            var timeStamp = $("#ip-timeStamp").val();
            var nonceStr = $("#ip-nonceStr").val();
            var package = $("#ip-prepay_id").val();
            var paySign = $("#ip-paySign").val();
            if (appId && timeStamp && nonceStr && package && paySign) {
                window.wechatPayData = {
                    appId: appId,
                    timeStamp: timeStamp,
                    nonceStr: nonceStr,
                    "package": "prepay_id=" + package,
                    signType: "MD5",
                    paySign: paySign
                };
                wechatJSAPI();
            }
        } else if (ua.indexOf("alipayclient") != -1) {} else {
            //alert("你想干嘛？？？");
            $(".pay-result").html("请使用微信或支付宝支付!");
        }
    });
    function onBridgeReady() {
        WeixinJSBridge.invoke("getBrandWCPayRequest", {
            appId: window.wechatPayData.appId,
            //公众号名称，由商户传入
            timeStamp: window.wechatPayData.timeStamp,
            //时间戳，自1970年以来的秒数
            nonceStr: window.wechatPayData.nonceStr,
            //随机串
            "package": window.wechatPayData["package"],
            signType: window.wechatPayData.signType,
            //微信签名方式：
            paySign: window.wechatPayData.paySign
        }, function(res) {
            var goodsType = $("#ip-goodsType").val();
            var text = "成功购买爱问共享资料VIP";
            if (goodsType == 1) {
                text = "成功购买资料";
            }
            if (goodsType == 8) {
                text = "成功购买下载特权";
            }
            if (res.err_msg == "get_brand_wcpay_request:ok") {
                var cnt = '<div class="pay-success-main">\n' + '        <h2 class="success-title v-middle">恭喜你</h2>\n' + "        <p>" + text + "</p>\n" + "    </div>";
                $(".pay-result").html(cnt);
            } else {
                var cnt = '<div class="pay-success-main">\n' + '        <h2 class="cancel-title v-middle">您已取消支付！</h2>\n' + "        <p></p>\n" + "    </div>";
                $(".pay-result").html(cnt);
            }
        });
    }
    function wechatJSAPI() {
        if (typeof WeixinJSBridge == "undefined") {
            if (document.addEventListener) {
                document.addEventListener("WeixinJSBridgeReady", onBridgeReady, false);
            } else if (document.attachEvent) {
                document.attachEvent("WeixinJSBridgeReady", onBridgeReady);
                document.attachEvent("onWeixinJSBridgeReady", onBridgeReady);
            }
        } else {
            onBridgeReady();
        }
    }
});