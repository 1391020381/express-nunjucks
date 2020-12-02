define("dist/personalCenter/home-debug", [ "swiper-debug", "../common/recommendConfigInfo-debug", "../application/method-debug", "../common/template/swiper_tmp-debug.html", "../application/api-debug", "../application/urlConfig-debug", "./template/homeRecentlySee-debug.html", "./template/vipPrivilegeList-debug.html", "../application/effect-debug", "../application/checkLogin-debug", "../application/login-debug", "../common/bilog-debug", "base64-debug", "../cmd-lib/util-debug", "../report/config-debug", "../cmd-lib/myDialog-debug", "../cmd-lib/toast-debug", "../application/iframe/iframe-messenger-debug", "../application/iframe/messenger-debug", "../common/baidu-statistics-debug", "../common/loginType-debug" ], function(require, exports, module) {
    require("swiper-debug");
    var recommendConfigInfo = require("../common/recommendConfigInfo-debug");
    var method = require("../application/method-debug");
    var bannerTemplate = require("../common/template/swiper_tmp-debug.html");
    var api = require("../application/api-debug");
    var homeRecentlySee = require("./template/homeRecentlySee-debug.html");
    var vipPrivilegeList = require("./template/vipPrivilegeList-debug.html");
    var type = window.pageConfig && window.pageConfig.page.type;
    var isLogin = require("../application/effect-debug").isLogin;
    var userInfo = {};
    if (type == "home") {
        isLogin(initData, true);
    }
    function initData(data) {
        userInfo = data;
        getUserCentreInfo();
        getFileBrowsePage();
        getDownloadRecordList();
        getBannerbyPosition();
        getMyVipRightsList();
    }
    function getUserCentreInfo(callback, data) {
        // data 用户等信息     用户中心其他页面调用传入
        userInfo = data ? data : userInfo;
        $.ajax({
            headers: {
                Authrization: method.getCookie("cuk")
            },
            url: api.user.getUserCentreInfo + "?scope=4",
            type: "GET",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function(res) {
                if (res.code == "0") {
                    console.log("getUserCentreInfo:", res);
                    var isMasterVip = userInfo.isMasterVip;
                    var isOfficeVip = userInfo.isOfficeVip;
                    var privilegeNum = res.data.privilege;
                    // 下载券数量
                    var couponNum = res.data.coupon;
                    var aibeans = res.data.aibeans;
                    var isAuth = res.data.isAuth;
                    var userTypeId = res.data.userTypeId;
                    var authDesc = userTypeId == 2 ? "个人认证" : "机构认证";
                    var endDateMaster = userInfo.expireTime ? new Date(userInfo.expireTime).format("yyyy-MM-dd") : "";
                    var endDateOffice = userInfo.officeVipExpireTime ? new Date(userInfo.officeVipExpireTime).format("yyyy-MM-dd") : "";
                    // compilerTemplate(res.data)
                    var masterIcon = isMasterVip == 1 ? '<span class="whole-station-vip-icon"></span>' : "";
                    var officIcon = isOfficeVip == 1 ? '<span class="office-vip-icon"></span>' : "";
                    $(".personal-center-menu .personal-profile .personal-img").attr("src", res.data.photoPicURL);
                    // $('.personal-center-menu .personal-profile .personal-nickname .nickname').(res.data.nickName)
                    $(".personal-center-menu .personal-profile .personal-nickname-content").html('<p class="personal-nickname"><span class="nickname">' + res.data.nickName + "</span>" + masterIcon + officIcon + "</p>");
                    // $('.personal-center-menu .personal-profile .personal-id .id').text(res.data.id?'用户ID:' + res.data.id:'用户ID:')
                    $(".personal-center-menu .personal-profile .personal-id").html('<span class="id" id="id" value="">用户ID:' + res.data.id + '</span><span class="copy clipboardBtn" data-clipboard-text=' + res.data.id + 'data-clipboard-action="copy">复制</span>');
                    $(".personal-center-menu .personal-profile .personal-id .copy").attr("data-clipboard-text", res.data.id);
                    // $('.personal-center-menu .personal-profile .personal-brief').text('简介: 爱问共享资料爱问共享资...')
                    if (isMasterVip == 1) {
                        // $('.personal-center-home .personal-summarys .go2vip').hide() 
                        $(".personal-center-home .whole-station-vip .whole-station-vip-endtime").text(endDateMaster + "到期");
                        $(".personal-center-home .whole-station-vip").removeClass("hide");
                        $(".personal-center-home .opentvip").hide();
                        $(".personal-center-home .privileges").removeClass("hide");
                        $(".personal-center-home .occupying-effect").hide();
                    } else {
                        // $('.personal-center-home .whole-station-vip').hide()
                        $(".personal-center-menu .personal-profile .personal-nickname .level-icon").hide();
                    }
                    if (isOfficeVip == 1) {
                        $(".personal-center-home .office-vip .office-vip-endtime").text(endDateOffice + "到期");
                        $(".personal-center-home .office-vip").removeClass("hide");
                    } else {}
                    if (!isMasterVip && !isOfficeVip) {
                        $(".personal-summarys .left-border").hide();
                    }
                    if (privilegeNum) {
                        $(".personal-center-home .volume").text(privilegeNum ? privilegeNum : 0);
                    }
                    if (couponNum) {
                        $(".personal-center-home .coupon").text(couponNum ? couponNum : 0);
                    }
                    if (aibeans) {
                        $(".personal-center-home .aibeans").text(aibeans ? (aibeans / 100).toFixed() : 0);
                    }
                    if (isAuth == 1) {
                        $(".personal-isAuth").html('<span class="auth-desc">' + authDesc + "</span>");
                        $(".personal-menu .mywallet").css("display", "block");
                    }
                    callback && callback(res.data);
                    userWxAuthState();
                } else {
                    $.toast({
                        text: res.message || "查询用户信息失败",
                        delay: 3e3
                    });
                }
            },
            error: function(error) {
                console.log("getUserCentreInfo:", error);
            }
        });
    }
    function getFileBrowsePage() {
        //分页获取用户的历史浏览记录
        $.ajax({
            headers: {
                Authrization: method.getCookie("cuk")
            },
            url: api.user.getFileBrowsePage,
            type: "POST",
            data: JSON.stringify({
                currentPage: 1,
                pageSize: 3
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function(res) {
                if (res.code == "0") {
                    console.log("getFileBrowsePage:", res);
                    // data.rows
                    if (res.data.rows && res.data.rows.length) {
                        var _homeRecentlySeeTemplate = template.compile(homeRecentlySee)({
                            flag: "recentlySee",
                            data: res.data.rows || []
                        });
                        $(".recently-see").html(_homeRecentlySeeTemplate);
                    } else {
                        $(".recently-see").hide();
                    }
                } else {
                    $(".recently-see").hide();
                    $.toast({
                        text: res.message,
                        delay: 3e3
                    });
                }
            },
            error: function(error) {
                $(".recently-see").hide();
                console.log("getFileBrowsePage:", error);
            }
        });
    }
    function getDownloadRecordList() {
        //用户下载记录接口
        $.ajax({
            headers: {
                Authrization: method.getCookie("cuk")
            },
            url: api.user.getDownloadRecordList,
            type: "POST",
            data: JSON.stringify({
                currentPage: 1,
                pageSize: 3
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function(res) {
                if (res.code == "0") {
                    console.log("getFileBrowsePage:", res);
                    // 复用模板,需要转换接口返回的key
                    var data = [];
                    if (res.data && res.data.rows.length) {
                        $(res.data.rows).each(function(index, item) {
                            data.push({
                                id: 1,
                                fileid: item.id,
                                format: item.format,
                                totalPage: "",
                                name: item.title
                            });
                        });
                        var _homeRecentlySeeTemplate = template.compile(homeRecentlySee)({
                            flag: "recentlydownloads",
                            data: data || []
                        });
                        $(".recently-downloads").html(_homeRecentlySeeTemplate);
                    } else {
                        $(".recently-downloads").hide();
                    }
                } else {
                    $(".recently-downloads").hide();
                    $.toast({
                        text: res.message,
                        delay: 3e3
                    });
                }
            },
            error: function(error) {
                $(".recently-downloads").hide();
                console.log("getFileBrowsePage:", error);
            }
        });
    }
    function getBannerbyPosition() {
        // PC_M_USER_banner
        $.ajax({
            url: api.recommend.recommendConfigInfo,
            type: "POST",
            data: JSON.stringify(recommendConfigInfo.personalCenterHome.pageIds),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function(res) {
                if (res.code == "0") {
                    $(res.data).each(function(index, item) {
                        // 匹配 组装数据
                        $(recommendConfigInfo.personalCenterHome.descs).each(function(index, desc) {
                            if (item.pageId == desc.pageId) {
                                desc.list = method.handleRecommendData(item.list);
                            }
                        });
                    });
                    console.log(recommendConfigInfo);
                    $(recommendConfigInfo.personalCenterHome.descs).each(function(index, k) {
                        if (k.list.length) {
                            if (k.pageId == "PC_M_USER_banner") {
                                // search-all-main-bottombanner
                                console.log("PC_M_USER_banner:", k.list);
                                var _bannerTemplate = template.compile(bannerTemplate)({
                                    topBanner: k.list,
                                    className: "personalCenter-home-swiper-container",
                                    hasDeleteIcon: true
                                });
                                $(".personal-center-home .advertisement").html(_bannerTemplate);
                                var mySwiper = new Swiper(".personalCenter-home-swiper-container", {
                                    direction: "horizontal",
                                    loop: true,
                                    loop: k.list.length > 1 ? true : false,
                                    autoplay: 3e3
                                });
                            }
                        }
                    });
                }
            }
        });
    }
    function getMyVipRightsList() {
        $.ajax({
            url: api.recommend.recommendConfigInfo,
            type: "POST",
            data: JSON.stringify(recommendConfigInfo.myVipRightsList.pageIds),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function(res) {
                if (res.code == "0") {
                    $(res.data).each(function(index, item) {
                        // 匹配 组装数据
                        $(recommendConfigInfo.myVipRightsList.descs).each(function(index, desc) {
                            if (item.pageId == desc.pageId) {
                                desc.list = method.handleRecommendData(item.list);
                            }
                        });
                    });
                    console.log(recommendConfigInfo);
                    $(recommendConfigInfo.myVipRightsList.descs).each(function(index, k) {
                        if (k.list.length) {
                            if (k.pageId == "PC_M_USER_vip") {
                                // search-all-main-bottombanner
                                console.log("PC_M_USER_vip:", k.list);
                                var _vipPrivilegeListHtml = template.compile(vipPrivilegeList)({
                                    list: k.list
                                });
                                $(".personal-center-home .vip-privilege-items-wrapper").html(_vipPrivilegeListHtml);
                            }
                        }
                    });
                }
            }
        });
    }
    function userWxAuthState() {
        $.ajax({
            headers: {
                Authrization: method.getCookie("cuk")
            },
            url: api.user.userWxAuthState,
            type: "GET",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function(res) {
                if (res.code == "0") {
                    if (res.data.isWxAuth) {
                        $(".signIn").removeClass("signIn-hide");
                    }
                } else {
                    $.toast({
                        text: res.message,
                        delay: 3e3
                    });
                }
            },
            error: function(error) {
                console.log("queryUserBindInfo:", error);
            }
        });
    }
    $(document).on("click", ".personal-center-home .add-privileges", function(e) {
        method.compatibleIESkip("/pay/privilege.html?checkStatus=13", true);
    });
    return {
        getUserCentreInfo: getUserCentreInfo
    };
});