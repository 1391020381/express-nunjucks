/**
 * 办公频道 类目/搜索页
 */
define("dist/office/search/init", [ "../common/suspension", "../../application/method", "../../application/checkLogin", "../../application/api", "../../application/app", "../../application/element", "../../application/template", "../../application/extend", "../../common/bilog", "base64", "../../cmd-lib/util", "../../report/config", "../../report/init", "../../report/handler", "../../report/columns", "../../application/helper", "//static3.iask.cn/resource/js/plugins/pc.iask.login.min", "../../common/gioPageSet" ], function(require, exports, module) {
    // require("../../common/baidu-statistics");
    var suspension = require("../common/suspension");
    var app = require("../../application/app");
    var method = require("../../application/method");
    var login = require("../../application/checkLogin");
    var api = require("../../application/api");
    require("../../common/bilog");
    //页面级埋点
    var gioPageSet = require("../../common/gioPageSet");
    // 搜索文本
    var $searchInput = $(".search-input");
    // 页码
    var page = 1;
    // 属性数组
    var specifics = [];
    // 文件类型
    var fileType = "all";
    // 排序规则
    var order = "all";
    // 页面配置参数
    var pageParams = window.pageConfig.reqParams;
    // 渲染分页导航
    pageIndexChange();
    //页面加载时 埋点
    gioReport();
    // 收藏
    $(".btn-pic-xx,.btn-collect").on("click", function(e) {
        e.stopPropagation();
        e.preventDefault();
        if (!method.getCookie("cuk")) {
            login.notifyLoginInterface(function(data) {
                suspension.afterLogin(data);
            });
        }
        var $this = $(this);
        if ($this.hasClass("btn-pic-xx-ok") || $this.hasClass("btn-xx-ok")) {
            collectFile(4, $this);
        } else {
            collectFile(3, $this);
        }
    });
    // 综合排序,热门排序,最新上传
    $(".office-list-nav a").on("click", function() {
        var pathname = location.pathname;
        order = $(this).attr("data-order");
        var current = $(".office-list-nav a.nav-ele.current").attr("data-order");
        // 搜索页的跳转
        if (pathname.indexOf("node/office/search") > 0) {
            var cond = $.trim($searchInput.val() || "");
            if (cond) {
                var fileType = $(".screen-list-search span.active").attr("data-type");
                // window.location.href = '/node/office/search.html?cond=' + encodeURIComponent(encodeURIComponent(cond)) + '&fileType=' + fileType + '&order=' + order;
                method.compatibleIESkip("/node/office/search.html?cond=" + encodeURIComponent(encodeURIComponent(cond)) + "&fileType=" + fileType + "&order=" + order, false);
            }
        } else {
            var pathnameArr = pathname.split("-");
            if (pathnameArr.length > 1) {
                //location.href = pathname.replace(current, order).replace('_' + pageParams.page, '_1');
                method.compatibleIESkip(pathname.replace(current, order).replace("_" + pageParams.page, "_1"), false);
            } else {
                var resArr = pathname.split(".html");
                // location.href = resArr[0] + '_' + pageParams.page + '-' + order + '.html';
                method.compatibleIESkip(resArr[0] + "_" + pageParams.page + "-" + order + ".html", false);
            }
        }
    });
    //你要找的是不是
    $(".association-list li a").on("click", function() {
        order = $(".office-list-nav a.nav-ele.current").attr("data-order");
        var cond = encodeURIComponent(encodeURIComponent($(this).text()));
        var categoryId = pageParams.cid;
        var page = pageParams.page;
        var fileType = pageParams.fileType;
        window.location.href = location.pathname + "?cid=" + categoryId + "&page=" + page + "&order=" + order + "&cond=" + cond + "&fileType=" + fileType;
    });
    // 分页导航选择 格式,全部 word excel ppt
    $(".screen-list-search span").on("click", function() {
        var cond = $.trim($searchInput.val() || "");
        if (cond) {
            var fileType = $(this).attr("data-type");
            var order = $(".office-list-nav a.nav-ele.current").attr("data-order");
            window.location = "/node/office/search.html?cond=" + encodeURIComponent(encodeURIComponent(cond)) + "&fileType=" + fileType + "&order=" + order;
        }
    });
    // 点赞
    $(".btn-goods").on("click", function(e) {
        e.stopPropagation();
        e.preventDefault();
        var $this = $(this), isZan = $this.attr("data-isZan");
        if (isZan) {
            return false;
        } else {
            var p = $this.text();
            var num = p ? parseInt(p) + 1 : p;
            $this.addClass("btn-goods-ok").find("#num").text(num);
            $this.attr("data-isZan", true);
        }
    });
    $(".none-btn").on("click", function() {
        var cond = encodeURIComponent(encodeURIComponent($(this).attr("data-cond")));
        window.location.href = "/search/home.html?ft=all&cond=" + cond;
    });
    // 添加取消收藏
    function collectFile(cond, $target) {
        method.post(api.normalFileDetail.collect, function(res) {
            if (res.code == 0) {
                var $pointElement = $target.next(".office-collect-info");
                var $collectMsg = $pointElement.length > 0 ? $pointElement : $target.closest(".data-text-con").siblings(".data-pic").find(".office-collect-info");
                var $enshrineNum = $target.closest("li").find("#enshrineNum");
                if (cond === 3) {
                    $collectMsg.show().find("p").text("收藏成功");
                    $target.closest("li").find(".first-collect .btn-pic-xx").addClass("btn-pic-xx-ok");
                    $target.closest("li").find(".second-collect .btn-xx").addClass("btn-xx-ok");
                    setTimeout(function() {
                        $collectMsg.hide();
                    }, 2500);
                    $enshrineNum.text(parseInt($enshrineNum.text()) + 1);
                } else {
                    $collectMsg.show().find("p").text("取消收藏");
                    $target.closest("li").find(".first-collect .btn-pic-xx").removeClass("btn-pic-xx-ok");
                    $target.closest("li").find(".second-collect .btn-xx").removeClass("btn-xx-ok");
                    setTimeout(function() {
                        $collectMsg.hide();
                    }, 2500);
                    if (parseInt($enshrineNum.text()) > 0) {
                        $enshrineNum.text(parseInt($enshrineNum.text()) - 1);
                    }
                }
            }
        }, "", "post", {
            fid: $target.attr("data-id"),
            cond: cond,
            flag: "y"
        });
    }
    /*
        @param reqParams
        @des 分页
     */
    function pageNavigate(page) {
        var cond = encodeURIComponent(encodeURIComponent($searchInput.val()));
        var order = $(".office-list-nav a.nav-ele.current").attr("data-order");
        // 判断当前页是分类页,还是搜索页，url判断
        var pathname = location.pathname;
        // 搜索页面
        if (pathname.indexOf("node/office/search") > 0) {
            var fileType = $(".screen-list-search span.active").attr("data-type");
            window.location = "/node/office/search.html?cond=" + cond + "&page=" + page + "&fileType=" + fileType + "&order=" + order;
        } else {
            // 这种情况的url./c/8043_1-all-1039_2149.html ,结合pageConfig reqParams拼装
            var pathnameArr = pathname.split("-");
            if (pathnameArr.length > 1) {
                var regExp = /c\/(\S*)\./;
                var matchResult = pathname.match(regExp);
                if (matchResult && matchResult.length > 0) {
                    //[0] 8043_1-all-1039_2149 [1] /c/ [2] .html
                    var path = "/c/" + pageParams.cid + "_" + page + "-" + pageParams.order;
                    if (pageParams.specifics) {
                        path += "-" + pageParams.specifics.replace(/,/g, "-");
                    }
                    path += ".html";
                    location.href = path;
                }
            } else {
                // 这种url /c/8043.html
                var resArr = location.pathname.split(".html");
                location.href = resArr[0] + "_" + page + "-" + order + ".html";
            }
        }
    }
    // gio 埋点上报 页面级
    function gioReport() {
        var cond = decodeURIComponent(decodeURIComponent(method.getParam("cond")));
        if (cond) {
            gioPageSet.gioPageSet({
                searchContent_pvar: cond,
                // 搜索关键词
                officeChannel_pvar: "office",
                // 办公频道页，包含列表页和详情页,
                pageType_pvar: location.pathname.indexOf("node/office/search") > 0 ? "officeSearch" : "officeClassify"
            });
        }
    }
    //分页功能      一共20页；
    function pageIndexChange() {
        // 分页导航
        var $pageNavigate = $(".office-page-paging");
        // 首页
        var $firstPage = $pageNavigate.find(".btn-page-long");
        // 上页
        var $prePage = $pageNavigate.find(".btn-page");
        // 单个页面
        var $singlePage = $pageNavigate.find(".page-ele");
        // 下标
        var indexNum = $singlePage.length - 1;
        // 当前页码
        var params = method.getParam("page") || pageParams.page;
        var pageIndex = params - 1;
        pageIndex = pageIndex > 0 ? pageIndex : 0;
        if (pageIndex > 0) {
            $firstPage.eq(0).show();
            $prePage.eq(0).show();
        }
        if (pageIndex !== 0 && pageIndex !== indexNum) {
            $singlePage.eq(pageIndex - 2).show();
            $singlePage.eq(pageIndex - 1).show();
            $singlePage.eq(pageIndex).show();
            $singlePage.eq(pageIndex + 1).show();
            $singlePage.eq(pageIndex + 2).show();
            pageIndex - 2 > 0 ? $singlePage.eq(pageIndex - 2).before('<span class="page-point">...</span>') : null;
            pageIndex + 2 < indexNum - 1 ? $singlePage.eq(pageIndex + 2).after('<span class="page-point">...</span>') : null;
        }
        if (pageIndex === 0) {
            $firstPage.eq(0).hide();
            $prePage.eq(0).hide();
            $singlePage.eq(1).show();
            $singlePage.eq(2).show();
            $singlePage.eq(3).show();
            $singlePage.eq(4).show();
            $singlePage.eq(4).after('<span class="page-point">...</span>');
        }
        if (pageIndex === indexNum) {
            $firstPage.eq(1).hide();
            $prePage.eq(1).hide();
            $singlePage.eq(indexNum - 4).show();
            $singlePage.eq(indexNum - 3).show();
            $singlePage.eq(indexNum - 2).show();
            $singlePage.eq(indexNum - 1).show();
            $singlePage.eq(indexNum - 4).before('<span class="page-point">...</span>');
        }
        if (pageIndex > 0 && pageIndex < indexNum) {
            $firstPage.show();
            $prePage.show();
        }
        $singlePage.eq(0).show();
        $singlePage.eq(indexNum).show();
        //点击分页时
        $singlePage.click(function() {
            page = $(this).attr("value");
            pageNavigate(page);
        });
        //首页
        $firstPage.eq(0).click(function() {
            page = 1;
            pageNavigate(page);
        });
        //下一页
        $firstPage.eq(1).click(function() {
            if (!params) {
                page = 2;
                pageNavigate(page);
            } else if (pageIndex + 1 <= indexNum + 1) {
                page = pageIndex + 2;
                pageNavigate(page);
            }
        });
        // 上一页
        $prePage.eq(0).click(function() {
            page = pageIndex;
            pageNavigate(page);
        });
        //尾页
        $prePage.eq(1).click(function() {
            page = indexNum + 1;
            pageNavigate(page);
        });
    }
});

