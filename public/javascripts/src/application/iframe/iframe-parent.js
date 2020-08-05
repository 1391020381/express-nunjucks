/**
 * 客户端-父窗口-iframe通信
 */
define(function (require) {
    var Messenger = require('./messenger');

    // 通信sso
    function Consumer(config) {
        var self = this;
        // 本地数据
        var token = this.getJsCode();

        // 实例化消息中心
        this.messenger = new Messenger(config.id, config.projectName);
        // cookie有效期，默认1天
        this.timeOut = 24 * 60 * 60 * 1000;
        // 当前窗口id
        this.id = config.id;
        // ssoId
        this.ssoId = config.ssoId;

        // 建立连接
        this.addIframe(config.ssoUrl, config.ssoId);

        // 监听服务端sso消息
        this.messenger.listen(function (msg) {
            var data = JSON.parse(msg);
            console.log('parent-服务端sso传回数据', data, token, data.token);
            if (data && data.token) {
                // 传入数据，表明为登录
                self.setJsCode(data.token, data.expires);
                if (token !== data.token) {
                    window.location.reload();
                }
            } else {
                // 传入空数据，表明为登出
                if (token) {
                    window.location.reload();
                    self.delJsCode();
                }
            }
        });
    }

    /** 添加iframe */
    Consumer.prototype.addIframe = function (url, id) {
        var self = this;
        // 嵌套登录中间页
        var iframe = document.createElement('iframe');
        iframe.id = id;
        iframe.src = url;
        iframe.style.display = 'none';
        var body = document.getElementsByTagName('body')[0];
        body.appendChild(iframe);
        self.messenger.addTarget(iframe.contentWindow, id);
    }

    // 推送数据
    Consumer.prototype.send = function (token, expires) {
        var self = this;
        this.messenger.targets[this.ssoId].send(JSON.stringify({
            id: self.id,
            token: token,
            expires: expires
        }));
    }

    // 获取jsCodeData
    Consumer.prototype.getJsCode = function () {
        if (this.isEmpty(this.getCookie('cuk'))) {
            return null;
        }
        return this.getCookie('cuk');
    }

    /**
     * 存储数据
     * @param jsCodeData 数据
     * @param timeOut 有效期，默认值90天，单位秒
     */
    Consumer.prototype.setJsCode = function (jsCodeData, timeOut) {
        if (this.isEmpty(jsCodeData)) {
            throw new Error('缺少【jsCode】参数值');
        }
        // 默认值90天
        this.timeOut = this.isEmpty(timeOut) ? this.timeOut : timeOut;
        this.setCookie('cuk', jsCodeData, this.timeOut, '/');
    }

    /**
     * 删除数据
     */
    Consumer.prototype.delJsCode = function () {
        this.delCookie('cuk', '/');
    }

    // 读cookie
    Consumer.prototype.getCookie = function (name) {
        var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
        if (arr !== null) {
            return unescape(arr[2]);
        }
        return null;
    }

    // 写cookie
    Consumer.prototype.setCookie = function (name, value, timeOut, path) {
        var now = new Date();
        now.setTime(now.getTime() + timeOut);
        document.cookie = name + "=" + escape(value) + ";path=" + path + ";expires=" + now.toGMTString();
    }

    // 删除cookie
    Consumer.prototype.delCookie = function (name, path, domain) {
        var now = new Date();
        now.setTime(now.getTime() - 1);
        var cval = this.getCookie(name);
        if (cval != null) {
            if (path && domain) {
                document.cookie = name + "= '' " + ";domain=" + domain + ";expires=" + now.toGMTString() + ";path=" + path;
            } else if (path) {
                document.cookie = name + "= '' " + ";expires=" + now.toGMTString() + ";path=" + path;
            } else {
                document.cookie = name + "=" + cval + ";expires=" + now.toGMTString();
            }
        }
    }

    // 判断是否为空
    Consumer.prototype.isEmpty = function (str) {
        if (str == null || str == "" || str.length == 0 || str == undefined || str == "undefined") {
            return true;
        }
        return false;
    }
  
    var ssoUrlList = {
        "local":'http://192.168.100.165:8085',
        'dev':'http://dev-login-ishare.iask.com.cn',
        'test':'http://test-login-ishare.iask.com.cn',
        'pre':'http://pre-login-ishare.iask.com.cn',
        'prod':'http://login-ishare.iask.com.cn'
    }
    var ssoUrl = ssoUrlList[env] || ssoUrlList['prod']
    var consumer = new Consumer({
        id: 'PC_MAIN_I_SHARE',
        projectName: 'I_SHARE',
        ssoId: 'I_SHARE_SSO',
        ssoUrl: ssoUrl, // 222
    });

    return consumer;
})








