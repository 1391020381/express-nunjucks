define("dist/personalCenter/init", [ "../cmd-lib/tab", "../cmd-lib/toast", "../cmd-lib/myDialog", "../cmd-lib/clipboard", "../application/suspension", "../application/method", "../application/checkLogin", "../application/api", "../application/app", "../application/element", "../application/template", "../application/extend", "../common/bilog", "base64", "../cmd-lib/util", "../report/config", "../report/init", "../report/handler", "../report/columns", "../application/helper", "//static3.iask.cn/resource/js/plugins/pc.iask.login.min", "./effect", "./menu", "./dialog", "./home", "swiper", "../common/recommendConfigInfo", "../common/template/swiper_tmp.html", "./template/homeRecentlySee.html", "./template/vipPrivilegeList.html", "./mycollectionAndDownLoad", "./template/mycollectionAndDownLoad.html", "./template/simplePagination.html", "./myuploads", "./template/myuploads.html", "./myvip", "./template/myvip.html", "./template/vipTable.html", "./mycoupon", "./template/mycoupon.html", "./myorder", "./template/myorder.html", "./accountsecurity", "../cmd-lib/jqueryMd5", "../common/bindphone", "./template/accountsecurity.html", "./personalinformation", "../cmd-lib/jquery.datepicker", "../common/area", "./template/personalinformation.html" ], function(require, exports, module) {
    require("../cmd-lib/tab");
    require("../cmd-lib/toast");
    require("../cmd-lib/myDialog");
    var Clipboard = require("../cmd-lib/clipboard");
    var clipboardBtn = new Clipboard(".clipboardBtn");
    clipboardBtn.on("success", function(e) {
        console.info("Action:", e.action);
        console.info("Text:", e.text);
        console.info("Trigger:", e.trigger);
        e.clearSelection();
    });
    clipboardBtn.on("error", function(e) {
        console.error("Action:", e.action);
        console.error("Trigger:", e.trigger);
    });
    // require("../common/userMoreMsg")
    require("../application/suspension");
    require("./effect");
    // 登录和刷新topbar
    // require("./report");  
    require("./menu");
    require("./dialog");
    require("./home");
    require("./mycollectionAndDownLoad");
    require("./myuploads");
    require("./myvip");
    require("./mycoupon");
    require("./myorder");
    require("./accountsecurity");
    require("./personalinformation");
    require("../common/bilog");
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

define("dist/cmd-lib/clipboard", [], function(require, exports, module) {
    /*!
 * clipboard.js v2.0.4
 * https://zenorocha.github.io/clipboard.js
 * 
 * Licensed MIT © Zeno Rocha
 */
    (function webpackUniversalModuleDefinition(root, factory) {
        if (typeof exports === "object" && typeof module === "object") module.exports = factory(); else if (typeof define === "function" && define.amd) define([], factory); else if (typeof exports === "object") exports["ClipboardJS"] = factory(); else root["ClipboardJS"] = factory();
    })(this, function() {
        /******/
        return function(modules) {
            // webpackBootstrap
            /******/
            // The module cache
            /******/
            var installedModules = {};
            /******/
            /******/
            // The require function
            /******/
            function __webpack_require__(moduleId) {
                /******/
                /******/
                // Check if module is in cache
                /******/
                if (installedModules[moduleId]) {
                    /******/
                    return installedModules[moduleId].exports;
                }
                /******/
                // Create a new module (and put it into the cache)
                /******/
                var module = installedModules[moduleId] = {
                    /******/
                    i: moduleId,
                    /******/
                    l: false,
                    /******/
                    exports: {}
                };
                /******/
                /******/
                // Execute the module function
                /******/
                modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
                /******/
                /******/
                // Flag the module as loaded
                /******/
                module.l = true;
                /******/
                /******/
                // Return the exports of the module
                /******/
                return module.exports;
            }
            /******/
            /******/
            /******/
            // expose the modules object (__webpack_modules__)
            /******/
            __webpack_require__.m = modules;
            /******/
            /******/
            // expose the module cache
            /******/
            __webpack_require__.c = installedModules;
            /******/
            /******/
            // define getter function for harmony exports
            /******/
            __webpack_require__.d = function(exports, name, getter) {
                /******/
                if (!__webpack_require__.o(exports, name)) {
                    /******/
                    Object.defineProperty(exports, name, {
                        enumerable: true,
                        get: getter
                    });
                }
            };
            /******/
            /******/
            // define __esModule on exports
            /******/
            __webpack_require__.r = function(exports) {
                /******/
                if (typeof Symbol !== "undefined" && Symbol.toStringTag) {
                    /******/
                    Object.defineProperty(exports, Symbol.toStringTag, {
                        value: "Module"
                    });
                }
                /******/
                Object.defineProperty(exports, "__esModule", {
                    value: true
                });
            };
            /******/
            /******/
            // create a fake namespace object
            /******/
            // mode & 1: value is a module id, require it
            /******/
            // mode & 2: merge all properties of value into the ns
            /******/
            // mode & 4: return value when already ns object
            /******/
            // mode & 8|1: behave like require
            /******/
            __webpack_require__.t = function(value, mode) {
                /******/
                if (mode & 1) value = __webpack_require__(value);
                /******/
                if (mode & 8) return value;
                /******/
                if (mode & 4 && typeof value === "object" && value && value.__esModule) return value;
                /******/
                var ns = Object.create(null);
                /******/
                __webpack_require__.r(ns);
                /******/
                Object.defineProperty(ns, "default", {
                    enumerable: true,
                    value: value
                });
                /******/
                if (mode & 2 && typeof value != "string") for (var key in value) __webpack_require__.d(ns, key, function(key) {
                    return value[key];
                }.bind(null, key));
                /******/
                return ns;
            };
            /******/
            /******/
            // getDefaultExport function for compatibility with non-harmony modules
            /******/
            __webpack_require__.n = function(module) {
                /******/
                var getter = module && module.__esModule ? /******/
                function getDefault() {
                    return module["default"];
                } : /******/
                function getModuleExports() {
                    return module;
                };
                /******/
                __webpack_require__.d(getter, "a", getter);
                /******/
                return getter;
            };
            /******/
            /******/
            // Object.prototype.hasOwnProperty.call
            /******/
            __webpack_require__.o = function(object, property) {
                return Object.prototype.hasOwnProperty.call(object, property);
            };
            /******/
            /******/
            // __webpack_public_path__
            /******/
            __webpack_require__.p = "";
            /******/
            /******/
            /******/
            // Load entry module and return exports
            /******/
            return __webpack_require__(__webpack_require__.s = 0);
        }([ /* 0 */
        /***/
        function(module, exports, __webpack_require__) {
            var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function(obj) {
                return typeof obj;
            } : function(obj) {
                return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
            };
            var _createClass = function() {
                function defineProperties(target, props) {
                    for (var i = 0; i < props.length; i++) {
                        var descriptor = props[i];
                        descriptor.enumerable = descriptor.enumerable || false;
                        descriptor.configurable = true;
                        if ("value" in descriptor) descriptor.writable = true;
                        Object.defineProperty(target, descriptor.key, descriptor);
                    }
                }
                return function(Constructor, protoProps, staticProps) {
                    if (protoProps) defineProperties(Constructor.prototype, protoProps);
                    if (staticProps) defineProperties(Constructor, staticProps);
                    return Constructor;
                };
            }();
            var _clipboardAction = __webpack_require__(1);
            var _clipboardAction2 = _interopRequireDefault(_clipboardAction);
            var _tinyEmitter = __webpack_require__(3);
            var _tinyEmitter2 = _interopRequireDefault(_tinyEmitter);
            var _goodListener = __webpack_require__(4);
            var _goodListener2 = _interopRequireDefault(_goodListener);
            function _interopRequireDefault(obj) {
                return obj && obj.__esModule ? obj : {
                    "default": obj
                };
            }
            function _classCallCheck(instance, Constructor) {
                if (!(instance instanceof Constructor)) {
                    throw new TypeError("Cannot call a class as a function");
                }
            }
            function _possibleConstructorReturn(self, call) {
                if (!self) {
                    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                }
                return call && (typeof call === "object" || typeof call === "function") ? call : self;
            }
            function _inherits(subClass, superClass) {
                if (typeof superClass !== "function" && superClass !== null) {
                    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
                }
                subClass.prototype = Object.create(superClass && superClass.prototype, {
                    constructor: {
                        value: subClass,
                        enumerable: false,
                        writable: true,
                        configurable: true
                    }
                });
                if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
            }
            /**
 * Base class which takes one or more elements, adds event listeners to them,
 * and instantiates a new `ClipboardAction` on each click.
 */
            var Clipboard = function(_Emitter) {
                _inherits(Clipboard, _Emitter);
                /**
     * @param {String|HTMLElement|HTMLCollection|NodeList} trigger
     * @param {Object} options
     */
                function Clipboard(trigger, options) {
                    _classCallCheck(this, Clipboard);
                    var _this = _possibleConstructorReturn(this, (Clipboard.__proto__ || Object.getPrototypeOf(Clipboard)).call(this));
                    _this.resolveOptions(options);
                    _this.listenClick(trigger);
                    return _this;
                }
                /**
     * Defines if attributes would be resolved using internal setter functions
     * or custom functions that were passed in the constructor.
     * @param {Object} options
     */
                _createClass(Clipboard, [ {
                    key: "resolveOptions",
                    value: function resolveOptions() {
                        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
                        this.action = typeof options.action === "function" ? options.action : this.defaultAction;
                        this.target = typeof options.target === "function" ? options.target : this.defaultTarget;
                        this.text = typeof options.text === "function" ? options.text : this.defaultText;
                        this.container = _typeof(options.container) === "object" ? options.container : document.body;
                    }
                }, {
                    key: "listenClick",
                    value: function listenClick(trigger) {
                        var _this2 = this;
                        this.listener = (0, _goodListener2.default)(trigger, "click", function(e) {
                            return _this2.onClick(e);
                        });
                    }
                }, {
                    key: "onClick",
                    value: function onClick(e) {
                        var trigger = e.delegateTarget || e.currentTarget;
                        if (this.clipboardAction) {
                            this.clipboardAction = null;
                        }
                        this.clipboardAction = new _clipboardAction2.default({
                            action: this.action(trigger),
                            target: this.target(trigger),
                            text: this.text(trigger),
                            container: this.container,
                            trigger: trigger,
                            emitter: this
                        });
                    }
                }, {
                    key: "defaultAction",
                    value: function defaultAction(trigger) {
                        return getAttributeValue("action", trigger);
                    }
                }, {
                    key: "defaultTarget",
                    value: function defaultTarget(trigger) {
                        var selector = getAttributeValue("target", trigger);
                        if (selector) {
                            return document.querySelector(selector);
                        }
                    }
                }, {
                    key: "defaultText",
                    /**
         * Default `text` lookup function.
         * @param {Element} trigger
         */
                    value: function defaultText(trigger) {
                        return getAttributeValue("text", trigger);
                    }
                }, {
                    key: "destroy",
                    value: function destroy() {
                        this.listener.destroy();
                        if (this.clipboardAction) {
                            this.clipboardAction.destroy();
                            this.clipboardAction = null;
                        }
                    }
                } ], [ {
                    key: "isSupported",
                    value: function isSupported() {
                        var action = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [ "copy", "cut" ];
                        var actions = typeof action === "string" ? [ action ] : action;
                        var support = !!document.queryCommandSupported;
                        actions.forEach(function(action) {
                            support = support && !!document.queryCommandSupported(action);
                        });
                        return support;
                    }
                } ]);
                return Clipboard;
            }(_tinyEmitter2.default);
            /**
 * Helper function to retrieve attribute value.
 * @param {String} suffix
 * @param {Element} element
 */
            function getAttributeValue(suffix, element) {
                var attribute = "data-clipboard-" + suffix;
                if (!element.hasAttribute(attribute)) {
                    return;
                }
                return element.getAttribute(attribute);
            }
            module.exports = Clipboard;
        }, /* 1 */
        /***/
        function(module, exports, __webpack_require__) {
            var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function(obj) {
                return typeof obj;
            } : function(obj) {
                return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
            };
            var _createClass = function() {
                function defineProperties(target, props) {
                    for (var i = 0; i < props.length; i++) {
                        var descriptor = props[i];
                        descriptor.enumerable = descriptor.enumerable || false;
                        descriptor.configurable = true;
                        if ("value" in descriptor) descriptor.writable = true;
                        Object.defineProperty(target, descriptor.key, descriptor);
                    }
                }
                return function(Constructor, protoProps, staticProps) {
                    if (protoProps) defineProperties(Constructor.prototype, protoProps);
                    if (staticProps) defineProperties(Constructor, staticProps);
                    return Constructor;
                };
            }();
            var _select = __webpack_require__(2);
            var _select2 = _interopRequireDefault(_select);
            function _interopRequireDefault(obj) {
                return obj && obj.__esModule ? obj : {
                    "default": obj
                };
            }
            function _classCallCheck(instance, Constructor) {
                if (!(instance instanceof Constructor)) {
                    throw new TypeError("Cannot call a class as a function");
                }
            }
            /**
 * Inner class which performs selection from either `text` or `target`
 * properties and then executes copy or cut operations.
 */
            var ClipboardAction = function() {
                /**
     * @param {Object} options
     */
                function ClipboardAction(options) {
                    _classCallCheck(this, ClipboardAction);
                    this.resolveOptions(options);
                    this.initSelection();
                }
                /**
     * Defines base properties passed from constructor.
     * @param {Object} options
     */
                _createClass(ClipboardAction, [ {
                    key: "resolveOptions",
                    value: function resolveOptions() {
                        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
                        this.action = options.action;
                        this.container = options.container;
                        this.emitter = options.emitter;
                        this.target = options.target;
                        this.text = options.text;
                        this.trigger = options.trigger;
                        this.selectedText = "";
                    }
                }, {
                    key: "initSelection",
                    value: function initSelection() {
                        if (this.text) {
                            this.selectFake();
                        } else if (this.target) {
                            this.selectTarget();
                        }
                    }
                }, {
                    key: "selectFake",
                    value: function selectFake() {
                        var _this = this;
                        var isRTL = document.documentElement.getAttribute("dir") == "rtl";
                        this.removeFake();
                        this.fakeHandlerCallback = function() {
                            return _this.removeFake();
                        };
                        this.fakeHandler = this.container.addEventListener("click", this.fakeHandlerCallback) || true;
                        this.fakeElem = document.createElement("textarea");
                        // Prevent zooming on iOS
                        this.fakeElem.style.fontSize = "12pt";
                        // Reset box model
                        this.fakeElem.style.border = "0";
                        this.fakeElem.style.padding = "0";
                        this.fakeElem.style.margin = "0";
                        // Move element out of screen horizontally
                        this.fakeElem.style.position = "absolute";
                        this.fakeElem.style[isRTL ? "right" : "left"] = "-9999px";
                        // Move element to the same position vertically
                        var yPosition = window.pageYOffset || document.documentElement.scrollTop;
                        this.fakeElem.style.top = yPosition + "px";
                        this.fakeElem.setAttribute("readonly", "");
                        this.fakeElem.value = this.text;
                        this.container.appendChild(this.fakeElem);
                        this.selectedText = (0, _select2.default)(this.fakeElem);
                        this.copyText();
                    }
                }, {
                    key: "removeFake",
                    value: function removeFake() {
                        if (this.fakeHandler) {
                            this.container.removeEventListener("click", this.fakeHandlerCallback);
                            this.fakeHandler = null;
                            this.fakeHandlerCallback = null;
                        }
                        if (this.fakeElem) {
                            this.container.removeChild(this.fakeElem);
                            this.fakeElem = null;
                        }
                    }
                }, {
                    key: "selectTarget",
                    value: function selectTarget() {
                        this.selectedText = (0, _select2.default)(this.target);
                        this.copyText();
                    }
                }, {
                    key: "copyText",
                    value: function copyText() {
                        var succeeded = void 0;
                        try {
                            succeeded = document.execCommand(this.action);
                        } catch (err) {
                            succeeded = false;
                        }
                        this.handleResult(succeeded);
                    }
                }, {
                    key: "handleResult",
                    value: function handleResult(succeeded) {
                        this.emitter.emit(succeeded ? "success" : "error", {
                            action: this.action,
                            text: this.selectedText,
                            trigger: this.trigger,
                            clearSelection: this.clearSelection.bind(this)
                        });
                    }
                }, {
                    key: "clearSelection",
                    value: function clearSelection() {
                        if (this.trigger) {
                            this.trigger.focus();
                        }
                        window.getSelection().removeAllRanges();
                    }
                }, {
                    key: "destroy",
                    /**
         * Destroy lifecycle.
         */
                    value: function destroy() {
                        this.removeFake();
                    }
                }, {
                    key: "action",
                    set: function set() {
                        var action = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "copy";
                        this._action = action;
                        if (this._action !== "copy" && this._action !== "cut") {
                            throw new Error('Invalid "action" value, use either "copy" or "cut"');
                        }
                    },
                    get: function get() {
                        return this._action;
                    }
                }, {
                    key: "target",
                    set: function set(target) {
                        if (target !== undefined) {
                            if (target && (typeof target === "undefined" ? "undefined" : _typeof(target)) === "object" && target.nodeType === 1) {
                                if (this.action === "copy" && target.hasAttribute("disabled")) {
                                    throw new Error('Invalid "target" attribute. Please use "readonly" instead of "disabled" attribute');
                                }
                                if (this.action === "cut" && (target.hasAttribute("readonly") || target.hasAttribute("disabled"))) {
                                    throw new Error('Invalid "target" attribute. You can\'t cut text from elements with "readonly" or "disabled" attributes');
                                }
                                this._target = target;
                            } else {
                                throw new Error('Invalid "target" value, use a valid Element');
                            }
                        }
                    },
                    get: function get() {
                        return this._target;
                    }
                } ]);
                return ClipboardAction;
            }();
            module.exports = ClipboardAction;
        }, /* 2 */
        /***/
        function(module, exports) {
            function select(element) {
                var selectedText;
                if (element.nodeName === "SELECT") {
                    element.focus();
                    selectedText = element.value;
                } else if (element.nodeName === "INPUT" || element.nodeName === "TEXTAREA") {
                    var isReadOnly = element.hasAttribute("readonly");
                    if (!isReadOnly) {
                        element.setAttribute("readonly", "");
                    }
                    element.select();
                    element.setSelectionRange(0, element.value.length);
                    if (!isReadOnly) {
                        element.removeAttribute("readonly");
                    }
                    selectedText = element.value;
                } else {
                    if (element.hasAttribute("contenteditable")) {
                        element.focus();
                    }
                    var selection = window.getSelection();
                    var range = document.createRange();
                    range.selectNodeContents(element);
                    selection.removeAllRanges();
                    selection.addRange(range);
                    selectedText = selection.toString();
                }
                return selectedText;
            }
            module.exports = select;
        }, /* 3 */
        /***/
        function(module, exports) {
            function E() {}
            E.prototype = {
                on: function(name, callback, ctx) {
                    var e = this.e || (this.e = {});
                    (e[name] || (e[name] = [])).push({
                        fn: callback,
                        ctx: ctx
                    });
                    return this;
                },
                once: function(name, callback, ctx) {
                    var self = this;
                    function listener() {
                        self.off(name, listener);
                        callback.apply(ctx, arguments);
                    }
                    listener._ = callback;
                    return this.on(name, listener, ctx);
                },
                emit: function(name) {
                    var data = [].slice.call(arguments, 1);
                    var evtArr = ((this.e || (this.e = {}))[name] || []).slice();
                    var i = 0;
                    var len = evtArr.length;
                    for (i; i < len; i++) {
                        evtArr[i].fn.apply(evtArr[i].ctx, data);
                    }
                    return this;
                },
                off: function(name, callback) {
                    var e = this.e || (this.e = {});
                    var evts = e[name];
                    var liveEvents = [];
                    if (evts && callback) {
                        for (var i = 0, len = evts.length; i < len; i++) {
                            if (evts[i].fn !== callback && evts[i].fn._ !== callback) liveEvents.push(evts[i]);
                        }
                    }
                    // Remove event from queue to prevent memory leak
                    // Suggested by https://github.com/lazd
                    // Ref: https://github.com/scottcorgan/tiny-emitter/commit/c6ebfaa9bc973b33d110a84a307742b7cf94c953#commitcomment-5024910
                    liveEvents.length ? e[name] = liveEvents : delete e[name];
                    return this;
                }
            };
            module.exports = E;
        }, /* 4 */
        /***/
        function(module, exports, __webpack_require__) {
            var is = __webpack_require__(5);
            var delegate = __webpack_require__(6);
            /**
 * Validates all params and calls the right
 * listener function based on its target type.
 *
 * @param {String|HTMLElement|HTMLCollection|NodeList} target
 * @param {String} type
 * @param {Function} callback
 * @return {Object}
 */
            function listen(target, type, callback) {
                if (!target && !type && !callback) {
                    throw new Error("Missing required arguments");
                }
                if (!is.string(type)) {
                    throw new TypeError("Second argument must be a String");
                }
                if (!is.fn(callback)) {
                    throw new TypeError("Third argument must be a Function");
                }
                if (is.node(target)) {
                    return listenNode(target, type, callback);
                } else if (is.nodeList(target)) {
                    return listenNodeList(target, type, callback);
                } else if (is.string(target)) {
                    return listenSelector(target, type, callback);
                } else {
                    throw new TypeError("First argument must be a String, HTMLElement, HTMLCollection, or NodeList");
                }
            }
            /**
 * Adds an event listener to a HTML element
 * and returns a remove listener function.
 *
 * @param {HTMLElement} node
 * @param {String} type
 * @param {Function} callback
 * @return {Object}
 */
            function listenNode(node, type, callback) {
                node.addEventListener(type, callback);
                return {
                    destroy: function() {
                        node.removeEventListener(type, callback);
                    }
                };
            }
            /**
 * Add an event listener to a list of HTML elements
 * and returns a remove listener function.
 *
 * @param {NodeList|HTMLCollection} nodeList
 * @param {String} type
 * @param {Function} callback
 * @return {Object}
 */
            function listenNodeList(nodeList, type, callback) {
                Array.prototype.forEach.call(nodeList, function(node) {
                    node.addEventListener(type, callback);
                });
                return {
                    destroy: function() {
                        Array.prototype.forEach.call(nodeList, function(node) {
                            node.removeEventListener(type, callback);
                        });
                    }
                };
            }
            /**
 * Add an event listener to a selector
 * and returns a remove listener function.
 *
 * @param {String} selector
 * @param {String} type
 * @param {Function} callback
 * @return {Object}
 */
            function listenSelector(selector, type, callback) {
                return delegate(document.body, selector, type, callback);
            }
            module.exports = listen;
        }, /* 5 */
        /***/
        function(module, exports) {
            /**
 * Check if argument is a HTML element.
 *
 * @param {Object} value
 * @return {Boolean}
 */
            exports.node = function(value) {
                return value !== undefined && value instanceof HTMLElement && value.nodeType === 1;
            };
            /**
 * Check if argument is a list of HTML elements.
 *
 * @param {Object} value
 * @return {Boolean}
 */
            exports.nodeList = function(value) {
                var type = Object.prototype.toString.call(value);
                return value !== undefined && (type === "[object NodeList]" || type === "[object HTMLCollection]") && "length" in value && (value.length === 0 || exports.node(value[0]));
            };
            /**
 * Check if argument is a string.
 *
 * @param {Object} value
 * @return {Boolean}
 */
            exports.string = function(value) {
                return typeof value === "string" || value instanceof String;
            };
            /**
 * Check if argument is a function.
 *
 * @param {Object} value
 * @return {Boolean}
 */
            exports.fn = function(value) {
                var type = Object.prototype.toString.call(value);
                return type === "[object Function]";
            };
        }, /* 6 */
        /***/
        function(module, exports, __webpack_require__) {
            var closest = __webpack_require__(7);
            /**
 * Delegates event to a selector.
 *
 * @param {Element} element
 * @param {String} selector
 * @param {String} type
 * @param {Function} callback
 * @param {Boolean} useCapture
 * @return {Object}
 */
            function _delegate(element, selector, type, callback, useCapture) {
                var listenerFn = listener.apply(this, arguments);
                element.addEventListener(type, listenerFn, useCapture);
                return {
                    destroy: function() {
                        element.removeEventListener(type, listenerFn, useCapture);
                    }
                };
            }
            /**
 * Delegates event to a selector.
 *
 * @param {Element|String|Array} [elements]
 * @param {String} selector
 * @param {String} type
 * @param {Function} callback
 * @param {Boolean} useCapture
 * @return {Object}
 */
            function delegate(elements, selector, type, callback, useCapture) {
                // Handle the regular Element usage
                if (typeof elements.addEventListener === "function") {
                    return _delegate.apply(null, arguments);
                }
                // Handle Element-less usage, it defaults to global delegation
                if (typeof type === "function") {
                    // Use `document` as the first parameter, then apply arguments
                    // This is a short way to .unshift `arguments` without running into deoptimizations
                    return _delegate.bind(null, document).apply(null, arguments);
                }
                // Handle Selector-based usage
                if (typeof elements === "string") {
                    elements = document.querySelectorAll(elements);
                }
                // Handle Array-like based usage
                return Array.prototype.map.call(elements, function(element) {
                    return _delegate(element, selector, type, callback, useCapture);
                });
            }
            /**
 * Finds closest match and invokes callback.
 *
 * @param {Element} element
 * @param {String} selector
 * @param {String} type
 * @param {Function} callback
 * @return {Function}
 */
            function listener(element, selector, type, callback) {
                return function(e) {
                    e.delegateTarget = closest(e.target, selector);
                    if (e.delegateTarget) {
                        callback.call(element, e);
                    }
                };
            }
            module.exports = delegate;
        }, /* 7 */
        /***/
        function(module, exports) {
            var DOCUMENT_NODE_TYPE = 9;
            /**
 * A polyfill for Element.matches()
 */
            if (typeof Element !== "undefined" && !Element.prototype.matches) {
                var proto = Element.prototype;
                proto.matches = proto.matchesSelector || proto.mozMatchesSelector || proto.msMatchesSelector || proto.oMatchesSelector || proto.webkitMatchesSelector;
            }
            /**
 * Finds the closest parent that matches a selector.
 *
 * @param {Element} element
 * @param {String} selector
 * @return {Function}
 */
            function closest(element, selector) {
                while (element && element.nodeType !== DOCUMENT_NODE_TYPE) {
                    if (typeof element.matches === "function" && element.matches(selector)) {
                        return element;
                    }
                    element = element.parentNode;
                }
            }
            module.exports = closest;
        } ]);
    });
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

define("dist/personalCenter/effect", [ "dist/application/checkLogin", "dist/application/api", "dist/application/method", "dist/application/app", "dist/application/element", "dist/application/template", "dist/application/extend", "dist/common/bilog", "base64", "dist/cmd-lib/util", "dist/report/config", "dist/report/init", "dist/report/handler", "dist/report/columns", "dist/application/helper", "//static3.iask.cn/resource/js/plugins/pc.iask.login.min" ], function(require, exports, module) {
    // var $ = require("$");
    var checkLogin = require("dist/application/checkLogin");
    var app = require("dist/application/app");
    var method = require("dist/application/method");
    //登录
    // $(".js-login").on("click", function () {
    //     checkLogin.notifyLoginInterface(function (data) {
    //         refreshTopBar(data);
    //     });
    // });
    $(".unLogin").on("click", function() {
        checkLogin.notifyLoginInterface(function(data) {
            refreshTopBar(data);
        });
    });
    $(".login-text").on("click", function() {
        checkLogin.notifyLoginInterface(function(data) {
            refreshTopBar(data);
        });
    });
    //透传
    $(".js-sync").on("click", function() {
        checkLogin.syncUserInfoInterface(function(data) {
            refreshTopBar(data);
        });
    });
    //退出登录
    // $(".js-logout").on("click", function () {
    //     checkLogin.ishareLogout();
    // });
    $(".btn-exit").on("click", function() {
        checkLogin.ishareLogout();
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
        } else if (data.userType == 1) {
            $target = $vip_status.find('p[data-type="3"]');
            $hasLogin.removeClass("user-con-vip");
            $target.show().siblings().hide();
        } else if (data.isVip == 0) {
            $hasLogin.removeClass("user-con-vip");
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
    };
    //是否登录
    isLogin();
    function isLogin(callback) {
        if (!method.getCookie("cuk")) {
            checkLogin.notifyLoginInterface(function(data) {
                refreshTopBar(data);
                callback();
            });
        } else {
            checkLogin.getLoginData(function(data) {
                refreshTopBar(data);
                callback();
            });
        }
    }
    return {
        refreshTopBar: refreshTopBar,
        isLogin: isLogin
    };
});

define("dist/personalCenter/menu", [], function(require, exports, module) {
    $(".personal-menu .menus-desc").click(function(e) {
        console.log(e);
        // console.log($(this).parent().siblings())
        // $(this).parent().siblings().hide()
        $(this).siblings().toggle();
    });
});

define("dist/personalCenter/dialog", [], function(require, exports, module) {
    var type = window.pageConfig && window.pageConfig.page.type;
    if (type == "myuploads") {}
    if (type == "mywallet") {
        $("#dialog-box").dialog({
            html: $("#mywallet-tip-dialog").html()
        }).open();
    }
    // $('#dialog-box').on('click','.submit-btn',function(e){
    // })
    $("#dialog-box").on("click", ".close-btn", function(e) {
        closeRewardPop();
    });
    $("#dialog-box").on("click", ".cancel-btn", function(e) {
        closeRewardPop();
    });
    function closeRewardPop() {
        $(".common-bgMask").hide();
        $(".detail-bg-mask").hide();
        $("#dialog-box").hide();
    }
    return {
        closeRewardPop: closeRewardPop
    };
});

define("dist/personalCenter/home", [ "swiper", "dist/common/recommendConfigInfo", "dist/application/method", "dist/application/api", "dist/personalCenter/effect", "dist/application/checkLogin", "dist/application/app", "dist/application/element", "dist/application/template", "dist/application/extend", "dist/common/bilog", "base64", "dist/cmd-lib/util", "dist/report/config", "dist/report/init", "dist/report/handler", "dist/report/columns", "dist/application/helper", "//static3.iask.cn/resource/js/plugins/pc.iask.login.min" ], function(require, exports, module) {
    require("swiper");
    var recommendConfigInfo = require("dist/common/recommendConfigInfo");
    var method = require("dist/application/method");
    var bannerTemplate = require("dist/common/template/swiper_tmp.html");
    var api = require("dist/application/api");
    var homeRecentlySee = require("dist/personalCenter/template/homeRecentlySee.html");
    var vipPrivilegeList = require("dist/personalCenter/template/vipPrivilegeList.html");
    var type = window.pageConfig && window.pageConfig.page.type;
    var isLogin = require("dist/personalCenter/effect").isLogin;
    if (type == "home") {
        isLogin(initData);
    }
    function initData() {
        getUserCentreInfo();
        getFileBrowsePage();
        getDownloadRecordList();
    }
    function getUserCentreInfo(callback) {
        $.ajax({
            url: api.user.getUserCentreInfo + "?scope=4",
            type: "GET",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function(res) {
                if (res.code == "0") {
                    console.log("getUserCentreInfo:", res);
                    // compilerTemplate(res.data)
                    $(".personal-center-menu .personal-profile .personal-img").attr("src", res.data.photoPicURL);
                    $(".personal-center-menu .personal-profile .personal-nickname .nickname").text(res.data.nickName);
                    $(".personal-center-menu .personal-profile .personal-id .id").text(res.data.id ? "用户ID:" + res.data.id : "用户ID:");
                    $(".personal-center-menu .personal-profile .personal-id .copy").attr("data-clipboard-text", res.data.id);
                    var isVipMaster = res.data.isVipMaster;
                    var volume = res.data.volume;
                    // 下载券数量
                    var aibeans = res.data.aibeans;
                    if (!isVipMaster) {
                        $(".personal-center-menu .personal-profile .personal-nickname .level-icon").hide();
                    }
                    if (volume) {
                        $(".personal-center-home .volume").text(volume ? volume : 0);
                    }
                    if (aibeans) {
                        $(".personal-center-home .aibeans").text(aibeans ? aibeans : 0);
                    }
                    callback && callback(res.data);
                } else {
                    $.toast({
                        text: res.msg || "查询用户信息失败",
                        delay: 3e3
                    });
                }
            },
            error: function(error) {
                console.log("getUserCentreInfo:", error);
            }
        });
    }
    function getFileBrowsePage() {
        //分页获取用户的历史浏览记录
        $.ajax({
            url: api.user.getFileBrowsePage,
            type: "POST",
            data: JSON.stringify({
                currentPage: 1,
                pageSize: 20
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function(res) {
                if (res.code == "0") {
                    console.log("getFileBrowsePage:", res);
                    // data.rows
                    if (res.data.rows && res.data.rows.length) {
                        var _homeRecentlySeeTemplate = template.compile(homeRecentlySee)({
                            flag: "recentlySee",
                            data: res.data.rows || []
                        });
                        $(".recently-see").html(_homeRecentlySeeTemplate);
                    } else {
                        $(".recently-see").hide();
                    }
                } else {
                    $(".recently-see").hide();
                    $.toast({
                        text: res.msg,
                        delay: 3e3
                    });
                }
            },
            error: function(error) {
                $(".recently-see").hide();
                console.log("getFileBrowsePage:", error);
            }
        });
    }
    function getDownloadRecordList() {
        //用户下载记录接口
        $.ajax({
            url: api.user.getDownloadRecordList,
            type: "POST",
            data: JSON.stringify({
                currentPage: 1,
                pageSize: 20
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function(res) {
                if (res.code == "0") {
                    console.log("getFileBrowsePage:", res);
                    // 复用模板,需要转换接口返回的key
                    var data = [];
                    if (res.data && res.data.rows.length) {
                        res.data.rows.forEach(function(item) {
                            data.push({
                                id: 1,
                                fileid: item.fid,
                                format: item.format,
                                totalPage: "",
                                name: item.title
                            });
                        });
                        var _homeRecentlySeeTemplate = template.compile(homeRecentlySee)({
                            flag: "recentlydownloads",
                            data: data || []
                        });
                        $(".recently-downloads").html(_homeRecentlySeeTemplate);
                    } else {
                        $(".recently-downloads").hide();
                    }
                } else {
                    $(".recently-downloads").hide();
                    $.toast({
                        text: res.msg,
                        delay: 3e3
                    });
                }
            },
            error: function(error) {
                $(".recently-downloads").hide();
                console.log("getFileBrowsePage:", error);
            }
        });
    }
    getBannerbyPosition();
    getMyVipRightsList();
    function getBannerbyPosition() {
        // PC_M_USER_banner
        $.ajax({
            url: api.recommend.recommendConfigInfo,
            type: "POST",
            data: JSON.stringify(recommendConfigInfo.personalCenterHome.pageIds),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function(res) {
                if (res.code == "0") {
                    res.data.forEach(function(item) {
                        // 匹配 组装数据
                        recommendConfigInfo.personalCenterHome.descs.forEach(function(desc) {
                            if (item.pageId == desc.pageId) {
                                desc.list = method.handleRecommendData(item.list);
                            }
                        });
                    });
                    console.log(recommendConfigInfo);
                    recommendConfigInfo.personalCenterHome.descs.forEach(function(k) {
                        if (k.list.length) {
                            if (k.pageId == "PC_M_USER_banner") {
                                // search-all-main-bottombanner
                                console.log("PC_M_USER_banner:", k.list);
                                var _bannerTemplate = template.compile(bannerTemplate)({
                                    topBanner: k.list,
                                    className: "personalCenter-home-swiper-container",
                                    hasDeleteIcon: true
                                });
                                $(".personal-center-home .advertisement").html(_bannerTemplate);
                                var mySwiper = new Swiper(".personalCenter-home-swiper-container", {
                                    direction: "horizontal",
                                    loop: true,
                                    loop: k.list.length > 1 ? true : false,
                                    autoplay: 3e3
                                });
                            }
                        }
                    });
                }
            }
        });
    }
    function getMyVipRightsList() {
        $.ajax({
            url: api.recommend.recommendConfigInfo,
            type: "POST",
            data: JSON.stringify(recommendConfigInfo.myVipRightsList.pageIds),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function(res) {
                if (res.code == "0") {
                    res.data.forEach(function(item) {
                        // 匹配 组装数据
                        recommendConfigInfo.myVipRightsList.descs.forEach(function(desc) {
                            if (item.pageId == desc.pageId) {
                                desc.list = method.handleRecommendData(item.list);
                            }
                        });
                    });
                    console.log(recommendConfigInfo);
                    recommendConfigInfo.myVipRightsList.descs.forEach(function(k) {
                        if (k.list.length) {
                            if (k.pageId == "PC_M_USER_vip") {
                                // search-all-main-bottombanner
                                console.log("PC_M_USER_vip:", k.list);
                                var _vipPrivilegeListHtml = template.compile(vipPrivilegeList)({
                                    list: k.list
                                });
                                $(".personal-center-home .vip-privilege-items-wrapper").html(_vipPrivilegeListHtml);
                            }
                        }
                    });
                }
            }
        });
    }
    return {
        getUserCentreInfo: getUserCentreInfo
    };
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

define("dist/personalCenter/template/homeRecentlySee.html", [], '  <!--home页面最近看过 最近下载-->\n        {{ if flag == \'recentlySee\' }}\n             <p class="recently-see-title">最近看过</p>\n        {{else}}\n                 <p class="recently-see-title">最近下载</p>\n        {{/if}}\n     \n        <ul class="recently-see-items">\n         {{each data}}\n             <li class="item">\n                <a class="item-link"  target="_blank" href={{\'/f/\'+ data[$index].fileid+\'.html\'}}>\n                <div class="item-link-left">\n                  <img class="item-link-left-img"  src="{{cdnUrl}}/images/detail/pic_data_normal.jpg" alt=""/>\n                 <span  class="item-link-left-icon ico-data {{\'ico-\'+ data[$index].format}}"  ><span>\n                </div>\n                <div class="item-link-right">\n                    <p class="item-link-right-desc">\n                                {{data[$index].name}}\n                            </p>\n                    <p class="item-link-right-other">\n                        {{ if data[$index].totalPage }}\n                             <span class="other-read">{{data[$index].totalPage}}页</span>\n                        {{/if}}\n                    </p>\n                </div>\n              </a> \n            </li>\n         {{/each}}   \n       </ul>');

define("dist/personalCenter/template/vipPrivilegeList.html", [], ' <ul class="vip-privilege-items">\n            {{each list}}\n                <li class="item">\n                     <img class="item-img" src="{{list[$index].imagUrl}}"/>\n                     <p class="item-desc">{{list[$index].copywriting1}}</p>\n                </li>\n            {{/each}}    \n</ul>');

define("dist/personalCenter/mycollectionAndDownLoad", [ "dist/application/method", "dist/application/api", "dist/personalCenter/effect", "dist/application/checkLogin", "dist/application/app", "dist/application/element", "dist/application/template", "dist/application/extend", "dist/common/bilog", "base64", "dist/cmd-lib/util", "dist/report/config", "dist/report/init", "dist/report/handler", "dist/report/columns", "dist/application/helper", "//static3.iask.cn/resource/js/plugins/pc.iask.login.min", "dist/personalCenter/home", "swiper", "dist/common/recommendConfigInfo" ], function(require, exports, module) {
    var method = require("dist/application/method");
    var api = require("dist/application/api");
    var mycollectionAndDownLoad = require("dist/personalCenter/template/mycollectionAndDownLoad.html");
    var simplePagination = require("dist/personalCenter/template/simplePagination.html");
    var isLogin = require("dist/personalCenter/effect").isLogin;
    var getUserCentreInfo = require("dist/personalCenter/home").getUserCentreInfo;
    var type = window.pageConfig && window.pageConfig.page.type;
    if (type == "mycollection" || type == "mydownloads") {
        isLogin(initData);
    }
    function initData() {
        if (type == "mycollection") {
            getUserCentreInfo();
            getUserFileList();
        } else if (type == "mydownloads") {
            getUserCentreInfo();
            getDownloadRecordList();
        }
    }
    function getDownloadRecordList(currentPage) {
        //用户下载记录接口
        $.ajax({
            url: api.user.getDownloadRecordList,
            type: "POST",
            data: JSON.stringify({
                currentPage: currentPage || 1,
                pageSize: 20
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function(res) {
                if (res.code == "0") {
                    console.log("getDownloadRecordList:", res);
                    var formatDate = method.formatDate;
                    Date.prototype.format = formatDate;
                    var list = [];
                    res.data.rows.forEach(function(item) {
                        var downloadTime = new Date(item.downloadTime).format("yyyy-MM-dd");
                        item.downloadTime = downloadTime;
                        item.fileId = item.id;
                        list.push(item);
                    });
                    var _mycollectionAndDownLoadTemplate = template.compile(mycollectionAndDownLoad)({
                        type: "mydownloads",
                        list: list || []
                    });
                    $(".personal-center-mydownloads").html(_mycollectionAndDownLoadTemplate);
                    handlePagination(res.data.totalPages, res.data.currentPage, "mycollection");
                } else {
                    $.toast({
                        text: res.msg,
                        delay: 3e3
                    });
                }
            },
            error: function(error) {
                console.log("getDownloadRecordList:", error);
            }
        });
    }
    function getUserFileList(pageNumber) {
        // 查询个人收藏列表
        pageNumber = 1;
        $.ajax({
            url: api.user.getUserFileList + "?pageNumber=" + pageNumber + "&pageSize=20&sidx=0&order=-1",
            type: "GET",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function(res) {
                if (res.code == "0") {
                    console.log("getUserFileList:", res);
                    // 复用我的下载模板,需要处理接口的字段
                    var formatDate = method.formatDate;
                    Date.prototype.format = formatDate;
                    var list = [];
                    res.data.rows.forEach(function(item) {
                        var collectTime = new Date(item.collectTime).format("yyyy-MM-dd");
                        var temp = {
                            format: item.format,
                            title: item.title,
                            fileId: item.fileId,
                            downloadTime: collectTime
                        };
                        list.push(temp);
                    });
                    var _mycollectionAndDownLoadTemplate = template.compile(mycollectionAndDownLoad)({
                        type: "mycollection",
                        list: list || []
                    });
                    $(".personal-center-mycollection").html(_mycollectionAndDownLoadTemplate);
                    handlePagination(res.data.totalPages, res.data.currentPage, "mydownloads");
                } else {
                    $.toast({
                        text: res.msg,
                        delay: 3e3
                    });
                }
            },
            error: function(error) {
                console.log("getUserFileList:", error);
            }
        });
    }
    // 分页
    function handlePagination(totalPages, currentPage, flag) {
        var _simplePaginationTemplate = template.compile(simplePagination)({
            paginationList: new Array(totalPages || 0),
            currentPage: currentPage
        });
        $(".pagination-wrapper").html(_simplePaginationTemplate);
        $(".pagination-wrapper").on("click", ".page-item", function(e) {
            var paginationCurrentPage = $(this).attr("data-currentPage");
            if (!paginationCurrentPage) {
                return;
            }
            if (flag == "mydownloads") {
                // 点击分页后重新请求数据
                getUserFileList(paginationCurrentPage);
            }
            if (flag == "mycollection") {
                getDownloadRecordList(paginationCurrentPage);
            }
        });
    }
});

define("dist/personalCenter/template/mycollectionAndDownLoad.html", [], '<div class="mycollection-anddownLoad">\n   <p class="title">\n       {{ if type == \'mycollection\' }}\n        <span class="title-desc">我的收藏</span>\n        <span class="file-num">25609篇</span>\n        {{else if type ==\'mydownloads\'}}\n             <span class="title-desc">我的下载</span>\n             <span class="file-num">25609篇</span>\n        {{/if}}\n   </p>\n   <table class="table-list">\n  <tr class="table-title">\n     {{ if type == \'mycollection\' }}\n    <th  class="file-title">资料标题</th>\n    <th  class="action-time">收藏时间</th>\n  {{else if type ==\'mydownloads\'}}\n      <th  class="file-title">资料标题</th>\n      <th  class="action-time">下载时间</th>\n  {{/if}}\n  </tr>\n\n  <tr class="table-item">\n     \n    {{if list.length>0}}\n    \n    {{ each list}}\n          <tr class="table-item">\n             <td class="file-content">\n                <a  target="_blank" href={{\'/f/\'+ list[$index].fileId+\'.html\'}}>\n                <span class="file-type ico-data {{\'ico-\'+ list[$index].format}}"></span>\n                <p class="file-name">{{list[$index].title}}</p>\n                </a>\n             </td>\n    <td class="operation-time">\n       <span>{{list[$index].downloadTime}}</span> \n    </td>\n  </tr>\n\n    {{/each}}\n\n    {{ else}}\n     <div class="empty-data">\n          <img class="empty-img" src="{{cdnUrl}}/images/personalCenter/mycollection-empty-data.png"/>\n          <p class="empty-desc">空空如也~</p>\n     </div>\n    {{/if}}\n</table> \n\n<div class="pagination-wrapper">\n        \n    </div>\n</div>');

define("dist/personalCenter/template/simplePagination.html", [], '{{ if paginationList.length >1}}\n  <ul class="page-list pagination">\n        <li class="page-item first" data-currentPage="1">首页</li>\n        {{if currentPage>1}}\n        <li class="page-item prev" data-currentPage={{currentPage-1}}>上一页</li> \n        {{/if}}\n        {{ if paginationList.length>1}}\n            {{each paginationList}}\n                {{if $index >0}}\n                     {{ if $index<+currentPage+3 }}\n                   {{if $index>=currentPage-3}}\n                          {{if currentPage == $index}}\n                                   <li class=\'page-item active\'  data-currentPage={{$index}}>\n                                       {{$index}}\n                                    </li>\n                          {{else}}\n                                <li class=\'page-item\' data-currentPage={{$index}}>\n                                       {{$index}}\n                                </li>\n                          {{/if}}\n                   {{/if}}\n               {{ /if }}\n                {{/if}}\n           {{/each}}\n\n           {{if currentPage <= paginationList.length -3}}\n                <li class="page-more page-item">...</li>\n           {{/if}}\n           <li class="page-item" data-currentPage={{+currentPage+1}}>下一页</li>\n           <li class="page-item" data-currentPage={{paginationList.length-1}}>尾页</li>\n        {{/if}}  \n  </ul>\n\n{{/if}}');

define("dist/personalCenter/myuploads", [ "dist/application/method", "dist/application/api", "dist/personalCenter/effect", "dist/application/checkLogin", "dist/application/app", "dist/application/element", "dist/application/template", "dist/application/extend", "dist/common/bilog", "base64", "dist/cmd-lib/util", "dist/report/config", "dist/report/init", "dist/report/handler", "dist/report/columns", "dist/application/helper", "//static3.iask.cn/resource/js/plugins/pc.iask.login.min", "dist/personalCenter/home", "swiper", "dist/common/recommendConfigInfo" ], function(require, exports, module) {
    var method = require("dist/application/method");
    var type = window.pageConfig && window.pageConfig.page.type;
    var api = require("dist/application/api");
    var myuploads = require("dist/personalCenter/template/myuploads.html");
    var simplePagination = require("dist/personalCenter/template/simplePagination.html");
    var isLogin = require("dist/personalCenter/effect").isLogin;
    var getUserCentreInfo = require("dist/personalCenter/home").getUserCentreInfo;
    var idList = [];
    // 保存 要删除的文件id
    if (type == "myuploads") {
        isLogin(initData);
    }
    function initData() {
        getUserCentreInfo();
        getMyUploadPage();
    }
    function getMyUploadPage(currentPage) {
        // 分页查询我的上传
        var status = method.getParam("myuploadType") || 1;
        $.ajax({
            url: api.user.getMyUploadPage,
            type: "POST",
            data: JSON.stringify({
                currentPage: currentPage || 1,
                pageSize: 20,
                status: +status
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function(res) {
                if (res.code == "0") {
                    console.log("getMyUploadPage:", res);
                    var formatDate = method.formatDate;
                    Date.prototype.format = formatDate;
                    var list = [];
                    res.data.rows.forEach(function(item) {
                        var userFilePrice = "";
                        if (item.userFileType == 1) {
                            userFilePrice = "免费";
                        }
                        if (item.userFileType == 4) {
                            userFilePrice = userFilePrice + "个特权";
                        }
                        if (item.userFileType == 5) {
                            userFilePrice = (userFilePrice / 100).toFixed(2) + "元";
                        }
                        var createtime = new Date(item.createtime).format("yyyy-MM-dd");
                        item.createtime = createtime;
                        list.push(item);
                    });
                    var myuploadType = window.pageConfig.page && window.pageConfig.page.myuploadType || 1;
                    var _myuploadsTemplate = template.compile(myuploads)({
                        list: list || [],
                        totalPages: res.data.totalSize,
                        myuploadType: myuploadType
                    });
                    $(".personal-center-myuploads").html(_myuploadsTemplate);
                    handlePagination(res.data.totalSize, res.data.currentPage);
                } else {
                    $.toast({
                        text: res.msg,
                        delay: 3e3
                    });
                }
            },
            error: function(error) {
                console.log("getMyUploadPage:", error);
            }
        });
    }
    function handlePagination(totalPages, currentPage) {
        var _simplePaginationTemplate = template.compile(simplePagination)({
            paginationList: new Array(totalPages || 0),
            currentPage: currentPage
        });
        $(".pagination-wrapper").html(_simplePaginationTemplate);
        $(".pagination-wrapper").on("click", ".page-item", function(e) {
            var paginationCurrentPage = $(this).attr("data-currentPage");
            if (!paginationCurrentPage) {
                return;
            }
            getMyUploadPage(paginationCurrentPage);
        });
    }
    // 
    $(document).on("click", ".myuploads-table-list .label-input", function(event) {
        // 切换checkbox选中的状态样式
        console.log($(this).attr("checked"));
        if ($(this).attr("checked")) {
            // checked
            $(this).parent().parent().parent().addClass("table-item-active");
        } else {
            $(this).parent().parent().parent().removeClass("table-item-active");
            $(".myuploads-table-list #all").attr("checked", false);
        }
    });
    $(document).on("click", ".delete-icon", function(event) {
        // 删除选中的文件  可能是全选
        var isChecked = $(this).parent().parent().find(".label-input").attr("checked");
        // var isCheckedAll = $('.myuploads-table-list #all').attr('checked')
        var deleteType = $(this).attr("data-deleteType");
        console.log("isChecked:", isChecked);
        if (isChecked && !deleteType) {
            // 单个删除   $(this).attr('data-id') 有值
            idList.push($(this).attr("data-id"));
            $("#dialog-box").dialog({
                html: $("#myuploads-delete-dialog").html()
            }).open();
            return;
        }
        if (deleteType == "deleteSome" && $(".myuploads-table-list input:checked").length > 0) {
            // 不一定是全部删除,是删除选中的
            $(".myuploads-table-list input:checked").each(function(i) {
                idList.push($(this).attr("id"));
            });
            console.log("idList:", idList);
            console.log("全部删除");
            $("#dialog-box").dialog({
                html: $("#myuploads-delete-dialog").html()
            }).open();
            return;
        }
    });
    $("#dialog-box").on("click", ".delete-tip-dialog .confirm-btn", function(e) {
        batchDeleteUserFile();
    });
    $(document).on("click", ".myuploads-table-list #all", function(event) {
        // 全选
        console.log($(this).attr("checked"));
        // .attr("checked", 'checked')
        if ($(this).attr("checked")) {
            $(".myuploads-table-list .label-input").attr("checked", "checked");
        } else {
            $(".myuploads-table-list .label-input").attr("checked", false);
        }
    });
    function batchDeleteUserFile() {
        $.ajax({
            url: api.upload.batchDeleteUserFile,
            type: "POST",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(idList),
            dataType: "json",
            success: function(res) {
                if (res.code == "0") {
                    console.log("batchDeleteUserFile:", res);
                    $.toast({
                        text: "删除成功!",
                        delay: 3e3
                    });
                    closeRewardPop();
                    idList = [];
                    getMyUploadPage();
                } else {
                    $.toast({
                        text: res.msg,
                        delay: 3e3
                    });
                }
            },
            error: function(error) {
                console.log("batchDeleteUserFile:", error);
            }
        });
    }
    function closeRewardPop() {
        $(".common-bgMask").hide();
        $(".detail-bg-mask").hide();
        $("#dialog-box").hide();
    }
});

define("dist/personalCenter/template/myuploads.html", [], '<div class="myuploads">\n     <p class="myuploads-title">\n        <span class="title-desc">我的上传</span>\n        <span class="file-num">25609篇</span>\n    </p>\n    <ul class="myuploads-tabs tabs" >\n        <li  class="{{ myuploadType == \'1\' ? \'tab-active tab\':\'tab\'}}"><a href="/node/personalCenter/myuploads.html?myuploadType=1">公开资料</a></li>\n        <li class="{{ myuploadType == \'2\' ? \'tab-active tab\' :\'tab\'}}"><a href="/node/personalCenter/myuploads.html?myuploadType=2">付费资料</a></li>\n        <li class="{{ myuploadType == \'3\' ? \'tab-active tab\' :\'tab\'}}"><a href="/node/personalCenter/myuploads.html?myuploadType=3">私有资料</a></li>\n        <li class="{{ myuploadType == \'4\' ? \'tab-active tab\' :\'tab\'}}"><a href="/node/personalCenter/myuploads.html?myuploadType=4">审核中</a></li>\n        <li class="{{ myuploadType == \'5\' ? \'tab-active tab\' :\'tab\'}}"><a href="/node/personalCenter/myuploads.html?myuploadType=5">未通过</a></li>\n    </ul>\n    <label class="table-title" >\n      <img class="delete-icon" data-deleteType=\'deleteSome\' src="{{cdnUrl}}/images/personalCenter/delete-icon.png">\n      <span class="delete-desc">删除</span>\n      <span class="myuploads-nums">{{totalPages}}篇</span>\n    </label>\n    <table class="myuploads-table-list">\n        <tr class="myuploads-table-head">\n            <th>\n                <label for="all">\n                   <input  type="checkbox"  id="all" value="all"/>\n                   <span></span>\n                   <span>资料标题</span>\n                </label>\n            </th>\n              <th style="width:100px;"></th>\n            <th style="width:100px;">价格</th>\n            <th style="width:100px;">浏览量</th>\n            <th style="width:100px;">下载量</th>\n            <th style="width:100px;">上传时间</th>\n        </tr>\n          {{each list}}\n                <tr class="table-item">\n            <td>\n                <label for={{list[$index].id}} class="label">\n                    <input id={{list[$index].id}} type="checkbox" class="label-input"/>\n                    <span></span>\n                    <span  class="file-icon ico-data {{\'ico-\'+ list[$index].format}}"></span>\n                    <span class="file-title">{{list[$index].title}}</span>\n                </label>\n            </td>\n             <td><img class="delete-icon" data-id={{list[$index].id}} src="{{cdnUrl}}/images/personalCenter/delete-icon.png"></td>\n            <td>{{list[$index].userFilePrice}}</td>\n            <td>{{list[$index].readNum}}</td>\n            <td>{{list[$index].downNum}}</td>\n            <td>{{list[$index].createtime}}</td>\n        </tr>\n          {{/each}}\n    </table>\n    <div class="pagination-wrapper">\n        \n    </div>\n</div>');

define("dist/personalCenter/myvip", [ "dist/application/method", "dist/common/recommendConfigInfo", "dist/application/api", "dist/personalCenter/effect", "dist/application/checkLogin", "dist/application/app", "dist/application/element", "dist/application/template", "dist/application/extend", "dist/common/bilog", "base64", "dist/cmd-lib/util", "dist/report/config", "dist/report/init", "dist/report/handler", "dist/report/columns", "dist/application/helper", "//static3.iask.cn/resource/js/plugins/pc.iask.login.min", "dist/personalCenter/home", "swiper" ], function(require, exports, module) {
    var type = window.pageConfig && window.pageConfig.page.type;
    var vipTableType = window.pageConfig.page && window.pageConfig.page.vipTableType || 0;
    var method = require("dist/application/method");
    var bannerTemplate = require("dist/common/template/swiper_tmp.html");
    var vipPrivilegeList = require("dist/personalCenter/template/vipPrivilegeList.html");
    var simplePagination = require("dist/personalCenter/template/simplePagination.html");
    var recommendConfigInfo = require("dist/common/recommendConfigInfo");
    var api = require("dist/application/api");
    var isLogin = require("dist/personalCenter/effect").isLogin;
    var getUserCentreInfo = require("dist/personalCenter/home").getUserCentreInfo;
    if (type == "myvip") {
        isLogin(initData);
    }
    function initData() {
        getUserCentreInfo(getUserCentreInfoCallback);
    }
    function getUserCentreInfoCallback(userInfo) {
        var myvip = require("dist/personalCenter/template/myvip.html");
        var _myvipTemplate = template.compile(myvip)({
            userInfo: userInfo,
            vipTableType: vipTableType
        });
        $(".personal-center-vip").html(_myvipTemplate);
        getBannerbyPosition();
        getMyVipRightsList();
        if (vipTableType == "0") {
            getMemberPointRecord();
        } else {
            getBuyRecord();
        }
    }
    function getMemberPointRecord(currentPage) {
        // 查询用户特权等记录流水
        $.ajax({
            url: api.coupon.getMemberPointRecord,
            type: "POST",
            data: JSON.stringify({
                currentPage: currentPage || 1,
                pageSize: 20,
                memberCode: "PREVILEGE_NUM"
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function(res) {
                if (res.code == "0") {
                    console.log("getMemberPointRecord:", res);
                    var vipTable = require("dist/personalCenter/template/vipTable.html");
                    var vipTableType = window.pageConfig.page && window.pageConfig.page.vipTableType || 0;
                    var list = res.data && res.data.rows || [];
                    var isVip = method.getCookie("ui") ? JSON.parse(method.getCookie("ui")).isVip : "";
                    var _vipTableTemplate = template.compile(vipTable)({
                        list: list || [],
                        isVip: isVip,
                        vipTableType: vipTableType
                    });
                    $(".vip-table-wrapper").html(_vipTableTemplate);
                    handlePagination(res.data.totalPages, res.data.currentPage);
                } else {
                    $.toast({
                        text: res.msg,
                        delay: 3e3
                    });
                }
            },
            error: function(error) {
                console.log("getMemberPointRecord:", error);
            }
        });
    }
    function getBuyRecord(currentPage) {
        // 查询用户充值权益记录
        $.ajax({
            url: api.coupon.getBuyRecord,
            type: "POST",
            data: JSON.stringify({
                currentPage: currentPage || 1,
                pageSize: 20
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function(res) {
                if (res.code == "0") {
                    console.log("getBuyRecord:", res);
                    var vipTable = require("dist/personalCenter/template/vipTable.html");
                    var vipTableType = window.pageConfig.page && window.pageConfig.page.vipTableType || 0;
                    var list = res.data && res.data.rows || [];
                    var isVip = method.getCookie("ui") ? JSON.parse(method.getCookie("ui")).isVip : "";
                    var _vipTableTemplate = template.compile(vipTable)({
                        list: list,
                        isVip: isVip,
                        vipTableType: vipTableType
                    });
                    $(".vip-table-wrapper").html(_vipTableTemplate);
                    handlePagination(res.data.totalPages, res.data.currentPage);
                } else {
                    $.toast({
                        text: res.msg,
                        delay: 3e3
                    });
                }
            },
            error: function(error) {
                console.log("getBuyRecord:", error);
            }
        });
    }
    function handlePagination(totalPages, currentPage) {
        var _simplePaginationTemplate = template.compile(simplePagination)({
            paginationList: new Array(totalPages || 0),
            currentPage: currentPage
        });
        $(".pagination-wrapper").html(_simplePaginationTemplate);
        $(".pagination-wrapper").on("click", ".page-item", function(e) {
            var paginationCurrentPage = $(this).attr("data-currentPage");
            if (!paginationCurrentPage) {
                return;
            }
            if (vipTableType == "0") {
                getMemberPointRecord(paginationCurrentPage);
            } else {
                getBuyRecord(paginationCurrentPage);
            }
        });
    }
    function getBannerbyPosition() {
        // PC_M_USER_banner
        $.ajax({
            url: api.recommend.recommendConfigInfo,
            type: "POST",
            data: JSON.stringify(recommendConfigInfo.myVipRightsBanner.pageIds),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function(res) {
                if (res.code == "0") {
                    res.data.forEach(function(item) {
                        // 匹配 组装数据
                        recommendConfigInfo.myVipRightsBanner.descs.forEach(function(desc) {
                            if (item.pageId == desc.pageId) {
                                desc.list = method.handleRecommendData(item.list);
                            }
                        });
                    });
                    console.log(recommendConfigInfo);
                    recommendConfigInfo.myVipRightsBanner.descs.forEach(function(k) {
                        if (k.list.length) {
                            if (k.pageId == "PC_M_USER_VIP_banner") {
                                // search-all-main-bottombanner
                                console.log("PC_M_USER_VIP_banner:", k.list);
                                var _bannerTemplate = template.compile(bannerTemplate)({
                                    topBanner: k.list,
                                    className: "personalCenter-myvip-swiper-container"
                                });
                                $(".myvip .advertisement").html(_bannerTemplate);
                                var mySwiper = new Swiper(".personalCenter-myvip-swiper-container", {
                                    direction: "horizontal",
                                    loop: true,
                                    loop: k.list.length > 1 ? true : false,
                                    autoplay: 3e3
                                });
                            }
                        }
                    });
                }
            }
        });
    }
    function getMyVipRightsList() {
        $.ajax({
            url: api.recommend.recommendConfigInfo,
            type: "POST",
            data: JSON.stringify(recommendConfigInfo.myVipRightsList.pageIds),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function(res) {
                if (res.code == "0") {
                    res.data.forEach(function(item) {
                        // 匹配 组装数据
                        recommendConfigInfo.myVipRightsList.descs.forEach(function(desc) {
                            if (item.pageId == desc.pageId) {
                                desc.list = method.handleRecommendData(item.list);
                            }
                        });
                    });
                    console.log(recommendConfigInfo);
                    recommendConfigInfo.myVipRightsList.descs.forEach(function(k) {
                        if (k.list.length) {
                            if (k.pageId == "PC_M_USER_vip") {
                                // search-all-main-bottombanner
                                console.log("PC_M_USER_vip:", k.list);
                                var _vipPrivilegeListHtml = template.compile(vipPrivilegeList)({
                                    list: k.list
                                });
                                $(".myvip .vip-privilege-wrapper").html(_vipPrivilegeListHtml);
                            }
                        }
                    });
                }
            }
        });
    }
});

define("dist/personalCenter/template/myvip.html", [], '<div class="myvip">\n    <div class="myvip-top">\n            <p class="myvip-title">我的VIP</p>\n            {{ if userInfo.isVip == \'0\'}}\n                    <div class="not-vip">\n                <div class="not-vip-left">\n                   <p class="not-vip-left-title">你还不是VIP</p>\n                   <p class="not-vip-top-left-subtitle">开通VIP，享专属特权，下海量资料 </p>\n                </div>\n            <div class="not-vip-right">开通VIP>></div>\n            <div class="vip-privilege-items-wrapper"></div>\n           </div>\n\n            {{else}}\n\n            <div class="vip-summary">\n                <p class="vip-summary-title">\n                   <span class="vip-summary-icon"></span>\n                   <span>爱问共享资料VIP </span>\n                </p>\n               <p class="vip-summary-subtitle">\n                   <span>剩余{{userInfo.privilege}}个特权 </span>\n                   <span>{{userInfo.expireTime}}到期</span>\n              </p>\n           </div>\n            {{/if}}\n        <div class="vip-privilege-wrapper"></div>    \n    </div>\n<div class="my-vip-middle advertisement"></div> \n <div class="vip-table-wrapper"></div>\n<div class="pagination-wrapper"></div>\n</div>');

define("dist/personalCenter/template/vipTable.html", [], "<div class=\"my-vip-bottom\">\n          <ul class=\"myvip-tabs\" >\n           <li class=\"{{vipTableType == '0'?'tab tab-active':'tab'}}\"><a href=\"/node/personalCenter/vip.html?vipTableType=0\">我的下载特权</a></li>\n           <li  class=\"{{vipTableType == '1'?'tab tab-active':'tab'}}\"><a href=\"/node/personalCenter/vip.html?vipTableType=1\">会员充值记录</a></li>\n        </ul>  \n\n\n\n        {{ if  isVip == '1'}}\n        {{if vipTableType == '0'}}\n         <table class=\"privilege-table table\">\n                 <tr class=\"privilege-table-title table-head\">\n                         <th>获取渠道</th>\n                         <th>状态</th>\n                         <th>未使用</th>\n                        <th>已使用</th>\n                       <th>有效期</th>\n                      <th>使用范围</th>\n                 </tr>\n                 {{each list}}\n                     <tr>\n                               <td>\n                                {{if list[$index].voluChannel == '5'}}\n                                    <span>系统赠送</span>\n                                {{/if }}\n                                 {{if list[$index].voluChannel == '17'}}\n                                    <span>直接购买</span>\n                                {{/if }}\n                                 {{if list[$index].voluChannel == '18'}}\n                                    <span>购买VIP套餐赠送</span>\n                                {{/if }}\n                                </td>\n\n                                <td>\n                                {{if list[$index].status == '0'}}\n                                        <span>可使用</span>\n                                {{/if}}\n\n                                 {{if list[$index].status == '1'}}\n                                        <span>已过期</span>\n                                {{/if}}\n                                {{if list[$index].status == '2'}}\n                                        <span>已删除</span>\n                                {{/if}}\n                                 {{if list[$index].status == '3'}}\n                                        <span>冻结中</span>\n                                {{/if}}\n\n                                {{if list[$index].status =='4'}}\n                                        <span>已失效</span>\n                                {{/if}}\n                        \n                               </td>\n                          \n                                <td>{{list[$index].downVouNoUseNum}}</td>\n                               <td>{{list[$index].downVouUsedNum}}</td>\n                              <td>{{list[$index].effectiveStartDate}}至{{list[$index].effectiveEndDate}}</td> \n\n\n                               <td>\n                                {{if list[$index].site  == '0'}}\n                                        <span>爱问办公</span>                                        \n                                {{/if}}\n\n                                {{if list[$index].site =='3'}}\n                                        <span>爱问办公;爱问共享资料</span>\n                                {{/if}}\n\n                                {{if list[$index].site == '4'}}\n                                        <span>爱问共享资料</span>\n                                {{/if}}\n                               </td> \n                     </tr> \n                 {{/each}}\n          </table>\n          {{/if}}\n\n\n\n\n           {{if vipTableType == '1'}}\n                <table class=\"vip-table table\">\n                       <tr class=\"vip-table-head table-head\">\n                           <th>会员名称</th>\n                           <th>状态</th>\n                            <th>有效期</th>\n                            <th>使用范围</th>\n                            <th>权益</th>\n                        </tr>\n                      {{each list}}\n                                   <tr>\n                                     <td>{{list[$index].vipName}}</td>\n                                     <td>\n                                         {{if list[$index].status == '1'}}\n                                               <span>未使用</span>\n                                         {{/if}}\n                                         {{if list[$index].status == '2'}}\n                                               <span>使用中</span>\n                                         {{/if}}\n                                         {{if list[$index].status == '3'}}\n                                               <span>已过期</span>\n                                         {{/if}}\n                                         {{if list[$index].status == '4'}}\n                                               <span>已退款</span>\n                                         {{/if}}\n                                         {{if list[$index].status == '5'}}\n                                               <span>冻结</span>\n                                         {{/if}}\n                                     </td>\n                                     <td>{{list[$index].beginDate}}至{{list[$index].endDate}}</td>\n                                    <td>\n                                        {{if list[$index].site  == '0'}}\n                                        <span>爱问办公</span>                                        \n                                       {{/if}}\n                                        {{if list[$index].site =='3'}}\n                                        <span>爱问办公;爱问共享资料</span>\n                                      {{/if}}\n                                       {{if list[$index].site == '4'}}\n                                        <span>爱问共享资料</span>\n                                      {{/if}} \n                                    </td>\n                                    <td>{{list[$index].memberContent}}</td>\n                                   </tr>\n                      {{/each}}\n              </table>\n         {{/if}}\n         \n{{/if}}   \n</div>");

define("dist/personalCenter/mycoupon", [ "dist/application/api", "dist/application/method", "dist/personalCenter/effect", "dist/application/checkLogin", "dist/application/app", "dist/application/element", "dist/application/template", "dist/application/extend", "dist/common/bilog", "base64", "dist/cmd-lib/util", "dist/report/config", "dist/report/init", "dist/report/handler", "dist/report/columns", "dist/application/helper", "//static3.iask.cn/resource/js/plugins/pc.iask.login.min", "dist/personalCenter/home", "swiper", "dist/common/recommendConfigInfo" ], function(require, exports, module) {
    var api = require("dist/application/api");
    var method = require("dist/application/method");
    var type = window.pageConfig && window.pageConfig.page.type;
    var simplePagination = require("dist/personalCenter/template/simplePagination.html");
    var isLogin = require("dist/personalCenter/effect").isLogin;
    var getUserCentreInfo = require("dist/personalCenter/home").getUserCentreInfo;
    if (type == "mycoupon") {
        isLogin(initData);
    }
    function initData() {
        getUserCentreInfo();
        rightsSaleQueryUsing();
    }
    function rightsSaleQueryUsing(pageNumber) {
        type = method.getParam("mycouponType") || 0;
        pageNumber = pageNumber || 1;
        $.ajax({
            // url: api.coupon.queryUsing + '?type=' + type?type:0 + '&cuk=d476d0ef8266997b520ad99638a21d0073827bcbfc6c4616d29ee61005b28931&pageNumber='+ pageNumber?pageNumber:0 + '&pageSize=10',
            url: api.coupon.queryUsing + "?type=" + type + "&pageNumber=" + pageNumber + "&pageSize=20",
            type: "GET",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function(res) {
                if (res.code == "0") {
                    console.log("rightsSaleQueryUsing:", res.data && res.data.list);
                    var list = res.data.list;
                    var mycoupon = require("dist/personalCenter/template/mycoupon.html");
                    var _mycouponTemplate = template.compile(mycoupon)({
                        list: list || [],
                        mycouponType: type || "0"
                    });
                    $(".personal-center-mycoupon").html(_mycouponTemplate);
                    handlePagination(res.data.totalPages, res.data.pageNumber);
                } else {
                    $.toast({
                        text: res.msg,
                        delay: 3e3
                    });
                }
            },
            error: function(error) {
                console.log("rightsSaleQueryUsing:", error);
            }
        });
    }
    function handlePagination(totalPages, currentPage) {
        var _simplePaginationTemplate = template.compile(simplePagination)({
            paginationList: new Array(totalPages || 0),
            currentPage: currentPage
        });
        $(".pagination-wrapper").html(_simplePaginationTemplate);
        $(".pagination-wrapper").on("click", ".page-item", function(e) {
            var paginationCurrentPage = $(this).attr("data-currentPage");
            if (!paginationCurrentPage) {
                return;
            }
            rightsSaleQueryUsing(paginationCurrentPage);
        });
    }
});

define("dist/personalCenter/template/mycoupon.html", [], '<div>\n    <p class="mycoupon-title">我的优惠券</p>\n    <ul class="mycoupon-tabs">\n        <li class="{{mycouponType == 0?\'tab tab-active\':\'tab\'}}"><a href="/node/personalCenter/mycoupon.html?mycouponType=0">未使用</a></li>\n        <li class="{{mycouponType == 1?\'tab tab-active\':\'tab\'}}"><a href="/node/personalCenter/mycoupon.html?mycouponType=1">已使用</a></li>\n        <li class="{{mycouponType == 2?\'tab tab-active\':\'tab\'}}"><a href="/node/personalCenter/mycoupon.html?mycouponType=2">已过期</a></li>\n    </ul>\n\n    <ul class="mycoupon-list">   \n        {{each list}}\n                  <li  class="{{mycouponType == 0 ?\'item coupon-unuse\':mycouponType == 1?\'item coupon-expiringsoon\':mycouponType ==2?\'item coupon-used\':\'item\'}}">\n                     {{if list[$index].type ==1}}\n                          <p class="item-price">¥ <span>{{list[$index].couponAmount}}</span></p>\n                     {{/if}}\n                     {{ if list[$index].type == 2}}\n                           <p class="item-price"><span>{{list[$index].discount}}</p>\n                     {{/if}}\n                     <p class="item-desc">{{list[$index].content}}</p>\n                     <p class="item-time">{{list[$index].beginDate}}-{{list[$index].endDate}}</p>\n                     <span class="item-icon fr">\n                         <div class="item-explain">\n                            <p class="item-explain-title">使用说明</p>\n                            <p class="item-explain-desc">{{list[$index].describe}} </p>\n                           </div>\n                  </span>\n        </li>\n        {{/each}}\n    </ul>\n\n\n    {{if list.length<=0}}\n          <div class="empty-data">\n            <img class="empty-img" src="{{cdnUrl}}/images/personalCenter/coupon-empty-data.png"/>\n            <p class="empty-desc">你还没有优惠券哦~</p>\n          </div>\n    {{/if}}\n      <div class="pagination-wrapper">\n        \n    </div>\n</div>');

define("dist/personalCenter/myorder", [ "dist/application/method", "dist/application/api", "dist/personalCenter/effect", "dist/application/checkLogin", "dist/application/app", "dist/application/element", "dist/application/template", "dist/application/extend", "dist/common/bilog", "base64", "dist/cmd-lib/util", "dist/report/config", "dist/report/init", "dist/report/handler", "dist/report/columns", "dist/application/helper", "//static3.iask.cn/resource/js/plugins/pc.iask.login.min", "dist/personalCenter/home", "swiper", "dist/common/recommendConfigInfo" ], function(require, exports, module) {
    var method = require("dist/application/method");
    var api = require("dist/application/api");
    var type = window.pageConfig && window.pageConfig.page.type;
    var isLogin = require("dist/personalCenter/effect").isLogin;
    var getUserCentreInfo = require("dist/personalCenter/home").getUserCentreInfo;
    var myorderType = window.pageConfig && window.pageConfig.page.myorderType;
    var simplePagination = require("dist/personalCenter/template/simplePagination.html");
    var orderStatusList = {
        0: "待支付",
        1: "支付进行中",
        2: "支付成功",
        3: "支付失败",
        4: "订单取消"
    };
    var refundStatusDescList = {
        0: "未申请退款",
        1: "退款申请中",
        2: "退款审核中",
        3: "退款审核不通过",
        4: "退款成功",
        5: "退款失败",
        7: "退款异常"
    };
    var goodsTypeList = {
        1: {
            desc: "购买资料",
            checkStatus: 8
        },
        2: {
            desc: "购买VIP",
            checkStatus: 10
        },
        8: {
            desc: "购买下载特权",
            checkStatus: 13
        }
    };
    if (type == "myorder") {
        isLogin(initData);
    }
    function initData() {
        getUserCentreInfo();
        queryOrderlistByCondition();
    }
    $(".personal-center-myorder").click(".item-operation", function(event) {
        // 需要根据 goodsType 转换为 checkStatus(下载接口)
        var goodsType = $(event.target).attr("data-goodstype");
        var fid = $(event.target).attr("data-fid");
        var orderNo = $(event.target).attr("data-orderno");
        var checkStatus = goodsTypeList[goodsType].checkStatus;
        method.compatibleIESkip("/pay/payQr.html?type=" + checkStatus + "&orderNo=" + orderNo + "&fid=" + fid, true);
    });
    function queryOrderlistByCondition(currentPage) {
        var orderStatus = method.getParam("myorderType") == "1" ? "" : method.getParam("myorderType");
        $.ajax({
            url: api.order.queryOrderlistByCondition,
            type: "POST",
            data: JSON.stringify({
                orderStatus: orderStatus,
                userOpt: "0",
                currentPage: currentPage || 1,
                pageSize: 20,
                sortStr: "orderTime"
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function(res) {
                console.log("queryOrderlistByCondition:", res);
                if (res.code == "0") {
                    var list = [];
                    var formatDate = method.formatDate;
                    Date.prototype.format = formatDate;
                    if (res.data && res.data.rows) {
                        res.data.rows.forEach(function(item) {
                            item.payPrice = (item.payPrice / 100).toFixed(2);
                            item.orderTime = new Date(item.orderTime).format("yyyy-MM-dd");
                            if (item.refundStatus == 0 || !item.refundStatus) {
                                item.orderStatusDesc = orderStatusList[item.orderStatus];
                            } else {
                                item.orderStatusDesc = refundStatusDescList[item.orderStatus];
                            }
                            list.push(item);
                        });
                    }
                    var myorder = require("dist/personalCenter/template/myorder.html");
                    var _myorderTemplate = template.compile(myorder)({
                        list: list || [],
                        myorderType: myorderType
                    });
                    $(".personal-center-myorder").html(_myorderTemplate);
                    handlePagination(res.data.totalPages, res.data.currentPage);
                } else {
                    $.toast({
                        text: res.msg,
                        delay: 3e3
                    });
                }
            },
            error: function(error) {
                console.log("queryOrderlistByCondition:", error);
            }
        });
    }
    function handlePagination(totalPages, currentPage) {
        var _simplePaginationTemplate = template.compile(simplePagination)({
            paginationList: new Array(totalPages || 0),
            currentPage: currentPage
        });
        $(".pagination-wrapper").html(_simplePaginationTemplate);
        $(".pagination-wrapper").on("click", ".page-item", function(e) {
            var paginationCurrentPage = $(this).attr("data-currentPage");
            if (!paginationCurrentPage) {
                return;
            }
            queryOrderlistByCondition(paginationCurrentPage);
        });
    }
});

define("dist/personalCenter/template/myorder.html", [], '<div class="myorder">\n    <p class="myorder-title">我的订单</p>\n     <ul class="myorder-tabs" >\n        <li class="{{ myorderType == \'1\' ? \'tab-active tab\':\'tab\'}}"><a href="/node/personalCenter/myorder.html?myorderType=1">全部订单</a></li>\n        <li class="{{ myorderType == \'0\' ? \'tab-active tab\':\'tab\'}}"><a href="/node/personalCenter/myorder.html?myorderType=0">未支付</a></li>\n        <li class="{{ myorderType == \'2\' ? \'tab-active tab\':\'tab\'}}"><a href="/node/personalCenter/myorder.html?myorderType=2">已支付</a></li>\n    </ul>\n    <table class="myorder-table-list">\n        <tr class="table-list-title">\n            <th>商品名称</th>\n            <th>订单金额</th>\n            <th>下单时间</th>\n            <th>订单状态</th>\n            <th>操作</th>\n        </tr>\n\n    {{if list.length>0}}\n         {{ each list}}\n        <tr class="table-list-item">\n            <td>\n                <p class="item-order">订单号:  {{list[$index].orderNo}} <span class="copy">复制</span></p>\n                {{if list[$index].goodsType == \'2\'}}\n                       <p class="item-desc"><span class="icon icon-vip"></span>{{list[$index].goodsName}}</p>\n                {{else}}\n                   <p class="item-desc"><span class="icon ico-data {{\'ico-\'+ list[$index].format}}"></span>{{list[$index].goodsName}}</p>\n                {{/if}}\n               \n            </td>\n            <td>\n                <p class="item-order"></p>\n                <p class="item-desc item-price">￥{{list[$index].payPrice}}</p>\n            </td>\n            <td>\n                <p class="item-order"></p>\n                <p class="item-desc item-time">{{list[$index].orderTime}}</p>\n            </td>\n            <td>\n                <p class="item-order"></p>\n                <p class="item-desc item-status">{{list[$index].orderStatusDesc}}</p>\n            </td>\n            <td>\n                <p class="item-order"></p>\n                {{if list[$index].orderStatus == 4}}\n                    <p class="item-desc item-operation" ><span class="operation-btn" data-orderno={{list[$index].orderNo}} data-goodstype={{list[$index].goodsType}} data-fid ={{list[$index.fid]}}>重新下单</span></p>\n                {{else if list[$index].orderStatus == 0}}\n               <p class="item-desc item-operation"><span class="operation-btn" data-orderno={{list[$index].orderNo}} data-goodstype={{list[$index].goodsType}} data-fid ={{list[$index.fid]}}>付款</span></p>\n                {{else}}\n                 <p class="item-desc item-operation" data-orderno={{list[$index].orderNo}}></p>  \n                {{/if}}\n            </td>\n        </tr>\n\n         {{/each}}\n    {{else}}\n\n     <div class="empty-data">\n          <img class="empty-img" src="{{cdnUrl}}/images/personalCenter/mycollection-empty-data.png"/>\n          <p class="empty-desc">暂无订单信息</p>\n     </div>\n    {{/if}} \n       \n    </table>\n    <div class="pagination-wrapper">\n        \n    </div>\n</div>');

define("dist/personalCenter/accountsecurity", [ "dist/cmd-lib/jqueryMd5", "dist/application/method", "dist/application/api", "dist/personalCenter/effect", "dist/application/checkLogin", "dist/application/app", "dist/application/element", "dist/application/template", "dist/application/extend", "dist/common/bilog", "base64", "dist/cmd-lib/util", "dist/report/config", "dist/report/init", "dist/report/handler", "dist/report/columns", "dist/application/helper", "//static3.iask.cn/resource/js/plugins/pc.iask.login.min", "dist/personalCenter/home", "swiper", "dist/common/recommendConfigInfo", "dist/common/bindphone", "dist/personalCenter/dialog" ], function(require, exports, module) {
    require("dist/cmd-lib/jqueryMd5");
    var type = window.pageConfig && window.pageConfig.page.type;
    var method = require("dist/application/method");
    var api = require("dist/application/api");
    var isLogin = require("dist/personalCenter/effect").isLogin;
    var getUserCentreInfo = require("dist/personalCenter/home").getUserCentreInfo;
    var showCaptcha = require("dist/common/bindphone").showCaptcha;
    var closeRewardPop = require("dist/personalCenter/dialog").closeRewardPop;
    var userBindInfo = {};
    // 保存用户的绑定信息
    var smsId = "";
    // 验证码
    var myWindow = "";
    // 保存 openWindow打开的对象
    isLogin(initData);
    function initData() {
        if (type == "accountsecurity") {
            getUserCentreInfo();
            queryUserBindInfo();
        }
    }
    function queryUserBindInfo() {
        // 查询用户绑定信息
        $.ajax({
            url: api.user.queryBindInfo,
            type: "GET",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function(res) {
                if (res.code == "0") {
                    console.log("queryUserBindInfo:", res);
                    userBindInfo = res.data || {};
                    var accountsecurity = require("dist/personalCenter/template/accountsecurity.html");
                    var _accountsecurityTemplate = template.compile(accountsecurity)({
                        userBindInfo: res.data
                    });
                    $(".personal-center-accountsecurity").html(_accountsecurityTemplate);
                } else {
                    $.toast({
                        text: res.msg,
                        delay: 3e3
                    });
                }
            },
            error: function(error) {
                console.log("queryUserBindInfo:", error);
            }
        });
    }
    function untyingThird(thirdType) {
        $.ajax({
            url: api.user.untyingThird,
            type: "POST",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({
                terminal: "pc",
                thirdType: thirdType
            }),
            dataType: "json",
            success: function(res) {
                if (res.code == "0") {
                    $.toast({
                        text: "解绑成功!",
                        delay: 3e3
                    });
                    closeRewardPop();
                    queryUserBindInfo();
                } else {
                    $.toast({
                        text: res.msg,
                        delay: 3e3
                    });
                }
            },
            error: function(error) {
                console.log("userBindMobile:", error);
            }
        });
    }
    function userBindMobile(mobile, smsId, checkCode) {
        // 绑定手机号接口
        $.ajax({
            url: api.user.userBindMobile,
            type: "POST",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({
                terminal: "pc",
                mobile: mobile,
                nationCode: 86,
                smsId: smsId,
                checkCode: checkCode
            }),
            dataType: "json",
            success: function(res) {
                if (res.code == "0") {
                    $.toast({
                        text: "绑定手机号成功!",
                        delay: 3e3
                    });
                    var isTHirdAuthorization = $("#dialog-box .bind-phonenumber-dialog .title").attr("data-isTHirdAuthorization");
                    if (isTHirdAuthorization) {
                        // 绑定第三方的时候，需要先绑定手机号。绑定完手机号需要 拉起绑定第三方的弹框
                        handleThirdCodelogin(isTHirdAuthorization);
                    } else {
                        closeRewardPop();
                        queryUserBindInfo();
                    }
                } else {
                    $.toast({
                        text: res.msg,
                        delay: 3e3
                    });
                }
            },
            error: function(error) {
                console.log("userBindMobile:", error);
            }
        });
    }
    function checkIdentity(smsId, checkCode) {
        // 身份验证账号
        $.ajax({
            url: api.user.checkIdentity + "?smsId=" + smsId + "&checkCode=" + checkCode,
            type: "GET",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function(res) {
                if (res.code == "0") {
                    console.log("checkIdentity:", res);
                    smsId = "";
                    // 清空保存的  短信id
                    //  换绑手机号和解绑第三方 需要身份验证
                    var isTHirdAuthorization = $("#dialog-box .identity-authentication-dialog .title").attr("data-isTHirdAuthorization");
                    if (isTHirdAuthorization) {
                        // 第三方授权解绑 身份认证
                        unbindTHirdAuthorization(isTHirdAuthorization);
                    } else {
                        closeRewardPop();
                        bindPhoneNumber();
                    }
                } else {
                    $.toast({
                        text: res.msg,
                        delay: 3e3
                    });
                }
            },
            error: function(error) {
                console.log("checkIdentity:", error);
            }
        });
    }
    function sendSms(mobile, businessCode) {
        // 发送短信验证码
        $.ajax({
            url: api.user.sendSms,
            type: "POST",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({
                mobile: mobile,
                nationCode: 86,
                businessCode: businessCode,
                // 功能模块（1-注册模块、2-找回密码、3-修改密码、4-登录、5-绑定/更换手机号手机号（会检查手机号是否被使用过）、6-旧手机号获取验证码）
                terminal: "pc"
            }),
            dataType: "json",
            success: function(res) {
                if (res.code == "0") {
                    console.log("sendSms:", res);
                    smsId = res.data.smsId;
                    var authenticationCode = $("#dialog-box .authentication-code");
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
                                color: "#333",
                                "border-color": "#eee"
                            });
                            authenticationCode.attr("data-authenticationCodeType", 2);
                        } else {
                            authenticationCode.text(textNumber--);
                            authenticationCode.css({
                                color: "#333",
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
                console.log("sendSms:", error);
                $.toast({
                    text: error.msg || "获取验证码错误",
                    delay: 3e3
                });
            }
        });
    }
    function setUpPassword(smsId, checkCode, password) {
        $.ajax({
            url: api.user.setUpPassword,
            type: "POST",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({
                terminal: "pc",
                smsId: smsId,
                checkCode: checkCode,
                password: $.md5(password)
            }),
            dataType: "json",
            success: function(res) {
                if (res.code == "0") {
                    console.log("setUpPassword:", res);
                    $.toast({
                        text: "设置密码成功",
                        delay: 3e3
                    });
                    closeRewardPop();
                    queryUserBindInfo();
                } else {
                    $.toast({
                        text: res.msg,
                        delay: 3e3
                    });
                }
            },
            error: function(error) {
                console.log("setUpPassword:", error);
            }
        });
    }
    function bindPhoneNumber(isTHirdAuthorization) {
        // 绑定手机号/ 换绑手机号 dialog
        $("#dialog-box").dialog({
            html: $("#bind-phonenumber-dialog").html().replace(/\$isTHirdAuthorization/, isTHirdAuthorization)
        }).open();
    }
    function handleThirdCodelogin(isTHirdAuthorization) {
        var clientCode = isTHirdAuthorization == "bindWechatAuthorization" ? "wechat" : isTHirdAuthorization == "bindWeiboAuthorization" ? "weibo" : "qq";
        var channel = 2;
        var location = window.location.origin + "/node/redirectionURL.html" + "?clientCode=" + clientCode;
        var url = window.location.origin + api.user.thirdCodelogin + "?clientCode=" + clientCode + "&channel=" + channel + "&terminal=pc" + "&businessSys=ishare" + "&location=" + encodeURIComponent(location);
        openWindow(url);
    }
    function identityAuthentication(isTHirdAuthorization) {
        // 换绑手机号(后续拉起绑定手机号)   和 解绑第三方需要验证
        if (isTHirdAuthorization) {
            // 是否是第三方身份校验 ,给一个标识 在身份认证完后 弹不同的dialog
            $("#dialog-box").dialog({
                html: $("#identity-authentication-dialog").html().replace(/\$phoneNumber/, userBindInfo.mobile).replace(/\$isTHirdAuthorization/, isTHirdAuthorization)
            }).open();
        } else {
            $("#dialog-box").dialog({
                html: $("#identity-authentication-dialog").html().replace(/\$phoneNumber/, userBindInfo.mobile)
            }).open();
        }
    }
    function unbindTHirdAuthorization(isTHirdAuthorization) {
        // isTHirdAuthorization 解绑哪个第三方
        $("#dialog-box").dialog({
            html: $("#unbind-account-dialog").html().replace(/\$isTHirdAuthorization/, isTHirdAuthorization)
        }).open();
    }
    function handleBindThird(code, channel, clientCode) {
        $.ajax({
            url: api.user.userBindThird,
            type: "POST",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({
                terminal: "pc",
                thirdType: clientCode,
                code: code
            }),
            dataType: "json",
            success: function(res) {
                if (res.code == "0") {
                    $.toast({
                        text: "绑定成功",
                        delay: 3e3
                    });
                    myWindow.close();
                    queryUserBindInfo();
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
                console.log("userBindThird:", error);
                $.toast({
                    text: error.msg,
                    delay: 3e3
                });
            }
        });
    }
    window.handleBindThird = handleBindThird;
    function openWindow(url) {
        var iWidth = 585;
        var iHeight = 525;
        var iTop = (window.screen.availHeight - 30 - iHeight) / 2;
        var iLeft = (window.screen.availWidth - 10 - iWidth) / 2;
        var param = "height=" + iHeight + ",width=" + iWidth + ",top=" + iTop + ",left=" + iLeft + ",toolbar=no, menubar=no, scrollbars=no, status=no, location=yes, resizable=yes";
        myWindow = window.open(url, "", param);
    }
    $(document).on("click", ".account-security-list .item-btn", function(event) {
        var btnOperation = $(this).attr("data-btnOperation");
        console.log("userBindInfo:", userBindInfo);
        if (btnOperation == "modifyPhoneNumber") {
            identityAuthentication();
        }
        if (btnOperation == "bindPhoneNumber") {
            bindPhoneNumber();
        }
        if (btnOperation == "unbindWechatAuthorization") {
            identityAuthentication("unbindWechatAuthorization");
        }
        if (btnOperation == "bindWechatAuthorization") {
            if (userBindInfo.mobile) {
                handleThirdCodelogin("bindWechatAuthorization");
            } else {
                bindPhoneNumber("bindWechatAuthorization");
            }
        }
        if (btnOperation == "unbindWeiboAuthorization") {
            identityAuthentication("unbindWeiboAuthorization");
        }
        if (btnOperation == "bindWeiboAuthorization") {
            if (userBindInfo.mobile) {
                handleThirdCodelogin("bindWeiboAuthorization");
            } else {
                bindPhoneNumber("bindWeiboAuthorization");
            }
        }
        if (btnOperation == "unbindQQAuthorization") {
            identityAuthentication("unbindQQAuthorization");
        }
        if (btnOperation == "bindQQAuthorization") {
            if (userBindInfo.mobile) {
                handleThirdCodelogin("bindQQAuthorization");
            } else {
                bindPhoneNumber("bindQQAuthorization");
            }
        }
        if (btnOperation == "changePassword") {
            $("#dialog-box").dialog({
                html: $("#set-change-password-dialog").html().replace(/\$phone/, userBindInfo.mobile)
            }).open();
        }
        if (btnOperation == "setPassword") {
            $("#dialog-box").dialog({
                html: $("#set-change-password-dialog").html().replace(/\$phone/, userBindInfo.mobile)
            }).open();
        }
    });
    $("#dialog-box").on("click", ".authentication-btn", function(e) {
        // 身份验证
        //   var checkIdentity
        var checkCode = $("#dialog-box .authentication-input").val();
        if (checkCode) {
            checkIdentity(smsId, checkCode);
        } else {
            $.toast({
                text: "请输入短信验证码!",
                delay: 3e3
            });
        }
    });
    $(document).on("click", ".authentication-code", function(e) {
        // 获取验证码   在 authentication-code元素上 添加标识   0 获取验证码    1 倒计时   2 重新获取验证码
        var authenticationCodeType = $(this).attr("data-authenticationCodeType");
        var isiDentityAuthentication = $(this).attr("data-isiDentityAuthentication");
        if (authenticationCodeType == 0 || authenticationCodeType == 2) {
            // 获取验证码
            if (isiDentityAuthentication == "1") {
                sendSms(userBindInfo.mobile, 7);
            } else {
                var mobile = $("#dialog-box .item-phonenumber").val();
                if (!method.testPhone(mobile)) {
                    //  获取验证码前 需输入验证码
                    $.toast({
                        text: "请输入正确的手机号",
                        delay: 3e3
                    });
                    return;
                }
                sendSms(mobile, 5);
            }
        }
        console.log("获取验证码", authenticationCodeType);
    });
    $("#dialog-box").on("click", ".bind-phonenumber-dialog .confirm-binding", function(e) {
        // 绑定手机号 换绑手机号 确认事件 
        var phonenumber = $("#dialog-box .item-phonenumber").val();
        var verificationcode = $("#dialog-box .item-verificationcode").val();
        if (!method.testPhone(phonenumber)) {
            $.toast({
                text: "请输入正确的手机号",
                delay: 3e3
            });
            return;
        }
        if (!verificationcode) {
            $.toast({
                text: "验证码不能为空!",
                delay: 3e3
            });
            return;
        }
        userBindMobile(phonenumber, smsId, verificationcode);
    });
    $("#dialog-box").on("click", ".set-change-password-dialog .set-change-password", function(e) {
        // var phonenumber = $('#dialog-box .item-phonenumber').val()
        var verificationcode = $("#dialog-box .item-verificationcode").val();
        var newPassword = $("#dialog-box .item-newpassword").val();
        if (!verificationcode) {
            $.toast({
                text: "验证码不能为空!",
                delay: 3e3
            });
            return;
        }
        if (!newPassword) {
            $.toast({
                text: "新密码不能为空!",
                delay: 3e3
            });
            return;
        }
        setUpPassword(smsId, verificationcode, newPassword);
    });
    $("#dialog-box").on("click", ".unbind-account-dialog .unbind-btn", function(e) {
        var isTHirdAuthorization = $("#dialog-box .unbind-account-dialog .title").attr("data-isTHirdAuthorization");
        var clientCode = isTHirdAuthorization == "unbindWechatAuthorization" ? "wechat" : isTHirdAuthorization == "unbindWeiboAuthorization" ? "weibo" : "qq";
        untyingThird(clientCode);
    });
    $("#dialog-box").on("click", ".unbind-account-dialog .unbind-account-btn", function(e) {
        closeRewardPop();
        bindPhoneNumber();
    });
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

define("dist/personalCenter/template/accountsecurity.html", [], '<div class="account-security">\n    <p class="account-security-title">账号与安全</p>\n    <ul class="account-security-list">\n        <li class="item">\n           {{ if userBindInfo.mobile}}\n                <span class="item-icon fl"></span>\n                <span class="item-status fl">已绑定</span>\n                <span class="item-bindaccount fl">{{userBindInfo.mobile}}</span>\n                <span class="item-btn fr item-btn-active" data-btnOperation=\'modifyPhoneNumber\'>修改手机号</span>\n           {{else}}\n                <span class="item-icon fl"></span>\n                <span class="item-status fl">手机号</span>\n                <span class="item-btn fr item-btn-active" data-btnOperation=\'bindPhoneNumber\'>立即绑定</span>\n\n           {{/if}}\n            \n        </li>\n        <li class="item">\n          {{if userBindInfo.wechatThird}}\n                 <span class="item-icon fl"></span>\n                <span class="item-status fl">已绑定</span>\n                <span class="item-bindaccount fl">{{userBindInfo.wechatName}}</span>\n                <span class="item-btn fr" data-btnOperation=\'unbindWechatAuthorization\'>解除绑定</span>\n          {{else}}\n                <span class="item-icon fl"></span>\n                <span class="item-status fl">微信</span>\n                <span class="item-btn item-btn-active fr" data-btnOperation=\'bindWechatAuthorization\'>立即绑定</span>\n\n          {{/if}}\n           \n        </li>\n        <li class="item">\n          {{if userBindInfo.weiboThird}}\n                     <span class="item-icon fl"></span>\n                     <span class="item-status fl">已绑定</span>\n                    <span class="item-bindaccount fl">{{userBindInfo.weiboName}}</span>\n                    <span class="item-btn fr" data-btnOperation=\'unbindWeiboAuthorization\'>解除绑定</span>\n\n          {{else}}\n                     <span class="item-icon fl"></span>\n                     <span class="item-status fl">微博</span>\n                    <span class="item-btn fr item-btn-active" data-btnOperation=\'bindWeiboAuthorization\'>立即绑定</span>\n\n          {{/if}}\n           \n        </li>\n         <li class="item">\n\n           {{ if userBindInfo.qqThird}}\n                    <span class="item-icon fl"></span>\n                    <span class="item-status fl">QQ</span>\n                    <span class="item-bindaccount fl">{{userBindInfo.qqName}}</span>\n                    <span class="item-btn fr" data-btnOperation=\'unbindQQAuthorization\'>解除绑定</span>\n\n           {{else}}\n                    <span class="item-icon fl"></span>\n                    <span class="item-status fl">QQ</span>\n                    <span class="item-btn fr item-btn-active" data-btnOperation=\'bindQQAuthorization\'>立即绑定</span>\n           {{/if}}\n            \n        </li>\n         <li class="item">\n            {{ if userBindInfo.isSetPassword == 1}}\n                    <span class="item-icon fl"></span>\n                    <span class="item-status fl">账号密码</span>\n                   <span class="item-btn fr"  data-btnOperation=\'changePassword\'>修改密码</span>\n            {{else}}\n                    <span class="item-icon fl"></span>\n                    <span class="item-status fl">账号密码</span>\n                   <span class="item-btn fr item-btn-active" data-btnOperation=\'setPassword\'>设置密码</span>\n            {{/if}}\n        </li>\n    </ul>\n</div>');

define("dist/personalCenter/personalinformation", [ "dist/application/api", "dist/application/method", "dist/cmd-lib/jquery.datepicker", "dist/common/area", "dist/personalCenter/effect", "dist/application/checkLogin", "dist/application/app", "dist/application/element", "dist/application/template", "dist/application/extend", "dist/common/bilog", "base64", "dist/cmd-lib/util", "dist/report/config", "dist/report/init", "dist/report/handler", "dist/report/columns", "dist/application/helper", "//static3.iask.cn/resource/js/plugins/pc.iask.login.min", "dist/personalCenter/home", "swiper", "dist/common/recommendConfigInfo" ], function(require, exports, module) {
    var api = require("dist/application/api");
    var method = require("dist/application/method");
    require("dist/cmd-lib/jquery.datepicker");
    var areaData = require("dist/common/area");
    var provinceList = [];
    var cityList = [];
    var userInfoInfomation = {};
    var type = window.pageConfig && window.pageConfig.page.type;
    var isLogin = require("dist/personalCenter/effect").isLogin;
    var getUserCentreInfo = require("dist/personalCenter/home").getUserCentreInfo;
    var specialCity = [ "北京市", "天津市", "重庆市", "上海市", "澳门", "香港" ];
    if (type == "personalinformation") {
        isLogin(initData);
    }
    function initData() {
        getUserCentreInfo(getUserCentreInfoCallBack);
    }
    function getUserCentreInfoCallBack(userInfo, editUser) {
        console.log("userInfo:", userInfo);
        getProvinceAndCityList(userInfo);
        var personalinformation = require("dist/personalCenter/template/personalinformation.html");
        // userInfo.prov = '北京市'
        // userInfo.city ='西城区'
        var _personalinformationTemplate = template.compile(personalinformation)({
            userInfo: userInfo,
            provinceList: provinceList,
            cityList: cityList,
            editUser: editUser
        });
        $(".personal-center-personalinformation").html(_personalinformationTemplate);
        $(".item-province-select").val(userInfo.prov);
        $(".item-city-select").val(userInfo.city);
        if (userInfo.birthday) {
            // $('#date-input').val() 获取日志
            var formatDate = method.formatDate;
            Date.prototype.dateFormatting = formatDate;
            var birthday = userInfo.birthday ? new Date(userInfo.birthday).format("yyyy-MM-dd") : "";
            $(".item-date-input").datePicker({
                currentDate: birthday
            });
        } else {
            $(".item-date-input").datePicker();
        }
    }
    function getProvinceAndCityList(userInfo) {
        userInfoInfomation = userInfo;
        areaData.forEach(function(itemCity) {
            provinceList.push(itemCity.name);
            if (itemCity.name == userInfo.prov && specialCity.indexOf(userInfo.prov) > -1) {
                itemCity.city.forEach(function(itemArea) {
                    itemArea.area.forEach(function(area) {
                        cityList.push(area);
                    });
                });
            } else if (itemCity.name == userInfo.prov && specialCity.indexOf(userInfo.prov) == -1) {
                itemCity.city.forEach(function(city) {
                    cityList.push(city.name);
                });
            } else if (!userInfo.city) {
                areaData[0].city[0].area.forEach(function(area) {
                    cityList.push(area);
                });
            }
        });
        console.log("provinceList:", provinceList, "cityList:", cityList);
    }
    function editUser(gender, birthday, prov, city, email) {
        $.ajax({
            url: api.user.editUser,
            type: "POST",
            data: JSON.stringify({
                gender: gender == "男" ? "M" : "F",
                birthday: birthday,
                prov: prov,
                city: city,
                email: email
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function(res) {
                if (res.code == "0") {
                    console.log("editUser:", res);
                    initData();
                } else {
                    $.toast({
                        text: res.msg,
                        delay: 3e3
                    });
                }
            },
            error: function(error) {
                console.log("editUser:", error);
            }
        });
    }
    $(document).on("click", ".personalinformation .edit-information", function(e) {
        // active-input      
        var edit = $(this).attr("data-edit");
        if (edit == "edit") {
            getUserCentreInfoCallBack(userInfoInfomation, "editUser");
        } else if (edit == "save") {
            var province = $(".item-province-select").val();
            var city = $(".item-city-select").val();
            var sex = $(".item-sex-select").val();
            var birthday = $(".item-date-input").val();
            var email = $(".item-email-input").val();
            var errMsg = "";
            if (!province && (errMsg = "请选择所在省") || !city && (errMsg = "请选择所在的市") || !sex && (errMsg = "请选择性别") || !birthday && (errMsg = "请选择生日") || !email && (errMsg = "请填写邮箱")) {
                $.toast({
                    text: errMsg,
                    delay: 3e3
                });
                return;
            }
            editUser(sex, new Date(birthday).getTime(), province, city, email);
        } else if (edit == "cancel") {
            getUserCentreInfoCallBack(userInfoInfomation, "");
        }
    });
    $(document).on("change", ".personalinformation .item-province-select", function(e) {
        // 北京市 天津市 重庆市  上海市 澳门 香港
        var provinceName = $(this).val();
        var str = "";
        var cityList = [];
        areaData.forEach(function(itemCity) {
            if (provinceName == itemCity.name && specialCity.indexOf(provinceName) > -1) {
                itemCity.city.forEach(function(itemArea) {
                    itemArea.area.forEach(function(area) {
                        cityList.push(area);
                    });
                });
            } else {
                if (provinceName == itemCity.name) {
                    itemCity.city.forEach(function(city) {
                        cityList.push(city.name);
                    });
                }
            }
        });
        cityList.forEach(function(city) {
            str += '<option value="' + city + '">' + city + "</option>";
        });
        $(".personalinformation .item-city-select").html(str);
    });
});

/*
 * jquery.datepicker.js v0.1.0
 * MIT License
 * author info pls visit: http://luopq.com
 * for more info pls visit: https://github.com/LuoPQ/jquery.datepicker.js
 */
define("dist/cmd-lib/jquery.datepicker", [], function(require, exports, module) {
    (function($, window, document, undefined) {
        //#region Date扩展
        //添加指定单位的时间
        Date.prototype.dateAdd = function(interval, number) {
            var d = new Date(this);
            var k = {
                y: "FullYear",
                q: "Month",
                m: "Month",
                w: "Date",
                d: "Date",
                h: "Hours",
                n: "Minutes",
                s: "Seconds",
                ms: "MilliSeconds"
            };
            var n = {
                q: 3,
                w: 7
            };
            eval("d.set" + k[interval] + "(d.get" + k[interval] + "()+" + (n[interval] || 1) * number + ")");
            return d;
        };
        //计算当前日期与指定日期相差的天数
        Date.prototype.dateDiff = function(otherDate) {
            if (otherDate instanceof Date) {
                return (this.getTime() - otherDate.getTime()) / 1e3 / 60 / 60 / 24;
            }
            throw new Error("it is not a date!");
        };
        Date.prototype.format = function() {
            var month = this.getMonth() + 1;
            var date = this.getDate();
            month < 10 && (month = "0" + month);
            date < 10 && (date = "0" + date);
            return [ this.getFullYear(), month, date ].join("-");
        };
        Date.prototype.parse = function(s) {
            if ((s || "") == "") return null;
            if (typeof s == "object") return s;
            if (typeof s == "string") {
                if (/\/Date\(.*\)\//gi.test(s)) {
                    return eval(s.replace(/\/Date\((.*?)\)\//gi, "new Date($1)"));
                } else if (/(\d{8})/.test(s)) {
                    return eval(s.replace(/(\d{4})(\d{2})(\d{2})/, "new Date($1,parseInt($2)-1,$3)"));
                } else if (/(\d{4})[-\/](\d{1,2})[-\/](\d{1,2})[T\s](\d{1,2})\:(\d{1,2})(?:\:(\d{1,2}))?/.test(s)) {
                    return eval(s.replace(/(\d{4})[-\/](\d{1,2})[-\/](\d{1,2})[T\s](\d{1,2})\:(\d{1,2})(?:\:(\d{1,2}))?[\w\W]*/, "new Date($1,parseInt($2)-1,parseInt($3),parseInt($4),parseInt($5),parseInt($6)||0)"));
                } else if (/(\d{4})[-\/](\d{1,2})[-\/](\d{1,2})/.test(s)) {
                    return eval(s.replace(/(\d{4})[-\/](\d{1,2})[-\/](\d{1,2})/, "new Date($1,parseInt($2)-1,$3)"));
                }
                try {
                    return new Date(s);
                } catch (e) {
                    return null;
                }
            }
            return null;
        };
        //#endregion
        //#region 节假日数据
        //pickerType
        var pickerTypes = {
            year: {},
            month: {},
            day: {}
        };
        //星期几名称
        var weekdayNames = [ "日", "一", "二", "三", "四", "五", "六" ];
        //节假日名字
        var dayName = {
            today: "今天",
            yuandan: "元旦",
            chuxi: "除夕",
            chunjie: "春节",
            yuanxiao: "元宵",
            qingming: "清明",
            wuyi: "5.1",
            duanwu: "端午",
            zhongqiu: "中秋",
            guoqing: "国庆",
            qixi: "七夕",
            shengdan: "圣诞"
        };
        //2012——2020年节假日数据
        var holidays = {
            today: [ new Date().format() ],
            yuandan: [ "2012-01-01", "2013-01-01", "2014-01-01", "2015-01-01", "2016-01-01", "2017-01-01", "2018-01-01", "2019-01-01", "2020-01-01" ],
            chuxi: [ "2012-01-22", "2013-02-09", "2014-01-30", "2015-02-18", "2016-02-07", "2017-01-27", "2018-02-15", "2019-02-04", "2020-01-24" ],
            chunjie: [ "2012-01-23", "2013-02-10", "2014-01-31", "2015-02-19", "2016-02-08", "2017-01-28", "2018-02-16", "2019-02-05", "2020-01-25" ],
            yuanxiao: [ "2012-02-06", "2013-02-24", "2014-2-14", "2015-03-05", "2016-02-22", "2017-02-11", "2018-03-02", "2019-02-19", "2020-02-8" ],
            qingming: [ "2012-04-04", "2013-04-04", "2014-04-05", "2015-04-05", "2016-04-04", "2017-04-04", "2018-04-05", "2019-04-05", "2020-04-04" ],
            wuyi: [ "2012-05-01", "2013-05-01", "2014-05-01", "2015-05-01", "2016-05-01", "2017-05-01", "2018-05-01", "2019-05-01", "2020-05-01" ],
            duanwu: [ "2012-06-23", "2013-06-12", "2014-06-02", "2015-06-20", "2016-06-09", "2017-05-30", "2018-06-18", "2019-06-07", "2020-06-25" ],
            zhongqiu: [ "2012-09-30", "2013-09-19", "2014-09-08", "2015-09-27", "2016-09-15", "2017-10-04", "2018-09-24", "2019-09-13", "2020-10-01" ],
            guoqing: [ "2012-10-01", "2013-10-01", "2014-10-01", "2015-10-01", "2016-10-01", "2017-10-01", "2018-10-01", "2019-10-01", "2020-10-01" ],
            qixi: [ "2012-08-23", "2013-08-13", "2014-08-02", "2015-08-20", "2016-08-09", "2017-08-28", "2018-08-17", "2019-08-07", "2020-08-25" ],
            shengdan: [ "2012-12-25", "2013-12-25", "2014-12-25", "2015-12-25", "2016-12-25", "2017-12-25", "2018-12-25", "2019-12-25", "2020-12-25" ]
        };
        //#endregion 
        function DatePicker($ele, options) {
            this.$ele = $ele;
            this.options = options;
            this.$container = null;
            this.currentYear = null;
            this.currentMonth = null;
            this.currentDate = Date.prototype.parse(options.currentDate) || new Date();
            this.pickerType = pickerTypes.day;
            this.init();
        }
        DatePicker.prototype = {
            constructor: DatePicker,
            init: function() {
                this.options.currentDate && this.$ele.val(Date.prototype.parse(this.options.currentDate).format());
                this.options.minDate = new Date().parse(this.options.minDate);
                this.options.maxDate = new Date().parse(this.options.maxDate);
                this.renderHtml();
                this.bindEvent();
            },
            renderHtml: function() {
                var $container = $('<dl class="datepicker" style="display:none"></dl>');
                $(document.body).append($container);
                this.$container = $container;
                this.refresh();
            },
            refresh: function() {
                this.$ele.attr("readonly", "readonly");
                this.currentYear = this.currentYear || this.currentDate.getFullYear();
                this.currentMonth = this.currentMonth != null ? this.currentMonth : this.currentDate.getMonth();
                var currentDate = new Date(this.currentYear, this.currentMonth, 1);
                this.currentYear = currentDate.getFullYear();
                this.currentMonth = currentDate.getMonth();
                switch (this.pickerType) {
                  case pickerTypes.year:
                    var yearTitleHtml = this.createTitleHtml(this.currentYear, this.currentMonth, pickerTypes.year);
                    var yearListHtml = this.createYearListHtml(this.currentYear);
                    this.$container.html("").append(yearTitleHtml).append(yearListHtml);
                    break;

                  case pickerTypes.month:
                    var monthTitleHtml = this.createTitleHtml(this.currentYear, this.currentMonth, pickerTypes.month);
                    var monthListHtml = this.createMonthListHtml(this.currentYear);
                    this.$container.html("").append(monthTitleHtml).append(monthListHtml);
                    break;

                  case pickerTypes.day:
                  default:
                    var dayTitleHtml = this.createTitleHtml(this.currentYear, this.currentMonth, pickerTypes.day);
                    var dayListHtml = this.createDateListHtml(this.currentYear, this.currentMonth);
                    this.$container.html("").append(dayTitleHtml).append(dayListHtml);
                    break;
                }
                var inputVal = this.$ele.val();
                if (inputVal) {
                    this.$container.find("dd .select").removeClass("select");
                    var selectedDate = new Date().parse(inputVal);
                    this.$container.find("dd>[year=" + selectedDate.getFullYear() + "]").addClass("select");
                    this.$container.find("dd>[month=" + selectedDate.getMonth() + "]").addClass("select");
                    this.$container.find("dd>[date=" + inputVal + "]").addClass("select");
                }
                this.$container.find(".date-unit").hide().fadeIn();
            },
            createTitleHtml: function(currentYear, currentMonth, pickerType) {
                var title = "";
                switch (pickerType) {
                  case pickerTypes.year:
                    var yearRange = this.getYearRange(currentYear);
                    title = yearRange.minYear + "-" + yearRange.maxYear;
                    break;

                  case pickerTypes.month:
                    title = currentYear + "年";
                    break;

                  case pickerTypes.day:
                  default:
                    title = currentYear + "年" + (currentMonth + 1) + "月";
                    break;
                }
                var titleHtmls = [ '<dt class="date-action">', '<a href="javascript:;" class="prev"></a>', "<span>" + title + "</span>", '<a href="javascript:;" class="next"></a>', "</dt>" ];
                if (pickerType == pickerTypes.day) {
                    $.each(weekdayNames, function(index, value) {
                        titleHtmls.push('<dt class="week">' + value + "</dt>");
                    });
                }
                return titleHtmls.join("");
            },
            createYearListHtml: function(currentYear) {
                var yearHtml = [];
                yearHtml.push('<dd class="clearfix date-unit year">');
                var yearList = this.getYearList(currentYear);
                for (var i = 0; i < yearList.length; i++) {
                    var year = yearList[i];
                    var className = "";
                    year.disabled && (className += " disabled");
                    yearHtml.push('<a year="' + year.year + '" href="javascript:;" class="' + className + '">' + year.year + "</a>");
                }
                yearHtml.push("</dd>");
                return yearHtml.join("");
            },
            createMonthListHtml: function(currentYear) {
                var monthHtml = [];
                monthHtml.push('<dd class="clearfix date-unit month">');
                var monthList = this.getMonthList();
                for (var i = 0; i < monthList.length; i++) {
                    var month = monthList[i];
                    var className = "";
                    monthHtml.push('<a month="' + month.month + '" href="javascript:;" class="' + className + '">' + month.monthText + "</a>");
                }
                monthHtml.push("</dd>");
                return monthHtml.join("");
            },
            createDateListHtml: function(currentYear, currentMonth) {
                var dateHtml = [];
                dateHtml.push('<dd class="clearfix date-unit day">');
                var dateList = this.getDateList(currentYear, currentMonth);
                for (var i = 0; i < dateList.length; i++) {
                    var date = dateList[i];
                    var className = "";
                    date.disabled && (className += " disabled");
                    date.isHoliday && (className += " holiday");
                    dateHtml.push('<a date="' + date.format() + '" href="javascript:;" class="' + className + '">' + date.dateText + "</a>");
                }
                dateHtml.push("</dd>");
                return dateHtml.join("");
            },
            getYearList: function(currentYear) {
                var yearRange = this.getYearRange(currentYear);
                var list = [];
                for (var startYear = yearRange.minYear - 1, endYear = yearRange.maxYear + 1; startYear <= endYear; startYear++) {
                    list.push(this.createYear(startYear, startYear < yearRange.minYear || startYear > yearRange.maxYear));
                }
                return list;
            },
            getMonthList: function() {
                var list = [];
                for (var i = 0; i < 12; i++) {
                    list.push(this.createMonth(i));
                }
                return list;
            },
            getDateList: function(currentYear, currentMonth) {
                var firstDay = new Date(currentYear, currentMonth, 1);
                var lastDay = new Date(currentYear, currentMonth + 1, 0);
                var list = [];
                for (var i = 0, length = firstDay.getDay(); i < length; i++) {
                    list.push(this.createDate(firstDay.dateAdd("d", i - length), currentMonth));
                }
                for (var i = 1; i <= lastDay.getDate(); i++) {
                    list.push(this.createDate(new Date(currentYear, currentMonth, i), currentMonth));
                }
                for (var i = 0; i < 6 - lastDay.getDay(); i++) {
                    list.push(this.createDate(new Date(currentYear, currentMonth + 1, i + 1), currentMonth));
                }
                return list;
            },
            createYear: function(year, disabled) {
                return {
                    year: year,
                    disabled: disabled
                };
            },
            createMonth: function(month) {
                return {
                    month: month,
                    monthText: month + 1 + "月"
                };
            },
            createDate: function(date, month) {
                if (this.options.minDate) {
                    date.disabled = Math.ceil(date.dateDiff(Date.prototype.parse(this.options.minDate))) < 0 || month != date.getMonth();
                } else {
                    date.disabled = false;
                }
                //date.isSelected = this.$ele.val() == date.format();
                if (this.options.maxDate && !date.disabled) {
                    date.disabled = Math.ceil(date.dateDiff(Date.prototype.parse(this.options.maxDate))) > 0;
                }
                var dateInfo = this.getDayInfo(date);
                date.isHoliday = dateInfo.isHoliday;
                date.dateText = dateInfo.dateText;
                return date;
            },
            getDayInfo: function(date) {
                var formattedDate = date.format();
                var dateInfo = {
                    isHoliday: false,
                    dateText: date.getDate()
                };
                for (var key in holidays) {
                    if (holidays[key].join("").indexOf(formattedDate) > -1) {
                        dateInfo.dateText = dayName[key];
                        dateInfo.isHoliday = true;
                        break;
                    }
                }
                return dateInfo;
            },
            getYearRange: function(currentYear) {
                var minYear = parseInt(currentYear / 10) * 10;
                var maxYear = minYear + 9;
                return {
                    minYear: minYear,
                    maxYear: maxYear
                };
            },
            bindEvent: function() {
                var that = this;
                that.$container.on("click", ".date-action", function() {
                    switch (that.pickerType) {
                      case pickerTypes.year:
                        break;

                      case pickerTypes.month:
                        that.pickerType = pickerTypes.year;
                        that.refresh();
                        break;

                      case pickerTypes.day:
                      default:
                        that.pickerType = pickerTypes.month;
                        that.refresh();
                        break;
                    }
                }).on("click", "dd>a", function() {
                    var $this = $(this);
                    if (!$this.hasClass("disabled")) {
                        switch (that.pickerType) {
                          case pickerTypes.year:
                            that.currentYear = parseInt($this.attr("year"));
                            that.pickerType = pickerTypes.month;
                            that.refresh();
                            break;

                          case pickerTypes.month:
                            that.currentMonth = parseInt($this.attr("month"));
                            that.pickerType = pickerTypes.day;
                            that.refresh();
                            break;

                          case pickerTypes.day:
                          default:
                            var date = $this.attr("date");
                            that.selectDate(date);
                            that.$container.find("dd .select").removeClass("select");
                            that.$container.find("dd>[date=" + date + "]").addClass("select");
                            break;
                        }
                    }
                }).on("click", "dt .prev", function(event) {
                    that.prev();
                    that.stopBubble(event);
                }).on("click", "dt .next", function(event) {
                    that.next();
                    that.stopBubble(event);
                }).on({
                    click: function(event) {
                        that.stopBubble(event);
                    },
                    mousedown: function(event) {
                        that.stopBubble(event);
                    }
                });
                that.$ele.on({
                    click: function(event) {},
                    focus: function() {
                        that.show();
                        if (that.pickerType != pickerTypes.day) {
                            that.pickerType = pickerTypes.day;
                            that.refresh();
                        }
                    }
                });
                $(document).on("mousedown", function(event) {
                    event = event || window.event;
                    var target = event.target || event.srcElement;
                    if (that.$ele[0] != target && that.$ele[0] != target.parentNode) {
                        that.hide();
                    }
                });
            },
            prev: function() {
                switch (this.pickerType) {
                  case pickerTypes.year:
                    this.currentYear = this.currentYear - 10;
                    this.refresh();
                    break;

                  case pickerTypes.month:
                    this.currentYear--;
                    this.refresh();
                    break;

                  case pickerTypes.day:
                  default:
                    this.currentMonth--;
                    this.refresh();
                    break;
                }
                this.show();
            },
            next: function() {
                switch (this.pickerType) {
                  case pickerTypes.year:
                    this.currentYear = this.currentYear + 10;
                    this.refresh();
                    break;

                  case pickerTypes.month:
                    this.currentYear++;
                    this.refresh();
                    break;

                  case pickerTypes.day:
                  default:
                    this.currentMonth++;
                    this.refresh();
                    break;
                }
                this.show();
            },
            selectDate: function(date) {
                this.$ele.val(date);
                this.options.onDateSelected && this.options.onDateSelected(date);
                this.hide();
                this.currentDate = Date.prototype.parse(date);
                this.currentYear = this.currentDate.getFullYear();
                this.currentMonth = this.currentDate.getMonth();
                this.refresh();
            },
            focus: function() {
                this.$ele.focus();
            },
            hide: function() {
                this.$container.hide();
            },
            show: function() {
                var offset = this.$ele.offset();
                var left = offset.left;
                if (this.options.showCenter) {
                    left = left - this.$ele.outerWidth() / 2;
                }
                this.$container.css({
                    top: offset.top + this.$ele.outerHeight(),
                    left: left,
                    position: "absolute",
                    "z-Index": 9999,
                    display: "none"
                });
                this.$container.show();
            },
            setMinDate: function(minDate) {
                this.options.minDate = new Date().parse(minDate);
                this.refresh();
            },
            setMaxDate: function(maxDate) {
                this.options.maxDate = new Date().parse(maxDate);
                this.refresh();
            },
            remove: function() {
                this.$container.remove();
            },
            stopBubble: function(event) {
                event = event || window.event;
                event.stopPropagation();
            }
        };
        $.fn.datePicker = function(options) {
            var defaults = {
                minDate: null,
                maxDate: null,
                currentDate: null,
                onDateSelected: null,
                showCenter: false
            };
            options = $.extend(defaults, options || {});
            return new DatePicker($(this), options);
        };
    })(jQuery, window, document);
});

define("dist/common/area", [], function(require, exports, module) {
    return [ {
        name: "北京市",
        city: [ {
            name: "北京市",
            area: [ "东城区", "西城区", "崇文区", "宣武区", "朝阳区", "丰台区", "石景山区", "海淀区", "门头沟区", "房山区", "通州区", "顺义区", "昌平区", "大兴区", "平谷区", "怀柔区", "密云县", "延庆县" ]
        } ]
    }, {
        name: "天津市",
        city: [ {
            name: "天津市",
            area: [ "和平区", "河东区", "河西区", "南开区", "河北区", "红桥区", "塘沽区", "汉沽区", "大港区", "东丽区", "西青区", "津南区", "北辰区", "武清区", "宝坻区", "宁河县", "静海县", "蓟  县" ]
        } ]
    }, {
        name: "河北省",
        city: [ {
            name: "石家庄市",
            area: [ "长安区", "桥东区", "桥西区", "新华区", "郊  区", "井陉矿区", "井陉县", "正定县", "栾城县", "行唐县", "灵寿县", "高邑县", "深泽县", "赞皇县", "无极县", "平山县", "元氏县", "赵  县", "辛集市", "藁", "晋州市", "新乐市", "鹿泉市" ]
        }, {
            name: "唐山市",
            area: [ "路南区", "路北区", "古冶区", "开平区", "新  区", "丰润县", "滦  县", "滦南县", "乐亭县", "迁西县", "玉田县", "唐海县", "遵化市", "丰南市", "迁安市" ]
        }, {
            name: "秦皇岛市",
            area: [ "海港区", "山海关区", "北戴河区", "青龙满族自治县", "昌黎县", "抚宁县", "卢龙县" ]
        }, {
            name: "邯郸市",
            area: [ "邯山区", "丛台区", "复兴区", "峰峰矿区", "邯郸县", "临漳县", "成安县", "大名县", "涉  县", "磁  县", "肥乡县", "永年县", "邱  县", "鸡泽县", "广平县", "馆陶县", "魏  县", "曲周县", "武安市" ]
        }, {
            name: "邢台市",
            area: [ "桥东区", "桥西区", "邢台县", "临城县", "内丘县", "柏乡县", "隆尧县", "任  县", "南和县", "宁晋县", "巨鹿县", "新河县", "广宗县", "平乡县", "威  县", "清河县", "临西县", "南宫市", "沙河市" ]
        }, {
            name: "保定市",
            area: [ "新市区", "北市区", "南市区", "满城县", "清苑县", "涞水县", "阜平县", "徐水县", "定兴县", "唐  县", "高阳县", "容城县", "涞源县", "望都县", "安新县", "易  县", "曲阳县", "蠡  县", "顺平县", "博野", "雄县", "涿州市", "定州市", "安国市", "高碑店市" ]
        }, {
            name: "张家口",
            area: [ "桥东区", "桥西区", "宣化区", "下花园区", "宣化县", "张北县", "康保县", "沽源县", "尚义县", "蔚  县", "阳原县", "怀安县", "万全县", "怀来县", "涿鹿县", "赤城县", "崇礼县" ]
        }, {
            name: "承德市",
            area: [ "双桥区", "双滦区", "鹰手营子矿区", "承德县", "兴隆县", "平泉县", "滦平县", "隆化县", "丰宁满族自治县", "宽城满族自治县", "围场满族蒙古族自治县" ]
        }, {
            name: "沧州市",
            area: [ "新华区", "运河区", "沧  县", "青  县", "东光县", "海兴县", "盐山县", "肃宁县", "南皮县", "吴桥县", "献  县", "孟村回族自治县", "泊头市", "任丘市", "黄骅市", "河间市" ]
        }, {
            name: "廊坊市",
            area: [ "安次区", "固安县", "永清县", "香河县", "大城县", "文安县", "大厂回族自治县", "霸州市", "三河市" ]
        }, {
            name: "衡水市",
            area: [ "桃城区", "枣强县", "武邑县", "武强县", "饶阳县", "安平县", "故城县", "景  县", "阜城县", "冀州市", "深州市" ]
        } ]
    }, {
        name: "山西省",
        city: [ {
            name: "太原市",
            area: [ "小店区", "迎泽区", "杏花岭区", "尖草坪区", "万柏林区", "晋源区", "清徐县", "阳曲县", "娄烦县", "古交市" ]
        }, {
            name: "大同市",
            area: [ "城  区", "矿  区", "南郊区", "新荣区", "阳高县", "天镇县", "广灵县", "灵丘县", "浑源县", "左云县", "大同县" ]
        }, {
            name: "阳泉市",
            area: [ "城  区", "矿  区", "郊  区", "平定县", "盂  县" ]
        }, {
            name: "长治市",
            area: [ "城  区", "郊  区", "长治县", "襄垣县", "屯留县", "平顺县", "黎城县", "壶关县", "长子县", "武乡县", "沁  县", "沁源县", "潞城市" ]
        }, {
            name: "晋城市",
            area: [ "城  区", "沁水县", "阳城县", "陵川县", "泽州县", "高平市" ]
        }, {
            name: "朔州市",
            area: [ "朔城区", "平鲁区", "山阴县", "应  县", "右玉县", "怀仁县" ]
        }, {
            name: "忻州市",
            area: [ "忻府区", "原平市", "定襄县", "五台县", "代  县", "繁峙县", "宁武县", "静乐县", "神池县", "五寨县", "岢岚县", "河曲县", "保德县", "偏关县" ]
        }, {
            name: "吕梁市",
            area: [ "离石区", "孝义市", "汾阳市", "文水县", "交城县", "兴  县", "临  县", "柳林县", "石楼县", "岚  县", "方山县", "中阳县", "交口县" ]
        }, {
            name: "晋中市",
            area: [ "榆次市", "介休市", "榆社县", "左权县", "和顺县", "昔阳县", "寿阳县", "太谷县", "祁  县", "平遥县", "灵石县" ]
        }, {
            name: "临汾市",
            area: [ "临汾市", "侯马市", "霍州市", "曲沃县", "翼城县", "襄汾县", "洪洞县", "古  县", "安泽县", "浮山县", "吉  县", "乡宁县", "蒲  县", "大宁县", "永和县", "隰  县", "汾西县" ]
        }, {
            name: "运城市",
            area: [ "运城市", "永济市", "河津市", "芮城县", "临猗县", "万荣县", "新绛县", "稷山县", "闻喜县", "夏  县", "绛  县", "平陆县", "垣曲县" ]
        } ]
    }, {
        name: "内蒙古",
        city: [ {
            name: "呼和浩特市",
            area: [ "新城区", "回民区", "玉泉区", "郊  区", "土默特左旗", "托克托县", "和林格尔县", "清水河县", "武川县" ]
        }, {
            name: "包头市",
            area: [ "东河区", "昆都伦区", "青山区", "石拐矿区", "白云矿区", "郊  区", "土默特右旗", "固阳县", "达尔罕茂明安联合旗" ]
        }, {
            name: "乌海市",
            area: [ "海勃湾区", "海南区", "乌达区" ]
        }, {
            name: "赤峰市",
            area: [ "红山区", "元宝山区", "松山区", "阿鲁科尔沁旗", "巴林左旗", "巴林右旗", "林西县", "克什克腾旗", "翁牛特旗", "喀喇沁旗", "宁城县", "敖汉旗" ]
        }, {
            name: "呼伦贝尔市",
            area: [ "海拉尔市", "满洲里市", "扎兰屯市", "牙克石市", "根河市", "额尔古纳市", "阿荣旗", "莫力达瓦达斡尔族自治旗", "鄂伦春自治旗", "鄂温克族自治旗", "新巴尔虎右旗", "新巴尔虎左旗", "陈巴尔虎旗" ]
        }, {
            name: "兴安盟",
            area: [ "乌兰浩特市", "阿尔山市", "科尔沁右翼前旗", "科尔沁右翼中旗", "扎赉特旗", "突泉县" ]
        }, {
            name: "通辽市",
            area: [ "科尔沁区", "霍林郭勒市", "科尔沁左翼中旗", "科尔沁左翼后旗", "开鲁县", "库伦旗", "奈曼旗", "扎鲁特旗" ]
        }, {
            name: "锡林郭勒盟",
            area: [ "二连浩特市", "锡林浩特市", "阿巴嘎旗", "苏尼特左旗", "苏尼特右旗", "东乌珠穆沁旗", "西乌珠穆沁旗", "太仆寺旗", "镶黄旗", "正镶白旗", "正蓝旗", "多伦县" ]
        }, {
            name: "乌兰察布盟",
            area: [ "集宁市", "丰镇市", "卓资县", "化德县", "商都县", "兴和县", "凉城县", "察哈尔右翼前旗", "察哈尔右翼中旗", "察哈尔右翼后旗", "四子王旗" ]
        }, {
            name: "伊克昭盟",
            area: [ "东胜市", "达拉特旗", "准格尔旗", "鄂托克前旗", "鄂托克旗", "杭锦旗", "乌审旗", "伊金霍洛旗" ]
        }, {
            name: "巴彦淖尔盟",
            area: [ "临河市", "五原县", "磴口县", "乌拉特前旗", "乌拉特中旗", "乌拉特后旗", "杭锦后旗" ]
        }, {
            name: "阿拉善盟",
            area: [ "阿拉善左旗", "阿拉善右旗", "额济纳旗" ]
        } ]
    }, {
        name: "辽宁省",
        city: [ {
            name: "沈阳市",
            area: [ "沈河区", "皇姑区", "和平区", "大东区", "铁西区", "苏家屯区", "东陵区", "于洪区", "新民市", "法库县", "辽中县", "康平县", "新城子区", "其他" ]
        }, {
            name: "大连市",
            area: [ "西岗区", "中山区", "沙河口区", "甘井子区", "旅顺口区", "金州区", "瓦房店市", "普兰店市", "庄河市", "长海县", "其他" ]
        }, {
            name: "鞍山市",
            area: [ "铁东区", "铁西区", "立山区", "千山区", "海城市", "台安县", "岫岩满族自治县", "其他" ]
        }, {
            name: "抚顺市",
            area: [ "顺城区", "新抚区", "东洲区", "望花区", "抚顺县", "清原满族自治县", "新宾满族自治县", "其他" ]
        }, {
            name: "本溪市",
            area: [ "平山区", "明山区", "溪湖区", "南芬区", "本溪满族自治县", "桓仁满族自治县", "其他" ]
        }, {
            name: "丹东市",
            area: [ "振兴区", "元宝区", "振安区", "东港市", "凤城市", "宽甸满族自治县", "其他" ]
        }, {
            name: "锦州市",
            area: [ "太和区", "古塔区", "凌河区", "凌海市", "黑山县", "义县", "北宁市", "其他" ]
        }, {
            name: "营口市",
            area: [ "站前区", "西市区", "鲅鱼圈区", "老边区", "大石桥市", "盖州市", "其他" ]
        }, {
            name: "阜新市",
            area: [ "海州区", "新邱区", "太平区", "清河门区", "细河区", "彰武县", "阜新蒙古族自治县", "其他" ]
        }, {
            name: "辽阳市",
            area: [ "白塔区", "文圣区", "宏伟区", "太子河区", "弓长岭区", "灯塔市", "辽阳县", "其他" ]
        }, {
            name: "盘锦",
            area: [ "双台子区", "兴隆台区", "盘山县", "大洼县", "其他" ]
        }, {
            name: "铁岭市",
            area: [ "银州区", "清河区", "调兵山市", "开原市", "铁岭县", "昌图县", "西丰县", "其他" ]
        }, {
            name: "朝阳市",
            area: [ "双塔区", "龙城区", "凌源市", "北票市", "朝阳县", "建平县", "喀喇沁左翼蒙古族自治县", "其他" ]
        }, {
            name: "葫芦岛市",
            area: [ "龙港区", "南票区", "连山区", "兴城市", "绥中县", "建昌县", "其他" ]
        }, {
            name: "其他",
            area: [ "其他" ]
        } ]
    }, {
        name: "吉林省",
        city: [ {
            name: "长春市",
            area: [ "朝阳区", "宽城区", "二道区", "南关区", "绿园区", "双阳区", "九台市", "榆树市", "德惠市", "农安县", "其他" ]
        }, {
            name: "吉林市",
            area: [ "船营区", "昌邑区", "龙潭区", "丰满区", "舒兰市", "桦甸市", "蛟河市", "磐石市", "永吉县", "其他" ]
        }, {
            name: "四平",
            area: [ "铁西区", "铁东区", "公主岭市", "双辽市", "梨树县", "伊通满族自治县", "其他" ]
        }, {
            name: "辽源市",
            area: [ "龙山区", "西安区", "东辽县", "东丰县", "其他" ]
        }, {
            name: "通化市",
            area: [ "东昌区", "二道江区", "梅河口市", "集安市", "通化县", "辉南县", "柳河县", "其他" ]
        }, {
            name: "白山市",
            area: [ "八道江区", "江源区", "临江市", "靖宇县", "抚松县", "长白朝鲜族自治县", "其他" ]
        }, {
            name: "松原市",
            area: [ "宁江区", "乾安县", "长岭县", "扶余县", "前郭尔罗斯蒙古族自治县", "其他" ]
        }, {
            name: "白城市",
            area: [ "洮北区", "大安市", "洮南市", "镇赉县", "通榆县", "其他" ]
        }, {
            name: "延边朝鲜族自治州",
            area: [ "延吉市", "图们市", "敦化市", "龙井市", "珲春市", "和龙市", "安图县", "汪清县", "其他" ]
        }, {
            name: "其他",
            area: [ "其他" ]
        } ]
    }, {
        name: "黑龙江省",
        city: [ {
            name: "哈尔滨市",
            area: [ "松北区", "道里区", "南岗区", "平房区", "香坊区", "道外区", "呼兰区", "阿城区", "双城市", "尚志市", "五常市", "宾县", "方正县", "通河县", "巴彦县", "延寿县", "木兰县", "依兰县", "其他" ]
        }, {
            name: "齐齐哈尔市",
            area: [ "龙沙区", "昂昂溪区", "铁锋区", "建华区", "富拉尔基区", "碾子山区", "梅里斯达斡尔族区", "讷河市", "富裕县", "拜泉县", "甘南县", "依安县", "克山县", "泰来县", "克东县", "龙江县", "其他" ]
        }, {
            name: "鹤岗市",
            area: [ "兴山区", "工农区", "南山区", "兴安区", "向阳区", "东山区", "萝北县", "绥滨县", "其他" ]
        }, {
            name: "双鸭山",
            area: [ "尖山区", "岭东区", "四方台区", "宝山区", "集贤县", "宝清县", "友谊县", "饶河县", "其他" ]
        }, {
            name: "鸡西市",
            area: [ "鸡冠区", "恒山区", "城子河区", "滴道区", "梨树区", "麻山区", "密山市", "虎林市", "鸡东县", "其他" ]
        }, {
            name: "大庆市",
            area: [ "萨尔图区", "红岗区", "龙凤区", "让胡路区", "大同区", "林甸县", "肇州县", "肇源县", "杜尔伯特蒙古族自治县", "其他" ]
        }, {
            name: "伊春市",
            area: [ "伊春区", "带岭区", "南岔区", "金山屯区", "西林区", "美溪区", "乌马河区", "翠峦区", "友好区", "上甘岭区", "五营区", "红星区", "新青区", "汤旺河区", "乌伊岭区", "铁力市", "嘉荫县", "其他" ]
        }, {
            name: "牡丹江市",
            area: [ "爱民区", "东安区", "阳明区", "西安区", "绥芬河市", "宁安市", "海林市", "穆棱市", "林口县", "东宁县", "其他" ]
        }, {
            name: "佳木斯市",
            area: [ "向阳区", "前进区", "东风区", "郊区", "同江市", "富锦市", "桦川县", "抚远县", "桦南县", "汤原县", "其他" ]
        }, {
            name: "七台河市",
            area: [ "桃山区", "新兴区", "茄子河区", "勃利县", "其他" ]
        }, {
            name: "黑河市",
            area: [ "爱辉区", "北安市", "五大连池市", "逊克县", "嫩江县", "孙吴县", "其他" ]
        }, {
            name: "绥化市",
            area: [ "北林区", "安达市", "肇东市", "海伦市", "绥棱县", "兰西县", "明水县", "青冈县", "庆安县", "望奎县", "其他" ]
        }, {
            name: "大兴安岭地区",
            area: [ "呼玛县", "塔河县", "漠河县", "大兴安岭辖区", "其他" ]
        }, {
            name: "其他",
            area: [ "其他" ]
        } ]
    }, {
        name: "上海市",
        city: [ {
            name: "上海市",
            area: [ "黄浦区", "卢湾区", "徐汇区", "长宁区", "静安区", "普陀区", "闸北区", "虹口区", "杨浦区", "宝山区", "闵行区", "嘉定区", "松江区", "金山区", "青浦区", "南汇区", "奉贤区", "浦东新区", "崇明县", "其他" ]
        } ]
    }, {
        name: "江苏省",
        city: [ {
            name: "南京市",
            area: [ "玄武区", "白下区", "秦淮区", "建邺区", "鼓楼区", "下关区", "栖霞区", "雨花台区", "浦口区", "江宁区", "六合区", "溧水县", "高淳县", "其他" ]
        }, {
            name: "苏州市",
            area: [ "金阊区", "平江区", "沧浪区", "虎丘区", "吴中区", "相城区", "常熟市", "张家港市", "昆山市", "吴江市", "太仓市", "其他" ]
        }, {
            name: "无锡市",
            area: [ "崇安区", "南长区", "北塘区", "滨湖区", "锡山区", "惠山区", "江阴市", "宜兴市", "其他" ]
        }, {
            name: "常州市",
            area: [ "钟楼区", "天宁区", "戚墅堰区", "新北区", "武进区", "金坛市", "溧阳市", "其他" ]
        }, {
            name: "镇江市",
            area: [ "京口区", "润州区", "丹徒区", "丹阳市", "扬中市", "句容市", "其他" ]
        }, {
            name: "南通市",
            area: [ "崇川区", "港闸区", "通州市", "如皋市", "海门市", "启东市", "海安县", "如东县", "其他" ]
        }, {
            name: "泰州市",
            area: [ "海陵区", "高港区", "姜堰市", "泰兴市", "靖江市", "兴化市", "其他" ]
        }, {
            name: "扬州市",
            area: [ "广陵区", "维扬区", "邗江区", "江都市", "仪征市", "高邮市", "宝应县", "其他" ]
        }, {
            name: "盐城市",
            area: [ "亭湖区", "盐都区", "大丰市", "东台市", "建湖县", "射阳县", "阜宁县", "滨海县", "响水县", "其他" ]
        }, {
            name: "连云港市",
            area: [ "新浦区", "海州区", "连云区", "东海县", "灌云县", "赣榆县", "灌南县", "其他" ]
        }, {
            name: "徐州市",
            area: [ "云龙区", "鼓楼区", "九里区", "泉山区", "贾汪区", "邳州市", "新沂市", "铜山县", "睢宁县", "沛县", "丰县", "其他" ]
        }, {
            name: "淮安市",
            area: [ "清河区", "清浦区", "楚州区", "淮阴区", "涟水县", "洪泽县", "金湖县", "盱眙县", "其他" ]
        }, {
            name: "宿迁市",
            area: [ "宿城区", "宿豫区", "沭阳县", "泗阳县", "泗洪县", "其他" ]
        }, {
            name: "其他",
            area: [ "其他" ]
        } ]
    }, {
        name: "浙江省",
        city: [ {
            name: "杭州市",
            area: [ "拱墅区", "西湖区", "上城区", "下城区", "江干区", "滨江区", "余杭区", "萧山区", "建德市", "富阳市", "临安市", "桐庐县", "淳安县", "其他" ]
        }, {
            name: "宁波市",
            area: [ "海曙区", "江东区", "江北区", "镇海区", "北仑区", "鄞州区", "余姚市", "慈溪市", "奉化市", "宁海县", "象山县", "其他" ]
        }, {
            name: "温州市",
            area: [ "鹿城区", "龙湾区", "瓯海区", "瑞安市", "乐清市", "永嘉县", "洞头县", "平阳县", "苍南县", "文成县", "泰顺县", "其他" ]
        }, {
            name: "嘉兴市",
            area: [ "秀城区", "秀洲区", "海宁市", "平湖市", "桐乡市", "嘉善县", "海盐县", "其他" ]
        }, {
            name: "湖州市",
            area: [ "吴兴区", "南浔区", "长兴县", "德清县", "安吉县", "其他" ]
        }, {
            name: "绍兴市",
            area: [ "越城区", "诸暨市", "上虞市", "嵊州市", "绍兴县", "新昌县", "其他" ]
        }, {
            name: "金华市",
            area: [ "婺城区", "金东区", "兰溪市", "义乌市", "东阳市", "永康市", "武义县", "浦江县", "磐安县", "其他" ]
        }, {
            name: "衢州市",
            area: [ "柯城区", "衢江区", "江山市", "龙游县", "常山县", "开化县", "其他" ]
        }, {
            name: "舟山市",
            area: [ "定海区", "普陀区", "岱山县", "嵊泗县", "其他" ]
        }, {
            name: "台州市",
            area: [ "椒江区", "黄岩区", "路桥区", "临海市", "温岭市", "玉环县", "天台县", "仙居县", "三门县", "其他" ]
        }, {
            name: "丽水市",
            area: [ "莲都区", "龙泉市", "缙云县", "青田县", "云和县", "遂昌县", "松阳县", "庆元县", "景宁畲族自治县", "其他" ]
        }, {
            name: "其他市",
            area: [ "其他" ]
        } ]
    }, {
        name: "安徽省",
        city: [ {
            name: "合肥市",
            area: [ "庐阳区", "瑶海区", "蜀山区", "包河区", "长丰县", "肥东县", "肥西县", "其他" ]
        }, {
            name: "芜湖市",
            area: [ "镜湖区", "弋江区", "鸠江区", "三山区", "芜湖县", "南陵县", "繁昌县", "其他" ]
        }, {
            name: "蚌埠市",
            area: [ "蚌山区", "龙子湖区", "禹会区", "淮上区", "怀远县", "固镇县", "五河县", "其他" ]
        }, {
            name: "淮南市",
            area: [ "田家庵区", "大通区", "谢家集区", "八公山区", "潘集区", "凤台县", "其他" ]
        }, {
            name: "马鞍山市",
            area: [ "雨山区", "花山区", "金家庄区", "当涂县", "其他" ]
        }, {
            name: "淮北市",
            area: [ "相山区", "杜集区", "烈山区", "濉溪县", "其他" ]
        }, {
            name: "铜陵市",
            area: [ "铜官山区", "狮子山区", "郊区", "铜陵县", "其他" ]
        }, {
            name: "安庆市",
            area: [ "迎江区", "大观区", "宜秀区", "桐城市", "宿松县", "枞阳县", "太湖县", "怀宁县", "岳西县", "望江县", "潜山县", "其他" ]
        }, {
            name: "黄山市",
            area: [ "屯溪区", "黄山区", "徽州区", "休宁县", "歙县", "祁门县", "黟县", "其他" ]
        }, {
            name: "滁州市",
            area: [ "琅琊区", "南谯区", "天长市", "明光市", "全椒县", "来安县", "定远县", "凤阳县", "其他" ]
        }, {
            name: "阜阳市",
            area: [ "颍州区", "颍东区", "颍泉区", "界首市", "临泉县", "颍上县", "阜南县", "太和县", "其他" ]
        }, {
            name: "宿州市",
            area: [ "埇桥区", "萧县", "泗县", "砀山县", "灵璧县", "其他" ]
        }, {
            name: "巢湖市",
            area: [ "居巢区", "含山县", "无为县", "庐江县", "和县", "其他" ]
        }, {
            name: "六安市",
            area: [ "金安区", "裕安区", "寿县", "霍山县", "霍邱县", "舒城县", "金寨县", "其他" ]
        }, {
            name: "亳州市",
            area: [ "谯城区", "利辛县", "涡阳县", "蒙城县", "其他" ]
        }, {
            name: "池州市",
            area: [ "贵池区", "东至县", "石台县", "青阳县", "其他" ]
        }, {
            name: "宣城市",
            area: [ "宣州区", "宁国市", "广德县", "郎溪县", "泾县", "旌德县", "绩溪县", "其他" ]
        }, {
            name: "其他市",
            area: [ "其他" ]
        } ]
    }, {
        name: "福建省",
        city: [ {
            name: "福州市",
            area: [ "鼓楼区", "台江区", "仓山区", "马尾区", "晋安区", "福清市", "长乐市", "闽侯县", "闽清县", "永泰县", "连江县", "罗源县", "平潭县", "其他" ]
        }, {
            name: "厦门市",
            area: [ "思明区", "海沧区", "湖里区", "集美区", "同安区", "翔安区", "其他" ]
        }, {
            name: "莆田市",
            area: [ "城厢区", "涵江区", "荔城区", "秀屿区", "仙游县", "其他" ]
        }, {
            name: "三明市",
            area: [ "梅列区", "三元区", "永安市", "明溪县", "将乐县", "大田县", "宁化县", "建宁县", "沙县", "尤溪县", "清流县", "泰宁县", "其他" ]
        }, {
            name: "泉州市",
            area: [ "鲤城区", "丰泽区", "洛江区", "泉港区", "石狮市", "晋江市", "南安市", "惠安县", "永春县", "安溪县", "德化县", "金门县", "其他" ]
        }, {
            name: "漳州市",
            area: [ "芗城区", "龙文区", "龙海市", "平和县", "南靖县", "诏安县", "漳浦县", "华安县", "东山县", "长泰县", "云霄县", "其他" ]
        }, {
            name: "南平市",
            area: [ "延平区", "建瓯市", "邵武市", "武夷山市", "建阳市", "松溪县", "光泽县", "顺昌县", "浦城县", "政和县", "其他" ]
        }, {
            name: "龙岩市",
            area: [ "新罗区", "漳平市", "长汀县", "武平县", "上杭县", "永定县", "连城县", "其他" ]
        }, {
            name: "宁德市",
            area: [ "蕉城区", "福安市", "福鼎市", "寿宁县", "霞浦县", "柘荣县", "屏南县", "古田县", "周宁县", "其他" ]
        }, {
            name: "其他",
            area: [ "其他" ]
        } ]
    }, {
        name: "江西省",
        city: [ {
            name: "南昌市",
            area: [ "东湖区", "西湖区", "青云谱区", "湾里区", "青山湖区", "新建县", "南昌县", "进贤县", "安义县", "其他" ]
        }, {
            name: "景德镇市",
            area: [ "珠山区", "昌江区", "乐平市", "浮梁县", "其他" ]
        }, {
            name: "萍乡市",
            area: [ "安源区", "湘东区", "莲花县", "上栗县", "芦溪县", "其他" ]
        }, {
            name: "九江市",
            area: [ "浔阳区", "庐山区", "瑞昌市", "九江县", "星子县", "武宁县", "彭泽县", "永修县", "修水县", "湖口县", "德安县", "都昌县", "其他" ]
        }, {
            name: "新余市",
            area: [ "渝水区", "分宜县", "其他" ]
        }, {
            name: "鹰潭市",
            area: [ "月湖区", "贵溪市", "余江县", "其他" ]
        }, {
            name: "赣州市",
            area: [ "章贡区", "瑞金市", "南康市", "石城县", "安远县", "赣县", "宁都县", "寻乌县", "兴国县", "定南县", "上犹县", "于都县", "龙南县", "崇义县", "信丰县", "全南县", "大余县", "会昌县", "其他" ]
        }, {
            name: "吉安市",
            area: [ "吉州区", "青原区", "井冈山市", "吉安县", "永丰县", "永新县", "新干县", "泰和县", "峡江县", "遂川县", "安福县", "吉水县", "万安县", "其他" ]
        }, {
            name: "宜春市",
            area: [ "袁州区", "丰城市", "樟树市", "高安市", "铜鼓县", "靖安县", "宜丰县", "奉新县", "万载县", "上高县", "其他" ]
        }, {
            name: "抚州市",
            area: [ "临川区", "南丰县", "乐安县", "金溪县", "南城县", "东乡县", "资溪县", "宜黄县", "广昌县", "黎川县", "崇仁县", "其他" ]
        }, {
            name: "上饶市",
            area: [ "信州区", "德兴市", "上饶县", "广丰县", "鄱阳县", "婺源县", "铅山县", "余干县", "横峰县", "弋阳县", "玉山县", "万年县", "其他" ]
        }, {
            name: "其他",
            area: [ "其他" ]
        } ]
    }, {
        name: "山东省",
        city: [ {
            name: "济南市",
            area: [ "市中区", "历下区", "天桥区", "槐荫区", "历城区", "长清区", "章丘市", "平阴县", "济阳县", "商河县", "其他" ]
        }, {
            name: "青岛市",
            area: [ "市南区", "市北区", "城阳区", "四方区", "李沧区", "黄岛区", "崂山区", "胶南市", "胶州市", "平度市", "莱西市", "即墨市", "其他" ]
        }, {
            name: "淄博市",
            area: [ "张店区", "临淄区", "淄川区", "博山区", "周村区", "桓台县", "高青县", "沂源县", "其他" ]
        }, {
            name: "枣庄市",
            area: [ "市中区", "山亭区", "峄城区", "台儿庄区", "薛城区", "滕州市", "其他" ]
        }, {
            name: "东营市",
            area: [ "东营区", "河口区", "垦利县", "广饶县", "利津县", "其他" ]
        }, {
            name: "烟台市",
            area: [ "芝罘区", "福山区", "牟平区", "莱山区", "龙口市", "莱阳市", "莱州市", "招远市", "蓬莱市", "栖霞市", "海阳市", "长岛县", "其他" ]
        }, {
            name: "潍坊市",
            area: [ "潍城区", "寒亭区", "坊子区", "奎文区", "青州市", "诸城市", "寿光市", "安丘市", "高密市", "昌邑市", "昌乐县", "临朐县", "其他" ]
        }, {
            name: "济宁市",
            area: [ "市中区", "任城区", "曲阜市", "兖州市", "邹城市", "鱼台县", "金乡县", "嘉祥县", "微山县", "汶上县", "泗水县", "梁山县", "其他" ]
        }, {
            name: "泰安市",
            area: [ "泰山区", "岱岳区", "新泰市", "肥城市", "宁阳县", "东平县", "其他" ]
        }, {
            name: "威海市",
            area: [ "环翠区", "乳山市", "文登市", "荣成市", "其他" ]
        }, {
            name: "日照市",
            area: [ "东港区", "岚山区", "五莲县", "莒县", "其他" ]
        }, {
            name: "莱芜市",
            area: [ "莱城区", "钢城区", "其他" ]
        }, {
            name: "临沂市",
            area: [ "兰山区", "罗庄区", "河东区", "沂南县", "郯城县", "沂水县", "苍山县", "费县", "平邑县", "莒南县", "蒙阴县", "临沭县", "其他" ]
        }, {
            name: "德州市",
            area: [ "德城区", "乐陵市", "禹城市", "陵县", "宁津县", "齐河县", "武城县", "庆云县", "平原县", "夏津县", "临邑县", "其他" ]
        }, {
            name: "聊城市",
            area: [ "东昌府区", "临清市", "高唐县", "阳谷县", "茌平县", "莘县", "东阿县", "冠县", "其他" ]
        }, {
            name: "滨州市",
            area: [ "滨城区", "邹平县", "沾化县", "惠民县", "博兴县", "阳信县", "无棣县", "其他" ]
        }, {
            name: "菏泽市",
            area: [ "牡丹区", "鄄城县", "单县", "郓城县", "曹县", "定陶县", "巨野县", "东明县", "成武县", "其他" ]
        }, {
            name: "其他",
            area: [ "其他" ]
        } ]
    }, {
        name: "河南省",
        city: [ {
            name: "郑州市",
            area: [ "中原区", "金水区", "二七区", "管城回族区", "上街区", "惠济区", "巩义市", "新郑市", "新密市", "登封市", "荥阳市", "中牟县", "其他" ]
        }, {
            name: "开封市",
            area: [ "鼓楼区", "龙亭区", "顺河回族区", "禹王台区", "金明区", "开封县", "尉氏县", "兰考县", "杞县", "通许县", "其他" ]
        }, {
            name: "洛阳市",
            area: [ "西工区", "老城区", "涧西区", "瀍河回族区", "洛龙区", "吉利区", "偃师市", "孟津县", "汝阳县", "伊川县", "洛宁县", "嵩县", "宜阳县", "新安县", "栾川县", "其他" ]
        }, {
            name: "平顶山市",
            area: [ "新华区", "卫东区", "湛河区", "石龙区", "汝州市", "舞钢市", "宝丰县", "叶县", "郏县", "鲁山县", "其他" ]
        }, {
            name: "安阳市",
            area: [ "北关区", "文峰区", "殷都区", "龙安区", "林州市", "安阳县", "滑县", "内黄县", "汤阴县", "其他" ]
        }, {
            name: "鹤壁市",
            area: [ "淇滨区", "山城区", "鹤山区", "浚县", "淇县", "其他" ]
        }, {
            name: "新乡市",
            area: [ "卫滨区", "红旗区", "凤泉区", "牧野区", "卫辉市", "辉县市", "新乡县", "获嘉县", "原阳县", "长垣县", "封丘县", "延津县", "其他" ]
        }, {
            name: "焦作市",
            area: [ "解放区", "中站区", "马村区", "山阳区", "沁阳市", "孟州市", "修武县", "温县", "武陟县", "博爱县", "其他" ]
        }, {
            name: "濮阳市",
            area: [ "华龙区", "濮阳县", "南乐县", "台前县", "清丰县", "范县", "其他" ]
        }, {
            name: "许昌市",
            area: [ "魏都区", "禹州市", "长葛市", "许昌县", "鄢陵县", "襄城县", "其他" ]
        }, {
            name: "漯河市",
            area: [ "源汇区", "郾城区", "召陵区", "临颍县", "舞阳县", "其他" ]
        }, {
            name: "三门峡市",
            area: [ "湖滨区", "义马市", "灵宝市", "渑池县", "卢氏县", "陕县", "其他" ]
        }, {
            name: "南阳市",
            area: [ "卧龙区", "宛城区", "邓州市", "桐柏县", "方城县", "淅川县", "镇平县", "唐河县", "南召县", "内乡县", "新野县", "社旗县", "西峡县", "其他" ]
        }, {
            name: "商丘市",
            area: [ "梁园区", "睢阳区", "永城市", "宁陵县", "虞城县", "民权县", "夏邑县", "柘城县", "睢县", "其他" ]
        }, {
            name: "信阳市",
            area: [ "浉河区", "平桥区", "潢川县", "淮滨县", "息县", "新县", "商城县", "固始县", "罗山县", "光山县", "其他" ]
        }, {
            name: "周口市",
            area: [ "川汇区", "项城市", "商水县", "淮阳县", "太康县", "鹿邑县", "西华县", "扶沟县", "沈丘县", "郸城县", "其他" ]
        }, {
            name: "驻马店市",
            area: [ "驿城区", "确山县", "新蔡县", "上蔡县", "西平县", "泌阳县", "平舆县", "汝南县", "遂平县", "正阳县", "其他" ]
        }, {
            name: "焦作市",
            area: [ "济源市", "其他" ]
        }, {
            name: "其他",
            area: [ "其他" ]
        } ]
    }, {
        name: "湖北省",
        city: [ {
            name: "武汉市",
            area: [ "江岸区", "武昌区", "江汉区", "硚口区", "汉阳区", "青山区", "洪山区", "东西湖区", "汉南区", "蔡甸区", "江夏区", "黄陂区", "新洲区", "其他" ]
        }, {
            name: "黄石市",
            area: [ "黄石港区", "西塞山区", "下陆区", "铁山区", "大冶市", "阳新县", "其他" ]
        }, {
            name: "十堰市",
            area: [ "张湾区", "茅箭区", "丹江口市", "郧县", "竹山县", "房县", "郧西县", "竹溪县", "其他" ]
        }, {
            name: "荆州市",
            area: [ "沙市区", "荆州区", "洪湖市", "石首市", "松滋市", "监利县", "公安县", "江陵县", "其他" ]
        }, {
            name: "宜昌市",
            area: [ "西陵区", "伍家岗区", "点军区", "猇亭区", "夷陵区", "宜都市", "当阳市", "枝江市", "秭归县", "远安县", "兴山县", "五峰土家族自治县", "长阳土家族自治县", "其他" ]
        }, {
            name: "襄樊市",
            area: [ "襄城区", "樊城区", "襄阳区", "老河口市", "枣阳市", "宜城市", "南漳县", "谷城县", "保康县", "其他" ]
        }, {
            name: "鄂州市",
            area: [ "鄂城区", "华容区", "梁子湖区", "其他" ]
        }, {
            name: "荆门市",
            area: [ "东宝区", "掇刀区", "钟祥市", "京山县", "沙洋县", "其他" ]
        }, {
            name: "孝感市",
            area: [ "孝南区", "应城市", "安陆市", "汉川市", "云梦县", "大悟县", "孝昌县", "其他" ]
        }, {
            name: "黄冈市",
            area: [ "黄州区", "麻城市", "武穴市", "红安县", "罗田县", "浠水县", "蕲春县", "黄梅县", "英山县", "团风县", "其他" ]
        }, {
            name: "咸宁市",
            area: [ "咸安区", "赤壁市", "嘉鱼县", "通山县", "崇阳县", "通城县", "其他" ]
        }, {
            name: "随州市",
            area: [ "曾都区", "广水市", "其他" ]
        }, {
            name: "恩施土家族苗族自治州",
            area: [ "恩施市", "利川市", "建始县", "来凤县", "巴东县", "鹤峰县", "宣恩县", "咸丰县", "其他" ]
        }, {
            name: "仙桃市",
            area: [ "仙桃" ]
        }, {
            name: "天门市",
            area: [ "天门" ]
        }, {
            name: "潜江市",
            area: [ "潜江" ]
        }, {
            name: "神农架林区",
            area: [ "神农架林区" ]
        }, {
            name: "其他",
            area: [ "其他" ]
        } ]
    }, {
        name: "湖南省",
        city: [ {
            name: "长沙市",
            area: [ "岳麓区", "芙蓉区", "天心区", "开福区", "雨花区", "浏阳市", "长沙县", "望城县", "宁乡县", "其他" ]
        }, {
            name: "株洲市",
            area: [ "天元区", "荷塘区", "芦淞区", "石峰区", "醴陵市", "株洲县", "炎陵县", "茶陵县", "攸县", "其他" ]
        }, {
            name: "湘潭市",
            area: [ "岳塘区", "雨湖区", "湘乡市", "韶山市", "湘潭县", "其他" ]
        }, {
            name: "衡阳市",
            area: [ "雁峰区", "珠晖区", "石鼓区", "蒸湘区", "南岳区", "耒阳市", "常宁市", "衡阳县", "衡东县", "衡山县", "衡南县", "祁东县", "其他" ]
        }, {
            name: "邵阳市",
            area: [ "双清区", "大祥区", "北塔区", "武冈市", "邵东县", "洞口县", "新邵县", "绥宁县", "新宁县", "邵阳县", "隆回县", "城步苗族自治县", "其他" ]
        }, {
            name: "岳阳市",
            area: [ "岳阳楼区", "云溪区", "君山区", "临湘市", "汨罗市", "岳阳县", "湘阴县", "平江县", "华容县", "其他" ]
        }, {
            name: "常德市",
            area: [ "武陵区", "鼎城区", "津市市", "澧县", "临澧县", "桃源县", "汉寿县", "安乡县", "石门县", "其他" ]
        }, {
            name: "张家界市",
            area: [ "永定区", "武陵源区", "慈利县", "桑植县", "其他" ]
        }, {
            name: "益阳市",
            area: [ "赫山区", "资阳区", "沅江市", "桃江县", "南县", "安化县", "其他" ]
        }, {
            name: "郴州市",
            area: [ "北湖区", "苏仙区", "资兴市", "宜章县", "汝城县", "安仁县", "嘉禾县", "临武县", "桂东县", "永兴县", "桂阳县", "其他" ]
        }, {
            name: "永州市",
            area: [ "冷水滩区", "零陵区", "祁阳县", "蓝山县", "宁远县", "新田县", "东安县", "江永县", "道县", "双牌县", "江华瑶族自治县", "其他" ]
        }, {
            name: "怀化市",
            area: [ "鹤城区", "洪江市", "会同县", "沅陵县", "辰溪县", "溆浦县", "中方县", "新晃侗族自治县", "芷江侗族自治县", "通道侗族自治县", "靖州苗族侗族自治县", "麻阳苗族自治县", "其他" ]
        }, {
            name: "娄底市",
            area: [ "娄星区", "冷水江市", "涟源市", "新化县", "双峰县", "其他" ]
        }, {
            name: "湘西土家族苗族自治州",
            area: [ "吉首市", "古丈县", "龙山县", "永顺县", "凤凰县", "泸溪县", "保靖县", "花垣县", "其他" ]
        }, {
            name: "其他",
            area: [ "其他" ]
        } ]
    }, {
        name: "广东省",
        city: [ {
            name: "广州市",
            area: [ "越秀区", "荔湾区", "海珠区", "天河区", "白云区", "黄埔区", "番禺区", "花都区", "南沙区", "萝岗区", "增城市", "从化市", "其他" ]
        }, {
            name: "深圳市",
            area: [ "福田区", "罗湖区", "南山区", "宝安区", "龙岗区", "盐田区", "其他" ]
        }, {
            name: "东莞市",
            area: [ "莞城", "常平", "塘厦", "塘厦", "塘厦", "其他" ]
        }, {
            name: "中山市",
            area: [ "中山" ]
        }, {
            name: "潮州市",
            area: [ "湘桥区", "潮安县", "饶平县", "其他" ]
        }, {
            name: "揭阳市",
            area: [ "榕城区", "揭东县", "揭西县", "惠来县", "普宁市", "其他" ]
        }, {
            name: "云浮市",
            area: [ "云城区", "新兴县", "郁南县", "云安县", "罗定市", "其他" ]
        }, {
            name: "珠海市",
            area: [ "香洲区", "斗门区", "金湾区", "其他" ]
        }, {
            name: "汕头市",
            area: [ "金平区", "濠江区", "龙湖区", "潮阳区", "潮南区", "澄海区", "南澳县", "其他" ]
        }, {
            name: "韶关市",
            area: [ "浈江区", "武江区", "曲江区", "乐昌市", "南雄市", "始兴县", "仁化县", "翁源县", "新丰县", "乳源瑶族自治县", "其他" ]
        }, {
            name: "佛山市",
            area: [ "禅城区", "南海区", "顺德区", "三水区", "高明区", "其他" ]
        }, {
            name: "江门市",
            area: [ "蓬江区", "江海区", "新会区", "恩平市", "台山市", "开平市", "鹤山市", "其他" ]
        }, {
            name: "湛江市",
            area: [ "赤坎区", "霞山区", "坡头区", "麻章区", "吴川市", "廉江市", "雷州市", "遂溪县", "徐闻县", "其他" ]
        }, {
            name: "茂名市",
            area: [ "茂南区", "茂港区", "化州市", "信宜市", "高州市", "电白县", "其他" ]
        }, {
            name: "肇庆市",
            area: [ "端州区", "鼎湖区", "高要市", "四会市", "广宁县", "怀集县", "封开县", "德庆县", "其他" ]
        }, {
            name: "惠州市",
            area: [ "惠城区", "惠阳区", "博罗县", "惠东县", "龙门县", "其他" ]
        }, {
            name: "梅州市",
            area: [ "梅江区", "兴宁市", "梅县", "大埔县", "丰顺县", "五华县", "平远县", "蕉岭县", "其他" ]
        }, {
            name: "汕尾市",
            area: [ "城区", "陆丰市", "海丰县", "陆河县", "其他" ]
        }, {
            name: "河源市",
            area: [ "源城区", "紫金县", "龙川县", "连平县", "和平县", "东源县", "其他" ]
        }, {
            name: "阳江市",
            area: [ "江城区", "阳春市", "阳西县", "阳东县", "其他" ]
        }, {
            name: "清远市",
            area: [ "清城区", "英德市", "连州市", "佛冈县", "阳山县", "清新县", "连山壮族瑶族自治县", "连南瑶族自治县", "其他" ]
        } ]
    }, {
        name: "广西",
        city: [ {
            name: "南宁市",
            area: [ "青秀区", "兴宁区", "西乡塘区", "良庆区", "江南区", "邕宁区", "武鸣县", "隆安县", "马山县", "上林县", "宾阳县", "横县", "其他" ]
        }, {
            name: "柳州市",
            area: [ "城中区", "鱼峰区", "柳北区", "柳南区", "柳江县", "柳城县", "鹿寨县", "融安县", "融水苗族自治县", "三江侗族自治县", "其他" ]
        }, {
            name: "桂林市",
            area: [ "象山区", "秀峰区", "叠彩区", "七星区", "雁山区", "阳朔县", "临桂县", "灵川县", "全州县", "平乐县", "兴安县", "灌阳县", "荔浦县", "资源县", "永福县", "龙胜各族自治县", "恭城瑶族自治县", "其他" ]
        }, {
            name: "梧州市",
            area: [ "万秀区", "蝶山区", "长洲区", "岑溪市", "苍梧县", "藤县", "蒙山县", "其他" ]
        }, {
            name: "北海市",
            area: [ "海城区", "银海区", "铁山港区", "合浦县", "其他" ]
        }, {
            name: "防城港市",
            area: [ "港口区", "防城区", "东兴市", "上思县", "其他" ]
        }, {
            name: "钦州市",
            area: [ "钦南区", "钦北区", "灵山县", "浦北县", "其他" ]
        }, {
            name: "贵港市",
            area: [ "港北区", "港南区", "覃塘区", "桂平市", "平南县", "其他" ]
        }, {
            name: "玉林市",
            area: [ "玉州区", "北流市", "容县", "陆川县", "博白县", "兴业县", "其他" ]
        }, {
            name: "百色市",
            area: [ "右江区", "凌云县", "平果县", "西林县", "乐业县", "德保县", "田林县", "田阳县", "靖西县", "田东县", "那坡县", "隆林各族自治县", "其他" ]
        }, {
            name: "贺州市",
            area: [ "八步区", "钟山县", "昭平县", "富川瑶族自治县", "其他" ]
        }, {
            name: "河池市",
            area: [ "金城江区", "宜州市", "天峨县", "凤山县", "南丹县", "东兰县", "都安瑶族自治县", "罗城仫佬族自治县", "巴马瑶族自治县", "环江毛南族自治县", "大化瑶族自治县", "其他" ]
        }, {
            name: "来宾市",
            area: [ "兴宾区", "合山市", "象州县", "武宣县", "忻城县", "金秀瑶族自治县", "其他" ]
        }, {
            name: "崇左市",
            area: [ "江州区", "凭祥市", "宁明县", "扶绥县", "龙州县", "大新县", "天等县", "其他" ]
        }, {
            name: "其他市",
            area: [ "其他" ]
        } ]
    }, {
        name: "海南省",
        city: [ {
            name: "海口市",
            area: [ "龙华区", "秀英区", "琼山区", "美兰区", "其他" ]
        }, {
            name: "三亚市",
            area: [ "三亚市", "其他" ]
        }, {
            name: "五指山市",
            area: [ "五指山" ]
        }, {
            name: "琼海市",
            area: [ "琼海" ]
        }, {
            name: "儋州市",
            area: [ "儋州" ]
        }, {
            name: "文昌市",
            area: [ "文昌" ]
        }, {
            name: "万宁市",
            area: [ "万宁" ]
        }, {
            name: "东方市",
            area: [ "东方" ]
        }, {
            name: "澄迈县",
            area: [ "澄迈县" ]
        }, {
            name: "定安县",
            area: [ "定安县" ]
        }, {
            name: "屯昌县",
            area: [ "屯昌县" ]
        }, {
            name: "临高县",
            area: [ "临高县" ]
        }, {
            name: "白沙黎族自治县",
            area: [ "白沙黎族自治县" ]
        }, {
            name: "昌江黎族自治县",
            area: [ "昌江黎族自治县" ]
        }, {
            name: "乐东黎族自治县",
            area: [ "乐东黎族自治县" ]
        }, {
            name: "陵水黎族自治县",
            area: [ "陵水黎族自治县" ]
        }, {
            name: "保亭黎族苗族自治县",
            area: [ "保亭黎族苗族自治县" ]
        }, {
            name: "琼中黎族苗族自治县",
            area: [ "琼中黎族苗族自治县" ]
        }, {
            name: "其他",
            area: [ "其他" ]
        } ]
    }, {
        name: "重庆市",
        city: [ {
            name: "重庆市",
            area: [ "渝中区", "大渡口区", "江北区", "南岸区", "北碚区", "渝北区", "巴南区", "长寿区", "双桥区", "沙坪坝区", "万盛区", "万州区", "涪陵区", "黔江区", "永川区", "合川区", "江津区", "九龙坡区", "南川区", "綦江县", "潼南县", "荣昌县", "璧山县", "大足县", "铜梁县", "梁平县", "开县", "忠县", "城口县", "垫江县", "武隆县", "丰都县", "奉节县", "云阳县", "巫溪县", "巫山县", "石柱土家族自治县", "秀山土家族苗族自治县", "酉阳土家族苗族自治县", "彭水苗族土家族自治县", "其他" ]
        } ]
    }, {
        name: "四川省",
        city: [ {
            name: "成都市",
            area: [ "青羊区", "锦江区", "金牛区", "武侯区", "成华区", "龙泉驿区", "青白江区", "新都区", "温江区", "都江堰市", "彭州市", "邛崃市", "崇州市", "金堂县", "郫县", "新津县", "双流县", "蒲江县", "大邑县", "其他" ]
        }, {
            name: "自贡市",
            area: [ "大安区", "自流井区", "贡井区", "沿滩区", "荣县", "富顺县", "其他" ]
        }, {
            name: "攀枝花市",
            area: [ "仁和区", "米易县", "盐边县", "东区", "西区", "其他" ]
        }, {
            name: "泸州市",
            area: [ "江阳区", "纳溪区", "龙马潭区", "泸县", "合江县", "叙永县", "古蔺县", "其他" ]
        }, {
            name: "德阳市",
            area: [ "旌阳区", "广汉市", "什邡市", "绵竹市", "罗江县", "中江县", "其他" ]
        }, {
            name: "绵阳市",
            area: [ "涪城区", "游仙区", "江油市", "盐亭县", "三台县", "平武县", "安县", "梓潼县", "北川羌族自治县", "其他" ]
        }, {
            name: "广元市",
            area: [ "元坝区", "朝天区", "青川县", "旺苍县", "剑阁县", "苍溪县", "市中区", "其他" ]
        }, {
            name: "遂宁市",
            area: [ "船山区", "安居区", "射洪县", "蓬溪县", "大英县", "其他" ]
        }, {
            name: "内江市",
            area: [ "市中区", "东兴区", "资中县", "隆昌县", "威远县", "其他" ]
        }, {
            name: "乐山市",
            area: [ "市中区", "五通桥区", "沙湾区", "金口河区", "峨眉山市", "夹江县", "井研县", "犍为县", "沐川县", "马边彝族自治县", "峨边彝族自治县", "其他" ]
        }, {
            name: "南充",
            area: [ "顺庆区", "高坪区", "嘉陵区", "阆中市", "营山县", "蓬安县", "仪陇县", "南部县", "西充县", "其他" ]
        }, {
            name: "眉山市",
            area: [ "东坡区", "仁寿县", "彭山县", "洪雅县", "丹棱县", "青神县", "其他" ]
        }, {
            name: "宜宾市",
            area: [ "翠屏区", "宜宾县", "兴文县", "南溪县", "珙县", "长宁县", "高县", "江安县", "筠连县", "屏山县", "其他" ]
        }, {
            name: "广安市",
            area: [ "广安区", "华蓥市", "岳池县", "邻水县", "武胜县", "其他" ]
        }, {
            name: "达州市",
            area: [ "通川区", "万源市", "达县", "渠县", "宣汉县", "开江县", "大竹县", "其他" ]
        }, {
            name: "雅安市",
            area: [ "雨城区", "芦山县", "石棉县", "名山县", "天全县", "荥经县", "宝兴县", "汉源县", "其他" ]
        }, {
            name: "巴中市",
            area: [ "巴州区", "南江县", "平昌县", "通江县", "其他" ]
        }, {
            name: "资阳市",
            area: [ "雁江区", "简阳市", "安岳县", "乐至县", "其他" ]
        }, {
            name: "阿坝藏族羌族自治州",
            area: [ "马尔康县", "九寨沟县", "红原县", "汶川县", "阿坝县", "理县", "若尔盖县", "小金县", "黑水县", "金川县", "松潘县", "壤塘县", "茂县", "其他" ]
        }, {
            name: "甘孜藏族自治州",
            area: [ "康定县", "丹巴县", "炉霍县", "九龙县", "甘孜县", "雅江县", "新龙县", "道孚县", "白玉县", "理塘县", "德格县", "乡城县", "石渠县", "稻城县", "色达县", "巴塘县", "泸定县", "得荣县", "其他" ]
        }, {
            name: "凉山彝族自治州",
            area: [ "西昌市", "美姑县", "昭觉县", "金阳县", "甘洛县", "布拖县", "雷波县", "普格县", "宁南县", "喜德县", "会东县", "越西县", "会理县", "盐源县", "德昌县", "冕宁县", "木里藏族自治县", "其他" ]
        }, {
            name: "其他",
            area: [ "其他" ]
        } ]
    }, {
        name: "贵州省",
        city: [ {
            name: "贵阳市",
            area: [ "南明区", "云岩区", "花溪区", "乌当区", "白云区", "小河区", "清镇市", "开阳县", "修文县", "息烽县", "其他" ]
        }, {
            name: "六盘水市",
            area: [ "钟山区", "水城县", "盘县", "六枝特区", "其他" ]
        }, {
            name: "遵义市",
            area: [ "红花岗区", "汇川区", "赤水市", "仁怀市", "遵义县", "绥阳县", "桐梓县", "习水县", "凤冈县", "正安县", "余庆县", "湄潭县", "道真仡佬族苗族自治县", "务川仡佬族苗族自治县", "其他" ]
        }, {
            name: "安顺市",
            area: [ "西秀区", "普定县", "平坝县", "镇宁布依族苗族自治县", "紫云苗族布依族自治县", "关岭布依族苗族自治县", "其他" ]
        }, {
            name: "铜仁地区",
            area: [ "铜仁市", "德江县", "江口县", "思南县", "石阡县", "玉屏侗族自治县", "松桃苗族自治县", "印江土家族苗族自治县", "沿河土家族自治县", "万山特区", "其他" ]
        }, {
            name: "毕节地区",
            area: [ "毕节市", "黔西县", "大方县", "织金县", "金沙县", "赫章县", "纳雍县", "威宁彝族回族苗族自治县", "其他" ]
        }, {
            name: "黔西南布依族苗族自治州",
            area: [ "兴义市", "望谟县", "兴仁县", "普安县", "册亨县", "晴隆县", "贞丰县", "安龙县", "其他" ]
        }, {
            name: "黔东南苗族侗族自治州",
            area: [ "凯里市", "施秉县", "从江县", "锦屏县", "镇远县", "麻江县", "台江县", "天柱县", "黄平县", "榕江县", "剑河县", "三穗县", "雷山县", "黎平县", "岑巩县", "丹寨县", "其他" ]
        }, {
            name: "黔南布依族苗族自治州",
            area: [ "都匀市", "福泉市", "贵定县", "惠水县", "罗甸县", "瓮安县", "荔波县", "龙里县", "平塘县", "长顺县", "独山县", "三都水族自治县", "其他" ]
        }, {
            name: "其他",
            area: [ "其他" ]
        } ]
    }, {
        name: "云南省",
        city: [ {
            name: "昆明市",
            area: [ "盘龙区", "五华区", "官渡区", "西山区", "东川区", "安宁市", "呈贡县", "晋宁县", "富民县", "宜良县", "嵩明县", "石林彝族自治县", "禄劝彝族苗族自治县", "寻甸回族彝族自治县", "其他" ]
        }, {
            name: "曲靖市",
            area: [ "麒麟区", "宣威市", "马龙县", "沾益县", "富源县", "罗平县", "师宗县", "陆良县", "会泽县", "其他" ]
        }, {
            name: "玉溪市",
            area: [ "红塔区", "江川县", "澄江县", "通海县", "华宁县", "易门县", "峨山彝族自治县", "新平彝族傣族自治县", "元江哈尼族彝族傣族自治县", "其他" ]
        }, {
            name: "保山市",
            area: [ "隆阳区", "施甸县", "腾冲县", "龙陵县", "昌宁县", "其他" ]
        }, {
            name: "昭通市",
            area: [ "昭阳区", "鲁甸县", "巧家县", "盐津县", "大关县", "永善县", "绥江县", "镇雄县", "彝良县", "威信县", "水富县", "其他" ]
        }, {
            name: "丽江市",
            area: [ "古城区", "永胜县", "华坪县", "玉龙纳西族自治县", "宁蒗彝族自治县", "其他" ]
        }, {
            name: "普洱市",
            area: [ "思茅区", "普洱哈尼族彝族自治县", "墨江哈尼族自治县", "景东彝族自治县", "景谷傣族彝族自治县", "镇沅彝族哈尼族拉祜族自治县", "江城哈尼族彝族自治县", "孟连傣族拉祜族佤族自治县", "澜沧拉祜族自治县", "西盟佤族自治县", "其他" ]
        }, {
            name: "临沧市",
            area: [ "临翔区", "凤庆县", "云县", "永德县", "镇康县", "双江拉祜族佤族布朗族傣族自治县", "耿马傣族佤族自治县", "沧源佤族自治县", "其他" ]
        }, {
            name: "德宏傣族景颇族自治州",
            area: [ "潞西市", "瑞丽市", "梁河县", "盈江县", "陇川县", "其他" ]
        }, {
            name: "怒江傈僳族自治州",
            area: [ "泸水县", "福贡县", "贡山独龙族怒族自治县", "兰坪白族普米族自治县", "其他" ]
        }, {
            name: "迪庆藏族自治州",
            area: [ "香格里拉县", "德钦县", "维西傈僳族自治县", "其他" ]
        }, {
            name: "大理白族自治州",
            area: [ "大理市", "祥云县", "宾川县", "弥渡县", "永平县", "云龙县", "洱源县", "剑川县", "鹤庆县", "漾濞彝族自治县", "南涧彝族自治县", "巍山彝族回族自治县", "其他" ]
        }, {
            name: "楚雄彝族自治州",
            area: [ "楚雄市", "双柏县", "牟定县", "南华县", "姚安县", "大姚县", "永仁县", "元谋县", "武定县", "禄丰县", "其他" ]
        }, {
            name: "红河哈尼族彝族自治州",
            area: [ "蒙自县", "个旧市", "开远市", "绿春县", "建水县", "石屏县", "弥勒县", "泸西县", "元阳县", "红河县", "金平苗族瑶族傣族自治县", "河口瑶族自治县", "屏边苗族自治县", "其他" ]
        }, {
            name: "文山壮族苗族自治州",
            area: [ "文山县", "砚山县", "西畴县", "麻栗坡县", "马关县", "丘北县", "广南县", "富宁县", "其他" ]
        }, {
            name: "西双版纳傣族自治州",
            area: [ "景洪市", "勐海县", "勐腊县", "其他" ]
        }, {
            name: "其他",
            area: [ "其他" ]
        } ]
    }, {
        name: "西藏",
        city: [ {
            name: "拉萨市",
            area: [ "城关区", "林周县", "当雄县", "尼木县", "曲水县", "堆龙德庆县", "达孜县", "墨竹工卡县", "其他" ]
        }, {
            name: "那曲地区",
            area: [ "那曲县", "嘉黎县", "比如县", "聂荣县", "安多县", "申扎县", "索县", "班戈县", "巴青县", "尼玛县", "其他" ]
        }, {
            name: "昌都地区",
            area: [ "昌都县", "江达县", "贡觉县", "类乌齐县", "丁青县", "察雅县", "八宿县", "左贡县", "芒康县", "洛隆县", "边坝县", "其他" ]
        }, {
            name: "林芝地区",
            area: [ "林芝县", "工布江达县", "米林县", "墨脱县", "波密县", "察隅县", "朗县", "其他" ]
        }, {
            name: "山南地区",
            area: [ "乃东县", "扎囊县", "贡嘎县", "桑日县", "琼结县", "曲松县", "措美县", "洛扎县", "加查县", "隆子县", "错那县", "浪卡子县", "其他" ]
        }, {
            name: "日喀则地区",
            area: [ "日喀则市", "南木林县", "江孜县", "定日县", "萨迦县", "拉孜县", "昂仁县", "谢通门县", "白朗县", "仁布县", "康马县", "定结县", "仲巴县", "亚东县", "吉隆县", "聂拉木县", "萨嘎县", "岗巴县", "其他" ]
        }, {
            name: "阿里地区",
            area: [ "噶尔县", "普兰县", "札达县", "日土县", "革吉县", "改则县", "措勤县", "其他" ]
        }, {
            name: "其他",
            area: [ "其他" ]
        } ]
    }, {
        name: "陕西省",
        city: [ {
            name: "西安市",
            area: [ "莲湖区", "新城区", "碑林区", "雁塔区", "灞桥区", "未央区", "阎良区", "临潼区", "长安区", "高陵县", "蓝田县", "户县", "周至县", "其他" ]
        }, {
            name: "铜川市",
            area: [ "耀州区", "王益区", "印台区", "宜君县", "其他" ]
        }, {
            name: "宝鸡市",
            area: [ "渭滨区", "金台区", "陈仓区", "岐山县", "凤翔县", "陇县", "太白县", "麟游县", "扶风县", "千阳县", "眉县", "凤县", "其他" ]
        }, {
            name: "咸阳市",
            area: [ "秦都区", "渭城区", "杨陵区", "兴平市", "礼泉县", "泾阳县", "永寿县", "三原县", "彬县", "旬邑县", "长武县", "乾县", "武功县", "淳化县", "其他" ]
        }, {
            name: "渭南市",
            area: [ "临渭区", "韩城市", "华阴市", "蒲城县", "潼关县", "白水县", "澄城县", "华县", "合阳县", "富平县", "大荔县", "其他" ]
        }, {
            name: "延安市",
            area: [ "宝塔区", "安塞县", "洛川县", "子长县", "黄陵县", "延川县", "富县", "延长县", "甘泉县", "宜川县", "志丹县", "黄龙县", "吴起县", "其他" ]
        }, {
            name: "汉中市",
            area: [ "汉台区", "留坝县", "镇巴县", "城固县", "南郑县", "洋县", "宁强县", "佛坪县", "勉县", "西乡县", "略阳县", "其他" ]
        }, {
            name: "榆林市",
            area: [ "榆阳区", "清涧县", "绥德县", "神木县", "佳县", "府谷县", "子洲县", "靖边县", "横山县", "米脂县", "吴堡县", "定边县", "其他" ]
        }, {
            name: "安康市",
            area: [ "汉滨区", "紫阳县", "岚皋县", "旬阳县", "镇坪县", "平利县", "石泉县", "宁陕县", "白河县", "汉阴县", "其他" ]
        }, {
            name: "商洛市",
            area: [ "商州区", "镇安县", "山阳县", "洛南县", "商南县", "丹凤县", "柞水县", "其他" ]
        }, {
            name: "其他",
            area: [ "其他" ]
        } ]
    }, {
        name: "甘肃省",
        city: [ {
            name: "兰州市",
            area: [ "城关区", "七里河区", "西固区", "安宁区", "红古区", "永登县", "皋兰县", "榆中县", "其他" ]
        }, {
            name: "嘉峪关市",
            area: [ "嘉峪关市", "其他" ]
        }, {
            name: "金昌市",
            area: [ "金川区", "永昌县", "其他" ]
        }, {
            name: "白银市",
            area: [ "白银区", "平川区", "靖远县", "会宁县", "景泰县", "其他" ]
        }, {
            name: "天水市",
            area: [ "清水县", "秦安县", "甘谷县", "武山县", "张家川回族自治县", "北道区", "秦城区", "其他" ]
        }, {
            name: "武威市",
            area: [ "凉州区", "民勤县", "古浪县", "天祝藏族自治县", "其他" ]
        }, {
            name: "酒泉市",
            area: [ "肃州区", "玉门市", "敦煌市", "金塔县", "肃北蒙古族自治县", "阿克塞哈萨克族自治县", "安西县", "其他" ]
        }, {
            name: "张掖市",
            area: [ "甘州区", "民乐县", "临泽县", "高台县", "山丹县", "肃南裕固族自治县", "其他" ]
        }, {
            name: "庆阳市",
            area: [ "西峰区", "庆城县", "环县", "华池县", "合水县", "正宁县", "宁县", "镇原县", "其他" ]
        }, {
            name: "平凉市",
            area: [ "崆峒区", "泾川县", "灵台县", "崇信县", "华亭县", "庄浪县", "静宁县", "其他" ]
        }, {
            name: "定西市",
            area: [ "安定区", "通渭县", "临洮县", "漳县", "岷县", "渭源县", "陇西县", "其他" ]
        }, {
            name: "陇南市",
            area: [ "武都区", "成县", "宕昌县", "康县", "文县", "西和县", "礼县", "两当县", "徽县", "其他" ]
        }, {
            name: "临夏回族自治州",
            area: [ "临夏市", "临夏县", "康乐县", "永靖县", "广河县", "和政县", "东乡族自治县", "积石山保安族东乡族撒拉族自治县", "其他" ]
        }, {
            name: "甘南藏族自治州",
            area: [ "合作市", "临潭县", "卓尼县", "舟曲县", "迭部县", "玛曲县", "碌曲县", "夏河县", "其他" ]
        }, {
            name: "其他",
            area: [ "其他" ]
        } ]
    }, {
        name: "青海省",
        city: [ {
            name: "西宁市",
            area: [ "城中区", "城东区", "城西区", "城北区", "湟源县", "湟中县", "大通回族土族自治县", "其他" ]
        }, {
            name: "海东地区",
            area: [ "平安县", "乐都县", "民和回族土族自治县", "互助土族自治县", "化隆回族自治县", "循化撒拉族自治县", "其他" ]
        }, {
            name: "海北藏族自治州",
            area: [ "海晏县", "祁连县", "刚察县", "门源回族自治县", "其他" ]
        }, {
            name: "海南藏族自治州",
            area: [ "共和县", "同德县", "贵德县", "兴海县", "贵南县", "其他" ]
        }, {
            name: "黄南藏族自治州",
            area: [ "同仁县", "尖扎县", "泽库县", "河南蒙古族自治县", "其他" ]
        }, {
            name: "果洛藏族自治州",
            area: [ "玛沁县", "班玛县", "甘德县", "达日县", "久治县", "玛多县", "其他" ]
        }, {
            name: "玉树藏族自治州",
            area: [ "玉树县", "杂多县", "称多县", "治多县", "囊谦县", "曲麻莱县", "其他" ]
        }, {
            name: "海西蒙古族藏族自治州",
            area: [ "德令哈市", "格尔木市", "乌兰县", "都兰县", "天峻县", "其他" ]
        }, {
            name: "其他",
            area: [ "其他" ]
        } ]
    }, {
        name: "宁夏",
        city: [ {
            name: "银川市",
            area: [ "兴庆区", "西夏区", "金凤区", "灵武市", "永宁县", "贺兰县", "其他" ]
        }, {
            name: "石嘴山市",
            area: [ "大武口区", "惠农区", "平罗县", "其他" ]
        }, {
            name: "吴忠市",
            area: [ "利通区", "青铜峡市", "盐池县", "同心县", "其他" ]
        }, {
            name: "固原市",
            area: [ "原州区", "西吉县", "隆德县", "泾源县", "彭阳县", "其他" ]
        }, {
            name: "中卫市",
            area: [ "沙坡头区", "中宁县", "海原县", "其他" ]
        }, {
            name: "其他",
            area: [ "其他" ]
        } ]
    }, {
        name: "新疆",
        city: [ {
            name: "乌鲁木齐市",
            area: [ "天山区", "沙依巴克区", "新市区", "水磨沟区", "头屯河区", "达坂城区", "东山区", "乌鲁木齐县", "其他" ]
        }, {
            name: "克拉玛依市",
            area: [ "克拉玛依区", "独山子区", "白碱滩区", "乌尔禾区", "其他" ]
        }, {
            name: "吐鲁番地区",
            area: [ "吐鲁番市", "托克逊县", "鄯善县", "其他" ]
        }, {
            name: "哈密地区",
            area: [ "哈密市", "伊吾县", "巴里坤哈萨克自治县", "其他" ]
        }, {
            name: "和田地区",
            area: [ "和田市", "和田县", "洛浦县", "民丰县", "皮山县", "策勒县", "于田县", "墨玉县", "其他" ]
        }, {
            name: "阿克苏地区",
            area: [ "阿克苏市", "温宿县", "沙雅县", "拜城县", "阿瓦提县", "库车县", "柯坪县", "新和县", "乌什县", "其他" ]
        }, {
            name: "喀什地区",
            area: [ "喀什市", "巴楚县", "泽普县", "伽师县", "叶城县", "岳普湖县", "疏勒县", "麦盖提县", "英吉沙县", "莎车县", "疏附县", "塔什库尔干塔吉克自治县", "其他" ]
        }, {
            name: "克孜勒苏柯尔克孜自治州",
            area: [ "阿图什市", "阿合奇县", "乌恰县", "阿克陶县", "其他" ]
        }, {
            name: "巴音郭楞蒙古自治州",
            area: [ "库尔勒市", "和静县", "尉犁县", "和硕县", "且末县", "博湖县", "轮台县", "若羌县", "焉耆回族自治县", "其他" ]
        }, {
            name: "昌吉回族自治州",
            area: [ "昌吉市", "阜康市", "奇台县", "玛纳斯县", "吉木萨尔县", "呼图壁县", "木垒哈萨克自治县", "米泉市", "其他" ]
        }, {
            name: "博尔塔拉蒙古自治州",
            area: [ "博乐市", "精河县", "温泉县", "其他" ]
        }, {
            name: "石河子",
            area: [ "石河子" ]
        }, {
            name: "阿拉尔",
            area: [ "阿拉尔" ]
        }, {
            name: "图木舒克",
            area: [ "图木舒克" ]
        }, {
            name: "五家渠",
            area: [ "五家渠" ]
        }, {
            name: "伊犁哈萨克自治州",
            area: [ "伊宁市", "奎屯市", "伊宁县", "特克斯县", "尼勒克县", "昭苏县", "新源县", "霍城县", "巩留县", "察布查尔锡伯自治县", "塔城地区", "阿勒泰地区", "其他" ]
        }, {
            name: "其他",
            area: [ "其他" ]
        } ]
    }, {
        name: "台湾省",
        city: [ {
            name: "台北市",
            area: [ "内湖区", "南港区", "中正区", "万华区", "大同区", "中山区", "松山区", "大安区", "信义区", "文山区", "士林区", "北投区" ]
        }, {
            name: "新北市",
            area: [ "板桥区", "汐止区", "新店区", "其他" ]
        }, {
            name: "桃园市",
            area: [ "其他" ]
        }, {
            name: "台中市",
            area: [ "其他" ]
        }, {
            name: "台南市",
            area: [ "其他" ]
        }, {
            name: "高雄市",
            area: [ "其他" ]
        } ]
    }, {
        name: "澳门",
        city: [ {
            name: "澳门",
            area: [ "花地玛堂区", "圣安多尼堂区", "大堂区", "望德堂区", "风顺堂区", "嘉模堂区", "圣方济各堂区", "路凼", "其他" ]
        } ]
    }, {
        name: "香港",
        city: [ {
            name: "香港",
            area: [ "深水埗区", "油尖旺区", "九龙城区", "黄大仙区", "观塘区", "北区", "大埔区", "沙田区", "西贡区", "元朗区", "屯门区", "荃湾区", "葵青区", "离岛区", "中西区", "湾仔区", "东区", "南区", "其他" ]
        } ]
    } ];
});

define("dist/personalCenter/template/personalinformation.html", [], '<div class="personalinformation">\n    <p class="personalinformation-title">个人信息</p>\n    <ul class="form-list">\n        <li class="item">\n            <span class="item-title">用户ID : </span>\n            <span class="item-desc">{{userInfo.id}}</span>\n            <span class="item-btn">复制</span>\n        </li>\n        <li class="item">\n            <span class="item-title">昵称 : </span>\n            <input class="item-input" placeholder="请输入用户昵称" disabled value="{{userInfo.nickName}}"/>\n        </li>\n        <li class="item">\n            <span class="item-title">所在地区 : </span>\n                <select class="item-province-select active-input" value="{{userInfo.prov}}" {{editUser?\'\':\'disabled\'}}>\n                  {{ if userInfo.prov}}\n                   {{each provinceList}}\n                    <option value="{{provinceList[$index]}}">{{provinceList[$index]}}</option>\n                 {{/each}}\n                {{else}}\n                    <option value="">请选择你所在的省</option>\n                      {{each provinceList}}\n                       <option value="{{provinceList[$index]}}">{{provinceList[$index]}}</option>\n                     {{/each}}\n                {{/if}}\n           </select>\n           \n          \n            <select class="item-city-select" value="{{userInfo.city}}" {{editUser?\'\':\'disabled\'}}>\n                {{ if userInfo.city}}\n                   {{each cityList}}\n                    <option value="{{cityList[$index]}}">{{cityList[$index]}}</option>\n                 {{/each}}\n                {{else}}\n                    <option value="">请选择你所在的市</option>\n                      {{each cityList}}\n                       <option value="{{cityList[$index]}}">{{cityList[$index]}}</option>\n                     {{/each}}\n                {{/if}}\n           </select>\n        </li>\n        <li class="item">\n            <span class="item-title">性别 : </span>\n            <select class="item-sex-select" value="{{userInfo.gender == \'M\'?\'男\':\'女\'}}" {{editUser?\'\':\'disabled\'}}>\n                 <option value="男">男</option>\n                 <option value="女">女</option>\n           </select>\n        </li>\n        <li class="item">\n            <span class="item-title">生日 : </span>\n            <input class="item-date-input" type="text" id="date-input" {{editUser?\'\':\'disabled\'}}>\n        </li>\n        <li class="item">\n            <span class="item-title">常用邮箱 : </span>\n            <input class="item-email-input " placeholder="请输入邮箱地址" value="{{userInfo.email}}" {{editUser?\'\':\'disabled\'}}/>\n        </li>\n        {{ if editUser}}\n            <li class="item">\n             <span class="item-title">常用邮箱 : </span>\n              <span class="item-btn item-cancel-btn edit-information" data-edit=\'cancel\'>取消</span>\n             <span class="item-btn edit-information" data-edit=\'save\'>保存</span>\n        </li>\n        {{else}}\n         <li class="item">\n             <span class="item-title">常用邮箱 : </span>\n             <span class="item-btn  edit-information" data-edit=\'edit\'>编辑信息</span>\n        </li>\n        {{/if}}\n    </ul>\n</div>');
