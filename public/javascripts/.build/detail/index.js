/**
 * 详情页首页
 */
define("dist/detail/index", [ "../application/suspension", "../application/method", "../application/checkLogin", "../application/api", "../application/urlConfig", "../application/login", "../cmd-lib/myDialog", "../cmd-lib/toast", "../application/iframe/iframe-messenger", "../application/iframe/messenger", "../common/baidu-statistics", "../application/app", "../application/loadSentry", "../application/element", "../application/template", "../application/extend", "../application/effect", "../common/loginType", "../application/helper", "../application/single-login", "../cmd-lib/util", "./common", "./template/pay_btn_tmp.html", "./template/pay_middle_tmp.html", "./template/pay_header.tmp.html" ], function(require, exports, module) {
    // var $ = require('$');
    require("../application/suspension");
    var app = require("../application/app");
    var api = require("../application/api");
    var method = require("../application/method");
    var utils = require("../cmd-lib/util");
    var login = require("../application/checkLogin");
    var common = require("./common");
    var fileName = window.pageConfig && window.pageConfig.page && window.pageConfig.page.fileName;
    var page = window.pageConfig.page;
    var params = window.pageConfig.params;
    var handleBaiduStatisticsPush = require("../common/baidu-statistics").handleBaiduStatisticsPush;
    handleBaiduStatisticsPush("fileDetailPageView");
    iask_web.track_event("NE030", "pageTypeView", "page", {
        pageID: "FD",
        pageName: "资料详情"
    });
    iask_web.track_event("SE002", "fileDetailPageView", "page", {
        fileID: params.g_fileId,
        fileName: page.fileName,
        salePrice: params.productPrice,
        saleType: params.productType,
        fileCategoryID: params.classid1 + "||" + params.classid2 + "||" + params.classid3,
        fileCategoryName: params.classidName1 + "||" + params.classidName2 + "||" + params.classidName3
    });
    // 初始化显示
    initShow();
    // 初始化绑定
    eventBinding();
    function initShow() {
        if (fileName) {
            fileName = fileName.length > 12 ? fileName.slice(0, 12) + "..." : fileName;
        }
        $("#search-detail-input").attr("placeholder", fileName || "与人沟通的十大绝招");
        // 初始化显示
        pageInitShow();
        // 访问记录
        storeAccessRecord();
        // 获取收藏的状态
        getCollectState();
        fileBrowseReportBrowse();
        // 资料详情上报服务端
        // 初始化权益
        getUserVipRights();
    }
    // 页面加载
    function pageInitShow() {
        if (method.getCookie("cuk")) {
            login.getLoginData(function(data) {
                common.afterLogin(data);
                window.pageConfig.userId = data.userId;
                window.pageConfig.email = data.email || "";
                //已经登录 并且有触发支付点击
                if (method.getCookie("event_data")) {
                    //唤起支付弹框
                    goPage(event);
                    method.delCookie("event_data", "/");
                }
            });
        } else {
            var params = window.pageConfig.params;
            if ((params.productType == "4" || params.productType == "5") && params.vipDiscountFlag == "1") {
                // params.g_permin === '3' && params.vipDiscountFlag && params.ownVipDiscountFlag
                // 如果没有登陆情况，且文档是付费文档且支持打折，更改页面价格
                var originalPrice = params.moneyPrice;
                $(".js-original-price").html(originalPrice);
                var savePrice = (params.moneyPrice * .8).toFixed(2);
                $(".vip-save-money").html(savePrice);
                $(".js-original-price").html(savePrice);
            }
        }
        // 意见反馈的url
        var url = "/node/feedback/feedback.html?url=" + encodeURIComponent(location.href);
        $(".user-feedback").attr("href", url);
        var $iconDetailWrap = $(".icon-detail-wrap");
        //  付费文档图标
        if ($iconDetailWrap.length) {
            $(window).on("scroll", function() {
                var $this = $(this);
                var top = $this.scrollTop();
                if (top >= 180) {
                    $iconDetailWrap.addClass("icon-text-fixed");
                    $(".icon-text-fixed").css("left", $(".bd-wrap")[0].offsetLeft - 6);
                } else {
                    $iconDetailWrap.removeClass("icon-text-fixed");
                    $iconDetailWrap.css("left", "-6px");
                }
            });
        }
    }
    // 事件绑定
    function eventBinding() {
        var $more_nave = $(".more-nav"), $search_detail_input = $("#search-detail-input"), $detail_lately = $(".detail-lately"), $cate_inner = $(".header-cate"), $slider_control = $(".slider-control");
        // 头部分类
        $cate_inner.on("mouseover", function() {
            var $this = $(".cate-menu");
            if (!$this.hasClass("hover")) {
                $this.addClass("hover");
            }
        });
        $cate_inner.on("mouseleave", function() {
            var $this = $(".cate-menu");
            if ($this.hasClass("hover")) {
                $this.removeClass("hover");
            }
        });
        // 顶部分类
        $more_nave.on("mouseover", function() {
            var $this = $(this);
            if (!$this.hasClass("hover")) {
                $(this).addClass("hover");
            }
        });
        $more_nave.on("mouseleave", function() {
            var $this = $(this);
            if ($this.hasClass("hover")) {
                $(this).removeClass("hover");
            }
        });
        // 搜索
        $search_detail_input.on("keyup", function(e) {
            var keycode = e.keyCode;
            if ($(this).val()) {
                getBaiduData($(this).val());
            } else {}
            if (keycode === 13) {
                searchFn($(this).val());
            }
        });
        $search_detail_input.on("focus", function() {
            $(".detail-search-info").hide();
            var lately_list = $(".lately-list"), len = lately_list.find("li").length;
            if (len > 0) {
                $detail_lately.show();
            } else {
                $detail_lately.hide();
            }
            return true;
        });
        $(".detail-search-info").on("click", function() {
            var _val = $search_detail_input.val() || $search_detail_input.attr("placeholder");
            searchFn(_val);
        });
        $(document).on("click", ":not(.new-search)", function(event) {
            var $target = $(event.target);
            if ($target.hasClass("new-input")) {
                return;
            }
            $detail_lately.hide();
        });
        $detail_lately.on("click", function(event) {
            event.stopPropagation();
        });
        // 登录
        $("#detail-unLogin,.login-open-vip").on("click", function() {
            if (!method.getCookie("cuk")) {
                login.notifyLoginInterface(function(data) {
                    common.afterLogin(data);
                });
            }
        });
        // 退出
        $(".btn-exit").on("click", function() {
            login.ishareLogout();
        });
        $("#search-detail-input").on("focus", function() {
            $(".detail-search-info").hide();
        });
        // 点击checkbox
        $("#commentCheckbox").on("click", function() {
            $(this).find(".check-con").toggleClass("checked");
        });
        // 显示举报窗口
        $(".report-link").on("click", function() {
            method.compatibleIESkip("/node/feedback/feedback.html" + "?url=" + location.href, true);
        });
        // 取消或者关注
        $("#btn-collect").on("click", function() {
            if (!method.getCookie("cuk")) {
                login.notifyLoginInterface(function(data) {
                    common.afterLogin(data);
                });
                return;
            } else {
                var fid = $(this).attr("data-fid");
                setCollect($(this));
            }
        });
        // 查找相关资料
        $(".detail-fixed").on("click", "#searchRes", function() {
            // 寻找相关资料  
            sendEmail();
        });
        // 现在把 下载和购买逻辑都写在 download.js中 通过 后台接口的状态码来判断下一步操作
        $("body").on("click", ".js-buy-open", function(e) {
            var type = $(this).data("type");
            if (!method.getCookie("cuk")) {
                //上报数据相关
                if ($(this).attr("loginOffer")) {
                    method.setCookieWithExpPath("_loginOffer", $(this).attr("loginOffer"), 1e3 * 60 * 60 * 1, "/");
                }
                method.setCookieWithExpPath("enevt_data", type, 1e3 * 60 * 60 * 1, "/");
                if (pageConfig.params.productType == "5" && type == "file") {} else {
                    login.notifyLoginInterface(function(data) {
                        window.pageConfig.userId = data.userId;
                        common.afterLogin(data, {
                            type: type,
                            data: data,
                            callback: goPage
                        });
                    });
                }
            } else {
                goPage(type);
            }
        });
    }
    function sendEmail() {
        var params = window.pageConfig.params;
        iask_web.track_event("NE029", "fileNomalClick", "click", {
            domID: "sendemail",
            domName: "发送邮箱",
            fileID: params.g_fileId,
            fileName: params.file_title,
            saleType: params.productType
        });
        $("body,html").animate({
            scrollTop: $("#littleApp").offset().top - 60
        }, 200);
        // var reward = window.pageConfig.reward;
        // if (reward.value == "-1") { // 老用户VIP正常弹起
        //     $("#dialog-box").dialog({
        //         html: $('#reward-mission-pop').html(),
        //     }).open();
        // } else if (reward.unit == 1 && reward.value == '0') { // 当天次数用完
        //     $("#dialog-box").dialog({
        //         html: $('#reward-error-pop').html(),
        //     }).open();
        // } else if (reward.unit == 0 && reward.value == '0') { // 一次性用完
        //     $("#dialog-box").dialog({
        //         html: $('#reward-error1-pop').html(),
        //     }).open();
        // } else if (reward.value > 0) { // 正常弹起
        //     $("#dialog-box").dialog({
        //         html: $('#reward-success-pop').html()
        //           .replace(/\$value/, reward.value),
        //     }).open();
        // }
        $("#dialog-box").dialog({
            html: $("#reward-mission-pop").html()
        }).open();
        setTimeout(bindEventPop, 500);
    }
    // 进入页面获取该用户VIP权益点
    function getUserVipRights() {
        if (method.getCookie("cuk")) {
            var params = {
                memberCodeList: [ "COPY", "FREE_ADV" ]
            };
            $.ajax("/gateway/rights/vip/allMemberDetail", {
                type: "POST",
                data: JSON.stringify(params),
                dataType: "json",
                contentType: "application/json"
            }).done(function(res) {
                if (res.code == 0) {
                    // 获取主站是否可以复制SVG，展示广告的功能
                    var memberList = [], isVip = false, freeAdv = false, copy = false;
                    for (var i = 0, len = res.data.length; i < len; i++) {
                        if (res.data[i].site == 4) {
                            memberList = res.data[i].memberPointList;
                            isVip = res.data[i].isVip;
                        }
                    }
                    if (memberList && memberList.length) {
                        for (var i = 0, len = memberList.length; i < len; i++) {
                            var item = memberList[i];
                            if (item.code == "FREE_ADV") {
                                // 是否免广告
                                freeAdv = isVip && item.value == "1";
                            }
                            if (item.code == "COPY") {
                                // 是否可复制
                                copy = isVip && item.value == "1";
                            }
                        }
                    }
                    window.pageConfig.freeAdv = freeAdv;
                    window.pageConfig.copy = copy;
                    if (freeAdv) {
                        // 如果去广告
                        $(".adv-container").each(function($index, $element) {
                            $($element).remove();
                        });
                    }
                    if (copy) {
                        // 如果可以复制
                        $(".detail-holder").each(function($index, $element) {
                            $($element).remove();
                        });
                    }
                }
            }).fail(function(e) {
                console.error(JSON.stringify(e));
            });
        }
    }
    // 查询单个站点单个权限信息
    function getWebsitVipRightInfo() {
        var params = {
            site: 4,
            memberCode: "REWARD"
        };
        $.ajax("/gateway/rights/vip/memberDetail", {
            type: "POST",
            data: JSON.stringify(params),
            dataType: "json",
            contentType: "application/json"
        }).done(function(res) {
            if (res.code == 0) {
                console.log(res.data);
                window.pageConfig.reward = {
                    unit: res.data.memberPoint ? res.data.memberPoint.unit : 1,
                    value: res.data.memberPoint ? res.data.memberPoint.value : 0
                };
            }
        }).fail(function(e) {
            $.toast({
                text: "发送失败，请重试",
                delay: 2e3
            });
        });
    }
    function bindEventPop() {
        console.log(6666);
        // 绑定邮箱的值
        if ($(".m-reward-pop #email")) {
            $(".m-reward-pop #email").val(window.pageConfig.email);
        }
        // 绑定关闭悬赏任务弹窗pop
        $(".m-reward-pop .close-btn").on("click", function() {
            closeRewardPop();
        });
        // 绑定我明白了按钮回调
        $(".m-reward-pop .understand-btn").on("click", function() {
            closeRewardPop();
        });
        // submit提交
        $(".m-reward-pop .submit-btn").on("click", function() {
            var userId = window.pageConfig.userId;
            if (!userId) {
                closeRewardPop();
                $.toast({
                    text: "该功能仅对VIP用户开放",
                    delay: 3e3
                });
                return;
            }
            var reg = /^[0-9a-zA-Z_.-]+[@][0-9a-zA-Z_.-]+([.][a-zA-Z]+){1,2}$/;
            var mailVal = $(".m-reward-pop .form-ipt").val();
            var tips = $(".m-reward-pop .form-verify-tips");
            tips.hide();
            if (!reg.test(mailVal)) {
                tips.show();
                return;
            }
            var params = {
                userId: userId,
                fid: window.pageConfig.params.g_fileId,
                email: mailVal,
                channelSource: 4
            };
            $.ajax("/gateway/content/sendmail/findFile", {
                type: "POST",
                data: JSON.stringify(params),
                dataType: "json",
                contentType: "application/json"
            }).done(function(res) {
                if (res.code == 0) {
                    closeRewardPop();
                    $.toast({
                        text: "发送成功",
                        delay: 2e3
                    });
                } else if (res.code == 401100) {
                    $.toast({
                        text: "该功能仅对VIP用户开放",
                        delay: 2e3
                    });
                } else {
                    $.toast({
                        text: "发送失败，请重试",
                        delay: 2e3
                    });
                }
            }).fail(function(e) {
                $.toast({
                    text: "发送失败，请重试",
                    delay: 2e3
                });
            });
        });
        // 关闭任务pop
        function closeRewardPop() {
            $(".common-bgMask").hide();
            $(".detail-bg-mask").hide();
            $("#dialog-box").hide();
        }
    }
    function fileBrowseReportBrowse() {
        $.ajax({
            headers: {
                Authrization: method.getCookie("cuk")
            },
            url: api.reportBrowse.fileBrowseReportBrowse,
            type: "POST",
            data: JSON.stringify({
                terminal: "0",
                fid: window.pageConfig.params && window.pageConfig.params.g_fileId,
                fileUid: window.pageConfig.page && window.pageConfig.page.uid
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function(res) {
                if (res.code == "0") {}
            }
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
    $(function() {
        ////详情页用户展开
        //详情页获取焦点
        var $detailHeader = $(".new-detail-header");
        var headerHeight = $detailHeader.height();
        var $headerInput = $detailHeader.find(".new-input");
        inputFocus($headerInput, "new-search-focus", ".new-search");
        inputFocus(".evaluate-textarea textarea", "evaluate-textarea-focus", ".evaluate-textarea");
        //详情页头部悬浮
        var fixEle = $("#fix-right");
        var $fixBar = $(".detail-fixed-con");
        var $dFooter = $(".detail-footer");
        var fixHeight = $detailHeader.height();
        var documentInnerHeight = $(window).height();
        var fixRight = 1113;
        if (fixEle.length) {
            var fixTop = fixEle.offset().top - headerHeight;
        }
        $(window).scroll(function() {
            var pwDetail = $(".doc-main-br").height();
            var detailTop = $(this).scrollTop();
            var fixStart = $dFooter.offset().top - fixHeight - $dFooter.height();
            if (detailTop > headerHeight) {
                $detailHeader.addClass("new-detail-header-fix");
                $(".coupon-info-top").hide();
            } else {
                $detailHeader.removeClass("new-detail-header-fix");
                // 未登陆，且第一次弹出
                if (!localStorage.getItem("firstCoupon") && method.getCookie("cuk")) {
                    $(".coupon-info-top").show();
                }
            }
            //右侧悬浮   右侧过长悬浮 样式很怪 先暂时注释
            if (detailTop > fixHeight + fixEle.height()) {
                // $('.fix-right-bannertop').hide()
                // $('.fix-right-bannerbottom').hide()
                fixEle.css({
                    position: "fixed",
                    top: headerHeight,
                    "z-index": "75"
                });
                if (detailTop > pwDetail - documentInnerHeight) {
                    var tempHeight = pwDetail - fixRight - 15;
                    fixEle.css({
                        position: "absolute",
                        top: tempHeight
                    });
                } else {}
            } else {
                fixEle.removeAttr("style");
            }
            //底部悬浮展示文档
            if (detailTop > fixStart) {
                $fixBar.find(".operation").hide();
                $fixBar.find(".data-item").show();
            } else {
                $fixBar.find(".operation").show();
                $fixBar.find(".data-item").hide();
            }
        });
        // 关闭底部优惠券弹窗
        function closeCouponAD() {
            $(".pc-tui-coupon .btn-close").click(function() {
                $(".pc-tui-coupon").hide();
            });
        }
        //关闭头部优惠券赠送信息
        closeHeadCouponTip();
        function closeHeadCouponTip() {
            $(".coupon-info-top").on("click", ".btn-no-user", function() {
                $(".coupon-info-top").hide();
                localStorage.setItem("firstCoupon", 1);
            });
        }
        $(".firstLoginHook").click(function() {
            $(".pc-tui-coupon").hide();
        });
        //详情页分类展开
        elementHover($detailHeader.find(".more-nav"), null, "hover");
    });
    // 新收藏或取消收藏接口
    function setCollect(_this) {
        var params = window.pageConfig.params;
        iask_web.track_event("NE029", "fileNomalClick", "click", {
            domID: "sucMark",
            domName: "收藏和取消收藏",
            fileID: params.g_fileId,
            fileName: params.file_title,
            saleType: params.productType
        });
        $.ajax({
            headers: {
                Authrization: method.getCookie("cuk")
            },
            url: api.special.setCollect,
            type: "post",
            data: JSON.stringify({
                fid: window.pageConfig.params.g_fileId,
                source: 0
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function(res) {
                iask_web.track_event("NE029", "fileNomalClick", "click", {
                    domID: "sucMark",
                    domName: _this.hasClass("btn-collect-success") ? "取消收藏" : "收藏成功",
                    fileID: params.g_fileId,
                    fileName: params.file_title,
                    saleType: params.productType
                });
                if (res.code == "0") {
                    $.toast({
                        text: _this.hasClass("btn-collect-success") ? "取消收藏成功" : "收藏成功"
                    });
                    _this.hasClass("btn-collect-success") ? _this.removeClass("btn-collect-success") : _this.addClass("btn-collect-success");
                } else {
                    $.toast({
                        text: _this.hasClass("btn-collect-success") ? "取消收藏失败" : "收藏失败"
                    });
                }
            }
        });
    }
    function getCollectState() {
        //获取收藏的状态
        $.ajax({
            headers: {
                Authrization: method.getCookie("cuk")
            },
            url: api.special.getCollectState,
            type: "get",
            data: {
                fid: window.pageConfig.params.g_fileId,
                uid: window.pageConfig.page.uid
            },
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function(res) {
                if (res.code == "0") {
                    res.data.hasCollect ? $("#btn-collect").addClass("btn-collect-success") : $("#btn-collect").removeClass("btn-collect-success");
                }
            }
        });
    }
    // 搜集访问记录
    function storeAccessRecord() {
        // 存储浏览记录
        var access = pageConfig.access, accessKey = method.keyMap.ishare_detail_access;
        if (pageConfig && access) {
            var fileArr = method.getLocalData(accessKey);
            if (!fileArr || fileArr.length < 1) {
                fileArr = [];
                fileArr.push(access);
                method.setLocalData(accessKey, fileArr);
            } else {
                fileArr = handleExistsFile(access.fileId, fileArr);
                fileArr.unshift({
                    fileId: access.fileId,
                    title: access.title,
                    format: access.format,
                    time: new Date().getTime()
                });
                method.setLocalData(accessKey, fileArr);
            }
        }
    }
    /*是否存在文件Id*/
    function handleExistsFile(fileId, fileArr) {
        for (var i = 0; i < fileArr.length; i++) {
            if (fileArr[i].fileId === fileId) {
                fileArr.splice(i, 1);
                break;
            }
        }
        if (fileArr.length === 50) {
            fileArr.pop();
        }
        return fileArr;
    }
    function goPage(type, data) {
        // data 登录后用户信息
        var fid = window.pageConfig.params.g_fileId;
        var format = window.pageConfig.params.file_format;
        var title = window.pageConfig.params.file_title;
        var params = "";
        var ref = utils.getPageRef(fid);
        method.setCookieWithExpPath("rf", JSON.stringify({}), 5 * 60 * 1e3, "/");
        method.setCookieWithExp("f", JSON.stringify({
            fid: fid,
            title: title,
            format: format
        }), 5 * 60 * 1e3, "/");
        if (type === "file") {
            params = "?orderNo=" + fid + "&checkStatus=" + "8" + "&referrer=" + document.referrer;
            method.compatibleIESkip("/pay/payConfirm.html" + params, false);
        } else if (type === "vip") {
            if (data && data.isVip == 1) {
                // 
                sendEmail();
            } else {
                var params = window.pageConfig.params;
                var productType = params.productType;
                var userFileType = params.userFileType;
                var userFilePrice = params.userFilePrice;
                if (productType == "4") {
                    var params = "?fid=" + fid + "&ft=" + format + "&checkStatus=" + "10" + "&name=" + encodeURIComponent(encodeURIComponent(title)) + "&ref=" + ref + "&productType=" + productType + "&userFileType=" + userFileType + "&userFilePrice=" + userFilePrice;
                } else {
                    var params = "?fid=" + fid + "&ft=" + format + "&checkStatus=" + "10" + "&name=" + encodeURIComponent(encodeURIComponent(title)) + "&ref=" + ref;
                }
                method.compatibleIESkip("/pay/vip.html" + params, false);
            }
        } else if (type === "privilege") {
            var params = "?fid=" + fid + "&ft=" + format + "&checkStatus=" + "13" + "&name=" + encodeURIComponent(encodeURIComponent(title)) + "&ref=" + ref;
            method.compatibleIESkip("/pay/privilege.html" + params, false);
        }
    }
    //获取百度数据
    var getBaiduData = function(val) {
        $.getScript("//sp0.baidu.com/5a1Fazu8AA54nxGko9WTAnF6hhy/su?wd=" + encodeURIComponent(val) + "&p=3&cb=window.baidu_searchsug&t=" + new Date().getTime());
    };
    /*百度搜索建议回调方法*/
    window.baidu_searchsug = function(data) {
        var sword = $("#search-detail-input").val();
        sword = sword ? sword.replace(/^\s+|\s+$/gm, "") : "";
        if (sword.length > 0) {
            if (data && data.s) {
                var condArr = data.s;
                if (condArr.length > 0) {
                    var max = Math.min(condArr.length, 10);
                    var _html = [];
                    for (var i = 0; i < max; i++) {
                        var searchurl = "/search/home.html?cond=" + encodeURIComponent(encodeURIComponent(condArr[i]));
                        _html.push('<li><a href="' + searchurl + '"  data-html="' + condArr[i] + '" >' + condArr[i].replace(new RegExp("(" + sword + ")", "gm"), "<span class='search-font'>$1</span>") + "</a></li>");
                    }
                    $(".lately-list").html(_html.join("")).parent(".detail-lately").show();
                }
            }
        }
    };
    //搜索
    var searchFn = function(_val) {
        var sword = _val ? _val.replace(/^\s+|\s+$/gm, "") : "";
        method.compatibleIESkip("/search/home.html?ft=all&cond=" + encodeURIComponent(encodeURIComponent(sword)), false);
    };
    module.exports = {
        goPage: goPage
    };
});