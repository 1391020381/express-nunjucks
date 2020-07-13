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
        isLogin(initData)
    }
    function initData(userInfo){
            getUserCentreInfo(userInfo)  
            getFileBrowsePage()
            getDownloadRecordList()
            getBannerbyPosition()
            getMyVipRightsList()
    }
    function getUserCentreInfo(userInfo,callback) {  
        console.log('getUserCentreInfo:',userInfo)
        // compilerTemplate(res.data)
        $('.personal-center-menu .personal-profile .personal-img').attr('src',userInfo.photoPicURL)
        // $('.personal-center-menu .personal-profile .personal-nickname .nickname').(res.data.nickName)
        $('.personal-center-menu .personal-profile .personal-nickname .nickname').html('<p class="personal-nickname"><span class="nickname">'+userInfo.nickName +'</span> <span class="level-icon"></span></p>')
        // $('.personal-center-menu .personal-profile .personal-id .id').text(res.data.id?'用户ID:' + res.data.id:'用户ID:')
        $('.personal-center-menu .personal-profile .personal-id').html('<span class="id" id="id" value="">用户ID:'+ userInfo.id + '</span><span class="copy clipboardBtn" data-clipboard-text='+ userInfo.id +'data-clipboard-action="copy">复制</span>')
        $('.personal-center-menu .personal-profile .personal-id .copy').attr("data-clipboard-text",userInfo.id)
        var isVipMaster = userInfo.isVipMaster
        var privilegeNum  = userInfo.privilege   // 下载券数量
        var couponNum = userInfo.coupon
        var aibeans = userInfo.aibeans
        var isAuth = userInfo.isAuth
        if(!isVipMaster){
            $('.personal-center-menu .personal-profile .personal-nickname .level-icon').hide()  
        }else{
            $('.personal-center-home .opentvip').hide()
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
        if(!isAuth){
            $('.personal-menu .mywallet').hide()
        }
        callback&&callback(userInfo)
    }
    function getFileBrowsePage(){ //分页获取用户的历史浏览记录
        $.ajax({
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
                        res.data.rows.forEach(function(item){
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
                res.data.forEach(function(item){  // 匹配 组装数据
                    recommendConfigInfo.personalCenterHome.descs.forEach(function(desc){
                        if(item.pageId == desc.pageId){
                            desc.list = method.handleRecommendData(item.list)
                        }
                    })
                })
                console.log(recommendConfigInfo)
                recommendConfigInfo.personalCenterHome.descs.forEach(function(k){
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
                res.data.forEach(function(item){  // 匹配 组装数据
                    recommendConfigInfo.myVipRightsList.descs.forEach(function(desc){
                        if(item.pageId == desc.pageId){
                            desc.list = method.handleRecommendData(item.list)
                        }
                    })
                })
                console.log(recommendConfigInfo)
                recommendConfigInfo.myVipRightsList.descs.forEach(function(k){
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