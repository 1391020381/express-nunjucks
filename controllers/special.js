var async = require("async");
var render = require("../common/render");
var server = require("../models/index");
var appConfig = require("../config/app-config");
var api = require("../api/api");
var urlencode = require('urlencode');
//测试
module.exports = {
    render: function(res, req) {
            var list=function(req){
                return{
                    findSpecialTopic:function(callback){
                        callback()
                        //console.log(appConfig.apiBasePath + api.special.findSpecialTopic.replace(/\$id/, 'xx'),'url--------')
                        // server.get(appConfig.apiBasePath + api.special.allCategory.replace(/\$id/, 'xx'), callback, req, true);
                        console.log(appConfig.apiBasePath + api.special.allCategory,'url')
                        //server.get(appConfig.apiBasePath + api.special.allCategory, callback, req);
                    }
                }
            }
            return async.series(list(req), function (err, results) {
                console.log(results,'results****************')
                var results = results || {};
                results.detailsInfo={
                    code: 0,
                    msg: "请求成功",
                    data: {
                        "id": "11",
                        "topicName": "xxxxxxxxxxxx",
                        "templateCode":"xx",
                        "dimensionStatus":0,
                        "specialTopicDimensionDOList":[
                            {
                                "dimensionId"  :"xx",
                                "dimensionName" :"xx",
                                "sort":1,
                                "specialTopicPropertyGroupDOList" :[
                                    {
                                        "propertyGroupId" : "xx",
                                        "propertyGroupName" :"xx",
                                        "sort":1,
                                        "propertyType" :1,
                                        "specialTopicPropertyDOList":[
                                            {
                                                "propertyId":"xx1",
                                                "propertyName":"xx1"
                                            },
                                            {
                                                "propertyId":"xx2",
                                                "propertyName":"xx2"
                                            },
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                }
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