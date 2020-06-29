define(function(require , exports , module){
    var type = window.pageConfig&&window.pageConfig.page.type
    var vipTableType = window.pageConfig.page&&window.pageConfig.page.vipTableType || 0
    var method = require("../application/method"); 
    var bnnerTemplate = require("../common/template/swiper_tmp.html");
    var simplePagination = require("./template/simplePagination.html")
    var recommendConfigInfo = require('../common/recommendConfigInfo')    
    var api = require('../application/api');
    var isLogin = require('./effect.js').isLogin
    var getUserCentreInfo = require('./home.js').getUserCentreInfo
    isLogin(initData)


    function initData(){
        if(type == 'myvip'){
            getUserCentreInfo(getUserCentreInfoCallback)
        }
    }


    function getUserCentreInfoCallback(userInfo){
        var myvip = require("./template/myvip.html")
        var _myvipTemplate = template.compile(myvip)({userInfo:userInfo,vipTableType:vipTableType});
        $(".personal-center-vip").html(_myvipTemplate);
        if(vipTableType == '0'){
            getMemberPointRecord()
        }else{
            getBuyRecord() 
        }
    }
    function getMemberPointRecord(currentPage){  // 查询用户特权等记录流水
        $.ajax({
            url: api.coupon.getMemberPointRecord,
            type: "POST",
            data: JSON.stringify({
                currentPage:currentPage||1,
                pageSize:20,
                memberCode:'PREVILEGE_NUM'   
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (res) {
               if(res.code == '0'){
                    console.log('getMemberPointRecord:',res) 
                    var vipTable = require('./template/vipTable.html')
                    var vipTableType =window.pageConfig.page&&window.pageConfig.page.vipTableType || 0
                    var list = res.data&&res.data.rows || []
                    var isVip = method.getCookie('ui')?JSON.parse(method.getCookie('ui')).isVip:''
                   var _vipTableTemplate = template.compile(vipTable)({list:list||[],isVip:isVip,vipTableType:vipTableType})
                   $(".vip-table-wrapper").html(_vipTableTemplate) 
                    handlePagination(res.data.totalPages,res.data.currentPage) 
               }else{
                $.toast({
                    text:res.msg,
                    delay : 3000,
                })
               }
            },
            error:function(error){
                console.log('getMemberPointRecord:',error)
            }
        })
    }
    function getBuyRecord(currentPage){ // 查询用户充值权益记录
        $.ajax({
            url: api.coupon.getBuyRecord,
            type: "POST",
            data: JSON.stringify({
                currentPage:currentPage||1,
                pageSize:20
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (res) {
               if(res.code == '0'){
                    console.log('getBuyRecord:',res)  
                  var vipTable = require('./template/vipTable.html')
                  var vipTableType = window.pageConfig.page&&window.pageConfig.page.vipTableType || 0
                  var list = res.data&&res.data.rows || []
                  var isVip = method.getCookie('ui')?JSON.parse(method.getCookie('ui')).isVip:''
                  var _vipTableTemplate = template.compile(vipTable)({list:list,isVip:isVip,vipTableType:vipTableType});
                   $(".vip-table-wrapper").html(_vipTableTemplate) 
                    handlePagination(res.data.totalPages,res.data.currentPage)  
               }else{
                $.toast({
                    text:res.msg,
                    delay : 3000,
                })
               }
            },
            error:function(error){
                console.log('getBuyRecord:',error)
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
            if(vipTableType == '0'){
                getMemberPointRecord(paginationCurrentPage)
            }else{
                getBuyRecord(paginationCurrentPage)
            }
        })
    }

    function getVipPrivilegeList() {  // 获取vip权益列表 (通过推荐位来配置)
        $.ajax({
            url: api.recommend.recommendConfigInfo,
            type: "POST",
            data: JSON.stringify(recommendConfigInfo.vipPrivilegeList.pageIds),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (res) {
               if(res.code == '0'){
                res.data.forEach(function(item){  // 匹配 组装数据
                    recommendConfigInfo.search.descs.forEach(function(desc){
                        if(item.pageId == desc.pageId){
                            desc.list = method.handleRecommendData(item.list)
                            console.log(method.handleRecommendData(item.list))
                        }
                    })
                })
                console.log(recommendConfigInfo)
                recommendConfigInfo.search.descs.forEach(function(item){
                    if(item.list.length){
                        if(item.pageId == 'PC_M_USER_vip'){
                            // var _topBannerHtml = template.compile(topBnnerTemplate)({ topBanner: item.list ,className:'swiper-top-container',hasDeleteIcon:true});
                            // $(".search-all-main-topbanner").html(_topBannerHtml);
                            // var mySwiper = new Swiper('.swiper-top-container', {
                            //     direction: 'horizontal',
                            //     loop: item.list.length>1 ? true : false,
                            //     autoplay: 3000,
                            // })
                        }
                        
                    }else{
                     $('.close-swiper').hide()   
                    }
                })
               }
            }
        })
    }
});