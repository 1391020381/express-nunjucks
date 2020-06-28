define(function(require , exports , module){
    var type = window.pageConfig&&window.pageConfig.page.type
    var isLogin = require('./effect.js').isLogin
    isLogin(initData)
    function initData(){
        if(type == 'personalinformation'){
            var personalinformation = require("./template/personalinformation.html")
            var _personalinformationTemplate = template.compile(personalinformation)({});
            $(".personal-center-personalinformation").html(_personalinformationTemplate);
        }
    }
});