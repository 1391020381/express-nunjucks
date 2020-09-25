define("dist/detailb/report-debug", [ "../cmd-lib/util-debug", "../application/method-debug" ], function(require, exports, module) {
    var utils = require("../cmd-lib/util-debug");
    var method = require("../application/method-debug");
    var payTypeMapping = [ "", "免费", "下载券", "现金", "仅供在线阅读" ];
    var userType = [ "", "普通", "个人", "机构" ];
    var infoMessage = [ "否", "是" ];
    var sourceName_var = "";
    var docSourceType_var = "";
    var docDiscount_var = "";
    //有无折扣
    var orderBuyType_var = "";
    //购买方式 -立即 或者 8折购
    var ifVIP_pvar = infoMessage[window.pageConfig.params.isVip];
    var ifLogin_pvar = infoMessage[0];
    var channelName_var = "";
    //页面类型 办公频道或者其他
    if (!method.getCookie("cuk")) {
        ifVIP_pvar = "未知";
        ifLogin_pvar = infoMessage[0];
    } else {
        ifLogin_pvar = infoMessage[1];
    }
    if (utils.is360cookie(window.pageConfig.params.g_fileId)) {
        sourceName_var = "360";
    } else {
        sourceName_var = "其他";
    }
    docPayType_var = payTypeMapping[pageConfig.params.file_state];
    if (pageConfig.page.isDownload === "n") {
        docPayType_var = "仅在线阅读";
    }
    if (pageConfig.page.fileSourceChannel) {
        docSourceType_var = pageConfig.page.fileSourceChannel + "-" + userType[pageConfig.page.userTypeId];
    }
    if (pageConfig.params.isVip == 1 && pageConfig.params.vipDiscountFlag == 1 && pageConfig.params.ownVipDiscountFlag == 1) {
        docDiscount_var = "有折扣（8折）";
        orderBuyType_var = "加入vip8折购买";
    } else {
        docDiscount_var = "无折扣";
        orderBuyType_var = "立即购买";
    }
    if (pageConfig.page.attr === "other") {
        channelName_var = "其他";
    } else if (pageConfig.page.attr === "office") {
        channelName_var = "办公频道";
    }
    //详情页初始化页面上报数据
    var gioReportInit = {
        docTypeLevel1_var: pageConfig.params.classidName1 || "",
        //文档所属的一级分类
        docTypeLevel2_var: pageConfig.params.classidName2 || "",
        //文档所属的二级分类
        docTypeLevel3_var: pageConfig.params.classidName3 || "",
        //文档所属的三级分类
        docId_var: pageConfig.params.g_fileId || "",
        //文档id
        docTitle_var: pageConfig.params.file_title || "",
        //文档标题
        docPayType_var: docPayType_var,
        //文档付费类型
        docFormType_var: pageConfig.params.file_format || "",
        //文档格式
        docSourceType_var: docSourceType_var,
        //文档来源
        channelName_var: channelName_var,
        //办公频道,其它
        ifVIP_pvar: ifVIP_pvar,
        //是否vip
        ifLogin_pvar: ifLogin_pvar,
        //是否登录
        lastEntryName_pvar: utils.findRefer(),
        //入口名称
        sourceName_var: sourceName_var
    };
    //详情页上报数据事件级  详情页 公共字段
    window.gioData = {
        docId_var: pageConfig.params.g_fileId,
        docTitle_var: pageConfig.params.file_title,
        docFormType_var: pageConfig.params.file_format,
        docSourceType_var: docSourceType_var,
        //文档来源
        docPayType_var: docPayType_var,
        //文档付费类型
        sourceName_var: sourceName_var,
        //合作渠道类型
        channelName_var: channelName_var,
        //办公频道,其它
        docTypeLevel1_var: pageConfig.params.classidName1 || "",
        docTypeLevel2_var: pageConfig.params.classidName2 || "",
        docTypeLevel3_var: pageConfig.params.classidName3 || ""
    };
    //现金文档购买gio上报数据
    window.gioPayDocReport = {
        orderId_var: "",
        //订单id
        docTypeLevel1_var: pageConfig.params.classidName1 || "",
        //文档一级分类
        docTypeLevel2_var: pageConfig.params.classidName2 || "",
        //文档二级分类
        docTypeLevel3_var: pageConfig.params.classidName3 || "",
        //文档三级分类
        docId_var: pageConfig.params.g_fileId,
        //文档id
        docTitle_var: pageConfig.params.file_title,
        //文档名称
        docPayType_var: "",
        //文档付费类型 免费 下载券 现金 vip免费 在线阅读
        docFormType_var: pageConfig.params.file_format,
        //文档格式
        docSourceType_var: docSourceType_var,
        //文档来源
        sourceName_var: sourceName_var,
        //合作渠道类型
        docPayPrice_var: pageConfig.params.moneyPrice * 100,
        //文档金额
        docDiscount_var: docDiscount_var,
        //文档折扣有折扣（8折），无折扣
        orderBuyType_var: orderBuyType_var,
        //购买方式  立即购买，加入vip8折购买
        orderPayType_var: "二维码合一",
        //支付方式
        channelName_var: channelName_var,
        //办公频道,其它
        fileUid_var: pageConfig.params.file_uid
    };
    var pageReport = $.extend({}, gioData);
    if (pageConfig.params.g_permin == "3") {
        pageReport.docPrice_var = pageConfig.params.moneyPrice * 100;
    } else {
        pageReport.docVol_var = pageConfig.params.file_volume ? pageConfig.params.file_volume * 1 : 0;
    }
    pageReport.fileUid_var = pageConfig.params.file_uid;
    if (gio) {
        //详情页 页面浏览上报-不是办公频道的
        if (pageConfig.page.attr === "office") {
            gioReportInit.officeChannel_pvar = "office";
            gioReportInit.pageType_pvar = "officeDetail";
        }
        gio("page.set", gioReportInit);
    }
    //详情页事件级上报
    __pc__.gioTrack("docDetailView", pageReport);
    //360流量上报
    if (is360cookie(pageConfig.params.g_fileId) || is360cookie("360")) {
        __pc__.gioTrack("docDetailVisitByChannel", pageReport);
    }
});