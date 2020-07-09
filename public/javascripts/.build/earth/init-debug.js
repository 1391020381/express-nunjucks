define("dist/earth/init-debug", [ "./fixedTopBar-debug", "../cmd-lib/toast-debug", "../application/suspension-debug", "../application/method-debug", "../application/checkLogin-debug", "../application/api-debug", "../application/app-debug", "../application/element-debug", "../application/template-debug", "../application/extend-debug", "../common/bilog-debug", "base64-debug", "../cmd-lib/util-debug", "../report/config-debug", "../application/helper-debug", "//static3.iask.cn/resource/js/plugins/pc.iask.login.min-debug", "./login-debug" ], function(require, exports, module) {
    require("./fixedTopBar-debug");
    require("../cmd-lib/toast-debug");
    require("../application/suspension-debug");
    var utils = require("../cmd-lib/util-debug");
    var login = require("../application/checkLogin-debug");
    var refreshTopBar = require("./login-debug");
    var obj = {
        init: function() {
            this.beforeInit();
            // 登录
            $(".user-login,.login-open-vip").on("click", function() {
                if (!utils.getCookie("cuk")) {
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
        },
        beforeInit: function() {
            if (utils.getCookie("cuk")) {
                login.getLoginData(function(data) {
                    if (data) {
                        refreshTopBar(data);
                    }
                });
            }
        }
    };
    obj.init();
});