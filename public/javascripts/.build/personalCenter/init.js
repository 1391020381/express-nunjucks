define("dist/personalCenter/init", [ "../cmd-lib/tab", "../cmd-lib/toast", "../cmd-lib/myDialog", "../application/suspension", "../application/method", "../application/checkLogin", "../application/api", "../application/app", "../application/element", "../application/template", "../application/extend", "../common/bilog", "base64", "../cmd-lib/util", "../report/config", "../report/init", "../report/handler", "../report/columns", "../application/helper", "//static3.iask.cn/resource/js/plugins/pc.iask.login.min", "./effect", "./menu", "./dialog", "./home", "./template/homeRecentlySee.html", "./mycollectionAndDownLoad", "./template/mycollectionAndDownLoad.html", "./template/simplePagination.html", "./myuploads", "./template/myuploads.html", "./myvip", "../common/template/swiper_tmp.html", "./template/vipPrivilegeList.html", "../common/recommendConfigInfo", "./template/myvip.html", "./template/vipTable.html", "./mycoupon", "./template/mycoupon.html", "./myorder", "./template/myorder.html", "./accountsecurity", "../cmd-lib/jqueryMd5", "../common/bindphone", "./template/accountsecurity.html", "./personalinformation", "../cmd-lib/jquery.datepicker", "../common/area", "./template/personalinformation.html" ], function(require, exports, module) {
    require("../cmd-lib/tab");
    require("../cmd-lib/toast");
    require("../cmd-lib/myDialog");
    // require("../common/userMoreMsg")
    require("../application/suspension");
    require("./effect");
    // 登录和刷新topbar
    // require("./report");  
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
});