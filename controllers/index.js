/**
 * office Controller
 * 办公频道 首页
 */
var async = require("async");
var server = require("../models/index");
var render = require("../common/render");
var api = require("../api/api");
var util = require("../common/util");
var appConfig = require("../config/app-config");
var request = require('request');

module.exports = {
    render:function(res , req,next){
        return async.parallel({
            recommendList:function(callback){ //推荐列表  包含banner 专题 word ppt exl
                let params=[];
                for (let k in util.pageIds.index){
                    params.push(util.pageIds.index[k])
                }
                req.body = params;
                server.post(appConfig.apiNewBaselPath+api.index.recommendList, callback, req);
            },
            tdk:function(callback){
                server.get(appConfig.apiNewBaselPath +api.tdk.getTdkByUrl.replace(/\$url/, '/'), callback, req);
            },
             //第四范式 相关推荐
             paradigm4Relevant: function (callback) {
                callback(null, null);
                // var pageIds = ['Q_M_FD_hot_home']
                // let url =  appConfig.newBasePath + '/gateway/recommend/config/info' 
                // let option = {
                //     url: url,
                //     method: 'POST',
                //     body: JSON.stringify(pageIds),
                //     headers: {
                //         'Content-Type': 'application/json'
                //     },
                // }
                // // callback(null, null);
                // request(option, function (err, res, body) {
                //     // console.log(JSON.stringify(body),'paradigm4Relevant--------------')
                //     if (body) {
                //         try {
                //             var resData = JSON.parse(body);
                //             console.log('请求地址post-------------------:',option.url)
                //             console.log('请求参数-------------------:',option.body)
                //             console.log('返回code------:'+resData.code,'返回msg-------:'+resData.msg)
                //             if (resData.code == 0) {
                //                 var data = resData.data || [];
                //                 var recommendInfoData_rele = data[0] || {}; //相关资料
                //                 get4format(recommendInfoData_rele)
                //             } else {
                //                 callback(null, null);
                //             }
                //         } catch (err) {
                //             callback(null, null);
                //             console.log("err=============", err)
                //         }
                //     } else {
                //         callback(null, null);
                //     }
                // })
                // function get4format(recommendInfoData_rele){
                //     var requestID_rele = Math.random().toString().slice(-10);//requestID是用来标注推荐服务请求的ID，是长度范围在8~18位的随机字符串
                //     var userID = Math.random().toString().slice(-15); //标注用户的ID，
                //     if (recommendInfoData_rele.useId) {  // recommendInfo 接口中   recommendInfoData_rele = data[0] || {}; //相关资料  recommendInfoData_guess = data[1] || {}; // 个性化 猜你喜欢
                //         var sceneIDRelevant = recommendInfoData_rele.useId || '';
                //         req.body = { "page":0};
                //         server.post(`https://nbrecsys.4paradigm.com/api/v0/recom/recall?requestID=${requestID_rele}&sceneID=${sceneIDRelevant}&userID=${userID}`, callback, req);
                     
                //     } else {
                //         callback(null, null);
                //     }
                // }
            },
            categoryList:function(callback) {
                // console.log(appConfig.apiNewBaselPath+api.index.navList)
                req.body = {"site":4,"deeplevel":2};
                server.post(appConfig.apiNewBaselPath+api.index.navList, callback, req);
            },
            // 热门专题（晒内容）
            hotTopicSeo:function(callback){
                // console.log(appConfig.apiNewBaselPath+api.index.randomRecommend)
                req.body = {
                    type: 'topic',
                    currentPage:1,
                    pageSize:200,
                    siteCode:4
                };
                server.post(appConfig.apiNewBaselPath+api.index.randomRecommend, callback, req);
            },
            // 最新推荐（晒内容）
            newsRec:function(callback){
                req.body = {
                    type: 'new',
                    currentPage:1,
                    pageSize:200,
                    siteCode:4
                };
                server.post(appConfig.apiNewBaselPath+api.index.randomRecommend, callback, req);
            },
            // 推荐信息（晒内容）
            hotRecData:function(callback){
                req.body = {
                    clientType:0,
                    pageSize:200
                };
                server.post(appConfig.apiNewBaselPath+api.index.listContentInfos, callback, req);
            }

        } , function(err, results){
           
            if(err){
                next(err)
            }
            try{ 
                console.log('results.categoryList.data.categoryList:',JSON.stringify(results.categoryList.data.categoryList))
                if(results.categoryList&&results.categoryList.data.categoryList){
                     results.categoryList.data.categoryList = [
                        {
                          "id": "1818",
                          "name": "办公频道",
                          "father": "0",
                          "select": null,
                          "categoryList": [
                            {
                              "id": "9006",
                              "name": "求职/职场",
                              "father": "1818",
                              "select": null,
                              "categoryList": null
                            },
                            {
                              "id": "9009",
                              "name": "党团工作",
                              "father": "1818",
                              "select": null,
                              "categoryList": null
                            },
                            {
                              "id": "9011",
                              "name": "职业岗位",
                              "father": "1818",
                              "select": null,
                              "categoryList": null
                            },
                            {
                              "id": "8037",
                              "name": "表格模板",
                              "father": "1818",
                              "select": null,
                              "categoryList": null
                            },
                            {
                              "id": "8080",
                              "name": "PPT模板",
                              "father": "1818",
                              "select": null,
                              "categoryList": null
                            }
                          ]
                        },
                        {
                          "id": "1819",
                          "name": "生活休闲",
                          "father": "0",
                          "select": null,
                          "categoryList": [
                            {
                              "id": "1863",
                              "name": "娱乐时尚",
                              "father": "1819",
                              "select": null,
                              "categoryList": null
                            },
                            {
                              "id": "1864",
                              "name": "幽默滑稽",
                              "father": "1819",
                              "select": null,
                              "categoryList": null
                            },
                            {
                              "id": "1867",
                              "name": "影视/动漫",
                              "father": "1819",
                              "select": null,
                              "categoryList": null
                            },
                            {
                              "id": "1869",
                              "name": "保健养生",
                              "father": "1819",
                              "select": null,
                              "categoryList": null
                            },
                            {
                              "id": "1872",
                              "name": "音乐",
                              "father": "1819",
                              "select": null,
                              "categoryList": null
                            },
                            {
                              "id": "9012",
                              "name": "饮食",
                              "father": "1819",
                              "select": null,
                              "categoryList": null
                            },
                            {
                              "id": "9013",
                              "name": "旅游购物",
                              "father": "1819",
                              "select": null,
                              "categoryList": null
                            },
                            {
                              "id": "9014",
                              "name": "美容化妆",
                              "father": "1819",
                              "select": null,
                              "categoryList": null
                            },
                            {
                              "id": "8002",
                              "name": "综合",
                              "father": "1819",
                              "select": null,
                              "categoryList": null
                            },
                            {
                              "id": "9015",
                              "name": "随笔",
                              "father": "1819",
                              "select": null,
                              "categoryList": null
                            },
                            {
                              "id": "9016",
                              "name": "家具家电",
                              "father": "1819",
                              "select": null,
                              "categoryList": null
                            }
                          ]
                        },
                        {
                          "id": "1816",
                          "name": "教育资料",
                          "father": "0",
                          "select": null,
                          "categoryList": [
                            {
                              "id": "1817",
                              "name": "高等教育",
                              "father": "1816",
                              "select": null,
                              "categoryList": null
                            },
                            {
                              "id": "1823",
                              "name": "考试题库",
                              "father": "1816",
                              "select": null,
                              "categoryList": null
                            },
                            {
                              "id": "2791",
                              "name": "高中教育",
                              "father": "1816",
                              "select": null,
                              "categoryList": null
                            },
                            {
                              "id": "1825",
                              "name": "外语资料",
                              "father": "1816",
                              "select": null,
                              "categoryList": null
                            },
                            {
                              "id": "6658",
                              "name": "初中教育",
                              "father": "1816",
                              "select": null,
                              "categoryList": null
                            },
                            {
                              "id": "2792",
                              "name": "小学教育",
                              "father": "1816",
                              "select": null,
                              "categoryList": null
                            },
                            {
                              "id": "8022",
                              "name": "幼儿教育",
                              "father": "1816",
                              "select": null,
                              "categoryList": null
                            }
                          ]
                        },
                        {
                          "id": "1821",
                          "name": "经济管理",
                          "father": "0",
                          "select": null,
                          "categoryList": [
                            {
                              "id": "1899",
                              "name": "战略管理",
                              "father": "1821",
                              "select": null,
                              "categoryList": null
                            },
                            {
                              "id": "1900",
                              "name": "市场营销",
                              "father": "1821",
                              "select": null,
                              "categoryList": null
                            },
                            {
                              "id": "1902",
                              "name": "行业分析",
                              "father": "1821",
                              "select": null,
                              "categoryList": null
                            },
                            {
                              "id": "1905",
                              "name": "财会税务",
                              "father": "1821",
                              "select": null,
                              "categoryList": null
                            },
                            {
                              "id": "1887",
                              "name": "经济金融",
                              "father": "1821",
                              "select": null,
                              "categoryList": null
                            },
                            {
                              "id": "1907",
                              "name": "专利",
                              "father": "1821",
                              "select": null,
                              "categoryList": null
                            },
                            {
                              "id": "1886",
                              "name": "贸易",
                              "father": "1821",
                              "select": null,
                              "categoryList": null
                            },
                            {
                              "id": "1903",
                              "name": "人  力资源",
                              "father": "1821",
                              "select": null,
                              "categoryList": null
                            },
                            {
                              "id": "1901",
                              "name": "企业制度",
                              "father": "1821",
                              "select": null,
                              "categoryList": null
                            },
                            {
                              "id": "1906",
                              "name": "项目管理",
                              "father": "1821",
                              "select": null,
                              "categoryList": null
                            },
                            {
                              "id": "1904",
                              "name": "生产运营",
                              "father": "1821",
                              "select": null,
                              "categoryList": null
                            }
                          ]
                        },
                        {
                          "id": "1820",
                          "name": "专业资料",
                          "father": "0",
                          "select": null,
                          "categoryList": [
                            {
                              "id": "1822",
                              "name": "IT/计算机",
                              "father": "1820",
                              "select": null,
                              "categoryList": null
                            },
                            {
                              "id": "9001",
                              "name": "人文社科",
                              "father": "1820",
                              "select": null,
                              "categoryList": null
                            },
                            {
                              "id": "9002",
                              "name": "工程科技",
                              "father": "1820",
                              "select": null,
                              "categoryList": null
                            },
                            {
                              "id": "9003",
                              "name": "自然科学 ",
                              "father": "1820",
                              "select": null,
                              "categoryList": null
                            },
                            {
                              "id": "9004",
                              "name": "医药卫生",
                              "father": "1820",
                              "select": null,
                              "categoryList": null
                            },
                            {
                              "id": "9005",
                              "name": "农林牧渔",
                              "father": "1820",
                              "select": null,
                              "categoryList": null
                            }
                          ]
                        },
                        {
                            "id": "1820",
                            "name": "专业资料",
                            "father": "0",
                            "select": null,
                            "categoryList": [
                              {
                                "id": "1822",
                                "name": "IT/计算机",
                                "father": "1820",
                                "select": null,
                                "categoryList": null
                              },
                              {
                                "id": "9001",
                                "name": "人文社科",
                                "father": "1820",
                                "select": null,
                                "categoryList": null
                              },
                              {
                                "id": "9002",
                                "name": "工程科技",
                                "father": "1820",
                                "select": null,
                                "categoryList": null
                              },
                              {
                                "id": "9003",
                                "name": "自然科学 ",
                                "father": "1820",
                                "select": null,
                                "categoryList": null
                              },
                              {
                                "id": "9004",
                                "name": "医药卫生",
                                "father": "1820",
                                "select": null,
                                "categoryList": null
                              },
                              {
                                "id": "9005",
                                "name": "农林牧渔",
                                "father": "1820",
                                "select": null,
                                "categoryList": null
                              }
                            ]
                          },
                          {
                            "id": "1820",
                            "name": "专业资料",
                            "father": "0",
                            "select": null,
                            "categoryList": [
                              {
                                "id": "1822",
                                "name": "IT/计算机",
                                "father": "1820",
                                "select": null,
                                "categoryList": null
                              },
                              {
                                "id": "9001",
                                "name": "人文社科",
                                "father": "1820",
                                "select": null,
                                "categoryList": null
                              },
                              {
                                "id": "9002",
                                "name": "工程科技",
                                "father": "1820",
                                "select": null,
                                "categoryList": null
                              },
                              {
                                "id": "9003",
                                "name": "自然科学 ",
                                "father": "1820",
                                "select": null,
                                "categoryList": null
                              },
                              {
                                "id": "9004",
                                "name": "医药卫生",
                                "father": "1820",
                                "select": null,
                                "categoryList": null
                              },
                              {
                                "id": "9005",
                                "name": "农林牧渔",
                                "father": "1820",
                                "select": null,
                                "categoryList": null
                              }
                            ]
                          },
                          {
                            "id": "1820",
                            "name": "专业资料",
                            "father": "0",
                            "select": null,
                            "categoryList": [
                              {
                                "id": "1822",
                                "name": "IT/计算机",
                                "father": "1820",
                                "select": null,
                                "categoryList": null
                              },
                              {
                                "id": "9001",
                                "name": "人文社科",
                                "father": "1820",
                                "select": null,
                                "categoryList": null
                              },
                              {
                                "id": "9002",
                                "name": "工程科技",
                                "father": "1820",
                                "select": null,
                                "categoryList": null
                              },
                              {
                                "id": "9003",
                                "name": "自然科学 ",
                                "father": "1820",
                                "select": null,
                                "categoryList": null
                              },
                              {
                                "id": "9004",
                                "name": "医药卫生",
                                "father": "1820",
                                "select": null,
                                "categoryList": null
                              },
                              {
                                "id": "9005",
                                "name": "农林牧渔",
                                "father": "1820",
                                "select": null,
                                "categoryList": null
                              }
                            ]
                          },
                          {
                            "id": "1820",
                            "name": "专业资料",
                            "father": "0",
                            "select": null,
                            "categoryList": [
                              {
                                "id": "1822",
                                "name": "IT/计算机",
                                "father": "1820",
                                "select": null,
                                "categoryList": null
                              },
                              {
                                "id": "9001",
                                "name": "人文社科",
                                "father": "1820",
                                "select": null,
                                "categoryList": null
                              },
                              {
                                "id": "9002",
                                "name": "工程科技",
                                "father": "1820",
                                "select": null,
                                "categoryList": null
                              },
                              {
                                "id": "9003",
                                "name": "自然科学 ",
                                "father": "1820",
                                "select": null,
                                "categoryList": null
                              },
                              {
                                "id": "9004",
                                "name": "医药卫生",
                                "father": "1820",
                                "select": null,
                                "categoryList": null
                              },
                              {
                                "id": "9005",
                                "name": "农林牧渔",
                                "father": "1820",
                                "select": null,
                                "categoryList": null
                              }
                            ]
                          },
                          {
                            "id": "1820",
                            "name": "专业资料",
                            "father": "0",
                            "select": null,
                            "categoryList": [
                              {
                                "id": "1822",
                                "name": "IT/计算机",
                                "father": "1820",
                                "select": null,
                                "categoryList": null
                              },
                              {
                                "id": "9001",
                                "name": "人文社科",
                                "father": "1820",
                                "select": null,
                                "categoryList": null
                              },
                              {
                                "id": "9002",
                                "name": "工程科技",
                                "father": "1820",
                                "select": null,
                                "categoryList": null
                              },
                              {
                                "id": "9003",
                                "name": "自然科学 ",
                                "father": "1820",
                                "select": null,
                                "categoryList": null
                              },
                              {
                                "id": "9004",
                                "name": "医药卫生",
                                "father": "1820",
                                "select": null,
                                "categoryList": null
                              },
                              {
                                "id": "9005",
                                "name": "农林牧渔",
                                "father": "1820",
                                "select": null,
                                "categoryList": null
                              }
                            ]
                          }
                      ]
                    var  preContent = results.categoryList.data.categoryList.slice(0,6)
                    var temp = results.categoryList.data.categoryList.slice(6)
                    var nextContent = {id:'', "name": "更多",style:'width:90px;text-indent:-25px;margin-right:0;',categoryList:[]}
                    temp.forEach(item=>{
                        nextContent.categoryList.push({
                            id:item.id,
                            name:item.name
                        })
                    })
                     results.categoryList.data.categoryList =  preContent.concat([nextContent])
                }
                if(results.hotTopicSeo && results.hotTopicSeo.data){
                    results.topicPagtotal = results.hotTopicSeo.data.length
                }
                if(results.newsRec && results.newsRec.data){
                    results.newPagetotal = results.newsRec.data.length
                }else{
                    results.newsRec = {}
                    results.newsRec.data = []
                }
                if(results.tdk && results.tdk.data){
                    results.list = {};
                    results.list.data = {};
                    results.list.data.tdk = results.tdk.data;
                }else{
                    results.list = {};
                    results.list.data = {};
                    results.list.data.tdk = {}
                }
                // 推荐位处理数
                results.contentList=[];
                // console.log(JSON.stringify(results),'results------------------contentList')
                if(results.recommendList){
                    const recfileArr = [];//精选资料
                    results.recommendList.data && results.recommendList.data.map(item=>{
                        if(item.pageId == util.pageIds.index.ub){
                            results.bannerList=util.dealHref(item).list || [];  
                        }else if(item.pageId == util.pageIds.index.zt){
                            results.specialList=util.dealHref(item).list || [];
                        }else if(item.pageId == util.pageIds.index.viprelevant){
                            results.vipList=util.dealHref(item).list || [];
                        }else if(item.pageId == util.pageIds.index.recfile1){
                            let  tmp1 = util.dealHref(item).list || [];
                            recfileArr.push(tmp1)
                        }else if(item.pageId == util.pageIds.index.recfile2){
                            let  tmp2 = util.dealHref(item).list || [];
                            recfileArr.push(tmp2)
                        }else if(item.pageId == util.pageIds.index.recfile3){
                            let  tmp3 = util.dealHref(item).list || [];
                            recfileArr.push(tmp3)
                        }else if(item.pageId == util.pageIds.index.recfile4){
                            let  tmp4 = util.dealHref(item).list || [];
                            recfileArr.push(tmp4)
                        }else if(item.pageId == util.pageIds.index.recfile5){
                            let  tmp5 = util.dealHref(item).list || [];
                            recfileArr.push(tmp5)
                        }else if(item.pageId == util.pageIds.index.organize) {
                            var arr =  util.dealHref(item).list || [];
                             // 处理权威机构数据
                             var fileArr = [];
                             var userInfoArr = [];
                             arr.forEach(element => {
                                if(element.type==1) {
                                    fileArr.push(element)
                                }else if(element.type==2) {
                                    userInfoArr.push(element)
                                }
                             });
                             results.organize = JSON.parse(JSON.stringify(userInfoArr));
                             var step =0;
                             if(fileArr.length>11) {
                                for(var i=0;i<4;i++) {
                                    var fileSlice = fileArr.slice(step,step+3);
                                    step += 3;
                                    results.organize[i].fileList = fileSlice
                                 } 
                             }
                             
                        }else if (item.pageId == util.pageIds.index.hotSearchWord) {
                            // 搜索框下热词搜索
                            results.hotSearchWord = util.dealHref(item).list || [];
                        }else if(item.pageId == util.pageIds.index.friendLink){
                            // 友情链接
                            results.friendLink = util.dealHref(item).list || [];
                        }else if(item.pageId == util.pageIds.index.vipqy){
                            results.vipqy = util.dealHref(item).list || []
                        }
                    })
                     // VIP专区优先展示第四范式的数据，如果第四范式没有返回数据，则取自定义推荐位配置的数据*
                     if(results.paradigm4Relevant && results.paradigm4Relevant.length>0) {
                         results.vipList = results.paradigm4Relevant.map(item=>{
                             var obj = {};
                             obj.linkUrl = '/f'+item.url;
                             obj.title = item.title;
                             obj.imagUrl = item.cover_url;
                             obj.expand = {};
                             obj.expand.format =item.extra1;
                             obj.expand.readNum =item.item_read_cnt||0;
                             obj.expand.totalPage =0;
                             return obj;
                         })
                        
                     }
                    recfileArr.map(item=>{
                        item.forEach(ctn=>{
                            if(!ctn.imagUrl){
                                if(ctn.expand &&ctn.expand.fileSmallPic) {
                                    ctn.imagUrl = ctn.expand.fileSmallPic
                                }
                            }
                        })
                     })
    
                    results.recfileArr = recfileArr;
                }  
              
                results.officeUrl = appConfig.officeUrl
                render("index/index",results,req,res,next);  
            }catch(e){
                console.log('e:',e)
                next(e)
            }
            
        })
    }
};