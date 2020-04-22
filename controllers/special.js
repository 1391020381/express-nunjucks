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
//            res:res,
//            detail:'',//详情数据
//            listData:'',  //列表数据
//            specialTopic:'',
//            specialList:[] //分类及属性  
//        }
//        this.render();
//     }
//     render(){
//         return async.series(this.init(), (err, results)=>{
//             console.log(results,'results')
//            this.finishResults()
//         })
//     }
//     init(){ //初始化
//         return{
//             findSpecialTopic:async function (callback) { //获取专题详情
//                 let { paramsObj,req,res }=this.state;
//                 const url=appConfig.apiSpecialPath + api.special.findSpecialTopic.replace(/\$id/, paramsObj.specialTopicId);
//                 this.state.detail=await server.$http(url,'get', req, res, true);
//                 if(paramsObj.dimensionId){ //获取当前当前的维度列表
//                     let index=_.findIndex(this.state.detail.data.specialTopicDimensionDOList,['dimensionId',paramsObj.dimensionId])
//                     this.state.specialList=this.state.detail.data.specialTopicDimensionDOList[index]; //当前维度下的分类
//                 }
//                 callback(null,this.state.detail);
//             },
//             listTopicContents:async (callback)=> { //获取专题列表
//                 console.log('1233333333333333333333333333333333333333')
//                 let { paramsObj,req,res }=this.state;
//                 let arr=[],uid='';
//                 if((paramsObj.topicPropertyQueryDTOList.length>0)){
//                     arr=util.getPropertyParams(paramsObj.topicPropertyQueryDTOList,req.specialList.specialTopicPropertyGroupDOList);
//                 }
//                 req.cookies.userInfo ?  uid=JSON.parse(req.cookies.userInfo).uid : ''
//                 req.body = {
//                     uid:uid,
//                     specialTopicId: paramsObj.specialTopicId,//专题id
//                     dimensionId: paramsObj.dimensionId || "",//维度id
//                     topicPropertyQueryDTOList: arr  || [],
//                     sortFlag: +paramsObj.sortFlag || 0,//排序,0-综合排序,1-最新上传
//                     currentPage: +paramsObj.currentPage || 1,
//                     pageSize: 12
//                 };
//                 console.log(req.body,'req.body****************') 
//                 this.state.listData=await server.$http(appConfig.apiSpecialPath + api.special.listTopicContents,'post', req,res,true);
//                 callback()
//             },
//             specialTopic:async (callback)=> {
//                 let { req,res,detail }=this.state;
//                 req.body = {
//                     currentPage:1,
//                     pageSize:30,
//                     name: detail.data && detail.data.topicName   // 需要依赖 专题的名称
//                 }
//                 let specialData=await server.$http(appConfig.apiSpecialPath + api.special.specialTopic, 'post', req,res);
//                 this.state.specialTopic = specialData.data && specialData.data.rows || [];
//                 callback()
//             }
//         }
//     }
//     finishResults(){
//         let { paramsObj,req,res,detail,listData,specialTopic }=this.state;
//         var data=detail.data;
//         // 处理tag标签选中
//         var dimlist={};
//         if(data.dimensionStatus==0){ //开启了维度
           
//             if(paramsObj.dimensionId){
//                 var index=_.findIndex(data.specialTopicDimensionDOList,['dimensionId',paramsObj.dimensionId])
//                  dimlist=data.specialTopicDimensionDOList[index]; //当前的维度列表
//             }else{
//                  dimlist=data.specialTopicDimensionDOList && data.specialTopicDimensionDOList[0]; //当前的维度列表
//             }
//         }else{ //没有开启维度
//             dimlist.specialTopicPropertyGroupDOList=data.specialTopicPropertyGroupDOList;
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

//             data.specialLength=dimlist.specialTopicPropertyGroupDOList.length;//分类的长度
//             data.specialTopicPropertyGroupDOList=dimlist.specialTopicPropertyGroupDOList;


//             //最大20页
//             var pageIndexArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];

//             if (listData.data && listData.data.totalPages < 20) {
//                 pageIndexArr.length = listData.data.totalPages;
//             }
//             paramsObj.topicPropertyQueryDTOList=JSON.stringify(paramsObj.topicPropertyQueryDTOList)       
          
//         }
      
//         let results={
//                 data:data,
//                 list:listData.data,
//                 specialTopic:specialTopic,
//                 pageIndexArr:pageIndexArr,
//                 urlParams:paramsObj,
//                 isOpen:req.cookies.isOpen
//             };
//         render("special/index", results, this.state.req, this.state.res);  
//     }
// }

// module.exports=specialModule


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
                            if(item.data){
                                req.topicName = item.data&&item.data.topicName //   specialTopic 需要topicName
                                if(paramsObj.dimensionId && item.data.dimensionStatus==0){ //获取当前当前的维度列表
                                    var index=_.findIndex(item.data.specialTopicDimensionDOList,['dimensionId',paramsObj.dimensionId])
                                    req.specialList=item.data.specialTopicDimensionDOList && item.data.specialTopicDimensionDOList[index].specialTopicPropertyGroupDOList; //
                                }else{  // 无维度的情况
                                    req.specialList=item.data.specialTopicPropertyGroupDOList; //
                                }
                                console.log(item,'item--------------------')
                              
                            }
                            callback(null,item)
                        })
                        
                      
                    },
                    listTopicContents:function(callback){
                        var arr=[],uid='';
                        if((paramsObj.topicPropertyQueryDTOList.length>0)){
                            arr=util.getPropertyParams(paramsObj.topicPropertyQueryDTOList,req.specialList);
                        }
                        req.cookies.ui ?  uid=JSON.parse(req.cookies.ui).uid : ''
                        req.body = {
                            uid: uid,
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

                var results=_this.dealData(paramsObj,results,req)  //处理数据 添加全部 切换
                render("special/index", results, req, res);
            })
            //dealData
    },
    dealData(paramsObj,results,req){
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
                urlParams:paramsObj,
                isOpen:req.cookies.isOpen
            };
    }
}