define(function(require , exports , module){
    require("../cmd-lib/tab");
    require("../cmd-lib/toast");
    require("../cmd-lib/myDialog");
   var Clipboard =  require("../cmd-lib/clipboard");
 var clipboardBtn  = new Clipboard('.clipboardBtn');
 clipboardBtn.on('success', function(e) {
    console.info('Action:', e.action);
    console.info('Text:', e.text);
    console.info('Trigger:', e.trigger);
    e.clearSelection();
});

clipboardBtn.on('error', function(e) {
    console.error('Action:', e.action);
    console.error('Trigger:', e.trigger);
});
    // require("../common/userMoreMsg")
    require('../application/suspension')
    require("./effect");  // 登录和刷新topbar
    // require("./report");  
    require("./menu.js")
    require("./dialog.js")
    require("./home.js")
    require("./mycollectionAndDownLoad.js")
    require("./myuploads.js")
    require("./myvip.js")
    require("./mycoupon.js")
    require("./myorder.js")
    require("./accountsecurity.js")
    require("./personalinformation.js")
    require("./mywallet.js")
    require("../common/bilog");
    // require("../common/baidu-statistics");
});