/**
 *
 */

var async = require("async");
var render = require("../common/render");
var server = require("../models/index");
var Api = require("../api/api");
var appConfig = require("../config/app-config");
var urlencode = require('urlencode');
//测试数据


module.exports = {
    //搜索服务--API接口--条件搜索--同步

    getData: function (req, res) {

        // console.log(req,'req======')
        // console.log(req.query,'req.query======')

        return async.series({


            list: function (callback) {

                server.get(appConfig.apiBasePath + Api.search.byCondition, callback, req);

            },
            words: function (callback) {

                var newReq = {};
                for (var key in req) {
                    newReq[key] = req[key];
                }
                newReq.query = { cond: newReq.query.cond };
                server.get(appConfig.apiBasePath + Api.search.associatedWords, callback, newReq);
            }

        }, function (err, results) {
            console.log(req.query, 'req.query');
            var results = results || {};
            results.condition = [
                {
                    title: '格式',
                    code: 'format',
                    content: [
                        { code: '', des: '全部', active: (req.query.format === '' || req.query.format == undefined) ? true : false },
                        { code: 'doc', des: 'Word', active: req.query.format === 'doc' ? true : false },
                        { code: 'xls', des: 'Excel', active: req.query.format === 'xls' ? true : false },
                        { code: 'ppt', des: 'PPT', active: req.query.format === 'ppt' ? true : false },
                        { code: 'txt', des: 'TXT', active: req.query.format === 'txt' ? true : false },
                        { code: 'pdf', des: 'PDF', active: req.query.format === 'pdf' ? true : false }
                    ]
                },
                {
                    title: '范围',
                    code: 'fileType',
                    content: [
                        { code: '', des: '全部', active: (req.query.fileType === '' || req.query.fileType == undefined) ? true : false },
                        { code: 'highQuality', des: '精选', active: req.query.fileType === 'highQuality' ? true : false },
                        { code: 'downloadVoucher', des: '下载券', active: req.query.fileType === 'downloadVoucher' ? true : false },
                        { code: 'vipExclusive', des: 'VIP专享', active: req.query.fileType === 'vipExclusive' ? true : false },
                        { code: 'pay', des: '付费', active: req.query.fileType === 'pay' ? true : false }
                    ]
                },
                {
                    title: '页数',
                    code: 'filePage',
                    content:
                        [
                            { code: '', des: '全部', active: (req.query.filePage === '' || req.query.filePage == undefined) ? true : false },
                            { code: '1-5', des: '1-5页', active: req.query.filePage === '1-5' ? true : false },
                            { code: '6-10', des: '6-10页', active: req.query.filePage === '6-10' ? true : false },
                            { code: '11-20', des: '11-20页', active: req.query.filePage === '11-20' ? true : false },
                            { code: '20-9999', des: '20页以上', active: req.query.filePage === '20-9999' ? true : false }
                        ]
                },
                {
                    title: '上传时间',
                    code: 'uploadTimeNum',
                    content:
                        [
                            { code: '', des: '全部', active: (req.query.uploadTimeNum === '' || req.query.uploadTimeNum == undefined) ? true : false },
                            { code: 30, des: '近一个月', active: req.query.uploadTimeNum === '30' ? true : false },
                            { code: 180, des: '近半年', active: req.query.uploadTimeNum === '180' ? true : false }
                        ]
                },
            ];

            //最大20页
            var pageIndexArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];

            if (results.list.data.totalPages < 20) {
                pageIndexArr.length = results.list.data.totalPages;
            }
            results.pageIndexArr = pageIndexArr;

            results.formatText = {
                word: {
                    doc: true,
                    docx: true,
                    docm: true,
                    dotx: true,
                    dotm: true,
                },
                excel: {
                    xls: true,
                    xlsx: true,
                    xlsm: true,
                    xltx: true,
                    xltm: true,
                    xlsb: true,
                    xlam: true,
                },
                ppt: {
                    ppt: true,
                    pptx: true,
                    pptm: true,
                    ppsx: true,
                    potx: true,
                    potm: true,
                    ppam: true,
                },
                txt: {
                    txt: true
                },
                pdf: {
                    pdf: true
                }
            };


            if (req.query.cond) {
                req.query.cond = decodeURIComponent(decodeURIComponent(req.query.cond)).trim();
            };
    

            render("search/home", results, req, res);
        })


    },

};