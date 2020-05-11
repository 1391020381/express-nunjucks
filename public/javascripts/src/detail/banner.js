define(function (require, exports, module){
    //  顶部banner位 右侧的banner位 右侧的热点搜索  相关资料  底部猜你喜欢
    require('swiper');
    var topBnnerTemplate = require("../common/template/swiper_tmp.html");
    var  hotSpotSearchListTemplate = require('./template/HotSpotSearch.html')
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
    var _html = template.compile(topBnnerTemplate)({ topBanner: arr ,className:'swiper-lefttop-container' });
    $('.fix-right-bannertop').html(_html)
    if (arr.length > 1) {
     var mySwiper = new Swiper('.swiper-lefttop-container', {
         direction: 'horizontal',
         loop: true,
         autoplay: 3000,
     })
 }

  // 左侧底部banner
  // fix-right-bannerbottom
  var _html = template.compile(topBnnerTemplate)({ topBanner: arr ,className:'swiper-leftbottom-container' });
  $('.fix-right-bannerbottom').html(_html)
  if (arr.length > 1) {
   var mySwiper = new Swiper('.swiper-leftbottom-container', {
       direction: 'horizontal',
       loop: true,
       autoplay: 3000,
   })
}

    // 热点搜索
    var hotSpotSearchList  = [
        {
            key:1,
            url:'www.baidu.com',
            value:'使用文档'
        },
        {
            key:2,
            url:'www.baidu.com',
            value:'总结汇报'
        },
        {
            key:3,
            url:'www.baidu.com',
            value:'工作总结'
        },
        {
            key:4,
            url:'www.baidu.com',
            value:'学习'
        },
        {
            key:5,
            url:'www.baidu.com',
            value:'考研资料大全'
        }
    ]
    var _html = template.compile(hotSpotSearchListTemplate)({ hotSpotSearchList: hotSpotSearchList});
    $('.hot-spot-search-warper').html(_html)

    // $('.guess-youlike-it-wrapper').html(_guessYouLikeIthtml)
      //获取运营位广告数据
      function gebyPosition() {
        $.ajax({
            url: '',
            type: "POST",
            data: '',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (res) {
            }
        })
    }
})