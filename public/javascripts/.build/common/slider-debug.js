define("dist/common/slider-debug", [], function(require, exports, module) {
    //banner转换
    var slider = function(banners_id, focus_id, pre_id, next_id) {
        this.$ctn = $("#" + banners_id);
        this.$focus = $("#" + focus_id);
        this.$pre = $("#" + pre_id);
        this.$next = $("#" + next_id);
        this.$adLis = null;
        this.$btns = null;
        this.switchSpeed = 4;
        //自动播放间隔(s)
        this.animateSpeed = 500;
        this.defOpacity = 1;
        this.crtIndex = 0;
        this.adLength = 0;
        this.timerSwitch = null;
        this.init();
    };
    slider.prototype = {
        fnNextIndex: function() {
            return this.crtIndex >= this.adLength - 1 ? 0 : this.crtIndex + 1;
        },
        fnPreIndex: function() {
            return this.crtIndex <= 0 ? this.adLength - 1 : this.crtIndex - 1;
        },
        //动画切换
        fnSwitch: function(toIndex) {
            if (this.crtIndex == toIndex) {
                return;
            }
            this.$adLis.css("zIndex", 0);
            this.$adLis.filter(":eq(" + this.crtIndex + ")").css("zIndex", 2);
            this.$adLis.filter(":eq(" + toIndex + ")").css("zIndex", 1);
            this.$btns.removeClass("on");
            this.$btns.filter(":eq(" + toIndex + ")").addClass("on");
            var me = this;
            $(this.$adLis[this.crtIndex]).animate({
                opacity: 0
            }, me.animateSpeed, function() {
                me.crtIndex = toIndex;
                $(this).css({
                    opacity: me.defOpacity,
                    zIndex: 0
                });
            });
        },
        fnAutoPlay: function() {
            this.fnSwitch(this.fnNextIndex());
        },
        fnPlay: function() {
            var me = this;
            me.timerSwitch && clearInterval(me.timerSwitch);
            me.timerSwitch = window.setInterval(function() {
                me.fnAutoPlay();
            }, me.switchSpeed * 1e3);
        },
        fnStopPlay: function() {
            clearInterval(this.timerSwitch);
            this.timerSwitch = null;
        },
        init: function() {
            this.$adLis = this.$ctn.children();
            this.$btns = this.$focus.children();
            this.adLength = this.$adLis.length;
            var me = this;
            //点击切换
            this.$focus.on("click", "a", function(e) {
                e.preventDefault();
                var index = parseInt($(this).attr("data-index"), 36);
                me.fnSwitch(index);
            });
            this.$adLis.filter(":eq(" + this.crtIndex + ")").css("zIndex", 2);
            this.$next.click(function() {
                me.fnStopPlay();
                me.fnSwitch(me.fnNextIndex());
            });
            this.$pre.click(function() {
                me.fnStopPlay();
                me.fnSwitch(me.fnPreIndex());
            });
            this.$btns.filter(":eq(0)").addClass("on");
            //初始化焦点
            this.fnPlay();
            //hover时暂停动画
            this.$ctn.hover(function() {
                me.fnStopPlay();
            }, function() {
                me.fnPlay();
            });
        }
    };
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
    //获取焦点
    function inputFocus(ele, focus, css) {
        $(ele).focus(function() {
            $(this).parents(css).addClass(focus);
        });
        $(ele).blur(function() {
            $(this).parents(css).removeClass(focus);
        });
    }
    //悬停事件
    function fix(ele, sh, lo, eleStop) {
        var element = $(ele);
        var top = element.offset().top - 74;
        //var pos = element.css("position");
        var shortHeight = $(sh).height();
        $(window).scroll(function() {
            var stop = $(eleStop).position().top;
            var addHeight = element.outerHeight();
            var cHeight = stop - addHeight - 40;
            var longHeight = $(lo).height();
            if (longHeight > shortHeight) {
                var scrolls = $(this).scrollTop();
                if (scrolls > top) {
                    if (scrolls > cHeight) {
                        element.css({
                            position: "absolute",
                            top: cHeight + "px"
                        });
                    } else {
                        element.css({
                            position: "fixed",
                            top: "74px"
                        });
                    }
                } else {
                    element.removeAttr("style");
                }
            }
        });
    }
    //返回顶部
    function backToTop(ele) {
        var obj = $(ele);
        obj.click(function() {
            $("html, body").animate({
                scrollTop: 0
            }, 500);
        });
        var $backToTopFun = function() {
            var doc = $(document);
            var st = doc.scrollTop(), winh = doc.height();
            st > 0 ? obj.show() : obj.hide();
            if (!window.XMLHttpRequest) {
                obj.css("top", st + 425);
            }
        };
        $(window).bind("scroll", $backToTopFun);
    }
    if (!placeholderSupport()) {
        // 判断浏览器是否支持 placeholder
        $("[placeholder]").each(function() {
            var _this = $(this);
            var left = _this.css("padding-left");
            _this.parent().append('<span class="placeholder" data-type="placeholder" style="left: ' + left + '">' + _this.attr("placeholder") + "</span>");
            if (_this.val() != "") {
                _this.parent().find("span.placeholder").hide();
            } else {
                _this.parent().find("span.placeholder").show();
            }
        }).on("focus", function() {
            $(this).parent().find("span.placeholder").hide();
        }).on("blur", function() {
            var _this = $(this);
            if (_this.val() != "") {
                _this.parent().find("span.placeholder").hide();
            } else {
                _this.parent().find("span.placeholder").show();
            }
        });
        // 点击表示placeholder的标签相当于触发input
        $("span.placeholder").on("click", function() {
            $(this).hide();
            $(this).siblings("[placeholder]").trigger("click");
            $(this).siblings("[placeholder]").trigger("focus");
        });
    }
    // 兼容IE9下的placeholder
    function placeholderSupport() {
        return "placeholder" in document.createElement("input");
    }
    $(function() {
        //用户展开
        elementHover("#J_user_name", null, "hover");
        if (!placeholderSupport()) {
            // 判断浏览器是否支持 placeholder
            $("[placeholder]").each(function() {
                var _this = $(this);
                var left = _this.css("padding-left");
                _this.parent().append('<span class="placeholder" data-type="placeholder" style="left: ' + left + '">' + _this.attr("placeholder") + "</span>");
                if (_this.val() != "") {
                    _this.parent().find("span.placeholder").hide();
                } else {
                    _this.parent().find("span.placeholder").show();
                }
            }).on("focus", function() {
                $(this).parent().find("span.placeholder").hide();
            }).on("blur", function() {
                var _this = $(this);
                if (_this.val() != "") {
                    _this.parent().find("span.placeholder").hide();
                } else {
                    _this.parent().find("span.placeholder").show();
                }
            });
            // 点击表示placeholder的标签相当于触发input
            $("span.placeholder").on("click", function() {
                $(this).hide();
                $(this).siblings("[placeholder]").trigger("click");
                $(this).siblings("[placeholder]").trigger("focus");
            });
        }
        //面包屑弹出
        elementHover(".crumb .crumb-more", null, "crumb-more-hover");
        //选择框
        $(".check-box").click(function() {
            if ($(this).find(".check-con").hasClass("checked")) {
                $(this).find(".check-con").removeClass("checked");
            } else {
                $(this).find(".check-con").addClass("checked");
            }
        });
        //返回顶部
        // backToTop("#backToTop");
        //用户展开
        elementHover("#J_user_name", null, "hover");
    });
    return slider;
});