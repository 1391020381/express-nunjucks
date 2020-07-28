define(function (require, exports, module) {
   // 登录弹框的逻辑
   var api = require("./api")
   var method = require("./method");
   require("../cmd-lib/myDialog");
   require('../cmd-lib/toast');
    var weixinLogin = $('.login-type-list .login-type-weixin .weixin-icon')
    var  qqLogin = $('.login-type-list .login-type-qq .qq-icon')
    var weiboLogin = $('.login-type-list .login-type-weibo .weibo-icon')
    var verificationCodeLogin = $('.login-type-list .login-type-verificationCode')
    var passwordLogin  = $('.login-type-list .login-type-password')

    var weixinLoginContent = $('#dialog-box .login-content .weixin-login')
    var verificationCodeLoginContent =  $('#dialog-box .login-content .verificationCode-login')
    var passwordLoginContent = $('#dialog-box .login-content .password-login')

    $(document).on('click','#dialog-box .login-type-list .login-type-weixin .weixin-icon',function(e){  // 微信登录
        $('#dialog-box .login-content .verificationCode-login').hide()
        $('#dialog-box .login-content .password-login').hide()
        $('#dialog-box .login-content .weixin-login').show()
    })
    
    $(document).on('click','#dialog-box .login-type-list .login-type-verificationCode',function(e){ // 验证码
        $('#dialog-box .login-content .password-login').hide()
        $('#dialog-box .login-content .weixin-login').hide()
        $('#dialog-box .login-content .verificationCode-login').show()
    })

   $(document).on('click','#dialog-box .login-type-list .login-type-password',function(e){  // 密码登录
    $('#dialog-box .login-content .weixin-login').hide()
    $('#dialog-box .login-content .verificationCode-login').hide()
    $('#dialog-box .login-content .password-login').show()
   })

   $(document).on('click','#dialog-box .login-type-list .login-type-qq .qq-icon',function(e){  // qq登录
       console.log('qq登录')
   })
   $(document).on('click','#dialog-box .login-type-list .login-type-weibo .weibo-icon',function(e){  // 微博登录
    console.log('weibo登录')
})
  $(document).on('click','#dialog-box  .close-btn',function(e){
      closeRewardPop()
  })
  $(document).on('click','#dialog-box .tourist-purchase-dialog .tabs .tab',function(e){
      var dataType = $(this).attr('data-type')
      $('#dialog-box .tourist-purchase-dialog .tabs .tab').removeClass('tab-active')
      $(this).addClass('tab-active')
      if(dataType == 'tourist-purchase'){
        $('#dialog-box .tourist-purchase-dialog .login-content').hide()
        $('#dialog-box .tourist-purchase-dialog .tourist-purchase-content').show()
      }
      if(dataType == 'login-purchase'){
        $('#dialog-box .tourist-purchase-dialog .tourist-purchase-content').hide()
        $('#dialog-box .tourist-purchase-dialog .login-content').show()
        
      }
  })

  // 选择区号的逻辑 
  $(document).on('click','#dialog-box .phone-choice',function(e){
      $(this).addClass('phone-choice-show')
      $('#dialog-box .phone-more').show()
      return false
      
  })
  $(document).on('click','#dialog-box .phone-more .phone-ele',function(e){
      var areaNum = $(this).find('.number-con em').text()
      console.log('areaNum:',areaNum)
      $('#dialog-box .phone-choice').removeClass('phone-choice-show')
      $('#dialog-box .phone-more').hide()
      return false
  })
  $(document).on('click','.login-dialog',function(e){
      $('#dialog-box .phone-choice').removeClass('phone-choice-show')
      $('#dialog-box .phone-more').hide()
  })
  $(document).on('click','.login-content',function(e){
    $('#dialog-box .phone-choice').removeClass('phone-choice-show')
    $('#dialog-box .phone-more').hide()
})
function closeRewardPop(){
    $(".common-bgMask").hide();
    $(".detail-bg-mask").hide();
    $('#dialog-box').hide();
} 

$.ajaxSetup({
    headers:{
        'Authrization':method.getCookie('cuk')
    },
    complete:function(XMLHttpRequest,textStatus){
    },
    statusCode: {
        401: function() { 
            method.delCookie("cuk", "/");
            $.toast({
                text:'请重新登录',
                delay : 2000
            })
        }
    }
 });
 
function getLoginQrcode(cid,fid){  // 生成二维码
    $.ajax({
        url: api.user.getLoginQrcode,
        type: "POST",
        data:JSON.stringify({
            cid:cid || '1816',
            site:'1',
            fid:fid||'',
            domain:document.domain
        }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (res) {
            console.log('getLoginQrcode:',res)
           if(res.code == '0'){
            
           }else{
            $.toast({
                text:res.msg,
                delay : 3000,
            })
           }
        },
        error:function(error){
            $.toast({
                text:error.msg||'生成二维码接口错误',
                delay : 3000,
            })
            console.log('getLoginQrcode:',error)
        }
    })
}

 function loginByWeChat(){ // 微信扫码登录
    $.ajax({
        url: api.user.loginByWeChat,
        type: "POST",
        data:JSON.stringify({
            sceneId:sceneId, // 公众号登录二维码id
            site:"1"
        }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (res) {
            console.log('loginByWeChat:',res)
           if(res.code == '0'){
            
           }else{
            $.toast({
                text:res.msg,
                delay : 3000,
            })
           }
        },
        error:function(error){
            $.toast({
                text:error.msg||'公众号登录二维码',
                delay : 3000,
            })
            console.log('loginByWeChat:',error)
        }
    })
 }
 function refreshWeChatQrcode(url,expires_in,sceneId){ // 刷新微信登录二维码
    $.ajax({
        url: api.user.refreshWeChatQrcode,
        type: "POST",
        data:JSON.stringify({
           url:url,
           expires_in:expires_in,
           site:"1",
           sceneId:sceneId
        }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (res) {
            console.log('refreshWeChatQrcode:',res)
           if(res.code == '0'){
            
           }else{
            $.toast({
                text:res.msg,
                delay : 3000,
            })
           }
        },
        error:function(error){
            $.toast({
                text:error.msg||'公众号登录二维码',
                delay : 3000,
            })
            console.log('refreshWeChatQrcode:',error)
        }
    })
 }


 function showLoginDialog(){
    var loginDialog = $('#login-dialog')
    
    $("#dialog-box").dialog({
        html: loginDialog.html(),
        'closeOnClickModal':false,
        callback:function(){
            console.log('dialog显示后的回调')
        }
    }).open();
  }
  function showTouristPurchaseDialog(){
    var touristPurchaseDialog = $('#tourist-purchase-dialog')
    $("#dialog-box").dialog({
        html: touristPurchaseDialog.html(),
        'closeOnClickModal':false
    }).open(); 
  }
  return {
    showLoginDialog:showLoginDialog,
    showTouristPurchaseDialog:showTouristPurchaseDialog
  }
 });