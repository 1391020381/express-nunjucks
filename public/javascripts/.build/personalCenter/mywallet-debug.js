define("dist/personalCenter/mywallet-debug", [ "./home-debug", "swiper-debug", "../common/recommendConfigInfo-debug", "../application/method-debug", "../common/template/swiper_tmp-debug.html", "../application/api-debug", "./template/homeRecentlySee-debug.html", "./template/vipPrivilegeList-debug.html", "../application/effect-debug", "../application/checkLogin-debug" ], function(require, exports, module) {
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