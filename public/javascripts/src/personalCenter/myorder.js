define(function(require , exports , module){
    var method = require("../application/method");
    var api = require('../application/api');
    var type = window.pageConfig&&window.pageConfig.page.type
    var isLogin = require('../application/effect.js').isLogin
    var getUserCentreInfo = require('./home.js').getUserCentreInfo
    var myorderType  = window.pageConfig&&window.pageConfig.page.myorderType
    var simplePagination = require("./template/simplePagination.html")
    var orderStatusList = {
        0:'待支付',
        1:'待支付',
        2:'交易成功',
        3:'待支付',
        4:'订单失效'
    }
    var refundStatusDescList = {
          0:'未申请退款',
          1:'退款申请中',
          2:'退款审核中',
          3:'退款审核不通过',
          4:'退款成功',
          5:'退款失败',
          7:'退款异常'
    }
    var goodsTypeList = {
        1:{
            desc:'购买资料',
            checkStatus:8  //资料是付费，用户未购买
        },
        2:{
            desc:'购买VIP',
            checkStatus:10  //资料是付费，用户未购买
        },
        8:{
            desc:'购买下载特权',
            checkStatus:13  //  资料是vip,用户是vip,特权不够
        },
    }
    if(type == 'myorder'){
        isLogin(initData,true) 
    }
    
    function initData(){
        getUserCentreInfo()
        queryOrderlistByCondition()
    }
    $('.personal-center-myorder').click('.item-operation',function(event){ // 需要根据 goodsType 转换为 checkStatus(下载接口)
        var orderStatus = $(event.target).attr('data-orderstatus')
        if(orderStatus!==2 &&orderStatus!=undefined){
            var goodsType = $(event.target).attr('data-goodstype')
            var fid = $(event.target).attr('data-fid')
            var orderNo = $(event.target).attr('data-orderno')
            var checkStatus = goodsTypeList[goodsType]&&goodsTypeList[goodsType].checkStatus
            method.compatibleIESkip("/pay/payQr.html?type=" + checkStatus+ "&orderNo="+ orderNo+"&fid="+ fid,true);
        } 
    })

    $('.personal-center-myorder').click('.item-desc',function(event){ // 需要根据 goodsType 转换为 checkStatus(下载接口)
       var goodsName =  $(event.target).attr('data-goodsname') 
       var fid = $(event.target).attr('data-goodstype')
       var goodsType = $(event.target).attr('data-goodstype')
       var format = $(event.target).attr('data-format')
       if(goodsName){
           if(goodsType == '1'){
               method.compatibleIESkip('/f/' + fid + '.html',true); 
           }else if(goodsType == '2'){
            var params = '?fid=' + fid + '&ft=' + format +  '&checkStatus=' + '10' +'&name=' + encodeURIComponent(encodeURIComponent(goodsName)) + '&ref=' + ''
            method.compatibleIESkip('/pay/vip.html' + params,true);
           }else if(goodsType =='8'){
          var params = '?fid=' + fid + '&ft=' + format + '&checkStatus=' + '13'+'&name=' + encodeURIComponent(encodeURIComponent(title)) + '&ref=' + '';
           method.compatibleIESkip('/pay/privilege.html' + params,true);
           }
       }
    })



    function queryOrderlistByCondition(currentPage) {
        var orderStatus =   method.getParam('myorderType') == '1'?'': method.getParam('myorderType')
        $.ajax({
            url: api.order.queryOrderlistByCondition,
            type: "POST",
            data:JSON.stringify({
                orderStatus:orderStatus,
                userOpt:'0',
                currentPage:currentPage || 1,
                pageSize:20,
                sortStr:'orderTime'
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (res) {
                console.log('queryOrderlistByCondition:',res)
               if(res.code == '0'){
                var list = []
                var formatDate = method.formatDate
                Date.prototype.format = formatDate
                   if(res.data&&res.data.rows){
                       $(res.data.rows).each(function(index,item){
                          item.payPrice = (item.payPrice/100).toFixed(2)
                          item.orderTime = new Date(item.orderTime).format("yyyy-MM-dd")
                          if(item.refundStatus== 0 ||!item.refundStatus){
                            item.orderStatusDesc = orderStatusList[item.orderStatus]  
                          }else{
                            item.orderStatusDesc = refundStatusDescList[item.orderStatus]  
                          }
                         list.push(item) 
                       })
                   }
                    var myorder = require("./template/myorder.html")
                    var _myorderTemplate = template.compile(myorder)({list:list||[],myorderType:myorderType});
                   $(".personal-center-myorder").html(_myorderTemplate);     
                   handlePagination(res.data.totalPages,res.data.currentPage)  
               }else{
                $.toast({
                    text:res.msg,
                    delay : 3000,
                })
               }
            },
            error:function(error){
                console.log('queryOrderlistByCondition:',error)
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
            queryOrderlistByCondition(paginationCurrentPage)
        })
       }
});