/**
 * @Description: 详情页
 */
const async = require('async');
const render = require('../common/render');
const Api = require('../api/api');
const request = require('request');
const appConfig = require('../config/app-config');
let fid = null;


let title = null;


let format = '';
let classid1 = '';

let perMin = '';

let userID = Math.random().toString().slice(-15); // 标注用户的ID，

const sceneIDGuess = ''; // 场景的ID

const recommendInfoData_guess = {}; // 个性化数据(猜你喜欢)

const requestID_guess = ''; //  个性化数据(猜你喜欢) requestID

module.exports = {
    success: function (req, res) {
        const index = {
            list: function (callback) {
                const opt = {

                    method: 'POST',
                    url: appConfig.apiNewBaselPath + Api.file.getFileDetailNoTdk,
                    body: JSON.stringify({
                        clientType: 0,
                        fid: req.query.fid,
                        sourceType: 1,
                        site: 4
                    }),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                };
                request(opt, (err, res1, body) => {
                    if (body) {
                        const data = JSON.parse(body);
                        const fileInfo = data.data && data.data.fileInfo;
                        const tdk = data.data && data.data.tdk;
                        // console.warn('data----------------',data)
                        if (data.code == 0 && data.data) {

                            fid = fileInfo.id; // 文件id
                            classId = fileInfo.classid; // 分类id
                            title = fileInfo.title || ''; // 文件标题 (没有后缀格式)
                            isGetClassType = fileInfo.isGetClassType; // 分类类型 :0-读取平台分类 1-读取专题分类
                            spcClassId = fileInfo.spcClassId; // 专题分类ID(最后一级)

                            format = fileInfo.format || ''; //  文件格式 txt,ppt,doc,xls（展示分为两种，txt为文本，其他图片格式展示）
                            classid1 = fileInfo.classid1;
                            classid2 = fileInfo.classid2;
                            perMin = fileInfo.permin || ''; // 1:公开、2:私人 3:付费
                            uid = fileInfo.uid || ''; // 上传者id
                            userID = fileInfo.uid && fileInfo.uid.slice(0, 10) || ''; // 来标注用户的ID，
                            callback(null, data);
                        } else {
                            callback(null, {});
                        }
                    } else {
                        callback(null, {});
                    }
                });
            }
        };
        return async.series(index, (err, results) => { // async.series 串行无关联
            results.list.data = results.list.data || {};
            const list = Object.assign({}, { data: Object.assign(results.list && results.list.data.fileInfo, results.list.data.tdk, results.list.data.transcodeInfo, { title: results.list && results.list.data.fileInfo.title }) });
            const unloginFlag = req.query.unloginFlag;
            const consumeStatus = req.query.consumeStatus; // 7 已经下载过
            results = Object.assign({}, results, { list: list }, { unloginFlag: unloginFlag, consumeStatus: consumeStatus });
            // 要在这里给默认值 不然报错
            render('detail/success', results, req, res);
        });
    },
    fail: function (req, res) {
        render('detail/fail', null, req, res);
    }
};

