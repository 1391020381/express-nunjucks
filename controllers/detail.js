/**
 * @Description: 详情页
 */
var async = require("async");
var render = require("../common/render");
var Api = require("../api/api");
var request = require('request');
var appConfig = require("../config/app-config");
var fid = null;


var title = null;


var format = '';
var classid1 = '';

var perMin = '';

var userID = Math.random().toString().slice(-15); //标注用户的ID，

var sceneIDGuess = ''; //场景的ID

var recommendInfoData_guess = {}; //个性化数据(猜你喜欢)

var requestID_guess = ''; //  个性化数据(猜你喜欢) requestID

module.exports = {
    success: function(req, res) {
        var _index = {
            list: function(callback) {
                var opt = {

                    method: 'POST',
                    url: appConfig.apiNewBaselPath + Api.file.getFileDetailNoTdk,
                    body: JSON.stringify({
                        clientType: 0,
                        fid: req.query.fid,
                        sourceType: 1,
                        site:4
                    }),
                    headers: {
                        'Content-Type': 'application/json'
                    },
                };
                request(opt, function(err, res1, body) {
                    if (body) {
                        var data = JSON.parse(body);
                        var fileInfo = data.data && data.data.fileInfo
                        var tdk = data.data && data.data.tdk
                            //console.warn('data----------------',data)
                        if (data.code == 0 && data.data) {

                            fid = fileInfo.id; // 文件id
                            classId = fileInfo.classid; // 分类id
                            title = fileInfo.title || ""; // 文件标题 (没有后缀格式)
                            isGetClassType = fileInfo.isGetClassType; // 分类类型 :0-读取平台分类 1-读取专题分类
                            spcClassId = fileInfo.spcClassId; // 专题分类ID(最后一级)

                            format = fileInfo.format || ''; //  文件格式 txt,ppt,doc,xls（展示分为两种，txt为文本，其他图片格式展示）
                            classid1 = fileInfo.classid1;
                            classid2 = fileInfo.classid2
                            perMin = fileInfo.permin || ''; // 1:公开、2:私人 3:付费
                            uid = fileInfo.uid || '' // 上传者id
                            userID = fileInfo.uid && fileInfo.uid.slice(0, 10) || ''; //来标注用户的ID，
                            callback(null, data);
                        } else {
                            callback(null, {});
                        }
                    } else {
                        callback(null, {});
                    }
                })
            }
        };
        return async.series(_index, function(err, results) { // async.series 串行无关联
            results.list.data = results.list.data || {}
            var list = Object.assign({}, { data: Object.assign(results.list && results.list.data.fileInfo, results.list.data.tdk, results.list.data.transcodeInfo, { title: results.list.data.fileInfo.title }) })
            var unloginFlag = req.query.unloginFlag
            var consumeStatus = req.query.consumeStatus // 7 已经下载过
            var results = Object.assign({}, results, { list: list }, { unloginFlag: unloginFlag, consumeStatus: consumeStatus })
                // 要在这里给默认值 不然报错
            render("detail/success", results, req, res);
        })
    },
    fail: function(req, res) {
        render("detail/fail", null, req, res);
    }
};

