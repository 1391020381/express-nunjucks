define("dist/detail-b/expand", [], function(require, exports, module) {
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