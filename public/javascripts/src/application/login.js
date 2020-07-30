

define(function (require, exports, module) {
   myWindow = '' // 保存第三方授权时,打开的标签
   var smsId = ''  // 验证码
   var myWindow = ''  // 保存 openWindow打开的对象
   var sceneId = '' // 微信二维码的场景id
  var mobile = ''   // 获取验证码手机号
  var businessCode = ''   // 获取验证码的场景
  var timer = null   // 二维码过期
  var setIntervalTimer = null   // 保存轮询微信登录的定时器
  var expires_in = ''  // 二位码过期时间
  var loginCallback = null   // 保存调用登录dialog 时传入的函数 并在 登录成功后调用
  var touristLoginCallback = null // 保存游客登录的传入的回调函数
   var api = require("./api")
//    var qr = require("../pay/qr");
   var method = require("./method");
   require("../cmd-lib/myDialog");
   require('../cmd-lib/toast');
   var showCaptcha = require("../common/bindphone").showCaptcha
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
   $(document).on('click','#dialog-box .weixin-login .login-qrContent .qr-refresh',function(e){ // 刷新微信登录二维码
        //    getLoginQrcode(cid,fid,true)
        getLoginQrcode('','',true)
   })


$(document).on('click','#dialog-box .getVerificationCode',function(e){  // 获取验证码   在 getVerificationCode元素上 添加标识   0 获取验证码    1 倒计时   2 重新获取验证码
    var authenticationCodeType = $(this).attr('data-authenticationCodeType')
    var telphone = $('#dialog-box .verificationCode-login .input-mobile .telphone').val()
    if(!method.testPhone(telphone)){
        $('#dialog-box .verificationCode-login .mobile .input-mobile .mobile-errortip').show()
      
        return
    }else{
        $('#dialog-box .verificationCode-login .input-mobile .mobile-errortip').hide()
    }
    if(authenticationCodeType == 0 || authenticationCodeType == 2){  // 获取验证码 
        businessCode = 4
        sendSms()
    
    }
    console.log('获取验证码',authenticationCodeType)
})
$(document).on('input','#dialog-box .verificationCode-login .telphone',function(e){
    mobile = $(this).val()
    var verificationCode = $('#dialog-box .verificationCode-login .verification-code').val()
    if(mobile.length>11){
        $('#dialog-box .telphone').val(mobile.slice(0,11))
    }
    console.log('mobile:',mobile.slice(0,11))
    if(method.testPhone(mobile.slice(0,11))){
        $('#dialog-box .verificationCode-login .input-mobile .mobile-errortip').hide()
        $('#dialog-box .getVerificationCode').addClass('getVerificationCode-active')
        if(verificationCode>=4){
            $('#dialog-box .verificationCode-login .login-btn').removeClass('login-btn-disable')
            $('#dialog-box .verificationCode-login .login-btn').addClass('login-btn-active')
        }
    }else{
        if(mobile&&mobile.length>=11){
            $('#dialog-box .verificationCode-login .input-mobile .mobile-errortip').show()
        }
        $('#dialog-box .getVerificationCode').removeClass('getVerificationCode-active')
        $('#dialog-box .verificationCode-login .login-btn').removeClass('login-btn-active')
        $('#dialog-box .verificationCode-login .login-btn').addClass('login-btn-disable')

        
    }
})
$(document).on('input','#dialog-box .verification-code',function(e){ // 验证码错误只能通过后台返回 
    mobile = $('#dialog-box .verificationCode-login .telphone').val()
    verificationCode = $(this).val()
    if(verificationCode.length>4){
        $('#dialog-box .verification-code').val(verificationCode.slice(0,4))
    }
    if(verificationCode&&verificationCode.length>=4&&method.testPhone(mobile)){
        $('#dialog-box .verificationCode-login .login-btn').removeClass('login-btn-disable')
        $('#dialog-box .verificationCode-login .login-btn').addClass('login-btn-active')
    }else{
        $('#dialog-box .verificationCode-login .login-btn').removeClass('login-btn-active')
        $('#dialog-box .verificationCode-login .login-btn').addClass('login-btn-disable')
    }
})
$(document).on('input','#dialog-box .password-login .telphone',function(){ // 
    mobile = $(this).val()
    if(mobile.length>11){
        $('#dialog-box .password-login .telphone').val(mobile.slice(0,11))
    }
    if(method.testPhone(mobile.slice(0,11))){
       $('#dialog-box .password-login .input-mobile .mobile-errortip').hide()
       // 此时密码格式正确
       var loginPassword =$('#dialog-box .password-login .password .login-password').val()
       if(loginPassword&&loginPassword.length>=4){
         $('#dialog-box .password-login .login-btn').removeClass('login-btn-disable')
         $('#dialog-box .password-login .login-btn').addClass('login-btn-active')
       }
    }else{
        if(mobile&&mobile.length>=11){
            $('#dialog-box .password-login .input-mobile .mobile-errortip').show()
        } 
        $('#dialog-box .password-login .login-btn').removeClass('login-btn-active')
        $('#dialog-box .password-login .login-btn').addClass('login-btn-disable')
    }
})
$(document).on('input','#dialog-box .password-login .login-password',function(){ // 密码错误只能通过后台返回 
    var password = $(this).val()
    var telphone = $('#dialog-box .password-login .telphone').val()
    if(password&&password.length>0){
        $('#dialog-box .password-login .password .close-eye').show()
    }else{
        $('#dialog-box .password-login .password .close-eye').hide() 
    }
    if(password.length>4){
        $('#dialog-box .password-login .login-password').val(password.slice(0,4))
    }
    if(password&&password.length==4&&method.testPhone(telphone)){
        $('#dialog-box .password-login .login-btn').removeClass('login-btn-disable')
         $('#dialog-box .password-login .login-btn').addClass('login-btn-active')
    }else{
        $('#dialog-box .password-login .login-btn').removeClass('login-btn-active')
         $('#dialog-box .password-login .login-btn').addClass('login-btn-disable')
    }
})

$(document).on('click','#dialog-box .password-login .close-eye',function(){
    var textInput =  $('#dialog-box .password-login .text-input')
    textInput.hide()
    $('#dialog-box .password-login .password-input').val(textInput.val())
    $('#dialog-box .password-login .password-input').show()
    $('#dialog-box .password-login .password .close-eye').hide() 
    $('#dialog-box .password-login .password .eye').show() 
})
$(document).on('click','#dialog-box .password-login .eye',function(){
    var passwordInput =  $('#dialog-box .password-login .password-input')
    passwordInput.hide()
    $('#dialog-box .password-login .text-input').val(passwordInput.val())
    $('#dialog-box .password-login .text-input').show()
    $('#dialog-box .password-login .password .eye').hide() 
    $('#dialog-box .password-login .password .close-eye').show() 
   
})

$(document).on('click','#dialog-box .login-type-list .icon',function(){ // 第三方登录
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
      $('#dialog-box .phone-choice .phone-num .add').text('+'+areaNum)
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
$(document).on('click','#dialog-box .login-btn',function(e){ 
    var logintype = $(this).attr('data-logintype')
    if(logintype == 'verificationCode'){
        var nationCode = $('#dialog-box .verificationCode-login .phone-num').text().replace(/\+/,'').trim()
        var checkCode = $('#dialog-box .verificationCode-login .verification-code').val()
        var mobile = $('#dialog-box .verificationCode-login .telphone').val().trim()
        if(!method.testPhone(mobile)){
            $('#dialog-box .verificationCode-login .input-mobile .mobile-errortip').show()
            return
        }else{
            $('#dialog-box .verificationCode-login .input-mobile .mobile-errortip').hide()
        }
        loginByPsodOrVerCode('codeLogin',mobile,nationCode,smsId,checkCode,'') // mobile 在获取验证码时 在全局mobile保存
        return
    }
    if(logintype == 'password'){ // mobile
        // var tempMobile = $('#dialog-box .password-login .input-moblie .telphone').val()
        var nationCode = $('#dialog-box .password-login .phone-num').text().replace(/\+/,'').trim()
        var password = $('#dialog-box .password-login .password .login-password').val()
        loginByPsodOrVerCode('ppLogin',mobile,nationCode,'','',password)
        return
    }
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
function getLoginQrcode(cid,fid,isqrRefresh,isTouristLogin,callback){  // 生成二维码 或刷新二维码 callback 游客登录的callback
    $.ajax({
        url: api.user.getLoginQrcode,
        type: "POST",
        data:JSON.stringify({
            cid:cid || '1816',
            site:'1',
            fid:fid||'',
            domain:encodeURIComponent(document.domain)
        }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (res) {
            console.log('getLoginQrcode:',res)
           if(res.code == '0'){
            touristLoginCallback = callback 
            isShowQrInvalidtip(false)  
            expires_in = res.data.expires_in
            sceneId = res.data.sceneId
            countdown()
            if(isTouristLogin){
                $('.tourist-login #login-qr').attr('src',res.data.url)
            }else{
               $('#dialog-box #login-qr').attr('src',res.data.url)
            }
            setIntervalTimer = setInterval(function(){
                loginByWeChat()
            },1000)
           }else{
            clearInterval(setIntervalTimer)
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
function isShowQrInvalidtip(flag){ // 普通微信登录  游客微信登录
    if(flag){
        $('.login-qrContent .login-qr').hide()
        $('.login-qrContent .login-qr-invalidtip').show()
    }else{
        $('.login-qrContent .login-qr-invalidtip').hide()
        $('.login-qrContent .login-qr').show()
       
    }
}
function countdown() {  // 二维码失效倒计时
    if(expires_in <=0){
        clearTimeout(timer)
        isShowQrInvalidtip(true)
        // getLoginQrcode()
    }else{
        expires_in--
        timer =  setTimeout(countdown, 1000);
    }
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
                clearInterval(setIntervalTimer)
                method.setCookieWithExpPath("cuk", res.data.access_token, res.data.expires_in*1000, "/");
                loginCallback&&loginCallback()
                touristLoginCallback&&touristLoginCallback()
           }else{
            clearInterval(setIntervalTimer)
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
            method.setCookieWithExpPath("cuk", res.data.access_token, res.data.expires_in*1000, "/");
            loginCallback&&loginCallback()
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
           console.log('thirdLoginRedirect:',error)
           $.toast({
               text:error.msg,
               delay : 3000,
           }) 
       }
   })
}
window.thirdLoginRedirect = thirdLoginRedirect

function sendSms(appId,randstr,ticket,onOff){ // 发送短信验证码
    $.ajax({
        url: api.user.sendSms,
        type: "POST",
        contentType: "application/json; charset=utf-8",
        data:JSON.stringify({
            mobile:mobile,
            nationCode:86,
            businessCode:businessCode, // 功能模块（1-注册模块、2-找回密码、3-修改密码、4-登录、5-绑定/更换手机号手机号（会检查手机号是否被使用过）、6-旧手机号获取验证码）
            terminal:'pc',
            'appId': appId,
            'randstr': randstr,
            'ticket': ticket,
            'onOff': onOff
        }),
        dataType: "json",
        success: function (res) {
           if(res.code == '0'){
            console.log('sendSms:',res) 
            smsId = res.data.smsId   
            var authenticationCode =   $('#dialog-box .getVerificationCode')
                authenticationCode.attr('data-authenticationCodeType',1);  // 获取验证码
                var timer = null;
                var textNumber = 60;
                (function countdown() {
                    if(textNumber <=0){
                        clearTimeout(timer)
                        authenticationCode.text('重新获取验证码')
                        authenticationCode.css({ 
                            'font-size':'13px',
                            "color": "#fff", 
                            "border-color": "#eee"
                        })
                        authenticationCode.attr('data-authenticationCodeType',2) // 可以重新获取验证码
                    }else{
                        authenticationCode.text(textNumber--)
                        authenticationCode.css({ 
                            "color": "#fff", 
                            "border-color": "#eee"
                        })
                        timer =  setTimeout(countdown, 1000);
                    }
                })();
           }else if(res.code == '411015'){ // 单日ip获取验证码超过三次
                showCaptcha(sendSms);
           }else if(res.code == '411033'){ // 图形验证码错误
            $.toast({
                text:'图形验证码错误',
                delay : 3000,
            }) 
           }else{
            $.toast({
                text:res.msg,
                delay : 3000,
            })
           }
        },
        error:function(error){
            console.log('sendSms:',error)
            $.toast({
                text:error.msg||'获取验证码错误',
                delay : 3000,
            }) 
        }
    })
}

function loginByPsodOrVerCode(loginType,mobile,nationCode,smsId,checkCode,password){ // 通过密码或验证码登录
    $.ajax({
        url: api.user.loginByPsodOrVerCode,
        type: "POST",
        data:JSON.stringify({
            loginType:loginType,
            terminal:'pc',
            mobile:mobile,
            nationCode:nationCode,
            smsId:smsId,
            checkCode:checkCode,
            password:password 
        }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (res) {
            console.log('loginByPsodOrVerCode:',res)
           if(res.code == '0'){
            method.setCookieWithExpPath("cuk", res.data.access_token, res.data.expires_in*1000, "/");
            loginCallback&&loginCallback()
           }else{
                if(loginType == 'codeLogin'){ // 验证码登录
                    if(res.code=='411003'){ // 短信验证码已过期

                    }
                    if(res.code == '411004'){ // 短信验证码错误

                    }
                    if(res.code =='411005'){ // 手机号未注册

                    }
                    if(res.code == '411006'){ //手机号格式不正确

                    }
               }
               
               if(loginType == 'ppLogin'){ //手机密码登录
                        if(res.code =='411005'){ // 手机号未注册

                    }
                    if(res.code =='411007'){ // 登录密码不正确

                    }

               }
            $.toast({
                text:res.msg,
                delay : 3000,
            })
           }
        },
        error:function(error){
            $.toast({
                text:error.msg||'验证码或密码登录错误',
                delay : 3000,
            })
            console.log('loginByPsodOrVerCode:',error)
        }
    })
}
 function showLoginDialog(callback){
    loginCallback = callback
    var loginDialog = $('#login-dialog')
    
    $("#dialog-box").dialog({
        html: loginDialog.html(),
        'closeOnClickModal':false
    }).open(getLoginQrcode);
  }
  function showTouristPurchaseDialog(callback){
    loginCallback = callback
    var touristPurchaseDialog = $('#tourist-purchase-dialog')
    $("#dialog-box").dialog({
        html: touristPurchaseDialog.html(),
        'closeOnClickModal':false
    }).open(function(){
        loginCallback&&loginCallback()
        getLoginQrcode()
    }); 
  }
  return {
    showLoginDialog:showLoginDialog,
    showTouristPurchaseDialog:showTouristPurchaseDialog,
    getLoginQrcode:getLoginQrcode
  }
 });