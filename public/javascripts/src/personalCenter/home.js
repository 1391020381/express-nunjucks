define(function(require , exports , module){
    require('swiper');
    var recommendConfigInfo = require('../common/recommendConfigInfo')   
    var method = require("../application/method"); 
    var bannerTemplate = require("../common/template/swiper_tmp.html");
    var api = require('../application/api');
    var homeRecentlySee = require("./template/homeRecentlySee.html")
    var vipPrivilegeList = require('./template/vipPrivilegeList.html')
    var type = window.pageConfig&&window.pageConfig.page.type
    var isLogin = require('../application/effect.js').isLogin
    if(type == 'home'){
        isLogin(initData,true)
    }
    function initData(){
            getUserCentreInfo()  
            getFileBrowsePage()
            getDownloadRecordList()
            getBannerbyPosition()
            getMyVipRightsList()
    }
    function getUserCentreInfo(callback) {  
        $.ajax({
            headers:{
                'Authrization':method.getCookie('cuk')
            },
            url: api.user.getUserCentreInfo+"?scope=4",
            type: "GET",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (res) {
               if(res.code == '0'){
                    console.log('getUserCentreInfo:',res)
                    var isVipMaster = res.data.isVipMaster
                    var isVipOffice = res.data.isVipOffice
                    var privilegeNum  = res.data.privilege   // 下载券数量
                    var  couponNum = res.data.coupon
                    var aibeans = res.data.aibeans
                    var isAuth = res.data.isAuth
                    var userTypeId = res.data.userTypeId
                    var authDesc = userTypeId==2?'个人认证':'机构认证'
                    var endDateMaster = res.data.endDateMaster? new Date(res.data.endDateMaster).format("yyyy-MM-dd"):''
                    var endDateOffice = res.data.endDateOffice? new Date(res.data.endDateOffice).format("yyyy-MM-dd"):''
                    // compilerTemplate(res.data)
                    var masterIcon = isVipMaster?'<span class="whole-station-vip-icon"></span>':''
                    var officIcon = isVipOffice?'<span class="office-vip-icon"></span>':''
                    $('.personal-center-menu .personal-profile .personal-img').attr('src',res.data.photoPicURL)
                    // $('.personal-center-menu .personal-profile .personal-nickname .nickname').(res.data.nickName)
                    $('.personal-center-menu .personal-profile .personal-nickname-content').html('<p class="personal-nickname"><span class="nickname">'+res.data.nickName +'</span>'+ masterIcon + officIcon + '</p>')
                    // $('.personal-center-menu .personal-profile .personal-id .id').text(res.data.id?'用户ID:' + res.data.id:'用户ID:')
                    $('.personal-center-menu .personal-profile .personal-id').html('<span class="id" id="id" value="">用户ID:'+ res.data.id + '</span><span class="copy clipboardBtn" data-clipboard-text='+ res.data.id +'data-clipboard-action="copy">复制</span>')
                    $('.personal-center-menu .personal-profile .personal-id .copy').attr("data-clipboard-text",res.data.id)
                    // $('.personal-center-menu .personal-profile .personal-brief').text('简介: 爱问共享资料爱问共享资...')
                 
                    if(isVipMaster){ 
                        // $('.personal-center-home .personal-summarys .go2vip').hide() 
                        $('.personal-center-home .whole-station-vip .whole-station-vip-endtime').text(endDateMaster +'到期')
                        $('.personal-center-home .opentvip').hide()
                    }else{
                        $('.personal-center-home .whole-station-vip').hide()
                        $('.personal-center-menu .personal-profile .personal-nickname .level-icon').hide() 
                    }
                    if(isVipOffice){
                        $('.personal-center-home .office-vip .office-vip-endtime').text(endDateOffice +'到期')
                    }else{
                        $('.personal-center-home .office-vip').hide()
                    }
                    if(!isVipMaster && !isVipOffice){
                        $('.personal-summarys .left-border').hide()
                    }
                    if(privilegeNum ){
                        $(".personal-center-home .volume").text(privilegeNum ?privilegeNum :0)
                    }
                    if(couponNum){
                        $(".personal-center-home .coupon").text(couponNum ?couponNum :0)
                    }
                    if(aibeans){
                        $(".personal-center-home .aibeans").text(aibeans?(aibeans/100).toFixed():0)
                    }
                   
                    if(isAuth == 1){
                        $('.personal-isAuth').html('<span class="auth-desc">'+ authDesc +'</span>')
                        $('.personal-menu .mywallet').css('display','block')
                    }
                    callback&&callback(res.data)
               }else{
                $.toast({
                    text:res.msg||'查询用户信息失败',
                    delay : 3000,
                })
               }
            },
            error:function(error){
                console.log('getUserCentreInfo:',error)
            }
        })}

    function getFileBrowsePage(){ //分页获取用户的历史浏览记录
        $.ajax({
            headers:{
                'Authrization':method.getCookie('cuk')
            },
            url: api.user.getFileBrowsePage,
            type: "POST",
            data: JSON.stringify({
                currentPage:1,
                pageSize:3
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (res) {
               if(res.code == '0'){
                    console.log('getFileBrowsePage:',res)
                    // data.rows
                    if(res.data.rows&&res.data.rows.length){
                        var _homeRecentlySeeTemplate = template.compile(homeRecentlySee)({flag:'recentlySee',data:res.data.rows||[]});
                        $(".recently-see").html(_homeRecentlySeeTemplate);
                    }else{
                        $(".recently-see").hide()
                    }
               }else{
                $(".recently-see").hide()
                $.toast({
                    text:res.msg,
                    delay : 3000,
                })
               }
            },
            error:function(error){
                $(".recently-see").hide()
                console.log('getFileBrowsePage:',error)
            }
        })
    }
    function getDownloadRecordList(){ //用户下载记录接口
        $.ajax({
            headers:{
                'Authrization':method.getCookie('cuk')
            },
            url: api.user.getDownloadRecordList,
            type: "POST",
            data: JSON.stringify({
                currentPage:1,
                pageSize:3
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (res) {
               if(res.code == '0'){
                    console.log('getFileBrowsePage:',res)
                    // 复用模板,需要转换接口返回的key
                    var data = []
                    if(res.data&&res.data.rows.length){
                        $(res.data.rows).each(function(index,item){
                            data.push({
                             id:1,
                             fileid:item.id,
                             format:item.format,
                             totalPage:'',
                             name:item.title
                            }) 
                         })
                        var _homeRecentlySeeTemplate = template.compile(homeRecentlySee)({flag:'recentlydownloads',data:data||[]});
                    $(".recently-downloads").html(_homeRecentlySeeTemplate)
                    }else{
                        $(".recently-downloads").hide()
                    }
               }else{
                $(".recently-downloads").hide()
                $.toast({
                    text:res.msg,
                    delay : 3000,
                })
               }
            },
            error:function(error){
                $(".recently-downloads").hide()
                console.log('getFileBrowsePage:',error)
            }
        })
    }
    function getBannerbyPosition() { // PC_M_USER_banner
        $.ajax({
            url: api.recommend.recommendConfigInfo,
            type: "POST",
            data: JSON.stringify(recommendConfigInfo.personalCenterHome.pageIds),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (res) {
               if(res.code == '0'){
                $(res.data).each(function(index,item){  // 匹配 组装数据
                    $(recommendConfigInfo.personalCenterHome.descs).each(function(index,desc){
                        if(item.pageId == desc.pageId){
                            desc.list = method.handleRecommendData(item.list)
                        }
                    })
                })
                console.log(recommendConfigInfo)
                $(recommendConfigInfo.personalCenterHome.descs).each(function(index,k){
                    if(k.list.length){
                        if(k.pageId == 'PC_M_USER_banner'){ // search-all-main-bottombanner
                            console.log('PC_M_USER_banner:',k.list)
                            var _bannerTemplate = template.compile(bannerTemplate)({ topBanner: k.list ,className:'personalCenter-home-swiper-container',hasDeleteIcon:true});
                            $(".personal-center-home .advertisement").html(_bannerTemplate);
                            var mySwiper = new Swiper('.personalCenter-home-swiper-container', {
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
                            $('.personal-center-home .vip-privilege-items-wrapper').html(_vipPrivilegeListHtml);
                          
                        }
                    }
                })
               }
            }
        })
    }
    return {
        getUserCentreInfo:getUserCentreInfo
    }
});