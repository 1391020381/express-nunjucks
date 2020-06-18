define(function(require , exports , module){
    var type = window.pageConfig&&window.pageConfig.page.type
    if(type == 'myorder'){
        var myorder = require("./template/myorder.html")
        var _myorderTemplate = template.compile(myorder)({});
        $(".personal-center-myorder").html(_myorderTemplate);
    }
});