/**
 * @description 办公频道右侧导航栏
 * @time 2019-10-12
 * @auth heMing
 */
define("dist/office/common/suspension", [ "dist/application/method", "dist/application/checkLogin", "dist/application/api", "dist/application/app", "dist/application/element", "dist/application/template", "dist/application/extend", "dist/common/bilog", "base64", "dist/cmd-lib/util", "dist/report/config", "dist/report/init", "dist/report/handler", "dist/report/columns", "dist/application/helper", "//static3.iask.cn/resource/js/plugins/pc.iask.login.min" ], function(require, exports, module) {
    // var $ = require("$");
    var method = require("dist/application/method");
    var login = require("dist/application/checkLogin");
    var app = require("dist/application/app");
    var api = require("dist/application/api");
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
        $(".user-pic").attr("src", data.weiboImage);
        $(".user-name").html(data.nickName);
    }
    function pageRightInfo($anWrap, index, data) {
        $(".user-avatar img").attr("src", data.weiboImage);
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

define("dist/application/method", [], function(require, exports, module) {
    //var $ = require("$");
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
                    Pragma: "no-cache"
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
            if (/^1(3|4|5|7|8)\d{9}$/.test(val)) {
                return true;
            } else {
                return false;
            }
        },
        handleRecommendData: function(list) {
            var arr = [];
            list.forEach(function(item) {
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
        }
    };
});

/**
 * 登录相关
 */
define("dist/application/checkLogin", [ "dist/application/api", "dist/application/method" ], function(require, exports, module) {
    //var $ = require("$");
    var api = require("dist/application/api");
    var method = require("dist/application/method");
    var api = require("dist/application/api");
    module.exports = {
        getIds: function() {
            // 详情页
            var params = window.pageConfig && window.pageConfig.params ? window.pageConfig.params : null;
            var access = window.pageConfig && window.pageConfig.access ? window.pageConfig.access : null;
            var classArr = [];
            if (params) {
                params.classid1 && classArr.push(params.classid1);
                params.classid2 && classArr.push(params.classid2);
                params.classid3 && classArr.push(params.classid3);
            }
            var clsId = params ? classArr.length > 0 ? classArr.join("-") : "" : "";
            var fid = access ? access.fileId || params.g_fileId || "" : "";
            // 类目页
            var classIds = window.pageConfig && window.pageConfig.classIds ? window.pageConfig.classIds : "";
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
                __pc__.push([ "pcTrackContent", "loginDialogLoad" ]);
                var ptype = window.pageConfig && window.pageConfig.page ? window.pageConfig.page.ptype || "index" : "index";
                $.loginPop("login", {
                    terminal: "PC",
                    businessSys: "ishare",
                    domain: document.domain,
                    ptype: ptype,
                    clsId: this.getIds().clsId,
                    fid: this.getIds().fid
                }, function(data) {
                    // 透传
                    // method.get(api.user.getJessionId, function (res) {
                    _self.getLoginData(callback);
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
                // method.get(api.user.getJessionId, function (res) {
                // if (res.code == 0) {
                _self.getLoginData(callback);
            });
        },
        /**
         * description  唤醒校验界面
         */
        notifyCheckInterface: function() {
            if (method.getCookie("cuk")) {
                $.loginPop("checkCode", {
                    terminal: "PC",
                    businessSys: "ishare",
                    domain: document.domain,
                    clsId: this.getIds().clsId,
                    fid: this.getIds().fid
                }, function(data) {
                    if (data.code == "0") {
                        method.get(api.user.getJessionId, function(res) {}, "");
                    }
                });
            }
        },
        /**
         * description  免登录透传用户信息
         * @param callback 回调函数
         */
        syncUserInfoInterface: function(callback) {
            var _self = this;
            if (method.getCookie("cuk")) {
                method.get(api.user.getJessionId, function(res) {
                    if (res.code == 0) {
                        _self.getLoginData(callback);
                    }
                }, "");
            }
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
        getLoginData: function(callback) {
            var _self = this;
            try {
                method.get(api.user.login, function(res) {
                    if (res.code == 0 && res.data) {
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
                    } else if (res.code == 40001) {
                        _self.ishareLogout();
                    }
                });
            } catch (e) {}
        },
        /**
         * 退出
         */
        ishareLogout: function() {
            //删域名cookie
            method.delCookie("cuk", "/", ".sina.com.cn");
            method.delCookie("cuk", "/", ".iask.com.cn");
            method.delCookie("cuk", "/", ".iask.com");
            //微信扫码登录sceneId
            method.delCookie("sid", "/", ".iask.sina.com.cn");
            method.delCookie("sid", "/", ".iask.com.cn");
            method.delCookie("sid", "/", ".sina.com.cn");
            method.delCookie("sid", "/", ".ishare.iask.com.cn");
            method.delCookie("sid", "/", ".office.iask.com");
            method.delCookie("sid_ishare", "/", ".iask.sina.com.cn");
            method.delCookie("sid_ishare", "/", ".iask.com.cn");
            method.delCookie("sid_ishare", "/", ".sina.com.cn");
            method.delCookie("sid_ishare", "/", ".ishare.iask.com.cn");
            //删除第一次登录标识
            method.delCookie("_1st_l", "/");
            method.delCookie("ui", "/");
            // $.post("/logout", function () {
            //     window.location.href = window.location.href;
            // });
            $.post(api.user.loginOut, function() {
                window.location.href = window.location.href;
            });
        }
    };
});

/**
 * 前端交互性API
 **/
define("dist/application/api", [], function(require, exports, module) {
    var router = "/gateway/pc";
    var gateway = "/gateway";
    module.exports = {
        // 用户相关
        user: {
            // 登录
            login: router + "/usermanage/checkLogin",
            // 登出
            loginOut: gateway + "/pc/usermanage/logout",
            // 我的收藏
            collect: router + "/usermanage/collect",
            newCollect: gateway + "/content/collect/getUserFileList",
            // 透传老系统web登录信息接口
            getJessionId: router + "/usermanage/getJessionId",
            //优惠券提醒
            getSessionInfo: router + "/usermanage/getSessionInfo",
            addFeedback: gateway + "/feedback/addFeedback",
            //新增反馈
            getFeedbackType: gateway + "/feedback/getFeedbackType",
            //获取反馈问题类型
            sendSms: gateway + "/cas/sms/sendSms",
            // 发送短信验证码
            queryBindInfo: gateway + "/cas/user/queryBindInfo",
            // 查询用户绑定信息
            thirdCodelogin: gateway + "/cas/login/thirdCode",
            // /cas/login/thirdCode
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
            getSearchList: gateway + "/search/content/byCondition"
        },
        // 查询用户发券资格接口
        // sale: {
        //     querySeniority: router + '/sale/querySeniority',
        // },
        normalFileDetail: {
            // 添加评论
            addComment: router + "/fileSync/addComment",
            // 举报
            reportContent: router + "/fileSync/addFeedback",
            // 是否已收藏
            isStore: router + "/fileSync/getFileCollect",
            // 取消或者关注
            collect: router + "/fileSync/collect",
            // 文件预下载
            filePreDownLoad: gateway + "/content/getPreFileDownUrl",
            // 文件下载
            fileDownLoad: router + "/action/downloadUrl",
            // 下载获取地址接口
            getFileDownLoadUrl: gateway + "/content/getFileDownUrl",
            // 文件打分
            appraise: router + "/fileSync/appraise",
            // 文件预览判断接口
            getPrePageInfo: router + "/fileSync/prePageInfo",
            // 文件是否已下载
            hasDownLoad: router + "/fileSync/isDownload"
        },
        officeFileDetail: {},
        search: {
            //搜索服务--API接口--运营位数据--异步
            byPosition: router + "/operating/byPosition",
            specialTopic: gateway + "/search/specialTopic/lisPage"
        },
        sms: {
            // 获取短信验证码
            getCaptcha: router + "/usermanage/getSmsYzCode",
            sendCorpusDownloadMail: gateway + "/content/fileSendEmail/sendCorpusDownloadMail"
        },
        pay: {
            // 购买成功后,在页面自动下载文档
            successBuyDownLoad: router + "/action/downloadNow",
            // 绑定订单
            bindUser: router + "/order/bindUser",
            scanOrderInfo: gateway + "/order/scan/orderInfo"
        },
        coupon: {
            rightsSaleVouchers: gateway + "/rights/sale/vouchers",
            rightsSaleQueryPersonal: gateway + "/rights/sale/queryPersonal",
            querySeniority: gateway + "/rights/sale/querySeniority",
            queryUsing: gateway + "/rights/sale/queryUsing",
            getMemberPointRecord: gateway + "/rights/vip/getMemberPointRecord",
            getBuyRecord: gateway + "/rights/vip/getBuyRecord"
        },
        vouchers: router + "/sale/vouchers",
        order: {
            bindOrderByOrderNo: router + "/order/bindOrderByOrderNo",
            unloginOrderDown: router + "/order/unloginOrderDown",
            createOrderInfo: gateway + "/order/create/orderInfo",
            rightsVipGetUserMember: gateway + "/rights/vip/getUserMember",
            getOrderStatus: gateway + "/order/get/orderStatus",
            queryOrderlistByCondition: gateway + "/order/query/listByCondition",
            getOrderInfo: gateway + "/order/get/orderInfo"
        },
        getHotSearch: router + "/search/getHotSearch",
        special: {
            fileSaveOrupdate: gateway + "/comment/collect/fileSaveOrupdate",
            // 收藏与取消收藏
            getCollectState: gateway + "/comment/zc/getUserFileZcState",
            //获取收藏状态
            setCollect: gateway + "/content/collect/file"
        },
        upload: {
            getCategory: gateway + "/content/category/getSimplenessInfo",
            // 获取所有分类
            createFolder: gateway + "/content/saveUserFolder",
            // 获取所有分类
            getFolder: gateway + "/content/getUserFolders",
            // 获取所有分类
            saveUploadFile: gateway + "/content/webUploadFile",
            batchDeleteUserFile: gateway + "/content/batchDeleteUserFile"
        },
        recommend: {
            recommendConfigInfo: gateway + "/recommend/config/info",
            recommendConfigRuleInfo: gateway + "/recommend/config/ruleInfo"
        },
        reportBrowse: {
            fileBrowseReportBrowse: gateway + "/content/fileBrowse/reportBrowse"
        }
    };
});

define("dist/application/app", [ "dist/application/method", "dist/application/element", "dist/application/template", "dist/application/extend", "dist/common/bilog", "base64", "dist/cmd-lib/util", "dist/report/config", "dist/report/init", "dist/report/handler", "dist/report/columns", "dist/application/helper", "//static3.iask.cn/resource/js/plugins/pc.iask.login.min" ], function(require, exports, module) {
    var method = require("dist/application/method");
    require("dist/application/element");
    require("dist/application/extend");
    var bilog = require("dist/common/bilog");
    require("dist/report/init");
    window.template = require("dist/application/template");
    require("dist/application/helper");
    require("//static3.iask.cn/resource/js/plugins/pc.iask.login.min.js");
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
});

define("dist/common/bilog", [ "base64", "dist/cmd-lib/util", "dist/application/method", "dist/report/config" ], function(require, exports, module) {
    //var $ = require("$");
    var base64 = require("base64").Base64;
    var util = require("dist/cmd-lib/util");
    var method = require("dist/application/method");
    var config = require("dist/report/config");
    //参数配置
    // var payTypeMapping = ['', '免费', '下载券', '现金', '仅供在线阅读', 'VIP免费', 'VIP特权'];
    // var payTypeMapping = ['', 'free', 'down', 'cost', 'online', 'vipFree', 'vipOnly'];
    var payTypeMapping = [ "", "free", "", "online", "vipOnly", "cost" ];
    //productType=1：免费文档，3 在线文档 4 vip特权文档 5 付费文档 6 私有文档
    // var fsourceEnum = {
    //     user: '用户上传', editor: '编辑上传', history: '历史资料1', history2: '历史资料2',
    //     other_collection_site: '外包采集站点', ishare_collection_site: '自行采集站点',
    //     other_collection_keyword: '外包采集关键字', ishare_collection_keyword: '自行采集关键字',
    //     baiduwenku_collection_site: '百度文库采集源', ishare_collection_microdisk: '自行采集微盘',
    // };
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
        visitID: method.getCookie("gr_user_id") || "",
        //访客id
        userID: "",
        //用户ID
        sessionID: sessionStorage.getItem("sessionID") || cid || "",
        //会话ID
        productName: "ishare",
        //产品名称
        productCode: "0",
        //产品代码
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
        if (new RegExp("/f/").test(referrer) && !new RegExp("referrer=").test(referrer) && !new RegExp("/f/down").test(referrer)) {
            var statuCode = $(".ip-page-statusCode");
            if (statuCode == "404") {
                initData.prePageID = "PC-M-FDL";
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
            console.log(params);
            $.getJSON("https://dw.iask.com.cn/ishare/jsonp?data=" + base64.encode(JSON.stringify(params)) + "&jsoncallback=?", function(data) {
                console.log(data);
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
            console.log("埋点参数:", resultData);
            push(resultData);
        }
    }
    //全部页面都要上报
    function normalPageView() {
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
        commonData.pageID = $("#ip-page-id").val() || "";
        commonData.pageName = $("#ip-page-name").val() || "";
        commonData.pageURL = window.location.href;
        var utm_source = method.getParam("utm_source");
        var utm_medium = method.getParam("utm_campaign");
        var utm_term = method.getParam("utm_campaign");
        $.extend(customData, {
            utm_source: utm_source,
            utm_medium: utm_medium,
            utm_term: utm_term
        });
        handle(commonData, customData);
    }
    //详情页
    function fileDetailPageView() {
        var customData = {
            fileID: window.pageConfig.params.g_fileId,
            fileName: window.pageConfig.params.file_title,
            fileCategoryID: window.pageConfig.params.classid1 + "||" + window.pageConfig.params.classid2 + "||" + window.pageConfig.params.classid3,
            fileCategoryName: window.pageConfig.params.classidName1 + "||" + window.pageConfig.params.classidName2 + "||" + window.pageConfig.params.classidName3,
            filePrice: window.pageConfig.params.moneyPrice,
            fileCouponCount: window.pageConfig.params.file_volume,
            filePayType: payTypeMapping[window.pageConfig.params.file_state],
            fileFormat: window.pageConfig.params.file_format,
            fileProduceType: window.pageConfig && window.pageConfig.params ? window.pageConfig.params.fsource : "",
            fileCooType: "",
            fileUploaderID: window.pageConfig.params.file_uid
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
    //文件购买结果页
    function payFileResult(customData) {
        var commonData = JSON.parse(JSON.stringify(initData));
        setPreInfo(document.referrer, commonData);
        commonData.eventType = "page";
        commonData.eventID = "SE009";
        commonData.eventName = "payFileResult";
        commonData.pageID = $("#ip-page-id").val() || "";
        commonData.pageName = $("#ip-page-name").val() || "";
        commonData.pageURL = window.location.href;
        if (!customData.fileID) {
            customData.fileID = method.getParam("fid") || $("#ip-page-fid").val();
        }
        if (!customData.filePayType) {
            var state = $("#ip-page-fstate").val() || 1;
            customData.filePayType = payTypeMapping[state];
        }
        handle(commonData, customData);
    }
    //vip购买结果页
    function payVipResult(customData) {
        var commonData = JSON.parse(JSON.stringify(initData));
        setPreInfo(document.referrer, commonData);
        commonData.eventType = "page";
        commonData.eventID = "SE011";
        commonData.eventName = "payVipResult";
        commonData.pageID = $("#ip-page-id").val() || "";
        commonData.pageName = $("#ip-page-name").val() || "";
        commonData.pageURL = window.location.href;
        if (!customData.orderID) {
            customData.orderID = method.getParam("orderNo") || "";
        }
        handle(commonData, customData);
    }
    //下载特权购买结果页
    function payPrivilegeResult(customData) {
        var commonData = JSON.parse(JSON.stringify(initData));
        setPreInfo(document.referrer, commonData);
        commonData.eventType = "page";
        commonData.eventID = "SE013";
        commonData.eventName = "payPrivilegeResult";
        commonData.pageID = $("#ip-page-id").val() || "";
        commonData.pageName = $("#ip-page-name").val() || "";
        commonData.pageURL = window.location.href;
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
            var payVipResultData = {
                payResult: 1,
                orderID: method.getParam("orderNo") || "",
                couponID: $(".pay-coupon-wrap").attr("vid") || "",
                coupon: $(".pay-coupon-wrap p.chose-ele").text() || "",
                orderPayType: "",
                orderPayPrice: "",
                vipID: "",
                vipName: "",
                vipPrice: ""
            };
            var payPriResultData = {
                payResult: 1,
                orderID: method.getParam("orderNo") || "",
                couponID: $(".pay-coupon-wrap").attr("vid") || "",
                coupon: $(".pay-coupon-wrap p.chose-ele").text() || "",
                orderPayType: "",
                orderPayPrice: "",
                fileID: "",
                fileName: "",
                fileCategoryID: "",
                fileCategoryName: "",
                filePayType: "",
                fileFormat: "",
                fileProduceType: "",
                fileCooType: "",
                fileUploaderID: "",
                privilegeID: "",
                privilegeName: "",
                privilegePrice: ""
            };
            var payFileResultData = {
                payResult: 1,
                orderID: method.getParam("orderNo") || "",
                couponID: $(".pay-coupon-wrap").attr("vid") || "",
                coupon: $(".pay-coupon-wrap p.chose-ele").text() || "",
                orderPayType: "",
                orderPayPrice: "",
                fileID: "",
                fileName: "",
                fileCategoryID: "",
                fileCategoryName: "",
                filePayType: "",
                fileFormat: "",
                fileProduceType: "",
                fileCooType: "",
                fileUploaderID: "",
                filePrice: "",
                fileSalePrice: ""
            };
            var bf = method.getCookie("bf");
            var br = method.getCookie("br");
            var href = window.location.href;
            if ("PC-M-PAY-SUC" == pid || "PC-O-PAY-SUC" == pid) {
                //支付成功页
                if (href.indexOf("type=0") > -1) {
                    //vip购买成功页
                    if (br) {
                        trans(JSON.parse(br), payVipResultData);
                    }
                    payVipResult(payVipResultData);
                } else if (href.indexOf("type=1") > -1) {
                    //下载特权购买成功页
                    if (bf) {
                        trans(JSON.parse(bf), payPriResultData);
                    }
                    if (br) {
                        trans(JSON.parse(br), payPriResultData);
                    }
                    payPrivilegeResult(payPriResultData);
                } else if (href.indexOf("type=2") > -1) {
                    //文件购买成功页
                    if (bf) {
                        trans(JSON.parse(bf), payFileResultData);
                    }
                    var br = method.getCookie("br");
                    if (br) {
                        trans(JSON.parse(br), payFileResultData);
                    }
                    payFileResult(payFileResultData);
                }
            } else if ("PC-M-PAY-FAIL" == pid || "PC-O-PAY-FAIL" == pid) {
                //支付失败页
                if (href.indexOf("type=0") > -1) {
                    //vip购买失败页
                    if (br) {
                        trans(JSON.parse(br), payVipResultData);
                    }
                    payVipResultData.payResult = 0;
                    payVipResult(payVipResultData);
                } else if (href.indexOf("type=1") > -1) {
                    //下载特权购买失败页
                    if (bf) {
                        trans(JSON.parse(bf), payPriResultData);
                    }
                    if (br) {
                        trans(JSON.parse(br), payPriResultData);
                    }
                    payPriResultData.payResult = 0;
                    payPrivilegeResult(payPriResultData);
                } else if (href.indexOf("type=2") > -1) {
                    //文件购买失败页
                    if (bf) {
                        trans(JSON.parse(bf), payFileResultData);
                    }
                    if (br) {
                        trans(JSON.parse(br), payFileResultData);
                    }
                    payFileResultData.payResult = 0;
                    payFileResult(payFileResultData);
                }
            }
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
        console.log("cnt:", cnt);
        if (cnt) {
            setTimeout(function() {
                clickEvent(cnt, that);
            });
        }
    });
    function clickCenter(eventID, eventName, domId, domName, customData) {
        var commonData = JSON.parse(JSON.stringify(initData));
        setPreInfo(document.referrer, commonData);
        commonData.eventType = "click";
        commonData.eventID = eventID;
        commonData.eventName = eventName;
        commonData.pageID = $("#ip-page-id").val();
        commonData.pageName = $("#ip-page-name").val();
        commonData.pageURL = window.location.href;
        commonData.domID = domId;
        commonData.domName = domName;
        commonData.domURL = window.location.href;
        handle(commonData, customData);
    }
    //点击事件
    function clickEvent(cnt, that, moduleID) {
        var ptype = $("#ip-page-type").val();
        if (ptype == "pindex") {
            //详情页
            var customData = {
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
            if (cnt == "fileDetailUpDown" || cnt == "fileDetailMiddleDown" || cnt == "fileDetailBottomDown") {
                customData.downType = "";
                if (cnt == "fileDetailUpDown") {
                    clickCenter("SE003", "fileDetailDownClick", "fileDetailUpDown", "资料详情页顶部立即下载", customData);
                } else if (cnt == "fileDetailMiddleDown") {
                    clickCenter("SE003", "fileDetailDownClick", "fileDetailMiddleDown", "资料详情页中部立即下载", customData);
                } else if (cnt == "fileDetailBottomDown") {
                    clickCenter("SE003", "fileDetailDownClick", "fileDetailBottomDown", "资料详情页底部立即下载", customData);
                }
                delete customData.downType;
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
            } else if (cnt == "fileDetailComment") {
                clickCenter("SE006", "fileDetailCommentClick", "fileDetailComment", "资料详情页评论", customData);
            } else if (cnt == "fileDetailScore") {
                var score = that.find(".on:last").text();
                customData.fileScore = score ? score : "";
                clickCenter("SE007", "fileDetailScoreClick", "fileDetailScore", "资料详情页评分", customData);
                delete customData.fileScore;
            }
        }
        if (cnt == "payFile") {
            var customData = {
                orderID: method.getParam("orderNo") || "",
                couponID: $(".pay-coupon-wrap").attr("vid") || "",
                coupon: $(".pay-coupon-wrap p.chose-ele").text() || "",
                fileID: "",
                fileName: "",
                fileCategoryID: "",
                fileCategoryName: "",
                filePayType: "",
                fileFormat: "",
                fileProduceType: "",
                fileCooType: "",
                fileUploaderID: "",
                filePrice: "",
                fileSalePrice: ""
            };
            var bf = method.getCookie("bf");
            if (bf) {
                trans(JSON.parse(bf), customData);
            }
            clickCenter("SE008", "payFileClick", "payFile", "支付页-付费资料-立即支付", customData);
        } else if (cnt == "payVip") {
            var customData = {
                orderID: method.getParam("orderNo") || "",
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
                keyWords: $("#scondition").val()
            };
            clickCenter("SE016", "normalClick", "searchResultClick", "搜索结果页点击", customData);
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
            customData.moduleID = moduleID;
            clickCenter("SE006", "modelView", "", "", customData);
        } else if (cnt == "similarFileClick") {
            customData = {
                fileID: window.pageConfig.params.g_fileId,
                fileName: window.pageConfig.params.file_title,
                fileCategoryID: window.pageConfig.params.classid1 + "||" + window.pageConfig.params.classid2 + "||" + window.pageConfig.params.classid3,
                fileCategoryName: window.pageConfig.params.classidName1 + "||" + window.pageConfig.params.classidName2 + "||" + window.pageConfig.params.classidName3,
                filePayType: payTypeMapping[window.pageConfig.params.file_state]
            };
            clickCenter("SE017", "fileListNormalClick", "similarFileClick", "资料列表常规点击", customData);
        } else if (cnt == "underSimilarFileClick") {
            clickCenter("SE017", "fileListNormalClick", "underSimilarFileClick", "点击底部猜你喜欢内容时", customData);
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
        }
    }
    module.exports = {
        clickEvent: function($this) {
            var cnt = $this.attr(config.BILOG_CONTENT_NAME);
            console.log("cnt-导出的:", cnt);
            if (cnt) {
                setTimeout(function() {
                    clickEvent(cnt, $this);
                });
            }
        },
        viewExposure: function($this, moduleID) {
            var cnt = "viewExposure";
            if (cnt) {
                setTimeout(function() {
                    clickEvent(cnt, $this, moduleID);
                });
            }
        },
        searchResult: searchResult
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

define("dist/report/init", [ "dist/report/handler", "dist/cmd-lib/util", "dist/report/columns", "dist/report/config", "dist/application/method" ], function(require, exports, module) {
    require("dist/report/handler");
});

define("dist/report/handler", [ "dist/cmd-lib/util", "dist/report/columns", "dist/report/config", "dist/application/method" ], function(require, exports, module) {
    // var $ = require("$");
    var util = require("dist/cmd-lib/util");
    var columns = require("dist/report/columns");
    //上报参数配置
    var config = require("dist/report/config");
    //参数配置
    var method = require("dist/application/method");
    var cid;
    function Report(opt, con) {
        this.options = $.extend(true, columns, opt);
        this.config = $.extend(true, config, con);
        this.init();
    }
    Report.prototype = {
        //初始化
        init: function() {
            // this.getIpAddress();
            this.client();
            this.send(0, this.format());
            this.send(2, new Date().getTime());
            if (gio && pageConfig.report) {
                gio("page.set", pageConfig.report);
            }
        },
        //初始化获取客户端信息
        //op_cid_uid_ptype_usource_fsource_ftype_format_cate_cateName_cate1_cate2_ip_province_city_clickName_time_timestamp
        client: function() {
            var uid = "";
            if (pageConfig.page) {
                uid = pageConfig.page.uid || "";
            }
            if (!uid && method.getCookie(this.config.COOKIE_CUK)) {
                uid = "logined";
            }
            this.options.uid = uid;
            if (method.getCookie(this.config.COOKIE_CIDE)) {
                cid = method.getCookie(this.config.COOKIE_CIDE);
            } else {
                cid = new Date().getTime() + "" + Math.random();
                method.setCookieWithExpPath(this.options.cid, cid, 1e3 * 60 * 60 * 24 * 30, "/");
            }
            this.options.usource = util.getReferrer();
            this.options.cid = cid;
            this.clickWatch();
        },
        //获取ip地址
        getIpAddress: function() {
            var that = this;
            $.getScript("//ipip.iask.cn/iplookup/search?format=js", function(response, status) {
                if (status === "success") {
                    that.options = $.extend(true, that.options, {
                        city: remote_ip_info["cityCode"],
                        province: remote_ip_info["provinceCode"],
                        ip: remote_ip_info["ip"]
                    });
                } else {
                    console.error("ipip获取ip信息error");
                }
            });
        },
        //监听点击事件
        //op_cid_uid_ptype_usource_fsource_ftype_format_cate_cateName_cate1_cate2_ip_province_city_clickName_time_timestamp
        clickWatch: function() {
            var that = this;
            $(document).delegate("." + this.config.EVENT_NAME, "click", function(event) {
                //动态绑定点击事件
                var cnt = $(this).attr(that.config.CONTENT_NAME);
                //上报事件类型
                that.setCurrEventCon(cnt);
                if ($.browser.msie && $.browser.version <= 8 && that.mousePosition(event).x >= 0 || event.originalEvent && event.originalEvent.isTrusted) {
                    //判断用户点击 、及内容不能为空
                    if (cnt) {
                        that.push([ that.config.CONTENT_NAME, cnt ]);
                    }
                }
                $(this).trigger("init", event);
            });
        },
        //action 事件名称 data 上报数据
        gioTrack: function(action, data) {
            if (gio && data) {
                gio("track", action, data);
            }
        },
        //页面级埋点   上报数据
        // gio('page.set','prodName_pvar','可口可乐')
        // 或
        // gio('page.set',{'prodName_pvar','可口可乐'})
        gioPage: function(keyorObj) {
            if (gio && keyorObj) {
                gio("page.set", keyorObj);
            }
        },
        //推送数据
        push: function(d, callback) {
            if (d instanceof Array) {
                if (d && d.length > 1) {
                    //新旧兼容
                    d.shift();
                    if (d.length > 0 && d[0] == this.config.eventCookieFlag) {
                        //
                        d.shift();
                        this.handleCookieFlag(d.join("_"));
                    }
                    this.options.clickName = d[0];
                }
            }
            var reportData = this.format();
            this.send(1, reportData);
            //1 点击事件上报
            callback && callback(reportData);
        },
        //cookie标示 处理
        handleCookieFlag: function(val) {
            try {
                var cookie = method.getCookie(this.config.COOKIE_FLAG);
                if (cookie) {
                    var parse = JSON.parse(cookie);
                    parse["v"] = val;
                    parse["t"] = new Date().getTime();
                    //JSON.stringify  在ie低版本下有报错需要改进
                    method.setCookieWithExpPath(this.config.COOKIE_FLAG, JSON.stringify(parse), 1e3 * 60 * 50, "/");
                }
            } catch (e) {}
        },
        //数据格式化[op_cid_uid_ptype_usource_fsource_ftype_format_cate_cateName_cate1_cate2_ip_province_city_clickName_time_timestamp];
        format: function() {
            try {
                var res = this.options;
                var data = [ res.cid, res.uid, res.ptype, res.usource, res.fsource, res.ftype, res.format, res.cate, res.cateName, res.cate1, res.cate2, res.ip, res.province, res.city, res.clickName, res.time, res.timestamp ];
                return data.join("_");
            } catch (e) {}
        },
        //数据上报
        send: function(type, browserData) {
            method.get(this.config.SERVER_URL + "?" + type + "_" + encodeURIComponent(browserData), function() {}, "");
        },
        //获取事件点击位置 用以达到判断 是否是用户点击事件
        mousePosition: function(ev) {
            try {
                ev = ev || window.event;
                if (ev.pageX || ev.pageY) {
                    return {
                        x: ev.pageX,
                        y: ev.pageY
                    };
                }
                return {
                    x: ev.clientX + document.body.scrollLeft - document.body.clientLeft,
                    y: ev.clientY + document.body.scrollTop - document.body.clientTop
                };
            } catch (e) {}
        },
        //浏览文档数据上报
        uActionReport: function(browserData) {
            $.get(this.uActionUrl + "?" + encodeURIComponent(browserData) + "_" + new Date().getTime(), function(response, status) {});
        },
        //当前点击内容
        setCurrEventCon: function(cnt) {
            method.setCookieWithExpPath("_dpclkcnt", cnt, 5 * 60 * 1e3, "/");
        }
    };
    window._dataReport = new Report(window.pageConfig.report);
    //点击数据全局对象 兼容登录系统埋点
    window.__pc__ = window._dataReport;
    try {
        var _hmt = _hmt || [];
        (function() {
            var hm = document.createElement("script");
            hm.src = "//hm.baidu.com/hm.js?adb0f091db00ed439bf000f2c5cbaee7";
            var s = document.getElementsByTagName("script")[0];
            s.parentNode.insertBefore(hm, s);
        })();
    } catch (e) {}
});

define("dist/report/columns", [], function(require, exports, module) {
    return {
        cid: "",
        //客户端id
        uid: "",
        //用户id
        ptype: "",
        //页面类型
        usource: "",
        //用户来源
        fsource: "",
        //页面来源
        ftype: "",
        //页面二级类型
        format: "",
        //页面格式
        cate: "",
        //分类
        cateName: "",
        //分类名称
        cate1: "",
        //1级分类
        cate2: "",
        //2级分类
        ip: "",
        //ip
        province: "",
        //省份
        city: "",
        //城市
        clickName: "",
        //点击事件
        time: "",
        //时间
        timestamp: ""
    };
});

define("dist/application/helper", [], function(require, exports, module) {
    template.helper("encodeValue", function(value) {
        return encodeURIComponent(encodeURIComponent(value));
    });
});

define("dist/common/gioPageSet", [], function(require, exports, module) {
    module.exports = {
        gioPageSet: function(data) {
            //页面级 埋点上报
            var referrer = document.referrer;
            var href = window.location.href;
            var sourcePage = null;
            var currentPageType = null;
            var config = {
                home: new RegExp("ishare.iask.sina.com.cn/").test(referrer),
                homeCurrent: new RegExp("ishare.iask.sina.com.cn/").test(href),
                ishareindex: "ishareindex",
                f: new RegExp("ishare.iask.sina.com.cn/f/").test(referrer),
                fCurrent: new RegExp("ishare.iask.sina.com.cn/f/").test(href),
                pindex: "pindex",
                c: new RegExp("ishare.iask.sina.com.cn/c/").test(referrer),
                cCurrent: new RegExp("ishare.iask.sina.com.cn/c/").test(href),
                pcat: "pcat",
                search: new RegExp("ishare.iask.sina.com.cn/search/").test(referrer),
                searchCurrent: new RegExp("ishare.iask.sina.com.cn/search/").test(href),
                psearch: "psearch",
                ucenter: new RegExp("ishare.iask.sina.com.cn/ucenter/").test(referrer),
                ucenterCurrent: new RegExp("ishare.iask.sina.com.cn/ucenter/").test(href),
                puser: "puser",
                t: new RegExp("ishare.iask.sina.com.cn/t/").test(referrer),
                tCurrent: new RegExp("ishare.iask.sina.com.cn/t/").test(href),
                ptag: "ptag",
                d: new RegExp("ishare.iask.sina.com.cn/d/").test(referrer),
                dCurrent: new RegExp("ishare.iask.sina.com.cn/d/").test(href),
                landing: "landing",
                themeindex: new RegExp("ishare.iask.sina.com.cn/theme").test(referrer),
                themeindexCurrent: new RegExp("ishare.iask.sina.com.cn/theme").test(href),
                theme: "theme",
                u: new RegExp("ishare.iask.sina.com.cn/u/").test(referrer),
                uCurrent: new RegExp("ishare.iask.sina.com.cn/u/").test(href),
                n: new RegExp("ishare.iask.sina.com.cn/n/").test(referrer),
                nCurrent: new RegExp("ishare.iask.sina.com.cn/n/").test(href),
                popenuser: "popenuser"
            };
            //来源页面
            if (config.search) {
                sourcePage = config.psearch;
            } else if (config.themeindex) {
                sourcePage = config.theme;
            } else if (config.d) {
                sourcePage = config.landing;
            } else if (config.t) {
                sourcePage = config.ptag;
            } else if (config.ucenter) {
                sourcePage = config.puser;
            } else if (config.c) {
                sourcePage = config.pcat;
            } else if (config.f) {
                sourcePage = config.pindex;
            } else if (config.u || config.n) {
                sourcePage = config.popenuser;
            } else if (config.home) {
                sourcePage = config.ishareindex;
            } else {
                sourcePage = "other";
            }
            //页面类型
            if (config.searchCurrent) {
                currentPageType = config.psearch;
            } else if (config.themeindexCurrent) {
                currentPageType = config.theme;
            } else if (config.dCurrent) {
                currentPageType = config.landing;
            } else if (config.tCurrent) {
                currentPageType = config.ptag;
            } else if (config.ucenterCurrent) {
                currentPageType = config.puser;
            } else if (config.cCurrent) {
                currentPageType = config.pcat;
            } else if (config.fCurrent) {
                currentPageType = config.pindex;
            } else if (config.uCurrent || config.nCurrent) {
                currentPageType = config.popenuser;
            } else if (config.homeCurrent) {
                currentPageType = config.ishareindex;
            } else {
                currentPageType = "other";
            }
            //currentUrl_pvar  sourcePage_pvar currentPageType_pvar     这三个参数是页面级埋点 必传参数
            // 其他参数  的 值  由调用 页面确认；
            var params = {
                currentUrl_pvar: decodeURIComponent(decodeURIComponent(href)),
                // 当前地址
                sourcePage_pvar: sourcePage,
                //来源页面
                currentPageType_pvar: currentPageType
            };
            for (var key in data) {
                params[key] = data[key];
            }
            __pc__.gioPage(params);
        }
    };
});
