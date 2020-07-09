define("dist/personalCenter/mywallet", [ "./home", "swiper", "../common/recommendConfigInfo", "../application/method", "../common/template/swiper_tmp.html", "../application/api", "./template/homeRecentlySee.html", "./template/vipPrivilegeList.html", "./effect", "../application/checkLogin", "../application/app", "../application/element", "../application/template", "../application/extend", "../common/bilog", "base64", "../cmd-lib/util", "../report/config", "../application/helper", "//static3.iask.cn/resource/js/plugins/pc.iask.login.min" ], function(require, exports, module) {
    var type = window.pageConfig && window.pageConfig.page.type;
    var getUserCentreInfo = require("./home").getUserCentreInfo;
    if (type == "mywallet") {
        $("#dialog-box").dialog({
            html: $("#mywallet-tip-dialog").html()
        }).open();
        getUserCentreInfo();
    }
});