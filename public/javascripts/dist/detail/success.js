define("dist/detail/success", [ "../cmd-lib/myDialog", "../application/method", "../application/checkLogin", "../application/api", "../cmd-lib/util", "swiper", "../common/recommendConfigInfo", "../common/template/swiper_tmp.html", "../common/bindphone", "../common/coupon/couponIssue", "../cmd-lib/toast", "../cmd-lib/loading", "../common/coupon/template/couponCard.html", "../common/bilog", "base64", "../report/config" ], function(require, exports, module) {
    // var $ = require('$');
    require("../cmd-lib/myDialog");
    var method = require("../application/method");
    var login = require("../application/checkLogin");
    var utils = require("../cmd-lib/util");
    var fid = method.getParam("fid");
    var fileName = method.getParam("title");
    var format = method.getParam("format");
    var api = require("../application/api");
    var userId;
    require("swiper");
    var recommendConfigInfo = require("../common/recommendConfigInfo");
    var swiperTemplate = require("../common/template/swiper_tmp.html");
    var topBnnerTemplate = require("../common/template/swiper_tmp.html");
    require("../common/bindphone");
    require("../common/coupon/couponIssue");
    require("../common/bilog");
    // require("../common/baidu-statistics");
    var userData = null, initData = {};
    eventBinding();
    // url上带有这个参数unloginFlag，说明是游客模式过来的
    // buyUnlogin.js 中跳转过来
    var unloginFlag = method.getQueryString("unloginFlag");
    if (unloginFlag) {
        $("#filename").text(fileName || "");
        if (format) {
            $(".xbsd i").addClass("ico-data ico-" + format);
        }
        // $('.pay-ok-text').hide();
        $(".qrcode-warpper").hide();
        $(".down-success-other").hide();
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
                //  getDownUrl()
                autoDownUrl();
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
        if (!method.getCookie("cuk") && !userData) {
            // $('.down-success-other').hide()
            // $('.qrcode-warpper').hide()
            login.notifyLoginInterface(function(data) {
                userData = data;
                initData.isVip = parseInt(data.isVip, 10);
                refreshDomTree(data);
                successReload(data);
            });
        }
    }
    //游客购买成功绑定购买记录
    function bindOrder(userId, nickName) {
        var visitorId = method.getCookie("visitorId") || method.getParam("visitorId");
        $.get(api.pay.bindUser, {
            visitorId: visitorId,
            userId: userId,
            nickName: nickName
        }, function(data) {
            $.toast({
                text: data.msg,
                callback: function() {
                    location.reload();
                }
            });
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
    // 下载页面自动下载
    if (method.getCookie("cuk")) {
        autoDownUrl();
    }
    // 点击下载
    $(".quick-down-a").click(function() {
        // getDownUrl()
        autoDownUrl();
    });
    function autoDownUrl() {
        var fileDownUrl = method.getQueryString("url");
        if (fileDownUrl) {
            method.compatibleIESkip(fileDownUrl, false);
        } else {
            if (unloginFlag) {
                // 游客
                getDownUrl();
            }
        }
    }
    function getDownUrl() {
        var vuk = method.getCookie("visitorId") || method.getParam("visitorId");
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
            // 登录的情况下不适用 car.html中的二维码
            // $('.carding-info-bottom').addClass('carding-binding-ok')
            $(".carding-info-bottom").hide();
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
        if (mark === "vip" || mark === "default") {
            __pc__.gioTrack("vipRechargeEntryClick", {
                entryName_var: entryName_var,
                entryType_var: entryType_var
            });
            method.compatibleIESkip("/pay/vip.html" + params, true);
        } else if (mark === "privilege") {
            method.compatibleIESkip("/pay/privilege.html" + params, true);
        }
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
        // 登录
        $(".user-login,.login-open-vip").on("click", function() {
            if (!method.getCookie("cuk")) {
                login.notifyLoginInterface(function(data) {
                    refreshDomTree(data);
                    $(".down-success-other").show();
                    $(".qrcode-warpper").show();
                });
            }
        });
        // 登出
        $(".btn-exit").on("click", function() {
            login.ishareLogout();
        });
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
    gebyPosition();
    function gebyPosition() {
        $.ajax({
            url: api.recommend.recommendConfigInfo,
            type: "POST",
            data: JSON.stringify(recommendConfigInfo.downSuccess.pageIds),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function(res) {
                if (res.code == "0") {
                    res.data.forEach(function(item) {
                        // 匹配 组装数据
                        recommendConfigInfo.downSuccess.descs.forEach(function(desc) {
                            if (item.pageId == desc.pageId) {
                                desc.list = method.handleRecommendData(item.list);
                            }
                        });
                    });
                    console.log(recommendConfigInfo);
                    recommendConfigInfo.downSuccess.descs.forEach(function(item) {
                        if (item.list.length) {
                            if (item.pageId == "PC_M_DOWN_SUC_banner") {
                                // search-all-main-bottombanner
                                console.log(item.list, "item.list-------------------");
                                var _bottomBannerHtml = template.compile(topBnnerTemplate)({
                                    topBanner: item.list,
                                    className: "swiper-top-container"
                                });
                                $(".down-success-banner").html(_bottomBannerHtml);
                                var mySwiper = new Swiper(".swiper-top-container", {
                                    direction: "horizontal",
                                    loop: item.list.length > 1 ? true : false,
                                    autoplay: 3e3
                                });
                            }
                        }
                    });
                }
            }
        });
    }
    // 发送邮箱
    $(".js-sent-email").click(function() {
        //          $("#dialog-box").dialog({
        //     html: $('#send-email').html(),
        // }).open();
        $("#dialog-box").dialog({
            html: $("#send-email").html()
        }).open();
    });
    $("#dialog-box").on("click", ".submit-btn", function(e) {
        // debugger
        if (!method.testEmail($(".form-ipt").val())) {
            $.toast({
                text: "请输入正确的邮箱",
                delay: 3e3
            });
            return;
        }
        if (method.getCookie("cuk")) {
            console.log(method.getCookie("ui"));
            var email = $("#dialog-box .form-ipt").val();
            $.ajax({
                url: api.sms.sendCorpusDownloadMail,
                type: "POST",
                data: JSON.stringify({
                    email: email,
                    fid: fid,
                    title: fileName,
                    uid: JSON.parse(method.getCookie("ui")).uid
                }),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function(res) {
                    console.log(res);
                    if (res.code == "0") {
                        $.toast({
                            text: "发送邮箱成功!"
                        });
                        var $dialogBox = $("#dialog-box");
                        $dialogBox.dialog({}).close();
                    } else {
                        $.toast({
                            text: "发送邮箱失败!"
                        });
                    }
                }
            });
        } else {
            login.notifyLoginInterface(function(data) {
                // common.afterLogin(data);
                refreshDomTree(data);
            });
        }
    });
    $("#dialog-box").on("click", ".close-btn", function(e) {
        closeRewardPop();
    });
    function closeRewardPop() {
        $(".common-bgMask").hide();
        $(".detail-bg-mask").hide();
        $("#dialog-box").hide();
    }
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
                    e && e.preventDefault();
                    that.close(that.options.onClose);
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

define("dist/common/recommendConfigInfo", [], function(require, exports, module) {
    return {
        search: {
            descs: [ //搜索页推荐位
            {
                desc: "搜索页顶部banner",
                pageId: "PC_M_SR_ub",
                list: []
            }, {
                desc: "搜索页右侧banner",
                pageId: "PC_M_SR_rb",
                list: []
            }, {
                desc: "搜索页底部banner",
                pageId: "PC_M_SR_downb",
                list: []
            } ],
            pageIds: [ "PC_M_SR_ub", "PC_M_SR_rb", "PC_M_SR_downb" ]
        },
        paySuccess: {
            descs: [ {
                desc: "支付成功页面banner",
                pageId: "PC_M_PAY_SUC_banner",
                list: []
            } ],
            pageIds: [ "PC_M_PAY_SUC_banner" ]
        },
        downSuccess: {
            descs: [ {
                desc: "下载成功页面banner",
                pageId: "PC_M_DOWN_SUC_banner",
                list: []
            } ],
            pageIds: [ "PC_M_DOWN_SUC_banner" ]
        },
        personalCenterHome: {
            descs: [ {
                desc: "个人中心首页,bannber",
                pageId: "PC_M_USER_banner",
                list: []
            } ],
            pageIds: [ "PC_M_USER_banner" ]
        },
        myVipRightsBanner: {
            descs: [ {
                desc: "个人中心我的vip,bannber",
                pageId: "PC_M_USER_VIP_banner",
                list: []
            } ],
            pageIds: [ "PC_M_USER_VIP_banner" ]
        },
        myVipRightsList: {
            descs: [ {
                desc: "个人中心首页/我的VIP页的VIP权益缩略图",
                pageId: "PC_M_USER_vip",
                list: []
            } ],
            pageIds: [ "PC_M_USER_vip" ]
        }
    };
});

define("dist/common/template/swiper_tmp.html", [], '<!--轮播图-->\n    <div class="swiper-container {{className}}">\n         <div class="swiper-wrapper">\n         {{each topBanner}}\n            <div class="swiper-slide" >\n               <a href={{ topBanner[$index].linkUrl}} target="_blank">\n                 <img class="swiper-slide-img" src={{ topBanner[$index].imagUrl}}>\n               </a>\n            </div>\n            {{/each}} \n         </div>\n         {{if hasDeleteIcon}}\n        <span class="icon close-swiper"><span>\n        {{/if}}\n         \n    </div>            \n');

define("dist/common/bindphone", [ "dist/application/api" ], function(require, exports, moudle) {
    //var $ = require("$");
    var api = require("dist/application/api");
    /**
     * 获取图形验证码
     */
    function getCaptcha() {
        var mobile = $("#ip-mobile").val().replace(/\s/g, "");
        if (mobile) {
            $(".login-error span").parent().hide();
            $.get("/cas/captcha/get?mobile=" + mobile, function(data, status) {
                if (status == "success") {
                    /*$(".unlock-pic").html('<img src="'+data+'" onclick="getCaptcha();" width="80" height="42">')*/
                    $(".img-code-item .unlock-pic img").attr("src", data);
                } else {
                    console.log("获取图形验证码异常");
                }
            });
        } else {
            $(".login-error span").text("请输入手机号").parent().show();
        }
    }
    function formatTel(mobile) {
        var value = mobile.replace(/\D/g, "").substring(0, 11);
        var valueLen = value.length;
        if (valueLen > 3 && valueLen < 8) {
            value = value.replace(/^(...)/g, "$1 ");
        } else if (valueLen >= 8) {
            value = value.replace(/^(...)(....)/g, "$1 $2 ");
        }
        return value;
    }
    function handle(flag) {
        if (flag == "1") {
            //334
            var mobile = $("#mobile").val();
            $(".carding-error").hide();
            if (mobile) {
                $("#mobile").val(formatTel(mobile));
                $(".btn-binding-code").removeClass("btn-code-no");
            } else {
                $(".btn-binding-code").addClass("btn-code-no");
            }
        }
    }
    /**
     * 验证码验证
     * @param callback
     */
    function fcheckCode(callback) {
        $.post("/cas-api/checkCode", {
            nationCode: $(".phone-num em").text(),
            mobile: $("#ip-mobile").val().replace(/\s/g, ""),
            smsId: $("#ip-smsId").val(),
            checkCode: $("#ip-checkCode").val()
        }, callback);
    }
    /**
     * 验证提示
     * @param nationCode
     * @param mobile
     * @returns {*}
     */
    function checkMsg(nationCode, mobile) {
        var msg = null;
        if (!mobile) {
            msg = "请输入手机号";
        } else {
            msg = $.checkMobile(nationCode, mobile);
        }
        return msg;
    }
    function checkBindingMobile(uid) {
        $.get("/ucenter/checkUserBindMobile?uid=" + uid, function(data) {
            alert(data);
        });
    }
    var ValidateClick = function() {
        this.callback = null;
        /**
         *  定时器
         */
        function TimerClock() {
            this.maxTimes = 60;
            //计时周期
            this.times = 1e3;
            //计时步伐
            this.timer = null;
            this.ele = null;
            this.callback = null;
            this.beforeShow = null;
            /**
             *
             * @param ele
             * @param beforeShow 执行前处理 返回true 继续 false 终止
             * @param callback回调函数
             */
            this.showTimeClock = function(ele, beforeShow, callback) {
                //倒计时
                this.ele = ele;
                this.beforeShow = beforeShow;
                if (!this.beforeShow()) {
                    return;
                }
                this.ele.text(this.maxTimes);
                var that = this;
                this.callback = callback;
                this.timer = setInterval(function(args) {
                    that.countDown();
                }, this.times);
            };
            /**
             * 每秒计数
             */
            this.countDown = function() {
                if (this.maxTimes > 0) {
                    this.maxTimes = this.maxTimes - 1;
                    this.ele.text(this.maxTimes);
                } else {
                    clearInterval(this.timer);
                    this.callback();
                }
            };
        }
        this.execute = function(data, callbcak) {
            this.callback = callbcak;
            var mobile = $("#ip-mobile").val().replace(/\s/g, "");
            var nationCode = $(".phone-num em").text();
            var captcha = $.trim($captcha.find("input").val());
            //去空格
            var msg = null;
            if (msg = checkMsg(nationCode, mobile)) {
                //$mobile.find('.error-text').text(msg).show();
                $loginError.text(msg).parent().show();
                return;
            }
            //发送短信
            this.sendSms("&nationCode=" + nationCode + "&mobile=" + mobile + "&businessCode=" + data["businessCode"] + "&captcha=" + captcha);
        };
        this.showTimeClock = function() {
            var $checkCode = $(".input-code-div");
            //设置时间倒计时
            new TimerClock().showTimeClock($checkCode.find(".validate-text em"), function() {
                $checkCode.find(".validate-link").hide();
                $checkCode.find(".validate-text").show();
                return true;
            }, function() {
                $checkCode.find(".validate-text").hide();
                $checkCode.find(".validate-link").text("重新获取验证码").show();
            });
        };
        /**
         *  //发送短信
         * @param data
         * @param callback
         */
        this.sendSms = function(data) {
            var _this = this;
            $.get("/cas-api/sendSms?" + getPdata("terminal") + "&" + getPdata("businessSys") + data, _this.callback);
        };
    };
    //检查图形验证码是否正确
    function checkCaptcha(mobile, captcha, callback) {
        $.get("/cas/captcha/check?mobile=" + mobile + "&captcha=" + captcha, callback);
    }
    //检查手机号是否已注册
    function checkMobileRegister(mobile, callback) {
        $.get("/cas/checkMobileRegister?mobile=" + mobile, callback);
    }
    $(function() {
        // debugger
        //手机区号选择
        var $choiceCon = $(".phone-choice");
        var pageType = $("#ip-page-type").val();
        //页面类型
        var $checkCode = $("#ip-checkCode");
        //手机验证码
        var $mobile = $("#mobile");
        //手机号
        var $captcha = $(".login-input-item.img-code-item");
        //图形验证码div
        var $loginError = $(".carding-error span");
        //错误提醒位置
        $choiceCon.find(".phone-num").click(function(e) {
            e.stopPropagation();
            if ($(this).siblings(".phone-more").is(":hidden")) {
                $(this).parent().addClass("phone-choice-show");
                $(this).siblings(".phone-more").show();
            } else {
                $(this).parent().removeClass("phone-choice-show");
                $(this).siblings(".phone-more").hide();
            }
        });
        $(".phone-more").find("a").click(function() {
            var countryNum = $(this).find(".number-con").find("em").text();
            $choiceCon.find(".phone-num").find("em").text(countryNum);
            $choiceCon.removeClass("phone-choice-show");
            $choiceCon.find(".phone-more").hide();
        });
        //手机号格式化(xxx xxxx xxxx)
        $(document).on("keyup", "#mobile", function() {
            handle(1);
        });
        //enter 键
        $(document).keyup(function(event) {
            if (event.keyCode == 13) {
                $(".btn-phone-login").trigger("click");
            }
        });
        //绑定
        $(".btn-bind").click(function() {
            if ($(this).hasClass("btn-code-no")) {
                return;
            }
            var mobile = $mobile.val().replace(/\s/g, "");
            var checkCode = $checkCode.val();
            var nationCode = $(".phone-num em").text();
            if (/^\s*$/g.test(mobile)) {
                $loginError.text("请输入手机号码!").parent().show();
                return;
            }
            if (/^\s*$/g.test(checkCode)) {
                $loginError.text("请输入验证码!").parent().show();
                return;
            }
            var params = {
                nationCode: nationCode,
                mobile: mobile,
                smsId: $checkCode.attr("smsId"),
                checkCode: checkCode
            };
            $.post("/pay/bindMobile", params, function(data) {
                if (data) {
                    if (data.code == "0") {
                        $(".binging-main").hide();
                        $(".binging-success").show();
                    } else {
                        $loginError.text(data.msg).parent().show();
                        $(".carding-error").show();
                    }
                }
            }, "json");
        });
        var captcha = function(appId, randstr, ticket, onOff) {
            var _this = $(".binging-main .yz-link");
            if ($(_this).hasClass("btn-code-no")) {
                return;
            }
            var mobile = $mobile.val().replace(/\s/g, "");
            if (/^\s*$/g.test(mobile)) {
                $loginError.text("请输入手机号码!").parent().show();
                return;
            }
            $loginError.parent().hide();
            var param = JSON.stringify({
                phoneNo: mobile,
                businessCode: $(_this).siblings('input[name="businessCode"]').val(),
                appId: appId,
                randstr: randstr,
                ticket: ticket,
                onOff: onOff
            });
            $.ajax({
                type: "POST",
                url: api.sms.getCaptcha,
                contentType: "application/json;charset=utf-8",
                dataType: "json",
                data: param,
                success: function(data) {
                    if (data) {
                        if (data.code == "0") {
                            $checkCode.removeAttr("smsId");
                            $checkCode.attr("smsId", data.data.smsId);
                            var yzTime$ = $(_this).siblings(".yz-time");
                            yzTime$.addClass("btn-code-no");
                            yzTime$.show();
                            $(_this).hide();
                            $(".btn-none-bind").hide();
                            $(".btn-bind").show();
                            // $(".btn-binging").removeClass("btn-binging-no");
                            (function countdown() {
                                var yzt = yzTime$.text().replace(/秒后重发$/g, "");
                                yzt = /^\d+$/g.test(yzt) ? Number(yzt) : 60;
                                if (yzt && yzt >= 0) yzTime$.text(--yzt + "秒后重发");
                                if (yzt <= 0) {
                                    yzTime$.text("60秒后重发").hide();
                                    $(_this).text("重获验证码").show();
                                    return;
                                }
                                setTimeout(countdown, 1e3);
                            })();
                        } else if (data.code == "2112") {
                            showCaptcha(captcha);
                        } else if (data.code == "226") {
                            //图形验证码错误
                            $loginError.text("图形验证码错误").parent().show();
                        } else {
                            $loginError.text(data.msg).parent().show();
                        }
                    } else {
                        $loginError.text("发送短信失败").parent().show();
                    }
                }
            });
        };
        /*获取短信验证码*/
        $(".binging-main").delegate(".yz-link", "click", function() {
            captcha("", "", "", "");
        });
    });
    /**
     * 天御验证码相关功能
     */
    var capt;
    var showCaptcha = function(options) {
        var appId = "2071307690";
        if (!capt) {
            capt = new TencentCaptcha(appId, captchaCallback, {
                bizState: options
            });
        }
        capt.show();
    };
    var captchaCallback = function(res) {
        // res（用户主动关闭验证码）= {ret: 2, ticket: null}
        // res（验证成功） = {ret: 0, ticket: "String", randstr: "String"}
        if (res.ret === 0) {
            res.bizState(res.appid, res.randstr, res.ticket, 1);
        }
    };
    return {
        showCaptcha: showCaptcha
    };
});

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
