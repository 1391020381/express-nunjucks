define("dist/detail-b/changeDetailFooter", [], function(require, exports, module) {
    var isConvert = window.pageConfig.page.isConvert;
    // var detailCon = $('.detail-reader-con').find(".detail-con:visible").length -2
    var detailCon = $(".detail-reader-con").find(".detail-con:visible").length;
    var isHasComment = window.pageConfig.params.isHasComment;
    var detailGuide = $(".detail-guide-wrap").outerHeight(true) || 0;
    var hotSpotSearch = $(".hot-spot-search-warper").outerHeight(true) || 0;
    var userEvaluation = $(".user-comments-container").outerHeight(true) || 0;
    var bottomHeight = hotSpotSearch + userEvaluation + detailGuide;
    function initStyle() {
        if (isConvert == 1) {
            // 转码成功
            // if(detailCon<=3){ // 只有3页
            //   $('.deatil-mr10').css('position','relative')
            //   $('.detail-footer').css({
            //       'position': 'absolute',
            //       'left':'0px',
            //       'right':'0px',
            //       'bottom':(140 + 120 + hotSpotSearch) + 'px',
            //       'width': '890px'
            //   })
            // }else{
            //   commStyle()
            // }
            commStyle();
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
            bottom: isHasComment ? 10 + bottomHeight + 549 + "px" : 10 + bottomHeight + "px",
            width: "890px"
        });
    }
    module.exports = {
        initStyle: initStyle,
        loadMoreStyle: loadMoreStyle
    };
});