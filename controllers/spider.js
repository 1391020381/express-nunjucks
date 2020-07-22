/**
 * @Description: 蜘蛛模板
 */
var async = require("async");
var render = require("../common/render");
var server = require("../models/index");
var request = require('request');
var Api = require("../api/api");
var appConfig = require("../config/app-config");
var recommendConfigInfo = require('../common/recommendConfigInfo')
var util = require('../common/util');
var userID = Math.random().toString().slice(-15); //标注用户的ID，
var id = '';
var classId = '';
var spcClassId	= '';
var isGetClassType = '';
var picArr = [];
var fid = null;
var type = 'new'
var classId = null;
var title = null;
var spcClassId = null;
var isGetClassType = null;
var fileAttr = 1; //1 普通文件 2 办公频道文件
var format = '';
var classid1 = '';
var productType = ''
var userID = Math.random().toString().slice(-15); //标注用户的ID，
var sceneIDRelevant = ''; //场景的ID
var recommendInfoData_rele = {}; //相关推荐数据 (相关资料)
var requestID_rele = '';  //  相关推荐数据 (相关资料)requestID
var recRelateArrNum = 0;
var fileurl ='';
var uid =''
module.exports = {
    index: function (req, res) {
        if(req.query&&req.query.type) {
            type = req.query.type
        }
        return async.series({
            list: function (callback) {
                id = req.params.id.replace('-nbhh','')
                fileurl ="https://ishare.iask.sina.com.cn/f/"+id+'.html'
                var opt = {
                    method: 'POST',
                    url: appConfig.apiNewBaselPath+Api.spider.details,
                    body:JSON.stringify({
                        clientType: 0,
                        fid: id,  
                        sourceType: 1,
                        isIe9Low:parseInt(req.useragent.source.split(";")[1].replace(/[ ]/g, "").replace("MSIE",""))<9
                      }),
                    headers: {
                        'Content-Type': 'application/json',
                        'Cookie': 'cuk=' + req.cookies.cuk + ' ;JSESSIONID=' + req.cookies.JSESSIONID,
                    },
                };
                request(opt, function (err, res1, body) {
                    // console.log('detail-list-------------------:',JSON.parse(body))
                    if (body) {
                        var data = JSON.parse(body);
                        var fileInfo = data.data&&data.data.fileInfo;
                        var tdk = data.data&&data.data.tdk
                        if (data.code == 0 && data.data) {
                            // fileAttr ==  文件分类类型 1普通文件 2办公频道
                            fid = fileInfo.id;  // 文件id
                            fileAttr = fileInfo.fileAttr || 1;   // 文件分类类型 1普通文件 2办公频道
                            classId = fileInfo.classid;  // 分类id
                            classid1 = fileInfo.classid1;    
                            classid2 = fileInfo.classid2
                            format = fileInfo.format || '';   //  文件格式 txt,ppt,doc,xls（展示分为两种，txt为文本，其他图片格式展示）
                            productType = fileInfo.productType || '';  // 1:免费、3:在线 4：vip 5:付费 6：私有
                            title = fileInfo.title || "";   // 文件标题 (没有后缀格式)
                            isGetClassType = fileInfo.isGetClassType; // 分类类型 :0-读取平台分类 1-读取专题分类
                            spcClassId = fileInfo.spcClassId;   // 专题分类ID(最后一级)
                            uid= fileInfo.uid || ''           // 上传者id
                            var transcodeInfo = data.data&&data.data.transcodeInfo;
                            picArr = transcodeInfo?transcodeInfo.fileContentList:[];
                            if(fileInfo.showflag !=='y'){ // 文件删除
                                var searchQuery = `?ft=all&cond=${encodeURIComponent(encodeURIComponent(title))}` 
                                var results = {showFlag:false,searchQuery,statusCode:'404'}
                                res.status(404)
                                render("detail/index", results, req, res);
                                return
                            }
                            callback(null, data);
                        } else {
                            if(data.code == 'G-404'){ // 文件不存在
                                var results = {showFlag:false}
                                res.status(404)
                                render("detail/index", results, req, res);
                                return
                            }
                            callback(null, null);
                        }
                    } else {
                        callback(null, null);
                    }
                })
            },
            // 面包屑导航
            crumbList:function (callback) {
                // classId	string	文件分类id
                // spcClassId	String	专题分类ID(最后一级)
                // isGetClassType	Integer	分类类型 :0-读取平台分类 1-读取专题分类
                req.body = {
                    classId:classId,
                    spcClassId:spcClassId,
                    isGetClassType:isGetClassType
                };
                server.post(appConfig.apiNewBaselPath+Api.spider.crumbList, callback, req);
            },
            // 作者信息
            editorInfo:function(callback){
                server.get(appConfig.apiNewBaselPath + Api.spider.editorInfo.replace(/\$uid/, uid), callback, req);
            },
            // 文章详情
            fileDetailTxt:function(callback){
                req.body = {
                    fid:id
                };
                server.post(appConfig.apiNewBaselPath+Api.spider.fileDetailTxt, callback, req);
            },            // 动态获取第四范式 场景id 物料库id
            recommendInfo: function (callback) {
                // 必须是主站 不是私密文件 文件类型必须是 教育类||专业资料 ||经济管理 ||生活休闲 || 办公频道文件 
                //  classid1 =  '1820'                       
                if (fileAttr == 1 && productType != '6' && (classid1 == '1816' || classid1 == '1820' || classid1 == '1821' || classid1 == '1819' || classid1 == '1818')) {

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
                    pageIds = ['M_M_FD_doc_jjgl_relevant_1']
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
                if (recommendInfoData_rele.useId) {  // recommendInfo 接口中   recommendInfoData_rele = data[0] || {}; //相关资料  recommendInfoData_guess = data[1] || {}; // 个性化 猜你喜欢
                    sceneIDRelevant = recommendInfoData_rele.useId || '';
                    var opt = {
                        url: `https://nbrecsys.4paradigm.com/api/v0/recom/recall?requestID=${requestID_rele}&sceneID=${sceneIDRelevant}&userID=${userID}`,
                        method: 'POST',
                        body: JSON.stringify({ "itemID": id, "itemTitle": title })
                    }
                    request(opt, function (err, res, body) {
                        if (body) {
                            try {
                                var data = JSON.parse(body);
                                recRelateArrNum = data.length
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
            //热点搜索
            hotpotSearch:function(callback){
                req.body = {
                    searchKey: title,
                    currentPage:1,
                    pageSize:40
                };
                if(recRelateArrNum<31) {
                    server.post(appConfig.apiNewBaselPath+Api.spider.hotpotSearch, callback, req);
                }
            },
            // 热点专题
            hotTopicSearch:function(callback){
                req.body = {
                    topicName: title,
                    currentPage:1,
                    pageSize:40,
                    siteCode:'4'
                };
                server.post(appConfig.apiNewBaselPath+Api.spider.hotTopicSearch, callback, req);
            },
             // 热门专题（晒内容）
             hotTopicSeo:function(callback){
                // console.log(appConfig.apiNewBaselPath+Api.index.randomRecommend)
                req.body = {
                    type: 'topic',
                    currentPage:1,
                    pageSize:20,
                    siteCode:4,
                    random:'y'
                };
                server.post(appConfig.apiNewBaselPath+Api.spider.newRecData, callback, req);
            },
            // 最新搜索（晒内容）
            newsRec:function(callback){
                req.body = {
                    type: 'new',
                    currentPage:1,
                    pageSize:20,
                    siteCode:4,
                    random:'y'
                };
                server.post(appConfig.apiNewBaselPath+Api.spider.newRecData, callback, req);
            },
            // 热门推荐（晒内容）
            hotRecData:function(callback){
                req.body = {
                    contentType: 100,
                    clientType:0,
                    pageSize:20,
                    siteCode:0
                };
                server.post(appConfig.apiNewBaselPath+Api.spider.hotRecData, callback, req);
            }

        } , function(err, results){
            // doc对应Word、ppt对应PowerPoint、xls对应Excel、txt对应记事本、pdf对应PDF阅读器
            var readTool ={
                Word:'Word',
                PowerPoint:'PowerPoint',
                Excel:'Excel',
                txt:'记事本',
                pdf:'PDF阅读器'
            }
            var moduleType ={
                Word:'Word模板',
                PowerPoint:'PPT模板',
                Excel:'Excel表格模板',
                txt:'记事本',
                pdf:'在线阅读'
            }
            if(results.list.data && results.list.data.fileInfo) {
                results.list.data.fileInfo.readTool = readTool;
                results.list.data.fileInfo.moduleType = moduleType;
            }
            
            //对正文进行处理
            var textString =  results.fileDetailTxt.data||'';
            console.log(JSON.stringify(results.hotRecData),'results.hotRecData')
           if(picArr.length>6) {
                picArr = picArr.slice(0,6)
           }
           var sliceNum = Math.ceil(textString.length/picArr.length);
           var newTextArr = [];
           for(var i =0; i<picArr.length; i++) {
                var txt = textString.substr(sliceNum*i,sliceNum);
                var obj = {};
                obj.txt = txt;
                obj.img = picArr[i];
                newTextArr.push(obj)
           }
           if( results.crumbList&&results.crumbList.data){
            results.crumbList.data.isGetClassType = isGetClassType || 0;
           }
           
           var description = textString.substr(0,200);
           if(description.length>0) {
             description = description.replace(/\s+/g, "")
             if(description.length>0){
                description = description.replace(/<\/?.+?>/g,""); 
                description = description.replace(/[\r\n]/g, "");
             }
           }
           var brief = textString.substr(0,300);
           if(brief.length>0){
                brief = brief.replace(/\s+/g, "")
                brief = brief.replace(/<\/?.+?>/g,""); 
                brief = brief.replace(/[\r\n]/g, "");
           }
           results.brief = brief
           results.seo = {};
           results.seo.description = description ||'';
           results.seo.fileurl = fileurl;
           //对相关资料数据处理
           if(recRelateArrNum>30) {
                results.relevantList=results.paradigm4Relevant.slice(0,10)
                results.guessLikeList=results.paradigm4Relevant.slice(10,21)
           }else {
                if(results.hotpotSearch.data&&results.hotpotSearch.data.rows){
                    results.relevantList=results.hotpotSearch.data.rows.slice(0,10)
                    results.guessLikeList=results.hotpotSearch.data.rows.slice(10,31)
                }
           }
           // 对最新资料  推荐专题数据处理

           if(results.newRecData &&results.newRecData.data && type!="hot"){
                results.newRecList=results.newRecData.data.map(item=>{
                    if(type=="new") {
                        item.link ="/f/"+item.id+'.html'
                    }else if(type=="topic"){
                        item.link ="/node/s/"+item.id+'.html'
                    }
                    return item;
                })
           }
           // 热门推荐数据处理
           if(results.hotRecData &&results.hotRecData.data && type =="hot"){
            results.newRecList=results.hotRecData.data.map(item=>{
                    item.link = item.contentUrl;
                    item.title= item.contentName;
                    return item;
                })
           }
           // 对热门搜索的主题数进行限制
           results.newRecList = results.newRecList?results.newRecList:[];
           results.type = type;
           if(results.newsRec && results.newsRec.data){
            results.newPagetotal = results.newsRec.data.length
        }else{
            results.newsRec.data = []
        }
           console.log(JSON.stringify(results.hotTopicSearch),'hotTopicSearch')
           results.fileDetailArr = newTextArr;
            render("spider/index", results, req, res);
        })
    }
};