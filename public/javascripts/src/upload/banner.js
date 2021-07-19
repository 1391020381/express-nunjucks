define(function (require, exports, module){
    require('swiper');
    var method = require('../application/method');
    var api = require('../application/api');
    var bannerTemplate = require('../common/template/swiper_tmp.html');
    var recommendConfigInfo = require('../common/recommendConfigInfo');

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
                    getBannerbyPosition();
                } else {
                    getBannerbyPosition();
                }
                // console.log('getDictionaryData', dictionaryData);
            }
        });
    }

    getDictionaryData();

    function getBannerbyPosition() { // PC_M_USER_banner
        $.ajax({
            url: api.recommend.recommendConfigInfo,
            type: 'POST',
            data: JSON.stringify({pageIds:recommendConfigInfo.myUploadBanner.pageIds}),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (res) {
                if(res.code == '0'&&res.data&&res.data.length){
                    $(res.data).each(function(index, item){ // 匹配 组装数据
                        $(recommendConfigInfo.myUploadBanner.descs).each(function(index, desc){
                            if(item.pageId == desc.pageId){
                                desc.list = method.handleRecommendData(item.list, dictionaryData);
                            }
                        });
                    });
                    console.log(recommendConfigInfo);
                    $(recommendConfigInfo.myUploadBanner.descs).each(function(index, k){
                        if(k.list.length){
                            if(k.pageId == 'PC_M_UPLOAD_banner'){ // search-all-main-bottombanner
                                console.log('PC_M_UPLOAD_banner:', k.list);
                                var _bannerTemplate = template.compile(bannerTemplate)({ topBanner: k.list, className:'myUploadBannber-container', hasDeleteIcon:false});
                                $('.upload-banner').html(_bannerTemplate);
                                var mySwiper = new Swiper('.myUploadBannber-container', {
                                    direction: 'horizontal',
                                    loop: k.list.length>1 ? true : false,
                                    autoplay: 3000
                                });
                                $('.wrapCenter').css('margin-top', '0');
                            }
                        }
                    });
                }
            }
        });
    }

});
