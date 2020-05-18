define(function(require , exports , module){
    var api = require('../application/api');
    var topBnnerTemplate = require("../common/template/swiper_tmp.html");
    var recommendConfigInfo = require('../common/recommendConfigInfo')    
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
                res.data.forEach(item=>{  // 匹配 组装数据
                    recommendConfigInfo.paySuccess.descs.forEach(desc=>{
                        if(item.pageId == desc.pageId){
                            desc.list = item.list
                        }
                    })
                })
                console.log(recommendConfigInfo)
                recommendConfigInfo.paySuccess.descs.forEach(item=>{
                    if(item.list.length){
                        if(item.pageId == 'PC_M_SR_ub'){ // search-all-main-bottombanner
                            var _bottomBannerHtml = template.compile(topBnnerTemplate)({ topBanner: item.list ,className:'pay-success-swiper-container' });
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