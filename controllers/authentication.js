/**
 * @Description: 认证
 */
const async = require('async');
const render = require('../common/render');


module.exports = {
    index: function (req, res) {
        return async.series({
            geSearchBannerList: function (callback) {
                callback(null, null);
            }
        }, (err, results) => {
            // console.log(results)
            render('authentication/index', results, req, res);
        });
    },
    user: function (req, res) {
        return async.series({
            list: function (callback) {
                callback(null, null);
            }
        }, (err, results) => {
            render('authentication/user', results, req, res);
        });
    },
    org: function (req, res) {
        return async.series({
            list: function (callback) {
                callback(null, null);
            }
        }, (err, results) => {
            render('authentication/org', results, req, res);
        });
    }
};
