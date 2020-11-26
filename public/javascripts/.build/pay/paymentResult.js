define("dist/pay/paymentResult", [ "../common/baidu-statistics", "../application/method", "../cmd-lib/toast2", "../application/api", "../application/urlConfig", "./payRestult.html" ], function(require, exports, module) {
    console.log("聚合支付码");
    require("../common/baidu-statistics").initBaiduStatistics("17cdd3f409f282dc0eeb3785fcf78a66");
    // require("../cmd-lib/toast");
    require("../cmd-lib/toast2");
    var api = require("../application/api");
    var method = require("../application/method");
    var orderNo = method.getParam("orderNo");
    var paymentRestult = require("./payRestult.html");
    var handleBaiduStatisticsPush = require("../common/baidu-statistics").handleBaiduStatisticsPush;
    getOrderInfo();
    // 绑定重新付费
    $(document).on("click", ".btn-wrap", function(e) {
        console.log("重新支付");
        $.toast({
            text: "请重新扫码支付",
            delay: 3e3
        });
    });
    function getOrderInfo() {
        $.ajax({
            url: api.order.getOrderInfo,
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
                    $(".payment .payment-content").html(_paymentRestultTemplate);
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
                        text: res.message,
                        delay: 3e3
                    });
                    var url = location.href;
                    var message = JSON.stringify({
                        orderNo: orderNo
                    }) + JSON.stringify(data.message);
                    unloginObj.reportOrderError(url, message);
                }
            },
            error: function(error) {
                console.log("getOrderInfo:", error);
            }
        });
    }
    function reportOrderError(url, message) {
        // 上报错误
        $.ajax({
            type: "post",
            url: api.order.reportOrderError,
            headers: {
                Authrization: method.getCookie("cuk")
            },
            contentType: "application/json;charset=utf-8",
            data: JSON.stringify({
                url: url,
                message: message,
                userId: ""
            }),
            success: function(response) {
                console.log("reportOrderError:", response);
            },
            complete: function() {}
        });
    }
});