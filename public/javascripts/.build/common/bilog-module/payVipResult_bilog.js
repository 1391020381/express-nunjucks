// vip支付结果-自有埋点
define("dist/common/bilog-module/payVipResult_bilog", [ "../bilog", "base64", "../../cmd-lib/util", "../../application/method", "../../report/config", "../../application/urlConfig" ], function(require, exports, module) {
    var Bilog = require("../bilog");
    /**
     * 上报数据
     * @param orderInfo 订单数据
     * @param isSuccess 支付结果
     */
    function reportResult(orderInfo, isSuccess) {
        var commonData = Bilog.getBilogCommonData();
        commonData.eventType = "page";
        commonData.eventID = "SE011";
        commonData.eventName = "payVipResult";
        // 当前页面
        commonData.pageID = "PC-M-PAY-VIP-QR";
        commonData.pageName = "支付页-VIP-支付页";
        commonData.pageURL = window.location.href;
        // 各页面独有数据填充
        commonData.var = {
            payResult: isSuccess ? 1 : 0,
            orderID: orderInfo.reportData.orderId,
            couponID: orderInfo.reportData.couponID,
            coupon: "",
            orderPayType: orderInfo.reportData.orderPayCode,
            orderPayPrice: orderInfo.reportData.payPrice,
            vipID: orderInfo.reportData.id,
            vipName: orderInfo.reportData.name,
            vipPrice: orderInfo.reportData.payPrice
        };
        // 数据处理
        Bilog.reportToBlack(commonData);
    }
    return {
        reportResult: reportResult
    };
});