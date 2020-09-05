define("dist/feedback/buyUnlogin-debug", [ "../cmd-lib/util-debug", "../application/method-debug", "../pay/qr-debug", "../cmd-lib/qr/qrcode.min-debug", "../cmd-lib/qr/jquery.qrcode.min-debug", "../cmd-lib/gioInfo-debug", "../detail/template/buyUnlogin-debug.html" ], function(require, exports, module) {
    // var $ = require("$");
    var utils = require("../cmd-lib/util-debug");
    var method = require("../application/method-debug");
    var qr = require("../pay/qr-debug");
    // var report = require("../pay/report");
    // var report = require("../detail/report");
    // var downLoadReport = $.extend({}, gioData);
    var gioInfo = require("../cmd-lib/gioInfo-debug");
    // downLoadReport.docPageType_var = pageConfig.page.ptype;
    // downLoadReport.fileUid_var = pageConfig.params.file_uid;
    var fileName = pageConfig.page.fileName;
    var format = pageConfig.params.file_format;
    var unloginObj = {
        count: 0,
        isClear: false,
        //是否清除支付查询
        init: function() {
            this.bindClick();
        },
        bindClick: function() {
            //切换购买方式（游客购买或登陆购买）
            $("body").on("click", ".buyUnloginWrap .navItem", function() {
                $(this).addClass("active").siblings().removeClass("active");
                var _index = $(this).index();
                $(".optionsContent").hide();
                $(".optionsContent").eq(_index).show();
            });
            //勾选条款
            $("body").on("click", ".buyUnloginWrap .selectIcon", function() {
                $(this).toggleClass("selected");
                $(".qrShadow").toggle();
                $(".riskTip").toggle();
            });
            //关闭
            $("body").on("click", ".buyUnloginWrap .closeIcon", function() {
                unloginObj.closeLoginWindon();
            });
            //失败重新生产订单
            $("body").on("click", ".buyUnloginWrap .failTip", function() {
                unloginObj.createOrder();
                unloginObj.count = 0;
            });
            //弹出未登录购买弹窗
            var unloginBuyHtml = require("../detail/template/buyUnlogin-debug.html");
            unloginBuyHtml += '<div  class="aiwen_login_model_div" style="width:100%; height:100%; position:fixed; top:0; left:0; z-index:1999;background:#000; filter:alpha(opacity=80); -moz-opacity:0.8; -khtml-opacity: 0.8; opacity:0.8;display: block"></div>';
            $("body").on("click", ".js-buy-open", function(e) {
                unloginObj.isClear = false;
                if (!method.getCookie("cuk")) {
                    if (pageConfig.params.g_permin == 3 && $(this).data("type") == "file") {
                        // downLoadReport.expendType_var = "现金"
                        // 如果现金文档，弹出面登陆购买
                        $("body").append(unloginBuyHtml);
                        var loginUrl = "";
                        var params = window.pageConfig && window.pageConfig.params ? window.pageConfig.params : null;
                        var classid1 = params && params.classid1 ? params.classid1 + "" : "";
                        var classid2 = params && params.classid2 ? "-" + params.classid2 + "" : "";
                        var classid3 = params && params.classid3 ? "-" + params.classid3 + "" : "";
                        var clsId = classid1 + classid2 + classid3;
                        var fid = params ? params.g_fileId || "" : "";
                        require.async([ "//static3.iask.cn/resource/js/plugins/pc.iask.login.min-debug.js" ], function() {
                            loginUrl = $.loginPop("login", {
                                terminal: "PC",
                                businessSys: "ishare",
                                domain: document.domain,
                                popup: "hidden",
                                clsId: clsId,
                                fid: fid
                            });
                            var loginDom = '<iframe src="' + loginUrl + '" style="width:100%;height:480px" name="iframe_a"  frameborder="no" border="0" marginwidth="0" marginheight="0" scrolling="no" allowtransparency="yes"></iframe>';
                            $(".loginFrameWrap").html(loginDom);
                        });
                        var className = "ico-" + pageConfig.params.file_format;
                        $(".buyUnloginWrap .ico-data").addClass(className);
                        $(".papper-title span").text(pageConfig.params.file_title);
                        $(".shouldPayWrap span").text(pageConfig.params.price);
                        unloginObj.createOrder();
                    }
                }
            });
        },
        createOrder: function() {
            var visitorId = unloginObj.getVisitorId();
            var params = {
                fid: pageConfig.params.g_fileId,
                type: 2,
                ref: utils.getPageRef(window.pageConfig.params.g_fileId),
                referrer: pageConfig.params.referrer,
                isVisitor: 1,
                visitorId: visitorId,
                uid: visitorId
            };
            $.post("/pay/orderUnlogin?ts=" + new Date().getTime(), params, function(data, status) {
                if (data && data.code == "0") {
                    // 生成二维码
                    unloginObj.createdQrCode(data.data.orderNo);
                    // 订单详情赋值
                    $(".shouldPayWrap span").text(data.data.price);
                    // gioPayDocReport.orderId_var = data.data.orderNo;
                    // gioPayDocReport.buyer_uid = visitorId;
                    // gioPayDocReport.login_flag = '游客';
                    unloginObj.payStatus(data.data.orderNo, visitorId);
                    // 重新生成隐藏遮罩
                    $(".qrShadow").hide();
                    $(".shadowTip").hide();
                } else {
                    $(".qrShadow").show();
                    $(".failTip").show();
                }
            });
        },
        createdQrCode: function(oid) {
            var url = location.protocol + "//" + location.hostname + "/notm/qr?oid=" + oid;
            try {
                qr.createQrCode(url, "payQrCode", 162, 162);
            } catch (e) {}
        },
        /**
         * 根据时间产生随机数
         */
        getVisitorId: function() {
            return method.getCookie("visitor_id");
        },
        /**
        * 查询订单
        * orderNo 订单
        * visitorId 游客唯一id
        * isClear 是否停止
        */
        payStatus: function(orderNo, visitorId) {
            $.get("/pay/orderStatusUlogin?ts=" + new Date().getTime(), {
                orderNo: orderNo,
                userId: visitorId
            }, function(data) {
                if (data && data.code == 0) {
                    unloginObj.count++;
                    var res = data.data;
                    var orderStatus = res.orderStatus;
                    var fid = res.fid;
                    if (!fid) {
                        fid = method.getParam("fid");
                    }
                    if (orderStatus == 0) {
                        //待支付 
                        if (unloginObj.count <= 30 && !unloginObj.isClear) {
                            window.setTimeout(function() {
                                unloginObj.payStatus(orderNo, visitorId);
                            }, 3e3);
                        }
                        if (unloginObj.count > 28) {
                            $(".qrShadow").show();
                            $(".failTip").show();
                        }
                    } else if (orderStatus == 2) {
                        //成功
                        try {
                            if (res.goodsType == 1) {
                                //购买文件成功
                                // report.docPaySuccess(gioPayDocReport);//GIO购买上报
                                // __pc__.gioTrack("docDLSuccess", downLoadReport);//GIO下载上报
                                unloginObj.closeLoginWindon();
                                var url = "/node/f/downsucc.html?fid=" + fid + "&unloginFlag=1&name=" + fileName.slice(0, 20) + "&format=" + format;
                                method.compatibleIESkip(url, false);
                            }
                        } catch (e) {}
                    }
                } else {
                    //error
                    console.log(data);
                }
            });
        },
        /**
        * 关闭弹窗
        */
        closeLoginWindon: function() {
            $(".buyUnloginWrap").remove();
            $(".aiwen_login_model_div").remove();
            // 停止支付查询
            unloginObj.isClear = true;
            unloginObj.count = 0;
        }
    };
    unloginObj.init();
});