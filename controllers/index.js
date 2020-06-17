/**
 * office Controller
 * 办公频道 首页
 */
var async = require("async");
var server = require("../models/index");
var render = require("../common/render");
var util = require("../common/util");

module.exports = {
    render:function(res , req){
        return async.parallel({
            //获取首页数据
            officeIndex : function(callback){
                console.log('http://192.168.1.50:8770/gateway/pc/office/getIndexDatas')
                server.get('http://192.168.1.50:8770/gateway/pc/office/getIndexDatas', callback ,req);
                // let data = {"code":"0","message":"请求成功","msg":"请求成功","data":{"keywordList":[{"title":"简历模板啦啦模板啦啦","url":"http://www.sina.com","subKeywordList":[{"title":"PPT","url":"http://www.sina.com"},{"title":"TXTssssssss","url":"http://www.sina.com"},{"title":"DOC","url":"http://www.sina.com"},{"title":"PDF","url":"http://www.sina.com"}]},{"title":"PPT模板啦啦啦啦啦啦","url":"http://www.sina.com","subKeywordList":null},{"title":"图表模式","url":"http://www.baidu.com","subKeywordList":null},{"title":"办公二期","url":"http://www.baidu.com","subKeywordList":[{"title":"二期","url":null}]}],"bannerList":null,"recommendList":[{"title":"办公精选啦啦啦啦啦啦","pic":"http://pic.iask.com.cn/xP9B5VAPqR.jpg","url":"办公精选啦啦啦啦啦啦"},{"title":"限时特价啦啦啦啦啦啦","pic":"http://pic.iask.com.cn/xhG6R5uvER.png","url":"http://www.baidu.com"},{"title":"最受欢迎简历啦啦啦啦啦啦","pic":"http://pic.iask.com.cn/xmfXpU1ujT.png","url":""}],"columnList":[{"title":"点赞最多","subCategory":[{"title":"简历模板啦啦啦啦啦啦啦啦啦啦啦","files":[{"id":"135VX0rNoPR","title":"企业承包合同范本","pic":"http://pic.iask.com.cn/VCYxYHmQgSZ_small1.jpg","likeNum":15292,"enshrineNum":18192},{"id":"135eOxpwPTO","title":"测试测试测试测试测试测试测试测试测试测试测试测试测","pic":"http://pic.iask.com.cn/NPTQegDQx.jpg","likeNum":4107,"enshrineNum":1110},{"id":"1QLAxkbOk8","title":"大于50页","pic":"http://pic.iask.com.cn/IYKxN2btgQj_small1.jpg","likeNum":2,"enshrineNum":4},{"id":"1TBDw8D6CC","title":"11111111111111","pic":"http://pic.iask.com.cn/pic_data_normal.jpg","likeNum":1,"enshrineNum":6},{"id":"EFG1h1qobt","title":"4-用户上传-doc","pic":"http://pic.iask.com.cn/uB3a8aShlj3_small1.jpg","likeNum":26425,"enshrineNum":7904},{"id":"eZvkJf1gje","title":"工作总结汇报通用PPT模板","pic":"http://pic.iask.com.cn/eFyBJI76Sp.jpg","likeNum":4081,"enshrineNum":1145},{"id":"qpJFdtqKgP","title":"Eric1565069585591_privilege","pic":"http://pic.iask.com.cn/zIsyMUdV98P_small1.jpg","likeNum":47279,"enshrineNum":11372},{"id":"qyu97uqeTF","title":"Eric1565171432615_volumn","pic":"http://pic.iask.com.cn/uf27UDxOilt_small1.jpg","likeNum":47381,"enshrineNum":7038}]},{"title":"PPT模板11","files":[{"id":"pWNhmpm9jN","title":"公司企业文化建设方案(经典)","pic":"http://pic.iask.com.cn/pVRxhyRg6cO_small1.jpg","likeNum":0,"enshrineNum":1},{"id":"qaxgmUcpLF","title":"公文写作培训PPT","pic":"http://pic.iask.com.cn/haLP4QgMb2B_small1.jpg","likeNum":0,"enshrineNum":0},{"id":"qf7a0ArWaj","title":"供应商管理制度及操作流程","pic":"http://pic.iask.com.cn/pic_data_normal.jpg","likeNum":0,"enshrineNum":0},{"id":"qogWRqqETJ","title":"购销合同模板范本","pic":"http://pic.iask.com.cn/dcy6dkKzuel_small1.jpg","likeNum":0,"enshrineNum":0},{"id":"qsQVDQGnM3","title":"国有企业组织结构分支图","pic":"http://pic.iask.com.cn/PXmCfd685pV_small1.jpg","likeNum":0,"enshrineNum":0}]},{"title":"图表模板","files":[{"id":"10088448","title":"2011年考研专业深度分析(重点大学重点专业)免费下载","pic":"http://pic.iask.com.cn/pic_data_normal.jpg","likeNum":2,"enshrineNum":6},{"id":"11108250","title":"JEWELCAD珠宝设计实用教程","pic":"http://pic.iask.com.cn/pic_data_normal.jpg","likeNum":3,"enshrineNum":17},{"id":"2AKy17zp42","title":"大型电商分布式系统实践 - 第三课","pic":"http://pic.iask.com.cn/gwyJg49uekP_small1.jpg","likeNum":0,"enshrineNum":10},{"id":"FbheQo60q3","title":"6-用户上传-doc","pic":"http://pic.iask.com.cn/MRiy962u2P9_small1.jpg","likeNum":0,"enshrineNum":0}]},{"title":"总结汇报","files":[{"id":"1QLAxkbOk8","title":"大于50页","pic":"http://pic.iask.com.cn/IYKxN2btgQj_small1.jpg","likeNum":2,"enshrineNum":4},{"id":"8eFkd5DaL","title":"41物资仓储管理办法-viwen","pic":"http://pic.iask.com.cn/e9Xrei824d.jpg","likeNum":1,"enshrineNum":19},{"id":"rhVHcl08j","title":"测试BUG","pic":"http://pic.iask.com.cn/5toDwtjno5L.jpg","likeNum":109,"enshrineNum":122}]}]},{"title":"最新发布","subCategory":null},{"title":"热门下载","subCategory":null},{"title":"测试","subCategory":[{"title":"111111","files":[{"id":"11108250","title":"JEWELCAD珠宝设计实用教程","pic":"http://pic.iask.com.cn/pic_data_normal.jpg","likeNum":3,"enshrineNum":17},{"id":"1UnV1xGQDe","title":"NB@SCRCU_数据采集方案书NB@SCRCU_数据采集方案书NB@SCRCU_数据采集方案书NB@SCRCU_数据采集方案书NB@SCRCU_数据采集方案书","pic":"http://pic.iask.com.cn/mC2i6n3X7dS_small1.jpg","likeNum":46459,"enshrineNum":26205}]}]}],"tdk":{"title":"null_null_null免费下载_爱问共享资料","keywords":"null,null,null","description":"爱问共享资料提供null,null,null精品资料的在线阅读及下载，同时您还可以和千万网友分享自己的人力资源管理资料文档，获得相应的下载积分。爱问共享资料平台"},"categoryList":null}}
                // callback(null, data);
            },
            recommendList:function(callback){ //推荐列表  包含banner 专题 word ppt exl
                console.log('http://192.168.1.50:8770/gateway/recommend/config/info')
                let params=[];
                for (let k in util.pageIds.index){
                    params.push(util.pageIds.index[k])
                }
                req.body = params;
                server.post('http://192.168.1.50:8770/gateway/recommend/config/info', callback, req);
               
              
            }
        } , function(err, results){
            console.log('$$$$$$$$$$$$$$$$$$$$$$$$')
            console.log(results,'results.recommendList----')
            if(results && results.officeIndex && results.officeIndex.data){
                results.tdk = results.officeIndex.data.tdk;
            }
            // 推荐位处理数据
            results.contentList=[];
            if(results.recommendList){
                results.recommendList.data && results.recommendList.data.map(item=>{
                    if(item.pageId == util.pageIds.index.ub){
                        results.bannerList=util.dealHref(item).list || [];  
                    }else if(item.pageId == util.pageIds.index.zt){
                        results.specialList=util.dealHref(item).list || [];
                    }else if(item.pageId == util.pageIds.index.pptrelevant){
                        item && results.contentList.push(item);
                    }else if(item.pageId == util.pageIds.index.docrelevant){
                        item && results.contentList.push(item);
                    }else if(item.pageId == util.pageIds.index.xlsrelevant){
                        item && results.contentList.push(item);
                    }
                })
            }

            console.warn(results.recommendList.data,'results.recommendList.data')
            console.log(results,'index***************************')
            render("index/index",results,req,res);
        })
    }
};