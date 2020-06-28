define(function(require , exports , module){
    var api = require('../application/api');
    var method = require("../application/method");
    var type = window.pageConfig&&window.pageConfig.page.type
    initData()
    function initData(){
        if(type == 'mycoupon'){
            rightsSaleQueryUsing()
        }
    }

    function rightsSaleQueryUsing(pageNumber){
        type = method.getParam('mycouponType')  || 0
        pageNumber = pageNumber || 1
        $.ajax({
            // url: api.coupon.queryUsing + '?type=' + type?type:0 + '&cuk=d476d0ef8266997b520ad99638a21d0073827bcbfc6c4616d29ee61005b28931&pageNumber='+ pageNumber?pageNumber:0 + '&pageSize=10',
            url: api.coupon.queryUsing  + '?type=' + type  + '&pageNumber'+ pageNumber +'&pageSize=10',
            type: "GET",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (res) {
               if(res.code == '0'){
                    console.log('rightsSaleQueryUsing:',res)    
                    var mycoupon = require("./template/mycoupon.html")
                    var _mycouponTemplate = template.compile(mycoupon)({});
                    $(".personal-center-mycoupon").html(_mycouponTemplate);
               }else{
                $.toast({
                    text:res.msg,
                    delay : 3000,
                })
               }
            },
            error:function(error){
                console.log('rightsSaleQueryUsing:',error)
            }
        })
    }
});