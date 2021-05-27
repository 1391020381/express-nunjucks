define(function (require) {
    require('swiper');
    var method = require('../application/method');
    var api = require('../application/api');
    var HotSpotSearch = require('./template/HotSpotSearch.html');
    // A25需求：获取字典列表
    var dictionaryData = [];
    new Swiper('.swiper-top-container', {
        direction: 'horizontal',
        loop: $('.swiper-top-container .swiper-slide').length > 1 ? true : false,
        autoplay: 3000
    });

    $('.close-swiper').on('click', function (e) {
        e.stopPropagation();
        $('.detail-topbanner').hide();
        method.setCookieWithExpPath('isHideDetailTopbanner', 1);
    });

    // 左侧顶部的 banner
    new Swiper('.fix-right-swiperbannertop', {
        direction: 'horizontal',
        loop: $('.fix-right-swiperbannertop .swiper-slide').length > 1 ? true : false,
        autoplay: 3000
    });

    // 左侧底部banner
    new Swiper('.fix-right-swiperbannerbottom', {
        direction: 'horizontal',
        loop: $('.fix-right-swiperbannerbottom .swiper-slide').length > 1 ? true : false,
        autoplay: 3000
    });

    // title底部banner
    new Swiper('.swiper-titlebottom-container', {
        direction: 'horizontal',
        loop: $('.swiper-titlebottom-container .swiper-slide').length > 1 ? true : false,
        autoplay: 3000
    });

    new Swiper('.swiper-titlebottom-container', {
        direction: 'horizontal',
        loop: $('.swiper-titlebottom-container .swiper-slide').length > 1 ? true : false,
        autoplay: 3000
    });

    new Swiper('.swiper-turnPageOneBanner-container', {
        direction: 'horizontal',
        loop: $('.swiper-turnPageOneBanner-container .swiper-slide').length > 1 ? true : false,
        autoplay: 3000
    });

    new Swiper('.swiper-turnPageTwoBanner-container', {
        direction: 'horizontal',
        loop: $('.swiper-turnPageTwoBanner-container .swiper-slide').length > 1 ? true : false,
        autoplay: 3000
    });

    var topicName = window.pageConfig.page && window.pageConfig.page.fileName;

    function getSpecialTopic() {
        $.ajax({
            url: api.search.specialTopic,
            type: 'POST',
            data: JSON.stringify({
                currentPage: 1,
                pageSize: 5,
                topicName: topicName,
                siteCode: '4'
            }),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (res) {
                if (res.code == '0') {
                    if (res.data.rows && res.data.rows.length) {
                        var HotSpotList = res.data.rows;
                        console.log('HotSpotList', HotSpotList, 'getDictionaryData', dictionaryData);
                        for(var i = 0; i < HotSpotList.length; i++) {
                            var findArr = dictionaryData.filter(function(item){
                                // console.log(item.pcode, HotSpotList[i].templateCode);
                                return item.pcode === HotSpotList[i].templateCode
                            });
                            console.log('findArr', findArr[0]);
                            if (findArr[0]) {
                                if (findArr[0].order === 4) {
                                    HotSpotList[i].newRouterUrl = findArr[0].pvalue + '/' + HotSpotList[i].id + '.html';
                                } else {
                                    HotSpotList[i].newRouterUrl = findArr[0].desc + findArr[0].pvalue + '/' + HotSpotList[i].id + '.html';
                                }
                            } else {
                                HotSpotList[i].newRouterUrl = '';
                            }
                        }
                        // console.log('HotSpotList', HotSpotList);
                        var hotSpotSearchTemplate = template.compile(HotSpotSearch)({ hotSpotSearchList: HotSpotList || [] });
                        $('.hot-spot-search-warper').html(hotSpotSearchTemplate);
                    }
                }
            }
        });
    }

    // A25：获取字典列表
    function getDictionaryData(){
        $.ajax({
            url: api.user.dictionaryData.replace('$code', 'themeModel'),
            type: 'GET',
            async: false,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            cache: false,
            success: function (res) { // loginRedPacket-dialog
                if (res.data && res.data.length) {
                    dictionaryData = res.data;
                }
                // console.log('getDictionaryData', dictionaryData);
            }
        });
    }

    getDictionaryData();

    getSpecialTopic();

});
