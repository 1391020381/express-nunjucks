/**
 * 中间页-用于sso中嵌套进行iframe通信
 */
define(function (require) {
    var Messenger = require('./messenger');

    // 通信sso
    function IframeMessenger(config) {
        // 当前窗口id
        this.id = config.id;
        // ssoId
        this.ssoId = config.ssoId;
        // 实例化消息中心
        this.messenger = new Messenger(config.id, config.projectName);
    }

    /** 添加iframe */
    IframeMessenger.prototype.addTarget = function (iframe) {
        this.messenger.addTarget(iframe.contentWindow, this.ssoId);
    }

    // 监听消息
    IframeMessenger.prototype.listen = function (callback) {
        var self = this;
        this.messenger.listen(function (res) {
            if (res) {
                res = JSON.parse(res);
                // 只接收对应窗口数据
                if (res.id === self.ssoId && typeof callback === "function") {
                    callback(res);
                }
            }
        });
    }

    // 推送数据
    IframeMessenger.prototype.send = function (data) {
        var self = this;
        this.messenger.targets[this.ssoId].send(JSON.stringify({
            id: self.id,
            data: data
        }));
    }

    // 在此处实例化-防止外部重复实例
    // new IframeMessenger({
    //     id: 'MAIN_I_SHARE',
    //     projectName: 'I_SHARE',
    //     ssoId: 'I_SHARE_SSO',
    //     ssoUrl: 'http://dev-login-ishare.iask.com.cn/office-login.html'
    // });
    return IframeMessenger 

   
})