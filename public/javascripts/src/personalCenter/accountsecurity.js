define(function(require , exports , module){
    var type = window.pageConfig&&window.pageConfig.page.type
    var method = require("../application/method");
    var api = require('../application/api');
    if(type == 'accountsecurity'){
        var accountsecurity = require("./template/accountsecurity.html")
        var _accountsecurityTemplate = template.compile(accountsecurity)({});
        $(".personal-center-accountsecurity").html(_accountsecurityTemplate);
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
               }
            },
            error:function(error){
                console.log('queryUserBindInfo:',error)
            }
        })
    }
    function userBindMobile(){ // 绑定手机号接口
        $.ajax({
            url: api.user.userBindMobile,
            type: "POST",
            contentType: "application/json; charset=utf-8",
            data:JSON.stringify({
                terminal:'pc',
                mobile:'',
                nationCode:86,
                smsId:'',
                checkCode:''
            }),
            dataType: "json",
            success: function (res) {
               if(res.code == '0'){
                    console.log('userBindMobile:',res)
               }
            },
            error:function(error){
                console.log('userBindMobile:',error)
            }
        })
    }
    function checkIdentity(){ // 身份验证账号
        $.ajax({
            url: api.user.checkIdentity,
            type: "POST",
            contentType: "application/json; charset=utf-8",
            data:JSON.stringify({
                mobile:'',
                nationCode:86,
                smsId:'',
                checkCode:''
            }),
            dataType: "json",
            success: function (res) {
               if(res.code == '0'){
                    console.log('checkIdentity:',res)
               }
            },
            error:function(error){
                console.log('checkIdentity:',error)
            }
        })
    }
    function sendSms(){ // 发送短信验证码
        $.ajax({
            url: api.user.sendSms,
            type: "POST",
            contentType: "application/json; charset=utf-8",
            data:JSON.stringify({
                mobile:'',
                nationCode:86,
                businessCode:'', // 功能模块（1-注册模块、2-找回密码、3-修改密码、4-登录、5-绑定/更换手机号手机号（会检查手机号是否被使用过）、6-旧手机号获取验证码）
                terminal:'pc'
            }),
            dataType: "json",
            success: function (res) {
               if(res.code == '0'){
                    console.log('sendSms:',res)
               }
            },
            error:function(error){
                console.log('sendSms:',error)
            }
        })
    }
    function checkSmsCode(){ // 检测短信验证码是否正确
        $.ajax({
            url: api.user.checkSmsCode,
            type: "POST",
            contentType: "application/json; charset=utf-8",
            data:JSON.stringify({
                mobile:'',
                nationCode:86,
                smsId:'',
                checkCode:''
            }),
            dataType: "json",
            success: function (res) {
               if(res.code == '0'){
                    console.log('checkSmsCode:',res)
               }
            },
            error:function(error){
                console.log('checkSmsCode:',error)
            }
        })
    }
});