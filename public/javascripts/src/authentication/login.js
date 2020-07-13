define(function(require , exports , module){

    function refreshTopBar (data) {

        var $unLogin = $('#unLogin');
        var $hasLogin = $('#haveLogin');
        var $btn_user_more = $('.btn-user-more');
        var $vip_status = $('.vip-status');
        var $icon_iShare = $(".icon-iShare");
        var $top_user_more = $(".top-user-more");
        $btn_user_more.text(data.vipStatus == 1 ? '续费' : '开通');
        var $target = null;
       
        if(data.msgCount) {
            $('.top-bar .news').removeClass('hide').find('#user-msg').text(data.msgCount);
        }
        $('.js-buy-open').click(function(){
            if($(this).attr('data-type')=="vip") {
                location.href = "/pay/vip.html"
            }
        })
        //vip
        if (data.vipStatus == 1) {
            $target = $vip_status.find('p[data-type="2"]');
            $target.find('.expire_time').html(data.expireTime);
            $target.show().siblings().hide();
            $top_user_more.addClass('top-vip-more');
            $('.vipStatus-show').find('span').html(data.expireTime);
            $('.vipStatus-show').removeClass('hide');
            //vip 已经 过期
        } else if (data.userType == 1) {
            $target = $vip_status.find('p[data-type="3"]');
            $hasLogin.removeClass("user-con-vip");
            $target.show().siblings().hide();
            // 新用户
        } else if (data.vipStatus == 0) {
            $hasLogin.removeClass("user-con-vip");

            // 用户不是vip,但是登录啦,隐藏 登录后开通 显示 开通
            $('.btn-join-vip').eq(0).hide()
            $('.btn-join-vip').eq(1).show()
            // 续费vip
        } else if (data.vipStatus == 2) {
            $('.vip-title').hide();
        }

        $unLogin.hide();
        $hasLogin.find('.user-link .user-name').html(data.nickName);
        $hasLogin.find('.user-link img').attr('src', data.photoPicURL);
        $hasLogin.find('.top-user-more .name').html(data.nickName);
        $hasLogin.find('.top-user-more img').attr('src', data.photoPicURL);
        $hasLogin.show();

        window.pageConfig.params.vipStatus = data.vipStatus;
        var fileDiscount = data.fileDiscount;
        if (fileDiscount) {
            fileDiscount = fileDiscount / 100;
        } else {
            fileDiscount = 0.8;
        }
        window.pageConfig.params.fileDiscount = fileDiscount;
        $("#ip-uid").val(data.userId);
        $("#ip-vipStatus").val(data.vipStatus);
        $("#ip-mobile").val(data.mobile);
    }
    return refreshTopBar;
 });