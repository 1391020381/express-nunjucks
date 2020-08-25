define(function (require, exports, module) {
    var type = window.pageConfig&&window.pageConfig.page.type
    var getUserCentreInfo = require('./home.js').getUserCentreInfo
    var isLogin = require('../application/effect.js').isLogin
   var mywalletType = window.pageConfig&&window.pageConfig.page.mywalletType
    if(type=='mywallet'){
        isLogin(initCallback,true)
    }
    function initCallback(){
       
    //     var myorder = require("./template/myorder.html")
    //     var _myorderTemplate = template.compile(myorder)({list:list||[],myorderType:myorderType});
    //    $(".personal-center-myorder").html(_myorderTemplate); 
         var mywallet = require("./template/mywallet.html") 
         var _mywalletTemplate = template.compile(mywallet)({list:[],mywalletType:mywalletType});
        $('.personal-center-mywallet').html(_mywalletTemplate)
        getUserCentreInfo()
    }
});