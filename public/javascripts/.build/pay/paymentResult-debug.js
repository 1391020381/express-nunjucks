define("dist/pay/paymentResult-debug", [ "../cmd-lib/toast-debug", "../application/api-debug", "../application/method-debug", "./payRestult-debug.html" ], function(require, exports, module) {
    console.log("聚合支付码");
    require("../cmd-lib/toast-debug");
    var api = require("../application/api-debug");
    var method = require("../application/method-debug");
    var orderNo = method.getParam("orderNo");
    var paymentRestult = require("./payRestult-debug.html");
    getOrderInfo();
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
                    var _myuploadsTemplate = template.compile(paymentRestult)({
                        orderInfo: res.data
                    });
                    $(".personal-center-myuploads").html(_myuploadsTemplate);
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