define("dist/detail/init", [ "../common/baidu-statistics", "../application/method", "../cmd-lib/lazyload", "../cmd-lib/myDialog", "../cmd-lib/loading", "../detail/report", "../cmd-lib/util", "../detail/search", "./template/history_tmp.html", "./template/hot_search_tmp.html", "../detail/download", "../cmd-lib/toast", "../cmd-lib/gioInfo", "./common", "../application/api", "./template/pay_btn_tmp.html", "./template/pay_middle_tmp.html", "./template/pay_header.tmp.html", "../application/checkLogin", "../detail/paging", "./template/img_box.html", "./changeShowOverText", "./download", "./index", "../application/suspension", "../application/app", "../application/element", "../application/template", "../application/extend", "../common/bilog", "base64", "../report/config", "../report/init", "../report/handler", "../report/columns", "../application/helper", "//static3.iask.cn/resource/js/plugins/pc.iask.login.min", "./template/head_tip.html", "./changeDetailFooter", "../detail/expand", "../detail/index", "../detail/buyUnlogin", "../pay/qr", "../cmd-lib/qr/qrcode.min", "../cmd-lib/qr/jquery.qrcode.min", "../pay/report", "./template/buyUnlogin.html", "../detail/paradigm4", "../detail/banner", "swiper", "./template/HotSpotSearch.html" ], function(require, exports, module) {
    require("../common/baidu-statistics").initBaiduStatistics("17cdd3f409f282dc0eeb3785fcf78a66");
    require("../cmd-lib/lazyload");
    require("../cmd-lib/myDialog");
    require("../cmd-lib/loading");
    require("../detail/report");
    require("../detail/search");
    require("../detail/download");
    require("../detail/paging");
    require("../detail/expand");
    require("../detail/index");
    // require("../common/baidu-statistics");
    require("../detail/buyUnlogin");
    require("../common/bilog");
    require("../detail/paradigm4");
    require("../detail/banner");
});

// 百度统计 自定义数据上传
var _hmt = _hmt || [];

