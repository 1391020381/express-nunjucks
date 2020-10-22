/**
 * 办公频道 类目/搜索页
 */
define("dist/office/search/init-debug", [ "../common/suspension-debug", "../../application/method-debug", "../../application/checkLogin-debug", "../../application/api-debug", "../../application/urlConfig-debug", "../../application/login-debug", "../../cmd-lib/jqueryMd5-debug", "../../common/bilog-debug", "base64-debug", "../../cmd-lib/util-debug", "../../report/config-debug", "../../cmd-lib/myDialog-debug", "../../cmd-lib/toast-debug", "../../common/bindphone-debug", "../../common/baidu-statistics-debug", "../../application/app-debug", "../../application/element-debug", "../../application/template-debug", "../../application/extend-debug", "../../application/effect-debug", "../../application/helper-debug", "../../common/gioPageSet-debug" ], function(require, exports, module) {
    // require("../../common/baidu-statistics");
    var suspension = require("../common/suspension-debug");
    var app = require("../../application/app-debug");
    var method = require("../../application/method-debug");
    var login = require("../../application/checkLogin-debug");
    var api = require("../../application/api-debug");
    require("../../common/bilog-debug");
    //页面级埋点
    var gioPageSet = require("../../common/gioPageSet-debug");
    // 搜索文本
    var $searchInput = $(".search-input");
    // 页码
    var page = 1;
    // 属性数组
    var specifics = [];
    // 文件类型
    var fileType = "all";
    // 排序规则
    var order = "all";
    // 页面配置参数
    var pageParams = window.pageConfig.reqParams;
    // 渲染分页导航
    pageIndexChange();
    //页面加载时 埋点
    gioReport();
    // 收藏
    $(".btn-pic-xx,.btn-collect").on("click", function(e) {
        e.stopPropagation();
        e.preventDefault();
        if (!method.getCookie("cuk")) {
            login.notifyLoginInterface(function(data) {
                suspension.afterLogin(data);
            });
        }
        var $this = $(this);
        if ($this.hasClass("btn-pic-xx-ok") || $this.hasClass("btn-xx-ok")) {
            collectFile(4, $this);
        } else {
            collectFile(3, $this);
        }
    });
    // 综合排序,热门排序,最新上传
    $(".office-list-nav a").on("click", function() {
        var pathname = location.pathname;
        order = $(this).attr("data-order");
        var current = $(".office-list-nav a.nav-ele.current").attr("data-order");
        // 搜索页的跳转
        if (pathname.indexOf("node/office/search") > 0) {
            var cond = $.trim($searchInput.val() || "");
            if (cond) {
                var fileType = $(".screen-list-search span.active").attr("data-type");
                // window.location.href = '/node/office/search.html?cond=' + encodeURIComponent(encodeURIComponent(cond)) + '&fileType=' + fileType + '&order=' + order;
                method.compatibleIESkip("/node/office/search.html?cond=" + encodeURIComponent(encodeURIComponent(cond)) + "&fileType=" + fileType + "&order=" + order, false);
            }
        } else {
            var pathnameArr = pathname.split("-");
            if (pathnameArr.length > 1) {
                //location.href = pathname.replace(current, order).replace('_' + pageParams.page, '_1');
                method.compatibleIESkip(pathname.replace(current, order).replace("_" + pageParams.page, "_1"), false);
            } else {
                var resArr = pathname.split(".html");
                // location.href = resArr[0] + '_' + pageParams.page + '-' + order + '.html';
                method.compatibleIESkip(resArr[0] + "_" + pageParams.page + "-" + order + ".html", false);
            }
        }
    });
    //你要找的是不是
    $(".association-list li a").on("click", function() {
        order = $(".office-list-nav a.nav-ele.current").attr("data-order");
        var cond = encodeURIComponent(encodeURIComponent($(this).text()));
        var categoryId = pageParams.cid;
        var page = pageParams.page;
        var fileType = pageParams.fileType;
        window.location.href = location.pathname + "?cid=" + categoryId + "&page=" + page + "&order=" + order + "&cond=" + cond + "&fileType=" + fileType;
    });
    // 分页导航选择 格式,全部 word excel ppt
    $(".screen-list-search span").on("click", function() {
        var cond = $.trim($searchInput.val() || "");
        if (cond) {
            var fileType = $(this).attr("data-type");
            var order = $(".office-list-nav a.nav-ele.current").attr("data-order");
            window.location = "/node/office/search.html?cond=" + encodeURIComponent(encodeURIComponent(cond)) + "&fileType=" + fileType + "&order=" + order;
        }
    });
    // 点赞
    $(".btn-goods").on("click", function(e) {
        e.stopPropagation();
        e.preventDefault();
        var $this = $(this), isZan = $this.attr("data-isZan");
        if (isZan) {
            return false;
        } else {
            var p = $this.text();
            var num = p ? parseInt(p) + 1 : p;
            $this.addClass("btn-goods-ok").find("#num").text(num);
            $this.attr("data-isZan", true);
        }
    });
    $(".none-btn").on("click", function() {
        var cond = encodeURIComponent(encodeURIComponent($(this).attr("data-cond")));
        window.location.href = "/search/home.html?ft=all&cond=" + cond;
    });
    // 添加取消收藏
    function collectFile(cond, $target) {
        method.post(api.normalFileDetail.collect, function(res) {
            if (res.code == 0) {
                var $pointElement = $target.next(".office-collect-info");
                var $collectMsg = $pointElement.length > 0 ? $pointElement : $target.closest(".data-text-con").siblings(".data-pic").find(".office-collect-info");
                var $enshrineNum = $target.closest("li").find("#enshrineNum");
                if (cond === 3) {
                    $collectMsg.show().find("p").text("收藏成功");
                    $target.closest("li").find(".first-collect .btn-pic-xx").addClass("btn-pic-xx-ok");
                    $target.closest("li").find(".second-collect .btn-xx").addClass("btn-xx-ok");
                    setTimeout(function() {
                        $collectMsg.hide();
                    }, 2500);
                    $enshrineNum.text(parseInt($enshrineNum.text()) + 1);
                } else {
                    $collectMsg.show().find("p").text("取消收藏");
                    $target.closest("li").find(".first-collect .btn-pic-xx").removeClass("btn-pic-xx-ok");
                    $target.closest("li").find(".second-collect .btn-xx").removeClass("btn-xx-ok");
                    setTimeout(function() {
                        $collectMsg.hide();
                    }, 2500);
                    if (parseInt($enshrineNum.text()) > 0) {
                        $enshrineNum.text(parseInt($enshrineNum.text()) - 1);
                    }
                }
            }
        }, "", "post", {
            fid: $target.attr("data-id"),
            cond: cond,
            flag: "y"
        });
    }
    /*
        @param reqParams
        @des 分页
     */
    function pageNavigate(page) {
        var cond = encodeURIComponent(encodeURIComponent($searchInput.val()));
        var order = $(".office-list-nav a.nav-ele.current").attr("data-order");
        // 判断当前页是分类页,还是搜索页，url判断
        var pathname = location.pathname;
        // 搜索页面
        if (pathname.indexOf("node/office/search") > 0) {
            var fileType = $(".screen-list-search span.active").attr("data-type");
            window.location = "/node/office/search.html?cond=" + cond + "&page=" + page + "&fileType=" + fileType + "&order=" + order;
        } else {
            // 这种情况的url./c/8043_1-all-1039_2149.html ,结合pageConfig reqParams拼装
            var pathnameArr = pathname.split("-");
            if (pathnameArr.length > 1) {
                var regExp = /c\/(\S*)\./;
                var matchResult = pathname.match(regExp);
                if (matchResult && matchResult.length > 0) {
                    //[0] 8043_1-all-1039_2149 [1] /c/ [2] .html
                    var path = "/c/" + pageParams.cid + "_" + page + "-" + pageParams.order;
                    if (pageParams.specifics) {
                        path += "-" + pageParams.specifics.replace(/,/g, "-");
                    }
                    path += ".html";
                    location.href = path;
                }
            } else {
                // 这种url /c/8043.html
                var resArr = location.pathname.split(".html");
                location.href = resArr[0] + "_" + page + "-" + order + ".html";
            }
        }
    }
    // gio 埋点上报 页面级
    function gioReport() {
        var cond = decodeURIComponent(decodeURIComponent(method.getParam("cond")));
        if (cond) {
            gioPageSet.gioPageSet({
                searchContent_pvar: cond,
                // 搜索关键词
                officeChannel_pvar: "office",
                // 办公频道页，包含列表页和详情页,
                pageType_pvar: location.pathname.indexOf("node/office/search") > 0 ? "officeSearch" : "officeClassify"
            });
        }
    }
    //分页功能      一共20页；
    function pageIndexChange() {
        // 分页导航
        var $pageNavigate = $(".office-page-paging");
        // 首页
        var $firstPage = $pageNavigate.find(".btn-page-long");
        // 上页
        var $prePage = $pageNavigate.find(".btn-page");
        // 单个页面
        var $singlePage = $pageNavigate.find(".page-ele");
        // 下标
        var indexNum = $singlePage.length - 1;
        // 当前页码
        var params = method.getParam("page") || pageParams.page;
        var pageIndex = params - 1;
        pageIndex = pageIndex > 0 ? pageIndex : 0;
        if (pageIndex > 0) {
            $firstPage.eq(0).show();
            $prePage.eq(0).show();
        }
        if (pageIndex !== 0 && pageIndex !== indexNum) {
            $singlePage.eq(pageIndex - 2).show();
            $singlePage.eq(pageIndex - 1).show();
            $singlePage.eq(pageIndex).show();
            $singlePage.eq(pageIndex + 1).show();
            $singlePage.eq(pageIndex + 2).show();
            pageIndex - 2 > 0 ? $singlePage.eq(pageIndex - 2).before('<span class="page-point">...</span>') : null;
            pageIndex + 2 < indexNum - 1 ? $singlePage.eq(pageIndex + 2).after('<span class="page-point">...</span>') : null;
        }
        if (pageIndex === 0) {
            $firstPage.eq(0).hide();
            $prePage.eq(0).hide();
            $singlePage.eq(1).show();
            $singlePage.eq(2).show();
            $singlePage.eq(3).show();
            $singlePage.eq(4).show();
            $singlePage.eq(4).after('<span class="page-point">...</span>');
        }
        if (pageIndex === indexNum) {
            $firstPage.eq(1).hide();
            $prePage.eq(1).hide();
            $singlePage.eq(indexNum - 4).show();
            $singlePage.eq(indexNum - 3).show();
            $singlePage.eq(indexNum - 2).show();
            $singlePage.eq(indexNum - 1).show();
            $singlePage.eq(indexNum - 4).before('<span class="page-point">...</span>');
        }
        if (pageIndex > 0 && pageIndex < indexNum) {
            $firstPage.show();
            $prePage.show();
        }
        $singlePage.eq(0).show();
        $singlePage.eq(indexNum).show();
        //点击分页时
        $singlePage.click(function() {
            page = $(this).attr("value");
            pageNavigate(page);
        });
        //首页
        $firstPage.eq(0).click(function() {
            page = 1;
            pageNavigate(page);
        });
        //下一页
        $firstPage.eq(1).click(function() {
            if (!params) {
                page = 2;
                pageNavigate(page);
            } else if (pageIndex + 1 <= indexNum + 1) {
                page = pageIndex + 2;
                pageNavigate(page);
            }
        });
        // 上一页
        $prePage.eq(0).click(function() {
            page = pageIndex;
            pageNavigate(page);
        });
        //尾页
        $prePage.eq(1).click(function() {
            page = indexNum + 1;
            pageNavigate(page);
        });
    }
});