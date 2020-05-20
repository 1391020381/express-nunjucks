/**
 *
 */

var async = require("async");
var server = require("../models/index");
var Api = require("../api/api");
var appConfig = require("../config/app-config");

module.exports = {
    //获取优惠券发放列表
    couponList: function(req , res){
        return async.series({
            list:function(callback){
                // server.get(appConfig.apiBasePath +'/sale/vouchers', callback ,req);
                server.get(appConfig.apiBasePath +Api.coupon.rightsSaleVouchers, callback ,req);
                // callback(null, null);
            }
        } , function(err, results){
            // console.log(results)
            res.send(results.list).end();
        })
    },
    personalCoupon:function(req,res) {
        return async.series({
            list:function(callback){
                var type,price;
                if(req.query){
                    type = req.query.type;
                    price = req.query.price;
                } 
                // server.get(appConfig.apiBasePath +'/sale/queryPersonal', callback ,req);
                server.get(appConfig.apiBasePath + Api.rightsSaleQueryPersonal, callback ,req);
            }
        } , function(err, results){
            console.log('个人优惠券》》》》》》》》》》')
            console.log('cuk-JSESSIONID===============' + 'cuk=' + req.cookies.cuk + ' ;JSESSIONID=' + req.cookies.JSESSIONID);
            res.send(results.list).end();
        })
    },
    bringCoupon:function(){
        return async.series({
            list:function(callback){
                // server.post(appConfig.apiBasePath +'/sale/vouchers', callback ,req);
                server.post(appConfig.apiBasePath + Api.coupon.rightsSaleVouchers, callback ,req);
            }
        } , function(err, results){
            console.log("领取优惠券============");
            // console.log(results.list);
            res.send('1111').end();
        })
    }
};