define("dist/detail-b/changeDetailFooter-debug", [], function(require, exports, module) {
    var isConvert = window.pageConfig.page.isConvert;
    // var detailCon = $('.detail-reader-con').find(".detail-con:visible").length -2
    var detailCon = $(".detail-reader-con").find(".detail-con:visible").length;
    var detailGuide = $(".detail-guide-wrap").outerHeight(true) || 0;
    var hotSpotSearch = $(".hot-spot-search-warper").outerHeight(true) || 0;
    var userCommentsContainer = $(".user-comments-container").outerHeight(true) || 0;
    var bottomHeight = hotSpotSearch + detailGuide + userCommentsContainer + 10;
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
        detailGuide = $(".detail-guide-wrap").outerHeight(true) || 0;
        hotSpotSearch = $(".hot-spot-search-warper").outerHeight(true) || 0;
        userCommentsContainer = $(".user-comments-container").outerHeight(true) || 0;
        bottomHeight = hotSpotSearch + detailGuide + userCommentsContainer + 10;
        $(".deatil-mr10").css("position", "relative");
        $(".detail-footer").css({
            position: "absolute",
            left: "0px",
            right: "0px",
            bottom: bottomHeight + "px",
            width: "890px"
        });
    }
    module.exports = {
        initStyle: initStyle,
        loadMoreStyle: loadMoreStyle
    };
});