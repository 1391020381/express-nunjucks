/**
 * @Description: 详情页
 */
var async = require("async");
var render = require("../common/render");
var server = require("../models/index");
var util = require('../common/util');

var Api = require("../api/api");
var request = require('request');
var appConfig = require("../config/app-config");
var fid = null;
var classId = null;
var title = null;
var spcClassId = null;
var isGetClassType = null;
var fileAttr = 1; //1 普通文件 2 办公频道文件
var format = '';
var classid1 = '';
var perMin = '';

var userID = Math.random().toString().slice(-15); //标注用户的ID，
var sceneIDRelevant = ''; //场景的ID
var sceneIDGuess = ''; //场景的ID
var recommendInfoData_rele = {}; //相关推荐数据 (相关资料)
var recommendInfoData_guess = {}; //个性化数据(猜你喜欢)
var requestID_rele = '';  //  相关推荐数据 (相关资料)requestID
var requestID_guess = '';  //  个性化数据(猜你喜欢) requestID


module.exports = {
    render: function (req, res) {
        var _index = {
            list: function (callback) {
                console.log('详情页start===============' + 'cuk=' + req.cookies.cuk + ' ;JSESSIONID=' + req.cookies.JSESSIONID);
                var opt = {
                    url: appConfig.apiBasePath + Api.file.fileDetail.replace(/\$id/, req.params.id),
                    headers: {
                        'Content-Type': 'application/json',
                        'Cookie': 'cuk=' + req.cookies.cuk + ' ;JSESSIONID=' + req.cookies.JSESSIONID,
                    },
                };

                request(opt, function (err, res1, body) {

                    if (body) {
                        try {
                            var data = JSON.parse(body);
                            console.warn('data----------------',data)
                            // fileAttr ==  1普通文件 2办公频道
                            console.warn(data.data.fileAttr,'data.data.fileAttr')
                             if(data.data.fileAttr == 2){
                                res.redirect(`http://office.iask.com/f/${data.data.fileId}.html?form=ishare`);
                                return
                            }
       

                            if (data.code == 0) {
                                fid = data.data.fileId;
                                classId = data.data.classId || "";
                                title = data.data.title || "";
                                isGetClassType = data.data.isGetClassType || '';
                                spcClassId = data.data.spcClassId || "";
                                fileAttr = data.data.fileAttr || 1;
                                format = data.data.format || '';
                                classid1 = data.data.classid1 || '';
                                perMin = data.data.perMin || '';
                                // userID = data.data.uid.slice(0, 10) || ''; //来标注用户的ID，
                                callback(null, data);
                            } else {
                                callback(null, null);
                            }
                        } catch (err) {
                            callback(null, null);
                            console.log("err=============", err)
                        }
                    } else {
                        callback(null, null);
                    }
                })
            },
            // 面包屑导航
            crumbList: function (callback) {
                server.get(appConfig.apiBasePath + Api.file.fileCrumb.replace(/\$isGetClassType/, isGetClassType).replace(/\$spcClassId/, spcClassId).replace(/\$classId/, classId), callback, req)
            },
            //相关资料
            RelevantInformationList: function (callback) {
                if (fileAttr == 1) {
                    server.get(appConfig.apiBasePath + Api.file.fileList.replace(/\$fid/, fid).replace(/\$limit/, ''), callback, req)
                } else {
                    callback(null, null);
                }
            },

            // 动态获取第四范式 场景id 物料库id
            recommendInfo: function (callback) {
                // 必须是主站 不是私密文件 文件类型必须是 教育类||专业资料 ||经济管理 ||生活休闲 || 办公频道文件                           
                if (fileAttr == 1 && perMin != '2' && (classid1 == '1816' || classid1 == '1820' || classid1 == '1821' || classid1 == '1819' || classid1 == '1818')) {

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
                        default:
                    }

                    let url = appConfig.env === 'prod' ? appConfig.newBasePath + '/gateway/recommend/config/info' : 'http://192.168.1.50:8769/gateway/recommend/config/info';
                    let option = {
                        url: url,
                        method: 'POST',
                        body: JSON.stringify(pageIds),
                        headers: {
                            'Content-Type': 'application/json',
                            'Cookie': 'cuk=' + req.cookies.cuk + ' ;JSESSIONID=' + req.cookies.JSESSIONID,
                        },
                    }
                    request(option, function (err, res, body) {
                        console.log(body, 'body======')
                        console.log(pageIds, 'pageIds===')
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
                                console.log("err=============", err)
                            }
                        } else {
                            callback(null, null);
                        }
                    })
                } else {
                    callback(null, null);
                }
            },

            //第四范式 相关推荐
            paradigm4Relevant: function (callback) {
                requestID_rele = Math.random().toString().slice(-10);//requestID是用来标注推荐服务请求的ID，是长度范围在8~18位的随机字符串

                console.log(recommendInfoData_rele.useId, 'recommendInfoData_rele.useId=======')


                if (recommendInfoData_rele.useId) {
                    sceneIDRelevant = recommendInfoData_rele.useId || '';

                    var opt = {
                        url: `https://nbrecsys.4paradigm.com/api/v0/recom/recall?requestID=${requestID_rele}&sceneID=${sceneIDRelevant}&userID=${userID}`,
                        method: 'POST',
                        body: JSON.stringify({ "itemID": fid, "itemTitle": title })
                    }
                    request(opt, function (err, res, body) {
                        if (body) {
                            try {
                                var data = JSON.parse(body);
                                // console.log('第四范式data',data)
                                callback(null, data);
                            } catch (err) {
                                console.log('第四范式error')
                                callback(null, null);
                                console.log("err=============", err)
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
            paradigm4Guess: function (callback) {
                requestID_guess = Math.random().toString().slice(-10);//requestID是用来标注推荐服务请求的ID，是长度范围在8~18位的随机字符串
                console.log(recommendInfoData_guess.useId, 'recommendInfoData_guess.useId=========')

                if (recommendInfoData_guess.useId) {
                    sceneIDGuess = recommendInfoData_guess.useId || '';
                    var opt = {
                        url: `https://nbrecsys.4paradigm.com/api/v0/recom/recall?requestID=${requestID_guess}&sceneID=${sceneIDGuess}&userID=${userID}`,
                        method: 'POST',
                        body: JSON.stringify({ "itemID": fid, "itemTitle": title })
                    }
                    request(opt, function (err, res, body) {
                        if (body) {
                            try {
                                var data = JSON.parse(body);
                                callback(null, data);
                            } catch (err) {
                                callback(null, null);
                                console.log("err=============", err)
                            }
                        } else {
                            callback(null, null);
                        }
                    })

                } else {
                    callback(null, null);
                }
            },

            // 文档详情扩展的信息
            fileExternal: function (callback) {
                server.get(appConfig.apiBasePath + Api.file.fileExternal.replace(/\$fid/, fid), callback, req);
            },
            // 用户评论
            commentList: function (callback) {
                server.get(appConfig.apiBasePath + Api.file.commentList.replace(/\$fid/, fid), callback, req)
            },
            filePreview: function (callback) {
                var validateIE9 = ['IE9', 'IE8', 'IE7', 'IE6'].indexOf(util.browserVersion(req.headers['user-agent'])) === -1 ? 0 : 1;
                server.get(appConfig.apiBasePath + Api.file.preReadPageLimit.replace(/\$fid/, fid).replace(/\$validateIE9/, validateIE9), callback, req, true);
            }
        };
        return async.series(_index, function (err, results) {


            if (!results.list || results.list.code == 40004 || !results.list.data) {
                res.redirect('/html/404.html');
                console.log("404==========");
                return;
            }


            var svgPathList = results.list.data.svgPathList;
            results.list.data.supportSvg = ['IE9', 'IE8', 'IE7', 'IE6'].indexOf(util.browserVersion(req.headers['user-agent'])) === -1;
            results.list.data.svgFlag = !!(svgPathList && svgPathList.length > 0);
            results.crumbList.data.isGetClassType = isGetClassType || 0;
            getInitPage(req, results);

            // 如果有第四范式 相关
            if (results.paradigm4Relevant) {
                var paradigm4RelevantMap = results.paradigm4Relevant.map(item => {
                    return {
                        id: item.item_id || '',
                        format: item.extra1 || format || '',
                        name: item.title || ''
                    }
                })
                results.RelevantInformationList.data = paradigm4RelevantMap || [];
                results.requestID_rele = requestID_rele;
                results.userID = userID;
            }

            // 如果有第四范式 猜你喜欢
            if (results.paradigm4Guess) {
                var paradigm4Guess = results.paradigm4Guess.map(item => {
                    return {
                        id: item.item_id || '',
                        format: item.extra1 || format || '',
                        name: item.title || '',
                        cover_url: item.cover_url || '',
                        url: item.url || ''
                    }
                })
                results.paradigm4GuessData = paradigm4Guess || [];
                results.requestID_guess = requestID_guess;
                results.userID = userID;

            }
            console.log('results.paradigm4GuessData',results.paradigm4GuessData)
            // 要在这里给默认值 不然报错
            results.recommendInfoData_rele = recommendInfoData_rele || {};
            results.recommendInfoData_guess = recommendInfoData_guess || {};

            if (parseInt(fileAttr, 10) === 1) {
                render("detail/index", results, req, res);
            } else {
                render("officeDetail/index", results, req, res);
            }

            //释放 不然 会一直存在
            recommendInfoData_rele = {};
            recommendInfoData_guess = {};

        })
    },
    success: function (req, res) {
        render("detail/success", null, req, res);
    },
    fail: function (req, res) {
        render("detail/fail", null, req, res);
    }
};

// 初始页数 计算页数,去缓存
function getInitPage(req, results) {
    let filePreview = results.filePreview;
    if (filePreview) {
        if (results.list.data.state === 3) {
            let content = results.list.data.url || results.list.data.fileContentList[0];
            let bytes = filePreview.data.pinfo.bytes || {};
            let newImgUrl = [];
            for (var key in bytes) {
                var page = bytes[key];
                var param = page[0] + '-' + page[1];
                var newUrl = changeURLPar(content, 'range', param);
                newImgUrl.push(newUrl);
            }
            results.list.data.fileContentList = newImgUrl;
        }
        // 接口限制可预览页数
        let preRead = results.filePreview.data.preRead;
        if (!preRead) {
            preRead = results.filePreview.data.preRead = 50;
        }
        // 页面默认初始渲染页数
        let initReadPage = 4;
        // 360传递页数
        let pageFrom360 = req.query.page || 0;
        if (pageFrom360 > 0) {
            if (pageFrom360 < preRead) {
                initReadPage = pageFrom360;
            } else {
                initReadPage = results.filePreview.data.preRead;
            }
            results.filePreview.data.is360page = true;
        } else {
            results.filePreview.data.is360page = false;
        }
        results.filePreview.data.initReadPage = initReadPage;
    }
}

// 修改参数 有参数则修改 无则加
function changeURLPar(url, arg, arg_val) {
    var pattern = arg + '=([^&]*)';
    var replaceText = arg + '=' + arg_val;
    if (url.match(pattern)) {
        var tmp = '/(' + arg + '=)([^&]*)/gi';
        tmp = url.replace(eval(tmp), replaceText);
        return tmp;
    } else {
        if (url.match('[\?]')) {
            return url + '&' + replaceText;
        } else {
            return url + '?' + replaceText;
        }
    }
    // return url+'\n'+arg+'\n'+arg_val;
}