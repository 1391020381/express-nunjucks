/**
 * @Description: 详情页
 */
var async = require("async");
var render = require("../common/render");
var server = require("../models/index");
var util = require('../common/util');
var recommendConfigInfo = require('../common/recommendConfigInfo')
var Api = require("../api/api");
var request = require('request');
var appConfig = require("../config/app-config");
var fid = null;

var classId = null;
var title = null;
var spcClassId = null;
var isGetClassType = null;

var format = '';
var classid1 = '';
var classid2 = ''
var perMin = '';
var productType = ''
var userID = Math.random().toString().slice(-15); //标注用户的ID，
var sceneIDRelevant = ''; //场景的ID
var sceneIDGuess = ''; //场景的ID
var recommendInfoData_rele = {}; //相关推荐数据 (相关资料)
var recommendInfoData_guess = {}; //个性化数据(猜你喜欢)
var requestID_rele = '';  //  相关推荐数据 (相关资料)requestID
var requestID_guess = '';  //  个性化数据(猜你喜欢) requestID
var defaultResultsData = {recommendInfoData_rele:{},recommendInfoData_guess:{},paradigm4Guess:{},paradigm4Relevant:{},list:{data:{svgFlag:true,supportSvg:true,fileContentList:[],svgPathList:[],isDownload:'no'}}} // 确保私有 删除  404 显示用户信息 用户可以登录
module.exports = {
    render: function (req, res,next) {
        var _index = {
             // 查询是否重定向
             redirectUrl:function(callback) {
                 
                var opt = {
                    method: 'POST',
                    url: appConfig.apiNewBaselPath + Api.file.redirectUrl,
                    body:JSON.stringify({
                        sourceLink:req.protocol+'://'+req.hostname+req.url
                    }),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                };
                request(opt,function(err,res1,body){
                    if(body){
                        var data = JSON.parse(body);
                        console.log('请求地址post-------------------:',opt.url)
                        console.log('请求参数-------------------:',opt.body)
                        console.log('返回code------:'+data.code,'返回msg-------:'+data.msg)
                        if (data.code == 0 ){
                            if (data.data) {
                                if(data.data.targetLink) {
                                    var  url =data.data.type ==1? req.protocol+'://'+data.data.targetLink:req.protocol+'://'+req.hostname+'/f/'+data.data.targetLink+'.html';
                                    res.redirect(url);
                                    return;
                                }
                            }else{
                                callback(null,null)
                            }
                        }else{
                            callback(null,null)
                        }
                    }else{
                      callback(null,null)
                    }
                })
            },
            list: function (callback) {  
                var opt = {
                    method: 'POST',
                    url: appConfig.apiNewBaselPath + Api.file.getFileDetailNoTdk,
                    body:JSON.stringify({
                        clientType: 0,
                        fid: req.params.id,  
                        sourceType: 0
                      }),
                    headers: {
                        'Content-Type': 'application/json'
                    },
                };
                request(opt, function (err, res1, body) {
                    console.log('opt:',JSON.stringify(opt))
                    
                    if(res1&&res1.statusCode == 503){ // http请求503
                            console.log('--------详情页503重定向到503页面-------------')
                            res.redirect(`/node/503.html?fid=${req.params.id}`);
                            return;     
                    }
                    if (body) {
                       var uid = req.cookies.ui?JSON.parse(req.cookies.ui).uid:''
                        var cuk = req.cookies.cuk
                        var data = JSON.parse(body);
                        console.log('请求地址post-------------------:',opt.url)
                        console.log('请求参数-------------------:',opt.body)
                        console.log('返回code------:'+data.code,'返回msg-------:'+data.msg)
                        var fileInfo = data.data&&data.data.fileInfo
                        var tdk = data.data&&data.data.tdk
                        if (data.code == 0 && data.data) {
                         
                            if(fileInfo.site == 0){
                                // 跳转到办公携带参数修改
                             
                                var officeParams = 'utm_source=ishare&utm_medium=ishare&utm_content=ishare&utm_campaign=ishare&utm_term=ishare';
                                res.redirect(`https://office.iask.com/f/${fileInfo.id}.html?`+officeParams);
                                return
                            }

                            fid = fileInfo.id;  // 文件id
                            classId = fileInfo.classid;  // 分类id
                            title = fileInfo.title || "";   // 文件标题 (没有后缀格式)
                            isGetClassType = fileInfo.isGetClassType; // 分类类型 :0-读取平台分类 1-读取专题分类
                            spcClassId = fileInfo.spcClassId;   // 专题分类ID(最后一级)
                          
                            format = fileInfo.format || '';   //  文件格式 txt,ppt,doc,xls（展示分为两种，txt为文本，其他图片格式展示）
                            classid1 = fileInfo.classid1;    
                            classid2 = fileInfo.classid2
                            perMin = fileInfo.permin || '';  // 1:公开、2:私人 3:付费
                            productType = fileInfo.productType
                  
                            userID = fileInfo.uid&&fileInfo.uid.slice(0, 10) || ''; //来标注用户的ID，
                            if(fileInfo.showflag !=='y'){ // 文件删除
                                var searchQuery = `?ft=all&cond=${encodeURIComponent(encodeURIComponent(title))}` 
                                var results = Object.assign({},{showFlag:false,searchQuery,statusCode:'404',isDetailRender:true},defaultResultsData) 
                                res.status(404)
                                render("detail/index", results, req, res);
                                return
                            }
                             if(productType == 6){
                                 if(cuk&&fileInfo.uid&&fileInfo.uid == uid){ 
                                    callback(null, data);
                                 }else{
                                var searchQuery = `?ft=all&cond=${encodeURIComponent(encodeURIComponent(title))}` 
                                var results = Object.assign({},{showFlag:false,searchQuery,isPrivate:true,statusCode:'302',isDetailRender:true},defaultResultsData)
                                res.status(302)
                                render("detail/index", results, req, res);
                                return   
                                 }
                             }else{
                                callback(null, data); 
                             }
                        } else {
                            if(data.code == 'G-404'){ // 文件不存在
                                var results = Object.assign({},defaultResultsData,{showFlag:false,statusCode:'404',isDetailRender:true})
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
            getTopBannerList:function(callback){ // 页面顶部banner
                if(req.cookies.isHideDetailTopbanner){
                    callback(null,null)
                    return
                }
                var opt = {
                    method: 'POST',
                    url: appConfig.apiNewBaselPath + Api.recommendConfigInfo,
                    body:JSON.stringify(recommendConfigInfo.details.topBanner.pageId),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                };
                request(opt,function(err,res1,body){
                    if(body){
                        var data = JSON.parse(body);
                        console.log('请求地址post-------------------:',opt.url)
                        console.log('请求参数-------------------:',opt.body)
                        console.log('返回code------:'+data.code,'返回msg-------:'+data.msg)
                        if (data.code == 0 ){
                            callback(null, util.handleRecommendData(data.data[0]&&data.data[0].list||[]));
                        }else{
                            callback(null,null)
                        }
                    }else{
                      callback(null,null)
                    }
                })
            },
            geSearchBannerList:function(callback){
                var opt = {
                    method: 'POST',
                    url: appConfig.apiNewBaselPath + Api.recommendConfigInfo,
                    body:JSON.stringify(recommendConfigInfo.details.searchBanner.pageId),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                };
                request(opt,function(err,res1,body){
                    if(body){
                        var data = JSON.parse(body);
                        console.log('请求地址post-------------------:',opt.url)
                        console.log('请求参数-------------------:',opt.body)
                        console.log('返回code------:'+data.code,'返回msg-------:'+data.msg)
                        if (data.code == 0 ){
                            callback(null, util.handleRecommendData(data.data[0]&&data.data[0].list||[]));
                        }else{
                            callback(null,null)
                        }
                    }else{
                      callback(null,null)
                    }
                })
            },
            getBannerList:function(callback){
                var params = dealParam(format,classid1,classid2)
                var opt = {
                    method: 'POST',
                    url: appConfig.apiNewBaselPath + Api.recommendConfigRuleInfo,
                    body:JSON.stringify(params),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                };
                request(opt,function(err,res1,body){
                    if(body){
                        var data = JSON.parse(body);
                        console.log('请求地址post-------------------:',opt.url)
                        console.log('请求参数-------------------:',opt.body)
                        console.log('返回code------:'+data.code,'返回msg-------:'+data.msg)
                        var bannerList = {
                            'rightTopBanner':[],
                            'rightBottomBanner':[],
                            'titleBottomBanner':[],
                            'turnPageOneBanner':[],
                            'turnPageTwoBanner':[]
                        }
                        if (data.code == 0 ){
                            data.data.forEach(item=>{
                               bannerList[item.id] = util.handleRecommendData(item.fileRecommend&&item.fileRecommend.list||[])
                            })
                            callback(null, bannerList);
                        }else{
                            callback(null,null)
                        }
                    }else{
                      callback(null,null)
                    }
                })
                
            },
            // 面包屑导航
            crumbList: function (callback) {
      
               var opt = {
                method: 'POST',
                url: appConfig.apiNewBaselPath + Api.file.navCategory,
                body:JSON.stringify({
                    classId: classId,
                    spcClassId: spcClassId,  
                    isGetClassType: isGetClassType
                  }),
                headers: {
                    'Content-Type': 'application/json'
                },
            };
            request(opt, function (err, res1, body) {
              if(body){
                var data = JSON.parse(body);
                console.log('请求地址post-------------------:',opt.url)
                console.log('请求参数-------------------:',opt.body)
                console.log('返回code------:'+data.code,'返回msg-------:'+data.msg)
                if (data.code == 0){
                    callback(null, data);
                }else{
                    callback(null,null)
                }
              }else {
                callback(null, null);
            }        
            })
            },
            //相关资料   在最后被 第四范式 相关推荐 覆盖
            RelevantInformationList: function (callback) {
                callback(null, null);
            },

            // 动态获取第四范式 场景id 物料库id
            recommendInfo: function (callback) {
                // 必须是主站 不是私密文件 文件类型必须是 教育类||专业资料 ||经济管理 ||生活休闲 || 办公频道文件 
                //  classid1 =  '1820'                       
                if ( productType != '6' && (classid1 == '1816' || classid1 == '1820' || classid1 == '1821' || classid1 == '1819' || classid1 == '1818')) {

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

                    let url = appConfig.newBasePath + '/gateway/recommend/config/info' 
                    let option = {
                        url: url,
                        method: 'POST',
                        body: JSON.stringify(pageIds),
                        headers: {
                            'Content-Type': 'application/json'
                        },
                    }
                    request(option, function (err, res, body) {
                        if (body) {
                            try {
                                var resData = JSON.parse(body);
                                console.log('请求地址post-------------------:',option.url)
                                console.log('请求参数-------------------:',option.body)
                                console.log('返回code------:'+resData.code,'返回msg-------:'+resData.msg)
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
            //第四范式 相关推荐
            paradigm4Relevant: function (callback) {
                requestID_rele = Math.random().toString().slice(-10);//requestID是用来标注推荐服务请求的ID，是长度范围在8~18位的随机字符串
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
                                console.log('请求地址post-------------------:',opt.url)
                                console.log('请求参数-------------------:',opt.body)
                                console.log('返回code------:'+data.code,'返回msg-------:'+data.msg)
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
            },
            //第四范式  猜你喜欢
            paradigm4Guess: function (callback) {
                requestID_guess = Math.random().toString().slice(-10);//requestID是用来标注推荐服务请求的ID，是长度范围在8~18位的随机字符串
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
                                console.log('请求地址post-------------------:',opt.url)
                                console.log('请求参数-------------------:',opt.body)
                                console.log('返回code------:'+data.code,'返回msg-------:'+data.msg)
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
            },
            filePreview: function (callback) {
                 var validateIE9 = req.headers['user-agent']? ['IE9', 'IE8', 'IE7', 'IE6'].indexOf(util.browserVersion(req.headers['user-agent'])) === -1 ? 0 : 1:0;
              
                var opt = {
                    method: 'POST',
                    url: appConfig.apiNewBaselPath + Api.file.preReadPageLimit,
                    body:JSON.stringify({
                        fid:fid,
                        validateIE9:validateIE9  
                    }),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                };
                request(opt,function(err,res1,body){
                    if(body){
                        var data = JSON.parse(body);
                        console.log('请求地址post-------------------:',opt.url)
                        console.log('请求参数-------------------:',opt.body)
                        console.log('返回code------:'+data.code,'返回msg-------:'+data.msg)
                        if (data.code == 0 ){
                            callback(null, data);
                        }else{
                            callback(null,null)
                        }
                    }else{
                      callback(null,null)
                    }
                })
            }
        };
        return async.series(_index, function (err, results) { // async.series 串行无关联
            if (!results.list || results.list.code == 40004 || !results.list.data) {
                res.redirect('/node/404.html');
                return;
            }
         // 转换新对象
         let fileInfo =  results.list.data.fileInfo
         fileInfo.readTimes = Math.ceil((fileInfo.praiseNum + fileInfo.collectNum) * 1.9)
             var list = Object.assign({},{data:Object.assign({},results.list.data.fileInfo,results.list.data.transcodeInfo)})
            if(!list.data.fileContentList){
                list.data.fileContentList = []
                list.data.isConvert = 0
            }
            if(!list.data.svgPathList){
                list.data.svgPathList = []
                list.data.isConvert = 0
            }
            
             var results = Object.assign({},results,{list:list})
            var svgPathList = results.list.data.svgPathList;
            results.list.data.supportSvg = req.headers['user-agent']?['IE9', 'IE8', 'IE7', 'IE6'].indexOf(util.browserVersion(req.headers['user-agent'])) === -1:false;
            results.list.data.svgFlag = !!(svgPathList && svgPathList.length > 0);
            results.crumbList.data.isGetClassType = isGetClassType || 0;
            getInitPage(req, results);
          
            // 如果有第四范式 相关
            if (results.paradigm4Relevant) {
                var paradigm4RelevantMap = results.paradigm4Relevant.map(item => {
                    return {
                        id: item.item_id || '',
                        format: item.extra1 || format || '',
                        name: item.title || '',
                        cover_url: item.cover_url || '',
                        url: item.url || '',
                        item_read_cnt:item.item_read_cnt
                    }
                })
                
                results.RelevantInformationList = {}   // RelevantInformationList 接口被注释 为了 不修改页面取数据的格式,自己在 results上添加一个RelevantInformationList
                results.RelevantInformationList.data = paradigm4RelevantMap.slice(0,4) || [];
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
            // 要在这里给默认值 不然报错
            results.recommendInfoData_rele = recommendInfoData_rele || {};
            results.recommendInfoData_guess = recommendInfoData_guess || {};
            results.showFlag = true
         
            results.isDetailRender = true

           
            if(results.list.data&&results.list.data.abTest ){
                render("detail-b/index", results, req, res);
            }else{
                render("detail/index", results, req, res);
            }
            //释放 不然 会一直存在
            recommendInfoData_rele = {};
            recommendInfoData_guess = {};
           

        })
    },
    success: function (req, res) {
        var _index = {
            list: function (callback) {
                var opt = {
                   
                    method: 'POST',
                    url: appConfig.apiNewBaselPath + Api.file.fileDetail,
                    body:JSON.stringify({
                        clientType: 0,
                        fid: req.query.fid,  
                        sourceType: 1
                      }),
                    headers: {
                        'Content-Type': 'application/json'
                    },
                };
                request(opt, function (err, res1, body) {
                    if (body) {
                        var data = JSON.parse(body);
                        var fileInfo = data.data&&data.data.fileInfo
                        var tdk = data.data&&data.data.tdk
                        //console.warn('data----------------',data)
                        if (data.code == 0 && data.data) {
                           
                            

                            fid = fileInfo.id;  // 文件id
                            classId = fileInfo.classid;  // 分类id
                            title = fileInfo.title || "";   // 文件标题 (没有后缀格式)
                            isGetClassType = fileInfo.isGetClassType; // 分类类型 :0-读取平台分类 1-读取专题分类
                            spcClassId = fileInfo.spcClassId;   // 专题分类ID(最后一级)
                      
                            format = fileInfo.format || '';   //  文件格式 txt,ppt,doc,xls（展示分为两种，txt为文本，其他图片格式展示）
                            classid1 = fileInfo.classid1;    
                            classid2 = fileInfo.classid2
                            perMin = fileInfo.permin || '';  // 1:公开、2:私人 3:付费
                            uid= fileInfo.uid || ''           // 上传者id
                            userID = fileInfo.uid&&fileInfo.uid.slice(0, 10) || ''; //来标注用户的ID，
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
            recommendInfo: function (callback) {
                // 必须是主站 不是私密文件 文件类型必须是 教育类||专业资料 ||经济管理 ||生活休闲 || 办公频道文件 
                //  classid1 =  '1820'                       
                if ( perMin != '2' && (classid1 == '1816' || classid1 == '1820' || classid1 == '1821' || classid1 == '1819' || classid1 == '1818')) {

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

                    let url =  appConfig.newBasePath + '/gateway/recommend/config/info' 
                    let option = {
                        url: url,
                        method: 'POST',
                        body: JSON.stringify(pageIds),
                        headers: {
                            'Content-Type': 'application/json'
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
        return async.series(_index, function (err, results) { // async.series 串行无关联

           
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
            }
            var list = Object.assign({},{data:Object.assign(results.list&&results.list.data.fileInfo,results.list.data.tdk,results.list.data.transcodeInfo,{title:results.list.data.fileInfo.title})})
            var unloginFlag = req.query.unloginFlag
            var consumeStatus = req.query.consumeStatus    // 7 已经下载过
            var results = Object.assign({},results,{list:list},{unloginFlag:unloginFlag,consumeStatus:consumeStatus})
            // 要在这里给默认值 不然报错
            render("detail/success", results, req, res);
        })
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
                newImgUrl.push(newUrl);
            }
            results.list.data.fileContentList =newImgUrl;
        }
        // 接口限制可预览页数
        if(!results.filePreview.data){
            results.filePreview.data = {}
        }
        let fileContentList = results.list.data&&results.list.data.fileContentList 
        let preRead = results.filePreview.data.preRead;
        if (!preRead) {
            preRead = results.filePreview.data.preRead = 50;
        }
        // 页面默认初始渲染页数
        
        let initReadPage = Math.min(fileContentList.length,preRead,4);
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

// 组装getBannerList参数
function dealParam(format,classid1,classid2){//处理详情推荐位参数
    var defaultType = 'all'
    var  params = [
        {
            id:'rightTopBanner',
            pageIds:[
                `PC_M_FD_${format}_${classid2}_ru`,
                `PC_M_FD_${format}_${classid1}_ru`,
                `PC_M_FD_${defaultType}_${classid2}_ru`,
                `PC_M_FD_${defaultType}_${classid1}_ru`,
            ]
        },
        {
            id:'rightBottomBanner',
            pageIds:[ //
                `PC_M_FD_${format}_${classid2}_rd`,
                `PC_M_FD_${format}_${classid1}_rd`,
                `PC_M_FD_${defaultType}_${classid2}_rd`,
                `PC_M_FD_${defaultType}_${classid1}_rd`,
            ]
        },
        {
            id:'titleBottomBanner',
            pageIds:[
                `PC_M_FD_${format}_${classid2}_ub`,
                `PC_M_FD_${format}_${classid1}_ub`,
                `PC_M_FD_${defaultType}_${classid2}_ub`,
                `PC_M_FD_${defaultType}_${classid1}_ub`,
            ]  
        },
        {
            id:'turnPageOneBanner',
            pageIds:[
                `PC_M_FD_${format}_${classid2}_fy1b`,
                `PC_M_FD_${format}_${classid1}_fy1b`,
                `PC_M_FD_${defaultType}_${classid2}_fy1b`,
                `PC_M_FD_${defaultType}_${classid1}_fy1b`,
            ]  
        },
        {
            id:'turnPageTwoBanner',
            pageIds:[
                `PC_M_FD_${format}_${classid2}_fy2b`,
                `PC_M_FD_${format}_${classid1}_fy2b`,
                `PC_M_FD_${defaultType}_${classid2}_fy2b`,
                `PC_M_FD_${defaultType}_${classid1}_fy2b`,
            ]  
        }
    ]
    return params    
}