/**
 * @Description: 蜘蛛模板
 */

var render = require("../common/render");
var server = require("../models/index");
var Api = require("../api/api");
var appConfig = require("../config/app-config");
const cc = require('../common/cc')

const renderPage = cc(async(req,res,next)=>{
    console.log('req.headers[user-agent]:',req.headers['user-agent'])
    let userID = Math.random().toString().slice(-15); //标注用户的ID，
    let type = req.query&&req.query.type || 'new'
    let id = req.params.id.replace('-nbhh','')
    let fileurl ="https://ishare.iask.sina.com.cn/f/"+id+'.html'
    const list = await getList(req,res,id)

    if(list.code == 'G-404'){ // 文件不存在
        var results = {showFlag:false}
        res.status(404)
        render("detail/index", results, req, res);
        return
    }
    if(list.data.fileInfo.showflag !=='y'){ // 文件删除
        var searchQuery = `?ft=all&cond=${encodeURIComponent(encodeURIComponent(title))}` 
        var results = {showFlag:false,searchQuery,statusCode:'404'}
        res.status(404)
        render("detail/index", results, req, res);
        return
    }
    const crumbList = await getCrumbList(req,res,list)
    const editorInfo = await getEditorInfo(req,res,list)
    const fileDetailTxt = await getFileDetailTxt(req,res)
    const recommendInfo = await getRecommendInfo(req,res,list) 
    const paradigm4Relevant = await getParadigm4Relevant(req,res,list,recommendInfo,userID)
    const hotRecData =  await getHotRecData(req,res)
    handleSpiderData({req,res,list,crumbList,editorInfo,fileDetailTxt,recommendInfo,paradigm4Relevant,hotRecData,type,fileurl})
})

module.exports = {
    index:renderPage
}


function getList(req,res,id){
    req.body = {
        clientType: 0,
        fid: id,  
        sourceType: 1
      }
    return server.$http(appConfig.apiNewBaselPath+Api.spider.details,'post', req,res,true) 
}

function getCrumbList(req,res,list){
    let classId = list.data.fileInfo.classId
    let spcClassId = list.data.fileInfo.spcClassId
    let isGetClassType = list.data.fileInfo.isGetClassType
    req.body = {
        classId: classId,
        spcClassId: spcClassId,  
        isGetClassType: isGetClassType
      }
    return server.$http(appConfig.apiNewBaselPath + Api.file.navCategory,'post', req,res,true)
}
function getEditorInfo(req,res,list){
    let uid = list.data.fileInfo.uid
    let url = appConfig.apiNewBaselPath + Api.spider.editorInfo.replace(/\$uid/, uid)
    return server.$http(url,'get', req, res, true)
}

function getFileDetailTxt(req,res){
    req.body = {
        fid:req.params.id.replace('-nbhh','')
    };
    return server.$http(appConfig.apiNewBaselPath+Api.spider.fileDetailTxt,'post', req,res,true)
}


function getRecommendInfo(req,res,list){
    const productType = list.data.fileInfo.productType
    const classid1 = list.data.fileInfo.classid1
    let format = list.data.fileInfo.format
    // 必须是主站 不是私密文件 文件类型必须是 教育类||专业资料 ||经济管理 ||生活休闲 || 办公频道文件 
    if ( productType != '6' && (classid1 == '1816' || classid1 == '1820' || classid1 == '1821' || classid1 == '1819' || classid1 == '1818')) {
          //关联推荐 教育类型 'jy'  'zyzl' 'jjgl' 'shxx'
          const pageIdsConfig_jy_rele = {
            'doc': 'doc_jy_20200220_001',
            'txt': 'doc_jy_20200220_001',
            'pdf': 'doc_jy_20200220_001',
            'xls': 'xls_jy_20200220_001',
            'ppt': 'ppt_jy_20200220_001',
        }

        //个性化推荐 教育类型
        const pageIdsConfig_jy_guess = {
            'doc': 'doc_jy_20200220_002',
            'txt': 'doc_jy_20200220_002',
            'pdf': 'doc_jy_20200220_002',
            'xls': 'xls_jy_20200220_002',
            'ppt': 'ppt_jy_20200220_002',
        }
               //关联推荐(相关资料)
        const rele_pageId = pageIdsConfig_jy_rele[format];
               //个性化推荐(猜你喜欢)
        const guess_pageId = pageIdsConfig_jy_guess[format];
        let pageIds = [];
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
        req.body = pageIds
        // '/gateway/recommend/config/info' 
        return server.$http(appConfig.apiNewBaselPath + Api.recommendConfigInfo,'post', req,res,true) 
    }else{
        return null
    }    

}

function getParadigm4Relevant(req,res,list,recommendInfo,userID){
    let requestID_rele = Math.random().toString().slice(-10);//requestID是用来标注推荐服务请求的ID，是长度范围在8~18位的随机字符串
    
    let recommendInfoData_rele = recommendInfo.data[0] || {} //相关资料
    req.requestID_rele = requestID_rele
    req.recommendInfoData_rele = recommendInfoData_rele
    if(recommendInfoData_rele.useId){
       let sceneIDRelevant = recommendInfoData_rele.useId || '';
       req.body = { "itemID": list.data.fileInfo.fid, "itemTitle": list.data.fileInfo.title }
      
       let url = `https://nbrecsys.4paradigm.com/api/v0/recom/recall?requestID=${requestID_rele}&sceneID=${sceneIDRelevant}&userID=${userID}`
       return server.$http(url,'post', req,res,true)
    }else{
        return null
    }
}

