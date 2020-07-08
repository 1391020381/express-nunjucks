define("dist/authentication/user", [ "../cmd-lib/upload/Q", "../cmd-lib/upload/Q.Uploader", "./fixedTopBar", "./msgVer", "../cmd-lib/toast", "../cmd-lib/util", "../application/checkLogin", "../application/api", "../application/method", "./login" ], function(require, exports, module) {
    require("../cmd-lib/upload/Q");
    require("../cmd-lib/upload/Q.Uploader");
    require("./fixedTopBar");
    require("./msgVer");
    require("../cmd-lib/toast");
    var utils = require("../cmd-lib/util");
    var login = require("../application/checkLogin");
    var refreshTopBar = require("./login");
    var userObj = {
        nickName: "",
        validateFrom: /^1[3456789]\d{9}$/,
        init: function() {
            this.beforeInit();
            this.selectBind();
            this.delUploadImg();
            this.checkedRules();
            this.queryCerinfo();
            $(".js-submit").click(function() {
                userObj.submitData();
            });
            $("body").click(function() {
                $(".jqTransformSelectWrapper ul").slideUp();
            });
            setTimeout(function() {
                userObj.uploadfile();
            }, 500);
            // 登录
            $(".user-login,.login-open-vip").on("click", function() {
                if (!utils.getCookie("cuk")) {
                    login.notifyLoginInterface(function(data) {
                        refreshTopBar(data);
                        userObj.nickName = data.nickName;
                        $(".js-count").text(data.nickName);
                    });
                }
            });
            // 退出登录
            $(".btn-exit").click(function() {
                login.ishareLogout();
            });
            // 头部搜索跳转
            $(".btn-new-search").click(function() {
                var searVal = $("#search-detail-input").val();
                window.open("/search/home.html" + "?" + "ft=all" + "&cond=" + encodeURIComponent(encodeURIComponent(searVal)));
            });
        },
        beforeInit: function() {
            if (!utils.getCookie("cuk")) {
                login.notifyLoginInterface(function(data) {
                    if (data) {
                        userObj.nickName = data.nickName;
                        $(".js-count").text(data.nickName);
                        refreshTopBar(data);
                    }
                });
            } else {
                login.getLoginData(function(data) {
                    if (data) {
                        userObj.nickName = data.nickName;
                        $(".js-count").text(data.nickName);
                        refreshTopBar(data);
                    }
                });
            }
        },
        // 查询认证信息
        queryCerinfo: function() {
            $.ajax("/gateway/user/certification/getPersonal", {
                type: "get"
            }).done(function(data) {
                if (data.code == "0") {
                    if (data.data.auditStatus == 3) {
                        $(".dialog-limit").show();
                        $("#bgMask").show();
                    }
                }
            }).fail(function(e) {
                console.log("error===" + e);
            });
        },
        //认证类型选
        selectBind: function() {
            $(".js-select").click(function(e) {
                $(this).siblings("ul").slideToggle();
                e.stopPropagation();
            });
            $(".jqTransformSelectWrapper ul").on("click", "li a", function() {
                $(".jqTransformSelectWrapper ul").find("li a").removeClass("selected");
                $(this).addClass("selected");
                $(".jqTransformSelectWrapper ul").slideUp();
                $(".js-select span").text($(this).text());
                $(".js-select span").attr("authType", $(this).attr("index"));
            });
        },
        //图片上传
        uploadfile: function() {
            var currentTarget = "";
            $(".btn-rz-upload").on("click", function() {
                currentTarget = $(this);
            });
            var E = Q.event, Uploader = Q.Uploader;
            var uploader = new Uploader({
                url: location.protocol + "//upload.ishare.iask.com/ishare-upload/picUpload",
                target: [ $("#js-id-front")[0], $("#js-id-back")[0], $("#js-id-hand")[0], $("#js-cer")[0] ],
                upName: "file",
                dataType: "application/json",
                multiple: false,
                allows: ".jpg,.jpeg,.gif,.png",
                //允许上传的文件格式
                maxSize: 3 * 1024 * 1024,
                //允许上传的最大文件大小,字节,为0表示不限(仅对支持的浏览器生效)
                //每次上传都会发送的参数(POST方式)
                on: {
                    //添加之前触发
                    add: function(task) {
                        //task.limited存在值的任务不会上传，此处无需返回false
                        switch (task.limited) {
                          case "ext":
                            return $.toast({
                                text: "不支持此格式上传"
                            });

                          case "size":
                            return $.toast({
                                text: "资料不能超过3M"
                            });
                        }
                    },
                    //上传完成后触发
                    complete: function(task) {
                        if (task.limited) {
                            return false;
                        }
                        var res = JSON.parse(task.response);
                        currentTarget.attr("val", res.data);
                        currentTarget.siblings(".rz-upload-pic").find("img").attr("src", res.data);
                        currentTarget.siblings(".rz-upload-pic").find(".delete-ele").show();
                    }
                }
            });
        },
        // 删除已上传的图片
        delUploadImg: function() {
            $(".delete-ele").click(function() {
                $(this).hide();
                if ($(this).parents(".rz-main-dd").find(".btn-rz-upload").attr("id") == "upload-target2") {
                    $(this).siblings("img").attr("src", "../../../images/auth/pic_zj.jpg");
                } else {
                    $(this).siblings("img").attr("src", "../../../images/auth/pic_sfz_z.jpg");
                }
                $(this).parents(".rz-main-dd").find(".btn-rz-upload").attr("val", "");
            });
        },
        //勾选和取消协议
        checkedRules: function() {
            $(".rz-label .check-con").click(function() {
                $(".rz-label .check-con").toggleClass("checked");
            });
        },
        // 提交数据
        submitData: function() {
            // nickName	否	String	昵称
            // realName	是	String	真实姓名
            // authType	是	Integer	认证类型；0:中小学教师；1:大学或高职教师；2:网络营销；3:IT/互联网；4:医学；5: 建筑工程；6: 金融/证券；7: 汽车/机械/制造；8: 其他；9: 设计师
            // idCardNo	是	String	身份证号码
            // idCardFrontPic	是	String	身份证正面照片
            // idCardBackPic	是	String	身份证背面照片
            // handFrontIdCardPic	否	String	手持身份证照
            // credentialsPic	否	String	证件材料照片
            // authAppellation	否	String	认证称谓
            // workUnit	否	String	工作单位
            // personProfile	否	String	个人简介
            // personWeibo	否	String	个人微博
            // phoneNumber	是	String	手机号码
            // qqNumber	否	String	qq号码
            // smsId	是	String	验证码id
            // checkCode	是	String	验证码
            var params = {
                nickName: userObj.nickName,
                realName: $(".js-realName").val().trim(),
                authType: Number($(".js-authType").attr("authtype")),
                idCardNo: $(".js-idCardNo").val().trim(),
                idCardFrontPic: $("#js-id-front").attr("val"),
                idCardBackPic: $("#js-id-back").attr("val"),
                handFrontIdCardPic: $("#js-id-hand").attr("val"),
                credentialsPic: $("#js-cer").attr("val"),
                authAppellation: $(".js-authAppellation").val().trim(),
                workUnit: $(".js-workUnit").val().trim(),
                personProfile: $(".js-personProfile").val().trim(),
                personWeibo: $(".js-personWeibo").val().trim(),
                phoneNumber: $(".js-phone").val().trim(),
                qqNumber: $(".js-qqNumber").val().trim(),
                smsId: $(".js-msg").attr("smsId"),
                checkCode: $(".js-msg-val").val().trim()
            };
            if (!params.realName) {
                $.toast({
                    text: "请输入真实姓名",
                    icon: "",
                    delay: 2e3,
                    callback: false
                });
                return false;
            }
            if (!params.idCardNo) {
                $.toast({
                    text: "请输入身份证号码",
                    icon: "",
                    delay: 2e3,
                    callback: false
                });
                return false;
            }
            if (!params.idCardFrontPic) {
                $.toast({
                    text: "请上传身份证正面照片",
                    icon: "",
                    delay: 2e3,
                    callback: false
                });
                return false;
            }
            if (!params.idCardBackPic) {
                $.toast({
                    text: "请上传身份证背面照片",
                    icon: "",
                    delay: 2e3,
                    callback: false
                });
                return false;
            }
            if (!params.handFrontIdCardPic) {
                $.toast({
                    text: "请上传手持身份证照",
                    icon: "",
                    delay: 2e3,
                    callback: false
                });
                return false;
            }
            if (!params.credentialsPic) {
                $.toast({
                    text: "请上传证件材料照片",
                    icon: "",
                    delay: 2e3,
                    callback: false
                });
                return false;
            }
            if (!params.phoneNumber) {
                $.toast({
                    text: "请输入正确的手机号码",
                    icon: "",
                    delay: 2e3,
                    callback: false
                });
                return false;
            }
            if (!params.checkCode) {
                $.toast({
                    text: "请输入手机验证码",
                    icon: "",
                    delay: 2e3,
                    callback: false
                });
                return false;
            }
            if (!$(".rz-label .check-con").hasClass("checked")) {
                $.toast({
                    text: "请勾选用户认证协议",
                    icon: "",
                    delay: 2e3,
                    callback: false
                });
                return false;
            }
            params = JSON.stringify(params);
            $.ajax("/gateway/user/certification/personal", {
                type: "POST",
                data: params,
                contentType: "application/json"
            }).done(function(data) {
                if (data.code == "0") {
                    $.toast({
                        text: data.msg,
                        icon: "",
                        delay: 2e3,
                        callback: function() {
                            location.reload();
                        }
                    });
                } else {
                    $.toast({
                        text: data.msg,
                        icon: "",
                        delay: 2e3,
                        callback: false
                    });
                }
            }).fail(function(e) {
                console.log("error===" + e);
            });
        }
    };
    userObj.init();
});

