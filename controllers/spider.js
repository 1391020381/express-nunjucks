/**
 * @Description: 蜘蛛模板
 */

var render = require("../common/render");
var server = require("../models/index");
var Api = require("../api/api");
var appConfig = require("../config/app-config");
const cc = require('../common/cc')

const renderPage = cc(async (req, res, next) => {

    let userID = Math.random().toString().slice(-15); //标注用户的ID，
    let type = req.query && req.query.type || 'new'
    let id = req.params.id.replace('-nbhh', '')
    let fileurl = "https://ishare.iask.sina.com.cn/f/" + id + '.html'
    const list = await getList(req, res, id)
    if (list.code == 'G-404') { // 文件不存在
        var results = { showFlag: false }
        res.status(404)
        render("detail/index", results, req, res);
        return
    }
    if (list.data.fileInfo.showflag !== 'y') { // 文件删除
        var searchQuery = `?ft=all&cond=${encodeURIComponent(encodeURIComponent(list.data.fileInfo.title))}`
        var results = { showFlag: false, searchQuery, statusCode: '404' }
        res.status(404)
        render("detail/index", results, req, res);
        return
    }
    const crumbList = await getCrumbList(req, res, list)

    const editorInfo = {}  // await getEditorInfo(req, res, list)
    const fileDetailTxt = await getFileDetailTxt(req, res)
    const recommendInfo = await getRecommendInfo(req, res, list)
    let paradigm4Relevant = []
    let hotpotSearch = {}   // 热门搜索  推荐专题
    if (recommendInfo && recommendInfo.data[0]) {
        paradigm4Relevant = await getParadigm4Relevant(req, res, list, recommendInfo, userID)
    }
    if (recommendInfo && recommendInfo.data[1]) {
        hotpotSearch = await getHotpotSearch(req, res, list, recommendInfo, userID)

    }
    const hotTopicSearch = {}
    const hotTopicSeo = {}
    const hotRecData = await getHotRecData(req, res)
    const newsRec = await getNewsRec(req, res)

    handleSpiderData({ req, res, list, crumbList, editorInfo, fileDetailTxt, recommendInfo, paradigm4Relevant, hotpotSearch, hotTopicSearch, hotTopicSeo, hotRecData, newsRec, type, fileurl })
})

module.exports = {
    index: renderPage
}


function getList(req, res, id) {
    req.body = {
        clientType: 0,
        fid: id,
        sourceType: 1,
        site: 4
    }
    return server.$http(appConfig.apiNewBaselPath + Api.spider.details, 'post', req, res, true)
}

function getCrumbList(req, res, list) {
    let classId = list.data.fileInfo.classid
    console.log('classId:', list.data.fileInfo.classid)
    return server.$http(appConfig.apiNewBaselPath + Api.spider.getNodeByClassId.replace(/\$classId/, classId), 'get', req, res, true)

}
function getEditorInfo(req, res, list) {
    let uid = list.data.fileInfo.uid
    let url = appConfig.apiNewBaselPath + Api.spider.editorInfo.replace(/\$uid/, uid)
    return server.$http(url, 'get', req, res, true)
}

function getFileDetailTxt(req, res) {
    req.body = {
        fid: req.params.id.replace('-nbhh', ''),
        subBody: 20000
    };
    return server.$http(appConfig.apiNewBaselPath + Api.spider.fileDetailTxt, 'post', req, res, true)
}


function getRecommendInfo(req, res, list) {
    req.body = ['ishare_zhizhu_relevant', 'ishare_zhizhu_zhuanti']
    return server.$http(appConfig.apiNewBaselPath + Api.recommendConfigInfo, 'post', req, res, true)
}

function getParadigm4Relevant(req, res, list, recommendInfo, userID) {
    let recommendInfoData_rele = recommendInfo.data[0] || {} //相关资料
    if (recommendInfoData_rele.useId) {
        let requestId = Math.random().toString().slice(-10);//requestID是用来标注推荐服务请求的ID，是长度范围在8~18位的随机字符串
        req.body = {
            request: {
                "userId": userID,
                "requestId": requestId,
                "itemId": list.data.fileInfo.id,
                "itemTitle": list.data.fileInfo.title
            }
        }
        let url = `https://tianshu.4paradigm.com/api/v0/recom/recall?sceneID=${recommendInfoData_rele.useId}`
        return server.$http(url, 'post', req, res, true);
    } else {
        return {}
    }
}

function getHotpotSearch(req, res, list, recommendInfo, userID) {

    let recommendInfoData_rele = recommendInfo.data[1] || {} //相关资料
    if (recommendInfoData_rele.useId) {
        let requestId = Math.random().toString().slice(-10);//requestID是用来标注推荐服务请求的ID，是长度范围在8~18位的随机字符串
        req.body = {
            request: {
                "userId": userID,
                "requestId": requestId,
                "itemId": list.data.fileInfo.id,
                "itemTitle": list.data.fileInfo.title
            }
        }
        let url = `https://tianshu.4paradigm.com/api/v0/recom/recall?sceneID=${recommendInfoData_rele.useId}`
        return server.$http(url, 'post', req, res, true);
    } else {
        return {}
    }
}





