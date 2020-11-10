define("dist/pay/report", [], function(require, exports, module) {
    //gio支付页上报数据
    return {
        //gio上报-vip立即支付
        vipPayClick: function(reportVipData) {
            __pc__.gioTrack("vipRechargePayClick", reportVipData);
        },
        //gio上报-购买vip成功
        vipPaySuccess: function(reportVipData) {
            __pc__.gioTrack("vipRechargePaySuccess", reportVipData);
        },
        //gio上报-下载特权立即支付
        privilegePayClick: function(reportPrivilegeData) {
            __pc__.gioTrack("privilegeRechargePayClick", reportPrivilegeData);
        },
        //gio上报-购买特权成功
        privilegePaySuccess: function(reportPrivilegeData) {
            __pc__.gioTrack("privilegeRechargePaySuccess", reportPrivilegeData);
        },
        //gio上报-文件购买立即支付
        filePayClick: function(gioPayDocReport) {
            __pc__.gioTrack("docBuyPagePayClick", gioPayDocReport);
        },
        //gio上报-购买文档成功
        docPaySuccess: function(reportFileData) {
            __pc__.gioTrack("docPaySuccess", reportFileData);
        }
    };
});