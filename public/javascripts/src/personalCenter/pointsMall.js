
define(function (require, exports, module) {
    require('../application/suspension');
    var iaskCoinLayer = require('../common/iask-coin-layer/index')
    var coinRuleLayer = require('../common/coin-rule-layer/index.js')
    var goodsDetailLayer = require('../common/goods-detail-layer/index')
    var api = require('../application/api')
    var isLogin = require('../application/effect.js').isLogin;

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
    var obj = {
        initHtml:function(){
            var that = this
            var isAutoLogin = true;
            isLogin(function (data) {
                that.getCoinIaskBalance()
            }, isAutoLogin);

            that.bindEvent()
        },
        getExchangeGoodsList:function(currentPage,coinNum){ // coinNum 兑换商品详情需要
            var that = this
            // 排序 1-综合 2-爱问币升序 3-爱问币降序
            var sort = $('.exchange-goods-content .exchange-goods-sort .active').attr('data-sort') || 1
            var url = api.exchange.exchangeGoodsList
            var params = {
                currentPage:currentPage||1,
                exchangeType:1,
                pageSize:20,
                sort:sort
            }
            $ajax(url, 'POST',params, false).done(function (res) {
                if (res.code == 0) {
                    var exchangeGoodsHtml = template.compile(exchangeGoodsTemplate)({ //
                        exchangeGoodsList: res.data.rows,
                        sortType:sort,
                        coinNum:coinNum
                    });
                    $('.ponints-mall-exchangegoods').html(exchangeGoodsHtml);
                    that.handlePagination(res.data.totalPages,res.data.currentPage)
                }
            });
        },
        getCoinIaskBalance:function(){
            var url = api.iaskCoin.getCoinIaskBalance
            var that = this
            $ajax(url, 'get','', false).done(function (res) {
                if (res.code == 0) {
                    that.getExchangeGoodsList(1,res.data.availableTotal)
                }
            });
        },
        bindEvent:function(){
            var that = this
            $('.js-ponit-mall-rule-desc').on('click',function(){
                coinRuleLayer.open()
            })
            $('.js-point-mall-detail').on('click',function(){
                iaskCoinLayer.open()
            })
            $(document).on('click','.exchange-goods-content .js-sort',function(){
                console.log('js-sort')
                $('.exchange-goods-content .js-sort').removeClass('active')
                $(this).addClass('active')
                var currentPage = $('.page-list .active').attr('data-currentPage')
                that.getExchangeGoodsList(currentPage)
            })
            $(document).on('click','.exchange-goods-content .js-exchange-goods-list-item',function(){
                console.log('js-exchange-goods-list-item')
                var id = $(this).attr('data-id')
                var coinNum = $(this).attr('data-coinNum')
                goodsDetailLayer.open({id:id,coinNum:coinNum})
            })
        },
        handlePagination:function(totalPages, currentPage){
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
    }
    obj.initHtml()
});
