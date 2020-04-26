var async = require("async");
var _=require('lodash')
var render = require("../common/render");
var server = require("../models/index");
var appConfig = require("../config/app-config");
var api = require("../api/api");
var util = require("../common/util");
//测试

class specialModule{
    constructor(req,res){
       this.state={
           paramsObj:util.getSpecialParams(req.url),
           req:req,
           res:res,
           detail:'',//详情数据
           listData:'',  //列表数据
           specialTopic:'',
           specialList:[] //分类及属性  
       }
       this.render();
    }
    render(){
        return async.series(this.init(), (err, results)=>{
            this.finishResults()
        })
    }
    init(){ //初始化
        return{
            findSpecialTopic:async ()=> { //获取专题详情
                let { paramsObj,req,res }=this.state;
                const url=appConfig.apiSpecialPath + api.special.findSpecialTopic.replace(/\$id/, paramsObj.specialTopicId);
                this.state.detail=await server.$http(url,'get', req, res, true);
                if(paramsObj.dimensionId && this.state.detail.data.dimensionStatus==0){ //获取当前当前的维度列表
                    let index=_.findIndex(this.state.detail.data.specialTopicDimensionDOList,['dimensionId',paramsObj.dimensionId])
                    this.state.specialList=this.state.detail.data.specialTopicDimensionDOList[index].specialTopicPropertyGroupDOList; //当前维度下的分类
                }else{// 无维度的情况
                    this.state.specialList=this.state.detail.data.specialTopicPropertyGroupDOList; //
                }
                console.warn(this.state.detail,'详情数据')
            },
            listTopicContents:async ()=> { //获取专题列表
                let { paramsObj,req,res,specialList }=this.state;
                let arr=[],uid='';        
                if((paramsObj.topicPropertyQueryDTOList.length>0)){
                    arr=util.getPropertyParams(paramsObj.topicPropertyQueryDTOList,specialList);
                }
                req.cookies.ui ?  uid=JSON.parse(req.cookies.ui).uid : ''
                this.state.req.body = {
                    uid:uid,
                    specialTopicId: paramsObj.specialTopicId,//专题id
                    dimensionId: paramsObj.dimensionId || "",//维度id
                    topicPropertyQueryDTOList: arr  || [],
                    sortFlag: +paramsObj.sortFlag || 0,//排序,0-综合排序,1-最新上传
                    currentPage: +paramsObj.currentPage || 1,
                    pageSize: 40
                };
                console.warn(req.body,'req.body****************') 
                this.state.listData=await server.$http(appConfig.apiSpecialPath + api.special.listTopicContents,'post', req,res,true);
                _.set(this.state.listData,'data.tdk.title',`${this.state.detail.data.topicName}第${paramsObj.currentPage}页爱问共享资料_在线资料分享平台`)
                console.warn(this.state.listData,'列表数据')
            },
            specialTopic:async ()=> {
                let { req,res,detail }=this.state;
                req.body = {
                    currentPage:1,
                    pageSize:30,
                    name: detail.data && detail.data.topicName   // 需要依赖 专题的名称
                }
                let specialData=await server.$http(appConfig.apiSpecialPath + api.special.specialTopic, 'post', req,res);
                this.state.specialTopic = specialData.data && specialData.data.rows || [];
                console.warn(this.state.specialTopic,'热点数据')
            }
        }
    }
    finishResults(){
        let { paramsObj,req,res,detail,listData,specialTopic }=this.state;
        var data=detail.data;
        // 处理tag标签选中
        var dimlist={};
        if(data && data.dimensionStatus==0){ //开启了维度
           
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

            paramsObj.topicPropertyQueryDTOList=JSON.stringify(paramsObj.topicPropertyQueryDTOList)       
          
        }

         //最大20页
         var pageIndexArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
         if (listData.data && listData.data.totalPages < 20) {
             pageIndexArr.length = listData.data.totalPages;
         }

      
        let results={
                data:data,
                list:listData,
                specialTopic:specialTopic,
                pageIndexArr:pageIndexArr,
                urlParams:paramsObj,
                isOpen:req.cookies.isOpen,
            };
            console.warn(results,'results')
        render("special/index", results, this.state.req, this.state.res);  
    }
}
module.exports=specialModule