function getNewsRec(req, res) {
    return server.$http(appConfig.apiNewBaselPath + Api.spider.latestData, 'post', req, res, true)
}

function getHotRecData(req, res) {
    req.body = {
        contentType: 100,
        clientType: 0,
        pageSize: 20,
        siteCode: 0
    };
    return server.$http(appConfig.apiNewBaselPath + Api.spider.hotRecData, 'post', req, res, false)
}

function handleSpiderData({ req, res, list, crumbList, editorInfo, fileDetailTxt, recommendInfo, paradigm4Relevant, hotpotSearch, hotTopicSearch, hotTopicSeo, newsRec, hotRecData, type, fileurl }) {

    let results = Object.assign({}, { list, crumbList, editorInfo, fileDetailTxt, recommendInfo, paradigm4Relevant, hotpotSearch, hotTopicSearch, hotTopicSeo, newsRec, hotRecData })

    // doc对应Word、ppt对应PowerPoint、xls对应Excel、txt对应记事本、pdf对应PDF阅读器
    var readTool = {
        Word: 'Word',
        PowerPoint: 'PowerPoint',
        Excel: 'Excel',
        txt: '记事本',
        pdf: 'PDF阅读器'
    }
    var moduleType = {
        Word: 'Word模板',
        PowerPoint: 'PPT模板',
        Excel: 'Excel表格模板',
        txt: '记事本',
        pdf: '在线阅读'
    }
    if (results.list && results.list.data && results.list.data.fileInfo) {
        results.list.data.fileInfo.readTool = readTool;
        results.list.data.fileInfo.moduleType = moduleType;
    }
    //对正文进行处理
    var topicList = results.hotpotSearch.data.slice(0, 20)  // 用于匹配超链接

    var textString = results.fileDetailTxt && results.fileDetailTxt.data || '';

    var picArr = results.list && results.list.data && results.list.data.transcodeInfo && results.list.data.transcodeInfo.fileContentList || ''
    if (picArr && picArr.length > 6) {
        picArr = picArr.slice(0, 6)
    }
    var newTextArr = dealContent(textString, picArr, topicList);
    if (results.crumbList && results.crumbList.data) {
        results.crumbList.data.isGetClassType = list.data.fileInfo.isGetClassType || 0;
    }

    var description = textString.substr(0, 200);
    if (description.length > 0) {

        description = description.replace(/[\r\n]/g, "");
        description = description.replace(/&nbsp;/g, "");
        description = description.replace(/\s+/g, "")
    }
    var brief = textString.substr(0, 300);
    if (brief.length > 0) {
        brief = brief.replace(/\s+/g, "")
        brief = brief.replace(/[\r\n]/g, "");
        brief = brief.replace('&nbsp;', "");
    }
    results.brief = brief
    results.seo = {};
    results.seo.description = description || '';
    results.seo.fileurl = fileurl;
    //对相关资料数据处理

    results.relevantList = results.paradigm4Relevant.data.slice(0, 10)
    results.guessLikeList = results.paradigm4Relevant.data.slice(-21)


    // 热门搜索    推荐专题
    results.relevantList = results.paradigm4Relevant.data.slice(0, 10)
    results.guessLikeList = results.paradigm4Relevant.data.slice(-21)

    // 对最新资料  推荐专题数据处理
    results.hotTopicSearch = results.hotpotSearch.data.slice(0, 20)
    results.hotTopicSeo = results.hotpotSearch.data.slice(-21)
    results.type = type;
    results.fileDetailArr = newTextArr;
    results.fileSummary = results.list.data.fileInfo.title + fileDetailTxt.data && fileDetailTxt.data.slice(0, 266)
    render("spider/index", results, req, res);
}




function dealContent(content, fileContentList, hotSearch) { //分割字符串 替换字符串  
    let urlList = {
        'debug': 'http://ishare.iask.sina.com.cn/',
        'local': 'http://localhost:3004/',
        'dev': "http://dev-ishare.iask.com.cn/",
        'test': "http://test-ishare.iask.com.cn/",
        'pre': "http://test-ishare.iask.com.cn/",
        'prod': 'http://ishare.iask.sina.com.cn/'
    }
    let arr = [];
    let textLength = Math.ceil(content.length / fileContentList.length)
    let matchNum = 1;
    let env = process.env.NODE_ENV || 'prod'
    fileContentList && fileContentList.map((dto, i) => {
        let text = content.substring(i * textLength, textLength * (i + 1));
        hotSearch && hotSearch.map(item => {
            const reg = new RegExp(item.title, 'i');
            let replaceStr = `<a style="color:red;" href="${urlList[env]}/node/s/${item.itemId}.html" target="_blank">${item.title}</a>`;
            if (reg.test(text) && matchNum <= 5) {//匹配成功
                text = text.replace(reg, replaceStr);
                matchNum++
            }
        })
        arr.push({
            img: dto,
            txt: text
        })
    })
    return arr
}