function getHotpotSearch(req,res,list,paradigm4Relevant){
    let recRelateArrNum = paradigm4Relevant.length
    req.body = {
        searchKey: list.data.fileInfo.title,
        currentPage:1,
        pageSize:40
    }
    if(recRelateArrNum<31){
        return server.$http(appConfig.apiNewBaselPath+Api.spider.hotpotSearch,'post', req,res,true)
    }else{
        return null
    }
}

function getHotTopicSearch(req,res,list){
    req.body = {
        topicName: list.data.fileInfo.title,
        currentPage:1,
        pageSize:40,
        siteCode:'4'
    };
    return server.$http(appConfig.apiNewBaselPath+Api.spider.hotTopicSearch,'post', req,res,true)
}

function getHotTopicSeo(req,res){
    req.body = {
        type: 'topic',
        currentPage:1,
        pageSize:20,
        siteCode:4,
        random:'y'
    };
    return server.$http(appConfig.apiNewBaselPath+Api.spider.newRecData,'post', req,res,true)
}

function getNewsRec(req,res){
    req.body = {
        type: 'new',
        currentPage:1,
        pageSize:20,
        siteCode:4,
        random:'y'
    }
    return server.$http(appConfig.apiNewBaselPath+Api.spider.newRecData,'post', req,res,true)
}

function getHotRecData(req,res){
    req.body = {
        contentType: 100,
        clientType:0,
        pageSize:20,
        siteCode:0
    };
    return server.$http(appConfig.apiNewBaselPath+Api.spider.hotRecData,'post', req,res,false)
}

function handleSpiderData({req,res,list,crumbList,editorInfo,fileDetailTxt,recommendInfo,paradigm4Relevant,hotRecData,type,fileurl}){
   
    let results = Object.assign({},{list,crumbList,editorInfo,fileDetailTxt,recommendInfo,paradigm4Relevant,hotRecData})
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
    if(results.list&&results.list.data && results.list.data.fileInfo) {
        results.list.data.fileInfo.readTool = readTool;
        results.list.data.fileInfo.moduleType = moduleType;
    }
     //对正文进行处理
     var textString =  results.fileDetailTxt&&results.fileDetailTxt.data||'';
     // console.log(JSON.stringify(results.hotRecData),'results.hotRecData')
     var picArr = results.list&&results.list.data&&results.list.data.transcodeInfo&&results.list.data.transcodeInfo.fileContentList || ''
     if(picArr&&picArr.length>6) {
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
         results.crumbList.data.isGetClassType = list.data.fileInfo.isGetClassType || 0;
    }
    
    var description = textString.substr(0,200);
    if(description.length>0){
     
     description = description.replace(/[\r\n]/g, "");
     description = description.replace(/&nbsp;/g, "");
     description = description.replace(/\s+/g, "")
  }
    var brief = textString.substr(0,300);
    if(brief.length>0){
         brief = brief.replace(/\s+/g, "")
         brief = brief.replace(/[\r\n]/g, "");
         brief = brief.replace('&nbsp;', "");
    }
    results.brief = brief
    results.seo = {};
    results.seo.description = description ||'';
    results.seo.fileurl = fileurl;
    //对相关资料数据处理
    let recRelateArrNum  = paradigm4Relevant.length
    if(recRelateArrNum>30) {
         results.relevantList=results.paradigm4Relevant.slice(0,10)
         results.guessLikeList=results.paradigm4Relevant.slice(10,21)
    }else {
         // if(results.hotpotSearch.data&&results.hotpotSearch.data.rows){
         //     results.relevantList=results.hotpotSearch.data.rows.slice(0,10)
         //     results.guessLikeList=results.hotpotSearch.data.rows.slice(10,31)
         // }
         // console.log(JSON.stringify(results.hotpotSearch),'results.hotpotSearch')
    }
    // 对最新资料  推荐专题数据处理

 //    if(results.newRecData &&results.newRecData.data && type!="hot"){
 //         results.newRecList=results.newRecData.data.map(item=>{
 //             if(type=="new") {
 //                 item.link ="/f/"+item.id+'.html'
 //             }else if(type=="topic"){
 //                 item.link ="/node/s/"+item.id+'.html'
 //             }
 //             return item;
 //         })
 //    }
    // 热门推荐数据处理
 //    if(results.hotRecData &&results.hotRecData.data && type =="hot"){
 //     results.newRecList=results.hotRecData.data.map(item=>{
 //             item.link = item.contentUrl;
 //             item.title= item.contentName;
 //             return item;
 //         })
 //    }
    // 对热门搜索的主题数进行限制
 //    results.newRecList = results.newRecList?results.newRecList:[];
    results.type = type;
 //    if(results.newsRec && results.newsRec.data){
 //         results.newPagetotal = results.newsRec.data.length
 //     }else{
 //         results.newsRec.data = []
 //     }
 //    console.log(JSON.stringify(results.hotTopicSearch),'hotTopicSearch')
    results.fileDetailArr = newTextArr;
     render("spider/index", results, req, res);
}