/*
* Q.js for Uploader
*/
define("dist/cmd-lib/upload/Q", [], function(require, exports, module) {
    (function(window, undefined) {
        "use strict";
        var toString = Object.prototype.toString, has = Object.prototype.hasOwnProperty, slice = Array.prototype.slice;
        //若value不为undefine,则返回value;否则返回defValue
        function def(value, defValue) {
            return value !== undefined ? value : defValue;
        }
        //检测是否为函数
        function isFunc(fn) {
            //在ie11兼容模式（ie6-8）下存在bug,当调用次数过多时可能返回不正确的结果
            //return typeof fn == "function";
            return toString.call(fn) === "[object Function]";
        }
        //检测是否为正整数
        function isUInt(n) {
            return typeof n == "number" && n > 0 && n === Math.floor(n);
        }
        //触发指定函数,如果函数不存在,则不触发
        function fire(fn, bind) {
            if (isFunc(fn)) return fn.apply(bind, slice.call(arguments, 2));
        }
        //扩展对象
        //forced:是否强制扩展
        function extend(destination, source, forced) {
            if (!destination || !source) return destination;
            for (var key in source) {
                if (key == undefined || !has.call(source, key)) continue;
                if (forced || destination[key] === undefined) destination[key] = source[key];
            }
            return destination;
        }
        //Object.forEach
        extend(Object, {
            //遍历对象
            forEach: function(obj, fn, bind) {
                for (var key in obj) {
                    if (has.call(obj, key)) fn.call(bind, key, obj[key], obj);
                }
            }
        });
        extend(Array.prototype, {
            //遍历对象
            forEach: function(fn, bind) {
                var self = this;
                for (var i = 0, len = self.length; i < len; i++) {
                    if (i in self) fn.call(bind, self[i], i, self);
                }
            }
        });
        extend(Date, {
            //获取当前日期和时间所代表的毫秒数
            now: function() {
                return +new Date();
            }
        });
        //-------------------------- browser ---------------------------
        var browser_ie;
        //ie11 开始不再保持向下兼容(例如,不再支持 ActiveXObject、attachEvent 等特性)
        if (window.ActiveXObject || window.msIndexedDB) {
            //window.ActiveXObject => ie10-
            //window.msIndexedDB   => ie11+
            browser_ie = document.documentMode || (!!window.XMLHttpRequest ? 7 : 6);
        }
        //-------------------------- json ---------------------------
        //json解析
        //secure:是否进行安全检测
        function json_decode(text, secure) {
            //安全检测
            if (secure !== false && !/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]").replace(/(?:^|:|,)(?:\s*\[)+/g, ""))) throw new Error("JSON SyntaxError");
            try {
                return new Function("return " + text)();
            } catch (e) {}
        }
        if (!window.JSON) window.JSON = {};
        if (!JSON.parse) JSON.parse = json_decode;
        //-------------------------- DOM ---------------------------
        //设置元素透明
        function setOpacity(ele, value) {
            if (value <= 1) value *= 100;
            if (ele.style.opacity != undefined) ele.style.opacity = value / 100; else if (ele.style.filter != undefined) ele.style.filter = "alpha(opacity=" + parseInt(value) + ")";
        }
        //获取元素绝对定位
        function getOffset(ele, root) {
            var left = 0, top = 0, width = ele.offsetWidth, height = ele.offsetHeight;
            do {
                left += ele.offsetLeft;
                top += ele.offsetTop;
                ele = ele.offsetParent;
            } while (ele && ele != root);
            return {
                left: left,
                top: top,
                width: width,
                height: height
            };
        }
        //遍历元素节点
        function walk(ele, walk, start, all) {
            var el = ele[start || walk];
            var list = [];
            while (el) {
                if (el.nodeType == 1) {
                    if (!all) return el;
                    list.push(el);
                }
                el = el[walk];
            }
            return all ? list : null;
        }
        //获取上一个元素节点
        function getPrev(ele) {
            return ele.previousElementSibling || walk(ele, "previousSibling", null, false);
        }
        //获取下一个元素节点
        function getNext(ele) {
            return ele.nextElementSibling || walk(ele, "nextSibling", null, false);
        }
        //获取第一个元素子节点
        function getFirst(ele) {
            return ele.firstElementChild || walk(ele, "nextSibling", "firstChild", false);
        }
        //获取最后一个元素子节点
        function getLast(ele) {
            return ele.lastElementChild || walk(ele, "previousSibling", "lastChild", false);
        }
        //获取所有子元素节点
        function getChilds(ele) {
            return ele.children || walk(ele, "nextSibling", "firstChild", true);
        }
        //创建元素
        function createEle(tagName, className, html) {
            var ele = document.createElement(tagName);
            if (className) ele.className = className;
            if (html) ele.innerHTML = html;
            return ele;
        }
        //解析html标签
        function parseHTML(html, all) {
            var box = createEle("div", "", html);
            return all ? box.childNodes : getFirst(box);
        }
        //-------------------------- event ---------------------------
        var addEvent, removeEvent;
        if (document.addEventListener) {
            //w3c
            addEvent = function(ele, type, fn) {
                ele.addEventListener(type, fn, false);
            };
            removeEvent = function(ele, type, fn) {
                ele.removeEventListener(type, fn, false);
            };
        } else if (document.attachEvent) {
            //IE
            addEvent = function(ele, type, fn) {
                ele.attachEvent("on" + type, fn);
            };
            removeEvent = function(ele, type, fn) {
                ele.detachEvent("on" + type, fn);
            };
        }
        //event简单处理
        function fix_event(event) {
            var e = event || window.event;
            //for ie
            if (!e.target) e.target = e.srcElement;
            return e;
        }
        //添加事件
        function add_event(element, type, handler, once) {
            var fn = function(e) {
                handler.call(element, fix_event(e));
                if (once) removeEvent(element, type, fn);
            };
            addEvent(element, type, fn);
            if (!once) {
                return {
                    //直接返回停止句柄 eg:var api=add_event();api.stop();
                    stop: function() {
                        removeEvent(element, type, fn);
                    }
                };
            }
        }
        //触发事件
        function trigger_event(ele, type) {
            if (isFunc(ele[type])) ele[type](); else if (ele.fireEvent) ele.fireEvent("on" + type); else if (ele.dispatchEvent) {
                var evt = document.createEvent("HTMLEvents");
                //initEvent接受3个参数:事件类型,是否冒泡,是否阻止浏览器的默认行为
                evt.initEvent(type, true, true);
                //鼠标事件,设置更多参数
                //var evt = document.createEvent("MouseEvents");
                //evt.initMouseEvent(type, true, true, ele.ownerDocument.defaultView, 1, e.screenX, e.screenY, e.clientX, e.clientY, false, false, false, false, 0, null);
                ele.dispatchEvent(evt);
            }
        }
        //阻止事件默认行为并停止事件冒泡
        function stop_event(event, isPreventDefault, isStopPropagation) {
            var e = fix_event(event);
            //阻止事件默认行为
            if (isPreventDefault !== false) {
                if (e.preventDefault) e.preventDefault(); else e.returnValue = false;
            }
            //停止事件冒泡
            if (isStopPropagation !== false) {
                if (e.stopPropagation) e.stopPropagation(); else e.cancelBubble = true;
            }
        }
        //---------------------- other ----------------------
        var RE_HTTP = /^https?:\/\//i;
        //是否http路径(以 http:// 或 https:// 开头)
        function isHttpURL(url) {
            return RE_HTTP.test(url);
        }
        //判断指定路径与当前页面是否同域(包括协议检测 eg:http与https不同域)
        function isSameHost(url) {
            if (!isHttpURL(url)) return true;
            var start = RegExp.lastMatch.length, end = url.indexOf("/", start), host = url.slice(0, end != -1 ? end : undefined);
            return host.toLowerCase() == (location.protocol + "//" + location.host).toLowerCase();
        }
        //按照进制解析数字的层级 eg:时间转化 -> parseLevel(86400,[60,60,24]) => { value=1, level=3 }
        //steps:步进,可以是固定的数字(eg:1024),也可以是具有层次关系的数组(eg:[60,60,24])
        //limit:限制解析的层级,正整数,默认为100
        function parseLevel(size, steps, limit) {
            size = +size;
            steps = steps || 1024;
            var level = 0, isNum = typeof steps == "number", stepNow = 1, count = isUInt(limit) ? limit : isNum ? 100 : steps.length;
            while (size >= stepNow && level < count) {
                stepNow *= isNum ? steps : steps[level];
                level++;
            }
            if (level && size < stepNow) {
                stepNow /= isNum ? steps : steps.last();
                level--;
            }
            return {
                value: level ? size / stepNow : size,
                level: level
            };
        }
        var UNITS_FILE_SIZE = [ "B", "KB", "MB", "GB", "TB", "PB", "EB" ];
        //格式化数字输出,将数字转为合适的单位输出,默认按照1024层级转为文件单位输出
        function formatSize(size, ops) {
            ops = ops === true ? {
                all: true
            } : ops || {};
            if (isNaN(size) || size == undefined || size < 0) {
                var error = ops.error || "--";
                return ops.all ? {
                    text: error
                } : error;
            }
            var pl = parseLevel(size, ops.steps, ops.limit), value = pl.value, text = value.toFixed(def(ops.digit, 2));
            if (ops.trim !== false && text.lastIndexOf(".") != -1) text = text.replace(/\.?0+$/, "");
            pl.text = text + (ops.join || "") + (ops.units || UNITS_FILE_SIZE)[pl.level + (ops.start || 0)];
            return ops.all ? pl : pl.text;
        }
        //---------------------- export ----------------------
        var Q = {
            def: def,
            isFunc: isFunc,
            isUInt: isUInt,
            fire: fire,
            extend: extend,
            ie: browser_ie,
            setOpacity: setOpacity,
            getOffset: getOffset,
            walk: walk,
            getPrev: getPrev,
            getNext: getNext,
            getFirst: getFirst,
            getLast: getLast,
            getChilds: getChilds,
            createEle: createEle,
            parseHTML: parseHTML,
            isHttpURL: isHttpURL,
            isSameHost: isSameHost,
            parseLevel: parseLevel,
            formatSize: formatSize
        };
        if (browser_ie) Q["ie" + (browser_ie < 6 ? 6 : browser_ie)] = true;
        Q.event = {
            fix: fix_event,
            stop: stop_event,
            trigger: trigger_event,
            add: add_event
        };
        window.Q = Q;
    })(window);
});

