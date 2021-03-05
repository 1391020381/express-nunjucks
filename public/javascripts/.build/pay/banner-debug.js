define("dist/pay/banner-debug", [ "../application/api-debug", "../application/urlConfig-debug", "../common/template/swiper_tmp-debug.html", "../common/recommendConfigInfo-debug", "../application/method-debug" ], function(require) {
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
            data: JSON.stringify(recommendConfigInfo.paySuccess.pageIds),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function(res) {
                if (res.code == "0") {
                    res.data.forEach(function(item) {
                        // 匹配 组装数据
                        recommendConfigInfo.paySuccess.descs.forEach(function(desc) {
                            if (item.pageId == desc.pageId) {
                                desc.list = method.handleRecommendData(item.list);
                            }
                        });
                    });
                    console.log(recommendConfigInfo);
                    recommendConfigInfo.paySuccess.descs.forEach(function(k) {
                        if (k.list.length) {
                            if (k.pageId == "PC_M_PAY_SUC_banner") {
                                // search-all-main-bottombanner
                                var bottomBannerHtml = template.compile(topBnnerTemplate)({
                                    topBanner: k.list,
                                    className: "pay-success-swiper-container"
                                });
                                $(".pay-success-banner").html(bottomBannerHtml);
                                new Swiper(".pay-success-swiper-container", {
                                    direction: "horizontal",
                                    loop: k.list.length > 1 ? true : false,
                                    autoplay: 3e3
                                });
                            }
                        }
                    });
                }
            }
        });
    }
});