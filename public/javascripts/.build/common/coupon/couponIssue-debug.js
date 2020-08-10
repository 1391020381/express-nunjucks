/**
 * 发优惠券
 */
define("dist/common/coupon/couponIssue-debug", [ "../../cmd-lib/toast-debug", "../../application/method-debug", "../../cmd-lib/util-debug", "../../cmd-lib/loading-debug", "../../application/checkLogin-debug", "../../application/api-debug", "../../application/login-debug", "../../cmd-lib/jqueryMd5-debug", "../../application/iframe/iframe-parent-debug", "../../application/iframe/messenger-debug", "../bilog-debug", "base64-debug", "../../report/config-debug", "../../cmd-lib/myDialog-debug", "../bindphone-debug", "../baidu-statistics-debug", "./template/couponCard-debug.html" ], function(require, exports, module) {
    // var $ = require("$");
    require("../../cmd-lib/toast-debug");
    var method = require("../../application/method-debug");
    var utils = require("../../cmd-lib/util-debug");
    var fid = method.getParam("fid");
    require("../../cmd-lib/loading-debug");
    var login = require("../../application/checkLogin-debug");
    var couponOptions = require("./template/couponCard-debug.html");
    var api = require("../../application/api-debug");
    var couponObj = {
        _index: 0,
        pageType: 1,
        //1 是购买成功，2是下载成功
        type: 4,
        //0游客，1首次购买现金文档，2首次购买vip，3首次下载免费文档
        isFirstCashBuy: 2,
        isFirstVipBuy: 2,
        dowStatus: 2,
        isVip: 0,
        isFreeFile: 0,
        userId: "",
        pageUrl: "",
        initial: function() {
            var urlArr = location.pathname.split("/");
            couponObj.pageUrl = urlArr[urlArr.length - 1];
            var unloginFlag = method.getQueryString("unloginFlag");
            //免登录购买成功页 下载页
            if (couponObj.pageType == 1 || couponObj.pageType == 2) {
                if (!unloginFlag) {
                    login.getUserData(function(data) {
                        couponObj.isVip = data.isVip;
                        couponObj.isFirstCashBuy = data.isFirstCashBuy;
                        couponObj.isFirstVipBuy = data.isFirstVipBuy;
                        couponObj.dowStatus = data.dowStatus;
                        couponObj.userId = data.userId;
                        couponObj.confirmCouponType();
                        if (couponObj.type != 4 && couponObj.pageUrl != "downsucc.html") {
                            couponObj.getCouponList();
                        }
                    });
                }
            }
        },
        domChange: function() {
            if (couponObj.type == 1) {
                if (couponObj.isFirstCashBuy == 1) {
                    // 首次 现金 购买发券
                    $(".couponContainer").show();
                    $(".previousContainer").hide();
                    if (couponObj.isVip == 0) {
                        $(".bottom-privilege").removeClass("hide");
                        //出现开通vip提示
                        $(".down-succ-btn[data-type=default]").show().css("display", "block").siblings("a").hide();
                        $(".give-coupon-wrap").css("border-bottom", "none!important");
                        $(".couponContainer .carding-er-code").hide();
                    } else {
                        $(".bottom-privilege").addClass("hide");
                        //隐藏开通vip提示
                        $(".down-succ-btn[data-type=default]").show().css("display", "hide");
                        $(".couponContainer .carding-er-code").show();
                    }
                }
            }
            if (couponObj.type == 2) {
                if (couponObj.isFirstVipBuy == 1) {
                    // 首次 vip 购买发券
                    $(".couponContainer").show();
                    $(".previousContainer").hide();
                    $(".bottom-privilege").hide();
                    $(".couponContainer .carding-er-code").show();
                }
            }
            if (couponObj.type == 3) {
                //    下载成功页
                // 首次 免费文档下载
                $(".couponContainer").show();
                $(".previousContainer").hide();
                if (couponObj.isVip == 0) {
                    $(".downSucc-privi").removeClass("hide");
                } else {
                    $(".downSucc-privi").addClass("hide");
                }
                $(".carding-er-code").show();
                $(".down-succ-btn[data-type=default]").addClass("hide").hide();
                $(".give-coupon-wrap").css("border-bottom", "none!important");
            }
        },
        /**
        * 确定优惠券请求类型
       */
        confirmCouponType: function() {
            var pageType = 0;
            //1是购买成功，2是下载成功
            var buyType = Number($("#ip-type").val());
            //0是VIP购买，2是现金文档
            if (couponObj.pageUrl == "downsucc.html") {
                couponObj.getFileType(fid);
                pageType = 1;
                if (couponObj.dowStatus == 1 && couponObj.isFreeFile == 1 && localStorage.getItem("FirstDown") != 1) {
                    couponObj.type = 3;
                }
            } else if (couponObj.pageUrl == "success.html") {
                pageType = 2;
                if (buyType == 2 && couponObj.isFirstCashBuy == 1 && method.getCookie("FirstCashBuy") != couponObj.userId) {
                    couponObj.type = 1;
                } else if (buyType == 0 && couponObj.isFirstVipBuy == 1 && method.getCookie("FirstVipBuy") != couponObj.userId) {
                    couponObj.type = 2;
                }
            }
            couponObj.pageType = pageType;
        },
        /**
         * 获取优惠券列表
        */
        getCouponList: function() {
            var url = "/node/coupon/issueCoupon?type=" + couponObj.type;
            $.get(url, function(res) {
                if (res.code == 0) {
                    if (res.data) {
                        if (res.data.list.length > 0) {
                            var _html = template.compile(couponOptions)({
                                data: res.data
                            });
                            $(".give-title").text(res.data.prompt);
                            $(".give-coupon-list").html(_html);
                            couponObj.domChange();
                            couponObj.bringCouponClick();
                            $(".down-carding-main").addClass("coupon-carding-item");
                            $(".carding-vip-main").addClass("coupon-carding-item");
                            if (couponObj.type == 1) {
                                method.setCookieWithExpPath("FirstCashBuy", couponObj.userId, 30 * 24 * 60 * 60 * 1e3, "/");
                            } else if (couponObj.type == 2) {
                                method.setCookieWithExpPath("FirstVipBuy", couponObj.userId, 30 * 24 * 60 * 60 * 1e3, "/");
                            } else if (couponObj.type == 3) {
                                method.setCookieWithExpPath("FirstDown", couponObj.userId, 30 * 24 * 60 * 60 * 1e3, "/");
                            }
                        }
                    }
                }
            });
        },
        /**
          * 点击领取
         */
        bringCouponClick: function() {
            $(".btn-receive").click(function() {
                couponObj.receiveCoupon(couponObj.type, 1);
            });
        },
        /**
         * 关闭头部提示
        */
        closeTipByClick: function() {
            $(".coupon-info-top").on("click", ".btn-no-user", function() {
                $(".coupon-info-top").hide();
            });
        },
        showTips: function(type) {
            setTimeout(function() {
                if (type == 0) {
                    $(".dialog-coupon.dialog-coupon-success").show();
                } else {
                    $(".dialog-coupon.dialog-coupon-fail").show();
                }
            }, 1500);
        },
        /**
         * 领取优惠券
        */
        receiveCoupon: function(type, source) {
            var data = {
                source: source,
                type: type
            };
            data = JSON.stringify(data);
            $("body").loading({
                name: "download",
                title: "请求中"
            });
            $.ajax({
                type: "POST",
                // url: api.vouchers,
                url: api.coupon.rightsSaleVouchers,
                contentType: "application/json;charset=utf-8",
                dataType: "json",
                data: data,
                success: function(res) {
                    if (res.code == 0) {
                        if (res.data) {
                            if (res.data.list.length > 0) {
                                utils.showAlertDialog("温馨提示", "领取成功！");
                            } else {
                                utils.showAlertDialog("温馨提示", res.msg);
                            }
                        }
                    } else {
                        utils.showAlertDialog("温馨提示", res.msg);
                    }
                },
                complete: function() {
                    $("body").closeLoading("download");
                }
            });
        },
        // 确定文件类型
        getFileType: function(id) {
            var data = {
                id: id
            };
            $.get("/node/confirmType", data, function(res) {
                if (res.code == 0) {
                    if (res.fileType == "free") {
                        couponObj.isFreeFile = 1;
                        if (couponObj.dowStatus == 1 && localStorage.getItem("FirstDown") != 1) {
                            couponObj.type = 3;
                            couponObj.getCouponList();
                        }
                    }
                }
            });
        }
    };
    setTimeout(function() {
        couponObj.initial();
    }, 2e3);
});