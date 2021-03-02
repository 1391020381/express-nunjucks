/**
 * @Description: 认证
 */
const async = require('async');
const render = require('../common/render');
const server = require('../models/index');
const request = require('request');
const api = require('../api/api');
const appConfig = require('../config/app-config');
const recommendConfigInfo = require('../common/recommendConfigInfo');
const util = require('../common/util');

module.exports = {
    index: function (req, res) {
        return async.series({
            geSearchBannerList:function(callback){
                callback(null, null);
            }
        }, (err, results) => {
            // console.log(results)
            render('authentication/index', results, req, res);
        });
    },
    user:function (req, res) {
        return async.series({
            list:function(callback){
                // /gateway/user/certification/getPersonal
                // server.get(appConfig.apiNewBaselPath+api.auth.user, callback, req);
                callback(null, null);
            }
        }, (err, results) => {
            // console.log(results.auditStatus,'auditStatus')
            render('authentication/user', results, req, res);
        });
    },
    org:function (req, res) {
        return async.series({
            list:function(callback){
                // server.get(appConfig.apiNewBaselPath+api.auth.org, callback, req);
                callback(null, null);
            }
        }, (err, results) => {
            render('authentication/org', results, req, res);
        });
    }
};