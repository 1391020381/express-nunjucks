
define(function (require, exports, module) {
    require('../application/suspension');
    var method = require('../application/method');
    var iaskCoinLayer = require('../common/iask-coin-layer/index');
    var coinRuleLayer = require('../common/coin-rule-layer/index.js');
    var goodsDetailLayer = require('../common/goods-detail-layer/index');
    var api = require('../application/api');
    var isLogin = require('../application/effect.js').isLogin;
    var urlConfig = require('../application/urlConfig');
    // 新人任务
    require('swiper');
    var newcomertaskTemplate = require('./template/pointsMall/newcomertask.html');
    var dailyTaskTemplate = require('./template/pointsMall/dailyTask.html');
    var exchangeGoodsTemplate = require('./template/pointsMall/exchangeGoods.html');
    var simplePagination = require('./template/simplePagination.html');
    var obj = {
        coinNum: '',
        dailyTaskList: [],
        initHtml: function () {
            var that = this;
            var isAutoLogin = true;
            isLogin(function (data) {
                that.getCoinIaskBalance();
            }, isAutoLogin);

            that.bindEvent();
            trackEvent('NE030', 'pageTypeView', 'page', {
                pageID: 'IMALL',
                pageName: '爱问币商城'
            });
        },
        getExchangeGoodsList: function (currentPage, coinNum) { // coinNum 兑换商品详情需要
            var that = this;
            // 排序 1-综合 2-爱问币升序 3-爱问币降序
            var sort = $('.exchange-goods-content .exchange-goods-sort .active').attr('data-sort') || 1;
            var url = api.exchange.exchangeGoodsList;
            var params = {
                currentPage: currentPage || 1,
                exchangeType: 1,
                pageSize: 20,
                sort: sort,
                terminal: 0 // 【A27-a新增终端为PC的查询条件】0-PC 1-M端 2-安卓 3-苹果 4-快应用 5-百度小程序
            };
            $ajax(url, 'POST', params).done(function (res) {
                var rows = res.data && res.data.rows || [];
                if (res.code == 0 && rows.length) {
                    var exchangeGoodsHtml = template.compile(exchangeGoodsTemplate)({ //
                        exchangeGoodsList: rows,
                        sortType: sort,
                        coinNum: coinNum || that.coinNum
                    });
                    $('.ponints-mall-exchangegoods').html(exchangeGoodsHtml);
                    that.handlePagination(res.data.totalPages, res.data.currentPage);
                    trackEvent('NE006', 'modelView', 'view', {
                        moduleID: 'iicongoods',
                        moduleName: '爱问币商品曝光'
                    });
                }
            });
        },
        getCoinIaskBalance: function () {
            var url = api.iaskCoin.getCoinIaskBalance;
            var that = this;
            $ajax(url, 'get', '').done(function (res) {
                if (res.code == 0) {
                    $('.js-love-ask-coinnum').text(res.data.availableTotal || 0);
                    that.getNoviceTaskList();
                    that.getDailyTaskList();
                    that.coinNum = res.data.availableTotal;
                    that.getExchangeGoodsList(1, res.data.availableTotal);
                }
            });
        },
        getNoviceTaskList: function () { // 新手任务
            var that = this;
            var params = {
                site: urlConfig.site,
                terminal: urlConfig.terminal
            };
            var url = api.task.noviceTaskList;
            $ajax(url, 'POST', params).done(function (res) {
                if (res.code == 0 && res.data && res.data.length) {
                    that.createNewcomerTaskHtml(res.data);
                }
            });
        },
        getDailyTaskList: function () { //  每日任务
            var that = this;
            var params = {
                site: urlConfig.site,
                terminal: urlConfig.terminal
            };
            var url = api.task.dailyTaskList;
            $ajax(url, 'POST', params).done(function (res) {
                if (res.code == 0 && res.data && res.data.length) {
                    that.dailyTaskList = res.data;
                    that.createDailyTaskHtml(that.dailyTaskList);
                }
            });
        },
        createNewcomerTaskHtml: function (data) {
            var isShowButtonPrev = data && data.length > 5;
            var newcomertaskHtml = template.compile(newcomertaskTemplate)({ //
                newcomertaskList: this.handleTaskData(data),
                isShowButtonPrev: isShowButtonPrev
            });

            $('.ponints-mall-newcomertask').html(newcomertaskHtml);
            var mySwiper = new Swiper('.task-list', {
                direction: 'horizontal',
                spaceBetween: 14,
                slidesPerView: 5
            });

            $(document).on('click', '.task-list .swiper-button-prev', function () {
                mySwiper.slidePrev();
            });
            $(document).on('click', '.task-list .swiper-button-next', function () {
                mySwiper.slideNext();
            });
        },
        createDailyTaskHtml: function (data, isLoadeMoreFlag) {
            var isLoadeMore = '';
            if (!isLoadeMoreFlag) {
                if (data && data.length > 6) {
                    isLoadeMore = true;
                } else {
                    isLoadeMore = false;
                }
            } else {
                isLoadeMore = false;
            }
            var dailyTaskList = isLoadeMore ? this.handleTaskData(data.slice(0, 6)) : this.handleTaskData(data);
            var dailyTaskHtml = template.compile(dailyTaskTemplate)({
                dailyTaskList: dailyTaskList,
                isLoadeMore: isLoadeMore
            });
            $('.ponints-mall-dailytask').html(dailyTaskHtml);
        },
        handleTaskData: function (data) {
            var arr = [];
            var linkUrlMap = {
                0: '/',
                1: '/search/home.html'
            };
            if (data && data.length) {
                $.each(data, function (index, item) {
                    var rewardContent = item.rewardContent || [];
                    var temp = {
                        linkUrl: linkUrlMap[item.linkType] ? linkUrlMap[item.linkType] : item.linkUrl,
                        rewardContent: rewardContent && rewardContent.length == 1 ? rewardContent[0] : rewardContent.join(',')
                    };
                    arr.push($.extend({}, item, temp));
                });
            }
            console.log('arr:', arr);
            return arr;
        },
        bindEvent: function () {
            var that = this;
            $(document).on('click', '.js-load-more-task', function () {
                that.createDailyTaskHtml(obj.dailyTaskList, true);
            });
            $('.js-ponit-mall-rule-desc').on('click', function () {
                coinRuleLayer.open();
            });
            $('.js-point-mall-detail').on('click', function () {
                iaskCoinLayer.open();
            });
            $(document).on('click', '.js-task-btn', function () { // 新手任务
                var href = $(this).attr('data-href');
                trackEvent('NE002', 'normalClick', 'click', {
                    domID: 'doTheTask',
                    domName: '做任务点击曝光'
                });
                if (href) {
                    method.compatibleIESkip(href, true);
                }
            });
            $(document).on('click', '.exchange-goods-content .js-sort', function () {
                console.log('js-sort');
                $('.exchange-goods-content .js-sort').removeClass('active');
                $(this).addClass('active');
                var currentPage = $('.page-list .active').attr('data-currentPage');
                that.getExchangeGoodsList(currentPage);
            });
            $(document).on('click', '.exchange-goods-content .js-exchange-goods-list-item', function () {
                console.log('js-exchange-goods-list-item');
                trackEvent('NE002', 'normalClick', 'click', {
                    domID: 'goodsClick',
                    domName: '爱问币商品点击'
                });
                var id = $(this).attr('data-id');
                var coinNum = $(this).attr('data-coinNum');
                goodsDetailLayer.open({ id: id, coinNum: coinNum }, function () {
                    that.getExchangeGoodsList(1);
                    that.getCoinIaskBalance();
                });
            });
        },
        handlePagination: function (totalPages, currentPage) {
            var simplePaginationTemplate = template.compile(simplePagination)({
                paginationList: new Array(totalPages || 0),
                currentPage: currentPage
            });
            $('.pagination-wrapper').html(simplePaginationTemplate);
            var that = this;
            $('.pagination-wrapper').on('click', '.page-item', function () {
                var paginationCurrentPage = $(this).attr('data-currentPage');
                if (!paginationCurrentPage) {
                    return;
                }
                // 更新兑换商品列表
                that.getExchangeGoodsList(paginationCurrentPage);
            });
        }
    };
    obj.initHtml();
});
