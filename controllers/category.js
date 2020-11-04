/**
 *
 */

const async = require("async");
const render = require("../common/render");
const server = require("../models/index");
const api = require("../api/api");
const appConfig = require("../config/app-config");
const util = require("../common/util");
const request = require('request');
const cc = require('../common/cc')

const getData = cc(async (req,res)=>{
    let navFatherId = ''
    let urlobj = req.params.id.split('-');
    let  categoryId = urlobj[0];
    let format = urlobj[1]||'';
    format =format?format.toLowerCase():'all';
    let currentPage =urlobj[2];
    currentPage = currentPage?Number(currentPage.replace('p','')):1;
    let sortField = urlobj[3]||'';

    let categoryTitle = await getCategoryTitle(req,res,categoryId)

    if (categoryTitle.data&&categoryTitle.data.level1){
        categoryTitle.data.level1.forEach(item=>{
            if(item.select==1) {
                navFatherId = item.id;
            }
        })
    }
    let recommendList = {}
    if(navFatherId){
        recommendList  =  await getRecommendList(req,res,navFatherId)
    } 
    let list = await getList(req,res,categoryId,sortField,format,currentPage)
    let tdk = await getTdk(req,res,categoryId)
    let words = await getWords(req,res)
    handleResultData(req,res,categoryTitle,recommendList,list,tdk,words,categoryId,currentPage,format,sortField,navFatherId)
})


module.exports = {
    getData:getData
}


function getCategoryTitle(req,res,categoryId){
    req.body = {
        classId:categoryId
    }
    return server.$http(appConfig.apiNewBaselPath+api.category.navForCpage,'post', req,res,true)
}

function getRecommendList(req,res,navFatherId){
    let params=[];
    for (let k in util.pageIds.categoryPage){
        if (k.includes(navFatherId)||k=='friendLink') {
            params.push(util.pageIds.categoryPage[k])
        }
    }
    req.body = params
    return server.$http(appConfig.apiNewBaselPath+api.category.recommendList,'post', req,res,true)
}

function getList(req,res,categoryId,sortField,format,currentPage){
    req.body = {
        categoryId: categoryId,
        sortField: sortField,
        format: format=='all'?'':format,
        currentPage:currentPage,
        pageSize:16
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

function handleResultData(req,res,categoryTitle,recommendList,list,tdk,words,categoryId,currentPage,format,sortField,navFatherId){
   
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
            if(currentPage>4) {
                pageArr_f = [1,'···'];
                pageArr_f.push(currentPage-2)
                pageArr_f.push(currentPage-1)
                pageArr_f.push(currentPage)
            }else {
                for(var i=0;i<currentPage;i++) {
                    pageArr_f.push(i+1);
                }
            }
            if(totalPages-3>currentPage){
                pageArr_b.push(currentPage+1)
                pageArr_b.push(currentPage+2)
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
        sortField: sortField,
        pageIndexArr: pageIndexArr
    };

   // 推荐位 banner
   var topbannerId = 'topbanner_'+navFatherId;
   var rightbannerId = 'rightbanner_'+navFatherId;
   var zhuantiId = 'zhuanti_'+navFatherId;
   results.recommendList.data && results.recommendList.data.map(item=>{
        if(item.pageId == util.pageIds.categoryPage[topbannerId]){
            //顶部banner
            results.topbannerList=util.handleRecommendData(item.list).list || [];  //
        }else if(item.pageId == util.pageIds.categoryPage[rightbannerId]){
            // 右上banner
            results.rightBannerList=util.handleRecommendData(item.list).list || [];
        }else if(item.pageId == util.pageIds.categoryPage[zhuantiId]){
            // 专题
            results.zhuantiList=util.handleRecommendData(item.list).list || [];
        } else if(item.pageId == util.pageIds.categoryPage.friendLink){
            // 友情链接
            results.friendLink = util.dealHref(item).list || [];
        }
    })

    //热点搜索
    results.words.data && results.words.data.rows.map(item=>{
        item.linkurl = '/node/s/'+item.specialTopicId+'.html'
    })
    // console.log(JSON.stringify(results.list), 'results.list');
    //tkd 后端部分接口写的是tkd字段
    // 遍历classId
    var classArr = []
    results.categoryId = categoryId   // 登录时传入当前分类id
    render("category/home", results, req, res);
}
