define("dist/404/index", [ "../application/suspension", "../application/method", "../application/checkLogin", "../application/api", "../application/urlConfig", "../application/login", "../cmd-lib/jqueryMd5", "../common/bilog", "base64", "../cmd-lib/util", "../report/config", "../cmd-lib/myDialog", "../cmd-lib/toast", "../common/bindphone", "../common/baidu-statistics", "../application/app", "../application/element", "../application/template", "../application/extend", "../application/effect", "../application/helper" ], function(require, exports, module) {
    require("../application/suspension");
    require("../cmd-lib/toast");
    var method = require("../application/method");
    var login = require("../application/checkLogin");
    var api = require("../application/api");
    // var common = require('./common');
    var feedbackTypeList = [];
    $(function() {
        // 登录
        $(".user-login,.login-open-vip").on("click", function() {
            if (!method.getCookie("cuk")) {
                login.notifyLoginInterface(function(data) {
                    refreshTopBar(data);
                });
            }
        });
        // 退出登录
        $(".btn-exit").click(function() {
            login.ishareLogout();
        });
        // 头部搜索跳转
        $(".btn-new-search").click(function() {
            var searVal = $("#search-detail-input").val();
            window.open("/search/home.html" + "?" + "ft=all" + "&cond=" + encodeURIComponent(encodeURIComponent(searVal)));
        });
    });
    //     // 顶部header登录逻辑
    // $('#a-login-link').click(function(){
    //     login.notifyLoginInterface(function (data) {
    //         console.log('-------------------',data)
    //         refreshTopBar(data);
    //      })
    // })
    //刷新topbar
    var refreshTopBar = function(data) {
        var $unLogin = $("#unLogin");
        var $hasLogin = $("#haveLogin");
        var $btn_user_more = $(".btn-user-more");
        var $vip_status = $(".vip-status");
        var $icon_iShare = $(".icon-iShare");
        var $top_user_more = $(".top-user-more");
        $btn_user_more.text(data.isVip == 1 ? "续费" : "开通");
        var $target = null;
        if (data.msgCount) {
            $(".top-bar .news").removeClass("hide").find("#user-msg").text(data.msgCount);
        }
        //VIP专享资料
        if (method.getCookie("file_state") === "6") {
            $(".vip-title").eq(0).show();
        }
        //vip
        if (data.isVip == 1) {
            $target = $vip_status.find('p[data-type="2"]');
            $target.find(".expire_time").html(data.expireTime);
            $target.show().siblings().hide();
            $top_user_more.addClass("top-vip-more");
            $(".isVip-show").find("span").html(data.expireTime);
            $(".isVip-show").removeClass("hide");
        } else if (data.userType == 1) {
            $target = $vip_status.find('p[data-type="3"]');
            $hasLogin.removeClass("user-con-vip");
            $target.show().siblings().hide();
        } else if (data.isVip == 0) {
            $hasLogin.removeClass("user-con-vip");
            // 用户不是vip,但是登录啦,隐藏 登录后开通 显示 开通
            $(".btn-join-vip").eq(0).hide();
            $(".btn-join-vip").eq(1).show();
        } else if (data.isVip == 2) {
            $(".vip-title").hide();
        }
        $unLogin.hide();
        $hasLogin.find(".user-link .user-name").html(data.nickName);
        $hasLogin.find(".user-link img").attr("src", data.photoPicURL);
        $hasLogin.find(".top-user-more .name").html(data.nickName);
        $hasLogin.find(".top-user-more img").attr("src", data.photoPicURL);
        $hasLogin.show();
        window.pageConfig.params.isVip = data.isVip;
        var fileDiscount = data.fileDiscount;
        if (fileDiscount) {
            fileDiscount = fileDiscount / 100;
        } else {
            fileDiscount = .8;
        }
        window.pageConfig.params.fileDiscount = fileDiscount;
        $("#ip-uid").val(data.userId);
        $("#ip-isVip").val(data.isVip);
        $("#ip-mobile").val(data.mobile);
    };
    loginStatusQuery();
    // 当用户登录啦,刷新页面,重新刷新topbar
    function loginStatusQuery() {
        if (method.getCookie("cuk")) {
            login.getLoginData(function(data) {
                userId = data.userId;
                refreshTopBar(data);
            });
        }
    }
});