
define(function(require , exports , module){
    require("../cmd-lib/tab");
    require("../cmd-lib/toast");
    require("../cmd-lib/myDialog");
    if(!isLowIe8()){
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
    }
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
    function isLowIe8(){
        var DEFAULT_VERSION = 8.0;  
            var ua = navigator.userAgent.toLowerCase();  
            var isIE = ua.indexOf("msie")>-1;  
            var safariVersion;  
            if(isIE){  
            safariVersion =  ua.match(/msie ([\d.]+)/)[1];  
            }  
            if(safariVersion <= DEFAULT_VERSION ){  
                console.log('小于ie8')
                return true
            }else{
                return false
            }
    }
});