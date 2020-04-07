define(function (require, exports, module) {
    //var $ = require("$");
    var method = require('./method');
    var login = require('./checkLogin');
    // 右侧滚动
    var app = require("../application/app");
    var api = require("./api");
    scrollMenu();

    function scrollMenu() {
        //右侧悬浮 js
        var $fixBtn = $(".fixed-op").find(".J_menu");
        var $fixFull = $(".fixed-right-full");
        var $anWrap = $fixFull.find(".fixed-detail-wrap");

        function fixAn(start, index) {
            index = index || 0;
            if (start && (index === 1 || index === 2)) {
                if (method.getCookie('cuk')) {
                    rightSlideShow(index);
                    $anWrap.animate({ "right": "61px" }, 500);
                } else {
                    login.notifyLoginInterface(function (data) {
                        refreshDomTree($anWrap, index, data)
                    });
                }
            } else {
                $anWrap.animate({ "right": "-307px" }, 200);
            }
            if (start && index === 0) {
                // $(".mui-user-wrap").css("visibility", "visible");
                // $(".mui-sel-wrap").css("visibility", "hidden");
                // $(".mui-collect-wrap").css("visibility", "hidden");
                if (method.getCookie('cuk')) {
                    window.open('/node/rights/vip.html','target');
                } else {
                    login.notifyLoginInterface(function (data) {
                        refreshDomTree(null, index, data);
                        window.open('/node/rights/vip.html','target');
                    });
                }
            } else if (index === 1) {
                $(".mui-user-wrap").css("visibility", "hidden");
                $(".mui-sel-wrap").css("visibility", "visible");
                $(".mui-collect-wrap").css("visibility", "hidden");
            } else if (index === 2) {
                $(".mui-user-wrap").css("visibility", "hidden");
                $(".mui-sel-wrap").css("visibility", "hidden");
                $(".mui-collect-wrap").css("visibility", "visible");
            } else if (index === 4 || index === 6) {
                $anWrap.animate({ "right": "-307px" }, 200);
            }
        }

        $(".btn-detail-back").on("click", function () {
            fixAn(false);
            $fixBtn.removeClass("active");
        });
        $(document).on("click", function () {
            fixAn(false);
            $fixBtn.removeClass("active");

        });
        // 开通vip
        $fixFull.on('click','.js-buy-open',function(){
            // window.open('/pay/vip.html');
            method.compatibleIESkip('/pay/vip.html',true);
        })
        $(".op-menu-wrap").click(function (e) {
            e.stopPropagation();
        });

        $fixBtn.on("click", function () {
            var index = $(this).index();
            if ($(this).hasClass("active")) {
                $(this).removeClass("active");
                fixAn(false);
            } else {
                $(this).addClass("active").siblings().removeClass("active");
                fixAn(true, index);
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
        var $unLogin = $('#unLogin'),
            $hasLogin = $('#haveLogin'),
            $top_user_more = $('.top-user-more'),
            $icon_iShare_text = $('.icon-iShare-text'),
            $btn_user_more = $('.btn-user-more'),
            $vip_status = $('.vip-status');

        $icon_iShare_text.html(data.isVip == '1' ? '续费VIP' : '开通VIP');
        $btn_user_more.text(data.isVip == '1' ? '续费' : '开通');

        if (data.isVip == '0') {
            $('.open-vip').show().siblings('a').hide();
        } else {
            $('.xf-open-vip').show().siblings('a').hide();
        }

        var $target = null;
        if (data.isVip == '1') {
            $target = $vip_status.find('p[data-type="2"]');
            $target.find('.expire_time').html(data.expireTime);
            $target.show().siblings().hide();
        } else if (data.isVip == '1' && data.userType == '2') {
            $target = $vip_status.find('p[data-type="3"]');
            $target.show().siblings().hide();
        }
        $unLogin.hide();
        $hasLogin.find('.icon-detail').html(data.nickName);
        $hasLogin.find('img').attr('src', data.weiboImage);
        $top_user_more.find('img').attr('src', data.weiboImage);
        $top_user_more.find('#userName').html(data.nickName);
        $hasLogin.show();

        //右侧导航栏.
        /* ==>头像,昵称 是否会员文案提示.*/
        $('.user-avatar img').attr('src', data.weiboImage);
        $('.name-wrap .name-text').html(data.nickName);
        if (data.isVip == '1') {
            var txt = '您的VIP将于' + data.expireTime + '到期,剩余' + data.privilege + '次下载特权';
            $('.detail-right-normal-wel').html(txt);
            $('.detail-right-vip-wel').html('会员尊享权益');
            $('.btn-mui').hide();
            $('#memProfit').html('VIP权益');
        } else {
            $('.mui-privilege-list li').removeClass('hide');
        }
        rightSlideShow(index);
        // 发现有调用传入$anWrap 为 null ，因此作此判断
        if ($anWrap) {
            $anWrap.animate({ "right": "61px" }, 500);
        }
    }

    function rightSlideShow(index) {
        if (index === 1) {
            accessList();
        } else if (index === 2) {
            myCollect()
        }
    }

    /**
     * 我看过的
     */
    function accessList() {
        var accessKey = method.keyMap.ishare_detail_access;
        var list = method.getLocalData(accessKey);
        var $seenRecord = $('#seenRecord'), arr = [];
        if (list && list.length) {
            list = list.slice(0, 20);
            for (var k = 0; k < list.length; k++) {
                var item = list[k];
                var $li = '<li><i class="ico-data ico-' + item.format + '"></i><a target="_blank" href="/f/' + item.fileId + '.html">' + item.title + '</a></li>';
                arr.push($li)
            }
            $seenRecord.html(arr.join(''));
        } else {
            $seenRecord.hide().siblings('.mui-data-null').show();
        }
    }

    /**
     * 我的收藏
     */
    function myCollect() {
        var params = {
            pageNum: 1,
            pageSize: 20
        };
        $.ajax(api.user.collect, {
            type: "get",
            async: false,
            data: params,
            dataType: "json"
        }).done(function (res) {
            if (res.code == 0) {
                collectRender(res.data)
            }
        }).fail(function (e) {
            console.log("error===" + e);
        })
    }

    /**
     * 意见反馈
     * @param list
     */
    $('.op-feedback').on('click', function () {
        var curr = window.location.href;
        // window.open('/feedAndComp/userFeedback?url=' + encodeURIComponent(curr));
        method.compatibleIESkip('/feedAndComp/userFeedback?url=' + encodeURIComponent(curr),true);
        // window.location.href = '/feedAndComp/userFeedback?url='+encodeURIComponent(curr);
    });

    $('#go-back-top').on('click', function () {
        $('body,html').animate({ scrollTop: 0 }, 200);
    });

    try {//引入美洽客服
        (function (m, ei, q, i, a, j, s) {
            m[i] = m[i] || function () {
                (m[i].a = m[i].a || []).push(arguments)
            };
            j = ei.createElement(q),
                s = ei.getElementsByTagName(q)[0];
            j.async = true;
            j.charset = 'UTF-8';
            j.src = '//static.meiqia.com/dist/meiqia.js?_=t';
            s.parentNode.insertBefore(j, s);
        })(window, document, 'script', '_MEIQIA');
        _MEIQIA('entId', '149498');
        // 初始化成功后调用美洽 showPanel
        _MEIQIA('allSet', function () {
            _MEIQIA('showPanel');
        });
        // 在这里开启手动模式（必须紧跟美洽的嵌入代码）
        _MEIQIA('manualInit');
        /*_MEIQIA('init');*/
    } catch (e) { }

    // 联系客服
    $('.btn-mui-contact').on('click', function () {
        _MEIQIA('init');
    });
    function collectRender(list) {
        var $myCollect = $('#myCollect'), arr = [];
        if (!list || !list.length) {
            $myCollect.siblings('.mui-data-null').removeClass('hide');
        } else {
            var subList = list.slice(0, 20);
            for (var k = 0; k < subList.length; k++) {
                var item = subList[k];
                var $li = '<li><i class="ico-data ico-' + item.format + '"></i><a target="_blank" href="/f/' + item.fileId + '.html">' + item.name + '</a></li>';
                arr.push($li)
            }
            $myCollect.html(arr.join(''));
            if (list.length > 20) {
                $myCollect.siblings('.btn-mui-fix').removeClass('hide');
            }
        }
    }

    module.exports = {
        usermsg: function (data) {

            //右侧导航栏.
            /* ==>头像,昵称 是否会员文案提示.*/
            $('.user-avatar img').attr('src', data.weiboImage);
            $('.name-wrap .name-text').html(data.nickName);
            if (data.isVip == '1') {
                var txt = '您的VIP将于' + data.expireTime + '到期,剩余' + data.privilege + '次下载特权';
                $('.detail-right-normal-wel').html(txt);
                $('.detail-right-vip-wel').html('会员尊享权益');
                $('.btn-mui').hide();
                $('#memProfit').html('VIP权益');
            } else {
                $('.mui-privilege-list li').removeClass('hide');
            }
        }
    }
});