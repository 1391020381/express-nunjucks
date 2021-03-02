/**
 *
 */

const async = require("async");
const server = require("../models/index");
const Api = require("../api/api");
const appConfig = require("../config/app-config");

module.exports = {
    // 获取优惠券发放列表
    couponList: function (req, res) {
        return async.series({
            list: function (callback) {
                // server.get(appConfig.apiBasePath +'/sale/vouchers', callback ,req);
                server.get(appConfig.apiNewBaselPath + Api.coupon.rightsSaleVouchers, callback, req);
                // callback(null, null);
            }
        }, (err, results) => {
            // console.log(results)
            res.send(results.list).end();
        });
    },

    personalCoupon: function (req, res) {
        return async.series({
            list: function (callback) {
                let type, price;
                // console.log('personalCoupon:',req.query.type,req.query.price)
                if (req.query) {
                    type = req.query.type;
                    price = req.query.price;
                }
                // server.get(appConfig.apiBasePath +'/sale/queryPersonal', callback ,req);
                // http://192.168.100.135:8769/gateway
                server.get(appConfig.apiNewBaselPath + Api.coupon.rightsSaleQueryPersonal, callback, req);
            }
        }, (err, results) => {
            // console.log('个人优惠券》》》》》》》》》》')
            // console.log('cuk-JSESSIONID===============' + 'cuk=' + req.cookies.cuk + ' ;JSESSIONID=' + req.cookies.JSESSIONID);
            res.send(results.list).end();
        });
    },

    bringCoupon: function () {
        return async.series({
            list: function (callback) {
                // server.post(appConfig.apiBasePath +'/sale/vouchers', callback ,req);
                server.post(appConfig.apiNewBaselPath + Api.coupon.rightsSaleVouchers, callback, req);
            }
        }, (err, results) => {
            // console.log("领取优惠券============");
            // console.log(results.list);
            res.send('1111').end();
        });
    }
};