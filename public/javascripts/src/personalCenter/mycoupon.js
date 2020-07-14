define(function(require , exports , module){
    var api = require('../application/api');
    var method = require("../application/method");
    var type = window.pageConfig&&window.pageConfig.page.type
    var simplePagination = require("./template/simplePagination.html")
    var isLogin = require('../application/effect.js').isLogin
    var getUserCentreInfo = require('./home.js').getUserCentreInfo
    if(type == 'mycoupon'){
        isLogin(initData,true)
    }
    function initData(userInfo){
            getUserCentreInfo()
            rightsSaleQueryUsing()
    }

    function rightsSaleQueryUsing(pageNumber){
        type = method.getParam('mycouponType')  || 0
        pageNumber = pageNumber || 1
        $.ajax({
            // url: api.coupon.queryUsing + '?type=' + type?type:0 + '&cuk=d476d0ef8266997b520ad99638a21d0073827bcbfc6c4616d29ee61005b28931&pageNumber='+ pageNumber?pageNumber:0 + '&pageSize=10',
            url: api.coupon.queryUsing  + '?type=' + type  + '&pageNumber='+ pageNumber +'&pageSize=20',
            type: "GET",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (res) {
               if(res.code == '0'){
                    console.log('rightsSaleQueryUsing:',res.data&&res.data.list)    
                    var list = res.data.list
                    var mycoupon = require("./template/mycoupon.html")
                    var _mycouponTemplate = template.compile(mycoupon)({list:list||[],mycouponType:type||'0'});
                    $(".personal-center-mycoupon").html(_mycouponTemplate);
                    handlePagination(res.data.totalPages,res.data.pageNumber) 
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


    function handlePagination(totalPages,currentPage){
        var _simplePaginationTemplate = template.compile(simplePagination)({paginationList:new Array(totalPages||0),currentPage:currentPage});
        $(".pagination-wrapper").html(_simplePaginationTemplate)
        $('.pagination-wrapper').on('click','.page-item',function(e){
            var paginationCurrentPage = $(this).attr("data-currentPage")
            if(!paginationCurrentPage){
                return
            }
            rightsSaleQueryUsing(paginationCurrentPage)
        })
       }
});