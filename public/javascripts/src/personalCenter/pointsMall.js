
define(function (require, exports, module) {
    require('../application/suspension');
    var method = require('../application/method');
    var iaskCoinLayer = require('../common/iask-coin-layer/index')
    var coinRuleLayer = require('../common/coin-rule-layer/index.js')
    var goodsDetailLayer = require('../common/goods-detail-layer/index')
    var api = require('../application/api')
    var isLogin = require('../application/effect.js').isLogin;
    var urlConfig = require('../application/urlConfig')
    // 新人任务
    require('swiper');
    var newcomertaskTemplate = require('./template/pointsMall/newcomertask.html')
    var dailyTaskTemplate = require('./template/pointsMall/dailyTask.html')
    var exchangeGoodsTemplate = require('./template/pointsMall/exchangeGoods.html')
    var simplePagination = require('./template/simplePagination.html');
    var obj = {
        initHtml:function(){
            var that = this
            var isAutoLogin = true;
            isLogin(function (data) {
                that.getCoinIaskBalance()
            }, isAutoLogin);

            that.bindEvent()
            trackEvent('NE030','pageTypeView','page',{
                pageID:'IMALL',
                pageName:'爱问币商城'
            })
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
                    trackEvent('NE060','modelView','view',{
                        moduleID:'iicongoods',
                        moduleName:'爱问币商品曝光'
                    })
                }
            });
        },
        getCoinIaskBalance:function(){
            var url = api.iaskCoin.getCoinIaskBalance
            var that = this
            $ajax(url, 'get','', false).done(function (res) {
                if (res.code == 0) {
                    $('.js-love-ask-coinnum').text(res.data.availableTotal || 0)
                    that.getNoviceTaskList()
                    that.getDailyTaskList()
                    that.getExchangeGoodsList(1,res.data.availableTotal)
                }
            });
        },
        getNoviceTaskList:function(){ // 新手任务
            var that = this
            var params = {
                site:urlConfig.site,
                terminal:urlConfig.terminal
            }
            var url = 'http://yapi.ishare.iasktest.com/mock/186/taskList/novice' || api.task.noviceTaskList
            $ajax(url, 'POST',params, false).done(function (res) {
                if (res.code == 0) {
                     that.createNewcomerTaskHtml(res.data)
                }
            });
        },
        getDailyTaskList:function(isLoadeMore){ //  每日任务
            var that = this
            var params = {
                limit:isLoadeMore?'':6,
                site:urlConfig.site,
                terminal:urlConfig.terminal
            }
            var url = 'http://yapi.ishare.iasktest.com/mock/186/taskList/daily' || api.task.noviceTaskList
            $ajax(url, 'POST',params, false).done(function (res) {
                if (res.code == 0) {
                    that.createDailyTaskHtml(res.data,isLoadeMore)
                }
            });
        },
        createNewcomerTaskHtml:function(data){
            var newcomertaskHtml = template.compile(newcomertaskTemplate)({ //
                newcomertaskList: this.handleTaskData(data)
            });
            $('.ponints-mall-newcomertask').html(newcomertaskHtml);
          var mySwiper =   new Swiper('.task-list', {
                direction: 'horizontal',
                spaceBetween:20,           //间距20px
                slidesPerView:5,
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                  }
            });
            $(document).on('click','.task-list .swiper-button-prev',function(){
                mySwiper.slidePrev();
            })
            $(document).on('click','.task-list .swiper-button-next',function(){
                mySwiper.slideNext();
            })
        },
        createDailyTaskHtml:function(data,isLoadeMore){
            var dailyTaskHtml = template.compile(dailyTaskTemplate)({
                dailyTaskList:this.handleTaskData(data),
                isLoadeMore:isLoadeMore
            })
            $('.ponints-mall-dailytask').html(dailyTaskHtml)
        },
        handleTaskData:function(data){
            var arr = []
            var linkUrlMap = {
                0:'/',
                1:'/search/home.html'
            }
            if(data&&data.length){
                $.each(data, function (inidex, item) {
                    var temp = {
                        linkUrl:linkUrlMap[item.linkType]?linkUrlMap[item.linkType]:item.linkUrl,
                        rewardContent:rewardContent&&rewardContent.length == 1?rewardContent[0]:item.rewardContent.join(',')
                    }
                    arr.push($.extend({},item,temp))
                })
            }
            console.log('arr:',arr)
            return arr
        },
        bindEvent:function(){
            var that = this
            $(document).on('click','.js-load-more-task',function(){
                    that.getDailyTaskList(true)
            })
            $('.js-ponit-mall-rule-desc').on('click',function(){
                coinRuleLayer.open()
            })
            $('.js-point-mall-detail').on('click',function(){
                iaskCoinLayer.open()
            })
            $(document).on('click','.js-task-btn',function(){ // 新手任务
                var href = $(this).attr('data-href')
                trackEvent('NE002','normalClick','click',{
                    domID:'doTheTask',
                    domName:'做任务点击曝光'
                })
                if(href){
                    method.compatibleIESkip(href, true);
                }
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
                trackEvent('NE002','normalClick','click',{
                    domID:'goodsClick',
                    domName:'爱问币商品点击'
                })
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
