// 游客现金文档支付结果-自有埋点
define("dist/common/bilog-module/payFileResultForVisit_bilog", [ "../bilog", "base64", "../../cmd-lib/util", "../../application/method", "../../report/config" ], function(require, exports, module) {
    var Bilog = require("../bilog");
    var Method = require("../../application/method");
    // 1：免费文档，3 在线文档 4 vip特权文档 5 付费文档 6 私有文档
    var ProductTypeMap = {
        1: "free",
        3: "online",
        4: "vipOnly",
        5: "cost"
    };
    /**
     * 上报数据
     * @param orderInfo 订单数据
     * @param fileInfo 文件详情
     * @param isSuccess 支付结果
     */
    function reportResult(orderInfo, fileInfo, isSuccess) {
        var commonData = Bilog.getBilogCommonData();
        commonData.eventType = "page";
        commonData.eventID = "SE009";
        commonData.eventName = "payFileResult";
        // 当前页面-游客购买
        commonData.pageID = "PC-M-FD";
        commonData.pageName = "资料详情页";
        commonData.pageURL = window.location.href;
        commonData.visitID = Method.getCookie("visitor_id");
        var classIdStr = [ fileInfo.classid1, fileInfo.classid2, fileInfo.classid3 ].filter(function(item) {
            return !!item;
        }).join("||");
        var classNameStr = [ fileInfo.classidName1, fileInfo.classidName2, fileInfo.classidName3 ].filter(function(item) {
            return !!item;
        }).join("||");
        // 各页面独有数据填充
        commonData.var = {
            // 支付结果（0失败、1成功）
            payResult: isSuccess ? 1 : 0,
            // 订单id
            orderID: orderInfo.orderNo,
            // 支付方式
            orderPayType: orderInfo.payType,
            // 订单实付价格
            orderPayPrice: orderInfo.payPrice,
            // 选中的优惠券ID
            couponID: orderInfo.vouchersId,
            // 选中的优惠券名称
            coupon: "",
            // 资料ID
            fileID: fileInfo.id,
            // 资料名称
            fileName: fileInfo.title,
            // 资料分类ID
            fileCategoryID: classIdStr,
            // 资料分类名称
            fileCategoryName: classNameStr,
            // 资料付费类型
            filePayType: ProductTypeMap[fileInfo.productType],
            // 资料格式
            fileFormat: fileInfo.format,
            // 资料生产方式-用户上传/编辑上传等
            fileProduceType: fileInfo.fileSourceChannel,
            // 资料合作来源-在资料详情页时存入cookie中
            fileCooType: Method.getCookie("bc") || "",
            // 资料上传者ID
            fileUploaderID: fileInfo.uid,
            // 资料原价
            filePrice: orderInfo.originalPrice,
            // 资料划线后价格
            fileSalePrice: orderInfo.payPrice
        };
        // 数据处理
        Bilog.reportToBlack(commonData);
    }
    return {
        reportResult: reportResult
    };
});