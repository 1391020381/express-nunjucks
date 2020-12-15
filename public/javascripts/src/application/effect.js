
// 通用头部的逻辑
define(function (require, exports, module) {
    var checkLogin = require("../application/checkLogin");
    var method = require("../application/method");
    var api = require("./api");
    var loginTypeContent = require('../common/loginType')
    $("#unLogin").on("click", function () {
       
        checkLogin.notifyLoginInterface(function (data) {
            refreshTopBar(data);
        });
    });

    $(".loginOut").on("click", function () {
        var pageName =  window.pageConfig.page&&window.pageConfig.page.pageName
        if(pageName == 'personalCenter'){
            iask_web.track_event('NE002', "normalClick", 'click', {
             domID:'exit',
             domName:'退出登录'
         });
        }
        checkLogin.ishareLogout();
    });

    $('.top-user-more .js-buy-open').click(function () {  //  头像续费vip也有使用到
        if ($(this).attr('data-type') == "vip") {
            location.href = "/pay/vip.html"
        }
    })

    $('.vip-join-con').click(function () {
        method.compatibleIESkip("/node/rights/vip.html", true);
    })
    $('.btn-new-search').click(function () {
       
        if (new RegExp('/search/home.html').test(location.href)) {
            var href = window.location.href.substring(0, window.location.href.indexOf('?')) + '?ft=all';
            var sword = $('.new-input').val() ? $('.new-input').val().replace(/^\s+|\s+$/gm, '') : $('.new-input').attr('placeholder');
            window.location.href = method.changeURLPar(href, 'cond', encodeURIComponent(encodeURIComponent(sword)));
        } else {
            var sword = $('.new-input').val() ? $('.new-input').val().replace(/^\s+|\s+$/gm, '') : $('.new-input').attr('placeholder');
            if (sword) {
                method.compatibleIESkip("/search/home.html?ft=all&cond=" + encodeURIComponent(encodeURIComponent(sword)), true);
            }
        }
    })
    $('.new-input').on('keydown', function (e) {
     
        if (new RegExp('/search/home.html').test(location.href) && e.keyCode === 13) {
            var href = window.location.href.substring(0, window.location.href.indexOf('?')) + '?ft=all';
            var sword = $('.new-input').val() ? $('.new-input').val().replace(/^\s+|\s+$/gm, '') : $('.new-input').attr('placeholder');
            window.location.href = method.changeURLPar(href, 'cond', encodeURIComponent(encodeURIComponent(sword)));
        } else {
            if (e.keyCode === 13) {
                var sword = $('.new-input').val() ? $('.new-input').val().replace(/^\s+|\s+$/gm, '') : $('.new-input').attr('placeholder');
                if (sword) {
                    
                    method.compatibleIESkip("/search/home.html?ft=all&cond=" + encodeURIComponent(encodeURIComponent(sword)), true);
                }
            }
        }
    })
    var $detailHeader = $(".new-detail-header");
    var headerHeight = $detailHeader.height();
    $(window).scroll(function () {
        var detailTop = $(this).scrollTop();
        if (detailTop - headerHeight >= 0) {
            $detailHeader.addClass("new-detail-header-fix");
        } else {
            $detailHeader.removeClass("new-detail-header-fix");
        }
    });

    //刷新topbar
    var refreshTopBar = function (data) {
        var nickName = data.nickName&&data.nickName.length>4?data.nickName.slice(0,4)+'...':data.nickName
        var $unLogin = $('#unLogin');
        var $hasLogin = $('#haveLogin');
        $unLogin.hide();
        $hasLogin.find('.user-link .user-name').html(nickName);
        $hasLogin.find('.user-link img').attr('src', data.photoPicURL);
       
        $hasLogin.find('.top-user-more .name').html(nickName);
        $hasLogin.find('.top-user-more img').attr('src', data.photoPicURL);
        $hasLogin.find('.user-link .user-name').text(nickName);
        var temp = loginTypeContent[method.getCookie('loginType')]
        $hasLogin.find('.user-link .user-loginType').text(temp?temp+'登录':'');
        $hasLogin.show();

        // 办公vip开通按钮
        var $JsPayOfficeVip = $('.JsPayOfficeVip');
        // 全站vip开通按钮
        var $JsPayMainVip = $('.JsPayMainVip');
        // 全站vip图标
        var $JsMainIcon = $('.JsMainIcon');
        // 办公vip图标
        var $JsOfficeIcon = $('.JsOfficeIcon');

        if (data.isOfficeVip === 1) {
            $JsPayOfficeVip.html('立即续费');
            $JsOfficeIcon.addClass('i-vip-blue');
            $JsOfficeIcon.removeClass('i-vip-gray2');
        } else {
            $JsOfficeIcon.removeClass('i-vip-blue');
            $JsOfficeIcon.addClass('i-vip-gray2');
        }
        if (data.isMasterVip === 1) {
            $JsPayMainVip.html('立即续费');
            $JsMainIcon.addClass('i-vip-yellow');
            $JsMainIcon.removeClass('i-vip-gray1');
        } else {
            $JsMainIcon.removeClass('i-vip-yellow');
            $JsMainIcon.addClass('i-vip-gray1');
        }

        $('.jsUserImage').attr('src', data.photoPicURL);
        $('.jsUserName').text(data.nickName);

        if (window.pageConfig.params) {
            window.pageConfig.params.isVip = data.isVip;
        }
        var fileDiscount = data.fileDiscount;
        if (fileDiscount) {
            fileDiscount = fileDiscount / 100;
        } else {
            fileDiscount = 0.8;
        }
        if (window.pageConfig.params) {
            window.pageConfig.params.fileDiscount = fileDiscount;
        }

        $("#ip-uid").val(data.userId);
        $("#ip-isVip").val(data.isVip);
        $("#ip-mobile").val(data.mobile);
    };
    function isLogin(callback, isAutoLogin, callback2) {
        if (!method.getCookie('cuk') && isAutoLogin) {
            checkLogin.notifyLoginInterface(function (data) {
                callback && callback(data);
                callback2 && callback2(data)
                refreshTopBar(data);

            });
        } else if (method.getCookie('cuk')) {
            checkLogin.getLoginData(function (data) {
                callback && callback(data)
                refreshTopBar(data);
            });
        } else if (!isAutoLogin) {
            callback && callback()
        }
    }
    isHasPcMLogin()
    // 首页 详情 登录领取红包
    $(document).on('click','.loginRedPacket-dialog .close-btn',function(e){
        iask_web.track_event('NE002', "normalClick", 'click', {
            domID:'close',
            domName:'关闭'
        });
        var   abTest = window.pageConfig.page&&window.pageConfig.page.abTest
       if(abTest =='a'){
            method.setCookieWithExpPath('isShowDetailALoginRedPacket',1)
       }else if(abTest =='b'){
           method.setCookieWithExpPath('isShowDetailBLoginRedPacket',1)
       }else{
           method.setCookieWithExpPath('isShowIndexLoginRedPacket',1)
           
       }
        $('.loginRedPacket-dialog').hide()
    })
    $(document).on('click','.loginRedPacket-dialog .loginRedPacket-content',function(e){ // 区分路径 首页  详情A  详情B
        iask_web.track_event('NE002', "normalClick", 'click', {
            domID:'confirm',
            domName:'确定'
        });
        var abTest = window.pageConfig.page&&window.pageConfig.page.abTest
        if(abTest == 'a'){
            $('#detail-unLogin').trigger('click')
        }else if(abTest == 'b'){
            $('#detail-unLogin').trigger('click')
        }else{
            $('.index-header .notLogin').trigger('click')
          
        }
    
       
      //  $('.loginRedPacket-dialog').hide()
    })

    
    function isHasPcMLogin(){
        $.ajax({
            url: api.user.dictionaryData.replace('$code', 'PC-M-Login'),
            type: "GET",
            async: false,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            cache: false,
            success: function (res) { // loginRedPacket-dialog
                console.log(res)
                if (res.code == 0 && res.data && res.data.length) {
                    var item = res.data[0];
                    if (item.pcode == 'PC-M-Login') {
                        var   abTest = window.pageConfig.page&&window.pageConfig.page.abTest
                        if(abTest =='a'&&!method.getCookie('isShowDetailALoginRedPacket')){
                            $('.loginRedPacket-dialog').removeClass('hide')
                            iask_web.track_event('NE006', "modelView", 'view', {
                                moduleID:'activityFloat',
                                moduleName:'活动浮层'
                            });
                        }else if(abTest =='b'&&!method.getCookie('isShowDetailBLoginRedPacket')){
                            $('.loginRedPacket-dialog').removeClass('hide')
                            iask_web.track_event('NE006', "modelView", 'view', {
                                moduleID:'activityFloat',
                                moduleName:'活动浮层'
                            });
                        }else if(abTest=='index'&&!method.getCookie('isShowIndexLoginRedPacket')){
                            $('.loginRedPacket-dialog').removeClass('hide')
                            iask_web.track_event('NE006', "modelView", 'view', {
                                moduleID:'activityFloat',
                                moduleName:'活动浮层'
                            });
                        }
                        
                    }
                }
            }
        })
    }
    

    return {
        refreshTopBar: refreshTopBar,
        isLogin: isLogin
    }
});