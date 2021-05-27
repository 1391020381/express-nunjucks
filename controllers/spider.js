/**
 * @Description: 蜘蛛模板
 */

const render = require('../common/render');
const server = require('../models/index');
const Api = require('../api/api');
const appConfig = require('../config/app-config');
const cc = require('../common/cc');


function getList(req, res, id) {
    req.body = {
        clientType: 0,
        fid: id,
        sourceType: 1,
        site: 4
    };
    return server.$http(appConfig.apiNewBaselPath + Api.spider.details, 'post', req, res, true);
}

function getCrumbList(req, res, list) {
    const classId = list.data.fileInfo.classid;
    req.body = {
        classId: classId,
        site: 4,
        terminal: 0
    };
    return server.$http(appConfig.apiNewBaselPath + Api.spider.getNodeByClassId, 'post', req, res, true);

}

function getEditorInfo(req, res, list) {
    const uid = list.data.fileInfo.uid;
    const url = appConfig.apiNewBaselPath + Api.spider.editorInfo.replace(/\$uid/, uid);
    return server.$http(url, 'get', req, res, true);
}

function getFileDetailTxt(req, res) {
    req.body = {
        fid: req.params.id.replace('-nbhh', ''),
        subBody: 20000
    };
    return server.$http(appConfig.apiNewBaselPath + Api.spider.fileDetailTxt, 'post', req, res, true);
}


function getRecommendInfo(req, res) {
    req.body = ['ishare_zhizhu_relevant', 'ishare_zhizhu_zhuanti'];
    return server.$http(appConfig.apiNewBaselPath + Api.recommendConfigInfo, 'post', req, res, true);
}

function getParadigm4Relevant(req, res, list, recommendInfo, userID) {
    const recommendInfoDataRele = recommendInfo.data[0] || {}; // 相关资料
    if (recommendInfoDataRele.useId) {
        const requestId = Math.random().toString().slice(-10); // requestID是用来标注推荐服务请求的ID，是长度范围在8~18位的随机字符串
        req.body = {
            request: {
                'userId': userID,
                'requestId': requestId,
                'itemId': list.data.fileInfo.id,
                'itemTitle': list.data.fileInfo.title
            }
        };
        const url = `https://tianshu.4paradigm.com/api/v0/recom/recall?sceneID=${recommendInfoDataRele.useId}`;
        return server.$http(url, 'post', req, res, true);
    } else {
        return {};
    }
}

function getHotpotSearch(req, res, list, recommendInfo, userID) {

    const recommendInfoDataRele = recommendInfo.data[1] || {}; // 相关资料
    if (recommendInfoDataRele.useId) {
        const requestId = Math.random().toString().slice(-10); // requestID是用来标注推荐服务请求的ID，是长度范围在8~18位的随机字符串
        req.body = {
            request: {
                'userId': userID,
                'requestId': requestId,
                'itemId': list.data.fileInfo.id,
                'itemTitle': list.data.fileInfo.title
            }
        };
        const url = `https://tianshu.4paradigm.com/api/v0/recom/recall?sceneID=${recommendInfoDataRele.useId}`;
        return server.$http(url, 'post', req, res, true);
    } else {
        return {
            data: []
        };
    }
}


function getNewsRec(req, res) {
    return server.$http(appConfig.apiNewBaselPath + Api.spider.latestData, 'post', req, res, true);
}

// A25需求：请求字典列表
function getDictionaryData(req, res) {
    const url = appConfig.apiNewBaselPath + Api.dictionaryData.replace(/\$code/, 'themeModel');
    return server.$http(url, 'get', req, res, true);
}

function getHotRecData(req, res) {
    req.body = {
        contentType: 100,
        clientType: 0,
        pageSize: 20,
        siteCode: 0
    };
    return server.$http(appConfig.apiNewBaselPath + Api.spider.hotRecData, 'post', req, res, false);
}

