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
                server.post(appConfig.apiSpecialPath + api.pay.getVipList, callback, req);
            }
        }, function (err, results) {
            results.type = 0;
            results.flag = 0;
            results.format = req.query.ft;
            results.title = urlencode.decode(req.query.name);
            console.log("vip list------------");
            console.log('后台返回的套餐列表:'+JSON.stringify(results));
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
                if ('office' == req.query.remark) {
                    server.get(appConfig.apiBasePath + api.office.search.category, callback, req, true);
                } else {
                    callback(null, null);
                }
            },
            list: function (callback) {
                server.get(appConfig.apiBasePath + api.pay.getPrivilege, callback, req);
            }
        }, function (err, results) {
            results.type = 1;
            results.flag = 1;
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
                console.log(appConfig.apiBasePath + api.file.fileDetail.replace(/\$id/, req.query.orderNo))
                var opt = {
                    url: appConfig.apiBasePath + api.file.fileDetail.replace(/\$id/, req.query.orderNo),
                    headers: {
                        'Content-Type': 'application/json',
                        'Cookie': 'cuk=' + req.cookies.cuk + ' ;JSESSIONID=' + req.cookies.JSESSIONID,
                    },
                };
                request(opt, function (err, res, body) {
                    if (body) {
                        try {
                            var data = JSON.parse(body);
                            if (data.code == 0) {
                                var backData = {};
                                backData.fileId = req.query.orderNo;
                                backData.referrer = req.query.referrer;
                                backData.moneyPrice = data.data.moneyPrice;
                                backData.discountPrice = data.data.discountPrice || "";
                                backData.vipDiscountFlag = data.data.vipDiscountFlag || "";
                                backData.ownVipDiscountFlag = data.data.ownVipDiscountFlag || "";
                                backData.payType = data.data.payType || "";
                                backData.format = data.data.format || "";
                                backData.title = data.data.title || "";
                                backData.fileSize = data.data.fileSize || "";
                                backData.g_permin = data.data.perMin || "";
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
            }
        }, function (err, results) {
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
                req.body = req.query;
                // callback(null,{});
                server.get(appConfig.apiBasePath + api.pay.qr.replace(/\$orderNo/, req.query.orderNo), callback, req);
            }
        }, function (err, results) {
            console.log(results);
            results.type = results.list.data.type;
            results.flag = 3;
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
                console.log("响应二维码start==============");
                console.log(req.query);
                req.body = req.query;
                console.log(req.body);
                server.get(appConfig.apiBasePath + api.pay.handle, callback, req);
            }
        }, function (err, results) {
            console.log("响应二维码end==============");
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
                var opt = {
                    url: appConfig.apiBasePath + api.pay.orderPoint.replace(/\$orderNo/, req.query.orderNo),
                    headers: {
                        'Content-Type': 'application/json',
                        'Cookie': 'cuk=' + req.cookies.cuk + ' ;JSESSIONID=' + req.cookies.JSESSIONID,
                    },
                };
                request(opt, function (err, res, body) {
                    if (body) {
                        try {
                            var data = JSON.parse(body);
                            if (data.code == 0) {
                                var backData = {
                                    fileId: req.query.fid,
                                    format: data.data.format || "",
                                    title: data.data.title || "",
                                    state: data.data.state || "",
                                };
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
            // 全部分类
            category: function (callback) {
                if ('office' == req.query.remark) {
                    server.get(appConfig.apiBasePath + api.office.search.category, callback, req, true);
                } else {
                    callback(null, null);
                }
            },
            list: function (callback) {
                console.log(req.url);
                console.log(req.query);
                callback(null, req.query);
            }
        }, function (err, results) {
            results.flag = 'true';
            results.type = results.list.type;
            console.log(results);
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
                console.log(req.url);
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
            console.log("下单操作=================");
            console.log(results);
            res.send(results.list).end();
        })
    },
    //免登陆下单
    orderUnlogin: function (req, res) {
        return async.series({
            list: function (callback) {
                server.post(appConfig.apiSpecialPath + api.pay.orderUnlogin, callback, req);
            }
        }, function (err, results) {
            console.log("免登陆下单操作=================");
            console.log(appConfig.apiBasePath + api.pay.orderUnlogin);
            res.send(results.list).end();
        })
    },
    //免登订单查询
    orderStatusUlogin: function (req, res) {
        return async.series({
            list: function (callback) {
                server.post(appConfig.apiSpecialPath + api.pay.orderStatusUlogin, callback, req);
            }
        }, function (err, results) {
            console.log(appConfig.apiSpecialPath + api.pay.orderStatusUlogin);
            console.log("下单操作=================");
            console.log(results);
            res.send(results.list).end();
        })
    },
    //免登下载接口
    visitorDownload: function (req, res) {
        console.log(req.body)
        return async.series({
            list: function (callback) {
                server.post(appConfig.apiBasePath + api.pay.visitorDownload, callback, req);
            }
        }, function (err, results) {
            console.log(appConfig.apiBasePath + api.pay.visitorDownload)
            console.log("免登陆下载操作=================");
            console.log(results);
            res.send(results.list).end();
        })
    },
    //文档下单 兼容老系统
    orderFile: function (req, res) {
        return async.series({
            list: function (callback) {
                req.body.type = 2;//兼容老系统
                console.log(req.body);
                server.post(appConfig.apiBasePath + api.pay.order, callback, req);
            }
        }, function (err, results) {
            console.log("老系统文件下单操作=================");
            var data = results.list;
            if (data && data.code == '0' && data.data.orderNo) {
                data.code = 'Y';//兼容操作
            } else {
                data.code = 'N';//兼容操作
            }
            console.log(results.list);
            res.send(results.list).end();
        })
    },
    //查询订单状态
    orderStatus: function (req, res) {
        return async.series({
            list: function (callback) {
                server.post(appConfig.apiBasePath + api.pay.status.replace(/\$orderNo/, req.body.orderNo), callback, req);
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
            console.log(results.list);
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
                server.get(appConfig.apiSpecialPath + api.pay.bindUnlogin, callback, req);
            }
        }, function (err, results) {
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
                        'Content-Type': 'application/json',
                        'Cookie': 'cuk=' + req.cookies.cuk + ' ;JSESSIONID=' + req.cookies.JSESSIONID,
                    },
                };
                request(opt, function (err, res, body) {
                    if (body) {
                        try {
                            var data = JSON.parse(body);
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

    }
};