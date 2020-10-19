/**
 * @Description: 详情页
 */
var async = require("async");
var render = require("../common/render");
var server = require("../models/index");
var util = require('../common/util');
const cc = require('../common/cc')
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

render = cc(async(req,res)=>{
    console.log('render-------------------------------------------')
    const flag = req.params.id.includes('-nbhh')
    const redirectUrl = await getRedirectUrl(req,res) 
    const list   =  await getList(req,res)
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