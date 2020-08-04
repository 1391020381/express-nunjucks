define("dist/personalCenter/mywallet-debug", [ "./home-debug", "swiper-debug", "../common/recommendConfigInfo-debug", "../application/method-debug", "../common/template/swiper_tmp-debug.html", "../application/api-debug", "./template/homeRecentlySee-debug.html", "./template/vipPrivilegeList-debug.html", "../application/effect-debug", "../application/checkLogin-debug", "../application/login-debug", "../cmd-lib/jqueryMd5-debug", "../application/iframe/iframe-parent-debug", "../application/iframe/messenger-debug", "../cmd-lib/myDialog-debug", "../cmd-lib/toast-debug", "../common/bindphone-debug", "../common/baidu-statistics-debug", "../common/bilog-debug", "base64-debug", "../cmd-lib/util-debug", "../report/config-debug" ], function(require, exports, module) {
    var type = window.pageConfig && window.pageConfig.page.type;
    var getUserCentreInfo = require("./home-debug").getUserCentreInfo;
    var isLogin = require("../application/effect-debug").isLogin;
    if (type == "mywallet") {
        isLogin(initCallback, true);
    }
    function initCallback() {
        $("#dialog-box").dialog({
            html: $("#mywallet-tip-dialog").html()
        }).open();
        getUserCentreInfo();
    }
});