define(function(require){
    require('../cmd-lib/tab');
    require('../cmd-lib/toast');
    require('../cmd-lib/myDialog');
    require('../application/suspension');
    //  require("./effect");  // 登录和刷新topbar
    require('./menu.js');
    require('./dialog.js');
    require('./home.js');
    require('./mycollectionAndDownLoad.js');
    require('./myuploads.js');
    require('./myvip.js');
    require('./mycoupon.js');
    require('./myorder.js');
    require('./accountsecurity.js');
    require('./personalinformation.js');
    require('./mywallet.js');

    if(!isLowsIe8()){
        var Clipboard = require('../cmd-lib/clipboard');
        var clipboardBtn = new Clipboard('.clipboardBtn');
        clipboardBtn.on('success', function(e) {
            console.info('Action:', e.action);
            console.info('Text:', e.text);
            console.info('Trigger:', e.trigger);
            $.toast({
                text:'复制成功!',
                delay : 3000
            });
            e.clearSelection();
        });

        clipboardBtn.on('error', function(e) {
            console.error('Action:', e.action);
            console.error('Trigger:', e.trigger);
        });
    }

    function isLowsIe8(){
        var DEFAULT_VERSION = 8.0;
        var ua = navigator.userAgent.toLowerCase();
        var isIE = ua.indexOf('msie')>-1;
        var safariVersion;
        if(isIE){
            safariVersion = ua.match(/msie ([\d.]+)/)[1];
        }
        if(safariVersion <= DEFAULT_VERSION ){
            return true;
        //   alert('系统检测到您正在使用ie8以下内核的浏览器，不能实现完美体验，请更换或升级浏览器访问！')
        }else{
            false;
        }
    }

    $(document).on('click', '.personal-center-content .personal-center-menu .signIn', function(){
        $('#dialog-box').dialog({
            html: $('#Sign-dialog').html()
        }).open();
    });
});