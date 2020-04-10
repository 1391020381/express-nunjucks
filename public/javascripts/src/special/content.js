define(function(require , exports , module){
    toggleMore()
         //更多筛选  切换函数
    function toggleMore() {
        var searchScreen = $('.search-screen');
        var searchItem = $('.search-item');
        searchScreen.on('click', function () {
            if (searchScreen.children().eq(0).text() === '更多筛选') {
                searchScreen.children().eq(0).text('收起筛选');
                searchItem.removeClass('hide');
            } else {
                searchScreen.children().eq(0).text('更多筛选');
                searchItem.eq(2).addClass('hide');
                searchItem.eq(3).addClass('hide');
            }
            searchScreen.children().eq(1).toggleClass('screen-less');
        })
    }

});