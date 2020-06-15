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
           uid:'',
           detail:'',//详情数据
           listData:'',  //列表数据
           specialTopic:'',
           tdkData:'',
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
                const url=appConfig.apiNewBaselPath + api.special.findSpecialTopic.replace(/\$id/, paramsObj.specialTopicId);
                this.state.detail=await server.$http(url,'get', req, res, true);
                if(this.state.detail.data.templateCode!=='ishare_zt_model1' || !this.state.detail.data){
                    res.redirect('/node/404.html')
                    return
                }
              
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
                let arr=[];        
                if((paramsObj.topicPropertyQueryDTOList.length>0)){
                    arr=util.getPropertyParams(paramsObj.topicPropertyQueryDTOList,specialList);
                }
                req.cookies.ui ?  this.state.uid=JSON.parse(req.cookies.ui).uid : ''
                this.state.req.body = {
                    uid:this.state.uid,
                    specialTopicId: paramsObj.specialTopicId,//专题id
                    dimensionId: paramsObj.dimensionId || "",//维度id
                    topicPropertyQueryDTOList: arr  || [],
                    sortFlag: +paramsObj.sortFlag || 0,//排序,0-综合排序,1-最新上传
                    currentPage: +paramsObj.currentPage || 1,
                    pageSize: 40
                };
                console.warn(req.body,'req.body****************') 
                this.state.listData=await server.$http(appConfig.apiNewBaselPath + api.special.listTopicContents,'post', req,res,true);
                console.warn(this.state.listData,'列表数据')
            },
            specialTopic:async ()=> {
                let { req,res,detail }=this.state;
                req.body = {
                    currentPage:1,
                    pageSize:30,
                    name: detail.data && detail.data.topicName   // 需要依赖 专题的名称
                }
                let specialData=await server.$http(appConfig.apiNewBaselPath + api.special.specialTopic, 'post', req,res);
                this.state.specialTopic = specialData.data && specialData.data.rows || [];
                console.warn(this.state.specialTopic,'热点数据')
            },
            getTdkByUrl:async()=>{ //tdk
                let { paramsObj,req,res }=this.state;
                let data=await server.$http(appConfig.apiNewBaselPath + api.tdk.getTdkByUrl.replace(/\$url/, '/node/s/'+ paramsObj.specialTopicId + '.html'), 'get', req,res,true)
                let topicName = this.state.detail.data.topicName;
                let str=topicName.length<=12 ? (topicName +'_'+ topicName) : topicName;//专题字数小于等于12时
                if(data.code == '0' && data.data){
                    data.data.title = data.data.title + '_第' + paramsObj.currentPage + '页_爱问共享资料'
                    this.state.tdkData=data.data
                }else{
                    this.state.tdkData = {
                        pageTable: '专题页',
                        url: '/node/s/'+ paramsObj.specialTopicId +'.html',
                        title: str + '下载 - 爱问共享资料',
                        description: '爱问共享资料提供优质的' + topicName + '下载，可编辑，可替换，更多' + topicName+'资料，快来爱问共享资料下载!',
                        keywords:  (topicName + "," +topicName) + '下载',
                    }
                }
               

            },
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
            data ? dimlist.specialTopicPropertyGroupDOList=data.specialTopicPropertyGroupDOList : '';
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

        let canonicalUrl=paramsObj.currentPage>1 ? `/node/s/${paramsObj.specialTopicId}.html` : '';
        _.set(this.state.listData,'data.tdk',this.state.tdkData)
        let results={
            data:data,
            list:this.state.listData,
            // list:{
            //     data:{
            //         rows:[{contentName:'发嘀咕嘀咕郭德纲灌灌风格个复活复活海关海关监管和股份辉煌过后'}]
            //     }
            // },
            specialTopic:specialTopic,
            pageIndexArr:pageIndexArr,
            urlParams:paramsObj,
            isOpen:req.cookies.isOpen,
            uid:this.state.uid,
            tdk:{
                canonicalUrl:canonicalUrl
            }
        };
        console.warn(results,'results')
    render("special/index", results, this.state.req, this.state.res);  
       
    }
    
}
module.exports=specialModule
