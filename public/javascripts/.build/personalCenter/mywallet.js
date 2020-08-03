define("dist/personalCenter/mywallet", [ "./home", "swiper", "../common/recommendConfigInfo", "../application/method", "../common/template/swiper_tmp.html", "../application/api", "./template/homeRecentlySee.html", "./template/vipPrivilegeList.html", "../application/effect", "../application/checkLogin", "../application/login", "../cmd-lib/jqueryMd5", "../cmd-lib/myDialog", "../cmd-lib/toast", "../common/bindphone", "../common/baidu-statistics", "../common/bilog", "base64", "../cmd-lib/util", "../report/config" ], function(require, exports, module) {
    var type = window.pageConfig && window.pageConfig.page.type;
    var getUserCentreInfo = require("./home").getUserCentreInfo;
    var isLogin = require("../application/effect").isLogin;
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