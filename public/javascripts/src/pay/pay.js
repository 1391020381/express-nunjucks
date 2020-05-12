define(function (require, exports, moudle) {
    //所有支付引用办公频道支付js
    // var $ = require("$");
    require('swiper');
    var method = require("../application/method");
    var utils = require("../cmd-lib/util");
    var qr = require("./qr");
    var report = require("./report");
    var api = require('../application/api');
    require("../common/coupon/couponOperate");
    require("../common/coupon/couponIssue");
    require("../common/bilog");
    //生成二维码
    $(function () {  
        var flag = $("#ip-flag").val();  // result.flag
        var uid = $("#ip-uid").val();    //  results.data.uid
        var type = $("#ip-type").val();  // results.type
        var isVip = $("#ip-isVip").val();  //   results.data.isVip  获取保存在input的数据
        if (flag == 3 && uid) {//二维码页面
            if (type == 0) {//vip购买
                if (method.getCookie('cuk')) {
                    $(".btn-vip-login-arrive").click();
                    // __pc__.push(['pcTrackEvent','pcLoginSuccessArriveVipPage']);
                }
            } else if (type == 2) {//文件购买
                if (isVip != 1) {
                    $(".price-discount").hide();
                } else {
                    $(".price-discount").show();
                }
                if (method.getCookie('cuk')) {
                    $(".btn-file-login-arrive").click();
                    // __pc__.push(['pcTrackEvent','pcLoginSuccessArriveFilePage']);
                }
            }
            var oid = $("#ip-oid").val();
            if (oid) {
                $(".carding-pay-item .oid").text(oid);
                var url = "http://ishare.iask.sina.com.cn/notm/qr?oid=" + oid;
                try {
                    qr.createQrCode(url, 'pay-qr-code', 180, 180);
                    $(".btn-qr-show-success").click();
                    // __pc__.push(['pcTrackEvent',' qrCodeSuccess']);
                } catch (e) {
                    console.log("生成二维码异常");
                    $(".btn-qr-show-fail").click();
                    // __pc__.push(['pcTrackEvent',' qrCodeFail']);
                }
                alipayClick(oid);
                payStatus(oid);
            } else {
                utils.showAlertDialog("温馨提示", '订单失效，请重新下单');
            }
        } else if (flag == "true" && uid) {//成功页面
            var mobile = $("#ip-mobile").val();
            if (mobile) {//隐藏绑定手机号模块 公众号模块居中
                $(".carding-info-bottom").addClass('carding-binding-ok');
            }
            if (type === '2') {
                buySuccessDownLoad();
            }
        } else if (flag == "false" && uid) {//失败页面

        } else if (flag == "0") {
            // $(".carding-vip-con .vip-title").show();
        }
    });

    var fid = window.pageConfig.params.g_fileId;
    if (!fid) {
        fid = method.getParam('fid');
        window.pageConfig.params.g_fileId = fid;
    }
    //支付相关参数
    var params = {
        fid: window.pageConfig.params.g_fileId || '',                            //文件id
        aid: '',                                                                 //活动id
        vid: '',                                                                 //vip套餐id
        pid: '',                                                                 //特权id
        oid: "",                                                                 //订单ID 获取旧订单
        type: '2',                                                               //套餐类别 0: VIP套餐， 1:特权套餐 ， 2: 文件下载
        ref: utils.getPageRef(window.pageConfig.params.g_fileId),                //正常为0,360合作文档为1，360文库为3
        referrer: document.referrer || document.URL,                             //来源网址
        remark: '',                                                              //页面来源 其他-办公频道           
        ptype: '',                                                               //现金:cash, 下载券:volume, 免费:free, 仅在线阅读:readonly
        isVip: window.pageConfig.params.isVip || 0,                               //是否vip
        vipMemberId:''                                                            //权益套餐ID
    };

    //从详情页进入vip所需要来源
    if (method.getParam("remark") === "office") { 
        params.remark = "office";
        window.pageConfig.gio.reportVipData.channelName_var = "办公频道";
        window.pageConfig.gio.reportPrivilegeData.channelName_var = "办公频道";
    } else {
        params.remark = "other";
        window.pageConfig.gio.reportVipData.channelName_var = "其他";
        window.pageConfig.gio.reportPrivilegeData.channelName_var = "其他";
    }

    if (method.getParam("ref")) {
        params.ref = utils.getPageRef(fid);
    }
    // 点击下载
    $('.quick-down-a').click(function () {
        buySuccessDownLoad()
    });

    $(".js-buy-open").click(function () {
        var ref = utils.getPageRef(fid);      //用户来源
        var params = '?fid=' + fid + '&ref=' + ref;
        var mark = $(this).data('type');
        if (mark == 'vip') {
            // window.open('/pay/vip.html' + params);
            method.compatibleIESkip('/pay/vip.html' + params, true);
        } else if (mark == 'privilege') {
            // window.open('/pay/privilege.html' + params);
            method.compatibleIESkip('/pay/privilege.html' + params, true);
        }
    });

    //特权套餐切换
    $(document).on("click", "ul.pay-pri-list li", function () {
        $(this).siblings("li").removeClass("active");
        $(this).addClass("active");
        var price = $(this).data('price');
        var activePrice = $(this).data('activeprice');
        var discountPrice = $(this).data('discountprice');
        if (activePrice > 0) {
            $("#activePrice").html(activePrice);
            if (discountPrice > 0) {
                $("#discountPrice").html("（立省" + discountPrice + "元）");
                $("#discountPrice").show();
            } else {
                $("#discountPrice").hide();
            }
        } else {
            $("#activePrice").html(price);
            $("#discountPrice").hide();
        }

        if ($(this).data('pid')) {
            params.pid = $(this).data('pid');
            params.type = "1";
        }
    });

    //vip套餐切换
    $(".js-tab").each(function () {
        $(this).tab({
            activeClass: 'active',
            element: 'div',
            callback: function ($this) {
                var price = $this.data('price');
                var activePrice = $this.data('activeprice');
                var discountPrice = $this.data('discountprice');
               // class give-desc
               var giveDesc =  $this.find('.give-desc').html() || ''
                $(".js-tab .gift-copy").html(giveDesc)
                if (activePrice > 0) {
                    $("#activePrice").html(activePrice);
                    if (discountPrice > 0) {
                        $("#discountPrice").html("（立省" + discountPrice + "元）");
                        $("#discountPrice").show();
                    } else {
                        $("#discountPrice").hide();
                    }
                } else {
                    $("#activePrice").html(price);
                    $("#discountPrice").hide();
                }
                if ($this.data('vid')) {
                    params.vid = $this.data('vid');
                    params.type = "0";
                    params.vipMemberId = $this.data('vid');
                }
                if ($this.data('index')!=='') {
                    $('.ui-tab-content ul').eq($this.data('index')).removeClass('hide').siblings('ul').addClass('hide');
                }
                if ($this.data("actids")) {
                    params.aid = $this.data("actids");
                }
            }
        })
    });

    //支付 生成二维码
    $(document).on("click", ".btn-buy-bar", function (e) {
        e && e.preventDefault();
        //是否登录
        if (!method.getCookie('cuk')) {
            $(".js-login").click();
            return;
        }
        var ptype = $(this).data("page");
        if (ptype == 'vip') {
            params.type = '3';
            if ($(".js-tab ul.pay-vip-list").find("li.active").data("vid")) {
                params.vipMemberId = params.vid = $(".js-tab ul.pay-vip-list").find("li.active").data("vid");
            }
            params.aid = $(".js-tab ul.pay-vip-list").find("li.active").data("actids");
            report.price = $(".js-tab ul.pay-vip-list").find("li.active").data("price");
            report.name = $(".js-tab ul.pay-vip-list").find("li.active").data("month");
            // 带优惠券id
            params.vouchersId = $('.pay-coupon-wrap').attr('vid')
            params.suvid = $('.pay-coupon-wrap').attr('svuid')
            $(".btn-vip-item-selected").attr("pcTrackContent", 'payVip-' + params.vid);
            $(".btn-vip-item-selected").click();
            // __pc__.push(['pcTrackEvent','payVip-'+params.vid]);
        } else if (ptype == 'privilege') {
            params.type = '1';
            if ($("ul.pay-pri-list").find("li.active").data("pid")) {
                params.pid = $("ul.pay-pri-list").find("li.active").data("pid");
            }
            params.aid = $("ul.pay-pri-list").find("li.active").data("actids");
            report.price = $("ul.pay-pri-list").find("li.active").data("price");
        } else if (ptype === 'file') {
            params = {
                fid: pageConfig.params.g_fileId,
                type: 2,
                ref: utils.getPageRef(window.pageConfig.params.g_fileId),
                referrer: pageConfig.params.referrer,
                vouchersId: $('.pay-coupon-wrap').attr('vid'),
                suvid: $('.pay-coupon-wrap').attr('svuId'),
                remark: params.remark
            }
        }
        clickPay(ptype);
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
    $('.connect-ser').on('click', function () {
        _MEIQIA('init');
    });

    var clickPay = function (ptype) {
        params.isVip = window.pageConfig.params.isVip;
        if (ptype == 'vip' || ptype == 'privilege') {
            if (params.isVip == '2') {//判断vip状态
                utils.showAlertDialog("温馨提示", '你的VIP退款申请正在审核中，审核结束后，才能继续购买哦^_^');
                return;
            } else if (ptype == 'privilege' && params.isVip != '1') {//用户非vip
                utils.showAlertDialog("温馨提示", '购买下载特权需要开通vip哦^_^');
                return;
            }
        }
        handleOrderResultInfo();
    };

    /**
     * 下单处理
     */
    function handleOrderResultInfo() {
        $.post('/pay/order?ts=' + new Date().getTime(), params, function (data, status) {
            if (data && data.code == '0') {
                console.log("下单返回的数据：" + data);
                data['remark'] = params.remark;
                openWin(data);
            } else {
                // __pc__.push(['pcTrackEvent','orderFail']);
                $(".btn-vip-order-fail").click();
                utils.showAlertDialog("温馨提示", '下单失败');
            }
        });
    }

    /**
     * 支付跳转到新页面
     */
    function openWin(data) {
        var orderNo = data.data.orderNo;
        var price = data.data.price;
        var name = data.data.name;
        var type = data.data.type;
        var fileId = data.data.fileId;
        if (!fileId) {
            fileId = fid;
        }

        fillReportData(orderNo, name, price * 100, '二维码合一', type);
        var target = "/pay/payQr.html?";
        if (type == 0) {
            target = target + "type=0&";
            report.vipPayClick(window.pageConfig.gio.reportVipData);
            $(".btn-vip-order-done").click();
            // __pc__.push(['pcTrackEvent','orderDone']);
        } else if (type == 1) {
            target = target + "type=1&";
            report.privilegePayClick(window.pageConfig.gio.reportPrivilegeData);
        } else if (type == 2) {
            target = target + "type=2&";
            var rf = method.getCookie('rf');
            if (rf) {
                rf = JSON.parse(rf);
                rf.orderId_var = orderNo;
                report.filePayClick(rf);
            }
        }
        if (method.getParam('fid')) {
            fileId = method.getParam('fid');
        } else if (pageConfig.params.g_fileId) {
            fileId = pageConfig.params.g_fileId;
        }
        method.delCookie("br", "/");
        // window.location.href = target+"orderNo=" + orderNo + "&fid=" + fileId;
        method.compatibleIESkip(target + "orderNo=" + orderNo + "&fid=" + fileId, false);
    }

    function fillReportData(orderNo, name, price, type, ptype) {
        if (ptype == 0) {
            window.pageConfig.gio.reportVipData.orderId_var = orderNo;
            window.pageConfig.gio.reportVipData.vipName_var = name;
            window.pageConfig.gio.reportVipData.vipPayPrice_var = price;
            window.pageConfig.gio.reportVipData.orderPayType_var = type;
            method.setCookieWithExpPath('rv', JSON.stringify(window.pageConfig.gio.reportVipData), 5 * 60 * 1000, '/');
        } else if (ptype == 1) {
            window.pageConfig.gio.reportPrivilegeData.orderId_var = orderNo;
            window.pageConfig.gio.reportPrivilegeData.privilegeName_var = name;
            window.pageConfig.gio.reportPrivilegeData.privilegePayPrice_var = price;
            window.pageConfig.gio.reportPrivilegeData.orderPayType_var = type;
            method.setCookieWithExpPath('rp', JSON.stringify(window.pageConfig.gio.reportPrivilegeData), 5 * 60 * 1000, '/');
        } else if (ptype == 2) {

        }
    }
    //网页支付宝
    function alipayClick(oid) {
        $(".web-alipay").bind('click', function () {
            if (oid) {
                $.get("/pay/webAlipay?ts=" + new Date().getTime(), { orderNo: oid }, function (data, status) {
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
     * 订单状态更新
     */
    var count = 0;
    function payStatus(orderNo) {
        $.post("/pay/orderStatus?ts=" + new Date().getTime(), { 'orderNo': orderNo }, function (data, status) {
            if (data && data.code == 0) {
                count++;
                var res = data.data;
                var orderStatus = res.orderStatus;
                var fid = res.fid;
                if (!fid) {
                    fid = method.getParam('fid');
                }

                if (orderStatus == 0) {//待支付
                    if (count <= 30) {
                        window.setTimeout(function () {
                            payStatus(orderNo)
                        }, 4000);
                    }
                } else if (orderStatus == 2) {//成功
                    var params = '?orderNo=' + orderNo + "&";
                    try {
                        method.delCookie("br", "/");
                        if (res.goodsType == 1) {//购买文件成功
                            params += "fid=" + fid + "&type=2";
                            var rf = method.getCookie('rf');
                            if (rf) {
                                rf = JSON.parse(rf);
                                rf.orderId_var = orderNo;
                                report.docPaySuccess(rf);
                                method.delCookie('rf', "/");
                            }

                            var bilogResult = {
                                orderID: res.reportData.orderId,
                                orderPayType: res.reportData.orderPayCode,
                                orderPayPrice: res.reportData.payPrice,
                                couponID: res.reportData.couponID || '',
                                coupon: '',
                            };
                            method.setCookieWithExp('br', JSON.stringify(bilogResult), 30 * 60 * 1000, '/');
                        } else if (res.goodsType == 2) {//购买vip成功
                            params += "fid=" + fid + "&type=0";
                            var rv = method.getCookie('rv');
                            if (rv) {
                                report.vipPaySuccess(JSON.parse(rv));
                                method.delCookie('rv', "/");
                            }

                            var bilogResult = {
                                orderID: res.reportData.orderId,
                                orderPayType: res.reportData.orderPayCode,
                                orderPayPrice: res.reportData.payPrice,
                                couponID: res.reportData.couponID || '',
                                coupon: '',
                                vipID: res.reportData.id,
                                vipName: res.reportData.name,
                                vipPrice: res.reportData.payPrice || '',
                            };
                            method.setCookieWithExp('br', JSON.stringify(bilogResult), 30 * 60 * 1000, '/');

                            //透传用户信息 更新isVip字段
                            $(".js-sync").trigger('click');
                        } else if (res.goodsType == 8) {//购买下载特权成功
                            params += "fid=" + fid + "&type=1";
                            var rp = method.getCookie('rp');
                            if (rp) {
                                report.privilegePaySuccess(JSON.parse(rp));
                                method.delCookie('rp', "/");
                            }

                            var bilogResult = {
                                orderID: res.reportData.orderId,
                                orderPayType: res.reportData.orderPayCode,
                                orderPayPrice: res.reportData.payPrice,
                                couponID: res.reportData.couponID || '',
                                coupon: '',
                                privilegeID: res.reportData.id,
                                privilegeName: res.reportData.name,
                                privilegePrice: res.reportData.payPrice || '',
                            };
                            method.setCookieWithExp('br', JSON.stringify(bilogResult), 30 * 60 * 1000, '/');

                        }
                    } catch (e) {
                    }
                    // window.location.href = "/pay/success.html" + params;
                    method.compatibleIESkip("/pay/success.html" + params, false);
                } else if (orderStatus == 3) {//失败
                    var params = '?orderNo=' + orderNo + "&";
                    try {
                        method.delCookie("br", "/");
                        if (res.goodsType == 1) {//购买文件成功
                            params += "fid=" + fid + "&type=2";
                            var bilogResult = {
                                orderID: res.reportData.orderId,
                                orderPayType: res.reportData.orderPayCode,
                                orderPayPrice: res.reportData.payPrice,
                                couponID: res.reportData.couponID || '',
                                coupon: '',
                            };
                            method.setCookieWithExp('br', JSON.stringify(bilogResult), 30 * 60 * 1000, '/');
                        } else if (res.goodsType == 2) {//购买vip成功
                            params += "fid=" + fid + "&type=0";
                            var bilogResult = {
                                orderID: res.reportData.orderId,
                                orderPayType: res.reportData.orderPayCode,
                                orderPayPrice: res.reportData.payPrice,
                                couponID: res.reportData.couponID || '',
                                coupon: '',
                                vipID: res.reportData.id,
                                vipName: res.reportData.name,
                                vipPrice: res.reportData.payPrice || '',
                            };
                            method.setCookieWithExp('br', JSON.stringify(bilogResult), 30 * 60 * 1000, '/');
                        } else if (res.goodsType == 8) {//购买下载特权成功
                            params += "fid=" + fid + "&type=1";
                            var bilogResult = {
                                orderID: res.reportData.orderId,
                                orderPayType: res.reportData.orderPayCode,
                                orderPayPrice: res.reportData.payPrice || '',
                                couponID: res.reportData.couponID || '',
                                coupon: '',
                                privilegeID: res.reportData.id,
                                privilegeName: res.reportData.name,
                                privilegePrice: res.reportData.payPrice || '',
                            };
                            method.setCookieWithExp('br', JSON.stringify(bilogResult), 30 * 60 * 1000, '/');
                        }
                    } catch (e) {
                    }
                    // window.location.href = "/pay/fail.html" + params;
                    method.compatibleIESkip("/pay/fail.html" + params, false);
                }
            } else {//error
                console.log(data);
            }
        });
    }

    $(".btn-back").click(function () {
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
        method.get(api.pay.successBuyDownLoad + '/' + fid, function (res) {
            if (res.code == '0') {
                var browserEnv = method.browserType();
                method.delCookie("event_data_down", "/");
                if (browserEnv === 'IE' || browserEnv === 'Edge') {
                    // window.location.href = res.data;
                    method.compatibleIESkip(res.data, false);
                } else if (browserEnv === 'Firefox') {
                    var downLoadURL = res.data;
                    var sub = downLoadURL.lastIndexOf('&fn=');
                    var sub_url1 = downLoadURL.substr(0, sub + 4);
                    var sub_ur2 = decodeURIComponent(downLoadURL.substr(sub + 4, downLoadURL.length));
                    // window.location.href = sub_url1 + sub_ur2;
                    method.compatibleIESkip(sub_url1 + sub_ur2, false);
                } else {
                    // window.location.href = res.data;
                    method.compatibleIESkip(res.data, false);
                }
            }
        })
    }

    var topBnnerTemplate = require("../common/template/swiper_tmp.html");
    var arr = [
       {
       key:1,
       value:'http://imgcps.jd.com/ling/7306951/5Lqs6YCJ5aW96LSn/5L2g5YC85b6X5oul5pyJ/p-5bd8253082acdd181d02fa22/29eceb26/590x470.jpg'
      },
      {
       key:2,
       value:'http://imgcps.jd.com/ling/7306951/5Lqs6YCJ5aW96LSn/5L2g5YC85b6X5oul5pyJ/p-5bd8253082acdd181d02fa22/29eceb26/590x470.jpg'
      },
      {
       key:3,
       value:'http://imgcps.jd.com/ling/7306951/5Lqs6YCJ5aW96LSn/5L2g5YC85b6X5oul5pyJ/p-5bd8253082acdd181d02fa22/29eceb26/590x470.jpg'
      },
      {
       key:4,
       value:'http://imgcps.jd.com/ling/7306951/5Lqs6YCJ5aW96LSn/5L2g5YC85b6X5oul5pyJ/p-5bd8253082acdd181d02fa22/29eceb26/590x470.jpg'
      }
    ]
    var _html = template.compile(topBnnerTemplate)({ topBanner: arr ,className:'pay-success-swiper-container' });
      $(".pay-success-banner").html(_html);
      if (arr.length > 1) {
       var mySwiper = new Swiper('.pay-success-swiper-container', {
           direction: 'horizontal',
           loop: true,
           autoplay: 3000,
       })
   }
});