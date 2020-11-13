/**
 *
 */


const render = require("../common/render");
const server = require("../models/index");
const api = require("../api/api");
const appConfig = require("../config/app-config");
const util = require("../common/util");

const cc = require('../common/cc')

const getData = cc(async (req,res)=>{
    let iszhizhuC = req.url.includes('zhizhuc')
    let navFatherId = ''
    let urlobj = req.params.id.split('-');
    let  categoryId = urlobj[0];
    let format = urlobj[1]||'';
    format =format?format.toLowerCase():'all';
    let currentPage =urlobj[2];
    currentPage = currentPage?Number(currentPage.replace('p','')):1;
    let sortField = urlobj[3]||'';  // 排序
    let attributeGroupId = urlobj[4]   
    let attributeId = urlobj[5]
    let urlSelectId = urlobj[6]?JSON.parse(decodeURIComponent(urlobj[6])):[]  
    var deleteAttributeGroupId = urlobj[7]
    console.log('urlSelectId:',urlSelectId)
    let categoryTitle = await getCategoryTitle(req,res,categoryId,attributeGroupId,attributeId,urlSelectId,deleteAttributeGroupId)
    // console.log('categoryTitle:',JSON.stringify(categoryTitle))
    if (categoryTitle.data&&categoryTitle.data.level1){
        categoryTitle.data.level1.forEach(item=>{
            if(item.select==1) {
                navFatherId = item.nodeCode;
            }
        })
    }
    // 获取 属性组和id
    let selectId  = []
    let specificsIdList = []
    if(categoryTitle.data&&categoryTitle.data.specificsInfos){
        categoryTitle.data.specificsInfos.forEach(item=>{
             if(item.select == '1'){
                 item.subSpecificsList.forEach(k=>{
                     if(k.select == '1'){
                        let m = {
                            attributeGroupId:item.id,
                            attributeId:k.id
                         }
                         selectId.push(m)
                         specificsIdList.push(k.id)
                     }
                 })
             }
        })
    }
    console.log('selectId:',selectId,navFatherId)
    let recommendList = {}
    let categoryPage = {}
    if(navFatherId){
        
        categoryPage = { //分类页
            topbanner:`PC_M_FC_all_${navFatherId}_topbanner`,//顶部banner图
            rightbanner:`PC_M_FC_all_${navFatherId}_rightbanner`,//分类页-右侧banner
            zhuanti:`PC_M_FC_all_${navFatherId}_zhuanti`,//分类页-右侧专题
            friendLink:'PC_M_FC_yqlj' //友情链接
        }
        recommendList  =  await getRecommendList(req,res,categoryPage)
        console.log('recommendList:',JSON.stringify(recommendList))
    } 
    let list = await getList(req,res,categoryId,sortField,format,currentPage,specificsIdList)
    let tdk = await getTdk(req,res,categoryId)
    let words = await getWords(req,res)
    handleResultData(req,res,categoryTitle,recommendList,list,tdk,words,categoryId,currentPage,format,sortField,navFatherId,attributeGroupId,attributeId,selectId,iszhizhuC,categoryPage)
})


module.exports = {
    getData:getData
}


function getCategoryTitle(req,res,categoryId,attributeGroupId,attributeId,urlSelectId,deleteAttributeGroupId){
    let addId = attributeGroupId&&attributeId?{attributeGroupId,attributeId}:''
    // 先删除选中的同级属性
    urlSelectId =   urlSelectId.filter(item=>{
        return item.attributeGroupId!= attributeGroupId &&item.attributeGroupId!=deleteAttributeGroupId
    })
    
    if(addId){
        urlSelectId.push(addId)
    }
  console.log('urlSelectId:',urlSelectId)
    req.body = {
        nodeCode:categoryId,
        attributeGroupList:urlSelectId
    }
    return server.$http(appConfig.apiNewBaselPath+api.category.navForCpage,'post', req,res,true)
}

function getRecommendList(req,res,categoryPage){
    let params=[];
    for (let k in categoryPage){
        params.push(categoryPage[k])
    }
    req.body = params
    return server.$http(appConfig.apiNewBaselPath+api.category.recommendList,'post', req,res,true)
}

