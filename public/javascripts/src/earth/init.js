define(function(require , exports , module){
    require("./fixedTopBar");
    require('../cmd-lib/toast');
    require('../application/suspension')
    var utils = require("../cmd-lib/util");
    var login = require("../application/checkLogin");
    var refreshTopBar = require("./login");
    var obj= {
        init:function(){
            this.beforeInit();
             // 登录
             $('.user-login,.login-open-vip').on('click', function () {
                if (!utils.getCookie('cuk')) {
                    login.notifyLoginInterface(function (data) {
                        refreshTopBar(data)
                    });
                }
            });
            // 退出登录
            $('.btn-exit').click(function(){
                login.ishareLogout()
            })
            // 头部搜索跳转
            $('.btn-new-search').click(function(){
                var searVal = $('#search-detail-input').val()
                window.open('/search/home.html'+ '?' + 'ft=all' + '&cond='+ encodeURIComponent(encodeURIComponent(searVal)))
            }) 
        },
        beforeInit:function(){
            if (utils.getCookie('cuk')) {
                login.getLoginData(function (data) {
                    if (data) {
                        refreshTopBar(data);
                   }
                });
            }
        }
   }
   obj.init();
});