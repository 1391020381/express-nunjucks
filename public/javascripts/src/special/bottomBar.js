define(function(require , exports , module){
    console.log('专题的bottomBar')
    var api = require('../application/api');
    var method = require("../application/method");
    var login = require("../application/checkLogin");
   // 收藏与取消收藏功能
   $('.search-img-box .ic-collect').click(function(){
       console.log('专题收藏')
       if(!method.getCookie('cuk')){
           console.log('用户未登录')
           login.notifyLoginInterface(function (data) {
           console.log('-------------------',data)
           refreshTopBar(data);
           fileSaveOrupdate()
          
        })
       }else{
        fileSaveOrupdate()
       }
   })
   // 收藏或取消收藏接口
   function fileSaveOrupdate(fid,uid,source,channel) {
    $.ajax({
        url: api.special.fileSaveOrupdate,
        type: "POST",
        data: JSON.stringify({ fid:fid,uid:uid,source:0,channel:0 }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (res) {
            if(res.code === 0){
                $.toast({
                    text: "收藏成功"
                })
            }else{
                $.toast({
                    text: "收藏失败"
                })
            }
        }
    })
}
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

});