function getList(req,res,categoryId,sortField,format,currentPage,specificsIdList){
    req.body = {
        nodeCode: categoryId,
        sortField: sortField == 'default'?'':sortField,
        format: format=='all'?'':format,
        currentPage:currentPage,
        pageSize:40,
        specificsIdList:specificsIdList
    };
    return server.$http(appConfig.apiNewBaselPath+api.category.list,'post', req,res,true)
}
function getTdk(req,res,categoryId){
    return server.$http(appConfig.apiNewBaselPath + api.tdk.getTdkByUrl.replace(/\$url/, '/c/'+categoryId+'.html'), 'get',req,res,true);
}

function getWords(req,res){
  
    req.body = {
        currentPage:1,
        pageSize:6,
        siteCode:4
    }
    return server.$http(appConfig.apiNewBaselPath+api.category.words,'post', req,res,true)
}

function handleResultData(req,res,categoryTitle,recommendList,list,tdk,words,categoryId,currentPage,format,sortField,navFatherId,attributeGroupId,attributeId,selectId,iszhizhuC,categoryPage){
   
    var results =  Object.assign({categoryTitle,recommendList,list,tdk,words},) || {};
    var pageObj = {};
    var pageArr_f = [];
    var pageArr_b = [];
    if(results.list&&results.list.data&&results.list.data.rows) {
        // 页码处理
        pageObj = results.list.data;
        var totalPages = pageObj.totalPages;
        totalPages = totalPages>20?20:totalPages;
        if(pageObj.rows.length>0) {
            if(currentPage>5) {
                pageArr_f = [1,'···'];
                pageArr_f.push(currentPage-2)
                pageArr_f.push(currentPage-1)
                pageArr_f.push(currentPage)
            }else {
                for(var i=0;i<currentPage;i++) {
                    pageArr_f.push(i+1);
                }
            }
            if(totalPages-5>currentPage){
                pageArr_b.push(currentPage+1)
                pageArr_b.push(currentPage+2)
                pageArr_b.push(currentPage+3)
                pageArr_b.push(currentPage+4)
                pageArr_b.push(currentPage+5)
                pageArr_b.push('···')
                pageArr_b.push(totalPages)
            }else {
                for(var i=currentPage;i<totalPages;i++) {
                    pageArr_b.push(i+1);
                }
            }
        }
    }
    if(results.tdk && results.tdk.data){
        results.list.data = results.list.data||{};
        results.list.data.tdk = results.tdk.data;
    }
    var pageIndexArr = pageArr_f.concat(pageArr_b)
    results.reqParams = {
        cid: categoryId,
        currentPage: currentPage,
        totalPages:totalPages,
        fileType: format,
        sortField: iszhizhuC?(sortField|| 'default'):sortField,
        pageIndexArr: pageIndexArr,
        attributeGroupId:attributeGroupId,
        attributeId,
        selectId:encodeURIComponent(JSON.stringify(selectId))
    };

   // 推荐位 banner
//    var topbannerId = 'topbanner_'+navFatherId;
//    var rightbannerId = 'rightbanner_'+navFatherId;
//    var zhuantiId = 'zhuanti_'+navFatherId;
var topbannerId = 'topbanner';
   var rightbannerId = 'rightbanner';
   var zhuantiId = 'zhuanti';
   results.recommendList.data && results.recommendList.data.map(item=>{
        if(item.pageId == categoryPage[topbannerId]){
            //顶部banner
            results.topbannerList=util.handleRecommendData(item.list).list || [];  //
        }else if(item.pageId == categoryPage[rightbannerId]){
            // 右上banner
            results.rightBannerList=util.handleRecommendData(item.list).list || [];
        }else if(item.pageId == categoryPage[zhuantiId]){
            // 专题
            results.zhuantiList=util.handleRecommendData(item.list).list || [];
        } else if(item.pageId == categoryPage.friendLink){
            // 友情链接
            results.friendLink = util.dealHref(item).list || [];
        }
    })

    //热点搜索
    results.words.data && results.words.data.rows.map(item=>{
        item.linkurl = '/node/s/'+item.specialTopicId+'.html'
    })
    
    results.categoryId = categoryId   // 登录时传入当前分类id
    results.isCategoryRender = true
    results.iszhizhuC = iszhizhuC
    render("category/home", results, req, res);
}



