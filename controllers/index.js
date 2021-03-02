/**
 * office Controller
 * 办公频道 首页
 */
const async = require('async');
const server = require('../models/index');
const render = require('../common/render');
const api = require('../api/api');
const util = require('../common/util');
const appConfig = require('../config/app-config');
const request = require('request');

module.exports = {
    render: function (res, req, next) {
        return async.parallel({
            recommendList: function (callback) { // 推荐列表  包含banner 专题 word ppt exl
                const params = [];
                for (const k in util.pageIds.index) {
                    params.push(util.pageIds.index[k]);
                }
                req.body = params;
                server.post(appConfig.apiNewBaselPath + api.index.recommendList, callback, req);
            },
            tdk: function (callback) {
                req.body = {
                    page: 0,
                    site: 4,
                    terminal: 0
                };
                server.post(appConfig.apiNewBaselPath + api.tdk.getTdkByUrl, callback, req);
            },
            // 第四范式 相关推荐
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
            categoryList: function (callback) {
                req.body = { 'site': 4, 'terminal': 0, level: 2 };
                server.post(appConfig.apiNewBaselPath + api.index.navList, callback, req);
            },
            // 热门专题（晒内容）
            hotTopicSeo: function (callback) {
                // console.log(appConfig.apiNewBaselPath+api.index.randomRecommend)
                req.body = {
                    type: 'topic',
                    currentPage: 1,
                    pageSize: 200,
                    siteCode: 4
                };
                server.post(appConfig.apiNewBaselPath + api.index.randomRecommend, callback, req);
            },
            // 最新推荐（晒内容）
            newsRec: function (callback) {
                req.body = {
                    type: 'new',
                    currentPage: 1,
                    pageSize: 200,
                    siteCode: 4
                };
                server.post(appConfig.apiNewBaselPath + api.index.randomRecommend, callback, req);
            },
            // 推荐信息（晒内容）
            hotRecData: function (callback) {
                req.body = {
                    clientType: 0,
                    pageSize: 200
                };
                server.post(appConfig.apiNewBaselPath + api.index.listContentInfos, callback, req);
            }

        }, (err, results) => {

            if (err) {
                next(err);
            }
            try {
                if (results.categoryList && results.categoryList.data) {
                    const preContent = results.categoryList.data.slice(0, 7);
                    const temp = results.categoryList.data.slice(7);
                    const nextContent = { id: '', 'name': '更多', class: 'loadMore', frontAllCategoryVOList: [] };
                    temp.forEach(item => {
                        nextContent.frontAllCategoryVOList.push({
                            nodeCode: item.nodeCode,
                            name: item.name,
                            url: item.url
                        });
                    });
                    if (nextContent.frontAllCategoryVOList.length) {
                        results.categoryList.data = preContent.concat([nextContent]);

                    } else {
                        results.categoryList.data = preContent;
                    }
                }
                if (results.hotTopicSeo && results.hotTopicSeo.data) {
                    results.topicPagtotal = results.hotTopicSeo.data.length;
                }
                if (results.newsRec && results.newsRec.data) {
                    results.newPagetotal = results.newsRec.data.length;
                } else {
                    results.newsRec = {};
                    results.newsRec.data = [];
                }
                if (results.tdk && results.tdk.data) {
                    results.list = {};
                    results.list.data = {};
                    results.list.data.tdk = results.tdk.data;
                } else {
                    results.list = {};
                    results.list.data = {};
                    results.list.data.tdk = {};
                }
                // 推荐位处理数
                results.contentList = [];
                //  console.log(JSON.stringify(results),'results------------------contentList')
                if (results.recommendList) {
                    const recfileArr = [];// 精选资料
                    results.recommendList.data && results.recommendList.data.map(item => {
                        if (item.pageId == util.pageIds.index.ub) {
                            results.bannerList = util.dealHref(item).list || [];
                        } else if (item.pageId == util.pageIds.index.zt) {
                            results.specialList = util.dealHref(item).list || [];
                        } else if (item.pageId == util.pageIds.index.viprelevant) {
                            results.vipList = util.dealHref(item).list || [];
                        } else if (item.pageId == util.pageIds.index.recfile1) {
                            const tmp1 = util.dealHref(item).list || [];
                            recfileArr.push(tmp1);
                        } else if (item.pageId == util.pageIds.index.recfile2) {
                            const tmp2 = util.dealHref(item).list || [];
                            recfileArr.push(tmp2);
                        } else if (item.pageId == util.pageIds.index.recfile3) {
                            const tmp3 = util.dealHref(item).list || [];
                            recfileArr.push(tmp3);
                        } else if (item.pageId == util.pageIds.index.recfile4) {
                            const tmp4 = util.dealHref(item).list || [];
                            recfileArr.push(tmp4);
                        } else if (item.pageId == util.pageIds.index.recfile5) {
                            const tmp5 = util.dealHref(item).list || [];
                            recfileArr.push(tmp5);
                        } else if (item.pageId == util.pageIds.index.organize) {
                            const arr = util.dealHref(item).list || [];
                            // 处理权威机构数据
                            const fileArr = [];
                            const userInfoArr = [];
                            arr.forEach(element => {
                                if (element.type == 1) {
                                    fileArr.push(element);
                                } else if (element.type == 2) {
                                    userInfoArr.push(element);
                                }
                            });
                            results.organize = JSON.parse(JSON.stringify(userInfoArr));
                            let step = 0;
                            if (fileArr.length > 11) {
                                for (let i = 0; i < 4; i++) {
                                    const fileSlice = fileArr.slice(step, step + 3);
                                    step += 3;
                                    results.organize[i].fileList = fileSlice;
                                }
                            }

                        } else if (item.pageId == util.pageIds.index.hotSearchWord) {
                            // 搜索框下热词搜索
                            results.hotSearchWord = util.dealHref(item).list || [];
                        } else if (item.pageId == util.pageIds.index.friendLink) {
                            // 友情链接
                            results.friendLink = util.dealHref(item).list || [];
                        } else if (item.pageId == util.pageIds.index.vipqy) {
                            results.vipqy = util.dealHref(item).list || [];
                        }
                    });
                    // VIP专区优先展示第四范式的数据，如果第四范式没有返回数据，则取自定义推荐位配置的数据*
                    if (results.paradigm4Relevant && results.paradigm4Relevant.length > 0) {
                        results.vipList = results.paradigm4Relevant.map(item => {
                            const obj = {};
                            obj.linkUrl = '/f' + item.url;
                            obj.title = item.title;
                            obj.imagUrl = item.cover_url;
                            obj.expand = {};
                            obj.expand.format = item.extra1;
                            obj.expand.readNum = item.item_read_cnt || 0;
                            obj.expand.totalPage = 0;
                            return obj;
                        });

                    }
                    recfileArr.map(item => {
                        item.forEach(ctn => {
                            if (!ctn.imagUrl) {
                                if (ctn.expand && ctn.expand.fileSmallPic) {
                                    ctn.imagUrl = ctn.expand.fileSmallPic;
                                }
                            }
                        });
                    });

                    results.recfileArr = recfileArr;
                }
                console.log(JSON.stringify(results.recfileArr), 'results------------------');
                results.officeUrl = appConfig.officeUrl;
                render('index/index', results, req, res, next);
            } catch (e) {
                console.log('e:', e);
                next(e);
            }
        });
    }
};