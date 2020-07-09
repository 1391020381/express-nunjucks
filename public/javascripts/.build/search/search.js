define("dist/search/search", [ "../application/method", "../application/api", "swiper", "../common/bilog", "base64", "../cmd-lib/util", "../report/config" ], function(require, exports, moudle) {
    // var $ = require('$');
    var method = require("../application/method");
    var api = require("../application/api");
    require("swiper");
    var clickEvent = require("../common/bilog").clickEvent;
    //页面级埋点
    // var gioPageSet = require('../common/gioPageSet');
    //  gioReport();
    setInputValue();
    // gebyPosition();
    conditionChange();
    screenMore();
    sort();
    headerFixed();
    relatedSearchClick();
    pageIndexChange();
    //参数 数据
    var data = {};
    // gio 埋点上报 页面级
    // function gioReport() {
    //     var cond = decodeURIComponent(decodeURIComponent(method.getParam('cond')));
    //     gioPageSet.gioPageSet({
    //         searchContent_pvar: cond    // 搜索关键词
    //     })
    // }
    //获取运营位广告数据
    // function gebyPosition() {
    //     $.ajax({
    //         url: api.search.byPosition,
    //         type: "POST",
    //         data: JSON.stringify({ position: 'SOLR_BANNER', count: 6, client: 'pc' }),
    //         contentType: "application/json; charset=utf-8",
    //         dataType: "json",
    //         success: function (res) {
    //             var swiperWrapper = $('.banner').find('.swiper-wrapper');
    //             var k = document.createDocumentFragment();
    //             res.data = res.data || [];
    //             res.data.forEach(function (item, index) {
    //                 var a = document.createElement('a');
    //                 a.href = item.url;
    //                 a.className = "swiper-slide";
    //                 a.style.backgroundImage = "url(" + item.img + ")";
    //                 k.appendChild(a);
    //             })
    //             swiperWrapper.html(k);
    //             if (res.data.length > 1) {
    //                 var mySwiper = new Swiper('.swiper-container', {
    //                     direction: 'horizontal',
    //                     loop: true,
    //                     autoplay: 3000,
    //                 })
    //             }
    //         }
    //     })
    // }
    //其他页面 跳转到这个页面时获取 url中搜索内容 参数  cond 
    //点击 enter时逻辑
    function setInputValue() {
        // var sconditionInput = $('#scondition');
        var sconditionInput = $(".new-input");
        // var searchBtn = $('#searchBtn');
        var searchBtn = $(".btn-new-search");
        //点击搜索按钮时
        searchBtn.on("click", function() {
            var inputValue = sconditionInput.val().trim() || "";
            inputValue = inputValue.replace(/\s+/g, "");
            if (/\S/.test(inputValue)) {
                clickEvent($(this));
                btnHrefChange("cond", inputValue);
            }
        });
        //搜索输入框按下enter键
        sconditionInput.on("keydown", function(e) {
            if (e.keyCode === 13) {
                var inputValue = sconditionInput.val().trim() || "";
                inputValue = inputValue.replace(/\s+/g, "");
                if (/\S/.test(inputValue)) {
                    btnHrefChange("cond", inputValue);
                }
            }
        });
    }
    //点击搜索和  enter时 逻辑函数 只需要 cond参数 其他参数 不要
    function btnHrefChange(params, value) {
        var href = window.location.href.substring(0, window.location.href.indexOf("?"));
        window.location.href = method.changeURLPar(href, params, encodeURIComponent(encodeURIComponent(value.substr(0, 20))));
    }
    // 相关搜索点击函数
    function relatedSearchClick() {
        var relatedSearchList = $(".related-search-list").find("a").get();
        var landinghotList = $(".landing-hot-list").find("a").get();
        var relatedSearchWords = relatedSearchList.concat(landinghotList);
        relatedSearchWords.forEach(function(item, index) {
            $(item).click(function() {
                var condValue = $(item).text().trim();
                btnHrefChange("cond", condValue);
            });
        });
    }
    // 搜索条件切换
    function conditionChange() {
        var $searchItem = $(".search-item");
        var searchItem = arrCall($searchItem);
        searchItem.forEach(function(element, index) {
            var $searchEle = $(element).find(".search-ele");
            var searchEle = arrCall($searchEle);
            searchEle.forEach(function(item, i) {
                $(item).on("click", function() {
                    $(item).addClass("active").siblings().removeClass("active");
                    var title = $searchItem.eq(index).find(".search-title").attr("value");
                    var code = $(item).attr("value");
                    data[title] = code;
                    data.pageIndex = 1;
                    //搜索条件切换  时 页面更新 url 参数改变
                    conditionHrefChange(data);
                });
            });
        });
    }
    //搜索条件切换  时 页面更新url 参数改变
    function conditionHrefChange(data) {
        var href = window.location.href;
        for (var key in data) {
            href = method.changeURLPar(href, key, data[key]);
        }
        window.location.href = href;
    }
    // 综合排序   上传时间 等切换  URL参数改变 页面改变
    function sort() {
        var $searchResult = $(".search-result").find(".screen-ele");
        var searchResult = arrCall($searchResult);
        searchResult.forEach(function(element, index) {
            $(element).on("click", function() {
                $searchResult.eq(index).addClass("current").siblings().removeClass("current");
                var value = $searchResult.eq(index).attr("value");
                conditionHrefChange({
                    sequence: value,
                    pageIndex: 1
                });
            });
        });
    }
    // 页面滚动头部搜索固定
    function headerFixed() {
        var element = $(".header-box");
        var top = $(element).offset() && $(element).offset().top;
        $(window).on("scroll", function() {
            var p = $(window).scrollTop();
            $(element).css("position", p > top ? "fixed" : "static");
            $(element).css("top", p > top ? "0px" : "");
        });
    }
    //转成真数组
    function arrCall(param) {
        return Array.prototype.slice.call(param, 0);
    }
    //更多筛选  切换函数
    function screenMore() {
        var searchScreen = $(".search-screen");
        var searchItem = $(".search-item ");
        searchScreen.on("click", function() {
            if (searchScreen.children().eq(0).text() === "更多筛选") {
                searchScreen.children().eq(0).text("收起筛选");
                searchItem.removeClass("hide");
            } else {
                searchScreen.children().eq(0).text("更多筛选");
                searchItem.eq(2).addClass("hide");
                searchItem.eq(3).addClass("hide");
            }
            searchScreen.children().eq(1).toggleClass("screen-less");
        });
    }
    //分页功能      一共20页；
    function pageIndexChange() {
        var officePage = $(".office-page");
        var btnpagelong = officePage.find(".btn-page-long");
        var btnpage = officePage.find(".btn-page");
        var pageele = officePage.find(".page-ele");
        var indexNum = pageele.length - 1;
        var params = method.getParam("pageIndex");
        var pageIndex = params - 1;
        pageIndex = pageIndex > 0 ? pageIndex : 0;
        pageele.eq(pageIndex).addClass("active").siblings().removeClass("active");
        if (pageIndex > 0) {
            btnpagelong.eq(0).show();
            btnpage.eq(0).show();
        }
        if (pageIndex !== 0 && pageIndex !== indexNum) {
            pageele.eq(pageIndex - 2).show();
            pageele.eq(pageIndex - 1).show();
            pageele.eq(pageIndex).show();
            pageele.eq(pageIndex + 1).show();
            pageele.eq(pageIndex + 2).show();
            pageIndex - 2 > 0 ? pageele.eq(pageIndex - 2).before('<span class="page-point">...</span>') : null;
            pageIndex + 2 < indexNum - 1 ? pageele.eq(pageIndex + 2).after('<span class="page-point">...</span>') : null;
        }
        if (pageIndex === 0) {
            btnpagelong.eq(0).hide();
            btnpage.eq(0).hide();
            pageele.eq(1).show();
            pageele.eq(2).show();
            pageele.eq(3).show();
            pageele.eq(4).show();
            pageele.eq(4).after('<span class="page-point">...</span>');
        }
        if (pageIndex === indexNum) {
            btnpagelong.eq(1).hide();
            btnpage.eq(1).hide();
            pageele.eq(indexNum - 4).show();
            pageele.eq(indexNum - 3).show();
            pageele.eq(indexNum - 2).show();
            pageele.eq(indexNum - 1).show();
            pageele.eq(indexNum - 4).before('<span class="page-point">...</span>');
        }
        if (pageIndex > 0 && pageIndex < indexNum) {
            btnpagelong.show();
            btnpage.show();
        }
        pageele.eq(0).show();
        pageele.eq(indexNum).show();
        //点击分页时
        pageele.click(function() {
            var index = $(this).attr("value") - 0 + 1;
            conditionHrefChange({
                pageIndex: index
            });
        });
        //首页
        btnpagelong.eq(0).click(function() {
            conditionHrefChange({
                pageIndex: 1
            });
        });
        //下一页
        btnpagelong.eq(1).click(function() {
            if (!params) {
                conditionHrefChange({
                    pageIndex: 2
                });
            } else if (pageIndex + 1 <= indexNum + 1) {
                conditionHrefChange({
                    pageIndex: pageIndex + 2
                });
            }
        });
        // 上一页
        btnpage.eq(0).click(function() {
            conditionHrefChange({
                pageIndex: pageIndex
            });
        });
        //尾页
        btnpage.eq(1).click(function() {
            conditionHrefChange({
                pageIndex: indexNum + 1
            });
        });
    }
});