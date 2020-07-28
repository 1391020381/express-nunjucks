define(function (require, exports, module) {
   myWindow = '' // 保存第三方授权时,打开的标签
   var api = require("./api")
   var method = require("./method");
   require("../cmd-lib/myDialog");
   require('../cmd-lib/toast');
    
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

//    $(document).on('click','#dialog-box .login-type-list .login-type-qq .qq-icon',function(e){  // qq登录
//        console.log('qq登录')
//    })
//    $(document).on('click','#dialog-box .login-type-list .login-type-weibo .weibo-icon',function(e){  // 微博登录
//     console.log('weibo登录')
// })
$(document).on('click','#dialog-box .login-type-list .icon',function(){
    var loginType = $(this).attr('data-logintype')
    console.log('loginType:',loginType)
    if(loginType){
        handleThirdCodelogin(loginType)
    }
    
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
 
// 微信登录
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
 function loginByWeChat(){ // 微信扫码登录  返回 access_token 通过 access_token(cuk)
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


 // QQ 微博 登录


 function handleThirdCodelogin(loginType) {
    // var clientCode = isTHirdAuthorization == 'bindWechatAuthorization'?'wechat':isTHirdAuthorization == 'bindWeiboAuthorization'?'weibo':'qq'
    var clientCode = loginType
    var channel = 1  // 使用渠道：1:登录；2:绑定
   var location =  'http://ishare.iask.sina.com.cn/node/redirectionURL.html' + '?clientCode=' + clientCode
   var url = 'http://ishare.iask.sina.com.cn' + api.user.thirdCodelogin + '?clientCode='+ clientCode + '&channel=' + channel + '&terminal=pc' + '&businessSys=ishare' + '&location='+ encodeURIComponent(location) 
   openWindow(url)
}
 function openWindow(url){ // 第三方打开新的标签页
    var iWidth = 585;
    var iHeight = 525;
    var iTop = (window.screen.availHeight - 30 - iHeight) / 2;
    var iLeft = (window.screen.availWidth - 10 - iWidth) / 2;
    var param = 'height=' + iHeight + ',width=' + iWidth + ',top=' + iTop + ',left=' + iLeft + ',toolbar=no, menubar=no, scrollbars=no, status=no, location=yes, resizable=yes';
    myWindow =  window.open(url, '', param);
}

function thirdLoginRedirect(code,channel,clientCode){ // 根据授权code 获取 access_token
    $.ajax({
       url: api.user.thirdLoginRedirect,
       type: "POST",
       contentType: "application/json; charset=utf-8",
       data:JSON.stringify({
           terminal:'0',
           thirdType:clientCode,
           code:code,
           businessSys:'ishare'
       }),
       dataType: "json",
       success: function (res) {
          if(res.code == '0'){
           $.toast({
               text:'绑定成功',
               delay : 3000,
           })
           myWindow.close()
          }else{
           $.toast({
               text:res.msg,
               delay : 3000,
           })
           myWindow.close()
          }
       },
       error:function(error){
           myWindow.close()
           console.log('userBindThird:',error)
           $.toast({
               text:error.msg,
               delay : 3000,
           }) 
       }
   })
}
window.thirdLoginRedirect = thirdLoginRedirect




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