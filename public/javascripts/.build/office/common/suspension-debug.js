/**
 * @description 办公频道右侧导航栏
 * @time 2019-10-12
 * @auth heMing
 */
define("dist/office/common/suspension-debug", [ "../../application/method-debug", "../../application/checkLogin-debug", "../../application/api-debug", "../../application/login-debug", "../../cmd-lib/jqueryMd5-debug", "../../common/bilog-debug", "base64-debug", "../../cmd-lib/util-debug", "../../report/config-debug", "../../cmd-lib/myDialog-debug", "../../cmd-lib/toast-debug", "../../common/bindphone-debug", "../../common/baidu-statistics-debug", "../../application/app-debug", "../../application/element-debug", "../../application/template-debug", "../../application/extend-debug", "../../application/effect-debug", "../../application/helper-debug" ], function(require, exports, module) {
    // var $ = require("$");
    var method = require("../../application/method-debug");
    var login = require("../../application/checkLogin-debug");
    var app = require("../../application/app-debug");
    var api = require("../../application/api-debug");
    var $hasLogin = $(".hasLogin"), $notLogin = $(".notLogin"), $btnMui = $(".btn-mui");
    var href = document.location.pathname;
    if (href.indexOf("/pay/") == -1) {
        if (method.getCookie("cuk")) {
            login.getLoginData(function(data) {
                afterLogin(data);
            });
        }
    }
    scrollMenu();
    search();
    // 办公频道搜索
    function search() {
        var $searchInput = $(".search-input");
        // 搜索框
        $(".btn-search").on("click", function() {
            var cond = $.trim($searchInput.val() || "");
            if (cond) {
                cond = encodeURIComponent(encodeURIComponent(cond));
                window.location.href = "/node/office/search.html?cond=" + cond;
            }
        });
        $searchInput.keydown(function(e) {
            if (e.keyCode === 13) {
                var cond = $.trim($searchInput.val() || "");
                if (cond) {
                    window.location = "/node/office/search.html?cond=" + encodeURIComponent(encodeURIComponent(cond));
                }
            }
        });
    }
    function scrollMenu() {
        //右侧悬浮 js
        var $fixBtn = $(".fixed-op").find(".J_menu");
        var $fixFull = $(".fixed-right-full");
        var $anWrap = $fixFull.find(".fixed-detail-wrap");
        function fixAn(start, index) {
            index = index || 0;
            if (start && index === 1) {
                if (method.getCookie("cuk")) {
                    rightSlideShow(index);
                    $anWrap.animate({
                        right: "61px"
                    }, 500);
                } else {
                    login.notifyLoginInterface(function(data) {
                        pageHeaderInfo(data);
                        pageRightInfo($anWrap, index, data);
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
                    login.notifyLoginInterface(function(data) {
                        pageHeaderInfo(data);
                        pageRightInfo(null, index, data);
                        window.open("/node/rights/vip.html", "target");
                    });
                }
            } else if (index === 1) {
                $(".mui-user-wrap").css("visibility", "hidden");
                $(".mui-sel-wrap").css("visibility", "visible");
                $(".mui-collect-wrap").css("visibility", "hidden");
            } else if (index === 2) {
                $(".mui-user-wrap").css("visibility", "hidden");
                $(".mui-sel-wrap").css("visibility", "hidden");
                $(".mui-collect-wrap").css("visibility", "visible");
            } else if (index === 4 || index === 6) {
                $anWrap.animate({
                    right: "-307px"
                }, 200);
            }
        }
        $(".btn-detail-back").on("click", function() {
            fixAn(false);
            $fixBtn.removeClass("active");
        });
        $(document).on("click", function() {
            fixAn(false);
            $fixBtn.removeClass("active");
        });
        $(".op-menu-wrap").click(function(e) {
            e.stopPropagation();
        });
        $fixBtn.on("click", function() {
            var index = $(this).index();
            if ($(this).hasClass("active")) {
                $(this).removeClass("active");
                fixAn(false);
            } else {
                $(this).addClass("active").siblings().removeClass("active");
                fixAn(true, index);
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
    function pageHeaderInfo(data) {
        $hasLogin.removeClass("hide");
        $notLogin.addClass("hide");
        $(".user-pic").attr("src", data.photoPicURL);
        $(".user-name").html(data.nickName);
    }
    function pageRightInfo($anWrap, index, data) {
        $(".user-avatar img").attr("src", data.photoPicURL);
        $(".name-wrap .name-text").html(data.nickName);
        if (data.isVip === "1") {
            var txt = "您的VIP将于" + data.expireTime + "到期,剩余" + data.privilege + "次下载特权";
            $(".mui-user-wrap").addClass("mui-user-vip-wrap");
            $(".detail-right-normal-wel").html(txt);
            $(".detail-right-vip-wel").html("会员尊享权益");
            $btnMui.html("续费VIP");
            $("#memProfit").html("会员权益");
        } else {
            $(".mui-privilege-list li").removeClass("hide");
        }
        rightSlideShow(index);
        if ($anWrap) $anWrap.animate({
            right: "61px"
        }, 500);
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
        var accessKey = method.keyMap.ishare_office_detail_access;
        var list = method.getLocalData(accessKey);
        var $seenRecord = $("#seenRecord"), arr = [];
        if (list && list.length) {
            list = list.slice(0, 20);
            for (var k = 0; k < list.length; k++) {
                var item = list[k];
                var $li = '<li><i class="ico-data ico-' + item.format + '"></i><a target="_blank" href="/f/' + item.fileId + '.html">' + item.title + "</a></li>";
                arr.push($li);
            }
            $seenRecord.html(arr.join(""));
        } else {
            $seenRecord.hide().siblings(".mui-data-null").show();
        }
    }
    /**
     * 老的我的收藏
     */
    function myCollect() {
        var params = {
            pageNum: 1,
            pageSize: 20
        };
        $.ajax(api.user.collect, {
            type: "get",
            async: false,
            data: params,
            dataType: "json"
        }).done(function(res) {
            if (res.code == 0) {
                collectRender(res.data);
            }
        }).fail(function(e) {
            console.log("error===" + e);
        });
    }
    function collectRender(list) {
        var $myCollect = $("#myCollect"), arr = [];
        if (!list || !list.length) {
            $myCollect.siblings(".mui-data-null").removeClass("hide");
        } else {
            var subList = list.slice(0, 20);
            for (var k = 0; k < subList.length; k++) {
                var item = subList[k];
                var $li = '<li><i class="ico-data ico-' + item.format + '"></i><a target="_blank" href="/f/' + item.fileId + '.html">' + item.name + "</a></li>";
                arr.push($li);
            }
            $myCollect.html(arr.join(""));
            if (list.length > 20) {
                $myCollect.siblings(".btn-mui-fix").removeClass("hide");
            }
        }
    }
    //登录后 刷新头部,右侧状态栏信息
    function afterLogin(data) {
        pageHeaderInfo(data);
        pageRightInfo(null, 0, data);
    }
    /**
     * 意见反馈
     * @param list
     */
    $(".op-feedback").on("click", function() {
        var curr = window.location.href;
        // window.open('/feedAndComp/userFeedback?url=' + encodeURIComponent(curr));
        method.compatibleIESkip("/feedAndComp/userFeedback?url=" + encodeURIComponent(curr), true);
    });
    // 回到顶部
    $("#go-back-top").on("click", function() {
        $("body,html").animate({
            scrollTop: 0
        }, 200);
    });
    // 联系客服
    $(".btn-mui-contact").on("click", function() {
        _MEIQIA("init");
    });
    //pay页面刷新用
    function flash(data) {
        try {
            window.pageConfig.params.isVip = data.isVip;
            $("#ip-uid").val(data.userId);
            $("#ip-isVip").val(data.isVip);
            $("#ip-mobile").val(data.mobile);
        } catch (e) {
            console.error("flash error");
        }
    }
    // 登录
    $notLogin.on("click", function(e, isFlash) {
        if (!method.getCookie("cuk")) {
            login.notifyLoginInterface(function(data) {
                afterLogin(data);
                if (isFlash) {
                    flash(data);
                }
            });
        }
    });
    // 退出
    $(".loginOut").on("click", function() {
        login.ishareLogout();
    });
    try {
        //引入美洽客服
        (function(m, ei, q, i, a, j, s) {
            m[i] = m[i] || function() {
                (m[i].a = m[i].a || []).push(arguments);
            };
            j = ei.createElement(q), s = ei.getElementsByTagName(q)[0];
            j.async = true;
            j.charset = "UTF-8";
            j.src = "//static.meiqia.com/dist/meiqia.js?_=t";
            s.parentNode.insertBefore(j, s);
        })(window, document, "script", "_MEIQIA");
        _MEIQIA("entId", "149498");
        // 初始化成功后调用美洽 showPanel
        _MEIQIA("allSet", function() {
            _MEIQIA("showPanel");
        });
        // 在这里开启手动模式（必须紧跟美洽的嵌入代码）
        _MEIQIA("manualInit");
    } catch (e) {}
    return {
        afterLogin: afterLogin,
        pageHeaderInfo: pageHeaderInfo,
        flash: flash
    };
});