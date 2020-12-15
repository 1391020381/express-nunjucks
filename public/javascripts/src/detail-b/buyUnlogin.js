// const { order } = require('../application/api');

define(function (require, exports, module) {

    var api = require('../application/api');
    var utils = require("../cmd-lib/util");
    var method = require("../application/method");
    var qr = require("../pay/qr");
    var login = require("../application/checkLogin");
    var urlConfig = require('../application/urlConfig')
    var goPage = require('./index').goPage
    
    
    var common = require('./common');
    
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
   

    var showTouristPurchaseDialog = require('../application/login').showTouristPurchaseDialog
    var  getIds = require('../application/checkLogin').getIds
    var unloginObj = {
        count: 0,
        orderNo: '',
        isClear: false,//是否清除支付查询
        init: function () {
            this.bindClick();
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
            $('body').on('click', '.tourist-purchase-qrContent .tourist-purchase-refresh', function () {
                unloginObj.createOrder();
                unloginObj.count = 0;
            })
            // 查询已支付按钮回调
            $('body').on('click', '.tourist-purchase-qrContent .tourist-purchase-btn', function () {
                var visitorId = unloginObj.getVisitorId();
                var orderNo = unloginObj.orderNo;
                unloginObj.freshOrder(orderNo, visitorId);
            });

            //弹出未登录购买弹窗
            var unloginBuyHtml = require('./template/buyUnlogin.html')
            unloginBuyHtml += '<div  class="aiwen_login_model_div" style="width:100%; height:100%; position:fixed; top:0; left:0; z-index:1999;background:#000; filter:alpha(opacity=80); -moz-opacity:0.8; -khtml-opacity: 0.8; opacity:0.8;display: block"></div>'
            $('body').on("click", ".js-buy-open", function (e) {
                 
                var page = window.pageConfig.page
                var params = window.pageConfig.params 
              iask_web.track_event('SE003', "fileDetailDownClick", 'click', {
                  fileID:params.g_fileId,
                  fileName:page.fileName,
                  salePrice:params.productPrice,
                  saleType:params.productType,
                  fileCategoryID: params.classid1 + '||' + params.classid2 + '||' + params.classid3,
                  fileCategoryName: params.classidName1 + '||' + params.classidName2 + '||' + params.classidName3
              });
                unloginObj.isClear = false;
                if (!method.getCookie("cuk")) {
                    if (pageConfig.params.productType == 5 && $(this).data('type') == "file") { //pageConfig.params.g_permin == 3 && $(this).data('type') == "file"
                        var clsId = getIds().clsId;
                        var fid  = getIds().fid;
                        showTouristPurchaseDialog({clsId: clsId, fid: fid}, function(){ // 游客登录后刷新头部和其他数据
                            
                            login.getLoginData(function (data) {
                                common.afterLogin(data,{type:'file',data:data,callback:goPage});
                            });
                        })
                        var className = 'ico-' + pageConfig.params.file_format;
                        $('.tourist-purchase-content .ico-data').addClass(className)
                        $('.tourist-purchase-content .file-desc').text(pageConfig.params.file_title)
                        $('.tourist-purchase-content .file-price-summary .price').text(pageConfig.params.productPrice);
                        unloginObj.createOrder() // 生成订单
                    } 
                }
            })
        },
        // 刷新订单
        freshOrder: function(orderNo, visitorId) {
            var params = JSON.stringify({orderNo: orderNo});
            $.ajax({
                type: 'post',
                url: api.order.getOrderInfo,
                headers:{
                    'Authrization': method.getCookie('cuk')
                },
                contentType: "application/json;charset=utf-8",
                data: params,
                success: function (response) {
                    if (response && response.code == 0 && response.data) {
                        var orderInfo = response.data;
                        var fid = pageConfig.params.g_fileId;
                        if (orderInfo.orderStatus == 2) {  // 支付成功
                            try {
                                unloginObj.closeLoginWindon();
                                var url = '/node/f/downsucc.html?fid=' + fid + '&unloginFlag=1&name=' + fileName.slice(0, 20) 
                                  + '&format=' + format + '&visitorId=' + visitorId;
                                method.compatibleIESkip(url, false);
                              
                            } catch (e) {

                            }
                        } else {
                            $.toast({
                                text: '订单未支付，请重新支付',
                            });
                            // unloginObj.count = 0;
                            // unloginObj.createOrder() // 生成订单
                        }
                    } else {
                        $.toast({
                            text: response.message,
                        })
                        unloginObj.closeLoginWindon();
                    }
                },
                complete: function () {

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
            console.log(JSON.stringify(params))
            // node 接口
            $.post('/pay/orderUnlogin?ts=' + new Date().getTime(), params, function (data, status) {
                if (data && data.code == '0') {
                    // 生成二维码
                    unloginObj.createdQrCode(data.data.orderNo);
                    
                    // 订单详情赋值
                    $('.shouldPayWrap span').text(data.data.payPrice / 100);
                   
                    unloginObj.payStatus(data.data.orderNo, visitorId);
                    // 重新生成隐藏遮罩
                  
                    $('.tourist-purchase-content .tourist-purchase-qrContent .tourist-purchase-invalidtip').hide()
                    $('.tourist-purchase-content .tourist-purchase-qrContent .tourist-purchase-qr-invalidtip').hide()
                    $('.tourist-purchase-content .tourist-purchase-qrContent .tourist-purchase-btn').hide()
                    $('.tourist-purchase-content .tourist-purchase-qrContent .tourist-purchase-refresh').hide()
                    
                } else {
                    var url = location.href
                    var message  = JSON.stringify(params) + JSON.stringify(data)
                    unloginObj.reportOrderError(url,message)
                    $('.tourist-purchase-content .tourist-purchase-qrContent .tourist-purchase-invalidtip').show()
                    $('.tourist-purchase-content .tourist-purchase-qrContent .tourist-purchase-qr-invalidtip').show()
                    $('.tourist-purchase-content .tourist-purchase-qrContent .tourist-purchase-btn').show()
                    $('.tourist-purchase-content .tourist-purchase-qrContent .tourist-purchase-refresh').show()
                    
                }
            });
        },
        createdQrCode: function (oid) {
            unloginObj.orderNo = oid || '';
            var url = urlConfig.payUrl + '/pay/qr?orderNo=' + oid
            try {
                qr.createQrCode(url,'touristPayQrCode', 178, 178);
            } catch (e) {
                console.log('createdQrCode:',e)
            }
        },
        /**
         * 根据时间产生随机数
         */
        getVisitorId: function () {
            var name = 'visitor_id'
            var expires = 30 * 24 * 60 * 60 * 1000
            var visitId = (Math.floor(Math.random() * 100000) + new Date().getTime() + '000000000000000000').substring(0, 18)
            if(method.getCookie('visitor_id')){
                return method.getCookie('visitor_id')
            }else{
                method.setCookieWithExp(name, visitId, expires, '/')
                return method.getCookie('visitor_id')
            }
        },
        /**
         * 查询订单
         * orderNo 订单
         * visitorId 游客唯一id
         * isClear 是否停止
         */
        payStatus: function (orderNo, visitorId) {
        //    orderNo = 45432441372672
            var params = JSON.stringify({orderNo: orderNo});
            $.ajax({
                type: 'post',
                url: api.order.getOrderInfo,
                headers:{
                    'Authrization':method.getCookie('cuk')
                },
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
                               
                                $('.tourist-purchase-content .tourist-purchase-qrContent .tourist-purchase-invalidtip').show()
                                $('.tourist-purchase-content .tourist-purchase-qrContent .tourist-purchase-qr-invalidtip').show()
                                $('.tourist-purchase-content .tourist-purchase-qrContent .tourist-purchase-btn').show();
                                $('.tourist-purchase-content .tourist-purchase-qrContent .tourist-purchase-refresh').show()
                            }
                        } else if (orderInfo.orderStatus == 2) {
                            // 成功
                            try {
                               
                                unloginObj.closeLoginWindon();
                                var url = '/node/f/downsucc.html?fid=' + fid + '&unloginFlag=1&name=' + fileName.slice(0, 20) + '&format=' + format + '&visitorId=' + visitorId;
                                method.compatibleIESkip(url, false);

                               
                            } catch (e) {
                            }
                        } else if (orderInfo.orderStatus == 3) {
                            
                        }
                    } else {
                        $.toast({
                            text: response.message,
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
        },
        reportOrderError:function (url,message) {
            $.ajax({
                type: 'post',
                url: api.order.reportOrderError,
                headers:{
                    'Authrization': method.getCookie('cuk')
                },
                contentType: "application/json;charset=utf-8",
                data: JSON.stringify({
                    url:url,
                    message:message,
                    userId:unloginObj.getVisitorId()
                }),
                success: function (response) {
                   console.log('reportOrderError:',response)
                },
                complete: function () {

                }
            }) 
            
            Sentry.captureException(JSON.stringify({
                url:url,
                message:message
            }),{
              tags: {
                title: "生成游客订单错误",
              }
            }) 
        }
    }
    unloginObj.init()
});