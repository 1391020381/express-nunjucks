define("dist/personalCenter/init-debug", [ "../cmd-lib/tab-debug", "../cmd-lib/toast-debug", "../cmd-lib/myDialog-debug", "../application/suspension-debug", "../application/method-debug", "../application/checkLogin-debug", "../application/api-debug", "../application/app-debug", "../application/element-debug", "../application/template-debug", "../application/extend-debug", "../common/bilog-debug", "base64-debug", "../cmd-lib/util-debug", "../report/config-debug", "../application/effect-debug", "../application/helper-debug", "//static3.iask.cn/resource/js/plugins/pc.iask.login.min-debug", "./menu-debug", "./dialog-debug", "./home-debug", "swiper-debug", "../common/recommendConfigInfo-debug", "../common/template/swiper_tmp-debug.html", "./template/homeRecentlySee-debug.html", "./template/vipPrivilegeList-debug.html", "./mycollectionAndDownLoad-debug", "./template/mycollectionAndDownLoad-debug.html", "./template/simplePagination-debug.html", "./myuploads-debug", "./template/myuploads-debug.html", "./myvip-debug", "./template/myvip-debug.html", "./template/vipTable-debug.html", "./mycoupon-debug", "./template/mycoupon-debug.html", "./myorder-debug", "./template/myorder-debug.html", "./accountsecurity-debug", "../cmd-lib/jqueryMd5-debug", "../common/bindphone-debug", "./template/accountsecurity-debug.html", "./personalinformation-debug", "../cmd-lib/jquery.datepicker-debug", "../common/area-debug", "./template/personalinformation-debug.html", "./mywallet-debug", "../cmd-lib/clipboard-debug" ], function(require, exports, module) {
    require("../cmd-lib/tab-debug");
    require("../cmd-lib/toast-debug");
    require("../cmd-lib/myDialog-debug");
    require("../application/suspension-debug");
    //  require("./effect");  // 登录和刷新topbar 
    require("./menu-debug");
    require("./dialog-debug");
    require("./home-debug");
    require("./mycollectionAndDownLoad-debug");
    require("./myuploads-debug");
    require("./myvip-debug");
    require("./mycoupon-debug");
    require("./myorder-debug");
    require("./accountsecurity-debug");
    require("./personalinformation-debug");
    require("./mywallet-debug");
    require("../common/bilog-debug");
    if (!isLowsIe8()) {
        var Clipboard = require("../cmd-lib/clipboard-debug");
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
});