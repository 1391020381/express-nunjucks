define(function (require) {
    require('swiper');
    var recommendConfigInfo = require('../common/recommendConfigInfo');
    var method = require('../application/method');
    var bannerTemplate = require('./template/swiper_tmp.html');
    var api = require('../application/api');
    var homeRecentlySee = require('./template/homeRecentlySee.html');
    var vipPrivilegeList = require('./template/vipPrivilegeList.html');
    var type = window.pageConfig && window.pageConfig.page.type;
    var isLogin = require('../application/effect.js').isLogin;
    // 认证协议弹窗
    var agreementLayerService = require('../common/agreement-layer/index');
    var userInfo = {};
    if (type == 'home') {
        isLogin(initData, true);
        trackEvent('NE030', 'pageTypeView', 'page', {
            pageID: 'UC',
            pageName: '个人中心页-首页'
        });
    }

    var dictionaryData = [];

    function initData(data) {
        userInfo = data;
        getDictionaryData();
        getUserCentreInfo();
        getFileBrowsePage();
        getDownloadRecordList();
        // getBannerbyPosition();
        // getMyVipRightsList();
    }

    // A25：获取字典列表
    function getDictionaryData(){
        $.ajax({
            url: api.user.dictionaryData.replace('$code', 'themeModel'),
            type: 'GET',
            async: true,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            cache: false,
            success: function (res) { // loginRedPacket-dialog
                if (res.data && res.data.length) {
                    dictionaryData = res.data;
                    getBannerbyPosition();
                    getMyVipRightsList();
                } else {
                    getBannerbyPosition();
                    getMyVipRightsList();
                }
                // console.log('getDictionaryData', dictionaryData);
            }
        });
    }

    function getUserCentreInfo(callback, data) { // data 用户等信息     用户中心其他页面调用传入
        userInfo = data ? data : userInfo;
        if(userInfo.isAuth==1&&!userInfo.agreementTime){
            agreementLayerService.open(function(){
                updateAgreementTime();
            }, true);
        }
        $.ajax({
            headers: {
                'Authrization': method.getCookie('cuk')
            },
            url: api.user.getUserCentreInfo + '?scope=4',
            type: 'GET',
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (res) {
                if (res.code == '0') {
                    console.log('getUserCentreInfo:', res);
                    var isMasterVip = userInfo.isMasterVip;
                    var isOfficeVip = userInfo.isOfficeVip;
                    var privilegeNum = res.data.privilege; // 下载券数量
                    var couponNum = res.data.coupon;
                    var aibeans = res.data.aibeans;
                    // var isAuth = res.data.isAuth;
                    // var userTypeId = res.data.userTypeId;
                    // var authDesc = userTypeId==2?'个人认证':'机构认证';
                    var endDateMaster = userInfo.expireTime ? new Date(userInfo.expireTime).format('yyyy-MM-dd') : '';
                    var endDateOffice = userInfo.officeVipExpireTime ? new Date(userInfo.officeVipExpireTime).format('yyyy-MM-dd') : '';
                    // compilerTemplate(res.data)
                    // var masterIcon = isMasterVip== 1?'<span class="whole-station-vip-icon"></span>':''
                    // var officIcon = isOfficeVip ==1?'<span class="office-vip-icon"></span>':''
                    // $('.personal-center-menu .personal-profile .personal-img').attr('src',res.data.photoPicURL)
                    // $('.personal-center-menu .personal-profile .personal-nickname .nickname').(res.data.nickName)
                    // $('.personal-center-menu .personal-profile .personal-nickname-content').html('<p class="personal-nickname"><span class="nickname">'+res.data.nickName +'</span>'+ masterIcon + officIcon + '</p>')
                    // $('.personal-center-menu .personal-profile .personal-id .id').text(res.data.id?'用户ID:' + res.data.id:'用户ID:')
                    // $('.personal-center-menu .personal-profile .personal-id').html('<span class="id" id="id" value="">用户ID:'+ res.data.id + '</span><span class="copy clipboardBtn" data-clipboard-text='+ res.data.id +'data-clipboard-action="copy">复制</span>')
                    // $('.personal-center-menu .personal-profile .personal-id .copy').attr("data-clipboard-text",res.data.id)
                    // $('.personal-center-menu .personal-profile .personal-brief').text('简介: 爱问共享资料爱问共享资...')

                    if (isMasterVip == 1) {
                        // $('.personal-center-home .personal-summarys .go2vip').hide()
                        $('.personal-center-home .whole-station-vip .whole-station-vip-endtime').text(endDateMaster + '到期');
                        $('.personal-center-home .whole-station-vip').removeClass('hide');
                        $('.personal-center-home .opentvip').hide();

                        $('.personal-center-home .privileges').removeClass('hide');
                        $('.personal-center-home .occupying-effect').hide();
                    } else {
                        // $('.personal-center-home .whole-station-vip').hide()
                        $('.personal-center-menu .personal-profile .personal-nickname .level-icon').hide();

                        // $('.personal-center-home .privileges').hide()
                        // $('.personal-center-home .occupying-effect').show()
                    }
                    if (isOfficeVip == 1) {
                        $('.personal-center-home .office-vip .office-vip-endtime').text(endDateOffice + '到期');
                        $('.personal-center-home .office-vip').removeClass('hide');
                    } else {
                        // $('.personal-center-home .office-vip').hide()
                    }
                    if (!isMasterVip && !isOfficeVip) {
                        $('.personal-summarys .left-border').hide();
                    }
                    if (privilegeNum) {
                        $('.personal-center-home .volume').text(privilegeNum ? privilegeNum : 0);
                    }
                    if (couponNum) {
                        $('.personal-center-home .coupon').text(couponNum ? couponNum : 0);
                    }
                    if (aibeans) {
                        $('.personal-center-home .aibeans').text(aibeans ? (aibeans / 100).toFixed() : 0);
                    }

                    // if(isAuth == 1){
                    //     $('.personal-isAuth').html('<span class="auth-desc">'+ authDesc +'</span>')
                    //     $('.personal-menu .mywallet').css('display','block')
                    // }
                    callback && callback(res.data);
                    userWxAuthState();
                } else {
                    $.toast({
                        text: res.message || '查询用户信息失败',
                        delay: 3000
                    });
                }
            },
            error: function (error) {
                console.log('getUserCentreInfo:', error);
            }
        });
    }

    function getFileBrowsePage() { // 分页获取用户的历史浏览记录
        $.ajax({
            headers: {
                'Authrization': method.getCookie('cuk')
            },
            url: api.user.getFileBrowsePage,
            type: 'POST',
            data: JSON.stringify({
                currentPage: 1,
                pageSize: 3
            }),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (res) {
                if (res.code == '0') {

                    if (res.data.rows && res.data.rows.length) {
                        var homeRecentlySeeTemplate = template.compile(homeRecentlySee)({ flag: 'recentlySee', data: res.data.rows || [] });
                        $('.recently-see').html(homeRecentlySeeTemplate);
                    } else {
                        $('.recently-see').hide();
                    }
                } else {
                    $('.recently-see').hide();
                    $.toast({
                        text: res.message,
                        delay: 3000
                    });
                }
            },
            error: function (error) {
                $('.recently-see').hide();
                console.log('getFileBrowsePage:', error);
            }
        });
    }

    function getDownloadRecordList() { // 用户下载记录接口
        $.ajax({
            headers: {
                'Authrization': method.getCookie('cuk')
            },
            url: api.user.getDownloadRecordList,
            type: 'POST',
            data: JSON.stringify({
                currentPage: 1,
                pageSize: 3
            }),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (res) {
                if (res.code == '0') {
                    console.log('getFileBrowsePage:', res);
                    // 复用模板,需要转换接口返回的key
                    var data = [];
                    if (res.data && res.data.rows.length) {
                        $(res.data.rows).each(function (index, item) {
                            data.push({
                                id: 1,
                                fileid: item.id,
                                format: item.format,
                                totalPage: '',
                                name: item.title
                            });
                        });
                        var homeRecentlySeeTemplate = template.compile(homeRecentlySee)({ flag: 'recentlydownloads', data: data || [] });
                        $('.recently-downloads').html(homeRecentlySeeTemplate);
                    } else {
                        $('.recently-downloads').hide();
                    }
                } else {
                    $('.recently-downloads').hide();
                    $.toast({
                        text: res.message,
                        delay: 3000
                    });
                }
            },
            error: function (error) {
                $('.recently-downloads').hide();
                console.log('getFileBrowsePage:', error);
            }
        });
    }

    function getBannerbyPosition() { // PC_M_USER_banner
        $.ajax({
            url: api.recommend.recommendConfigInfo,
            type: 'POST',
            data: JSON.stringify(recommendConfigInfo.personalCenterHome.pageIds),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (res) {
                if (res.code == '0') {
                    console.log('getBannerbyPosition', res);
                    $(res.data).each(function (index, item) { // 匹配 组装数据
                        $(recommendConfigInfo.personalCenterHome.descs).each(function (index, desc) {
                            if (item.pageId == desc.pageId) {
                                desc.list = method.handleRecommendData(item.list, dictionaryData);
                            }
                        });
                    });
                    console.log(recommendConfigInfo);
                    $(recommendConfigInfo.personalCenterHome.descs).each(function (index, k) {
                        if (k.list.length) {
                            if (k.pageId == 'PC_M_USER_banner') { // search-all-main-bottombanner
                                console.log('PC_M_USER_banner:', k.list);
                                var rbannerTemplate = template.compile(bannerTemplate)({ topBanner: k.list, className: 'personalCenter-home-swiper-container', hasDeleteIcon: true, recommendID:'PC_M_USER_banner_UC',
                                    recommendName:'个人中心首页bannber_个人中心' });
                                $('.personal-center-home .advertisement').html(rbannerTemplate);
                                new Swiper('.personalCenter-home-swiper-container', {
                                    direction: 'horizontal',
                                    loop: k.list.length > 1 ? true : false,
                                    autoplay: 3000
                                });
                                trackEvent('NE037', 'recommenderModelView', 'view', {
                                    recommendID:'PC_M_USER_banner_UC',
                                    recommendName:'个人中心首页bannber_个人中心'
                                });
                            }
                        }
                    });
                }
            }
        });
    }

    function getMyVipRightsList() {
        $.ajax({
            url: api.recommend.recommendConfigInfo,
            type: 'POST',
            data: JSON.stringify(recommendConfigInfo.myVipRightsList.pageIds),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (res) {
                console.log('getMyVipRightsList', res);
                if (res.code == '0') {
                    $(res.data).each(function (index, item) { // 匹配 组装数据
                        $(recommendConfigInfo.myVipRightsList.descs).each(function (index, desc) {
                            if (item.pageId == desc.pageId) {
                                desc.list = method.handleRecommendData(item.list, dictionaryData);
                            }
                        });
                    });
                    console.log(recommendConfigInfo);
                    $(recommendConfigInfo.myVipRightsList.descs).each(function (index, k) {
                        if (k.list.length) {
                            if (k.pageId == 'PC_M_USER_vip') { // search-all-main-bottombanner
                                var vipPrivilegeListHtml = template.compile(vipPrivilegeList)({ list: k.list });
                                $('.personal-center-home .vip-privilege-items-wrapper').html(vipPrivilegeListHtml);

                            }
                        }
                    });
                }
            }
        });
    }

    function userWxAuthState() {
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
                        $('.signIn').removeClass('signIn-hide');
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
    function updateAgreementTime(){ // 更新认证时间
        var url = api.user.updateAgreementTime;
        $ajax(url, 'POST', '').done(function (res) {

        });
    }
    $(document).on('click', '.personal-center-home .add-privileges', function (e) {
        method.compatibleIESkip('/pay/privilege.html?checkStatus=13', true);
    });
    $('.js-pointsmall').on('click', function(){
        var href = $(this).attr('data-href');
        $('.active-menus').removeClass('active-menus');
        $(this).addClass('active-menus');
        method.compatibleIESkip(href, true);
    });
    // 个人中心首页轮播图点击事件 用于埋点上报
    $(document).on('click', '.personal-center-home .swiper-container .swiper-slide', function(e){
        var recommendID = $(this).data('recommendid');
        var recommendName = $(this).data('recommendname');
        var recommendRecordID = $(this).data('recommendrecordid');
        var position = $(this).index() + 1;
        var recommendContentTitle = $(this).data('recommendcontenttitle');
        var recommendContentType = $(this).data('recommendcontenttype');
        var recommendContentID = $(this).data('recommendcontentid');
        var linkUrl = $(this).data('linkurl');
        trackEvent('NE037', 'recommenderModelView', 'view', {
            recommendID:recommendID,
            recommendName:recommendName,
            recommendRecordID:recommendRecordID,
            position:position,
            recommendContentTitle:recommendContentTitle||'',
            recommendContentType:recommendContentType,
            recommendContentID:recommendContentID,
            linkUrl:linkUrl
        });
    });
    // 个人中心首页 最近看过 最近下载 用户数据上报
    $(document).on('click', '.personal-center-home .recently-see-items  .item', function(e){
        var flag = $(this).data('flag');
        var fileID = $(this).data('fileid');
        var fileName = $(this).data('filename');
        trackEvent('NE017', 'fileListNormalClick', 'click', {
            moduleID:flag == 'recentlySee'?'recentView':'recentDownload',
            moduleName:flag == 'recentlySee'?'最近看过':'最近下载',
            filePostion:$(this).index() + 1,
            fileID:fileID,
            fileName:fileName
        });
    });
    return {
        getUserCentreInfo: getUserCentreInfo
    };
});
