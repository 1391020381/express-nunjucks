
// 通用头部的逻辑
define(function (require, exports, module) {
    var checkLogin = require("../application/checkLogin");
    var method = require("../application/method");
   

    $("#unLogin").on("click", function () {
        checkLogin.notifyLoginInterface(function (data) {
            refreshTopBar(data);
        });
    });
 
    $(".loginOut").on("click", function () {
        checkLogin.ishareLogout();
    });
    
    $('.top-user-more .js-buy-open').click(function(){  //  头像续费vip也有使用到
        if($(this).attr('data-type')=="vip") {
            location.href = "/pay/vip.html"
        }
    })
    
    $('.vip-join-con').click(function(){
        method.compatibleIESkip("/node/rights/vip.html",true);
    })
    $('.btn-new-search').click(function(){
        if(new RegExp('/search/home.html').test(location.href)){
            var href = window.location.href.substring(0, window.location.href.indexOf('?')) + '?ft=all';
            var sword = $('.new-input').val() ? $('.new-input').val().replace(/^\s+|\s+$/gm, '') : $('.new-input').attr('placeholder');
            window.location.href = method.changeURLPar(href, 'cond', encodeURIComponent(encodeURIComponent(sword)));
        }else{
            var sword = $('.new-input').val() ? $('.new-input').val().replace(/^\s+|\s+$/gm, '') : $('.new-input').attr('placeholder');
            if(sword){
                method.compatibleIESkip("/search/home.html?ft=all&cond=" + encodeURIComponent(encodeURIComponent(sword)),true);
            }
        }
    })
    $('.new-input').on('keydown', function (e) {
        if(new RegExp('/search/home.html').test(location.href)&&e.keyCode === 13){
            var href = window.location.href.substring(0, window.location.href.indexOf('?')) + '?ft=all';
            var sword = $('.new-input').val() ? $('.new-input').val().replace(/^\s+|\s+$/gm, '') : $('.new-input').attr('placeholder');
            window.location.href = method.changeURLPar(href, 'cond', encodeURIComponent(encodeURIComponent(sword)));
        }else{
            if (e.keyCode === 13) {
                var sword = $('.new-input').val() ? $('.new-input').val().replace(/^\s+|\s+$/gm, '') : $('.new-input').attr('placeholder');
             if(sword){
                method.compatibleIESkip("/search/home.html?ft=all&cond=" + encodeURIComponent(encodeURIComponent(sword)),true);
             }
            }
        }
    })
    var $detailHeader = $(".new-detail-header");
    var headerHeight = $detailHeader.height();
    $(window).scroll(function () {
        var detailTop = $(this).scrollTop();
        if (detailTop-headerHeight>=0) {
            $detailHeader.addClass("new-detail-header-fix");
        } else {
            $detailHeader.removeClass("new-detail-header-fix");
        }
    });

    //刷新topbar
    var refreshTopBar = function (data) {
        var $unLogin = $('#unLogin');
        var $hasLogin = $('#haveLogin');
        var $btn_user_more = $('.btn-user-more');
        var $vip_status = $('.vip-status');
       
        var $top_user_more = $(".top-user-more");

    


        // $btn_user_more.text(data.isVip == 1 ? '续费' : '开通');
        // var $target = null;

        //VIP专享资料
        // if (method.getCookie('file_state') === '6') {
        //     $('.vip-title').eq(0).show();
        // }

        //vip
        // if (data.isVip == 1) {
        //     $target = $vip_status.find('p[data-type="2"]');
        //     $target.find('.expire_time').html(data.expireTime);
        //     $target.show().siblings().hide();
        //     $top_user_more.addClass('top-vip-more');
        //     $('.isVip-show').find('span').html(data.expireTime);
        //     $('.isVip-show').removeClass('hide');
        //     $('.vip-privilege-btn').html('立即续费')
        //     //vip 已经 过期
        // } else if (data.userType == 1) {
        //     $target = $vip_status.find('p[data-type="3"]');
        //     $hasLogin.removeClass("user-con-vip");
        //     $target.show().siblings().hide();
        //     // 新用户
        // } else if (data.isVip == 0) {
        //     $hasLogin.removeClass("user-con-vip");
        //     // 续费vip
        // } else if (data.isVip == 2) {
        //     console.log('data.isVip:',data.isVip)
        //     // $('.vip-title').hide();
        // }
        
        $unLogin.hide();
        $hasLogin.find('.user-link .user-name').html(data.nickName);
        $hasLogin.find('.user-link img').attr('src', data.photoPicURL);
        $hasLogin.find('.top-user-more .name').html(data.nickName);
        $hasLogin.find('.top-user-more img').attr('src', data.photoPicURL);
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
    
        if(window.pageConfig.params){
            window.pageConfig.params.isVip = data.isVip;
        }
        var fileDiscount = data.fileDiscount;
        if (fileDiscount) {
            fileDiscount = fileDiscount / 100;
        } else {
            fileDiscount = 0.8;
        }
        if(window.pageConfig.params){
            window.pageConfig.params.fileDiscount = fileDiscount;
        }
      
        $("#ip-uid").val(data.userId);
        $("#ip-isVip").val(data.isVip);
        $("#ip-mobile").val(data.mobile);
    };
    function isLogin(callback,isAutoLogin,callback2){
        if (!method.getCookie('cuk')&&isAutoLogin) {
            checkLogin.notifyLoginInterface(function (data) {
                callback&&callback(data);
                callback2&&callback2(data)
                refreshTopBar(data);
               
            });
        }else if(method.getCookie('cuk')){
            checkLogin.getLoginData(function (data) {
                // callback2&&callback2()
                callback&&callback(data)
                refreshTopBar(data);
            });
        }else if(!isAutoLogin){
            callback&&callback()
        }
    }
    return {
        refreshTopBar:refreshTopBar,
        isLogin:isLogin
    }
});