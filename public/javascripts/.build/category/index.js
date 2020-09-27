define("dist/category/index", [ "./fixedTopBar", "../application/suspension", "../application/method", "../application/checkLogin", "../application/api", "../application/urlConfig", "../application/login", "../cmd-lib/jqueryMd5", "../common/bilog", "base64", "../cmd-lib/util", "../report/config", "../cmd-lib/myDialog", "../cmd-lib/toast", "../common/bindphone", "../common/baidu-statistics", "../application/app", "../application/element", "../application/template", "../application/extend", "../application/effect", "../application/helper", "../common/slider" ], function(require, exports, module) {
    require("./fixedTopBar");
    require("../application/suspension");
    var slider = require("../common/slider");
    //轮播插件
    var utils = require("../cmd-lib/util");
    var isLogin = require("../application/effect").isLogin;
    var isAutoLogin = false;
    var callback = null;
    isLogin(callback, isAutoLogin);
    var obj = {
        reqParams: pageConfig.reqParams,
        init: function() {
            new slider("J_categoty_banner", "J_categoty_focus", "J_categoty_prev", "J_categoty_next");
            new slider("j-rightBanner", "J_right_focus", "J_right__prev", "J_right__next");
            this.selectMenu();
            this.pageOperate();
            this.fomatSelect();
            this.sortSelect();
        },
        selectMenu: function() {
            $(".js-nav-menu").click(function(event) {
                event.stopPropagation();
                $(this).parent().toggleClass("selected");
                $(this).find("i").toggleClass("rotate");
            });
            $("body").click(function() {
                if ($(".js-nav-menu").parent().hasClass("selected")) {
                    $(".js-nav-menu").parent().removeClass("selected");
                    $(".js-nav-menu").find("i").removeClass("rotate");
                }
            });
        },
        pageOperate: function() {
            $(".page-ele").on("click", function() {
                var currentPage = $(this).attr("value");
                obj.pageNavigate(currentPage);
            });
            $(".js-first-page").on("click", function() {
                obj.pageNavigate(1);
            });
            $(".js-previous-btn").on("click", function() {
                var page = obj.reqParams.currentPage - 1;
                obj.pageNavigate(page);
            });
            $(".js-next-btn").on("click", function() {
                var page = Number(obj.reqParams.currentPage) + 1;
                obj.pageNavigate(page);
            });
            $(".js-end-btn").on("click", function() {
                var page = obj.reqParams.totalPages;
                obj.pageNavigate(page);
            });
        },
        fomatSelect: function() {
            $(".js-fomat").on("click", ".search-ele", function() {
                $(this).addClass("active").siblings().removeClass("active");
                var fomat = $(this).attr("data-type");
                var sortField = obj.reqParams.sortField ? "-" + obj.reqParams.sortField : "";
                var pageUrl = location.origin + "/c/" + obj.reqParams.cid + "-" + fomat + "-p1" + sortField + ".html";
                location.href = pageUrl;
            });
        },
        sortSelect: function() {
            $(".js-sort").on("click", ".screen-ele", function() {
                $(this).addClass("current").siblings().removeClass("current");
                var sortField = $(this).attr("value") ? "-" + $(this).attr("value") : "";
                var fomat = obj.reqParams.fileType ? obj.reqParams.fileType : "all";
                var pageUrl = location.origin + "/c/" + obj.reqParams.cid + "-" + fomat + "-p1" + sortField + ".html";
                location.href = pageUrl;
            });
        },
        pageNavigate: function(page) {
            var fomat = obj.reqParams.fileType ? obj.reqParams.fileType : "all";
            var page = "p" + page;
            var sortField = obj.reqParams.sortField ? "-" + obj.reqParams.sortField : "";
            var pageUrl = location.origin + "/c/" + obj.reqParams.cid + "-" + fomat + "-" + page + sortField + ".html";
            location.href = pageUrl;
        }
    };
    obj.init();
    require("../common/baidu-statistics").initBaiduStatistics("6512a66181dbb2ea03b2b8fc4648babc");
    require("../common/baidu-statistics").initBaiduStatistics("adb0f091db00ed439bf000f2c5cbaee7");
    require("../common/baidu-statistics").initBaiduStatistics("17cdd3f409f282dc0eeb3785fcf78a66");
});