define("dist/feedback/index-debug", [ "../application/suspension-debug", "../application/method-debug", "../application/checkLogin-debug", "../application/api-debug", "../application/urlConfig-debug", "../application/login-debug", "../common/bilog-debug", "base64-debug", "../cmd-lib/util-debug", "../report/config-debug", "../cmd-lib/myDialog-debug", "../cmd-lib/toast-debug", "../application/iframe/iframe-messenger-debug", "../application/iframe/messenger-debug", "../common/baidu-statistics-debug", "../application/app-debug", "../application/element-debug", "../application/template-debug", "../application/extend-debug", "../application/effect-debug", "../application/helper-debug" ], function(require, exports, module) {
    require("../application/suspension-debug");
    require("../cmd-lib/toast-debug");
    var method = require("../application/method-debug");
    var login = require("../application/checkLogin-debug");
    var api = require("../application/api-debug");
    // var common = require('./common');
    var feedbackTypeList = [];
    $(function() {
        var type = "";
        //获取意见类型
        var urlLink = method.getQueryString("url");
        if (urlLink) {
            $(".material-link-input").val(urlLink);
        }
        $.ajax({
            url: api.user.getFeedbackType,
            type: "get",
            data: {},
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function(res) {
                if (res.code == 0) {
                    var str = "";
                    feedbackTypeList = res.data;
                    res.data.forEach(function(item, index) {
                        if (index == 0) {
                            type = item.code;
                        }
                        str += '<option value="' + item.code + '">' + item.value + "</option>";
                    });
                    str = '<option value="">' + "请选择投诉类型" + "</option>" + str;
                    $(".form-select").html(str);
                } else {
                    $.toast({
                        text: res.message,
                        delay: 3e3
                    });
                }
            }
        });
        // 
        $(".form-select").on("change", function() {
            type = $(this).val();
            feedbackTypeList.forEach(function(item) {
                if (item.code == type) {
                    $(".form-textarea").attr("placeholder", item.desc);
                }
            });
        });
        //提交反馈
        $(".form-btn").on("click", function() {
            if (!method.getCookie("cuk")) {
                login.notifyLoginInterface(function(data) {
                    refreshTopBar(data);
                });
            } else {
                //校验
                console.log($(".form-select").val());
                if (!$(".form-select").val()) {
                    $.toast({
                        text: "请选择投诉类型",
                        delay: 3e3
                    });
                    return;
                }
                if (!method.testEmail($(".email-input").val())) {
                    $.toast({
                        text: "请输入正确的邮箱",
                        delay: 3e3
                    });
                    return;
                } else if (!method.testPhone($(".tel-input").val())) {
                    $.toast({
                        text: "请输入正确的手机号",
                        delay: 3e3
                    });
                    return;
                }
                var obj = {
                    type: type,
                    content: $(".form-textarea").val(),
                    pageUrl: $(".material-link-input").val(),
                    email: $(".email-input").val(),
                    tell: $(".tel-input").val(),
                    sourceMode: 0
                };
                $.ajax({
                    url: api.user.addFeedback,
                    type: "POST",
                    data: JSON.stringify(obj),
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function(res) {
                        if (res.code == 0) {
                            $.toast({
                                text: "提交成功，感谢你的反馈",
                                delay: 3e3
                            });
                            $(".form-textarea").val("");
                            $(".material-link-input").val("");
                            $(".email-input").val("");
                            $(".tel-input").val("");
                        } else {
                            $.toast({
                                text: res.message,
                                delay: 3e3
                            });
                        }
                    }
                });
            }
        });
        // 登录
        $(".user-login,.login-open-vip").on("click", function() {
            if (!method.getCookie("cuk")) {
                login.notifyLoginInterface(function(data) {
                    refreshTopBar(data);
                });
            }
        });
    });
    //     // 顶部header登录逻辑
    $("#a-login-link").click(function() {
        login.notifyLoginInterface(function(data) {
            console.log("-------------------", data);
            refreshTopBar(data);
        });
    });
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