define("dist/office/pay/pay-debug", [ "../common/suspension-debug", "../../application/method-debug", "../../application/checkLogin-debug", "../../application/api-debug", "../../application/app-debug", "../../application/element-debug", "../../application/template-debug", "../../application/extend-debug", "../../common/bilog-debug", "base64-debug", "../../cmd-lib/util-debug", "../../report/config-debug", "../../report/init-debug", "../../report/handler-debug", "../../report/columns-debug", "../../application/helper-debug", "//static3.iask.cn/resource/js/plugins/pc.iask.login.min-debug", "./qr-debug", "../../cmd-lib/qr/qrcode.min-debug", "../../cmd-lib/qr/jquery.qrcode.min-debug", "./report-debug" ], function(require, exports, moudle) {
    //所有支付引用办公频道支付js
    // var $ = require("$");
    var su = require("../common/suspension-debug");
    var app = require("../../application/app-debug");
    var method = require("../../application/method-debug");
    var utils = require("../../cmd-lib/util-debug");
    var qr = require("./qr-debug");
    var report = require("./report-debug");
    var checkLogin = require("../../application/checkLogin-debug");
    require("../../common/bilog-debug");
    var fid = window.pageConfig.params.g_fileId;
    if (!fid) {
        fid = method.getParam("fid");
        window.pageConfig.params.g_fileId = fid;
    }
    //支付相关参数
    var params = {
        fid: window.pageConfig.params.g_fileId || "",
        //文件id
        aid: "",
        //活动id
        vid: "",
        //vip套餐id
        pid: "",
        //特权id
        oid: "",
        //订单ID 获取旧订单
        type: "2",
        //套餐类别 0: VIP套餐， 1:特权套餐 ， 2: 文件下载
        ref: utils.getPageRef(window.pageConfig.params.g_fileId),
        //正常为0,360合作文档为1，360文库为3
        referrer: document.referrer || document.URL,
        //来源网址
        remark: "office",
        //页面来源 其他-办公频道
        ptype: "",
        //现金:cash, 下载券:volume, 免费:free, 仅在线阅读:readonly
        isVip: window.pageConfig.params.isVip || 0
    };
    params.remark = "office";
    window.pageConfig.gio.reportVipData.channelName_var = "办公频道";
    window.pageConfig.gio.reportPrivilegeData.channelName_var = "办公频道";
    if (method.getParam("ref")) {
        params.ref = utils.getPageRef(fid);
    }
    $(".js-buy-open").click(function() {
        var ref = utils.getPageRef(fid);
        //用户来源
        var params = "?fid=" + fid + "&ref=" + ref;
        var mark = $(this).data("type");
        if (mark == "vip") {
            // window.open('/pay/vip.html' + params);
            method.compatibleIESkip("/pay/vip.html" + params, true);
        } else if (mark == "privilege") {
            // window.open('/pay/privilege.html' + params);
            method.compatibleIESkip("/pay/privilege.html" + params, true);
        }
    });
    //特权套餐切换
    $(document).on("click", "ul.pay-pri-list li", function() {
        $(this).siblings("li").removeClass("active");
        $(this).addClass("active");
        var price = $(this).data("price");
        var activePrice = $(this).data("activeprice");
        var discountPrice = $(this).data("discountprice");
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
        if ($(this).data("pid")) {
            params.pid = $(this).data("pid");
            params.type = "1";
        }
    });
    //vip套餐切换
    $(".js-tab").each(function() {
        $(this).tab({
            activeClass: "active",
            element: "div",
            callback: function($this) {
                var price = $this.data("price");
                var activePrice = $this.data("activeprice");
                var discountPrice = $this.data("discountprice");
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
                if ($this.data("vid")) {
                    params.vid = $this.data("vid");
                    params.type = "0";
                }
                if ($this.data("actids")) {
                    params.aid = $this.data("actids");
                }
            }
        });
    });
    //透传
    $(".js-sync").on("click", function(e) {
        e.stopPropagation();
        e.preventDefault();
        checkLogin.syncUserInfoInterface(function(data) {
            su.pageHeaderInfo(data);
            su.flash(data);
        });
    });
    //是否登录
    if (!method.getCookie("cuk")) {
        console.log("未登录用户~~~~");
        $(".notLogin").trigger("click", true);
    } else {
        console.log("登录用户~~~~");
        checkLogin.getLoginData(function(data) {
            su.pageHeaderInfo(data);
            su.flash(data);
        });
    }
    //支付 生成二维码
    $(document).on("click", ".btn-buy-bar", function(e) {
        e && e.preventDefault();
        //是否登录
        if (!method.getCookie("cuk")) {
            $(".notLogin").trigger("click", true);
            return;
        }
        var ptype = $(this).data("page");
        if (ptype == "vip") {
            params.type = "0";
            if ($(".js-tab ul.pay-vip-list").find("li.active").data("vid")) {
                params.vid = $(".js-tab ul.pay-vip-list").find("li.active").data("vid");
            }
            params.aid = $(".js-tab ul.pay-vip-list").find("li.active").data("actids");
            report.price = $(".js-tab ul.pay-vip-list").find("li.active").data("price");
            report.name = $(".js-tab ul.pay-vip-list").find("li.active").data("month");
            // 带优惠券id
            params.vouchersId = $(".pay-coupon-wrap").attr("vid");
            params.suvid = $(".pay-coupon-wrap").attr("svuid");
            $(".btn-vip-item-selected").attr("pcTrackContent", "payVip-" + params.vid);
            $(".btn-vip-item-selected").click();
        } else if (ptype == "privilege") {
            params.type = "1";
            if ($("ul.pay-pri-list").find("li.active").data("pid")) {
                params.pid = $("ul.pay-pri-list").find("li.active").data("pid");
            }
            params.aid = $("ul.pay-pri-list").find("li.active").data("actids");
            report.price = $("ul.pay-pri-list").find("li.active").data("price");
        } else if (ptype === "file") {
            params = {
                fid: pageConfig.params.g_fileId,
                type: 2,
                ref: utils.getPageRef(window.pageConfig.params.g_fileId),
                referrer: pageConfig.params.referrer,
                vouchersId: $(".pay-coupon-wrap").attr("vid"),
                suvid: $(".pay-coupon-wrap").attr("svuId"),
                remark: params.remark
            };
        }
        clickPay(ptype);
    });
    var clickPay = function(ptype) {
        params.isVip = window.pageConfig.params.isVip;
        if (ptype == "vip" || ptype == "privilege") {
            if (params.isVip == "2") {
                //判断vip状态
                utils.showAlertDialog("温馨提示", "你的VIP退款申请正在审核中，审核结束后，才能继续购买哦^_^");
                return;
            } else if (ptype == "privilege" && params.isVip != "1") {
                //用户非vip
                utils.showAlertDialog("温馨提示", "购买下载特权需要开通vip哦^_^");
                return;
            }
        }
        handleOrderResultInfo();
    };
    /**
     * 下单处理
     */
    function handleOrderResultInfo() {
        $.post("/pay/order?ts=" + new Date().getTime(), params, function(data, status) {
            if (data && data.code == "0") {
                console.log("下单返回的数据：" + data);
                data["remark"] = params.remark;
                openWin(data);
            } else {
                // __pc__.push(['pcTrackEvent','orderFail']);
                $(".btn-vip-order-fail").click();
                utils.showAlertDialog("温馨提示", "下单失败");
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
        fillReportData(orderNo, name, price * 100, "二维码合一", type);
        if (type == 0) {
            report.vipPayClick(window.pageConfig.gio.reportVipData);
            $(".btn-vip-order-done").click();
        } else if (type == 1) {
            report.privilegePayClick(window.pageConfig.gio.reportPrivilegeData);
        } else if (type == 2) {
            var rf = method.getCookie("rf");
            if (rf) {
                rf = JSON.parse(rf);
                rf.orderId_var = orderNo;
                report.filePayClick(rf);
            }
        }
        if (method.getParam("fid")) {
            fileId = method.getParam("fid");
        } else if (window.pageConfig.params.g_fileId) {
            fileId = window.pageConfig.params.g_fileId;
        }
        window.location.href = "/pay/payQr.html?remark=office&orderNo=" + orderNo + "&fid=" + fileId;
    }
    function fillReportData(orderNo, name, price, type, ptype) {
        var f = method.getCookie("fi");
        if (ptype == 0) {
            window.pageConfig.gio.reportVipData.orderId_var = orderNo;
            window.pageConfig.gio.reportVipData.vipName_var = name;
            window.pageConfig.gio.reportVipData.vipPayPrice_var = price;
            window.pageConfig.gio.reportVipData.orderPayType_var = type;
            method.setCookieWithExpPath("rv", JSON.stringify(window.pageConfig.gio.reportVipData), 5 * 60 * 1e3, "/");
            var customData = {
                payResult: 1,
                orderID: orderNo,
                orderPayType: "二维码合一",
                orderPayPrice: price,
                coupon: "",
                vipName: name,
                vipPrice: ""
            };
            method.setCookieWithExpPath("vr", JSON.stringify(customData), 5 * 60 * 1e3, "/");
        } else if (ptype == 1) {
            window.pageConfig.gio.reportPrivilegeData.orderId_var = orderNo;
            window.pageConfig.gio.reportPrivilegeData.privilegeName_var = name;
            window.pageConfig.gio.reportPrivilegeData.privilegePayPrice_var = price;
            window.pageConfig.gio.reportPrivilegeData.orderPayType_var = type;
            method.setCookieWithExpPath("rp", JSON.stringify(window.pageConfig.gio.reportPrivilegeData), 5 * 60 * 1e3, "/");
            var rf = method.getCookie("rf");
            if (rf && f) {
                rf = JSON.parse(rf);
                var customData = {
                    payResult: 1,
                    orderID: orderNo,
                    orderPayType: "二维码合一",
                    orderPayPrice: price,
                    coupon: f ? f.fileCouponCount : "",
                    fileID: fid,
                    fileName: f ? f.fileCouponCount : "",
                    fileCategoryName: rf.docTypeLevel1_var || rf.docTypeLevel2_var || rf.docTypeLevel3_var,
                    filePayType: rf.docPayType_var,
                    fileFormat: rf.docFormType_var,
                    fileProduceType: f ? f.fileProduceType : "",
                    fileCooType: f ? f.fileCooType : "",
                    fileUploaderID: f ? f.fileUploaderID : "",
                    privilegeName: name,
                    privilegePrice: ""
                };
                method.setCookieWithExpPath("pr", JSON.stringify(customData), 5 * 60 * 1e3, "/");
            } else if (ptype == 2) {
                var rf = method.getCookie("rf");
                if (rf && f) {
                    rf = JSON.parse(rf);
                    f = JSON.parse(f);
                    var customData = {
                        payResult: 1,
                        orderID: orderNo,
                        orderPayType: "二维码合一",
                        orderPayPrice: rf.docPayPrice_var,
                        coupon: f ? f.fileCouponCount : "",
                        fileID: rf.docId_var,
                        fileName: rf.docTitle_var,
                        fileCategoryName: rf.docTypeLevel1_var || rf.docTypeLevel2_var || rf.docTypeLevel3_var,
                        filePayType: rf.docPayType_var,
                        fileFormat: rf.docFormType_var,
                        fileProduceType: f ? f.fileProduceType : "",
                        fileCooType: f ? f.fileCooType : "",
                        fileUploaderID: f ? f.fileUploaderID : "",
                        filePrice: f ? f.filePrice : "",
                        fileSalePrice: ""
                    };
                    method.setCookieWithExpPath("fr", JSON.stringify(customData), 5 * 60 * 1e3, "/");
                }
            }
        }
    }
    //网页支付宝
    function alipayClick(oid) {
        $(".web-alipay").bind("click", function() {
            if (oid) {
                $.get("/pay/webAlipay?ts=" + new Date().getTime(), {
                    orderNo: oid
                }, function(data, status) {
                    if (status == "success") {
                        var form = data.data.form;
                        if (form) {
                            $("html").prepend(form);
                        }
                    } else {
                        utils.showAlertDialog("温馨提示", "打开网页支付宝支付异常，稍后再试");
                    }
                });
            } else {
                utils.showAlertDialog("温馨提示", "订单号不存在，稍后再试");
            }
        });
    }
    /**
     * 订单状态更新
     */
    var count = 0;
    function payStatus(orderNo) {
        $.post("/pay/orderStatus?ts=" + new Date().getTime(), {
            orderNo: orderNo
        }, function(data, status) {
            if (data && data.code == 0) {
                count++;
                var res = data.data;
                var orderStatus = res.orderStatus;
                var fid = res.fid;
                if (!fid) {
                    fid = method.getParam("fid");
                }
                if (orderStatus == 0) {
                    //待支付
                    if (count <= 30) {
                        window.setTimeout(function() {
                            payStatus(orderNo);
                        }, 4e3);
                    }
                } else if (orderStatus == 2) {
                    //成功
                    var params = "?remark=office&";
                    try {
                        if (res.goodsType == 1) {
                            //购买文件成功
                            params += "fid=" + fid + "&type=2";
                            var rf = method.getCookie("rf");
                            if (rf) {
                                rf = JSON.parse(rf);
                                rf.orderId_var = orderNo;
                                report.docPaySuccess(rf);
                                method.delCookie("rf", "/");
                            }
                        } else if (res.goodsType == 2) {
                            //购买vip成功
                            params += "fid=" + fid + "&type=0";
                            var rv = method.getCookie("rv");
                            if (rv) {
                                report.vipPaySuccess(JSON.parse(rv));
                                method.delCookie("rv", "/");
                            }
                            //透传用户信息 更新isVip字段
                            $(".js-sync").trigger("click");
                        } else if (res.goodsType == 8) {
                            //购买下载特权成功
                            params += "fid=" + fid + "&type=1";
                            var rp = method.getCookie("rp");
                            if (rp) {
                                report.privilegePaySuccess(JSON.parse(rp));
                                method.delCookie("rp", "/");
                            }
                        }
                    } catch (e) {}
                    window.location.href = "/pay/success.html" + params;
                } else if (orderStatus == 3) {
                    //失败
                    var params = "?";
                    try {
                        if (res.goodsType == 1) {
                            //购买文件成功
                            params += "fid=" + fid + "&type=2";
                        } else if (res.goodsType == 2) {
                            //购买vip成功
                            params += "fid=" + fid + "&type=0";
                        } else if (res.goodsType == 8) {
                            //购买下载特权成功
                            params += "fid=" + fid + "&type=1";
                        }
                    } catch (e) {}
                    window.location.href = "/pay/fail.html" + params;
                }
            } else {
                //error
                console.log(data);
            }
        });
    }
    $(".btn-back").click(function() {
        var referrer = document.referrer;
        if (referrer) {
            window.location.href = referrer;
        } else {
            window.location.href = "/";
        }
    });
    //生成二维码
    $(function() {
        var flag = $("#ip-flag").val();
        var uid = $("#ip-uid").val();
        var type = $("#ip-type").val();
        var isVip = $("#ip-isVip").val();
        if (flag == 3 && uid) {
            //二维码页面
            if (type == 0) {
                //vip购买
                if (method.getCookie("cuk")) {
                    $(".btn-vip-login-arrive").click();
                }
            } else if (type == 2) {
                //文件购买
                if (isVip != 1) {
                    $(".price-discount").hide();
                } else {
                    $(".price-discount").show();
                }
                if (method.getCookie("cuk")) {
                    $(".btn-file-login-arrive").click();
                }
            }
            var oid = $("#ip-oid").val();
            if (oid) {
                $(".carding-pay-item .oid").text(oid);
                var url = location.protocol + "//" + location.hostname + "/notm/qr?oid=" + oid;
                try {
                    qr.createQrCode(url, "pay-qr-code", 180, 180);
                    $(".btn-qr-show-success").click();
                } catch (e) {
                    console.log("生成二维码异常");
                    $(".btn-qr-show-fail").click();
                }
                alipayClick(oid);
                payStatus(oid);
            } else {
                utils.showAlertDialog("温馨提示", "订单失效，请重新下单");
            }
        } else if (flag == "true" && uid) {
            //成功页面
            var mobile = $("#ip-mobile").val();
            if (mobile) {
                //隐藏绑定手机号模块 公众号模块居中
                $(".carding-info-bottom").addClass("carding-binding-ok");
            }
        } else if (flag == "false" && uid) {} else if (flag == "0") {} else {
            console.log("未知异常~~~~~~~~");
        }
    });
});