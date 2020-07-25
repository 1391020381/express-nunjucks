define(function (require, exports, module) {
   // 登录弹框的逻辑

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
 });