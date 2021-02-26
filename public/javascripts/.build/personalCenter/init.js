define("dist/personalCenter/init", [ "../cmd-lib/tab", "../cmd-lib/toast", "../cmd-lib/myDialog", "../application/suspension", "../application/method", "../application/checkLogin", "../application/api", "../application/urlConfig", "../application/login", "../application/loginOperationLogic", "../cmd-lib/jqueryMd5", "../common/bindphone", "../application/iframe/iframe-messenger", "../application/iframe/messenger", "../common/baidu-statistics", "../application/app", "../application/element", "../application/template", "../application/extend", "../common/bilogReport", "../application/helper", "../application/single-login", "./menu", "./dialog", "./home", "swiper", "../common/recommendConfigInfo", "../common/template/swiper_tmp.html", "./template/homeRecentlySee.html", "./template/vipPrivilegeList.html", "../application/effect", "../common/loginType", "../common/associateWords", "./mycollectionAndDownLoad", "./template/mycollectionAndDownLoad.html", "./template/simplePagination.html", "../cmd-lib/util", "./template/receiveCoupon.html", "./template/commentDialogContent.html", "./myuploads", "./template/myuploads.html", "./myvip", "./template/myvip.html", "./template/vipTable.html", "./mycoupon", "./template/mycoupon.html", "./myorder", "./template/myorder.html", "./accountsecurity", "./template/accountsecurity.html", "./personalinformation", "../cmd-lib/jquery.datepicker", "../common/area", "./template/personalinformation.html", "./mywallet", "../cmd-lib/upload/Q", "../cmd-lib/upload/Q.Uploader", "./template/mywallet.html", "../common/bankData", "../cmd-lib/clipboard" ], function(require, exports, module) {
    require("../cmd-lib/tab");
    require("../cmd-lib/toast");
    require("../cmd-lib/myDialog");
    require("../application/suspension");
    //  require("./effect");  // 登录和刷新topbar 
    require("./menu");
    require("./dialog");
    require("./home");
    require("./mycollectionAndDownLoad");
    require("./myuploads");
    require("./myvip");
    require("./mycoupon");
    require("./myorder");
    require("./accountsecurity");
    require("./personalinformation");
    require("./mywallet");
    if (!isLowsIe8()) {
        var Clipboard = require("../cmd-lib/clipboard");
        var clipboardBtn = new Clipboard(".clipboardBtn");
        clipboardBtn.on("success", function(e) {
            console.info("Action:", e.action);
            console.info("Text:", e.text);
            console.info("Trigger:", e.trigger);
            $.toast({
                text: "复制成功!",
                delay: 3e3
            });
            e.clearSelection();
        });
        clipboardBtn.on("error", function(e) {
            console.error("Action:", e.action);
            console.error("Trigger:", e.trigger);
        });
    }
    function isLowsIe8() {
        var DEFAULT_VERSION = 8;
        var ua = navigator.userAgent.toLowerCase();
        var isIE = ua.indexOf("msie") > -1;
        var safariVersion;
        if (isIE) {
            safariVersion = ua.match(/msie ([\d.]+)/)[1];
        }
        if (safariVersion <= DEFAULT_VERSION) {
            return true;
        } else {
            false;
        }
    }
    $(document).on("click", ".personal-center-content .personal-center-menu .signIn", function() {
        $("#dialog-box").dialog({
            html: $("#Sign-dialog").html()
        }).open();
    });
});