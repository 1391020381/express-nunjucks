define(function(require , exports , module){
    var type = window.pageConfig&&window.pageConfig.page.type
    if(type == 'mycoupon'){
        var mycoupon = require("./template/mycoupon.html")
        var _mycouponTemplate = template.compile(mycoupon)({});
        $(".personal-center-mycoupon").html(_mycouponTemplate);
    }
});