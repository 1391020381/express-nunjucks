define("dist/pay/payment", [ "../cmd-lib/toast", "../common/baidu-statistics", "../application/method", "../application/api" ], function(require, exports, module) {
    require("../cmd-lib/toast");
    require("../common/baidu-statistics").initBaiduStatistics("17cdd3f409f282dc0eeb3785fcf78a66");
    var api = require("../application/api");
    var method = require("../application/method");
    var orderNo = method.getParam("orderNo");
    var code = method.getParam("code");
    var goodsName = method.getParam("goodsName");
    var checkStatus = method.getParam("checkStatus");
    var payPrice = (method.getParam("payPrice") / 100).toFixed(2);
    var isWeChat = window.pageConfig.page && window.pageConfig.page.isWeChat;
    var isAliPay = window.pageConfig.page && window.pageConfig.page.isAliPay;
    var handleBaiduStatisticsPush = require("../common/baidu-statistics").handleBaiduStatisticsPush;
    $(".pay-price .price").text(payPrice);
    $(".goodsName").text(goodsName);
    scanOrderInfo();
    function scanOrderInfo() {
        $.ajax({
            url: api.pay.scanOrderInfo,
            type: "POST",
            data: JSON.stringify({
                orderNo: orderNo,
                code: code,
                payType: isWeChat == "true" ? "wechat" : "alipay",
                host: location.origin
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function(res) {
                console.log("scanOrderInfo:", res);
                if (res.code == "0") {
                    if (res.data.needRedirect) {
                        location.href = res.data.returnUrl;
                        return;
                    }
                    if (isWeChat == "true") {
                        wechatPay(res.data.appId, res.data.timeStamp, res.data.nonceStr, res.data.prepayId, res.data.paySign);
                    } else if (isAliPay == "true") {
                        aliPay(res.data.aliPayUrl);
                    }
                } else {
                    $.toast({
                        text: res.msg || "scanOrderInfo错误",
                        delay: 3e3
                    });
                }
            },
            error: function(error) {
                console.log("scanOrderInfo:", error);
            }
        });
    }
    function wechatPay(appId, timeStamp, nonceStr, package, paySign) {
        // prepayId 对应 package
        function onBridgeReady() {
            WeixinJSBridge.invoke("getBrandWCPayRequest", {
                appId: appId,
                //公众号名称，由商户传入     
                timeStamp: timeStamp,
                //时间戳，自1970年以来的秒数     
                nonceStr: nonceStr,
                //随机串     
                "package": "prepay_id=" + package,
                signType: "MD5",
                //微信签名方式：     
                paySign: paySign
            }, function(res) {
                console.log("wechatPay:", res);
                if (res.err_msg == "get_brand_wcpay_request:ok") {
                    // 支付成功
                    if (checkStatus == 8) {
                        handleBaiduStatisticsPush("payFileResult", {
                            payresult: 1,
                            orderid: orderNo,
                            orderpaytype: "wechat"
                        });
                    }
                    if (checkStatus == 10 || checkStatus == 13) {
                        handleBaiduStatisticsPush("payVipResult", {
                            payresult: 1,
                            orderid: orderNo,
                            orderpaytype: "wechat"
                        });
                    }
                    getOrderStatus(orderNo);
                } else if (res.err_msg == "get_brand_wcpay_request:fail") {
                    // 支付失败
                    if (checkStatus == 8) {
                        handleBaiduStatisticsPush("payFileResult", {
                            payresult: 0,
                            orderid: orderNo,
                            orderpaytype: "wechat"
                        });
                    }
                    if (checkStatus == 10 || checkStatus == 13) {
                        handleBaiduStatisticsPush("payVipResult", {
                            payresult: 0,
                            orderid: orderNo,
                            orderpaytype: "wechat"
                        });
                    }
                    $.toast({
                        text: "支付失败",
                        delay: 3e3
                    });
                    getOrderStatus(orderNo);
                }
            });
        }
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
    function aliPay(aliString) {
        // sessionStorage.setItem("aliString", aliString);
        // location.href = location.origin + '/pay/aliPayMidPage'
        $(".payment").html(aliString);
        $("form").attr("target", "_blank");
    }
    function getOrderStatus(orderNo) {
        location.href = location.origin + "/pay/paymentresult?orderNo=" + orderNo;
    }
    $(document).on("click", ".pay-confirm", function(e) {
        console.log("pay-confirm");
        scanOrderInfo();
    });
});