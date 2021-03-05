define("dist/detail/banner-debug", [ "swiper-debug", "../application/method-debug", "../application/api-debug", "../application/urlConfig-debug", "./template/HotSpotSearch-debug.html" ], function(require) {
    require("swiper-debug");
    var method = require("../application/method-debug");
    var api = require("../application/api-debug");
    var HotSpotSearch = require("./template/HotSpotSearch-debug.html");
    new Swiper(".swiper-top-container", {
        direction: "horizontal",
        loop: $(".swiper-top-container .swiper-slide").length > 1 ? true : false,
        autoplay: 3e3
    });
    $(".close-swiper").on("click", function(e) {
        e.stopPropagation();
        $(".detail-topbanner").hide();
        method.setCookieWithExpPath("isHideDetailTopbanner", 1);
    });
    // 左侧顶部的 banner
    new Swiper(".fix-right-swiperbannertop", {
        direction: "horizontal",
        loop: $(".fix-right-swiperbannertop .swiper-slide").length > 1 ? true : false,
        autoplay: 3e3
    });
    // 左侧底部banner
    new Swiper(".fix-right-swiperbannerbottom", {
        direction: "horizontal",
        loop: $(".fix-right-swiperbannerbottom .swiper-slide").length > 1 ? true : false,
        autoplay: 3e3
    });
    // title底部banner
    new Swiper(".swiper-titlebottom-container", {
        direction: "horizontal",
        loop: $(".swiper-titlebottom-container .swiper-slide").length > 1 ? true : false,
        autoplay: 3e3
    });
    new Swiper(".swiper-titlebottom-container", {
        direction: "horizontal",
        loop: $(".swiper-titlebottom-container .swiper-slide").length > 1 ? true : false,
        autoplay: 3e3
    });
    new Swiper(".swiper-turnPageOneBanner-container", {
        direction: "horizontal",
        loop: $(".swiper-turnPageOneBanner-container .swiper-slide").length > 1 ? true : false,
        autoplay: 3e3
    });
    new Swiper(".swiper-turnPageTwoBanner-container", {
        direction: "horizontal",
        loop: $(".swiper-turnPageTwoBanner-container .swiper-slide").length > 1 ? true : false,
        autoplay: 3e3
    });
    var topicName = window.pageConfig.page && window.pageConfig.page.fileName;
    function getSpecialTopic() {
        $.ajax({
            url: api.search.specialTopic,
            type: "POST",
            data: JSON.stringify({
                currentPage: 1,
                pageSize: 5,
                topicName: topicName,
                siteCode: "4"
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function(res) {
                if (res.code == "0") {
                    if (res.data.rows && res.data.rows.length) {
                        var hotSpotSearchTemplate = template.compile(HotSpotSearch)({
                            hotSpotSearchList: res.data.rows || []
                        });
                        $(".hot-spot-search-warper").html(hotSpotSearchTemplate);
                    }
                }
            }
        });
    }
    getSpecialTopic();
});