var async = require("async");
var _=require('lodash')
var render = require("../common/render");
var server = require("../models/index");
var appConfig = require("../config/app-config");
var api = require("../api/api");
var _=require("lodash")
var util = require("../common/util");
//测试
module.exports = {
    render: function(req, res) {
            var paramsObj=util.getSpecialParams(req.url);  
            console.log(paramsObj,'paramsObj')
            var list=function(req){
                return{
                    findSpecialTopic:function(callback){
                        var url=appConfig.apiSpecialPath + api.special.findSpecialTopic.replace(/\$id/, paramsObj.specialTopicId);
                        server.$http(url,'get', req, true).then(item=>{
                            //paramsObj.dimensionId ? '' : paramsObj.dimensionId=item.data.specialTopicDimensionDOList[0].dimensionId //默认维度id   
                            callback(null,item)
                        })
                        
                      
                    },
                    listTopicContents:function(callback){
                       
                        req.body = {
                            specialTopicId: paramsObj.specialTopicId,//专题id
                            dimensionId: paramsObj.dimensionId || '',//维度id
                            topicPropertyQueryDTOList: paramsObj.topicPropertyQueryDTOList || [],
                            sortFlag: paramsObj.sortFlag || 0,//排序,0-综合排序,1-最新上传
                            currentPage: paramsObj.currentPage || 1,
                            pageSize: 10
                        };
                        server.$http(appConfig.apiSpecialPath + api.special.listTopicContents,'post', req).then(res=>{
                            console.log('列表请求成功',res)
                            callback(null,res)
                        });
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
            return async.series(list(req), function (err, data) {
                console.log(req.query,'results****************')
                var results = data.findSpecialTopic || {};
                results.list=data.listTopicContents.data;
                console.log(data.listTopicContents,'data.listTopicContents')
               
                // results={
                //     code: 0,
                //     msg: "请求成功",
                //     data: {
                //         "id": "11",
                //         "topicName": "专题案例",
                //         "templateCode":"xx",
                //         "dimensionStatus":0,
                //         "specialTopicDimensionDOList":[
                //             {
                //                 "dimensionId"  :"123",
                //                 "dimensionName" :"维度1",
                //                 "sort":1,
                //                 "specialTopicPropertyGroupDOList" :[
                //                     {
                //                         "propertyGroupId" : "1234",
                //                         "propertyGroupName" :"分类1",
                //                         "sort":1,
                //                         "propertyType" :1,
                //                         "specialTopicPropertyDOList":[
                //                             {
                //                                 "propertyId":"12341",
                //                                 "propertyName":"属性1"
                //                             },
                //                             {
                //                                 "propertyId":"12342",
                //                                 "propertyName":"属性2"
                //                             },
                //                         ]
                //                     },
                //                     {
                //                         "propertyGroupId" : "1235",
                //                         "propertyGroupName" :"分类2",
                //                         "sort":1,
                //                         "propertyType" :1,
                //                         "specialTopicPropertyDOList":[
                //                             {
                //                                 "propertyId":"12351",
                //                                 "propertyName":"属性1"
                //                             },
                //                             {
                //                                 "propertyId":"12352",
                //                                 "propertyName":"属性2"
                //                             },
                //                         ]
                //                     },
                //                     {
                //                         "propertyGroupId" : "1236",
                //                         "propertyGroupName" :"分类3",
                //                         "sort":1,
                //                         "propertyType" :1,
                //                         "specialTopicPropertyDOList":[
                //                             {
                //                                 "propertyId":"12361",
                //                                 "propertyName":"属性1"
                //                             },
                //                             {
                //                                 "propertyId":"12362",
                //                                 "propertyName":"属性2"
                //                             },
                //                         ]
                //                     }
                //                 ]
                //             },
                //             {
                //                 "dimensionId"  :"124",
                //                 "dimensionName" :"维度2",
                //                 "sort":1,
                //                 "specialTopicPropertyGroupDOList" :[
                //                     {
                //                         "propertyGroupId" : "1234",
                //                         "propertyGroupName" :"风格",
                //                         "sort":1,
                //                         "propertyType" :1,
                //                         "specialTopicPropertyDOList":[
                //                             {
                //                                 "propertyId":"12341",
                //                                 "propertyName":"属性1"
                //                             },
                //                             {
                //                                 "propertyId":"12342",
                //                                 "propertyName":"属性2"
                //                             },
                //                         ]
                //                     },
                //                     {
                //                         "propertyGroupId" : "1235",
                //                         "propertyGroupName" :"发型",
                //                         "sort":1,
                //                         "propertyType" :1,
                //                         "specialTopicPropertyDOList":[
                //                             {
                //                                 "propertyId":"12351",
                //                                 "propertyName":"属性1"
                //                             },
                //                             {
                //                                 "propertyId":"12352",
                //                                 "propertyName":"属性2"
                //                             },
                //                         ]
                //                     },
                //                     {
                //                         "propertyGroupId" : "1236",
                //                         "propertyGroupName" :"身材",
                //                         "sort":1,
                //                         "propertyType" :1,
                //                         "specialTopicPropertyDOList":[
                //                             {
                //                                 "propertyId":"12361",
                //                                 "propertyName":"属性1"
                //                             },
                //                             {
                //                                 "propertyId":"12362",
                //                                 "propertyName":"属性2"
                //                             },
                //                         ]
                //                     }
                //                 ]
                //             }
                //         ]
                //     }
                // }

                // 处理tag标签选中
                if(paramsObj.dimensionId){
                    var index=_.findIndex(results.data.specialTopicDimensionDOList,['dimensionId',paramsObj.dimensionId])
                    var dimlist=results.data.specialTopicDimensionDOList[index]; //当前的维度列表
                }else{
                    var dimlist=results.data.specialTopicDimensionDOList[0]; //当前的维度列表
                }
              
                console.log(dimlist,'dimlist')
                //添加全部
                dimlist.specialTopicPropertyGroupDOList.map(function(firstItem,firstIndex){
                    firstItem.specialTopicPropertyDOList.unshift({
                        propertyId:'all',
                        propertyName:"全部",
                        active:true,
                        ids:firstItem.propertyGroupId+"_all"
                    })
                    firstItem.specialTopicPropertyDOList.map(function(secondItem,secondIndex){
                        secondItem.ids=firstItem.propertyGroupId+'_'+secondItem.propertyId;
                      
                    })                   
                })
                //查找到当前分类  及选中的tag
                var currentArr=[];
                dimlist.specialTopicPropertyGroupDOList.map(function(firstItem,firstIndex){
                    firstItem.specialTopicPropertyDOList.map(function(secondItem,secondIndex){
                        if(paramsObj.topicPropertyQueryDTOList.includes(secondItem.ids)){
                            currentArr.push({
                                firstIndex:firstIndex,
                                secondIndex:secondIndex,
                            })
                        }                
                    })    
                })
                currentArr.map(item=>{
                    dimlist.specialTopicPropertyGroupDOList[item.firstIndex].specialTopicPropertyDOList.map(res=>{
                        res.active=false;
                    })
                    dimlist.specialTopicPropertyGroupDOList[item.firstIndex].specialTopicPropertyDOList[item.secondIndex].active=true;
                })
               
              


                results.data.specialLength=results.data.specialTopicDimensionDOList[0].specialTopicPropertyGroupDOList.length;//分类的长度
                // 列表内容
                // results.list= {
                //     "currentPage": 1,
                //     "pageSize": 10,
                //     "rows": [
                //         {
                //             "contentId":"xx",
                //             "contentName":"2019年考研数学真题(数二)梵蒂冈的",
                //             "fileSmallPic":"https://pic.iask.com.cn/yO6qCK8vTcO_small1.jpg",
                //             "readNum":2,
                //             "downNum":1,
                //             "collectNum":1,
                //             "praiseNum":1
                //         }
                //     ],
                //     "totalPages": 10,
                //     "totalSize": 100
                // }
                
                
                
                //最大20页
                var pageIndexArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];

                if (results.list.totalPages < 20) {
                    pageIndexArr.length = results.list.totalPages;
                }
                results.pageIndexArr=pageIndexArr;
                paramsObj.topicPropertyQueryDTOList=JSON.stringify(paramsObj.topicPropertyQueryDTOList)
                results.urlParams=paramsObj;
                console.log(results.urlParams,'results.urlParams')
                console.log(results,'results')
                render("special/index", results, req, res);
            })
    }
}