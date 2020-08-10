/**
 * @Description: 404
 */
var async = require("async");
var render = require("../common/render");
var request = require('request');
var server = require("../models/index");
var api = require("../api/api");
var appConfig = require("../config/app-config");
var moment = require('moment');
var util = require('../common/util');

module.exports = {
    index: function (req, res) {
        return async.series({
            userInfo:function(callback){
            //    console.log('req.cookies:',req.cookies)
               var opt = {
                method: 'GET',
                url: appConfig.apiNewBaselPath + api.user.getUserInfo,
                headers: {
                    'Content-Type': 'application/json',
                    'Authrization':req.cookies.cuk
                },
            };
            request(opt, function (err, res1, body) {
                if (body) {
                    var data = JSON.parse(body);
                    console.log('请求地址get-------------------:',opt.url)
                    console.log('返回code------:'+data.code,'返回msg-------:'+data.msg)
                    if (data.code == 0 && data.data) {
                        callback(null, data); 
                    } else {
                        callback(null, null);
                    }
                } else {
                    callback(null, null);
                }
            })
            },
            rightsVipMemberDetail:function(callback){
                var opt = {
                    method: 'POST',
                    url: appConfig.apiNewBaselPath + api.coupon.getRightsVipMemberDetail,
                    body:JSON.stringify({
                        site: '4',
                        memberCode:'PREVILEGE_NUM'
                      }),
                    headers: {
                        'Content-Type': 'application/json',
                        'Authrization':req.cookies.cuk
                    },
                };
                request(opt, function (err, res1, body) {
                    if (body) {
                        var data = JSON.parse(body);
                        console.log('请求地址post-------------------:',opt.url)
                        console.log('请求参数-------------------:', opt.body)
                        console.log('返回code------:'+data.code,'返回msg-------:'+data.msg)
                        if (data.code == 0 && data.data) {
                            callback(null, data); 
                        } else {
                            callback(null, null);
                        }
                    } else {
                        callback(null, null);
                    }
                })
            }
        } , function(err, results){
            // console.log('results-------------:',results)
            var userInfo = {}
            var rightsVipMemberDetail = {}
            var userInfoCode = '0'
            var rightsVipMemberDetailCode = '0'

            if(results.userInfo&&results.userInfo.code == '0'){
                userInfo = results.userInfo&&results.userInfo.data
            }else{
                userInfoCode = results.userInfo&&results.userInfo.code
            }

            if(results.rightsVipMemberDetail&&results.rightsVipMemberDetail.code == '0'){ // 在前端页面
                console.log('endDate:',results.rightsVipMemberDetail.data.endDate)
                rightsVipMemberDetail = Object.assign({},results.rightsVipMemberDetail.data,{isVip:results.rightsVipMemberDetail.data.vipStatus,expireTime: results.rightsVipMemberDetail.data.endDate?moment(results.rightsVipMemberDetail.data.endDate).format('YYYY-MM-DD'):''})
            }else{
                rightsVipMemberDetailCode = results.rightsVipMemberDetail&&results.rightsVipMemberDetail.code
            }

            var code = userInfoCode == 0 && rightsVipMemberDetailCode == 0?'0':1
            // console.log('userInfo:',JSON.stringify(userInfo),'rightsVipMemberDetail:',JSON.stringify(rightsVipMemberDetail))
            var data = Object.assign({},userInfo,rightsVipMemberDetail)
            res.json(Object.assign({},results,{data:data,code:code}))
        })
    }
};