function dealContent(content, fileContentList, hotSearch) { // 分割字符串 替换字符串
    const urlList = {
        'debug': 'http://ishare.iask.sina.com.cn',
        'local': 'http://localhost:3004',
        'dev': 'http://dev-ishare.iask.com.cn',
        'test': 'http://test-ishare.iask.com.cn',
        'pre': 'http://pre-ishare.iask.com.cn',
        'prod': 'http://ishare.iask.sina.com.cn'
    };
    const arr = [];
    // hotSearch = [{itemId:'aaaaa',title:'面试真题'}]  // 测试
    const textLength = Math.ceil(content.length / fileContentList.length);
    let matchNum = 1;
    const selectHotSearch = []; // 保存匹配过的专题
    const env = process.env.NODE_ENV || 'prod';
    fileContentList && fileContentList.map((dto, i) => {
        let text = content.substring(i * textLength, textLength * (i + 1));
        hotSearch && hotSearch.map(item => {
            const reg = new RegExp(item.title, 'i');
            const replaceStr = `<a style="color:red;" href="${urlList[env]}/node/s/${item.itemId}.html" target="_blank">${item.title}</a>`;
            const ret = reg.test(text);
            if (ret && selectHotSearch.indexOf(item.title) == -1 && matchNum <= 5) { // 匹配成功
                selectHotSearch.push(item.title); // 已匹配过
                text = text.replace(reg, replaceStr);
                matchNum++;
            }
        });
        arr.push({
            img: dto,
            txt: text
        });
    });
    return arr;
}

/**
 * 处理专题链接-通过专题id查询专题模板标识，通过模板标识去字典匹配
 * 如果所属站点为当前站点，不需拼接域名字段
 * @param spacialList       专题数据
 * @param dictionaryList    专题字典配置
 */
function formatSpacialLink(spacialList, dictionaryList) {
    spacialList = Array.isArray(spacialList) ? spacialList : [];
    // console.error(1111, dictionaryList)
    spacialList.forEach(pItem => {
        const targetItem = dictionaryList.find(sItem => sItem.pcode === pItem.categoryLevel2);
        if (targetItem) {
            // 如果为办公站点
            if (targetItem.sort === '0') {
                // 追加字段
                pItem.nodeRouterUrl = `${targetItem.pvalue}/${pItem.itemId}.html`;
            } else {
                // 追加字段
                pItem.nodeRouterUrl = `${targetItem.desc}${targetItem.pvalue}/${pItem.itemId}.html`;
            }
        } else {
            pItem.nodeRouterUrl = '';
        }
    });
    return spacialList;
}

function handleSpiderData({
    req,
    res,
    list,
    crumbList,
    editorInfo,
    fileDetailTxt,
    recommendInfo,
    paradigm4Relevant,
    dictionaryData,
    hotpotSearch,
    hotTopicSearch,
    hotTopicSeo,
    newsRec,
    hotRecData,
    type,
    fileurl
}) {

    const results = Object.assign({}, {
        list,
        crumbList,
        editorInfo,
        fileDetailTxt,
        recommendInfo,
        paradigm4Relevant,
        dictionaryData,
        hotpotSearch,
        hotTopicSearch,
        hotTopicSeo,
        newsRec,
        hotRecData
    });

    // doc对应Word、ppt对应PowerPoint、xls对应Excel、txt对应记事本、pdf对应PDF阅读器
    const readTool = {
        Word: 'Word',
        PowerPoint: 'PowerPoint',
        Excel: 'Excel',
        txt: '记事本',
        pdf: 'PDF阅读器'
    };
    const moduleType = {
        Word: 'Word模板',
        PowerPoint: 'PPT模板',
        Excel: 'Excel表格模板',
        txt: '记事本',
        pdf: '在线阅读'
    };
    if (results.list && results.list.data && results.list.data.fileInfo) {
        results.list.data.fileInfo.readTool = readTool;
        results.list.data.fileInfo.moduleType = moduleType;
    }
    // 对正文进行处理
    const topicList = results.hotpotSearch.data.slice(0, 20); // 用于匹配超链接

    const textString = results.fileDetailTxt && results.fileDetailTxt.data || '';

    let picArr = results.list && results.list.data && results.list.data.transcodeInfo && results.list.data.transcodeInfo.fileContentList || '';
    if (picArr && picArr.length > 6) {
        picArr = picArr.slice(0, 6);
    }
    const newTextArr = dealContent(textString, picArr, topicList);
    if (results.crumbList && results.crumbList.data) {
        results.crumbList.data.isGetClassType = list.data.fileInfo.isGetClassType || 0;
    }

    let description = textString.substr(0, 200);
    if (description.length > 0) {

        description = description.replace(/[\r\n]/g, '');
        description = description.replace(/&nbsp;/g, '');
        description = description.replace(/\s+/g, '');
    }
    let brief = textString.substr(0, 300);
    if (brief.length > 0) {
        brief = brief.replace(/\s+/g, '');
        brief = brief.replace(/[\r\n]/g, '');
        brief = brief.replace('&nbsp;', '');
    }
    results.brief = brief;
    results.seo = {};
    results.seo.description = description || '';
    results.seo.fileurl = fileurl;
    // 对相关资料数据处理

    results.relevantList = results.paradigm4Relevant.data.slice(0, 10);
    results.guessLikeList = results.paradigm4Relevant.data.slice(-21);

    // A25需求：获取字典数据
    results.dictionaryData = results.dictionaryData.data;


    // 热门搜索    推荐专题
    // results.relevantList = results.paradigm4Relevant.data.slice(0, 10);
    // results.guessLikeList = results.paradigm4Relevant.data.slice(-21);

    // 对最新资料  推荐专题数据处理
    results.hotTopicSearch = results.hotpotSearch.data.slice(0, 20);
    results.hotTopicSeo = results.hotpotSearch.data.slice(-21);

    // console.log('hotTopicSearch', results.hotTopicSearch, 'dictionaryData', results.dictionaryData);

    // A25需求：pc主站蜘蛛页-热点搜索-专题入口逻辑处理
    results.hotTopicSearch = formatSpacialLink(results.hotTopicSearch, results.dictionaryData);
    // A25需求：pc主站蜘蛛页-推荐专题-专题入口逻辑处理
    results.hotTopicSeo = formatSpacialLink(results.hotTopicSeo, results.dictionaryData);

    console.log('hotTopicSeo', results.hotTopicSeo);

    results.type = type;
    results.fileDetailArr = newTextArr;
    results.fileSummary = results.list.data.fileInfo.title + fileDetailTxt.data && fileDetailTxt.data.slice(0, 266);
    render('spider/index', results, req, res);
}

