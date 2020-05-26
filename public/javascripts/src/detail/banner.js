define(function (require, exports, module){
    //  顶部banner位 右侧的banner位 右侧的热点搜索  相关资料  底部猜你喜欢
    var method = require("../application/method");
require('swiper');
window.onload = function(){
        new Swiper('.swiper-top-container', {
            direction: 'horizontal',
            loop: true,
            autoplay: 3000,
        })
    $('.close-swiper').on("click", function (e) {
        e.stopPropagation(); 
        $('.detail-topbanner').hide()
        method.setCookieWithExpPath('isHideDetailTopbanner',1)
    })
    // 左侧顶部的 banner 
 new Swiper('.fix-right-bannertop', {
    direction: 'horizontal',
    loop: true,
    autoplay: 3000,
})
  // 左侧底部banner
 new Swiper('.fix-right-bannerbottom', {
       direction: 'horizontal',
       loop: true,
       autoplay: 3000,
   })

// title底部banner
   new Swiper('.swiper-titlebottom-container',{
    direction: 'horizontal',
    loop: true,
    autoplay: 3000,
})


new Swiper('.swiper-titlebottom-container',{
    direction: 'horizontal',
    loop: true,
    autoplay: 3000,
})
new Swiper('.swiper-turnPageOneBanner-container',{
    direction: 'horizontal',
    loop: true,
    autoplay: 3000,
})

new Swiper('.swiper-turnPageTwoBanner-container',{
    direction: 'horizontal',
    loop: true,
    autoplay: 3000,
})
}
})