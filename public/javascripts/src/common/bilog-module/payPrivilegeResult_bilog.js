// 特权支付结果-自有埋点
define(function (require, exports, module) {
    var Bilog = require("../bilog");
    var Method = require("../../application/method");

    /**
     * 上报数据
     * @param orderInfo 订单数据
     * @param fileInfo 文件详情
     * @param isSuccess 支付结果
     */
    function reportResult(orderInfo, fileInfo, isSuccess) {
        var commonData = Bilog.getBilogCommonData();
        commonData.eventType = 'page';
        commonData.eventID = 'SE013';
        commonData.eventName = 'payPrivilegeResult';
        // 当前页面
        commonData.pageID = 'PC-M-PAY-PRI-QR';
        commonData.pageName = '支付页-下载特权-支付页';
        commonData.pageURL = window.location.href;

        var classIdStr = [fileInfo.classid1, fileInfo.classid2, fileInfo.classid3]
            .filter(function (item) {return !!item}).join("||");
        var classNameStr = [fileInfo.classidName1, fileInfo.classidName2, fileInfo.classidName3]
            .filter(function (item) {return !!item}).join("||");

        // 各页面独有数据填充
        commonData.var = {
            // 支付结果（0失败、1成功）
            payResult: isSuccess ? 1 : 0,
            // 订单id
            orderID: orderInfo.reportData.orderId,
            // 支付方式
            orderPayType: orderInfo.reportData.orderPayCode,
            // 订单实付价格
            orderPayPrice: orderInfo.reportData.payPrice,
            // 选中的优惠券ID
            couponID: orderInfo.reportData.couponID,
            // 选中的优惠券名称
            coupon: '',
            privilegeID: orderInfo.reportData.id,
            privilegeName: orderInfo.reportData.name,
            privilegePrice: orderInfo.reportData.payPrice,

            // 资料ID
            fileID: fileInfo.id,
            // 资料名称
            fileName: fileInfo.title,
            // 资料分类ID
            fileCategoryID: classIdStr,
            // 资料分类名称
            fileCategoryName: classNameStr,
            // 资料付费类型
            filePayType: fileInfo.productType,
            // 资料格式
            fileFormat: fileInfo.format,
            // 资料生产方式-用户上传/编辑上传等
            fileProduceType: fileInfo.fileSourceChannel,
            // 资料合作来源-在资料详情页时存入cookie中
            fileCooType: Method.getCookie('bc') || '',
            // 资料上传者ID
            fileUploaderID: fileInfo.uid,
        }

        // 数据处理
        Bilog.reportToBlack(commonData)
    }

    return {
        reportResult: reportResult
    }
})