define(function(require, exports, moudle) {
    // 自有埋点注入

    var payVipResult_bilog = require("../common/bilog-module/payVipResult_bilog");
    var payFileResult_bilog = require("../common/bilog-module/payFileResult_bilog");
    var payPrivilegeResult_bilog = require("../common/bilog-module/payPrivilegeResult_bilog");

    require('swiper');
    var method = require("../application/method");
    var utils = require("../cmd-lib/util");
    var qr = require("./qr");

    var urlConfig = require('../application/urlConfig')
    var api = require('../application/api');
    var couponReceive = require('./couponReceive.html')
    require("../common/bilog");
    var clickEvent = require('../common/bilog').clickEvent
    var userInfo = method.getCookie('ui') ? JSON.parse(method.getCookie('ui')) : {}
    var renewalVIP = window.pageConfig.params.isVip == '1' ? '1' : '0' // 标识是否是续费vip
    var checkStatus = window.pageConfig.params.checkStatus || '10'
    var isLogin = require('../application/effect.js').isLogin;
    var expires_in = 60 // 支付二维码过期时间
    var timer = null // 定时器
    var timerFlag = false; // 二维码是否过期 
    var couponList = []; // 优惠券列表
    var couponTimer = null; // 领取优惠券弹窗
    var isAutoLogin = true;
    var switchCancel = false;
    var switchCount = 0; // 切换次数
    var curActive = 0; // 当前激活套餐
    var callback = null;
 
    isLogin(initPage, isAutoLogin, initPage);
    fetchCouponReceiveList();
    var isAutoRenew = $('.renewal-radio').attr('data-isAutoRenew') || method.getParam('isAutoRenew')
    if (location.pathname == '/pay/vip.html') {
        if (isAutoRenew != 1) { //  
            $('.renewal-radio').hide()
        }
    }
    if (location.pathname == '/pay/payQr.html') {
        if (isAutoRenew == 1) { //  
            $('.icon-pay-style').css("background-position", "-172px -200px")
        }
    }


    // 
    // 优惠券相关需要在登录后执行
    var couponObj = require("../common/coupon/couponOperate");
    require("../common/coupon/couponIssue");

  
    //生成二维码
    function initPage(userInfo) {
       
        window.pageConfig.params.fileDiscount = userInfo.fileDiscount // 获取用户折扣 在优惠券使用
        if (userInfo.isVip == 1) {
            $('.isVip-show').find('span').html(userInfo.expireTime);
            $('.isVip-show').removeClass('hide');
        }
        $(function() {
            var flag = $("#ip-flag").val();

            var uid = $("#ip-uid").val() || userInfo.userId
            var type = $("#ip-type").val();
            var isVip = $("#ip-isVip").val();
            if (flag == 3 && uid) { //二维码页面
                if (type == 0) { //vip购买
                    if (method.getCookie('cuk')) {
                        $(".btn-vip-login-arrive").click();

                    }
                } else if (type == 2) { //文件购买
                    if (isVip != 1) {
                        $(".price-discount").hide();
                    } else {
                        $(".price-discount").show();
                    }
                    if (method.getCookie('cuk')) {
                        $(".btn-file-login-arrive").click();

                    }
                }

                var oid = method.getParam('orderNo');
                if (oid) {
                    $(".carding-pay-item .oid").text(oid);
                    var isAutoRenew = method.getParam('isAutoRenew')
                    var url = urlConfig.payUrl + '/pay/qr?orderNo=' + oid + '&isAutoRenew=' + isAutoRenew;

                    try {
                        qr.createQrCode(url, 'pay-qr-code', 180, 180);
                        $(".btn-qr-show-success").click();
                        $('.pay-qrcode-loading').hide()
                        isShowQrInvalidtip(false)
                        countdown(); // 计算二维码失效时间

                    } catch (e) {
                        console.log("生成二维码异常");
                        $(".btn-qr-show-fail").click();

                    }
                    alipayClick(oid);
                    // 获取支付状态结果
                    getOrderInfo(oid);
                } else {
                    utils.showAlertDialog("温馨提示", '订单失效，请重新下单');
                }
            } else if (flag == "true" && uid) { //成功页面
                var mobile = userInfo.mobile || $("#ip-mobile").val();

                if (mobile) { //隐藏绑定手机号模块 公众号模块居中
                    $(".carding-info-bottom").addClass('carding-binding-ok');
                }
                if (type === '2') {
                    buySuccessDownLoad();
                }
            } else if (flag == "false" && uid) { //失败页面

            } else if (flag == "0") {

            }
        });
    }


    function countdown() { // 二维码失效倒计时
        if (expires_in <= 0) {
            clearTimeout(timer)
            expires_in = 60
            $('.pic-pay-code .pay-qrcode-loading').hide()
            isShowQrInvalidtip(true)
        } else {
            expires_in--
            timer = setTimeout(countdown, 1000);
        }
    }

    function isShowQrInvalidtip(flag) { // 
        timerFlag = flag;
        if (flag) {
            $('.pic-pay-code .pay-qrcode-expire').show()
            $('.pic-pay-code .pay-qrcode-invalidtip').show()
            $('.pic-pay-code .pay-qrcode-refresh').show()
            $('.pay-info-link').show()
        } else {
            $('.pic-pay-code .pay-qrcode-expire').hide()
            $('.pic-pay-code .pay-qrcode-invalidtip').hide()
            $('.pic-pay-code .pay-qrcode-refresh').hide()
            $('.pay-info-link').hide()
        }
    }

    // 获取发卷列表接口
    function fetchCouponReceiveList() {
        // 用户是VIP才会获取
        if (userInfo.isVip != 1) {
            // 参数
            var params = {
                type: 2,
                site: 4
            }
            $.ajax({
                url: api.coupon.rightsSaleVouchers,
                type: "GET",
                data: params,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function(res) {
                    if (res && res.code == '0') {
                        couponList = res.data && res.data.list ? res.data.list : [];
                        initCouponReceive([].slice.call(couponList));
                    }
                }
            });
        }
    }

    // 计时弹出优惠券
    function initCouponReceive(couponList) {
        if (!couponList.length) return;
        if (couponTimer) clearTimeout(couponTimer);
        couponTimer = setTimeout(function() {
            startCouponReceive(couponList, function() {
                clearTimeout(couponTimer);
            })
        }, 5000);
    }

    // 开始弹出领取优惠券的弹窗
    function startCouponReceive(couponList, callback) {
        if (!couponList.length || switchCancel) return;
        var data = {
            list: couponList.slice(0, 2)
        };
        var _html = template.compile(couponReceive)({ data: data });
        if (!$("#receive-coupon-box").html()) {
            $("#receive-coupon-box").html(_html);
            callback && callback();
        }
    }

    // 绑定定时弹窗关闭按钮
    $(document).on('click', '.coupon-dialog-wrap .coupon-dialog-close', function(e) {
        // 判断如果弹窗出现
        clickEvent($(this))
        switchCancel = true;
        switchCount = 0;
        if ($("#receive-coupon-box").html()) {
            $("#receive-coupon-box").empty();
        }
    });

    // 绑定立即领取按钮回调
    $(document).on('click', '.coupon-dialog-wrap .coupon-dialog-footer', function(e) {
        var parmas = {
            type: 2,
            source: 1,
            site: 4,
        };
        clickEvent($(this))
        $.ajax({
            url: api.coupon.rightsSaleVouchers,
            headers: {
                'Authrization': method.getCookie('cuk')
            },
            type: "POST",
            data: JSON.stringify(parmas),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function(res) {
                if (res && res.code == '0') {
                    // 重新刷新页面
                    window.location.reload();
                } else {
                    utils.showAlertDialog("温馨提示", res.msg || res.message || '领取失败');
                }
            }
        })

    });

    $(document).on('click', '.pic-pay-code .pay-qrcode-refresh', function(e) {
        initPage(userInfo);
    });

    var fid = window.pageConfig.params.g_fileId;
    if (!fid) {
        fid = method.getParam('fid');
        window.pageConfig.params.g_fileId = fid;
    }

    // checkStatus   10 资料是vip 用户不是vip   13 资料时vip 用户是vip特权不够  8 资料是付费 用户未购买

    //支付相关参数
    var params = {
        fid: window.pageConfig.params.g_fileId || '', //文件id
        aid: '', //活动id
        vid: '', //vip套餐id
        pid: $('.pay-pri-list .active').attr('data-pid'), //特权id
        oid: "", //订单ID 获取旧订单
        type: window.pageConfig.params.checkStatus || '10', // 用户search 续费vip进入                                                              //套餐类别 0: VIP套餐， 1:特权套餐 ， 2: 文件下载
        ref: utils.getPageRef(window.pageConfig.params.g_fileId), //正常为0,360合作文档为1，360文库为3
        referrer: document.referrer || document.URL, //来源网址
        remark: '', //页面来源 其他-办公频道           
        ptype: '', //现金:cash, 下载券:volume, 免费:free, 仅在线阅读:readonly
        isVip: window.pageConfig.params.isVip || 0, //是否vip
        vipMemberId: '' //权益套餐ID
    };



    if (method.getParam("ref")) {
        params.ref = utils.getPageRef(fid);
    }
    // 点击下载
    $('.quick-down-a').click(function() {
        buySuccessDownLoad()
    });

    $(".js-buy-open").click(function() { // 支付页面 fail.html payConfirm.html
        var ref = utils.getPageRef(fid); //用户来源
        var urlQuery = '?fid=' + fid + '&ref=' + ref;
        var mark = $(this).data('type');
        var type = params.type
        if (type == 10) { // mark == 'vip'

            method.compatibleIESkip('/pay/vip.html' + urlQuery, true);
        } else if (type == '13') { // mark == 'privilege'

            method.compatibleIESkip('/pay/privilege.html' + urlQuery, true);
        } else if (type == '8') {
            method.compatibleIESkip('/pay/vip.html' + urlQuery, true);
        }

    });

    //特权套餐切换
    $(document).on("click", "ul.pay-pri-list li", function() {
        $(this).siblings("li").removeClass("active");
        $(this).addClass("active");
        var price = $(this).data('price');
        var giveDesc = $(this).find('.give-desc').html() || ''
        $(".pay-privilege-text").html(giveDesc)
        $("#activePrice").html(price);
        $("#discountPrice").hide();
        if ($(this).data('pid')) {
            params.pid = $(this).data('pid');
            params.aid = $(this).data('actids');
            params.type = "13";
        }
    });

    //vip套餐切换

    $(".js-tab").each(function() {
        $(this).tab({
            activeClass: 'active',
            element: 'div',
            callback: function($this) {

                var price = $this.data('price').toFixed(2); // 价格

                var giveDesc = $this.find('.give-desc').html() || ''
                var discountPrice = $this.data('discountprice') ? $this.data('discountprice') / 100 : 0
                var isAutoRenew = $this.data('isautorenew')
                if (isAutoRenew == '1') {
                    $('.renewal-radio').show()
                    $('.renewal-radio #renewal').attr('checked', 'checked')
                    $('.renewal-radio .renewal-desc .price').text(discountPrice)
                } else {
                    $('.renewal-radio').hide()
                }
                $(".js-tab .gift-copy").html(giveDesc)

                $("#activePrice").html(price);
                $("#discountPrice").hide();

                if ($this.data('vid')) {
                    params.vid = $this.data('vid');
                    params.type = "10";
                    params.vipMemberId = $this.data('vid');
                }
                if ($this.data('index') !== '') {
                    $('.ui-tab-content ul').eq($this.data('index')).removeClass('hide').siblings('ul').addClass('hide');
                }
                if ($this.data("actids")) {
                    params.aid = $this.data("actids");
                }
                // 处理切换套餐弹起优惠券
                if ($this.data('index') != curActive) {
                    curActive = $this.data('index');
                    switchCount++;
                }
                // 当切换套餐两次，触发弹窗
                if (switchCount >= 2) {
                    startCouponReceive(couponList, function() {
                        switchCount = 0;
                    });
                }
            }
        })
    });

    $('.renewal-label').on('change', function(e) {
            couponObj.updatePrice()
        })
        //支付 生成二维码
    $(document).on("click", ".btn-buy-bar", function(e) {
        e && e.preventDefault();
        //是否登录
        if (!method.getCookie('cuk')) {

            $("#unLogin").click();
            return;
        }
        // var ptype = $(this).data("page");  
        var checkStatus = params.type
        if (checkStatus == '10') { // ptype == 'vip'
            params.type = '10';
            if ($(".js-tab ul.pay-vip-list").find("li.active").data("vid")) {
                params.vipMemberId = params.vid = $(".js-tab ul.pay-vip-list").find("li.active").data("vid");
            }
            params.aid = $(".js-tab ul.pay-vip-list").find("li.active").data("actids");
            //    report.price = $(".js-tab ul.pay-vip-list").find("li.active").data("price");
            //  report.name = $(".js-tab ul.pay-vip-list").find("li.active").data("month");
            // 带优惠券id
            params.vouchersId = $('.pay-coupon-wrap').attr('vid')
            params.suvid = $('.pay-coupon-wrap').attr('svuid')
            $(".btn-vip-item-selected").attr("pcTrackContent", 'payVip-' + params.vid);
            $(".btn-vip-item-selected").click();
            // __pc__.push(['pcTrackEvent','payVip-'+params.vid]);
        } else if (checkStatus == '13') { //  ptype == 'privilege' 
            params.type = '13';
            if ($("ul.pay-pri-list").find("li.active").data("pid")) {
                params.pid = $("ul.pay-pri-list").find("li.active").data("pid");
                params.aid = $("ul.pay-pri-list").find("li.active").data("actids");
            }
            params.aid = $("ul.pay-pri-list").find("li.active").data("actids");
            //     report.price = $("ul.pay-pri-list").find("li.active").data("price");
        } else if (checkStatus == '8') { // ptype === 'file'
            params = {
                fid: pageConfig.params.g_fileId,
                type: 8,
                ref: utils.getPageRef(window.pageConfig.params.g_fileId),
                referrer: pageConfig.params.referrer,
                vouchersId: $('.pay-coupon-wrap').attr('vid'),
                suvid: $('.pay-coupon-wrap').attr('svuId'),
                remark: params.remark
            }
        }
        clickPay(checkStatus);
    });

    try { //引入美洽客服
        (function(a, b, c, d, e, j, s) {
            a[d] = a[d] || function() {
                (a[d].a = a[d].a || []).push(arguments)
            };
            j = b.createElement(c),
                s = b.getElementsByTagName(c)[0];
            j.async = true;
            j.charset = 'UTF-8';
            j.src = 'https://static.meiqia.com/widget/loader.js';
            s.parentNode.insertBefore(j, s);
        })(window, document, 'script', '_MEIQIA');
        _MEIQIA('entId', 'da3025cba774985d7ac6fa734b92e729');
    } catch (e) {}
    // 联系客服
    $('.connect-ser').on('click', function() {
        _MEIQIA('manualInit');
    });

    var clickPay = function() {
        handleOrderResultInfo();
    };

    /**
     * 下单处理
     */
    function handleOrderResultInfo() {
        var type = params.type // 0: VIP套餐， 1:特权套餐 ， 2: 文件下载
        var goodsType = ''
        var goodsId = ''
        if (type == '8') { // 付费
            goodsType = '1'
            goodsId = params.fid
        } else if (type == '10') { // 资料vip 用户不是vip
            // params.type = '0'
            goodsType = '2'
            goodsId = params.vid
        } else if (params.type == '13') { // 特权
            // params.type = '1'
            goodsType = '8'
            goodsId = params.pid
        }
        var isAutoRenew = $('.js-tab').find('.ui-tab-nav-item.active').data('isautorenew')
        if (isAutoRenew == '1') {
            goodsType = $('.renewal-radio #renewal').attr('checked') ? 12 : goodsType // 续费
        }


        // 组装创建订单的参数
        var temp = { //  
            aid: params.aid,
            goodsId: goodsId, // 文件id  vip套餐id
            goodsType: goodsType, // 套餐类别  1-购买资料 2-购买VIP 3-购买下载券 4-购买爱问豆 8下载特权 9 优享资料
            remark: params.remark,
            sourceMode: 0, // 0PC 1M 2android 3ios 4快应用 5百度小程序 6微信浏览器
            channelSource: 4, // 订单频道来源 0办公 1教育 2建筑 3超级会员 4主站
            host: window.location.origin,
            channel: method.getCookie('channel'), // 渠道 message-短信 other-其他
            isVisitor: method.getCookie('cuk') ? 0 : 1,
            isVouchers: params.vouchersId ? 2 : 1, // 是否使用优惠券，1未使用，2使用
            vouchersId: params.vouchersId,
            svuId: params.suvid,
            buyerUserId: userInfo.uid,
            buyerUserName: userInfo.nickName,
            returnPayment: false,
            ref: utils.getPageRef(window.pageConfig.params.g_fileId), //正常为0,360合作文档为1，360文库为3
            referrer: document.referrer || document.URL,
        }
        $.ajax({
            url: api.order.createOrderInfo,
            type: "POST",
            data: JSON.stringify(temp),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function(data) {
                if (data && data.code == '0') {
                    console.log("下单返回的数据：" + data);
                    data['remark'] = temp.remark;
                    openWin(data);
                } else {
                    // __pc__.push(['pcTrackEvent','orderFail']);
                    $(".btn-vip-order-fail").click();
                    utils.showAlertDialog("温馨提示", '下单失败');
                }
            }
        })



    }

    /**
     * 支付跳转到新页面
     */
    function openWin(data) {
        var orderNo = data.data.orderNo;
        var price = data.data.payPrice;
        var name = data.data.name;
        var type = params.type; // 都以获取下载url接口  checkStatus为准  data.data.type ||
        var fileId = data.data.fileId;
        if (!fileId) {
            fileId = fid;
        }


        var target = "/pay/payQr.html?"; //   0: VIP套餐， 1:特权套餐 ， 2: 文件下载
        if (type == 10) { // checkStatus   10 资料是vip 用户不是vip   13 资料时vip 用户是vip特权不够  8 资料是付费 用户未购买             

            target = target + "type=10&";

            $(".btn-vip-order-done").click();

        } else if (type == 13) {

            target = target + "type=13&";

        } else if (type == 8) {

            target = target + "type=8&";
            var rf = method.getCookie('rf');
            if (rf) {
                rf = JSON.parse(rf);
                rf.orderId_var = orderNo;

            }
        }
        if (method.getParam('fid')) {
            fileId = method.getParam('fid');
        } else if (pageConfig.params.g_fileId) {
            fileId = pageConfig.params.g_fileId;
        }
        method.delCookie("br", "/");


        if ($('.js-tab').find('.ui-tab-nav-item.active').data('isautorenew') == '1') {
            var isAutoRenew = $('.renewal-radio #renewal').attr('checked') ? '1' : '0'
        }
        method.compatibleIESkip(target + "orderNo=" + orderNo + "&fid=" + fileId + "&isAutoRenew=" + isAutoRenew, false);
    }

    //网页支付宝
    function alipayClick(oid) {
        $(".web-alipay").bind('click', function() {
            if (oid) {
                $.get("/pay/webAlipay?ts=" + new Date().getTime(), { orderNo: oid }, function(data, status) {
                    if (status == "success") {
                        var form = data.data.form;
                        if (form) {
                            $("html").prepend(form);
                        }
                    } else {
                        utils.showAlertDialog("温馨提示", '打开网页支付宝支付异常，稍后再试');
                    }
                });
            } else {
                utils.showAlertDialog("温馨提示", '订单号不存在，稍后再试');
            }
        });
    }

    /**
     * 点击获取支付结果
     * */
    $(document).on("click", ".pay-info-link", function(e) {
        var orderNo = method.getParam("orderNo");
        var params = { orderNo: orderNo };
        var url = '/pay/orderStatus?ts=' + new Date().getTime(); // node接口
        $.ajax({
            headers: {
                'Authrization': method.getCookie('cuk')
            },
            url: url,
            type: "POST",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(params),
            dataType: "json",
            success: function(response) {
                if (response && response.code == 0) {
                    // 缓存查询次数
                    var data = response.data;
                    // // 防止空指针报错
                    data.reportData = data.reportData || {};
                    data.fid = data.fid || method.getParam('fid');
                    // 订单状态 0-待支付 1-支付进行中 2-支付成功 3-支付失败 4-订单取消
                    if (data.orderStatus == 0) {
                        // 重新查询
                        $.toast({
                            text: '请先完成支付',
                            delay: 1000,
                        })
                    } else if (data.orderStatus == 2) {
                        goodsPaySuccess(data, orderNo)
                    } else if (data.orderStatus == 3) {
                        goodsPayFail(data, orderNo);
                    }
                } else {
                    $.toast({
                        text: response.msg,
                        delay: 3000,
                    });
                }
            },
            error: function(error) {
                $.toast({
                    text: error.msg,
                    delay: 3000,
                })
            }
        })
    });

    /**
     * 获取文件详细信息
     * @param id 文件id
     * @param callback 回调携带返回数据
     */
    function getFileInfoById(id, callback) {
        // 获取资料详细信息
        var params = {
            clientType: 0,
            fid: id,
            sourceType: 2
        }
        $.ajax({
            type: 'POST',
            url: api.normalFileDetail.getFileDetailNoTdk, // '/gateway/content/getFileDetailNoTdk'
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            data: JSON.stringify(params),
            success: function(response) {
                console.error('获取资料详情数据', response.data)
                var fileInfo = {};
                if (response && response.data && response.data.fileInfo) {
                    fileInfo = response.data.fileInfo;
                }
                callback(fileInfo)
            }
        });
    }

    /**
     * 只用于订单结果轮询用
     * @type {number}
     */
    var order_count = 0;

    /**
     * 进入支付界面-调用接口进行轮询-等待后台结果返回-跳转到对应界面
     * 获取订单信息
     * @param orderNo 订单号
     */
    function getOrderInfo(orderNo) {
        var params = { orderNo: orderNo };
        var url = '/pay/orderStatus?ts=' + new Date().getTime(); // node接口
        $.ajax({
            headers: {
                'Authrization': method.getCookie('cuk')
            },
            url: url,
            type: "POST",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(params),
            dataType: "json",
            success: function(response) {
                if (response && response.code == 0) {
                    // 缓存查询次数
                    order_count++;
                    var data = response.data;
                    // // 防止空指针报错
                    data.reportData = data.reportData || {};
                    data.fid = data.fid || method.getParam('fid');
                    // 订单状态 0-待支付 1-支付进行中 2-支付成功 3-支付失败 4-订单取消
                    if (data.orderStatus == 0) {
                        // 重新查询
                        if (!!!timerFlag) {
                            window.setTimeout(function() {
                                getOrderInfo(orderNo);
                            }, 4000);
                        }
                    } else if (data.orderStatus == 2) {
                        goodsPaySuccess(data, orderNo)
                    } else if (data.orderStatus == 3) {
                        goodsPayFail(data, orderNo);
                    }


                } else {
                    $.toast({
                        text: response.msg,
                        delay: 3000,
                    })

                }
            },
            error: function(error) {
                $.toast({
                    text: error.msg,
                    delay: 3000,
                })
            }
        })
    }

    /**
     * 支付成功
     * goodsType=>虚拟物品类型 1-购买资料 2-购买VIP 3-购买下载券 4-购买爱问豆 8-下载特权
     * @param orderInfo 订单信息
     * @param orderNo 订单号
     */
    function goodsPaySuccess(orderInfo, orderNo) {
        // 移除cookie
        method.delCookie("br", "/");
        // 携带参数,上报数据
        // var href = '/pay/success.html' + '?orderNo=' + orderNo + '&fid=' + orderInfo.fid,
        var format = window.pageConfig && window.pageConfig.params.format
        var title = window.pageConfig && window.pageConfig.params.title || $('.data-name').text()
        var href = '/pay/success.html' + '?orderNo=' + orderNo + '&fid=' + orderInfo.fid + '&format=' + format + '&title=' + encodeURIComponent(title),
            bilogResult = null;
        if (orderInfo.goodsType === 1) {
            // 购买文件成功
            href += '&type=2';
            var rf = method.getCookie('rf');
            if (rf) {
                rf = JSON.parse(rf);
                rf.orderId_var = orderNo;
                //  report.docPaySuccess(rf);
                method.delCookie('rf', "/");
            }
            // 自由埋点数据
            bilogResult = {
                orderID: orderInfo.reportData.orderId,
                orderPayType: orderInfo.reportData.orderPayCode,
                orderPayPrice: orderInfo.reportData.payPrice,
                couponID: orderInfo.reportData.couponID || '',
                coupon: '',
            };

            // 获取资料详细信息
            getFileInfoById(orderInfo.fid, function(fileInfo) {
                // 自有埋点
                payFileResult_bilog.reportResult(orderInfo, fileInfo, true);
            })

        } else if (orderInfo.goodsType === 2||orderInfo.goodsType === 12) {
            // 购买vip成功
            href += '&type=0' + '&renewalVIP=' + renewalVIP;
            var rv = method.getCookie('rv');
            if (rv) {
                // report.vipPaySuccess(JSON.parse(rv));
                method.delCookie('rv', "/");
            }
            // 自由埋点数据
            bilogResult = {
                orderID: orderInfo.reportData.orderId,
                orderPayType: orderInfo.reportData.orderPayCode,
                orderPayPrice: orderInfo.reportData.payPrice,
                couponID: orderInfo.reportData.couponID || '',
                coupon: '',
                vipID: orderInfo.reportData.id,
                vipName: orderInfo.reportData.name,
                vipPrice: orderInfo.reportData.payPrice || '',
            };

            // 自有埋点
            payVipResult_bilog.reportResult(orderInfo, true);

            //透传用户信息 更新isVip字段
            $(".js-sync").trigger('click');

        } else if (orderInfo.goodsType === 8) {
            // 购买下载特权成功
            href += '&type=1';
            var rp = method.getCookie('rp');
            if (rp) {
                // report.privilegePaySuccess(JSON.parse(rp));
                method.delCookie('rp', "/");
            }
            // 自由埋点数据
            bilogResult = {
                orderID: orderInfo.reportData.orderId,
                orderPayType: orderInfo.reportData.orderPayCode,
                orderPayPrice: orderInfo.reportData.payPrice,
                couponID: orderInfo.reportData.couponID || '',
                coupon: '',
                privilegeID: orderInfo.reportData.id,
                privilegeName: orderInfo.reportData.name,
                privilegePrice: orderInfo.reportData.payPrice || '',
            };

            // 获取资料详细信息
            getFileInfoById(orderInfo.fid, function(fileInfo) {
                // 自有埋点
                payPrivilegeResult_bilog.reportResult(orderInfo, fileInfo, true);
            })
        }

        // 自有埋点用到
        method.setCookieWithExp('br', JSON.stringify(bilogResult), 30 * 60 * 1000, '/');
        // window.location.href = href;
        method.compatibleIESkip(href, false);
    }

    /**
     * 支付失败
     * goodsType=>虚拟物品类型 1-购买资料 2-购买VIP 3-购买下载券 4-购买爱问豆 8-下载特权
     * @param orderInfo 订单信息
     * @param orderNo 订单号
     */
    function goodsPayFail(orderInfo, orderNo) {
        // 携带参数,上报数据
        var href = '/pay/fail.htm' + '?orderNo=' + orderNo + '&fid=' + orderInfo.fid,
            bilogResult = null;
        if (orderInfo.goodsType == 1) {
            // 购买文件失败
            href += "&type=2";
            bilogResult = {
                orderID: orderInfo.reportData.orderId,
                orderPayType: orderInfo.reportData.orderPayCode,
                orderPayPrice: orderInfo.reportData.payPrice,
                couponID: orderInfo.reportData.couponID || '',
                coupon: '',
            };

            // 获取资料详细信息
            getFileInfoById(orderInfo.fid, function(fileInfo) {
                // 自有埋点
                payFileResult_bilog.reportResult(orderInfo, fileInfo, false);
            })

        } else if (orderInfo.goodsType == 2) {
            // 购买vip失败
            href += "&type=0";
            bilogResult = {
                orderID: orderInfo.reportData.orderId,
                orderPayType: orderInfo.reportData.orderPayCode,
                orderPayPrice: orderInfo.reportData.payPrice,
                couponID: orderInfo.reportData.couponID || '',
                coupon: '',
                vipID: orderInfo.reportData.id,
                vipName: orderInfo.reportData.name,
                vipPrice: orderInfo.reportData.payPrice || '',
            };

            // 自有埋点
            payVipResult_bilog.reportResult(orderInfo, false);

        } else if (orderInfo.goodsType == 8) {
            // 购买下载特权失败
            href += "&type=1";
            bilogResult = {
                orderID: orderInfo.reportData.orderId,
                orderPayType: orderInfo.reportData.orderPayCode,
                orderPayPrice: orderInfo.reportData.payPrice || '',
                couponID: orderInfo.reportData.couponID || '',
                coupon: '',
                privilegeID: orderInfo.reportData.id,
                privilegeName: orderInfo.reportData.name,
                privilegePrice: orderInfo.reportData.payPrice || '',
            };

            // 获取资料详细信息
            getFileInfoById(orderInfo.fid, function(fileInfo) {
                // 自有埋点
                payPrivilegeResult_bilog.reportResult(orderInfo, fileInfo, false);
            })
        }

        // 自由埋点用到
        method.setCookieWithExp('br', JSON.stringify(bilogResult), 30 * 60 * 1000, '/');
        // window.location.href = href;
        method.compatibleIESkip(href, false);
    }

    // ===== end ====

    $(".btn-back").click(function() {
        var referrer = document.referrer;
        if (referrer) {
            // window.location.href = referrer;
            method.compatibleIESkip(referrer, false);
        } else {
            // window.location.href = "/";
            method.compatibleIESkip("/", false);
        }
    });

    function buySuccessDownLoad() {
        if (!method.getCookie('cuk')) return;
        var fid = window.pageConfig.params.g_fileId;
        if (!fid) return;
        getFileDownLoadUrl(fid)

    }

    function getFileDownLoadUrl(fid) {
        $.ajax({
            headers: {
                'Authrization': method.getCookie('cuk')
            },
            url: api.normalFileDetail.getFileDownLoadUrl,
            type: "POST",
            data: JSON.stringify({
                "clientType": 0,
                "fid": fid,
                "sourceType": 1
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function(res) {
                console.log(res)
                if (res.code == '0') {
                    var browserEnv = method.browserType();
                    method.delCookie("event_data_down", "/");
                    if (browserEnv === 'IE' || browserEnv === 'Edge') {
                        // window.location.href = res.data;
                        method.compatibleIESkip(res.data.fileDownUrl, false);
                    } else if (browserEnv === 'Firefox') {
                        // var downLoadURL = res.data;
                        // var sub = downLoadURL.lastIndexOf('&fn=');
                        // var sub_url1 = downLoadURL.substr(0, sub + 4);
                        // var sub_ur2 = decodeURIComponent(downLoadURL.substr(sub + 4, downLoadURL.length));
                        // window.location.href = sub_url1 + sub_ur2;
                        method.compatibleIESkip(res.data.fileDownUrl, false);
                    } else {
                        // window.location.href = res.data;
                        method.compatibleIESkip(res.data.fileDownUrl, false);
                    }
                } else {
                    $.toast({
                        text: res.msg || '下载失败'
                    })
                }
            }
        })
    }

    // 续费vip成功
    console.log(method.getParam("orderNo"))
    var pathName = location.pathname // 
    if (method.getParam("renewalVIP") == '1' && pathName == "/pay/success.html") {
        var orderNo = method.getParam("orderNo")
        rightsVipGetUserMember()

        function rightsVipGetUserMember() {
            $.ajax({
                url: api.order.rightsVipGetUserMember,
                type: "POST",
                data: JSON.stringify({ orderId: orderNo }),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function(res) {
                    if (res.code == '0') {
                        var formatDate = method.formatDate
                        Date.prototype.format = formatDate
                        console.log(res)
                        var beginDate = new Date(res.data.beginDate).format("yyyy-MM-dd")
                        var endDate = new Date(res.data.endDate).format("yyyy-MM-dd")
                        var title = '你已经成功续费爱问共享资料VIP'
                        var subtitle = '你的下载权益将于' + beginDate + '日发放至账户' + endDate + '日即当前VIP失效时间后一天'
                        var type = method.getParam("type")
                        var fid = method.getParam("fid")
                        if (type == '0' && fid) {
                            $('.pay-ok-text span').text(title)
                            $('.pay-bottom-text').text(subtitle)
                        } else if (type == 0) {
                            $('.pay-ok-text span').text(title)
                            $('.pay-bottom-text').text(subtitle)
                        }
                    }
                }
            })
        }
    }
});