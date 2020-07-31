/**
 * @Description: 认证
 */
var async = require("async");
var render = require("../common/render");
var server = require("../models/index");
var request = require('request');
var api = require("../api/api");
var appConfig = require("../config/app-config");
var recommendConfigInfo = require('../common/recommendConfigInfo')
var util = require('../common/util');

module.exports = {
    index: function (req, res) {
        return async.series({
            geSearchBannerList:function(callback){
                callback(null,null)
            },
        } , function(err, results){
            // console.log(results)
            render("authentication/index", results, req, res);
        })
    },
    user:function (req, res) {
        return async.series({
            list:function(callback){
                // /gateway/user/certification/getPersonal
                // server.get(appConfig.apiNewBaselPath+api.auth.user, callback, req);
                callback(null,null)
            },
        } , function(err, results){
            // console.log(results.auditStatus,'auditStatus')
            render("authentication/user", results, req, res);
        })
    },
    org:function (req, res) {
        return async.series({
            list:function(callback){
                // server.get(appConfig.apiNewBaselPath+api.auth.org, callback, req);
                callback(null,null)
            },
        } , function(err, results){
            render("authentication/org", results, req, res);
        })
    }
};