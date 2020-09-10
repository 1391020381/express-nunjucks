/**
 * @Description: 支付页
 */
var async = require("async");
var render = require("../common/render");
var server = require("../models/index");
var request = require('request');
var api = require("../api/api");
var appConfig = require("../config/app-config");
var urlencode = require('urlencode');
module.exports = {
    //获取vip套餐列表
    vip: function (req, res) {
        return async.series({
            // 全部分类
            category: function (callback) {
                if ('office' == req.query.remark) {
                    server.get(appConfig.apiBasePath + api.office.search.category, callback, req, true);
                } else {
                    callback(null, null);
                }
            },
            list: function (callback) {
                req.body = {
                    size: 4,
                    platform: 0,
                    scope: 4
                };
                server.post(appConfig.apiNewBaselPath + api.pay.getVipList, callback, req);
            }
        }, function (err, results) {
            results.type = 0;
            results.flag = 0;
            results.format = req.query.ft;
            results.title = urlencode.decode(req.query.name);
            
            results.fileDetails = {
                checkStatus : req.query.checkStatus  // pay.js中不同支付状态判断都通过 获取下载url接口为准
            }  
            // 排序每个套餐的权益
            if(results.list.data.length){
                var tempListData = []
                results.list.data.forEach(item=>{
                    var tempMembers = []
                    item.members.forEach(member=>{
                        if(member.code == 'privilegeNum'){
                            tempMembers[0] = member
                        }
                        if(member.code =='payDiscount'){
                            tempMembers[1] = member
                        }
                        if(member.code == 'freeDownloadNum'){
                            tempMembers[3] = member
                        }
                    })
                    tempListData.push(Object.assign({},item,{members:tempMembers}))
                })
                results.list.data = tempListData
            }
            // console.log("vip list------------");
            // console.log('后台返回的套餐列表:'+JSON.stringify(results));
            // req.query.remark = 'office'
            if ('office' == req.query.remark) {
                render("office/pay/index", results, req, res);
            } else {
                render("pay/index", results, req, res);
            }

        })
    },
    //获取下载特权列表
    privilege: function (req, res) {
        return async.series({
            // 全部分类
            category: function (callback) {
                // if ('office' == req.query.remark) {
                //     server.get(appConfig.apiBasePath + api.office.search.category, callback, req, true);
                // } else {
                //     callback(null, null);
                // }
                callback(null, null);
            },
            list: function (callback) {
              //  server.get(appConfig.apiBasePath + api.pay.getPrivilege, callback, req);
                var opt = {
                    method: 'POST',
                    url: appConfig.apiNewBaselPath + api.pay.getPrivilege,
                    body:JSON.stringify({
                        platform:0,
                        scope:4
                      }),
                    headers: {
                        'Content-Type': 'application/json',
                        'Authrization':req.cookies.cuk
                    },
                };
                request(opt, function (err, res, body) {
                    if (body) {
                        try {
                            var data = JSON.parse(body);
                            console.log('请求地址post-------------------:',opt.url)
                            console.log('请求参数-------------------:',opt.body)
                            console.log('返回code------:'+data.code,'返回msg-------:'+data.msg)
                            if (data.code == 0) {
                                
                                callback(null, data);
                            } else {
                                callback(null, null);
                            }
                        } catch (err) {
                            callback(null, null);
                        }
                    } else {
                        callback(null, null);
                    }
                })
            }
        }, function (err, results) {
            results.type = 1;
            results.flag = 1;
            results.fileDetails = {
                checkStatus : req.query.checkStatus  // pay.js中不同支付状态判断都通过 获取下载url接口为准
            }  
            // render("pay/index", results, req, res);
            if ('office' == req.query.remark) {
                render("office/pay/index", results, req, res);
            } else {
                render("pay/index", results, req, res);
            }
        })
    },
    //支付确认
    payConfirm: function (req, res) {
        return async.series({
            fileDetails: function (callback) {
                 var opt = {
                     method: 'POST',
                     url: appConfig.apiNewBaselPath + api.file.fileDetail,
                     body:JSON.stringify({
                         clientType: 0,
                         fid: req.query.orderNo,  
                         sourceType: 1
                       }),
                     headers: {
                         'Content-Type': 'application/json'
                     },
                 };
                //  console.log('opt:',opt)
                 request(opt, function (err, res1, body) {
                    if (body) {
                        try {
                            var data = JSON.parse(body);
                            console.log('请求地址post-------------------:',opt.url)
                            console.log('请求参数-------------------:',opt.body)
                            console.log('返回code------:'+data.code,'返回msg-------:'+data.msg)
                            if (data.code == 0) {
                                var backData = {};
                                backData.checkStatus = req.query.checkStatus[0]
                                backData.fileId = req.query.orderNo;
                                backData.referrer = req.query.referrer;
                                backData.moneyPrice = data.data.fileInfo.productPrice; //productPrice
                                backData.discountPrice = data.data.fileInfo.discountPrice || "";  // 新接口无折扣价格
                                backData.vipDiscountFlag = data.data.fileInfo.vipDiscountFlag || "";
                                backData.ownVipDiscountFlag = data.data.fileInfo.ownVipDiscountFlag || "";
                                backData.payType = data.data.fileInfo.payType || "";
                                backData.format = data.data.fileInfo.format || "";
                                backData.title = data.data.fileInfo.title || "";
                                backData.fileSize = data.data.fileInfo.fileSize || "";
                                backData.g_permin = data.data.fileInfo.permin || "";
                                callback(null, backData);
                            } else {
                                callback(null, null);
                            }
                        } catch (err) {
                            callback(null, null);
                        }
                    } else {
                        callback(null, null);
                    }
                     
                 })
             },
        }, function (err, results) {  // results 是fileDetails组装后的数据
            results.flag = 4;
            render("pay/index", results, req, res);
        })
    },
    //生成二维码
    payQr: function (req, res) {
        return async.series({
            // 全部分类
            category: function (callback) {
                if ('office' == req.query.remark) {
                    server.get(appConfig.apiBasePath + api.office.search.category, callback, req, true);
                } else {
                    callback(null, null);
                }
            },
            list: function (callback) {
                // req.body = req.query;
                // callback(null,{});
                // server.get(appConfig.apiBasePath + api.pay.qr.replace(/\$orderNo/, req.query.orderNo), callback, req);
                var opt = {
                    method: 'POST',
                    url: appConfig.apiNewBaselPath + api.pay.status,
                    body:JSON.stringify({
                        orderNo:req.query.orderNo
                      }),
                    headers: {
                        'Content-Type': 'application/json'
                    },
                };
                request(opt, function (err, res1, body) {
                    var data = JSON.parse(body);
                    if (body) {
                        if (data.code == 0 ) {
                            req.query.fid = data.data.goodsId
                            req.query.goodsType = data.data.goodsType
                            callback(null, data); 
                        } else {
                            callback(null, null);
                        }
                    } else {
                        callback(null, null);
                    }
                })
            },
            fileDetail: function (callback) {
                if(req.query.goodsType == '1'){
                    var opt = {
                        method: 'POST',
                        url: appConfig.apiNewBaselPath + api.file.getFileDetailNoTdk,
                        body:JSON.stringify({
                            clientType: 0,
                            fid: req.query.fid,  
                            sourceType: 0
                          }),
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    };
                    request(opt,function(err,res1,body){
                        if(body){
                            var data = JSON.parse(body);
                            console.log('请求地址post-------------------:',opt.url)
                            console.log('请求参数-------------------:',opt.body)
                            console.log('返回code------:'+data.code,'返回msg-------:'+data.msg)
                            if (data.code == 0 ){
                                callback(null, data);
                            }else{
                                callback(null,null)
                            }
                        }else{
                          callback(null,null)
                        }
                    })
                }else{
                    callback(null,{})
                }
            }
        }, function (err, results) {
            // console.log(results);
            if(results.list.code != 0){
                results.list.data = {}
            }
            // results.type = results.list.data.type;
            results.flag = 3;
            results.list.data.payPrice = results.list.data.payPrice?(results.list.data.payPrice/100).toFixed(2):''
            results.list.data.originalPrice = results.list.data.originalPrice?(results.list.data.originalPrice/100).toFixed(2):''
            results.list.data.discountPrice  = results.list.data.originalPrice - results.list.data.payPrice >= 0? true :false
            results.list.data.format = results.fileDetail.data&&results.fileDetail.data.fileInfo.format
            results.list.data.fileSize = results.fileDetail.data&&results.fileDetail.data.fileInfo.fileSize
            // render("pay/index", results, req, res);
            if ('office' == req.query.remark) {
                render("office/pay/index", results, req, res);
            } else {
                render("pay/index", results, req, res);
            }
        })
    },
    //响应二维码扫描
    scanQr: function (req, res) {
        return async.series({
            list: function (callback) {
                // console.log("响应二维码start==============");
                // console.log(req.query);
                req.body = req.query;
                // console.log(req.body);
                server.get(appConfig.apiBasePath + api.pay.handle, callback, req);
            }
        }, function (err, results) {
            // console.log("响应二维码end==============");
            // render("pay/cashbar", results, req, res);
            if ('office' == req.query.remark) {
                render("office/pay/cashbar", results, req, res);
            } else {
                render("pay/cashbar", results, req, res);
            }
        })
    },

    //购买成功页面
    success: function (req, res) {
        return async.series({
            fileDetails: function (callback) {
                // var opt = {
                //     url: appConfig.apiBasePath + api.pay.orderPoint.replace(/\$orderNo/, req.query.orderNo),
                //     headers: {
                //         'Content-Type': 'application/json',
                //         'Authrization':req.cookies.cuk
                //     },
                // };
                // request(opt, function (err, res, body) {
                //     if (body) {
                //         try {
                //             var data = JSON.parse(body);
                //             console.log('请求地址post-------------------:',opt.url)
                //             console.log('请求参数-------------------:',opt.body)
                //             console.log('返回code------:'+data.code,'返回msg-------:'+data.msg)
                //             if (data.code == 0) {
                //                 var backData = {
                //                     fileId: req.query.fid,
                //                     format: data.data.format || "",
                //                     title: data.data.title || "",
                //                     state: data.data.state || "",
                //                 };
                //                 callback(null, backData);
                //             } else {
                //                 callback(null, null);
                //             }
                //         } catch (err) {
                //             callback(null, null);
                //         }
                //     } else {
                //         callback(null, null);
                //     }
                // })
              var   backData = {
                fileId: req.query.fid,
                format: req.query.format || "",
                title:req.query.title ?decodeURIComponent(req.query.title):'',
                state:  "",
              } 
              callback(null, backData);
            },
            // 全部分类
            category: function (callback) {
                if ('office' == req.query.remark) {
                    server.get(appConfig.apiBasePath + api.office.search.category, callback, req, true);
                } else {
                    callback(null, null);
                }
            },
            list: function (callback) {  // 从query上获取参数
                // console.log(req.url);
                // console.log(req.query);
                callback(null, req.query);
            }
        }, function (err, results) {    // type=2 购买文件成功  type=0  购买vip成功  type=1   购买下载特权成功
            results.flag = 'true';
            results.type = results.list.type;
            // console.log(results);
            if ('office' == req.query.remark) {
                render("office/pay/index", results, req, res);
            } else {
                render("pay/index", results, req, res);
            }

        })
    },

    //购买失败页面
    fail: function (req, res) {
        return async.series({
            // 全部分类
            category: function (callback) {
                if ('office' == req.query.remark) {
                    server.get(appConfig.apiBasePath + api.office.search.category, callback, req, true);
                } else {
                    callback(null, null);
                }
            },
            list: function (callback) {
                // console.log(req.url);
                callback(null, req.query);
            }
        }, function (err, results) {
            results.flag = 'false';
            results.type = results.list.type;
            if ('office' == req.query.remark) {
                render("office/pay/index", results, req, res);
            } else {
                render("pay/index", results, req, res);
            }
        })
    },

    //下单
    order: function (req, res) {
        return async.series({
            list: function (callback) {
                server.post(appConfig.apiBasePath + api.pay.order, callback, req);
            }
        }, function (err, results) {
            // console.log("下单操作=================");
            // console.log(results);
            res.send(results.list).end();
        })
    },
    //免登陆下单
    orderUnlogin: function (req, res) {
        return async.series({
            list: function (callback) {
                server.post(appConfig.apiNewBaselPath + api.pay.orderUnlogin, callback, req);
            }
        }, function (err, results) {
            // console.log("免登陆下单操作=================");
            // console.log(appConfig.apiBasePath + api.pay.orderUnlogin);
            res.send(results.list).end();
        })
    },
    //免登订单查询
    orderStatusUlogin: function (req, res) {
        return async.series({
            list: function (callback) {
                server.post(appConfig.apiNewBaselPath + api.pay.orderStatusUlogin, callback, req);
            }
        }, function (err, results) {
            // console.log(appConfig.apiNewBaselPath + api.pay.orderStatusUlogin);
            // console.log("下单操作=================");
            // console.log(results);
            res.send(results.list).end();
        })
    },
    //免登下载接口
    visitorDownload: function (req, res) {
        // console.log(req.body)
        return async.series({
            list: function (callback) {
                server.post(appConfig.apiBasePath + api.pay.visitorDownload, callback, req);
            }
        }, function (err, results) {
            // console.log(appConfig.apiBasePath + api.pay.visitorDownload)
            // console.log("免登陆下载操作=================");
            // console.log(results);
            res.send(results.list).end();
        })
    },
    //文档下单 兼容老系统
    orderFile: function (req, res) {
        return async.series({
            list: function (callback) {
                req.body.type = 2;//兼容老系统
                // console.log(req.body);
                server.post(appConfig.apiBasePath + api.pay.order, callback, req);
            }
        }, function (err, results) {
            // console.log("老系统文件下单操作=================");
            var data = results.list;
            if (data && data.code == '0' && data.data.orderNo) {
                data.code = 'Y';//兼容操作
            } else {
                data.code = 'N';//兼容操作
            }
            // console.log(results.list);
            res.send(results.list).end();
        })
    },
    //查询订单状态
    orderStatus: function (req, res) {
        return async.series({
            list: function (callback) {
                // server.post(appConfig.apiNewBaselPath + api.pay.status.replace(/\$orderNo/, req.body.orderNo), callback, req);
                var opt = {
                    method: 'POST',
                    url: appConfig.apiNewBaselPath + api.pay.status,
                    body:JSON.stringify({
                        orderNo:req.body.orderNo
                      }),
                    headers: {
                        'Content-Type': 'application/json'
                    },
                };
                request(opt, function (err, res1, body) {
                    var data = JSON.parse(body);
                    if (body) {
                        if (data.code == 0 ) {
                            callback(null, data); 
                        } else {
                            callback(null, null);
                        }
                    } else {
                        callback(null, null);
                    }
                })
            }
        }, function (err, results) {
            console.log("订单状态============");
            console.log(results.list);
            res.send(results.list).end();
        })
    },
    //网页支付宝支付
    webAlipay: function (req, res) {
        return async.series({
            list: function (callback) {
                server.get(appConfig.apiBasePath + api.pay.webAlipay, callback, req);
            }
        }, function (err, results) {
            // console.log(results.list);
            res.send(results.list).end();
        })
    },
    //发送验证码
    sms: function (req, res) {
        return async.series({
            list: function (callback) {
                server.post(appConfig.apiBasePath + api.pay.sms, callback, req);
            }
        }, function (err, results) {
            res.send(results.list).end();
        })
    },
    //绑定手机号
    bind: function (req, res) {
        return async.series({
            list: function (callback) {
                server.post(appConfig.apiBasePath + api.pay.bind, callback, req);
            }
        }, function (err, results) {
            res.send(results.list).end();
        })
    },
    //扫码绑定手机号
    bindUnlogin: function (req, res) {
        return async.series({
            list: function (callback) {
                // console.log('绑定**********************************')
                // console.log(appConfig.apiBasePath + api.pay.bindUnlogin)
                server.get(appConfig.apiBasePath + api.pay.bindUnlogin, callback, req);
            }
        }, function (err, results) {
            // console.log('绑定结果**********************************')
            // console.log(results)
            res.send(results.list).end();
        })
    },
    //文件类型
    getFileType: function (req, res) {
        return async.series({
            list: function (callback) {
                var opt = {
                    url: appConfig.apiBasePath + api.file.fileDetail.replace(/\$id/, req.query.id),
                    headers: {
                        'Content-Type': 'application/json'
                    },
                };
                request(opt, function (err, res, body) {
                    if (body) {
                        try {
                            var data = JSON.parse(body);
                            console.log('请求地址get-------------------:',opt.url)
                            console.log('返回code------:'+data.code,'返回msg-------:'+data.msg)
                            if (data.code == 0) {
                                callback(null, {fileType: data.data.payType, code: 0});
                            } else {
                                callback(null, null);
                            }
                        } catch (err) {
                            callback(null, null);
                            console.log("err=============", err)
                        }
                    } else {
                        callback(null, null);
                    }
                })
            }
        }, function (err, results) {
            res.send(results.list).end();
        })

    },
    // 聚合支付二维码
    payment:function(req,res){  
        return async.series({
            getPayment: function (callback) {
                callback(null, null);
             },
        }, function (err, results) {  // results 是fileDetails组装后的数据 
            var source =  req.useragent.source
            // console.log('useragent:',JSON.stringify(req.useragent))
            var isWeChat = source.indexOf("MicroMessenger") !== -1
            var isAliPay = source.indexOf("AlipayClient") !== -1
            var isOther = !isWeChat && !isAliPay
            // var isOther = false 
            results.isWeChat = isWeChat
            results.isAliPay = isAliPay
            if(isOther){
                res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'});//设置response编码
                res.end('请使用微信或者支付扫码支付!')
            }else{
                render("pay/payment", results, req, res);
            }
        })
    },
      // 聚合支付结果页
      paymentresult:function(req,res){  
        return async.series({
            getPaymentResult: function (callback) {
                callback(null, null);
            },
        }, function (err, results) {  // results 是fileDetails组装后的数据 
            render("pay/paymentresult", results, req, res); 
        })
    }
};