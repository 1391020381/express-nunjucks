define("dist/search/init", [ "../application/method", "../application/effect", "../application/checkLogin", "../application/api", "../application/urlConfig", "../application/login", "../application/loginOperationLogic", "../cmd-lib/jqueryMd5", "../common/bindphone", "../cmd-lib/myDialog", "../cmd-lib/toast", "../application/iframe/iframe-messenger", "../application/iframe/messenger", "../common/baidu-statistics", "../common/loginType", "../common/associateWords", "./search", "./banner", "swiper", "../common/template/swiper_tmp.html", "../common/recommendConfigInfo", "../application/suspension", "../application/app", "../application/element", "../application/template", "../application/extend", "../common/bilogReport", "../application/helper", "../application/single-login" ], function(require, exports, module) {
    var method = require("../application/method");
    var isLogin = require("../application/effect").isLogin;
    var isAutoLogin = false;
    var callback = null;
    isLogin(callback, isAutoLogin);
    require("./search");
    require("./banner");
    require("../application/suspension");
    var cond = decodeURIComponent(decodeURIComponent(method.getParam("cond")));
    trackEvent("NE030", "pageTypeView", "page", {
        pageID: "SR",
        pageName: "搜索结果页"
    });
    trackEvent("SE015", "searchPageView", "page", {
        keyWords: cond
    });
    $(".landing-txt-list .li-file").on("click", function() {
        var fileID = $(this).attr("data-fileId");
        var fileName = $(this).attr("data-fileName");
        trackEvent("SE016", "searchResultClick", "click", {
            filePostion: $(this).index() + 1,
            keyWords: cond,
            fileID: fileID,
            fileName: fileName
        });
    });
});