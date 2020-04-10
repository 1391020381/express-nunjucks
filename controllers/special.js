var async = require("async");
var render = require("../common/render");
var server = require("../models/index");
var appConfig = require("../config/app-config");
var urlencode = require('urlencode');
//测试
module.exports = {
    render: function(res, req) {
 
            return async.series({
                list:function(callback){
                    callback()
                }
            }, function (err, results) {
                var results = results || {};
                results.condition = [
                    {
                        title: '格式',
                        code: 'format',
                        content: [
                            { code: '', des: '全部', active: true },
                            { code: 'doc', des: 'Word', active: false },
                            { code: 'xls', des: 'Excel', active: false },
                            { code: 'ppt', des: 'PPT', active: false },
                            { code: 'txt', des: 'TXT', active: false },
                            { code: 'pdf', des: 'PDF', active: false }
                        ]
                    },
                    {
                        title: '范围',
                        code: 'fileType',
                        content: [
                            { code: '', des: '全部', active: true },
                            { code: 'highQuality', des: '精选', active: false },
                            { code: 'downloadVoucher', des: '下载券', active: false },
                            { code: 'vipExclusive', des: 'VIP专享', active:false },
                            { code: 'pay', des: '付费', active: false }
                        ]
                    },
                    {
                        title: '分类',
                        code: 'fileType',
                        content: [
                            { code: '', des: '全部', active: true },
                            { code: 'highQuality', des: '精选', active: false },
                            { code: 'downloadVoucher', des: '下载券', active: false },
                            { code: 'vipExclusive', des: 'VIP专享', active:false },
                            { code: 'pay', des: '付费', active: false }
                        ]
                    }
                ];
                //最大20页
                var pageIndexArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];

                // if (results.list.data.totalPages < 20) {
                //     pageIndexArr.length = results.list.data.totalPages;
                // }
                results.pageIndexArr=pageIndexArr;

                render("special/index", results, res, req);
            })
    }
}