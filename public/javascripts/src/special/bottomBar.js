define(function(require , exports , module){
    var api = require('../application/api');
    var method = require("../application/method");
    var login = require("../application/checkLogin");
    
   

   // 收藏与取消收藏功能
   var userId = ''   // 注意 在 loginStatusQuery 也可以取到 userID
   $('.search-img-box .ic-collect').click(function(){
       var _this = $(this)
       var contentId = $(this).attr("data-contentid") 
       var hasActiveClass = $(this).hasClass("active") 
       function addActiveClass(collectionIsSuccessful){   
        collectionIsSuccessful&&!hasActiveClass?_this.addClass('active'):_this.removeClass('active')
       }        
       if(!method.getCookie('cuk')){
           login.notifyLoginInterface(function (data) {
           console.log('-------------------',data)
           refreshTopBar(data);
           var userId = data.userId
           fileSaveOrupdate(contentId,userId,addActiveClass)
        })
       }else{
        fileSaveOrupdate(contentId,userId,addActiveClass)
       }
   })
   // 收藏或取消收藏接口
   function fileSaveOrupdate(fid,uid,addActiveClass) {
    var fn = addActiveClass
    $.ajax({
        url: api.special.fileSaveOrupdate,
        type: "POST",
        data: JSON.stringify({ fid:fid,uid:uid,source:0,channel:0 }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (res) {
            console.log(this)
            if(res.code === '0'){
                $.toast({
                    text: $(this).hasClass("active")?"取消收藏成功":"收藏成功"
                })
                fn(true)
            }else{
                fn(false)
                $.toast({
                    text: $(this).hasClass("active")?"取消收藏失败":"收藏失败"
                })
            }
        }
    })
}
// 顶部header登录逻辑
$('#a-login-link').click(function(){
    login.notifyLoginInterface(function (data) {
        console.log('-------------------',data)
        refreshTopBar(data);
     })
})

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

            // 用户不是vip,但是登录啦,隐藏 登录后开通 显示 开通
            $('.btn-join-vip').eq(0).hide()
            $('.btn-join-vip').eq(1).show()
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

    loginStatusQuery()
    // 当用户登录啦,刷新页面,重新刷新topbar
    function loginStatusQuery() {
        if (method.getCookie('cuk')) {
            login.getLoginData(function (data) {
                userId = data.userId
                refreshTopBar(data);
            });
        }
    }

    // 热点搜索切换逻辑,一次性请求30条数据,然后在点击的时候切换
    var hotItems = $('.hot-list .hot-items')
    var currentPage = 1
    var hotItemsLength =  $('.hot-spot-search .hot-list .hot-items').length
    var opt = {
        1:function(){
            hotItems.hide()
            hotItems.slice(0,10).show()
        },
        2:function(){
            hotItems.hide()
            hotItems.slice(10,20).show()
            if(hotItemsLength>10&&hotItemsLength<=20){
                currentPage = 0
            }
        },
        3:function(){
            hotItems.hide()
            hotItems.slice(20,30).show()
            currentPage = 0
        }
    }
    opt[currentPage]()
    $('.hot-spot-search .title-right').click(function(){
        if(hotItemsLength<=10){
            return
        }
        currentPage = currentPage + 1
        opt[currentPage]()
    })
   // 专题页面搜索框的逻辑
   search()
   function search(){
        var topicName = $('body > div.search-all-main > div.search-crumb-warper > span:nth-child(2)').text()  // topicName
        $('#scondition').val(topicName)
        $('#searchBtn').click(function(){
            
            var fd = $('.search-choose input[name="radio"]:checked ').val()
            window.open('http://ishare.iask.sina.com.cn/search/home.html'+ '?' + 'ft='+ fd + '&cond='+ topicName )
        })
   }
});