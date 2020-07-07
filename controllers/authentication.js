/**
 * @Description: 认证
 */
var async = require("async");
var render = require("../common/render");
var request = require('request');
var Api = require("../api/api");
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
            geSearchBannerList:function(callback){
                callback(null,null)
            },
        } , function(err, results){
            // console.log(results)
            render("authentication/user", results, req, res);
        })
    },
    org:function (req, res) {
        return async.series({
            geSearchBannerList:function(callback){
                callback(null,null)
            },
        } , function(err, results){
            // console.log(results)
            render("authentication/org", results, req, res);
        })
    }
};