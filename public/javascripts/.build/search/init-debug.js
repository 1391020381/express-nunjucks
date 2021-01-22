define("dist/search/init-debug", [ "../application/method-debug", "../application/effect-debug", "../application/checkLogin-debug", "../application/api-debug", "../application/urlConfig-debug", "../application/login-debug", "../application/loginOperationLogic-debug", "../cmd-lib/jqueryMd5-debug", "../common/bindphone-debug", "../cmd-lib/myDialog-debug", "../cmd-lib/toast-debug", "../application/iframe/iframe-messenger-debug", "../application/iframe/messenger-debug", "../common/baidu-statistics-debug", "../common/loginType-debug", "./search-debug", "swiper-debug", "./banner-debug", "../common/template/swiper_tmp-debug.html", "../common/recommendConfigInfo-debug", "../application/suspension-debug", "../application/app-debug", "../application/element-debug", "../application/template-debug", "../application/extend-debug", "../common/bilogReport-debug", "../application/helper-debug", "../application/single-login-debug" ], function(require, exports, module) {
    var method = require("../application/method-debug");
    var isLogin = require("../application/effect-debug").isLogin;
    var isAutoLogin = false;
    var callback = null;
    isLogin(callback, isAutoLogin);
    require("./search-debug");
    require("./banner-debug");
    require("../application/suspension-debug");
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