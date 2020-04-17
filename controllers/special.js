var async = require("async");
var _=require('lodash')
var render = require("../common/render");
var server = require("../models/index");
var appConfig = require("../config/app-config");
var api = require("../api/api");
var util = require("../common/util");
var querystring =require('querystring')
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
                            req.topicName = item.data&&item.data.topicName //   specialTopic 需要topicName
                            console.log(item,'itemitem') 
                            if(paramsObj.dimensionId){ //获取当前当前的维度列表
                                var index=_.findIndex(item.data.specialTopicDimensionDOList,['dimensionId',paramsObj.dimensionId])
                                req.specialList=item.data.specialTopicDimensionDOList[index]; //
                            }
                            callback(null,item)
                        })
                        
                      
                    },
                    listTopicContents:function(callback){
                        var arr=[];
                        if((paramsObj.topicPropertyQueryDTOList.length>0)){
                            arr=util.getPropertyParams(paramsObj.topicPropertyQueryDTOList,req.specialList.specialTopicPropertyGroupDOList);
                        }
                      
                        req.body = {
                            specialTopicId: paramsObj.specialTopicId,//专题id
                            dimensionId: paramsObj.dimensionId || '',//维度id
                            topicPropertyQueryDTOList: arr || [],
                            sortFlag: paramsObj.sortFlag || 0,//排序,0-综合排序,1-最新上传
                            currentPage: paramsObj.currentPage || 1,
                            pageSize: 12
                        };
                        console.log(req.body,'req.body--------------------------------------')
                        server.$http(appConfig.apiSpecialPath + api.special.listTopicContents,'post', req).then(res=>{
                            callback(null,res)
                        });
                       
                    },
                    specialTopic:function(callback){
                        console.log('specialTopic-topicName:',req.topicName)
                        req.body = {
                            currentPage:1,
                            pageSize:30,
                            topicName: `${req.topicName}` // 需要依赖 专题的名称
                        }
                        server.$http(appConfig.apiSpecialPath + api.special.specialTopic, 'post', req).then(res=>{
                            console.log('热点搜索接口:',res)
                            callback(null,res)
                        });
                      
                        //server.post(appConfig.apiSpecialPath + api.special.specialTopic, callback, req);
                    }
                }
            }
            return async.series(list(req), function (err, results) {

                if(results.findSpecialTopic.code=='G-500'){
                    res.redirect('/html/404.html')
                    return
                }    
                var data=results.findSpecialTopic.data;
                var list=results.listTopicContents.data;
                var specialTopic = results.specialTopic.code=== '0'?  results.specialTopic.data&&results.specialTopic.data.rows:  []

                // 处理tag标签选中
                if(paramsObj.dimensionId){
                    var index=_.findIndex(data.specialTopicDimensionDOList,['dimensionId',paramsObj.dimensionId])
                    var dimlist=data.specialTopicDimensionDOList[index]; //当前的维度列表
                }else{
                    var dimlist=data.specialTopicDimensionDOList && data.specialTopicDimensionDOList[0]; //当前的维度列表
                }
              
              

                //添加全部
                if(dimlist){
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
    
                    data.specialLength=data.specialTopicDimensionDOList[0].specialTopicPropertyGroupDOList.length;//分类的长度
    
                }
   
              
                //最大20页
                var results={ data:data,list:list ,specialTopic:specialTopic};
                var pageIndexArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];

                if (results.list.totalPages < 20) {
                    pageIndexArr.length = results.list.totalPages;
                }
                results.pageIndexArr=pageIndexArr;

                paramsObj.topicPropertyQueryDTOList=JSON.stringify(paramsObj.topicPropertyQueryDTOList)
                results.urlParams=paramsObj;
                console.log(results,'results')
                render("special/index", results, req, res);
            })
    }
}