

define(function (require, exports, moudle) {
    require('swiper');
    var isHasPcMLogin = require('../application/wxActivity').isHasPcMLogin;
    var bannerTemplate = require('../common/template/swiper_tmp.html');
    require('../application/suspension');
    var Slider = require('../common/slider');// 轮播插件
    var login = require('../application/checkLogin');
    var utils = require('../cmd-lib/util');
    var method = require('../application/method');
    // var login = require('../application/checkLogin');
    var api = require('../application/api');


    /**
     * 推荐多图点击轮播
     * @type {{moreIndex: number, init: init, distance: number, domRend: domRend, index: number, slideLeft: slideLeft, slideRight: slideRight}}
     */
    var recomandSlide = {
        index: 0,
        distance: 0,
        moreIndex: 0,
        init: function () {
            recomandSlide.moreIndex = $('.recommend-item').length - 4;
            recomandSlide.slideLeft();
            recomandSlide.slideRight();
        },
        slideLeft: function () {
            $('.nextArrow').click(function () {
                if (recomandSlide.moreIndex > 0 && recomandSlide.index < recomandSlide.moreIndex) {
                    recomandSlide.index++;
                    recomandSlide.domRend();
                }
            });
        },
        slideRight: function () {
            $('.preArrow').click(function () {
                if (recomandSlide.index > 0) {
                    recomandSlide.index--;
                    recomandSlide.domRend();
                }
            });
        },
        domRend: function () {
            var num = -1 * recomandSlide.index * 302 + 'px';
            $('.swiper-wrapper').animate({ 'margin-left': num });
        }
    };

    var indexObject = {
        /* ***************** 【A28首页推荐位埋点】start ***************** */
        // 引导浮窗数据
        xfbannerList: [],
        recommendInfo: {
            // 顶部banner
            tb: {
                recommendBool: false
            },
            // 精选专题
            jxzt: {
                recommendBool: false
            },
            // 搜索热词
            ssrc: {
                recommendBool: false
            },
            // VIP专区
            vip: {
                recommendBool: false
            },
            // 编辑推荐
            bjtj: {
                recommendBool: false
            },
            // 权威机构
            qwjg: {
                recommendBool: false
            },
            // 引导浮窗
            ydfc: {
                recommendBool: false
            }
        },

        /**
         * 监听埋点上报
         * */
        scrollListener: function () {
            var $tbanner = $('.index-header');
            var $jxzt = $('.recommend-section');
            var $ssrc = $('.search-label');
            var $vipzq = $('.specail-area');
            var $bjtj = $('.recmond-area');
            var $qvjg = $('.institude-area');
            var $ydfc = $('.authentication-banner');

            // 执行曝光函数
            function handleExposure() {
                var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
                var clientHeight = document.documentElement.clientHeight || document.body.clientHeight;
                var curHeight = scrollTop + clientHeight;
                // 顶部banner
                if (curHeight > $tbanner.offset().top && !indexObject.recommendInfo.tb.recommendBool) {
                    if ($tbanner.find('li').length > 0) {
                        var $bitem = $('.JsBannerItem').first();
                        var bpageId = $bitem.attr('data-pageid');
                        var bpageName = $bitem.attr('data-pagename');
                        indexObject.moduleExposure(bpageId, bpageName);
                        indexObject.recommendInfo.tb.recommendBool = true;
                    }
                }
                // 精选专题
                if (curHeight > $jxzt.offset().top && !indexObject.recommendInfo.jxzt.recommendBool) {
                    if ($jxzt.find('.recommend-item ').length > 0) {
                        var $jitem = $('.JsRecommendItem').first();
                        var jpageId = $jitem.attr('data-pageid');
                        var jpageName = $jitem.attr('data-pagename');
                        indexObject.moduleExposure(jpageId, jpageName);
                        indexObject.recommendInfo.jxzt.recommendBool = true;
                    }
                }
                // 搜索热词
                if (curHeight > $ssrc.offset().top && !indexObject.recommendInfo.ssrc.recommendBool) {
                    // 如果搜索热词有数据
                    var $searchWords = $ssrc.find('.label-ele');
                    if ($searchWords.length > 0) {
                        var $ritem = $('.JsKeyWordItem').first();
                        var rpageId = $ritem.attr('data-pageid');
                        var rpageName = $ritem.attr('data-pagename');
                        indexObject.moduleExposure(rpageId, rpageName);
                        indexObject.recommendInfo.ssrc.recommendBool = true;
                    }
                }
                // vip专区
                if (curHeight > $vipzq.offset().top && !indexObject.recommendInfo.vip.recommendBool) {
                    if ($vipzq.find('.list-item').length > 0) {
                        var $vitem = $('.JsVipFileItem').first();
                        var vpageId = $vitem.attr('data-pageid');
                        var vpageName = $vitem.attr('data-pagename');
                        indexObject.moduleExposure(vpageId, vpageName);
                        indexObject.recommendInfo.vip.recommendBool = true;
                    }
                }
                // 编辑推荐
                if ($bjtj && $bjtj.offset() && curHeight > $bjtj.offset().top &&
                    !indexObject.recommendInfo.bjtj.recommendBool) {
                    // 当前曝光的编辑推荐
                    var $curList = $('.recmond-con .content-list').first();
                    if ($curList.find('.list-item').length > 0) {
                        var $citem = $('.JsRecmondItem').first();
                        var cpageId = $citem.attr('data-pageid');
                        var cpageName = $citem.attr('data-pagename');
                        indexObject.moduleExposure(cpageId, cpageName);
                        indexObject.recommendInfo.bjtj.recommendBool = true;
                    }
                }
                // 权威机构
                if (curHeight > $qvjg.offset().top && !indexObject.recommendInfo.qwjg.recommendBool) {
                    if ($qvjg.find('.list-item').length > 0) {
                        var $qitem = $('.JsOrganizeItem').first();
                        var qpageId = $qitem.attr('data-pageid');
                        var qpageName = $qitem.attr('data-pagename');
                        indexObject.moduleExposure(qpageId, qpageName);
                        indexObject.recommendInfo.qwjg.recommendBool = true;
                    }
                }
                // 引导浮窗
                if (curHeight > $ydfc.offset().top && !indexObject.recommendInfo.ydfc.recommendBool) {
                    // 如果有引导弹窗
                    var $slides = $ydfc.find('.swiper-slide');
                    if ($slides.length > 0) {
                        var sitem = indexObject.xfbannerList[0];
                        indexObject.moduleExposure(sitem.pageId, sitem.pageName);
                        indexObject.recommendInfo.ydfc.recommendBool = true;
                    }
                }
            }

            // 当前曝光
            handleExposure();
            window.onscroll = indexObject.debounce(function () {
                handleExposure();
            }, 100);
        },

        /**
         * 曝光上报
         * @param recommendID {string} 推荐位ID
         * @param recommendName {string} 推荐位名称
         * */
        moduleExposure: function (recommendID, recommendName) {
            trackEvent('NE037', 'recommenderModelView', 'view', {
                recommendID: recommendID + '_HO',
                recommendName: recommendName + '_首页'
            });
        },

        /**
         * 推荐位点击上报
         * @param recommendData {object} 推荐位数据
         * */
        recommendClick: function (recommendData) {
            trackEvent('NE038', 'recommenderEntryClick', 'click', recommendData);
        },

        /**
         * 防抖函数
         * @param fn {func} 执行函数
         * @param delay {number} 防抖间隔ms
         * */
        debounce: function (fn, delay) {
            var timer = null; // 借助闭包
            return function () {
                if (timer) {
                    // 进入该分支语句，说明当前正在一个计时过程中，并且又触发了相同事件。所以要取消当前的计时，重新开始计时
                    clearTimeout(timer);
                    timer = setTimeout(fn, delay);
                } else {
                    // 进入该分支说明当前并没有在计时，那么就开始一个计时
                    timer = setTimeout(fn, delay);
                }
            };
        },

        // 绑定推荐位点击上报事件
        recommendEventInit: function () {
            // 点击topBanner推荐位上报
            $(document).on('click', '.JsBannerItem', function () {
                indexObject.recommendReport($(this));
            });

            // 点击精选专题推荐位上报
            $(document).on('click', '.JsRecommendItem', function () {
                indexObject.recommendReport($(this));
            });

            // 点击搜索热词推荐位上报
            $(document).on('click', '.JsKeyWordItem', function () {
                indexObject.recommendReport($(this));
            });

            // 点击VIP专区推荐位上报
            $(document).on('click', '.JsVipFileItem', function () {
                indexObject.recommendReport($(this));
            });

            // 点击编辑推荐推荐位上报
            $(document).on('click', '.JsRecmondItem', function () {
                indexObject.recommendReport($(this));
            });

            // 点击权威机构推荐位上报
            $(document).on('click', '.JsOrganizeItem', function () {
                indexObject.recommendReport($(this));
            });

            // 点击引导浮窗推荐位上报
            $(document).on('click', '.JsBfbannerItem', function () {
                var id = $(this).attr('id');
                var xfbannerList = indexObject.xfbannerList;
                var clickItem = null, clickIdx = 1;
                for (var i = 0, len = xfbannerList.length; i < len; i++) {
                    if (xfbannerList[i].id == id) {
                        clickItem = xfbannerList[i];
                        clickIdx = i + 1;
                        break;
                    }
                }
                if (clickItem) {
                    indexObject.recommendClick({
                        recommendID: clickItem.pageId + '_HO',
                        recommendName: clickItem.pageName + '_首页',
                        recommendRecordID: clickItem.id,
                        postion: clickIdx,
                        recommendContentTitle: clickItem.title || clickItem.copywriting1 || '',
                        recommendContentType: clickItem.type,
                        recommendContentID: clickItem.tprId || clickItem.linkUrl,
                        linkUrl: clickItem.linkUrl
                    });
                }

            });
        },

        // 推荐位点击上报
        recommendReport: function ($this) {
            var pageId = $this.attr('data-pageid');
            var pageName = $this.attr('data-pagename');
            var id = $this.attr('data-id');
            var position = $this.attr('data-position');
            var title = $this.attr('data-title');
            var type = $this.attr('data-type');
            var contentid = $this.attr('data-contentid');
            var url = $this.attr('data-url');
            indexObject.recommendClick({
                recommendID: pageId + '_HO',
                recommendName: pageName + '_首页',
                recommendRecordID: id,
                postion: Number(position),
                recommendContentTitle: title || '',
                recommendContentType: Number(type),
                recommendContentID: contentid,
                linkUrl: url
            });
        },

        /* ***************** 【A28首页推荐位埋点】end ***************** */

        initial: function () {
            // 精选专题多图轮播
            setTimeout(function () {
                recomandSlide.init();
                indexObject.scrollListener();
                indexObject.recommendEventInit();
            }, 1000);
            // banner轮播图
            new Slider('J_office_banner', 'J_office_focus', 'J_office_prev', 'J_office_next');

            this.getDictionaryData();

            this.tabswitchFiles();
            this.tabswitchSeo();
            this.beforeInit();
            this.freshSeoData();
            this.searchWordHook();
            // 登录
            $('.notLogin').on('click', function () {
                if (!utils.getCookie('cuk')) {
                    login.notifyLoginInterface(function (data) {
                        indexObject.refreshTopBar(data);
                    });
                }
            });
            // 退出登录
            $('.loginOut').click(function () {
                login.ishareLogout();
            });
            $('.js-vaip—avatar').click(function () {
                var url = '/node/personalCenter/home.html';
                if (!utils.getCookie('cuk')) {
                    login.notifyLoginInterface(function (data) {
                        indexObject.refreshTopBar(data);
                        window.open(url);
                    });
                } else {
                    window.open(url);
                }
            });
            this.signDialog();
        },

        beforeInit: function () {
            if (utils.getCookie('cuk')) {
                login.getLoginData(function (data) {
                    if (data) {
                        indexObject.refreshTopBar(data);
                    }
                });
            }
            // 自动轮播热词
            indexObject.hotWordAuto();
        },

        // 自动轮播热词
        hotWordAuto: function () {
            var i = 0;
            var length = $('.search-container .label-ele').length;
            var timer = setInterval(function () {
                i++;
                if (i == length) {
                    i = 0;
                }
                var val = $('.search-container .label-ele').eq(i).find('a').text();
                $('.search-container .search-input').attr('placeholder', val);
            }, 4500);
            $('.search-bar input').on('focus', function () {
                clearInterval(timer);
            });
            $('.search-bar input').on('blur', function () {
                timer = setInterval(function () {
                    i++;
                    if (i == length) {
                        i = 0;
                    }
                    var val = $('.search-container .label-ele').eq(i).find('a').text();
                    $('.search-container .search-input').attr('placeholder', val);
                }, 4500);
            });
        },

        // 点击搜索
        searchWordHook: function () {
            var searVal = '';
            $('.search-container .icon-search').click(function () {
                searVal = $('.search-container .search-input').val() || $('.search-container .search-input').attr('placeholder');
                window.open('/search/home.html' + '?' + 'ft=all' + '&cond=' + encodeURIComponent(encodeURIComponent(searVal)));
            });
            $('.search-container .search-input').keydown(function (e) {
                if (e.keyCode == 13) {
                    searVal = $('.search-container .search-input').val() || $('.search-container .search-input').attr('placeholder');
                    window.open('/search/home.html' + '?' + 'ft=all' + '&cond=' + encodeURIComponent(encodeURIComponent(searVal)));
                }
            });
        },

        tabswitchFiles: function () {
            // 精选资料切换
            $('.recmond-tab').find('li').on('click', function () {
                $(this).addClass('current').siblings().removeClass('current');
                var _index = $(this).index();
                $(this).parents('.recmond-con').find('.content-list').eq(_index).addClass('current').siblings().removeClass('current');

                /* ***************** 【A28首页编辑推荐曝光埋点】 ***************** */
                var $contentList = $('.recmond-con').find('.content-list');
                var $ritem = $contentList.eq(_index).find('.list-item').first();
                var rpageId = $($ritem).children('a').attr('data-pageid');
                var rpageName = $($ritem).children('a').attr('data-pagename');
                indexObject.moduleExposure(rpageId, rpageName);
            });
        },

        tabswitchSeo: function () {
            // 晒内容专区切换
            $('.seo-upload-new').find('.upload-title').on('click', function () {
                $(this).addClass('active').siblings().removeClass('active');

                var _index = $(this).index();
                $('.seo-upload-new .tab-list .tab').each(function (index, element) {
                    if (index == _index) {
                        $(element).addClass('active');
                        $(element).first().addClass('item-active');
                    } else {
                        $(element).removeClass('active');
                    }
                });
                $(this).parents('.seo-upload-new').find('.upload-list').eq(_index).addClass('current').siblings().removeClass('current');
            });
            $('.seo-upload-new .tab-list .tab .tab-item').on('hover', function () {
                $(this).addClass('item-active').siblings().removeClass('item-active');
                var _index = $(this).index();
                var range = { // slice
                    0: { start: 0, end: 20 },
                    1: { start: 20, end: 40 },
                    2: { start: 40, end: 60 },
                    3: { start: 60, end: 80 },
                    4: { start: 80, end: 100 },
                    5: { start: 100, end: 120 },
                    6: { start: 120, end: 140 },
                    7: { start: 140, end: 160 },
                    8: { start: 160, end: 180 },
                    9: { start: 180, end: 200 }
                };
                changeItem(_index);
                function changeItem(index) {
                    $('.seo-upload-new .current li').hide();
                    $('.seo-upload-new .current li').slice(range[index].start, range[index].end).show();
                }
            });
        },

        // 换一换
        freshSeoData: function () {
            var url = '';
            var data = {
                type: 'new',
                currentPage: 1,
                pageSize: 12
            };
            var dataType = 1;
            var newIndex = 0;
            var topicndex = 0;
            // $('.js-fresh').click(function(){
            //     var type = $('.seo-upload-new .active').attr('type');
            //     var $list = $('.seo-upload-new .upload-list')
            //    if(type == 'rectopic') {
            //         dataType =2;
            //         $list = $list[1]
            //         data = {
            //             contentType: 100,
            //             clientType:1,
            //             pageSize:12,
            //             clientType:0
            //         }
            //         // url = '/gateway/seo/exposeContent/contentInfo/listContentInfos';
            //         url = api.seo.listContentInfos
            //         getData(url,data,dataType,$list)
            //    }else if(type == 'new'){
            //         newIndex++;
            //         newIndex = newIndex>3?0:newIndex;
            //         var start = newIndex*12;
            //         var end = (newIndex+1)*12;
            //         $('.upload-list').eq(0).find('li').addClass('hide')
            //        for(var i=start;i<end;i++) {
            //            $('.upload-list').eq(0).find('li').eq(i).removeClass('hide')
            //        }
            //    }else if(type == 'topic'){
            //         topicndex++;
            //         topicndex = topicndex>3?0:topicndex;
            //         var start = topicndex*12;
            //         var end = (topicndex+1)*12;
            //         $('.upload-list').eq(2).find('li').addClass('hide')
            //         for(var i=start;i<end;i++) {
            //             $('.upload-list').eq(2).find('li').eq(i).removeClass('hide')
            //         }
            //    }

            // })

            // function getData(url,data,dataType,$list){
            //     data = JSON.stringify(data);
            //     $.ajax({
            //         async: false,
            //         type: "post",
            //         url: url,
            //         data:data,
            //         dataType: "json",
            //         contentType:'application/json',
            //         success: function (data) {
            //            if(data.code =="0") {
            //             data.data.type = dataType;
            //             var _html = template.compile(headTip)({ data: data.data });
            //             $($list).html(_html)

            //            }
            //         }
            //     });
            // }
        },

        // 刷新topbar
        refreshTopBar: function (data) {
            var $unLogin = $('.notLogin');
            var $hasLogin = $('.hasLogin');
            var $btn_user_more = $('.btn-user-more');
            $unLogin.hide();
            $hasLogin.find('.user-link .user-name').html(data.nickName);
            $hasLogin.find('.user-link img').attr('src', data.photoPicURL);
            $('.user-top .avatar-frame img').attr('src', data.photoPicURL);
            $hasLogin.find('.top-user-more .name').html(data.nickName);
            $('.user-state .user-name').text(data.nickName);
            $hasLogin.show();
            console.log('data:', data);
            // data.isVip = 0

            var wholeStationVip = data.isMasterVip == 1 ? '<p class="whole-station-vip"><span class="whole-station-vip-icon"></span><span class="endtime">' + data.expireTime + '到期</span></p>' : '';
            var officeVip = data.isOfficeVip == 1 ? '<p class="office-vip"><span class="office-vip-icon"></span><span class="endtime">' + data.officeVipExpireTime + '到期</span></p>' : '';
            var infoDescContent = wholeStationVip + officeVip;

            if (data.isMasterVip == 1 || data.isOfficeVip == 1) {
                $('.user-state .vip-icon').addClass('vip-avaliable');
                $('.userOperateBtn.gocenter').removeClass('hide').siblings('.userOperateBtn').addClass('hide');
                //  var expireStr = data.expireTime+'到期'

                // $('.user-state .info-des').text(expireStr);
                $('.user-state .info-des').html(infoDescContent);
                $('.user-state').addClass('vipstate');
                $('.js-vip-open').hide();
            } else {
                $('.userOperateBtn.goVip').removeClass('hide').siblings('.userOperateBtn').addClass('hide');
                $('.user-state .info-des').text('你还不是VIP');
            }
            this.userWxAuthState();
        },

        signDialog: function () {
            $('.sign-btn').click(function () {
                $('#dialog-box').dialog({
                    html: $('#Sign-dialog').html()
                }).open();
            });
        },

        // A25：获取字典列表
        getDictionaryData: function (){
            $.ajax({
                url: api.user.dictionaryData.replace('$code', 'themeModel'),
                type: 'GET',
                async: true,
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
                cache: false,
                success: function (res) { // loginRedPacket-dialog
                    if (res.data && res.data.length) {
                        var dictionaryData = res.data;
                        indexObject.getBannerbyPosition(dictionaryData);
                    } else {
                        indexObject.getBannerbyPosition(dictionaryData);
                    }
                    // console.log('getDictionaryData', dictionaryData);
                }
            });
        },

        getBannerbyPosition: function (dictionaryData) { //
            $.ajax({
                url: api.recommend.recommendConfigInfo,
                type: 'POST',
                data: JSON.stringify(['PC_M_H_xfbanner']),
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
                success: function (res) {
                    if (res.code == '0') {
                        console.log('getBannerbyPosition:', res);
                        var list = method.handleRecommendData(res.data[0].list, dictionaryData);
                        /* ***************************** 【A28首页埋点功能】 ************************* */
                        if (list && list.length) {
                            var recomList = [];
                            for (var i = 0, len = list.length; i < len; i++) {
                                var recomItem = list[i];
                                // 追加推荐位标识-自定义字段
                                recomItem.pageId = res.data[0].pageId || '';
                                recomItem.pageName = res.data[0].name || '';
                            }
                            recomList.push(recomItem);
                            indexObject.xfbannerList = recomList;
                        }
                        /* ***************************** 【A28首页埋点功能】 ************************* */
                        var _bannerTemplate = template.compile(bannerTemplate)({ topBanner: list, className: 'authentication-container', hasDeleteIcon: false });
                        $('.authentication-banner').html(_bannerTemplate);
                        var mySwiper = new Swiper('.authentication-container', {
                            direction: 'horizontal',
                            loop: list.length > 1 ? true : false,
                            autoplay: 3000
                        });
                    }
                }
            });
        },

        userWxAuthState: function () {
            $.ajax({
                headers: {
                    Authrization: method.getCookie('cuk')
                },
                url: api.user.userWxAuthState,
                type: 'GET',
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
                success: function (res) {
                    if (res.code == '0') {
                        if (res.data.isWxAuth) {
                            $('.sign-btn').removeClass('hide');
                        }
                    } else {
                        $.toast({
                            text: res.message,
                            delay: 3e3
                        });
                    }
                },
                error: function (error) {
                    console.log('queryUserBindInfo:', error);
                }
            });
        }
    };
    indexObject.initial();
    isHasPcMLogin();
    require('../common/baidu-statistics.js').initBaiduStatistics('adb0f091db00ed439bf000f2c5cbaee7');
    require('../common/baidu-statistics.js').initBaiduStatistics('17cdd3f409f282dc0eeb3785fcf78a66');
    trackEvent('NE030', 'pageTypeView', 'page', {
        pageID: 'HO',
        pageName: '首页'
    });
});
