define("dist/earth/init", [ "./fixedTopBar", "../cmd-lib/toast", "../application/suspension", "../application/method", "../application/checkLogin", "../application/api", "../application/app", "../application/element", "../application/template", "../application/extend", "../common/bilog", "base64", "../cmd-lib/util", "../report/config", "../report/init", "../report/handler", "../report/columns", "../application/helper", "//static3.iask.cn/resource/js/plugins/pc.iask.login.min", "./login" ], function(require, exports, module) {
    require("./fixedTopBar");
    require("../cmd-lib/toast");
    require("../application/suspension");
    var utils = require("../cmd-lib/util");
    var login = require("../application/checkLogin");
    var refreshTopBar = require("./login");
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