var async = require("async");
var _=require('lodash')
var render = require("../common/render");
var server = require("../models/index");
var appConfig = require("../config/app-config");
var api = require("../api/api");
var util = require("../common/util");
//测试

// class specialModule{
//     constructor(req,res){
//        this.state={
//            paramsObj:util.getSpecialParams(req.url),
//            req:req,
//            res:res  
//        }
//        console.log(123456)
//        this.render();
//     }
//     render(){
//         console.log(this,'this')
//         return async.series({
//             findSpecialTopic:this.findSpecialTopic,
//             listTopicContents:this.listTopicContents,
//             specialTopic:this.specialTopic
//         }, (err, results)=> {
//            this.toResult(results);
//         });
//     }
//     toResult(results){
//         var data=results.findSpecialTopic.data;
//         var list=results.listTopicContents.data;
//         var specialTopic = results.specialTopic.code=== 1?  results.specialTopic.data:  [
//             {"id": "1001","topicName": "1"},
//             {"id": "1002","topicName": "2"},
//             {"id": "1000","topicName": "3"},
//             {"id": "1001","topicName": "4"},
//             {"id": "1002","topicName": "5"},
//             {"id": "1000","topicName": "6"},
//             {"id": "1001","topicName": "7"},
//             {"id": "1002","topicName": "8"},
//             {"id": "1000","topicName": "9"},
//             {"id": "1001","topicName": "10"},
//             {"id": "1002","topicName": "11"},
//             {"id": "1000","topicName": "12"},
//             {"id": "1000","topicName": "13"},
//             {"id": "1000","topicName": "14"},
//             {"id": "1000","topicName": "15"},
//             {"id": "1000","topicName": "16"},
//             {"id": "1000","topicName": "17"},
//             {"id": "1000","topicName": "18"},
//             {"id": "1000","topicName": "19"},
//             {"id": "1000","topicName": "20"},
//             {"id": "1000","topicName": "21"},
//             {"id": "1000","topicName": "22"},
//             {"id": "1000","topicName": "23"},
//             {"id": "1000","topicName": "24"},
//             {"id": "1000","topicName": "25"},
//             {"id": "1000","topicName": "26"},
//             {"id": "1000","topicName": "27"},
//             {"id": "1000","topicName": "28"},
//             {"id": "1000","topicName": "29"},
//             {"id": "1000","topicName": "30"},
//         ]

//         this.dealData(results)  //处理数据 添加全部 切换
      
//         //最大20页
//         var results={ data:data,list:list ,specialTopic:specialTopic};
//         var pageIndexArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];

//         if (results.list && results.list.totalPages < 20) {
//             pageIndexArr.length = results.list.totalPages;
//         }
//         results.pageIndexArr=pageIndexArr;

//         paramsObj.topicPropertyQueryDTOList=JSON.stringify(paramsObj.topicPropertyQueryDTOList)
//         results.urlParams=paramsObj;
//         console.log(results,'results')
//         render("special/index", results, req, res);
//     }
//     async findSpecialTopic(callback){
//         console.log(this,'5555555555555555555555555555555555555555555555')
//         let { paramsObj,req,res }=this.state;
//         console.log('5555555555555555555555555555555555555555555555')
//         console.log(api.special.findSpecialTopic.replace(/\$id/, paramsObj.specialTopicId))
//         const url=appConfig.apiSpecialPath + api.special.findSpecialTopic.replace(/\$id/, paramsObj.specialTopicId);
//         console.log(url,'url---------------------------------------------------------------')
//         const item=await server.$http(url,'get', req, true);
//         req.topicName = item.data&&item.data.topicName //   specialTopic 需要topicName
//         if(paramsObj.dimensionId){ //获取当前当前的维度列表
//             let index=_.findIndex(item.data.specialTopicDimensionDOList,['dimensionId',paramsObj.dimensionId])
//             req.specialList=item.data.specialTopicDimensionDOList[index]; //
//         }
//         console.log(item,'item---------------------------------------------------------------')
//         callback(null,item)
//     }
//     async listTopicContents(callback){
//         let { paramsObj,req,res }=this.state;
//         let arr=[];
//         if((paramsObj.topicPropertyQueryDTOList.length>0)){
//             arr=util.getPropertyParams(paramsObj.topicPropertyQueryDTOList,req.specialList.specialTopicPropertyGroupDOList);
//         }

//         req.body = {
//             specialTopicId: paramsObj.specialTopicId,//专题id
//             dimensionId: paramsObj.dimensionId || "",//维度id
//             topicPropertyQueryDTOList: arr  || [],
//             sortFlag: +paramsObj.sortFlag || 0,//排序,0-综合排序,1-最新上传
//             currentPage: +paramsObj.currentPage || 1,
//             pageSize: 12
//         };
//         console.log(req.body,'req.body****************') 
//         let data=await server.$http(appConfig.apiSpecialPath + api.special.listTopicContents,'post', req,res,true)
//         callback(null,data)
//     }
//     async specialTopic(callback){
//         let { req,res }=this.state;
//         req.body = {
//             currentPage:1,
//             pageSize:30,
//             name: req.topicName   // 需要依赖 专题的名称
//         }
//         let data=await server.$http(appConfig.apiSpecialPath + api.special.specialTopic, 'post', req,res)
//         callback(null,data)
//     }
//     dealData(results){
//         let { paramsObj }=this.state;
//         let data=results.findSpecialTopic
//         // 处理tag标签选中
//         if(paramsObj.dimensionId){
//             var index=_.findIndex(data.specialTopicDimensionDOList,['dimensionId',paramsObj.dimensionId])
//             var dimlist=data.specialTopicDimensionDOList[index]; //当前的维度列表
//         }else{
//             var dimlist=data.specialTopicDimensionDOList && data.specialTopicDimensionDOList[0]; //当前的维度列表
//         }

