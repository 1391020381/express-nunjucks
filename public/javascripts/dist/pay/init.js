define("dist/pay/init", [ "../cmd-lib/tab", "../cmd-lib/toast", "../cmd-lib/myDialog", "../application/effect", "../application/checkLogin", "../application/api", "../application/method", "../application/login", "../cmd-lib/jqueryMd5", "../common/bilog", "base64", "../cmd-lib/util", "../report/config", "../common/bindphone", "../common/baidu-statistics", "./pay", "../common/bilog-module/payVipResult_bilog", "../common/bilog-module/payFileResult_bilog", "../common/bilog-module/payPrivilegeResult_bilog", "swiper", "./qr", "../cmd-lib/qr/qrcode.min", "../cmd-lib/qr/jquery.qrcode.min", "../application/urlConfig", "../common/coupon/couponOperate", "../common/coupon/template/options.html", "../common/coupon/couponIssue", "../cmd-lib/loading", "../common/coupon/template/couponCard.html" ], function(require, exports, module) {
    // var $ = require("$");
    require("../cmd-lib/tab");
    require("../cmd-lib/toast");
    require("../cmd-lib/myDialog");
    var isLogin = require("../application/effect").isLogin;
    //  require("./effect");  // 登录和刷新topbar
    var isAutoLogin = true;
    var callback = null;
    isLogin(null, false);
    //  require("./report");  
    require("./pay");
});

/**
 * @Description:
 * tab选项  defaultIndex:默认项  event:事件
 * activeClass:选中class  is_slide:是否可滑动
 * lazy : 默认点击图片不懒加载
 * @Author: your name
 */
define("dist/cmd-lib/tab", [], function(require, exports, module) {
    //var $ = require("$");
    (function($, doc, win) {
        $.fn.extend({
            tab: function(params) {
                var config = {
                    defaultIndex: 0,
                    event: "click",
                    activeClass: "active",
                    is_slide: false,
                    data_attribute: "src",
                    lazy: false,
                    element: "ul",
                    callback: false
                };
                var that = this;
                var options = $.extend(true, config, params), winHeight = $(window).outerWidth();
                var tab = $(this).find(".ui-tab-nav-item"), tabContent = $(this).find(".ui-tab-content");
                //是否有默认选项值
                if (config.defaultIndex) {
                    tab.removeClass(config.activeClass).eq(config.defaultIndex).addClass(config.activeClass);
                    tabContent.children(options.element).eq(config.defaultIndex).show().siblings().hide();
                }
                //滑动
                if (options.is_slide) {
                    tabContent.addClass("swiper-wrapper").children(options.element).show();
                }
                tab.on(options.event, function() {
                    var index = $(this).index();
                    $(this).addClass(options.activeClass).siblings().removeClass(options.activeClass);
                    if (options.is_slide) {
                        tabContent.css({
                            transform: "translate3D(" + -winHeight * index + "px,0,0)",
                            "-webkit-transform": "translate3D(" + -winHeight * index + "px,0,0)"
                        });
                    } else {
                        tabContent.children(options.element).eq(index).show().siblings().hide();
                    }
                    if (options.lazy && $(this).attr("lazy") !== "a") {
                        var top = $(window).scrollTop();
                        var sTop = top <= 0 ? top + 1 : top - 1;
                        $(window).scrollTop(sTop).scrollTop(top);
                    }
                    if (options.lazy) {
                        $(this).attr("lazy", "a");
                    }
                    that._callback(options.callback, $(this));
                });
            },
            _callback: function(cb, element) {
                if (cb && typeof cb === "function") {
                    cb.call(this, element);
                }
            }
        });
    })($, window, document);
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

// 通用头部的逻辑
define("dist/application/effect", [ "dist/application/checkLogin", "dist/application/api", "dist/application/method", "dist/application/login", "dist/cmd-lib/jqueryMd5", "dist/common/bilog", "base64", "dist/cmd-lib/util", "dist/report/config", "dist/cmd-lib/myDialog", "dist/cmd-lib/toast", "dist/common/bindphone", "dist/common/baidu-statistics", "dist/application/method" ], function(require, exports, module) {
    var checkLogin = require("dist/application/checkLogin");
    var method = require("dist/application/method");
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
        var $btn_user_more = $(".btn-user-more");
        var $vip_status = $(".vip-status");
        var $icon_iShare = $(".icon-iShare");
        var $top_user_more = $(".top-user-more");
        $btn_user_more.text(data.isVip == 1 ? "续费" : "开通");
        var $target = null;
        //VIP专享资料
        if (method.getCookie("file_state") === "6") {
            $(".vip-title").eq(0).show();
        }
        //vip
        if (data.isVip == 1) {
            $target = $vip_status.find('p[data-type="2"]');
            $target.find(".expire_time").html(data.expireTime);
            $target.show().siblings().hide();
            $top_user_more.addClass("top-vip-more");
            $(".isVip-show").find("span").html(data.expireTime);
            $(".isVip-show").removeClass("hide");
            $(".vip-privilege-btn").html("立即续费");
        } else if (data.userType == 1) {
            $target = $vip_status.find('p[data-type="3"]');
            $hasLogin.removeClass("user-con-vip");
            $target.show().siblings().hide();
        } else if (data.isVip == 0) {
            $hasLogin.removeClass("user-con-vip");
        } else if (data.isVip == 2) {
            console.log("data.isVip:", data.isVip);
        }
        $unLogin.hide();
        $hasLogin.find(".user-link .user-name").html(data.nickName);
        $hasLogin.find(".user-link img").attr("src", data.photoPicURL);
        $hasLogin.find(".top-user-more .name").html(data.nickName);
        $hasLogin.find(".top-user-more img").attr("src", data.photoPicURL);
        $hasLogin.show();
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
                // callback2&&callback2()
                callback && callback(data);
                refreshTopBar(data);
            });
        }
    }
    return {
        refreshTopBar: refreshTopBar,
        isLogin: isLogin
    };
});

/**
 * 登录相关
 */
