define("dist/search/banner-debug", [ "swiper-debug", "../application/api-debug", "../application/urlConfig-debug", "../common/template/swiper_tmp-debug.html", "../common/recommendConfigInfo-debug", "../application/method-debug" ], function(require, exports, module) {
    require("swiper-debug");
    var api = require("../application/api-debug");
    var topBnnerTemplate = require("../common/template/swiper_tmp-debug.html");
    var recommendConfigInfo = require("../common/recommendConfigInfo-debug");
    var method = require("../application/method-debug");
    // 顶部 banner
    gebyPosition();
    function gebyPosition() {
        $.ajax({
            url: api.recommend.recommendConfigInfo,
            type: "POST",
            data: JSON.stringify(recommendConfigInfo.search.pageIds),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function(res) {
                if (res.code == "0") {
                    res.data.forEach(function(item) {
                        // 匹配 组装数据
                        recommendConfigInfo.search.descs.forEach(function(desc) {
                            if (item.pageId == desc.pageId) {
                                desc.list = method.handleRecommendData(item.list);
                                console.log(method.handleRecommendData(item.list));
                            }
                        });
                    });
                    console.log(recommendConfigInfo);
                    recommendConfigInfo.search.descs.forEach(function(item) {
                        if (item.list.length) {
                            if (item.pageId == "PC_M_SR_ub") {
                                var topBannerHtml = template.compile(topBnnerTemplate)({
                                    topBanner: item.list,
                                    className: "swiper-top-container",
                                    hasDeleteIcon: true
                                });
                                $(".search-all-main-topbanner").html(topBannerHtml);
                                new Swiper(".swiper-top-container", {
                                    direction: "horizontal",
                                    loop: item.list.length > 1 ? true : false,
                                    autoplay: 3e3
                                });
                            }
                            if (item.pageId == "PC_M_SR_rb") {
                                var rightBannerHtml = template.compile(topBnnerTemplate)({
                                    topBanner: item.list,
                                    className: "swiper-right-container"
                                });
                                $(".banner").html(rightBannerHtml);
                                new Swiper(".swiper-right-container", {
                                    direction: "horizontal",
                                    loop: item.list.length > 1 ? true : false,
                                    autoplay: 3e3
                                });
                            }
                            if (item.pageId == "PC_M_SR_downb") {
                                // search-all-main-bottombanner
                                var bottomBannerHtml = template.compile(topBnnerTemplate)({
                                    topBanner: item.list,
                                    className: "swiper-bottom-container"
                                });
                                $(".search-all-main-bottombanner").html(bottomBannerHtml);
                                new Swiper(".swiper-bottom-container", {
                                    direction: "horizontal",
                                    loop: item.list.length > 1 ? true : false,
                                    autoplay: 3e3
                                });
                            }
                        }
                    });
                }
                if ($(".search-all-main-topbanner .swiper-slide").length <= 0) {
                    $(".close-swiper").hide();
                }
            }
        });
    }
    $(".search-all-main-topbanner-container .close-swiper").on("click", function() {
        $(".search-all-main-topbanner-container").hide();
    });
});