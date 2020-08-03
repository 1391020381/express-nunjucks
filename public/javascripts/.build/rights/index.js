/**
 * VIP 权益页面
 **/
define("dist/rights/index", [ "../application/method", "../application/checkLogin", "../application/api", "../application/login", "../cmd-lib/jqueryMd5", "../cmd-lib/myDialog", "../cmd-lib/toast", "../common/bindphone", "../common/baidu-statistics", "../common/bilog", "base64", "../cmd-lib/util", "../report/config" ], function(require, exports, module) {
    var method = require("../application/method");
    var login = require("../application/checkLogin");
    var $vipPrivilegeBtn = $(".vip-privilege-btn");
    // var refreshTopBar = require('../application/effect').refreshTopBar
    loginStatusQuery();
    $vipPrivilegeBtn.on("click", function() {
        var dataStatus = $(this).attr("data-status");
        if (!method.getCookie("cuk")) {
            login.notifyLoginInterface(function(data) {
                login.getLoginData(function(res) {
                    refreshTopBar(res);
                    method.compatibleIESkip("/pay/vip.html", false);
                });
            });
        } else {
            method.compatibleIESkip("/pay/vip.html", false);
        }
    });
    $(".menu-items-center div").on("click", function() {
        var type = $(this).attr("data-type");
        var scrollTop = 0;
        if (type === "privilege") {
            scrollTop = 440;
        } else if (type === "material") {
            scrollTop = 1150;
        }
        $(this).addClass("index").siblings("div").removeClass("index");
        $("body,html").animate({
            scrollTop: scrollTop
        }, 200);
    });
    $(".vip-user-list .btn").on("click", function() {
        if (!method.getCookie("cuk")) {
            login.notifyLoginInterface(function(data) {
                login.getLoginData(function(res) {
                    method.compatibleIESkip("/pay/vip.html", false);
                });
            });
        } else {
            method.compatibleIESkip("/pay/vip.html", false);
        }
    });
    $(".zq-btn ").on("click", "a", function() {
        var $this = $(this);
        var id = $this.attr("data-id");
        var $target = $("#" + id);
        $this.addClass("linkButton").siblings("a").removeClass("linkButton");
        $target.removeClass("hide").siblings(".vip-img-list").addClass("hide");
    });
    // 开通或者续费VIP
    $(".btn-user-more").on("click", function() {
        method.compatibleIESkip("/pay/vip.html", false);
    });
    // 消息按钮
    $(".message-btn").on("click", function() {
        if (!method.getCookie("cuk")) {
            login.notifyLoginInterface(function(data) {
                refreshTopBar(data);
            });
        }
    });
    // 登录
    $("#rightVipUnLogin").on("click", function() {
        if (!method.getCookie("cuk")) {
            login.notifyLoginInterface(function(data) {
                refreshTopBar(data);
            });
        }
    });
    //退出登录
    $(".js-logout").on("click", function() {
        login.ishareLogout();
    });
    function refreshTopBar(data) {
        var $unLogin = $("#rightVipUnLogin");
        var $hasLogin = $("#haveLogin");
        var $btn_user_more = $(".btn-user-more");
        var $vip_status = $(".vip-status");
        var $top_user_more = $(".top-user-more");
        $btn_user_more.text(data.isVip == 1 ? "续费VIP" : "开通VIP");
        var $target = null;
        $("#user-msg").text(data.msgCount);
        $(".message-btn").attr("href", "/user/message/index?u=" + data.userId);
        if (data.isVip == 1) {
            $target = $vip_status.find('p[data-type="2"]');
            $target.find(".expire_time").html(data.expireTime);
            $target.show().siblings().hide();
            $top_user_more.addClass("top-vip-more");
            $vipPrivilegeBtn.html("立即续费");
        } else if (data.userType == 1) {
            $target = $vip_status.find('p[data-type="3"]');
            $hasLogin.removeClass("user-con-vip");
            $target.show().siblings().hide();
        } else if (data.isVip == 0) {
            $hasLogin.removeClass("user-con-vip");
        } else if (data.isVip == 2) {
            $(".vip-title").hide();
        }
        $unLogin.addClass("hide");
        $hasLogin.removeClass("hide");
        $hasLogin.find(".user-link .user-name").html(data.nickName);
        $hasLogin.find(".user-link img").attr("src", data.weiboImage);
        $hasLogin.find(".top-user-more .name").html(data.nickName);
        $hasLogin.find(".top-user-more img").attr("src", data.weiboImage);
    }
    function loginStatusQuery() {
        if (method.getCookie("cuk")) {
            login.getLoginData(function(data) {
                refreshTopBar(data);
            });
        }
    }
    // 意见反馈的url
    var url = "/feedAndComp/userFeedback?url=" + encodeURIComponent(location.href);
    $(".user-feedback").attr("href", url);
});