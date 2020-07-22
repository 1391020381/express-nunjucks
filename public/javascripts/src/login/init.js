define(function(require , exports , module){
    var method = require("../application/method");
    require("../cmd-lib/myDialog");
    var loginDialog = $('.login-dialog')
    // $("#dialog-box").dialog({
    //     html: loginDialog.html(),
    // }).open();
    var Dialog = require("../cmd-lib/lulu/theme/peak/js/common/ui/Dialog")
    window.alert = function(message) {
    console.log(Dialog) 
    new Dialog().alert(message);
    };
    alert('lulu')
});