var async = require("async");
var _=require('lodash')
var render = require("../common/render");
var server = require("../models/index");
var appConfig = require("../config/app-config");
var api = require("../api/api");
var util = require("../common/util");
var urlencode = require('urlencode');
//测试
module.exports = {
    render: function(req, res) {
            var list=function(req){
                return{
                    findSpecialTopic:function(callback){
                     
                        //console.log(appConfig.apiBasePath + api.special.findSpecialTopic.replace(/\$id/, 'xx'),'url--------')
                        // server.get(appConfig.apiBasePath + api.special.allCategory.replace(/\$id/, 'xx'), callback, req, true);
                        //server.get(appConfig.apiBasePath + api.special.allCategory, callback, req);
                        //req.dimensionId=123;
                        callback()
                    },
                    listTopicContents:function(callback){
                        //console.log(util.getQueryParams('dd'),'util.getQueryParams')
                        // req.body = {
                        //     specialTopicId: util.getQueryParams('spid'),//专题id
                        //     dimensionId: util.getQueryParams('dsid'),//维度id
                        //     topicPropertyQueryDTOList: [{
                        //         propertyGroupId:"xx",
                        //         propertyGroupName:"xx",
                        //         propertyType:1,
                        //         propertyId:"xx",
                        //         propertyName:"xx"
                        //     }],
                        //     sortFlag: util.getQueryParams('sortFlag'),//排序,0-综合排序,1-最新上传
                        //     currentPage: util.getQueryParams('cur'),
                        //     pageSize: 10
                        // };
                        console.log(req.body,'req.body--------------------------------------')
                        //server.post(appConfig.apiBasePath + api.special.listTopicContents, callback, req);
                        callback()
                    },
                    specialTopic:function(callback){
                        req.body = {
                            currentPage:1,
                            pageSize:30,
                            name: 131231   // 需要依赖 专题的名称
                        }
                        server.post(appConfig.apiBasePath + api.special.specialTopic, callback, req);
                        callback()
                    }
                }
            }
            return async.series(list(req), function (err, results) {
                console.log(results,'results****************')
                var results = results || {};
                results={
                    code: 0,
                    msg: "请求成功",
                    data: {
                        "id": "11",
                        "topicName": "专题案例",
                        "templateCode":"xx",
                        "dimensionStatus":0,
                        "specialTopicDimensionDOList":[
                            {
                                "dimensionId"  :"123",
                                "dimensionName" :"维度1",
                                "sort":1,
                                "specialTopicPropertyGroupDOList" :[
                                    {
                                        "propertyGroupId" : "1234",
                                        "propertyGroupName" :"分类1",
                                        "sort":1,
                                        "propertyType" :1,
                                        "specialTopicPropertyDOList":[
                                            {
                                                "propertyId":"12341",
                                                "propertyName":"属性1"
                                            },
                                            {
                                                "propertyId":"12342",
                                                "propertyName":"属性2"
                                            },
                                        ]
                                    },
                                    {
                                        "propertyGroupId" : "1235",
                                        "propertyGroupName" :"分类2",
                                        "sort":1,
                                        "propertyType" :1,
                                        "specialTopicPropertyDOList":[
                                            {
                                                "propertyId":"12351",
                                                "propertyName":"属性1"
                                            },
                                            {
                                                "propertyId":"12352",
                                                "propertyName":"属性2"
                                            },
                                        ]
                                    },
                                    {
                                        "propertyGroupId" : "1236",
                                        "propertyGroupName" :"分类3",
                                        "sort":1,
                                        "propertyType" :1,
                                        "specialTopicPropertyDOList":[
                                            {
                                                "propertyId":"12361",
                                                "propertyName":"属性1"
                                            },
                                            {
                                                "propertyId":"12362",
                                                "propertyName":"属性2"
                                            },
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                }
                // 添加全部
                results.data.specialTopicDimensionDOList.map(function(firstItem,firstIndex){
                    firstItem.specialTopicPropertyGroupDOList.map(function(secondItem,secondIndex){
                        secondItem.specialTopicPropertyDOList.unshift({
                             propertyId:"all",
                             propertyName:"全部",
                             active:true
                        })
                    })
                })
                results.data.specialLength=results.data.specialTopicDimensionDOList[0].specialTopicPropertyGroupDOList.length;//分类的长度
                //results.urlParams=paramObj.url;
                // 列表内容
                results.list= {
                    "currentPage": 1,
                    "pageSize": 10,
                    "rows": [
                        {
                            "contentId":"xx",
                            "contentName":"2019年考研数学真题(数二)梵蒂冈的",
                            "fileSmallPic":"https://pic.iask.com.cn/yO6qCK8vTcO_small1.jpg",
                            "readNum":2,
                            "downNum":1,
                            "collectNum":1,
                            "praiseNum":1
                        }
                    ],
                    "totalPages": 10,
                    "totalSize": 100
                }
                
                
                
                //最大20页
                var pageIndexArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];

                if (results.list.totalPages < 20) {
                    pageIndexArr.length = results.list.totalPages;
                }
                results.pageIndexArr=pageIndexArr;

                render("special/index", results, req, res);
            })
    }
}