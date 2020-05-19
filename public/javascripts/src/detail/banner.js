define(function (require, exports, module){
    //  顶部banner位 右侧的banner位 右侧的热点搜索  相关资料  底部猜你喜欢
    require('swiper');
     new Swiper('.swiper-top-container', {
        direction: 'horizontal',
        loop: true,
        autoplay: 3000,
    })

    // 左侧顶部的 banner 
 new Swiper('.swiper-lefttop-container', {
    direction: 'horizontal',
    loop: true,
    autoplay: 3000,
})
  // 左侧底部banner
 new Swiper('.swiper-leftbottom-container', {
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


})