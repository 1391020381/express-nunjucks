define(function (require, exports, module) {
    require('swiper');
    var api = require('../application/api');
    var topBnnerTemplate = require('../common/template/swiper_tmp.html');
    var recommendConfigInfo = require('../common/recommendConfigInfo');
    var method = require('../application/method');

    var dictionaryData = [];
    // A25：获取字典列表
    function getDictionaryData(){
        $.ajax({
            url: api.user.dictionaryData.replace('$code', 'themeModel'),
            type: 'GET',
            async: true,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            cache: false,
            success: function (res) { // loginRedPacket-dialog
                // console.log('进入搜索页面请求成功', res.data);
                if (res.data && res.data.length) {
                    dictionaryData = res.data;
                    gebyPosition();
                } else {
                    gebyPosition();
                }
                // console.log('getDictionaryData', dictionaryData);
            }
        });
    }

    getDictionaryData();

    // 顶部 banner

    function gebyPosition() {
        $.ajax({
            url: api.recommend.recommendConfigInfo,
            type: 'POST',
            data: JSON.stringify(recommendConfigInfo.search.pageIds),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (res) {
                // console.log('res', res);
                if (res.code == '0') {
                    res.data.forEach(function (item) { // 匹配 组装数据
                        recommendConfigInfo.search.descs.forEach(function (desc) {
                            if (item.pageId == desc.pageId) {
                                desc.list = method.handleRecommendData(item.list, dictionaryData);
                                console.log(method.handleRecommendData(item.list, dictionaryData));
                            }
                        });
                    });
                    console.log(recommendConfigInfo);
                    recommendConfigInfo.search.descs.forEach(function (item) {
                        if (item.list.length) {
                            if (item.pageId == 'PC_M_SR_ub') {
                                var topBannerHtml = template.compile(topBnnerTemplate)({
                                    topBanner: item.list,
                                    className: 'swiper-top-container',
                                    hasDeleteIcon: true
                                });
                                $('.search-all-main-topbanner').html(topBannerHtml);
                                new Swiper('.swiper-top-container', {
                                    direction: 'horizontal',
                                    loop: item.list.length > 1 ? true : false,
                                    autoplay: 3000
                                });
                            }
                            if (item.pageId == 'PC_M_SR_rb') {
                                var rightBannerHtml = template.compile(topBnnerTemplate)({
                                    topBanner: item.list,
                                    className: 'swiper-right-container'
                                });
                                $('.banner').html(rightBannerHtml);
                                new Swiper('.swiper-right-container', {
                                    direction: 'horizontal',
                                    loop: item.list.length > 1 ? true : false,
                                    autoplay: 3000
                                });
                            }
                            if (item.pageId == 'PC_M_SR_downb') { // search-all-main-bottombanner
                                var bottomBannerHtml = template.compile(topBnnerTemplate)({
                                    topBanner: item.list,
                                    className: 'swiper-bottom-container'
                                });
                                $('.search-all-main-bottombanner').html(bottomBannerHtml);
                                new Swiper('.swiper-bottom-container', {
                                    direction: 'horizontal',
                                    loop: item.list.length > 1 ? true : false,
                                    autoplay: 3000
                                });
                            }
                        }
                    });
                }
                if ($('.search-all-main-topbanner .swiper-slide').length <= 0) {
                    $('.close-swiper').hide();
                }
            }
        });
    }

    $('.search-all-main-topbanner-container .close-swiper').on('click', function () {
        $('.search-all-main-topbanner-container').hide();
    });
});
