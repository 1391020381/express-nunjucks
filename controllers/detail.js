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
               console.log('详情页start===============', appConfig.apiNewBaselPath + Api.file.fileDetail.replace(/\$id/, req.params.id));
                var opt = {
                    // url: appConfig.apiBasePath + Api.file.fileDetail.replace(/\$id/, req.params.id),
                    method: 'POST',
                    url: appConfig.apiNewBaselPath + Api.file.fileDetail,
                    body:JSON.stringify({
                        clientType: 0,
                        fid: req.params.id,  
                        sourceType: 1,
                        isIe9Low:parseInt(req.useragent.source.split(";")[1].replace(/[ ]/g, "").replace("MSIE",""))<9
                      }),
                    headers: {
                        'Content-Type': 'application/json',
                        'Cookie': 'cuk=' + req.cookies.cuk + ' ;JSESSIONID=' + req.cookies.JSESSIONID,
                    },
                };
                console.log('opt:',opt)
                request(opt, function (err, res1, body) {
                    console.log('detail-list-------------------:',JSON.parse(body))
                    if (body) {
                        var data = JSON.parse(body);
                        var fileInfo = data.data&&data.data.fileInfo
                        var tdk = data.data&&data.data.tdk
                        //console.warn('data----------------',data)
                        if (data.code == 0 && data.data) {
                            // fileAttr ==  文件分类类型 1普通文件 2办公频道
                            if(data.data.fileAttr == 2){
                                res.redirect(`http://office.iask.com/f/${data.data.fileId}.html?form=ishare`);
                                return
                            }

                            fid = fileInfo.id;  // 文件id
                            classId = fileInfo.classid;  // 分类id
                            title = fileInfo.title || "";   // 文件标题 (没有后缀格式)
                            isGetClassType = fileInfo.isGetClassType; // 分类类型 :0-读取平台分类 1-读取专题分类
                            spcClassId = fileInfo.spcClassId;   // 专题分类ID(最后一级)
                            fileAttr = fileInfo.fileAttr || 1;   // 文件分类类型 1普通文件 2办公频道
                            format = fileInfo.format || '';   //  文件格式 txt,ppt,doc,xls（展示分为两种，txt为文本，其他图片格式展示）
                            classid1 = fileInfo.classid1;    // 文档暂无说明
                            perMin = fileInfo.perMin || '';  // 1:公开、2:私人 3:付费
                            uid= fileInfo.uid || ''           // 上传者id
                            // userID = data.data.uid.slice(0, 10) || ''; //来标注用户的ID，
                            callback(null, data);
                        } else {
                            callback(null, null);
                        }
                    } else {
                        callback(null, null);
                    }
                })
            },
            getUserFileZcState:function(callback){
                if(req.cookies.ui){
                    var uid=JSON.parse(req.cookies.ui).uid;
                    server.$http(appConfig.apiNewBaselPath + Api.file.getUserFileZcState+`?fid=${fid}&uid=${uid}`,'get', req, res, true).then(item=>{
                        callback(null,item)
                    })
                }else{
                    callback(null,null)
                }
            },
            // 面包屑导航
            crumbList: function (callback) {
                //console.log('crumbListParams',appConfig.apiBasePath + Api.file.fileCrumb.replace(/\$isGetClassType/, isGetClassType).replace(/\$spcClassId/, spcClassId).replace(/\$classId/, classId))
                server.get(appConfig.apiBasePath + Api.file.fileCrumb.replace(/\$isGetClassType/, isGetClassType).replace(/\$spcClassId/, spcClassId).replace(/\$classId/, classId), callback, req)
            },
            //相关资料   在最后被 第四范式 相关推荐 覆盖
            // RelevantInformationList: function (callback) {
            //     if (fileAttr == 1) {
            //         server.get(appConfig.apiBasePath + Api.file.fileList.replace(/\$fid/, fid).replace(/\$limit/, ''), callback, req)
            //     } else {
            //         callback(null, null);
            //     }
            // },

            // 动态获取第四范式 场景id 物料库id
            recommendInfo: function (callback) {
                // 必须是主站 不是私密文件 文件类型必须是 教育类||专业资料 ||经济管理 ||生活休闲 || 办公频道文件 
                classid1 =  '1820'                       
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


                if (recommendInfoData_rele.useId) {  // recommendInfo 接口中   recommendInfoData_rele = data[0] || {}; //相关资料  recommendInfoData_guess = data[1] || {}; // 个性化 猜你喜欢
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

                if (recommendInfoData_guess.useId) { // recommendInfo 接口中   recommendInfoData_rele = data[0] || {}; //相关资料  recommendInfoData_guess = data[1] || {}; // 个性化 猜你喜欢
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
            // 用户评论   用户评论被删除
            // commentList: function (callback) {
            //     server.get(appConfig.apiBasePath + Api.file.commentList.replace(/\$fid/, fid), callback, req)
            // },
            filePreview: function (callback) {
                var validateIE9 = ['IE9', 'IE8', 'IE7', 'IE6'].indexOf(util.browserVersion(req.headers['user-agent'])) === -1 ? 0 : 1;
                server.get(appConfig.apiBasePath + Api.file.preReadPageLimit.replace(/\$fid/, fid).replace(/\$validateIE9/, validateIE9), callback, req, true);
            }
        };
        return async.series(_index, function (err, results) { // async.series 串行无关联

            if (!results.list || results.list.code == 40004 || !results.list.data) {
                res.redirect('/html/404.html');
                console.log("404==========");
                return;
            }
         //   console.log(results,'pc-node results----------');
         
         // 转换新对象
             var list = Object.assign({},{data:Object.assign(results.list.data.fileInfo,results.list.data.tdk,results.list.data.transcodeInfo)})
             var results = Object.assign({},results,{list:list})
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
                results.RelevantInformationList = {}   // RelevantInformationList 接口被注释 为了 不修改页面取数据的格式,自己在 results上添加一个RelevantInformationList
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
                        url: item.url || '',
                        item_read_cnt:item.item_read_cnt
                    }
                })
                results.paradigm4GuessData = paradigm4Guess || [];
                results.requestID_guess = requestID_guess;
                results.userID = userID;

            }
           // console.log('results.paradigm4GuessData',results.paradigm4GuessData)
            // 要在这里给默认值 不然报错
            results.recommendInfoData_rele = recommendInfoData_rele || {};
            results.recommendInfoData_guess = recommendInfoData_guess || {};
            console.log('results:',results)
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
        if (results.list.data.state === 3) {   // 1:免费文档 2:下载券文档 3:付费文档 4:仅供在线阅读 5:VIP免费文档 6:VIP特权文档
            let content = results.list.data.url || results.list.data.fileContentList[0];  //  fileContentList 存储文件所有内容（不超过50页）；Array的每个值代表一个结果
            let bytes = filePreview.data.pinfo.bytes || {}; // bytes 转码预览html文本md5
            let newImgUrl = [];
            for (var key in bytes) {
                var page = bytes[key];
                var param = page[0] + '-' + page[1];
                var newUrl = changeURLPar(content, 'range', param);
                //console.log(newUrl,'newUrl-------------------')
                newImgUrl.push(newUrl);
            }
            results.list.data.fileContentList =newImgUrl;
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