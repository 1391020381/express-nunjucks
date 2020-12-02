define("dist/report/handler-debug", [ "../cmd-lib/util-debug", "./columns-debug", "./config-debug", "../application/method-debug" ], function(require, exports, module) {
    // var $ = require("$");
    var util = require("../cmd-lib/util-debug");
    var columns = require("./columns-debug");
    //上报参数配置
    var config = require("./config-debug");
    //参数配置
    var method = require("../application/method-debug");
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
            hm.src = "https://hm.baidu.com/hm.js?adb0f091db00ed439bf000f2c5cbaee7";
            var s = document.getElementsByTagName("script")[0];
            s.parentNode.insertBefore(hm, s);
        })();
    } catch (e) {}
});