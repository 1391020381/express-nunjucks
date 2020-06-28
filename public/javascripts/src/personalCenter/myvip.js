define(function(require , exports , module){
    var type = window.pageConfig&&window.pageConfig.page.type
    var api = require('../application/api');
    var isLogin = require('./effect.js').isLogin
    isLogin(initData)


    function initData(){
        if(type == 'myvip'){
            var myvip = require("./template/myvip.html")
            var _myvipTemplate = template.compile(myvip)({});
            $(".personal-center-vip").html(_myvipTemplate);
        }
    }
});