const renderPage = cc(async (req, res, next) => {

    const userID = Math.random().toString().slice(-15); // 标注用户的ID，
    const type = req.query && req.query.type || 'new';
    const id = req.params.id.replace('-nbhh', '');
    const fileurl = 'https://ishare.iask.sina.com.cn/f/' + id + '.html';
    const list = await getList(req, res, id);
    if (list.code == 'G-404') { // 文件不存在
        const results = {
            showFlag: false
        };
        res.status(404);
        render('detail/index', results, req, res);
        return;
    }
    if (list.data.fileInfo.showflag !== 'y') { // 文件删除
        const searchQuery = `?ft=all&cond=${encodeURIComponent(encodeURIComponent(list.data.fileInfo.title))}`;
        const results = {
            showFlag: false,
            searchQuery,
            statusCode: '404'
        };
        res.status(404);
        render('detail/index', results, req, res);
        return;
    }
    const crumbList = await getCrumbList(req, res, list);

    const editorInfo = await getEditorInfo(req, res, list);
    const fileDetailTxt = await getFileDetailTxt(req, res);
    const recommendInfo = await getRecommendInfo(req, res, list);
    let paradigm4Relevant = {
        data: []
    }; // 防止没有数据
    let hotpotSearch = {
        data: []
    }; // 热门搜索  推荐专题
    if (recommendInfo && recommendInfo.data[0]) {
        paradigm4Relevant = await getParadigm4Relevant(req, res, list, recommendInfo, userID);
    }
    if (recommendInfo && recommendInfo.data[1]) {
        hotpotSearch = await getHotpotSearch(req, res, list, recommendInfo, userID);

    }
    const hotTopicSearch = {};
    const hotTopicSeo = {};
    const hotRecData = await getHotRecData(req, res);
    const newsRec = await getNewsRec(req, res);
    // 获取字典数组
    const dictionaryData = await getDictionaryData(req, res);

    handleSpiderData({
        req,
        res,
        list,
        crumbList,
        editorInfo,
        fileDetailTxt,
        recommendInfo,
        paradigm4Relevant,
        dictionaryData,
        hotpotSearch,
        hotTopicSearch,
        hotTopicSeo,
        hotRecData,
        newsRec,
        type,
        fileurl
    });
});
module.exports = {
    index: renderPage
};
