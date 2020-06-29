define(function(require , exports , module){
    var type = window.pageConfig&&window.pageConfig.page.type
    var isLogin = require('./effect.js').isLogin
    var getUserCentreInfo = require('./home.js').getUserCentreInfo
    isLogin(initData)
    function initData(){
        getUserCentreInfo()
        if(type == 'personalinformation'){
            var personalinformation = require("./template/personalinformation.html")
            var _personalinformationTemplate = template.compile(personalinformation)({});
            $(".personal-center-personalinformation").html(_personalinformationTemplate);
        }
    }
});