//此变量百度统计需要  需全局变量
define("dist/common/baidu-statistics", [ "dist/application/method" ], function(require, exports, moudle) {
    var method = require("dist/application/method");
    var fileParams = window.pageConfig.params;
    var eventNameList = {
        fileDetailPageView: {
            loginstatus: method.getCookie("cuk") ? 1 : 0,
            userid: window.pageConfig.userId || "",
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
            userid: window.pageConfig.userId || "",
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
        }
    };
    function handle(id) {
        if (id) {
            try {
                (function() {
                    var hm = document.createElement("script");
                    hm.src = "//hm.baidu.com/hm.js?" + id;
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
        _hmt.push([ "_trackCustomEvent", eventName, params ]);
        console.log("百度统计:", eventName, params);
    }
    return {
        initBaiduStatistics: handle,
        handleBaiduStatisticsPush: handleBaiduStatisticsPush
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

define("dist/cmd-lib/lazyload", [], function(require, exports, module) {
    //var jQuery = require("$");
    (function($, window, document, undefined) {
        var $window = $(window);
        $.fn.lazyload = function(options) {
            var elements = this;
            var $container;
            var settings = {
                threshold: 0,
                failure_limit: 0,
                event: "scroll",
                effect: "show",
                container: window,
                data_attribute: "src",
                skip_invisible: true,
                appear: null,
                load: null,
                placeholder: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAANSURBVBhXYzh8+PB/AAffA0nNPuCLAAAAAElFTkSuQmCC"
            };
            function update() {
                var counter = 0;
                elements.each(function() {
                    var $this = $(this);
                    if (settings.skip_invisible && !$this.is(":visible")) {
                        return;
                    }
                    if ($.abovethetop(this, settings) || $.leftofbegin(this, settings)) {} else if (!$.belowthefold(this, settings) && !$.rightoffold(this, settings)) {
                        $this.trigger("appear");
                        /* if we found an image we'll load, reset the counter */
                        counter = 0;
                    } else {
                        if (++counter > settings.failure_limit) {
                            return false;
                        }
                    }
                });
            }
            if (options) {
                /* Maintain BC for a couple of versions. */
                if (undefined !== options.failurelimit) {
                    options.failure_limit = options.failurelimit;
                    delete options.failurelimit;
                }
                if (undefined !== options.effectspeed) {
                    options.effect_speed = options.effectspeed;
                    delete options.effectspeed;
                }
                $.extend(settings, options);
            }
            /* Cache container as jQuery as object. */
            $container = settings.container === undefined || settings.container === window ? $window : $(settings.container);
            /* Fire one scroll event per scroll. Not one scroll event per image. */
            if (0 === settings.event.indexOf("scroll")) {
                $container.bind(settings.event, function() {
                    return update();
                });
            }
            this.each(function() {
                var self = this;
                var $self = $(self);
                self.loaded = false;
                /* If no src attribute given use data:uri. */
                if ($self.attr("src") === undefined || $self.attr("src") === false) {
                    if ($self.is("img")) {
                        $self.attr("src", settings.placeholder);
                    }
                }
                /* When appear is triggered load original image. */
                $self.one("appear", function() {
                    if (!this.loaded) {
                        if (settings.appear) {
                            var elements_left = elements.length;
                            settings.appear.call(self, elements_left, settings);
                        }
                        $("<img />").bind("load", function() {
                            var original = $self.attr("data-" + settings.data_attribute);
                            $self.hide();
                            if ($self.is("img")) {
                                $self.attr("src", original);
                            } else {
                                $self.css("background-image", "url('" + original + "')");
                            }
                            $self[settings.effect](settings.effect_speed);
                            self.loaded = true;
                            /* Remove image from array so it is not looped next time. */
                            var temp = $.grep(elements, function(element) {
                                return !element.loaded;
                            });
                            elements = $(temp);
                            if (settings.load) {
                                var elements_left = elements.length;
                                settings.load.call(self, elements_left, settings);
                            }
                        }).attr("src", $self.attr("data-" + settings.data_attribute));
                    }
                });
                /* When wanted event is triggered load original image */
                /* by triggering appear.                              */
                if (0 !== settings.event.indexOf("scroll")) {
                    $self.bind(settings.event, function() {
                        if (!self.loaded) {
                            $self.trigger("appear");
                        }
                    });
                }
            });
            /* Check if something appears when window is resized. */
            $window.bind("resize", function() {
                update();
            });
            /* With IOS5 force loading images when navigating with back button. */
            /* Non optimal workaround. */
            if (/(?:iphone|ipod|ipad).*os 5/gi.test(navigator.appVersion)) {
                $window.bind("pageshow", function(event) {
                    if (event.originalEvent && event.originalEvent.persisted) {
                        elements.each(function() {
                            $(this).trigger("appear");
                        });
                    }
                });
            }
            /* Force initial check if images should appear. */
            $(document).ready(function() {
                update();
            });
            return this;
        };
        /* Convenience methods in jQuery namespace.           */
        /* Use as  $.belowthefold(element, {threshold : 100, container : window}) */
        $.belowthefold = function(element, settings) {
            var fold;
            if (settings.container === undefined || settings.container === window) {
                fold = (window.innerHeight ? window.innerHeight : $window.height()) + $window.scrollTop();
            } else {
                fold = $(settings.container).offset().top + $(settings.container).height();
            }
            return fold <= $(element).offset().top - settings.threshold;
        };
        $.rightoffold = function(element, settings) {
            var fold;
            if (settings.container === undefined || settings.container === window) {
                fold = $window.width() + $window.scrollLeft();
            } else {
                fold = $(settings.container).offset().left + $(settings.container).width();
            }
            return fold <= $(element).offset().left - settings.threshold;
        };
        $.abovethetop = function(element, settings) {
            var fold;
            if (settings.container === undefined || settings.container === window) {
                fold = $window.scrollTop();
            } else {
                fold = $(settings.container).offset().top;
            }
            return fold >= $(element).offset().top + settings.threshold + $(element).height();
        };
        $.leftofbegin = function(element, settings) {
            var fold;
            if (settings.container === undefined || settings.container === window) {
                fold = $window.scrollLeft();
            } else {
                fold = $(settings.container).offset().left;
            }
            return fold >= $(element).offset().left + settings.threshold + $(element).width();
        };
        $.inviewport = function(element, settings) {
            return !$.rightoffold(element, settings) && !$.leftofbegin(element, settings) && !$.belowthefold(element, settings) && !$.abovethetop(element, settings);
        };
        /* Custom selectors for your convenience.   */
        /* Use as $("img:below-the-fold").something() or */
        /* $("img").filter(":below-the-fold").something() which is faster */
        $.extend($.expr[":"], {
            "below-the-fold": function(a) {
                return $.belowthefold(a, {
                    threshold: 0
                });
            },
            "above-the-top": function(a) {
                return !$.belowthefold(a, {
                    threshold: 0
                });
            },
            "right-of-screen": function(a) {
                return $.rightoffold(a, {
                    threshold: 0
                });
            },
            "left-of-screen": function(a) {
                return !$.rightoffold(a, {
                    threshold: 0
                });
            },
            "in-viewport": function(a) {
                return $.inviewport(a, {
                    threshold: 0
                });
            },
            /* Maintain BC for couple of versions. */
            "above-the-fold": function(a) {
                return !$.belowthefold(a, {
                    threshold: 0
                });
            },
            "right-of-fold": function(a) {
                return $.rightoffold(a, {
                    threshold: 0
                });
            },
            "left-of-fold": function(a) {
                return !$.rightoffold(a, {
                    threshold: 0
                });
            }
        });
    })(jQuery, window, document);
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

define("dist/detail/report", [ "dist/cmd-lib/util", "dist/application/method" ], function(require, exports, module) {
    //用户信息上报 gio
    // var $ = require("$");
    var utils = require("dist/cmd-lib/util");
    var method = require("dist/application/method");
    var payTypeMapping = [ "", "免费", "下载券", "现金", "仅供在线阅读" ];
    var userType = [ "", "普通", "个人", "机构" ];
    var infoMessage = [ "否", "是" ];
    var sourceName_var = "";
    var docSourceType_var = "";
    var docDiscount_var = "";
    //有无折扣
    var orderBuyType_var = "";
    //购买方式 -立即 或者 8折购
    var ifVIP_pvar = infoMessage[window.pageConfig.params.isVip];
    var ifLogin_pvar = infoMessage[0];
    var channelName_var = "";
    //页面类型 办公频道或者其他
    if (!method.getCookie("cuk")) {
        ifVIP_pvar = "未知";
        ifLogin_pvar = infoMessage[0];
    } else {
        ifLogin_pvar = infoMessage[1];
    }
    if (utils.is360cookie(window.pageConfig.params.g_fileId)) {
        sourceName_var = "360";
    } else {
        sourceName_var = "其他";
    }
    docPayType_var = payTypeMapping[pageConfig.params.file_state];
    if (pageConfig.page.isDownload === "n") {
        docPayType_var = "仅在线阅读";
    }
    if (pageConfig.page.fileSourceChannel) {
        docSourceType_var = pageConfig.page.fileSourceChannel + "-" + userType[pageConfig.page.userTypeId];
    }
    if (pageConfig.params.isVip == 1 && pageConfig.params.vipDiscountFlag == 1 && pageConfig.params.ownVipDiscountFlag == 1) {
        docDiscount_var = "有折扣（8折）";
        orderBuyType_var = "加入vip8折购买";
    } else {
        docDiscount_var = "无折扣";
        orderBuyType_var = "立即购买";
    }
    if (pageConfig.page.attr === "other") {
        channelName_var = "其他";
    } else if (pageConfig.page.attr === "office") {
        channelName_var = "办公频道";
    }
    //详情页初始化页面上报数据
    var gioReportInit = {
        docTypeLevel1_var: pageConfig.params.classidName1 || "",
        //文档所属的一级分类
        docTypeLevel2_var: pageConfig.params.classidName2 || "",
        //文档所属的二级分类
        docTypeLevel3_var: pageConfig.params.classidName3 || "",
        //文档所属的三级分类
        docId_var: pageConfig.params.g_fileId || "",
        //文档id
        docTitle_var: pageConfig.params.file_title || "",
        //文档标题
        docPayType_var: docPayType_var,
        //文档付费类型
        docFormType_var: pageConfig.params.file_format || "",
        //文档格式
        docSourceType_var: docSourceType_var,
        //文档来源
        channelName_var: channelName_var,
        //办公频道,其它
        ifVIP_pvar: ifVIP_pvar,
        //是否vip
        ifLogin_pvar: ifLogin_pvar,
        //是否登录
        lastEntryName_pvar: utils.findRefer(),
        //入口名称
        sourceName_var: sourceName_var
    };
    //详情页上报数据事件级  详情页 公共字段
    window.gioData = {
        docId_var: pageConfig.params.g_fileId,
        docTitle_var: pageConfig.params.file_title,
        docFormType_var: pageConfig.params.file_format,
        docSourceType_var: docSourceType_var,
        //文档来源
        docPayType_var: docPayType_var,
        //文档付费类型
        sourceName_var: sourceName_var,
        //合作渠道类型
        channelName_var: channelName_var,
        //办公频道,其它
        docTypeLevel1_var: pageConfig.params.classidName1 || "",
        docTypeLevel2_var: pageConfig.params.classidName2 || "",
        docTypeLevel3_var: pageConfig.params.classidName3 || ""
    };
    //现金文档购买gio上报数据
    window.gioPayDocReport = {
        orderId_var: "",
        //订单id
        docTypeLevel1_var: pageConfig.params.classidName1 || "",
        //文档一级分类
        docTypeLevel2_var: pageConfig.params.classidName2 || "",
        //文档二级分类
        docTypeLevel3_var: pageConfig.params.classidName3 || "",
        //文档三级分类
        docId_var: pageConfig.params.g_fileId,
        //文档id
        docTitle_var: pageConfig.params.file_title,
        //文档名称
        docPayType_var: "",
        //文档付费类型 免费 下载券 现金 vip免费 在线阅读
        docFormType_var: pageConfig.params.file_format,
        //文档格式
        docSourceType_var: docSourceType_var,
        //文档来源
        sourceName_var: sourceName_var,
        //合作渠道类型
        docPayPrice_var: pageConfig.params.moneyPrice * 100,
        //文档金额
        docDiscount_var: docDiscount_var,
        //文档折扣有折扣（8折），无折扣
        orderBuyType_var: orderBuyType_var,
        //购买方式  立即购买，加入vip8折购买
        orderPayType_var: "二维码合一",
        //支付方式
        channelName_var: channelName_var,
        //办公频道,其它
        fileUid_var: pageConfig.params.file_uid
    };
    var pageReport = $.extend({}, gioData);
    if (pageConfig.params.g_permin == "3") {
        pageReport.docPrice_var = pageConfig.params.moneyPrice * 100;
    } else {
        pageReport.docVol_var = pageConfig.params.file_volume ? pageConfig.params.file_volume * 1 : 0;
    }
    pageReport.fileUid_var = pageConfig.params.file_uid;
    if (gio) {
        //详情页 页面浏览上报-不是办公频道的
        if (pageConfig.page.attr === "office") {
            gioReportInit.officeChannel_pvar = "office";
            gioReportInit.pageType_pvar = "officeDetail";
        }
        gio("page.set", gioReportInit);
    }
    //详情页事件级上报
    __pc__.gioTrack("docDetailView", pageReport);
    //360流量上报
    if (is360cookie(pageConfig.params.g_fileId) || is360cookie("360")) {
        __pc__.gioTrack("docDetailVisitByChannel", pageReport);
    }
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

define("dist/detail/search", [], function(require, exports, module) {
    // var $ = require("$");
    var history_tmp = require("dist/detail/template/history_tmp.html");
    var hot_search_tmp = require("dist/detail/template/hot_search_tmp.html");
    var historyArr = JSON.parse(localStorage.getItem("lhistory"));
    var hotSearchData = JSON.parse(sessionStorage.getItem("hotSearch"));
    if (historyArr) {
        var _html = template.compile(history_tmp)({
            data: historyArr
        });
        $(".search-history-list").html(_html);
    }
    $("ul.search-history-list li").length > 0 ? $(".delete-history-ele").show() : $(".delete-history-ele").hide();
    //点击出现搜索页
    $(".btn-m-search").on("click", function(e) {
        e.stopPropagation();
        if (sessionStorage.getItem("hotSearch")) {
            buildHotSearchHtml(hotSearchData);
        } else {
            getHotSearch();
        }
        $("#search-bd-con").hide();
        $(".search-dialog").show();
        $("#search-input").focus();
    });
    //输入框
    $(document).on("keyup", "#search-input", function(e) {
        var keycode = e.keyCode;
        if ($(this).val()) {
            $(".btn-input-delete").show();
            $(".btn-cancel").css("color", "#f25125");
            $(".search-main:eq(0):visible").hide();
            $(".search-main:eq(1):hidden").show();
            getBaiduData($(this).val());
        } else {
            $(".search-main:eq(0):hidden").show();
            $(".search-main:eq(1):visible").hide();
            $(".btn-input-delete").hide();
            $(".btn-cancel").css("color", "#444");
        }
        if (keycode == 13) {
            searchFn();
        }
    });
    //搜索点击
    $(document).on("click", ".btn-cancel", function(e) {
        e && e.stopPropagation();
        searchFn();
    });
    //返回
    $(document).on("click", ".js_back", function(e) {
        e && e.stopPropagation();
        $(".search-dialog").hide();
        $("#search-bd-con").show();
        $("#search-input").blur();
    });
    //清空
    $(document).on("click", ".btn-input-delete", function(e) {
        $(this).hide();
        $("#search-input").val("");
    });
    //热门搜索
    $(document).on("click", "#search-hot-box", function(e) {
        var hotData = $(e.target).text();
        mergeFn(hotData);
    });
    //清空历史
    $(document).on("click", ".delete-history-ele", function(e) {
        $(this).hide();
        $(".search-dialog .search-history-list").hide();
        localStorage.removeItem("lhistory");
    });
    //单个清楚历史记录
    $(document).on("click", ".btn-delete", function(e) {
        if ($("ul.search-history-list li").length) {
            var d = $(this).data("html");
            removeTag(d);
            $(this).closest("li").remove();
        }
        $("ul.search-history-list li").length > 0 ? $(".delete-history-ele").show() : $(".delete-history-ele").hide();
    });
    $(".search-dialog .search-list").on("click", "a", function(e) {
        var val = $(this).data("html");
        if (val) {
            mergeFn(val);
        }
    });
    //搜索
    var searchFn = function() {
        var _val = $("#search-input").val();
        _val = _val ? _val.replace(/^\s+|\s+$/gm, "") : "";
        if (!_val) {
            $.toast({
                text: "搜索内容为空"
            });
            return;
        }
        mergeFn(_val);
        gotoUrl(_val);
    };
    //获取热门搜索数据
    var getHotSearch = function() {
        $.ajax(api.getHotSearch, {
            type: "get",
            async: false,
            dataType: "json"
        }).done(function(res) {
            if (res.code == 0) {
                buildHotSearchHtml(res.data);
                sessionStorage.setItem("hotSearch", JSON.stringify(res.data));
            }
        }).fail(function(e) {
            $.toast({
                text: "error",
                delay: 2e3
            });
        });
    };
    //构建热门数据
    var buildHotSearchHtml = function(d) {
        if (d) {
            var _html = template.compile(hot_search_tmp)({
                data: d
            });
            $("#search-hot-box").html(_html);
        }
    };
    //跳转
    var gotoUrl = function(sword) {
        window.location.href = "/search/home.html?ft=all&cond=" + encodeURIComponent(encodeURIComponent(sword));
    };
    //获取百度数据
    var getBaiduData = function(val) {
        $.getScript("//sp0.baidu.com/5a1Fazu8AA54nxGko9WTAnF6hhy/su?wd=" + encodeURIComponent(val) + "&p=3&cb=window.baidu_searchsug&t=" + new Date().getTime());
    };
    /*百度搜索建议回调方法*/
    window.baidu_searchsug = function(data) {
        var sword = $(".search-dialog .s-input").val();
        sword = sword ? sword.replace(/^\s+|\s+$/gm, "") : "";
        if (sword.length > 0) {
            if (data && data.s) {
                var condArr = data.s;
                if (condArr.length > 0) {
                    var max = Math.min(condArr.length, 10);
                    var _html = [];
                    for (var i = 0; i < max; i++) {
                        var searchurl = "/search/home.html?ft=all&cond=" + encodeURIComponent(encodeURIComponent(condArr[i]));
                        _html.push('<li><a href="' + searchurl + '"  data-html="' + condArr[i] + '" >' + condArr[i].replace(new RegExp("(" + sword + ")", "gm"), "<span class='search-font'>$1</span>") + "</a></li>");
                    }
                    $(".search-dialog .search-main .search-list").html(_html.join(""));
                }
            }
        }
    };
    //合并数据
    var mergeFn = function(d) {
        if (historyArr) {
            if ($.inArray(d, historyArr) === -1) {
                historyArr.unshift(d);
            }
        } else {
            historyArr = [ d ];
        }
        localStorage.setItem("lhistory", JSON.stringify(historyArr));
    };
    var removeTag = function(val) {
        var index = $.inArray(val, historyArr);
        if (index > -1) {
            historyArr.splice(index, 1);
        }
        localStorage.setItem("lhistory", JSON.stringify(historyArr));
    };
});

define("dist/detail/template/history_tmp.html", [], '{{each data as value i}}\n<li>\n    <a href="/search/home.html?cond={{encodeValue(value)}}">{{value}}</a>\n    <a href="javascript:;" class="btn-delete" data-html="{{value}}"></a>\n</li>\n{{/each}}');

define("dist/detail/template/hot_search_tmp.html", [], '{{each data as value i}}\n<a href="/search/home.html?cond={{encodeValue(value)}}">{{value}}</a>\n{{/each}}');

define("dist/detail/download", [ "dist/application/method", "dist/cmd-lib/myDialog", "dist/cmd-lib/toast", "dist/cmd-lib/loading", "dist/cmd-lib/util", "dist/cmd-lib/gioInfo", "dist/detail/common", "dist/application/api", "dist/application/checkLogin" ], function(require, exports, module) {
    // var $ = require("$");
    var method = require("dist/application/method");
    require("dist/cmd-lib/myDialog");
    require("dist/cmd-lib/toast");
    require("dist/cmd-lib/loading");
    var utils = require("dist/cmd-lib/util");
    var gioInfo = require("dist/cmd-lib/gioInfo");
    var common = require("dist/detail/common");
    var login = require("dist/application/checkLogin");
    var api = require("dist/application/api");
    var downLoadReport = $.extend({}, gioData);
    // init.js 中引入的 report中在 window上挂载了 gioData 
    var ref = utils.getPageRef(window.pageConfig.params.g_fileId);
    //用户来源
    var expendScoreNum_var = "";
    //用户下载文档成功后消耗的积分数量
    var expendNum_var = "";
    //用户下载文档成功后消耗下载券、下载特权或现金的数量
    var fid = window.pageConfig.params.g_fileId;
    // 文件id
    var tpl_android = $("#tpl-down-android").html();
    //下载app  项目全局 没有 这个 classId
    var file_title = window.pageConfig.params.file_title;
    //详情页异常信息提示弹框
    var $tpl_down_text = $("#tpl-down-text");
    // 在 详情index.html中引入的 dialog.html 用有  一些弹框模板
    // 文档已下载
    var $tpl_down_finished = $("#tpl-down-finished");
    // 是vip
    var $integral_download_vip = $("#integral-download-vip");
    // 非vip
    var $integral_download_normal = $("#integral-download-normal");
    //下载券下载 vip
    var $volume_download_vip = $("#volume-download-vip");
    //下载券下载 普通用户
    var $volume_download_normal = $("#volume-download-normal");
    var $have_privilege = $("#have_privilege");
    // vip专享下载--扣除下载特权
    var $permanent_privilege = $("#permanent_privilege");
    // 扣除下载特权--但不够扣
    var $permanent_privilege_not = $("#permanent_privilege_not");
    // vip 免费下载次数达上限提醒
    var $vipFreeDownCounts = $("#vipFreeDownCounts");
    // 非VIP 免费下载次数达上限提醒
    var $freeDownCounts = $("#freeDownCounts");
    //
    // 弹窗加入VIP
    var $download_join_vip = $("#download-join-vip");
    var userData = null;
    downLoadReport.docPageType_var = pageConfig.page.ptype;
    downLoadReport.fileUid_var = pageConfig.params.file_uid;
    //下载跳转公用
    var publicDownload = function() {
        method.delCookie("event_data_down", "/");
        if (window.pageConfig.page.isDownload === "n") {
            return;
        }
        // 文件预下载
        // filePreDownLoad: router + '/action/downloadCheck',
        method.get(api.normalFileDetail.filePreDownLoad + "?fid=" + fid, function(res) {
            if (res.code == 0) {
                //阻塞下载gio上报
                bouncedType(res);
                docDLFail(res.data.status);
            } else if (res.code == 42e3 || res.code == 42001 || res.code == 42002 || res.code == 42003) {
                $("#dialog-box").dialog({
                    html: $tpl_down_text.html().replace(/\$msg/, res.msg)
                }).open();
            } else if (res.code == 40001) {
                login.notifyLoginInterface(function(data) {
                    userData = data;
                });
            } else if (res.code == 42011) {
                method.compatibleIESkip("/pay/vip.html", true);
            } else {
                $("#dialog-box").dialog({
                    html: $tpl_down_text.html().replace(/\$msg/, res.msg)
                }).open();
            }
        }, "");
    };
    //上报数据处理-下载成功
    var docDLSuccess = function(consume, flag) {
        //消费类型
        downLoadReport.expendType_var = gioInfo.downloadConsumeMap[consume];
        //如果不是下载过添加这2个字段
        if (flag) {
            //消耗的积分数量
            downLoadReport.expendScoreNum_var = expendScoreNum_var;
            //消耗的消耗下载券数量
            downLoadReport.expendNum_var = expendNum_var;
        }
        //防止上报字段错误
        if (downLoadReport.downloadLimited_var) {
            delete downLoadReport.downloadLimited_var;
        }
        __pc__.gioTrack("docDLSuccess", downLoadReport);
    };
    //上报数据处理-下载受限
    var docDLFail = function(status) {
        if (gioInfo.downloadLimitedCodeMap[status]) {
            downLoadReport.downloadLimited_var = gioInfo.downloadLimitedCodeMap[status];
            __pc__.gioTrack("docDLFail", downLoadReport);
        }
    };
    var bouncedType = function(res) {
        //屏蔽下载的 后台返回 文件不存在需要怎么提示
        // productType		int	商品类型 1：免费文档，3 在线文档 4 vip特权文档 5 付费文档 6 私有文档
        // productPrice		long	商品价格 > 0 的只有 vip特权 个数,和 付费文档 金额 单位元
        var $dialogBox = $("#dialog-box");
        fid = window.pageConfig.params.g_fileId;
        switch (res.data.checkStatus) {
          // 下载
            case 0:
            // 原来 status 100
            var browserEnv = method.browserType();
            method.delCookie("event_data_down", "/");
            if (res.data.score > 0) {
                expendScoreNum_var = res.data.score * 1;
            } else if (res.data.volume > 0) {
                expendNum_var = res.data.volume * 1;
            } else if (window.pageConfig.params.file_volume > 0 && res.data.privilege > 0) {
                //消耗下载特权数量
                expendNum_var = 1;
            }
            docDLSuccess(res.data.consume, true);
            if (browserEnv === "IE" || browserEnv === "Edge") {
                // window.location.href = res.data.downloadURL;
                method.compatibleIESkip(res.data.fileDownUrl, false);
            } else if (browserEnv === "Firefox") {
                // window.location.href = decodeURIComponent(res.data.downloadURL);
                var fileDownUrl = res.data.fileDownUrl;
                var sub = fileDownUrl.lastIndexOf("&fn=");
                var sub_url1 = fileDownUrl.substr(0, sub + 4);
                var sub_ur2 = decodeURIComponent(fileDownUrl.substr(sub + 4, fileDownUrl.length));
                var fid = window.pageConfig.params.g_fileId;
                // window.location.href = sub_url1 + sub_ur2;
                method.compatibleIESkip(sub_url1 + sub_ur2, false);
                var url = "/node/f/downsucc.html?fid=" + fid + "&url=" + encodeURIComponent(res.data.fileDownUrl);
                goNewTab(url);
            } else {
                // window.location.href = res.data.downloadURL;
                // method.compatibleIESkip(res.data.fileDownUrl,false);
                var fid = window.pageConfig.params.g_fileId;
                var url = "/node/f/downsucc.html?fid=" + fid + "&title=" + encodeURIComponent(file_title) + "&url=" + encodeURIComponent(res.data.fileDownUrl);
                goNewTab(url);
            }
            break;

          // 已下载过    
            // case 7:
            //     downLoad(res.data.status);
            //     break;
            // 原来判断通过    
            // case 0:
            //     downLoad();
            //     break;
            // 超过了当日下载阈值,
            // 资料是付费，用户未购买
            case 8:
            // goPage(res)
            var fid = window.pageConfig.params.g_fileId;
            var format = window.pageConfig.params.file_format;
            var title = window.pageConfig.params.file_title;
            var params = "";
            var ref = utils.getPageRef(fid);
            //文件信息存入cookie方便gio上报
            method.setCookieWithExpPath("rf", JSON.stringify(gioPayDocReport), 5 * 60 * 1e3, "/");
            method.setCookieWithExp("f", JSON.stringify({
                fid: fid,
                title: title,
                format: format
            }), 5 * 60 * 1e3, "/");
            params = "?orderNo=" + fid + "&checkStatus=" + res.data.checkStatus + "&referrer=" + document.referrer;
            // window.location.href = "/pay/payConfirm.html" + params;
            method.compatibleIESkip("/pay/payConfirm.html" + params, false);
            break;

          case 1:
            // $dialogBox.dialog({
            //     html: $tpl_down_text.html().replace(/\$msg/, '您已经超过了当日下载量')
            // }).open();
            // break;
            var ui = method.getCookie("ui") ? JSON.parse(decodeURIComponent(method.getCookie("ui"))) : {
                isVip: ""
            };
            if (ui.isVip === "1") {
                $("#dialog-box").dialog({
                    html: $vipFreeDownCounts.html()
                }).open();
            } else {
                $("#dialog-box").dialog({
                    html: $freeDownCounts.html()
                }).open();
            }
            break;

          // 下载过于频繁
            case 2:
            $dialogBox.dialog({
                html: $tpl_down_text.html().replace(/\$msg/, "您当日下载过于频繁,一分钟后再下载")
            }).open();
            break;

          // 下载券不足并且积分也不足
            // case 3:
            //     var fid = window.pageConfig.params.g_fileId;
            //     var state = window.pageConfig.params.file_state;
            //     var isVip = window.pageConfig.params.isVip;
            //     var showTips = 0;
            //     if ((state == 5 || state == 6) && isVip == 0) {//专享资料 非vip用户
            //         showTips = 1;
            //     } else if (state == 2 && isVip == 0) {//下载券资料 非vip用户
            //         showTips = 2;
            //     }
            //     var format = window.pageConfig.params.file_format;
            //     var title = window.pageConfig.params.file_title;
            //     method.setCookieWithExp('f', JSON.stringify({ fid: fid, title: title, format: format }), 5 * 60 * 1000, '/');
            //     var params = '?fid=' + fid + '&ft=' + format + '&name=' + encodeURIComponent(encodeURIComponent(title)) + '&ref=' + ref + '&showTips=' + showTips;
            //     var url = '/pay/vip.html' + params;
            //     if (userData.isVip === '1') {
            //         url = '/pay/privilege.html?fid=' + fid + '&ref=' + ref;
            //     }
            //     goLocalTab(url);
            //     break;
            // 下载券不足并且积分充足  积分兑换下载
            // case 4:
            //     if (userData.isVip === '1') {
            //         $dialogBox.dialog({
            //             html: $integral_download_vip.html().replace(/\$volume/, res.data.volume)
            //                 .replace(/\$title/, pageConfig.params.file_title.substr(0, 20))
            //                 .replace(/\$fileSize/, pageConfig.params.file_size)
            //                 .replace(/\$code/, res.data.status)
            //         }).open();
            //     } else {
            //         $dialogBox.dialog({
            //             html: $integral_download_normal.html()
            //                 .replace(/\$title/, pageConfig.params.file_title.substr(0, 20))
            //                 .replace(/\$fileSize/, pageConfig.params.file_size)
            //                 .replace(/\$ovolume/, res.data.ovolume)
            //                 .replace(/\$evolume/, res.data.nvolume)
            //                 .replace(/\$code/, res.data.status)
            //         }).open();
            //     }
            //     break;
            // 下载券足够   使用下载券下载
            // case 5:
            //     if (userData.isVip === '1') {
            //         $dialogBox.dialog({
            //             html: $volume_download_vip.html()
            //                 .replace(/\$title/, pageConfig.params.file_title.substr(0, 20))
            //                 .replace(/\$fileSize/, pageConfig.params.file_size)
            //                 .replace(/\$ovolume/, res.data.ovolume)
            //                 .replace(/\$volume/, res.data.volume)
            //                 .replace(/\$code/, res.data.status)
            //         }).open();
            //     } else {
            //         $dialogBox.dialog({
            //             html: $volume_download_normal.html()
            //                 .replace(/\$title/, pageConfig.params.file_title.substr(0, 20))
            //                 .replace(/\$fileSize/, pageConfig.params.file_size)
            //                 .replace(/\$ovolume/, res.data.ovolume)
            //                 .replace(/\$volume/, res.data.volume)
            //                 .replace(/\$code/, res.data.status)
            //         }).open();
            //     }
            //     break;
            // 下载特权足够
            // case 9:
            //     $dialogBox.dialog({
            //         html: $have_privilege.html()
            //             .replace(/\$title/, pageConfig.params.file_title.substr(0, 20))
            //             .replace(/\$fileSize/, pageConfig.params.file_size)
            //             .replace(/\$privilege/, res.data.privilege)
            //             .replace(/\$code/, res.data.status)
            //     }).open();
            //     break;
            // 下载限制黑名单
            // case -1:
            //     $dialogBox.dialog({
            //         html: $tpl_down_text.html().replace(/\$msg/, '您的账号已被禁止下载，如有疑问联系平台！')
            //     }).open();
            //     break;
            // 用户不是vip不能下
            case 10:
            var fid = window.pageConfig.params.g_fileId;
            var state = window.pageConfig.params.file_state;
            var isVip = window.pageConfig.params.isVip;
            var showTips = 1;
            // if ((state == 5 || state == 6) && isVip == 0) {//专享资料 非vip用户
            //     showTips = 1;
            // }
            var format = window.pageConfig.params.file_format;
            var title = window.pageConfig.params.file_title;
            method.setCookieWithExp("f", JSON.stringify({
                fid: fid,
                title: title,
                format: format
            }), 5 * 60 * 1e3, "/");
            var params = "?fid=" + fid + "&ft=" + format + "&checkStatus=" + res.data.checkStatus + "&name=" + encodeURIComponent(encodeURIComponent(title)) + "&ref=" + ref + "&showTips=" + showTips;
            goLocalTab("/pay/vip.html" + params);
            break;

          // vip专享下载--扣除下载特权    
            // case 12:
            //     $dialogBox.dialog({
            //         html: $permanent_privilege.html()
            //             .replace(/\$title/, pageConfig.params.file_title.substr(0, 20))
            //             .replace(/\$fileSize/, pageConfig.params.file_size)
            //             .replace(/\$privilege/, res.data.privilege)
            //             .replace(/\$code/, res.data.status)
            //     }).open();
            //     break;
            // vip专享下载--扣除下载特权但不够扣    
            case 13:
            $dialogBox.dialog({
                html: $permanent_privilege_not.html().replace(/\$title/, pageConfig.params.file_title.substr(0, 20)).replace(/\$fileSize/, pageConfig.params.file_size).replace(/\$code/, res.data.status).replace(/\$privilege/, res.data.privilege).replace(/\$productPrice/, res.data.productPrice)
            }).open();
            break;

          // 在线文档不支持下载       
            case 17:
            $dialogBox.dialog({
                html: $tpl_down_text.html().replace(/\$msg/, "在线文档不支持下载")
            }).open();
            break;

          // 免费下载次数不足    
            // case 15:
            //     if (userData.isVip === '1') {
            //         $("#dialog-box").dialog({
            //             html: $vipFreeDownCounts.html(),
            //         }).open();
            //     }else {
            //         $("#dialog-box").dialog({
            //             html: $freeDownCounts.html(),
            //         }).open();
            //     }
            //     break;
            // 验证码不正确
            case 99:
            break;

          // 显示验证码
            case 98:
            break;

          // 已下载过
            default:        }
    };
    /**
     * 预下载
     */
    var preDownLoad = function() {
        //gio上报-下载按钮点击
        if (!method.getCookie("cuk")) {
            login.notifyLoginInterface(function(data) {
                userData = data;
                publicDownload();
                common.afterLogin(data);
            });
            if ($(this).attr("loginOffer")) {
                method.setCookieWithExpPath("_loginOffer", $(this).attr("loginOffer"), 1e3 * 60 * 60 * 1, "/");
            }
            method.setCookieWithExpPath("event_data_down", "down", 1e3 * 60 * 60 * 1, "/");
        } else if (method.getCookie("cuk") && !userData) {
            login.getLoginData(function(data) {
                userData = data;
                publicDownload();
                common.afterLogin(data);
            });
        } else if (method.getCookie("cuk") && userData) {
            publicDownload();
        }
        __pc__.gioTrack("docDetailDLClick", downLoadReport);
    };
    var downLoad = function() {
        // 文件下载 /action/downloadUrl?fid=文件id&code=验证码,预下载返回需要验证码
        var url = api.normalFileDetail.fileDownLoad + "?fid=" + window.pageConfig.params.g_fileId + "&code=" + (code ? code : "");
        $.ajax({
            async: false,
            type: "GET",
            url: url,
            dataType: "json",
            success: function(data) {
                bouncedType(data);
            }
        });
    };
    /**
    * 
    * 获取下载获取地址接口
    */
    var handleFileDownUrl = function() {
        if (method.getCookie("cuk")) {
            // 判断文档类型 假设是 productType = 4 vip特权文档 需要先请求预下载接口
            if (window.pageConfig.page.productType == 4) {
                $.ajax({
                    url: api.normalFileDetail.filePreDownLoad,
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
                            if (res.data.checkStatus == 0 && res.data.consumeStatus == 2) {
                                // consumeStatus == 2 用下载特权消费的
                                $dialogBox.dialog({
                                    html: $permanent_privilege.html().replace(/\$title/, pageConfig.params.file_title.substr(0, 20)).replace(/\$fileSize/, pageConfig.params.file_size).replace(/\$privilege/, res.data.privilege || 0).replace(/\$productPrice/, res.data.productPrice || 0).replace(/\$code/, res.data.status)
                                }).open();
                            } else {
                                getFileDownLoadUrl();
                            }
                        }
                    }
                });
            } else {
                getFileDownLoadUrl();
            }
        } else {
            login.notifyLoginInterface(function(data) {
                common.afterLogin(data);
                userData = data;
                handleFileDownUrl();
            });
        }
    };
    var getFileDownLoadUrl = function() {
        $.ajax({
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
                    bouncedType(res);
                }
            }
        });
    };
    /**
     * 跳转到新的tab
     * @param href
     */
    var goNewTab = function(href) {
        // var $a = $("#ishare-h-tab-a");
        // if ($a.length > 0) {
        //     $a.attr("href", href);
        // } else {
        //     var referLink = "<a id='ishare-h-tab-a' class='ishare-h-tab-a' style='display: none;' target='_blank' href='" + href + "'><p>.</p></a>";
        //     $('body').append(referLink);
        // }
        // $('#ishare-h-tab-a p').trigger('click');
        method.compatibleIESkip(href, true);
    };
    var goLocalTab = function(href) {
        // var $a = $("#ishare-h-tab-a");
        // if ($a.length > 0) {
        //     $a.attr("href", href);
        // } else {
        //     var referLink = "<a id='ishare-h-tab-a' class='ishare-h-tab-a' style='display: none;'  href='" + href + "'><p>.</p></a>";
        //     $('body').append(referLink);
        // }
        // $('#ishare-h-tab-a p').trigger('click');
        // window.open(href);
        method.compatibleIESkip(href, false);
    };
    //已经登录 并且有触发支付点击
    var downCookie = method.getCookie("event_data_down");
    if (method.getCookie("cuk") && downCookie == "down") {
        method.delCookie("event_data_down", "/");
        //唤起下载
        preDownLoad();
    }
    var $dialogBox = $("#dialog-box");
    // 弹窗下载
    $dialogBox.on("click", ".btn-dialog-download", function() {
        var code = $(this).attr("data-code");
        if (code) {
            // downLoad(code);
            //  handleFileDownUrl()
            getFileDownLoadUrl();
        }
    });
    // 跳转VIP,或者特权页面
    // $dialogBox.on('click', '.dialog-btn-joinVip', function () {
    //     var type = $(this).attr('data-type');
    //     if (type === 'vip') {
    //         goLocalTab('/pay/vip.html');
    //     } else if (type === 'privilege') {
    //         goLocalTab('/pay/privilege.html');
    //     }
    // });
    //点击预下载按钮
    $(document).on("click", '[data-toggle="download"]', function(e) {
        //  preDownLoad();
        //   debugger
        handleFileDownUrl();
    });
    //用app保存
    $(document).on("click", ".sava-app", function(e) {
        $("#dialog-box").dialog({
            html: tpl_android
        }).open();
    });
    module.exports = {
        downLoad: handleFileDownUrl
    };
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
 * @Description: gio上报文案汇总
 */
define("dist/cmd-lib/gioInfo", [], function(require, exports, module) {
    var gioInfo = {
        //下载失败受限上传文案
        downloadLimitedCodeMap: {
            "-1": "下载限制黑名单",
            "-2": "文件不存在",
            "-3": "私有文件",
            "-4": "只读",
            "1": "已超过了当日下载量",
            "2": "当日下载过于频繁",
            "3": "下载券积分不足",
            "4": "下载券不足兑换积分",
            "5": "下载券足够",
            "8": "未购买",
            "9": "下载特权足够",
            "10": "用户不是vip不能下",
            "12": "vip专享下载—扣除下载特权",
            "13": "vip专享下载—扣除下载特权但不够扣",
            "98": "显示图形验证码",
            "99": "校验图形验证码不通过"
        },
        downloadConsumeMap: {
            "1": "下载券",
            "2": "下载特权",
            "3": "积分",
            "4": "VIP免费",
            "5": "本人文件",
            "6": "现金",
            "7": "已下载过",
            "8": "免费"
        }
    };
    module.exports = gioInfo;
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

define("dist/detail/template/pay_btn_tmp.html", [], '<div class="bottom-fix qwe">\n        {{if data.productType == "3"}}\n            <!--仅在线阅读-->\n            {{if data.isVip == 1}}\n                <div class="data-item fl">\n                    <h2 class="data-title fl"><i class="ico-big-data ico-big-{{data.format}}"></i>{{data.title}}</h2>\n                    <span class="online-read">仅供在线阅读</span>\n                </div>\n                <div class="integral-con fr">\n                    <a id="searchRes" class="btn-fix-vip fl" ><i class="icon-detail"></i>寻找资料</a>\n                </div>\n\n            {{else}}\n                <div class="data-item fl">\n                    <h2 class="data-title fl"><i class="ico-big-data ico-big-{{data.format}}"></i>{{data.title}}</h2>\n                    <span class="online-read">仅供在线阅读</span>\n                </div>\n                <div class="integral-con fr">\n                    <a class="btn-fix-vip js-buy-open fl pc_click" pcTrackContent="joinVip-2" bilogContent="fileDetailBottomOpenVip8" data-type="vip">开通VIP，享更多特权</a>\n                </div>\n            {{/if}}\n        {{else}}\n            <!--VIP免费-->\n            {{if data.productType == 4}}\n                <div class="data-item fl">\n                    <h2 class="data-title fl"><i class="ico-big-data ico-big-{{data.format}}"></i>{{data.title}}</h2>\n                </div>\n                <div class="integral-con fr">\n                    <a class="btn-fix-bottom fl pc_click" pcTrackContent="downloadBtn-3" bilogContent="fileDetailBottomDown" data-toggle="download">立即下载</a>\n                </div>\n            {{else}}\n                {{if data.productType == "5" }}\n                    <!--现金文档 -->\n                    <!--专享8折 加入vip8折购买 立即下载 立即购买-->\n                      {{if data.isVip == 1 && data.vipDiscountFlag == 1 }}\n                        <div class="data-item fl">\n                            <h2 class="data-title fl">\n                                <i class="ico-big-data ico-big-{{data.format}}"></i>{{data.title}}\n                            </h2>\n                        </div>\n                        <div class="integral-con fr">\n                            {{if data.status!=2}}\n                                <div class="price-con price-more fl">\n                                     <p class="price vip-price">¥{{data.productPrice}}</p>\n                                    <p class="origin-price">原价&yen; {{data.productPrice}}</p>\n                                </div>\n                                 <a class="btn-fix-bottom js-buy-open fl pc_click" pcTrackContent="buyBtn-3" bilogContent="fileDetailBottomBuy" data-type="file">立即下载</a>\n                            {{else}}\n                                 <a class="btn-fix-bottom fl pc_click" pcTrackContent="downloadBtn-3" bilogContent="fileDetailBottomDown" data-toggle="download">立即下载</a>\n                            {{/if}}\n                        </div>\n                        <!--&& data.ownVipDiscountFlag== 1-->\n                      {{else if data.isVip == 0 && data.vipDiscountFlag == 1 }}\n                        <div class="data-item fl">\n                            <h2 class="data-title fl"><i class="ico-big-data ico-big-{{data.format}}"></i>{{data.title}}</h2>\n                        </div>\n                        <div class="integral-con fr">\n                            {{if data.status!=2}}\n                                <div class="price-con price-more fl">\n                                    <!--现金文档价格 -->\n                                    <p class="price" style="">&yen;{{data.productPrice}}</p>\n                                    <!--现金文档 有折扣 非vip会员 -->\n                                  \n                                      <p class="vip-sale-price">会员价&yen;<span class="js-original-price">{{data.productPrice}}</span></p>\n                                </div>\n                                <a class="btn-fix-bottom btn-fix-border js-buy-open fl pc_click" pcTrackContent="buyBtn-3" bilogContent="fileDetailBottomBuy" data-type="file">立即下载</a>\n                            {{else}}\n                                 <a class="btn-fix-bottom fl pc_click" pcTrackContent="downloadBtn-3" bilogContent="fileDetailBottomDown" data-toggle="download">立即下载</a>\n                            {{/if}}\n                        </div>\n                      {{else}}\n                        <div class="data-item fl">\n                            <h2 class="data-title fl">\n                                <i class="ico-big-data ico-big-{{data.format}}"></i>{{data.title}}\n                            </h2>\n                        </div>\n\n                        <div class="integral-con fr">\n                            {{if data.status!=2}}\n                                <div class="price-con fl">\n                                    <!--现金文档价格 -->\n                                     <p class="price" style="">¥{{data.productPrice}}</p>\n                                </div>\n                                <a class="btn-fix-bottom js-buy-open  fl pc_click" pcTrackContent="buyBtn-3" bilogContent="fileDetailBottomBuy" loginOffer="buyBtn-2" data-type="file">立即下载</a>\n                            {{else}}\n                                <a class="btn-fix-bottom fl pc_click" pcTrackContent="downloadBtn-3" bilogContent="fileDetailBottomDown" data-toggle="download">立即下载</a>\n                            {{/if}}\n                        </div>\n                    {{/if}}\n                {{else}}\n                    <!--vip-->\n                    {{if data.isVip == 1}}\n                            <div class="data-item fl">\n                                <h2 class="data-title fl">\n                                    <i class="ico-big-data ico-big-{{data.format}}"></i>{{data.title}}\n                                </h2>\n                            </div>\n                            <div class="integral-con fr">\n                                {{if data.volume > 0}}\n                                    <div class="price-con fl">\n                                        <p class="price">{{data.volume}}下载券</p>\n                                    </div>\n                                {{/if}}\n                                <a class="btn-fix-bottom  fl pc_click" pcTrackContent="downloadBtn-3" bilogContent="fileDetailBottomDown" data-toggle="download">立即下载</a>\n                            </div>\n                    {{else}}\n                        {{if data.volume > 0}}\n\n                            <div class="data-item fl">\n                                <h2 class="data-title fl">\n                                    <i class="ico-big-data ico-big-{{data.format}}"></i>{{data.title}}\n                                </h2>\n                            </div>\n\n                            <div class="integral-con fr">\n                                <div class="price-con fl">\n                                    <p class="price" style="">{{data.volume}}下载券</p>\n                                </div>\n                                <a class="btn-fix-bottom  fl pc_click" pcTrackContent="downloadBtn-3" bilogContent="fileDetailBottomDown" data-toggle="download" >立即下载</a>\n                            </div>\n                        {{else}}\n                            <div class="data-item fl">\n                                <h2 class="data-title fl">\n                                    <i class="ico-big-data ico-big-{{data.format}}"></i>{{data.title}}\n                                </h2>\n                            </div>\n\n                            <div class="integral-con fr">\n                                <a class="btn-fix-bottom  fl pc_click" pcTrackContent="downloadBtn-3" bilogContent="fileDetailBottomDown" data-toggle="download" >立即下载</a>\n                            </div>\n                        {{/if}}\n                    {{/if}}\n                {{/if}}\n            {{/if}}\n        {{/if}}\n</div>\n');

define("dist/detail/template/pay_middle_tmp.html", [], '{{if data.isDownload === "n"}}\n<!--仅在线阅读-->\n{{if data.isVip == 1}}\n<div class="detail-wx-wrap">\n    <p class="detail-wx-text">本资料仅支持在线阅读，VIP可扫码寻找。</p>\n    <div class="detail-wx-entry">\n        <div class="wx-entry-con">\n            <div class="wx-code-con">\n                <img src="//pic.iask.com.cn/mini/qrc_{{data.fid}}.png">\n                <p>资料小程序码</p>\n            </div>\n            <div class="entry-main">\n                <div class="wx-step-con">\n                    <p class="step-text" style="text-align: left;">使用微信“扫一扫”扫码寻找资料</p>\n                    <div class="wx-step-list cf">\n                        <div class="step-num">\n                            <p>1</p>\n                            <p class="step-num-text">打开微信</p>\n                        </div>\n                        <i class="step-arrow"></i>\n                        <div class="step-num">\n                            <p>2</p>\n                            <p class="step-num-text">扫描小程序码</p>\n                        </div>\n                        <i class="step-arrow"></i>\n                        <div class="step-num">\n                            <p>3</p>\n                            <p class="step-num-text">发布寻找信息</p>\n                        </div>\n                        <i class="step-arrow"></i>\n                        <div class="step-num">\n                            <p>4</p>\n                            <p class="step-num-text">等待寻找结果</p>\n                        </div>\n                    </div>\n                </div>\n            </div>\n        </div>\n    </div>\n</div>\n{{else}}\n<div class="btn-data-con">\n    <p>仅供在线阅读</p>\n    <div class="btn-con mt18">\n        <a class="btn-detail-vip js-buy-open pc_click" pcTrackContent="joinVip-1" bilogContent="fileDetailMiddleOpenVipPr" loginOffer="joinVip-1" data-type="vip"><i class="icon-detail"></i>开通VIP，享更多特权</a>\n    </div>\n</div>\n{{/if}}\n{{else}}\n<div class="btn-data-con direct-dowonload-01">\n    <!--VIP免费-->\n    {{if data.vipFreeFlag == 1}}\n        <div class="btn-con mt18">\n            <a class="btn-state-red pc_click" pcTrackContent=\'downloadBtn-2\' bilogContent="fileDetailMiddleDown" data-toggle="download"><i class="icon-detail"></i>立即下载</a>\n        </div>\n    {{else}}\n    {{if data.perMin == "3"}}\n    <!--现金文档 -->\n    <!--专享8折 加入vip8折购买 立即下载 立即购买-->\n    {{if data.isVip == 1 && data.vipDiscountFlag ==1 && data.ownVipDiscountFlag ==1}}\n        {{if data.status!=2}}\n            <div class="price-item">\n                <p class="price-text vip-price">&yen; {{(data.moneyPrice*1000/1250).toFixed(2)}}</p>\n                <p class="origin-price">原价&yen; {{data.moneyPrice}}</p>\n            </div>\n            <div class="btn-con mt18">\n                <a class="btn-state-red btn-buy-solid js-buy-open  pc_click"  pcTrackContent="buyBtn-2" bilogContent="fileDetailMiddleBuy" data-type="file">立即购买</a>\n            </div>\n        {{else}}\n            <div class="btn-con mt18">\n                <a class="btn-state-red btn-buy-solid pc_click" pcTrackContent=\'downloadBtn-2\' data-toggle="download" loginOffer="downloadBtn-2">立即下载</a>\n            </div>\n        {{/if}}\n\n    {{else if data.isVip == 0 && data.vipDiscountFlag == 1 && data.ownVipDiscountFlag== 1}}\n\n        {{if data.status!=2}}\n            <div class="price-item">\n                <p class="price-text">¥{{data.moneyPrice}}</p>\n                <p class="vip-sale-price">会员价&yen;{{(data.moneyPrice*1000/1250).toFixed(2)}}起</p>\n            </div>\n            <div class="btn-con mt18">\n                <a class="btn-state-red btn-buy-solid btn-buy-border js-buy-open pc_click" pcTrackContent="buyBtn-2" bilogContent="fileDetailMiddleBuy" loginOffer="buyBtn-2" data-type="file">立即购买</a>\n                <a class="btn-detail-vip js-buy-open pc_click" pcTrackContent="joinVip-1" bilogContent="fileDetailMiddleOpenVip8" loginOffer="joinVip-1" data-type="vip"><i class="icon-detail"></i>开通VIP, 8折起</a>\n            </div>\n        {{else}}\n            <div class="btn-con mt18">\n                <a class="btn-state-red btn-buy-solid pc_click" pcTrackContent=\'downloadBtn-2\' data-toggle="download" loginOffer="downloadBtn-2">立即下载</a>\n            </div>\n        {{/if}}\n\n    {{else}}\n        {{if data.status!=2}}\n            <div class="price-item">\n                <div class="price-item">\n                    <p class="price-text">&yen;{{data.moneyPrice}}</p>\n                </div>\n            </div>\n            <div class="btn-con mt18">\n                <a class="btn-state-red btn-buy-solid js-buy-open pc_click" pcTrackContent="buyBtn-2" bilogContent="fileDetailMiddleBuy" loginOffer="buyBtn-2" data-type="file">立即购买</a>\n            </div>\n        {{else}}\n            <div class="btn-con mt18">\n                <a class="btn-state-red btn-buy-solid pc_click" pcTrackContent=\'downloadBtn-2\' data-toggle="download" loginOffer="downloadBtn-2">立即下载</a>\n            </div>\n        {{/if}}\n    {{/if}}\n    {{else}}\n    <!-- 下载券下载 -->\n        {{ if data.volume >0 }}\n            <p class="ticket-num"><i class="icon-detail"></i>{{data.volume}}下载券</p>\n        {{/if}}\n        <div class="btn-con mt18">\n            <a class="btn-state-red pc_click" pcTrackContent=\'downloadBtn-2\' bilogContent="fileDetailMiddleDown" data-toggle="download"><i class="icon-detail"></i>立即下载</a>\n        </div>\n    {{/if}}\n    {{/if}}\n</div>\n{{/if}}\n\n');

define("dist/detail/template/pay_header.tmp.html", [], '{{ if data.isDownload != \'n\' }}\n    {{if data.vipFreeFlag == 1}}\n           <a class="btn-data-new pc_click" pcTrackContent="downloadBtn-0" bilogContent="fileDetailUpDown" data-toggle="download" loginOffer="downloadBtn-0">立即下载</a>\n    {{else}}\n          {{ if data.perMin == "3"}}\n                {{if data.isVip == 1 && data.vipDiscountFlag == 1 && data.ownVipDiscountFlag == 1}}\n                            {{if data.status!=2}}\n                                <a class="btn-data-new js-buy-open pc_click" pcTrackContent="buyBtn-1" bilogContent="fileDetailUpBuy" data-type="file">立即购买</a>\n                                <div class="header-price-warp header-price-more">\n                                    <p class="price vip-price">&yen; {{(data.moneyPrice*1000/1250).toFixed(2)}}</p>\n                                    <p class="origin-price">原价&yen;{{data.moneyPrice}}</p>\n                                </div>\n                            {{else}}\n                                 <a class="btn-data-new pc_click" pcTrackContent="downloadBtn-0" bilogContent="fileDetailUpDown" data-toggle="download" loginOffer="downloadBtn-0">立即下载</a>\n                            {{/if}}\n                {{else if data.isVip == 0 && data.vipDiscountFlag == 1 && data.ownVipDiscountFlag== 1}}\n                            {{if data.status!=2}}\n                                <a class="btn-data-new js-buy-open pc_click" pcTrackContent="buyBtn-1" bilogContent="fileDetailUpBuy" data-type="file">立即购买</a>\n                                <div class="header-price-warp header-price-more">\n                                    <p class="price">&yen;{{data.moneyPrice}}</p>\n                                    <p class="vip-sale-price">会员价&yen;{{(data.moneyPrice*1000/1250).toFixed(2)}}起</p>\n                                </div>\n                            {{else}}\n                                 <a class="btn-data-new pc_click" pcTrackContent="downloadBtn-0" bilogContent="fileDetailUpDown" data-toggle="download" loginOffer="downloadBtn-0">立即下载</a>\n                            {{/if}}\n                {{else}}\n                            {{if data.status!=2}}\n                                <a class="btn-data-new js-buy-open pc_click" pcTrackContent="buyBtn-1" bilogContent="fileDetailUpBuy" data-type="file">立即购买</a>\n                                <div class="header-price-warp">\n                                    <p class="price">&yen;{{data.moneyPrice}}</p>\n                                </div>\n                            {{else}}\n                                <a class="btn-data-new pc_click" pcTrackContent="downloadBtn-0" bilogContent="fileDetailUpDown" data-toggle="download" loginOffer="downloadBtn-0">立即下载</a>\n                            {{/if}}\n\n                {{/if}}\n          {{else}}\n                {{ if data.volume >0 }}\n                                <a class="btn-data-new pc_click" pcTrackContent="downloadBtn-0" bilogContent="fileDetailUpDown" data-toggle="download" loginOffer="downloadBtn-0">立即下载</a>\n                                <p class="btn-text"><span>{{data.volume}}</span>下载券</p>\n                {{else}}\n                        <a class="btn-data-new pc_click" pcTrackContent="downloadBtn-0" bilogContent="fileDetailUpDown" data-toggle="download" loginOffer="downloadBtn-0">立即下载</a>\n                {{/if}}\n          {{/if}}\n    {{/if}}\n{{/if}}');

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

define("dist/detail/paging", [ "dist/detail/changeShowOverText", "dist/detail/download", "dist/application/method", "dist/cmd-lib/myDialog", "dist/cmd-lib/toast", "dist/cmd-lib/loading", "dist/cmd-lib/util", "dist/cmd-lib/gioInfo", "dist/detail/common", "dist/application/api", "dist/application/checkLogin", "dist/detail/index", "dist/application/suspension", "dist/application/app", "dist/application/element", "dist/application/template", "dist/application/extend", "dist/common/bilog", "base64", "dist/report/config", "dist/report/init", "dist/report/handler", "dist/report/columns", "dist/application/helper", "//static3.iask.cn/resource/js/plugins/pc.iask.login.min", "dist/common/baidu-statistics", "dist/detail/changeDetailFooter" ], function(require, exports, module) {
    // var $ = require("$");
    var img_tmp = require("dist/detail/template/img_box.html");
    var changeText = require("dist/detail/changeShowOverText").changeText;
    var readMoreTextEvent = require("dist/detail/changeShowOverText").readMoreTextEvent;
    var initStyle = require("dist/detail/changeDetailFooter").initStyle;
    var loadMoreStyle = require("dist/detail/changeDetailFooter").loadMoreStyle;
    if (!window.pageConfig.imgUrl) return;
    //启始页 默认的情况
    var cPage = 2;
    var restPage = 0;
    var imgTotalPage = window.pageConfig.imgUrl.length;
    var totalPage = window.pageConfig.params.totalPage;
    //最大页数
    var ptype = window.pageConfig.params.g_fileExtension || "";
    var preRead = window.pageConfig.page.preRead || 50;
    var limitPage = Math.min(preRead, 50);
    //最大限制阅读页数
    var initReadPage = window.pageConfig.page.initReadPage;
    // 默认展示的页数
    var clientHeight = (document.documentElement.clientHeight || window.innerHeight) / 4;
    var hash = window.location.hash;
    var action = {
        goSwiper: null,
        //判断是否已经是最后一页
        isHideMore: function(pageNum) {
            // 继续阅读的逻辑修改后, 在 试读完成后 修改    show-over-text的 文案
            if (pageNum >= limitPage && limitPage < totalPage) {
                // 试读结束
                $(".show-over-text").eq(0).show();
            } else if (pageNum >= imgTotalPage) {
                $(".show-over-text").eq(1).show();
            }
        },
        //加载渲染
        drawing: function(currentPage) {
            if (imgTotalPage <= 2) return;
            $(".detail-pro-con div.article-page").eq(2).show();
            if (limitPage >= 4) {
                $(".detail-pro-con div.article-page").eq(3).show();
            }
            //加载广告
            createAd("a_6307747", "a_page_con_3");
            //保存当前渲染页面数
            var arr = [];
            var pageNum = $(".detail-pro-con div.article-page").length;
            // //如果传入当前页数少于当前已加载页数
            // if (currentPage <= pageNum) {
            //     var top = $(".detail-pro-con").find('div.article-page').eq(currentPage - 1).position().top;
            //     $('body,html').animate({scrollTop: top}, 200);
            // }
            var supportSvg = window.pageConfig.supportSvg;
            var svgFlag = window.pageConfig.svgFlag;
            if (supportSvg === "true" && svgFlag === "true") {
                ptype = "svg";
            }
            //console.log(window.pageConfig.imgUrl,'window.pageConfig.imgUrl------------')
            //每次从当前页面加一 到 最大限度页码数
            for (var i = pageNum + 1; i <= Math.min(imgTotalPage, 50, currentPage); i++) {
                cPage = i;
                var item = {
                    // imgSrc: JSON.parse(window.pageConfig.imgUrl)[i - 1],
                    imgSrc: window.pageConfig.imgUrl[i - 1],
                    noPage: i,
                    imgTotalPage: imgTotalPage,
                    totalPage: totalPage,
                    remainPage: imgTotalPage - i,
                    ptype: ptype
                };
                if (supportSvg && svgFlag) {
                    // item.svgSrc = JSON.parse(window.pageConfig.svgUrl)[i - 1];
                    item.svgSrc = window.pageConfig.svgUrl[i - 1];
                }
                arr.push(item);
            }
            //拿到数据进行渲染
            var _html = template.compile(img_tmp)({
                data: arr,
                ptype: ptype
            });
            if (ptype === "txt") {
                $(".font-detail-con").append(_html);
            } else {
                $(".ppt-pic-con").append(_html);
            }
            $("img.lazy").lazyload({
                effect: "fadeIn"
            });
            //剩余页数
            var remainPage = restPage -= 5;
            if ($(".page-text .endof-trial-reading").css("display") == "none") {
                $(".show-more-text .page-num").text(remainPage >= 0 ? remainPage : 0);
            }
            //滚动到指定位置
            if (currentPage <= imgTotalPage) {
                // var index = $('.page-input').val();
                var index = $(".page-input").text();
                var position = $(".detail-pro-con").find("div.article-page").eq(index).position();
                if (position) {
                    $("body,html").animate({
                        scrollTop: position.top
                    }, 200);
                }
            }
        },
        //判断地址是否有效
        handleHtmlExpireUrl: function() {
            var isoverdue = 0;
            var pageHtmlUrl = window.pageConfig.imgUrl[0];
            var st = pageHtmlUrl.indexOf("?Expires=");
            var ft = pageHtmlUrl.indexOf("&KID=sina");
            var strDate = parseInt(pageHtmlUrl.substring(st + 9, ft)) * 1e3;
            var sdate = +new Date(strDate);
            //有效日期
            var date = +new Date();
            //获取当前时间
            //过期
            if (sdate < date || pageHtmlUrl.indexOf("sinacloud.net") > -1) {
                isoverdue = 1;
            }
            return isoverdue;
        }
    };
    //滚动监听页数
    $(window).on("scroll", getPage);
    //总页面
    // if (totalPage <= 2) {
    //     $(".show-more-text").hide();
    //     $(".show-over-text").eq(1).show();
    //     $(".btn-read-more").hide();
    //     $(".article-mask").hide();
    // } else if (limitPage <= 2) {
    //     $(".show-more-text").hide();
    //     $(".show-over-text").eq(0).show();
    //     $(".btn-read-more").hide();
    //     $(".article-mask").hide();
    // }
    if (initReadPage > imgTotalPage) {
        changeText();
    }
    $(function() {
        //默认隐藏
        var $articlePages = $(".detail-pro-con div.article-page");
        //360
        if (hash && hash.split("#page")[1]) {
            var hashArr = hash.split("#page");
            if (hashArr.length) {
                var hashPage = Math.min(+hashArr[1], imgTotalPage, preRead);
                if (hashPage <= 2) {
                    restPage = totalPage - cPage;
                    $articlePages.eq(2).hide();
                    $articlePages.eq(3).hide();
                } else if (hashPage <= 7) {
                    restPage = totalPage - 2;
                    loadMore();
                    setTimeout(function() {
                        var top = $(".detail-pro-con").find("div.article-page").eq(hashPage - 1).offset().top;
                        $("body,html").animate({
                            scrollTop: top
                        });
                    }, 2e3);
                } else {
                    restPage = totalPage - hashPage + 5;
                    // limitPage = imgTotalPage;
                    loadMore();
                    var $font_detail_con = $(".font-detail-con");
                    var $target = $font_detail_con.length ? $font_detail_con : $(".ppt-pic-con");
                    // console.log(window.pageConfig.imgUrl,'window.pageConfig.imgUrl')
                    var src = window.pageConfig.imgUrl[hashPage - 1];
                    var supportSvg = window.pageConfig.supportSvg;
                    var svgFlag = window.pageConfig.svgFlag;
                    if (svgFlag && supportSvg) {
                        src = window.pageConfig.svgUrl[hashPage - 1];
                    }
                    $target.append(addItem(src, hashPage));
                    var $last = $(".article-page[data-num='" + hashPage + "']");
                    var imgUrl = window.pageConfig.imgUrl;
                    var startIndex = 7, subUrl = imgUrl.slice(startIndex, hashPage - 1);
                    var list = [];
                    var count = 8;
                    for (var t = 0; t < subUrl.length; t++) {
                        var item = {
                            index: count,
                            url: subUrl[t]
                        };
                        count++;
                        list.push(item);
                    }
                    var str = "";
                    for (var y = 0; y < list.length; y++) {
                        var tp = list[y];
                        str += addItemLoading("", tp.index);
                    }
                    $last.before(str);
                    setTimeout(function() {
                        $("body,html").animate({
                            scrollTop: $last.offset().top
                        });
                    }, 2e3);
                    if (parseInt(hashArr[1]) >= preRead) {
                        action.isHideMore(hashPage);
                    }
                    cPage = hashPage;
                    $(".show-more-text .page-num").text(totalPage - hashPage);
                }
            }
        } else {
            restPage = totalPage - cPage;
            $articlePages.eq(2).hide();
            $articlePages.eq(3).hide();
            initStyle();
        }
    });
    //给页面绑定滑轮滚动事件
    if (document.addEventListener) {
        //firefox
        document.addEventListener("DOMMouseScroll", scrollFunc, false);
    }
    //滚动滑轮触发scrollFunc方法 //ie 谷歌
    window.onmousewheel = document.onmousewheel = scrollFunc;
    //点击加载更多
    $(document).on("click", '[data-toggle="btnReadMore"]', function() {
        loadMore();
    });
    //点击下一页 >
    $(".page-next").on("click", function() {
        // var index = $('.page-input').val() - 0;
        var index = $(".page-input").text() - 0;
        if (limitPage === 2 && index === 2) return;
        var dataDetail = $(".data-detail");
        var drawingPage = cPage + 5 <= limitPage ? cPage + 5 : limitPage;
        if (index === 2) {
            action.drawing(drawingPage);
        }
        if (index == dataDetail.length && index < totalPage && index < limitPage) {
            action.drawing(drawingPage);
            var loadedPage = $(".detail-pro-con div.article-page").length;
            //如果已经到最后了
            if (loadedPage - limitPage >= 0) {
                action.isHideMore(loadedPage);
            }
            if (loadedPage == totalPage) {
                action.isHideMore(loadedPage);
            }
        }
        if (index < totalPage && index < limitPage) {
            var position = $(".detail-pro-con div.article-page").eq(index).offset() && $(".detail-pro-con div.article-page").eq(index).offset().top;
            if (position) {
                $("body,html").animate({
                    scrollTop: position
                }, 200);
                setTimeout(function() {
                    // $('.page-input').val(index + 1);
                    $(".page-input").text(index + 1);
                }, 100);
            }
        }
        if (dataDetail.length == limitPage && limitPage < totalPage) {
            $(".show-more-text").hide();
            $(".show-over-text").eq(0).show();
            $(".btn-read-more").hide();
            $(".article-mask").hide();
        }
        if (dataDetail.length == totalPage) {
            $(".show-more-text").hide();
            $(".show-over-text").eq(1).show();
            $(".btn-read-more").hide();
            $(".article-mask").hide();
        }
    });
    // 点击上一页 <
    $(".page-prev").on("click", function() {
        // var index = $('.page-input').val() - 0;
        var index = $(".page-input").text() - 0;
        if (index === 1) {
            return;
        }
        var position = $(".detail-pro-con div.article-page").eq(index - 2).offset().top;
        if (position) {
            $("body,html").animate({
                scrollTop: position
            }, 200);
            setTimeout(function() {
                // $('.page-input').val(index - 1);
                $(".page-input").text(index - 1);
            }, 100);
        }
    });
    //enter键盘 按下事件
    $(".page-input").keydown(function(event) {
        if (event.keyCode === 13) {
            // var index = $('.page-input').val() - 0;
            var index = $(".page-input").text() - 0;
            if (index > limitPage) {
                var $d_page_wrap = $(".d-page-wrap");
                $d_page_wrap.removeClass("hide");
                setTimeout(function() {
                    $d_page_wrap.addClass("hide");
                }, 1500);
                return;
            }
            var dataDetail = $(".data-detail");
            if (index > 0 && index <= dataDetail.length) {
                var position = $(".detail-pro-con div.article-page").eq(index - 1).offset().top;
                if (position) {
                    $("body,html").animate({
                        scrollTop: position
                    }, 200);
                }
            }
        }
    });
    //点击展开
    $(document).on("click", '[data-toggle="btnExpandMore"]', function() {
        //移除固定高度
        $(".ppt-pic-con").css("height", "auto");
        $(this).parent().remove();
        $(".js-mask").show();
        $("img.lazy").lazyload();
    });
    //点击大图预览
    $("div.detail-pro-con").delegate(".article-page", "click", function() {
        if (ptype === "txt") {
            return;
        }
        if ($("#ip-file-convertType").val() != "html") {
            $(".code-source").css("visibility", "visible");
        }
    });
    //点击隐藏大图
    $(".code-source").click(function() {
        $(".code-source").css("visibility", "hidden");
    });
    $(function() {
        var iframeId = "iframeu4078296_0";
        if ($.browser.msie && $.browser.version <= 9) {
            $("#" + iframeId).parent().hide();
        }
    });
    /* 将广告挪到广告位 */
    function createAd(adId, divId) {
        try {
            $(".hide-ad").show();
            var ad = document.getElementById(adId);
            var iframeId = "iframeu4078296_0";
            if ($.browser.msie && $.browser.version <= 9) {
                ad = document.getElementById(iframeId);
            }
            var div = document.getElementById(divId);
            if (ad) {
                ad.parentNode.removeChild(ad);
                if (div) {
                    div.appendChild(ad);
                }
            }
        } catch (e) {}
    }
    //节流函数
    function throttle(fn) {
        var canRun = true;
        // 通过闭包保存一个标记
        return function() {
            if (!canRun) return;
            // 在函数开头判断标记是否为true，不为true则return
            canRun = false;
            // 立即设置为false
            setTimeout(function() {
                // 将外部传入的函数的执行放在setTimeout中
                fn.apply(this, arguments);
                // 最后在setTimeout执行完毕后再把标记设置为true(关键)表示可以执行下一次循环了。当定时器没有执行的时候标记永远是false，在开头被return掉
                canRun = true;
            }, 0);
        };
    }
    function getPage() {
        var dataDetail = $(".data-detail");
        for (var i = 0; i < dataDetail.length; i++) {
            var elTop = dataDetail[i].getBoundingClientRect().top;
            if (clientHeight > elTop && elTop > 0) {
                // $('.page-input').val(i + 1);
                $(".page-input").text(i + 1);
                break;
            }
        }
    }
    function displayLoading(num) {
        console.log("当前传递的是第 " + num + " 项");
        num = num - 1;
        var $target = $(".detail-con").eq(num);
        if (!$target.length) {
            return false;
        }
        var ptype = window.pageConfig.params.g_fileExtension || "";
        var supportSvg = window.pageConfig.supportSvg;
        var svgFlag = window.pageConfig.svgFlag;
        var $detail = $target.find(".data-detail");
        if ($detail.length) {
            var srcArr = window.pageConfig.imgUrl;
            $detail.find(".loading").remove();
            var src = srcArr[num];
            if (svgFlag && supportSvg) {
                src = this.window.pageConfig.svgUrl[num];
                $detail.html("<embed src='" + src + "' width='100%' height='100%' type='image/svg+xml' pluginspage ='//www.adobe.com/svg/viewer/install/'/>");
            } else if (ptype === "txt") {
                $detail.html(src);
            } else {
                $detail.html("<img class='img-png lazy' width='100%' height='100%' src='" + src + "' alt=''>");
            }
        }
    }
    function loadMore(page) {
        cPage = page || cPage;
        var drawingPage = cPage + 5 <= limitPage ? cPage + 5 : limitPage;
        //加载更多开始
        action.drawing(drawingPage);
        var loadedPage = $(".detail-pro-con div.article-page").length;
        //如果已经到最后了
        if (loadedPage - limitPage >= 0) {
            action.isHideMore(loadedPage);
            if ($(".red-color").text() !== "点击可继续阅读 >") {
                readMoreTextEvent();
            }
            changeText();
        }
        if (loadedPage == totalPage) {
            action.isHideMore(loadedPage);
            if ($(".red-color").text() !== "点击可继续阅读 >") {
                readMoreTextEvent();
            }
            changeText();
        }
        loadMoreStyle();
    }
    function mouseScroll() {
        if (!hash) {
            return false;
        }
        var dataDetail = $(".data-detail");
        for (var i = 0; i < dataDetail.length; i++) {
            var elBottom = dataDetail[i].getBoundingClientRect().bottom;
            if (elBottom > clientHeight && elBottom > 0) {
                if (hash) {
                    var num = dataDetail.eq(i).closest(".article-page").attr("data-num");
                    var $loading = dataDetail.eq(i).find(".loading");
                    if (num && $loading.length) {
                        displayLoading(num);
                    }
                }
                // $('.page-input').val(i + 1);
                $(".page-input").text(i + 1);
                break;
            }
        }
    }
    function scrollFunc(e) {
        e = e || window.event;
        if (e.wheelDelta) {
            //第一步：先判断浏览器IE，谷歌滑轮事件
            if (e.wheelDelta > 0) {
                //当滑轮向上滚动时
                mouseScroll();
            }
            if (e.wheelDelta < 0) {}
        } else if (e.detail) {
            //Firefox滑轮事件
            if (e.detail < 0) {
                //当滑轮向上滚动时
                mouseScroll();
            }
            if (e.detail > 0) {}
        }
    }
    function addItem(src, num) {
        var $item = "", padding = "";
        var ptype = window.pageConfig.params.g_fileExtension || "";
        var supportSvg = window.pageConfig.supportSvg;
        var svgFlag = window.pageConfig.svgFlag;
        if (ptype === "txt") {
            $item += "<div class='detail-con first-style article-page source-link' data-num='" + num + "'>" + "<div class='detail-inner article-main'>" + "<div class='data-detail other-format-style'>" + src + "</div>" + "</div>" + "</div>";
        } else if (svgFlag && supportSvg) {
            if (ptype === "ppt") {
                padding = "ppt-format-style";
            } else {
                padding = "other-format-style";
            }
            $item += "<div class='detail-con third-style article-page source-link ' data-num='" + num + "'>" + "<div class='detail-inner article-main'>" + "<div class='data-detail " + padding + "'>" + "<embed src='" + src + "' width='100%' height='100%' type='image/svg+xml' pluginspage ='//www.adobe.com/svg/viewer/install/'/>" + "</div>" + "</div>" + "</div>";
        } else {
            if (ptype === "ppt") {
                padding = "ppt-format-style";
            } else {
                padding = "other-format-style";
            }
            $item += "<div class='detail-con second-style article-page source-link' data-num='" + num + "'>" + "<div class='detail-inner article-main'>" + "<div class='data-detail " + padding + "'>" + "<img class='img-png lazy' width='100%' height='100%' src='" + src + "' alt=''>" + "</div>" + "</div>" + "</div>";
        }
        return $item;
    }
    function addItemLoading(src, num) {
        var $item = "", padding = "";
        var ptype = window.pageConfig.params.g_fileExtension || "";
        var supportSvg = window.pageConfig.supportSvg;
        var svgFlag = window.pageConfig.svgFlag;
        if (ptype === "txt") {
            $item += "<div class='detail-con first-style article-page source-link' data-num='" + num + "'>" + "<div class='detail-inner article-main'>" + "<div class='data-detail other-format-style'>" + "<div class='loading' style='height: 800px;'></div>" + "</div>" + "</div>" + "</div>";
        } else if (svgFlag && supportSvg) {
            if (ptype === "ppt") {
                padding = "ppt-format-style";
            } else {
                padding = "other-format-style";
            }
            $item += "<div class='detail-con third-style article-page source-link ' data-num='" + num + "'>" + "<div class='detail-inner article-main'>" + "<div class='data-detail " + padding + "'>" + "<div class='loading' style='height: 800px;'></div>" + "</div>" + "</div>" + "</div>";
        } else {
            if (ptype === "ppt") {
                padding = "ppt-format-style";
            } else {
                padding = "other-format-style";
            }
            $item += "<div class='detail-con second-style article-page source-link' data-num='" + num + "'>" + "<div class='detail-inner article-main'>" + "<div class='data-detail " + padding + "'>" + "<div class='loading' style='height: 800px;'></div>" + "</div>" + "</div>" + "</div>";
        }
        return $item;
    }
});

define("dist/detail/template/img_box.html", [], '{{each data as value i}}\n{{if ptype == \'txt\'}}\n<div class="detail-con first-style  article-page source-link mt10" data-num="{{data[i].noPage}}">\n    <div class="detail-inner article-main">\n        <div class="data-detail {{if ptype == \'ppt\'}} ppt-format-style {{else}}  other-format-style  {{/if}}">\n            {{#data[i].imgSrc}}\n        </div>\n    </div>\n</div>\n{{else}}\n{{if ptype == \'svg\'}}\n{{if data[i].svgSrc}}\n<div class="detail-con third-style   article-page source-link mt10" data-num="{{data[i].noPage}}">\n    <div class="detail-inner article-main">\n        <div class="data-detail {{if ptype == \'ppt\'}} ppt-format-style {{else}}  other-format-style  {{/if}}">\n            <embed data-src="{{data[i].svgSrc}}" src="{{data[i].svgSrc}}" width="100%" height="100%"\n                type="image/svg+xml" pluginspage="//www.adobe.com/svg/viewer/install/" />\n        </div>\n    </div>\n</div>\n{{/if}}\n{{else}}\n{{if data[i].imgSrc }}\n<div class="detail-con second-style  article-page source-link mt10" data-num="{{data[i].noPage}}">\n    <div class="detail-inner article-main">\n        <div class="data-detail {{if ptype == \'ppt\'}} ppt-format-style {{else}}  other-format-style  {{/if}}">\n            <img data-src="{{data[i].imgSrc}}" src="{{data[i].imgSrc}}" alt="" class="img-png lazy"\n                style="width: 100%;height: auto">\n        </div>\n    </div>\n</div>\n{{/if}}\n{{/if}}\n{{/if}}\n{{/each}}');

define("dist/detail/changeShowOverText", [ "dist/detail/download", "dist/application/method", "dist/cmd-lib/myDialog", "dist/cmd-lib/toast", "dist/cmd-lib/loading", "dist/cmd-lib/util", "dist/cmd-lib/gioInfo", "dist/detail/common", "dist/application/api", "dist/application/checkLogin", "dist/detail/index", "dist/application/suspension", "dist/application/app", "dist/application/element", "dist/application/template", "dist/application/extend", "dist/common/bilog", "base64", "dist/report/config", "dist/report/init", "dist/report/handler", "dist/report/columns", "dist/application/helper", "//static3.iask.cn/resource/js/plugins/pc.iask.login.min", "dist/common/baidu-statistics" ], function(require, exports, module) {
    // 需要判断时候是否要登录 是否点击
    // 试读完毕后, 修改 继续阅读 按钮的文字 而且修改后 事件的逻辑 走下载逻辑
    var downLoad = require("dist/detail/download").downLoad;
    var method = require("dist/application/method");
    var login = require("dist/application/checkLogin");
    var common = require("dist/detail/common");
    var goPage = require("dist/detail/index").goPage;
    var readMore = $(".red-color");
    var pageText = $(".page-text .endof-trial-reading");
    var pageNum = $(".page-num");
    // productType		int	商品类型 1：免费文档，3 在线文档 4 vip特权文档 5 付费文档 6 私有文档
    // 是否登录  method.getCookie('cuk')
    // 是否可以下载  window.pageConfig.page.isDownload
    // productPrice		long	商品价格 > 0 的只有 vip特权 个数,和 付费文档 金额 单位分
    var productType = window.pageConfig.page.productType;
    var productPrice = window.pageConfig.page.productPrice;
    var vipDiscountFlag = window.pageConfig.params.vipDiscountFlag;
    var cuk = method.getCookie("cuk");
    var isDownload = window.pageConfig.page.isDownload;
    // 'n' 屏蔽下载
    var ui = method.getCookie("ui") ? JSON.parse(method.getCookie("ui")) : {};
    function readMoreTextEvent() {
        // 文件下载接口的返回数据
        if (method.getCookie("cuk")) {
            if (productType == 3) {
                // 发送邮箱
                if (ui.isVip == "1") {
                    sentEmail();
                } else {
                    goPage("vip");
                }
            } else {
                downLoad();
            }
        } else {
            login.notifyLoginInterface(function(data) {
                common.afterLogin(data);
            });
        }
    }
    function sentEmail() {
        // 寻找相关资料  
        $("body,html").animate({
            scrollTop: $("#littleApp").offset().top - 60
        }, 200);
        // $("#dialog-box").dialog({
        //     html: $('#search-file-box').html().replace(/\$fileId/, window.pageConfig.params.g_fileId),
        // }).open();
        $("#dialog-box").dialog({
            html: $("#reward-mission-pop").html()
        }).open();
        setTimeout(bindEventPop, 500);
        function bindEventPop() {
            console.log(6666);
            // 绑定关闭悬赏任务弹窗pop
            $(".m-reward-pop .close-btn").on("click", function() {
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
    }
    module.exports = {
        changeText: changeReadMoreText,
        readMoreTextEvent: readMoreTextEvent
    };
    // 1. 预览完成 修改文案 登录的后也要更新
    // 2 点击事件
    function changeReadMoreText(status) {
        var textContent = "";
        switch (productType) {
          case "5":
            // 付费
            if (ui.isVip == "1" && vipDiscountFlag == "1") {
                textContent = "¥" + (productPrice * .8).toFixed(2) + "获取该资料";
            } else {
                textContent = "¥" + (+productPrice).toFixed(2) + "获取该资料";
            }
            //    if(status == 2){ 
            //     textContent =  '下载到本地阅读'
            //    } 
            break;

          case "1":
            textContent = "下载到本地阅读";
            break;

          case "3":
            if (ui.isVip != "1") {
                textContent = "开通VIP寻找资料";
            } else {
                textContent = "寻找资料";
            }
            break;

          case "4":
            if (isDownload == "n") {
                textContent = "开通VIP 下载资料";
            } else {
                textContent = "下载到本地阅读";
            }
            break;

          default:        }
        readMore.text(textContent);
        pageText.show();
        if (pageNum.text() == -1) {
            pageNum.text(0);
        }
    }
});

/**
 * 详情页首页
 */
define("dist/detail/index", [ "dist/application/suspension", "dist/application/method", "dist/application/checkLogin", "dist/application/api", "dist/application/app", "dist/application/element", "dist/application/template", "dist/application/extend", "dist/common/bilog", "base64", "dist/cmd-lib/util", "dist/report/config", "dist/report/init", "dist/report/handler", "dist/report/columns", "dist/application/helper", "//static3.iask.cn/resource/js/plugins/pc.iask.login.min", "dist/detail/common", "dist/common/baidu-statistics" ], function(require, exports, module) {
    // var $ = require('$');
    require("dist/application/suspension");
    var app = require("dist/application/app");
    var api = require("dist/application/api");
    var method = require("dist/application/method");
    var utils = require("dist/cmd-lib/util");
    var login = require("dist/application/checkLogin");
    var common = require("dist/detail/common");
    var clickEvent = require("dist/common/bilog").clickEvent;
    var payTypeMapping = [ "", "免费", "下载券", "现金", "仅供在线阅读", "VIP免费", "VIP专享" ];
    var entryName_var = payTypeMapping[pageConfig.params.file_state];
    var entryType_var = window.pageConfig.params.isVip == 1 ? "续费" : "充值";
    //充值 or 续费
    var fileName = window.pageConfig.page && window.pageConfig.page.fileName;
    var handleBaiduStatisticsPush = require("dist/common/baidu-statistics").handleBaiduStatisticsPush;
    handleBaiduStatisticsPush("fileDetailPageView");
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
    }
    // 页面加载
    function pageInitShow() {
        if (method.getCookie("cuk")) {
            login.getLoginData(function(data) {
                common.afterLogin(data);
                window.pageConfig.userId = data.userId;
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
                // var originalPrice = ((params.moneyPrice * 1000) / 1250).toFixed(2);
                var originalPrice = params.moneyPrice;
                $(".js-original-price").html(originalPrice);
                // var savePrice = (params.moneyPrice - originalPrice).toFixed(2);
                var savePrice = (params.moneyPrice * .8).toFixed(2);
                $(".vip-save-money").html(savePrice);
                $(".js-original-price").html(savePrice);
            }
        }
        // 意见反馈的url
        // var url = '/feedAndComp/userFeedback?url=' + encodeURIComponent(location.href);
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
            var _val = $search_detail_input.val() || $search_detail_input.attr("placeholder");
            // if (!_val) {
            //     return
            // }
            searchFn(_val);
        });
        $(".detail-search-info").on("click", function() {
            var _val = $search_detail_input.val() || $search_detail_input.attr("placeholder");
            // if (!_val) {
            //     return
            // }
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
                    common.afterLogin(data);
                    // 登陆后判断是否第一次登陆
                    login.getUserData(function(res) {
                        if (res.loginStatus == 1 && method.getCookie("_1st_l") != res.userId) {
                            receiveCoupon(0, 2, res.userId);
                        }
                    });
                });
            }
        });
        // 优惠券发放
        if (method.getCookie("cuk")) {
            login.getUserData(function(res) {
                if (res.loginStatus == 1 && method.getCookie("_1st_l") != res.userId) {
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
            method.compatibleIESkip("/node/feedback/feedback.html" + "?url=" + location.href, true);
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
            } else {
                var fid = $(this).attr("data-fid");
                clickEvent($(this));
                // if ($(this).hasClass('btn-collect-success')) {
                //     collectFile(4)
                // } else {
                //     collectFile(3)
                // }
                //fileSaveOrupdate(fid,window.pageConfig.page.uid,$(this))
                setCollect($(this));
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
        $(".detail-fixed").on("click", "#searchRes", function() {
            // 寻找相关资料  
            $("body,html").animate({
                scrollTop: $("#littleApp").offset().top - 60
            }, 200);
            // $("#dialog-box").dialog({
            //     html: $('#search-file-box').html().replace(/\$fileId/, window.pageConfig.params.g_fileId),
            // }).open();
            $("#dialog-box").dialog({
                html: $("#reward-mission-pop").html()
            }).open();
            setTimeout(bindEventPop, 500);
        });
        //  $("#dialog-box").dialog({
        //     html: $('#reward-mission-pop').html(),
        // }).open();
        function bindEventPop() {
            console.log(6666);
            // 绑定关闭悬赏任务弹窗pop
            $(".m-reward-pop .close-btn").on("click", function() {
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
                            var headTip = require("dist/detail/template/head_tip.html");
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
        var $dFooter = $(".detail-footer");
        var fixHeight = $detailHeader.height();
        if (fixEle.length) {
            var fixTop = fixEle.offset().top - headerHeight;
        }
        $(window).scroll(function() {
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
                $(".fix-right-bannertop").hide();
                $(".fix-right-bannerbottom").hide();
                fixEle.css({
                    position: "fixed",
                    top: headerHeight,
                    "z-index": "75"
                });
            } else {
                fixEle.removeAttr("style");
                $(".fix-right-bannertop").show();
                $(".fix-right-bannerbottom").show();
            }
            //底部悬浮展示文档
            if (detailTop > fixStart) {
                $fixBar.find(".operation").hide();
                $fixBar.find(".data-item").show();
            } else {
                $fixBar.find(".operation").show();
                $fixBar.find(".data-item").hide();
            }
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
    // 新收藏或取消收藏接口
    function setCollect(_this) {
        $.ajax({
            url: api.special.setCollect,
            type: "post",
            data: JSON.stringify({
                fid: window.pageConfig.params.g_fileId,
                source: 0
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function(res) {
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
                                var showName = anonymous ? "匿名用户" : common.userData.nickName;
                                var hrefFlag = anonymous ? '<a class="user-name-con">' + showName + "</a>" : '<a href="/n/' + common.userData.userId + '.html" class="user-name-con">' + showName + "</a>";
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
        method.setCookieWithExpPath("rf", JSON.stringify(gioPayDocReport), 5 * 60 * 1e3, "/");
        method.setCookieWithExp("f", JSON.stringify({
            fid: fid,
            title: title,
            format: format
        }), 5 * 60 * 1e3, "/");
        if (type === "file") {
            // params = '?orderNo=' + fid + '&referrer=' + document.referrer;
            params = "?orderNo=" + fid + "&checkStatus=" + "8" + "&referrer=" + document.referrer;
            // window.location.href = "/pay/payConfirm.html" + params;
            method.compatibleIESkip("/pay/payConfirm.html" + params, false);
        } else if (type === "vip") {
            __pc__.gioTrack("vipRechargeEntryClick", {
                entryName_var: entryName_var,
                entryType_var: entryType_var
            });
            // var params = '?fid=' + fid + '&ft=' + format + '&name=' + encodeURIComponent(encodeURIComponent(title)) + '&ref=' + ref;
            // var params = '?fid=' + fid + '&ft=' + format +  '&checkStatus=' + '10' +'&name=' + encodeURIComponent(encodeURIComponent(title)) + '&ref=' + ref + '&showTips=' + showTips;
            var params = "?fid=" + fid + "&ft=" + format + "&checkStatus=" + "10" + "&name=" + encodeURIComponent(encodeURIComponent(title)) + "&ref=" + ref;
            // window.open("/pay/vip.html" + params);
            method.compatibleIESkip("/pay/vip.html" + params, true);
        } else if (type === "privilege") {
            // var params = '?fid=' + fid + '&ft=' + format + '&name=' + encodeURIComponent(encodeURIComponent(title)) + '&ref=' + ref;
            var params = "?fid=" + fid + "&ft=" + format + "&checkStatus=" + "13" + "&name=" + encodeURIComponent(encodeURIComponent(title)) + "&ref=" + ref;
            // window.open("/pay/privilege.html" + params);
            method.compatibleIESkip("/pay/privilege.html" + params, true);
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
        // window.location.href = "/search/home.html?ft=all&cond=" + encodeURIComponent(encodeURIComponent(sword));
        method.compatibleIESkip("/search/home.html?ft=all&cond=" + encodeURIComponent(encodeURIComponent(sword)), false);
    };
    module.exports = {
        goPage: goPage
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

define("dist/detail/template/head_tip.html", [], '<div class="info-wrap">\n    <i class="before"></i>\n    <i class="after"></i>\n    <p>{{data.prompt}}</p>\n    <div class="btn-wrap">\n        <a href="../pay/vip.html" target="_blank" class="btn-user">立即使用</a>\n        <a class="btn-no-user">暂不使用</a>\n    </div>\n</div>');

define("dist/detail/changeDetailFooter", [], function(require, exports, module) {
    var detailCon = $(".detail-reader-con").find(".detail-con:visible").length - 2;
    var docMain = $(".doc-main");
    var advertisementHeight = 112;
    var detailFooterHeight = 229;
    var guessYouLikeHeight = $(".guess-you-like-warpper").height() || 0;
    function initStyle() {
        if (detailCon <= 3) {
            // 只有3页
            $(".deatil-mr10").css("position", "relative");
            $(".detail-footer").css({
                position: "absolute",
                left: "0px",
                right: "0px",
                bottom: 113 + guessYouLikeHeight + "px",
                width: "890px"
            });
        } else {
            commStyle();
        }
    }
    function loadMoreStyle() {
        // commStyle()
        initStyle();
    }
    function commStyle() {
        $(".deatil-mr10").css("position", "relative");
        $(".detail-footer").css({
            position: "absolute",
            left: "0px",
            right: "0px",
            bottom: 0 + guessYouLikeHeight + "px",
            width: "890px"
        });
    }
    module.exports = {
        initStyle: initStyle,
        loadMoreStyle: loadMoreStyle
    };
});

define("dist/detail/expand", [], function(require, exports, module) {
    // var $ = require('$');
    //事件：全屏、退出全屏、放大、缩小-------开始---------------------------------
    $(function() {
        window.orighWidth = $(".detail-main:first").width();
        window.orighheight = $(".detail-main:first").height();
        //声明所有触发事件：全屏、退出全屏、放大、缩小
        //参数：全屏退出全屏按钮、原文中包含要全屏内容的元素、被全屏内容的最外层元素、放大缩小时页面中宽度需要相应变化的三个元素(参数)
        function zoom(enlarge, original, scaleojb, bdwrap, docmain, profile) {
            //公共变量：
            // fullscreen：标记状态，0为非全屏、1为全屏状态
            // origw：缩放前原文宽度
            // origh：缩放前原文高度
            // maxw：根据客户端屏幕大小计算出的可放大到的最大宽度
            // minw：根据客户端屏幕大小计算出的可缩小到的最小宽度
            // maxwrap：被放大缩小元素的最外层元素
            // 初始状态的被全屏内容、全屏样式名、非全屏样式名、放大按钮的当前样式名、缩小按钮的当前样式名、是否触发过放大缩小、外层元素每次缩放的像素
            var fullscreen = 0, origw, origh, maxw, minw = 220, maxwrap, copyhtml = "", csname1 = "", csname2 = "", classdec, classadd, a = 0, prevw = 134;
            //公共函数：css缩放函数
            //参数：设置缩放倍数的元素、缩放倍数、缩放元素宽度设置
            function zoomcss(objcss, multicss, hcss) {
                $(objcss).attr("style", "-webkit-transform: scale(" + multicss + ");-webkit-transform-origin: 0 0;-moz-transform: scale(" + multicss + ");-moz-transform-origin:0 0;-ms-transform: scale(" + multicss + "); -ms-transform-origin: 0 0;transform: scale(" + multicss + "); transform-origin: 0 0;").width(hcss);
                //ie9 以下版浏览器
                if (navigator.appName == "Microsoft Internet Explorer" && parseInt(navigator.appVersion.split(";")[1].replace(/[ ]/g, "").replace("MSIE", "")) < 9) {
                    $(objcss).attr("style", "zoom:" + multicss + "");
                }
            }
            //公共函数：放大缩小
            //参数：设置缩放倍数的元素、被全屏内容的最外层元素
            function bigsmall(originalbs, scaleojbbs, origwbs) {
                var multibs = ($(originalbs).width() / origwbs).toFixed(3) - .002;
                $(scaleojbbs).each(function() {
                    $(this).parent().height($(this).height() * multibs + 26);
                    //调用css缩放函数
                    zoomcss(this, multibs, origwbs);
                });
            }
            //公共函数：全屏、窗口大小变化事件时
            //参数：设置缩放倍数的元素、原文中宽度、缩放倍数、区别全屏(resizepub=0)还是窗口大小变化事件(resizepub=1)
            function zoompublic(scaleojbpub, origwpub, multipub, resizepub) {
                //$(scaleojbpub).parent().parent().parent().attr("style","position:absolute;top:0;left:0;z-index:61;margin-top:-10px;padding-bottom:50px;").width(origwpub*multipub);
                $(scaleojbpub).each(function() {
                    if (resizepub == "1") {
                        //窗口大小变化事件时，被全屏内容的外层元素设置高度，26是下边距值
                        $(this).parent().height($(this).outerHeight() * multipub + 26);
                    } else {
                        //全屏事件时，被全屏内容的外层元素设置高度
                        $(this).parent().height($(this).outerHeight() + 26);
                    }
                    //调用css缩放函数
                    zoomcss(this, multipub, origwpub);
                });
            }
            //公共函数：键盘ESC、页面退出全屏 两种方式触发退出全屏
            //参数：全屏退出全屏对象、退出全屏样式名、全屏样式名、原文中包含要全屏内容的元素、被全屏内容的最外层元素、设置缩放倍数的元素、初始状态的被全屏内容的高度
            //        function zoomout(thisout,csname2out,csname1out,originalout,scaleojbout,copyhtmlout){
            //            thisout.removeClass(csname2out).addClass(csname1out).html("<i class="+"icon"+"></i>全屏");
            //            $(originalout).append(copyhtmlout).height("auto");
            ////            $(originalout).append($(original)).height("auto");
            //            $(scaleojbout).parent().parent().parent().attr("style","position:static;").width("auto");
            //            $(scaleojbout).each(function(){
            //                $(this).parent().height("auto");
            //                //调用css缩放函数
            //                zoomcss(this,1,"auto");
            //                $(this).parent().parent().attr("style","position:static;");
            //            });
            //            $("."+$(scaleojbout).parent().parent().parent().attr("class")+":last").remove();
            //        }
            origw = $(original).width();
            //初始状态的被全屏内容的宽度
            origh = $(original).height();
            //初始状态的被全屏内容的高度
            classdec = $(".zoom-decrease").attr("class");
            classadd = $(".zoom-add").attr("class");
            //放大缩小的倍数
            var multi = ($(window).width() / origw).toFixed(3) - .002;
            //判断客户端屏幕是否比页面宽度大，才可以执行放大操作
            if (window.screen.width > $(bdwrap).width()) {
                maxw = window.screen.width - 50;
                maxwrap = $(bdwrap).width();
            }
            //事件：全屏、退出全屏
            function scallOrigin(enlarge) {
                //如果当前对象含退出全屏样式名，执行退出全屏事件，fullscreen=0 标记非全屏状态
                fullscreen = 0;
                $(".detail-con").css("background-color", "#fff");
                $(".ppt-pic-con").css("background", "#fff");
                $(".pw-detail").css("width", "1213px");
                $(".detail-footer").show();
                $(".deatil-mr10").css("position", "relative");
                $(".detail-topbanner").show();
                $(".fixed-right-full").show();
                $(enlarge).removeClass("reader-fullScreen-no").addClass("reader-fullScreen");
                // $(".reader-fullScreen-no").removeClass("reader-fullScreen-no").addClass("reader-fullScreen");
                //$(".operation .reader-fullScreen-no").removeClass("reader-fullScreen-no").addClass("reader-fullScreen");
                $(".zoom-decrease").removeClass("zoom-decrease-no");
                $(".zoom-add").removeClass("zoom-add-no");
                $(".detail-main").removeClass("detail-main-full");
                $(".new-detail-header").show();
                $(".detail-fixed").removeClass("detail-fixed-full");
                $(enlarge).attr("title", "全屏浏览");
                $(".detail-inner,.detail-profile,.detail-main,.bd-wrap,.doc-main-br,.detail-con,.doc-main").removeAttr("style");
            }
            $(enlarge).on("click", function() {
                //先恢复原始
                $(".detail-inner,.detail-profile,.detail-main,.bd-wrap,.doc-main-br,.detail-con,.doc-main").removeAttr("style");
                //        	$(".detail-inner").css({"width":"793px","min-height":"800px"});
                if ($(this).hasClass("reader-fullScreen")) {
                    //如果当前对象含全屏样式名，执行全屏事件，fullscreen=1 标记全屏状态
                    fullscreen = 1;
                    $(this).removeClass("reader-fullScreen").addClass("reader-fullScreen-no");
                    $(".reader-fullScreen").removeClass("reader-fullScreen").addClass("reader-fullScreen-no");
                    //$(".operation .reader-fullScreen").removeClass("reader-fullScreen").addClass("reader-fullScreen-no");
                    $(".zoom-decrease").addClass("zoom-decrease-no");
                    $(".zoom-add").addClass("zoom-add-no");
                    $(".detail-main").addClass("detail-main-full");
                    var fwidth = $(".detail-main").width();
                    // var scale = (fwidth / window.orighWidth).toFixed(3);
                    var scale = 1;
                    $(".detail-con").css("background-color", "#333");
                    $(".ppt-pic-con").css("background", "#333");
                    $(".detail-footer").hide();
                    $(".deatil-mr10").css("position", "static");
                    $(".detail-topbanner").hide();
                    $(".pw-detail").css("width", "890px");
                    $(".detail-inner").css({
                        "-webkit-transform": "scale(" + scale + ")",
                        "-webkit-transform-origin": "0 0",
                        "-moz-transform": "scale(" + scale + ")",
                        "-moz-transform-origin": "0 0",
                        transform: "scale(" + scale + ")",
                        "-ms-transform-origin": "0 0",
                        "-ms-transform": "scale(" + scale + ")",
                        "transform-origin": "0 0"
                    }).parent(".detail-con").height($(".detail-inner").height() * scale);
                    if (navigator.appName == "Microsoft Internet Explorer" && parseInt(navigator.appVersion.split(";")[1].replace(/[ ]/g, "").replace("MSIE", "")) < 9) {
                        $(".detail-inner").css({
                            zoom: scale
                        }).parent(".detail-con").height($(".detail-inner").height() * scale);
                    }
                    $(".new-detail-header").hide();
                    $(".detail-fixed").addClass("detail-fixed-full");
                    $(".fixed-right-full").hide();
                    $(enlarge).attr("title", "退出全屏");
                } else {
                    //如果当前对象含退出全屏样式名，执行退出全屏事件，fullscreen=0 标记非全屏状态
                    scallOrigin(enlarge);
                }
                $(window).resize();
            });
            //事件：键盘ESC键退出全屏
            $(document).keydown(function(e) {
                if (e.which === 27) {
                    //调用公共函数
                    //                zoomout($("." + csname2), csname2, csname1, original, scaleojb, copyhtml, origh);
                    if ($(".reader-fullScreen-no").size() > 0) {
                        scallOrigin(enlarge);
                    }
                }
            });
            //事件：窗口大小变化
            $(window).resize(function() {
                if ($(original).html() == "") {
                    multi = ($(window).width() / origw).toFixed(3) - .002;
                    if (multi > 1) {
                        //调用公共函数
                        zoompublic(scaleojb, origw, multi, "1");
                    }
                }
            });
            //事件：放大
            $(".zoom-add").click(function() {
                if (fullscreen == 0) {
                    $(".zoom-decrease").removeClass("zoom-decrease-no");
                    classdec = $(".zoom-decrease").attr("class");
                    if ($(original).width() < $(docmain).width()) {
                        $(original).width($(original).width() + prevw);
                    } else if ($(bdwrap).width() < maxw) {
                        $(bdwrap).width($(bdwrap).width() + prevw);
                        $(docmain).width($(docmain).width() + prevw);
                        $(original).width("");
                        $(original).prev().width("");
                    }
                    bigsmall(original, scaleojb, origw);
                    if ($(bdwrap).width() == maxw) {
                        $(this).addClass("zoom-add-no");
                        classadd = $(".zoom-add").attr("class");
                        return false;
                    } else {
                        bigsmall(original, scaleojb, origw);
                        a = 1;
                    }
                    $(".doc-main-br").width($(docmain).width());
                }
            });
            //事件：缩小
            $(".zoom-decrease").click(function() {
                if ($(original).width() > minw && fullscreen == 0) {
                    $(profile).width($(profile).width() - prevw);
                    $(original).width($(original).width() - prevw);
                    $(".zoom-add").removeClass("zoom-add-no");
                    if ($(bdwrap).width() > maxwrap) {
                        $(bdwrap).width($(bdwrap).width() - prevw);
                        $(docmain).width($(docmain).width() - prevw);
                    }
                    bigsmall(original, scaleojb, origw);
                    classadd = $(".zoom-add").attr("class");
                    a = 1;
                    $(".doc-main-br").width($(docmain).width());
                }
                if ($(original).width() == minw && fullscreen == 0) {
                    $(this).addClass("zoom-decrease-no");
                    classdec = $(".zoom-decrease").attr("class");
                    return false;
                }
            });
        }
        //执行所有触发事件：全屏、退出全屏、放大、缩小
        zoom(".reader-fullScreen,.reader-fullScreen-no", ".detail-main", ".detail-inner", ".bd-wrap", ".doc-main", ".detail-profile");
    });
});

define("dist/detail/buyUnlogin", [ "dist/cmd-lib/util", "dist/application/method", "dist/pay/qr", "dist/cmd-lib/qr/qrcode.min", "dist/cmd-lib/qr/jquery.qrcode.min", "dist/pay/report", "dist/cmd-lib/gioInfo", "dist/common/bilog", "base64", "dist/report/config" ], function(require, exports, module) {
    // var $ = require("$");
    var utils = require("dist/cmd-lib/util");
    var method = require("dist/application/method");
    var qr = require("dist/pay/qr");
    var report = require("dist/pay/report");
    var downLoadReport = $.extend({}, gioData);
    var gioInfo = require("dist/cmd-lib/gioInfo");
    var viewExposure = require("dist/common/bilog").viewExposure;
    downLoadReport.docPageType_var = pageConfig.page.ptype;
    downLoadReport.fileUid_var = pageConfig.params.file_uid;
    var fileName = pageConfig.page.fileName;
    var format = pageConfig.params.file_format;
    var unloginObj = {
        count: 0,
        isClear: false,
        //是否清除支付查询
        init: function() {
            this.bindClick();
        },
        bindClick: function() {
            //切换购买方式（游客购买或登陆购买）
            $("body").on("click", ".buyUnloginWrap .navItem", function() {
                $(this).addClass("active").siblings().removeClass("active");
                var _index = $(this).index();
                $(".optionsContent").hide();
                $(".optionsContent").eq(_index).show();
            });
            //勾选条款
            $("body").on("click", ".buyUnloginWrap .selectIcon", function() {
                $(this).toggleClass("selected");
                $(".qrShadow").toggle();
                $(".riskTip").toggle();
            });
            //关闭
            $("body").on("click", ".buyUnloginWrap .closeIcon", function() {
                unloginObj.closeLoginWindon();
            });
            //失败重新生产订单
            $("body").on("click", ".buyUnloginWrap .failTip", function() {
                unloginObj.createOrder();
                unloginObj.count = 0;
            });
            //弹出未登录购买弹窗
            var unloginBuyHtml = require("dist/detail/template/buyUnlogin.html");
            unloginBuyHtml += '<div  class="aiwen_login_model_div" style="width:100%; height:100%; position:fixed; top:0; left:0; z-index:1999;background:#000; filter:alpha(opacity=80); -moz-opacity:0.8; -khtml-opacity: 0.8; opacity:0.8;display: block"></div>';
            $("body").on("click", ".js-buy-open", function(e) {
                unloginObj.isClear = false;
                if (!method.getCookie("cuk")) {
                    if (pageConfig.params.productType == 5 && $(this).data("type") == "file") {
                        //pageConfig.params.g_permin == 3 && $(this).data('type') == "file"
                        downLoadReport.expendType_var = "现金";
                        // 如果现金文档，弹出面登陆购买
                        $("body").append(unloginBuyHtml);
                        viewExposure($(this), "noLgFPayCon");
                        var loginUrl = "";
                        var params = window.pageConfig && window.pageConfig.params ? window.pageConfig.params : null;
                        var classid1 = params && params.classid1 ? params.classid1 + "" : "";
                        var classid2 = params && params.classid2 ? "-" + params.classid2 + "" : "";
                        var classid3 = params && params.classid3 ? "-" + params.classid3 + "" : "";
                        var clsId = classid1 + classid2 + classid3;
                        var fid = params ? params.g_fileId || "" : "";
                        require.async([ "//static3.iask.cn/resource/js/plugins/pc.iask.login.min.js" ], function() {
                            loginUrl = $.loginPop("login", {
                                terminal: "PC",
                                businessSys: "ishare",
                                domain: document.domain,
                                popup: "hidden",
                                clsId: clsId,
                                fid: fid
                            });
                            var loginDom = '<iframe src="' + loginUrl + '" style="width:100%;height:480px" name="iframe_a"  frameborder="no" border="0" marginwidth="0" marginheight="0" scrolling="no" allowtransparency="yes"></iframe>';
                            $(".loginFrameWrap").html(loginDom);
                        });
                        var className = "ico-" + pageConfig.params.file_format;
                        $(".buyUnloginWrap .ico-data").addClass(className);
                        $(".papper-title span").text(pageConfig.params.file_title);
                        $(".shouldPayWrap span").text(pageConfig.params.price);
                        unloginObj.createOrder();
                    }
                }
            });
        },
        createOrder: function() {
            var visitorId = "";
            if (!method.getCookie("visitorId")) {
                visitorId = unloginObj.getVisitorId();
            } else {
                visitorId = method.getCookie("visitorId");
            }
            var params = {
                fid: pageConfig.params.g_fileId,
                goodsId: pageConfig.params.g_fileId,
                goodsType: 1,
                ref: utils.getPageRef(window.pageConfig.params.g_fileId),
                referrer: pageConfig.params.referrer,
                remark: "other",
                sourceMode: 0,
                channelSource: 4,
                host: location.origin,
                channel: "other",
                isVisitor: 1,
                visitorId: visitorId,
                isVouchers: 1,
                returnPayment: false
            };
            $.post("/pay/orderUnlogin?ts=" + new Date().getTime(), params, function(data, status) {
                if (data && data.code == "0") {
                    // 生成二维码
                    unloginObj.createdQrCode(data.data.orderNo);
                    // 订单详情赋值
                    $(".shouldPayWrap span").text(data.data.payPrice / 100);
                    gioPayDocReport.orderId_var = data.data.orderNo;
                    gioPayDocReport.buyer_uid = visitorId;
                    gioPayDocReport.login_flag = "游客";
                    unloginObj.payStatus(data.data.orderNo, visitorId);
                    // 重新生成隐藏遮罩
                    $(".qrShadow").hide();
                    $(".shadowTip").hide();
                } else {
                    $(".qrShadow").show();
                    $(".failTip").show();
                }
            });
        },
        createdQrCode: function(oid) {
            var url = location.protocol + "//" + location.hostname + "/notm/qr?oid=" + oid;
            console.log(url);
            try {
                qr.createQrCode(url, "payQrCode", 162, 162);
            } catch (e) {}
        },
        /**
         * 根据时间产生随机数
         */
        getVisitorId: function() {
            var Num = "";
            for (var i = 0; i < 6; i++) {
                Num += Math.floor(Math.random() * 10);
            }
            var time = "visitorId" + new Date().getTime() + Num;
            method.setCookieWithExpPath("visitorId", time, 30 * 24 * 60 * 60 * 1e3, "/");
            return time;
        },
        /**
        * 查询订单
        * orderNo 订单
        * visitorId 游客唯一id
        * isClear 是否停止
        */
        payStatus: function(orderNo, visitorId) {
            var params = {
                orderNo: orderNo
            };
            params = JSON.stringify(params);
            $.ajax({
                type: "post",
                url: "/pay/orderStatusUlogin?ts=" + new Date().getTime(),
                contentType: "application/json;charset=utf-8",
                data: params,
                success: function(data) {
                    if (data && data.code == 0) {
                        unloginObj.count++;
                        var orderStatus = data.data;
                        var fid = pageConfig.params.g_fileId;
                        if (orderStatus == 0) {
                            //待支付 
                            if (unloginObj.count <= 30 && !unloginObj.isClear) {
                                window.setTimeout(function() {
                                    unloginObj.payStatus(orderNo, visitorId);
                                }, 3e3);
                            }
                            if (unloginObj.count > 28) {
                                $(".qrShadow").show();
                                $(".failTip").show();
                            }
                        } else if (orderStatus == 2) {
                            //成功
                            try {
                                report.docPaySuccess(gioPayDocReport);
                                //GIO购买上报
                                __pc__.gioTrack("docDLSuccess", downLoadReport);
                                //GIO下载上报
                                unloginObj.closeLoginWindon();
                                var url = "/node/f/downsucc.html?fid=" + fid + "&unloginFlag=1&name=" + fileName.slice(0, 20) + "&format=" + format + "&visitorId=" + visitorId;
                                method.compatibleIESkip(url, false);
                            } catch (e) {}
                        } else {}
                    } else {
                        $.toast({
                            text: data.msg
                        });
                        unloginObj.closeLoginWindon();
                    }
                },
                complete: function() {}
            });
        },
        /**
        * 关闭弹窗
        */
        closeLoginWindon: function() {
            $(".buyUnloginWrap").remove();
            $(".aiwen_login_model_div").remove();
            // 停止支付查询
            unloginObj.isClear = true;
            unloginObj.count = 0;
        }
    };
    unloginObj.init();
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

define("dist/pay/report", [], function(require, exports, module) {
    //gio支付页上报数据
    return {
        //gio上报-vip立即支付
        vipPayClick: function(reportVipData) {
            __pc__.gioTrack("vipRechargePayClick", reportVipData);
        },
        //gio上报-购买vip成功
        vipPaySuccess: function(reportVipData) {
            __pc__.gioTrack("vipRechargePaySuccess", reportVipData);
        },
        //gio上报-下载特权立即支付
        privilegePayClick: function(reportPrivilegeData) {
            __pc__.gioTrack("privilegeRechargePayClick", reportPrivilegeData);
        },
        //gio上报-购买特权成功
        privilegePaySuccess: function(reportPrivilegeData) {
            __pc__.gioTrack("privilegeRechargePaySuccess", reportPrivilegeData);
        },
        //gio上报-文件购买立即支付
        filePayClick: function(gioPayDocReport) {
            __pc__.gioTrack("docBuyPagePayClick", gioPayDocReport);
        },
        //gio上报-购买文档成功
        docPaySuccess: function(reportFileData) {
            __pc__.gioTrack("docPaySuccess", reportFileData);
        }
    };
});

define("dist/detail/template/buyUnlogin.html", [], '<div class="buyUnloginWrap">\n    <div class="switchNav">\n        <div class="navItem fl active">游客购买</div>\n        <div class="navItem fr">登录购买</div>\n        <div class="closeIcon"></div>\n    </div>\n    <div class="optionsContent">\n        <h2 class="papper-title">\n            <i class="ico-data "></i><span></span>\n        </h2>\n        <p class="shouldPayWrap">\n            应付金额: <span></span>元\n        </p>\n        <div class="qrcodeWrap">\n            <div id="payQrCode"></div>\n            <div class="qrShadow" style="display: none;">  \n            </div>\n            <p class="shadowTip riskTip" style="display: none;">请先阅读 <br>下载风险提示</p>\n            <p class="shadowTip failTip" style="display: none;">失败或失效 <br>请点击重新生成</p>\n        </div>\n        <p class="payTip">请使用微信或支付宝扫码支付</p>\n        <div class="payTypeWrap">\n           <img src="../../../../images/new_detail/payTypelogo.png" alt="">\n        </div>\n        <div class="downTerm">\n            <i class="selectIcon"></i>\n            我已阅读并接受<a style="text-decoration: underline;" target="_blank" href="//iask.sina.com.cn/helpCenter/5d8de2c0474e311ca8200e99.html">《下载风险提示》</a>\n        </div>\n        <div class="bottomTip">\n            <!-- 注：如你购买过该资料，下载未成功或需要重复下载，请联系客服. -->\n            注：如您已经购买过该文档，下载未成功或需要重复下载请<a style="color: #3C69A7;text-decoration: underline;" target="_blank" href="/node/queryOrder">点击此处</a>\n        </div>\n    </div>\n    <div class="optionsContent loginFrameWrap" style="display: none">\n\n    </div>\n</div>');

/**
 * 第四范式操作数据上报
 */
define("dist/detail/paradigm4", [ "dist/common/bilog", "base64", "dist/cmd-lib/util", "dist/application/method", "dist/report/config" ], function(require, exports, module) {
    var clickEvent = require("dist/common/bilog").clickEvent;
    if (window.paradigm4.paradigm4Guess || window.paradigm4.paradigm4Relevant) {
        setTimeout(function() {
            action();
        });
    }
    // 行为上报方法
    function action() {
        var clientToken = "689a073a474249da8a7e7c04a3d7c7eb";
        var date = new Date();
        var year = date.getFullYear();
        var mon = date.getMonth() + 1;
        var month = mon > 9 ? mon : "0" + mon;
        var day = date.getDate() > 9 ? date.getDate() : "0" + date.getDate();
        var time = date.toTimeString().split("GMT")[0].trim();
        var dateParams = year + "-" + month + "-" + day + " " + time;
        var paradigm4 = window.paradigm4 || {};
        var paradigm4Guess = paradigm4.paradigm4Guess || [];
        var requestID_rele = paradigm4.requestID_rele || "";
        var requestID_guess = paradigm4.requestID_guess || "";
        var paradigm4Relevant = paradigm4.paradigm4Relevant || [];
        var recommendInfoData_rele = paradigm4.recommendInfoData_rele || {};
        var recommendInfoData_guess = paradigm4.recommendInfoData_guess || {};
        var sceneIDRelevant = recommendInfoData_rele.useId || "";
        var sceneIDGuess = recommendInfoData_guess.useId || "";
        var userId = paradigm4.userId;
        // 相关推荐
        var actionsRelevant = [];
        if (paradigm4Relevant != "null" && paradigm4Relevant) {
            paradigm4Relevant.forEach(function(item) {
                actionsRelevant.push({
                    itemId: item.item_id,
                    actionTime: date.getTime(),
                    action: "show",
                    itemSetId: recommendInfoData_rele.materialId || "",
                    sceneId: sceneIDRelevant,
                    userId: userId,
                    context: item.context,
                    requestId: requestID_rele
                });
            });
        }
        // 猜你喜欢
        var actionsGuess = [];
        if (paradigm4Guess != "null" && paradigm4Guess) {
            paradigm4Guess.forEach(function(item) {
                actionsGuess.push({
                    itemId: item.item_id,
                    actionTime: date.getTime(),
                    action: "show",
                    itemSetId: recommendInfoData_guess.materialId || "",
                    sceneId: sceneIDGuess,
                    userId: userId,
                    context: item.context,
                    requestId: requestID_guess
                });
            });
        }
        var data = JSON.stringify({
            date: dateParams,
            actions: [].concat(actionsRelevant, actionsGuess)
        });
        $.post("https://nbrecsys.4paradigm.com/action/api/log?clientToken=" + clientToken, data, function(data) {});
        //猜你喜欢点击
        $(".guessyoulike").find(".item").click(function() {
            var itemId = $(this).data("id") || "";
            clickEvent($(this));
            var context = "";
            for (var i = 0; i < paradigm4Guess.length; i++) {
                if (paradigm4Guess[i].item_id == itemId) {
                    context = paradigm4Guess[i].context;
                    break;
                }
            }
            var date = new Date();
            var time = date.toTimeString().split("GMT")[0].trim();
            var dateParams = year + "-" + month + "-" + day + " " + time;
            var guessyoulikeData = JSON.stringify({
                date: dateParams,
                actions: [ {
                    itemId: itemId,
                    actionTime: date.getTime(),
                    action: "detailPageShow",
                    itemSetId: recommendInfoData_guess.materialId || "",
                    sceneId: sceneIDGuess,
                    userId: userId,
                    context: context,
                    requestId: requestID_guess
                } ]
            });
            $.post("https://nbrecsys.4paradigm.com/action/api/log?clientToken=" + clientToken, guessyoulikeData, function(data) {});
        });
        //相关推荐点击
        $(".related-data-list").find("li").click(function() {
            var itemId = $(this).data("id") || "";
            clickEvent($(this));
            var context = "";
            for (var i = 0; i < paradigm4Relevant.length; i++) {
                if (paradigm4Relevant[i].item_id == itemId) {
                    context = paradigm4Relevant[i].context;
                    break;
                }
            }
            var date = new Date();
            var time = date.toTimeString().split("GMT")[0].trim();
            var dateParams = year + "-" + month + "-" + day + " " + time;
            var paradigm4RelevantData = JSON.stringify({
                date: dateParams,
                actions: [ {
                    itemId: itemId,
                    actionTime: date.getTime(),
                    action: "detailPageShow",
                    itemSetId: recommendInfoData_rele.materialId || "",
                    sceneId: sceneIDRelevant,
                    userId: userId,
                    context: context,
                    requestId: requestID_rele
                } ]
            });
            $.post("https://nbrecsys.4paradigm.com/action/api/log?clientToken=" + clientToken, paradigm4RelevantData, function(data) {});
        });
    }
});

define("dist/detail/banner", [ "swiper", "dist/application/method", "dist/application/api" ], function(require, exports, module) {
    require("swiper");
    var method = require("dist/application/method");
    var api = require("dist/application/api");
    var HotSpotSearch = require("dist/detail/template/HotSpotSearch.html");
    new Swiper(".swiper-top-container", {
        direction: "horizontal",
        loop: $(".swiper-top-container .swiper-slide").length > 1 ? true : false,
        autoplay: 3e3
    });
    $(".close-swiper").on("click", function(e) {
        e.stopPropagation();
        $(".detail-topbanner").hide();
        method.setCookieWithExpPath("isHideDetailTopbanner", 1);
    });
    // 左侧顶部的 banner 
    new Swiper(".fix-right-swiperbannertop", {
        direction: "horizontal",
        loop: $(".fix-right-swiperbannertop .swiper-slide").length > 1 ? true : false,
        autoplay: 3e3
    });
    // 左侧底部banner
    new Swiper(".fix-right-swiperbannerbottom", {
        direction: "horizontal",
        loop: $(".fix-right-swiperbannerbottom .swiper-slide").length > 1 ? true : false,
        autoplay: 3e3
    });
    // title底部banner
    new Swiper(".swiper-titlebottom-container", {
        direction: "horizontal",
        loop: $(".swiper-titlebottom-container .swiper-slide").length > 1 ? true : false,
        autoplay: 3e3
    });
    new Swiper(".swiper-titlebottom-container", {
        direction: "horizontal",
        loop: $(".swiper-titlebottom-container .swiper-slide").length > 1 ? true : false,
        autoplay: 3e3
    });
    new Swiper(".swiper-turnPageOneBanner-container", {
        direction: "horizontal",
        loop: $(".swiper-turnPageOneBanner-container .swiper-slide").length > 1 ? true : false,
        autoplay: 3e3
    });
    new Swiper(".swiper-turnPageTwoBanner-container", {
        direction: "horizontal",
        loop: $(".swiper-turnPageTwoBanner-container .swiper-slide").length > 1 ? true : false,
        autoplay: 3e3
    });
    var topicName = window.pageConfig.page && window.pageConfig.page.fileName;
    getSpecialTopic();
    fileBrowseReportBrowse();
    function getSpecialTopic() {
        $.ajax({
            url: api.search.specialTopic,
            type: "POST",
            data: JSON.stringify({
                currentPage: 1,
                pageSize: 5,
                topicName: topicName,
                siteCode: "4"
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function(res) {
                if (res.code == "0") {
                    if (res.data.rows && res.data.rows.length) {
                        var _hotSpotSearchTemplate = template.compile(HotSpotSearch)({
                            hotSpotSearchList: res.data.rows || []
                        });
                        $(".hot-spot-search-warper").html(_hotSpotSearchTemplate);
                    }
                }
            }
        });
    }
    function fileBrowseReportBrowse() {
        $.ajax({
            url: api.reportBrowse.fileBrowseReportBrowse,
            type: "POST",
            data: JSON.stringify({
                terminal: "0",
                fid: window.pageConfig.params && window.pageConfig.params.g_fileId
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function(res) {
                if (res.code == "0") {
                    if (res.data.rows && res.data.rows.length) {
                        var _hotSpotSearchTemplate = template.compile(HotSpotSearch)({
                            hotSpotSearchList: res.data.rows || []
                        });
                        $(".hot-spot-search-warper").html(_hotSpotSearchTemplate);
                    }
                }
            }
        });
    }
});

define("dist/detail/template/HotSpotSearch.html", [], '<!--热点搜索-->\n<div class="hot-spot-search">\n    <h2 class="hot-spot-search-title">相关搜索<h2>\n    <ul class="hot-items">\n         {{each hotSpotSearchList}}\n             <li class="item">\n                <a  href="/node/s/{{hotSpotSearchList[$index].id}}.html"  target="_blank">{{hotSpotSearchList[$index].topicName}}</a>\n             </li>\n        {{/each}}  \n    </ul>\n</div>');
