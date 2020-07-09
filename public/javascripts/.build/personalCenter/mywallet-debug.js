define("dist/personalCenter/mywallet-debug", [ "./home-debug", "swiper-debug", "../common/recommendConfigInfo-debug", "../application/method-debug", "../common/template/swiper_tmp-debug.html", "../application/api-debug", "./template/homeRecentlySee-debug.html", "./template/vipPrivilegeList-debug.html", "./effect-debug", "../application/checkLogin-debug", "../application/app-debug", "../application/element-debug", "../application/template-debug", "../application/extend-debug", "../common/bilog-debug", "base64-debug", "../cmd-lib/util-debug", "../report/config-debug", "../application/helper-debug", "//static3.iask.cn/resource/js/plugins/pc.iask.login.min-debug" ], function(require, exports, module) {
    var type = window.pageConfig && window.pageConfig.page.type;
    var getUserCentreInfo = require("./home-debug").getUserCentreInfo;
    if (type == "mywallet") {
        $("#dialog-box").dialog({
            html: $("#mywallet-tip-dialog").html()
        }).open();
        getUserCentreInfo();
    }
});