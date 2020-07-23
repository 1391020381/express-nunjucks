define(function(require , exports , module){
    var method = require("../application/method");
    require("../cmd-lib/myDialog");
    var loginDialog = $('.login-dialog')
    $("#dialog-box").dialog({
        html: loginDialog.html(),
        'closeOnClickModal':true
    }).open(); 
});