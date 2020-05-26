define(function(require , exports , module){
    var api = require('../application/api');
    var topBnnerTemplate = require("../common/template/swiper_tmp.html");
    var recommendConfigInfo = require('../common/recommendConfigInfo')   
    var method = require("../application/method"); 
    // 顶部 banner
    gebyPosition()
    function gebyPosition() {
        $.ajax({
            url: api.recommend.recommendConfigInfo,
            type: "POST",
            data: JSON.stringify(recommendConfigInfo.paySuccess.pageIds),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (res) {
               if(res.code == '0'){
                res.data.forEach(function(item){  // 匹配 组装数据
                    recommendConfigInfo.paySuccess.descs.forEach(function(desc){
                        if(item.pageId == desc.pageId){
                            desc.list = method.handleRecommendData(item.list)
                        }
                    })
                })
                console.log(recommendConfigInfo)
                recommendConfigInfo.paySuccess.descs.forEach(function(k){
                    if(k.list.length){
                        if(k.pageId == 'PC_M_PAY_SUC_banner'){ // search-all-main-bottombanner
                            var _bottomBannerHtml = template.compile(topBnnerTemplate)({ topBanner: k.list ,className:'pay-success-swiper-container' });
                            $(".pay-success-banner").html(_bottomBannerHtml);
                            var mySwiper = new Swiper('.pay-success-swiper-container', {
                                direction: 'horizontal',
                                loop: true,
                                autoplay: 3000,
                            })
                        }
                    }
                })
               }
            }
        })
    }
});