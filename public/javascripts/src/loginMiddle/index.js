define(function (require, exports, module) {
      // 登录 第三方授权回调页面
      var api = require('../application/api');
      var method = require("../application/method");
      var redirectUrl = method.getParam('redirectUrl')
      var code = method.getParam('code')
      var channel = method.getParam('channel') // 使用渠道：1:登录；2:绑定
      var clientCode = method.getParam('clientCode')
      var jsId = method.getLoginSessionId();
      thirdLoginRedirect(code,channel,clientCode)

      
      function thirdLoginRedirect(code, channel, clientCode) { // 根据授权code 获取 access_token
            $ajax(api.user.thirdLoginRedirect,'POST',{
                terminal: '0',
                thirdType: clientCode,
                code: code,
                businessSys: 'ishare'
            },'',{jsId:jsId}).then(function(res){
                if (res.code == '0') {
                    window.loginType = clientCode  // 获取用户信息时埋点需要
                    method.setCookieWithExpPath("cuk", res.data.access_token, res.data.expires_in * 1000, "/");
                    method.setCookieWithExpPath("loginType", loginType, res.data.expires_in * 1000, "/");
                   
                    $.ajaxSetup({
                        headers: {
                            'Authrization': method.getCookie('cuk')
                        }
                    });
                    $ajax('/node/api/getUserInfo','GET').then(function(res){
                        iask_web.login(res.data.userId)
                        iask_web.track_event('SE001', "loginResult", 'query', {
                            loginResult:'1',
                            failMsg:'',
                            loginType: window.loginType && window.loginType
                        });
                          window.open(redirectUrl,'_self')
                    }).fail(function(err){
                        window.open(redirectUrl,'_self')
                    })
                   
                } else {
                    window.open(redirectUrl,'_self')  
                }
            })
        }

    
});