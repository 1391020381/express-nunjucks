define("dist/detail/changeDetailFooter", [], function(require, exports, module) {
    var detailCon = $(".detail-reader-con").find(".detail-con:visible").length - 2;
    var docMain = $(".doc-main");
    var advertisementHeight = 112;
    var detailFooterHeight = 119;
    var guessYouLikeHeight = $(".guess-you-like-warpper").height() || 0;
    function initStyle() {
        if (detailCon <= 3) {
            // 只有3页
            $(".deatil-mr10").css("position", "relative");
            $(".detail-footer").css({
                position: "absolute",
                left: "0px",
                right: "0px",
                bottom: 113 + guessYouLikeHeight + "px",
                "z-index": "200",
                width: "890px"
            });
        } else {
            commStyle();
        }
    }
    function loadMoreStyle() {
        commStyle();
    }
    function commStyle() {
        $(".deatil-mr10").css("position", "relative");
        $(".detail-footer").css({
            position: "absolute",
            left: "0px",
            right: "0px",
            bottom: 0 + guessYouLikeHeight + "px",
            "z-index": "200",
            width: "890px"
        });
    }
    module.exports = {
        initStyle: initStyle,
        loadMoreStyle: loadMoreStyle
    };
});