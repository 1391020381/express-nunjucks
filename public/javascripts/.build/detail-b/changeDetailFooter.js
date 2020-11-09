define("dist/detail-b/changeDetailFooter", [], function(require, exports, module) {
    var isConvert = window.pageConfig.page.isConvert;
    var detailCon = $(".detail-reader-con").find(".detail-con:visible").length - 2;
    var hotSpotSearch = $(".hot-spot-search-warper").height() || 0;
    function initStyle() {
        if (isConvert == 1) {
            // 转码成功
            if (detailCon <= 3) {
                // 只有3页
                $(".deatil-mr10").css("position", "relative");
                $(".detail-footer").css({
                    position: "absolute",
                    left: "0px",
                    right: "0px",
                    bottom: 140 + 120 + hotSpotSearch + "px",
                    width: "890px"
                });
            } else {
                commStyle();
            }
        }
    }
    function loadMoreStyle() {
        // commStyle()
        initStyle();
    }
    function commStyle() {
        $(".deatil-mr10").css("position", "relative");
        $(".detail-footer").css({
            position: "absolute",
            left: "0px",
            right: "0px",
            bottom: 0 + hotSpotSearch + "px",
            width: "890px"
        });
    }
    module.exports = {
        initStyle: initStyle,
        loadMoreStyle: loadMoreStyle
    };
});