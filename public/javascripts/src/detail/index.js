/**
 * 详情页首页
 */
define(function (require, exports, module) {
    // var $ = require('$');
    require('../application/suspension');
    var app = require("../application/app");
    var api = require('../application/api');
    var method = require("../application/method");
    var utils = require("../cmd-lib/util");
    var login = require("../application/checkLogin");
    var common = require('./common');
    var clickEvent = require('../common/bilog').clickEvent
    var payTypeMapping = ['', '免费', '下载券', '现金', '仅供在线阅读', 'VIP免费', 'VIP专享'];
    var entryName_var = payTypeMapping[pageConfig.params.file_state];
    var entryType_var = window.pageConfig.params.isVip == 1 ? '续费' : '充值';//充值 or 续费

    // 初始化显示
    initShow();
    // 初始化绑定
    eventBinding();
    function initShow() {
        // 初始化显示
        pageInitShow();
        // 访问记录
        storeAccessRecord()
    }
    // 页面加载
    function pageInitShow() {
        if (method.getCookie('cuk')) {
            login.getLoginData(function (data) {
                common.afterLogin(data);
                window.pageConfig.userId = data.userId;
                //已经登录 并且有触发支付点击
                if (method.getCookie('event_data')) {
                    //唤起支付弹框
                    goPage(event);
                    method.delCookie("event_data", "/");
                }
            });
        } else {
            var params = window.pageConfig.params;
            if (params.g_permin === '3' && params.vipDiscountFlag && params.ownVipDiscountFlag) {
                // 如果没有登陆情况，且文档是付费文档且支持打折，更改页面价格
                var originalPrice = ((params.moneyPrice * 1000) / 1250).toFixed(2);
                $(".js-original-price").html(originalPrice);
                var savePrice = (params.moneyPrice - originalPrice).toFixed(2);
                $('#vip-save-money').html(savePrice);
            }
        }
        // 意见反馈的url
        var url = '/feedAndComp/userFeedback?url=' + encodeURIComponent(location.href);
        $('.user-feedback').attr('href', url);

        var $iconDetailWrap = $('.icon-detail-wrap'); //  付费文档图标
        if ($iconDetailWrap.length) {
            $(window).on('scroll', function () {
                var $this = $(this);
                var top = $this.scrollTop();
                if (top >= 180) {
                    $iconDetailWrap.addClass('icon-text-fixed');
                    $('.icon-text-fixed').css('left', $('.bd-wrap')[0].offsetLeft - 6);
                } else {
                    $iconDetailWrap.removeClass('icon-text-fixed');
                    $iconDetailWrap.css('left', '-6px');
                }
            });
        }
        setTimeout(function () {
            $('.detail-search-info').show();
        }, 30000)
    }

    // 事件绑定
    function eventBinding() {
        var $more_nave = $('.more-nav'),
            $search_detail_input = $('#search-detail-input'),
            $detail_lately = $('.detail-lately'),
            $slider_control = $('.slider-control');

        // 顶部分类
        $more_nave.on('mouseover', function () {
            var $this = $(this);
            if (!$this.hasClass('hover')) {
                $(this).addClass('hover');
            }
        });
        $more_nave.on('mouseleave', function () {
            var $this = $(this);
            if ($this.hasClass('hover')) {
                $(this).removeClass('hover');
            }
        });
        // 搜索
        $search_detail_input.on("keyup", function (e) {
            var keycode = e.keyCode;
            if ($(this).val()) {
                getBaiduData($(this).val());
            } else {
            }
            if (keycode === 13) {
                searchFn($(this).val());
            }
        });
        $search_detail_input.on('focus', function () {
            $('.detail-search-info').hide();
            var lately_list = $('.lately-list'),
                len = lately_list.find('li').length;
            if (len > 0) {
                $detail_lately.show();
            } else {
                $detail_lately.hide();
            }
            return true;
        });
        $('.btn-new-search').on('click', function () {
            var _val = $search_detail_input.val();
            if (!_val) {
                return
            }
            searchFn(_val);
        });
        $(document).on('click', ':not(.new-search)', function (event) {
            var $target = $(event.target);
            if ($target.hasClass('new-input')) {
                return
            }
            $detail_lately.hide();
        });
        $detail_lately.on('click', function (event) {
            event.stopPropagation();
        });
        // 登录
        $('.user-login,.login-open-vip').on('click', function () {
            if (!method.getCookie('cuk')) {
                login.notifyLoginInterface(function (data) {
                    common.afterLogin(data);
                    // 登陆后判断是否第一次登陆
                    login.getUserData(function (res) {
                        if (res.loginStatus == 1 && method.getCookie('_1st_l') != res.userId) {
                            receiveCoupon(0, 2, res.userId)
                        }
                    })
                });
            }
        });

        // 优惠券发放
        if (method.getCookie('cuk')) {
            login.getUserData(function (res) {
                if (res.loginStatus == 1 && method.getCookie('_1st_l') != res.userId) {
                    receiveCoupon(0, 2, res.userId);
                }
            })
        }

        // 退出
        $('.btn-exit').on('click', function () {
            login.ishareLogout();
        });
        // 相关推荐—下一页按钮事件
        $slider_control.find(".btn-next").on('click', function () {
            $(".btn-prev").removeClass("btn-disable");
            $(this).addClass("btn-disable");
            relatedPage();
        });
        //关推荐—上一页按钮事件
        $slider_control.find(".btn-prev").on('click', function () {
            $(".btn-next").removeClass("btn-disable");
            $(this).addClass("btn-disable");
            relatedPage();
        });
        // 评论框获得焦点
        $('#commentTxt').on('focus', function () {
            if (method.getCookie('cuk')) {
                login.getLoginData(function (data) {
                    common.userData = data;
                    if (!data.mobile) {
                        login.notifyCheckInterface();
                    }
                });
            }
        });
        $('#search-detail-input').on('focus', function () {
            $('.detail-search-info').hide();
        });
        // 点击checkbox
        $('#commentCheckbox').on('click', function () {
            $(this).find('.check-con').toggleClass('checked');
        });
        // 显示举报窗口
        $('.report-link').on('click', function () {
            $("#dialog-box").dialog({
                html: $('#report-file-box').html(),
            }).open();
        });
        // 提交举报内容
        $('#dialog-box').on('click', '.report-as', function () {
            var type = $("input[name='radio1']:checked").val();
            if (type === '1') {
                // window.location.href = '/feedAndComp/tort?type=1&pageUrl=' + window.location.href;
                method.compatibleIESkip('/feedAndComp/tort?type=1&pageUrl=' + window.location.href,false);
            } else {
                if (!method.getCookie('cuk')) {
                    $('#bgMask').hide();
                    $('#dialog-box').hide();
                    login.notifyLoginInterface(null);
                } else {
                    var content = $('#report-content').val();
                    method.post(api.normalFileDetail.reportContent, function (res) {
                        if (res.code == 0) {
                            $("#dialog-box").dialog({
                                html: $("#tpl-down-text").html().replace(/\$msg/, '举报成功'),
                            }).open();
                        }
                    }, '', '', {
                        type: type,
                        content: content,
                        pageUrl: window.location.href
                    })
                }
            }
        });
        // 发表评论
        $('#comment').on('click', function () {
            commentArticle()
        });
        // 取消或者关注
        $('#btn-collect').on('click', function () {
            if (!method.getCookie('cuk')) {
                login.notifyLoginInterface(function (data) {
                    common.afterLogin(data);
                });
                return;
            }else{
                //var fid=$(this).attr('data-fid');
                clickEvent($(this))
                if ($(this).hasClass('btn-collect-success')) {
                    collectFile(4)
                } else {
                    collectFile(3)
                }
    
                //fileSaveOrupdate(fid,window.pageConfig.page.uid,$(this))
            }
           
        });
        // 文件评分
        $('.star-list').on('click', function (e) {
            if (!method.getCookie('cuk')) {
                login.notifyLoginInterface(function (data) {
                    common.afterLogin(data);
                });
            } else {
                method.get(api.normalFileDetail.hasDownLoad + '?fid=' + window.pageConfig.params.g_fileId, function (res) {
                    if (res.code == 0) {
                        if (res.data) {
                            var data = {
                                fid: pageConfig.params.g_fileId,
                                score: $(this).find('li.on').length
                            };
                            appraiseStar(data)
                        } else {
                            $("#dialog-box").dialog({
                                html: $('#tpl-down-text').html()
                                    .replace(/\$msg/, '您还未获取该资料,先要获取资料后才可以评分哦!')
                            }).open();
                        }
                    }
                });
            }
        });
        // 查找相关资料
        $('.detail-fixed').on('click','#searchRes', function () {
            $('body,html').animate({ scrollTop: $('#littleApp').offset().top - 60 }, 200);
            // $("#dialog-box").dialog({
            //     html: $('#search-file-box').html().replace(/\$fileId/, window.pageConfig.params.g_fileId),
            // }).open();
            $("#dialog-box").dialog({
                html: $('#reward-mission-pop').html(),
            }).open();

            setTimeout(bindEventPop,500)
        });
        //  $("#dialog-box").dialog({
        //     html: $('#reward-mission-pop').html(),
        // }).open();

        function bindEventPop(){
            console.log(6666)
            // 绑定关闭悬赏任务弹窗pop
            $('.m-reward-pop .close-btn').on('click',function(){
                closeRewardPop();
            })

            // submit提交
            $('.m-reward-pop .submit-btn').on('click',function(){
                var userId = window.pageConfig.userId;
                if(!userId){
                    closeRewardPop();
                    $.toast({
                        text:'该功能仅对VIP用户开放',
                        delay : 3000,
                    })
                    return
                }
                var reg = /^[0-9a-zA-Z_.-]+[@][0-9a-zA-Z_.-]+([.][a-zA-Z]+){1,2}$/;
                var mailVal = $('.m-reward-pop .form-ipt').val();
                var tips = $('.m-reward-pop .form-verify-tips');
                tips.hide();
                if (!reg.test(mailVal)) {
                    tips.show();
                    return
                }

                var params = {
                    userId:userId,
                    fid:window.pageConfig.params.g_fileId,
                    email:mailVal,
                    channelSource:4,
                }

                $.ajax('/gateway/content/sendmail/findFile', {
                    type: "POST",
                    data: JSON.stringify(params),
                    dataType: "json",
                    contentType: 'application/json'
                }).done(function (res) {
                    if (res.code == 0) {
                        closeRewardPop();
                        $.toast({
                            text:'发送成功',
                            delay : 2000,
                        })
                    } else if(res.code == 401100){
                        $.toast({
                            text:'该功能仅对VIP用户开放',
                            delay : 2000,
                        })
                    }else {
                        $.toast({
                            text: '发送失败，请重试',
                            delay: 2000
                        });
                    }
                }).fail(function (e) {
                    $.toast({
                        text: '发送失败，请重试',
                        delay: 2000
                    });
                })
            })

            // 关闭任务pop
            function closeRewardPop(){
                $(".common-bgMask").hide();
                $(".detail-bg-mask").hide();
                $('#dialog-box').hide();
            }        

        }

        // 现在把 下载和购买逻辑都写在 download.js中 通过 后台接口的状态码来判断下一步操作
        // $('body').on("click", ".js-buy-open", function (e) {  
        //     var type = $(this).data('type');
        //     if (!method.getCookie("cuk")) {
        //         //上报数据相关
        //         if ($(this).attr("loginOffer")) {
        //             method.setCookieWithExpPath('_loginOffer', $(this).attr("loginOffer"), 1000 * 60 * 60 * 1, '/');
        //         }
        //         method.setCookieWithExpPath('enevt_data', type, 1000 * 60 * 60 * 1, '/');
        //         if (pageConfig.params.g_permin == 3 && type == "file") {
        //             //相关逻辑未登陆购买逻辑移到buyUnlogin.js

        //         } else {
        //             login.notifyLoginInterface(function (data) {
        //                 common.afterLogin(data);
        //                 goPage(type);
        //             });
        //         }
        //     } else {
        //         goPage(type);
        //     }
        // });
    }
    function receiveCoupon(type, source, userId) {
        var data = { source: source, type: type };
        data = JSON.stringify(data);
        $('body').loading({ name: 'download', title: '请求中' });
        $.ajax({
            type: 'POST',
            url: api.vouchers,
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            data: data,
            success: function (res) {
                if (res.code == 0) {
                    if (res.data.list) {
                        if (res.data.list.length > 0) {
                            var headTip = require("./template/head_tip.html");
                            var _html = template.compile(headTip)({ data: res.data });
                            $('.coupon-info-top').html(_html);
                            //第一次登录
                            method.setCookieWithExpPath('_1st_l', userId, 30 * 24 * 60 * 60 * 1000, '/');
                        } else {
                            utils.showAlertDialog("温馨提示", res.msg);
                        }
                    }
                } else {
                    utils.showAlertDialog("温馨提示", res.msg);
                }
            },
            complete: function () {
                $('body').closeLoading("download");
            }
        })
    }
    function appraiseStar(data) {
        method.post(api.normalFileDetail.appraise, function (res) {
            if (res.code == 0) {
                var $dSuccess = $('.d-success');
                $dSuccess.removeClass('hide');
                setTimeout(function () {
                    $dSuccess.addClass('hide')
                }, 1500)
            }
        }, '', 'post', data);
    }

    //获取焦点
    function inputFocus(ele, focus, css) {
        $(ele).focus(function () {
            $(this).parents(css).addClass(focus);
        });
        $(ele).blur(function () {
            $(this).parents(css).removeClass(focus);
        });

    }

    //hover
    function elementHover(ele, eleShow, hover) {
        $(ele).hover(
            function () {
                $(this).addClass(hover);
                $(eleShow).fadeIn("slow");
            },
            function () {
                $(this).removeClass(hover);
                $(eleShow).fadeOut("slow");
            }
        );
    }

    $(function () {
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
        $(window).scroll(function () {
            var detailTop = $(this).scrollTop();
            var fixStart = $dFooter.offset().top - fixHeight - $dFooter.height();
            if (detailTop > headerHeight) {
                $detailHeader.addClass("new-detail-header-fix");
                $('.coupon-info-top').hide()//赠券提示框
            } else {
                $detailHeader.removeClass("new-detail-header-fix");
                // 未登陆，且第一次弹出
                if (!localStorage.getItem('firstCoupon') && method.getCookie("cuk")) {
                    $('.coupon-info-top').show()//赠券提示框
                }

            }
            //右侧悬浮   右侧过长悬浮 样式很怪 先暂时注释
            // if (detailTop > fixTop) {
            //     fixEle.css({ "position": "fixed", "top": headerHeight, "z-index": "75" });
            // } else {
            //     fixEle.removeAttr("style");
            // }
            //底部悬浮展示文档
            if (detailTop > fixStart) {
                $fixBar.find(".operation").hide();
                $fixBar.find(".data-item").show();
            } else {
                $fixBar.find(".operation").show();
                $fixBar.find(".data-item").hide();
            }
            //滚动超过600展示优惠券广告
            if (detailTop > 400 && !localStorage.getItem('loginCouponAd') && !method.getCookie("cuk")) {
                $('.pc-tui-coupon').show();
                localStorage.setItem('loginCouponAd', 1);
                closeCouponAD()
            }
        });
        // 关闭底部优惠券弹窗
        function closeCouponAD() {
            $('.pc-tui-coupon .btn-close').click(function () {
                $('.pc-tui-coupon').hide()
            })
        }
        //关闭头部优惠券赠送信息
        closeHeadCouponTip();
        function closeHeadCouponTip() {
            $('.coupon-info-top').on('click', '.btn-no-user', function () {
                $('.coupon-info-top').hide();
                localStorage.setItem('firstCoupon', 1)
            })
        }
        $('.firstLoginHook').click(function () {
            $('.pc-tui-coupon').hide()
        });
        //详情页分类展开
        elementHover($detailHeader.find(".more-nav"), null, "hover");
    });



    // 添加取消收藏
    function collectFile(cond) {
        method.post(api.normalFileDetail.collect, function (res) {
            if (res.code == 0) {
                var $btn_collect = $('#btn-collect');
                if (cond === 3) {
                    var $dCollect = $('.d-collect');
                    $dCollect.removeClass('hide');
                    setTimeout(function () {
                        $dCollect.addClass('hide');
                    }, 2000);
                    $btn_collect.addClass('btn-collect-success');
                } else {
                    $btn_collect.removeClass('btn-collect-success')
                }
            } else if (res.code == 40001) {
                setTimeout(function () {
                    method.delCookie('cuk', "/", ".sina.com.cn");
                }, 0)
            }
        }, '', 'post', {
            fid: pageConfig.params.g_fileId,
            cond: cond,
            flag: 'y'
        });
    }

       // 收藏或取消收藏接口
   function fileSaveOrupdate(fid,uid,_this) {
    $.ajax({
        url: api.special.fileSaveOrupdate,
        type: "POST",
        data: JSON.stringify({ fid:fid,uid:uid,source:0,channel:0 }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (res) {
            console.log(this)
            if(res.code === '0'){
                $.toast({
                    text: _this.hasClass("btn-collect-success")?"取消收藏成功":"收藏成功"
                })
                _this.hasClass("btn-collect-success") ? _this.removeClass('btn-collect-success') :_this.addClass('btn-collect-success')
            }else{
                $.toast({
                    text: _this.hasClass("btn-collect-success")?"取消收藏失败":"收藏失败"
                })
            }
        }
    })
}

    // 搜集访问记录
    function storeAccessRecord() {
        // 存储浏览记录
        var access = pageConfig.access,
            accessKey = method.keyMap.ishare_detail_access;
        if (pageConfig && access) {
            var fileArr = method.getLocalData(accessKey);
            if (!fileArr || fileArr.length < 1) {
                fileArr = [];
                fileArr.push(access);
                method.setLocalData(accessKey, fileArr);
            } else {
                fileArr = handleExistsFile(access.fileId, fileArr);
                fileArr.unshift({
                    'fileId': access.fileId,
                    'title': access.title,
                    'format': access.format,
                    'time': new Date().getTime()
                });
                method.setLocalData(accessKey, fileArr)
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
        $(".related-data-list").find("li").each(function () {
            if ($(this).is(":hidden")) {
                $(this).show();
            } else {
                $(this).hide();
            }
        });
    }

    // 评论
    function commentArticle() {
        if (!method.getCookie('cuk')) {
            login.notifyLoginInterface(function (data) {
                common.afterLogin(data);
            });
        } else if (method.getCookie('cuk') && !common.userData) {
            login.getLoginData(function (data) {
                common.afterLogin(data);
                commentContent();
            })
        } else {
            commentContent();
        }
    }

    var commentContent = function () {
        var content = $('#commentTxt').val();
        var fid = pageConfig.params.g_fileId;
        var type = '1';
        var anonymous = $('#commentCheckbox .check-con').hasClass('checked');

        if (content.length < 1 || content.length > 200) {
            $('.error-info').text('评论内容长度必须在1~200个字符之间');
            return false;
        }

        method.get(api.normalFileDetail.hasDownLoad + '?fid=' + window.pageConfig.params.g_fileId, function (res) {
            if (res.code == 0) {
                if (res.data) {
                    method.post(api.normalFileDetail.addComment, function (res) {
                        if (res.code == 0) {
                            if (res.data === 0) {
                                var showName = anonymous ? '匿名用户' : common.userData.nickName;
                                var hrefFlag = anonymous ? '<a class="user-name-con">' + showName + '</a>' : '<a href="/n/' + common.userData.userId + '.html" class="user-name-con">' + showName + '</a>';
                                $('.evaluate-list').prepend('<li class="cf">' +
                                    '<div class="user-img fl"><img src="' + common.userData.weiboImage + '" alt="头像"></div>' +
                                    '<div class="user-evaluate cf"><p class="evaluate-txt">' + hrefFlag + content +
                                    '</p></div></li>');
                                $('#commentTxt').val('');
                            } else if (res.data === 2) {
                                $('.error-info').text('一天最多评论15条');
                            } else if (res.data === 3) {
                                $('.error-info').text('一分钟之内提交过于频繁');
                            } else if (res.data === 5) {
                                $('.error-info').text('您经评论过');
                            } else if (res.data === 4) {
                                $('.error-info').text('*您的评论包含敏感词,请修改再发布!');
                            }
                        } else if (res.code == 40001) {
                            setTimeout(function () {
                                method.delCookie('cuk', "/", ".sina.com.cn");
                            }, 0)
                        } else {
                            $('.error-info').text(res.msg);
                        }
                    }, '', '', {
                        content: content,
                        fid: fid,
                        type: type,
                        anonymous: anonymous ? 1 : 0
                    });
                } else {
                    $("#dialog-box").dialog({
                        html: $('#tpl-down-text').html()
                            .replace(/\$msg/, '您还未获取该资料,先要获取资料后才可以评论哦!')
                    }).open();
                }
            }
        }, '');

    };

    function goPage(type) {
        var fid = window.pageConfig.params.g_fileId;
        var format = window.pageConfig.params.file_format;
        var title = window.pageConfig.params.file_title;
        var params = '';
        var ref = utils.getPageRef(fid);
        //文件信息存入cookie方便gio上报
        method.setCookieWithExpPath('rf', JSON.stringify(gioPayDocReport), 5 * 60 * 1000, '/');
        method.setCookieWithExp('f', JSON.stringify({ fid: fid, title: title, format: format }), 5 * 60 * 1000, '/');

        if (type === 'file') {
            params = '?orderNo=' + fid + '&referrer=' + document.referrer;
            // window.location.href = "/pay/payConfirm.html" + params;
            method.compatibleIESkip("/pay/payConfirm.html" + params,false);
        } else if (type === 'vip') {
            __pc__.gioTrack("vipRechargeEntryClick", { 'entryName_var': entryName_var, 'entryType_var': entryType_var });
            var params = '?fid=' + fid + '&ft=' + format + '&name=' + encodeURIComponent(encodeURIComponent(title)) + '&ref=' + ref;
            // window.open("/pay/vip.html" + params);
            method.compatibleIESkip('/pay/vip.html' + params,true);
        } else if (type === 'privilege') {
            var params = '?fid=' + fid + '&ft=' + format + '&name=' + encodeURIComponent(encodeURIComponent(title)) + '&ref=' + ref;
            // window.open("/pay/privilege.html" + params);
            method.compatibleIESkip('/pay/privilege.html' + params,true);
        }
    }

    //获取百度数据
    var getBaiduData = function (val) {
        $.getScript("//sp0.baidu.com/5a1Fazu8AA54nxGko9WTAnF6hhy/su?wd=" + encodeURIComponent(val) + "&p=3&cb=window.baidu_searchsug&t=" + new Date().getTime());
    };

    /*百度搜索建议回调方法*/
    window.baidu_searchsug = function (data) {
        var sword = $("#search-detail-input").val();
        sword = sword ? sword.replace(/^\s+|\s+$/gm, '') : '';
        if (sword.length > 0) {
            if (data && data.s) {
                var condArr = data.s;
                if (condArr.length > 0) {
                    var max = Math.min(condArr.length, 10);
                    var _html = [];
                    for (var i = 0; i < max; i++) {
                        var searchurl = "/search/home.html?cond=" + encodeURIComponent(encodeURIComponent(condArr[i]));
                        _html.push('<li><a href="' + searchurl + '"  data-html="' + condArr[i] + '" >' + condArr[i].replace(new RegExp("(" + sword + ")", "gm"), "<span class='search-font'>$1</span>") + '</a></li>');
                    }
                    $(".lately-list").html(_html.join("")).parent('.detail-lately').show();
                }
            }
        }
    };

    //搜索
    var searchFn = function (_val) {
        var sword = _val ? _val.replace(/^\s+|\s+$/gm, '') : '';
        // window.location.href = "/search/home.html?ft=all&cond=" + encodeURIComponent(encodeURIComponent(sword));
        method.compatibleIESkip("/search/home.html?ft=all&cond=" + encodeURIComponent(encodeURIComponent(sword)),false);
    }
});