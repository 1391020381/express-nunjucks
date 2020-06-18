define(function(require , exports , module){
    var type = window.pageConfig&&window.pageConfig.page.type
    if(type == 'accountsecurity'){
        var accountsecurity = require("./template/accountsecurity.html")
        var _accountsecurityTemplate = template.compile(accountsecurity)({});
        $(".personal-center-accountsecurity").html(_accountsecurityTemplate);
    }
});