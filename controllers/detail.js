/**
 * @Description: 详情页
 */
var async = require("async");
var render = require("../common/render");
var Api = require("../api/api");
var request = require('request');
var appConfig = require("../config/app-config");
var fid = null;


var title = null;


var format = '';
var classid1 = '';

var perMin = '';

var userID = Math.random().toString().slice(-15); //标注用户的ID，

var sceneIDGuess = ''; //场景的ID

var recommendInfoData_guess = {}; //个性化数据(猜你喜欢)

var requestID_guess = ''; //  个性化数据(猜你喜欢) requestID

module.exports = {
    success: function(req, res) {
        var _index = {
            list: function(callback) {
                var opt = {

                    method: 'POST',
                    url: appConfig.apiNewBaselPath + Api.file.getFileDetailNoTdk,
                    body: JSON.stringify({
                        clientType: 0,
                        fid: req.query.fid,
                        sourceType: 1,
                        site:4
                    }),
                    headers: {
                        'Content-Type': 'application/json'
                    },
                };
                request(opt, function(err, res1, body) {
                    if (body) {
                        var data = JSON.parse(body);
                        var fileInfo = data.data && data.data.fileInfo
                        var tdk = data.data && data.data.tdk
                            //console.warn('data----------------',data)
                        if (data.code == 0 && data.data) {



                            fid = fileInfo.id; // 文件id
                            classId = fileInfo.classid; // 分类id
                            title = fileInfo.title || ""; // 文件标题 (没有后缀格式)
                            isGetClassType = fileInfo.isGetClassType; // 分类类型 :0-读取平台分类 1-读取专题分类
                            spcClassId = fileInfo.spcClassId; // 专题分类ID(最后一级)

                            format = fileInfo.format || ''; //  文件格式 txt,ppt,doc,xls（展示分为两种，txt为文本，其他图片格式展示）
                            classid1 = fileInfo.classid1;
                            classid2 = fileInfo.classid2
                            perMin = fileInfo.permin || ''; // 1:公开、2:私人 3:付费
                            uid = fileInfo.uid || '' // 上传者id
                            userID = fileInfo.uid && fileInfo.uid.slice(0, 10) || ''; //来标注用户的ID，
                            callback(null, data);
                        } else {
                            callback(null, null);
                        }
                    } else {
                        callback(null, null);
                    }
                })
            },
            // 动态获取第四范式 场景id 物料库id
            recommendInfo: function(callback) {
                // 必须是主站 不是私密文件 文件类型必须是 教育类||专业资料 ||经济管理 ||生活休闲 || 办公频道文件 
                //  classid1 =  '1820'
                // && (classid1 == '1816' || classid1 == '1820' || classid1 == '1821' || classid1 == '1819' || classid1 == '1818')                       
                if (perMin != '2') {

                    //关联推荐 教育类型 'jy'  'zyzl' 'jjgl' 'shxx'
                    var pageIdsConfig_jy_rele = {
                        'doc': 'doc_jy_20200220_001',
                        'txt': 'doc_jy_20200220_001',
                        'pdf': 'doc_jy_20200220_001',
                        'xls': 'xls_jy_20200220_001',
                        'ppt': 'ppt_jy_20200220_001',
                    }

                    //个性化推荐 教育类型
                    var pageIdsConfig_jy_guess = {
                        'doc': 'doc_jy_20200220_002',
                        'txt': 'doc_jy_20200220_002',
                        'pdf': 'doc_jy_20200220_002',
                        'xls': 'xls_jy_20200220_002',
                        'ppt': 'ppt_jy_20200220_002',
                    }

                    //关联推荐(相关资料)
                    var rele_pageId = pageIdsConfig_jy_rele[format];
                    //个性化推荐(猜你喜欢)
                    var guess_pageId = pageIdsConfig_jy_guess[format];

                    var pageIds = [];
                    if(classid1 == '10339'){
                        classid1 = '1819'
                    }
                    if(classid1 == '1823'){
                        classid1 = '1821'
                    }
                    switch (classid1) {
                        case '1816': // 教育类
                            pageIds = [rele_pageId, guess_pageId];
                            break;
                        case '1820': // 专业资料
                            pageIds = [rele_pageId.replace('jy', 'zyzl'), guess_pageId.replace('jy', 'zyzl')];
                            break;
                        case '1821': // 经济管理
                            pageIds = [rele_pageId.replace('jy', 'jjgl'), guess_pageId.replace('jy', 'jjgl')];
                            break;
                        case '1819': // 生活休闲
                            pageIds = [rele_pageId.replace('jy', 'shxx'), guess_pageId.replace('jy', 'shxx')];
                            break;
                        case '1818': // 办公频道  1818  生产预发环境。测试开发环境8038 
                            pageIds = [rele_pageId.replace('jy', 'zzbg'), guess_pageId.replace('jy', 'zzbg')];
                            break;
                        default:  pageIds = [rele_pageId.replace('jy', 'shxx'), guess_pageId.replace('jy', 'shxx')];
                    }

                    let url = appConfig.newBasePath + '/gateway/recommend/config/info'
                    let option = {
                        url: url,
                        method: 'POST',
                        body: JSON.stringify(pageIds),
                        headers: {
                            'Content-Type': 'application/json'
                        },
                    }
                    request(option, function(err, res, body) {
                        if (body) {
                            try {
                                var resData = JSON.parse(body);
                                if (resData.code == 0) {
                                    var data = resData.data || [];
                                    recommendInfoData_rele = data[0] || {}; //相关资料
                                    recommendInfoData_guess = data[1] || {}; // 个性化 猜你喜欢

                                    callback(null, resData);
                                } else {
                                    callback(null, null);
                                }
                            } catch (err) {
                                callback(null, null);
                            }
                        } else {
                            callback(null, null);
                        }
                    })
                } else {
                    callback(null, null);
                }
            },
            //第四范式  猜你喜欢
            paradigm4Guess: function(callback) {
                requestID_guess = Math.random().toString().slice(-10); //requestID是用来标注推荐服务请求的ID，是长度范围在8~18位的随机字符串
                if (recommendInfoData_guess.useId) { // recommendInfo 接口中   recommendInfoData_rele = data[0] || {}; //相关资料  recommendInfoData_guess = data[1] || {}; // 个性化 猜你喜欢
                    sceneIDGuess = recommendInfoData_guess.useId || '';
                    var opt = {
                        url: `https://nbrecsys.4paradigm.com/api/v0/recom/recall?requestID=${requestID_guess}&sceneID=${sceneIDGuess}&userID=${userID}`,
                        method: 'POST',
                        body: JSON.stringify({ "itemID": fid, "itemTitle": title })
                    }
                    request(opt, function(err, res, body) {
                        if (body) {
                            try {
                                var data = JSON.parse(body);
                                callback(null, data);
                            } catch (err) {
                                callback(null, null);
                            }
                        } else {
                            callback(null, null);
                        }
                    })

                } else {
                    callback(null, null);
                }
            }
        };
        return async.series(_index, function(err, results) { // async.series 串行无关联


            // 如果有第四范式 猜你喜欢

            if (results.paradigm4Guess) {
                var paradigm4Guess = results.paradigm4Guess.map(item => {
                    return {
                        id: item.item_id || '',
                        format: item.extra1 || format || '',
                        name: item.title || '',
                        cover_url: item.cover_url || '',
                        url: item.url || '',
                        item_read_cnt: item.item_read_cnt
                    }
                })
                results.paradigm4GuessData = paradigm4Guess || [];
            }
            var list = Object.assign({}, { data: Object.assign(results.list && results.list.data.fileInfo, results.list.data.tdk, results.list.data.transcodeInfo, { title: results.list.data.fileInfo.title }) })
            var unloginFlag = req.query.unloginFlag
            var consumeStatus = req.query.consumeStatus // 7 已经下载过
            var results = Object.assign({}, results, { list: list }, { unloginFlag: unloginFlag, consumeStatus: consumeStatus })
                // 要在这里给默认值 不然报错
            render("detail/success", results, req, res);
        })
    },
    fail: function(req, res) {
        render("detail/fail", null, req, res);
    }
};

