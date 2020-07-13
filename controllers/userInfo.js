/**
 * @Description: 404
 */
var async = require("async");
var render = require("../common/render");
var request = require('request');
var server = require("../models/index");
var api = require("../api/api");
var appConfig = require("../config/app-config");

var util = require('../common/util');

module.exports = {
    index: function (req, res) {
        return async.series({
            userInfo:function(callback){
                server.get(`${appConfig.apiNewBaselPath}${api.user.getUserInfo}`, callback, req);
            },
            rightsVipMemberDetail:function(callback){
                req.body = {
                    site:'4',
                    memberCode:''
                };
                server.post(`${appConfig.apiNewBaselPath}${api.coupon.getRightsVipMemberDetail}`, callback, req);
            }
        } , function(err, results){
            var userInfo = {}
            var rightsVipMemberDetail = {}
            var userInfoCode = '0'
            var rightsVipMemberDetailCode = '0'

            if(results.userInfo.code == '0'){
                userInfo = results.userInfo.data
            }else{
                userInfoCode = results.userInfo.code
            }

            if(results.rightsVipMemberDetail.code == '0'){
                rightsVipMemberDetail = results.rightsVipMemberDetail.data
            }else{
                rightsVipMemberDetailCode = results.userInfo.code
            }

            var code = userInfoCode == 0 && rightsVipMemberDetailCode == 0?'0':1
            console.log('userInfo:',JSON.stringify(userInfo),'rightsVipMemberDetail:',JSON.stringify(rightsVipMemberDetail))
            var data = Object.assign({},userInfo,rightsVipMemberDetail)
            res.json(Object.assign({},results,{data:data,code:code}))
        })
    }
};