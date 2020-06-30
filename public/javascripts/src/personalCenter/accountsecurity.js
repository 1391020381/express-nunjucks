define(function(require , exports , module){
    var type = window.pageConfig&&window.pageConfig.page.type
    var method = require("../application/method");
    var api = require('../application/api');
    var isLogin = require('./effect.js').isLogin
    var getUserCentreInfo = require('./home.js').getUserCentreInfo 
    var showCaptcha = require("../common/bindphone").showCaptcha
    var closeRewardPop = require("./dialog.js").closeRewardPop
    var userBindInfo = {}  // 保存用户的绑定信息
    var smsId = ''  // 验证码
    isLogin(initData)
    function initData(){
        if(type == 'accountsecurity'){
            getUserCentreInfo()
            queryUserBindInfo()
        }
    }
    

    function queryUserBindInfo() {  // 查询用户绑定信息
        $.ajax({
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
                // 只有解绑的时候 需要身份验证
                closeRewardPop()
                bindPhoneNumber()
               }
            },
            error:function(error){
                console.log('checkIdentity:',error)
            }
        })
    }
    function sendSms(mobile,businessCode){ // 发送短信验证码
        $.ajax({
            url: api.user.sendSms,
            type: "POST",
            contentType: "application/json; charset=utf-8",
            data:JSON.stringify({
                mobile:mobile,
                nationCode:86,
                businessCode:businessCode, // 功能模块（1-注册模块、2-找回密码、3-修改密码、4-登录、5-绑定/更换手机号手机号（会检查手机号是否被使用过）、6-旧手机号获取验证码）
                terminal:'pc'
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

    function thirdCodelogin(clientCode,channel,location){
        $.ajax({
            url: api.user.thirdCodelogin + '?clientCode='+ clientCode + '&channel=' + channel + '&terminal=pc' + '&businessSys=ishare' + '&location='+ location,
            type: "GET",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (res) {
               if(res.code == '0'){
                console.log('checkIdentity:',res)
                smsId  = ''   // 清空保存的  短信id
                // 只有解绑的时候 需要身份验证
                closeRewardPop()
                bindPhoneNumber()
               }
            },
            error:function(error){
                console.log('checkIdentity:',error)
            }
        })
    }

    $(document).on('click', '.account-security-list .item-btn', function (event) {
       var  btnOperation =  $(this).attr("data-btnOperation")
       console.log('userBindInfo:',userBindInfo)
       if(btnOperation == 'modifyPhoneNumber'){
             $("#dialog-box").dialog({
            html: $('#identity-authentication-dialog').html().replace(/\$phoneNumber/, userBindInfo.mobile),
        }).open();
       }

       if(btnOperation == 'bindPhoneNumber'){
            bindPhoneNumber()
       }
        

        // $("#dialog-box").dialog({
        //     html: $('#set-change-password-dialog').html(),
        // }).open();

        // $("#dialog-box").dialog({
        //     html: $('#unbind-account-dialog').html(),
        // }).open();
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
                sendSms(userBindInfo.mobile,7)
              }else{
                var mobile = $('#dialog-box .item-phonenumber').val()
                if(!method.testPhone(mobile)){ //  获取验证码前 需输入验证码
                    $.toast({
                        text:'请输入正确的手机号',
                        delay : 3000,
                    })
                    return
                } 
                sendSms(mobile,5)
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

    function bindPhoneNumber(){  // 绑定手机号/ 换绑手机号 dialog
        $("#dialog-box").dialog({
            html: $('#bind-phonenumber-dialog').html(),
        }).open();
    }
});