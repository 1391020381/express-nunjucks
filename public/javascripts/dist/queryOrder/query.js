/**
 * 详情页首页
 */
define("dist/queryOrder/query", [ "../application/suspension", "../application/method", "../application/checkLogin", "../application/api", "../application/app", "../application/element", "../application/template", "../application/extend", "../common/bilog", "base64", "../cmd-lib/util", "../report/config", "../report/init", "../report/handler", "../report/columns", "../application/helper", "//static3.iask.cn/resource/js/plugins/pc.iask.login.min", "../detail/common", "../detail/template/pay_btn_tmp.html", "../detail/template/pay_middle_tmp.html", "../detail/template/pay_header.tmp.html", "../common/coupon/couponIssue", "../cmd-lib/toast", "../cmd-lib/loading", "../common/coupon/template/couponCard.html", "../detail/template/head_tip.html" ], function(require, exports, module) {
    // var $ = require('$');
    require("../application/suspension");
    var app = require("../application/app");
    var api = require("../application/api");
    var method = require("../application/method");
    var utils = require("../cmd-lib/util");
    var login = require("../application/checkLogin");
    var common = require("../detail/common");
    require("../common/coupon/couponIssue");
    var payTypeMapping = [ "", "免费", "下载券", "现金", "仅供在线阅读", "VIP免费", "VIP专享" ];
    var entryName_var = payTypeMapping[pageConfig.params.file_state];
    var entryType_var = window.pageConfig.params.isVip == 1 ? "续费" : "充值";
    //充值 or 续费
    /** 用户信息 */
    var userInfo = null;
    /** 文件信息 */
    var fileInfo = {};
    // 初始化显示
    initShow();
    // 初始化绑定
    eventBinding();
    function initShow() {
        // 初始化显示
        pageInitShow();
        // 访问记录
        storeAccessRecord();
        getUserInfos();
    }
    /**
     * 获取用户信息
     */
    function getUserInfos() {
        if (!method.getCookie("cuk")) {
            return;
        }
        method.get("/gateway/pc/usermanage/checkLogin?channelSource=4", function(res) {
            console.log(res, "用户信息");
            if (res.code == 0 && res.data) {
                userInfo = res.data;
            } else {
                userInfo = null;
            }
        });
    }
    function loginPopShow() {
        login.notifyLoginInterface(function(data) {
            common.afterLogin(data);
            // 登陆后判断是否第一次登陆
            getUserInfos();
            login.getUserData(function(res) {
                if (res.loginStatus == 1 && res && method.getCookie("_1st_l") != res.userId) {
                    receiveCoupon(0, 2, res.userIdres && res.userIdres.userId);
                }
            });
        });
    }
    // 点击查询按钮
    $(".btn-search").on("click", function() {
        var order = document.getElementById("scondition").value;
        if (!order) {
            $.toast({
                text: "订单号不可为空"
            });
            return;
        }
        if (method.getCookie("cuk")) {
            // 如果已登录 则去下载
            queryOrder(order);
        } else {
            loginPopShow();
        }
    });
    /* 查询订单接口 */
    function queryOrder(orderNo) {
        var params = {
            orderNo: orderNo,
            userId: userInfo && userInfo.userId,
            nickName: userInfo && userInfo.nickName
        };
        $.ajax({
            url: api.order.bindOrderByOrderNo,
            type: "POST",
            data: JSON.stringify(params),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function(res) {
                $(".before-search-words").css("display", "none");
                if (res.code == "0") {
                    fileInfo = res.data;
                    handleShowInfos();
                    handleFileTypeIcon(fileInfo);
                } else {
                    $(".wrong-search-words").css("display", "block");
                    $(".table-box-outside").css("display", "none");
                    $.toast({
                        text: res.msg
                    });
                }
            }
        });
    }
    /* 查询到订单结果后显示查询结果 */
    function handleShowInfos() {
        var d = new Date(fileInfo.orderTime);
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
        // var data =year + '-' + month + '-' + day + ' ' + hh + ':' + mm + ':' +ss; 
        var clock = year + "-";
        if (month < 10) clock += "0";
        clock += month + "-";
        if (day < 10) clock += "0";
        clock += day + " ";
        if (hh < 10) clock += "0";
        clock += hh + ":";
        if (mm < 10) clock += "0";
        clock += mm;
        var oldTime = clock;
        var newTime = fileInfo.orderTimeStr;
        var time = newTime || oldTime;
        var price = fileInfo.payPrice > 0 ? fileInfo.payPrice / 100 : 0;
        $(".wrong-search-words").css("display", "none");
        $(".table-box-outside").css("display", "block");
        document.getElementsByClassName("file-name-value")[0].innerHTML = fileInfo.goodsName;
        document.getElementsByClassName("price-value")[0].innerHTML = "￥ " + price;
        document.getElementsByClassName("time-value")[0].innerHTML = time;
    }
    function handleFileTypeIcon(fileInfo) {
        resetFileIcon();
        if (fileInfo.format.indexOf("doc") > -1) {
            $(".file-doc-icon").css("display", "block");
        } else if (fileInfo.format.indexOf("xls") > -1) {
            $(".file-excel-icon").css("display", "block");
        } else if (fileInfo.format.indexOf("ppt") > -1) {
            $(".file-ppt-icon").css("display", "block");
        } else if (fileInfo.format.indexOf("txt") > -1) {
            $(".file-text-icon").css("display", "block");
        } else if (fileInfo.format.indexOf("pdf") > -1) {
            $(".file-pdf-icon").css("display", "block");
        }
    }
    function resetFileIcon() {
        $(".file-doc-icon").css("display", "none");
        $(".file-excel-icon").css("display", "none");
        $(".file-pdf-icon").css("display", "none");
        $(".file-ppt-icon").css("display", "none");
        $(".file-text-icon").css("display", "none");
    }
    // 点击下载按钮
    $(".down-btn").on("click", function() {
        downLoad();
    });
    /* 下载接口 */
    function downLoad() {
        var order = document.getElementById("scondition").value;
        var params = {
            orderNo: order,
            userId: userInfo ? userInfo.userId || "" : "",
            fid: fileInfo.fid
        };
        $.ajax({
            url: api.order.unloginOrderDown,
            type: "POST",
            data: JSON.stringify(params),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function(res) {
                if (res.code == "0") {
                    var url = res.data.downUrl;
                    window.location = url;
                } else {
                    $.toast({
                        text: res.msg
                    });
                }
            }
        });
    }
    // 页面加载
    function pageInitShow() {
        if (method.getCookie("cuk")) {
            login.getLoginData(function(data) {
                common.afterLogin(data);
                window.pageConfig.userId = data && data.userId ? data.userId : "";
            });
        } else {
            loginPopShow();
        }
        // 意见反馈的url
        var url = "/feedAndComp/userFeedback?url=" + encodeURIComponent(location.href);
        $(".user-feedback").attr("href", url);
        var $iconDetailWrap = $(".icon-detail-wrap");
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
        setTimeout(function() {
            $(".detail-search-info").show();
        }, 3e4);
    }
    // 事件绑定
    function eventBinding() {
        var $more_nave = $(".more-nav"), $search_detail_input = $("#search-detail-input"), $detail_lately = $(".detail-lately"), $slider_control = $(".slider-control");
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
        $(".btn-new-search").on("click", function() {
            var _val = $search_detail_input.val();
            if (!_val) {
                return;
            }
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
        ////
        //     // 登录
        $(".user-login,.login-open-vip").on("click", function() {
            if (!method.getCookie("cuk")) {
                login.notifyLoginInterface(function(data) {
                    common.afterLogin(data);
                    getUserInfos();
                    // 登陆后判断是否第一次登陆
                    login.getUserData(function(res) {
                        if (res.loginStatus == 1 && res && method.getCookie("_1st_l") != res.userId) {
                            receiveCoupon(0, 2, res && res.userIdres && res.userIdres.userId);
                        }
                    });
                });
            }
        });
        //////
        // 优惠券发放
        if (method.getCookie("cuk")) {
            login.getUserData(function(res) {
                if (res.loginStatus == 1 && res && method.getCookie("_1st_l") != res.userId) {
                    receiveCoupon(0, 2, res.userId);
                }
            });
        }
        // 退出
        $(".btn-exit").on("click", function() {
            login.ishareLogout();
        });
        // 相关推荐—下一页按钮事件
        $slider_control.find(".btn-next").on("click", function() {
            $(".btn-prev").removeClass("btn-disable");
            $(this).addClass("btn-disable");
            relatedPage();
        });
        //关推荐—上一页按钮事件
        $slider_control.find(".btn-prev").on("click", function() {
            $(".btn-next").removeClass("btn-disable");
            $(this).addClass("btn-disable");
            relatedPage();
        });
        // 评论框获得焦点
        $("#commentTxt").on("focus", function() {
            if (method.getCookie("cuk")) {
                login.getLoginData(function(data) {
                    common.userData = data;
                    if (!data.mobile) {
                        login.notifyCheckInterface();
                    }
                });
            }
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
            $("#dialog-box").dialog({
                html: $("#report-file-box").html()
            }).open();
        });
        // 提交举报内容
        $("#dialog-box").on("click", ".report-as", function() {
            var type = $("input[name='radio1']:checked").val();
            if (type === "1") {
                // window.location.href = '/feedAndComp/tort?type=1&pageUrl=' + window.location.href;
                method.compatibleIESkip("/feedAndComp/tort?type=1&pageUrl=" + window.location.href, false);
            } else {
                if (!method.getCookie("cuk")) {
                    $("#bgMask").hide();
                    $("#dialog-box").hide();
                    login.notifyLoginInterface(null);
                } else {
                    var content = $("#report-content").val();
                    method.post(api.normalFileDetail.reportContent, function(res) {
                        if (res.code == 0) {
                            $("#dialog-box").dialog({
                                html: $("#tpl-down-text").html().replace(/\$msg/, "举报成功")
                            }).open();
                        }
                    }, "", "", {
                        type: type,
                        content: content,
                        pageUrl: window.location.href
                    });
                }
            }
        });
        // 发表评论
        $("#comment").on("click", function() {
            commentArticle();
        });
        // 取消或者关注
        $("#btn-collect").on("click", function() {
            if (!method.getCookie("cuk")) {
                login.notifyLoginInterface(function(data) {
                    common.afterLogin(data);
                });
                return;
            }
            if ($(this).hasClass("btn-collect-success")) {
                collectFile(4);
            } else {
                collectFile(3);
            }
        });
        // 文件评分
        $(".star-list").on("click", function(e) {
            if (!method.getCookie("cuk")) {
                login.notifyLoginInterface(function(data) {
                    common.afterLogin(data);
                });
            } else {
                method.get(api.normalFileDetail.hasDownLoad + "?fid=" + window.pageConfig.params.g_fileId, function(res) {
                    if (res.code == 0) {
                        if (res.data) {
                            var data = {
                                fid: pageConfig.params.g_fileId,
                                score: $(this).find("li.on").length
                            };
                            appraiseStar(data);
                        } else {
                            $("#dialog-box").dialog({
                                html: $("#tpl-down-text").html().replace(/\$msg/, "您还未获取该资料,先要获取资料后才可以评分哦!")
                            }).open();
                        }
                    }
                });
            }
        });
        // 查找相关资料
        $("#searchRes").on("click", function() {
            $("body,html").animate({
                scrollTop: $("#littleApp").offset().top - 60
            }, 200);
            $("#dialog-box").dialog({
                html: $("#search-file-box").html().replace(/\$fileId/, window.pageConfig.params.g_fileId)
            }).open();
        });
        $("body").on("click", ".js-buy-open", function(e) {
            var type = $(this).data("type");
            if (!method.getCookie("cuk")) {
                //上报数据相关
                if ($(this).attr("loginOffer")) {
                    method.setCookieWithExpPath("_loginOffer", $(this).attr("loginOffer"), 1e3 * 60 * 60 * 1, "/");
                }
                method.setCookieWithExpPath("enevt_data", type, 1e3 * 60 * 60 * 1, "/");
                if (pageConfig.params.g_permin == 3 && type == "file") {} else {
                    login.notifyLoginInterface(function(data) {
                        common.afterLogin(data);
                        goPage(type);
                    });
                }
            } else {
                goPage(type);
            }
        });
    }
    function receiveCoupon(type, source, userId) {
        var data = {
            source: source,
            type: type
        };
        data = JSON.stringify(data);
        $("body").loading({
            name: "download",
            title: "请求中"
        });
        $.ajax({
            type: "POST",
            url: api.vouchers,
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            data: data,
            success: function(res) {
                if (res.code == 0) {
                    if (res.data.list) {
                        if (res.data.list.length > 0) {
                            var headTip = require("../detail/template/head_tip.html");
                            var _html = template.compile(headTip)({
                                data: res.data
                            });
                            $(".coupon-info-top").html(_html);
                            //第一次登录
                            method.setCookieWithExpPath("_1st_l", userId, 30 * 24 * 60 * 60 * 1e3, "/");
                        } else {
                            utils.showAlertDialog("温馨提示", res.msg);
                        }
                    }
                } else {
                    utils.showAlertDialog("温馨提示", res.msg);
                }
            },
            complete: function() {
                $("body").closeLoading("download");
            }
        });
    }
    function appraiseStar(data) {
        method.post(api.normalFileDetail.appraise, function(res) {
            if (res.code == 0) {
                var $dSuccess = $(".d-success");
                $dSuccess.removeClass("hide");
                setTimeout(function() {
                    $dSuccess.addClass("hide");
                }, 1500);
            }
        }, "", "post", data);
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
        //elementHover(".new-detail-header .user-con",null,"hover");
        //详情页获取焦点
        var $detailHeader = $(".new-detail-header");
        var headerHeight = $detailHeader.height();
        var $headerInput = $detailHeader.find(".new-input");
        inputFocus($headerInput, "new-search-focus", ".new-search");
        inputFocus(".evaluate-textarea textarea", "evaluate-textarea-focus", ".evaluate-textarea");
        //详情页头部悬浮
        var fixEle = $("#fix-right");
        var $fixBar = $(".detail-fixed-con");
        // var $dFooter = $(".detail-footer");
        var fixHeight = $detailHeader.height();
        if (fixEle.length) {
            var fixTop = fixEle.offset().top - headerHeight;
        }
        $(window).scroll(function() {
            var detailTop = $(this).scrollTop();
            // var fixStart = $dFooter.offset().top - fixHeight - $dFooter.height();
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
            //右侧悬浮
            if (detailTop > fixTop) {
                fixEle.css({
                    position: "fixed",
                    top: headerHeight,
                    "z-index": "75"
                });
            } else {
                fixEle.removeAttr("style");
            }
            //底部悬浮展示文档
            // if (detailTop > fixStart) {
            //     $fixBar.find(".operation").hide();
            //     $fixBar.find(".data-item").show();
            // } else {
            //     $fixBar.find(".operation").show();
            //     $fixBar.find(".data-item").hide();
            // }
            $(".header-btn-con").css("display", "none");
            //滚动超过600展示优惠券广告
            if (detailTop > 400 && !localStorage.getItem("loginCouponAd") && !method.getCookie("cuk")) {
                $(".pc-tui-coupon").show();
                localStorage.setItem("loginCouponAd", 1);
                closeCouponAD();
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
    // 添加取消收藏
    function collectFile(cond) {
        method.post(api.normalFileDetail.collect, function(res) {
            if (res.code == 0) {
                var $btn_collect = $("#btn-collect");
                if (cond === 3) {
                    var $dCollect = $(".d-collect");
                    $dCollect.removeClass("hide");
                    setTimeout(function() {
                        $dCollect.addClass("hide");
                    }, 2e3);
                    $btn_collect.addClass("btn-collect-success");
                } else {
                    $btn_collect.removeClass("btn-collect-success");
                }
            } else if (res.code == 40001) {
                setTimeout(function() {
                    method.delCookie("cuk", "/", ".sina.com.cn");
                }, 0);
            }
        }, "", "post", {
            fid: pageConfig.params.g_fileId,
            cond: cond,
            flag: "y"
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
    /**
     * 相关推荐翻页
     */
    function relatedPage() {
        $(".related-data-list").find("li").each(function() {
            if ($(this).is(":hidden")) {
                $(this).show();
            } else {
                $(this).hide();
            }
        });
    }
    // 评论
    function commentArticle() {
        if (!method.getCookie("cuk")) {
            login.notifyLoginInterface(function(data) {
                common.afterLogin(data);
            });
        } else if (method.getCookie("cuk") && !common.userData) {
            login.getLoginData(function(data) {
                common.afterLogin(data);
                commentContent();
            });
        } else {
            commentContent();
        }
    }
    var commentContent = function() {
        var content = $("#commentTxt").val();
        var fid = pageConfig.params.g_fileId;
        var type = "1";
        var anonymous = $("#commentCheckbox .check-con").hasClass("checked");
        if (content.length < 1 || content.length > 200) {
            $(".error-info").text("评论内容长度必须在1~200个字符之间");
            return false;
        }
        method.get(api.normalFileDetail.hasDownLoad + "?fid=" + window.pageConfig.params.g_fileId, function(res) {
            if (res.code == 0) {
                if (res.data) {
                    method.post(api.normalFileDetail.addComment, function(res) {
                        if (res.code == 0) {
                            if (res.data === 0) {
                                /** userId报异常 做非空判断 common.userData.userId*/
                                var nickName = common && common.userData ? common.userData.nickName || "" : "";
                                var userId = common && common.userData ? common.userData.userId || "" : "";
                                var showName = anonymous ? "匿名用户" : nickName;
                                var hrefFlag = anonymous ? '<a class="user-name-con">' + showName + "</a>" : '<a href="/n/' + userId + '.html" class="user-name-con">' + showName + "</a>";
                                $(".evaluate-list").prepend('<li class="cf">' + '<div class="user-img fl"><img src="' + common.userData.weiboImage + '" alt="头像"></div>' + '<div class="user-evaluate cf"><p class="evaluate-txt">' + hrefFlag + content + "</p></div></li>");
                                $("#commentTxt").val("");
                            } else if (res.data === 2) {
                                $(".error-info").text("一天最多评论15条");
                            } else if (res.data === 3) {
                                $(".error-info").text("一分钟之内提交过于频繁");
                            } else if (res.data === 5) {
                                $(".error-info").text("您经评论过");
                            } else if (res.data === 4) {
                                $(".error-info").text("*您的评论包含敏感词,请修改再发布!");
                            }
                        } else if (res.code == 40001) {
                            setTimeout(function() {
                                method.delCookie("cuk", "/", ".sina.com.cn");
                            }, 0);
                        } else {
                            $(".error-info").text(res.msg);
                        }
                    }, "", "", {
                        content: content,
                        fid: fid,
                        type: type,
                        anonymous: anonymous ? 1 : 0
                    });
                } else {
                    $("#dialog-box").dialog({
                        html: $("#tpl-down-text").html().replace(/\$msg/, "您还未获取该资料,先要获取资料后才可以评论哦!")
                    }).open();
                }
            }
        }, "");
    };
    function goPage(type) {
        var fid = window.pageConfig.params.g_fileId;
        var format = window.pageConfig.params.file_format;
        var title = window.pageConfig.params.file_title;
        var params = "";
        var ref = utils.getPageRef(fid);
        //文件信息存入cookie方便gio上报
        // method.setCookieWithExpPath('rf', JSON.stringify(gioPayDocReport), 5 * 60 * 1000, '/');
        method.setCookieWithExp("f", JSON.stringify({
            fid: fid,
            title: title,
            format: format
        }), 5 * 60 * 1e3, "/");
        if (type === "file") {
            params = "?orderNo=" + fid + "&referrer=" + document.referrer;
            // window.location.href = "/pay/payConfirm.html" + params;
            method.compatibleIESkip("/pay/payConfirm.html" + params, false);
        } else if (type === "vip") {
            __pc__.gioTrack("vipRechargeEntryClick", {
                entryName_var: entryName_var,
                entryType_var: entryType_var
            });
            var params = "?fid=" + fid + "&ft=" + format + "&name=" + encodeURIComponent(encodeURIComponent(title)) + "&ref=" + ref;
            // window.open("/pay/vip.html" + params);
            method.compatibleIESkip("/pay/vip.html" + params, true);
        } else if (type === "privilege") {
            var params = "?fid=" + fid + "&ft=" + format + "&name=" + encodeURIComponent(encodeURIComponent(title)) + "&ref=" + ref;
            // window.open("/pay/privilege.html" + params);
            method.compatibleIESkip("/pay/privilege.html" + params, true);
        }
    }
    //获取百度数据
    var getBaiduData = function(val) {
        $.getScript("https://sp0.baidu.com/5a1Fazu8AA54nxGko9WTAnF6hhy/su?wd=" + encodeURIComponent(val) + "&p=3&cb=window.baidu_searchsug&t=" + new Date().getTime());
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
        // window.location.href = "/search/home.html?ft=all&cond=" + encodeURIComponent(encodeURIComponent(sword));
        method.compatibleIESkip("/search/home.html?ft=all&cond=" + encodeURIComponent(encodeURIComponent(sword)), false);
    };
});

define("dist/application/suspension", [ "dist/application/method", "dist/application/checkLogin", "dist/application/api", "dist/application/app", "dist/application/element", "dist/application/template", "dist/application/extend", "dist/common/bilog", "base64", "dist/cmd-lib/util", "dist/report/config", "dist/report/init", "dist/report/handler", "dist/report/columns", "dist/application/helper", "//static3.iask.cn/resource/js/plugins/pc.iask.login.min" ], function(require, exports, module) {
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
                // $(".mui-user-wrap").css("visibility", "visible");
                // $(".mui-sel-wrap").css("visibility", "hidden");
                // $(".mui-collect-wrap").css("visibility", "hidden");
                if (method.getCookie("cuk")) {
                    window.open("/node/rights/vip.html", "target");
                } else {
                    login.notifyLoginInterface(function(data) {
                        refreshDomTree(null, index, data);
                        window.open("/node/rights/vip.html", "target");
                    });
                }
            } else if (index === 1) {
                $(".mui-user-wrap").css("visibility", "hidden");
                $(".mui-sel-wrap").css("visibility", "visible");
            } else if (index === 2) {
                $(".mui-user-wrap").css("visibility", "hidden");
                $(".mui-sel-wrap").css("visibility", "hidden");
                //  $(".mui-collect-wrap").css("visibility", "visible");
                method.compatibleIESkip("/node/upload.html", true);
            } else if (index === 4 || index === 6) {
                $anWrap.animate({
                    right: "-307px"
                }, 200);
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
            // window.open('/pay/vip.html');
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
        $hasLogin.find("img").attr("src", data.weiboImage);
        $top_user_more.find("img").attr("src", data.weiboImage);
        $top_user_more.find("#userName").html(data.nickName);
        $hasLogin.show();
        //右侧导航栏.
        /* ==>头像,昵称 是否会员文案提示.*/
        $(".user-avatar img").attr("src", data.weiboImage);
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
        var accessKey = method.keyMap.ishare_detail_access;
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
     * 我的收藏
     */
    // function myCollect() {
    //     var params = {
    //         pageNum: 1,
    //         pageSize: 20
    //     };
    //     $.ajax(api.user.collect, {
    //         type: "get",
    //         async: false,
    //         data: params,
    //         dataType: "json"
    //     }).done(function (res) {
    //         if (res.code == 0) {
    //             collectRender(res.data)
    //         }
    //     }).fail(function (e) {
    //         console.log("error===" + e);
    //     })
    // }
    //新的我的收藏列表
    function myCollect() {
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
    /**
     * 意见反馈
     * @param list
     */
    $(".op-feedback").on("click", function() {
        var curr = window.location.href;
        // window.open('/feedAndComp/userFeedback?url=' + encodeURIComponent(curr));
        // method.compatibleIESkip('/feedAndComp/userFeedback?url=' + encodeURIComponent(curr),true);
        // window.location.href = '/feedAndComp/userFeedback?url='+encodeURIComponent(curr);
        method.compatibleIESkip("/node/feedback/feedback.html?url=" + encodeURIComponent(curr), true);
    });
    $("#go-back-top").on("click", function() {
        $("body,html").animate({
            scrollTop: 0
        }, 200);
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
    // 联系客服
    $(".btn-mui-contact").on("click", function() {
        _MEIQIA("init");
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
            $(".user-avatar img").attr("src", data.weiboImage);
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

define("dist/detail/common", [ "dist/application/method", "dist/application/api" ], function(require, exports, module) {
    // var $ = require("$");
    var method = require("dist/application/method");
    var api = require("dist/application/api");
    var pay_btn_tmp = require("dist/detail/template/pay_btn_tmp.html");
    var pay_middle_tmp = require("dist/detail/template/pay_middle_tmp.html");
    var pay_header_tmp = require("dist/detail/template/pay_header.tmp.html");
    // var changeText = require('./changeShowOverText.js').changeText
    var userData = null;
    // 页面信息
    // productType  1  4  5 
    var initData = {
        isDownload: window.pageConfig.page.isDownload,
        //仅在线阅读
        vipFreeFlag: window.pageConfig.params.vipFreeFlag,
        //是否VIP免费
        isVip: 0,
        //是否VIP
        perMin: window.pageConfig.params.g_permin,
        //是否现金文档
        vipDiscountFlag: window.pageConfig.params.vipDiscountFlag,
        ownVipDiscountFlag: window.pageConfig.params.ownVipDiscountFlag,
        volume: window.pageConfig.params.file_volume,
        //下载券数量
        moneyPrice: window.pageConfig.params.moneyPrice,
        fid: window.pageConfig.params.g_fileId,
        title: window.pageConfig.page.fileName,
        format: window.pageConfig.params.file_format,
        cdnUrl: _head,
        productType: window.pageConfig.page.productType,
        // 商品类型 1：免费文档，3 在线文档 4 vip特权文档 5 付费文档 6 私有文档
        productPrice: window.pageConfig.page.productPrice
    };
    /**
     * 刷新头部信息
     * @param data checkLogin 返回数据
     */
    var reloadHeader = function(data) {
        var $unLogin = $("#unLogin"), $hasLogin = $("#haveLogin"), $top_user_more = $(".top-user-more"), $icon_iShare_text = $(".icon-iShare-text"), $btn_user_more = $(".btn-user-more"), $vip_status = $(".vip-status"), $icon_iShare = $(".icon-iShare");
        // 顶部右侧的消息
        $(".top-bar .news").removeClass("hide").find("#user-msg").text(data.msgCount);
        $icon_iShare_text.html(data.isVip === "1" ? "续费VIP" : "开通VIP");
        $btn_user_more.text(data.isVip === "1" ? "续费" : "开通");
        if (data.isVip === "0") {
            $(".open-vip").show().siblings("a").hide();
        } else {
            $(".xf-open-vip").show().siblings("a").hide();
        }
        var $target = null;
        //vip
        if (data.isVip == 1) {
            $target = $vip_status.find('p[data-type="2"]');
            $target.find(".expire_time").html(data.expireTime);
            $target.show().siblings().hide();
            $top_user_more.addClass("top-vip-more");
        } else if (data.userType == 1) {
            $target = $vip_status.find('p[data-type="3"]');
            $target.show().siblings().hide();
        }
        $unLogin.hide();
        $hasLogin.find(".icon-detail").html(data.nickName);
        $hasLogin.find("img").attr("src", data.weiboImage);
        $top_user_more.find("img").attr("src", data.weiboImage);
        $top_user_more.find("#userName").html(data.nickName);
        $hasLogin.show();
        //右侧导航栏.
        /* ==>头像,昵称 是否会员文案提示.*/
        $(".user-avatar img").attr("src", data.weiboImage);
        $(".name-wrap .name-text").html(data.nickName);
        if (data.isVip === "1") {
            var txt = "您的VIP将于" + data.expireTime + "到期,剩余" + data.privilege + "次下载特权";
            $(".detail-right-normal-wel").html(txt);
            $(".detail-right-vip-wel").html("会员尊享权益");
            $(".btn-mui").hide();
            $("#memProfit").html("VIP权益");
        } else {
            $(".mui-privilege-list li").removeClass("hide");
        }
    };
    /**
     * 登录后,要刷新顶部.中间,底部内容
     */
    var reloadingPartOfPage = function() {
        $("#footer-btn").html(template.compile(pay_btn_tmp)({
            data: initData
        }));
    };
    /**
     * 重新刷新价格显示
     */
    var reSetOriginalPrice = function() {
        var originalPrice = 0;
        if (initData.vipDiscountFlag == "1") {
            // initData.isVip == 1 && initData.vipDiscountFlag && initData.ownVipDiscountFlag
            originalPrice = (initData.moneyPrice * 1e3 / 1250).toFixed(2);
            // 8折
            // originalPrice = initData.moneyPrice ;
            $(".js-original-price").html(originalPrice);
            // var fileDiscount = userData.fileDiscount;
            // if (fileDiscount && fileDiscount !== 80) {
            //     $('.vip-price').html('&yen;' + (initData.moneyPrice * (fileDiscount / 100)).toFixed(2));
            // }
            $(".vip-price").html("&yen;" + (initData.moneyPrice * (80 / 100)).toFixed(2));
        }
        if (initData.productType === "5" && initData.vipDiscountFlag == "1") {
            // initData.perMin === '3' && initData.vipDiscountFlag && initData.ownVipDiscountFlag
            originalPrice = (initData.moneyPrice * 1e3 / 1250).toFixed(2);
            // originalPrice = initData.moneyPrice 
            $(".js-original-price").html(originalPrice);
            //  var savePrice = (initData.moneyPrice - originalPrice).toFixed(2);
            var savePrice = (params.moneyPrice * .8).toFixed(2);
            $("#vip-save-money").html(savePrice);
            $(".js-original-price").html(savePrice);
        }
    };
    /**
     * 查询是否已经收藏
     */
    var queryStoreFlag = function() {
        method.get(api.normalFileDetail.isStore + "?fid=" + initData.fid, function(res) {
            if (res.code == 0) {
                var $btn_collect = $("#btn-collect");
                if (res.data === 1) {
                    $btn_collect.addClass("btn-collect-success");
                } else {
                    $btn_collect.removeClass("btn-collect-success");
                }
            } else if (res.code == 40001) {
                setTimeout(function() {
                    method.delCookie("cuk", "/", ".sina.com.cn");
                }, 0);
            }
        });
    };
    /**
     * 文件预览判断接口
     */
    var filePreview = function() {
        var validateIE9 = method.validateIE9() ? 1 : 0;
        var pageConfig = window.pageConfig;
        var params = "?fid=" + pageConfig.params.g_fileId + "&validateIE9=" + validateIE9;
        method.get(api.normalFileDetail.getPrePageInfo + params, function(res) {
            if (res.code == 0) {
                pageConfig.page.preRead = res.data.preRead || 50;
                var num = method.getParam("page");
                if (num > 0) {
                    pageConfig.page.is360page = "true";
                    pageConfig.page.initReadPage = Math.min(num, 50);
                }
                pageConfig.page.status = initData.status = res.data.status;
                // 0 未登录、转化失败、未购买 2 已购买、本人文件
                // 修改继续阅读文案要判断是否购买过
                // changeText(res.data.status)
                if (pageConfig.params.file_state === "3") {
                    var content = res.data.url || pageConfig.imgUrl[0];
                    var bytes = res.data.pinfo.bytes || {};
                    var newimgUrl = [];
                    for (var key in bytes) {
                        var page = bytes[key];
                        var param = page[0] + "-" + page[1];
                        var newUrl = method.changeURLPar(content, "range", param);
                        newimgUrl.push(newUrl);
                    }
                    pageConfig.imgUrl = newimgUrl;
                }
                //http://swf.ishare.down.sina.com.cn/xU0VKvC0nR.jpg?ssig=%2FAUC98cRYf&Expires=1573301887&KID=sina,ishare&range=0-501277
                if (method.getCookie("cuk")) {
                    reloadingPartOfPage();
                }
                reSetOriginalPrice();
            }
        });
    };
    return {
        initData: initData,
        userData: userData,
        beforeLogin: function() {},
        afterLogin: function(data) {
            userData = data;
            initData.isVip = parseInt(data.isVip, 10);
            reloadHeader(data);
            // queryStoreFlag();
            filePreview();
        }
    };
});

define("dist/detail/template/pay_btn_tmp.html", [], '<div class="bottom-fix qwe">\n        {{if data.productType == "3"}}\n            <!--仅在线阅读-->\n            {{if data.isVip == 1}}\n                <div class="data-item fl">\n                    <h2 class="data-title fl"><i class="ico-big-data ico-big-{{data.format}}"></i>{{data.title}}</h2>\n                    <span class="online-read">仅供在线阅读</span>\n                </div>\n                <div class="integral-con fr">\n                    <a id="searchRes" class="btn-fix-vip fl" ><i class="icon-detail"></i>寻找资料</a>\n                </div>\n\n            {{else}}\n                <div class="data-item fl">\n                    <h2 class="data-title fl"><i class="ico-big-data ico-big-{{data.format}}"></i>{{data.title}}</h2>\n                    <span class="online-read">仅供在线阅读</span>\n                </div>\n                <div class="integral-con fr">\n                    <a class="btn-fix-vip js-buy-open fl pc_click" pcTrackContent="joinVip-2" bilogContent="fileDetailBottomOpenVip8" data-type="vip">开通VIP，享更多特权</a>\n                </div>\n            {{/if}}\n        {{else}}\n            <!--VIP免费-->\n            {{if data.productType == 4}}\n                <div class="data-item fl">\n                    <h2 class="data-title fl"><i class="ico-big-data ico-big-{{data.format}}"></i>{{data.title}}</h2>\n                </div>\n                <div class="integral-con fr">\n                    <a class="btn-fix-bottom fl pc_click" pcTrackContent="downloadBtn-3" bilogContent="fileDetailBottomDown" data-toggle="download">立即下载</a>\n                </div>\n            {{else}}\n                {{if data.productType == "5" }}\n                    <!--现金文档 -->\n                    <!--专享8折 加入vip8折购买 立即下载 立即购买-->\n                      {{if data.isVip == 1 && data.vipDiscountFlag == 1 }}\n                        <div class="data-item fl">\n                            <h2 class="data-title fl">\n                                <i class="ico-big-data ico-big-{{data.format}}"></i>{{data.title}}\n                            </h2>\n                        </div>\n                        <div class="integral-con fr">\n                            {{if data.status!=2}}\n                                <div class="price-con price-more fl">\n                                     <p class="price vip-price">¥{{data.productPrice}}</p>\n                                    <p class="origin-price">原价&yen; {{data.productPrice}}</p>\n                                </div>\n                                 <a class="btn-fix-bottom js-buy-open fl pc_click" pcTrackContent="buyBtn-3" bilogContent="fileDetailBottomBuy" data-type="file">立即下载</a>\n                            {{else}}\n                                 <a class="btn-fix-bottom fl pc_click" pcTrackContent="downloadBtn-3" bilogContent="fileDetailBottomDown" data-toggle="download">立即下载</a>\n                            {{/if}}\n                        </div>\n                        <!--&& data.ownVipDiscountFlag== 1-->\n                      {{else if data.isVip == 0 && data.vipDiscountFlag == 1 }}\n                        <div class="data-item fl">\n                            <h2 class="data-title fl"><i class="ico-big-data ico-big-{{data.format}}"></i>{{data.title}}</h2>\n                        </div>\n                        <div class="integral-con fr">\n                            {{if data.status!=2}}\n                                <div class="price-con price-more fl">\n                                    <!--现金文档价格 -->\n                                    <p class="price" style="">&yen;{{data.productPrice}}</p>\n                                    <!--现金文档 有折扣 非vip会员 -->\n                                  \n                                      <p class="vip-sale-price">会员价&yen;<span class="js-original-price">{{data.productPrice}}</span></p>\n                                </div>\n                                <a class="btn-fix-bottom btn-fix-border js-buy-open fl pc_click" pcTrackContent="buyBtn-3" bilogContent="fileDetailBottomBuy" data-type="file">立即下载</a>\n                            {{else}}\n                                 <a class="btn-fix-bottom fl pc_click" pcTrackContent="downloadBtn-3" bilogContent="fileDetailBottomDown" data-toggle="download">立即下载</a>\n                            {{/if}}\n                        </div>\n                      {{else}}\n                        <div class="data-item fl">\n                            <h2 class="data-title fl">\n                                <i class="ico-big-data ico-big-{{data.format}}"></i>{{data.title}}\n                            </h2>\n                        </div>\n\n                        <div class="integral-con fr">\n                            {{if data.status!=2}}\n                                <div class="price-con fl">\n                                    <!--现金文档价格 -->\n                                     <p class="price" style="">¥{{data.productPrice}}</p>\n                                </div>\n                                <a class="btn-fix-bottom js-buy-open  fl pc_click" pcTrackContent="buyBtn-3" bilogContent="fileDetailBottomBuy" loginOffer="buyBtn-2" data-type="file">立即下载</a>\n                            {{else}}\n                                <a class="btn-fix-bottom fl pc_click" pcTrackContent="downloadBtn-3" bilogContent="fileDetailBottomDown" data-toggle="download">立即下载</a>\n                            {{/if}}\n                        </div>\n                    {{/if}}\n                {{else}}\n                    <!--vip-->\n                    {{if data.isVip == 1}}\n                            <div class="data-item fl">\n                                <h2 class="data-title fl">\n                                    <i class="ico-big-data ico-big-{{data.format}}"></i>{{data.title}}\n                                </h2>\n                            </div>\n                            <div class="integral-con fr">\n                                {{if data.volume > 0}}\n                                    <div class="price-con fl">\n                                        <p class="price">{{data.volume}}下载券</p>\n                                    </div>\n                                {{/if}}\n                                <a class="btn-fix-bottom  fl pc_click" pcTrackContent="downloadBtn-3" bilogContent="fileDetailBottomDown" data-toggle="download">立即下载</a>\n                            </div>\n                    {{else}}\n                        {{if data.volume > 0}}\n\n                            <div class="data-item fl">\n                                <h2 class="data-title fl">\n                                    <i class="ico-big-data ico-big-{{data.format}}"></i>{{data.title}}\n                                </h2>\n                            </div>\n\n                            <div class="integral-con fr">\n                                <div class="price-con fl">\n                                    <p class="price" style="">{{data.volume}}下载券</p>\n                                </div>\n                                <a class="btn-fix-bottom  fl pc_click" pcTrackContent="downloadBtn-3" bilogContent="fileDetailBottomDown" data-toggle="download" >立即下载</a>\n                            </div>\n                        {{else}}\n                            <div class="data-item fl">\n                                <h2 class="data-title fl">\n                                    <i class="ico-big-data ico-big-{{data.format}}"></i>{{data.title}}\n                                </h2>\n                            </div>\n\n                            <div class="integral-con fr">\n                                <a class="btn-fix-bottom  fl pc_click" pcTrackContent="downloadBtn-3" bilogContent="fileDetailBottomDown" data-toggle="download" >立即下载</a>\n                            </div>\n                        {{/if}}\n                    {{/if}}\n                {{/if}}\n            {{/if}}\n        {{/if}}\n</div>\n');

define("dist/detail/template/pay_middle_tmp.html", [], '{{if data.isDownload === "n"}}\n<!--仅在线阅读-->\n{{if data.isVip == 1}}\n<div class="detail-wx-wrap">\n    <p class="detail-wx-text">本资料仅支持在线阅读，VIP可扫码寻找。</p>\n    <div class="detail-wx-entry">\n        <div class="wx-entry-con">\n            <div class="wx-code-con">\n                <img src="//pic.iask.com.cn/mini/qrc_{{data.fid}}.png">\n                <p>资料小程序码</p>\n            </div>\n            <div class="entry-main">\n                <div class="wx-step-con">\n                    <p class="step-text" style="text-align: left;">使用微信“扫一扫”扫码寻找资料</p>\n                    <div class="wx-step-list cf">\n                        <div class="step-num">\n                            <p>1</p>\n                            <p class="step-num-text">打开微信</p>\n                        </div>\n                        <i class="step-arrow"></i>\n                        <div class="step-num">\n                            <p>2</p>\n                            <p class="step-num-text">扫描小程序码</p>\n                        </div>\n                        <i class="step-arrow"></i>\n                        <div class="step-num">\n                            <p>3</p>\n                            <p class="step-num-text">发布寻找信息</p>\n                        </div>\n                        <i class="step-arrow"></i>\n                        <div class="step-num">\n                            <p>4</p>\n                            <p class="step-num-text">等待寻找结果</p>\n                        </div>\n                    </div>\n                </div>\n            </div>\n        </div>\n    </div>\n</div>\n{{else}}\n<div class="btn-data-con">\n    <p>仅供在线阅读</p>\n    <div class="btn-con mt18">\n        <a class="btn-detail-vip js-buy-open pc_click" pcTrackContent="joinVip-1" bilogContent="fileDetailMiddleOpenVipPr" loginOffer="joinVip-1" data-type="vip"><i class="icon-detail"></i>开通VIP，享更多特权</a>\n    </div>\n</div>\n{{/if}}\n{{else}}\n<div class="btn-data-con direct-dowonload-01">\n    <!--VIP免费-->\n    {{if data.vipFreeFlag == 1}}\n        <div class="btn-con mt18">\n            <a class="btn-state-red pc_click" pcTrackContent=\'downloadBtn-2\' bilogContent="fileDetailMiddleDown" data-toggle="download"><i class="icon-detail"></i>立即下载</a>\n        </div>\n    {{else}}\n    {{if data.perMin == "3"}}\n    <!--现金文档 -->\n    <!--专享8折 加入vip8折购买 立即下载 立即购买-->\n    {{if data.isVip == 1 && data.vipDiscountFlag ==1 && data.ownVipDiscountFlag ==1}}\n        {{if data.status!=2}}\n            <div class="price-item">\n                <p class="price-text vip-price">&yen; {{(data.moneyPrice*1000/1250).toFixed(2)}}</p>\n                <p class="origin-price">原价&yen; {{data.moneyPrice}}</p>\n            </div>\n            <div class="btn-con mt18">\n                <a class="btn-state-red btn-buy-solid js-buy-open  pc_click"  pcTrackContent="buyBtn-2" bilogContent="fileDetailMiddleBuy" data-type="file">立即购买</a>\n            </div>\n        {{else}}\n            <div class="btn-con mt18">\n                <a class="btn-state-red btn-buy-solid pc_click" pcTrackContent=\'downloadBtn-2\' data-toggle="download" loginOffer="downloadBtn-2">立即下载</a>\n            </div>\n        {{/if}}\n\n    {{else if data.isVip == 0 && data.vipDiscountFlag == 1 && data.ownVipDiscountFlag== 1}}\n\n        {{if data.status!=2}}\n            <div class="price-item">\n                <p class="price-text">¥{{data.moneyPrice}}</p>\n                <p class="vip-sale-price">会员价&yen;{{(data.moneyPrice*1000/1250).toFixed(2)}}起</p>\n            </div>\n            <div class="btn-con mt18">\n                <a class="btn-state-red btn-buy-solid btn-buy-border js-buy-open pc_click" pcTrackContent="buyBtn-2" bilogContent="fileDetailMiddleBuy" loginOffer="buyBtn-2" data-type="file">立即购买</a>\n                <a class="btn-detail-vip js-buy-open pc_click" pcTrackContent="joinVip-1" bilogContent="fileDetailMiddleOpenVip8" loginOffer="joinVip-1" data-type="vip"><i class="icon-detail"></i>开通VIP, 8折起</a>\n            </div>\n        {{else}}\n            <div class="btn-con mt18">\n                <a class="btn-state-red btn-buy-solid pc_click" pcTrackContent=\'downloadBtn-2\' data-toggle="download" loginOffer="downloadBtn-2">立即下载</a>\n            </div>\n        {{/if}}\n\n    {{else}}\n        {{if data.status!=2}}\n            <div class="price-item">\n                <div class="price-item">\n                    <p class="price-text">&yen;{{data.moneyPrice}}</p>\n                </div>\n            </div>\n            <div class="btn-con mt18">\n                <a class="btn-state-red btn-buy-solid js-buy-open pc_click" pcTrackContent="buyBtn-2" bilogContent="fileDetailMiddleBuy" loginOffer="buyBtn-2" data-type="file">立即购买</a>\n            </div>\n        {{else}}\n            <div class="btn-con mt18">\n                <a class="btn-state-red btn-buy-solid pc_click" pcTrackContent=\'downloadBtn-2\' data-toggle="download" loginOffer="downloadBtn-2">立即下载</a>\n            </div>\n        {{/if}}\n    {{/if}}\n    {{else}}\n    <!-- 下载券下载 -->\n        {{ if data.volume >0 }}\n            <p class="ticket-num"><i class="icon-detail"></i>{{data.volume}}下载券</p>\n        {{/if}}\n        <div class="btn-con mt18">\n            <a class="btn-state-red pc_click" pcTrackContent=\'downloadBtn-2\' bilogContent="fileDetailMiddleDown" data-toggle="download"><i class="icon-detail"></i>立即下载</a>\n        </div>\n    {{/if}}\n    {{/if}}\n</div>\n{{/if}}\n\n');

define("dist/detail/template/pay_header.tmp.html", [], '{{ if data.isDownload != \'n\' }}\n    {{if data.vipFreeFlag == 1}}\n           <a class="btn-data-new pc_click" pcTrackContent="downloadBtn-0" bilogContent="fileDetailUpDown" data-toggle="download" loginOffer="downloadBtn-0">立即下载</a>\n    {{else}}\n          {{ if data.perMin == "3"}}\n                {{if data.isVip == 1 && data.vipDiscountFlag == 1 && data.ownVipDiscountFlag == 1}}\n                            {{if data.status!=2}}\n                                <a class="btn-data-new js-buy-open pc_click" pcTrackContent="buyBtn-1" bilogContent="fileDetailUpBuy" data-type="file">立即购买</a>\n                                <div class="header-price-warp header-price-more">\n                                    <p class="price vip-price">&yen; {{(data.moneyPrice*1000/1250).toFixed(2)}}</p>\n                                    <p class="origin-price">原价&yen;{{data.moneyPrice}}</p>\n                                </div>\n                            {{else}}\n                                 <a class="btn-data-new pc_click" pcTrackContent="downloadBtn-0" bilogContent="fileDetailUpDown" data-toggle="download" loginOffer="downloadBtn-0">立即下载</a>\n                            {{/if}}\n                {{else if data.isVip == 0 && data.vipDiscountFlag == 1 && data.ownVipDiscountFlag== 1}}\n                            {{if data.status!=2}}\n                                <a class="btn-data-new js-buy-open pc_click" pcTrackContent="buyBtn-1" bilogContent="fileDetailUpBuy" data-type="file">立即购买</a>\n                                <div class="header-price-warp header-price-more">\n                                    <p class="price">&yen;{{data.moneyPrice}}</p>\n                                    <p class="vip-sale-price">会员价&yen;{{(data.moneyPrice*1000/1250).toFixed(2)}}起</p>\n                                </div>\n                            {{else}}\n                                 <a class="btn-data-new pc_click" pcTrackContent="downloadBtn-0" bilogContent="fileDetailUpDown" data-toggle="download" loginOffer="downloadBtn-0">立即下载</a>\n                            {{/if}}\n                {{else}}\n                            {{if data.status!=2}}\n                                <a class="btn-data-new js-buy-open pc_click" pcTrackContent="buyBtn-1" bilogContent="fileDetailUpBuy" data-type="file">立即购买</a>\n                                <div class="header-price-warp">\n                                    <p class="price">&yen;{{data.moneyPrice}}</p>\n                                </div>\n                            {{else}}\n                                <a class="btn-data-new pc_click" pcTrackContent="downloadBtn-0" bilogContent="fileDetailUpDown" data-toggle="download" loginOffer="downloadBtn-0">立即下载</a>\n                            {{/if}}\n\n                {{/if}}\n          {{else}}\n                {{ if data.volume >0 }}\n                                <a class="btn-data-new pc_click" pcTrackContent="downloadBtn-0" bilogContent="fileDetailUpDown" data-toggle="download" loginOffer="downloadBtn-0">立即下载</a>\n                                <p class="btn-text"><span>{{data.volume}}</span>下载券</p>\n                {{else}}\n                        <a class="btn-data-new pc_click" pcTrackContent="downloadBtn-0" bilogContent="fileDetailUpDown" data-toggle="download" loginOffer="downloadBtn-0">立即下载</a>\n                {{/if}}\n          {{/if}}\n    {{/if}}\n{{/if}}');

/**
 * 发优惠券
 */
define("dist/common/coupon/couponIssue", [ "dist/cmd-lib/toast", "dist/application/method", "dist/cmd-lib/util", "dist/cmd-lib/loading", "dist/application/checkLogin", "dist/application/api" ], function(require, exports, module) {
    // var $ = require("$");
    require("dist/cmd-lib/toast");
    var method = require("dist/application/method");
    var utils = require("dist/cmd-lib/util");
    var fid = method.getParam("fid");
    require("dist/cmd-lib/loading");
    var login = require("dist/application/checkLogin");
    var couponOptions = require("dist/common/coupon/template/couponCard.html");
    var api = require("dist/application/api");
    var couponObj = {
        _index: 0,
        pageType: 1,
        //1 是购买成功，2是下载成功
        type: 4,
        //0游客，1首次购买现金文档，2首次购买vip，3首次下载免费文档
        isFirstCashBuy: 2,
        isFirstVipBuy: 2,
        dowStatus: 2,
        isVip: 0,
        isFreeFile: 0,
        userId: "",
        pageUrl: "",
        initial: function() {
            var urlArr = location.pathname.split("/");
            couponObj.pageUrl = urlArr[urlArr.length - 1];
            var unloginFlag = method.getQueryString("unloginFlag");
            //免登录购买成功页 下载页
            if (couponObj.pageType == 1 || couponObj.pageType == 2) {
                if (!unloginFlag) {
                    login.getUserData(function(data) {
                        couponObj.isVip = data.isVip;
                        couponObj.isFirstCashBuy = data.isFirstCashBuy;
                        couponObj.isFirstVipBuy = data.isFirstVipBuy;
                        couponObj.dowStatus = data.dowStatus;
                        couponObj.userId = data.userId;
                        couponObj.confirmCouponType();
                        if (couponObj.type != 4 && couponObj.pageUrl != "downsucc.html") {
                            couponObj.getCouponList();
                        }
                    });
                }
            }
        },
        domChange: function() {
            if (couponObj.type == 1) {
                if (couponObj.isFirstCashBuy == 1) {
                    // 首次 现金 购买发券
                    $(".couponContainer").show();
                    $(".previousContainer").hide();
                    if (couponObj.isVip == 0) {
                        $(".bottom-privilege").removeClass("hide");
                        //出现开通vip提示
                        $(".down-succ-btn[data-type=default]").show().css("display", "block").siblings("a").hide();
                        $(".give-coupon-wrap").css("border-bottom", "none!important");
                        $(".couponContainer .carding-er-code").hide();
                    } else {
                        $(".bottom-privilege").addClass("hide");
                        //隐藏开通vip提示
                        $(".down-succ-btn[data-type=default]").show().css("display", "hide");
                        $(".couponContainer .carding-er-code").show();
                    }
                }
            }
            if (couponObj.type == 2) {
                if (couponObj.isFirstVipBuy == 1) {
                    // 首次 vip 购买发券
                    $(".couponContainer").show();
                    $(".previousContainer").hide();
                    $(".bottom-privilege").hide();
                    $(".couponContainer .carding-er-code").show();
                }
            }
            if (couponObj.type == 3) {
                //    下载成功页
                // 首次 免费文档下载
                $(".couponContainer").show();
                $(".previousContainer").hide();
                if (couponObj.isVip == 0) {
                    $(".downSucc-privi").removeClass("hide");
                } else {
                    $(".downSucc-privi").addClass("hide");
                }
                $(".carding-er-code").show();
                $(".down-succ-btn[data-type=default]").addClass("hide").hide();
                $(".give-coupon-wrap").css("border-bottom", "none!important");
            }
        },
        /**
        * 确定优惠券请求类型
       */
        confirmCouponType: function() {
            var pageType = 0;
            //1是购买成功，2是下载成功
            var buyType = Number($("#ip-type").val());
            //0是VIP购买，2是现金文档
            if (couponObj.pageUrl == "downsucc.html") {
                couponObj.getFileType(fid);
                pageType = 1;
                if (couponObj.dowStatus == 1 && couponObj.isFreeFile == 1 && localStorage.getItem("FirstDown") != 1) {
                    couponObj.type = 3;
                }
            } else if (couponObj.pageUrl == "success.html") {
                pageType = 2;
                if (buyType == 2 && couponObj.isFirstCashBuy == 1 && method.getCookie("FirstCashBuy") != couponObj.userId) {
                    couponObj.type = 1;
                } else if (buyType == 0 && couponObj.isFirstVipBuy == 1 && method.getCookie("FirstVipBuy") != couponObj.userId) {
                    couponObj.type = 2;
                }
            }
            couponObj.pageType = pageType;
        },
        /**
         * 获取优惠券列表
        */
        getCouponList: function() {
            var url = "/node/coupon/issueCoupon?type=" + couponObj.type;
            $.get(url, function(res) {
                if (res.code == 0) {
                    if (res.data) {
                        if (res.data.list.length > 0) {
                            var _html = template.compile(couponOptions)({
                                data: res.data
                            });
                            $(".give-title").text(res.data.prompt);
                            $(".give-coupon-list").html(_html);
                            couponObj.domChange();
                            couponObj.bringCouponClick();
                            $(".down-carding-main").addClass("coupon-carding-item");
                            $(".carding-vip-main").addClass("coupon-carding-item");
                            if (couponObj.type == 1) {
                                method.setCookieWithExpPath("FirstCashBuy", couponObj.userId, 30 * 24 * 60 * 60 * 1e3, "/");
                            } else if (couponObj.type == 2) {
                                method.setCookieWithExpPath("FirstVipBuy", couponObj.userId, 30 * 24 * 60 * 60 * 1e3, "/");
                            } else if (couponObj.type == 3) {
                                method.setCookieWithExpPath("FirstDown", couponObj.userId, 30 * 24 * 60 * 60 * 1e3, "/");
                            }
                        }
                    }
                }
            });
        },
        /**
          * 点击领取
         */
        bringCouponClick: function() {
            $(".btn-receive").click(function() {
                couponObj.receiveCoupon(couponObj.type, 1);
            });
        },
        /**
         * 关闭头部提示
        */
        closeTipByClick: function() {
            $(".coupon-info-top").on("click", ".btn-no-user", function() {
                $(".coupon-info-top").hide();
            });
        },
        showTips: function(type) {
            setTimeout(function() {
                if (type == 0) {
                    $(".dialog-coupon.dialog-coupon-success").show();
                } else {
                    $(".dialog-coupon.dialog-coupon-fail").show();
                }
            }, 1500);
        },
        /**
         * 领取优惠券
        */
        receiveCoupon: function(type, source) {
            var data = {
                source: source,
                type: type
            };
            data = JSON.stringify(data);
            $("body").loading({
                name: "download",
                title: "请求中"
            });
            $.ajax({
                type: "POST",
                url: api.vouchers,
                contentType: "application/json;charset=utf-8",
                dataType: "json",
                data: data,
                success: function(res) {
                    if (res.code == 0) {
                        if (res.data) {
                            if (res.data.list.length > 0) {
                                utils.showAlertDialog("温馨提示", "领取成功！");
                            } else {
                                utils.showAlertDialog("温馨提示", res.msg);
                            }
                        }
                    } else {
                        utils.showAlertDialog("温馨提示", res.msg);
                    }
                },
                complete: function() {
                    $("body").closeLoading("download");
                }
            });
        },
        // 确定文件类型
        getFileType: function(id) {
            var data = {
                id: id
            };
            $.get("/node/confirmType", data, function(res) {
                if (res.code == 0) {
                    if (res.fileType == "free") {
                        couponObj.isFreeFile = 1;
                        if (couponObj.dowStatus == 1 && localStorage.getItem("FirstDown") != 1) {
                            couponObj.type = 3;
                            couponObj.getCouponList();
                        }
                    }
                }
            });
        }
    };
    setTimeout(function() {
        couponObj.initial();
    }, 2e3);
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
            that.toastWrap = $('<div class="ui-toast" style="position:fixed;width:200px;height:60px;line-height:60px;text-align:center;background:#000;opacity:0.8;filter:alpha(opacity=80);top:40%;left:50%;margin-left:-100px;margin-top:-30px;border-radius:4px;z-index:10000">');
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
 * @Description: 筛选
 */
define("dist/cmd-lib/loading", [], function(require, exports, module) {
    //var jQuery = require("$");
    (function($, win, doc) {
        $.fn.loading = function(options) {
            var $this = $(this);
            var _this = this;
            return this.each(function() {
                var loadingPosition = "";
                var defaultProp = {
                    direction: "column",
                    //方向，column纵向   row 横向
                    animateIn: "fadeInNoTransform",
                    //进入类型
                    title: "提交中...",
                    //显示什么内容
                    name: "loadingName",
                    //loading的data-name的属性值  用于删除loading需要的参数
                    type: "origin",
                    //pic   origin  
                    discription: "",
                    //loading的描述
                    titleColor: "rgba(255,255,255,0.7)",
                    //title文本颜色
                    discColor: "rgba(255,255,255,0.7)",
                    //disc文本颜色
                    loadingWidth: 100,
                    //中间的背景宽度width
                    loadingBg: "rgba(0, 0, 0, 0.6)",
                    //中间的背景色
                    borderRadius: 6,
                    //中间的背景色的borderRadius
                    loadingMaskBg: "rgba(0,0,0,0.6)",
                    //背景遮罩层颜色
                    zIndex: 1000001,
                    //层级
                    // 这是圆形旋转的loading样式  
                    originDivWidth: 10,
                    //loadingDiv的width
                    originDivHeight: 10,
                    //loadingDiv的Height
                    originWidth: 4,
                    //小圆点width
                    originHeight: 4,
                    //小圆点Height
                    originBg: "#fefefe",
                    //小圆点背景色
                    smallLoading: false,
                    //显示小的loading
                    // 这是图片的样式   (pic)
                    imgSrc: "",
                    //默认的图片地址
                    imgDivWidth: 80,
                    //imgDiv的width
                    imgDivHeight: 80,
                    //imgDiv的Height
                    flexCenter: false,
                    //是否用flex布局让loading-div垂直水平居中
                    flexDirection: "row",
                    //row column  flex的方向   横向 和 纵向				
                    mustRelative: false,
                    //$this是否规定relative
                    delay: 2e3,
                    //默认2秒关闭                   
                    isClose: true
                };
                var opt = $.extend(defaultProp, options || {});
                //根据用户是针对body还是元素  设置对应的定位方式
                if ($this.selector == "body") {
                    $("body,html").css({
                        overflow: "hidden"
                    });
                    loadingPosition = "fixed";
                } else if (opt.mustRelative) {
                    $this.css({
                        position: "relative"
                    });
                    loadingPosition = "absolute";
                } else {
                    loadingPosition = "absolute";
                }
                defaultProp._showOriginLoading = function() {
                    var smallLoadingMargin = opt.smallLoading ? 0 : "-10px";
                    if (opt.direction == "row") {
                        smallLoadingMargin = "-6px";
                    }
                    //悬浮层
                    _this.cpt_loading_mask = $('<div class="cpt-loading-mask animated ' + opt.animateIn + " " + opt.direction + '" data-name="' + opt.name + '"></div>').css({
                        background: opt.loadingMaskBg,
                        "z-index": opt.zIndex,
                        position: loadingPosition
                    }).appendTo($this);
                    //中间的显示层
                    _this.div_loading = $('<div class="div-loading"></div>').css({
                        background: opt.loadingBg,
                        width: opt.loadingWidth,
                        height: opt.loadingHeight,
                        "-webkit-border-radius": opt.borderRadius,
                        "-moz-border-radius": opt.borderRadius,
                        "border-radius": opt.borderRadius
                    }).appendTo(_this.cpt_loading_mask);
                    if (opt.flexCenter) {
                        _this.div_loading.css({
                            display: "-webkit-flex",
                            display: "flex",
                            "-webkit-flex-direction": opt.flexDirection,
                            "flex-direction": opt.flexDirection,
                            "-webkit-align-items": "center",
                            "align-items": "center",
                            "-webkit-justify-content": "center",
                            "justify-content": "center"
                        });
                    }
                    //loading标题
                    _this.loading_title = $('<p class="loading-title txt-textOneRow"></p>').css({
                        color: opt.titleColor
                    }).html(opt.title).appendTo(_this.div_loading);
                    //loading中间的内容  可以是图片或者转动的小圆球
                    _this.loading = $('<div class="loading ' + opt.type + '"></div>').css({
                        width: opt.originDivWidth,
                        height: opt.originDivHeight
                    }).appendTo(_this.div_loading);
                    //描述
                    _this.loading_discription = $('<p class="loading-discription txt-textOneRow"></p>').css({
                        color: opt.discColor
                    }).html(opt.discription).appendTo(_this.div_loading);
                    if (opt.type == "origin") {
                        _this.loadingOrigin = $('<div class="div-loadingOrigin"><span></span></div><div class="div-loadingOrigin"><span></span></div><div class="div_loadingOrigin"><span></span></div><div class="div_loadingOrigin"><span></span></div><div class="div_loadingOrigin"><span></span></div>').appendTo(_this.loading);
                        _this.loadingOrigin.children().css({
                            "margin-top": smallLoadingMargin,
                            "margin-left": smallLoadingMargin,
                            width: opt.originWidth,
                            height: opt.originHeight,
                            background: opt.originBg
                        });
                    }
                    if (opt.type == "pic") {
                        _this.loadingPic = $('<img src="' + opt.imgSrc + '" alt="loading" />').appendTo(_this.loading);
                    }
                    //关闭事件冒泡  和默认的事件
                    _this.cpt_loading_mask.on("touchstart touchend touchmove click", function(e) {
                        e.stopPropagation();
                        e.preventDefault();
                    });
                };
                defaultProp._createLoading = function() {
                    //不能生成两个loading data-name 一样的loading
                    if ($(".cpt-loading-mask[data-name=" + opt.name + "]").length > 0) {
                        // console.error('loading mask cant has same date-name('+opt.name+'), you cant set "date-name" prop when you create it');
                        return;
                    }
                    defaultProp._showOriginLoading();
                };
                defaultProp._createLoading();
                defaultProp.close = function() {
                    $(".cpt-loading-mask[data-name=" + opt.name + "]").remove();
                };
            });
        };
        //关闭Loading
        $.extend($.fn, {
            closeLoading: function(loadingName) {
                var loadingName = loadingName || "";
                $("body,html").css({
                    overflow: "auto"
                });
                if (loadingName == "") {
                    $(".cpt-loading-mask").remove();
                } else {
                    var name = loadingName || "loadingName";
                    $(".cpt-loading-mask[data-name=" + name + "]").remove();
                }
            }
        });
    })(jQuery, window, document);
});

define("dist/common/coupon/template/couponCard.html", [], '\n{{each data.list as v i}}\n<li class="coupon-li">\n    <div class="coupon-item">\n        <i class="bg-coupon"></i>\n        <div class="price-wrap fl">\n            <p>{{if v.type==1}}¥{{/if}} <strong class="price">{{v.discount?v.discount:v.couponAmount}}</strong>{{if v.type==2}}折{{/if}}</p>\n        </div>\n        <div class="coupon-info-con">\n            <p class="coupon-text">{{v.content}}</p>\n            <p class="coupon-time">{{if v.dateNumber}}{{v.dateNumber}}天内有效{{else}}{{v.timeval}}{{/if}}</p>\n        </div>\n    </div>\n</li>\n{{/each}}\n');

define("dist/detail/template/head_tip.html", [], '<div class="info-wrap">\n    <i class="before"></i>\n    <i class="after"></i>\n    <p>{{data.prompt}}</p>\n    <div class="btn-wrap">\n        <a href="../pay/vip.html" target="_blank" class="btn-user">立即使用</a>\n        <a class="btn-no-user">暂不使用</a>\n    </div>\n</div>');
