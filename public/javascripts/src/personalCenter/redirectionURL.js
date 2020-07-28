define(function(require , exports , module){
    var method = require("../application/method");
    var code = method.getParam('code')
    var channel = method.getParam('channel')
    var clientCode = method.getParam('clientCode')
    var redirectionType = method.getParam('redirectionType')
    // 个人中心的账号与安全 第三方(wechat qq weibo 绑定解绑)   与 网站第三方授权登录 共用同一个 重定向地址
    if(redirectionType == 'login'){
        window.opener.thirdLoginRedirect(code,channel,clientCode)
    }else{
        window.opener.handleBindThird(code,channel,clientCode)
    }
    
});