/// <reference path="Q.js" />
/// <reference path="Q.md5File.js" />
/*
* Q.Uploader.js 文件上传管理器 1.0
*/
define("dist/cmd-lib/upload/Q.Uploader", [], function(require, exports, module) {
    (function(window, undefined) {
        "use strict";
        var def = Q.def, fire = Q.fire, extend = Q.extend, getFirst = Q.getFirst, getLast = Q.getLast, parseJSON = JSON.parse, createEle = Q.createEle, parseHTML = Q.parseHTML, setOpacity = Q.setOpacity, getOffset = Q.getOffset, md5File = Q.md5File, E = Q.event, addEvent = E.add, triggerEvent = E.trigger, stopEvent = E.stop;
        //Object.forEach
        //Date.now
        //-------------------------------- Uploader --------------------------------
        var support_html5_upload = false, //是否支持html5(ajax)方式上传
        support_multiple_select = false, //是否支持文件多选
        support_file_click_trigger = false, //上传控件是否支持click触发文件选择 eg: input.click() => ie9及以下不支持
        UPLOADER_GUID = 0, //文件上传管理器唯一标示,多用于同一个页面存在多个管理器的情况
        UPLOAD_TASK_GUID = 0, //上传任务唯一标示
        UPLOAD_HTML4_ZINDEX = 0;
        //防止多个上传管理器的触发按钮位置重复引起的问题
        //上传状态
        var UPLOAD_STATE_READY = 0, //任务已添加,准备上传
        UPLOAD_STATE_PROCESSING = 1, //任务上传中
        UPLOAD_STATE_COMPLETE = 2, //任务上传完成
        UPLOAD_STATE_SKIP = -1, //任务已跳过(不会上传)
        UPLOAD_STATE_CANCEL = -2, //任务已取消
        UPLOAD_STATE_ERROR = -3;
        //任务已失败
        var global_settings = {};
        //Uploader全局设置
        function setup(ops) {
            extend(global_settings, ops, true);
        }
        //获取上传状态说明
        function get_upload_status_text(state) {
            var LANG = Uploader.Lang;
            switch (state) {
              case UPLOAD_STATE_READY:
                return LANG.status_ready;

              case UPLOAD_STATE_PROCESSING:
                return LANG.status_processing;

              case UPLOAD_STATE_COMPLETE:
                return LANG.status_complete;

              case UPLOAD_STATE_SKIP:
                return LANG.status_skip;

              case UPLOAD_STATE_CANCEL:
                return LANG.status_cancel;

              case UPLOAD_STATE_ERROR:
                return LANG.status_error;
            }
            return state;
        }
        //上传探测
        function detect() {
            var XHR = window.XMLHttpRequest;
            if (XHR && new XHR().upload && window.FormData) support_html5_upload = true;
            var input = document.createElement("input");
            input.type = "file";
            support_multiple_select = !!input.files;
            support_file_click_trigger = support_html5_upload;
        }
        //截取字符串
        function get_last_find(str, find) {
            var index = str.lastIndexOf(find);
            return index != -1 ? str.slice(index) : "";
        }
        //将逗号分隔的字符串转为键值对
        function split_to_map(str) {
            if (!str) return;
            var list = str.split(","), map = {};
            for (var i = 0, len = list.length; i < len; i++) {
                map[list[i]] = true;
            }
            return map;
        }
        //iframe load 事件
        //注意：低版本 ie 支持 iframe 的 onload 事件,不过是隐形的(iframe.onload 方式绑定的将不会触发),需要通过 attachEvent 来注册
        function bind_iframe_load(iframe, fn) {
            if (iframe.attachEvent) iframe.attachEvent("onload", fn); else iframe.addEventListener("load", fn, false);
        }
        //计算上传速度
        function set_task_speed(task, total, loaded) {
            if (!total || total <= 0) return;
            var nowTime = Date.now(), tick;
            //上传完毕,计算平均速度(Byte/s)
            if (loaded >= total) {
                tick = nowTime - task.startTime;
                if (tick) task.avgSpeed = Math.min(Math.round(total * 1e3 / tick), total); else if (!task.speed) task.avgSpeed = task.speed = total;
                task.time = tick || 0;
                task.endTime = nowTime;
                return;
            }
            //即时速度(Byte/s)
            tick = nowTime - task.lastTime;
            if (tick < 200) return;
            task.speed = Math.min(Math.round((loaded - task.loaded) * 1e3 / tick), task.total);
            task.lastTime = nowTime;
        }
        /*
        文件上传管理器,调用示例
        new Uploader({
            //--------------- 必填 ---------------
            url: "",            //上传路径
            target: element,    //上传按钮，可为数组
            view: element,      //上传任务视图(需加载UI接口默认实现)

            //--------------- 可选 ---------------
            html5: true,       //是否启用html5上传,若浏览器不支持,则自动禁用
            multiple: true,    //选择文件时是否允许多选,若浏览器不支持,则自动禁用(仅html5模式有效)

            clickTrigger:true, //是否启用click触发文件选择 eg: input.click() => ie9及以下不支持

            auto: true,        //添加任务后是否立即上传

            data: {},          //上传文件的同时可以指定其它参数,该参数将以POST的方式提交到服务器

            workerThread: 1,   //同时允许上传的任务数(仅html5模式有效)

            upName: "upfile",  //上传参数名称,若后台需要根据name来获取上传数据,可配置此项
            accept: "",        //指定浏览器接受的文件类型 eg:image/*,video/*
            isDir: false,      //是否是文件夹上传（仅Webkit内核浏览器和新版火狐有效）

            allows: "",        //允许上传的文件类型(扩展名),多个之间用逗号隔开
            disallows: "",     //禁止上传的文件类型(扩展名)

            maxSize: 2*1024*1024,   //允许上传的最大文件大小,字节,为0表示不限(仅对支持的浏览器生效,eg: IE10+、Firefox、Chrome)

            isSlice: false,               //是否启用分片上传，若为true，则isQueryState和isMd5默认为true
            chunkSize: 2 * 1024 * 1024,   //默认分片大小为2MB
            isQueryState:false,           //是否查询文件状态（for 秒传或续传）
            isMd5: false,                 //是否计算上传文件md5值
            isUploadAfterHash:true,       //是否在Hash计算完毕后再上传
            sliceRetryCount:2,            //分片上传失败重试次数

            container:element, //一般无需指定
            getPos:function,   //一般无需指定

            //上传回调事件(function)
            on: {
                init,          //上传管理器初始化完毕后触发
    
                select,        //点击上传按钮准备选择上传文件之前触发,返回false可禁止选择文件
                add[Async],    //添加任务之前触发,返回false将跳过该任务
                upload[Async], //上传任务之前触发,返回false将跳过该任务
                send[Async],   //发送数据之前触发,返回false将跳过该任务
    
                cancel,        //取消上传任务后触发
                remove,        //移除上传任务后触发
    
                progress,      //上传进度发生变化后触发(仅html5模式有效)
                complete       //上传完成后触发
            },

            //UI接口(function),若指定了以下方法,将忽略默认实现
            UI:{
                init,       //执行初始化操作
                draw,       //添加任务后绘制任务界面
                update,     //更新任务界面  
                over        //任务上传完成
            }
        });
    */
        function Uploader(settings) {
            var self = this, ops = settings || {};
            self.guid = ops.guid || "uploader" + ++UPLOADER_GUID;
            self.list = [];
            self.map = {};
            self.index = 0;
            self.started = false;
            self.set(ops)._init();
        }
        Uploader.prototype = {
            //修复constructor指向
            constructor: Uploader,
            set: function(settings) {
                var self = this, ops = extend(settings, self.ops);
                self.url = ops.url;
                //上传路径
                self.dataType = ops.dataType || "json";
                //返回值类型
                self.data = ops.data;
                //上传参数
                //上传按钮
                self.targets = ops.target || [];
                if (!self.targets.forEach) self.targets = [ self.targets ];
                self.target = self.targets[0];
                //当前上传按钮
                //是否以html5(ajax)方式上传
                self.html5 = support_html5_upload && !!def(ops.html5, true);
                //是否允许多选(仅在启用了html5的情形下生效)
                //在html4模式下,input是一个整体,若启用多选,将无法针对单一的文件进行操作(eg:根据扩展名筛选、取消、删除操作等)
                //若无需对文件进行操作,可通过 uploader.multiple = true 强制启用多选(不推荐)
                self.multiple = support_multiple_select && self.html5 && !!def(ops.multiple, true);
                //是否启用click触发文件选择 eg: input.click() => IE9及以下不支持
                self.clickTrigger = support_file_click_trigger && !!def(ops.clickTrigger, true);
                //允许同时上传的数量(html5有效)
                //由于设计原因,html4仅能同时上传1个任务,请不要更改
                self.workerThread = self.html5 ? ops.workerThread || 1 : 1;
                //空闲的线程数量
                self.workerIdle = self.workerThread;
                //是否在添加任务后自动开始
                self.auto = ops.auto !== false;
                //input元素的name属性
                self.upName = ops.upName || "upfile";
                //input元素的accept属性,用来指定浏览器接受的文件类型 eg:image/*,video/*
                //注意：IE9及以下不支持accept属性
                self.accept = ops.accept || ops.allows;
                //是否是文件夹上传，仅Webkit内核浏览器和新版火狐有效
                self.isDir = ops.isDir;
                //允许上传的文件类型（扩展名）,多个之间用逗号隔开 eg:.jpg,.png
                self.allows = split_to_map(ops.allows);
                //禁止上传的文件类型（扩展名）,多个之间用逗号隔开
                self.disallows = split_to_map(ops.disallows);
                //允许上传的最大文件大小,字节,为0表示不限(仅对支持的浏览器生效,eg: IE10+、Firefox、Chrome)
                self.maxSize = +ops.maxSize || 0;
                self.isSlice = !!ops.isSlice;
                //是否启用分片上传
                self.chunkSize = +ops.chunkSize || 2 * 1024 * 1024;
                //分片上传大小
                self.isQueryState = !!def(ops.isQueryState, self.isSlice);
                //是否查询文件状态（for 秒传或续传）
                self.isMd5 = !!def(ops.isMd5, self.isSlice);
                //是否计算上传文件md5值
                self.isUploadAfterHash = ops.isUploadAfterHash !== false;
                //是否在Hash计算完毕后再上传
                self.sliceRetryCount = ops.sliceRetryCount == undefined ? 2 : +ops.sliceRetryCount || 0;
                //分片上传失败重试次数
                //ie9及以下不支持click触发(即使能弹出文件选择框,也无法获取文件数据,报拒绝访问错误)
                //若上传按钮位置不确定(比如在滚动区域内),则无法触发文件选择
                //设置原则:getPos需返回上传按钮距container的坐标
                self.container = ops.container || document.body;
                //函数,获取上传按钮距container的坐标,返回格式 eg:{ left: 100, top: 100 }
                if (ops.getPos) self.getPos = ops.getPos;
                //UI接口,此处将覆盖 prototype 实现
                var UI = ops.UI || {};
                if (UI.init) self.init = UI.init;
                //执行初始化操作
                if (UI.draw) self.draw = UI.draw;
                //添加任务后绘制任务界面
                if (UI.update) self.update = UI.update;
                //更新任务界面  
                if (UI.over) self.over = UI.over;
                //任务上传完成
                //上传回调事件
                self.fns = ops.on || {};
                //上传选项
                self.ops = ops;
                if (self.accept && !self.clickTrigger) self.resetInput();
                return self;
            },
            //初始化上传管理器
            _init: function() {
                var self = this;
                if (self._inited) return;
                self._inited = true;
                var guid = self.guid, container = self.container;
                var boxInput = createEle("div", "upload-input " + guid);
                container.appendChild(boxInput);
                self.boxInput = boxInput;
                //构造html4上传所需的iframe和form
                if (!self.html5) {
                    var iframe_name = "upload_iframe_" + guid;
                    var html = '<iframe class="u-iframe" name="' + iframe_name + '"></iframe>' + '<form class="u-form" action="" method="post" enctype="multipart/form-data" target="' + iframe_name + '"></form>';
                    var boxHtml4 = createEle("div", "upload-html4 " + guid, html);
                    container.appendChild(boxHtml4);
                    var iframe = getFirst(boxHtml4), form = getLast(boxHtml4);
                    self.iframe = iframe;
                    self.form = form;
                    //html4上传完成回调
                    bind_iframe_load(iframe, function() {
                        if (self.workerIdle != 0) return;
                        var text;
                        try {
                            text = iframe.contentWindow.document.body.innerHTML;
                        } catch (e) {}
                        self.complete(undefined, UPLOAD_STATE_COMPLETE, text);
                    });
                }
                self.targets.forEach(function(target) {
                    if (self.clickTrigger) {
                        addEvent(target, "click", function(e) {
                            if (self.fire("select", e) === false) return;
                            self.resetInput();
                            //注意:ie9及以下可以弹出文件选择框,但获取不到选择数据,拒绝访问。
                            triggerEvent(self.inputFile, "click");
                        });
                    } else {
                        addEvent(target, "mouseover", function(e) {
                            self.target = this;
                            self.updatePos();
                        });
                    }
                });
                //html4点击事件
                if (!self.clickTrigger) {
                    addEvent(boxInput, "click", function(e) {
                        if (self.fire("select", e) === false) stopEvent(e);
                    });
                    setOpacity(boxInput, 0);
                    self.resetInput();
                }
                self.fire("init");
                return self.run("init");
            },
            //重置上传控件
            resetInput: function() {
                var self = this, boxInput = self.boxInput;
                if (!boxInput) return self;
                boxInput.innerHTML = '<input type="file" name="' + self.upName + '"' + (self.accept ? 'accept="' + self.accept + '"' : "") + (self.isDir ? 'webkitdirectory=""' : "") + ' style="' + (self.clickTrigger ? "visibility: hidden;" : "font-size:100px;") + '"' + (self.multiple ? ' multiple="multiple"' : "") + ">";
                var inputFile = getFirst(boxInput);
                //文件选择事件
                addEvent(inputFile, "change", function(e) {
                    self.add(this);
                    //html4 重置上传控件
                    if (!self.html5) self.resetInput();
                });
                self.inputFile = inputFile;
                return self.updatePos();
            },
            //更新上传按钮坐标(for ie)
            updatePos: function(has_more_uploader) {
                var self = this;
                if (self.clickTrigger) return self;
                var getPos = self.getPos || getOffset, boxInput = self.boxInput, inputFile = getFirst(boxInput), target = self.target, inputWidth = target.offsetWidth, inputHeight = target.offsetHeight, pos = inputWidth == 0 ? {
                    left: -1e4,
                    top: -1e4
                } : getPos(target);
                boxInput.style.width = inputFile.style.width = inputWidth + "px";
                boxInput.style.height = inputFile.style.height = inputHeight + "px";
                boxInput.style.left = pos.left + "px";
                boxInput.style.top = pos.top + "px";
                //多用于选项卡切换中上传按钮位置重复的情况
                if (has_more_uploader) boxInput.style.zIndex = ++UPLOAD_HTML4_ZINDEX;
                return self;
            },
            //触发ops上定义的回调方法,优先触发异步回调(以Async结尾)
            fire: function(action, arg, callback) {
                if (!callback) return fire(this.fns[action], this, arg);
                var asyncFun = this.fns[action + "Async"];
                if (asyncFun) return fire(asyncFun, this, arg, callback);
                callback(fire(this.fns[action], this, arg));
            },
            //运行内部方法或扩展方法(如果存在)
            run: function(action, arg) {
                var fn = this[action];
                if (fn) fire(fn, this, arg);
                return this;
            },
            //添加一个上传任务
            addTask: function(input, file) {
                if (!input && !file) return;
                var name, size;
                if (file) {
                    name = file.webkitRelativePath || file.name || file.fileName;
                    size = file.size === 0 ? 0 : file.size || file.fileSize;
                } else {
                    name = get_last_find(input.value, "\\").slice(1) || input.value;
                    size = -1;
                }
                var self = this, ext = get_last_find(name, ".").toLowerCase(), limit_type;
                if (self.disallows && self.disallows[ext] || self.allows && !self.allows[ext]) limit_type = "ext"; else if (size != -1 && self.maxSize && size > self.maxSize) limit_type = "size";
                var task = {
                    id: ++UPLOAD_TASK_GUID,
                    name: name,
                    ext: ext,
                    size: size,
                    input: input,
                    file: file,
                    state: limit_type ? UPLOAD_STATE_SKIP : UPLOAD_STATE_READY
                };
                if (limit_type) {
                    task.limited = limit_type;
                    task.disabled = true;
                }
                self.fire("add", task, function(result) {
                    if (result === false || task.disabled || task.limited) return;
                    task.index = self.list.length;
                    self.list.push(task);
                    self.map[task.id] = task;
                    self.run("draw", task);
                    if (self.auto) self.start();
                });
                return task;
            },
            //添加上传任务,自动判断input(是否多选)或file
            add: function(input_or_file) {
                var self = this;
                if (input_or_file.tagName == "INPUT") {
                    var files = input_or_file.files;
                    if (files) {
                        for (var i = 0, len = files.length; i < len; i++) {
                            self.addTask(input_or_file, files[i]);
                        }
                    } else {
                        self.addTask(input_or_file);
                    }
                } else {
                    self.addTask(undefined, input_or_file);
                }
            },
            //批量添加上传任务
            addList: function(list) {
                for (var i = 0, len = list.length; i < len; i++) {
                    this.add(list[i]);
                }
            },
            //获取指定任务
            get: function(taskId) {
                if (taskId != undefined) return this.map[taskId];
            },
            //取消上传任务
            //onlyCancel: 若为true,则仅取消上传而不触发任务完成事件
            cancel: function(taskId, onlyCancel) {
                var self = this, task = self.get(taskId);
                if (!task) return;
                var state = task.state;
                //若任务已完成,直接返回
                if (state != UPLOAD_STATE_READY && state != UPLOAD_STATE_PROCESSING) return self;
                if (state == UPLOAD_STATE_PROCESSING) {
                    //html5
                    var xhr = task.xhr;
                    if (xhr) {
                        xhr.abort();
                        //无需调用complete,html5 有自己的处理,此处直接返回
                        return self;
                    }
                    //html4
                    self.iframe.contentWindow.location = "about:blank";
                }
                return onlyCancel ? self : self.complete(task, UPLOAD_STATE_CANCEL);
            },
            //移除任务
            remove: function(taskId) {
                var task = this.get(taskId);
                if (!task) return;
                if (task.state == UPLOAD_STATE_PROCESSING) this.cancel(taskId);
                //this.list.splice(task.index, 1);
                //this.map[task.id] = undefined;
                //从数组中移除任务时,由于任务是根据index获取,若不处理index,将导致上传错乱甚至不能上传
                //此处重置上传索引,上传时会自动修正为正确的索引(程序会跳过已处理过的任务)
                //this.index = 0;
                //添加移除标记(用户可以自行操作,更灵活)
                task.deleted = true;
                this.fire("remove", task);
            },
            //开始上传
            start: function() {
                var self = this, workerIdle = self.workerIdle, list = self.list, index = self.index, count = list.length;
                if (!self.started) self.started = true;
                if (count <= 0 || index >= count || workerIdle <= 0) return self;
                var task = list[index];
                self.index++;
                return self.upload(task);
            },
            //上传任务
            upload: function(task) {
                var self = this;
                if (!task || task.state != UPLOAD_STATE_READY || task.skip || task.deleted) return self.start();
                task.url = self.url;
                self.workerIdle--;
                self.fire("upload", task, function(result) {
                    if (result === false) return self.complete(task, UPLOAD_STATE_SKIP);
                    if (self.html5 && task.file) self._upload_html5_ready(task); else if (task.input) self._upload_html4(task); else self.complete(task, UPLOAD_STATE_SKIP);
                });
                return self;
            },
            _process_xhr_headers: function(xhr) {
                var ops = this.ops;
                //设置http头(必须在 xhr.open 之后)
                var fn = function(k, v) {
                    xhr.setRequestHeader(k, v);
                };
                if (global_settings.headers) Object.forEach(global_settings.headers, fn);
                if (ops.headers) Object.forEach(ops.headers, fn);
            },
            //根据 task.hash 查询任务状态（for 秒传或续传）
            queryState: function(task, callback) {
                var self = this, url = self.url, xhr = new XMLHttpRequest();
                var params = [ "action=query", "hash=" + (task.hash || encodeURIComponent(task.name)), "fileName=" + encodeURIComponent(task.name) ];
                if (task.size != -1) params.push("fileSize=" + task.size);
                self._process_params(task, function(k, v) {
                    params.push(encodeURIComponent(k) + "=" + (v != undefined ? encodeURIComponent(v) : ""));
                }, "dataQuery");
                task.queryUrl = url + (url.indexOf("?") == -1 ? "?" : "&") + params.join("&");
                //秒传查询事件
                self.fire("sliceQuery", task);
                xhr.open("GET", task.queryUrl);
                self._process_xhr_headers(xhr);
                xhr.onreadystatechange = function() {
                    if (xhr.readyState != 4) return;
                    var responseText, json;
                    if (xhr.status >= 200 && xhr.status < 400) {
                        responseText = xhr.responseText;
                        if (responseText === "ok") json = {
                            ret: 1
                        }; else if (responseText) json = parseJSON(responseText);
                        if (!json || typeof json == "number") json = {
                            ret: 0,
                            start: json
                        };
                        task.response = responseText;
                        task.json = json;
                        if (json.ret == 1) {
                            task.queryOK = true;
                            self.cancel(task.id, true).complete(task, UPLOAD_STATE_COMPLETE);
                        } else {
                            var start = +json.start || 0;
                            if (start != Math.floor(start)) start = 0;
                            task.sliceStart = start;
                        }
                    }
                    fire(callback, self, xhr);
                };
                xhr.onerror = function() {
                    fire(callback, self, xhr);
                };
                xhr.send(null);
                return self;
            },
            //处理html5上传（包括秒传和断点续传）
            _upload_html5_ready: function(task) {
                var self = this;
                //上传处理
                var goto_upload = function() {
                    if (task.state == UPLOAD_STATE_COMPLETE) return;
                    if (self.isSlice) self._upload_slice(task); else self._upload_html5(task);
                };
                var after_hash = function(callback) {
                    //自定义hash事件
                    self.fire("hash", task, function() {
                        if (task.hash && self.isQueryState && task.state != UPLOAD_STATE_COMPLETE) self.queryState(task, callback); else callback();
                    });
                };
                //计算文件hash
                var compute_hash = function(callback) {
                    //计算上传文件md5值
                    if (self.isMd5 && md5File) {
                        var hashProgress = self.fns.hashProgress;
                        md5File(task.file, function(md5, time) {
                            task.hash = md5;
                            task.timeHash = time;
                            after_hash(callback);
                        }, function(pvg) {
                            fire(hashProgress, self, task, pvg);
                        });
                    } else {
                        after_hash(callback);
                    }
                };
                if (self.isUploadAfterHash) {
                    compute_hash(goto_upload);
                } else {
                    goto_upload();
                    compute_hash();
                }
                return self;
            },
            //处理上传参数
            _process_params: function(task, fn, prop) {
                prop = prop || "data";
                if (global_settings.data) Object.forEach(global_settings.data, fn);
                if (this.data) Object.forEach(this.data, fn);
                if (task && task[prop]) Object.forEach(task[prop], fn);
            },
            //以html5的方式上传任务
            _upload_html5: function(task) {
                var self = this, xhr = new XMLHttpRequest();
                task.xhr = xhr;
                xhr.upload.addEventListener("progress", function(e) {
                    self.progress(task, e.total, e.loaded);
                }, false);
                xhr.addEventListener("load", function(e) {
                    self.complete(task, UPLOAD_STATE_COMPLETE, e.target.responseText);
                }, false);
                xhr.addEventListener("error", function() {
                    self.complete(task, UPLOAD_STATE_ERROR);
                }, false);
                xhr.addEventListener("abort", function() {
                    self.complete(task, UPLOAD_STATE_CANCEL);
                }, false);
                var fd = new FormData();
                //处理上传参数
                self._process_params(task, function(k, v) {
                    fd.append(k, v);
                });
                // fd.append("fileName", task.name);
                fd.append(self.upName, task.blob || task.file, task.name);
                xhr.open("POST", task.url);
                self._process_xhr_headers(xhr);
                //移除自定义标头,以防止跨域上传被拦截
                //xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
                self.fire("send", task, function(result) {
                    if (result === false) return self.complete(task, UPLOAD_STATE_SKIP);
                    xhr.send(fd);
                    self._afterSend(task);
                });
            },
            //以传统方式上传任务
            _upload_html4: function(task) {
                var self = this, form = self.form, input = task.input;
                //解决多选的情况下重复上传的问题(即使如此，仍然不建议html4模式下开启多选)
                if (input._uploaded) return self.complete(task, UPLOAD_STATE_COMPLETE);
                input._uploaded = true;
                input.name = self.upName;
                form.innerHTML = "";
                form.appendChild(input);
                form.action = task.url;
                //处理上传参数
                self._process_params(task, function(k, v) {
                    form.appendChild(parseHTML('<input type="hidden" name="' + k + '" value="' + v + '">'));
                });
                self.fire("send", task, function(result) {
                    if (result === false) return self.complete(task, UPLOAD_STATE_SKIP);
                    form.submit();
                    self._afterSend(task);
                });
            },
            //已开始发送数据
            _afterSend: function(task) {
                task.lastTime = task.startTime = Date.now();
                task.state = UPLOAD_STATE_PROCESSING;
                this._lastTask = task;
                this.progress(task);
            },
            //更新进度显示
            progress: function(task, total, loaded) {
                if (!total) total = task.size;
                if (!loaded || loaded < 0) loaded = 0;
                var state = task.state || UPLOAD_STATE_READY;
                if (loaded > total) loaded = total;
                if (loaded > 0 && state == UPLOAD_STATE_READY) task.state = state = UPLOAD_STATE_PROCESSING;
                var completed = state == UPLOAD_STATE_COMPLETE;
                if (completed) total = loaded = task.size;
                //计算上传速度
                set_task_speed(task, total, loaded);
                task.total = total;
                task.loaded = loaded;
                this.fire("progress", task);
                this.run("update", task);
            },
            //处理响应数据
            _process_response: function(task, responseText) {
                task.response = responseText;
                if (!responseText) return;
                if (this.dataType == "json") task.json = parseJSON(responseText);
            },
            //完成上传
            complete: function(task, state, responseText) {
                var self = this;
                if (!task && self.workerThread == 1) task = self._lastTask;
                if (task) {
                    if (state != undefined) task.state = state;
                    if (task.state == UPLOAD_STATE_PROCESSING || state == UPLOAD_STATE_COMPLETE) {
                        task.state = UPLOAD_STATE_COMPLETE;
                        self.progress(task, task.size, task.size);
                    }
                    if (responseText !== undefined) self._process_response(task, responseText);
                }
                self.run("update", task).run("over", task);
                if (state == UPLOAD_STATE_CANCEL) self.fire("cancel", task);
                self.fire("complete", task);
                self.workerIdle++;
                if (self.started) self.start();
                return self;
            }
        };
        //扩展上传管理器
        //forced:是否强制覆盖
        Uploader.extend = function(source, forced) {
            extend(Uploader.prototype, source, forced);
        };
        //---------------------- export ----------------------
        detect();
        extend(Uploader, {
            support: {
                html5: support_html5_upload,
                multiple: support_multiple_select
            },
            READY: UPLOAD_STATE_READY,
            PROCESSING: UPLOAD_STATE_PROCESSING,
            COMPLETE: UPLOAD_STATE_COMPLETE,
            SKIP: UPLOAD_STATE_SKIP,
            CANCEL: UPLOAD_STATE_CANCEL,
            ERROR: UPLOAD_STATE_ERROR,
            //UI对象,用于多套UI共存
            UI: {},
            //默认语言
            Lang: {
                status_ready: "准备中",
                status_processing: "上传中",
                status_complete: "已完成",
                status_skip: "已跳过",
                status_cancel: "已取消",
                status_error: "已失败"
            },
            setup: setup,
            getStatusText: get_upload_status_text
        });
        Q.Uploader = Uploader;
    })(window);
});

