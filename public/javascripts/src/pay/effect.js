define(function (require, exports, module) {
    // var $ = require("$");
    var checkLogin = require("../application/checkLogin");
    var app = require("../application/app");
    var method = require("../application/method");


    //登录
    $(".js-login").on("click", function () {
        checkLogin.notifyLoginInterface(function (data) {
            refreshTopBar(data);
        });
    });
    //透传
    $(".js-sync").on("click", function () {
        checkLogin.syncUserInfoInterface(function (data) {
            refreshTopBar(data);
        });
    });
    //退出登录
    $(".js-logout").on("click", function () {
        checkLogin.ishareLogout();
    });
    //刷新topbar
    var refreshTopBar = function (data) {
        var $unLogin = $('#unLogin');
        var $hasLogin = $('#haveLogin');
        var $btn_user_more = $('.btn-user-more');
        var $vip_status = $('.vip-status');
        var $icon_iShare = $(".icon-iShare");
        var $top_user_more = $(".top-user-more");

        $btn_user_more.text(data.isVip == 1 ? '续费' : '开通');
        var $target = null;

        //VIP专享资料
        if (method.getCookie('file_state') === '6') {
            $('.vip-title').eq(0).show();
        }

        //vip
        if (data.isVip == 1) {
            $target = $vip_status.find('p[data-type="2"]');
            $target.find('.expire_time').html(data.expireTime);
            $target.show().siblings().hide();
            $top_user_more.addClass('top-vip-more');
            $('.isVip-show').find('span').html(data.expireTime);
            $('.isVip-show').removeClass('hide');
            //vip 已经 过期
        } else if (data.userType == 1) {
            $target = $vip_status.find('p[data-type="3"]');
            $hasLogin.removeClass("user-con-vip");
            $target.show().siblings().hide();
            // 新用户
        } else if (data.isVip == 0) {
            $hasLogin.removeClass("user-con-vip");
            // 续费vip
        } else if (data.isVip == 2) {
            $('.vip-title').hide();
        }

        $unLogin.hide();
        $hasLogin.find('.user-link .user-name').html(data.nickName);
        $hasLogin.find('.user-link img').attr('src', data.weiboImage);
        $hasLogin.find('.top-user-more .name').html(data.nickName);
        $hasLogin.find('.top-user-more img').attr('src', data.weiboImage);
        $hasLogin.show();

        window.pageConfig.params.isVip = data.isVip;
        var fileDiscount = data.fileDiscount;
        if (fileDiscount) {
            fileDiscount = fileDiscount / 100;
        } else {
            fileDiscount = 0.8;
        }
        window.pageConfig.params.fileDiscount = fileDiscount;
        $("#ip-uid").val(data.userId);
        $("#ip-isVip").val(data.isVip);
        $("#ip-mobile").val(data.mobile);
    };
    //是否登录
    if (!method.getCookie('cuk')) {
        checkLogin.notifyLoginInterface(function (data) {
            refreshTopBar(data);
        });
    } else {
        checkLogin.getLoginData(function (data) {
            refreshTopBar(data);
        });
    }

});