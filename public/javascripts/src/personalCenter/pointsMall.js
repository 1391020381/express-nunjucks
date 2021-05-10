
define(function (require, exports, module) {

    // 新人任务
    require('swiper');
    var newcomertaskList = [
        {
         icon:'',
         title:'完成登录注册',
         subTitle:'奖励100爱问币',
         desc:'用户输入关键词并进行搜索后赠送',
         url:'xxxxx'
        },
        {
            icon:'',
            title:'完成浏览资料(10s）',
            subTitle:'奖励100爱问币',
            desc:'用户从未访问过任意资料详情页 首次完成访问后，获得奖励',
            url:'xxxxx'
        },
        {
            icon:'',
            title:'完成搜索资料',
            subTitle:'奖励100爱问币',
            desc:'用户下载任意类型资料  (不限资料类型）',
            url:'xxxxx'
        },
        {
            icon:'',
            title:'完成下载资料',
            subTitle:'奖励100爱问币',
            desc:'完成首次评价时，获得爱问币',
            url:'xxxxx'
        },
        {
            icon:'',
            title:'完成登录注册',
            subTitle:'奖励100爱问币',
            desc:'用户输入关键词并进行搜索后赠送',
            url:'xxxxx'
           },
           {
               icon:'',
               title:'完成浏览资料(10s）',
               subTitle:'奖励100爱问币',
               desc:'用户从未访问过任意资料详情页 首次完成访问后，获得奖励',
               url:'xxxxx'
           },
           {
               icon:'',
               title:'完成搜索资料',
               subTitle:'奖励100爱问币',
               desc:'用户下载任意类型资料  (不限资料类型）',
               url:'xxxxx'
           },
           {
               icon:'',
               title:'完成下载资料',
               subTitle:'奖励100爱问币',
               desc:'完成首次评价时，获得爱问币',
               url:'xxxxx'
           }
    ]
    var newcomertaskTemplate = require('./template/pointsMall/newcomertask.html')
    var dailyTaskTemplate = require('./template/pointsMall/dailyTask.html')
    var exchangeGoodsTemplate = require('./template/pointsMall/exchangeGoods.html')
    var simplePagination = require('./template/simplePagination.html');
    var newcomertaskHtml = template.compile(newcomertaskTemplate)({ //
        newcomertaskList: newcomertaskList
    });
    $('.ponints-mall-newcomertask').html(newcomertaskHtml);
    new Swiper('.task-list', {
        direction: 'horizontal',
        spaceBetween:20,           //间距20px
        slidesPerView:5,
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          }
    });


    var dailyTaskHtml = template.compile(dailyTaskTemplate)({
        dailyTaskList:newcomertaskList
    })
    $('.ponints-mall-dailytask').html(dailyTaskHtml)

    var exchangeGoodsList = [
        {
            img:"//img12.360buyimg.com/jdcms/s300x300_jfs/t1/122094/28/14316/171392/5f7aecbcE674ddb1b/0144df19a3d08ae0.jpg.webp",
            desc:'积分商品名称积分商品名称积分商...',
            loveAskCoinNum:100
        },
        {
            img:"//img12.360buyimg.com/jdcms/s300x300_jfs/t1/122094/28/14316/171392/5f7aecbcE674ddb1b/0144df19a3d08ae0.jpg.webp",
            desc:'积分商品名称积分商品名称积分商...',
            loveAskCoinNum:100
        },
        {
            img:"//img12.360buyimg.com/jdcms/s300x300_jfs/t1/122094/28/14316/171392/5f7aecbcE674ddb1b/0144df19a3d08ae0.jpg.webp",
            desc:'积分商品名称积分商品名称积分商...',
            loveAskCoinNum:100
        },
        {
            img:"//img12.360buyimg.com/jdcms/s300x300_jfs/t1/122094/28/14316/171392/5f7aecbcE674ddb1b/0144df19a3d08ae0.jpg.webp",
            desc:'积分商品名称积分商品名称积分商...',
            loveAskCoinNum:100
        },
        {
            img:"//img12.360buyimg.com/jdcms/s300x300_jfs/t1/122094/28/14316/171392/5f7aecbcE674ddb1b/0144df19a3d08ae0.jpg.webp",
            desc:'积分商品名称积分商品名称积分商...',
            loveAskCoinNum:100
        }
    ]

    var exchangeGoodsHtml = template.compile(exchangeGoodsTemplate)({ //
        exchangeGoodsList: exchangeGoodsList
    });
    $('.ponints-mall-exchangegoods').html(exchangeGoodsHtml);
    handlePagination(50,2)
    function handlePagination(totalPages, currentPage) {
        var simplePaginationTemplate = template.compile(simplePagination)({
            paginationList: new Array(totalPages || 0),
            currentPage: currentPage
        });
        $('.pagination-wrapper').html(simplePaginationTemplate);
        $('.pagination-wrapper').on('click', '.page-item', function () {
            var paginationCurrentPage = $(this).attr('data-currentPage');
            if (!paginationCurrentPage) {
                return;
            }
            // 更新兑换商品列表
        });
    }
    function getNewcomertask() {
        $.ajax({
            url: api.recommend.recommendConfigInfo,
            type: 'POST',
            data: JSON.stringify(recommendConfigInfo.search.pageIds),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (res) {
                if (res.code == '0') {
                    $('.ponints-mall-newcomertask').html(newcomertaskHtml);
                    new Swiper('.newcomertask-content-list', {
                        direction: 'horizontal',
                        navigation: {
                            nextEl: '.swiper-button-next',
                            prevEl: '.swiper-button-prev',
                          }
                    });
                }
            }
        });
    }
});
