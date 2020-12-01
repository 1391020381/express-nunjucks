/**
 * VIP 权益页面
 **/
define("dist/rights/index-debug", [ "../application/method-debug", "../application/checkLogin-debug", "../application/api-debug", "../application/urlConfig-debug", "../application/login-debug", "../common/bilog-debug", "base64-debug", "../cmd-lib/util-debug", "../report/config-debug", "../cmd-lib/myDialog-debug", "../cmd-lib/toast-debug", "../application/iframe/iframe-messenger-debug", "../application/iframe/messenger-debug", "../common/baidu-statistics-debug", "../application/effect-debug", "../common/loginType-debug" ], function(require, exports, module) {
    var method = require("../application/method-debug");
    var login = require("../application/checkLogin-debug");
    var effect = require("../application/effect-debug");
    var urlConfig = require("../application/urlConfig-debug");
    // 办公vip开通按钮
    var $JsPayOfficeVip = $(".JsPayOfficeVip");
    // 全站vip开通按钮
    var $JsPayMainVip = $(".JsPayMainVip");
    // 全站vip图标
    var $JsMainIcon = $(".JsMainIcon");
    // 办公vip图标
    var $JsOfficeIcon = $(".JsOfficeIcon");
    // 登录类型map-对应在登陆时存储到本地cookie中的字段
    var LoginTypeMap = {
        wechat: "微信登陆",
        weibo: "微博登陆",
        qq: "QQ登陆",
        phonePw: "密码登陆",
        phoneCode: "验证码登陆"
    };
    initShow();
    bindEvent();
    /** 初始化显示 */
    function initShow() {
        if (method.getCookie("cuk")) {
            login.getLoginData(function(data) {
                effect.refreshTopBar(data);
                refreshUserInfo(data);
                // 区分站点显示不同文本
                if (data.isOfficeVip === 1) {
                    $JsPayOfficeVip.html("立即续费");
                } else {
                    $JsPayOfficeVip.html("立即开通");
                }
                if (data.isMasterVip === 1) {
                    $JsPayMainVip.html("立即续费");
                } else {
                    $JsPayMainVip.html("立即开通");
                }
            });
        } else {}
    }
    // 展示用户信息
    function refreshUserInfo(data) {
        // 区分站点显示不同文本
        if (data.isOfficeVip === 1) {
            $JsPayOfficeVip.html("立即续费");
            $JsOfficeIcon.addClass("i-vip-blue");
            $JsOfficeIcon.removeClass("i-vip-gray2");
        } else {
            $JsOfficeIcon.removeClass("i-vip-blue");
            $JsOfficeIcon.addClass("i-vip-gray2");
        }
        if (data.isMasterVip === 1) {
            $JsPayMainVip.html("立即续费");
            $JsMainIcon.addClass("i-vip-yellow");
            $JsMainIcon.removeClass("i-vip-gray1");
        } else {
            $JsMainIcon.removeClass("i-vip-yellow");
            $JsMainIcon.addClass("i-vip-gray1");
        }
        $(".jsUserImage").attr("src", data.photoPicURL);
        $(".jsUserName").text(data.nickName);
        // 登录类型-对应在登陆时存储到本地cookie中的字段
        var loginType = method.getCookie("login_type");
        $(".jsLoginType").text(loginType ? "( " + LoginTypeMap[loginType] + " )" : "");
    }
    /** 事件绑定 */
    function bindEvent() {
        // 点立即开通
        $JsPayMainVip.on("click", function() {
            event.stopPropagation();
            if (!method.getCookie("cuk")) {
                // todo 登录相关待修改
                login.notifyLoginInterface(function(data) {
                    effect.refreshTopBar(data);
                    refreshUserInfo(data);
                    method.compatibleIESkip("/pay/vip.html", false);
                });
            } else {
                method.compatibleIESkip("/pay/vip.html", false);
            }
        });
        // 跳转到主站vip购买页
        $JsPayOfficeVip.on("click", function() {
            window.open(urlConfig.officeUrl + "/pay/vip.html", "_blank");
        });
    }
});