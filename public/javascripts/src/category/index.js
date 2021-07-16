define(function (require, exports, module) {
    require('./fixedTopBar');
    require('../application/suspension');
    var Slider = require('../common/slider');// 轮播插件
    // var utils = require('../cmd-lib/util');
    var isLogin = require('../application/effect.js').isLogin;
    var isAutoLogin = false;
    var callback = null;
    isLogin(callback, isAutoLogin);

    var obj = {
        reqParams: pageConfig.reqParams,
        init: function () {
            new Slider('J_categoty_banner', 'J_categoty_focus', 'J_categoty_prev', 'J_categoty_next');
            new Slider('j-rightBanner', 'J_right_focus', 'J_right__prev', 'J_right__next');
            this.selectMenu();
            //  this.pageOperate();
            this.fomatSelect();
            // this.sortSelect();
            this.fixRight();

            this.categoryBilog();

        },
        categoryBilog:function() {
            // 进入分类页时间戳
            var that = this;
            var startTime = new Date().getTime();
            // 监听页面解绑事件
            $(window).on('unload', function () {
                var endTime = new Date().getTime();
                trackEvent('SE050', 'pageDuration', 'page', {
                    pageID: 'CL',
                    pageName: '分类页',
                    //	进入页面时间（时间戳
                    startTime: startTime,
                    //	离开页面时间（时间戳
                    endTime: endTime,
                    //	页面停留时长（endTime - startTime）
                    duration: endTime - startTime
                }, true);
            });
            trackEvent('NE030', 'pageTypeView', 'page', {
                pageID:'CL',
                pageName:'分类页'
            });
            trackEvent('NE032', 'ctListModelView', 'view', {
                tabID:window.pageConfig.params.idArr,
                tabName:window.pageConfig.params.nameArr
            });
            $('.landing-txt-list .li-file').on('click', function (event) {
                trackEvent('NE008', 'goodsEntryClick', 'click', {
                    clID: window.pageConfig.params.idArr,
                    clName: window.pageConfig.params.nameArr,
                    goodsPostion:$(this).data('index'),
                    goodsID: $(this).data('fileid'),
                    goodsName: $(this).data('filename')
                });
            });
            // 顶部banner数据上报
            $('.search-all-main-topbanner li').on('click', function(e){
                that.recommendReport($(this));
            });
            // 右侧banner数据上报
            $('.landing-search-hot .swiper-container .swiper-slide').on('click', function(){
                that.recommendReport($(this));
            });
            // 右侧专题推荐数据上报
            $('.topicBanner-con ul li').on('click', function(e){
                that.recommendReport($(this));
            });
            // 热点搜索数据上报
            $('.hot-key-word .landing-hot-list a').on('click', function(e){
                var topicName = $(this).data('topicname');
                trackEvent('NE002', 'normalClick', 'click', {
                    domID:'hotSearch_CL',
                    domName:'热门搜索_' + topicName
                });
            });
            // 推荐位曝光事件
            var $topBannerItem = $('.search-all-main-topbanner-container .swiper-container li');
            var $rightBannerItem = $('.landing-search-hot .swiper-slide');
            var $recommendedTopics = $('.topicBanner-con ul li');
            if($topBannerItem[0]){
                trackEvent('NE037', 'recommenderModelView', 'view', {
                    recommendID:$topBannerItem.data('recommendid')+'_CL',
                    recommendName:$topBannerItem.data('recommendname') + '_分类页'
                });
            }
            if($rightBannerItem[0]){
                trackEvent('NE037', 'recommenderModelView', 'view', {
                    recommendID:$rightBannerItem.data('recommendid')+'_CL',
                    recommendName:$rightBannerItem.data('recommendname') + '_分类页'
                });
            }
            if($recommendedTopics[0]){
                trackEvent('NE037', 'recommenderModelView', 'view', {
                    recommendID:$recommendedTopics.data('recommendid')+'_CL',
                    recommendName:$recommendedTopics.data('recommendname') + '_分类页'
                });
            }
            // 点击分类
            $('.jsCategoryBilog').on('click', function (e) {
                e.stopPropagation();
                var level = $(this).data('level');
                var cid = $(this).data('cid');
                var cname = $(this).data('cname');
                that.ctListModelClick(cid, cname, level);
            });
        },
        // 分类点击埋点
        ctListModelClick:function(cid, cname, level) {
            var pageConfig = window.pageConfig || {};
            var params = pageConfig.params || {};
            var cidStr = params.idArr ? params.idArr : '';
            var cnameStr =params.nameArr ? params.nameArr : '';
            var cidList = cidStr.split('||');
            var cnameList = cnameStr.split('||');
            var tabIds = '';
            var tabNames = '';
            if (!level && level !== 0) {
            // 点击分类下属性
                tabIds = cidStr;
                tabNames = cnameStr;
            } else if (level === 0) {
            // 点击分类根节点
                tabIds = cid;
                tabNames = '';
            } else {
            // 点击分类节点
            // 点击已勾选节点的同级节点或父级节点
            // 先获取父级勾选节点数据
            // 再截取到他的前一层级
                var parentCid = cidList[level - 1];
                var parentCname = cnameList[level - 1];
                if (level <= cidList.length) {
                    cidList = cidList.splice(0, level - 1);
                    cnameList = cnameList.splice(0, level - 1);
                }
                if (cid !== parentCid) {
                    cidList.push(cid);
                    cnameList.push(cname);
                } else {
                    cidList.push(parentCid);
                    cnameList.push(parentCname);
                }
                tabIds = cidList.join('||');
                tabNames = cnameList.join('||');
            }
            trackEvent('NE034', 'ctListModelClick', 'click', {
            // 选中的tabID {tabID1}||{tabID2}||{tabID3}
                tabID: tabIds,
                // 选中的tabName  {tabName1}||{tabName2}||{tabName3}
                tabName: tabNames
            });
        },
        // 推荐位数据上报
        recommendReport:function($this){
            var recommendID = $this.data('recommendid');
            var recommendName = $this.data('recommendname');
            var recommendRecordID = $this.data('recommendrecordid');
            var postion = $this.index() + 1;
            var recommendContentTitle = $this.data('recommendcontenttitle');
            var recommendContentType = $this.data('recommendcontenttype');
            var recommendContentID = $this.data('recommendcontentid');
            var linkUrl = $this.data('linkurl');
            trackEvent('NE038', 'recommenderEntryClick', 'click', {
                recommendID:recommendID + '_CL',
                recommendName:recommendName + '_分类页',
                recommendRecordID:recommendRecordID,
                postion:postion,
                recommendContentTitle:recommendContentTitle||'',
                recommendContentType:recommendContentType,
                recommendContentID:recommendContentID,
                linkUrl:linkUrl
            });
        },
        selectMenu: function () {
            $('.js-nav-menu').click(function (event) {
                event.stopPropagation();
                $(this).parent().toggleClass('selected');
                $(this).find('i').toggleClass('rotate');
            });
            $('body').click(function () {
                if ($('.js-nav-menu').parent().hasClass('selected')) {
                    $('.js-nav-menu').parent().removeClass('selected');
                    $('.js-nav-menu').find('i').removeClass('rotate');
                }
            });
        },
        // pageOperate:function(){
        //     $('.page-ele').on('click',function(){
        //         var currentPage = $(this).attr('value');
        //         obj.pageNavigate(currentPage);
        //     })
        //     $('.js-first-page').on('click',function(){
        //         obj.pageNavigate(1);
        //     })
        //     $('.js-previous-btn').on('click',function(){
        //         var page = obj.reqParams.currentPage -1
        //         obj.pageNavigate(page);
        //     })
        //     $('.js-next-btn').on('click',function(){
        //         var page = Number(obj.reqParams.currentPage)+1
        //         obj.pageNavigate(page);
        //     })
        //     $('.js-end-btn').on('click',function(){
        //         var page = obj.reqParams.totalPages
        //         obj.pageNavigate(page);
        //     })
        // },
        fomatSelect: function () {
            $('.js-fomat').on('click', '.search-ele', function () {
                $(this).addClass('active').siblings().removeClass('active');
                var fomat = $(this).attr('data-type');
                var sortField = obj.reqParams.sortField ? '-' + obj.reqParams.sortField : '';
                var pageUrl = location.origin + '/c/' + obj.reqParams.cid + '-' + fomat + '-p1' + sortField + '.html';
                location.href = pageUrl;
            });

        },
        // sortSelect:function(){
        //     $('.js-sort').on('click','.screen-ele',function(){
        //         $(this).addClass('current').siblings().removeClass('current');
        //         var sortField =$(this).attr('value')?'-'+$(this).attr('value'):'';
        //         var fomat = obj.reqParams.fileType?obj.reqParams.fileType:'all';
        //         var pageUrl = location.origin +'/c/'+ obj.reqParams.cid+'-'+fomat+'-p1'+sortField+'.html';
        //         location.href = pageUrl;
        //     })
        // },

        pageNavigate: function (page) {
            var fomat = obj.reqParams.fileType ? obj.reqParams.fileType : 'all';
            page = 'p' + page;
            var sortField = obj.reqParams.sortField ? '-' + obj.reqParams.sortField : '';
            var pageUrl = location.origin + '/c/' + obj.reqParams.cid + '-' + fomat + '-' + page + sortField + '.html';
            location.href = pageUrl;
        },

        fixRight: function () {
            var leftHeifht = $('.search-all-left').height();
            var rightHeight = $('.landing-right').height();
            var searchHeader = $('.new-detail-header').height();
            var bannerHeight = $('.search-all-main-topbanner').height();
            var documentInnerHeight = $(window).height();
            var fixRight = 980;
            $(window).on('scroll', function () {
                var $this = $(this);
                var scrollTop = $this.scrollTop();
                if (scrollTop >= rightHeight + searchHeader + bannerHeight) {
                    $('.landing-right').css({ 'position': 'fixed', 'top': searchHeader, 'zIndex': '75' });
                    if (scrollTop > leftHeifht - documentInnerHeight) {
                        var tempHeight = leftHeifht - fixRight - 15;
                        $('.landing-right').css({ 'position': 'absolute', 'top': tempHeight });
                    }
                } else {
                    $('.landing-right').removeAttr('style');
                }
            });
        }
    };

    obj.init();
    require('../common/baidu-statistics.js').initBaiduStatistics('6512a66181dbb2ea03b2b8fc4648babc');
    require('../common/baidu-statistics.js').initBaiduStatistics('adb0f091db00ed439bf000f2c5cbaee7');
    require('../common/baidu-statistics.js').initBaiduStatistics('17cdd3f409f282dc0eeb3785fcf78a66');
});
