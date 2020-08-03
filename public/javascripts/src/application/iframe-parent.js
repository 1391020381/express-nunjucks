define(function (require) {
    var Messenger = require('./messenger');

    // 通信sso
    function Consumer(config) {
        var self = this;

        // 实例化消息中心
        this.messenger = new Messenger(config.id, config.projectName);
        // cookie有效期，默认90天
        this.timeOut = 7776000;
        // ssoId
        this.ssoId = config.ssoId

        // 建立连接
        this.addIframe(config.ssoUrl, config.ssoId);

        this.messenger.listen(function (msg) {
            var data = JSON.parse(msg);
            // 获取登录信息
            console.log("OFFICE_I_SHARE收到消息: ", data);
            if (data) {
                self.setJsCode(data.token, data.expires);
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
        iframe.style.display = 'block';
        document.getElementsByTagName('body')[0].appendChild(iframe);
        self.messenger.addTarget(iframe.contentWindow, id);
    }

    // 推送数据
    Consumer.prototype.send = function (token, expires) {
        this.messenger.targets[this.ssoId].send(JSON.stringify({
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

    // 写cookie
    Consumer.prototype.setCookie = function (name, value, timeOut, path) {
        var now = new Date();
        now.setTime(now.getTime() + timeOut);
        document.cookie = name + "=" + escape(value) + ";path=" + path + ";expires=" + now.toGMTString();
    }

    // 读cookie
    Consumer.prototype.getCookie = function (name) {
        var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
        if (arr !== null) {
            return unescape(arr[2]);
        }
        return null;
    }

    // 判断是否为空
    Consumer.prototype.isEmpty = function (str) {
        if (str == null || str == "" || str.length == 0 || str == undefined || str == "undefined") {
            return true;
        }
        return false;
    }

    var consumer = new Consumer({
        id: 'PC_MAIN_I_SHARE',
        projectName: 'I_SHARE',
        ssoId: 'I_SHARE_SSO',
        ssoUrl: 'http://192.168.100.165:8085/index.html',
    });

    return consumer;
})