//     //添加全部
//         if(dimlist){
//             dimlist.specialTopicPropertyGroupDOList.map(function(firstItem,firstIndex){
//                 firstItem.specialTopicPropertyDOList.unshift({
//                     propertyId:'all',
//                     propertyName:"全部",
//                     active:true,
//                     ids:firstItem.propertyGroupId+"_all"
//                 })
//                 firstItem.specialTopicPropertyDOList.map(function(secondItem,secondIndex){
//                     secondItem.ids=firstItem.propertyGroupId+'_'+secondItem.propertyId;
                    
//                 })                   
//             })
//             //查找到当前分类  及选中的tag
//             var currentArr=[];
//             dimlist.specialTopicPropertyGroupDOList.map(function(firstItem,firstIndex){
//                 firstItem.specialTopicPropertyDOList.map(function(secondItem,secondIndex){
//                     if(paramsObj.topicPropertyQueryDTOList.includes(secondItem.ids)){
//                         currentArr.push({
//                             firstIndex:firstIndex,
//                             secondIndex:secondIndex,
//                         })
//                     }                
//                 })    
//             })
//             currentArr.map(item=>{
//                 dimlist.specialTopicPropertyGroupDOList[item.firstIndex].specialTopicPropertyDOList.map(res=>{
//                     res.active=false;
//                 })
//                 dimlist.specialTopicPropertyGroupDOList[item.firstIndex].specialTopicPropertyDOList[item.secondIndex].active=true;
//             })

//             data.specialLength=data.specialTopicDimensionDOList[0].specialTopicPropertyGroupDOList.length;//分类的长度

//         } 
//     }

// }

//module.exports=specialModule

module.exports = {
    render: function(req, res) {
            var _this=this;
            var paramsObj=util.getSpecialParams(req.url);  
            console.log(paramsObj,'paramsObj')
            var list=function(req){
                return{
                    findSpecialTopic:function(callback){
                        var url=appConfig.apiSpecialPath + api.special.findSpecialTopic.replace(/\$id/, paramsObj.specialTopicId);
                        server.$http(url,'get', req, true).then(item=>{
                            req.topicName = item.data&&item.data.topicName //   specialTopic 需要topicName
                            if(paramsObj.dimensionId && item.data.dimensionStatus==0){ //获取当前当前的维度列表
                                var index=_.findIndex(item.data.specialTopicDimensionDOList,['dimensionId',paramsObj.dimensionId])
                                req.specialList=item.data.specialTopicDimensionDOList[index].specialTopicPropertyGroupDOList; //
                            }else{  // 无维度的情况
                                req.specialList=item.data.specialTopicPropertyGroupDOList; //
                            }
                            console.log(item,'item--------------------')
                            callback(null,item)
                            
                        })
                        
                      
                    },
                    listTopicContents:function(callback){
                        var arr=[];
                        if((paramsObj.topicPropertyQueryDTOList.length>0)){
                            arr=util.getPropertyParams(paramsObj.topicPropertyQueryDTOList,req.specialList);
                        }

                        req.body = {
                            specialTopicId: paramsObj.specialTopicId,//专题id
                            dimensionId: paramsObj.dimensionId || "",//维度id
                            topicPropertyQueryDTOList: arr  || [],
                            sortFlag: +paramsObj.sortFlag || 0,//排序,0-综合排序,1-最新上传
                            currentPage: +paramsObj.currentPage || 1,
                            pageSize: 12
                        };
                        console.log(req.body,'req.body****************') 
                        server.$http(appConfig.apiSpecialPath + api.special.listTopicContents,'post', req,res,true).then(res=>{
                            console.log('列表请求成功',res)
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

                var results=_this.dealData(paramsObj,results)  //处理数据 添加全部 切换
                render("special/index", results, req, res);
            })
            //dealData
    },
    dealData(paramsObj,results){
        var data=results.findSpecialTopic.data;
        // 处理tag标签选中
        var dimlist={};
        if(data.dimensionStatus==0){ //开启了维度
           
            if(paramsObj.dimensionId){
                var index=_.findIndex(data.specialTopicDimensionDOList,['dimensionId',paramsObj.dimensionId])
                 dimlist=data.specialTopicDimensionDOList[index]; //当前的维度列表
            }else{
                 dimlist=data.specialTopicDimensionDOList && data.specialTopicDimensionDOList[0]; //当前的维度列表
            }
        }else{ //没有开启维度
            dimlist.specialTopicPropertyGroupDOList=data.specialTopicPropertyGroupDOList;
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

            data.specialLength=dimlist.specialTopicPropertyGroupDOList.length;//分类的长度
            data.specialTopicPropertyGroupDOList=dimlist.specialTopicPropertyGroupDOList;


            var specialTopic = results.specialTopic.code == 0 ?  results.specialTopic.data && results.specialTopic.data.rows :  []

            //最大20页
            var pageIndexArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];

            if (results.list && results.list.totalPages < 20) {
                pageIndexArr.length = results.list.totalPages;
            }
            paramsObj.topicPropertyQueryDTOList=JSON.stringify(paramsObj.topicPropertyQueryDTOList)       
          
        }
        console.log(specialTopic,'specialTopic-----------------------------') 
        return {
                data:data,
                list:results.listTopicContents.data,
                specialTopic:specialTopic,
                pageIndexArr:pageIndexArr,
                urlParams:paramsObj
            };
    }
}