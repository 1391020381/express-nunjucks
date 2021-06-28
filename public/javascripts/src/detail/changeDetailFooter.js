define(function (require, exports, module) {
    var isConvert = window.pageConfig.page.isConvert;
    // var detailCon = $('.detail-reader-con').find(".detail-con:visible").length -2
    // var detailCon = $('.detail-reader-con').find('.detail-con:visible').length;
    var guessYouLikeHeight = $('.guess-you-like-warpper').outerHeight(true) || 0;
    var userEvaluation = $('.user-comments-container').outerHeight(true) || 0;
    var currentPage = $('.detail-con').length;
    var temp = guessYouLikeHeight + userEvaluation + 30;
    var bottomHeight = currentPage == 1 || currentPage == 2 ? temp + 123 : temp;

    function commStyle() {
        guessYouLikeHeight = $('.guess-you-like-warpper').outerHeight(true) || 0;
        userEvaluation = $('.user-comments-container').outerHeight(true) || 0;
        currentPage = $('.detail-con').length;
        temp = guessYouLikeHeight + userEvaluation + 30;
        bottomHeight = currentPage == 1 || currentPage == 2 || currentPage == 3 ? temp + 123 : temp;
        $('.deatil-mr10').css('position', 'relative');
        $('.detail-footer').css({
            'position': 'absolute',
            'left': '0px',
            'right': '0px',
            'bottom': bottomHeight + 'px',
            'width': '890px'
        });
        $('.copyright-container').css({
            'bottom': bottomHeight + 'px',
            'marginBottom': '-40px'
        });
    }

    function initStyle() {
        if (isConvert == 1) { // 转码成功
            // if(detailCon<=3){ // 只有3页
            //   $('.deatil-mr10').css('position','relative')
            //   $('.detail-footer').css({
            //       'position': 'absolute',
            //       'left':'0px',
            //       'right':'0px',
            //       'bottom':(113 + bottomHeight) + 'px',
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

    module.exports = {
        initStyle: initStyle,
        loadMoreStyle: loadMoreStyle
    };
});