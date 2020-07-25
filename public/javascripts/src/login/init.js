define(function(require , exports , module){
    var method = require("../application/method");
    require("../cmd-lib/myDialog");
    var loginDialog = $('#login-dialog')
    var touristPurchaseDialog = $('#tourist-purchase-dialog')
    $('.login').click(function(e){
        $("#dialog-box").dialog({
            html: loginDialog.html(),
            'closeOnClickModal':false
        }).open(); 
    })
    $('.buyUnlogin').click(function(e){
        $("#dialog-box").dialog({
            html: touristPurchaseDialog.html(),
            'closeOnClickModal':false
        }).open(); 
    })
});