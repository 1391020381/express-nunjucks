define(function(require , exports , module){
    require("../cmd-lib/jqueryMd5.js")
    var type = window.pageConfig&&window.pageConfig.page.type
    var method = require("../application/method");
    var api = require('../application/api');
    var isLogin = require('../application/effect.js').isLogin
    var getUserCentreInfo = require('./home.js').getUserCentreInfo 
    var showCaptcha = require("../common/bindphone").showCaptcha
    var closeRewardPop = require("./dialog.js").closeRewardPop
    var userBindInfo = {}  // 保存用户的绑定信息
    var smsId = ''  // 验证码
    var myWindow = ''  // 保存 openWindow打开的对象
   var mobile = ''   // 获取验证码手机号
   var businessCode = ''   // 获取验证码的场景
    if(type == 'accountsecurity'){
        isLogin(initData,true)
    }
    function initData(){
        getUserCentreInfo()
        queryUserBindInfo()
    }
    function queryUserBindInfo() {  // 查询用户绑定信息
        $.ajax({
            headers:{
                'Authrization':method.getCookie('cuk')
            },
            url: api.user.queryBindInfo,
            type: "GET",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (res) {
               if(res.code == '0'){
                    console.log('queryUserBindInfo:',res)
                    userBindInfo = res.data || {}
                    var accountsecurity = require("./template/accountsecurity.html")
                    var _accountsecurityTemplate = template.compile(accountsecurity)({userBindInfo:res.data});
                    $(".personal-center-accountsecurity").html(_accountsecurityTemplate);
               }else{
                $.toast({
                    text:res.msg,
                    delay : 3000,
                }) 
               }
            },
            error:function(error){
                console.log('queryUserBindInfo:',error)
            }
        })
    }
    function untyingThird(thirdType){
        $.ajax({
            url: api.user.untyingThird,
            type: "POST",
            contentType: "application/json; charset=utf-8",
            data:JSON.stringify({
                terminal:'pc',
                thirdType:thirdType
            }),
            dataType: "json",
            success: function (res) {
               if(res.code == '0'){
                $.toast({
                    text:'解绑成功!',
                    delay : 3000,
                }) 
                  closeRewardPop()
                  queryUserBindInfo()  // 当用户绑定信息修改后, 请求接口刷新
               }else{
                $.toast({
                    text:res.msg,
                    delay : 3000,
                })
               }
            },
            error:function(error){
                console.log('userBindMobile:',error)
            }
        })
    }
    function userBindMobile(mobile,smsId,checkCode){ // 绑定手机号接口
        $.ajax({
            url: api.user.userBindMobile,
            type: "POST",
            contentType: "application/json; charset=utf-8",
            data:JSON.stringify({
                terminal:'pc',
                mobile:mobile,
                nationCode:86,
                smsId:smsId,
                checkCode:checkCode
            }),
            dataType: "json",
            success: function (res) {
               if(res.code == '0'){
                $.toast({
                    text:'绑定手机号成功!',
                    delay : 3000,
                }) 
                var isTHirdAuthorization = $('#dialog-box .bind-phonenumber-dialog .title').attr('data-isTHirdAuthorization')
                if(isTHirdAuthorization){  // 绑定第三方的时候，需要先绑定手机号。绑定完手机号需要 拉起绑定第三方的弹框
                    closeRewardPop()
                  //  queryUserBindInfo()
                    handleThirdCodelogin(isTHirdAuthorization)
                }else{
                  closeRewardPop()
                  queryUserBindInfo()  // 当用户绑定信息修改后, 请求接口刷新
                }
               }else{
                $.toast({
                    text:res.msg,
                    delay : 3000,
                }) 
               }
            },
            error:function(error){
                console.log('userBindMobile:',error)
            }
        })
    }
    function checkIdentity(smsId,checkCode){ // 身份验证账号
        $.ajax({
            url: api.user.checkIdentity + '?smsId='+ smsId + '&checkCode=' + checkCode,
            type: "GET",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (res) {
               if(res.code == '0'){
                console.log('checkIdentity:',res)
                smsId  = ''   // 清空保存的  短信id
                //  换绑手机号和解绑第三方 需要身份验证
                var isTHirdAuthorization = $('#dialog-box .identity-authentication-dialog .title').attr('data-isTHirdAuthorization')
                if(isTHirdAuthorization){  // 第三方授权解绑 身份认证
                    unbindTHirdAuthorization(isTHirdAuthorization)
                }else{
                    closeRewardPop()
                    bindPhoneNumber('')
                }
               }else{
                $.toast({
                    text:res.msg,
                    delay : 3000,
                })
               }
            },
            error:function(error){
                console.log('checkIdentity:',error)
            }
        })
    }
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
                var authenticationCode =   $('#dialog-box .authentication-code')
                    authenticationCode.attr('data-authenticationCodeType',1);  // 获取验证码
                    var timer = null;
                    var textNumber = 60;
                    (function countdown() {
                        if(textNumber <=0){
                            clearTimeout(timer)
                            authenticationCode.text('重新获取验证码')
                            authenticationCode.css({ 
                                'font-size':'13px',
                                "color": "#333", 
                                "border-color": "#eee"
                            })
                            authenticationCode.attr('data-authenticationCodeType',2) // 可以重新获取验证码
                        }else{
                            authenticationCode.text(textNumber--)
                            authenticationCode.css({ 
                                "color": "#333", 
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
    function setUpPassword(smsId,checkCode,password){
        $.ajax({
            url: api.user.setUpPassword,
            type: "POST",
            contentType: "application/json; charset=utf-8",
            data:JSON.stringify({
                terminal:'pc',
                smsId:smsId,
                checkCode:checkCode,
                password:$.md5(password)
            }),
            dataType: "json",
            success: function (res) {
               if(res.code == '0'){
                    console.log('setUpPassword:',res)

                    $.toast({
                        text:'设置密码成功',
                        delay : 3000,
                    }) 
                 closeRewardPop()
                  queryUserBindInfo()  
               }else{
                $.toast({
                    text:res.msg,
                    delay : 3000,
                }) 
               }
            },
            error:function(error){
                console.log('setUpPassword:',error)
            }
        })
    }
    function bindPhoneNumber(isTHirdAuthorization){  // 绑定手机号/ 换绑手机号 dialog
        $("#dialog-box").dialog({
            html: $('#bind-phonenumber-dialog').html().replace(/\$isTHirdAuthorization/, isTHirdAuthorization),
        }).open();
    }
    function handleThirdCodelogin(isTHirdAuthorization) {
          var clientCode = isTHirdAuthorization == 'bindWechatAuthorization'?'wechat':isTHirdAuthorization == 'bindWeiboAuthorization'?'weibo':'qq'
          var channel = 2
        //   var location = window.location.origin + '/node/redirectionURL.html' + '?clientCode=' + clientCode
        var location =  'http://ishare.iask.sina.com.cn/node/redirectionURL.html' + '?clientCode=' + clientCode
        //  var url = window.location.origin + api.user.thirdCodelogin + '?clientCode='+ clientCode + '&channel=' + channel + '&terminal=pc' + '&businessSys=ishare' + '&location='+ encodeURIComponent(location)
        var url = 'http://ishare.iask.sina.com.cn' + api.user.thirdCodelogin + '?clientCode='+ clientCode + '&channel=' + channel + '&terminal=pc' + '&businessSys=ishare' + '&location='+ encodeURIComponent(location)
        openWindow(url)
    }
    function identityAuthentication(isTHirdAuthorization){ // 换绑手机号(后续拉起绑定手机号)   和 解绑第三方需要验证
        // 解绑第三方的时候,保证一定有绑定手机号

        if(userBindInfo.mobile){
            if(isTHirdAuthorization){ // 是否是第三方身份校验 ,给一个标识 在身份认证完后 弹不同的dialog
                $("#dialog-box").dialog({
                    html: $('#identity-authentication-dialog').html()
                    .replace(/\$phoneNumber/, userBindInfo.mobile)
                    .replace(/\$isTHirdAuthorization/, isTHirdAuthorization)
                }).open();
            }else{
                $("#dialog-box").dialog({
                    html: $('#identity-authentication-dialog').html()
                    .replace(/\$phoneNumber/, userBindInfo.mobile)
                    .replace(/\$isTHirdAuthorization/, '')
                }).open();
            }
        }else{
            bindPhoneNumber('')
        }
    }

    function unbindTHirdAuthorization(isTHirdAuthorization){  // isTHirdAuthorization 解绑哪个第三方
        $("#dialog-box").dialog({
            html: $('#unbind-account-dialog').html().replace(/\$isTHirdAuthorization/, isTHirdAuthorization),
        }).open();
    }
    function handleBindThird(code,channel,clientCode){
         $.ajax({
            url: api.user.userBindThird,
            type: "POST",
            contentType: "application/json; charset=utf-8",
            data:JSON.stringify({
                terminal:'pc',
                thirdType:clientCode,
                code:code
            }),
            dataType: "json",
            success: function (res) {
               if(res.code == '0'){
                $.toast({
                    text:'绑定成功',
                    delay : 3000,
                })
                myWindow.close()
                queryUserBindInfo()  // 当用户绑定信息修改后, 请求接口刷新
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
    window.handleBindThird = handleBindThird

    function openWindow(url){
            var iWidth = 585;
            var iHeight = 525;
            var iTop = (window.screen.availHeight - 30 - iHeight) / 2;
            var iLeft = (window.screen.availWidth - 10 - iWidth) / 2;
            var param = 'height=' + iHeight + ',width=' + iWidth + ',top=' + iTop + ',left=' + iLeft + ',toolbar=no, menubar=no, scrollbars=no, status=no, location=yes, resizable=yes';
            myWindow =  window.open(url, '', param);
    }
  


    $(document).on('click', '.account-security-list .item-btn', function (event) {
       var  btnOperation =  $(this).attr("data-btnOperation")
       console.log('userBindInfo:',userBindInfo)
       if(btnOperation == 'modifyPhoneNumber'){
           identityAuthentication()
       }

       if(btnOperation == 'bindPhoneNumber'){
            bindPhoneNumber('')
       }

       if(btnOperation == 'unbindWechatAuthorization'){
            identityAuthentication('unbindWechatAuthorization')
       }
       if(btnOperation == 'bindWechatAuthorization'){
               if(userBindInfo.mobile){
                handleThirdCodelogin('bindWechatAuthorization') 
               }else{
                bindPhoneNumber('bindWechatAuthorization')
               }
       }
       if(btnOperation == 'unbindWeiboAuthorization'){
             identityAuthentication('unbindWeiboAuthorization')
       }
       if(btnOperation == 'bindWeiboAuthorization'){
            if(userBindInfo.mobile){
                handleThirdCodelogin('bindWeiboAuthorization') 
            }else{
                bindPhoneNumber('bindWeiboAuthorization')
            }
       }

       if(btnOperation == 'unbindQQAuthorization'){
              identityAuthentication('unbindQQAuthorization')
       }
        
       if(btnOperation == 'bindQQAuthorization'){
        if(userBindInfo.mobile){
            handleThirdCodelogin('bindQQAuthorization') 
        }else{
            bindPhoneNumber('bindQQAuthorization')
        }
       }

       if(btnOperation == 'changePassword'){
             $("#dialog-box").dialog({
            html: $('#set-change-password-dialog').html().replace(/\$phone/, userBindInfo.mobile),
        }).open();
       }

       if(btnOperation == 'setPassword'){
           if(userBindInfo.mobile){
            $("#dialog-box").dialog({
                html: $('#set-change-password-dialog').html().replace(/\$phone/, userBindInfo.mobile),
            }).open();
           }else{
              bindPhoneNumber('')
           }
       }
    });

     $('#dialog-box').on('click','.authentication-btn',function(e){  // 身份验证
        //   var checkIdentity
        var checkCode = $("#dialog-box .authentication-input").val()
        if(checkCode){
            checkIdentity(smsId,checkCode)
        }else{
            $.toast({
                text:'请输入短信验证码!',
                delay : 3000,
            }) 
        }
    })

    $(document).on('click','.authentication-code',function(e){  // 获取验证码   在 authentication-code元素上 添加标识   0 获取验证码    1 倒计时   2 重新获取验证码
        var authenticationCodeType = $(this).attr('data-authenticationCodeType')
        var isiDentityAuthentication= $(this).attr('data-isiDentityAuthentication')
        if(authenticationCodeType == 0 || authenticationCodeType == 2){  // 获取验证码
              if(isiDentityAuthentication == '1'){
                mobile = userBindInfo.mobile
                businessCode = 7
                sendSms()
              }else{
                var tempmobile = $('#dialog-box .item-phonenumber').val()
                if(!method.testPhone(tempmobile)){ //  获取验证码前 需输入验证码
                    $.toast({
                        text:'请输入正确的手机号',
                        delay : 3000,
                    })
                    return
                } 
                mobile = tempmobile
                businessCode = 5
                sendSms()
              }
        }
        console.log('获取验证码',authenticationCodeType)
    })

    $('#dialog-box').on('click','.bind-phonenumber-dialog .confirm-binding',function(e){  // 绑定手机号 换绑手机号 确认事件 
        var phonenumber = $('#dialog-box .item-phonenumber').val()
        var verificationcode = $('#dialog-box .item-verificationcode').val()
        if(!method.testPhone(phonenumber)){
            $.toast({
                text:'请输入正确的手机号',
                delay : 3000,
            })
            return
        } 
        if(!verificationcode){
            $.toast({
                text:'验证码不能为空!',
                delay : 3000,
            })
            return 
        }
        userBindMobile(phonenumber,smsId,verificationcode) // mobile,smsId,checkCode
    })

    $('#dialog-box').on('click','.set-change-password-dialog .set-change-password',function(e){
        // var phonenumber = $('#dialog-box .item-phonenumber').val()
        var verificationcode = $('#dialog-box .item-verificationcode').val()
        var newPassword = $('#dialog-box .item-newpassword').val()
        if(!verificationcode){
            $.toast({
                text:'验证码不能为空!',
                delay : 3000,
            })
            return 
        }
        if(!newPassword){
            $.toast({
                text:'新密码不能为空!',
                delay : 3000,
            })
            return 
        }
        setUpPassword(smsId,verificationcode,newPassword)
        // setUpPassword(smsId,checkCode,password)
    })
    $('#dialog-box').on('click','.unbind-account-dialog .unbind-btn',function(e){
        var isTHirdAuthorization = $('#dialog-box .unbind-account-dialog .title').attr('data-isTHirdAuthorization')
        var clientCode = isTHirdAuthorization == 'unbindWechatAuthorization'?'wechat':isTHirdAuthorization == 'unbindWeiboAuthorization'?'weibo':'qq'
        untyingThird(clientCode)
    })
    $('#dialog-box').on('click','.unbind-account-dialog .unbind-account-btn',function(e){
        closeRewardPop()
        bindPhoneNumber()
    })
});