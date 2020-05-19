define(function (require, exports, module){
    //  顶部banner位 右侧的banner位 右侧的热点搜索  相关资料  底部猜你喜欢
    require('swiper');
    var topBnnerTemplate = require("../common/template/swiper_tmp.html");
    // var  hotSpotSearchListTemplate = require('./template/HotSpotSearch.html')
    // var guessYouLikeTemplate = require('./template/guessYouLike.html')
    // 在 index.html中 引入的 dist/application/app.js 引入了  window.template = require("./template");

    var arr = [
        {
        key:1,
        value:'http://imgcps.jd.com/ling/7306951/5Lqs6YCJ5aW96LSn/5L2g5YC85b6X5oul5pyJ/p-5bd8253082acdd181d02fa22/29eceb26/590x470.jpg'
       },
       {
        key:2,
        value:'http://imgcps.jd.com/ling/7306951/5Lqs6YCJ5aW96LSn/5L2g5YC85b6X5oul5pyJ/p-5bd8253082acdd181d02fa22/29eceb26/590x470.jpg'
       },
       {
        key:3,
        value:'http://imgcps.jd.com/ling/7306951/5Lqs6YCJ5aW96LSn/5L2g5YC85b6X5oul5pyJ/p-5bd8253082acdd181d02fa22/29eceb26/590x470.jpg'
       },
       {
        key:4,
        value:'http://imgcps.jd.com/ling/7306951/5Lqs6YCJ5aW96LSn/5L2g5YC85b6X5oul5pyJ/p-5bd8253082acdd181d02fa22/29eceb26/590x470.jpg'
       }
     ]
     var _html = template.compile(topBnnerTemplate)({ topBanner: arr ,className:'swiper-top-container' });
       $(".detail-topbanner").html(_html);
       if (arr.length > 1) {
        var mySwiper = new Swiper('.swiper-top-container', {
            direction: 'horizontal',
            loop: true,
            autoplay: 3000,
        })
    }

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