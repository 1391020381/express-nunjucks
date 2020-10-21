define(function (require, exports, module) {
    // var $ = require("$");
    var img_tmp = require("./template/img_box.html");
    var changeText = require('./changeShowOverText.js').changeText
    var readMoreTextEvent = require('./changeShowOverText.js').readMoreTextEvent
    var initStyle = require('./changeDetailFooter').initStyle
    var loadMoreStyle = require('./changeDetailFooter').loadMoreStyle
    if (!window.pageConfig.imgUrl) return;
    //启始页 默认的情况
    var cPage = +window.pageConfig.page.initReadPage;
    var restPage = 0;
    var imgTotalPage = window.pageConfig.imgUrl.length;
    var totalPage = window.pageConfig.params.totalPage;//最大页数
    var ptype = window.pageConfig.params.g_fileExtension || '';
    var preRead = window.pageConfig.page.preRead || 50; // 预览页数
    var limitPage = Math.min(preRead, 50); //最大限制阅读页数
    var initReadPage = window.pageConfig.page.initReadPage // 默认展示的页数
    var clientHeight = (document.documentElement.clientHeight || window.innerHeight) / 4; // 网页可见区域高度
    var hash = window.location.hash;

    var action = {
        goSwiper: null,
        //判断是否已经是最后一页
        isHideMore: function (pageNum) {   // 继续阅读的逻辑修改后, 在 试读完成后 修改    show-over-text的 文案
            if (pageNum >= limitPage && limitPage < totalPage) { // 试读结束
                $(".show-over-text").eq(0).show();
            } else if (pageNum >= imgTotalPage) {
                $(".show-over-text").eq(1).show();
            }

        },
        //加载渲染
        drawing: function (currentPage) {
            if (imgTotalPage <= 2) return;
            $(".detail-pro-con div.article-page").eq(2).show();
            if (limitPage >= 4) {
                $(".detail-pro-con div.article-page").eq(3).show();
            }
            //加载广告
            //   createAd('a_6307747', 'a_page_con_3');  现在一次性加载四页
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
            if (supportSvg == true && svgFlag == true) {
                ptype = 'svg';
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
            var _html = template.compile(img_tmp)({ data: arr, ptype: ptype });
            if (ptype === 'txt') {
                $(".font-detail-con").append(_html);
            } else {
                $(".ppt-pic-con").append(_html);
            }
            $("img.lazy").lazyload({ effect: "fadeIn" });

            //剩余页数
            // var remainPage = restPage -= 5;
            var remainPage = currentPage >= preRead ? totalPage - preRead : restPage -= 5;
            if ($('.page-text .endof-trial-reading').css('display') == 'none') {
                $(".show-more-text .page-num").text(remainPage >= 0 ? remainPage : 0);
            }
            //滚动到指定位置
            if (currentPage <= imgTotalPage) {
                // var index = $('.page-input').val();
                var index = $('.page-input').text();
                var position = $(".detail-pro-con").find('div.article-page').eq(index).position();
                if (position) {
                    $('body,html').animate({ scrollTop: position.top }, 200);
                }
            }
        },

        //判断地址是否有效
        handleHtmlExpireUrl: function () {
            var isoverdue = 0;
            var pageHtmlUrl = window.pageConfig.imgUrl[0];
            var st = pageHtmlUrl.indexOf('?Expires=');
            var ft = pageHtmlUrl.indexOf('&KID=sina');
            var strDate = parseInt(pageHtmlUrl.substring(st + 9, ft)) * 1000;
            var sdate = +new Date(strDate);//有效日期
            var date = +new Date();//获取当前时间
            //过期
            if (sdate < date || pageHtmlUrl.indexOf("sinacloud.net") > -1) {
                isoverdue = 1;
            }
            return isoverdue;
        },

    };
    //滚动监听页数
    $(window).on('scroll', getPage);

    if (initReadPage >= preRead || initReadPage >= imgTotalPage) {
        changeText()
    }

    if ($('.page-num').text().trim() < 0) {  //  totalPage < 4
        $('.page-num').text(0)
    }
    
    $(function () {
        //默认隐藏
        var $articlePages = $(".detail-pro-con div.article-page");
        //360
        if (hash && hash.split('#page')[1]) {
            var hashArr = hash.split('#page');
            if (hashArr.length) {
                var hashPage = Math.min(+hashArr[1], imgTotalPage, preRead);
                if (hashPage <= 2) {
                    restPage = totalPage - cPage;
                    $articlePages.eq(2).hide();
                    $articlePages.eq(3).hide();

                    //触发一次加载
                } else if (hashPage <= 7) {
                    restPage = totalPage - 2;
                    loadMore();
                    setTimeout(function () {
                        var top = $(".detail-pro-con").find('div.article-page').eq(hashPage - 1).offset().top;
                        $('body,html').animate({ scrollTop: top });
                    }, 2000)
                    //只加载指定页图片
                } else {
                    restPage = totalPage - hashPage + 5;
                    // limitPage = imgTotalPage;
                    loadMore();
                    var $font_detail_con = $('.font-detail-con');
                    var $target = $font_detail_con.length ? $font_detail_con : $('.ppt-pic-con');
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
                    var str = '';
                    for (var y = 0; y < list.length; y++) {
                        var tp = list[y];
                        str += addItemLoading('', tp.index);
                    }
                    $last.before(str);

                    setTimeout(function () {
                        $('body,html').animate({ scrollTop: $last.offset().top });
                    }, 2000);
                    if (parseInt(hashArr[1]) >= preRead) {
                        action.isHideMore(hashPage);
                    }
                    cPage = hashPage;
                    $(".show-more-text .page-num").text(totalPage - hashPage);

                }
            }
        } else {
            restPage = totalPage - initReadPage;
            // $articlePages.eq(2).hide();
            // $articlePages.eq(3).hide();
            initStyle()
        }
    });

    //给页面绑定滑轮滚动事件
    if (document.addEventListener) {//firefox
        document.addEventListener('DOMMouseScroll', scrollFunc, false);
    }
    //滚动滑轮触发scrollFunc方法 //ie 谷歌
    window.onmousewheel = document.onmousewheel = scrollFunc;


    //点击加载更多
    $(document).on('click', '[data-toggle="btnReadMore"]', function () {
        loadMore();
    });

    //点击下一页 >
    $('.page-next').on('click', function () {

        // var index = $('.page-input').val() - 0;
        var index = $('.page-input').text() - 0;
        if (limitPage === 2 && index === 2) return;

        var dataDetail = $('.data-detail');


        var drawingPage = (cPage + 5) <= limitPage ? (cPage + 5) : limitPage;

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

                $('body,html').animate({ scrollTop: position }, 200);

                setTimeout(function () {
                    // $('.page-input').val(index + 1);
                    $('.page-input').text(index + 1);
                }, 100)
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
    $('.page-prev').on('click', function () {

        // var index = $('.page-input').val() - 0;
        var index = $('.page-input').text() - 0;
        if (index === 1) {
            return
        }
        var position = $(".detail-pro-con div.article-page").eq(index - 2).offset().top;

        if (position) {
            $('body,html').animate({ scrollTop: position }, 200);

            setTimeout(function () {
                // $('.page-input').val(index - 1);
                $('.page-input').text(index - 1);
            }, 100)
        }
    });

    //enter键盘 按下事件
    $(".page-input").keydown(function (event) {
        if (event.keyCode === 13) {
            // var index = $('.page-input').val() - 0;
            var index = $('.page-input').text() - 0;
            if (index > limitPage) {
                var $d_page_wrap = $('.d-page-wrap');
                $d_page_wrap.removeClass('hide');
                setTimeout(function () {
                    $d_page_wrap.addClass('hide');
                }, 1500);
                return;
            }
            var dataDetail = $('.data-detail');

            if (index > 0 && index <= dataDetail.length) {

                var position = $(".detail-pro-con div.article-page").eq(index - 1).offset().top;

                if (position) {
                    $('body,html').animate({ scrollTop: position }, 200);
                }
            }

        }
    });

    //点击展开
    $(document).on('click', '[data-toggle="btnExpandMore"]', function () {
        //移除固定高度
        $(".ppt-pic-con").css("height", "auto");
        $(this).parent().remove();
        $(".js-mask").show();
        $("img.lazy").lazyload();
    });

    //点击大图预览
    $('div.detail-pro-con').delegate(".article-page", "click", function () {
        if (ptype === 'txt') {
            return
        }
        if ($('#ip-file-convertType').val() != 'html') {
            $(".code-source").css("visibility", "visible");
        }
    });

    //点击隐藏大图
    $(".code-source").click(function () {
        $(".code-source").css("visibility", "hidden");
    });

    $(function () {
        var iframeId = 'iframeu4078296_0';
        if ($.browser.msie && $.browser.version <= 9) {
            $('#' + iframeId).parent().hide();
        }
    });

    /* 将广告挪到广告位 */
    function createAd(adId, divId) {
        try {
            $(".hide-ad").show();
            var ad = document.getElementById(adId);
            var iframeId = 'iframeu4078296_0';
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
        } catch (e) {
        }
    }

    //节流函数
    function throttle(fn) {
        var canRun = true; // 通过闭包保存一个标记
        return function () {
            if (!canRun) return; // 在函数开头判断标记是否为true，不为true则return
            canRun = false; // 立即设置为false
            setTimeout(function () { // 将外部传入的函数的执行放在setTimeout中
                fn.apply(this, arguments);
                // 最后在setTimeout执行完毕后再把标记设置为true(关键)表示可以执行下一次循环了。当定时器没有执行的时候标记永远是false，在开头被return掉
                canRun = true;
            }, 0);
        };
    }

    function getPage() {
        var dataDetail = $('.data-detail');
        for (var i = 0; i < dataDetail.length; i++) {
            var elTop = dataDetail[i].getBoundingClientRect().top;
            if (clientHeight > elTop && elTop > 0) {
                // $('.page-input').val(i + 1);
                $('.page-input').text(i + 1);
                break;
            }
        }
    }

    function displayLoading(num) {
        console.log('当前传递的是第 ' + num + ' 项');
        num = num - 1;
        var $target = $('.detail-con').eq(num);
        if (!$target.length) {
            return false;
        }
        var ptype = window.pageConfig.params.g_fileExtension || '';
        var supportSvg = window.pageConfig.supportSvg;
        var svgFlag = window.pageConfig.svgFlag;
        var $detail = $target.find('.data-detail');
        if ($detail.length) {
            var srcArr = window.pageConfig.imgUrl;
            $detail.find('.loading').remove();
            var src = srcArr[num];
            if (svgFlag && supportSvg) {
                src = this.window.pageConfig.svgUrl[num];
                $detail.html("<embed src='" + src + "' width='100%' height='100%' type='image/svg+xml' pluginspage ='//www.adobe.com/svg/viewer/install/'/>");
            } else if (ptype === 'txt') {
                $detail.html(src);
            } else {
                $detail.html("<img class='img-png lazy' width='100%' height='100%' src='" + src + "' alt=''>");
            }
        }
    }

    function loadMore(page) {
        cPage = page || cPage;
        var drawingPage = (cPage + 5) <= limitPage ? (cPage + 5) : limitPage;
        //加载更多开始
        action.drawing(drawingPage);
        var loadedPage = $(".detail-pro-con div.article-page").length;
        //如果已经到最后了
        if (loadedPage - limitPage >= 0) {
            action.isHideMore(loadedPage);
            if ($('.red-color').text() !== '点击可继续阅读 >') {
                readMoreTextEvent()
            }
            changeText()
        }
        if (loadedPage == totalPage) {
            action.isHideMore(loadedPage);
            if ($('.red-color').text() !== '点击可继续阅读 >') {
                readMoreTextEvent()
            }
            changeText()
        }
        loadMoreStyle()
    }

    function mouseScroll() {
        if (!hash) {
            return false;
        }
        var dataDetail = $('.data-detail');
        for (var i = 0; i < dataDetail.length; i++) {
            var elBottom = dataDetail[i].getBoundingClientRect().bottom;
            if (elBottom > clientHeight && elBottom > 0) {
                if (hash) {
                    var num = dataDetail.eq(i).closest('.article-page').attr('data-num');
                    var $loading = dataDetail.eq(i).find('.loading');
                    if (num && $loading.length) {
                        displayLoading(num);
                    }
                }
                // $('.page-input').val(i + 1);
                $('.page-input').text(i + 1);
                break;
            }
        }
    }

    function scrollFunc(e) {
        e = e || window.event;
        if (e.wheelDelta) { //第一步：先判断浏览器IE，谷歌滑轮事件
            if (e.wheelDelta > 0) { //当滑轮向上滚动时
                mouseScroll();
            }
            if (e.wheelDelta < 0) { //当滑轮向下滚动时
                // console.log("滑轮向下滚动");
            }
        } else if (e.detail) { //Firefox滑轮事件
            if (e.detail < 0) { //当滑轮向上滚动时
                mouseScroll();
            }
            if (e.detail > 0) { //当滑轮向下滚动时
                // console.log("滑轮向下滚动");
            }
        }
    }

    function addItem(src, num) {
        var $item = '', padding = '';
        var ptype = window.pageConfig.params.g_fileExtension || '';
        var supportSvg = window.pageConfig.supportSvg;
        var svgFlag = window.pageConfig.svgFlag;
        if (ptype === 'txt') {
            $item += "<div class='detail-con first-style article-page source-link' data-num='" + num + "'>" +
                "<div class='detail-inner article-main'>" +
                "<div class='data-detail other-format-style'>"
                + src +
                "</div>" +
                "</div>" +
                "</div>"
        } else if (svgFlag && supportSvg) {
            if (ptype === 'ppt') {
                padding = 'ppt-format-style';
            } else {
                padding = 'other-format-style';
            }

            $item += "<div class='detail-con third-style article-page source-link ' data-num='" + num + "'>" +
                "<div class='detail-inner article-main'>" +
                "<div class='data-detail " + padding + "'>" +
                "<embed src='" + src + "' width='100%' height='100%' type='image/svg+xml' pluginspage ='//www.adobe.com/svg/viewer/install/'/>" +
                "</div>" +
                "</div>" +
                "</div>"
        } else {
            if (ptype === 'ppt') {
                padding = 'ppt-format-style';
            } else {
                padding = 'other-format-style';
            }
            $item += "<div class='detail-con second-style article-page source-link' data-num='" + num + "'>" +
                "<div class='detail-inner article-main'>" +
                "<div class='data-detail " + padding + "'>" +
                "<img class='img-png lazy' width='100%' height='100%' src='" + src + "' alt=''>" +
                "</div>" +
                "</div>" +
                "</div>"
        }
        return $item;
    }

    function addItemLoading(src, num) {
        var $item = '', padding = '';
        var ptype = window.pageConfig.params.g_fileExtension || '';
        var supportSvg = window.pageConfig.supportSvg;
        var svgFlag = window.pageConfig.svgFlag;
        if (ptype === 'txt') {
            $item += "<div class='detail-con first-style article-page source-link' data-num='" + num + "'>" +
                "<div class='detail-inner article-main'>" +
                "<div class='data-detail other-format-style'>" +
                "<div class='loading' style='height: 800px;'></div>" +
                "</div>" +
                "</div>" +
                "</div>"
        } else if (svgFlag && supportSvg) {
            if (ptype === 'ppt') {
                padding = 'ppt-format-style';
            } else {
                padding = 'other-format-style';
            }

            $item += "<div class='detail-con third-style article-page source-link ' data-num='" + num + "'>" +
                "<div class='detail-inner article-main'>" +
                "<div class='data-detail " + padding + "'>" +
                "<div class='loading' style='height: 800px;'></div>" +
                "</div>" +
                "</div>" +
                "</div>"
        } else {
            if (ptype === 'ppt') {
                padding = 'ppt-format-style';
            } else {
                padding = 'other-format-style';
            }
            $item += "<div class='detail-con second-style article-page source-link' data-num='" + num + "'>" +
                "<div class='detail-inner article-main'>" +
                "<div class='data-detail " + padding + "'>" +
                "<div class='loading' style='height: 800px;'></div>" +
                "</div>" +
                "</div>" +
                "</div>"
        }
        return $item;
    }
});
