define(function (require, exports, module) {
    // var $ = require("$");
    var api = require('../application/api');
    var utils = require("../cmd-lib/util");
    var method = require("../application/method");
    var qr = require("../pay/qr");
    // var report = require("../pay/report");
    // var downLoadReport = $.extend({}, gioData);
    var gioInfo = require("../cmd-lib/gioInfo");
    var viewExposure = require('../common/bilog').viewExposure
    // downLoadReport.docPageType_var = pageConfig.page.ptype;
    // downLoadReport.fileUid_var = pageConfig.params.file_uid;
    var fileName = pageConfig.page.fileName;
    var format = pageConfig.params.file_format;
    // 资料详情数据-从全局window中获取
    var fileInfo = {
        id: pageConfig.params.g_fileId,
        title: pageConfig.params.file_title,
        productType: pageConfig.params.file_state,
        format: pageConfig.params.file_format,
        fileSourceChannel: pageConfig.params.g_fileId,
        uid: pageConfig.params.file_uid,
        classid1: pageConfig.params.classid1,
        classid2: pageConfig.params.classid2,
        classid3: pageConfig.params.classid3,
        classidName1: pageConfig.params.classidName1,
        classidName2: pageConfig.params.classidName2,
        classidName3: pageConfig.params.classidName3,
    }
    // 自有埋点注入
    var payFileResultForVisit_bilog = require("../common/bilog-module/payFileResultForVisit_bilog");
    // ==== end ====

    var unloginObj = {
        count: 0,
        isClear: false,//是否清除支付查询
        init: function () {
            this.bindClick()
        },
        bindClick: function () {
            //切换购买方式（游客购买或登陆购买）
            $('body').on('click', '.buyUnloginWrap .navItem', function () {
                $(this).addClass('active').siblings().removeClass('active');
                var _index = $(this).index();
                $('.optionsContent').hide();
                $('.optionsContent').eq(_index).show()
            })
            //勾选条款
            $('body').on('click', '.buyUnloginWrap .selectIcon', function () {
                $(this).toggleClass('selected');
                $('.qrShadow').toggle();
                $('.riskTip').toggle();
            })
            //关闭
            $('body').on('click', '.buyUnloginWrap .closeIcon', function () {
                unloginObj.closeLoginWindon()
            })
            //失败重新生产订单
            $('body').on('click', '.buyUnloginWrap .failTip', function () {
                unloginObj.createOrder();
                unloginObj.count = 0;
            })

            //弹出未登录购买弹窗
            var unloginBuyHtml = require('./template/buyUnlogin.html')
            unloginBuyHtml += '<div  class="aiwen_login_model_div" style="width:100%; height:100%; position:fixed; top:0; left:0; z-index:1999;background:#000; filter:alpha(opacity=80); -moz-opacity:0.8; -khtml-opacity: 0.8; opacity:0.8;display: block"></div>'
            $('body').on("click", ".js-buy-open", function (e) {
                unloginObj.isClear = false;
                if (!method.getCookie("cuk")) {
                    if (pageConfig.params.productType == 5 && $(this).data('type') == "file") { //pageConfig.params.g_permin == 3 && $(this).data('type') == "file"
                        // downLoadReport.expendType_var = "现金"
                        // 如果现金文档，弹出面登陆购买
                        $('body').append(unloginBuyHtml);
                        viewExposure($(this), 'noLgFPayCon')
                        var loginUrl = '';
                        var params = window.pageConfig && window.pageConfig.params ? window.pageConfig.params : null;
                        var classid1 = params && params.classid1 ? params.classid1 + '' : '';
                        var classid2 = params && params.classid2 ? '-' + params.classid2 + '' : '';
                        var classid3 = params && params.classid3 ? '-' + params.classid3 + '' : '';
                        var clsId = classid1 + classid2 + classid3;
                        var fid = params ? params.g_fileId || '' : '';
                        require.async(['//static3.iask.cn/resource/js/plugins/pc.iask.login.min.js'], function () {
                            loginUrl = $.loginPop('login', {
                                "terminal": "PC",
                                "businessSys": "ishare",
                                'domain': document.domain,
                                "popup": "hidden",
                                "clsId": clsId,
                                "fid": fid
                            });
                            var loginDom = '<iframe src="' + loginUrl + '" style="width:100%;height:480px" name="iframe_a"  frameborder="no" border="0" marginwidth="0" marginheight="0" scrolling="no" allowtransparency="yes"></iframe>';
                            $('.loginFrameWrap').html(loginDom);
                        })
                        var className = 'ico-' + pageConfig.params.file_format;
                        $('.buyUnloginWrap .ico-data').addClass(className)
                        $('.papper-title span').text(pageConfig.params.file_title)
                        $('.shouldPayWrap span').text(pageConfig.params.price);
                        unloginObj.createOrder()
                    }
                }
            })
        },
        createOrder: function () {
            var visitorId = unloginObj.getVisitorId();

            var params = {
                fid: pageConfig.params.g_fileId,
                goodsId: pageConfig.params.g_fileId,
                goodsType: 1,
                ref: utils.getPageRef(window.pageConfig.params.g_fileId),
                referrer: pageConfig.params.referrer,
                remark: 'other',
                sourceMode: 0,
                channelSource: 4,
                host: location.origin,
                channel: 'other',
                isVisitor: 1,
                visitorId: visitorId,
                isVouchers: 1,
                returnPayment: false
            }
            $.post('/pay/orderUnlogin?ts=' + new Date().getTime(), params, function (data, status) {
                if (data && data.code == '0') {
                    // 生成二维码
                    unloginObj.createdQrCode(data.data.orderNo);
                    // 订单详情赋值
                    $('.shouldPayWrap span').text(data.data.payPrice / 100);
                    //     gioPayDocReport.orderId_var = data.data.orderNo;
                    //    gioPayDocReport.buyer_uid = visitorId;
                    //    gioPayDocReport.login_flag = '游客';
                    unloginObj.payStatus(data.data.orderNo, visitorId);
                    // 重新生成隐藏遮罩
                    $('.qrShadow').hide();
                    $('.shadowTip').hide()
                } else {
                    $('.qrShadow').show();
                    $('.failTip').show()
                }
            });
        },
        createdQrCode: function (oid) {
            // var url = location.protocol+'//'+location.hostname + "/notm/qr?oid=" + oid;
            // var url = location.protocol + "/pay/payment?orderNo=" + oid
            // var url = location.origin + "/pay/qr?orderNo=" + oid;
            var url = "http://ishare.iask.sina.com.cn/pay/qr?orderNo=" + oid ;
            console.log(url)
            try {
                qr.createQrCode(url, 'payQrCode', 162, 162);
            } catch (e) {

            }
        },
        /**
         * 根据时间产生随机数
         */
        getVisitorId: function () {
            // 从cookie中获取访客id
            return method.getCookie('visitor_id');
        },
        /**
         * 查询订单
         * orderNo 订单
         * visitorId 游客唯一id
         * isClear 是否停止
         */
        payStatus: function (orderNo, visitorId) {
            var params = JSON.stringify({orderNo: orderNo});
            $.ajax({
                type: 'post',
                url: api.order.getOrderInfo,
                // url: '/pay/orderStatusUlogin?ts=' + new Date().getTime(),
                contentType: "application/json;charset=utf-8",
                data: params,
                success: function (response) {
                    if (response && response.code == 0 && response.data) {
                        unloginObj.count++;
                        var orderInfo = response.data;
                        var fid = pageConfig.params.g_fileId;
                        if (orderInfo.orderStatus == 0) {
                            // 待支付
                            if (unloginObj.count <= 30 && !unloginObj.isClear) {
                                window.setTimeout(function () {
                                    unloginObj.payStatus(orderNo, visitorId)
                                }, 3000);
                            }
                            if (unloginObj.count > 28) {
                                $('.qrShadow').show();
                                $('.failTip').show()
                            }
                        } else if (orderInfo.orderStatus == 2) {
                            // 成功
                            try {
                                //  report.docPaySuccess(gioPayDocReport);//GIO购买上报
                                //  __pc__.gioTrack("docDLSuccess", downLoadReport);//GIO下载上报
                                unloginObj.closeLoginWindon();
                                var url = '/node/f/downsucc.html?fid=' + fid + '&unloginFlag=1&name=' + fileName.slice(0, 20) + '&format=' + format + '&visitorId=' + visitorId;
                                method.compatibleIESkip(url, false);

                                // 自由埋点
                                payFileResultForVisit_bilog.reportResult(orderInfo, fileInfo, true)
                            } catch (e) {
                            }
                        } else if (orderInfo.orderStatus == 3) {
                            // 自由埋点
                            payFileResultForVisit_bilog.reportResult(orderInfo, fileInfo, false)
                        }
                    } else {
                        $.toast({
                            text: data.msg,
                        })
                        unloginObj.closeLoginWindon();
                    }
                },
                complete: function () {

                }
            })
        },
        /**
         * 关闭弹窗
         */
        closeLoginWindon: function () {
            $('.buyUnloginWrap').remove()
            $('.aiwen_login_model_div').remove();
            // 停止支付查询
            unloginObj.isClear = true;
            unloginObj.count = 0;
        }
    }
    unloginObj.init()
});