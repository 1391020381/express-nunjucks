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
    index: function (req, res) {
        render("upload/index", {}, req, res);
    },
    //文件类型
    fileUpload: function (req, res) {
        console.log(req)
        return async.series({
            list: function (callback) {
                server.post('http://192.168.1.180:9004/ishare-upload/fileUpload', callback, req);
            }
        }, function (err, results) {
            console.log('上传文件接口')
            res.send(results.list).end();
        })
    },
};