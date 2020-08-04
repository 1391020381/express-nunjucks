/**
 * 中间页-用于sso中嵌套进行iframe通信
 */
define(function (require) {
    var Messenger = require('./messenger');

    // 通信sso
    function Consumer(config) {
        var self = this;
        // 实例化消息中心
        this.messenger = new Messenger(config.id, config.projectName);
        // cookie有效期，默认1天
        this.timeOut = 24 * 60 * 60 * 1000;

        // 添加消息对象-建立连接
        this.messenger.addTarget(window.parent, config.ssoId);
        // 监听服务端sso消息
        this.messenger.listen(function (msg) {
            var data = JSON.parse(msg);
            console.log('服务端sso传回数据', data);
            if (data && data.token) {
                // 传入数据，表明为登录
                self.setJsCode(msg, data.expires);
            } else {
                // 传入空数据，表明为登出
                self.delJsCode();
            }
        });
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

    // var consumer = new Consumer({
    //     id: 'PC_MAIN_I_SHARE',
    //     projectName: 'I_SHARE',
    //     ssoId: 'I_SHARE_SSO'
    // });
})