const _=require('lodash')
const render = require("../common/render");
const server = require("../models/index");
const appConfig = require("../config/app-config");
const api = require("../api/api");
const util = require("../common/util");
const cc = require('../common/cc')
//测试


const renderPage = cc(async (req,res)=>{
     let  paramsObj = util.getSpecialParams(req.url)
     let detail = await getFindSpecialTopic(req,res,paramsObj)
    let  specialList = []
    let uid = ''
    if(req.cookies.ui){
        uid = JSON.parse(req.cookies.ui).uid
    }
     if(detail.data.templateCode!=='ishare_zt_model1' || !detail.data){
        res.redirect('/node/404.html')
        return
    }
  
    if(paramsObj.dimensionId && detail.data.dimensionStatus==0){ //获取当前当前的维度列表
        let index=_.findIndex(detail.data.specialTopicDimensionDOList,['dimensionId',paramsObj.dimensionId])
        specialList=detail.data.specialTopicDimensionDOList[index].specialTopicPropertyGroupDOList; //当前维度下的分类
    }else{// 无维度的情况
        specialList= detail.data.specialTopicPropertyGroupDOList; //
    }
    let listData = await getListTopicContents(req,res,paramsObj)
    // tdk
   let tdkData = await getTdkByUrl(req,res,paramsObj)
   let topicName = detail.data.topicName;
   let str=topicName.length<=12 ? (topicName +'_'+ topicName) : topicName;//专题字数小于等于12时
   if(tdkData.data&&tdkData.data.title){
    tdkData.data.title = tdkData.data.title + '_第' + paramsObj.currentPage + '页_爱问共享资料'
    tdkData=data.data
   }
   
  
  
  let specialData = await getSpecialTopic(req,res,detail.data.topicName)
  specialTopic = specialData.data && specialData.data.rows || []
  
  let recommendList = []
  let recommendListData = await getRecommendList(req,res)
  recommendListData.data && recommendListData.data.map(item=>{
    // 友情链接
    recommendList = util.dealHref(item).list || [];
})
handleDataResult(req,res,detail,listData,specialTopic,paramsObj,tdkData,recommendList,uid)
})

function getFindSpecialTopic(req,res,paramsObj){
    const url=appConfig.apiNewBaselPath + api.special.findSpecialTopic.replace(/\$id/, paramsObj.specialTopicId);
    return server.$http(url,'get', req, res, true);
}

function getListTopicContents(req,res,paramsObj){
    let arr=[];  
    let uid = ''      
    if((paramsObj.topicPropertyQueryDTOList.length>0)){
        arr=util.getPropertyParams(paramsObj.topicPropertyQueryDTOList,specialList);
    }
    req.cookies.ui ?  uid=JSON.parse(req.cookies.ui).uid : ''
    req.body = {
        uid:uid,
        specialTopicId: paramsObj.specialTopicId,//专题id
        dimensionId: paramsObj.dimensionId || "",//维度id
        topicPropertyQueryDTOList: arr  || [],
        sortFlag: +paramsObj.sortFlag || 0,//排序,0-综合排序,1-最新上传
        currentPage: +paramsObj.currentPage || 1,
        pageSize: 40
    };
  return  server.$http(appConfig.apiNewBaselPath + api.special.listTopicContents,'post', req,res,true)
}
function getTdkByUrl(req,res,paramsObj){
    return server.$http(appConfig.apiNewBaselPath + api.tdk.getTdkByUrl.replace(/\$url/, '/node/s/'+ paramsObj.specialTopicId + '.html'), 'get', req,res,true)
}
function getSpecialTopic(req,res,topicName){
    req.body = {
        currentPage:1,
        pageSize:30,
        siteCode:'4',
        topicName: topicName   // 需要依赖 专题的名称
    }
   return server.$http(appConfig.apiNewBaselPath + api.special.specialTopic, 'post', req,res);
}
function getRecommendList(req,res){
    req.body = [util.pageIds.special.friendLink]
  return server.$http(appConfig.apiNewBaselPath+api.index.recommendList, 'post', req,res); 
}

function handleDataResult(req,res,detail,listData,specialTopic,paramsObj,tdkData,recommendList,uid){
    var data=detail.data || {};
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
        dimlist.specialTopicPropertyGroupDOList&&dimlist.specialTopicPropertyGroupDOList.map(function(firstItem,firstIndex){
            firstItem.specialTopicPropertyDOList.unshift({
                propertyId:'all',
                propertyName:"全部",
                active:true,
                ids:firstItem.propertyGroupId+"_all"
            })
            firstItem.specialTopicPropertyDOList&&firstItem.specialTopicPropertyDOList.map(function(secondItem,secondIndex){
                secondItem.ids=firstItem.propertyGroupId+'_'+secondItem.propertyId;
                
            })                   
        })
        //查找到当前分类  及选中的tag
        var currentArr=[];
        dimlist.specialTopicPropertyGroupDOList&&dimlist.specialTopicPropertyGroupDOList.map(function(firstItem,firstIndex){
            firstItem.specialTopicPropertyDOList.map(function(secondItem,secondIndex){
                if(paramsObj.topicPropertyQueryDTOList.includes(secondItem.ids)){
                    currentArr.push({
                        firstIndex:firstIndex,
                        secondIndex:secondIndex,
                    })
                }                
            })    
        })
        currentArr&&currentArr.map(item=>{
            dimlist.specialTopicPropertyGroupDOList[item.firstIndex].specialTopicPropertyDOList.map(res=>{
                res.active=false;
            })
            dimlist.specialTopicPropertyGroupDOList[item.firstIndex].specialTopicPropertyDOList[item.secondIndex].active=true;
        })

        data.specialLength=dimlist.specialTopicPropertyGroupDOList&&dimlist.specialTopicPropertyGroupDOList.length;//分类的长度
        data.specialTopicPropertyGroupDOList=dimlist.specialTopicPropertyGroupDOList;

        paramsObj.topicPropertyQueryDTOList=JSON.stringify(paramsObj.topicPropertyQueryDTOList)       
      
    }

     //最大20页
     var pageIndexArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
     if (listData.data && listData.data.totalPages < 20) {
         pageIndexArr.length = listData.data.totalPages;
     }
    let canonicalUrl=paramsObj.currentPage>1 ? `/node/s/${paramsObj.specialTopicId}.html` : '';
    _.set(listData,'data.tdk',tdkData)
    let results={
        data:data,
        list:listData,
        // list:{
        //     data:{
        //         rows:[{contentName:'发嘀咕嘀咕郭德纲灌灌风格个复活复活海关海关监管和股份辉煌过后'}]
        //     }
        // },
        specialTopic:specialTopic,
        pageIndexArr:pageIndexArr,
        urlParams:paramsObj,
        isOpen:req.cookies.isOpen,
        uid:uid,
        tdk:{
            canonicalUrl:canonicalUrl
        }, 
        friendLink:recommendList
    };
   
  render("special/index", results, req, res);  
}
module.exports= {
    render:renderPage
}