define("dist/authentication/fixedTopBar", [], function(require, exports, module) {
    //详情页头部悬浮
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
});

define("dist/authentication/msgVer", [ "dist/cmd-lib/toast" ], function(require, exports, module) {
    require("dist/cmd-lib/toast");
    var bindPhone = {
        validateFrom: /^1[3456789]\d{9}$/,
        phone: "",
        textCode: "",
        downCountNum: 60,
        isDisableMsg: false,
        avaliPhone: false,
        smsId: "",
        valiPhone: function() {
            console.log(this.phone);
            return this.validateFrom.test(this.phone);
        },
        initial: function() {
            $(".js-submit").click(this.sendData);
            $(".js-msg").click(this.getTextCode);
            $(".js-phone").on("keyup", function() {
                bindPhone.phone = $(".js-phone").val().trim();
            });
        },
        getTextCode: function() {
            if (bindPhone.valiPhone()) {
                bindPhone.avaliPhone = true;
            } else {
                $.toast({
                    text: "请输入正确的手机号码",
                    icon: "",
                    delay: 2e3,
                    callback: false
                });
            }
            if (!bindPhone.isDisableMsg && bindPhone.avaliPhone) {
                bindPhone.downCountLimt();
                bindPhone.pictureVerify();
            }
        },
        downCountLimt: function() {
            var num = this.downCountNum;
            var that = this;
            bindPhone.isDisableMsg = true;
            $(".js-msg").addClass("btn-send-code-no");
            var timer = setInterval(function() {
                num--;
                $(".js-msg").text(num + "秒");
                if (num < 1) {
                    clearInterval(timer);
                    that.isDisableMsg = false;
                    $(".js-msg").removeClass("btn-send-code-no");
                    $(".js-msg").text("获取验证码");
                }
            }, 1e3);
        },
        // 图形验证码
        pictureVerify: function(appid, randstr, ticket, onoff) {
            var params = {
                mobile: bindPhone.phone,
                nationCode: "86",
                businessCode: "6",
                terminal: "pc",
                appId: appid,
                randstr: randstr,
                ticket: ticket,
                onOff: onoff
            };
            params = JSON.stringify(params);
            $.ajax("/gateway/cas/sms/sendSms", {
                type: "POST",
                data: params,
                contentType: "application/json"
            }).done(function(data) {
                if (data.code == "0") {
                    bindPhone.smsId = data.data.smsId;
                    $(".js-msg").attr("smsId", data.data.smsId);
                    $.toast({
                        text: data.msg,
                        icon: "",
                        delay: 2e3,
                        callback: false
                    });
                } else if (data.code == "2112") {
                    bindPhone.showCaptchaProcess(bindPhone.pictureVerify);
                } else {
                    $.toast({
                        text: data.msg,
                        icon: "",
                        delay: 2e3,
                        callback: false
                    });
                }
            }).fail(function(e) {
                console.log("error===" + e);
            });
        },
        showCaptchaProcess: function(options) {
            bindPhone.showCaptcha(options);
        },
        showCaptcha: function(options) {
            var appId = "2071307690";
            var capt;
            if (!capt) {
                capt = new TencentCaptcha(appId, bindPhone.captCallback, {
                    bizState: options
                });
            }
            capt.show();
        },
        captCallback: function(res) {
            if (res.ret === 0) {
                res.bizState(res.appid, res.randstr, res.ticket, 1);
            }
        }
    };
    bindPhone.initial();
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

define("dist/authentication/login", [], function(require, exports, module) {
    function refreshTopBar(data) {
        var $unLogin = $("#unLogin");
        var $hasLogin = $("#haveLogin");
        var $btn_user_more = $(".btn-user-more");
        var $vip_status = $(".vip-status");
        var $icon_iShare = $(".icon-iShare");
        var $top_user_more = $(".top-user-more");
        $btn_user_more.text(data.isVip == 1 ? "续费" : "开通");
        var $target = null;
        if (data.msgCount) {
            $(".top-bar .news").removeClass("hide").find("#user-msg").text(data.msgCount);
        }
        $(".js-buy-open").click(function() {
            if ($(this).attr("data-type") == "vip") {
                location.href = "/pay/vip.html";
            }
        });
        //vip
        if (data.isVip == 1) {
            $target = $vip_status.find('p[data-type="2"]');
            $target.find(".expire_time").html(data.expireTime);
            $target.show().siblings().hide();
            $top_user_more.addClass("top-vip-more");
            $(".isVip-show").find("span").html(data.expireTime);
            $(".isVip-show").removeClass("hide");
        } else if (data.userType == 1) {
            $target = $vip_status.find('p[data-type="3"]');
            $hasLogin.removeClass("user-con-vip");
            $target.show().siblings().hide();
        } else if (data.isVip == 0) {
            $hasLogin.removeClass("user-con-vip");
            // 用户不是vip,但是登录啦,隐藏 登录后开通 显示 开通
            $(".btn-join-vip").eq(0).hide();
            $(".btn-join-vip").eq(1).show();
        } else if (data.isVip == 2) {
            $(".vip-title").hide();
        }
        $unLogin.hide();
        $hasLogin.find(".user-link .user-name").html(data.nickName);
        $hasLogin.find(".user-link img").attr("src", data.weiboImage);
        $hasLogin.find(".top-user-more .name").html(data.nickName);
        $hasLogin.find(".top-user-more img").attr("src", data.weiboImage);
        $hasLogin.show();
        window.pageConfig.params.isVip = data.isVip;
        var fileDiscount = data.fileDiscount;
        if (fileDiscount) {
            fileDiscount = fileDiscount / 100;
        } else {
            fileDiscount = .8;
        }
        window.pageConfig.params.fileDiscount = fileDiscount;
        $("#ip-uid").val(data.userId);
        $("#ip-isVip").val(data.isVip);
        $("#ip-mobile").val(data.mobile);
    }
    return refreshTopBar;
});
