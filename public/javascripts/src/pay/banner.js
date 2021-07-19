define(function (require) {
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
    // gebyPosition();
    function gebyPosition() {
        $.ajax({
            url: api.recommend.recommendConfigInfo,
            type: 'POST',
            data: JSON.stringify(recommendConfigInfo.paySuccess.pageIds),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (res) {
                if (res.code == '0'&&res.data&&res.data.length) {
                    res.data.forEach(function (item) { // 匹配 组装数据
                        recommendConfigInfo.paySuccess.descs.forEach(function (desc) {
                            if (item.pageId == desc.pageId) {
                                desc.list = method.handleRecommendData(item.list, dictionaryData);
                            }
                        });
                    });
                    recommendConfigInfo.paySuccess.descs.forEach(function (k) {
                        if (k.list.length) {
                            if (k.pageId == 'PC_M_PAY_SUC_banner') { // search-all-main-bottombanner
                                var bottomBannerHtml = template.compile(topBnnerTemplate)({ topBanner: k.list, className: 'pay-success-swiper-container' });
                                $('.pay-success-banner').html(bottomBannerHtml);
                                new Swiper('.pay-success-swiper-container', {
                                    direction: 'horizontal',
                                    loop: k.list.length > 1 ? true : false,
                                    autoplay: 3000
                                });
                            }
                        }
                    });
                }
            }
        });
    }
});
