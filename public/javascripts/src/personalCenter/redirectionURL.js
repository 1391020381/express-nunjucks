define(function (require, exports, module) {
    var method = require('../application/method');
    var code = method.getParam('code');
    var channel = method.getParam('channel'); // 使用渠道：1:登录；2:绑定
    var clientCode = method.getParam('clientCode');
    // var redirectionType = method.getParam('redirectionType');
    // 个人中心的账号与安全 第三方(wechat qq weibo 绑定解绑)   与 网站第三方授权登录 共用同一个 重定向地址
    if (channel == '1') {
        window.opener.thirdLoginRedirect(code, channel, clientCode);
    } else if (channel == '2') {
        window.opener.handleBindThird(code, channel, clientCode);
    }
});
