define("dist/index/init", [ "swiper", "../common/template/swiper_tmp.html", "../application/suspension", "../application/method", "../application/checkLogin", "../application/api", "../application/urlConfig", "../application/login", "../common/bilog", "base64", "../cmd-lib/util", "../report/config", "../cmd-lib/myDialog", "../cmd-lib/toast", "../application/iframe/iframe-messenger", "../application/iframe/messenger", "../common/baidu-statistics", "../application/app", "../application/element", "../application/template", "../application/extend", "../application/effect", "../common/loginType", "../application/helper", "../application/single-login", "../common/slider", "./template/saiTemplate.html" ], function(require, exports, moudle) {
    require("swiper");
    var bannerTemplate = require("../common/template/swiper_tmp.html");
    require("../application/suspension");
    var slider = require("../common/slider");
    //轮播插件
    var login = require("../application/checkLogin");
    var utils = require("../cmd-lib/util");
    var method = require("../application/method");
    var login = require("../application/checkLogin");
    var api = require("../application/api");
    var headTip = require("./template/saiTemplate.html");
    var clickEvent = require("../common/bilog").clickEvent;
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
            if (data.isWxAuth) {
                $(".sign-btn").removeClass(".hide");
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
    require("../common/baidu-statistics").initBaiduStatistics("adb0f091db00ed439bf000f2c5cbaee7");
    require("../common/baidu-statistics").initBaiduStatistics("17cdd3f409f282dc0eeb3785fcf78a66");
});

define("dist/common/template/swiper_tmp.html", [], '<!--轮播图-->\n    <div class="swiper-container {{className}}">\n         <div class="swiper-wrapper">\n         {{each topBanner}}\n            <div class="swiper-slide" >\n               <a href={{ topBanner[$index].linkUrl}} target="_blank">\n                 <img class="swiper-slide-img" src={{ topBanner[$index].imagUrl}}>\n               </a>\n            </div>\n            {{/each}} \n         </div>\n         {{if hasDeleteIcon}}\n        <span class="icon close-swiper"><span>\n        {{/if}}\n         \n    </div>            \n');

define("dist/application/suspension", [ "dist/application/method", "dist/application/checkLogin", "dist/application/api", "dist/application/urlConfig", "dist/application/login", "dist/common/bilog", "base64", "dist/cmd-lib/util", "dist/report/config", "dist/cmd-lib/myDialog", "dist/cmd-lib/toast", "dist/application/iframe/iframe-messenger", "dist/application/iframe/messenger", "dist/common/baidu-statistics", "dist/application/app", "dist/application/element", "dist/application/template", "dist/application/extend", "dist/application/effect", "dist/common/loginType", "dist/application/helper", "dist/application/single-login" ], function(require, exports, module) {
    //var $ = require("$");
    var method = require("dist/application/method");
    var login = require("dist/application/checkLogin");
    // 右侧滚动
    var app = require("dist/application/app");
    var api = require("dist/application/api");
    var clickEvent = require("dist/common/bilog").clickEvent;
    scrollMenu();
    function scrollMenu() {
        //右侧悬浮 js
        var $fixBtn = $(".fixed-op").find(".J_menu");
        var $fixFull = $(".fixed-right-full");
        var $anWrap = $fixFull.find(".fixed-detail-wrap");
        function fixAn(start, index, $this) {
            index = index || 0;
            if (start && index === 1) {
                // index === 1 || index === 2
                if (method.getCookie("cuk")) {
                    rightSlideShow(index);
                    $anWrap.animate({
                        right: "61px"
                    }, 500);
                } else {
                    login.notifyLoginInterface(function(data) {
                        refreshDomTree($anWrap, index, data);
                    });
                }
            } else {
                $anWrap.animate({
                    right: "-307px"
                }, 200);
            }
            if (start && index === 0) {
                if (method.getCookie("cuk")) {
                    window.open("/node/rights/vip.html", "target");
                } else {
                    window.open("/node/rights/vip.html", "target");
                }
            } else if (index === 1) {
                $(".mui-user-wrap").css("visibility", "hidden");
                $(".mui-sel-wrap").css("visibility", "visible");
            } else if (index === 2) {
                $(".mui-user-wrap").css("visibility", "hidden");
                $(".mui-sel-wrap").css("visibility", "hidden");
                method.compatibleIESkip("/node/upload.html", true);
            } else if (index === 4 || index === 6) {
                $anWrap.animate({
                    right: "-307px"
                }, 200);
                if (index == 6) {
                    method.compatibleIESkip("https://mp.weixin.qq.com/s/8T4jhpKm-OKmTy-g02yO-Q", true);
                }
            }
        }
        $(".btn-detail-back").on("click", function() {
            fixAn(false, $(this));
            $fixBtn.removeClass("active");
        });
        $(document).on("click", function() {
            var $this = $(this);
            fixAn(false, $this);
            $fixBtn.removeClass("active");
        });
        // 开通vip
        $fixFull.on("click", ".js-buy-open", function() {
            method.compatibleIESkip("/pay/vip.html", true);
        });
        $(".op-menu-wrap").click(function(e) {
            e.stopPropagation();
        });
        $fixBtn.on("click", function() {
            var index = $(this).index();
            if ($(this).attr("bilogContent")) {
                // 侧边栏数据上报
                clickEvent($(this));
            }
            if ($(this).hasClass("active")) {
                $(this).removeClass("active");
                fixAn(false, $(this));
            } else {
                $(this).addClass("active").siblings().removeClass("active");
                fixAn(true, index, $(this));
            }
        });
        $(window).bind("resize ready", resizeWindow);
        function resizeWindow(e) {
            var newWindowHeight = $(window).height();
            if (newWindowHeight >= 920) {
                $fixFull.removeClass("fixed-min-height");
            } else {
                $fixFull.addClass("fixed-min-height");
            }
        }
    }
    function refreshDomTree($anWrap, index, data) {
        var $unLogin = $("#unLogin"), $hasLogin = $("#haveLogin"), $top_user_more = $(".top-user-more"), $icon_iShare_text = $(".icon-iShare-text"), $btn_user_more = $(".btn-user-more"), $vip_status = $(".vip-status");
        $icon_iShare_text.html(data.isVip == "1" ? "续费VIP" : "开通VIP");
        $btn_user_more.text(data.isVip == "1" ? "续费" : "开通");
        if (data.isVip == "0") {
            $(".open-vip").show().siblings("a").hide();
        } else {
            $(".xf-open-vip").show().siblings("a").hide();
        }
        var $target = null;
        if (data.isVip == "1") {
            $target = $vip_status.find('p[data-type="2"]');
            $target.find(".expire_time").html(data.expireTime);
            $target.show().siblings().hide();
        } else if (data.isVip == "1" && data.userType == "2") {
            $target = $vip_status.find('p[data-type="3"]');
            $target.show().siblings().hide();
        }
        $unLogin.hide();
        $hasLogin.find(".icon-detail").html(data.nickName);
        $hasLogin.find("img").attr("src", data.photoPicURL);
        $top_user_more.find("img").attr("src", data.photoPicURL);
        $top_user_more.find("#userName").html(data.nickName);
        $hasLogin.show();
        //右侧导航栏.
        /* ==>头像,昵称 是否会员文案提示.*/
        $(".user-avatar img").attr("src", data.photoPicURL);
        $(".name-wrap .name-text").html(data.nickName);
        if (data.isVip == "1") {
            var txt = "您的VIP将于" + data.expireTime + "到期,剩余" + data.privilege + "次下载特权";
            $(".detail-right-normal-wel").html(txt);
            $(".detail-right-vip-wel").html("会员尊享权益");
            $(".btn-mui").hide();
            $("#memProfit").html("VIP权益");
        } else {
            $(".mui-privilege-list li").removeClass("hide");
        }
        rightSlideShow(index);
        // 发现有调用传入$anWrap 为 null ，因此作此判断
        if ($anWrap) {
            $anWrap.animate({
                right: "61px"
            }, 500);
        }
    }
    function rightSlideShow(index) {
        if (index === 1) {
            accessList();
        } else if (index === 2) {
            myCollect();
        }
    }
    /**
     * 我看过的
     */
    function accessList() {
        getFileBrowsePage();
    }
    //新的我的收藏列表
    function myCollect() {
        // 右侧栏的我的收藏下架
        var params = {
            pageNumber: 1,
            pageSize: 20,
            sidx: 0,
            order: -1
        };
        $.ajax(api.user.newCollect, {
            type: "get",
            async: false,
            data: params,
            dataType: "json"
        }).done(function(res) {
            if (res.code == 0) {
                collectRender(res.data.rows);
            }
        }).fail(function(e) {
            console.log("error===" + e);
        });
    }
    function getFileBrowsePage() {
        // 查询个人收藏列表
        $.ajax({
            url: api.user.getFileBrowsePage,
            type: "POST",
            data: JSON.stringify({
                currentPage: 1,
                pageSize: 20
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function(res) {
                if (res.code == "0") {
                    console.log("getUserFileList:", res);
                    var list = res.data && res.data.rows || [];
                    var $seenRecord = $("#seenRecord"), arr = [];
                    if (list && list.length) {
                        list = list.slice(0, 20);
                        for (var k = 0; k < list.length; k++) {
                            var item = list[k];
                            var $li = '<li><i class="ico-data ico-' + item.format + '"></i><a target="_blank" href="/f/' + item.fileid + '.html">' + item.name + "</a></li>";
                            arr.push($li);
                        }
                        $seenRecord.html(arr.join(""));
                    } else {
                        $seenRecord.hide().siblings(".mui-data-null").show();
                    }
                } else {
                    var $seenRecord = $("#seenRecord");
                    $seenRecord.hide().siblings(".mui-data-null").show();
                    console.log(res.message);
                }
            },
            error: function(error) {
                console.log("getUserFileList:", error);
            }
        });
    }
    /**
     * 意见反馈
     * @param list
     */
    $(".op-feedback").on("click", function() {
        var curr = window.location.href;
        method.compatibleIESkip("/node/feedback/feedback.html?url=" + encodeURIComponent(curr), true);
    });
    $("#go-back-top").on("click", function() {
        $("body,html").animate({
            scrollTop: 0
        }, 200);
    });
    try {
        //引入美洽客服
        (function(a, b, c, d, e, j, s) {
            a[d] = a[d] || function() {
                (a[d].a = a[d].a || []).push(arguments);
            };
            j = b.createElement(c), s = b.getElementsByTagName(c)[0];
            j.async = true;
            j.charset = "UTF-8";
            j.src = "https://static.meiqia.com/widget/loader.js";
            s.parentNode.insertBefore(j, s);
        })(window, document, "script", "_MEIQIA");
        _MEIQIA("entId", "da3025cba774985d7ac6fa734b92e729");
        _MEIQIA("manualInit");
    } catch (e) {}
    // 联系客服
    $(".btn-mui-contact").on("click", function() {
        _MEIQIA("init");
        // 初始化成功后调用美洽 showPanel
        _MEIQIA("allSet", function() {
            _MEIQIA("showPanel");
        });
    });
    function collectRender(list) {
        var $myCollect = $("#myCollect"), arr = [];
        if (!list || !list.length) {
            $myCollect.siblings(".mui-data-null").removeClass("hide");
        } else {
            var subList = list.slice(0, 20);
            for (var k = 0; k < subList.length; k++) {
                var item = subList[k];
                var $li = '<li><i class="ico-data ico-' + item.format + '"></i><a target="_blank" href="/f/' + item.fileId + '.html">' + item.title + "</a></li>";
                arr.push($li);
            }
            $myCollect.html(arr.join(""));
            if (list.length > 20) {
                $myCollect.siblings(".btn-mui-fix").removeClass("hide");
            }
        }
    }
    module.exports = {
        usermsg: function(data) {
            //右侧导航栏.
            /* ==>头像,昵称 是否会员文案提示.*/
            $(".user-avatar img").attr("src", data.photoPicURL);
            $(".name-wrap .name-text").html(data.nickName);
            if (data.isVip == "1") {
                var txt = "您的VIP将于" + data.expireTime + "到期,剩余" + data.privilege + "次下载特权";
                $(".detail-right-normal-wel").html(txt);
                $(".detail-right-vip-wel").html("会员尊享权益");
                $(".btn-mui").hide();
                $("#memProfit").html("VIP权益");
            } else {
                $(".mui-privilege-list li").removeClass("hide");
            }
        }
    };
});

define("dist/application/method", [], function(require, exports, module) {
    return {
        // 常量映射表
        keyMap: {
            // 访问详情页 localStorage
            ishare_detail_access: "ISHARE_DETAIL_ACCESS",
            ishare_office_detail_access: "ISHARE_OFFICE_DETAIL_ACCESS"
        },
        async: function(url, callback, msg, method, data) {
            $.ajax(url, {
                type: method || "post",
                data: data,
                async: false,
                dataType: "json",
                headers: {
                    "cache-control": "no-cache",
                    Pragma: "no-cache",
                    Authrization: this.getCookie("cuk")
                }
            }).done(function(data) {
                callback && callback(data);
            }).fail(function(e) {
                console.log("error===" + msg);
            });
        },
        get: function(u, c, m) {
            $.ajaxSetup({
                cache: false
            });
            this.async(u, c, m, "get");
        },
        post: function(u, c, m, g, d) {
            this.async(u, c, m, g, d);
        },
        postd: function(u, c, d) {
            this.async(u, c, false, false, d);
        },
        //随机数
        random: function(min, max) {
            return Math.floor(Math.random() * (max - min)) + min;
        },
        // 写cookie（过期时间）
        setCookieWithExpPath: function(name, value, timeOut, path) {
            var now = new Date();
            now.setTime(now.getTime() + timeOut);
            document.cookie = name + "=" + escape(value) + ";path=" + path + ";expires=" + now.toGMTString();
        },
        //提供360结算方法
        setCookieWithExp: function(name, value, timeOut, path) {
            var exp = new Date();
            exp.setTime(exp.getTime() + timeOut);
            if (path) {
                document.cookie = name + "=" + escape(value) + ";path=" + path + ";expires=" + exp.toGMTString();
            } else {
                document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
            }
        },
        //读 cookie
        getCookie: function(name) {
            var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
            if (arr !== null) {
                return unescape(arr[2]);
            }
            return null;
        },
        //删除cookie
        delCookie: function(name, path, domain) {
            var now = new Date();
            now.setTime(now.getTime() - 1);
            var cval = this.getCookie(name);
            if (cval != null) {
                if (path && domain) {
                    document.cookie = name + "= '' " + ";domain=" + domain + ";expires=" + now.toGMTString() + ";path=" + path;
                } else if (path) {
                    document.cookie = name + "= '' " + ";expires=" + now.toGMTString() + ";path=" + path;
                } else {
                    document.cookie = name + "=" + cval + ";expires=" + now.toGMTString();
                }
            }
        },
        //获取 url 参数值
        getQueryString: function(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) {
                return unescape(r[2]);
            }
            return null;
        },
        url2Obj: function(url) {
            var obj = {};
            var arr1 = url.split("?");
            var arr2 = arr1[1].split("&");
            for (var i = 0; i < arr2.length; i++) {
                var res = arr2[i].split("=");
                obj[res[0]] = res[1];
            }
            return obj;
        },
        //获取url中参数的值
        getParam: function(name) {
            name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
            var regexS = "[\\?&]" + name + "=([^&#]*)";
            var regex = new RegExp(regexS);
            var results = regex.exec(window.location.href);
            if (results == null) {
                return "";
            }
            return decodeURIComponent(results[1].replace(/\+/g, " "));
        },
        // 获取本地 localStorage 数据
        getLocalData: function(key) {
            try {
                if (localStorage && localStorage.getItem) {
                    var val = localStorage.getItem(key);
                    return val === null ? null : JSON.parse(val);
                } else {
                    console.log("浏览器不支持html localStorage getItem");
                    return null;
                }
            } catch (e) {
                return null;
            }
        },
        // 获取本地 localStorage 数据
        setLocalData: function(key, val) {
            if (localStorage && localStorage.setItem) {
                localStorage.removeItem(key);
                localStorage.setItem(key, JSON.stringify(val));
            } else {
                console.log("浏览器不支持html localStorage setItem");
            }
        },
        // 浏览器环境判断
        browserType: function() {
            var userAgent = navigator.userAgent;
            //取得浏览器的userAgent字符串
            var isOpera = userAgent.indexOf("Opera") > -1;
            if (isOpera) {
                //判断是否Opera浏览器
                return "Opera";
            }
            if (userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera) {
                //判断是否IE浏览器
                return "IE";
            }
            if (userAgent.indexOf("Edge") > -1) {
                //判断是否IE的Edge浏览器
                return "Edge";
            }
            if (userAgent.indexOf("Firefox") > -1) {
                //判断是否Firefox浏览器
                return "Firefox";
            }
            if (userAgent.indexOf("Safari") > -1 && userAgent.indexOf("Chrome") === -1) {
                //判断是否Safari浏览器
                return "Safari";
            }
            if (userAgent.indexOf("Chrome") > -1 && userAgent.indexOf("Safari") > -1) {
                //判断Chrome浏览器
                return "Chrome";
            }
        },
        //判断IE9以下浏览器
        validateIE9: function() {
            return !!($.browser.msie && ($.browser.version === "9.0" || $.browser.version === "8.0" || $.browser.version === "7.0" || $.browser.version === "6.0"));
        },
        // 计算两个2个时间相差的天数
        compareTime: function(startTime, endTime) {
            if (!startTime || !endTime) return "";
            return Math.abs((endTime - startTime) / 1e3 / 60 / 60 / 24);
        },
        // 修改参数 有参数则修改 无则加
        changeURLPar: function(url, arg, arg_val) {
            var pattern = arg + "=([^&]*)";
            var replaceText = arg + "=" + arg_val;
            if (url.match(pattern)) {
                var tmp = "/(" + arg + "=)([^&]*)/gi";
                tmp = url.replace(eval(tmp), replaceText);
                return tmp;
            } else {
                if (url.match("[?]")) {
                    return url + "&" + replaceText;
                } else {
                    return url + "?" + replaceText;
                }
            }
        },
        //获取url全部参数
        getUrlAllParams: function(urlStr) {
            if (typeof urlStr == "undefined") {
                var url = decodeURI(location.search);
            } else {
                var url = "?" + urlStr.split("?")[1];
            }
            var theRequest = new Object();
            if (url.indexOf("?") != -1) {
                var str = url.substr(1);
                var strs = str.split("&");
                for (var i = 0; i < strs.length; i++) {
                    theRequest[strs[i].split("=")[0]] = decodeURI(strs[i].split("=")[1]);
                }
            }
            return theRequest;
        },
        //获取 url 参数值
        getQueryString: function(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) {
                return unescape(r[2]);
            }
            return null;
        },
        /**
         * 兼容ie document.referrer的页面跳转 替代 window.location.href   window.open
         * @param url
         * @param flag 是否新窗口打开
         */
        compatibleIESkip: function(url, flag) {
            var referLink = document.createElement("a");
            referLink.href = url;
            referLink.style.display = "none";
            if (flag) {
                referLink.target = "_blank";
            }
            document.body.appendChild(referLink);
            referLink.click();
        },
        testEmail: function(val) {
            var reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
            if (reg.test(val)) {
                return true;
            } else {
                return false;
            }
        },
        testPhone: function(val) {
            if (/^1(3|4|5|6|7|8|9)\d{9}$/.test(val)) {
                return true;
            } else {
                return false;
            }
        },
        handleRecommendData: function(list) {
            var arr = [];
            $(list).each(function(index, item) {
                var temp = {};
                if (item.type == 1) {
                    // 资料
                    // temp = Object.assign({},item,{linkUrl:`/f/${item.tprId}.html`})
                    item.linkUrl = "/f/" + item.tprId + ".html";
                    temp = item;
                }
                if (item.type == 2) {
                    // 链接
                    temp = item;
                }
                if (item.type == 3) {
                    // 专题页
                    // temp = Object.assign({},item,{linkUrl:`/node/s/${item.tprId}.html`})
                    item.linkUrl = "/node/s/" + item.tprId + ".html";
                    temp = item;
                }
                arr.push(temp);
            });
            console.log(arr);
            return arr;
        },
        formatDate: function(fmt) {
            var o = {
                "M+": this.getMonth() + 1,
                //月份
                "d+": this.getDate(),
                //日
                "h+": this.getHours(),
                //小时
                "m+": this.getMinutes(),
                //分
                "s+": this.getSeconds(),
                //秒
                "q+": Math.floor((this.getMonth() + 3) / 3),
                //季度
                S: this.getMilliseconds()
            };
            if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
            for (var k in o) if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
            return fmt;
        },
        getReferrer: function() {
            var referrer = document.referrer;
            var res = "";
            if (/https?\:\/\/[^\s]*so.com.*$/g.test(referrer)) {
                res = "360";
            } else if (/https?\:\/\/[^\s]*baidu.com.*$/g.test(referrer)) {
                res = "baidu";
            } else if (/https?\:\/\/[^\s]*sogou.com.*$/g.test(referrer)) {
                res = "sogou";
            } else if (/https?\:\/\/[^\s]*sm.cn.*$/g.test(referrer)) {
                res = "sm";
            }
            return res;
        },
        judgeSource: function(ishareBilog) {
            if (!ishareBilog) {
                ishareBilog = {};
            }
            ishareBilog.searchEngine = "";
            var from = "";
            from = utils.getQueryVariable("from");
            if (!from) {
                from = sessionStorage.getItem("webWxFrom") || utils.getCookie("webWxFrom");
            }
            if (from) {
                ishareBilog.source = from;
                sessionStorage.setItem("webWxFrom", from);
                sessionStorage.removeItem("webReferrer");
            } else {
                var referrer = sessionStorage.getItem("webReferrer") || utils.getCookie("webReferrer");
                if (!referrer) {
                    referrer = document.referrer;
                }
                if (referrer) {
                    sessionStorage.setItem("webReferrer", referrer);
                    sessionStorage.removeItem("webWxFrom");
                    referrer = referrer.toLowerCase();
                    //转为小写
                    var webSites = new Array("google.", "baidu.", "360.", "sogou.", "shenma.", "bing.");
                    var searchEngineArr = new Array("google", "baidu", "360", "sogou", "shenma", "bing");
                    for (var i = 0, l = webSites.length; i < l; i++) {
                        if (referrer.indexOf(webSites[i]) >= 0) {
                            ishareBilog.source = "searchEngine";
                            ishareBilog.searchEngine = searchEngineArr[i];
                        }
                    }
                }
                if (!referrer || !ishareBilog.source) {
                    if (utils.isWeChatBrow()) {
                        ishareBilog.source = "wechat";
                    } else {
                        ishareBilog.source = "outLink";
                    }
                }
            }
            return ishareBilog;
        },
        // 随机数
        randomString: function(len) {
            len = len || 4;
            var $chars = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678";
            /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
            var maxPos = $chars.length;
            var pwd = "";
            for (var i = 0; i < len; i++) {
                pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
            }
            return pwd;
        },
        // 登录状态保存 默认30天
        saveLoginToken: function(token, timeout) {
            timeout = timeout || 2592e6;
            this.setCookieWithExpPath("cuk", token, timeout, "/");
        },
        // 获取
        getLoginToken: function() {
            return this.getCookie("cuk") || "";
        },
        // 清除
        delLoginToken: function() {
            this.delCookie("cuk", "/");
        },
        // 登录id保存
        saveLoginSessionId: function(id) {
            // 当前时间
            var currentTime = new Date().getTime();
            var idArr = id.split("_");
            // 有效期截止时间戳
            var timeEnd = idArr[1] || 0;
            // 计算剩余有效时间
            var locTimeout = timeEnd - currentTime;
            this.setCookieWithExpPath("ish_jssid", id, locTimeout, "/");
        },
        // 获取
        getLoginSessionId: function() {
            return this.getCookie("ish_jssid") || "";
        }
    };
});

/**
 * 登录相关
 */
define("dist/application/checkLogin", [ "dist/application/api", "dist/application/urlConfig", "dist/application/method", "dist/application/login", "dist/common/bilog", "base64", "dist/cmd-lib/util", "dist/report/config", "dist/cmd-lib/myDialog", "dist/cmd-lib/toast", "dist/application/iframe/iframe-messenger", "dist/application/iframe/messenger", "dist/common/baidu-statistics" ], function(require, exports, module) {
    var api = require("dist/application/api");
    var method = require("dist/application/method");
    var api = require("dist/application/api");
    var showLoginDialog = require("dist/application/login").showLoginDialog;
    require("dist/common/baidu-statistics").initBaiduStatistics("17cdd3f409f282dc0eeb3785fcf78a66");
    var handleBaiduStatisticsPush = require("dist/common/baidu-statistics").handleBaiduStatisticsPush;
    var loginResult = require("dist/common/bilog").loginResult;
    module.exports = {
        getIds: function() {
            // 详情页
            console.log("生成详情页信息：" + window.pageConfig);
            var params = window.pageConfig && window.pageConfig.params ? window.pageConfig.params : null;
            var access = window.pageConfig && window.pageConfig.access ? window.pageConfig.access : null;
            var classArr = [];
            var clsId = params ? params.classid : "";
            var fid = access ? access.fileId || params.g_fileId || "" : "";
            // 类目页
            var classIds = params && params.classIds ? params.classIds : "";
            !clsId && (clsId = classIds);
            return {
                clsId: clsId,
                fid: fid
            };
        },
        /**
         * description  唤醒登录界面
         * @param callback 回调函数
         */
        notifyLoginInterface: function(callback) {
            var _self = this;
            if (!method.getCookie("cuk")) {
                var ptype = window.pageConfig && window.pageConfig.page ? window.pageConfig.page.ptype || "index" : "index";
                var clsId = this.getIds().clsId;
                var fid = this.getIds().fid;
                showLoginDialog({
                    clsId: clsId,
                    fid: fid
                }, function() {
                    console.log("loginCallback");
                    _self.getLoginData(callback, "isFirstLogin");
                });
            }
        },
        listenLoginStatus: function(callback) {
            var _self = this;
            $.loginPop("login_wx_code", {
                terminal: "PC",
                businessSys: "ishare",
                domain: document.domain,
                ptype: "ishare",
                popup: "hidden",
                clsId: this.getIds().clsId,
                fid: this.getIds().fid
            }, function() {
                _self.getLoginData(callback);
            });
        },
        /**
         * description  优惠券提醒 查询用户发券资格-pc
         * @param callback 回调函数
         */
        getUserData: function(callback) {
            if (method.getCookie("cuk")) {
                method.get(api.coupon.querySeniority, function(res) {
                    if (res && res.code == 0) {
                        callback(res.data);
                    }
                }, "");
            }
        },
        /**
         * 获取用户信息
         * @param callback 回调函数
         */
        getLoginData: function(callback, isFirstLogin) {
            var _self = this;
            try {
                method.get("/node/api/getUserInfo", function(res) {
                    // api.user.login
                    if (res.code == 0 && res.data) {
                        loginResult("", "loginResult", {
                            loginType: window.loginType && window.loginType.type,
                            phone: res.data.mobile,
                            loginResult: "1"
                        });
                        handleBaiduStatisticsPush("loginResult", {
                            loginType: window.loginType && window.loginType.type,
                            phone: res.data.mobile,
                            userid: res.data.userId,
                            loginResult: "1"
                        });
                        if (isFirstLogin) {
                            window.location.reload();
                        }
                        if (callback && typeof callback == "function") {
                            callback(res.data);
                            try {
                                window.pageConfig.params.isVip = res.data.isVip;
                                window.pageConfig.page.uid = res.data.userId;
                            } catch (err) {}
                        }
                        try {
                            var userInfo = {
                                uid: res.data.userId,
                                isVip: res.data.isVip,
                                tel: res.data.mobile
                            };
                            method.setCookieWithExpPath("ui", JSON.stringify(userInfo), 30 * 60 * 1e3, "/");
                        } catch (e) {}
                    } else {
                        loginResult("", "loginResult", {
                            loginType: window.loginType && window.loginType.type,
                            phone: "",
                            userid: "",
                            loginResult: "0"
                        });
                        handleBaiduStatisticsPush("loginResult", {
                            loginType: window.loginType && window.loginType.type,
                            phone: "",
                            userid: res.data.userId,
                            loginResult: "0"
                        });
                        _self.ishareLogout();
                    }
                });
            } catch (e) {
                console.log(e);
            }
        },
        /**
         * 退出
         */
        ishareLogout: function() {
            var that = this;
            $.ajax({
                url: api.user.loginOut,
                type: "GET",
                headers: {
                    "cache-control": "no-cache",
                    Pragma: "no-cache",
                    jsId: method.getLoginSessionId()
                },
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                cache: false,
                data: null,
                success: function(res) {
                    console.log("loginOut:", res);
                    if (res.code == 0) {
                        window.location.reload();
                    } else {
                        $.toast({
                            text: res.message,
                            delay: 3e3
                        });
                    }
                }
            });
            // 删域名cookie
            method.delCookie("cuk", "/", ".sina.com.cn");
            method.delCookie("cuk", "/", ".iask.com.cn");
            method.delCookie("cuk", "/", ".iask.com");
            method.delCookie("cuk", "/");
            method.delCookie("sid", "/", ".iask.sina.com.cn");
            method.delCookie("sid", "/", ".iask.com.cn");
            method.delCookie("sid", "/", ".sina.com.cn");
            method.delCookie("sid", "/", ".ishare.iask.com.cn");
            method.delCookie("sid", "/", ".office.iask.com");
            method.delCookie("sid_ishare", "/", ".iask.sina.com.cn");
            method.delCookie("sid_ishare", "/", ".iask.com.cn");
            method.delCookie("sid_ishare", "/", ".sina.com.cn");
            method.delCookie("sid_ishare", "/", ".ishare.iask.com.cn");
            // 删除第一次登录标识
            method.delCookie("_1st_l", "/");
            method.delCookie("ui", "/");
        }
    };
});

/**
 * 前端交互性API
 **/
define("dist/application/api", [ "dist/application/urlConfig" ], function(require, exports, module) {
    var urlConfig = require("dist/application/urlConfig");
    var router = urlConfig.ajaxUrl + "/gateway/pc";
    var gateway = urlConfig.ajaxUrl + "/gateway";
    module.exports = {
        // 用户相关
        user: {
            // 登录
            // 检测单点登录状态
            dictionaryData: gateway + "/market/dictionaryData/$code",
            checkSso: gateway + "/cas/login/checkSso",
            loginByPsodOrVerCode: gateway + "/cas/login/authorize",
            // 通过密码和验证码登录
            getLoginQrcode: gateway + "/cas/login/qrcode",
            // 生成公众号登录二维码
            loginByWeChat: gateway + "/cas/login/gzhScan",
            // 公众号扫码登录
            getUserInfo: "/node/api/getUserInfo",
            // node聚合的接口获取用户信息
            thirdLoginRedirect: gateway + "/cas/login/redirect",
            // 根据第三方授权的code,获取 access_token
            loginOut: gateway + "/cas/login/logout",
            // 我的收藏
            newCollect: gateway + "/content/collect/getUserFileList",
            addFeedback: gateway + "/feedback/addFeedback",
            //新增反馈
            getFeedbackType: gateway + "/feedback/getFeedbackType",
            //获取反馈问题类型
            sendSms: gateway + "/cas/sms/sendSms",
            // 发送短信验证码
            queryBindInfo: gateway + "/cas/user/queryBindInfo",
            // 查询用户绑定信息
            thirdCodelogin: gateway + "/cas/login/thirdCode",
            // /cas/login/thirdCode 第三方授权
            userBindMobile: gateway + "/cas/user/bindMobile",
            // 绑定手机号接口
            checkIdentity: gateway + "/cas/sms/checkIdentity",
            // 身份验证账号
            userBindThird: gateway + "/cas/user/bindThird",
            // 绑定第三方账号接口
            untyingThird: gateway + "/cas/user/untyingThird",
            // 解绑第三方
            setUpPassword: gateway + "/cas/user/setUpPassword",
            // 设置密码
            getUserCentreInfo: gateway + "/user/getUserCentreInfo",
            editUser: gateway + "/user/editUser",
            // 编辑用户信息
            getFileBrowsePage: gateway + "/content/fileBrowse/getFileBrowsePage",
            //分页获取用户的历史浏览记录
            getDownloadRecordList: gateway + "/content/getDownloadRecordList",
            //用户下载记录接口
            getUserFileList: gateway + "/content/collect/getUserFileList",
            // 查询个人收藏列表
            getMyUploadPage: gateway + "/content/getMyUploadPage",
            // 分页查询我的上传(公开资料，付费资料，私有资料，审核中，未通过)
            getOtherUser: gateway + "/user/getOthersCentreInfo",
            //他人信息主页 
            getSearchList: gateway + "/search/content/byCondition",
            //他人信息主页 热门与最新
            getVisitorId: gateway + "/user/getVisitorId"
        },
        normalFileDetail: {
            // 文件预下载
            filePreDownLoad: gateway + "/content/getPreFileDownUrl",
            // 下载获取地址接口
            getFileDownLoadUrl: gateway + "/content/getFileDownUrl",
            // 文件打分
            // 文件预览判断接口
            getPrePageInfo: gateway + "/content/file/getPrePageInfo",
            sendmail: gateway + "/content/sendmail/findFile",
            getFileDetailNoTdk: gateway + "/content/getFileDetailNoTdk"
        },
        officeFileDetail: {},
        search: {
            specialTopic: gateway + "/search/specialTopic/lisPage"
        },
        sms: {
            // 登录用户发送邮箱
            sendCorpusDownloadMail: gateway + "/content/fileSendEmail/sendCorpusDownloadMail",
            fileSendEmailVisitor: gateway + "/content/fileSendEmail/visitor"
        },
        pay: {
            // 购买成功后,在页面自动下载文档
            // 绑定订单
            bindUser: gateway + "/order/bind/loginUser",
            scanOrderInfo: gateway + "/order/scan/orderInfo",
            getBuyAutoRenewList: gateway + "/order/buy/autoRenewList",
            cancelAutoRenew: gateway + "/order/cancel/autoRenew/"
        },
        coupon: {
            rightsSaleVouchers: gateway + "/rights/sale/vouchers",
            rightsSaleQueryPersonal: gateway + "/rights/sale/queryPersonal",
            querySeniority: gateway + "/rights/sale/querySeniority",
            queryUsing: gateway + "/rights/sale/queryUsing",
            getMemberPointRecord: gateway + "/rights/vip/getMemberPointRecord",
            getBuyRecord: gateway + "/rights/vip/getBuyRecord",
            getTask: gateway + "/rights/task/get",
            receiveTask: gateway + "/rights/task/receive"
        },
        order: {
            reportOrderError: gateway + "/order/message/save",
            bindOrderByOrderNo: gateway + "/order/bind/byOrderNo",
            unloginOrderDown: router + "/order/unloginOrderDown",
            createOrderInfo: gateway + "/order/create/orderInfo",
            rightsVipGetUserMember: gateway + "/rights/vip/getUserMember",
            getOrderStatus: gateway + "/order/get/orderStatus",
            queryOrderlistByCondition: gateway + "/order/query/listByCondition",
            getOrderInfo: gateway + "/order/get/orderInfo"
        },
        getHotSearch: gateway + "/cms/search/content/hotWords",
        special: {
            fileSaveOrupdate: gateway + "/comment/zan/fileSaveOrupdate",
            // 点赞
            getCollectState: gateway + "/comment/zc/getUserFileZcState",
            //获取收藏状态
            setCollect: gateway + "/content/collect/file"
        },
        upload: {
            getWebAllFileCategory: gateway + "/content/fileCategory/getWebAll",
            createFolder: gateway + "/content/saveUserFolder",
            // 获取所有分类
            getFolder: gateway + "/content/getUserFolders",
            // 获取所有分类
            saveUploadFile: gateway + "/content/webUploadFile",
            picUploadCatalog: "/ishare-upload/picUploadCatalog",
            fileUpload: "/ishare-upload/fileUpload",
            batchDeleteUserFile: gateway + "/content/batchDeleteUserFile"
        },
        recommend: {
            recommendConfigInfo: gateway + "/recommend/config/info",
            recommendConfigRuleInfo: gateway + "/recommend/config/ruleInfo"
        },
        reportBrowse: {
            fileBrowseReportBrowse: gateway + "/content/fileBrowse/reportBrowse"
        },
        mywallet: {
            getAccountBalance: gateway + "/account/balance/getGrossIncome",
            // 账户余额信息
            withdrawal: gateway + "/account/with/apply",
            // 申请提现
            getWithdrawalRecord: gateway + "/account/withd/getPersonList",
            // 查询用户提现记录
            editFinanceAccount: gateway + "/account/finance/edit",
            // 编辑用户财务信息
            getFinanceAccountInfo: gateway + "/account/finance/getInfo",
            // 查询用户财务信息
            getPersonalAccountTax: gateway + "/account/tax/getPersonal",
            // 查询个人提现扣税结算
            getPersonalAccountTax: gateway + "/account/tax/getPersonal",
            // 查询个人提现扣税结算
            getMyWalletList: gateway + "/settlement/settle/getMyWalletList",
            // 我的钱包收入
            exportMyWalletDetail: gateway + "/settlement/settle/exportMyWalletDetail"
        },
        authentication: {
            getInstitutions: gateway + "/user/certification/getInstitutions",
            institutions: gateway + "/user/certification/institutions",
            getPersonalCertification: gateway + "/user/certification/getPersonal",
            personalCertification: gateway + "/user/certification/personal"
        },
        seo: {
            listContentInfos: gateway + "/seo/exposeContent/contentInfo/listContentInfos"
        },
        wechat: {
            getWechatSignature: gateway + "/message/wechat/info/getWechatSignature"
        },
        comment: {
            getLableList: gateway + "/comment/lable/dataList",
            addComment: gateway + "/comment/eval/add",
            getHotLableDataList: gateway + "/comment/lable/hotDataList",
            // 详情热评标签
            getFileComment: gateway + "/comment/eval/dataList",
            // 详情评论
            getPersoDataInfo: gateway + "/comment/eval/persoDataInfo"
        }
    };
});

// 网站url 配置
define("dist/application/urlConfig", [], function(require, exports, module) {
    var env = window.env;
    var urlConfig = {
        debug: {
            ajaxUrl: "",
            payUrl: "http://open-ishare.iask.com.cn",
            upload: "//upload-ishare.iask.com",
            appId: "wxb8af2801b7be4c37",
            bilogUrl: "https://dw.iask.com.cn/ishare/jsonp?data=",
            officeUrl: "http://office.iask.com",
            ejunshi: "http://dev.ejunshi.com"
        },
        local: {
            ajaxUrl: "",
            payUrl: "http://dev-open-ishare.iask.com.cn",
            upload: "//dev-upload-ishare.iask.com",
            appId: "wxb8af2801b7be4c37",
            bilogUrl: "https://dev-dw.iask.com.cn/ishare/jsonp?data=",
            officeUrl: "http://dev-office.iask.com",
            ejunshi: "http://dev.ejunshi.com"
        },
        dev: {
            ajaxUrl: "",
            payUrl: "http://dev-open-ishare.iask.com.cn",
            upload: "//dev-upload-ishare.iask.com",
            appId: "wxb8af2801b7be4c37",
            bilogUrl: "https://dev-dw.iask.com.cn/ishare/jsonp?data=",
            officeUrl: "http://dev-office.iask.com",
            ejunshi: "http://dev.ejunshi.com"
        },
        test: {
            ajaxUrl: "",
            payUrl: "http://test-open-ishare.iask.com.cn",
            upload: "//test-upload-ishare.iask.com",
            appId: "wxb8af2801b7be4c37",
            bilogUrl: "https://test-dw.iask.com.cn/ishare/jsonp?data=",
            officeUrl: "http://test-office.iask.com",
            ejunshi: "http://test.ejunshi.com"
        },
        pre: {
            ajaxUrl: "",
            payUrl: "http://pre-open-ishare.iask.com.cn",
            upload: "//pre-upload-ishare.iask.com",
            appId: "wxca8532521e94faf4",
            bilogUrl: "https://pre-dw.iask.com.cn/ishare/jsonp?data=",
            officeUrl: "http://pre-office.iask.com",
            ejunshi: "http://pre.ejunshi.com"
        },
        prod: {
            ajaxUrl: "",
            payUrl: "http://open-ishare.iask.com.cn",
            upload: "//upload-ishare.iask.com",
            appId: "wxca8532521e94faf4",
            bilogUrl: "https://dw.iask.com.cn/ishare/jsonp?data=",
            officeUrl: "http://office.iask.com",
            ejunshi: "http://ejunshi.com"
        }
    };
    return urlConfig[env];
});

define("dist/application/login", [ "dist/application/method", "dist/common/bilog", "base64", "dist/cmd-lib/util", "dist/report/config", "dist/application/urlConfig", "dist/cmd-lib/myDialog", "dist/cmd-lib/toast", "dist/application/iframe/iframe-messenger", "dist/application/iframe/messenger" ], function(require, exports, module) {
    var method = require("dist/application/method");
    var normalPageView = require("dist/common/bilog").normalPageView;
    require("dist/cmd-lib/myDialog");
    require("dist/cmd-lib/toast");
    var viewExposure = require("dist/common/bilog").viewExposure;
    var IframeMessenger = require("dist/application/iframe/iframe-messenger");
    var IframeMessengerList = {
        I_SHARE: new IframeMessenger({
            clientId: "MAIN_I_SHARE_LOGIN",
            projectName: "I_SHARE",
            ssoId: "I_SHARE_SSO_LOGIN"
        }),
        I_SHARE_T0URIST_PURCHASE: new IframeMessenger({
            clientId: "MAIN_I_SHARE_T0URIST_PURCHASE",
            projectName: "I_SHARE",
            ssoId: "I_SHARE_SSO_T0URIST_PURCHASE"
        }),
        I_SHARE_T0URIST_LOGIN: new IframeMessenger({
            clientId: "MAIN_I_SHARE_T0URIST_LOGIN",
            projectName: "I_SHARE",
            ssoId: "I_SHARE_SSO_T0URIST_LOGIN"
        })
    };
    function initIframeParams(successFun, iframeId, params) {
        // 操作需等iframe加载完毕
        var $iframe = $("#" + iframeId)[0];
        // 建立通信
        IframeMessengerList[iframeId].addTarget($iframe);
        // 发送初始数据
        $iframe.onload = function() {
            console.log("$iframe.onload:", IframeMessengerList[iframeId]);
            IframeMessengerList[iframeId].send({
                // 窗口打开
                isOpen: true,
                // 分类id
                cid: params.clsId,
                // 资料id
                fid: params.fid,
                jsId: params.jsId
            });
        };
        // 监听消息
        IframeMessengerList[iframeId].listen(function(res) {
            console.log("客户端监听-数据", res);
            if (res.userData) {
                loginInSuccess(res.userData, res.formData, successFun);
            } else {
                loginInFail(res.formData);
            }
        });
        // 关闭弹窗按钮
        $(".dialog-box .close-btn").on("click", function() {
            // 主动关闭弹窗-需通知登录中心
            IframeMessengerList[iframeId].send({
                isOpen: false
            });
            closeRewardPop();
        });
    }
    function showLoginDialog(params, callback) {
        viewExposure($(this), "login", "登录弹窗");
        var loginDialog = $("#login-dialog");
        normalPageView("loginResultPage");
        var jsId = method.getLoginSessionId();
        $.extend(params, {
            jsId: jsId
        });
        $("#dialog-box").dialog({
            html: loginDialog.html(),
            closeOnClickModal: false
        }).open(initIframeParams(callback, "I_SHARE", params));
    }
    function showTouristPurchaseDialog(params, callback) {
        // 游客购买的回调函数
        viewExposure($(this), "visitLogin", "游客支付弹窗");
        var jsId = method.getLoginSessionId();
        $.extend(params, {
            jsId: jsId
        });
        var touristPurchaseDialog = $("#tourist-purchase-dialog");
        $("#dialog-box").dialog({
            html: touristPurchaseDialog.html(),
            closeOnClickModal: false
        }).open(initIframeParams(callback, "I_SHARE_T0URIST_PURCHASE", params));
    }
    function showTouristLogin(params, callback) {
        var jsId = method.getLoginSessionId();
        $.extend(params, {
            jsId: jsId
        });
        var loginDom = $("#tourist-login").html();
        $(".carding-info-bottom.unloginStatus .qrWrap").html(loginDom);
        $("#tourist-login").remove();
        initIframeParams(callback, "I_SHARE_T0URIST_LOGIN", params);
    }
    function closeRewardPop() {
        $(".common-bgMask").hide();
        $(".detail-bg-mask").hide();
        $("#dialog-box").hide();
    }
    function loginInSuccess(userData, loginType, successFun) {
        window.loginType = loginType;
        // 获取用户信息时埋点需要
        method.setCookieWithExpPath("cuk", userData.access_token, userData.expires_in * 1e3, "/");
        method.setCookieWithExpPath("loginType", loginType, userData.expires_in * 1e3, "/");
        $.ajaxSetup({
            headers: {
                Authrization: method.getCookie("cuk")
            }
        });
        successFun && successFun();
        closeRewardPop();
    }
    function loginInFail(loginType) {
        closeRewardPop();
    }
    $("#dialog-box").on("click", ".close-btn", function(e) {
        closeRewardPop();
    });
    $(document).on("click", ".tourist-purchase-dialog .tabs .tab", function(e) {
        var dataType = $(this).attr("data-type");
        $(" .tourist-purchase-dialog .tabs .tab").removeClass("tab-active");
        $(this).addClass("tab-active");
        if (dataType == "tourist-purchase") {
            $(".tourist-purchase-dialog #I_SHARE_T0URIST_PURCHASE").hide();
            $(".tourist-purchase-dialog .tourist-purchase-content").show();
        }
        if (dataType == "login-purchase") {
            $(".tourist-purchase-dialog .tourist-purchase-content").hide();
            $(".tourist-purchase-dialog #I_SHARE_T0URIST_PURCHASE").show();
        }
    });
    return {
        showLoginDialog: showLoginDialog,
        showTouristPurchaseDialog: showTouristPurchaseDialog,
        showTouristLogin: showTouristLogin
    };
});

define("dist/common/bilog", [ "base64", "dist/cmd-lib/util", "dist/application/method", "dist/report/config", "dist/application/urlConfig" ], function(require, exports, module) {
    //var $ = require("$");
    var base64 = require("base64").Base64;
    var util = require("dist/cmd-lib/util");
    var method = require("dist/application/method");
    var config = require("dist/report/config");
    //参数配置
    var urlConfig = require("dist/application/urlConfig");
    var payTypeMapping = [ "", "free", "", "online", "vipOnly", "cost" ];
    //productType=1：免费文档，3 在线文档 4 vip特权文档 5 付费文档 6 私有文档
    var ip = method.getCookie("ip") || getIpAddress();
    var cid = method.getCookie("cid");
    if (!cid) {
        cid = new Date().getTime() + "" + Math.random();
        method.setCookieWithExp("cid", cid, 30 * 24 * 60 * 60 * 1e3, "/");
    }
    var time = new Date().getTime() + "" + Math.random();
    var min30 = 1e3 * 60 * 30;
    var sessionID = sessionStorage.getItem("sessionID") || "";
    function setSessionID() {
        sessionStorage.setItem("sessionID", time);
    }
    if (!sessionID) {
        setSessionID();
    }
    if (time - sessionID > min30) {
        setSessionID();
    }
    var initData = {
        eventType: "",
        //事件类型
        eventID: "",
        //事件编号
        eventName: "",
        //事件英文名字
        eventTime: String(new Date().getTime()),
        //事件触发时间戳（毫秒）
        reportTime: String(new Date().getTime()),
        //上报时间戳（毫秒）
        sdkVersion: "V1.0.3",
        //sdk版本
        terminalType: "0",
        //软件终端类型  0-PC，1-M，2-快应用，3-安卓APP，4-IOS APP，5-微信小程序，6-今日头条小程序，7-百度小程序
        loginStatus: method.getCookie("cuk") ? 1 : 0,
        //登录状态 0 未登录 1 登录
        visitID: method.getCookie("visitor_id") || "",
        //访客id
        userID: "",
        //用户ID
        sessionID: sessionStorage.getItem("sessionID") || cid || "",
        //会话ID
        productName: "ishare",
        //产品名称
        productCode: window.pageConfig && window.pageConfig.page && window.pageConfig.page.abTest ? "1" : "0",
        //产品代码    详情A B 测试  B端 productCode 1
        productVer: "V4.5.0",
        //产品版本
        pageID: "",
        //当前页面编号
        pageName: "",
        //当前页面的名称
        pageURL: "",
        //当前页面URL
        ip: ip || "",
        //IP地址
        resolution: document.documentElement.clientWidth + "*" + document.documentElement.clientHeight,
        //设备屏幕分辨率
        browserVer: util.getBrowserInfo(navigator.userAgent),
        //浏览器类型
        osType: getDeviceOs(),
        //操作系统类型
        //非必填
        moduleID: "",
        moduleName: "",
        appChannel: "",
        //应用下载渠道 仅针对APP移动端
        prePageID: "",
        //上一个页面编号
        prePageName: "",
        //上一个页面的名称
        prePageURL: document.referrer,
        //上一个页面URL
        domID: "",
        //当前触发DOM的编号 仅针对click
        domName: "",
        //当前触发DOM的名称 仅针对click
        domURL: "",
        //当前触发DOM的URL 仅针对click
        location: "",
        //位置（经纬度）仅针对移动端
        deviceID: "",
        //设备号 仅针对移动端
        deviceBrand: "",
        //移动设备品牌（厂商） 仅针对移动端
        deviceModel: "",
        //移动设备机型型号 仅针对移动端
        deviceLanguage: navigator.language,
        //设备语言
        mac: "",
        //MAC地址
        osVer: "",
        //操作系统版本 仅针对移动端
        networkType: "",
        //联网方式 仅针对移动端
        networkProvider: "",
        //网络运营商代码 仅针对移动端，非WIFI下传
        "var": {}
    };
    var userInfo = method.getCookie("ui");
    if (userInfo) {
        userInfo = JSON.parse(userInfo);
        initData.userID = userInfo.uid || "";
    }
    setPreInfo(document.referrer, initData);
    function setPreInfo(referrer, initData) {
        // 获取访客id
        initData.visitID = method.getCookie("visitor_id");
        if (new RegExp("/f/").test(referrer) && !new RegExp("referrer=").test(referrer) && !new RegExp("/f/down").test(referrer)) {
            var statuCode = $(".ip-page-statusCode");
            if (statuCode == "404") {
                initData.prePageID = "PC-M-404";
                initData.prePageName = "资料被删除";
            } else if (statuCode == "302") {
                initData.prePageID = "PC-M-FSM";
                initData.prePageName = "资料私有";
            } else {
                initData.prePageID = "PC-M-FD";
                initData.prePageName = "资料详情页";
            }
        } else if (new RegExp("/pay/payConfirm.html").test(referrer)) {
            initData.prePageID = "PC-M-PAY-F-L";
            initData.prePageName = "支付页-付费资料-列表页";
        } else if (new RegExp("/pay/payQr.html\\?type=2").test(referrer)) {
            initData.prePageID = "PC-M-PAY-F-QR";
            initData.prePageName = "支付页-付费资料-支付页";
        } else if (new RegExp("/pay/vip.html").test(referrer)) {
            initData.prePageID = "PC-M-PAY-VIP-L";
            initData.prePageName = "支付页-VIP-套餐列表页";
        } else if (new RegExp("/pay/payQr.html\\?type=0").test(referrer)) {
            initData.prePageID = "PC-M-PAY-VIP-QR";
            initData.prePageName = "支付页-VIP-支付页";
        } else if (new RegExp("/pay/privilege.html").test(referrer)) {
            initData.prePageID = "PC-M-PAY-PRI-L";
            initData.prePageName = "支付页-下载特权-套餐列表页";
        } else if (new RegExp("/pay/payQr.html\\?type=1").test(referrer)) {
            initData.prePageID = "PC-M-PAY-PRI-QR";
            initData.prePageName = "支付页-下载特权-支付页";
        } else if (new RegExp("/pay/success").test(referrer)) {
            initData.prePageID = "PC-M-PAY-SUC";
            initData.prePageName = "支付成功页";
        } else if (new RegExp("/pay/fail").test(referrer)) {
            initData.prePageID = "PC-M-PAY-FAIL";
            initData.prePageName = "支付失败页";
        } else if (new RegExp("/node/f/downsucc.html").test(referrer)) {
            if (/unloginFlag=1/.test(referrer)) {
                initData.prePageID = "PC-M-FDPAY-SUC";
                initData.prePageName = "免登购买成功页";
            } else {
                initData.prePageID = "PC-M-DOWN-SUC";
                initData.prePageName = "下载成功页";
            }
        } else if (new RegExp("/node/f/downfail.html").test(referrer)) {
            initData.prePageID = "PC-M-DOWN-FAIL";
            initData.prePageName = "下载失败页";
        } else if (new RegExp("/search/home.html").test(referrer)) {
            initData.prePageID = "PC-M-SR";
            initData.prePageName = "搜索关键词";
        } else if (new RegExp("/node/404.html").test(referrer)) {
            initData.prePageID = "PC-M-404";
            initData.prePageName = "404错误页";
        } else if (new RegExp("/node/503.html").test(referrer)) {
            initData.prePageID = "PC-M-500";
            initData.prePageName = "500错误页";
        } else if (new RegExp("/node/personalCenter/home.html").test(referrer)) {
            initData.prePageID = "PC-M-USER";
            initData.prePageName = "个人中心-首页";
        } else if (new RegExp("/node/personalCenter/myuploads.html").test(referrer)) {
            initData.prePageID = "PC-M-USER-MU";
            initData.prePageName = "个人中心-我的上传页";
        } else if (new RegExp("/node/personalCenter/mycollection.html").test(referrer)) {
            initData.prePageID = "PC-M-USER-CL";
            initData.prePageName = "个人中心-我的收藏页";
        } else if (new RegExp("/node/personalCenter/mydownloads.html").test(referrer)) {
            initData.prePageID = "PC-M-USER-MD";
            initData.prePageName = "个人中心-我的下载页";
        } else if (new RegExp("/node/personalCenter/vip.html").test(referrer)) {
            initData.prePageID = "PC-M-USER-VIP";
            initData.prePageName = "个人中心-我的VIP";
        } else if (new RegExp("/node/personalCenter/mycoupon.html").test(referrer)) {
            initData.prePageID = "PC-M-USER-MS";
            initData.prePageName = "个人中心-我的优惠券页";
        } else if (new RegExp("/node/personalCenter/accountsecurity.html").test(referrer)) {
            initData.prePageID = "PC-M-USER-ATM";
            initData.prePageName = "个人中心-账号与安全页";
        } else if (new RegExp("/node/personalCenter/personalinformation.html").test(referrer)) {
            initData.prePageID = "PC-M-USER-ATF";
            initData.prePageName = "个人中心-个人信息页";
        } else if (new RegExp("/node/personalCenter/myorder.html").test(referrer)) {
            initData.prePageID = "PC-M-USER-ORD";
            initData.prePageName = "个人中心-我的订单";
        }
    }
    //获取ip地址
    function getIpAddress() {
        $.getScript("//ipip.iask.cn/iplookup/search?format=js", function(response, status) {
            if (status === "success") {
                method.setCookieWithExp("ip", remote_ip_info["ip"], 5 * 60 * 1e3, "/");
                initData.ip = remote_ip_info["ip"];
            } else {
                console.error("ipip获取ip信息error");
            }
        });
    }
    //获得操作系统类型
    function getDeviceOs() {
        var name = "";
        if (window.navigator.userAgent.indexOf("Windows NT 10.0") != -1) {
            name = "Windows 10";
        } else if (window.navigator.userAgent.indexOf("Windows NT 6.2") != -1) {
            name = "Windows 8";
        } else if (window.navigator.userAgent.indexOf("Windows NT 6.1") != -1) {
            name = "Windows 7";
        } else if (window.navigator.userAgent.indexOf("Windows NT 6.0") != -1) {
            name = "Windows Vista";
        } else if (window.navigator.userAgent.indexOf("Windows NT 5.1") != -1) {
            name = "Windows XP";
        } else if (window.navigator.userAgent.indexOf("Windows NT 5.0") != -1) {
            name = "Windows 2000";
        } else if (window.navigator.userAgent.indexOf("Mac") != -1) {
            name = "Mac/iOS";
        } else if (window.navigator.userAgent.indexOf("X11") != -1) {
            name = "UNIX";
        } else if (window.navigator.userAgent.indexOf("Linux") != -1) {
            name = "Linux";
        }
        return name;
    }
    // 埋点上报 请求
    function push(params) {
        setTimeout(function() {
            console.log(params, "页面上报");
            $.getJSON(urlConfig.bilogUrl + base64.encode(JSON.stringify(params)) + "&jsoncallback=?", function(data) {
                console.log("bilogUrl-result:", data);
            });
        });
    }
    // 埋点引擎
    function handle(commonData, customData) {
        var resultData = commonData;
        if (commonData && customData) {
            for (var key in commonData) {
                if (key === "var") {
                    for (var item in customData) {
                        resultData["var"][item] = customData[item];
                    }
                } else {
                    if (customData[key]) {
                        resultData[key] = customData[key];
                    }
                }
            }
            push(resultData);
        }
    }
    //全部页面都要上报
    function normalPageView(loginResult) {
        var commonData = JSON.parse(JSON.stringify(initData));
        setPreInfo(document.referrer, commonData);
        var customData = {
            channel: ""
        };
        var bc = method.getCookie("bc");
        if (bc) {
            customData.channel = bc;
        }
        commonData.eventType = "page";
        commonData.eventID = "NE001";
        commonData.eventName = "normalPageView";
        if (loginResult == "loginResultPage") {
            // clickCenter('SE001', 'loginResult', 'PLOGIN', '登录页', customData);
            commonData.pageID = "PC-M-LOGIN";
            commonData.pageName = "登录页";
        } else {
            commonData.pageID = $("#ip-page-id").val() || "";
            commonData.pageName = $("#ip-page-name").val() || "";
        }
        commonData.pageURL = window.location.href;
        var searchEngine = getSearchEngine();
        var source = getSource(searchEngine);
        $.extend(customData, {
            source: source,
            searchEngine: searchEngine
        });
        handle(commonData, customData);
    }
    //详情页
    function fileDetailPageView() {
        var customData = {
            fileID: window.pageConfig.params.g_fileId,
            fileName: window.pageConfig.params.file_title,
            salePrice: window.pageConfig.params.moneyPrice,
            saleType: window.pageConfig.params.file_state,
            fileCategoryID: window.pageConfig.params.classid1 + "||" + window.pageConfig.params.classid2 + "||" + window.pageConfig.params.classid3,
            fileCategoryName: window.pageConfig.params.classidName1 + "||" + window.pageConfig.params.classidName2 + "||" + window.pageConfig.params.classidName3
        };
        var is360 = window.pageConfig && window.pageConfig.params ? window.pageConfig.params.is360 : "";
        if (/https?\:\/\/[^\s]*so.com.*$/g.test(document.referrer) && !/https?\:\/\/[^\s]*wenku.so.com.*$/g.test(document.referrer) && is360 == "true") {
            customData.fileCooType = "360onebox";
            method.setCookieWithExp("bc", "360onebox", 30 * 60 * 1e3, "/");
        }
        if (/https?\:\/\/[^\s]*wenku.so.com.*$/g.test(document.referrer)) {
            customData.fileCooType = "360wenku";
            method.setCookieWithExp("bc", "360wenku", 30 * 60 * 1e3, "/");
        }
        if (/https?\:\/\/[^\s]*wenku.so.com.*$/g.test(document.referrer)) {
            customData.fileCooType = "360wenku";
            method.setCookieWithExp("bc", "360wenku", 30 * 60 * 1e3, "/");
        }
        var commonData = JSON.parse(JSON.stringify(initData));
        setPreInfo(document.referrer, commonData);
        commonData.eventType = "page";
        commonData.eventID = "SE002";
        commonData.eventName = "fileDetailPageView";
        commonData.pageID = $("#ip-page-id").val() || "";
        commonData.pageName = $("#ip-page-name").val() || "";
        commonData.pageURL = window.location.href;
        method.setCookieWithExp("bf", JSON.stringify(customData), 30 * 60 * 1e3, "/");
        handle(commonData, customData);
    }
    //下载结果页
    function downResult(customData) {
        var commonData = JSON.parse(JSON.stringify(initData));
        setPreInfo(document.referrer, commonData);
        commonData.eventType = "page";
        commonData.eventID = "SE014";
        commonData.eventName = "downResult";
        commonData.pageID = $("#ip-page-id").val() || "";
        commonData.pageName = $("#ip-page-name").val() || "";
        commonData.pageURL = window.location.href;
        handle(commonData, customData);
    }
    function searchResult(customData) {
        //导出页面使用
        var commonData = JSON.parse(JSON.stringify(initData));
        commonData.eventType = "page";
        commonData.eventID = "SE015";
        commonData.eventName = "searchPageView";
        setPreInfo(document.referrer, commonData);
        commonData.pageID = "PC-M-SR" || "";
        commonData.pageName = $("#ip-page-name").val() || "";
        customData.keyWords = $(".new-input").val() || $(".new-input").attr("placeholder");
        commonData.pageURL = window.location.href;
        handle(commonData, customData);
    }
    //页面级事件
    $(function() {
        setTimeout(function() {
            var pid = $("#ip-page-id").val();
            if ("PC-M-FD" == pid) {
                //详情页
                fileDetailPageView();
            }
            if ("PC-O-SR" != pid) {
                //不是办公频道搜索结果页
                normalPageView();
            }
            var bf = method.getCookie("bf");
            var br = method.getCookie("br");
            var href = window.location.href;
            var downResultData = {
                downResult: 1,
                fileID: "",
                fileName: "",
                fileCategoryID: "",
                fileCategoryName: "",
                filePayType: ""
            };
            if ("PC-M-DOWN-SUC" == pid) {
                //下载成功页
                var bf = method.getCookie("bf");
                if (bf) {
                    trans(JSON.parse(bf), downResultData);
                }
                downResultData.downResult = 1;
                downResult(downResultData);
            } else if ("PC-M-DOWN-FAIL" == pid) {
                //下载失败页
                var bf = method.getCookie("bf");
                if (bf) {
                    trans(JSON.parse(bf), downResultData);
                }
                downResultData.downResult = 0;
                downResult(downResultData);
            }
        }, 1e3);
    });
    //对象值传递
    function trans(from, to) {
        for (var i in to) {
            if (from[i]) {
                to[i] = from[i];
            }
        }
    }
    //点击事件
    $(document).delegate("." + config.EVENT_NAME, "click", function(event) {
        //动态绑定点击事件
        // debugger
        var that = $(this);
        var cnt = that.attr(config.BILOG_CONTENT_NAME);
        //上报事件类型
        if (cnt) {
            setTimeout(function() {
                clickEvent(cnt, that);
            });
        }
    });
    function clickCenter(eventID, eventName, domId, domName, customData, eventType) {
        var commonData = JSON.parse(JSON.stringify(initData));
        setPreInfo(document.referrer, commonData);
        commonData.eventType = eventType || "click";
        commonData.eventID = eventID;
        commonData.eventName = eventName;
        if (eventID == "SE001") {
            commonData.pageID = "PC-M-LOGIN";
            commonData.pageName = "登录页";
        } else {
            commonData.pageID = $("#ip-page-id").val();
            commonData.pageName = $("#ip-page-name").val();
        }
        commonData.pageURL = window.location.href;
        commonData.domID = domId;
        commonData.domName = domName;
        commonData.domURL = window.location.href;
        handle(commonData, customData);
    }
    //点击事件
    function clickEvent(cnt, that, moduleID, params) {
        var ptype = $("#ip-page-type").val();
        if (ptype == "pindex") {
            //详情页
            // var customData = {
            //     fileID: '', fileName: '', fileCategoryID: '', fileCategoryName: '', filePayType: '', fileFormat: '', fileProduceType: '', fileCooType: '', fileUploaderID: '',
            // };
            var customData = {
                fileID: "",
                fileName: "",
                fileCategoryID: "",
                fileCategoryName: "",
                saleType: window.pageConfig.params.file_state,
                salePrice: window.pageConfig.params.moneyPrice
            };
            var bf = method.getCookie("bf");
            if (bf) {
                trans(JSON.parse(bf), customData);
            }
            if (cnt == "fileDetailUpDown" || cnt == "fileDetailMiddleDown" || cnt == "fileDetailBottomDown") {
                // customData.downType = '';
                // if (cnt == 'fileDetailUpDown') {
                //     clickCenter('SE003', 'fileDetailDownClick', 'fileDetailUpDown', '资料详情页顶部立即下载', customData);
                // } else if (cnt == 'fileDetailMiddleDown') {
                //     clickCenter('SE003', 'fileDetailDownClick', 'fileDetailMiddleDown', '资料详情页中部立即下载', customData);
                // } else if (cnt == 'fileDetailBottomDown') {
                //     clickCenter('SE003', 'fileDetailDownClick', 'fileDetailBottomDown', '资料详情页底部立即下载', customData);
                // }
                clickCenter("SE003", "fileDetailDownClick", "fileDetailDownClick", "资料详情页立即下载点击时", customData);
            } else if (cnt == "fileDetailUpBuy") {
                clickCenter("SE004", "fileDetailBuyClick", "fileDetailUpBuy", "资料详情页顶部立即购买", customData);
            } else if (cnt == "fileDetailMiddleBuy") {
                clickCenter("SE004", "fileDetailBuyClick", "fileDetailMiddleBuy", "资料详情页中部立即购买", customData);
            } else if (cnt == "fileDetailBottomBuy") {
                clickCenter("SE004", "fileDetailBuyClick", "fileDetailBottomBuy", "资料详情页底部立即购买", customData);
            } else if (cnt == "fileDetailMiddleOpenVip8") {
                clickCenter("SE005", "fileDetailOpenVipClick", "fileDetailMiddleOpenVip8", "资料详情页中部开通vip，8折购买", customData);
            } else if (cnt == "fileDetailBottomOpenVip8") {
                clickCenter("SE005", "fileDetailOpenVipClick", "fileDetailBottomOpenVip8", "资料详情页底部开通vip，8折购买", customData);
            } else if (cnt == "fileDetailMiddleOpenVipPr") {
                clickCenter("SE005", "fileDetailOpenVipClick", "fileDetailMiddleOpenVipPr", "资料详情页中部开通vip，享更多特权", customData);
            } else if (cnt == "fileDetailBottomOpenVipPr") {
                clickCenter("SE005", "fileDetailOpenVipClick", "fileDetailBottomOpenVipPr", "资料详情页底部开通vip，享更多特权", customData);
            } else if (cnt == "fileDetailComment") {} else if (cnt == "fileDetailScore") {
                var score = that.find(".on:last").text();
                customData.fileScore = score ? score : "";
                clickCenter("SE007", "fileDetailScoreClick", "fileDetailScore", "资料详情页评分", customData);
                delete customData.fileScore;
            }
        }
        if (cnt == "payFile") {
            // var customData = {
            //     orderID: method.getParam('orderNo') || '',
            //     couponID: $(".pay-coupon-wrap").attr("vid") || '',
            //     coupon: $(".pay-coupon-wrap p.chose-ele").text() || '',
            //     fileID: '', 
            //     fileName: '', 
            //     fileCategoryID: '', 
            //     fileCategoryName: '',
            //     filePayType: '', 
            //     fileFormat: '', 
            //     fileProduceType: '',
            //     fileCooType: '', 
            //     fileUploaderID: '', 
            //     filePrice: '', fileSalePrice: '',
            // };
            var customData = {
                fileID: window.pageConfig.params.g_fileId,
                fileName: window.pageConfig.params.title,
                salePrice: window.pageConfig.params.moneyPrice
            };
            var bf = method.getCookie("bf");
            if (bf) {
                trans(JSON.parse(bf), customData);
            }
            clickCenter("SE008", "payFileClick", "payFile", "支付页-付费资料-立即支付", customData);
        } else if (cnt == "payVip") {
            // var customData = {
            //     orderID: method.getParam('orderNo') || '',
            //     vipID: $(".ui-tab-nav-item.active").data('vid'),
            //     vipName: $(".ui-tab-nav-item.active p.vip-time").text() || '',
            //     vipPrice: $(".ui-tab-nav-item.active p.vip-price strong").text() || '',
            //     couponID: $(".pay-coupon-wrap").attr("vid") || '',
            //     coupon: $(".pay-coupon-wrap p.chose-ele").text() || '',
            // };
            var customData = {
                vipID: $(".ui-tab-nav-item.active").data("vid"),
                vipName: $(".ui-tab-nav-item.active p.vip-time").text() || "",
                vipPrice: $(".ui-tab-nav-item.active p.vip-price strong").text() || "",
                couponID: $(".pay-coupon-wrap").attr("vid") || "",
                coupon: $(".pay-coupon-wrap p.chose-ele").text() || ""
            };
            clickCenter("SE010", "payVipClick", "payVip", "支付页-VIP-立即支付", customData);
        } else if (cnt == "payPrivilege") {
            var customData = {
                orderID: method.getParam("orderNo") || "",
                couponID: $(".pay-coupon-wrap").attr("vid") || "",
                coupon: $(".pay-coupon-wrap p.chose-ele").text() || "",
                // privilegeID: $(".ui-tab-nav-item.active").data('pid') || '',
                privilegeName: $(".ui-tab-nav-item.active p.privilege-price").text() || "",
                privilegePrice: $(".ui-tab-nav-item.active").data("activeprice") || "",
                fileID: "",
                fileName: "",
                fileCategoryID: "",
                fileCategoryName: "",
                filePayType: "",
                fileFormat: "",
                fileProduceType: "",
                fileCooType: "",
                fileUploaderID: ""
            };
            var bf = method.getCookie("bf");
            if (bf) {
                trans(JSON.parse(bf), customData);
            }
            clickCenter("SE012", "payPrivilegeClick", "payPrivilege", "支付页-下载特权-立即支付", customData);
        } else if (cnt == "searchResult") {
            customData = {
                fileID: that.attr("data-fileId"),
                fileName: that.attr("data-fileName"),
                keyWords: $(".new-input").val() || $(".new-input").attr("placeholder")
            };
            clickCenter("SE016", "normalClick", "searchResultClick", "搜索结果页点击", customData);
        } else if (cnt == "loginResult") {
            initData.loginStatus = method.getCookie("cuk") ? 1 : 0, //登录状态 0 未登录 1 登录
            // $.extend(customData, params);
            clickCenter("SE001", "loginResult", "PC-M-LOGIN", "登录页", params);
        }
        var customData = {
            phone: $("#ip-mobile").val() || "",
            vipStatus: $("#ip-isVip").val() || "",
            channel: "",
            cashBalance: "",
            integralNumber: "",
            idolNumber: "",
            fileCategoryID: "",
            fileCategoryName: ""
        };
        if (userInfo) {
            customData.vipStatus = userInfo.isVip || "";
            customData.phone = userInfo.tel || "";
        }
        var bc = method.getCookie("bc");
        if (bc) {
            customData.channel = bc;
        }
        if (cnt == "paySuccessBacDown") {
            clickCenter("NE002", "normalClick", "paySuccessBacDown", "支付成功页-返回下载", customData);
        } else if (cnt == "paySuccessOpenVip") {
            clickCenter("NE002", "normalClick", "paySuccessOpenVip", "支付成功页-开通VIP", customData);
        } else if (cnt == "downSuccessOpenVip") {
            clickCenter("NE002", "normalClick", "downSuccessOpenVip", "下载成功页-开通VIP", customData);
        } else if (cnt == "downSuccessContinueVip") {
            clickCenter("NE002", "normalClick", "downSuccessContinueVip", "下载成功页-续费VIP", customData);
        } else if (cnt == "downSuccessBacDetail") {
            clickCenter("NE002", "normalClick", "downSuccessBacDetail", "下载成功页-返回详情页", customData);
        } else if (cnt == "downSuccessBindPhone") {
            clickCenter("NE002", "normalClick", "downSuccessBindPhone", "下载成功页-立即绑定", customData);
        } else if (cnt == "viewExposure") {
            customData = {};
            customData.moduleID = moduleID;
            customData.moduleName = params.moduleName;
            clickCenter("NE006", "modelView", "", "", customData);
        } else if (cnt == "similarFileClick") {
            customData = {
                moduleID: "guesslike",
                moduleName: "猜你喜欢",
                filePostion: that.index() + 1,
                fileID: window.pageConfig.params.g_fileId,
                fileName: window.pageConfig.params.file_title,
                saleType: window.pageConfig.page.productType,
                fileCategoryID: window.pageConfig.params.classid1 + "||" + window.pageConfig.params.classid2 + "||" + window.pageConfig.params.classid3,
                fileCategoryName: window.pageConfig.params.classidName1 + "||" + window.pageConfig.params.classidName2 + "||" + window.pageConfig.params.classidName3,
                filePayType: window.pageConfig.params.file_state
            };
            //    clickCenter('SE017', 'fileListNormalClick', 'similarFileClick', '资料列表常规点击', customData);
            clickCenter("NE017", "fileListNormalClick", "guesslike", "猜你喜欢", customData);
        } else if (cnt == "underSimilarFileClick") {
            // customData={
            //     fileID: window.pageConfig.params.g_fileId,
            //     fileName: window.pageConfig.params.file_title,
            //     fileCategoryID: window.pageConfig.params.classid1 + '||' + window.pageConfig.params.classid2 + '||' + window.pageConfig.params.classid3,
            //     fileCategoryName: window.pageConfig.params.classidName1 + '||' + window.pageConfig.params.classidName2 + '||' + window.pageConfig.params.classidName3,
            //     filePayType: payTypeMapping[window.pageConfig.params.file_state]
            // }
            // clickCenter('SE017', 'fileListNormalClick', 'underSimilarFileClick', '点击底部猜你喜欢内容时', customData);
            customData = {
                moduleID: "guesslike",
                moduleName: "猜你喜欢",
                filePostion: that.index() + 1,
                fileID: window.pageConfig.params.g_fileId,
                fileName: window.pageConfig.params.file_title,
                saleType: window.pageConfig.page.productType,
                fileCategoryID: window.pageConfig.params.classid1 + "||" + window.pageConfig.params.classid2 + "||" + window.pageConfig.params.classid3,
                fileCategoryName: window.pageConfig.params.classidName1 + "||" + window.pageConfig.params.classidName2 + "||" + window.pageConfig.params.classidName3,
                filePayType: window.pageConfig.params.file_state
            };
            //    clickCenter('SE017', 'fileListNormalClick', 'similarFileClick', '资料列表常规点击', customData);
            clickCenter("NE017", "fileListNormalClick", "guesslike", "猜你喜欢", customData);
        } else if (cnt == "downSucSimilarFileClick") {
            clickCenter("SE017", "fileListNormalClick", "downSucSimilarFileClick", "下载成功页猜你喜欢内容时", customData);
        } else if (cnt == "markFileClick") {
            customData = {
                fileID: window.pageConfig.params.g_fileId,
                fileName: window.pageConfig.params.file_title,
                fileCategoryID: window.pageConfig.params.classid1 + "||" + window.pageConfig.params.classid2 + "||" + window.pageConfig.params.classid3,
                fileCategoryName: window.pageConfig.params.classidName1 + "||" + window.pageConfig.params.classidName2 + "||" + window.pageConfig.params.classidName3,
                filePayType: payTypeMapping[window.pageConfig.params.file_state],
                markRusult: 1
            };
            clickCenter("SE019", "markClick", "markFileClick", "资料收藏点击", customData);
        } else if (cnt == "vipRights") {
            clickCenter("NE002", "normalClick", "vipRights", "侧边栏-vip权益", customData);
        } else if (cnt == "seen") {
            clickCenter("NE002", "normalClick", "seen", "侧边栏-我看过的", customData);
        } else if (cnt == "mark") {
            clickCenter("NE002", "normalClick", "mark", "侧边栏-我的收藏", customData);
        } else if (cnt == "customerService") {
            clickCenter("NE002", "normalClick", "customerService", "侧边栏-联系客服", customData);
        } else if (cnt == "downApp") {
            clickCenter("NE002", "normalClick", "downApp", "侧边栏-下载APP", customData);
        } else if (cnt == "follow") {
            clickCenter("NE002", "normalClick", "follow", "侧边栏-关注领奖", customData);
        } else if (cnt == "getCoupons") {
            clickCenter("NE002", "normalClick", "getCoupons", "领取优惠券按钮", customData);
        } else if (cnt == "closeCoupon") {
            clickCenter("NE002", "normalClick", "closeCoupon", "关闭优惠券按钮", customData);
        } else if (cnt == "loadMore") {
            // 判断继续阅读是否下载
            if (params && params.loadMoreDown == "1") {
                var m = {
                    fileID: params.g_fileId,
                    fileName: params.file_title,
                    salePrice: params.productPrice,
                    saleType: params.productType,
                    fileCategoryID: window.pageConfig.params.classid1 + "||" + window.pageConfig.params.classid2 + "||" + window.pageConfig.params.classid3,
                    fileCategoryName: window.pageConfig.params.classidName1 + "||" + window.pageConfig.params.classidName2 + "||" + window.pageConfig.params.classidName3
                };
                clickCenter("SE035", "fileDetailBottomDownClick", "", "", m);
            } else {
                var page = window.pageConfig.page;
                var params = window.pageConfig.params;
                var temp = {};
                $.extend(temp, {
                    domID: "continueRead",
                    domName: "继续阅读",
                    fileName: page.fileName,
                    fileID: params.g_fileId,
                    saleType: page.productType
                });
                clickCenter("NE029", "fileNomalClick", "continueRead", "继续阅读", temp);
            }
        } else if (cnt == "createOrder") {
            var temp = {};
            $.extend(temp, params);
            clickCenter("SE033", "createOrder", "", "", temp, "query");
        } else if (cnt == "searchBtnClick") {
            clickCenter("SE036", "searchBtnClick", "", "", {
                keyWords: params.keyWords
            });
        }
    }
    function getSearchEngine() {
        // baidu：百度
        // google:谷歌
        // 360:360搜索
        // sougou:搜狗
        // shenma:神马搜索
        // bing:必应
        var referrer = document.referrer;
        var res = "";
        if (/https?\:\/\/[^\s]*so.com.*$/g.test(referrer)) {
            res = "360";
        } else if (/https?\:\/\/[^\s]*baidu.com.*$/g.test(referrer)) {
            res = "baidu";
        } else if (/https?\:\/\/[^\s]*sogou.com.*$/g.test(referrer)) {
            res = "sogou";
        } else if (/https?\:\/\/[^\s]*sm.cn.*$/g.test(referrer)) {
            res = "sm";
        } else if (/https?\:\/\/[^\s]*google.com.*$/g.test(referrer)) {
            res = "google";
        } else if (/https?\:\/\/[^\s]*bing.com.*$/g.test(referrer)) {
            res = "bing";
        }
        return res;
    }
    function getSource(searchEngine) {
        var referrer = document.referrer;
        var orgigin = location.origin;
        var source = "";
        if (searchEngine) {
            //搜索引擎
            source = "searchEngine";
        } else if (referrer && referrer.indexOf(orgigin) !== -1) {
            // 正常访问
            source = "vist";
        } else {
            source = "outLink";
        }
        return source;
    }
    // todo 埋点相关公共方法 =====
    // todo 埋点上报请求---新增
    function reportToBlack(result) {
        console.log("自有埋点上报结果", result);
        setTimeout(function() {
            $.getJSON(urlConfig.bilogUrl + base64.encode(JSON.stringify(result)) + "&jsoncallback=?", function(data) {});
        });
    }
    module.exports = {
        normalPageView: function(loginResult) {
            normalPageView(loginResult);
        },
        clickEvent: function($this, params) {
            // 有些埋点不需要在domid
            var cnt = typeof $this == "string" ? $this : $this.attr(config.BILOG_CONTENT_NAME);
            if (cnt) {
                setTimeout(function() {
                    // cnt, that,moduleID,params
                    clickEvent(cnt, $this, "", params);
                });
            }
        },
        viewExposure: function($this, moduleID, moduleName) {
            var cnt = "viewExposure";
            if (cnt) {
                setTimeout(function() {
                    clickEvent(cnt, $this, moduleID, {
                        moduleName: moduleName
                    });
                });
            }
        },
        loginResult: function($this, moduleID, params) {
            var cnt = "loginResult";
            if (cnt) {
                setTimeout(function() {
                    clickEvent(cnt, "", moduleID, params);
                });
            }
        },
        searchResult: searchResult,
        // todo 后续优化-公共处理==============
        // todo 自有埋点公共数据
        getBilogCommonData: function getBilogCommonData() {
            setPreInfo(document.referrer, initData);
            return initData;
        },
        reportToBlack: reportToBlack
    };
});

/**
 * @Description: 工具类
 */
define("dist/cmd-lib/util", [], function(require, exports, module) {
    // var $ = require("$");
    var utils = {
        //节流函数 func 是传入执行函数，wait是定义执行间隔时间
        throttle: function(func, wait) {
            var last, deferTimer;
            return function(args) {
                var that = this;
                var _args = arguments;
                //当前时间
                var now = +new Date();
                //将当前时间和上一次执行函数时间对比
                //如果差值大于设置的等待时间就执行函数
                if (last && now < last + wait) {
                    clearTimeout(deferTimer);
                    deferTimer = setTimeout(function() {
                        last = now;
                        func.apply(that, _args);
                    }, wait);
                } else {
                    last = now;
                    func.apply(that, _args);
                }
            };
        },
        //防抖函数 func 是传入执行函数，wait是定义执行间隔时间
        debounce: function(func, wait) {
            //缓存一个定时器id 
            var timer = 0;
            var that = this;
            return function(args) {
                if (timer) clearTimeout(timer);
                timer = setTimeout(function() {
                    func.apply(that, args);
                }, wait);
            };
        },
        //判断是否微信浏览器
        isWeChatBrow: function() {
            var ua = navigator.userAgent.toLowerCase();
            var isWeixin = ua.indexOf("micromessenger") != -1;
            if (isWeixin) {
                return true;
            } else {
                return false;
            }
        },
        //识别是ios 还是 android
        getWebAppUA: function() {
            var res = 0;
            //非IOS
            var ua = navigator.userAgent.toLowerCase();
            if (/iphone|ipad|ipod/.test(ua)) {
                res = 1;
            } else if (/android/.test(ua)) {
                res = 0;
            }
            return res;
        },
        //判断IE8以下浏览器
        validateIE8: function() {
            if ($.browser.msie && ($.browser.version == "8.0" || $.browser.version == "7.0" || $.browser.version == "6.0")) {
                return true;
            } else {
                return false;
            }
        },
        //判断IE9以下浏览器
        validateIE9: function() {
            if ($.browser.msie && ($.browser.version == "9.0" || $.browser.version == "8.0" || $.browser.version == "7.0" || $.browser.version == "6.0")) {
                return true;
            } else {
                return false;
            }
        },
        //获取来源地址 gio上报使用
        getReferrer: function() {
            var referrer = document.referrer;
            var res = "";
            if (/https?\:\/\/[^\s]*wenku.so.com.*$/g.test(referrer)) {
                res = "360wenku";
            } else if (/https?\:\/\/[^\s]*so.com.*$/g.test(referrer)) {
                res = "360";
            } else if (/https?\:\/\/[^\s]*baidu.com.*$/g.test(referrer)) {
                res = "baidu";
            } else if (/https?\:\/\/[^\s]*sogou.com.*$/g.test(referrer)) {
                res = "sogou";
            } else if (/https?\:\/\/[^\s]*sm.cn.*$/g.test(referrer)) {
                res = "sm";
            } else if (/https?\:\/\/[^\s]*ishare.iask.sina.com.cn.*$/g.test(referrer)) {
                res = "ishare";
            } else if (/https?\:\/\/[^\s]*iask.sina.com.cn.*$/g.test(referrer)) {
                res = "iask";
            }
            return res;
        },
        getPageRef: function(fid) {
            var that = this;
            var ref = 0;
            if (that.is360cookie(fid) || that.is360cookie("360")) {
                ref = 1;
            }
            if (that.is360wkCookie()) {
                ref = 3;
            }
            return ref;
        },
        is360cookie: function(val) {
            var that = this;
            var rso = that.getCookie("_r_so");
            if (rso) {
                var split = rso.split("_");
                for (var i = 0; i < split.length; i++) {
                    if (split[i] == val) {
                        return true;
                    }
                }
            }
            return false;
        },
        add360wkCookie: function() {
            this.setCookieWithExpPath("_360hz", "1", 1e3 * 60 * 30, "/");
        },
        is360wkCookie: function() {
            return getCookie("_360hz") == null ? false : true;
        },
        getCookie: function(name) {
            var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
            if (arr !== null) {
                return unescape(arr[2]);
            }
            return null;
        },
        setCookieWithExpPath: function(name, value, timeOut, path) {
            var exp = new Date();
            exp.setTime(exp.getTime() + timeOut);
            document.cookie = name + "=" + escape(value) + ";path=" + path + ";expires=" + exp.toGMTString();
        },
        //gio数据上报上一级页面来源
        findRefer: function() {
            var referrer = document.referrer;
            var res = "other";
            if (/https?\:\/\/[^\s]*\/f\/.*$/g.test(referrer)) {
                res = "pindex";
            } else if (/https?\:\/\/[^\s]*\/d\/.*$/g.test(referrer)) {
                res = "landing";
            } else if (/https?\:\/\/[^\s]*\/c\/.*$/g.test(referrer)) {
                res = "pcat";
            } else if (/https?\:\/\/[^\s]*\/search\/.*$/g.test(referrer)) {
                res = "psearch";
            } else if (/https?\:\/\/[^\s]*\/t\/.*$/g.test(referrer)) {
                res = "ptag";
            } else if (/https?\:\/\/[^\s]*\/[u|n]\/.*$/g.test(referrer)) {
                res = "popenuser";
            } else if (/https?\:\/\/[^\s]*\/ucenter\/.*$/g.test(referrer)) {
                res = "puser";
            } else if (/https?\:\/\/[^\s]*ishare.iask.sina.com.cn.$/g.test(referrer)) {
                res = "ishareindex";
            } else if (/https?\:\/\/[^\s]*\/theme\/.*$/g.test(referrer)) {
                res = "theme";
            } else if (/https?\:\/\/[^\s]*wenku.so.com.*$/g.test(referrer)) {
                res = "360wenku";
            } else if (/https?\:\/\/[^\s]*so.com.*$/g.test(referrer)) {
                res = "360";
            } else if (/https?\:\/\/[^\s]*baidu.com.*$/g.test(referrer)) {
                res = "baidu";
            } else if (/https?\:\/\/[^\s]*sogou.com.*$/g.test(referrer)) {
                res = "sogou";
            } else if (/https?\:\/\/[^\s]*sm.cn.*$/g.test(referrer)) {
                res = "sm";
            } else if (/https?\:\/\/[^\s]*ishare.iask.sina.com.cn.*$/g.test(referrer)) {
                res = "ishare";
            } else if (/https?\:\/\/[^\s]*iask.sina.com.cn.*$/g.test(referrer)) {
                res = "iask";
            }
            return res;
        },
        /*通用对话框(alert)*/
        showAlertDialog: function(title, content, callback) {
            var bgMask = $(".common-bgMask");
            var dialog = $(".common-dialog");
            /*标题*/
            dialog.find("h2[name='title']").text(title);
            /*内容*/
            dialog.find("span[name='content']").html(content);
            /*文件下载dialog关闭按钮事件*/
            dialog.find("a.close,a.btn-dialog").unbind("click").click(function() {
                bgMask.hide();
                dialog.hide();
                /*回调*/
                if (callback && !$(this).hasClass("close")) callback();
            });
            bgMask.show();
            dialog.show();
        },
        browserVersion: function(userAgent) {
            var isOpera = userAgent.indexOf("Opera") > -1;
            //判断是否Opera浏览器
            var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera;
            //判断是否IE浏览器
            var isEdge = userAgent.indexOf("Edge") > -1;
            //判断是否IE的Edge浏览器
            var isFF = userAgent.indexOf("Firefox") > -1;
            //判断是否Firefox浏览器
            var isSafari = userAgent.indexOf("Safari") > -1 && userAgent.indexOf("Chrome") === -1;
            //判断是否Safari浏览器
            var isChrome = userAgent.indexOf("Chrome") > -1 && userAgent.indexOf("Safari") > -1;
            //判断Chrome浏览器
            if (isIE) {
                var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
                reIE.test(userAgent);
                var fIEVersion = parseFloat(RegExp["$1"]);
                if (fIEVersion === 7) {
                    return "IE7";
                } else if (fIEVersion === 8) {
                    return "IE8";
                } else if (fIEVersion === 9) {
                    return "IE9";
                } else if (fIEVersion === 10) {
                    return "IE10";
                } else if (fIEVersion === 11) {
                    return "IE11";
                } else if (fIEVersion === 12) {
                    return "IE12";
                } else {
                    return "IE";
                }
            }
            if (isOpera) {
                return "Opera";
            }
            if (isEdge) {
                return "Edge";
            }
            if (isFF) {
                return "Firefox";
            }
            if (isSafari) {
                return "Safari";
            }
            if (isChrome) {
                return "Chrome";
            }
            return "unKnow";
        },
        getBrowserInfo: function(userAgent) {
            var Sys = {};
            var ua = userAgent.toLowerCase();
            var re = /(msie|firefox|chrome|opera|version|trident).*?([\d.]+)/;
            var m = ua.match(re);
            if (m && m.length >= 2) {
                Sys.browser = m[1].replace(/version/, "'safari") || "unknow";
                Sys.ver = m[2] || "1.0.0";
            } else {
                Sys.browser = "unknow";
                Sys.ver = "1.0.0";
            }
            return Sys.browser + "/" + Sys.ver;
        },
        timeFormat: function(style, time) {
            if (!time) return "";
            var d = new Date(time);
            var year = d.getFullYear();
            //年
            var month = d.getMonth() + 1;
            //月
            var day = d.getDate();
            //日
            var hh = d.getHours();
            //时
            var mm = d.getMinutes();
            //分
            var ss = d.getSeconds();
            //秒
            var clock = year + "-";
            if (month < 10) {
                month += "0";
            }
            if (day < 10) {
                day += "0";
            }
            if (hh < 10) {
                hh += "0";
            }
            if (mm < 10) {
                mm += "0";
            }
            if (ss < 10) {
                ss += "0";
            }
            if (style === "yyyy-mm-dd") {
                return year + "-" + month + "-" + day;
            }
            // yyyy-mm-dd HH:mm:ss
            return year + "-" + month + "-" + day + " " + hh + ":" + mm + ":" + ss;
        }
    };
    //return utils;
    module.exports = utils;
});

define("dist/report/config", [], function(require, exports, module) {
    return {
        COOKIE_FLAG: "_dplf",
        //cookie存储地址
        COOKIE_CIDE: "_dpcid",
        //客户端id cookie地址存储
        COOKIE_CUK: "cuk",
        COOKIE_TIMEOUT: 1e3 * 60 * 50,
        //过期时间
        // SERVER_URL: '/dataReport',                  //接口地址
        SERVER_URL: "/",
        UACTION_URL: "/uAction",
        //用户阅读文档数据上传url
        EVENT_NAME: "pc_click",
        //绑定事件名称
        CONTENT_NAME: "pcTrackContent",
        //上报事件内容名称
        BILOG_CONTENT_NAME: "bilogContent",
        //bilog上报事件内容名称
        ishareTrackEvent: "_ishareTrackEvent",
        //兼容旧事件
        eventCookieFlag: "_eventCookieFlag",
        EVENT_REPORT: false,
        //浏览页事件级上报是否开启
        // 以下为配置项
        AUTO_PV: false
    };
});

/**
 * @Description: jQuery dialog plugin
 */
define("dist/cmd-lib/myDialog", [], function(require, exports, module) {
    //var jQuery = require("$");
    (function($) {
        $.extend($.fn, {
            dialog: function(options) {
                return this.each(function() {
                    var dialog = $.data(this, "diglog");
                    if (!dialog) {
                        dialog = new $.dialog(options, this);
                        $.data(this, "dialog", dialog);
                    }
                });
            }
        });
        var common = {
            zIndex: 1e3,
            getZindex: function() {
                return this.zIndex += 100;
            },
            dialog: {}
        };
        $.dialog = function(options, el) {
            if (arguments.length) {
                this._init(options, el);
            }
        };
        $.dialog.prototype = {
            options: {
                title: "title",
                //标题
                dragable: false,
                //拖拽暂时未实现
                cache: true,
                html: "",
                //template
                width: "auto",
                height: "auto",
                cannelBtn: true,
                //关闭按钮
                confirmlBtn: true,
                //确认按钮
                cannelText: "关闭",
                //按钮文字
                confirmText: "确定",
                //
                showFooter: true,
                onClose: false,
                //关闭回调
                onOpen: false,
                //打开回调
                callback: false,
                showLoading: false,
                loadingTxt: "处理中...",
                onConfirm: false,
                //confirm callback
                onCannel: false,
                //onCannel callback
                getContent: false,
                //getContent callback
                zIndex: common.zIndex,
                closeOnClickModal: true,
                getZindex: function() {
                    return common.zIndex += 100;
                },
                mask_tpl: '<div class="dialog-mask" data-page="mask" style="z-index:' + common.zIndex + ';"></div>'
            },
            //初始化
            _init: function(options, el) {
                this.options = $.extend(true, this.options, options);
                this.element = $(el);
                this._build(this.options.html);
                this._bindEvents();
            },
            //初始化渲染组件html
            _build: function(html) {
                var _html, footer = "", cfBtn = "", clBtn = "", bodyContent = '<div class="body-content"></div>';
                if (html) {
                    _html = html;
                } else {
                    if (this.options.confirmlBtn) {
                        cfBtn = '<button class="confirm">' + this.options.confirmText + "</button>";
                    }
                    if (this.options.cannelBtn) {
                        clBtn = '<button class="cannel">' + this.options.cannelText + "</button>";
                    }
                    if (this.options.showFooter) {
                        footer = '<div class="footer">                                    <div class="buttons">                                        ' + cfBtn + "                                        " + clBtn + "                                    </div>                                </div>";
                    }
                    if (this.options.showFooter) {
                        var h = this.options.height - 80 + "px";
                        bodyContent = '<div class="body-content" style="height:' + h + ';"></div>';
                    } else {
                        bodyContent = '<div class="body-content" style="height:' + this.options.height + ';"></div>';
                    }
                    _html = '<div class="m-dialog" style="z-index:' + this.options.getZindex + ';">								<div class="m-d-header">									<h2 style="width:' + this.options.width + ';">' + this.options.title + '</h2>									<a href="javascript:;" class="btn-close">X</a>								</div>								<div class="m-d-body" style="width:' + this.options.width + ";height:" + this.options.height + ';">									' + bodyContent + "                                </div>" + footer + "</div>";
                }
                if (!$(document).find('[data-page="mask"]').length) {
                    $("body").append(this.options.mask_tpl);
                }
                this.element.html(_html);
            },
            _center: function() {
                var d = this.element.find(".dialog");
                d.css({
                    left: ($(document).width() - d.width()) / 2,
                    top: (document.documentElement.clientHeight - d.height()) / 2 + $(document).scrollTop()
                });
            },
            _bindEvents: function() {
                var that = this;
                this.element.delegate(".close,.cancel", "click", function(e) {
                    e && e.preventDefault();
                    that.close(that.options.onClose);
                });
                $(document).delegate('[data-page="mask"]', "click", function(e) {
                    if (that.options.closeOnClickModal) {
                        e && e.preventDefault();
                        that.close(that.options.onClose);
                    }
                });
                this.element.delegate(".cannel", "click", function(e) {
                    e && e.preventDefault();
                    that._cannel(that.options.onCannel);
                });
                this.element.delegate(".confirm", "click", function(e) {
                    e && e.preventDefault();
                    if ($(this).hasClass("disable")) {
                        return;
                    }
                    if (that.options.showLoading) {
                        $(this).addClass("disable");
                        $(this).html(that.options.loadingTxt);
                    }
                    that._confirm(that.options.onConfirm);
                });
            },
            close: function(cb) {
                this._hide(cb);
                this.clearCache();
            },
            open: function(cb) {
                this._callback(cb);
                this.element.show();
                $('[data-page="mask"]').show();
                //this._center();
                this.clearCache();
            },
            _hide: function(cb) {
                this.element.hide();
                $('[data-page="mask"]').hide();
                if (cb && typeof cb === "function") {
                    this._callback(cb);
                }
            },
            clearCache: function() {
                if (!this.options.cache) {
                    this.element.data("dialog", "");
                }
            },
            _callback: function(cb) {
                if (cb && typeof cb === "function") {
                    cb.call(this);
                }
            },
            _cannel: function(cb) {
                this._hide(cb);
                this.clearCache();
            },
            _confirm: function(cb) {
                if (!this.options.callback) {
                    this._hide(cb);
                    this.clearCache();
                } else {
                    return cb();
                }
            },
            getElement: function() {
                return this.element;
            },
            _getOptions: function() {
                return this.options;
            },
            _setTxt: function(t) {
                return this.element.find(".confirm").html(t);
            },
            destroy: function() {
                var that = this;
                that.element.remove();
            }
        };
        $.extend($.fn, {
            open: function(cb) {
                $(this).data("dialog") && $(this).data("dialog").open(cb);
            },
            close: function(cb) {
                $(this).data("dialog") && $(this).data("dialog").close(cb);
            },
            clear: function() {
                $(this).data("dialog") && $(this).data("dialog").clearCache();
            },
            getOptions: function() {
                return $(this).data("dialog") && $(this).data("dialog")._getOptions();
            },
            getEl: function() {
                return $(this).data("dialog") && $(this).data("dialog").getElement();
            },
            setTxt: function(t) {
                $(this).data("dialog") && $(this).data("dialog")._setTxt(t);
            },
            destroy: function() {
                $(this).data("dialog") && $(this).data("dialog").destroy(t);
            }
        });
    })(jQuery);
});

/**
 * @Description: toast.js
 *
 */
define("dist/cmd-lib/toast", [], function(require, exports, module) {
    //var $ = require("$");
    (function($, win, doc) {
        function Toast(options) {
            this.options = {
                text: "我是toast提示",
                icon: "",
                delay: 3e3,
                callback: false
            };
            //默认参数扩展
            if (options && $.isPlainObject(options)) {
                $.extend(true, this.options, options);
            }
            this.init();
        }
        Toast.prototype.init = function() {
            var that = this;
            that.body = $("body");
            that.toastWrap = $('<div class="ui-toast" style="position:fixed;min-width:200px;padding:0 10px;height:60px;line-height:60px;text-align:center;background:#000;opacity:0.8;filter:alpha(opacity=80);top:40%;left:50%;margin-left:-100px;margin-top:-30px;border-radius:4px;z-index:99999999">');
            that.toastIcon = $('<i class="icon"></i>');
            that.toastText = $('<span class="ui-toast-text" style="color:#fff">' + that.options.text + "</span>");
            that._creatDom();
            that.show();
            that.hide();
        };
        Toast.prototype._creatDom = function() {
            var that = this;
            if (that.options.icon) {
                that.toastWrap.append(that.toastIcon.addClass(that.options.icon));
            }
            that.toastWrap.append(that.toastText);
            that.body.append(that.toastWrap);
        };
        Toast.prototype.show = function() {
            var that = this;
            setTimeout(function() {
                that.toastWrap.removeClass("hide").addClass("show");
            }, 50);
        };
        Toast.prototype.hide = function() {
            var that = this;
            setTimeout(function() {
                that.toastWrap.removeClass("show").addClass("hide");
                that.toastWrap.remove();
                that.options.callback && that.options.callback();
            }, that.options.delay);
        };
        $.toast = function(options) {
            return new Toast(options);
        };
    })($, window, document);
});

/**
 * 中间页-用于sso中嵌套进行iframe通信
 */
define("dist/application/iframe/iframe-messenger", [ "dist/application/iframe/messenger" ], function(require) {
    var Messenger = require("dist/application/iframe/messenger");
    // 通信sso
    function IframeMessenger(config) {
        // 当前窗口id
        this.clientId = config.clientId;
        // sso登录页id
        this.ssoId = config.ssoId;
        // 实例化消息中心
        this.messenger = new Messenger(config.clientId, config.projectName);
    }
    /** 添加iframe */
    IframeMessenger.prototype.addTarget = function(iframe) {
        this.messenger.addTarget(iframe.contentWindow, this.ssoId);
    };
    // 监听消息
    IframeMessenger.prototype.listen = function(callback) {
        var that = this;
        this.messenger.listen(function(res) {
            if (res) {
                res = JSON.parse(res);
                // 只接收对应窗口数据
                if (res.id === that.ssoId && typeof callback === "function") {
                    callback(res);
                }
            }
        });
    };
    // 推送数据
    IframeMessenger.prototype.send = function(data) {
        var that = this;
        that.messenger.targets[that.ssoId].send(JSON.stringify({
            id: that.clientId,
            data: data
        }));
    };
    // 在此处实例化-防止外部重复实例
    // return new IframeMessenger({
    //     // 项目id--与登录页需对应
    //     projectName: 'I_SHARE',
    //     // 登录页id--与登录页需对应
    //     ssoId: 'I_SHARE_SSO',
    //     // 登录页url
    //     // ssoUrl: 'http://127.0.0.1:8085/office-login.html'
    //     // 客户端id
    //     id: 'OFFICE_I_SHARE',
    // });
    return IframeMessenger;
});

/**
 * @description MessengerJS, a common cross-document communicate solution.
 * @author biqing kwok
 * @version 2.0
 * @license release under MIT license
 */
define("dist/application/iframe/messenger", [], function() {
    // 消息前缀, 建议使用自己的项目名, 避免多项目之间的冲突
    // !注意 消息前缀应使用字符串类型
    var prefix = "[PROJECT_NAME]", supportPostMessage = "postMessage" in window;
    // Target 类, 消息对象
    function Target(target, name, prefix) {
        var errMsg = "";
        if (arguments.length < 2) {
            errMsg = "target error - target and name are both required";
        } else if (typeof target != "object") {
            errMsg = "target error - target itself must be window object";
        } else if (typeof name != "string") {
            errMsg = "target error - target name must be string type";
        }
        if (errMsg) {
            throw new Error(errMsg);
        }
        this.target = target;
        this.name = name;
        this.prefix = prefix;
    }
    // 往 target 发送消息, 出于安全考虑, 发送消息会带上前缀
    if (supportPostMessage) {
        // IE8+ 以及现代浏览器支持
        Target.prototype.send = function(msg) {
            this.target.postMessage(this.prefix + "|" + this.name + "__Messenger__" + msg, "*");
        };
    } else {
        // 兼容IE 6/7
        Target.prototype.send = function(msg) {
            var targetFunc = window.navigator[this.prefix + this.name];
            if (typeof targetFunc == "function") {
                targetFunc(this.prefix + msg, window);
            } else {
                throw new Error("target callback function is not defined");
            }
        };
    }
    // 信使类
    // 创建Messenger实例时指定, 必须指定Messenger的名字, (可选)指定项目名, 以避免Mashup类应用中的冲突
    // !注意: 父子页面中projectName必须保持一致, 否则无法匹配
    function Messenger(messengerName, projectName) {
        this.targets = {};
        this.name = messengerName;
        this.listenFunc = [];
        this.prefix = projectName || prefix;
        this.initListen();
    }
    // 添加一个消息对象
    Messenger.prototype.addTarget = function(target, name) {
        var targetObj = new Target(target, name, this.prefix);
        this.targets[name] = targetObj;
    };
    // 初始化消息监听
    Messenger.prototype.initListen = function() {
        var self = this;
        var generalCallback = function(msg) {
            if (typeof msg == "object" && msg.data) {
                msg = msg.data;
            }
            if (typeof msg === "string") {
                var msgPairs = msg.split("__Messenger__");
                var msg = msgPairs[1];
                var pairs = msgPairs[0].split("|");
                var prefix = pairs[0];
                var name = pairs[1];
                for (var i = 0; i < self.listenFunc.length; i++) {
                    if (prefix + name === self.prefix + self.name) {
                        self.listenFunc[i](msg);
                    }
                }
            }
        };
        if (supportPostMessage) {
            if ("addEventListener" in document) {
                window.addEventListener("message", generalCallback, false);
            } else if ("attachEvent" in document) {
                window.attachEvent("onmessage", generalCallback);
            }
        } else {
            // 兼容IE 6/7
            window.navigator[this.prefix + this.name] = generalCallback;
        }
    };
    // 监听消息
    Messenger.prototype.listen = function(callback) {
        var i = 0;
        var len = this.listenFunc.length;
        var cbIsExist = false;
        for (;i < len; i++) {
            if (this.listenFunc[i] == callback) {
                cbIsExist = true;
                break;
            }
        }
        if (!cbIsExist) {
            this.listenFunc.push(callback);
        }
    };
    // 注销监听
    Messenger.prototype.clear = function() {
        this.listenFunc = [];
    };
    // 广播消息
    Messenger.prototype.send = function(msg) {
        var targets = this.targets, target;
        for (target in targets) {
            if (targets.hasOwnProperty(target)) {
                targets[target].send(msg);
            }
        }
    };
    return Messenger;
});

// 百度统计 自定义数据上传
var _hmt = _hmt || [];

//此变量百度统计需要  需全局变量
define("dist/common/baidu-statistics", [ "dist/application/method" ], function(require, exports, moudle) {
    var method = require("dist/application/method");
    var fileParams = window.pageConfig && window.pageConfig.params;
    var eventNameList = {
        fileDetailPageView: {
            loginstatus: method.getCookie("cuk") ? 1 : 0,
            userid: window.pageConfig && window.pageConfig.userId || "",
            pageid: "PC-M-FD",
            fileid: fileParams && fileParams.g_fileId,
            filecategoryname: fileParams && fileParams.classidName1 + "||" + fileParams && fileParams.classidName2 + "||" + fileParams && fileParams.classidName3,
            filepaytype: fileParams && fileParams.productType || "",
            // 文件类型
            filecootype: "",
            // 文件来源   
            fileformat: fileParams && fileParams.file_format || ""
        },
        payFileResult: {
            loginstatus: method.getCookie("cuk") ? 1 : 0,
            userid: window.pageConfig && window.pageConfig.userId || "",
            pageid: "PC-M-FD",
            pagename: "",
            payresult: "",
            orderid: "",
            orderpaytype: "",
            orderpayprice: "",
            fileid: "",
            filename: "",
            fileprice: "",
            filecategoryname: "",
            fileformat: "",
            filecootype: "",
            fileuploaderid: ""
        },
        payVipResult: {
            loginstatus: method.getCookie("cuk") ? 1 : 0,
            userid: "",
            pageid: "PC-M-FD",
            pagename: "",
            payresult: "",
            orderid: "",
            orderpaytype: "",
            orderpayprice: "",
            fileid: "",
            filename: "",
            fileprice: "",
            filecategoryname: "",
            fileformat: "",
            filecootype: "",
            fileuploaderid: ""
        },
        loginResult: {
            pagename: $("#ip-page-id").val(),
            pageid: $("#ip-page-name").val(),
            loginType: "",
            userid: "",
            loginResult: ""
        }
    };
    function handle(id) {
        if (id) {
            try {
                (function() {
                    var hm = document.createElement("script");
                    hm.src = "https://hm.baidu.com/hm.js?" + id;
                    var s = document.getElementsByTagName("script")[0];
                    s.parentNode.insertBefore(hm, s);
                })();
            } catch (e) {
                console.error(id, e);
            }
        }
    }
    function handleBaiduStatisticsPush(eventName, params) {
        // vlaue是对象
        var temp = eventNameList[eventName];
        if (eventName == "fileDetailPageView") {
            params = temp;
        }
        if (eventName == "payFileResult") {
            params = $.extend(temp, {
                payresult: params.payresult,
                orderid: params.orderNo,
                orderpaytype: params.orderpaytype
            });
        }
        if (eventName == "payVipResult") {
            params = $.extend(temp, {
                payresult: params.payresult,
                orderid: params.orderNo,
                orderpaytype: params.orderpaytype
            });
        }
        if (eventName == "loginResult") {
            params = $.extend(temp, {
                loginType: params.loginType,
                userid: params.userid,
                loginResult: params.loginResult
            });
        }
        _hmt.push([ "_trackCustomEvent", eventName, params ]);
        console.log("百度统计:", eventName, params);
    }
    return {
        initBaiduStatistics: handle,
        handleBaiduStatisticsPush: handleBaiduStatisticsPush
    };
});

define("dist/application/app", [ "dist/application/method", "dist/application/element", "dist/application/template", "dist/application/extend", "dist/application/effect", "dist/application/checkLogin", "dist/application/api", "dist/application/urlConfig", "dist/application/login", "dist/common/bilog", "base64", "dist/cmd-lib/util", "dist/report/config", "dist/cmd-lib/myDialog", "dist/cmd-lib/toast", "dist/application/iframe/iframe-messenger", "dist/application/iframe/messenger", "dist/common/baidu-statistics", "dist/common/loginType", "dist/application/helper", "dist/application/single-login" ], function(require, exports, module) {
    var method = require("dist/application/method");
    require("dist/application/element");
    require("dist/application/extend");
    require("dist/application/effect");
    require("dist/application/login");
    window.template = require("dist/application/template");
    require("dist/application/helper");
    var api = require("dist/application/api");
    var singleLogin = require("dist/application/single-login").init;
    var url = api.user.dictionaryData.replace("$code", "singleLogin");
    $.ajax({
        url: url,
        type: "GET",
        async: false,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        cache: false,
        success: function(res) {
            console.log(res);
            if (res.code == 0 && res.data && res.data.length) {
                var item = res.data[0];
                if (item.pcode == 1) {
                    singleLogin();
                }
            }
        }
    });
    // 设置访客id-放在此处设置，防止其他地方用到时还未存储到cookie中
    function getVisitUserId() {
        // 访客id-有效时间和name在此处写死
        var name = "visitor_id", expires = 30 * 24 * 60 * 60 * 1e3, visitId = method.getCookie(name);
        // 过有效期-重新请求
        if (!visitId) {
            // method.get(api.user.getVisitorId, function (response) {
            //     if (response.code == 0 && response.data) {
            //         method.setCookieWithExp(name, response.data, expires, '/');
            //     }else{
            //        visitId =  (Math.floor(Math.random()*100000) + new Date().getTime() +
            // '000000000000000000').substring(0, 18)  } })
            $.ajax({
                headers: {
                    Authrization: method.getCookie("cuk")
                },
                url: api.user.getVisitorId,
                type: "GET",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function(res) {
                    if (res.code == "0") {
                        method.setCookieWithExp(name, res.data, expires, "/");
                    } else {
                        visitId = (Math.floor(Math.random() * 1e5) + new Date().getTime() + "000000000000000000").substring(0, 18);
                    }
                },
                error: function(error) {
                    console.log("getVisitUserId:", error);
                    visitId = (Math.floor(Math.random() * 1e5) + new Date().getTime() + "000000000000000000").substring(0, 18);
                    method.setCookieWithExp(name, visitId, expires, "/");
                }
            });
        }
    }
    getVisitUserId();
    $.ajaxSetup({
        headers: {
            Authrization: method.getCookie("cuk")
        },
        complete: function(XMLHttpRequest, textStatus) {},
        statusCode: {
            401: function() {
                method.delCookie("cuk", "/");
                $.toast({
                    text: "请重新登录",
                    delay: 2e3
                });
            }
        }
    });
    var bilog = require("dist/common/bilog");
    //此方法是为了解决外部登录找不到此方法
    window.getCookie = method.getCookie;
    return {
        method: method,
        v: "1.0.1",
        bilog: bilog
    };
});

define("dist/application/element", [ "dist/application/method", "dist/application/template" ], function(require, exports, module) {
    //var $ = require("$");
    var method = require("dist/application/method");
    var template = require("dist/application/template");
    //获取热点搜索全部数据
    if (window.pageConfig && window.pageConfig.hotData) {
        var hot_data = JSON.parse(window.pageConfig.hotData);
        var arr = [];
        var darwData = [];
        function unique(min, max) {
            var index = method.random(min, max);
            if ($.inArray(index, arr) === -1) {
                arr.push(index);
                darwData.push(hot_data[index]);
                if (arr.length < 10) {
                    unique(0, hot_data.length);
                }
            } else {
                unique(0, hot_data.length);
            }
            return darwData;
        }
    }
    //返回顶部
    var fn_goTop = function($id) {
        var Obj = {
            ele: $id,
            init: function() {
                this.ele[0].addEventListener("click", function() {
                    $("html, body").animate({
                        scrollTop: 0
                    }, 120);
                }, false);
                window.addEventListener("scroll", this, false);
                return this;
            },
            handleEvent: function(evt) {
                var top = $(document).scrollTop(), height = $(window).height();
                top > 100 ? this.ele.show() : this.ele.hide();
                if (top > 10) {
                    $(".m-header").addClass("header-fix");
                } else {
                    $(".m-header").removeClass("header-fix");
                }
                return this;
            }
        };
        Obj.init().handleEvent();
    };
    $("#backToTop").length && fn_goTop && fn_goTop($("#backToTop"));
});

/*!art-template - Template Engine | http://aui.github.com/artTemplate/*/
!function() {
    function a(a) {
        return a.replace(t, "").replace(u, ",").replace(v, "").replace(w, "").replace(x, "").split(/^$|,+/);
    }
    function b(a) {
        return "'" + a.replace(/('|\\)/g, "\\$1").replace(/\r/g, "\\r").replace(/\n/g, "\\n") + "'";
    }
    function c(c, d) {
        function e(a) {
            return m += a.split(/\n/).length - 1, k && (a = a.replace(/[\n\r\t\s]+/g, " ").replace(/<!--.*?-->/g, "")), 
            a && (a = s[1] + b(a) + s[2] + "\n"), a;
        }
        function f(b) {
            var c = m;
            if (j ? b = j(b, d) : g && (b = b.replace(/\n/g, function() {
                return m++, "$line=" + m + ";";
            })), 0 === b.indexOf("=")) {
                var e = l && !/^=[=#]/.test(b);
                if (b = b.replace(/^=[=#]?|[\s;]*$/g, ""), e) {
                    var f = b.replace(/\s*\([^\)]+\)/, "");
                    n[f] || /^(include|print)$/.test(f) || (b = "$escape(" + b + ")");
                } else b = "$string(" + b + ")";
                b = s[1] + b + s[2];
            }
            return g && (b = "$line=" + c + ";" + b), r(a(b), function(a) {
                if (a && !p[a]) {
                    var b;
                    b = "print" === a ? u : "include" === a ? v : n[a] ? "$utils." + a : o[a] ? "$helpers." + a : "$data." + a, 
                    w += a + "=" + b + ",", p[a] = !0;
                }
            }), b + "\n";
        }
        var g = d.debug, h = d.openTag, i = d.closeTag, j = d.parser, k = d.compress, l = d.escape, m = 1, p = {
            $data: 1,
            $filename: 1,
            $utils: 1,
            $helpers: 1,
            $out: 1,
            $line: 1
        }, q = "".trim, s = q ? [ "$out='';", "$out+=", ";", "$out" ] : [ "$out=[];", "$out.push(", ");", "$out.join('')" ], t = q ? "$out+=text;return $out;" : "$out.push(text);", u = "function(){var text=''.concat.apply('',arguments);" + t + "}", v = "function(filename,data){data=data||$data;var text=$utils.$include(filename,data,$filename);" + t + "}", w = "'console.log(3316)';var $utils=this,$helpers=$utils.$helpers," + (g ? "$line=0," : ""), x = s[0], y = "return new String(" + s[3] + ");";
        r(c.split(h), function(a) {
            a = a.split(i);
            var b = a[0], c = a[1];
            1 === a.length ? x += e(b) : (x += f(b), c && (x += e(c)));
        });
        var z = w + x + y;
        g && (z = "try{" + z + "}catch(e){throw {filename:$filename,name:'Render Error',message:e.message,line:$line,source:" + b(c) + ".split(/\\n/)[$line-1].replace(/^[\\s\\t]+/,'')};}");
        try {
            var A = new Function("$data", "$filename", z);
            return A.prototype = n, A;
        } catch (B) {
            throw B.temp = "function anonymous($data,$filename) {" + z + "}", B;
        }
    }
    var d = function(a, b) {
        return "string" == typeof b ? q(b, {
            filename: a
        }) : g(a, b);
    };
    d.version = "3.0.0", d.config = function(a, b) {
        e[a] = b;
    };
    var e = d.defaults = {
        openTag: "<%",
        closeTag: "%>",
        escape: !0,
        cache: !0,
        compress: !1,
        parser: null
    }, f = d.cache = {};
    d.render = function(a, b) {
        return q(a, b);
    };
    var g = d.renderFile = function(a, b) {
        var c = d.get(a) || p({
            filename: a,
            name: "Render Error",
            message: "Template not found"
        });
        return b ? c(b) : c;
    };
    d.get = function(a) {
        var b;
        if (f[a]) b = f[a]; else if ("object" == typeof document) {
            var c = document.getElementById(a);
            if (c) {
                var d = (c.value || c.innerHTML).replace(/^\s*|\s*$/g, "");
                b = q(d, {
                    filename: a
                });
            }
        }
        return b;
    };
    var h = function(a, b) {
        return "string" != typeof a && (b = typeof a, "number" === b ? a += "" : a = "function" === b ? h(a.call(a)) : ""), 
        a;
    }, i = {
        "<": "&#60;",
        ">": "&#62;",
        '"': "&#34;",
        "'": "&#39;",
        "&": "&#38;"
    }, j = function(a) {
        return i[a];
    }, k = function(a) {
        return h(a).replace(/&(?![\w#]+;)|[<>"']/g, j);
    }, l = Array.isArray || function(a) {
        return "[object Array]" === {}.toString.call(a);
    }, m = function(a, b) {
        var c, d;
        if (l(a)) for (c = 0, d = a.length; d > c; c++) b.call(a, a[c], c, a); else for (c in a) b.call(a, a[c], c);
    }, n = d.utils = {
        $helpers: {},
        $include: g,
        $string: h,
        $escape: k,
        $each: m
    };
    d.helper = function(a, b) {
        o[a] = b;
    };
    var o = d.helpers = n.$helpers;
    d.onerror = function(a) {
        var b = "Template Error\n\n";
        for (var c in a) b += "<" + c + ">\n" + a[c] + "\n\n";
        "object" == typeof console && console.error(b);
    };
    var p = function(a) {
        return d.onerror(a), function() {
            return "{Template Error}";
        };
    }, q = d.compile = function(a, b) {
        function d(c) {
            try {
                return new i(c, h) + "";
            } catch (d) {
                return b.debug ? p(d)() : (b.debug = !0, q(a, b)(c));
            }
        }
        b = b || {};
        for (var g in e) void 0 === b[g] && (b[g] = e[g]);
        var h = b.filename;
        try {
            var i = c(a, b);
        } catch (j) {
            return j.filename = h || "anonymous", j.name = "Syntax Error", p(j);
        }
        return d.prototype = i.prototype, d.toString = function() {
            return i.toString();
        }, h && b.cache && (f[h] = d), d;
    }, r = n.$each, s = "break,case,catch,continue,debugger,default,delete,do,else,false,finally,for,function,if,in,instanceof,new,null,return,switch,this,throw,true,try,typeof,var,void,while,with,abstract,boolean,byte,char,class,const,double,enum,export,extends,final,float,goto,implements,import,int,interface,long,native,package,private,protected,public,short,static,super,synchronized,throws,transient,volatile,arguments,let,yield,undefined", t = /\/\*[\w\W]*?\*\/|\/\/[^\n]*\n|\/\/[^\n]*$|"(?:[^"\\]|\\[\w\W])*"|'(?:[^'\\]|\\[\w\W])*'|[\s\t\n]*\.[\s\t\n]*[$\w\.]+/g, u = /[^\w$]+/g, v = new RegExp([ "\\b" + s.replace(/,/g, "\\b|\\b") + "\\b" ].join("|"), "g"), w = /^\d[^,]*|,\d[^,]*/g, x = /^,+|,+$/g;
    e.openTag = "{{", e.closeTag = "}}";
    var y = function(a, b) {
        var c = b.split(":"), d = c.shift(), e = c.join(":") || "";
        return e && (e = ", " + e), "$helpers." + d + "(" + a + e + ")";
    };
    e.parser = function(a, b) {
        a = a.replace(/^\s/, "");
        var c = a.split(" "), e = c.shift(), f = c.join(" ");
        switch (e) {
          case "if":
            a = "if(" + f + "){";
            break;

          case "else":
            c = "if" === c.shift() ? " if(" + c.join(" ") + ")" : "", a = "}else" + c + "{";
            break;

          case "/if":
            a = "}";
            break;

          case "each":
            var g = c[0] || "$data", h = c[1] || "as", i = c[2] || "$value", j = c[3] || "$index", k = i + "," + j;
            "as" !== h && (g = "[]"), a = "$each(" + g + ",function(" + k + "){";
            break;

          case "/each":
            a = "});";
            break;

          case "echo":
            a = "print(" + f + ");";
            break;

          case "print":
          case "include":
            a = e + "(" + c.join(",") + ");";
            break;

          default:
            if (-1 !== f.indexOf("|")) {
                var l = b.escape;
                0 === a.indexOf("#") && (a = a.substr(1), l = !1);
                for (var m = 0, n = a.split("|"), o = n.length, p = l ? "$escape" : "$string", q = p + "(" + n[m++] + ")"; o > m; m++) q = y(q, n[m]);
                a = "=#" + q;
            } else a = d.helpers[e] ? "=#" + e + "(" + c.join(",") + ");" : "=" + a;
        }
        return a;
    }, "function" == typeof define ? define("dist/application/template", [], function() {
        return d;
    }) : "undefined" != typeof exports ? module.exports = d : this.template = d;
}();

define("dist/application/extend", [], function(require, exports, module) {
    if (!String.prototype.format) {
        String.prototype.format = function() {
            var args = arguments;
            return this.replace(/{(\d+)}/g, function(match, number) {
                return typeof args[number] != "undefined" ? args[number] : match;
            });
        };
    }
    if (!String.prototype.trim) {
        String.prototype.trim = function() {
            return this.replace(/^\s*/, "").replace(/\s*$/, "");
        };
    }
    if (!String.prototype.stripTags) {
        //移除html
        String.prototype.stripTags = function() {
            return this.replace(/<\/?[^>]+>/gi, "");
        };
    }
    if (!Array.indexOf) {
        Array.prototype.indexOf = function(obj) {
            for (var i = 0; i < this.length; i++) {
                if (this[i] == obj) {
                    return i;
                }
            }
            return -1;
        };
    }
    if (!Date.prototype.formatDate) {
        // new Date(new Date().getTime()).formatDate("yyyy-MM-dd")
        Date.prototype.formatDate = formatDate;
        function formatDate(fmt) {
            var o = {
                "M+": this.getMonth() + 1,
                //月份
                "d+": this.getDate(),
                //日
                "h+": this.getHours(),
                //小时
                "m+": this.getMinutes(),
                //分
                "s+": this.getSeconds(),
                //秒
                "q+": Math.floor((this.getMonth() + 3) / 3),
                //季度
                S: this.getMilliseconds()
            };
            if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
            for (var k in o) if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
            return fmt;
        }
    }
});

// 通用头部的逻辑
define("dist/application/effect", [ "dist/application/checkLogin", "dist/application/api", "dist/application/urlConfig", "dist/application/method", "dist/application/login", "dist/common/bilog", "base64", "dist/cmd-lib/util", "dist/report/config", "dist/cmd-lib/myDialog", "dist/cmd-lib/toast", "dist/application/iframe/iframe-messenger", "dist/application/iframe/messenger", "dist/common/baidu-statistics", "dist/application/method", "dist/common/loginType" ], function(require, exports, module) {
    var checkLogin = require("dist/application/checkLogin");
    var method = require("dist/application/method");
    var clickEvent = require("dist/common/bilog").clickEvent;
    var loginTypeContent = require("dist/common/loginType");
    $("#unLogin").on("click", function() {
        checkLogin.notifyLoginInterface(function(data) {
            refreshTopBar(data);
        });
    });
    $(".loginOut").on("click", function() {
        checkLogin.ishareLogout();
    });
    $(".top-user-more .js-buy-open").click(function() {
        //  头像续费vip也有使用到
        if ($(this).attr("data-type") == "vip") {
            location.href = "/pay/vip.html";
        }
    });
    $(".vip-join-con").click(function() {
        method.compatibleIESkip("/node/rights/vip.html", true);
    });
    $(".btn-new-search").click(function() {
        clickEvent("searchBtnClick", {
            keyWords: $(".new-input").val()
        });
        if (new RegExp("/search/home.html").test(location.href)) {
            var href = window.location.href.substring(0, window.location.href.indexOf("?")) + "?ft=all";
            var sword = $(".new-input").val() ? $(".new-input").val().replace(/^\s+|\s+$/gm, "") : $(".new-input").attr("placeholder");
            window.location.href = method.changeURLPar(href, "cond", encodeURIComponent(encodeURIComponent(sword)));
        } else {
            var sword = $(".new-input").val() ? $(".new-input").val().replace(/^\s+|\s+$/gm, "") : $(".new-input").attr("placeholder");
            if (sword) {
                method.compatibleIESkip("/search/home.html?ft=all&cond=" + encodeURIComponent(encodeURIComponent(sword)), true);
            }
        }
    });
    $(".new-input").on("keydown", function(e) {
        if (new RegExp("/search/home.html").test(location.href) && e.keyCode === 13) {
            var href = window.location.href.substring(0, window.location.href.indexOf("?")) + "?ft=all";
            var sword = $(".new-input").val() ? $(".new-input").val().replace(/^\s+|\s+$/gm, "") : $(".new-input").attr("placeholder");
            window.location.href = method.changeURLPar(href, "cond", encodeURIComponent(encodeURIComponent(sword)));
        } else {
            if (e.keyCode === 13) {
                var sword = $(".new-input").val() ? $(".new-input").val().replace(/^\s+|\s+$/gm, "") : $(".new-input").attr("placeholder");
                if (sword) {
                    method.compatibleIESkip("/search/home.html?ft=all&cond=" + encodeURIComponent(encodeURIComponent(sword)), true);
                }
            }
        }
    });
    var $detailHeader = $(".new-detail-header");
    var headerHeight = $detailHeader.height();
    $(window).scroll(function() {
        var detailTop = $(this).scrollTop();
        if (detailTop - headerHeight >= 0) {
            $detailHeader.addClass("new-detail-header-fix");
        } else {
            $detailHeader.removeClass("new-detail-header-fix");
        }
    });
    //刷新topbar
    var refreshTopBar = function(data) {
        var $unLogin = $("#unLogin");
        var $hasLogin = $("#haveLogin");
        $unLogin.hide();
        $hasLogin.find(".user-link .user-name").html(data.nickName);
        $hasLogin.find(".user-link img").attr("src", data.photoPicURL);
        $hasLogin.find(".top-user-more .name").html(data.nickName);
        $hasLogin.find(".top-user-more img").attr("src", data.photoPicURL);
        $hasLogin.find(".user-link .user-name").text(data.nickName);
        var temp = loginTypeContent[method.getCookie("loginType")];
        $hasLogin.find(".user-link .user-loginType").text(temp ? temp + "登录" : "");
        $hasLogin.show();
        // 办公vip开通按钮
        var $JsPayOfficeVip = $(".JsPayOfficeVip");
        // 全站vip开通按钮
        var $JsPayMainVip = $(".JsPayMainVip");
        // 全站vip图标
        var $JsMainIcon = $(".JsMainIcon");
        // 办公vip图标
        var $JsOfficeIcon = $(".JsOfficeIcon");
        if (data.isOfficeVip === 1) {
            $JsPayOfficeVip.html("立即续费");
            $JsOfficeIcon.addClass("i-vip-blue");
            $JsOfficeIcon.removeClass("i-vip-gray2");
        } else {
            $JsOfficeIcon.removeClass("i-vip-blue");
            $JsOfficeIcon.addClass("i-vip-gray2");
        }
        if (data.isMasterVip === 1) {
            $JsPayMainVip.html("立即续费");
            $JsMainIcon.addClass("i-vip-yellow");
            $JsMainIcon.removeClass("i-vip-gray1");
        } else {
            $JsMainIcon.removeClass("i-vip-yellow");
            $JsMainIcon.addClass("i-vip-gray1");
        }
        $(".jsUserImage").attr("src", data.photoPicURL);
        $(".jsUserName").text(data.nickName);
        if (window.pageConfig.params) {
            window.pageConfig.params.isVip = data.isVip;
        }
        var fileDiscount = data.fileDiscount;
        if (fileDiscount) {
            fileDiscount = fileDiscount / 100;
        } else {
            fileDiscount = .8;
        }
        if (window.pageConfig.params) {
            window.pageConfig.params.fileDiscount = fileDiscount;
        }
        $("#ip-uid").val(data.userId);
        $("#ip-isVip").val(data.isVip);
        $("#ip-mobile").val(data.mobile);
    };
    function isLogin(callback, isAutoLogin, callback2) {
        if (!method.getCookie("cuk") && isAutoLogin) {
            checkLogin.notifyLoginInterface(function(data) {
                callback && callback(data);
                callback2 && callback2(data);
                refreshTopBar(data);
            });
        } else if (method.getCookie("cuk")) {
            checkLogin.getLoginData(function(data) {
                callback && callback(data);
                refreshTopBar(data);
            });
        } else if (!isAutoLogin) {
            callback && callback();
        }
    }
    return {
        refreshTopBar: refreshTopBar,
        isLogin: isLogin
    };
});

define("dist/common/loginType", [], function(require, exports, module) {
    return {
        wechat: "微信",
        //微信登录
        qq: "QQ",
        //qq登录
        weibo: "微博",
        //微博登录
        phoneCode: "验证码",
        //手机号+验证码
        phonePw: "密码"
    };
});

define("dist/application/helper", [], function(require, exports, module) {
    template.helper("encodeValue", function(value) {
        return encodeURIComponent(encodeURIComponent(value));
    });
});

define("dist/application/single-login", [ "dist/application/method", "dist/application/api", "dist/application/urlConfig" ], function(require) {
    var method = require("dist/application/method");
    var api = require("dist/application/api");
    // 根据环境读取登录页url
    var javaPath = loginUrl + "/login-common.html?redirectUrl=";
    // 获取参数中字段
    function getParamsByUrl(href, name) {
        href = href || "";
        var strArr = href.split(name);
        var jsCode = strArr[1];
        if (jsCode) {
            // 优先截取& 其次截取#
            strArr = jsCode.split("&");
            jsCode = strArr[0];
            strArr = jsCode.split("#");
            jsCode = strArr[0];
            jsCode = jsCode.split("=")[1] || "";
        } else {
            jsCode = "";
        }
        return jsCode;
    }
    // 携带数据时，链接上已存在相关字段，进行去重处理
    function duplicateToUrl(href, name1, name2) {
        var hasIt = false;
        var val = "";
        if (href.match(name1)) {
            hasIt = true;
            val = getParamsByUrl(href, name1);
            href = href.replace(name2 + val, "");
        }
        return {
            originUrl: href,
            hasIt: hasIt,
            val: val
        };
    }
    // 通过每次进中间页读取cookie获取登录态
    function init() {
        var loginSessionId = method.getLoginSessionId();
        if (loginSessionId) {
            // 调取接口-获取token
            updateLoginToken(loginSessionId);
        } else {
            var href = window.location.href;
            var localRedtId = method.getCookie("ish_redirect");
            var redtObj = duplicateToUrl(href, "ish_redtid", "#ish_redtid=");
            // 此种方式-通过在cookie中存储跳转标识，但不保证当次一定为重定向回传过来
            // 添加时间戳或者唯一标识，通过返回的url是否携带标识来判断是否是对应触发返回
            if (localRedtId && localRedtId === redtObj.val) {
                // 重定向回传触发
                method.delCookie("ish_redirect", "/");
                var jsId = getParamsByUrl(href, "ishare_jssid");
                if (jsId) {
                    method.saveLoginSessionId(jsId);
                    // 调取接口-获取token
                    updateLoginToken(jsId);
                }
            } else {
                var redtid = method.randomString(6);
                // 保存重定向触发标识保存半小时
                method.setCookieWithExpPath("ish_redirect", redtid, 18e5, "/");
                var params = encodeURIComponent(redtObj.originUrl + "#ish_redtid=" + redtid);
                window.location.href = javaPath + params;
            }
        }
    }
    // 获取并且更新token
    function updateLoginToken(jsId) {
        $.ajax({
            url: api.user.checkSso,
            type: "GET",
            async: false,
            headers: {
                "cache-control": "no-cache",
                Pragma: "no-cache",
                jsId: jsId
            },
            cache: false,
            data: null,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function(res) {
                console.log(res);
                if (res.code == "0" && res.data && res.data.access_token) {
                    method.saveLoginToken(res.data.access_token);
                } else {
                    method.delLoginToken();
                }
            }
        });
    }
    return {
        init: init
    };
});

define("dist/common/slider", [], function(require, exports, module) {
    //banner转换
    var slider = function(banners_id, focus_id, pre_id, next_id) {
        this.$ctn = $("#" + banners_id);
        this.$focus = $("#" + focus_id);
        this.$pre = $("#" + pre_id);
        this.$next = $("#" + next_id);
        this.$adLis = null;
        this.$btns = null;
        this.switchSpeed = 4;
        //自动播放间隔(s)
        this.animateSpeed = 500;
        this.defOpacity = 1;
        this.crtIndex = 0;
        this.adLength = 0;
        this.timerSwitch = null;
        this.init();
    };
    slider.prototype = {
        fnNextIndex: function() {
            return this.crtIndex >= this.adLength - 1 ? 0 : this.crtIndex + 1;
        },
        fnPreIndex: function() {
            return this.crtIndex <= 0 ? this.adLength - 1 : this.crtIndex - 1;
        },
        //动画切换
        fnSwitch: function(toIndex) {
            if (this.crtIndex == toIndex) {
                return;
            }
            this.$adLis.css("zIndex", 0);
            this.$adLis.filter(":eq(" + this.crtIndex + ")").css("zIndex", 2);
            this.$adLis.filter(":eq(" + toIndex + ")").css("zIndex", 1);
            this.$btns.removeClass("on");
            this.$btns.filter(":eq(" + toIndex + ")").addClass("on");
            var me = this;
            $(this.$adLis[this.crtIndex]).animate({
                opacity: 0
            }, me.animateSpeed, function() {
                me.crtIndex = toIndex;
                $(this).css({
                    opacity: me.defOpacity,
                    zIndex: 0
                });
            });
        },
        fnAutoPlay: function() {
            this.fnSwitch(this.fnNextIndex());
        },
        fnPlay: function() {
            var me = this;
            me.timerSwitch && clearInterval(me.timerSwitch);
            me.timerSwitch = window.setInterval(function() {
                me.fnAutoPlay();
            }, me.switchSpeed * 1e3);
        },
        fnStopPlay: function() {
            clearInterval(this.timerSwitch);
            this.timerSwitch = null;
        },
        init: function() {
            this.$adLis = this.$ctn.children();
            this.$btns = this.$focus.children();
            this.adLength = this.$adLis.length;
            var me = this;
            //点击切换
            this.$focus.on("click", "a", function(e) {
                e.preventDefault();
                var index = parseInt($(this).attr("data-index"), 36);
                me.fnSwitch(index);
            });
            this.$adLis.filter(":eq(" + this.crtIndex + ")").css("zIndex", 2);
            this.$next.click(function() {
                me.fnStopPlay();
                me.fnSwitch(me.fnNextIndex());
            });
            this.$pre.click(function() {
                me.fnStopPlay();
                me.fnSwitch(me.fnPreIndex());
            });
            this.$btns.filter(":eq(0)").addClass("on");
            //初始化焦点
            this.fnPlay();
            //hover时暂停动画
            this.$ctn.hover(function() {
                me.fnStopPlay();
            }, function() {
                me.fnPlay();
            });
        }
    };
    //hover
    function elementHover(ele, eleShow, hover) {
        $(ele).hover(function() {
            $(this).addClass(hover);
            $(eleShow).fadeIn("slow");
        }, function() {
            $(this).removeClass(hover);
            $(eleShow).fadeOut("slow");
        });
    }
    //获取焦点
    function inputFocus(ele, focus, css) {
        $(ele).focus(function() {
            $(this).parents(css).addClass(focus);
        });
        $(ele).blur(function() {
            $(this).parents(css).removeClass(focus);
        });
    }
    //悬停事件
    function fix(ele, sh, lo, eleStop) {
        var element = $(ele);
        var top = element.offset().top - 74;
        //var pos = element.css("position");
        var shortHeight = $(sh).height();
        $(window).scroll(function() {
            var stop = $(eleStop).position().top;
            var addHeight = element.outerHeight();
            var cHeight = stop - addHeight - 40;
            var longHeight = $(lo).height();
            if (longHeight > shortHeight) {
                var scrolls = $(this).scrollTop();
                if (scrolls > top) {
                    if (scrolls > cHeight) {
                        element.css({
                            position: "absolute",
                            top: cHeight + "px"
                        });
                    } else {
                        element.css({
                            position: "fixed",
                            top: "74px"
                        });
                    }
                } else {
                    element.removeAttr("style");
                }
            }
        });
    }
    //返回顶部
    function backToTop(ele) {
        var obj = $(ele);
        obj.click(function() {
            $("html, body").animate({
                scrollTop: 0
            }, 500);
        });
        var $backToTopFun = function() {
            var doc = $(document);
            var st = doc.scrollTop(), winh = doc.height();
            st > 0 ? obj.show() : obj.hide();
            if (!window.XMLHttpRequest) {
                obj.css("top", st + 425);
            }
        };
        $(window).bind("scroll", $backToTopFun);
    }
    if (!placeholderSupport()) {
        // 判断浏览器是否支持 placeholder
        $("[placeholder]").each(function() {
            var _this = $(this);
            var left = _this.css("padding-left");
            _this.parent().append('<span class="placeholder" data-type="placeholder" style="left: ' + left + '">' + _this.attr("placeholder") + "</span>");
            if (_this.val() != "") {
                _this.parent().find("span.placeholder").hide();
            } else {
                _this.parent().find("span.placeholder").show();
            }
        }).on("focus", function() {
            $(this).parent().find("span.placeholder").hide();
        }).on("blur", function() {
            var _this = $(this);
            if (_this.val() != "") {
                _this.parent().find("span.placeholder").hide();
            } else {
                _this.parent().find("span.placeholder").show();
            }
        });
        // 点击表示placeholder的标签相当于触发input
        $("span.placeholder").on("click", function() {
            $(this).hide();
            $(this).siblings("[placeholder]").trigger("click");
            $(this).siblings("[placeholder]").trigger("focus");
        });
    }
    // 兼容IE9下的placeholder
    function placeholderSupport() {
        return "placeholder" in document.createElement("input");
    }
    $(function() {
        //用户展开
        elementHover("#J_user_name", null, "hover");
        if (!placeholderSupport()) {
            // 判断浏览器是否支持 placeholder
            $("[placeholder]").each(function() {
                var _this = $(this);
                var left = _this.css("padding-left");
                _this.parent().append('<span class="placeholder" data-type="placeholder" style="left: ' + left + '">' + _this.attr("placeholder") + "</span>");
                if (_this.val() != "") {
                    _this.parent().find("span.placeholder").hide();
                } else {
                    _this.parent().find("span.placeholder").show();
                }
            }).on("focus", function() {
                $(this).parent().find("span.placeholder").hide();
            }).on("blur", function() {
                var _this = $(this);
                if (_this.val() != "") {
                    _this.parent().find("span.placeholder").hide();
                } else {
                    _this.parent().find("span.placeholder").show();
                }
            });
            // 点击表示placeholder的标签相当于触发input
            $("span.placeholder").on("click", function() {
                $(this).hide();
                $(this).siblings("[placeholder]").trigger("click");
                $(this).siblings("[placeholder]").trigger("focus");
            });
        }
        //面包屑弹出
        elementHover(".crumb .crumb-more", null, "crumb-more-hover");
        //选择框
        $(".check-box").click(function() {
            if ($(this).find(".check-con").hasClass("checked")) {
                $(this).find(".check-con").removeClass("checked");
            } else {
                $(this).find(".check-con").addClass("checked");
            }
        });
        //返回顶部
        // backToTop("#backToTop");
        //用户展开
        elementHover("#J_user_name", null, "hover");
    });
    return slider;
});

define("dist/index/template/saiTemplate.html", [], "{{each data as item i}}\n<li><a href=\"{{data.type==1?'/f/'+item.id+'.html':data.type==2?item.contentUrl:'/node/s/'+item.id+'.html'}}\" target=\"_blank\">{{data.type==2?item.contentName:item.title}}</a></li>\n{{/each}}  \n");
