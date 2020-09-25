define("dist/pay/paymentResult", [ "../common/baidu-statistics", "../application/method", "../cmd-lib/toast", "../application/api", "../application/urlConfig", "./payRestult.html", "./go2MinApp", "../cmd-lib/jweixin-1.6.0", "../cmd-lib/util" ], function(require, exports, module) {
    console.log("聚合支付码");
    require("../common/baidu-statistics").initBaiduStatistics("17cdd3f409f282dc0eeb3785fcf78a66");
    require("../cmd-lib/toast");
    var api = require("../application/api");
    var method = require("../application/method");
    var orderNo = method.getParam("orderNo");
    var paymentRestult = require("./payRestult.html");
    var handleBaiduStatisticsPush = require("../common/baidu-statistics").handleBaiduStatisticsPush;
    getOrderInfo();
    require("./go2MinApp");
    var env = window.env;
    var urlList = {
        dev: "//dev-ishare.iask.com.cn",
        test: "//test-ishare.iask.com.cn",
        pre: "//pre-ishare.iask.com.cn",
        prod: "//ishare.iask.sina.com.cn/"
    };
    console.log("env:", env, urlList[env]);
    function getOrderInfo() {
        $.ajax({
            url: urlList[env] + api.order.getOrderInfo,
            type: "POST",
            data: JSON.stringify({
                orderNo: orderNo
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function(res) {
                console.log("getOrderInfo:", res);
                var formatDate = method.formatDate;
                Date.prototype.format = formatDate;
                if (res.code == "0") {
                    // 支付成功
                    res.data.payPrice = (res.data.payPrice / 100).toFixed(2);
                    res.data.orderTime = new Date(res.data.orderTime).format("yyyy-MM-dd");
                    var _paymentRestultTemplate = template.compile(paymentRestult)({
                        orderInfo: res.data
                    });
                    $(".payment").html(_paymentRestultTemplate);
                    if (res.goodsType == 1) {
                        handleBaiduStatisticsPush("payFileResult", {
                            payresult: 1,
                            orderid: orderNo,
                            orderpaytype: res.data.payType
                        });
                    }
                    if (res.goodsType == 2) {
                        handleBaiduStatisticsPush("payVipResult", {
                            payresult: 1,
                            orderid: orderNo,
                            orderpaytype: res.data.payType
                        });
                    }
                } else {
                    $.toast({
                        text: res.msg,
                        delay: 3e3
                    });
                }
            },
            error: function(error) {
                console.log("getOrderInfo:", error);
            }
        });
    }
});