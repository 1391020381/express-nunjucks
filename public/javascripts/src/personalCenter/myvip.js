

define(function(require , exports , module){
    var type = window.pageConfig&&window.pageConfig.page.type
    var vipTableType = window.pageConfig.page&&window.pageConfig.page.vipTableType || 0
    var method = require("../application/method"); 
    var bannerTemplate = require("../common/template/swiper_tmp.html");
    var vipPrivilegeList = require("./template/vipPrivilegeList.html")
    var simplePagination = require("./template/simplePagination.html")
    var recommendConfigInfo = require('../common/recommendConfigInfo')    
    var api = require('../application/api');
    var isLogin = require('../application/effect.js').isLogin
    var getUserCentreInfo = require('./home.js').getUserCentreInfo
    var userInfoValue = {}
    if(type == 'myvip'){
        isLogin(initData,true)
    }

    function initData(){
            getUserCentreInfo(getUserCentreInfoCallback)
    }


    function getUserCentreInfoCallback(userInfo){
        var myvip = require("./template/myvip.html")
        var formatDate = method.formatDate
        Date.prototype.format = formatDate
        userInfoValue = userInfo
        userInfo.endDateMaster = new Date(userInfo.endDateMaster).format("yyyy-MM-dd")
        var _myvipTemplate = template.compile(myvip)({userInfo:userInfo,vipTableType:vipTableType});
        $(".personal-center-vip").html(_myvipTemplate);
        getBannerbyPosition()
        getMyVipRightsList()
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
                    var list =  []
                    $(res.data.rows).each(function(index,item){
                        var effectiveStartDate =   new Date(item.effectiveStartDate).format("yyyy-MM-dd")
                        var effectiveEndDate =   new Date(item.effectiveEndDate).format("yyyy-MM-dd")
                        item.effectiveStartDate = effectiveStartDate
                        item.effectiveEndDate = effectiveEndDate
                        list.push(item)
                    })
                    
                    // var isVip = userInfoValue.isVipMaster || userInfoValue.isVipOffice 

                   var _vipTableTemplate = template.compile(vipTable)({list:list||[],vipTableType:vipTableType})
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

                //   var isVip =  userInfoValue.isVipMaster || userInfoValue.isVipOffice 
                var list =  []
                $(res.data.rows).each(function(index,item){
                    item.beginDate =   new Date(item.beginDate).format("yyyy-MM-dd")
                    item.endDate =   new Date(item.endDate).format("yyyy-MM-dd")
                    list.push(item)
                })
                  var _vipTableTemplate = template.compile(vipTable)({list:list,vipTableType:vipTableType});
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

    function getBannerbyPosition() { // PC_M_USER_banner
        $.ajax({
            url: api.recommend.recommendConfigInfo,
            type: "POST",
            data: JSON.stringify(recommendConfigInfo.myVipRightsBanner.pageIds),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (res) {
               if(res.code == '0'){
                $(res.data).each(function(index,item){  // 匹配 组装数据
                    $(recommendConfigInfo.myVipRightsBanner.descs).each(function(index,desc){
                        if(item.pageId == desc.pageId){
                            desc.list = method.handleRecommendData(item.list)
                        }
                    })
                })
                console.log(recommendConfigInfo)
                $(recommendConfigInfo.myVipRightsBanner.descs).each(function(index,k){
                    if(k.list.length){
                        if(k.pageId == 'PC_M_USER_VIP_banner'){ // search-all-main-bottombanner
                            console.log('PC_M_USER_VIP_banner:',k.list)
                            var _bannerTemplate = template.compile(bannerTemplate)({ topBanner: k.list ,className:'personalCenter-myvip-swiper-container',hasDeleteIcon:true});
                            $(".myvip .advertisement").html(_bannerTemplate);
                            var mySwiper = new Swiper('.personalCenter-myvip-swiper-container', {
                                direction: 'horizontal',
                                loop: true,
                                loop: k.list.length>1 ? true : false,
                                autoplay: 3000,
                            })
                        }
                    }
                })
               }
            }
        })
    }
    function getMyVipRightsList(){
        $.ajax({
            url: api.recommend.recommendConfigInfo,
            type: "POST",
            data: JSON.stringify(recommendConfigInfo.myVipRightsList.pageIds),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (res) {
               if(res.code == '0'){
                $(res.data).each(function(index,item){  // 匹配 组装数据
                    $(recommendConfigInfo.myVipRightsList.descs).each(function(index,desc){
                        if(item.pageId == desc.pageId){
                            desc.list = method.handleRecommendData(item.list)
                        }
                    })
                })
                console.log(recommendConfigInfo)
                $(recommendConfigInfo.myVipRightsList.descs).each(function(index,k){
                    if(k.list.length){
                        if(k.pageId == 'PC_M_USER_vip'){ // search-all-main-bottombanner
                            console.log('PC_M_USER_vip:',k.list)
                            var _vipPrivilegeListHtml = template.compile(vipPrivilegeList)({ list: k.list});
                            $('.myvip .vip-privilege-wrapper').html(_vipPrivilegeListHtml);
                          
                        }
                    }
                })
               }
            }
        })
    }

    $(document).on('click','.personal-center-vip .close-swiper',function(e){
        $('.my-vip-middle.advertisement').hide()
    })
});