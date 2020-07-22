/**
 *
 */

var async = require("async");
var render = require("../common/render");
var server = require("../models/index");
var api = require("../api/api");
var appConfig = require("../config/app-config");
var util = require("../common/util");
var request = require('request');
var navFatherId = ''; //一级导航ID
var categoryId = '';
var format = '';
var currentPage = 1;
var sortField = '';
var list = function (req) {
    var urlobj = req.params.id.split('-');
    categoryId = urlobj[0];
    format = urlobj[1]||'';
    format =format?format.toLowerCase():'all';
    currentPage =urlobj[2];
    currentPage = currentPage?Number(currentPage.replace('p','')):1;
    sortField = urlobj[3]||'';
    return {
          // 导航分类及属性
        categoryTitle: function (callback) {
            req.body = {
                classId:categoryId
            };
            var opt = {
                method: 'POST',
                url: appConfig.apiNewBaselPath+api.category.navForCpage,
                body:JSON.stringify({classId:categoryId}),
                headers: {
                    'Content-Type': 'application/json',
                    'Cookie': 'cuk=' + req.cookies.cuk + ' ;JSESSIONID=' + req.cookies.JSESSIONID,
                },
            };
            request(opt, function (err, res1, body) {
                console.log('detail-list-------------------:',JSON.parse(body))
                if (body) {
                    var data = JSON.parse(body);
                    console.log(JSON.stringify(data),'navForCpagenavForCpage')
                    if (data.data&&data.data.level1){
                        data.data.level1.forEach(item=>{
                            if(item.select==1) {
                                navFatherId = item.id;
                            }
                        })
                    }
                    let params=[];
                    for (let k in util.pageIds.categoryPage){
                        if (k.includes(navFatherId)||k=='friendLink') {
                            params.push(util.pageIds.categoryPage[k])
                        }
                    }
                    request({
                        method: 'POST',
                        url: appConfig.apiNewBaselPath+api.category.recommendList,
                        body:JSON.stringify(params),
                        headers: {
                            'Content-Type': 'application/json',
                            'Cookie': 'cuk=' + req.cookies.cuk + ' ;JSESSIONID=' + req.cookies.JSESSIONID,
                        }
                    },function (err2, res2, body1){
                       var results = JSON.parse(body1)
                       if(results) {
                            data.recommendList = results;
                            callback(null, data);
                       }else {
                            callback(null, null);
                       }
                       
                    })
                   
                } else {
                    callback(null, null);
                }
            })
        },
        list: function (callback) {
            // console.log(req.params.id,'url')
            req.body = {
                categoryId: categoryId,
                sortField: sortField,
                format: format=='all'?'':format,
                currentPage:currentPage,
                pageSize:16
            };
            server.post(appConfig.apiNewBaselPath+api.category.list, callback, req);
        },
        tdk:function(callback){
            server.get(appConfig.newBasePath + api.tdk.getTdkByUrl.replace(/\$url/, '/c/'+categoryId+'.html'), callback, req);
        },
        words: function (callback) {
            let params= {
                currentPage:1,
                pageSize:6,
                siteCode:4
            }
            req.body = params;
            server.post(appConfig.apiNewBaselPath+api.category.words, callback, req);
        }
        // recommendList:function(callback){ //推荐位列表  包含banner 专题 word ppt exl
        //     let params=[];
        //     console.log('navFatherId -------------:',navFatherId)
        //     for (let k in util.pageIds.categoryPage){
        //         if (k.includes(navFatherId)) {
        //             params.push(util.pageIds.categoryPage[k])
        //         }
        //     }
        //     req.body = params;
        //     console.log('req.body-------------:',JSON.stringify(req.body))
        //     server.post(appConfig.apiNewBaselPath+api.category.recommendList, callback, req);
        // }
       
    }
};
//测试数据

module.exports = {
    //搜索服务--api接口--条件搜索--同步
    getData: function (req, res) {
        return async.series(list(req), function (err, results) {
            // console.log(req.query, 'req.query');
            var results = results || {};
            var pageObj = {};
            var pageArr_f = [];
            var pageArr_b = [];
            if(results.list&&results.list.data&&results.list.data.rows) {
                // 页码处理
                pageObj = results.list.data;
                var totalPages = pageObj.totalPages;
                totalPages = totalPages>20?20:totalPages;
                console.log(totalPages,'pageObj.totalPages')
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
           results.categoryTitle.recommendList.data && results.categoryTitle.recommendList.data.map(item=>{
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
            render("category/home", results, req, res);
        })


    },

};