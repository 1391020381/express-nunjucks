define("dist/queryOrder/success", [ "../application/method", "../application/checkLogin", "../application/api", "../application/login", "../cmd-lib/jqueryMd5", "../application/iframe/iframe-parent", "../application/iframe/messenger", "../cmd-lib/myDialog", "../cmd-lib/toast", "../common/bindphone", "../common/baidu-statistics", "../common/bilog", "base64", "../cmd-lib/util", "../report/config", "../common/coupon/couponIssue", "../cmd-lib/loading", "../common/coupon/template/couponCard.html" ], function(require, exports, module) {
    // var $ = require('$');
    var method = require("../application/method");
    var login = require("../application/checkLogin");
    var utils = require("../cmd-lib/util");
    var fid = method.getParam("fid");
    var fileName = method.getParam("name");
    var format = method.getParam("format");
    var userId;
    require("../common/bindphone");
    require("../common/coupon/couponIssue");
    require("../common/bilog");
    // require("../common/baidu-statistics");
    var userData = null, initData = {};
    eventBinding();
    // url上带有这个参数unloginFlag，说明是游客模式过来的
    var unloginFlag = method.getQueryString("unloginFlag");
    if (unloginFlag) {
        $("#filename").text(fileName || "");
        if (format) {
            $(".xbsd i").addClass("ico-data ico-" + format);
        }
        $(".pay-ok-text").hide();
        $(".unloginTop").show();
        $(".carding-data-pay-con").hide();
        if (method.getCookie("cuk")) {
            $(".carding-info-bottom.unloginStatus").remove();
            login.getLoginData(function(data) {
                userData = data;
                userId = data.userId;
                initData.isVip = parseInt(data.isVip, 10);
                refreshDomTree(data);
                successReload(data);
            });
        } else {
            unloginBuyStatus();
            login.listenLoginStatus(function(res) {
                initData.isVip = parseInt(res.isVip, 10);
                userData = res;
                // 登陆成功绑定userid
                bindOrder(res.userId, res.nickName);
            });
            setTimeout(function() {
                getDownUrl();
            }, 1e3);
        }
    } else {
        initShow();
    }
    function initShow() {
        if (method.getCookie("cuk")) {
            login.getLoginData(function(data) {
                userData = data;
                initData.isVip = parseInt(data.isVip, 10);
                refreshDomTree(data);
                successReload(data);
            });
        }
    }
    //游客购买成功绑定购买记录
    function bindOrder(userId, nickName) {
        var visitorId = getVisitIdByCookie();
        var params = {
            visitorId: visitorId,
            userId: userId,
            nickName: nickName
        };
        params = JSON.stringify(params);
        $.ajax({
            type: "get",
            url: "/pay/bindUnlogin?ts=" + new Date().getTime(),
            contentType: "application/json;charset=utf-8",
            data: params,
            success: function(data) {
                if (data && data.code == 0) {
                    $.toast({
                        text: data.msg,
                        callback: function() {
                            location.reload();
                        }
                    });
                } else {
                    $.toast({
                        text: data.msg
                    });
                }
            },
            complete: function() {}
        });
    }
    // 游客登陆下载成功
    function unloginBuyStatus() {
        $(".previousContainer").hide();
        $(".unloginStatus").show();
        $(".carding-share").hide();
        $(".down-carding-main").addClass("coupon-carding-item");
        $(".carding-success-item").css("padding-bottom", "60px");
        $(".xbsd i").addClass("ico-data ico-" + format);
        setTimeout(function() {
            createdLoginQr();
        }, 200);
    }
    // 点击下载
    $(".unloginStatus .quick-down-a").click(function() {
        getDownUrl();
    });
    function getDownUrl() {
        var vuk = getVisitIdByCookie();
        if (userId) {
            vuk = userId;
        }
        var fid = method.getQueryString("fid");
        $.post("/pay/paperDown", {
            vuk: vuk,
            fid: fid
        }, function(data) {
            if (data.code == 0) {
                location.href = data.data.dowUrl;
            } else if (data.code == 41003) {
                $.toast({
                    text: data.msg
                });
            } else {
                $.toast({
                    text: data.msg
                });
            }
        });
    }
    // 生登陆二维码
    function createdLoginQr() {
        var qrCodeparams = window.pageConfig && window.pageConfig.params ? window.pageConfig.params : null;
        var classid1 = qrCodeparams && qrCodeparams.classid1 ? qrCodeparams.classid1 + "" : "";
        var classid2 = qrCodeparams && qrCodeparams.classid2 ? "-" + qrCodeparams.classid2 + "" : "";
        var classid3 = qrCodeparams && qrCodeparams.classid3 ? "-" + qrCodeparams.classid3 + "" : "";
        var clsId = classid1 + classid2 + classid3;
        var fid = qrCodeparams ? qrCodeparams.g_fileId || "" : "";
        var loginUrl = $.loginPop("login_wx_code", {
            terminal: "PC",
            businessSys: "ishare",
            domain: document.domain,
            ptype: "ishare",
            popup: "hidden",
            clsId: clsId,
            fid: fid
        });
        var loginDom = '<iframe src="' + loginUrl + '" style="width:100%;height:480px" name="iframe_a"  frameborder="no" border="0" marginwidth="0" marginheight="0" scrolling="no" allowtransparency="yes"></iframe>';
        $(".carding-info-bottom.unloginStatus .qrWrap").html(loginDom);
    }
    function successReload(data) {
        if (data.mobile) {
            $(".carding-info-bottom").addClass("carding-binding-ok");
        } else {
            $(".carding-binding").show();
        }
        if (data.isVip == "1") {
            var time = method.compareTime(new Date(), new Date(data.expireTime));
            if (time <= 5) {
                $(".down-succ-title").html("您的VIP将于" + data.expireTime + "到期").show();
                $(".down-succ-btn[data-type=vip]").show().css("display", "block").siblings("a").hide();
                $(".bottom-privilege").show();
            } else if (data.privilege <= 5) {
                $(".down-succ-title").html("您的VIP下载特权仅剩" + data.privilege + "次！").show();
                $(".down-succ-btn[data-type=privilege]").show().css("display", "block").siblings("a").hide();
                $(".bottom-privilege").show();
            } else {
                $(".btn-carding-back").show().css("display", "block").siblings("a").hide();
                $(".bottom-privilege").hide();
            }
        } else {
            $(".down-succ-btn[data-type=default]").show().css("display", "block").siblings("a").hide();
            $(".new-success-item .bottom-privilege").removeClass("hide");
        }
    }
    $(".btn-carding-back").on("click", function() {
        window.location.href = "/f/" + fid + ".html";
    });
    // 购买跳转
    $(".js-buy-open").click(function() {
        var payTypeMapping = [ "", "免费", "下载券", "现金", "仅供在线阅读", "VIP免费", "VIP专享" ];
        var entryName_var = payTypeMapping[method.getCookie("file_state")];
        var entryType_var = method.getCookie("isVip") == 1 ? "续费" : "充值";
        //充值 or 续费
        var mark = $(this).data("type");
        var ref = utils.getPageRef(fid);
        //用户来源
        var params = "?fid=" + fid + "&ref=" + ref;
        if (mark === "vip" || mark === "default") {} else if (mark === "privilege") {}
    });
    /**
     * 刷新顶部状态
     * @param data
     */
    function refreshDomTree(data) {
        var $unLogin = $("#unLogin"), $hasLogin = $("#haveLogin"), $top_user_more = $(".top-user-more"), $icon_iShare_text = $(".icon-iShare-text"), $btn_user_more = $(".btn-user-more"), $vip_status = $(".vip-status"), $btn_join_vip = $(".btn-join-vip"), $icon_iShare = $(".icon-iShare");
        $icon_iShare_text.html(data.isVip === "1" ? "续费VIP" : "开通VIP");
        $btn_user_more.text(data.isVip === "1" ? "续费" : "开通");
        if (data.isVip == "0") {
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
        } else if (data.isVip == 0) {
            $icon_iShare.removeClass("icon-vip");
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
            $(".expire-time").show().find("span").html(data.expireTime);
            $btn_join_vip.find('p[data-type="2"]').show().siblings("a").hide();
            $(".vip-expire-time").show().find("span").html(data.expireTime);
            if (data.privilege && data.privilege < 0) {
                $btn_join_vip.find('p[data-type="3"]').show().siblings("a").hide();
            }
        } else {
            $(".mui-privilege-list li").removeClass("hide");
            $btn_join_vip.find('p[data-type="1"]').show().siblings("a").hide();
        }
    }
    function eventBinding() {
        var $more_nave = $(".more-nav"), $search_detail_input = $("#search-detail-input"), $detail_lately = $(".detail-lately");
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
            var lately_list = $(".lately-list"), len = lately_list.find("li").length;
            if (len > 0) {
                $detail_lately.show();
            } else {
                $detail_lately.hide();
            }
            return true;
        });
        $(".btn-new-search").on("click", function() {
            var _val = $("#search-detail-input").val();
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
                var condArr = data.s || [];
                if (condArr.length > 0) {
                    var max = Math.min(condArr.length, 10);
                    var _html = [];
                    for (var i = 0; i < max; i++) {
                        var searchurl = "/search/home.html?ft=all&cond=" + encodeURIComponent(encodeURIComponent(condArr[i]));
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
        window.location.href = "/search/home.html?ft=all&cond=" + encodeURIComponent(encodeURIComponent(sword));
    };
    // 获取访客id
    function getVisitIdByCookie() {
        var visitId = method.getCookie("visitor_id");
        if (!visitId) {
            visitId = method.getParam("visitorId");
        }
        return visitId;
    }
});