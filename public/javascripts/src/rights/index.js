/**
 * VIP 权益页面
 **/
define(function (require, exports, module) {
    var method = require("../application/method");
    var login = require("../application/checkLogin");
    var effect = require("../application/effect");

    // 办公vip开通按钮
    var $JsPayOfficeVip = $('.JsPayOfficeVip');
    // 全站vip开通按钮
    var $JsPayMainVip = $('.JsPayMainVip');

    initShow();
    bindEvent();

    /** 初始化显示 */
    function initShow() {
        if (method.getCookie('cuk')) {
            // todo 登录相关待修改
            login.getLoginData(function (data) {
                effect.refreshTopBar(data);
                refreshUserInfo(data);
                // 区分站点显示不同文本 todo
                if (data.isOfficeVip) {
                    $JsPayOfficeVip.html('立即续费');
                }
                if (data.isMainVip) {
                    $JsPayMainVip.html('立即续费');
                }
            });
        }
    }

    // 展示用户信息
    function refreshUserInfo(data) {
        $('.jsUserImage').attr('src', data.photoPicURL);
        $('.jsUserName').text(data.nickName);
        $('.jsLoginType').text('微信登陆');
    }

    /** 事件绑定 */
    function bindEvent() {
        // 点立即开通
        $JsPayMainVip.on('click', function () {
            event.stopPropagation();
            if (!method.getCookie('cuk')) {
                // todo 登录相关待修改
                login.notifyLoginInterface(function (data) {
                    effect.refreshTopBar(data);
                    refreshUserInfo(data);

                    method.compatibleIESkip('/pay/vip.html', false);
                });
            } else {
                method.compatibleIESkip('/pay/vip.html', false);
            }
        });

        // 跳转到主站vip购买页
        $JsPayOfficeVip.on('click', function () {
            window.open('http://office.iask.com/pay/vip.html', '_blank');
        });
    }
});