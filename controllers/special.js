var async = require("async");
var _=require('lodash')
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
                    },
                    listTopicContents:function(callback){
                        
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

                render("special/index", results, res, req);
            })
    }
}