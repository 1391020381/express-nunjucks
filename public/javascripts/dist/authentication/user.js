define("dist/authentication/user", [ "../cmd-lib/upload/Q", "../cmd-lib/upload/Q.Uploader", "./fixedTopBar", "./msgVer", "../cmd-lib/toast", "../cmd-lib/util", "../application/method", "../application/effect", "../application/checkLogin", "../application/api", "../application/login", "../cmd-lib/jqueryMd5", "../common/bilog", "base64", "../report/config", "../cmd-lib/myDialog", "../common/bindphone", "../common/baidu-statistics" ], function(require, exports, module) {
    require("../cmd-lib/upload/Q");
    require("../cmd-lib/upload/Q.Uploader");
    require("./fixedTopBar");
    require("./msgVer");
    require("../cmd-lib/toast");
    var utils = require("../cmd-lib/util");
    var method = require("../application/method");
    var isLogin = require("../application/effect").isLogin;
    var isAutoLogin = true;
    isLogin(function(data) {
        $(".js-count").text(data.nickName);
    }, isAutoLogin, function() {
        location.reload();
    });
    var userObj = {
        nickName: "",
        validateFrom: /^1[3456789]\d{9}$/,
        init: function() {
            this.selectBind();
            this.delUploadImg();
            this.checkedRules();
            if (method.getCookie("cuk")) {
                this.queryCerinfo();
            }
            $(".js-submit").click(function() {
                // userObj.submitData();
                if (method.getCookie("cuk")) {
                    userObj.submitData();
                } else {
                    isLogin(null, isAutoLogin);
                }
            });
            $("body").click(function() {
                $(".jqTransformSelectWrapper ul").slideUp();
            });
            setTimeout(function() {
                userObj.uploadfile();
            }, 800);
        },
        // 查询认证信息
        queryCerinfo: function() {
            $.ajax("/gateway/user/certification/getPersonal", {
                type: "get"
            }).done(function(data) {
                if (data.code == "0") {
                    if (data.data && data.data.auditStatus == 3) {
                        $(".dialog-limit").show();
                        $("#bgMask").show();
                    } else if (data.data) {
                        if (data.data.auditStatus == 0 || data.data.auditStatus == 1) {
                            $(".header-process .process-item").eq(1).addClass("step-now").siblings().removeClass("step-now");
                        } else if (data.data.auditStatus == 2) {
                            $(".header-process .process-item").eq(2).addClass("step-now").siblings().removeClass("step-now");
                        }
                        $(".js-realName").val(data.data.realName).attr("disabled", "disabled");
                        var Authtype = [ {
                            val: 0,
                            title: "中小学教师"
                        }, {
                            val: 1,
                            title: "大学或高职教师"
                        }, {
                            val: 2,
                            title: "网络营销"
                        }, {
                            val: 3,
                            title: "IT/互联网"
                        }, {
                            val: 4,
                            title: "医学"
                        }, {
                            val: 5,
                            title: "建筑工程"
                        }, {
                            val: 6,
                            title: "金融/证券"
                        }, {
                            val: 7,
                            title: "汽车/机械/制造"
                        }, {
                            val: 8,
                            title: "其他"
                        }, {
                            val: 9,
                            title: "设计师"
                        } ];
                        $(".js-authType").text(Authtype[data.data.authType].title);
                        $(".js-authTypeList").remove();
                        $(".js-idCardNo").val(data.data.idCardNo).attr("disabled", "disabled");
                        $(".js-idCardFrontPic img").attr("src", data.data.idCardFrontPic);
                        $("#js-id-front").removeAttr("id");
                        $(".js-idCardBackPic img").attr("src", data.data.idCardBackPic);
                        $("#js-id-back").removeAttr("id");
                        $(".js-handFrontIdCardPic img").attr("src", data.data.handFrontIdCardPic);
                        $("#js-id-hand").removeAttr("id");
                        $(".js-credentialsPic img").attr("src", data.data.credentialsPic);
                        $("#js-cer").removeAttr("id");
                        $(".js-authAppellation").val(data.data.authAppellation).attr("disabled", "disabled");
                        $(".js-workUnit").val(data.data.workUnit).attr("disabled", "disabled");
                        $(".js-personProfile").val(data.data.personProfile).attr("disabled", "disabled");
                        $(".js-personWeibo").val(data.data.personWeibo).attr("disabled", "disabled");
                        $(".js-phone").val(data.data.phoneNumber).attr("disabled", "disabled");
                        $(".js-qqNumber").val(data.data.qqNumber).attr("disabled", "disabled");
                        $(".js-msg").attr("disabled", "disabled");
                        $(".js-edit").hide();
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
                url: location.protocol + "//upload.ishare.iask.com/ishare-upload/picUploadCatalog",
                target: [ $("#js-id-front")[0], $("#js-id-back")[0], $("#js-id-hand")[0], $("#js-cer")[0] ],
                upName: "file",
                dataType: "application/json",
                multiple: false,
                data: {
                    fileCatalog: "ishare"
                },
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
                        if (res.data && res.data.picKey) {
                            currentTarget.attr("val", res.data.picKey);
                            currentTarget.siblings(".rz-upload-pic").find("img").attr("src", res.data.preUrl + res.data.picKey);
                            currentTarget.siblings(".rz-upload-pic").find(".delete-ele").show();
                        } else {
                            $.toast({
                                text: "上传失败，重新上传",
                                icon: "",
                                delay: 2e3,
                                callback: false
                            });
                        }
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
                        text: "提交成功",
                        icon: "",
                        delay: 3e3,
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
                    bindPhone.downCountLimt();
                    $.toast({
                        text: "短信发送成功",
                        icon: "",
                        delay: 2e3,
                        callback: false
                    });
                } else if (data.code == "411015") {
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
