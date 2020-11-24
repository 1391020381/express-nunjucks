define("dist/index/init-debug", [ "swiper-debug", "../common/template/swiper_tmp-debug.html", "../application/suspension-debug", "../application/method-debug", "../application/checkLogin-debug", "../application/api-debug", "../application/urlConfig-debug", "../application/login-debug", "../common/bilog-debug", "base64-debug", "../cmd-lib/util-debug", "../report/config-debug", "../cmd-lib/myDialog-debug", "../cmd-lib/toast-debug", "../application/iframe/iframe-messenger-debug", "../application/iframe/messenger-debug", "../common/baidu-statistics-debug", "../application/app-debug", "../application/element-debug", "../application/template-debug", "../application/extend-debug", "../application/effect-debug", "../common/loginType-debug", "../application/helper-debug", "../application/single-login-debug", "../common/slider-debug", "./template/saiTemplate-debug.html" ], function(require, exports, moudle) {
    require("swiper-debug");
    var bannerTemplate = require("../common/template/swiper_tmp-debug.html");
    require("../application/suspension-debug");
    var slider = require("../common/slider-debug");
    //轮播插件
    var login = require("../application/checkLogin-debug");
    var utils = require("../cmd-lib/util-debug");
    var method = require("../application/method-debug");
    var login = require("../application/checkLogin-debug");
    var api = require("../application/api-debug");
    var headTip = require("./template/saiTemplate-debug.html");
    var clickEvent = require("../common/bilog-debug").clickEvent;
    // require('../common/bilog');
    /**
     * 推荐多图点击轮播
     * @type {{moreIndex: number, init: init, distance: number, domRend: domRend, index: number, slideLeft: slideLeft, slideRight: slideRight}}
     */
    var recomandSlide = {
        index: 0,
        distance: 0,
        moreIndex: 0,
        init: function() {
            recomandSlide.moreIndex = $(".recommend-item").length - 4;
            recomandSlide.slideLeft();
            recomandSlide.slideRight();
        },
        slideLeft: function() {
            $(".nextArrow").click(function() {
                if (recomandSlide.moreIndex > 0 && recomandSlide.index < recomandSlide.moreIndex) {
                    recomandSlide.index++;
                    recomandSlide.domRend();
                }
            });
        },
        slideRight: function() {
            $(".preArrow").click(function() {
                if (recomandSlide.index > 0) {
                    recomandSlide.index--;
                    recomandSlide.domRend();
                }
            });
        },
        domRend: function() {
            var num = -1 * recomandSlide.index * 302 + "px";
            $(".swiper-wrapper").animate({
                "margin-left": num
            });
        }
    };
    var indexObject = {
        initial: function() {
            // 精选专题多图轮播
            setTimeout(function() {
                recomandSlide.init();
            }, 1e3);
            //banner轮播图
            new slider("J_office_banner", "J_office_focus", "J_office_prev", "J_office_next");
            this.tabswitchFiles();
            this.tabswitchSeo();
            this.beforeInit();
            this.freshSeoData();
            this.searchWordHook();
            // 登录
            $(".notLogin").on("click", function() {
                if (!utils.getCookie("cuk")) {
                    login.notifyLoginInterface(function(data) {
                        indexObject.refreshTopBar(data);
                    });
                }
            });
            // 退出登录
            $(".loginOut").click(function() {
                login.ishareLogout();
            });
            $(".js-vaip—avatar").click(function() {
                var url = "/node/personalCenter/home.html";
                if (!utils.getCookie("cuk")) {
                    login.notifyLoginInterface(function(data) {
                        indexObject.refreshTopBar(data);
                        window.open(url);
                    });
                } else {
                    window.open(url);
                }
            });
            this.signDialog();
            this.getBannerbyPosition();
        },
        beforeInit: function() {
            if (utils.getCookie("cuk")) {
                login.getLoginData(function(data) {
                    if (data) {
                        indexObject.refreshTopBar(data);
                    }
                });
            }
            // 自动轮播热词
            indexObject.hotWordAuto();
        },
        // 自动轮播热词
        hotWordAuto: function() {
            var i = 0;
            var length = $(".search-container .label-ele").length;
            var timer = setInterval(function() {
                i++;
                if (i == length) {
                    i = 0;
                }
                var val = $(".search-container .label-ele").eq(i).find("a").text();
                $(".search-container .search-input").val(val);
            }, 2500);
            $(".search-bar input").on("focus", function() {
                clearInterval(timer);
            });
            $(".search-bar input").on("blur", function() {
                timer = setInterval(function() {
                    i++;
                    if (i == length) {
                        i = 0;
                    }
                    var val = $(".search-container .label-ele").eq(i).find("a").text();
                    $(".search-container .search-input").val(val);
                }, 2500);
            });
        },
        // 点击搜索
        searchWordHook: function() {
            var searVal = "";
            $(".search-container .icon-search").click(function() {
                searVal = $(".search-container .search-input").val();
                clickEvent("searchBtnClick", {
                    keyWords: searVal
                });
                window.open("/search/home.html" + "?" + "ft=all" + "&cond=" + encodeURIComponent(encodeURIComponent(searVal)));
            });
            $(".search-container .search-input").keydown(function(e) {
                if (e.keyCode == 13) {
                    searVal = $(".search-container .search-input").val();
                    clickEvent("searchBtnClick", {
                        keyWords: searVal
                    });
                    window.open("/search/home.html" + "?" + "ft=all" + "&cond=" + encodeURIComponent(encodeURIComponent(searVal)));
                }
            });
        },
        tabswitchFiles: function() {
            // 精选资料切换
            $(".recmond-tab").find("li").on("click", function() {
                $(this).addClass("current").siblings().removeClass("current");
                var _index = $(this).index();
                $(this).parents(".recmond-con").find(".content-list").eq(_index).addClass("current").siblings().removeClass("current");
            });
        },
        tabswitchSeo: function() {
            // 晒内容专区切换
            $(".seo-upload-new").find(".upload-title").on("click", function() {
                $(this).addClass("active").siblings().removeClass("active");
                var _index = $(this).index();
                $(".seo-upload-new .tab-list .tab").each(function(index, element) {
                    if (index == _index) {
                        $(element).addClass("active");
                        $(element).first().addClass("item-active");
                    } else {
                        $(element).removeClass("active");
                    }
                });
                $(this).parents(".seo-upload-new").find(".upload-list").eq(_index).addClass("current").siblings().removeClass("current");
            });
            $(".seo-upload-new .tab-list .tab .tab-item").on("hover", function() {
                $(this).addClass("item-active").siblings().removeClass("item-active");
                var _index = $(this).index();
                var range = {
                    // slice
                    0: {
                        start: 0,
                        end: 20
                    },
                    1: {
                        start: 20,
                        end: 40
                    },
                    2: {
                        start: 40,
                        end: 60
                    },
                    3: {
                        start: 60,
                        end: 80
                    },
                    4: {
                        start: 80,
                        end: 100
                    },
                    5: {
                        start: 100,
                        end: 120
                    },
                    6: {
                        start: 120,
                        end: 140
                    },
                    7: {
                        start: 140,
                        end: 160
                    },
                    8: {
                        start: 160,
                        end: 180
                    },
                    9: {
                        start: 180,
                        end: 200
                    }
                };
                changeItem(_index);
                function changeItem(index) {
                    $(".seo-upload-new .current li").hide();
                    $(".seo-upload-new .current li").slice(range[index].start, range[index].end).show();
                }
            });
        },
        //换一换
        freshSeoData: function() {
            var url = "";
            var data = {
                type: "new",
                currentPage: 1,
                pageSize: 12
            };
            var dataType = 1;
            var newIndex = 0;
            var topicndex = 0;
        },
        //刷新topbar
        refreshTopBar: function(data) {
            var $unLogin = $(".notLogin");
            var $hasLogin = $(".hasLogin");
            var $btn_user_more = $(".btn-user-more");
            $unLogin.hide();
            $hasLogin.find(".user-link .user-name").html(data.nickName);
            $hasLogin.find(".user-link img").attr("src", data.photoPicURL);
            $(".user-top .avatar-frame img").attr("src", data.photoPicURL);
            $hasLogin.find(".top-user-more .name").html(data.nickName);
            $(".user-state .user-name").text(data.nickName);
            $hasLogin.show();
            console.log("data:", data);
            // data.isVip = 0
            var wholeStationVip = data.isMasterVip == 1 ? '<p class="whole-station-vip"><span class="whole-station-vip-icon"></span><span class="endtime">' + data.expireTime + "到期</span></p>" : "";
            var officeVip = data.isOfficeVip == 1 ? '<p class="office-vip"><span class="office-vip-icon"></span><span class="endtime">' + data.officeVipExpireTime + "到期</span></p>" : "";
            var infoDescContent = wholeStationVip + officeVip;
            if (!data.isWxAuth) {
                $(".sign-btn").hide();
            }
            if (data.isMasterVip == 1 || data.isOfficeVip == 1) {
                $(".user-state .vip-icon").addClass("vip-avaliable");
                $(".userOperateBtn.gocenter").removeClass("hide").siblings(".userOperateBtn").addClass("hide");
                //  var expireStr = data.expireTime+'到期'
                // $('.user-state .info-des').text(expireStr);
                $(".user-state .info-des").html(infoDescContent);
                $(".user-state").addClass("vipstate");
                $(".js-vip-open").hide();
            } else {
                $(".userOperateBtn.goVip").removeClass("hide").siblings(".userOperateBtn").addClass("hide");
                $(".user-state .info-des").text("你还不是VIP");
            }
        },
        signDialog: function() {
            $(".sign-btn").click(function() {
                $("#dialog-box").dialog({
                    html: $("#Sign-dialog").html()
                }).open();
            });
        },
        getBannerbyPosition: function() {
            // 
            $.ajax({
                url: api.recommend.recommendConfigInfo,
                type: "POST",
                data: JSON.stringify([ "PC_M_H_xfbanner" ]),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function(res) {
                    if (res.code == "0") {
                        console.log("getBannerbyPosition:", res);
                        var list = method.handleRecommendData(res.data[0].list);
                        var _bannerTemplate = template.compile(bannerTemplate)({
                            topBanner: list,
                            className: "authentication-container",
                            hasDeleteIcon: false
                        });
                        $(".authentication-banner").html(_bannerTemplate);
                        var mySwiper = new Swiper(".authentication-container", {
                            direction: "horizontal",
                            loop: true,
                            loop: list.length > 1 ? true : false,
                            autoplay: 3e3
                        });
                    }
                }
            });
        }
    };
    indexObject.initial();
    require("../common/baidu-statistics-debug").initBaiduStatistics("adb0f091db00ed439bf000f2c5cbaee7");
    require("../common/baidu-statistics-debug").initBaiduStatistics("17cdd3f409f282dc0eeb3785fcf78a66");
});