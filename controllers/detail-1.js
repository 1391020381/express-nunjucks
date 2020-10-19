/**
 * @Description: 详情页
 */
const async = require("async");
const render = require("../common/render");
const server = require("../models/index");
const util = require('../common/util');
const cc = require('../common/cc')
const recommendConfigInfo = require('../common/recommendConfigInfo')
const Api = require("../api/api");
const appConfig = require("../config/app-config");

const defaultResultsData = {recommendInfoData_rele:{},recommendInfoData_guess:{},paradigm4Guess:{},paradigm4Relevant:{},list:{data:{svgFlag:true,supportSvg:true,fileContentList:[],svgPathList:[],isDownload:'no'}}} // 确保私有 删除  404 显示用户信息 用户可以登录

render = cc(async(req,res)=>{
    console.log('render-------------------------------------------')
    let userID = Math.random().toString().slice(-15); //标注用户的ID，
    const flag = req.params.id.includes('-nbhh')
    const redirectUrl = await getRedirectUrl(req,res) 
    const list   =  await getList(req,res)
    userID = list.fileInfo.uid&&fileInfo.uid.slice(0, 10) || ''; //来标注用户的ID，
    const topBannerList = await getTopBannerList(req,res)
    const searchBannerList = await getSearchBannerList(req,res)
    const bannerList = await getBannerList(req,res)
    const crumbList  = await getCrumbList(req,res)
    const recommendInfo = await getRecommendInfo(req,res) 
    const paradigm4Relevant = await getParadigm4Relevant(req,res)
    console.log('redirectUrl:',JSON.stringify(redirectUrl),'list:',JSON.stringify(list))
})


module.exports = { 
    render
}


function getRedirectUrl(req,res){
      req.body = {
        sourceLink:req.protocol+'://'+req.hostname+req.url
      } 
     return server.$http(appConfig.apiNewBaselPath + Api.file.redirectUrl,'post', req,res,true)
}

function getList(req,res){
    req.body = {
        clientType: 0,
        fid: req.params.id,  
        sourceType: 0
    }
   return server.$http(appConfig.apiNewBaselPath + Api.file.getFileDetailNoTdk,'post', req,res,true)
}
function getTopBannerList(req,res){
    req.body = recommendConfigInfo.details.topBanner.pageId
    return server.$http(appConfig.apiNewBaselPath + Api.recommendConfigInfo,'post', req,res,true)
}

function getSearchBannerList(req,res){
    req.body =  recommendConfigInfo.details.searchBanner.pageId
    return server.$http(appConfig.apiNewBaselPath + Api.recommendConfigInfo,'post', req,res,true)
}

function getBannerList(req,res){
    let format = list.data.fileInfo.format
    let classid1 = list.data.fileInfo.classid1
    let classid2 = list.data.fileInfo.classid2
    req.body =  dealParam(format,classid1,classid2)
    return server.$http(appConfig.apiNewBaselPath + Api.recommendConfigRuleInfo,'post', req,res,true)
}

function getCrumbList(req,res){
    let classId = list.fileInfo.classId
    let spcClassId = list.fileInfo.spcClassId
    let isGetClassType = list.fileInfo.isGetClassType
    req.body = {
        classId: classId,
        spcClassId: spcClassId,  
        isGetClassType: isGetClassType
      }
    return server.$http(appConfig.apiNewBaselPath + Api.file.navCategory,'post', req,res,true)
}

function getRecommendInfo(req,res){
        const productType = list.fileInfo.productType
        const classid1 = list.fileInfo.classid1

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

function getParadigm4Relevant(req,res){
    let requestID_rele = Math.random().toString().slice(-10);//requestID是用来标注推荐服务请求的ID，是长度范围在8~18位的随机字符串
    let recommendInfoData_rele = recommendInfo.data[0] || {} //相关资料
    
    if(recommendInfoData_rele.useId){
       let sceneIDRelevant = recommendInfoData_rele.useId || '';
       req.body = { "itemID": list.fileInfo.fid, "itemTitle": title }
      
       let url = `https://nbrecsys.4paradigm.com/api/v0/recom/recall?requestID=${requestID_rele}&sceneID=${sceneIDRelevant}&userID=${userID}`
       return server.$http(url,'post', req,res,true)
    }else{
        return null
    }
}

function getParadigm4Guess(req,res){
    let recommendInfoData_guess = recommendInfo.data[1] || {}; // 个性化 猜你喜欢
    let requestID_guess = Math.random().toString().slice(-10);//requestID是用来标注推荐服务请求的ID，是长度范围在8~18位的随机字符串
    if (recommendInfoData_guess.useId) {
        let sceneIDGuess = recommendInfoData_guess.useId || '';
        req.body = { "itemID": fid, "itemTitle": title }
        let url = `https://nbrecsys.4paradigm.com/api/v0/recom/recall?requestID=${requestID_guess}&sceneID=${sceneIDGuess}&userID=${userID}`
    }else{
        return null
    }
}
function getFilePreview(req,res){
    
}

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