define("dist/application/checkLogin", [ "dist/application/api", "dist/application/method", "dist/application/login", "dist/cmd-lib/jqueryMd5", "dist/common/bilog", "base64", "dist/cmd-lib/util", "dist/report/config", "dist/cmd-lib/myDialog", "dist/cmd-lib/toast", "dist/common/bindphone", "dist/common/baidu-statistics" ], function(require, exports, module) {
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
        getLoginData: function(callback) {
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
            //删域名cookie
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
            //删除第一次登录标识
            method.delCookie("_1st_l", "/");
            method.delCookie("ui", "/");
            $.get(api.user.loginOut, function(res) {
                console.log("loginOut:", res);
                if (res.code == 0) {
                    window.location.href = window.location.href;
                } else {
                    $.toast({
                        text: res.msg,
                        delay: 3e3
                    });
                }
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
            // login: router + '/usermanage/checkLogin',
            // 登出
            loginOut: gateway + "/cas/login/logout",
            // 我的收藏
            newCollect: gateway + "/content/collect/getUserFileList",
            // 透传老系统web登录信息接口
            // getJessionId: router + '/usermanage/getJessionId',
            //优惠券提醒
            // getSessionInfo: router + '/usermanage/getSessionInfo',
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
            getSearchList: gateway + "/search/content/byCondition"
        },
        normalFileDetail: {
            // 添加评论
            // addComment: router + '/fileSync/addComment',
            // 举报
            // reportContent: router + '/fileSync/addFeedback',
            // 是否已收藏
            // isStore: router + '/fileSync/getFileCollect',
            // 取消或者关注
            // collect: router + '/fileSync/collect',
            // 文件预下载
            filePreDownLoad: gateway + "/content/getPreFileDownUrl",
            // 文件下载
            // fileDownLoad: router + '/action/downloadUrl',  
            // 下载获取地址接口
            getFileDownLoadUrl: gateway + "/content/getFileDownUrl",
            // 文件打分
            // appraise: router + '/fileSync/appraise',
            // 文件预览判断接口
            // getPrePageInfo: router + '/fileSync/prePageInfo',
            getPrePageInfo: gateway + "/content/file/getPrePageInfo"
        },
        officeFileDetail: {},
        search: {
            //搜索服务--API接口--运营位数据--异步
            // byPosition: router + '/operating/byPosition',
            specialTopic: gateway + "/search/specialTopic/lisPage"
        },
        sms: {
            // 获取短信验证码
            // getCaptcha: router + '/usermanage/getSmsYzCode',
            sendCorpusDownloadMail: gateway + "/content/fileSendEmail/sendCorpusDownloadMail"
        },
        pay: {
            // 购买成功后,在页面自动下载文档
            // successBuyDownLoad: router + '/action/downloadNow',
            // 绑定订单
            bindUser: gateway + "/order/bind/loginUser",
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
        // vouchers:router+'/sale/vouchers',
        order: {
            // bindOrderByOrderNo:router+'/order/bindOrderByOrderNo',
            bindOrderByOrderNo: gateway + "/order/bind/byOrderNo",
            unloginOrderDown: router + "/order/unloginOrderDown",
            createOrderInfo: gateway + "/order/create/orderInfo",
            rightsVipGetUserMember: gateway + "/rights/vip/getUserMember",
            getOrderStatus: gateway + "/order/get/orderStatus",
            queryOrderlistByCondition: gateway + "/order/query/listByCondition",
            getOrderInfo: gateway + "/order/get/orderInfo"
        },
        // getHotSearch:router+'/search/getHotSearch',
        getHotSearch: gateway + "/cms/search/content/hotWords",
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
        }
    };
});

define("dist/application/login", [ "dist/cmd-lib/jqueryMd5", "dist/common/bilog", "base64", "dist/cmd-lib/util", "dist/application/method", "dist/report/config", "dist/application/api", "dist/cmd-lib/myDialog", "dist/cmd-lib/toast", "dist/common/bindphone" ], function(require, exports, module) {
    require("dist/cmd-lib/jqueryMd5");
    myWindow = "";
    // 保存第三方授权时,打开的标签
    var smsId = "";
    // 验证码
    var myWindow = "";
    // 保存 openWindow打开的对象
    var sceneId = "";
    // 微信二维码的场景id
    var mobile = "";
    // 获取验证码手机号
    var businessCode = "";
    // 获取验证码的场景
    var timer = null;
    // 二维码过期
    var setIntervalTimer = null;
    // 保存轮询微信登录的定时器
    var expires_in = "";
    // 二位码过期时间
    var loginCallback = null;
    // 保存调用登录dialog 时传入的函数 并在 登录成功后调用
    var touristLoginCallback = null;
    // 保存游客登录的传入的回调函数
    var normalPageView = require("dist/common/bilog").normalPageView;
    window.loginType = {
        type: "wechat",
        values: {
            0: "wechat",
            //微信登录
            1: "qq",
            //qq登录
            2: "weibo",
            //微博登录
            3: "phoneCode",
            //手机号+验证码
            4: "phonePw"
        }
    };
    //   保存登录方式在 登录数上报时使用
    var api = require("dist/application/api");
    var method = require("dist/application/method");
    require("dist/cmd-lib/myDialog");
    require("dist/cmd-lib/toast");
    var showCaptcha = require("dist/common/bindphone").showCaptcha;
    $(document).on("click", "#dialog-box .login-type-list .login-type-weixin .weixin-icon", function(e) {
        // 切换到微信登录
        $("#dialog-box .login-content .verificationCode-login").hide();
        $("#dialog-box .login-content .password-login").hide();
        $("#dialog-box .login-content .weixin-login").show();
        window.loginType.type = window.loginType.values[0];
    });
    $(document).on("click", "#dialog-box .login-type-list .login-type-verificationCode", function(e) {
        // 切换到验证码
        $("#dialog-box .login-content .password-login").hide();
        $("#dialog-box .login-content .weixin-login").hide();
        $("#dialog-box .login-content .verificationCode-login").show();
        window.loginType.type = window.loginType.values[3];
    });
    $(document).on("click", "#dialog-box .login-type-list .login-type-password", function(e) {
        // 切换到密码登录
        $("#dialog-box .login-content .weixin-login").hide();
        $("#dialog-box .login-content .verificationCode-login").hide();
        $("#dialog-box .login-content .password-login").show();
        window.loginType.type = window.loginType.values[4];
    });
    $(document).on("click", "#dialog-box .login-type-list .login-type", function() {
        // 第三方登录
        var loginType = $(this).attr("data-logintype");
        // qq  weibo
        if (loginType) {
            handleThirdCodelogin(loginType);
            if (loginType == "qq") {
                window.loginType.type = window.loginType.values[1];
            }
            if (loginType == "weibo") {
                window.loginType.type = window.loginType.values[2];
            }
        }
    });
    $(document).on("click", "#dialog-box .login-btn", function(e) {
        //  密码和验证码登录
        var logintype = $(this).attr("data-logintype");
        if (logintype == "verificationCode") {
            var nationCode = $("#dialog-box .verificationCode-login .phone-num").text().replace(/\+/, "").trim();
            var checkCode = $("#dialog-box .verificationCode-login .verification-code").val();
            var mobile = $("#dialog-box .verificationCode-login .telphone").val().trim();
            if (!method.testPhone(mobile) && nationCode == "86") {
                showErrorTip("verificationCode-login", true, "手机号错误");
                return;
            }
            if (!checkCode || checkCode && checkCode.length !== 4) {
                showErrorTip("verificationCode-login", true, "验证码错误");
                return;
            }
            showErrorTip("verificationCode-login", false, "");
            loginByPsodOrVerCode("codeLogin", mobile, nationCode, smsId, checkCode, "");
            // mobile 在获取验证码时 在全局mobile保存
            return;
        }
        if (logintype == "password") {
            // mobile
            var nationCode = $("#dialog-box .password-login .phone-num").text().replace(/\+/, "").trim();
            var password = $("#dialog-box .password-login .password .login-password:visible").val().trim();
            var mobile = $("#dialog-box .password-login .telphone").val().trim();
            if (!method.testPhone(mobile) && nationCode == 86) {
                showErrorTip("password-login", true, "手机号错误");
                return;
            }
            loginByPsodOrVerCode("ppLogin", mobile, nationCode, "", "", password);
            return;
        }
    });
    $(document).on("click", ".qr-refresh", function(e) {
        // 刷新微信登录二维码   包括游客登录页面
        getLoginQrcode("", "", true);
    });
    $(document).on("click", "#dialog-box .getVerificationCode", function(e) {
        // 获取验证码   在 getVerificationCode元素上 添加标识   0 获取验证码    1 倒计时   2 重新获取验证码
        var authenticationCodeType = $(this).attr("data-authenticationCodeType");
        var telphone = $("#dialog-box .verificationCode-login .input-mobile .telphone").val();
        var nationCode = $("#dialog-box .verificationCode-login .phone-num").text().replace(/\+/, "").trim();
        if (nationCode == "86") {
            if (!method.testPhone(telphone)) {
                showErrorTip("verificationCode-login", true, "手机号错误");
                return;
            } else {
                showErrorTip("verificationCode-login", false, "");
            }
            if (authenticationCodeType == 0 || authenticationCodeType == 2) {
                // 获取验证码 
                businessCode = 4;
                sendSms();
            }
        } else {
            if (authenticationCodeType == 0 || authenticationCodeType == 2) {
                // 获取验证码 
                businessCode = 4;
                sendSms();
            }
        }
    });
    $(document).on("input", "#dialog-box .verificationCode-login .telphone", function(e) {
        mobile = $(this).val();
        var verificationCode = $("#dialog-box .verificationCode-login .verification-code").val();
        var nationCode = $("#dialog-box .verificationCode-login .phone-num").text().replace(/\+/, "").trim();
        if (mobile.length > 11) {
            $("#dialog-box .telphone").val(mobile.slice(0, 11));
        }
        if (nationCode == "86") {
            // 国内号码
            if (method.testPhone(mobile.slice(0, 11))) {
                showErrorTip("verificationCode-login", false, "");
                $("#dialog-box .getVerificationCode").addClass("getVerificationCode-active");
                if (verificationCode && verificationCode.length >= 4) {
                    $("#dialog-box .verificationCode-login .login-btn").removeClass("login-btn-disable");
                    $("#dialog-box .verificationCode-login .login-btn").addClass("login-btn-active");
                }
            } else {
                if (mobile && mobile.length >= 11) {
                    showErrorTip("verificationCode-login", true, "手机号错误");
                    return;
                }
                $("#dialog-box .getVerificationCode").removeClass("getVerificationCode-active");
                $("#dialog-box .verificationCode-login .login-btn").removeClass("login-btn-active");
                $("#dialog-box .verificationCode-login .login-btn").addClass("login-btn-disable");
            }
        } else {
            if (mobile) {
                $("#dialog-box .getVerificationCode").addClass("getVerificationCode-active");
                if (verificationCode && verificationCode.length >= 4) {
                    $("#dialog-box .verificationCode-login .login-btn").removeClass("login-btn-disable");
                    $("#dialog-box .verificationCode-login .login-btn").addClass("login-btn-active");
                }
            } else {
                $("#dialog-box .getVerificationCode").removeClass("getVerificationCode-active");
                $("#dialog-box .verificationCode-login .login-btn").removeClass("login-btn-active");
                $("#dialog-box .verificationCode-login .login-btn").addClass("login-btn-disable");
            }
        }
    });
    $(document).on("input", "#dialog-box .verification-code", function(e) {
        // 
        var nationCode = $("#dialog-box .verificationCode-login .phone-num").text().replace(/\+/, "").trim();
        mobile = $("#dialog-box .verificationCode-login .telphone").val();
        verificationCode = $(this).val();
        if (verificationCode.length > 4) {
            $("#dialog-box .verification-code").val(verificationCode.slice(0, 4));
        }
        if (verificationCode && verificationCode.length >= 4) {
            showErrorTip("verificationCode-login", false, "");
        }
        if (nationCode == "86") {
            if (verificationCode && verificationCode.length >= 4 && method.testPhone(mobile)) {
                $("#dialog-box .verificationCode-login .login-btn").removeClass("login-btn-disable");
                $("#dialog-box .verificationCode-login .login-btn").addClass("login-btn-active");
            } else {
                $("#dialog-box .verificationCode-login .login-btn").removeClass("login-btn-active");
                $("#dialog-box .verificationCode-login .login-btn").addClass("login-btn-disable");
            }
        } else {
            if (verificationCode && verificationCode.length >= 4 && mobile) {
                $("#dialog-box .verificationCode-login .login-btn").removeClass("login-btn-disable");
                $("#dialog-box .verificationCode-login .login-btn").addClass("login-btn-active");
            } else {
                $("#dialog-box .verificationCode-login .login-btn").removeClass("login-btn-active");
                $("#dialog-box .verificationCode-login .login-btn").addClass("login-btn-disable");
            }
        }
    });
    $(document).on("input", "#dialog-box .password-login .telphone", function() {
        // 
        var nationCode = $("#dialog-box .password-login .phone-num").text().replace(/\+/, "").trim();
        mobile = $(this).val();
        if (mobile.length > 11) {
            $("#dialog-box .password-login .telphone").val(mobile.slice(0, 11));
        }
        if (nationCode == "86") {
            if (method.testPhone(mobile.slice(0, 11))) {
                showErrorTip("password-login", false, "");
                // 此时密码格式正确
                var loginPassword = $("#dialog-box .password-login .password .login-password:visible").val();
                if (loginPassword && loginPassword.length >= 6 && loginPassword && loginPassword.length <= 8) {
                    $("#dialog-box .password-login .login-btn").removeClass("login-btn-disable");
                    $("#dialog-box .password-login .login-btn").addClass("login-btn-active");
                }
            } else {
                if (mobile && mobile.length >= 11) {
                    showErrorTip("password-login", true, "手机号错误");
                    return;
                }
                $("#dialog-box .password-login .login-btn").removeClass("login-btn-active");
                $("#dialog-box .password-login .login-btn").addClass("login-btn-disable");
            }
        } else {
            if (mobile) {
                showErrorTip("password-login", false, "");
                if (loginPassword && loginPassword.length >= 6 && loginPassword && loginPassword.length <= 8) {
                    $("#dialog-box .password-login .login-btn").removeClass("login-btn-disable");
                    $("#dialog-box .password-login .login-btn").addClass("login-btn-active");
                }
            } else {
                $("#dialog-box .password-login .login-btn").removeClass("login-btn-active");
                $("#dialog-box .password-login .login-btn").addClass("login-btn-disable");
            }
        }
    });
    $(document).on("input", "#dialog-box .password-login .login-password", function() {
        var nationCode = $("#dialog-box .password-login .phone-num").text().replace(/\+/, "").trim();
        var password = $(this).val();
        var telphone = $("#dialog-box .password-login .telphone").val();
        if (password && password.length > 0) {
            $("#dialog-box .password-login .password .eye").show();
        } else {
            $("#dialog-box .password-login .password .close-eye").hide();
        }
        if (password.length > 16) {
            $("#dialog-box .password-login .login-password").val(password.slice(0, 16));
        }
        if (nationCode == "86") {
            if (method.testPhone(telphone) && password) {
                $("#dialog-box .password-login .login-btn").removeClass("login-btn-disable");
                $("#dialog-box .password-login .login-btn").addClass("login-btn-active");
            } else {
                $("#dialog-box .password-login .login-btn").removeClass("login-btn-active");
                $("#dialog-box .password-login .login-btn").addClass("login-btn-disable");
            }
        } else {
            if (telphone && password) {
                $("#dialog-box .password-login .login-btn").removeClass("login-btn-disable");
                $("#dialog-box .password-login .login-btn").addClass("login-btn-active");
            } else {
                $("#dialog-box .password-login .login-btn").removeClass("login-btn-active");
                $("#dialog-box .password-login .login-btn").addClass("login-btn-disable");
            }
        }
    });
    $(document).on("click", "#dialog-box .password-login .close-eye", function() {
        var textInput = $("#dialog-box .password-login .text-input");
        textInput.hide();
        $("#dialog-box .password-login .password-input").val(textInput.val());
        $("#dialog-box .password-login .password-input").show();
        $("#dialog-box .password-login .password .close-eye").hide();
        $("#dialog-box .password-login .password .eye").show();
    });
    $(document).on("click", "#dialog-box .password-login .eye", function() {
        var passwordInput = $("#dialog-box .password-login .password-input");
        passwordInput.hide();
        $("#dialog-box .password-login .text-input").val(passwordInput.val());
        $("#dialog-box .password-login .text-input").show();
        $("#dialog-box .password-login .password .eye").hide();
        $("#dialog-box .password-login .password .close-eye").show();
    });
    $(document).on("click", "#dialog-box  .close-btn", function(e) {
        closeRewardPop();
    });
    $(document).on("click", "#dialog-box .tourist-purchase-dialog .tabs .tab", function(e) {
        var dataType = $(this).attr("data-type");
        $("#dialog-box .tourist-purchase-dialog .tabs .tab").removeClass("tab-active");
        $(this).addClass("tab-active");
        if (dataType == "tourist-purchase") {
            $("#dialog-box .tourist-purchase-dialog .login-content").hide();
            $("#dialog-box .tourist-purchase-dialog .tourist-purchase-content").show();
        }
        if (dataType == "login-purchase") {
            normalPageView("loginResultPage");
            $("#dialog-box .tourist-purchase-dialog .tourist-purchase-content").hide();
            $("#dialog-box .tourist-purchase-dialog .login-content").show();
        }
    });
    // 选择区号的逻辑 
    $(document).on("click", "#dialog-box .phone-choice", function(e) {
        $(this).addClass("phone-choice-show");
        $("#dialog-box .phone-more").show();
        return false;
    });
    $(document).on("click", "#dialog-box .phone-more .phone-ele", function(e) {
        var areaNum = $(this).find(".number-con em").text();
        $("#dialog-box .phone-choice .phone-num .add").text("+" + areaNum);
        $("#dialog-box .phone-choice").removeClass("phone-choice-show");
        $("#dialog-box .phone-more").hide();
        $("#dialog-box input").val("");
        $("#dialog-box .getVerificationCode").removeClass("getVerificationCode-active");
        $("#dialog-box .login-btn").removeClass("login-btn-active");
        $("#dialog-box .login-btn").addClass("login-btn-disable");
        showErrorTip("verificationCode-login", false, "");
        showErrorTip("password-login", false, "");
        return false;
    });
    $(document).on("click", ".login-dialog", function(e) {
        $("#dialog-box .phone-choice").removeClass("phone-choice-show");
        $("#dialog-box .phone-more").hide();
    });
    $(document).on("click", ".login-content", function(e) {
        $("#dialog-box .phone-choice").removeClass("phone-choice-show");
        $("#dialog-box .phone-more").hide();
    });
    function closeRewardPop() {
        $(".common-bgMask").hide();
        $(".detail-bg-mask").hide();
        $("#dialog-box").hide();
        clearInterval(setIntervalTimer);
    }
    function showErrorTip(type, isShow, msg) {
        if (isShow) {
            if (type == "verificationCode-login") {
                $("#dialog-box .verificationCode-login .errortip .error-tip").text(msg);
                $("#dialog-box .verificationCode-login .errortip").show();
            } else if (type == "password-login") {
                $("#dialog-box .password-login .errortip .error-tip").text(msg);
                $("#dialog-box .password-login .errortip").show();
            }
        } else {
            if (type == "verificationCode-login") {
                $("#dialog-box .verificationCode-login .errortip .error-tip").text("");
                $("#dialog-box .verificationCode-login .errortip").hide();
            } else if (type == "password-login") {
                $("#dialog-box .password-login .errortip .error-tip").text("");
                $("#dialog-box .password-login .errortip").hide();
            }
        }
    }
    // 微信登录
    function getLoginQrcode(cid, fid, isqrRefresh, isTouristLogin, callback) {
        // 生成二维码 或刷新二维码 callback 在游客下载成功页面登录的callback
        $.ajax({
            url: api.user.getLoginQrcode,
            type: "POST",
            data: JSON.stringify({
                cid: cid || "",
                site: "1",
                fid: fid || "",
                sceneId: sceneId,
                domain: encodeURIComponent(document.domain)
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function(res) {
                if (res.code == "0") {
                    isShowQrInvalidtip(false);
                    expires_in = res.data && res.data.expires_in;
                    sceneId = res.data && res.data.sceneId;
                    countdown();
                    if (isTouristLogin || isqrRefresh) {
                        $(".tourist-login .qrcode-default").hide();
                        $(".tourist-login #login-qr").attr("src", res.data.url);
                        $(".tourist-login #login-qr").show();
                        if (callback) {
                            touristLoginCallback = callback;
                        }
                    } else {
                        $("#dialog-box .qrcode-default").hide();
                        $("#dialog-box #login-qr").attr("src", res.data.url);
                        $("#dialog-box #login-qr").show();
                    }
                    setIntervalTimer = setInterval(function() {
                        loginByWeChat();
                    }, 4e3);
                } else {
                    clearInterval(setIntervalTimer);
                    $.toast({
                        text: res.msg,
                        delay: 3e3
                    });
                }
            },
            error: function(error) {
                $.toast({
                    text: error.msg || "生成二维码接口错误",
                    delay: 3e3
                });
            }
        });
    }
    function isShowQrInvalidtip(flag) {
        // 普通微信登录  游客微信登录
        if (flag) {
            $(".login-qrContent .login-qr-invalidtip").show();
            $(".login-qrContent .qr-invalidtip").show();
            $(".login-qrContent .qr-refresh").show();
        } else {
            $(".login-qrContent .login-qr-invalidtip").hide();
            $(".login-qrContent .qr-invalidtip").hide();
            $(".login-qrContent .qr-refresh").hide();
        }
    }
    function countdown() {
        // 二维码失效倒计时
        if (expires_in <= 0) {
            clearTimeout(timer);
            clearInterval(setIntervalTimer);
            $("#dialog-box .qrcode-default").hide();
            isShowQrInvalidtip(true);
        } else {
            expires_in--;
            timer = setTimeout(countdown, 1e3);
        }
    }
    function loginByWeChat(cid, fid) {
        // 微信扫码登录  返回 access_token 通过 access_token(cuk)
        $.ajax({
            url: api.user.loginByWeChat,
            type: "POST",
            data: JSON.stringify({
                sceneId: sceneId,
                // 公众号登录二维码id
                site: "1",
                site: "1",
                cid: cid,
                fid: fid || "1816",
                domain: encodeURIComponent(document.domain)
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function(res) {
                if (res.code == "0") {
                    clearInterval(setIntervalTimer);
                    method.setCookieWithExpPath("cuk", res.data.access_token, res.data.expires_in * 1e3, "/");
                    closeRewardPop();
                    loginCallback && loginCallback();
                    touristLoginCallback && touristLoginCallback();
                    $.ajaxSetup({
                        headers: {
                            Authrization: method.getCookie("cuk")
                        }
                    });
                } else {
                    if (res.code != "411046") {
                        //  411046 用户未登录
                        clearInterval(setIntervalTimer);
                        $.toast({
                            text: res.msg,
                            delay: 3e3
                        });
                    }
                }
            },
            error: function(error) {
                $.toast({
                    text: error.msg || "公众号登录二维码",
                    delay: 3e3
                });
            }
        });
    }
    // QQ 微博 登录
    function handleThirdCodelogin(loginType) {
        var clientCode = loginType;
        var channel = 1;
        // 使用渠道：1:登录；2:绑定
        var locationUrl = window.location.origin ? window.location.origin : window.location.protocol + "//" + window.location.hostname;
        var location = locationUrl + "/node/redirectionURL.html" + "?clientCode=" + clientCode;
        var url = locationUrl + api.user.thirdCodelogin + "?clientCode=" + clientCode + "&channel=" + channel + "&terminal=pc" + "&businessSys=ishare" + "&location=" + encodeURIComponent(location);
        openWindow(url);
    }
    function openWindow(url) {
        // 第三方打开新的标签页
        var iWidth = 585;
        var iHeight = 525;
        var iTop = (window.screen.availHeight - 30 - iHeight) / 2;
        var iLeft = (window.screen.availWidth - 10 - iWidth) / 2;
        var param = "height=" + iHeight + ",width=" + iWidth + ",top=" + iTop + ",left=" + iLeft + ",toolbar=no, menubar=no, scrollbars=no, status=no, location=yes, resizable=yes";
        myWindow = window.open(url, "", param);
    }
    function thirdLoginRedirect(code, channel, clientCode) {
        // 根据授权code 获取 access_token
        $.ajax({
            url: api.user.thirdLoginRedirect,
            type: "POST",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({
                terminal: "0",
                thirdType: clientCode,
                code: code,
                businessSys: "ishare"
            }),
            dataType: "json",
            success: function(res) {
                if (res.code == "0") {
                    method.setCookieWithExpPath("cuk", res.data && res.data.access_token, res.data.expires_in * 1e3, "/");
                    closeRewardPop();
                    loginCallback && loginCallback();
                    touristLoginCallback && touristLoginCallback();
                    myWindow.close();
                    $.ajaxSetup({
                        headers: {
                            Authrization: method.getCookie("cuk")
                        }
                    });
                } else {
                    $.toast({
                        text: res.msg,
                        delay: 3e3
                    });
                    myWindow.close();
                }
            },
            error: function(error) {
                myWindow.close();
                $.toast({
                    text: error.msg,
                    delay: 3e3
                });
            }
        });
    }
    window.thirdLoginRedirect = thirdLoginRedirect;
    function sendSms(appId, randstr, ticket, onOff) {
        // 发送短信验证码
        $.ajax({
            url: api.user.sendSms,
            type: "POST",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({
                mobile: mobile,
                nationCode: $("#dialog-box .verificationCode-login .phone-num").text().replace(/\+/, "").trim(),
                businessCode: businessCode,
                // 功能模块（1-注册模块、2-找回密码、3-修改密码、4-登录、5-绑定/更换手机号手机号（会检查手机号是否被使用过）、6-旧手机号获取验证码）
                terminal: "pc",
                appId: appId,
                randstr: randstr,
                ticket: ticket,
                onOff: onOff
            }),
            dataType: "json",
            success: function(res) {
                if (res.code == "0") {
                    smsId = res.data.smsId;
                    var authenticationCode = $("#dialog-box .getVerificationCode");
                    authenticationCode.attr("data-authenticationCodeType", 1);
                    // 获取验证码
                    var timer = null;
                    var textNumber = 60;
                    (function countdown() {
                        if (textNumber <= 0) {
                            clearTimeout(timer);
                            authenticationCode.text("重新获取验证码");
                            authenticationCode.css({
                                "font-size": "13px",
                                color: "#fff",
                                "border-color": "#eee"
                            });
                            authenticationCode.attr("data-authenticationCodeType", 2);
                        } else {
                            authenticationCode.text(textNumber--);
                            authenticationCode.css({
                                color: "#fff",
                                "border-color": "#eee"
                            });
                            timer = setTimeout(countdown, 1e3);
                        }
                    })();
                } else if (res.code == "411015") {
                    // 单日ip获取验证码超过三次
                    showCaptcha(sendSms);
                } else if (res.code == "411033") {
                    // 图形验证码错误
                    $.toast({
                        text: "图形验证码错误",
                        delay: 3e3
                    });
                } else {
                    $.toast({
                        text: res.msg,
                        delay: 3e3
                    });
                }
            },
            error: function(error) {
                $.toast({
                    text: error.msg || "获取验证码错误",
                    delay: 3e3
                });
            }
        });
    }
    function loginByPsodOrVerCode(loginType, mobile, nationCode, smsId, checkCode, password) {
        // 通过密码或验证码登录
        $.ajax({
            url: api.user.loginByPsodOrVerCode,
            type: "POST",
            data: JSON.stringify({
                loginType: loginType,
                terminal: "pc",
                mobile: mobile,
                nationCode: nationCode,
                smsId: smsId,
                checkCode: checkCode,
                password: $.md5(password)
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function(res) {
                if (res.code == "0") {
                    method.setCookieWithExpPath("cuk", res.data.access_token, res.data.expires_in * 1e3, "/");
                    closeRewardPop();
                    loginCallback && loginCallback();
                    touristLoginCallback && touristLoginCallback();
                    $.ajaxSetup({
                        headers: {
                            Authrization: method.getCookie("cuk")
                        }
                    });
                } else {
                    if (checkCode) {
                        showErrorTip("verificationCode-login", true, res.msg);
                    } else {
                        showErrorTip("password-login", true, res.msg);
                    }
                }
            },
            error: function(error) {
                $.toast({
                    text: error.msg || "验证码或密码登录错误",
                    delay: 3e3
                });
            }
        });
    }
    function showLoginDialog(params, callback) {
        loginCallback = callback;
        var loginDialog = $("#login-dialog");
        normalPageView("loginResultPage");
        $("#dialog-box").dialog({
            html: loginDialog.html(),
            closeOnClickModal: false
        }).open(getLoginQrcode(params.clsId, params.fid));
    }
    function showTouristPurchaseDialog(params, callback) {
        // 游客购买的回调函数
        touristLoginCallback = callback;
        var touristPurchaseDialog = $("#tourist-purchase-dialog");
        $("#dialog-box").dialog({
            html: touristPurchaseDialog.html(),
            closeOnClickModal: false
        }).open(getLoginQrcode(params.clsId, params.fid));
    }
    return {
        showLoginDialog: showLoginDialog,
        showTouristPurchaseDialog: showTouristPurchaseDialog,
        getLoginQrcode: getLoginQrcode
    };
});

/**
* jQuery MD5 hash algorithm function
* 
* <code>
* Calculate the md5 hash of a String 
* String $.md5 ( String str )
* </code>
* 
* Calculates the MD5 hash of str using the 绂� RSA Data Security, Inc. MD5 Message-Digest Algorithm, and returns that hash. 
* MD5 (Message-Digest algorithm 5) is a widely-used cryptographic hash function with a 128-bit hash value. MD5 has been employed in a wide variety of security applications, and is also commonly used to check the integrity of data. The generated hash is also non-reversable. Data cannot be retrieved from the message digest, the digest uniquely identifies the data.
* MD5 was developed by Professor Ronald L. Rivest in 1994. Its 128 bit (16 byte) message digest makes it a faster implementation than SHA-1.
* This script is used to process a variable length message into a fixed-length output of 128 bits using the MD5 algorithm. It is fully compatible with UTF-8 encoding. It is very useful when u want to transfer encrypted passwords over the internet. If you plan using UTF-8 encoding in your project don't forget to set the page encoding to UTF-8 (Content-Type meta tag). 
* This function orginally get from the WebToolkit and rewrite for using as the jQuery plugin.
* 
* Example
* Code
* <code>
* $.md5("I'm Persian."); 
* </code>
* Result
* <code>
* "b8c901d0f02223f9761016cfff9d68df"
* </code>
* 
* @alias Muhammad Hussein Fattahizadeh < muhammad [AT] semnanweb [DOT] com >
* @link http://www.semnanweb.com/jquery-plugin/md5.html
* @see http://www.webtoolkit.info/
* @license http://www.gnu.org/licenses/gpl.html [GNU General Public License]
* @param {jQuery} {md5:function(string))
* @return string
*/
define("dist/cmd-lib/jqueryMd5", [], function(require, exports, module) {
    (function($) {
        var rotateLeft = function(lValue, iShiftBits) {
            return lValue << iShiftBits | lValue >>> 32 - iShiftBits;
        };
        var addUnsigned = function(lX, lY) {
            var lX4, lY4, lX8, lY8, lResult;
            lX8 = lX & 2147483648;
            lY8 = lY & 2147483648;
            lX4 = lX & 1073741824;
            lY4 = lY & 1073741824;
            lResult = (lX & 1073741823) + (lY & 1073741823);
            if (lX4 & lY4) return lResult ^ 2147483648 ^ lX8 ^ lY8;
            if (lX4 | lY4) {
                if (lResult & 1073741824) return lResult ^ 3221225472 ^ lX8 ^ lY8; else return lResult ^ 1073741824 ^ lX8 ^ lY8;
            } else {
                return lResult ^ lX8 ^ lY8;
            }
        };
        var F = function(x, y, z) {
            return x & y | ~x & z;
        };
        var G = function(x, y, z) {
            return x & z | y & ~z;
        };
        var H = function(x, y, z) {
            return x ^ y ^ z;
        };
        var I = function(x, y, z) {
            return y ^ (x | ~z);
        };
        var FF = function(a, b, c, d, x, s, ac) {
            a = addUnsigned(a, addUnsigned(addUnsigned(F(b, c, d), x), ac));
            return addUnsigned(rotateLeft(a, s), b);
        };
        var GG = function(a, b, c, d, x, s, ac) {
            a = addUnsigned(a, addUnsigned(addUnsigned(G(b, c, d), x), ac));
            return addUnsigned(rotateLeft(a, s), b);
        };
        var HH = function(a, b, c, d, x, s, ac) {
            a = addUnsigned(a, addUnsigned(addUnsigned(H(b, c, d), x), ac));
            return addUnsigned(rotateLeft(a, s), b);
        };
        var II = function(a, b, c, d, x, s, ac) {
            a = addUnsigned(a, addUnsigned(addUnsigned(I(b, c, d), x), ac));
            return addUnsigned(rotateLeft(a, s), b);
        };
        var convertToWordArray = function(string) {
            var lWordCount;
            var lMessageLength = string.length;
            var lNumberOfWordsTempOne = lMessageLength + 8;
            var lNumberOfWordsTempTwo = (lNumberOfWordsTempOne - lNumberOfWordsTempOne % 64) / 64;
            var lNumberOfWords = (lNumberOfWordsTempTwo + 1) * 16;
            var lWordArray = Array(lNumberOfWords - 1);
            var lBytePosition = 0;
            var lByteCount = 0;
            while (lByteCount < lMessageLength) {
                lWordCount = (lByteCount - lByteCount % 4) / 4;
                lBytePosition = lByteCount % 4 * 8;
                lWordArray[lWordCount] = lWordArray[lWordCount] | string.charCodeAt(lByteCount) << lBytePosition;
                lByteCount++;
            }
            lWordCount = (lByteCount - lByteCount % 4) / 4;
            lBytePosition = lByteCount % 4 * 8;
            lWordArray[lWordCount] = lWordArray[lWordCount] | 128 << lBytePosition;
            lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
            lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
            return lWordArray;
        };
        var wordToHex = function(lValue) {
            var WordToHexValue = "", WordToHexValueTemp = "", lByte, lCount;
            for (lCount = 0; lCount <= 3; lCount++) {
                lByte = lValue >>> lCount * 8 & 255;
                WordToHexValueTemp = "0" + lByte.toString(16);
                WordToHexValue = WordToHexValue + WordToHexValueTemp.substr(WordToHexValueTemp.length - 2, 2);
            }
            return WordToHexValue;
        };
        var uTF8Encode = function(string) {
            string = string.replace(/\x0d\x0a/g, "\n");
            var output = "";
            for (var n = 0; n < string.length; n++) {
                var c = string.charCodeAt(n);
                if (c < 128) {
                    output += String.fromCharCode(c);
                } else if (c > 127 && c < 2048) {
                    output += String.fromCharCode(c >> 6 | 192);
                    output += String.fromCharCode(c & 63 | 128);
                } else {
                    output += String.fromCharCode(c >> 12 | 224);
                    output += String.fromCharCode(c >> 6 & 63 | 128);
                    output += String.fromCharCode(c & 63 | 128);
                }
            }
            return output;
        };
        $.extend({
            md5: function(string) {
                var x = Array();
                var k, AA, BB, CC, DD, a, b, c, d;
                var S11 = 7, S12 = 12, S13 = 17, S14 = 22;
                var S21 = 5, S22 = 9, S23 = 14, S24 = 20;
                var S31 = 4, S32 = 11, S33 = 16, S34 = 23;
                var S41 = 6, S42 = 10, S43 = 15, S44 = 21;
                string = uTF8Encode(string);
                x = convertToWordArray(string);
                a = 1732584193;
                b = 4023233417;
                c = 2562383102;
                d = 271733878;
                for (k = 0; k < x.length; k += 16) {
                    AA = a;
                    BB = b;
                    CC = c;
                    DD = d;
                    a = FF(a, b, c, d, x[k + 0], S11, 3614090360);
                    d = FF(d, a, b, c, x[k + 1], S12, 3905402710);
                    c = FF(c, d, a, b, x[k + 2], S13, 606105819);
                    b = FF(b, c, d, a, x[k + 3], S14, 3250441966);
                    a = FF(a, b, c, d, x[k + 4], S11, 4118548399);
                    d = FF(d, a, b, c, x[k + 5], S12, 1200080426);
                    c = FF(c, d, a, b, x[k + 6], S13, 2821735955);
                    b = FF(b, c, d, a, x[k + 7], S14, 4249261313);
                    a = FF(a, b, c, d, x[k + 8], S11, 1770035416);
                    d = FF(d, a, b, c, x[k + 9], S12, 2336552879);
                    c = FF(c, d, a, b, x[k + 10], S13, 4294925233);
                    b = FF(b, c, d, a, x[k + 11], S14, 2304563134);
                    a = FF(a, b, c, d, x[k + 12], S11, 1804603682);
                    d = FF(d, a, b, c, x[k + 13], S12, 4254626195);
                    c = FF(c, d, a, b, x[k + 14], S13, 2792965006);
                    b = FF(b, c, d, a, x[k + 15], S14, 1236535329);
                    a = GG(a, b, c, d, x[k + 1], S21, 4129170786);
                    d = GG(d, a, b, c, x[k + 6], S22, 3225465664);
                    c = GG(c, d, a, b, x[k + 11], S23, 643717713);
                    b = GG(b, c, d, a, x[k + 0], S24, 3921069994);
                    a = GG(a, b, c, d, x[k + 5], S21, 3593408605);
                    d = GG(d, a, b, c, x[k + 10], S22, 38016083);
                    c = GG(c, d, a, b, x[k + 15], S23, 3634488961);
                    b = GG(b, c, d, a, x[k + 4], S24, 3889429448);
                    a = GG(a, b, c, d, x[k + 9], S21, 568446438);
                    d = GG(d, a, b, c, x[k + 14], S22, 3275163606);
                    c = GG(c, d, a, b, x[k + 3], S23, 4107603335);
                    b = GG(b, c, d, a, x[k + 8], S24, 1163531501);
                    a = GG(a, b, c, d, x[k + 13], S21, 2850285829);
                    d = GG(d, a, b, c, x[k + 2], S22, 4243563512);
                    c = GG(c, d, a, b, x[k + 7], S23, 1735328473);
                    b = GG(b, c, d, a, x[k + 12], S24, 2368359562);
                    a = HH(a, b, c, d, x[k + 5], S31, 4294588738);
                    d = HH(d, a, b, c, x[k + 8], S32, 2272392833);
                    c = HH(c, d, a, b, x[k + 11], S33, 1839030562);
                    b = HH(b, c, d, a, x[k + 14], S34, 4259657740);
                    a = HH(a, b, c, d, x[k + 1], S31, 2763975236);
                    d = HH(d, a, b, c, x[k + 4], S32, 1272893353);
                    c = HH(c, d, a, b, x[k + 7], S33, 4139469664);
                    b = HH(b, c, d, a, x[k + 10], S34, 3200236656);
                    a = HH(a, b, c, d, x[k + 13], S31, 681279174);
                    d = HH(d, a, b, c, x[k + 0], S32, 3936430074);
                    c = HH(c, d, a, b, x[k + 3], S33, 3572445317);
                    b = HH(b, c, d, a, x[k + 6], S34, 76029189);
                    a = HH(a, b, c, d, x[k + 9], S31, 3654602809);
                    d = HH(d, a, b, c, x[k + 12], S32, 3873151461);
                    c = HH(c, d, a, b, x[k + 15], S33, 530742520);
                    b = HH(b, c, d, a, x[k + 2], S34, 3299628645);
                    a = II(a, b, c, d, x[k + 0], S41, 4096336452);
                    d = II(d, a, b, c, x[k + 7], S42, 1126891415);
                    c = II(c, d, a, b, x[k + 14], S43, 2878612391);
                    b = II(b, c, d, a, x[k + 5], S44, 4237533241);
                    a = II(a, b, c, d, x[k + 12], S41, 1700485571);
                    d = II(d, a, b, c, x[k + 3], S42, 2399980690);
                    c = II(c, d, a, b, x[k + 10], S43, 4293915773);
                    b = II(b, c, d, a, x[k + 1], S44, 2240044497);
                    a = II(a, b, c, d, x[k + 8], S41, 1873313359);
                    d = II(d, a, b, c, x[k + 15], S42, 4264355552);
                    c = II(c, d, a, b, x[k + 6], S43, 2734768916);
                    b = II(b, c, d, a, x[k + 13], S44, 1309151649);
                    a = II(a, b, c, d, x[k + 4], S41, 4149444226);
                    d = II(d, a, b, c, x[k + 11], S42, 3174756917);
                    c = II(c, d, a, b, x[k + 2], S43, 718787259);
                    b = II(b, c, d, a, x[k + 9], S44, 3951481745);
                    a = addUnsigned(a, AA);
                    b = addUnsigned(b, BB);
                    c = addUnsigned(c, CC);
                    d = addUnsigned(d, DD);
                }
                var tempValue = wordToHex(a) + wordToHex(b) + wordToHex(c) + wordToHex(d);
                return tempValue.toLowerCase();
            }
        });
    })(jQuery);
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
        visitID: method.getCookie("visitor_id") || "",
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
            } else if (cnt == "fileDetailComment") {} else if (cnt == "fileDetailScore") {
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
            customData.moduleID = moduleID;
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
            customData = {
                fileID: window.pageConfig.params.g_fileId,
                fileName: window.pageConfig.params.file_title,
                fileCategoryID: window.pageConfig.params.classid1 + "||" + window.pageConfig.params.classid2 + "||" + window.pageConfig.params.classid3,
                fileCategoryName: window.pageConfig.params.classidName1 + "||" + window.pageConfig.params.classidName2 + "||" + window.pageConfig.params.classidName3,
                filePayType: payTypeMapping[window.pageConfig.params.file_state]
            };
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
            $.getJSON("https://dw.iask.com.cn/ishare/jsonp?data=" + base64.encode(JSON.stringify(result)) + "&jsoncallback=?", function(data) {});
        });
    }
    module.exports = {
        normalPageView: function(loginResult) {
            normalPageView(loginResult);
        },
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

define("dist/common/bindphone", [ "dist/application/api", "dist/application/method" ], function(require, exports, moudle) {
    //var $ = require("$");
    var api = require("dist/application/api");
    var method = require("dist/application/method");
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
            // $.post('/pay/bindMobile', params, function (data) {
            //     if (data) {
            //         if (data.code == '0') {
            //             $(".binging-main").hide();
            //             $(".binging-success").show();
            //         } else {
            //             $loginError.text(data.msg).parent().show();
            //             $(".carding-error").show();
            //         }
            //     }
            // }, 'json');
            userBindMobile(mobile, $checkCode.attr("smsId"), checkCode);
            function userBindMobile(mobile, smsId, checkCode) {
                // 绑定手机号接口
                $.ajax({
                    headers: {
                        Authrization: method.getCookie("cuk")
                    },
                    url: api.user.userBindMobile,
                    type: "POST",
                    contentType: "application/json; charset=utf-8",
                    data: JSON.stringify({
                        terminal: "pc",
                        mobile: mobile,
                        nationCode: $(".phone-choice .phone-num em").text(),
                        smsId: smsId,
                        checkCode: checkCode
                    }),
                    dataType: "json",
                    success: function(res) {
                        if (res.code == "0") {
                            $(".binging-main").hide();
                            $(".binging-success").show();
                        } else {
                            $loginError.text(res.msg).parent().show();
                            $(".carding-error").show();
                        }
                    },
                    error: function(error) {
                        console.log("userBindMobile:", error);
                    }
                });
            }
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
                // 'phoneNo': mobile,
                // 'businessCode': $(_this).siblings('input[name="businessCode"]').val(),
                // 'appId': appId,
                // 'randstr': randstr,
                // 'ticket': ticket,
                // 'onOff': onOff
                mobile: mobile,
                nationCode: $(".phone-choice .phone-num em").text(),
                businessCode: $(_this).siblings('input[name="businessCode"]').val(),
                // 功能模块（1-注册模块、2-找回密码、3-修改密码、4-登录、5-绑定/更换手机号手机号（会检查手机号是否被使用过）、6-旧手机号获取验证码）
                terminal: "pc",
                appId: appId,
                randstr: randstr,
                ticket: ticket,
                onOff: onOff
            });
            $.ajax({
                type: "POST",
                // url: api.sms.getCaptcha,
                url: api.user.sendSms,
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
                        } else if (data.code == "411015") {
                            showCaptcha(captcha);
                        } else if (data.code == "411033") {
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

define("dist/pay/pay", [ "dist/common/bilog-module/payVipResult_bilog", "dist/common/bilog", "base64", "dist/cmd-lib/util", "dist/application/method", "dist/report/config", "dist/common/bilog-module/payFileResult_bilog", "dist/common/bilog-module/payPrivilegeResult_bilog", "swiper", "dist/pay/qr", "dist/cmd-lib/qr/qrcode.min", "dist/cmd-lib/qr/jquery.qrcode.min", "dist/application/urlConfig", "dist/application/api", "dist/common/coupon/couponOperate", "dist/cmd-lib/toast", "dist/common/coupon/couponIssue", "dist/cmd-lib/loading", "dist/application/checkLogin", "dist/application/login", "dist/cmd-lib/jqueryMd5", "dist/cmd-lib/myDialog", "dist/common/bindphone", "dist/common/baidu-statistics", "dist/application/effect" ], function(require, exports, moudle) {
    // 自有埋点注入
    var payVipResult_bilog = require("dist/common/bilog-module/payVipResult_bilog");
    var payFileResult_bilog = require("dist/common/bilog-module/payFileResult_bilog");
    var payPrivilegeResult_bilog = require("dist/common/bilog-module/payPrivilegeResult_bilog");
    // ==== end ====
    //所有支付引用办公频道支付js
    // var $ = require("$");
    require("swiper");
    var method = require("dist/application/method");
    var utils = require("dist/cmd-lib/util");
    var qr = require("dist/pay/qr");
    //var report = require("./report");
    var urlConfig = require("dist/application/urlConfig");
    var api = require("dist/application/api");
    require("dist/common/coupon/couponOperate");
    require("dist/common/coupon/couponIssue");
    require("dist/common/bilog");
    var userInfo = method.getCookie("ui") ? JSON.parse(method.getCookie("ui")) : {};
    var renewalVIP = window.pageConfig.params.isVip == "1" ? "1" : "0";
    // 标识是否是续费vip
    var checkStatus = window.pageConfig.params.checkStatus || "10";
    var isLogin = require("dist/application/effect").isLogin;
    var expires_in = 60;
    // 支付二维码过期时间
    var timer = null;
    // 定时器
    var isAutoLogin = true;
    var callback = null;
    isLogin(initPage, isAutoLogin, initPage);
    //生成二维码
    function initPage(userInfo) {
        $(function() {
            var flag = $("#ip-flag").val();
            // result.flag
            // var uid = $("#ip-uid").val();    //  results.data.uid
            var uid = $("#ip-uid").val() || userInfo.userId;
            var type = $("#ip-type").val();
            // results.type
            var isVip = $("#ip-isVip").val();
            //   results.data.isVip  获取保存在input的数据
            if (flag == 3 && uid) {
                //二维码页面
                if (type == 0) {
                    //vip购买
                    if (method.getCookie("cuk")) {
                        $(".btn-vip-login-arrive").click();
                    }
                } else if (type == 2) {
                    //文件购买
                    if (isVip != 1) {
                        $(".price-discount").hide();
                    } else {
                        $(".price-discount").show();
                    }
                    if (method.getCookie("cuk")) {
                        $(".btn-file-login-arrive").click();
                    }
                }
                // var oid = $("#ip-oid").val() ||method.getParam('orderNo'); // 订单号 orderNo
                var oid = method.getParam("orderNo");
                if (oid) {
                    $(".carding-pay-item .oid").text(oid);
                    // var url = "http://ishare.iask.sina.com.cn/notm/qr?oid=" + oid;
                    //    var url = "http://ishare.iask.sina.com.cn/pay/qr?orderNo=" + oid + '&checkStatus='+checkStatus;
                    var url = urlConfig.payUrl + "/pay/qr?orderNo=" + oid + "&checkStatus=" + checkStatus;
                    try {
                        qr.createQrCode(url, "pay-qr-code", 180, 180);
                        $(".btn-qr-show-success").click();
                        $(".pay-qrcode-loading").hide();
                        isShowQrInvalidtip(false);
                        countdown();
                    } catch (e) {
                        console.log("生成二维码异常");
                        $(".btn-qr-show-fail").click();
                    }
                    alipayClick(oid);
                    // 获取支付状态结果
                    getOrderInfo(oid);
                } else {
                    utils.showAlertDialog("温馨提示", "订单失效，请重新下单");
                }
            } else if (flag == "true" && uid) {
                //成功页面
                var mobile = $("#ip-mobile").val();
                // mobile = false
                if (mobile) {
                    //隐藏绑定手机号模块 公众号模块居中
                    $(".carding-info-bottom").addClass("carding-binding-ok");
                }
                if (type === "2") {
                    buySuccessDownLoad();
                }
            } else if (flag == "false" && uid) {} else if (flag == "0") {}
        });
    }
    function countdown() {
        // 二维码失效倒计时
        if (expires_in <= 0) {
            clearTimeout(timer);
            expires_in = 60;
            $(".pic-pay-code .pay-qrcode-loading").hide();
            isShowQrInvalidtip(true);
        } else {
            expires_in--;
            timer = setTimeout(countdown, 1e3);
        }
    }
    function isShowQrInvalidtip(flag) {
        // 
        if (flag) {
            $(".pic-pay-code .pay-qrcode-expire").show();
            $(".pic-pay-code .pay-qrcode-invalidtip").show();
            $(".pic-pay-code .pay-qrcode-refresh").show();
        } else {
            $(".pic-pay-code .pay-qrcode-expire").hide();
            $(".pic-pay-code .pay-qrcode-invalidtip").hide();
            $(".pic-pay-code .pay-qrcode-refresh").hide();
        }
    }
    $(document).on("click", ".pic-pay-code .pay-qrcode-refresh", function(e) {
        initPage(userInfo);
    });
    var fid = window.pageConfig.params.g_fileId;
    if (!fid) {
        fid = method.getParam("fid");
        window.pageConfig.params.g_fileId = fid;
    }
    // checkStatus   10 资料是vip 用户不是vip   13 资料时vip 用户是vip特权不够  8 资料是付费 用户未购买
    //支付相关参数
    var params = {
        fid: window.pageConfig.params.g_fileId || "",
        //文件id
        aid: "",
        //活动id
        vid: "",
        //vip套餐id
        pid: $(".pay-pri-list .active").attr("data-pid"),
        //特权id
        oid: "",
        //订单ID 获取旧订单
        type: window.pageConfig.params.checkStatus || "10",
        // 用户search 续费vip进入                                                              //套餐类别 0: VIP套餐， 1:特权套餐 ， 2: 文件下载
        ref: utils.getPageRef(window.pageConfig.params.g_fileId),
        //正常为0,360合作文档为1，360文库为3
        referrer: document.referrer || document.URL,
        //来源网址
        remark: "",
        //页面来源 其他-办公频道           
        ptype: "",
        //现金:cash, 下载券:volume, 免费:free, 仅在线阅读:readonly
        isVip: window.pageConfig.params.isVip || 0,
        //是否vip
        vipMemberId: ""
    };
    //从详情页进入vip所需要来源
    // if (method.getParam("remark") === "office") { 
    //     params.remark = "office";
    //     window.pageConfig.gio.reportVipData.channelName_var = "办公频道";
    //     window.pageConfig.gio.reportPrivilegeData.channelName_var = "办公频道";
    // } else {
    //     params.remark = "other";
    //     window.pageConfig.gio.reportVipData.channelName_var = "其他";
    //     window.pageConfig.gio.reportPrivilegeData.channelName_var = "其他";
    // }
    if (method.getParam("ref")) {
        params.ref = utils.getPageRef(fid);
    }
    // 点击下载
    $(".quick-down-a").click(function() {
        buySuccessDownLoad();
    });
    $(".js-buy-open").click(function() {
        // 支付页面 fail.html payConfirm.html
        var ref = utils.getPageRef(fid);
        //用户来源
        var urlQuery = "?fid=" + fid + "&ref=" + ref;
        var mark = $(this).data("type");
        var type = params.type;
        if (type == 10) {
            // mark == 'vip'
            // window.open('/pay/vip.html' + params);
            method.compatibleIESkip("/pay/vip.html" + urlQuery, true);
        } else if (type == "13") {
            // mark == 'privilege'
            // window.open('/pay/privilege.html' + params);
            method.compatibleIESkip("/pay/privilege.html" + urlQuery, true);
        } else if (type == "8") {
            method.compatibleIESkip("/pay/vip.html" + urlQuery, true);
        }
    });
    //特权套餐切换
    $(document).on("click", "ul.pay-pri-list li", function() {
        $(this).siblings("li").removeClass("active");
        $(this).addClass("active");
        var price = $(this).data("price");
        var activePrice = $(this).data("activeprice");
        var discountPrice = $(this).data("discountprice");
        var giveDesc = $this.find(".give-desc").html() || "";
        $(".pay-privilege-text").html(giveDesc);
        if (activePrice > 0) {
            $("#activePrice").html(activePrice);
            if (discountPrice > 0) {
                $("#discountPrice").html("（立省" + discountPrice + "元）");
                $("#discountPrice").show();
            } else {
                $("#discountPrice").hide();
            }
        } else {
            $("#activePrice").html(price);
            $("#discountPrice").hide();
        }
        if ($(this).data("pid")) {
            params.pid = $(this).data("pid");
            params.aid = $(this).data("actids");
            params.type = "13";
        }
    });
    //vip套餐切换
    $(".js-tab").each(function() {
        $(this).tab({
            activeClass: "active",
            element: "div",
            callback: function($this) {
                var price = $this.data("price");
                var activePrice = $this.data("activeprice");
                var discountPrice = $this.data("discountprice");
                // class give-desc
                var giveDesc = $this.find(".give-desc").html() || "";
                $(".js-tab .gift-copy").html(giveDesc);
                if (activePrice > 0) {
                    $("#activePrice").html(activePrice);
                    if (discountPrice > 0) {
                        $("#discountPrice").html("（立省" + discountPrice + "元）");
                        $("#discountPrice").show();
                    } else {
                        $("#discountPrice").hide();
                    }
                } else {
                    $("#activePrice").html(price);
                    $("#discountPrice").hide();
                }
                if ($this.data("vid")) {
                    params.vid = $this.data("vid");
                    params.type = "10";
                    params.vipMemberId = $this.data("vid");
                }
                if ($this.data("index") !== "") {
                    $(".ui-tab-content ul").eq($this.data("index")).removeClass("hide").siblings("ul").addClass("hide");
                }
                if ($this.data("actids")) {
                    params.aid = $this.data("actids");
                }
            }
        });
    });
    //支付 生成二维码
    $(document).on("click", ".btn-buy-bar", function(e) {
        e && e.preventDefault();
        //是否登录
        if (!method.getCookie("cuk")) {
            // $(".js-login").click();
            $("#unLogin").click();
            return;
        }
        // var ptype = $(this).data("page");  
        var checkStatus = params.type;
        if (checkStatus == "10") {
            // ptype == 'vip'
            params.type = "10";
            if ($(".js-tab ul.pay-vip-list").find("li.active").data("vid")) {
                params.vipMemberId = params.vid = $(".js-tab ul.pay-vip-list").find("li.active").data("vid");
            }
            params.aid = $(".js-tab ul.pay-vip-list").find("li.active").data("actids");
            //    report.price = $(".js-tab ul.pay-vip-list").find("li.active").data("price");
            //  report.name = $(".js-tab ul.pay-vip-list").find("li.active").data("month");
            // 带优惠券id
            params.vouchersId = $(".pay-coupon-wrap").attr("vid");
            params.suvid = $(".pay-coupon-wrap").attr("svuid");
            $(".btn-vip-item-selected").attr("pcTrackContent", "payVip-" + params.vid);
            $(".btn-vip-item-selected").click();
        } else if (checkStatus == "13") {
            //  ptype == 'privilege' 
            params.type = "13";
            if ($("ul.pay-pri-list").find("li.active").data("pid")) {
                params.pid = $("ul.pay-pri-list").find("li.active").data("pid");
                params.aid = $("ul.pay-pri-list").find("li.active").data("actids");
            }
            params.aid = $("ul.pay-pri-list").find("li.active").data("actids");
        } else if (checkStatus == "8") {
            // ptype === 'file'
            params = {
                fid: pageConfig.params.g_fileId,
                type: 8,
                ref: utils.getPageRef(window.pageConfig.params.g_fileId),
                referrer: pageConfig.params.referrer,
                vouchersId: $(".pay-coupon-wrap").attr("vid"),
                suvid: $(".pay-coupon-wrap").attr("svuId"),
                remark: params.remark
            };
        }
        clickPay(checkStatus);
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
    $(".connect-ser").on("click", function() {
        _MEIQIA("init");
    });
    var clickPay = function(checkStatus) {
        // params.isVip = window.pageConfig.params.isVip;
        // params.isVip = userInfo.isVip    // 在用户信息里面获取
        // if (checkStatus == '10'||checkStatus =='13') {  // ptype == 'vip' || ptype == 'privilege'
        //     if (params.isVip == '2') {//判断vip状态
        //         utils.showAlertDialog("温馨提示", '你的VIP退款申请正在审核中，审核结束后，才能继续购买哦^_^');
        //         return;
        //     } else if (checkStatus =='13' && params.isVip != '1') {//用户非vip // ptype == 'privilege' && params.isVip != '1'
        //         utils.showAlertDialog("温馨提示", '购买下载特权需要开通vip哦^_^');
        //         return;
        //     }
        // }
        handleOrderResultInfo();
    };
    /**
     * 下单处理
     */
    function handleOrderResultInfo() {
        var type = params.type;
        // 0: VIP套餐， 1:特权套餐 ， 2: 文件下载
        var goodsType = "";
        var goodsId = "";
        if (type == "8") {
            // 付费
            goodsType = "1";
            goodsId = params.fid;
        } else if (type == "10") {
            // 资料vip 用户不是vip
            // params.type = '0'
            goodsType = "2";
            goodsId = params.vid;
        } else if (params.type == "13") {
            // 特权
            // params.type = '1'
            goodsType = "8";
            goodsId = params.pid;
        }
        // 组装创建订单的参数
        var temp = {
            //  params.vouchersId = $('.pay-coupon-wrap').attr('vid')params.suvid = $('.pay-coupon-wrap').attr('svuid')
            aid: params.aid,
            goodsId: goodsId,
            // 文件id  vip套餐id
            goodsType: goodsType,
            // 套餐类别  1-购买资料 2-购买VIP 3-购买下载券 4-购买爱问豆 8下载特权 9 优享资料
            remark: params.remark,
            sourceMode: 0,
            // 0PC 1M 2android 3ios 4快应用 5百度小程序 6微信浏览器
            channelSource: 4,
            // 订单频道来源 0办公 1教育 2建筑 3超级会员 4主站
            host: window.location.origin,
            channel: method.getCookie("channel"),
            // 渠道 message-短信 other-其他
            isVisitor: method.getCookie("cuk") ? 0 : 1,
            isVouchers: params.vouchersId ? 2 : 1,
            // 是否使用优惠券，1未使用，2使用
            vouchersId: params.vouchersId,
            svuId: params.suvid,
            buyerUserId: userInfo.uid,
            buyerUserName: userInfo.nickName,
            returnPayment: false,
            ref: utils.getPageRef(window.pageConfig.params.g_fileId),
            //正常为0,360合作文档为1，360文库为3
            referrer: document.referrer || document.URL
        };
        console.log("temp:", JSON.stringify(temp));
        $.ajax({
            url: api.order.createOrderInfo,
            type: "POST",
            data: JSON.stringify(temp),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function(data) {
                if (data && data.code == "0") {
                    console.log("下单返回的数据：" + data);
                    data["remark"] = temp.remark;
                    openWin(data);
                } else {
                    // __pc__.push(['pcTrackEvent','orderFail']);
                    $(".btn-vip-order-fail").click();
                    utils.showAlertDialog("温馨提示", "下单失败");
                }
            }
        });
    }
    /**
     * 支付跳转到新页面
     */
    function openWin(data) {
        var orderNo = data.data.orderNo;
        var price = data.data.payPrice;
        var name = data.data.name;
        var type = params.type;
        // 都以获取下载url接口  checkStatus为准  data.data.type ||
        var fileId = data.data.fileId;
        if (!fileId) {
            fileId = fid;
        }
        //(orderNo, name, price * 100, '二维码合一', type);
        var target = "/pay/payQr.html?";
        //   0: VIP套餐， 1:特权套餐 ， 2: 文件下载
        if (type == 10) {
            // checkStatus   10 资料是vip 用户不是vip   13 资料时vip 用户是vip特权不够  8 资料是付费 用户未购买             
            // target = target + "type=0&";
            target = target + "type=10&";
            // report.vipPayClick(window.pageConfig.gio.reportVipData);
            $(".btn-vip-order-done").click();
        } else if (type == 13) {
            // target = target + "type=1&";
            target = target + "type=13&";
        } else if (type == 8) {
            // target = target + "type=2&";
            target = target + "type=8&";
            var rf = method.getCookie("rf");
            if (rf) {
                rf = JSON.parse(rf);
                rf.orderId_var = orderNo;
            }
        }
        if (method.getParam("fid")) {
            fileId = method.getParam("fid");
        } else if (pageConfig.params.g_fileId) {
            fileId = pageConfig.params.g_fileId;
        }
        method.delCookie("br", "/");
        // window.location.href = target+"orderNo=" + orderNo + "&fid=" + fileId;
        method.compatibleIESkip(target + "orderNo=" + orderNo + "&fid=" + fileId, false);
    }
    // function fillReportData(orderNo, name, price, type, ptype) {
    //     if (ptype == 0) {
    //         window.pageConfig.gio.reportVipData.orderId_var = orderNo;
    //         window.pageConfig.gio.reportVipData.vipName_var = name;
    //         window.pageConfig.gio.reportVipData.vipPayPrice_var = price;
    //         window.pageConfig.gio.reportVipData.orderPayType_var = type;
    //         method.setCookieWithExpPath('rv', JSON.stringify(window.pageConfig.gio.reportVipData), 5 * 60 * 1000, '/');
    //     } else if (ptype == 1) {
    //         window.pageConfig.gio.reportPrivilegeData.orderId_var = orderNo;
    //         window.pageConfig.gio.reportPrivilegeData.privilegeName_var = name;
    //         window.pageConfig.gio.reportPrivilegeData.privilegePayPrice_var = price;
    //         window.pageConfig.gio.reportPrivilegeData.orderPayType_var = type;
    //         method.setCookieWithExpPath('rp', JSON.stringify(window.pageConfig.gio.reportPrivilegeData), 5 * 60 * 1000, '/');
    //     } else if (ptype == 2) {
    //     }
    // }
    //网页支付宝
    function alipayClick(oid) {
        $(".web-alipay").bind("click", function() {
            if (oid) {
                $.get("/pay/webAlipay?ts=" + new Date().getTime(), {
                    orderNo: oid
                }, function(data, status) {
                    if (status == "success") {
                        var form = data.data.form;
                        if (form) {
                            $("html").prepend(form);
                        }
                    } else {
                        utils.showAlertDialog("温馨提示", "打开网页支付宝支付异常，稍后再试");
                    }
                });
            } else {
                utils.showAlertDialog("温馨提示", "订单号不存在，稍后再试");
            }
        });
    }
    // ======= 订单轮询 =========
    /**
     * 订单状态更新
     */
    // var count = 0;
    // function payStatus(orderNo) {
    //     $.post("/pay/orderStatus?ts=" + new Date().getTime(), { 'orderNo': orderNo }, function (data, status) {
    //         if (data && data.code == 0) {
    //             count++;
    //             var res = data.data;
    //             var orderStatus = res.orderStatus;
    //             var fid = res.fid;
    //             if (!fid) {
    //                 fid = method.getParam('fid');
    //             }
    //
    //             if (orderStatus == 0) {//待支付
    //                 if (count <= 30) {
    //                     window.setTimeout(function () {
    //                         payStatus(orderNo)
    //                     }, 4000);
    //                 }
    //             } else if (orderStatus == 2) {//成功
    //                 var params = '?orderNo=' + orderNo + "&";
    //                 try {
    //                     method.delCookie("br", "/");
    //                     if (res.goodsType == 1) {//购买文件成功
    //                         params += "fid=" + fid + "&type=2";
    //                         var rf = method.getCookie('rf');
    //                         if (rf) {
    //                             rf = JSON.parse(rf);
    //                             rf.orderId_var = orderNo;
    //                           //  report.docPaySuccess(rf);
    //                             method.delCookie('rf', "/");
    //                         }
    //
    //                         var bilogResult = {
    //                             orderID: res.reportData.orderId,
    //                             orderPayType: res.reportData.orderPayCode,
    //                             orderPayPrice: res.reportData.payPrice,
    //                             couponID: res.reportData.couponID || '',
    //                             coupon: '',
    //                         };
    //                         method.setCookieWithExp('br', JSON.stringify(bilogResult), 30 * 60 * 1000, '/');
    //                     } else if (res.goodsType == 2) {//购买vip成功
    //                         params += "fid=" + fid + "&type=0"+"&renewalVIP="+renewalVIP;
    //                         var rv = method.getCookie('rv');
    //                         if (rv) {
    //                            // report.vipPaySuccess(JSON.parse(rv));
    //                             method.delCookie('rv', "/");
    //                         }
    //
    //                         var bilogResult = {
    //                             orderID: res.reportData.orderId,
    //                             orderPayType: res.reportData.orderPayCode,
    //                             orderPayPrice: res.reportData.payPrice,
    //                             couponID: res.reportData.couponID || '',
    //                             coupon: '',
    //                             vipID: res.reportData.id,
    //                             vipName: res.reportData.name,
    //                             vipPrice: res.reportData.payPrice || '',
    //                         };
    //                         method.setCookieWithExp('br', JSON.stringify(bilogResult), 30 * 60 * 1000, '/');
    //
    //                         //透传用户信息 更新isVip字段
    //                         $(".js-sync").trigger('click');
    //                     } else if (res.goodsType == 8) {//购买下载特权成功
    //                         params += "fid=" + fid + "&type=1";
    //                         var rp = method.getCookie('rp');
    //                         if (rp) {
    //                             report.privilegePaySuccess(JSON.parse(rp));
    //                             method.delCookie('rp', "/");
    //                         }
    //
    //                         var bilogResult = {
    //                             orderID: res.reportData.orderId,
    //                             orderPayType: res.reportData.orderPayCode,
    //                             orderPayPrice: res.reportData.payPrice,
    //                             couponID: res.reportData.couponID || '',
    //                             coupon: '',
    //                             privilegeID: res.reportData.id,
    //                             privilegeName: res.reportData.name,
    //                             privilegePrice: res.reportData.payPrice || '',
    //                         };
    //                         method.setCookieWithExp('br', JSON.stringify(bilogResult), 30 * 60 * 1000, '/');
    //
    //                     }
    //                 } catch (e) {
    //                 }
    //                 // window.location.href = "/pay/success.html" + params;
    //                 method.compatibleIESkip("/pay/success.html" + params, false);
    //             } else if (orderStatus == 3) {//失败
    //                 var params = '?orderNo=' + orderNo + "&";
    //                 try {
    //                     method.delCookie("br", "/");
    //                     if (res.goodsType == 1) {//购买文件成功
    //                         params += "fid=" + fid + "&type=2";
    //                         var bilogResult = {
    //                             orderID: res.reportData.orderId,
    //                             orderPayType: res.reportData.orderPayCode,
    //                             orderPayPrice: res.reportData.payPrice,
    //                             couponID: res.reportData.couponID || '',
    //                             coupon: '',
    //                         };
    //                         method.setCookieWithExp('br', JSON.stringify(bilogResult), 30 * 60 * 1000, '/');
    //                     } else if (res.goodsType == 2) {//购买vip成功
    //                         params += "fid=" + fid + "&type=0";
    //                         var bilogResult = {
    //                             orderID: res.reportData.orderId,
    //                             orderPayType: res.reportData.orderPayCode,
    //                             orderPayPrice: res.reportData.payPrice,
    //                             couponID: res.reportData.couponID || '',
    //                             coupon: '',
    //                             vipID: res.reportData.id,
    //                             vipName: res.reportData.name,
    //                             vipPrice: res.reportData.payPrice || '',
    //                         };
    //                         method.setCookieWithExp('br', JSON.stringify(bilogResult), 30 * 60 * 1000, '/');
    //                     } else if (res.goodsType == 8) {//购买下载特权成功
    //                         params += "fid=" + fid + "&type=1";
    //                         var bilogResult = {
    //                             orderID: res.reportData.orderId,
    //                             orderPayType: res.reportData.orderPayCode,
    //                             orderPayPrice: res.reportData.payPrice || '',
    //                             couponID: res.reportData.couponID || '',
    //                             coupon: '',
    //                             privilegeID: res.reportData.id,
    //                             privilegeName: res.reportData.name,
    //                             privilegePrice: res.reportData.payPrice || '',
    //                         };
    //                         method.setCookieWithExp('br', JSON.stringify(bilogResult), 30 * 60 * 1000, '/');
    //                     }
    //                 } catch (e) {
    //                 }
    //                 // window.location.href = "/pay/fail.html" + params;
    //                 method.compatibleIESkip("/pay/fail.html" + params, false);
    //             }
    //         } else {//error
    //             console.log(data);
    //         }
    //     });
    // }
    /**
     * 获取文件详细信息
     * @param id 文件id
     * @param callback 回调携带返回数据
     */
    function getFileInfoById(id, callback) {
        // 获取资料详细信息
        var params = {
            clientType: 0,
            fid: id,
            sourceType: 2
        };
        $.ajax({
            type: "POST",
            url: "/gateway/content/getFileDetailNoTdk",
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            data: JSON.stringify(params),
            success: function(response) {
                console.error("获取资料详情数据", response.data);
                var fileInfo = {};
                if (response && response.data && response.data.fileInfo) {
                    fileInfo = response.data.fileInfo;
                }
                callback(fileInfo);
            }
        });
    }
    /**
     * 只用于订单结果轮询用
     * @type {number}
     */
    var order_count = 0;
    /**
     * 进入支付界面-调用接口进行轮询-等待后台结果返回-跳转到对应界面
     * 获取订单信息
     * @param orderNo 订单号
     */
    function getOrderInfo(orderNo) {
        var params = {
            orderNo: orderNo
        };
        var url = "/pay/orderStatus?ts=" + new Date().getTime();
        // $.post(url, params, function (response) {
        //     if (response && response.code == 0 && response.data) {
        //         // 缓存查询次数
        //         order_count++;
        //         var data = response.data;
        //         // 防止空指针报错
        //         data.reportData = data.reportData || {};
        //         data.fid = data.fid || method.getParam('fid');
        //         // 订单状态 0-待支付 1-支付进行中 2-支付成功 3-支付失败 4-订单取消
        //         if (data.orderStatus == 0) {
        //             // 重新查询
        //             if (order_count <= 30*5) {
        //                 window.setTimeout(function () {
        //                     getOrderInfo(orderNo);
        //                 }, 4000);
        //             }
        //         } else if (data.orderStatus == 2) {
        //             goodsPaySuccess(data, orderNo)
        //         } else if (data.orderStatus == 3) {
        //             goodsPayFail(data, orderNo);
        //         }
        //     } else {
        //         console.error('未查询到订单信息', response);
        //     }
        // })
        $.ajax({
            headers: {
                Authrization: method.getCookie("cuk")
            },
            url: url,
            type: "POST",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(params),
            dataType: "json",
            success: function(response) {
                if (response && response.code == 0) {
                    // 缓存查询次数
                    order_count++;
                    var data = response.data;
                    // // 防止空指针报错
                    data.reportData = data.reportData || {};
                    data.fid = data.fid || method.getParam("fid");
                    // 订单状态 0-待支付 1-支付进行中 2-支付成功 3-支付失败 4-订单取消
                    if (data.orderStatus == 0) {
                        // 重新查询
                        if (order_count <= 30 * 5) {
                            window.setTimeout(function() {
                                getOrderInfo(orderNo);
                            }, 4e3);
                        }
                    } else if (data.orderStatus == 2) {
                        goodsPaySuccess(data, orderNo);
                    } else if (data.orderStatus == 3) {
                        goodsPayFail(data, orderNo);
                    }
                } else {
                    $.toast({
                        text: response.msg,
                        delay: 3e3
                    });
                }
            },
            error: function(error) {
                $.toast({
                    text: error.msg,
                    delay: 3e3
                });
            }
        });
    }
    /**
     * 支付成功
     * goodsType=>虚拟物品类型 1-购买资料 2-购买VIP 3-购买下载券 4-购买爱问豆 8-下载特权
     * @param orderInfo 订单信息
     * @param orderNo 订单号
     */
    function goodsPaySuccess(orderInfo, orderNo) {
        // 移除cookie
        method.delCookie("br", "/");
        // 携带参数,上报数据
        // var href = '/pay/success.html' + '?orderNo=' + orderNo + '&fid=' + orderInfo.fid,
        var format = window.pageConfig && window.pageConfig.params.format;
        var title = window.pageConfig && window.pageConfig.params.title;
        var href = "/pay/success.html" + "?orderNo=" + orderNo + "&fid=" + orderInfo.fid + "&format=" + format + "&title=" + encodeURIComponent(title), bilogResult = null;
        if (orderInfo.goodsType === 1) {
            // 购买文件成功
            href += "&type=2";
            var rf = method.getCookie("rf");
            if (rf) {
                rf = JSON.parse(rf);
                rf.orderId_var = orderNo;
                //  report.docPaySuccess(rf);
                method.delCookie("rf", "/");
            }
            // 自由埋点数据
            bilogResult = {
                orderID: orderInfo.reportData.orderId,
                orderPayType: orderInfo.reportData.orderPayCode,
                orderPayPrice: orderInfo.reportData.payPrice,
                couponID: orderInfo.reportData.couponID || "",
                coupon: ""
            };
            // 获取资料详细信息
            getFileInfoById(orderInfo.fid, function(fileInfo) {
                // 自有埋点
                payFileResult_bilog.reportResult(orderInfo, fileInfo, true);
            });
        } else if (orderInfo.goodsType === 2) {
            // 购买vip成功
            href += "&type=0" + "&renewalVIP=" + renewalVIP;
            var rv = method.getCookie("rv");
            if (rv) {
                // report.vipPaySuccess(JSON.parse(rv));
                method.delCookie("rv", "/");
            }
            // 自由埋点数据
            bilogResult = {
                orderID: orderInfo.reportData.orderId,
                orderPayType: orderInfo.reportData.orderPayCode,
                orderPayPrice: orderInfo.reportData.payPrice,
                couponID: orderInfo.reportData.couponID || "",
                coupon: "",
                vipID: orderInfo.reportData.id,
                vipName: orderInfo.reportData.name,
                vipPrice: orderInfo.reportData.payPrice || ""
            };
            // 自有埋点
            payVipResult_bilog.reportResult(orderInfo, true);
            //透传用户信息 更新isVip字段
            $(".js-sync").trigger("click");
        } else if (orderInfo.goodsType === 8) {
            // 购买下载特权成功
            href += "&type=1";
            var rp = method.getCookie("rp");
            if (rp) {
                // report.privilegePaySuccess(JSON.parse(rp));
                method.delCookie("rp", "/");
            }
            // 自由埋点数据
            bilogResult = {
                orderID: orderInfo.reportData.orderId,
                orderPayType: orderInfo.reportData.orderPayCode,
                orderPayPrice: orderInfo.reportData.payPrice,
                couponID: orderInfo.reportData.couponID || "",
                coupon: "",
                privilegeID: orderInfo.reportData.id,
                privilegeName: orderInfo.reportData.name,
                privilegePrice: orderInfo.reportData.payPrice || ""
            };
            // 获取资料详细信息
            getFileInfoById(orderInfo.fid, function(fileInfo) {
                // 自有埋点
                payPrivilegeResult_bilog.reportResult(orderInfo, fileInfo, true);
            });
        }
        // 自有埋点用到
        method.setCookieWithExp("br", JSON.stringify(bilogResult), 30 * 60 * 1e3, "/");
        // window.location.href = href;
        method.compatibleIESkip(href, false);
    }
    /**
     * 支付失败
     * goodsType=>虚拟物品类型 1-购买资料 2-购买VIP 3-购买下载券 4-购买爱问豆 8-下载特权
     * @param orderInfo 订单信息
     * @param orderNo 订单号
     */
    function goodsPayFail(orderInfo, orderNo) {
        // 携带参数,上报数据
        var href = "/pay/fail.htm" + "?orderNo=" + orderNo + "&fid=" + orderInfo.fid, bilogResult = null;
        if (orderInfo.goodsType == 1) {
            // 购买文件失败
            href += "&type=2";
            bilogResult = {
                orderID: orderInfo.reportData.orderId,
                orderPayType: orderInfo.reportData.orderPayCode,
                orderPayPrice: orderInfo.reportData.payPrice,
                couponID: orderInfo.reportData.couponID || "",
                coupon: ""
            };
            // 获取资料详细信息
            getFileInfoById(orderInfo.fid, function(fileInfo) {
                // 自有埋点
                payFileResult_bilog.reportResult(orderInfo, fileInfo, false);
            });
        } else if (orderInfo.goodsType == 2) {
            // 购买vip失败
            href += "&type=0";
            bilogResult = {
                orderID: orderInfo.reportData.orderId,
                orderPayType: orderInfo.reportData.orderPayCode,
                orderPayPrice: orderInfo.reportData.payPrice,
                couponID: orderInfo.reportData.couponID || "",
                coupon: "",
                vipID: orderInfo.reportData.id,
                vipName: orderInfo.reportData.name,
                vipPrice: orderInfo.reportData.payPrice || ""
            };
            // 自有埋点
            payVipResult_bilog.reportResult(orderInfo, false);
        } else if (orderInfo.goodsType == 8) {
            // 购买下载特权失败
            href += "&type=1";
            bilogResult = {
                orderID: orderInfo.reportData.orderId,
                orderPayType: orderInfo.reportData.orderPayCode,
                orderPayPrice: orderInfo.reportData.payPrice || "",
                couponID: orderInfo.reportData.couponID || "",
                coupon: "",
                privilegeID: orderInfo.reportData.id,
                privilegeName: orderInfo.reportData.name,
                privilegePrice: orderInfo.reportData.payPrice || ""
            };
            // 获取资料详细信息
            getFileInfoById(orderInfo.fid, function(fileInfo) {
                // 自有埋点
                payPrivilegeResult_bilog.reportResult(orderInfo, fileInfo, false);
            });
        }
        // 自由埋点用到
        method.setCookieWithExp("br", JSON.stringify(bilogResult), 30 * 60 * 1e3, "/");
        // window.location.href = href;
        method.compatibleIESkip(href, false);
    }
    // ===== end ====
    $(".btn-back").click(function() {
        var referrer = document.referrer;
        if (referrer) {
            // window.location.href = referrer;
            method.compatibleIESkip(referrer, false);
        } else {
            // window.location.href = "/";
            method.compatibleIESkip("/", false);
        }
    });
    function buySuccessDownLoad() {
        if (!method.getCookie("cuk")) return;
        var fid = window.pageConfig.params.g_fileId;
        if (!fid) return;
        // method.get(api.pay.successBuyDownLoad + '/' + fid, function (res) {
        //     if (res.code == '0') {
        //         var browserEnv = method.browserType();
        //         method.delCookie("event_data_down", "/");
        //         if (browserEnv === 'IE' || browserEnv === 'Edge') {
        //             // window.location.href = res.data;
        //             method.compatibleIESkip(res.data, false);
        //         } else if (browserEnv === 'Firefox') {
        //             var downLoadURL = res.data;
        //             var sub = downLoadURL.lastIndexOf('&fn=');
        //             var sub_url1 = downLoadURL.substr(0, sub + 4);
        //             var sub_ur2 = decodeURIComponent(downLoadURL.substr(sub + 4, downLoadURL.length));
        //             // window.location.href = sub_url1 + sub_ur2;
        //             method.compatibleIESkip(sub_url1 + sub_ur2, false);
        //         } else {
        //             // window.location.href = res.data;
        //             method.compatibleIESkip(res.data, false);
        //         }
        //     }
        // })
        getFileDownLoadUrl(fid);
    }
    function getFileDownLoadUrl(fid) {
        $.ajax({
            headers: {
                Authrization: method.getCookie("cuk")
            },
            url: api.normalFileDetail.getFileDownLoadUrl,
            type: "POST",
            data: JSON.stringify({
                clientType: 0,
                fid: fid,
                sourceType: 1
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function(res) {
                console.log(res);
                if (res.code == "0") {
                    var browserEnv = method.browserType();
                    method.delCookie("event_data_down", "/");
                    if (browserEnv === "IE" || browserEnv === "Edge") {
                        // window.location.href = res.data;
                        method.compatibleIESkip(res.data.fileDownUrl, false);
                    } else if (browserEnv === "Firefox") {
                        // var downLoadURL = res.data;
                        // var sub = downLoadURL.lastIndexOf('&fn=');
                        // var sub_url1 = downLoadURL.substr(0, sub + 4);
                        // var sub_ur2 = decodeURIComponent(downLoadURL.substr(sub + 4, downLoadURL.length));
                        // window.location.href = sub_url1 + sub_ur2;
                        method.compatibleIESkip(res.data.fileDownUrl, false);
                    } else {
                        // window.location.href = res.data;
                        method.compatibleIESkip(res.data.fileDownUrl, false);
                    }
                } else {
                    $.toast({
                        text: res.msg || "下载失败"
                    });
                }
            }
        });
    }
    // 续费vip成功
    console.log(method.getParam("orderNo"));
    var pathName = location.pathname;
    // 
    if (method.getParam("renewalVIP") == "1" && pathName == "/pay/success.html") {
        var orderNo = method.getParam("orderNo");
        rightsVipGetUserMember();
        function rightsVipGetUserMember() {
            $.ajax({
                url: api.order.rightsVipGetUserMember,
                type: "POST",
                data: JSON.stringify({
                    orderId: orderNo
                }),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function(res) {
                    if (res.code == "0") {
                        var formatDate = method.formatDate;
                        Date.prototype.format = formatDate;
                        console.log(res);
                        var beginDate = new Date(res.data.beginDate).format("yyyy-MM-dd");
                        var endDate = new Date(res.data.endDate).format("yyyy-MM-dd");
                        var title = "你已经成功续费爱问共享资料VIP";
                        var subtitle = "你的下载权益将于" + beginDate + "日发放至账户" + endDate + "日即当前VIP失效时间后一天";
                        var type = method.getParam("type");
                        var fid = method.getParam("fid");
                        if (type == "0" && fid) {
                            $(".pay-ok-text span").text(title);
                            $(".pay-bottom-text").text(subtitle);
                        } else if (type == 0) {
                            $(".pay-ok-text span").text(title);
                            $(".pay-bottom-text").text(subtitle);
                        }
                    }
                }
            });
        }
    }
});

// vip支付结果-自有埋点
define("dist/common/bilog-module/payVipResult_bilog", [ "dist/common/bilog", "base64", "dist/cmd-lib/util", "dist/application/method", "dist/report/config" ], function(require, exports, module) {
    var Bilog = require("dist/common/bilog");
    /**
     * 上报数据
     * @param orderInfo 订单数据
     * @param isSuccess 支付结果
     */
    function reportResult(orderInfo, isSuccess) {
        var commonData = Bilog.getBilogCommonData();
        commonData.eventType = "page";
        commonData.eventID = "SE011";
        commonData.eventName = "payVipResult";
        // 当前页面
        commonData.pageID = "PC-M-PAY-VIP-QR";
        commonData.pageName = "支付页-VIP-支付页";
        commonData.pageURL = window.location.href;
        // 各页面独有数据填充
        commonData.var = {
            payResult: isSuccess ? 1 : 0,
            orderID: orderInfo.reportData.orderId,
            couponID: orderInfo.reportData.couponID,
            coupon: "",
            orderPayType: orderInfo.reportData.orderPayCode,
            orderPayPrice: orderInfo.reportData.payPrice,
            vipID: orderInfo.reportData.id,
            vipName: orderInfo.reportData.name,
            vipPrice: orderInfo.reportData.payPrice
        };
        // 数据处理
        Bilog.reportToBlack(commonData);
    }
    return {
        reportResult: reportResult
    };
});

// 现金文档支付结果-自有埋点
define("dist/common/bilog-module/payFileResult_bilog", [ "dist/common/bilog", "base64", "dist/cmd-lib/util", "dist/application/method", "dist/report/config" ], function(require, exports, module) {
    var Bilog = require("dist/common/bilog");
    var Method = require("dist/application/method");
    /**
     * 上报数据
     * @param orderInfo 订单数据
     * @param fileInfo 文件详情
     * @param isSuccess 支付结果
     */
    function reportResult(orderInfo, fileInfo, isSuccess) {
        var commonData = Bilog.getBilogCommonData();
        commonData.eventType = "page";
        commonData.eventID = "SE009";
        commonData.eventName = "payFileResult";
        // 当前页面
        commonData.pageID = "PC-M-PAY-F-QR";
        commonData.pageName = "支付页-付费资料-支付页";
        commonData.pageURL = window.location.href;
        var classIdStr = [ fileInfo.classid1, fileInfo.classid2, fileInfo.classid3 ].filter(function(item) {
            return !!item;
        }).join("||");
        var classNameStr = [ fileInfo.classidName1, fileInfo.classidName2, fileInfo.classidName3 ].filter(function(item) {
            return !!item;
        }).join("||");
        // 各页面独有数据填充
        commonData.var = {
            // 支付结果（0失败、1成功）
            payResult: isSuccess ? 1 : 0,
            // 订单id
            orderID: orderInfo.reportData.orderId,
            // 支付方式
            orderPayType: orderInfo.reportData.orderPayCode,
            // 订单实付价格
            orderPayPrice: orderInfo.reportData.payPrice,
            // 选中的优惠券ID
            couponID: orderInfo.reportData.couponID,
            // 选中的优惠券名称
            coupon: "",
            // 资料ID
            fileID: fileInfo.id,
            // 资料名称
            fileName: fileInfo.title,
            // 资料分类ID
            fileCategoryID: classIdStr,
            // 资料分类名称
            fileCategoryName: classNameStr,
            // 资料付费类型
            filePayType: fileInfo.productType,
            // 资料格式
            fileFormat: fileInfo.format,
            // 资料生产方式-用户上传/编辑上传等
            fileProduceType: fileInfo.fileSourceChannel,
            // 资料合作来源-在资料详情页时存入cookie中
            fileCooType: Method.getCookie("bc") || "",
            // 资料上传者ID
            fileUploaderID: fileInfo.uid,
            // 资料原价
            filePrice: orderInfo.originalPrice,
            // 资料划线后价格
            fileSalePrice: orderInfo.payPrice
        };
        // 数据处理
        Bilog.reportToBlack(commonData);
    }
    return {
        reportResult: reportResult
    };
});

// 特权支付结果-自有埋点
define("dist/common/bilog-module/payPrivilegeResult_bilog", [ "dist/common/bilog", "base64", "dist/cmd-lib/util", "dist/application/method", "dist/report/config" ], function(require, exports, module) {
    var Bilog = require("dist/common/bilog");
    var Method = require("dist/application/method");
    // 1：免费文档，3 在线文档 4 vip特权文档 5 付费文档 6 私有文档
    var ProductTypeMap = {
        1: "free",
        3: "online",
        4: "vipOnly",
        5: "cost"
    };
    /**
     * 上报数据
     * @param orderInfo 订单数据
     * @param fileInfo 文件详情
     * @param isSuccess 支付结果
     */
    function reportResult(orderInfo, fileInfo, isSuccess) {
        var commonData = Bilog.getBilogCommonData();
        commonData.eventType = "page";
        commonData.eventID = "SE013";
        commonData.eventName = "payPrivilegeResult";
        // 当前页面
        commonData.pageID = "PC-M-PAY-PRI-QR";
        commonData.pageName = "支付页-下载特权-支付页";
        commonData.pageURL = window.location.href;
        var classIdStr = [ fileInfo.classid1, fileInfo.classid2, fileInfo.classid3 ].filter(function(item) {
            return !!item;
        }).join("||");
        var classNameStr = [ fileInfo.classidName1, fileInfo.classidName2, fileInfo.classidName3 ].filter(function(item) {
            return !!item;
        }).join("||");
        // 各页面独有数据填充
        commonData.var = {
            // 支付结果（0失败、1成功）
            payResult: isSuccess ? 1 : 0,
            // 订单id
            orderID: orderInfo.reportData.orderId,
            // 支付方式
            orderPayType: orderInfo.reportData.orderPayCode,
            // 订单实付价格
            orderPayPrice: orderInfo.reportData.payPrice,
            // 选中的优惠券ID
            couponID: orderInfo.reportData.couponID,
            // 选中的优惠券名称
            coupon: "",
            privilegeID: orderInfo.reportData.id,
            privilegeName: orderInfo.reportData.name,
            privilegePrice: orderInfo.reportData.payPrice,
            // 资料ID
            fileID: fileInfo.id,
            // 资料名称
            fileName: fileInfo.title,
            // 资料分类ID
            fileCategoryID: classIdStr,
            // 资料分类名称
            fileCategoryName: classNameStr,
            // 资料付费类型
            filePayType: ProductTypeMap[fileInfo.productType],
            // 资料格式
            fileFormat: fileInfo.format,
            // 资料生产方式-用户上传/编辑上传等
            fileProduceType: fileInfo.fileSourceChannel,
            // 资料合作来源-在资料详情页时存入cookie中
            fileCooType: Method.getCookie("bc") || "",
            // 资料上传者ID
            fileUploaderID: fileInfo.uid
        };
        // 数据处理
        Bilog.reportToBlack(commonData);
    }
    return {
        reportResult: reportResult
    };
});

define("dist/pay/qr", [ "dist/cmd-lib/util", "dist/cmd-lib/qr/qrcode.min", "dist/cmd-lib/qr/jquery.qrcode.min" ], function(require, exports, moudle) {
    // var $ = require("$");
    var utils = require("dist/cmd-lib/util");
    var QRCode = require("dist/cmd-lib/qr/qrcode.min");
    var qrcode = require("dist/cmd-lib/qr/jquery.qrcode.min");
    return {
        /**
         * 生成二维码
         * @param cnt 内容
         * @param id 填充元素id
         * @param width 宽
         * @param height 高
         */
        createQrCode: function(cnt, id, width, height) {
            if (cnt) {
                try {
                    console.log("生成二维码start");
                    $("#" + id).html("");
                    var qrcode = new QRCode(document.getElementById(id), {
                        width: width,
                        height: height
                    });
                    qrcode.clear();
                    qrcode.makeCode(cnt);
                    console.log("生成二维码end");
                    $("#" + id + " img").hide();
                } catch (e) {
                    console.info(cnt + ":生成二维码异常");
                    if (!utils.validateIE9()) {
                        console.info(cnt + ":生成二维码异常");
                    }
                }
            }
        },
        /**
         * IE8 以下
         * @param url
         * @param id  div id
         * @param width
         * @param height
         */
        generateIE8QRCode: function(url, id, width, height) {
            $("#" + id).html("");
            $("#" + id).qrcode({
                render: "table",
                // 渲染方式有table方式（IE兼容）和canvas方式
                width: width,
                //宽度
                height: height,
                //高度
                text: url,
                //内容id，id，
                typeNumber: -1,
                //计算模式
                correctLevel: 2,
                //二维码纠错级别
                background: "#ffffff",
                //背景颜色
                foreground: "#000000"
            });
        }
    };
});

define("dist/cmd-lib/qr/qrcode.min", [], function(require, exports, module) {
    var QRCode;
    !function() {
        function a(a) {
            this.mode = c.MODE_8BIT_BYTE, this.data = a, this.parsedData = [];
            for (var b = [], d = 0, e = this.data.length; e > d; d++) {
                var f = this.data.charCodeAt(d);
                f > 65536 ? (b[0] = 240 | (1835008 & f) >>> 18, b[1] = 128 | (258048 & f) >>> 12, 
                b[2] = 128 | (4032 & f) >>> 6, b[3] = 128 | 63 & f) : f > 2048 ? (b[0] = 224 | (61440 & f) >>> 12, 
                b[1] = 128 | (4032 & f) >>> 6, b[2] = 128 | 63 & f) : f > 128 ? (b[0] = 192 | (1984 & f) >>> 6, 
                b[1] = 128 | 63 & f) : b[0] = f, this.parsedData = this.parsedData.concat(b);
            }
            this.parsedData.length != this.data.length && (this.parsedData.unshift(191), this.parsedData.unshift(187), 
            this.parsedData.unshift(239));
        }
        function b(a, b) {
            this.typeNumber = a, this.errorCorrectLevel = b, this.modules = null, this.moduleCount = 0, 
            this.dataCache = null, this.dataList = [];
        }
        function i(a, b) {
            if (void 0 == a.length) throw new Error(a.length + "/" + b);
            for (var c = 0; c < a.length && 0 == a[c]; ) c++;
            this.num = new Array(a.length - c + b);
            for (var d = 0; d < a.length - c; d++) this.num[d] = a[d + c];
        }
        function j(a, b) {
            this.totalCount = a, this.dataCount = b;
        }
        function k() {
            this.buffer = [], this.length = 0;
        }
        function m() {
            return "undefined" != typeof CanvasRenderingContext2D;
        }
        function n() {
            var a = !1, b = navigator.userAgent;
            return /android/i.test(b) && (a = !0, aMat = b.toString().match(/android ([0-9]\.[0-9])/i), 
            aMat && aMat[1] && (a = parseFloat(aMat[1]))), a;
        }
        function r(a, b) {
            for (var c = 1, e = s(a), f = 0, g = l.length; g >= f; f++) {
                var h = 0;
                switch (b) {
                  case d.L:
                    h = l[f][0];
                    break;

                  case d.M:
                    h = l[f][1];
                    break;

                  case d.Q:
                    h = l[f][2];
                    break;

                  case d.H:
                    h = l[f][3];
                }
                if (h >= e) break;
                c++;
            }
            if (c > l.length) throw new Error("Too long data");
            return c;
        }
        function s(a) {
            var b = encodeURI(a).toString().replace(/\%[0-9a-fA-F]{2}/g, "a");
            return b.length + (b.length != a ? 3 : 0);
        }
        a.prototype = {
            getLength: function() {
                return this.parsedData.length;
            },
            write: function(a) {
                for (var b = 0, c = this.parsedData.length; c > b; b++) a.put(this.parsedData[b], 8);
            }
        }, b.prototype = {
            addData: function(b) {
                var c = new a(b);
                this.dataList.push(c), this.dataCache = null;
            },
            isDark: function(a, b) {
                if (0 > a || this.moduleCount <= a || 0 > b || this.moduleCount <= b) throw new Error(a + "," + b);
                return this.modules[a][b];
            },
            getModuleCount: function() {
                return this.moduleCount;
            },
            make: function() {
                this.makeImpl(!1, this.getBestMaskPattern());
            },
            makeImpl: function(a, c) {
                this.moduleCount = 4 * this.typeNumber + 17, this.modules = new Array(this.moduleCount);
                for (var d = 0; d < this.moduleCount; d++) {
                    this.modules[d] = new Array(this.moduleCount);
                    for (var e = 0; e < this.moduleCount; e++) this.modules[d][e] = null;
                }
                this.setupPositionProbePattern(0, 0), this.setupPositionProbePattern(this.moduleCount - 7, 0), 
                this.setupPositionProbePattern(0, this.moduleCount - 7), this.setupPositionAdjustPattern(), 
                this.setupTimingPattern(), this.setupTypeInfo(a, c), this.typeNumber >= 7 && this.setupTypeNumber(a), 
                null == this.dataCache && (this.dataCache = b.createData(this.typeNumber, this.errorCorrectLevel, this.dataList)), 
                this.mapData(this.dataCache, c);
            },
            setupPositionProbePattern: function(a, b) {
                for (var c = -1; 7 >= c; c++) if (!(-1 >= a + c || this.moduleCount <= a + c)) for (var d = -1; 7 >= d; d++) -1 >= b + d || this.moduleCount <= b + d || (this.modules[a + c][b + d] = c >= 0 && 6 >= c && (0 == d || 6 == d) || d >= 0 && 6 >= d && (0 == c || 6 == c) || c >= 2 && 4 >= c && d >= 2 && 4 >= d ? !0 : !1);
            },
            getBestMaskPattern: function() {
                for (var a = 0, b = 0, c = 0; 8 > c; c++) {
                    this.makeImpl(!0, c);
                    var d = f.getLostPoint(this);
                    (0 == c || a > d) && (a = d, b = c);
                }
                return b;
            },
            createMovieClip: function(a, b, c) {
                var d = a.createEmptyMovieClip(b, c), e = 1;
                this.make();
                for (var f = 0; f < this.modules.length; f++) for (var g = f * e, h = 0; h < this.modules[f].length; h++) {
                    var i = h * e, j = this.modules[f][h];
                    j && (d.beginFill(0, 100), d.moveTo(i, g), d.lineTo(i + e, g), d.lineTo(i + e, g + e), 
                    d.lineTo(i, g + e), d.endFill());
                }
                return d;
            },
            setupTimingPattern: function() {
                for (var a = 8; a < this.moduleCount - 8; a++) null == this.modules[a][6] && (this.modules[a][6] = 0 == a % 2);
                for (var b = 8; b < this.moduleCount - 8; b++) null == this.modules[6][b] && (this.modules[6][b] = 0 == b % 2);
            },
            setupPositionAdjustPattern: function() {
                for (var a = f.getPatternPosition(this.typeNumber), b = 0; b < a.length; b++) for (var c = 0; c < a.length; c++) {
                    var d = a[b], e = a[c];
                    if (null == this.modules[d][e]) for (var g = -2; 2 >= g; g++) for (var h = -2; 2 >= h; h++) this.modules[d + g][e + h] = -2 == g || 2 == g || -2 == h || 2 == h || 0 == g && 0 == h ? !0 : !1;
                }
            },
            setupTypeNumber: function(a) {
                for (var b = f.getBCHTypeNumber(this.typeNumber), c = 0; 18 > c; c++) {
                    var d = !a && 1 == (1 & b >> c);
                    this.modules[Math.floor(c / 3)][c % 3 + this.moduleCount - 8 - 3] = d;
                }
                for (var c = 0; 18 > c; c++) {
                    var d = !a && 1 == (1 & b >> c);
                    this.modules[c % 3 + this.moduleCount - 8 - 3][Math.floor(c / 3)] = d;
                }
            },
            setupTypeInfo: function(a, b) {
                for (var c = this.errorCorrectLevel << 3 | b, d = f.getBCHTypeInfo(c), e = 0; 15 > e; e++) {
                    var g = !a && 1 == (1 & d >> e);
                    6 > e ? this.modules[e][8] = g : 8 > e ? this.modules[e + 1][8] = g : this.modules[this.moduleCount - 15 + e][8] = g;
                }
                for (var e = 0; 15 > e; e++) {
                    var g = !a && 1 == (1 & d >> e);
                    8 > e ? this.modules[8][this.moduleCount - e - 1] = g : 9 > e ? this.modules[8][15 - e - 1 + 1] = g : this.modules[8][15 - e - 1] = g;
                }
                this.modules[this.moduleCount - 8][8] = !a;
            },
            mapData: function(a, b) {
                for (var c = -1, d = this.moduleCount - 1, e = 7, g = 0, h = this.moduleCount - 1; h > 0; h -= 2) for (6 == h && h--; ;) {
                    for (var i = 0; 2 > i; i++) if (null == this.modules[d][h - i]) {
                        var j = !1;
                        g < a.length && (j = 1 == (1 & a[g] >>> e));
                        var k = f.getMask(b, d, h - i);
                        k && (j = !j), this.modules[d][h - i] = j, e--, -1 == e && (g++, e = 7);
                    }
                    if (d += c, 0 > d || this.moduleCount <= d) {
                        d -= c, c = -c;
                        break;
                    }
                }
            }
        }, b.PAD0 = 236, b.PAD1 = 17, b.createData = function(a, c, d) {
            for (var e = j.getRSBlocks(a, c), g = new k(), h = 0; h < d.length; h++) {
                var i = d[h];
                g.put(i.mode, 4), g.put(i.getLength(), f.getLengthInBits(i.mode, a)), i.write(g);
            }
            for (var l = 0, h = 0; h < e.length; h++) l += e[h].dataCount;
            if (g.getLengthInBits() > 8 * l) throw new Error("code length overflow. (" + g.getLengthInBits() + ">" + 8 * l + ")");
            for (g.getLengthInBits() + 4 <= 8 * l && g.put(0, 4); 0 != g.getLengthInBits() % 8; ) g.putBit(!1);
            for (;;) {
                if (g.getLengthInBits() >= 8 * l) break;
                if (g.put(b.PAD0, 8), g.getLengthInBits() >= 8 * l) break;
                g.put(b.PAD1, 8);
            }
            return b.createBytes(g, e);
        }, b.createBytes = function(a, b) {
            for (var c = 0, d = 0, e = 0, g = new Array(b.length), h = new Array(b.length), j = 0; j < b.length; j++) {
                var k = b[j].dataCount, l = b[j].totalCount - k;
                d = Math.max(d, k), e = Math.max(e, l), g[j] = new Array(k);
                for (var m = 0; m < g[j].length; m++) g[j][m] = 255 & a.buffer[m + c];
                c += k;
                var n = f.getErrorCorrectPolynomial(l), o = new i(g[j], n.getLength() - 1), p = o.mod(n);
                h[j] = new Array(n.getLength() - 1);
                for (var m = 0; m < h[j].length; m++) {
                    var q = m + p.getLength() - h[j].length;
                    h[j][m] = q >= 0 ? p.get(q) : 0;
                }
            }
            for (var r = 0, m = 0; m < b.length; m++) r += b[m].totalCount;
            for (var s = new Array(r), t = 0, m = 0; d > m; m++) for (var j = 0; j < b.length; j++) m < g[j].length && (s[t++] = g[j][m]);
            for (var m = 0; e > m; m++) for (var j = 0; j < b.length; j++) m < h[j].length && (s[t++] = h[j][m]);
            return s;
        };
        for (var c = {
            MODE_NUMBER: 1,
            MODE_ALPHA_NUM: 2,
            MODE_8BIT_BYTE: 4,
            MODE_KANJI: 8
        }, d = {
            L: 1,
            M: 0,
            Q: 3,
            H: 2
        }, e = {
            PATTERN000: 0,
            PATTERN001: 1,
            PATTERN010: 2,
            PATTERN011: 3,
            PATTERN100: 4,
            PATTERN101: 5,
            PATTERN110: 6,
            PATTERN111: 7
        }, f = {
            PATTERN_POSITION_TABLE: [ [], [ 6, 18 ], [ 6, 22 ], [ 6, 26 ], [ 6, 30 ], [ 6, 34 ], [ 6, 22, 38 ], [ 6, 24, 42 ], [ 6, 26, 46 ], [ 6, 28, 50 ], [ 6, 30, 54 ], [ 6, 32, 58 ], [ 6, 34, 62 ], [ 6, 26, 46, 66 ], [ 6, 26, 48, 70 ], [ 6, 26, 50, 74 ], [ 6, 30, 54, 78 ], [ 6, 30, 56, 82 ], [ 6, 30, 58, 86 ], [ 6, 34, 62, 90 ], [ 6, 28, 50, 72, 94 ], [ 6, 26, 50, 74, 98 ], [ 6, 30, 54, 78, 102 ], [ 6, 28, 54, 80, 106 ], [ 6, 32, 58, 84, 110 ], [ 6, 30, 58, 86, 114 ], [ 6, 34, 62, 90, 118 ], [ 6, 26, 50, 74, 98, 122 ], [ 6, 30, 54, 78, 102, 126 ], [ 6, 26, 52, 78, 104, 130 ], [ 6, 30, 56, 82, 108, 134 ], [ 6, 34, 60, 86, 112, 138 ], [ 6, 30, 58, 86, 114, 142 ], [ 6, 34, 62, 90, 118, 146 ], [ 6, 30, 54, 78, 102, 126, 150 ], [ 6, 24, 50, 76, 102, 128, 154 ], [ 6, 28, 54, 80, 106, 132, 158 ], [ 6, 32, 58, 84, 110, 136, 162 ], [ 6, 26, 54, 82, 110, 138, 166 ], [ 6, 30, 58, 86, 114, 142, 170 ] ],
            G15: 1335,
            G18: 7973,
            G15_MASK: 21522,
            getBCHTypeInfo: function(a) {
                for (var b = a << 10; f.getBCHDigit(b) - f.getBCHDigit(f.G15) >= 0; ) b ^= f.G15 << f.getBCHDigit(b) - f.getBCHDigit(f.G15);
                return (a << 10 | b) ^ f.G15_MASK;
            },
            getBCHTypeNumber: function(a) {
                for (var b = a << 12; f.getBCHDigit(b) - f.getBCHDigit(f.G18) >= 0; ) b ^= f.G18 << f.getBCHDigit(b) - f.getBCHDigit(f.G18);
                return a << 12 | b;
            },
            getBCHDigit: function(a) {
                for (var b = 0; 0 != a; ) b++, a >>>= 1;
                return b;
            },
            getPatternPosition: function(a) {
                return f.PATTERN_POSITION_TABLE[a - 1];
            },
            getMask: function(a, b, c) {
                switch (a) {
                  case e.PATTERN000:
                    return 0 == (b + c) % 2;

                  case e.PATTERN001:
                    return 0 == b % 2;

                  case e.PATTERN010:
                    return 0 == c % 3;

                  case e.PATTERN011:
                    return 0 == (b + c) % 3;

                  case e.PATTERN100:
                    return 0 == (Math.floor(b / 2) + Math.floor(c / 3)) % 2;

                  case e.PATTERN101:
                    return 0 == b * c % 2 + b * c % 3;

                  case e.PATTERN110:
                    return 0 == (b * c % 2 + b * c % 3) % 2;

                  case e.PATTERN111:
                    return 0 == (b * c % 3 + (b + c) % 2) % 2;

                  default:
                    throw new Error("bad maskPattern:" + a);
                }
            },
            getErrorCorrectPolynomial: function(a) {
                for (var b = new i([ 1 ], 0), c = 0; a > c; c++) b = b.multiply(new i([ 1, g.gexp(c) ], 0));
                return b;
            },
            getLengthInBits: function(a, b) {
                if (b >= 1 && 10 > b) switch (a) {
                  case c.MODE_NUMBER:
                    return 10;

                  case c.MODE_ALPHA_NUM:
                    return 9;

                  case c.MODE_8BIT_BYTE:
                    return 8;

                  case c.MODE_KANJI:
                    return 8;

                  default:
                    throw new Error("mode:" + a);
                } else if (27 > b) switch (a) {
                  case c.MODE_NUMBER:
                    return 12;

                  case c.MODE_ALPHA_NUM:
                    return 11;

                  case c.MODE_8BIT_BYTE:
                    return 16;

                  case c.MODE_KANJI:
                    return 10;

                  default:
                    throw new Error("mode:" + a);
                } else {
                    if (!(41 > b)) throw new Error("type:" + b);
                    switch (a) {
                      case c.MODE_NUMBER:
                        return 14;

                      case c.MODE_ALPHA_NUM:
                        return 13;

                      case c.MODE_8BIT_BYTE:
                        return 16;

                      case c.MODE_KANJI:
                        return 12;

                      default:
                        throw new Error("mode:" + a);
                    }
                }
            },
            getLostPoint: function(a) {
                for (var b = a.getModuleCount(), c = 0, d = 0; b > d; d++) for (var e = 0; b > e; e++) {
                    for (var f = 0, g = a.isDark(d, e), h = -1; 1 >= h; h++) if (!(0 > d + h || d + h >= b)) for (var i = -1; 1 >= i; i++) 0 > e + i || e + i >= b || (0 != h || 0 != i) && g == a.isDark(d + h, e + i) && f++;
                    f > 5 && (c += 3 + f - 5);
                }
                for (var d = 0; b - 1 > d; d++) for (var e = 0; b - 1 > e; e++) {
                    var j = 0;
                    a.isDark(d, e) && j++, a.isDark(d + 1, e) && j++, a.isDark(d, e + 1) && j++, a.isDark(d + 1, e + 1) && j++, 
                    (0 == j || 4 == j) && (c += 3);
                }
                for (var d = 0; b > d; d++) for (var e = 0; b - 6 > e; e++) a.isDark(d, e) && !a.isDark(d, e + 1) && a.isDark(d, e + 2) && a.isDark(d, e + 3) && a.isDark(d, e + 4) && !a.isDark(d, e + 5) && a.isDark(d, e + 6) && (c += 40);
                for (var e = 0; b > e; e++) for (var d = 0; b - 6 > d; d++) a.isDark(d, e) && !a.isDark(d + 1, e) && a.isDark(d + 2, e) && a.isDark(d + 3, e) && a.isDark(d + 4, e) && !a.isDark(d + 5, e) && a.isDark(d + 6, e) && (c += 40);
                for (var k = 0, e = 0; b > e; e++) for (var d = 0; b > d; d++) a.isDark(d, e) && k++;
                var l = Math.abs(100 * k / b / b - 50) / 5;
                return c += 10 * l;
            }
        }, g = {
            glog: function(a) {
                if (1 > a) throw new Error("glog(" + a + ")");
                return g.LOG_TABLE[a];
            },
            gexp: function(a) {
                for (;0 > a; ) a += 255;
                for (;a >= 256; ) a -= 255;
                return g.EXP_TABLE[a];
            },
            EXP_TABLE: new Array(256),
            LOG_TABLE: new Array(256)
        }, h = 0; 8 > h; h++) g.EXP_TABLE[h] = 1 << h;
        for (var h = 8; 256 > h; h++) g.EXP_TABLE[h] = g.EXP_TABLE[h - 4] ^ g.EXP_TABLE[h - 5] ^ g.EXP_TABLE[h - 6] ^ g.EXP_TABLE[h - 8];
        for (var h = 0; 255 > h; h++) g.LOG_TABLE[g.EXP_TABLE[h]] = h;
        i.prototype = {
            get: function(a) {
                return this.num[a];
            },
            getLength: function() {
                return this.num.length;
            },
            multiply: function(a) {
                for (var b = new Array(this.getLength() + a.getLength() - 1), c = 0; c < this.getLength(); c++) for (var d = 0; d < a.getLength(); d++) b[c + d] ^= g.gexp(g.glog(this.get(c)) + g.glog(a.get(d)));
                return new i(b, 0);
            },
            mod: function(a) {
                if (this.getLength() - a.getLength() < 0) return this;
                for (var b = g.glog(this.get(0)) - g.glog(a.get(0)), c = new Array(this.getLength()), d = 0; d < this.getLength(); d++) c[d] = this.get(d);
                for (var d = 0; d < a.getLength(); d++) c[d] ^= g.gexp(g.glog(a.get(d)) + b);
                return new i(c, 0).mod(a);
            }
        }, j.RS_BLOCK_TABLE = [ [ 1, 26, 19 ], [ 1, 26, 16 ], [ 1, 26, 13 ], [ 1, 26, 9 ], [ 1, 44, 34 ], [ 1, 44, 28 ], [ 1, 44, 22 ], [ 1, 44, 16 ], [ 1, 70, 55 ], [ 1, 70, 44 ], [ 2, 35, 17 ], [ 2, 35, 13 ], [ 1, 100, 80 ], [ 2, 50, 32 ], [ 2, 50, 24 ], [ 4, 25, 9 ], [ 1, 134, 108 ], [ 2, 67, 43 ], [ 2, 33, 15, 2, 34, 16 ], [ 2, 33, 11, 2, 34, 12 ], [ 2, 86, 68 ], [ 4, 43, 27 ], [ 4, 43, 19 ], [ 4, 43, 15 ], [ 2, 98, 78 ], [ 4, 49, 31 ], [ 2, 32, 14, 4, 33, 15 ], [ 4, 39, 13, 1, 40, 14 ], [ 2, 121, 97 ], [ 2, 60, 38, 2, 61, 39 ], [ 4, 40, 18, 2, 41, 19 ], [ 4, 40, 14, 2, 41, 15 ], [ 2, 146, 116 ], [ 3, 58, 36, 2, 59, 37 ], [ 4, 36, 16, 4, 37, 17 ], [ 4, 36, 12, 4, 37, 13 ], [ 2, 86, 68, 2, 87, 69 ], [ 4, 69, 43, 1, 70, 44 ], [ 6, 43, 19, 2, 44, 20 ], [ 6, 43, 15, 2, 44, 16 ], [ 4, 101, 81 ], [ 1, 80, 50, 4, 81, 51 ], [ 4, 50, 22, 4, 51, 23 ], [ 3, 36, 12, 8, 37, 13 ], [ 2, 116, 92, 2, 117, 93 ], [ 6, 58, 36, 2, 59, 37 ], [ 4, 46, 20, 6, 47, 21 ], [ 7, 42, 14, 4, 43, 15 ], [ 4, 133, 107 ], [ 8, 59, 37, 1, 60, 38 ], [ 8, 44, 20, 4, 45, 21 ], [ 12, 33, 11, 4, 34, 12 ], [ 3, 145, 115, 1, 146, 116 ], [ 4, 64, 40, 5, 65, 41 ], [ 11, 36, 16, 5, 37, 17 ], [ 11, 36, 12, 5, 37, 13 ], [ 5, 109, 87, 1, 110, 88 ], [ 5, 65, 41, 5, 66, 42 ], [ 5, 54, 24, 7, 55, 25 ], [ 11, 36, 12 ], [ 5, 122, 98, 1, 123, 99 ], [ 7, 73, 45, 3, 74, 46 ], [ 15, 43, 19, 2, 44, 20 ], [ 3, 45, 15, 13, 46, 16 ], [ 1, 135, 107, 5, 136, 108 ], [ 10, 74, 46, 1, 75, 47 ], [ 1, 50, 22, 15, 51, 23 ], [ 2, 42, 14, 17, 43, 15 ], [ 5, 150, 120, 1, 151, 121 ], [ 9, 69, 43, 4, 70, 44 ], [ 17, 50, 22, 1, 51, 23 ], [ 2, 42, 14, 19, 43, 15 ], [ 3, 141, 113, 4, 142, 114 ], [ 3, 70, 44, 11, 71, 45 ], [ 17, 47, 21, 4, 48, 22 ], [ 9, 39, 13, 16, 40, 14 ], [ 3, 135, 107, 5, 136, 108 ], [ 3, 67, 41, 13, 68, 42 ], [ 15, 54, 24, 5, 55, 25 ], [ 15, 43, 15, 10, 44, 16 ], [ 4, 144, 116, 4, 145, 117 ], [ 17, 68, 42 ], [ 17, 50, 22, 6, 51, 23 ], [ 19, 46, 16, 6, 47, 17 ], [ 2, 139, 111, 7, 140, 112 ], [ 17, 74, 46 ], [ 7, 54, 24, 16, 55, 25 ], [ 34, 37, 13 ], [ 4, 151, 121, 5, 152, 122 ], [ 4, 75, 47, 14, 76, 48 ], [ 11, 54, 24, 14, 55, 25 ], [ 16, 45, 15, 14, 46, 16 ], [ 6, 147, 117, 4, 148, 118 ], [ 6, 73, 45, 14, 74, 46 ], [ 11, 54, 24, 16, 55, 25 ], [ 30, 46, 16, 2, 47, 17 ], [ 8, 132, 106, 4, 133, 107 ], [ 8, 75, 47, 13, 76, 48 ], [ 7, 54, 24, 22, 55, 25 ], [ 22, 45, 15, 13, 46, 16 ], [ 10, 142, 114, 2, 143, 115 ], [ 19, 74, 46, 4, 75, 47 ], [ 28, 50, 22, 6, 51, 23 ], [ 33, 46, 16, 4, 47, 17 ], [ 8, 152, 122, 4, 153, 123 ], [ 22, 73, 45, 3, 74, 46 ], [ 8, 53, 23, 26, 54, 24 ], [ 12, 45, 15, 28, 46, 16 ], [ 3, 147, 117, 10, 148, 118 ], [ 3, 73, 45, 23, 74, 46 ], [ 4, 54, 24, 31, 55, 25 ], [ 11, 45, 15, 31, 46, 16 ], [ 7, 146, 116, 7, 147, 117 ], [ 21, 73, 45, 7, 74, 46 ], [ 1, 53, 23, 37, 54, 24 ], [ 19, 45, 15, 26, 46, 16 ], [ 5, 145, 115, 10, 146, 116 ], [ 19, 75, 47, 10, 76, 48 ], [ 15, 54, 24, 25, 55, 25 ], [ 23, 45, 15, 25, 46, 16 ], [ 13, 145, 115, 3, 146, 116 ], [ 2, 74, 46, 29, 75, 47 ], [ 42, 54, 24, 1, 55, 25 ], [ 23, 45, 15, 28, 46, 16 ], [ 17, 145, 115 ], [ 10, 74, 46, 23, 75, 47 ], [ 10, 54, 24, 35, 55, 25 ], [ 19, 45, 15, 35, 46, 16 ], [ 17, 145, 115, 1, 146, 116 ], [ 14, 74, 46, 21, 75, 47 ], [ 29, 54, 24, 19, 55, 25 ], [ 11, 45, 15, 46, 46, 16 ], [ 13, 145, 115, 6, 146, 116 ], [ 14, 74, 46, 23, 75, 47 ], [ 44, 54, 24, 7, 55, 25 ], [ 59, 46, 16, 1, 47, 17 ], [ 12, 151, 121, 7, 152, 122 ], [ 12, 75, 47, 26, 76, 48 ], [ 39, 54, 24, 14, 55, 25 ], [ 22, 45, 15, 41, 46, 16 ], [ 6, 151, 121, 14, 152, 122 ], [ 6, 75, 47, 34, 76, 48 ], [ 46, 54, 24, 10, 55, 25 ], [ 2, 45, 15, 64, 46, 16 ], [ 17, 152, 122, 4, 153, 123 ], [ 29, 74, 46, 14, 75, 47 ], [ 49, 54, 24, 10, 55, 25 ], [ 24, 45, 15, 46, 46, 16 ], [ 4, 152, 122, 18, 153, 123 ], [ 13, 74, 46, 32, 75, 47 ], [ 48, 54, 24, 14, 55, 25 ], [ 42, 45, 15, 32, 46, 16 ], [ 20, 147, 117, 4, 148, 118 ], [ 40, 75, 47, 7, 76, 48 ], [ 43, 54, 24, 22, 55, 25 ], [ 10, 45, 15, 67, 46, 16 ], [ 19, 148, 118, 6, 149, 119 ], [ 18, 75, 47, 31, 76, 48 ], [ 34, 54, 24, 34, 55, 25 ], [ 20, 45, 15, 61, 46, 16 ] ], 
        j.getRSBlocks = function(a, b) {
            var c = j.getRsBlockTable(a, b);
            if (void 0 == c) throw new Error("bad rs block @ typeNumber:" + a + "/errorCorrectLevel:" + b);
            for (var d = c.length / 3, e = [], f = 0; d > f; f++) for (var g = c[3 * f + 0], h = c[3 * f + 1], i = c[3 * f + 2], k = 0; g > k; k++) e.push(new j(h, i));
            return e;
        }, j.getRsBlockTable = function(a, b) {
            switch (b) {
              case d.L:
                return j.RS_BLOCK_TABLE[4 * (a - 1) + 0];

              case d.M:
                return j.RS_BLOCK_TABLE[4 * (a - 1) + 1];

              case d.Q:
                return j.RS_BLOCK_TABLE[4 * (a - 1) + 2];

              case d.H:
                return j.RS_BLOCK_TABLE[4 * (a - 1) + 3];

              default:
                return void 0;
            }
        }, k.prototype = {
            get: function(a) {
                var b = Math.floor(a / 8);
                return 1 == (1 & this.buffer[b] >>> 7 - a % 8);
            },
            put: function(a, b) {
                for (var c = 0; b > c; c++) this.putBit(1 == (1 & a >>> b - c - 1));
            },
            getLengthInBits: function() {
                return this.length;
            },
            putBit: function(a) {
                var b = Math.floor(this.length / 8);
                this.buffer.length <= b && this.buffer.push(0), a && (this.buffer[b] |= 128 >>> this.length % 8), 
                this.length++;
            }
        };
        var l = [ [ 17, 14, 11, 7 ], [ 32, 26, 20, 14 ], [ 53, 42, 32, 24 ], [ 78, 62, 46, 34 ], [ 106, 84, 60, 44 ], [ 134, 106, 74, 58 ], [ 154, 122, 86, 64 ], [ 192, 152, 108, 84 ], [ 230, 180, 130, 98 ], [ 271, 213, 151, 119 ], [ 321, 251, 177, 137 ], [ 367, 287, 203, 155 ], [ 425, 331, 241, 177 ], [ 458, 362, 258, 194 ], [ 520, 412, 292, 220 ], [ 586, 450, 322, 250 ], [ 644, 504, 364, 280 ], [ 718, 560, 394, 310 ], [ 792, 624, 442, 338 ], [ 858, 666, 482, 382 ], [ 929, 711, 509, 403 ], [ 1003, 779, 565, 439 ], [ 1091, 857, 611, 461 ], [ 1171, 911, 661, 511 ], [ 1273, 997, 715, 535 ], [ 1367, 1059, 751, 593 ], [ 1465, 1125, 805, 625 ], [ 1528, 1190, 868, 658 ], [ 1628, 1264, 908, 698 ], [ 1732, 1370, 982, 742 ], [ 1840, 1452, 1030, 790 ], [ 1952, 1538, 1112, 842 ], [ 2068, 1628, 1168, 898 ], [ 2188, 1722, 1228, 958 ], [ 2303, 1809, 1283, 983 ], [ 2431, 1911, 1351, 1051 ], [ 2563, 1989, 1423, 1093 ], [ 2699, 2099, 1499, 1139 ], [ 2809, 2213, 1579, 1219 ], [ 2953, 2331, 1663, 1273 ] ], o = function() {
            var a = function(a, b) {
                this._el = a, this._htOption = b;
            };
            return a.prototype.draw = function(a) {
                function g(a, b) {
                    var c = document.createElementNS("http://www.w3.org/2000/svg", a);
                    for (var d in b) b.hasOwnProperty(d) && c.setAttribute(d, b[d]);
                    return c;
                }
                var b = this._htOption, c = this._el, d = a.getModuleCount();
                Math.floor(b.width / d), Math.floor(b.height / d), this.clear();
                var h = g("svg", {
                    viewBox: "0 0 " + String(d) + " " + String(d),
                    width: "100%",
                    height: "100%",
                    fill: b.colorLight
                });
                h.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink"), 
                c.appendChild(h), h.appendChild(g("rect", {
                    fill: b.colorDark,
                    width: "1",
                    height: "1",
                    id: "template"
                }));
                for (var i = 0; d > i; i++) for (var j = 0; d > j; j++) if (a.isDark(i, j)) {
                    var k = g("use", {
                        x: String(i),
                        y: String(j)
                    });
                    k.setAttributeNS("http://www.w3.org/1999/xlink", "href", "#template"), h.appendChild(k);
                }
            }, a.prototype.clear = function() {
                for (;this._el.hasChildNodes(); ) this._el.removeChild(this._el.lastChild);
            }, a;
        }(), p = "svg" === document.documentElement.tagName.toLowerCase(), q = p ? o : m() ? function() {
            function a() {
                this._elImage.src = this._elCanvas.toDataURL("image/png"), this._elImage.style.display = "block", 
                this._elCanvas.style.display = "none";
            }
            function d(a, b) {
                var c = this;
                if (c._fFail = b, c._fSuccess = a, null === c._bSupportDataURI) {
                    var d = document.createElement("img"), e = function() {
                        c._bSupportDataURI = !1, c._fFail && _fFail.call(c);
                    }, f = function() {
                        c._bSupportDataURI = !0, c._fSuccess && c._fSuccess.call(c);
                    };
                    return d.onabort = e, d.onerror = e, d.onload = f, d.src = "data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==", 
                    void 0;
                }
                c._bSupportDataURI === !0 && c._fSuccess ? c._fSuccess.call(c) : c._bSupportDataURI === !1 && c._fFail && c._fFail.call(c);
            }
            if (this._android && this._android <= 2.1) {
                var b = 1 / window.devicePixelRatio, c = CanvasRenderingContext2D.prototype.drawImage;
                CanvasRenderingContext2D.prototype.drawImage = function(a, d, e, f, g, h, i, j) {
                    if ("nodeName" in a && /img/i.test(a.nodeName)) for (var l = arguments.length - 1; l >= 1; l--) arguments[l] = arguments[l] * b; else "undefined" == typeof j && (arguments[1] *= b, 
                    arguments[2] *= b, arguments[3] *= b, arguments[4] *= b);
                    c.apply(this, arguments);
                };
            }
            var e = function(a, b) {
                this._bIsPainted = !1, this._android = n(), this._htOption = b, this._elCanvas = document.createElement("canvas"), 
                this._elCanvas.width = b.width, this._elCanvas.height = b.height, a.appendChild(this._elCanvas), 
                this._el = a, this._oContext = this._elCanvas.getContext("2d"), this._bIsPainted = !1, 
                this._elImage = document.createElement("img"), this._elImage.style.display = "none", 
                this._el.appendChild(this._elImage), this._bSupportDataURI = null;
            };
            return e.prototype.draw = function(a) {
                var b = this._elImage, c = this._oContext, d = this._htOption, e = a.getModuleCount(), f = d.width / e, g = d.height / e, h = Math.round(f), i = Math.round(g);
                b.style.display = "none", this.clear();
                for (var j = 0; e > j; j++) for (var k = 0; e > k; k++) {
                    var l = a.isDark(j, k), m = k * f, n = j * g;
                    c.strokeStyle = l ? d.colorDark : d.colorLight, c.lineWidth = 1, c.fillStyle = l ? d.colorDark : d.colorLight, 
                    c.fillRect(m, n, f, g), c.strokeRect(Math.floor(m) + .5, Math.floor(n) + .5, h, i), 
                    c.strokeRect(Math.ceil(m) - .5, Math.ceil(n) - .5, h, i);
                }
                this._bIsPainted = !0;
            }, e.prototype.makeImage = function() {
                this._bIsPainted && d.call(this, a);
            }, e.prototype.isPainted = function() {
                return this._bIsPainted;
            }, e.prototype.clear = function() {
                this._oContext.clearRect(0, 0, this._elCanvas.width, this._elCanvas.height), this._bIsPainted = !1;
            }, e.prototype.round = function(a) {
                return a ? Math.floor(1e3 * a) / 1e3 : a;
            }, e;
        }() : function() {
            var a = function(a, b) {
                this._el = a, this._htOption = b;
            };
            return a.prototype.draw = function(a) {
                for (var b = this._htOption, c = this._el, d = a.getModuleCount(), e = Math.floor(b.width / d), f = Math.floor(b.height / d), g = [ '<table style="border:0;border-collapse:collapse;">' ], h = 0; d > h; h++) {
                    g.push("<tr>");
                    for (var i = 0; d > i; i++) g.push('<td style="border:0;border-collapse:collapse;padding:0;margin:0;width:' + e + "px;height:" + f + "px;background-color:" + (a.isDark(h, i) ? b.colorDark : b.colorLight) + ';"></td>');
                    g.push("</tr>");
                }
                g.push("</table>"), c.innerHTML = g.join("");
                var j = c.childNodes[0], k = (b.width - j.offsetWidth) / 2, l = (b.height - j.offsetHeight) / 2;
                k > 0 && l > 0 && (j.style.margin = l + "px " + k + "px");
            }, a.prototype.clear = function() {
                this._el.innerHTML = "";
            }, a;
        }();
        QRCode = function(a, b) {
            if (this._htOption = {
                width: 256,
                height: 256,
                typeNumber: 4,
                colorDark: "#000000",
                colorLight: "#ffffff",
                correctLevel: d.H
            }, "string" == typeof b && (b = {
                text: b
            }), b) for (var c in b) this._htOption[c] = b[c];
            "string" == typeof a && (a = document.getElementById(a)), this._android = n(), this._el = a, 
            this._oQRCode = null, this._oDrawing = new q(this._el, this._htOption), this._htOption.text && this.makeCode(this._htOption.text);
        }, QRCode.prototype.makeCode = function(a) {
            this._oQRCode = new b(r(a, this._htOption.correctLevel), this._htOption.correctLevel), 
            this._oQRCode.addData(a), this._oQRCode.make(), this._el.title = a, this._oDrawing.draw(this._oQRCode), 
            this.makeImage();
        }, QRCode.prototype.makeImage = function() {
            "function" == typeof this._oDrawing.makeImage && (!this._android || this._android >= 3) && this._oDrawing.makeImage();
        }, QRCode.prototype.clear = function() {
            this._oDrawing.clear();
        }, QRCode.CorrectLevel = d;
    }();
    module.exports = QRCode;
});

define("dist/cmd-lib/qr/jquery.qrcode.min", [], function(require, exports, module) {
    //var jQuery = require("$");
    (function(r) {
        r.fn.qrcode = function(h) {
            var s;
            function u(a) {
                this.mode = s;
                this.data = a;
            }
            function o(a, c) {
                this.typeNumber = a;
                this.errorCorrectLevel = c;
                this.modules = null;
                this.moduleCount = 0;
                this.dataCache = null;
                this.dataList = [];
            }
            function q(a, c) {
                if (void 0 == a.length) throw Error(a.length + "/" + c);
                for (var d = 0; d < a.length && 0 == a[d]; ) d++;
                this.num = Array(a.length - d + c);
                for (var b = 0; b < a.length - d; b++) this.num[b] = a[b + d];
            }
            function p(a, c) {
                this.totalCount = a;
                this.dataCount = c;
            }
            function t() {
                this.buffer = [];
                this.length = 0;
            }
            u.prototype = {
                getLength: function() {
                    return this.data.length;
                },
                write: function(a) {
                    for (var c = 0; c < this.data.length; c++) a.put(this.data.charCodeAt(c), 8);
                }
            };
            o.prototype = {
                addData: function(a) {
                    this.dataList.push(new u(a));
                    this.dataCache = null;
                },
                isDark: function(a, c) {
                    if (0 > a || this.moduleCount <= a || 0 > c || this.moduleCount <= c) throw Error(a + "," + c);
                    return this.modules[a][c];
                },
                getModuleCount: function() {
                    return this.moduleCount;
                },
                make: function() {
                    if (1 > this.typeNumber) {
                        for (var a = 1, a = 1; 40 > a; a++) {
                            for (var c = p.getRSBlocks(a, this.errorCorrectLevel), d = new t(), b = 0, e = 0; e < c.length; e++) b += c[e].dataCount;
                            for (e = 0; e < this.dataList.length; e++) c = this.dataList[e], d.put(c.mode, 4), 
                            d.put(c.getLength(), j.getLengthInBits(c.mode, a)), c.write(d);
                            if (d.getLengthInBits() <= 8 * b) break;
                        }
                        this.typeNumber = a;
                    }
                    this.makeImpl(!1, this.getBestMaskPattern());
                },
                makeImpl: function(a, c) {
                    this.moduleCount = 4 * this.typeNumber + 17;
                    this.modules = Array(this.moduleCount);
                    for (var d = 0; d < this.moduleCount; d++) {
                        this.modules[d] = Array(this.moduleCount);
                        for (var b = 0; b < this.moduleCount; b++) this.modules[d][b] = null;
                    }
                    this.setupPositionProbePattern(0, 0);
                    this.setupPositionProbePattern(this.moduleCount - 7, 0);
                    this.setupPositionProbePattern(0, this.moduleCount - 7);
                    this.setupPositionAdjustPattern();
                    this.setupTimingPattern();
                    this.setupTypeInfo(a, c);
                    7 <= this.typeNumber && this.setupTypeNumber(a);
                    null == this.dataCache && (this.dataCache = o.createData(this.typeNumber, this.errorCorrectLevel, this.dataList));
                    this.mapData(this.dataCache, c);
                },
                setupPositionProbePattern: function(a, c) {
                    for (var d = -1; 7 >= d; d++) if (!(-1 >= a + d || this.moduleCount <= a + d)) for (var b = -1; 7 >= b; b++) -1 >= c + b || this.moduleCount <= c + b || (this.modules[a + d][c + b] = 0 <= d && 6 >= d && (0 == b || 6 == b) || 0 <= b && 6 >= b && (0 == d || 6 == d) || 2 <= d && 4 >= d && 2 <= b && 4 >= b ? !0 : !1);
                },
                getBestMaskPattern: function() {
                    for (var a = 0, c = 0, d = 0; 8 > d; d++) {
                        this.makeImpl(!0, d);
                        var b = j.getLostPoint(this);
                        if (0 == d || a > b) a = b, c = d;
                    }
                    return c;
                },
                createMovieClip: function(a, c, d) {
                    a = a.createEmptyMovieClip(c, d);
                    this.make();
                    for (c = 0; c < this.modules.length; c++) for (var d = 1 * c, b = 0; b < this.modules[c].length; b++) {
                        var e = 1 * b;
                        this.modules[c][b] && (a.beginFill(0, 100), a.moveTo(e, d), a.lineTo(e + 1, d), 
                        a.lineTo(e + 1, d + 1), a.lineTo(e, d + 1), a.endFill());
                    }
                    return a;
                },
                setupTimingPattern: function() {
                    for (var a = 8; a < this.moduleCount - 8; a++) null == this.modules[a][6] && (this.modules[a][6] = 0 == a % 2);
                    for (a = 8; a < this.moduleCount - 8; a++) null == this.modules[6][a] && (this.modules[6][a] = 0 == a % 2);
                },
                setupPositionAdjustPattern: function() {
                    for (var a = j.getPatternPosition(this.typeNumber), c = 0; c < a.length; c++) for (var d = 0; d < a.length; d++) {
                        var b = a[c], e = a[d];
                        if (null == this.modules[b][e]) for (var f = -2; 2 >= f; f++) for (var i = -2; 2 >= i; i++) this.modules[b + f][e + i] = -2 == f || 2 == f || -2 == i || 2 == i || 0 == f && 0 == i ? !0 : !1;
                    }
                },
                setupTypeNumber: function(a) {
                    for (var c = j.getBCHTypeNumber(this.typeNumber), d = 0; 18 > d; d++) {
                        var b = !a && 1 == (c >> d & 1);
                        this.modules[Math.floor(d / 3)][d % 3 + this.moduleCount - 8 - 3] = b;
                    }
                    for (d = 0; 18 > d; d++) b = !a && 1 == (c >> d & 1), this.modules[d % 3 + this.moduleCount - 8 - 3][Math.floor(d / 3)] = b;
                },
                setupTypeInfo: function(a, c) {
                    for (var d = j.getBCHTypeInfo(this.errorCorrectLevel << 3 | c), b = 0; 15 > b; b++) {
                        var e = !a && 1 == (d >> b & 1);
                        6 > b ? this.modules[b][8] = e : 8 > b ? this.modules[b + 1][8] = e : this.modules[this.moduleCount - 15 + b][8] = e;
                    }
                    for (b = 0; 15 > b; b++) e = !a && 1 == (d >> b & 1), 8 > b ? this.modules[8][this.moduleCount - b - 1] = e : 9 > b ? this.modules[8][15 - b - 1 + 1] = e : this.modules[8][15 - b - 1] = e;
                    this.modules[this.moduleCount - 8][8] = !a;
                },
                mapData: function(a, c) {
                    for (var d = -1, b = this.moduleCount - 1, e = 7, f = 0, i = this.moduleCount - 1; 0 < i; i -= 2) for (6 == i && i--; ;) {
                        for (var g = 0; 2 > g; g++) if (null == this.modules[b][i - g]) {
                            var n = !1;
                            f < a.length && (n = 1 == (a[f] >>> e & 1));
                            j.getMask(c, b, i - g) && (n = !n);
                            this.modules[b][i - g] = n;
                            e--;
                            -1 == e && (f++, e = 7);
                        }
                        b += d;
                        if (0 > b || this.moduleCount <= b) {
                            b -= d;
                            d = -d;
                            break;
                        }
                    }
                }
            };
            o.PAD0 = 236;
            o.PAD1 = 17;
            o.createData = function(a, c, d) {
                for (var c = p.getRSBlocks(a, c), b = new t(), e = 0; e < d.length; e++) {
                    var f = d[e];
                    b.put(f.mode, 4);
                    b.put(f.getLength(), j.getLengthInBits(f.mode, a));
                    f.write(b);
                }
                for (e = a = 0; e < c.length; e++) a += c[e].dataCount;
                if (b.getLengthInBits() > 8 * a) throw Error("code length overflow. (" + b.getLengthInBits() + ">" + 8 * a + ")");
                for (b.getLengthInBits() + 4 <= 8 * a && b.put(0, 4); 0 != b.getLengthInBits() % 8; ) b.putBit(!1);
                for (;!(b.getLengthInBits() >= 8 * a); ) {
                    b.put(o.PAD0, 8);
                    if (b.getLengthInBits() >= 8 * a) break;
                    b.put(o.PAD1, 8);
                }
                return o.createBytes(b, c);
            };
            o.createBytes = function(a, c) {
                for (var d = 0, b = 0, e = 0, f = Array(c.length), i = Array(c.length), g = 0; g < c.length; g++) {
                    var n = c[g].dataCount, h = c[g].totalCount - n, b = Math.max(b, n), e = Math.max(e, h);
                    f[g] = Array(n);
                    for (var k = 0; k < f[g].length; k++) f[g][k] = 255 & a.buffer[k + d];
                    d += n;
                    k = j.getErrorCorrectPolynomial(h);
                    n = new q(f[g], k.getLength() - 1).mod(k);
                    i[g] = Array(k.getLength() - 1);
                    for (k = 0; k < i[g].length; k++) h = k + n.getLength() - i[g].length, i[g][k] = 0 <= h ? n.get(h) : 0;
                }
                for (k = g = 0; k < c.length; k++) g += c[k].totalCount;
                d = Array(g);
                for (k = n = 0; k < b; k++) for (g = 0; g < c.length; g++) k < f[g].length && (d[n++] = f[g][k]);
                for (k = 0; k < e; k++) for (g = 0; g < c.length; g++) k < i[g].length && (d[n++] = i[g][k]);
                return d;
            };
            s = 4;
            for (var j = {
                PATTERN_POSITION_TABLE: [ [], [ 6, 18 ], [ 6, 22 ], [ 6, 26 ], [ 6, 30 ], [ 6, 34 ], [ 6, 22, 38 ], [ 6, 24, 42 ], [ 6, 26, 46 ], [ 6, 28, 50 ], [ 6, 30, 54 ], [ 6, 32, 58 ], [ 6, 34, 62 ], [ 6, 26, 46, 66 ], [ 6, 26, 48, 70 ], [ 6, 26, 50, 74 ], [ 6, 30, 54, 78 ], [ 6, 30, 56, 82 ], [ 6, 30, 58, 86 ], [ 6, 34, 62, 90 ], [ 6, 28, 50, 72, 94 ], [ 6, 26, 50, 74, 98 ], [ 6, 30, 54, 78, 102 ], [ 6, 28, 54, 80, 106 ], [ 6, 32, 58, 84, 110 ], [ 6, 30, 58, 86, 114 ], [ 6, 34, 62, 90, 118 ], [ 6, 26, 50, 74, 98, 122 ], [ 6, 30, 54, 78, 102, 126 ], [ 6, 26, 52, 78, 104, 130 ], [ 6, 30, 56, 82, 108, 134 ], [ 6, 34, 60, 86, 112, 138 ], [ 6, 30, 58, 86, 114, 142 ], [ 6, 34, 62, 90, 118, 146 ], [ 6, 30, 54, 78, 102, 126, 150 ], [ 6, 24, 50, 76, 102, 128, 154 ], [ 6, 28, 54, 80, 106, 132, 158 ], [ 6, 32, 58, 84, 110, 136, 162 ], [ 6, 26, 54, 82, 110, 138, 166 ], [ 6, 30, 58, 86, 114, 142, 170 ] ],
                G15: 1335,
                G18: 7973,
                G15_MASK: 21522,
                getBCHTypeInfo: function(a) {
                    for (var c = a << 10; 0 <= j.getBCHDigit(c) - j.getBCHDigit(j.G15); ) c ^= j.G15 << j.getBCHDigit(c) - j.getBCHDigit(j.G15);
                    return (a << 10 | c) ^ j.G15_MASK;
                },
                getBCHTypeNumber: function(a) {
                    for (var c = a << 12; 0 <= j.getBCHDigit(c) - j.getBCHDigit(j.G18); ) c ^= j.G18 << j.getBCHDigit(c) - j.getBCHDigit(j.G18);
                    return a << 12 | c;
                },
                getBCHDigit: function(a) {
                    for (var c = 0; 0 != a; ) c++, a >>>= 1;
                    return c;
                },
                getPatternPosition: function(a) {
                    return j.PATTERN_POSITION_TABLE[a - 1];
                },
                getMask: function(a, c, d) {
                    switch (a) {
                      case 0:
                        return 0 == (c + d) % 2;

                      case 1:
                        return 0 == c % 2;

                      case 2:
                        return 0 == d % 3;

                      case 3:
                        return 0 == (c + d) % 3;

                      case 4:
                        return 0 == (Math.floor(c / 2) + Math.floor(d / 3)) % 2;

                      case 5:
                        return 0 == c * d % 2 + c * d % 3;

                      case 6:
                        return 0 == (c * d % 2 + c * d % 3) % 2;

                      case 7:
                        return 0 == (c * d % 3 + (c + d) % 2) % 2;

                      default:
                        throw Error("bad maskPattern:" + a);
                    }
                },
                getErrorCorrectPolynomial: function(a) {
                    for (var c = new q([ 1 ], 0), d = 0; d < a; d++) c = c.multiply(new q([ 1, l.gexp(d) ], 0));
                    return c;
                },
                getLengthInBits: function(a, c) {
                    if (1 <= c && 10 > c) switch (a) {
                      case 1:
                        return 10;

                      case 2:
                        return 9;

                      case s:
                        return 8;

                      case 8:
                        return 8;

                      default:
                        throw Error("mode:" + a);
                    } else if (27 > c) switch (a) {
                      case 1:
                        return 12;

                      case 2:
                        return 11;

                      case s:
                        return 16;

                      case 8:
                        return 10;

                      default:
                        throw Error("mode:" + a);
                    } else if (41 > c) switch (a) {
                      case 1:
                        return 14;

                      case 2:
                        return 13;

                      case s:
                        return 16;

                      case 8:
                        return 12;

                      default:
                        throw Error("mode:" + a);
                    } else throw Error("type:" + c);
                },
                getLostPoint: function(a) {
                    for (var c = a.getModuleCount(), d = 0, b = 0; b < c; b++) for (var e = 0; e < c; e++) {
                        for (var f = 0, i = a.isDark(b, e), g = -1; 1 >= g; g++) if (!(0 > b + g || c <= b + g)) for (var h = -1; 1 >= h; h++) 0 > e + h || c <= e + h || 0 == g && 0 == h || i == a.isDark(b + g, e + h) && f++;
                        5 < f && (d += 3 + f - 5);
                    }
                    for (b = 0; b < c - 1; b++) for (e = 0; e < c - 1; e++) if (f = 0, a.isDark(b, e) && f++, 
                    a.isDark(b + 1, e) && f++, a.isDark(b, e + 1) && f++, a.isDark(b + 1, e + 1) && f++, 
                    0 == f || 4 == f) d += 3;
                    for (b = 0; b < c; b++) for (e = 0; e < c - 6; e++) a.isDark(b, e) && !a.isDark(b, e + 1) && a.isDark(b, e + 2) && a.isDark(b, e + 3) && a.isDark(b, e + 4) && !a.isDark(b, e + 5) && a.isDark(b, e + 6) && (d += 40);
                    for (e = 0; e < c; e++) for (b = 0; b < c - 6; b++) a.isDark(b, e) && !a.isDark(b + 1, e) && a.isDark(b + 2, e) && a.isDark(b + 3, e) && a.isDark(b + 4, e) && !a.isDark(b + 5, e) && a.isDark(b + 6, e) && (d += 40);
                    for (e = f = 0; e < c; e++) for (b = 0; b < c; b++) a.isDark(b, e) && f++;
                    a = Math.abs(100 * f / c / c - 50) / 5;
                    return d + 10 * a;
                }
            }, l = {
                glog: function(a) {
                    if (1 > a) throw Error("glog(" + a + ")");
                    return l.LOG_TABLE[a];
                },
                gexp: function(a) {
                    for (;0 > a; ) a += 255;
                    for (;256 <= a; ) a -= 255;
                    return l.EXP_TABLE[a];
                },
                EXP_TABLE: Array(256),
                LOG_TABLE: Array(256)
            }, m = 0; 8 > m; m++) l.EXP_TABLE[m] = 1 << m;
            for (m = 8; 256 > m; m++) l.EXP_TABLE[m] = l.EXP_TABLE[m - 4] ^ l.EXP_TABLE[m - 5] ^ l.EXP_TABLE[m - 6] ^ l.EXP_TABLE[m - 8];
            for (m = 0; 255 > m; m++) l.LOG_TABLE[l.EXP_TABLE[m]] = m;
            q.prototype = {
                get: function(a) {
                    return this.num[a];
                },
                getLength: function() {
                    return this.num.length;
                },
                multiply: function(a) {
                    for (var c = Array(this.getLength() + a.getLength() - 1), d = 0; d < this.getLength(); d++) for (var b = 0; b < a.getLength(); b++) c[d + b] ^= l.gexp(l.glog(this.get(d)) + l.glog(a.get(b)));
                    return new q(c, 0);
                },
                mod: function(a) {
                    if (0 > this.getLength() - a.getLength()) return this;
                    for (var c = l.glog(this.get(0)) - l.glog(a.get(0)), d = Array(this.getLength()), b = 0; b < this.getLength(); b++) d[b] = this.get(b);
                    for (b = 0; b < a.getLength(); b++) d[b] ^= l.gexp(l.glog(a.get(b)) + c);
                    return new q(d, 0).mod(a);
                }
            };
            p.RS_BLOCK_TABLE = [ [ 1, 26, 19 ], [ 1, 26, 16 ], [ 1, 26, 13 ], [ 1, 26, 9 ], [ 1, 44, 34 ], [ 1, 44, 28 ], [ 1, 44, 22 ], [ 1, 44, 16 ], [ 1, 70, 55 ], [ 1, 70, 44 ], [ 2, 35, 17 ], [ 2, 35, 13 ], [ 1, 100, 80 ], [ 2, 50, 32 ], [ 2, 50, 24 ], [ 4, 25, 9 ], [ 1, 134, 108 ], [ 2, 67, 43 ], [ 2, 33, 15, 2, 34, 16 ], [ 2, 33, 11, 2, 34, 12 ], [ 2, 86, 68 ], [ 4, 43, 27 ], [ 4, 43, 19 ], [ 4, 43, 15 ], [ 2, 98, 78 ], [ 4, 49, 31 ], [ 2, 32, 14, 4, 33, 15 ], [ 4, 39, 13, 1, 40, 14 ], [ 2, 121, 97 ], [ 2, 60, 38, 2, 61, 39 ], [ 4, 40, 18, 2, 41, 19 ], [ 4, 40, 14, 2, 41, 15 ], [ 2, 146, 116 ], [ 3, 58, 36, 2, 59, 37 ], [ 4, 36, 16, 4, 37, 17 ], [ 4, 36, 12, 4, 37, 13 ], [ 2, 86, 68, 2, 87, 69 ], [ 4, 69, 43, 1, 70, 44 ], [ 6, 43, 19, 2, 44, 20 ], [ 6, 43, 15, 2, 44, 16 ], [ 4, 101, 81 ], [ 1, 80, 50, 4, 81, 51 ], [ 4, 50, 22, 4, 51, 23 ], [ 3, 36, 12, 8, 37, 13 ], [ 2, 116, 92, 2, 117, 93 ], [ 6, 58, 36, 2, 59, 37 ], [ 4, 46, 20, 6, 47, 21 ], [ 7, 42, 14, 4, 43, 15 ], [ 4, 133, 107 ], [ 8, 59, 37, 1, 60, 38 ], [ 8, 44, 20, 4, 45, 21 ], [ 12, 33, 11, 4, 34, 12 ], [ 3, 145, 115, 1, 146, 116 ], [ 4, 64, 40, 5, 65, 41 ], [ 11, 36, 16, 5, 37, 17 ], [ 11, 36, 12, 5, 37, 13 ], [ 5, 109, 87, 1, 110, 88 ], [ 5, 65, 41, 5, 66, 42 ], [ 5, 54, 24, 7, 55, 25 ], [ 11, 36, 12 ], [ 5, 122, 98, 1, 123, 99 ], [ 7, 73, 45, 3, 74, 46 ], [ 15, 43, 19, 2, 44, 20 ], [ 3, 45, 15, 13, 46, 16 ], [ 1, 135, 107, 5, 136, 108 ], [ 10, 74, 46, 1, 75, 47 ], [ 1, 50, 22, 15, 51, 23 ], [ 2, 42, 14, 17, 43, 15 ], [ 5, 150, 120, 1, 151, 121 ], [ 9, 69, 43, 4, 70, 44 ], [ 17, 50, 22, 1, 51, 23 ], [ 2, 42, 14, 19, 43, 15 ], [ 3, 141, 113, 4, 142, 114 ], [ 3, 70, 44, 11, 71, 45 ], [ 17, 47, 21, 4, 48, 22 ], [ 9, 39, 13, 16, 40, 14 ], [ 3, 135, 107, 5, 136, 108 ], [ 3, 67, 41, 13, 68, 42 ], [ 15, 54, 24, 5, 55, 25 ], [ 15, 43, 15, 10, 44, 16 ], [ 4, 144, 116, 4, 145, 117 ], [ 17, 68, 42 ], [ 17, 50, 22, 6, 51, 23 ], [ 19, 46, 16, 6, 47, 17 ], [ 2, 139, 111, 7, 140, 112 ], [ 17, 74, 46 ], [ 7, 54, 24, 16, 55, 25 ], [ 34, 37, 13 ], [ 4, 151, 121, 5, 152, 122 ], [ 4, 75, 47, 14, 76, 48 ], [ 11, 54, 24, 14, 55, 25 ], [ 16, 45, 15, 14, 46, 16 ], [ 6, 147, 117, 4, 148, 118 ], [ 6, 73, 45, 14, 74, 46 ], [ 11, 54, 24, 16, 55, 25 ], [ 30, 46, 16, 2, 47, 17 ], [ 8, 132, 106, 4, 133, 107 ], [ 8, 75, 47, 13, 76, 48 ], [ 7, 54, 24, 22, 55, 25 ], [ 22, 45, 15, 13, 46, 16 ], [ 10, 142, 114, 2, 143, 115 ], [ 19, 74, 46, 4, 75, 47 ], [ 28, 50, 22, 6, 51, 23 ], [ 33, 46, 16, 4, 47, 17 ], [ 8, 152, 122, 4, 153, 123 ], [ 22, 73, 45, 3, 74, 46 ], [ 8, 53, 23, 26, 54, 24 ], [ 12, 45, 15, 28, 46, 16 ], [ 3, 147, 117, 10, 148, 118 ], [ 3, 73, 45, 23, 74, 46 ], [ 4, 54, 24, 31, 55, 25 ], [ 11, 45, 15, 31, 46, 16 ], [ 7, 146, 116, 7, 147, 117 ], [ 21, 73, 45, 7, 74, 46 ], [ 1, 53, 23, 37, 54, 24 ], [ 19, 45, 15, 26, 46, 16 ], [ 5, 145, 115, 10, 146, 116 ], [ 19, 75, 47, 10, 76, 48 ], [ 15, 54, 24, 25, 55, 25 ], [ 23, 45, 15, 25, 46, 16 ], [ 13, 145, 115, 3, 146, 116 ], [ 2, 74, 46, 29, 75, 47 ], [ 42, 54, 24, 1, 55, 25 ], [ 23, 45, 15, 28, 46, 16 ], [ 17, 145, 115 ], [ 10, 74, 46, 23, 75, 47 ], [ 10, 54, 24, 35, 55, 25 ], [ 19, 45, 15, 35, 46, 16 ], [ 17, 145, 115, 1, 146, 116 ], [ 14, 74, 46, 21, 75, 47 ], [ 29, 54, 24, 19, 55, 25 ], [ 11, 45, 15, 46, 46, 16 ], [ 13, 145, 115, 6, 146, 116 ], [ 14, 74, 46, 23, 75, 47 ], [ 44, 54, 24, 7, 55, 25 ], [ 59, 46, 16, 1, 47, 17 ], [ 12, 151, 121, 7, 152, 122 ], [ 12, 75, 47, 26, 76, 48 ], [ 39, 54, 24, 14, 55, 25 ], [ 22, 45, 15, 41, 46, 16 ], [ 6, 151, 121, 14, 152, 122 ], [ 6, 75, 47, 34, 76, 48 ], [ 46, 54, 24, 10, 55, 25 ], [ 2, 45, 15, 64, 46, 16 ], [ 17, 152, 122, 4, 153, 123 ], [ 29, 74, 46, 14, 75, 47 ], [ 49, 54, 24, 10, 55, 25 ], [ 24, 45, 15, 46, 46, 16 ], [ 4, 152, 122, 18, 153, 123 ], [ 13, 74, 46, 32, 75, 47 ], [ 48, 54, 24, 14, 55, 25 ], [ 42, 45, 15, 32, 46, 16 ], [ 20, 147, 117, 4, 148, 118 ], [ 40, 75, 47, 7, 76, 48 ], [ 43, 54, 24, 22, 55, 25 ], [ 10, 45, 15, 67, 46, 16 ], [ 19, 148, 118, 6, 149, 119 ], [ 18, 75, 47, 31, 76, 48 ], [ 34, 54, 24, 34, 55, 25 ], [ 20, 45, 15, 61, 46, 16 ] ];
            p.getRSBlocks = function(a, c) {
                var d = p.getRsBlockTable(a, c);
                if (void 0 == d) throw Error("bad rs block @ typeNumber:" + a + "/errorCorrectLevel:" + c);
                for (var b = d.length / 3, e = [], f = 0; f < b; f++) for (var h = d[3 * f + 0], g = d[3 * f + 1], j = d[3 * f + 2], l = 0; l < h; l++) e.push(new p(g, j));
                return e;
            };
            p.getRsBlockTable = function(a, c) {
                switch (c) {
                  case 1:
                    return p.RS_BLOCK_TABLE[4 * (a - 1) + 0];

                  case 0:
                    return p.RS_BLOCK_TABLE[4 * (a - 1) + 1];

                  case 3:
                    return p.RS_BLOCK_TABLE[4 * (a - 1) + 2];

                  case 2:
                    return p.RS_BLOCK_TABLE[4 * (a - 1) + 3];
                }
            };
            t.prototype = {
                get: function(a) {
                    return 1 == (this.buffer[Math.floor(a / 8)] >>> 7 - a % 8 & 1);
                },
                put: function(a, c) {
                    for (var d = 0; d < c; d++) this.putBit(1 == (a >>> c - d - 1 & 1));
                },
                getLengthInBits: function() {
                    return this.length;
                },
                putBit: function(a) {
                    var c = Math.floor(this.length / 8);
                    this.buffer.length <= c && this.buffer.push(0);
                    a && (this.buffer[c] |= 128 >>> this.length % 8);
                    this.length++;
                }
            };
            "string" === typeof h && (h = {
                text: h
            });
            h = r.extend({}, {
                render: "canvas",
                width: 256,
                height: 256,
                typeNumber: -1,
                correctLevel: 2,
                background: "#ffffff",
                foreground: "#000000"
            }, h);
            return this.each(function() {
                var a;
                if ("canvas" == h.render) {
                    a = new o(h.typeNumber, h.correctLevel);
                    a.addData(h.text);
                    a.make();
                    var c = document.createElement("canvas");
                    c.width = h.width;
                    c.height = h.height;
                    for (var d = c.getContext("2d"), b = h.width / a.getModuleCount(), e = h.height / a.getModuleCount(), f = 0; f < a.getModuleCount(); f++) for (var i = 0; i < a.getModuleCount(); i++) {
                        d.fillStyle = a.isDark(f, i) ? h.foreground : h.background;
                        var g = Math.ceil((i + 1) * b) - Math.floor(i * b), j = Math.ceil((f + 1) * b) - Math.floor(f * b);
                        d.fillRect(Math.round(i * b), Math.round(f * e), g, j);
                    }
                } else {
                    a = new o(h.typeNumber, h.correctLevel);
                    a.addData(h.text);
                    a.make();
                    c = r("<table></table>").css("width", h.width + "px").css("height", h.height + "px").css("border", "0px").css("border-collapse", "collapse").css("background-color", h.background);
                    d = h.width / a.getModuleCount();
                    b = h.height / a.getModuleCount();
                    for (e = 0; e < a.getModuleCount(); e++) {
                        f = r("<tr></tr>").css("height", b + "px").appendTo(c);
                        for (i = 0; i < a.getModuleCount(); i++) r("<td></td>").css("width", d + "px").css("background-color", a.isDark(e, i) ? h.foreground : h.background).appendTo(f);
                    }
                }
                a = c;
                jQuery(a).appendTo(this);
            });
        };
    })(jQuery);
});

// 网站url 配置
define("dist/application/urlConfig", [], function(require, exports, module) {
    // var envList = {
    //     'local':'',
    //     'dev':'',
    //     'test':'',
    //     'pre':'',
    //     'prod':''
    // }
    var urlConfig = {
        ajaxUrl: "",
        payUrl: "",
        loginUrl: ""
    };
    if (env == "local") {
        urlConfig = {
            ajaxUrl: "http://ishare.iask.sina.com.cn",
            payUrl: "http://dev-open-ishare.iask.com.cn",
            loginUrl: ""
        };
    }
    if (env == "dev") {
        urlConfig = {
            ajaxUrl: "http://dev-ishare.iask.sina.com.cn",
            payUrl: "http://dev-open-ishare.iask.com.cn",
            loginUrl: ""
        };
    }
    if (env == "test") {
        urlConfig = {
            ajaxUrl: "http://test-ishare.iask.sina.com.cn",
            payUrl: "http://test-open-ishare.iask.com.cn",
            loginUrl: ""
        };
    }
    if (env == "pre") {
        urlConfig = {
            ajaxUrl: "http://pre-ishare.iask.sina.com.cn",
            payUrl: "http://pre-open-ishare.iask.com.cn",
            loginUrl: ""
        };
    }
    if (env == "prod") {
        urlConfig = {
            ajaxUrl: "http://prod-ishare.iask.sina.com.cn",
            payUrl: "http://prod-open-ishare.iask.com.cn",
            loginUrl: ""
        };
    }
    return urlConfig;
});

/**
 * 用优惠券
 */
define("dist/common/coupon/couponOperate", [ "dist/cmd-lib/toast", "dist/application/method" ], function(require, exports, module) {
    // var $ = require("$");
    require("dist/cmd-lib/toast");
    var method = require("dist/application/method");
    var couponOptions = require("dist/common/coupon/template/options.html");
    var couponObj = {
        _index: 0,
        data: [],
        price: 10,
        maxCouponLimit: null,
        couponType: 2,
        //0是现金文档，1是vip
        cashPrice: 0,
        //现金文档
        vipPrice: 0,
        //vip
        useCouponFlag: 1,
        isVip: 0,
        fileDiscount: .8,
        //是VIP 会有个动态折扣
        initial: function() {
            //区别现金购买还是vip购买
            couponObj.queryPageType();
            //点击页面其他地方收起优惠券
            $("body").click(function() {
                if (!$(".coupon-down").is(":hidden")) {
                    $(".coupon-down").hide();
                    $(".select-wrap").removeClass("select-wrap-down");
                }
            });
            if (couponObj.couponType == 0 || couponObj.couponType == 1) {
                couponObj.price = couponObj.getOrderPrice();
                try {
                    couponObj.isVip = window.pageConfig.params.isVip || 0;
                } catch (e) {
                    couponObj.isVip = 0;
                }
                var fileDiscount = window.pageConfig.params.fileDiscount;
                couponObj.fileDiscount = fileDiscount || .8;
                //获取数据
                couponObj.getCouponData(couponObj.couponType);
                // 优惠券选择点击
                couponObj.selectCouponOption();
                //优惠券选择弹窗
                couponObj.operateCouponModule();
                // 切换vip套餐
                couponObj.switchVipSeries();
                //如果支持vip打折
                // if (pageConfig.params.vipDiscountFlag == 1 && pageConfig.params.ownVipDiscountFlag == 1 && pageConfig.params.g_permin == 3 && couponObj.isVip == 0) {
                //     $('.vip-share-text').show();
                //     couponObj.vipDiscountFreeAmount();
                // }
                if (pageConfig.params.vipDiscountFlag == 1 && pageConfig.params.g_permin == 3 && couponObj.isVip == 0) {
                    $(".vip-share-text").show();
                    couponObj.vipDiscountFreeAmount();
                }
            }
        },
        /**
         * 获取订单价格
         */
        getOrderPrice: function() {
            var oprice = 0;
            if (couponObj.couponType == 1) {
                if ($(".js-tab").find(".ui-tab-nav-item.active").data("activeprice") > 0) {
                    oprice = $(".js-tab").find(".ui-tab-nav-item.active").data("activeprice");
                } else {
                    oprice = $(".js-tab").find(".ui-tab-nav-item.active").data("price");
                }
            } else {
                if (pageConfig.params) {
                    oprice = pageConfig.params.moneyPrice;
                }
            }
            return oprice;
        },
        /**
         * 确定页面
         */
        queryPageType: function() {
            var pathName = location.pathname;
            if (pathName == "/pay/vip.html") {
                couponObj.couponType = 1;
            } else if (pathName == "/pay/payConfirm.html") {
                couponObj.couponType = 0;
                $(".btn-back").attr("href", "//ishare.iask.sina.com.cn/f/" + method.getParam("orderNo") + ".html");
            }
        },
        /**
         * 获取优惠券数据
         */
        getCouponData: function(type) {
            var oprice = couponObj.price;
            var url = "/node/coupon/queryPersonal";
            var data = {
                type: type,
                price: oprice
            };
            var dataList = [];
            $.get(url, data, function(res) {
                if (res.code == 0) {
                    if (res.data) {
                        if (res.data.list) {
                            if (res.data.list.length > 0) {
                                var data = JSON.parse(JSON.stringify(res.data.list));
                                dataList = couponObj.delInvalidData(data, oprice);
                            }
                            couponObj.useCouponFlag = 1;
                        }
                    }
                }
                var _html = template.compile(couponOptions)({
                    data: dataList
                });
                $(".coupon-down .select-text").html(_html);
                couponObj.data = dataList;
                couponObj.updateCouponOption(0);
            });
        },
        /**
         * 获得vip 8折省多少元
         */
        vipDiscountFreeAmount: function() {
            var discountPrice = (couponObj.price * couponObj.fileDiscount).toFixed(2);
            var Freeprice = ((couponObj.price * 100 - discountPrice * 100) / 100).toFixed(2);
            $("#vipDiscountFreeAmount").text(Freeprice);
        },
        /**
         * 点击选择框展开或收拢优惠券弹窗
         */
        operateCouponModule: function() {
            $(".pay-coupon-wrap").on("click", ".chose-ele", function(event) {
                if (couponObj.data.length > 0) {
                    $(".coupon-down").toggle();
                    $(".select-wrap").toggleClass("select-wrap-down");
                    event.stopPropagation();
                }
            });
        },
        /**
         * 点击选择优惠券
         */
        selectCouponOption: function() {
            $(".coupon-down").on("click", ".select-ele", function(event) {
                $(".coupon-down").hide();
                event.stopPropagation();
                var _index = $(this).index();
                $(".select-wrap").toggleClass("select-wrap-down");
                couponObj._index = _index;
                couponObj.useCouponFlag = 1;
                //初始化
                couponObj.updateCouponOption(_index);
            });
        },
        /**
         * 更新选择框提示
         */
        updateCouponOption: function(_index) {
            if (couponObj.data.length == _index) {
                // 选择最后一个就是放弃优惠券
                if (_index == 0) {
                    //    如果没有优惠券
                    var text = '<span class="no-user">无可用</span>';
                    $(".select-text .chose-ele").html(text);
                    couponObj.useCouponFlag = 0;
                } else {
                    var textHtml = couponObj.data.length + "个可用";
                    $(".select-text .chose-ele").html(textHtml);
                    couponObj.quitCouponUse();
                }
                $(".pay-coupon-wrap").removeAttr("vid");
                $(".pay-coupon-wrap").removeAttr("svuId");
            } else {
                $(".pay-coupon-wrap").attr("vid", couponObj.data[_index].vid);
                $(".pay-coupon-wrap").attr("svuId", couponObj.data[_index].svuId);
                var domHtml = $(".coupon-down").find(".select-text .select-ele").eq(_index).html();
                $(".select-text .chose-ele").html(domHtml);
                // 存在最大优惠限制
                if (couponObj.data[_index].manCouponAmount) {
                    couponObj.maxCouponLimit = couponObj.data[_index].manCouponAmount;
                } else {
                    couponObj.maxCouponLimit = null;
                }
            }
            couponObj.updatePrice();
        },
        /**
         * 放弃优惠券使用
         */
        quitCouponUse: function() {
            couponObj.maxCouponLimit = null;
            couponObj.useCouponFlag = 0;
            var tips = "";
            $(".price-text-con #discountPrice").text(tips);
            couponObj.updatePrice();
        },
        /**
         * 更新价钱优惠说明提示
         */
        updatePriceTip: function() {
            var couponAmount = couponObj.getDiscountPrice();
            var oprice = couponObj.getOrderPrice();
            var tips = "";
            if (couponObj.couponType == 1) {
                // 购买vip
                var activePrice = $(".js-tab").find(".ui-tab-nav-item.active").data("activeprice");
                var activeTip = "";
                if (activePrice > 0) {
                    var activeDiscout = $(".js-tab").find(".ui-tab-nav-item.active").data("discountprice");
                    activeTip = "活动优惠" + activeDiscout + "元;";
                }
                //放弃使用优惠券
                if (couponAmount == 0) {
                    if (activePrice > 0) {
                        tips = "(" + activeTip + ")";
                    } else {
                        tips = "";
                    }
                } else {
                    // 使用优惠券
                    tips = "(" + activeTip + "使用优惠券优惠" + couponAmount + "元)";
                }
            } else {
                // 现金文档 
                var vipDiscountTip = "";
                var isVipDiscount = false;
                // if (pageConfig.params.vipDiscountFlag == 1 && pageConfig.params.ownVipDiscountFlag == 1 && pageConfig.params.g_permin == 3 && couponObj.isVip == 1) {
                //     var afterCouponPrice = ((oprice * 100 - couponAmount * 100) / 100).toFixed(2);
                //     var vipDiscount = ((afterCouponPrice * 100 - (afterCouponPrice * couponObj.fileDiscount).toFixed(2) * 100) / 100).toFixed(2);
                //     vipDiscountTip = 'VIP权益优惠' + vipDiscount + '元;'
                //     isVipDiscount = true;
                // }
                if (pageConfig.params.vipDiscountFlag == 1 && pageConfig.params.g_permin == 3 && couponObj.isVip == 1) {
                    var afterCouponPrice = ((oprice * 100 - couponAmount * 100) / 100).toFixed(2);
                    var vipDiscount = ((afterCouponPrice * 100 - (afterCouponPrice * couponObj.fileDiscount).toFixed(2) * 100) / 100).toFixed(2);
                    vipDiscountTip = "VIP权益优惠" + vipDiscount + "元;";
                    isVipDiscount = true;
                }
                if (couponAmount == 0) {
                    if (isVipDiscount) {
                        tips = "(" + vipDiscountTip + ")";
                    } else {
                        tips = "";
                    }
                } else {
                    tips = "(" + vipDiscountTip + "使用优惠券优惠" + couponAmount + "元)";
                }
            }
            if (couponObj.couponType == 0) {
                $(".price-text-con .original-text").text(tips);
            } else if (couponObj.couponType == 1) {
                $(".price-text-con #discountPrice").text(tips);
                $(".price-text-con #discountPrice").show();
            }
        },
        /**
         * 切换vip套餐
         */
        switchVipSeries: function() {
            $(".js-tab").on("click", ".ui-tab-nav-item", function(event) {
                couponObj.price = couponObj.getOrderPrice();
                // 选择框提示
                couponObj._index = 0;
                couponObj.getCouponData(1);
            });
        },
        /**
         * 更新支付价钱
         */
        updatePrice: function() {
            // couponType: 2,//0是现金文档，1是vip
            // debugger
            var discountNum;
            if (couponObj.useCouponFlag == 0) {
                // 如果flag = 0，表示不使用优惠券或者没有优惠券//
                discountNum = 0;
            } else {
                discountNum = couponObj.getDiscountPrice();
            }
            var lastedPrice = 0;
            if (couponObj.couponType == 1) {
                // vip
                var activePrice = $(".js-tab").find(".ui-tab-nav-item.active").data("activeprice");
                var oprice = $(".js-tab").find(".ui-tab-nav-item.active").data("price");
                var activeDiscout = 0;
                if (activePrice > 0) {
                    // 存在活动价格
                    activeDiscout = $(".js-tab").find(".ui-tab-nav-item.active").data("discountprice");
                }
                lastedPrice = ((oprice * 100 - discountNum * 100 - activeDiscout * 100) / 100).toFixed(2);
            } else if (couponObj.couponType == 0) {
                //现金
                var vipDiscountPrice = 0, oprice = pageConfig.params.moneyPrice;
                var params = pageConfig.params;
                // if (params.vipDiscountFlag == 1 && params.ownVipDiscountFlag == 1 && params.g_permin == 3 && couponObj.isVip == 1) {
                //     var afterCouponPrice = ((oprice * 100 - discountNum * 100) / 100).toFixed(2);
                //     var vipDiscountPrice = ((afterCouponPrice * 100 - (afterCouponPrice * couponObj.fileDiscount).toFixed(2) * 100) / 100).toFixed(2);
                // }
                if (params.vipDiscountFlag == 1 && params.g_permin == 3 && couponObj.isVip == 1) {
                    var afterCouponPrice = ((oprice * 100 - discountNum * 100) / 100).toFixed(2);
                    var vipDiscountPrice = ((afterCouponPrice * 100 - (afterCouponPrice * couponObj.fileDiscount).toFixed(2) * 100) / 100).toFixed(2);
                }
                lastedPrice = ((couponObj.price * 100 - discountNum * 100 - vipDiscountPrice * 100) / 100).toFixed(2);
            }
            if (couponObj.couponType == 1) {
                $("#activePrice").text(lastedPrice);
            } else {
                $(".price-text-con .price").text(lastedPrice);
            }
            couponObj.updatePriceTip();
        },
        /**
         * 计算优惠金额
         */
        getDiscountPrice: function() {
            //如果flag==0；不适用优惠券
            var _index = couponObj._index;
            var data = couponObj.data;
            var oprice = couponObj.price;
            var couponAmount = 0;
            if (couponObj.useCouponFlag == 0) {
                couponAmount = 0;
            } else {
                if (data[_index].type == 1) {
                    var couponAmount = data[_index].couponAmount;
                } else {
                    var discount = data[_index].discount;
                    var discountPrice = (oprice * discount * .1).toFixed(2);
                    couponAmount = ((oprice * 100 - discountPrice * 100) / 100).toFixed(2);
                }
                if (couponObj.maxCouponLimit && couponObj.maxCouponLimit <= couponAmount) {
                    couponAmount = couponObj.maxCouponLimit;
                }
            }
            return couponAmount;
        },
        /**
         * 删选大于订单金额的优惠券
         */
        delInvalidData: function(data, oprice) {
            var data = JSON.parse(JSON.stringify(data));
            var oprice = oprice ? oprice : 0;
            var invalidIndex = [];
            data.map(function(v, i) {
                if (v.couponAmount) {
                    if (v.couponAmount - oprice > 0 || v.couponAmount == oprice) {
                        invalidIndex.push(i);
                    }
                }
            });
            if (invalidIndex.length > 0) {
                for (var index = invalidIndex.length - 1; index > -1; index--) {
                    data.splice(invalidIndex[index], 1);
                }
            }
            return data;
        }
    };
    couponObj.initial();
});

define("dist/common/coupon/template/options.html", [], "{{if data.length>0}}\n    {{each data as v i}}\n    <p class=\"select-ele\">{{v.type==1?'减':'打'}}{{v.type==1?v.couponAmount:v.discount}}{{ v.type==1?'元':'折'}}<span class=\"time-text\">（{{v.timeval}}有效）</span></p>\n    {{/each}}\n    <p class=\"select-ele\"><span class=\"no-user\">不使用优惠券</span></p>\n{{/if}}");

/**
 * 发优惠券
 */
define("dist/common/coupon/couponIssue", [ "dist/cmd-lib/toast", "dist/application/method", "dist/cmd-lib/util", "dist/cmd-lib/loading", "dist/application/checkLogin", "dist/application/api", "dist/application/login", "dist/cmd-lib/jqueryMd5", "dist/common/bilog", "base64", "dist/report/config", "dist/cmd-lib/myDialog", "dist/common/bindphone", "dist/common/baidu-statistics" ], function(require, exports, module) {
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
                // url: api.vouchers,
                url: api.coupon.rightsSaleVouchers,
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
