define(function (require, exports, module) {
    // var $ = require("$");
    var checkLogin = require('../application/checkLogin');
    var app = require('../application/app');
    var method = require('../application/method');


    // 检查是否登陆
    checkLogin.getLoginData(function (data) {
        refreshTopBar(data);
    });


    // 退出登录
    $('.btn-exit').on('click', function () {
        checkLogin.ishareLogout();
    });

    // 刷新topbar
    function refreshTopBar(data) {
        // $('.user-info-div').show();
        // var $unLogin = $('#unLogin');
        var $hasLogin = $('#haveLogin');
        var $btn_user_more = $('.btn-user-more');
        var $vip_status = $('.vip-status');
        var $icon_iShare = $('.user-info-div').find('.icon-iShare');
        var $top_user_more = $('.top-user-more');
        var $join_vip_ele = $('.join-vip-ele').find('span');
        var $btn_join_vip = $('.btn-join-vip');

        var $target = null;

        // 新用户
        if (data.isVip === '0') {
            $icon_iShare.removeClass('icon-vip');
            $target = $vip_status.find('p[data-type="0"]');
            $target.show().siblings().hide();
            $btn_join_vip.eq(1).show().siblings().hide();

        } else if (data.isVip == '1') { // 是vip
            $target = $vip_status.find('p[data-type="1"]');
            $target.find('.expire_time').text(data.expireTime);
            $target.show().siblings().hide();
            $top_user_more.addClass('top-vip-more');
            $btn_user_more.text('续费');
            $join_vip_ele.text('续费');
            $btn_join_vip.eq(2).show().siblings().hide();

        } else if (data.userType == '1') { // vip 已经 过期
            $target = $vip_status.find('p[data-type="2"]');
            $target.show().siblings().hide();
        }


        // $unLogin.hide();
        $hasLogin.find('.user-link .user-name').html(data.nickName);
        $hasLogin.find('.user-link img').attr('src', data.photoPicURL);
        $hasLogin.find('.top-user-more .user-name').html(data.nickName);
        $hasLogin.find('.top-user-more img').attr('src', data.photoPicURL);
        // $hasLogin.show();


    }
});