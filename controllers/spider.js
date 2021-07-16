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
    const fileInfo = list.data.fileInfo || {};
    const classId = fileInfo.classid;
    req.body = {
        classId: classId,
        site: 4,
        terminal: 0
    };
    return server.$http(appConfig.apiNewBaselPath + Api.spider.getNodeByClassId, 'post', req, res, true);

}

function getEditorInfo(req, res, list) {
    const fileInfo = list.data.fileInfo || {};
    const uid = fileInfo.uid;
    const url = appConfig.apiNewBaselPath + Api.spider.editorInfo.replace(/\$uid/, uid);
    return server.$http(url, 'get', req, res, true);
}

function getFileDetailTxt(req, res) {
    req.body = {
        fid: req.params.id,
        subBody: 20000
    };
    return server.$http(appConfig.apiNewBaselPath + Api.spider.fileDetailTxt, 'post', req, res, true);
}


function getRecommendInfo(req, res) {
    req.body = ['ishare_zhizhu_relevant', 'ishare_zhizhu_zhuanti'];
    return server.$http(appConfig.apiNewBaselPath + Api.recommendConfigInfo, 'post', req, res, true);
}

function getParadigm4Relevant(req, res, list, recommendInfo, userID) {
    const fileInfo = list.data.fileInfo || {};
    const recommendInfoDataRele = recommendInfo.data[0] || {}; // 相关资料
    if (recommendInfoDataRele.useId) {
        const requestId = Math.random().toString().slice(-10); // requestID是用来标注推荐服务请求的ID，是长度范围在8~18位的随机字符串
        req.body = {
            request: {
                'userId': userID,
                'requestId': requestId,
                'itemId': fileInfo.id,
                'itemTitle': fileInfo.title
            }
        };
        const url = `https://tianshu.4paradigm.com/api/v0/recom/recall?sceneID=${recommendInfoDataRele.useId}`;
        return server.$http(url, 'post', req, res, true);
    } else {
        return {};
    }
}

function getHotpotSearch(req, res, list, recommendInfo, userID) {
    const fileInfo = list.data.fileInfo || {};
    const recommendInfoDataRele = recommendInfo.data[1] || {}; // 相关资料
    if (recommendInfoDataRele.useId) {
        const requestId = Math.random().toString().slice(-10); // requestID是用来标注推荐服务请求的ID，是长度范围在8~18位的随机字符串
        req.body = {
            request: {
                'userId': userID,
                'requestId': requestId,
                'itemId': fileInfo.id,
                'itemTitle': fileInfo.title
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

function getHotTopicSeo(req, res) {
    /**
     * @description: A28需求：替换接口：随机取1份20条规则4热门专题缓存数据
     * @param {
     *  group: 组，取缓存多个组,
     *  rule: 规则1-6
     * }
     * @return {
     *  name: 关键字,
     *  url: url
     * }
     */
    req.body = {
        group: 1,
        rule: 4
    };
    return server.$http(appConfig.apiNewBaselPath + Api.spider.newRandomRecommend, 'post', req, res, true);
}


function getNewsRec(req, res) {
    /**
     * @description: A28需求：替换接口：随机取不重复的1份20条规则2最新资料缓存数据
     * @param {
     *  group: 组，取缓存多个组,
     *  rule: 规则1-6
     * }
     * @return {
     *  name: 关键字,
     *  url: url
     * }
     */
    req.body = {
        group: 1,
        rule: 2
    };
    return server.$http(appConfig.apiNewBaselPath + Api.spider.newRandomRecommend, 'post', req, res, true);
    // return server.$http(appConfig.apiNewBaselPath + Api.spider.latestData, 'post', req, res, true);
}

// A28需求: 随机取1份22条规则5你可能还喜欢缓存数据
function getGuessLikeList(req, res) {
    /**
     * @description: A28需求：随机取1份22条规则5你可能还喜欢缓存数据
     * @param {
     *  group: 组，取缓存多个组,
     *  rule: 规则1-6
     * }
     * @return {
     *  name: 关键字,
     *  url: url
     * }
     */
    req.body = {
        group: 1,
        rule: 5
    };
    return server.$http(appConfig.apiNewBaselPath + Api.spider.newRandomRecommend, 'post', req, res, true);
    // return server.$http(appConfig.apiNewBaselPath + Api.spider.latestData, 'post', req, res, true);
}

// A28需求: 随机取1份35条规则1关键词内链库随机缓存数据
function getHotTopicSearch(req, res) {
    /**
     * @description: A28需求：随机取1份35条规则1关键词内链库随机缓存数据
     * @param {
     *  group: 组，取缓存多个组,
     *  rule: 规则1-6
     * }
     * @return {
     *  name: 关键字,
     *  url: url
     * }
     */
    req.body = {
        group: 1,
        rule: 1
    };
    return server.$http(appConfig.apiNewBaselPath + Api.spider.newRandomRecommend, 'post', req, res, true);
    // return server.$http(appConfig.apiNewBaselPath + Api.spider.latestData, 'post', req, res, true);
}

// A28需求: 随机取1份10条规则6相关资料缓存数据
function getRelevantList(req, res) {
    /**
     * @description: A28需求：随机取1份10条规则6相关资料缓存数据
     * @param {
     *  group: 组，取缓存多个组,
     *  rule: 规则1-6
     * }
     * @return {
     *  name: 关键字,
     *  url: url
     * }
     */
    req.body = {
        group: 1,
        rule: 6
    };
    return server.$http(appConfig.apiNewBaselPath + Api.spider.newRandomRecommend, 'post', req, res, true);
    // return server.$http(appConfig.apiNewBaselPath + Api.spider.latestData, 'post', req, res, true);
}

// A28需求: 获取锚文本
function getAnchorText(req, res) {
    /**
     * @description: A28需求：获取锚文本
     * @param {
     *  group: 组，取缓存多个组,
     *  rule: 规则1-6
     * }
     * @return {
     *  word: 词根,
     *  objList: {
     *      name: 关键字,
     *      url: url
     *  }
     * }
     */
    req.body = {
        group: 1,
        rule: 7
    };
    return server.$http(appConfig.apiNewBaselPath + Api.spider.getAnchorText, 'post', req, res, true);
    // return server.$http(appConfig.apiNewBaselPath + Api.spider.latestData, 'post', req, res, true);
}

// A25需求：请求字典列表
function getDictionaryData(req, res) {
    const url = appConfig.apiNewBaselPath + Api.dictionaryData.replace(/\$code/, 'themeModel');
    return server.$http(url, 'get', req, res, true);
}

function getHotRecData(req, res) {
    /**
     * @description: A28需求：替换接口：随机取1份20条规则3推荐信息缓存数据
     * @param {
     *  group: 组，取缓存多个组,
     *  rule: 规则1-6
     * }
     * @return {
     *  name: 关键字,
     *  url: url
     * }
     */
    req.body = {
        group: 1,
        rule: 3
    };
    return server.$http(appConfig.apiNewBaselPath + Api.spider.newRandomRecommend, 'post', req, res, true);
    // req.body = {
    //     contentType: 100,
    //     clientType: 0,
    //     pageSize: 20,
    //     siteCode: 0
    // };
    // return server.$http(appConfig.apiNewBaselPath + Api.spider.hotRecData, 'post', req, res, false);
}

// function dealContent(content, fileContentList, hotSearch, dictionaryList) { // 分割字符串 替换字符串
//     const urlList = {
//         'debug': 'http://ishare.iask.sina.com.cn',
//         'local': 'http://localhost:3004',
//         'dev': 'http://dev-ishare.iask.com.cn',
//         'test': 'http://test-ishare.iask.com.cn',
//         'pre': 'http://pre-ishare.iask.com.cn',
//         'prod': 'http://ishare.iask.sina.com.cn'
//     };
//     const arr = [];
//     // hotSearch = [{itemId:'aaaaa',title:'面试真题'}]  // 测试
//     const textLength = Math.ceil(content.length / fileContentList.length);
//     let matchNum = 1;
//     const selectHotSearch = []; // 保存匹配过的专题
//     const env = process.env.NODE_ENV || 'prod';
//     // console.log('hotSearch---------', hotSearch);
//     fileContentList && fileContentList.map((dto, i) => {
//         let text = content.substring(i * textLength, textLength * (i + 1));
//         hotSearch && hotSearch.map(item => {
//             const reg = new RegExp(item.title, 'i');
//             let replaceStr = '';
//             // 拼接路径
//             const targetItem = dictionaryList.data.find(sItem => sItem.pcode === item.categoryLevel2);
//             if (targetItem) {
//                 // 如果为主站站点
//                 if (targetItem.sort === '4') {
//                     // 追加字段
//                     // pItem.nodeRouterUrl = `${targetItem.pvalue}/${pItem.itemId}.html`;
//                     replaceStr = `<a style="color:red;" href="${urlList[env]}${targetItem.pvalue}/${item.itemId}.html" target="_blank">${item.title}</a>`;
//                 } else {
//                     // 追加字段
//                     // pItem.nodeRouterUrl = `${targetItem.desc}${targetItem.pvalue}/${pItem.itemId}.html`;
//                     replaceStr = `<a style="color:red;" href="${targetItem.desc}${targetItem.pvalue}/${item.itemId}.html" target="_blank">${item.title}</a>`;
//                 }
//             }
//             // const replaceStr = `<a style="color:red;" href="${urlList[env]}/node/s/${item.itemId}.html" target="_blank">${item.title}</a>`;
//             const ret = reg.test(text);
//             if (ret && selectHotSearch.indexOf(item.title) == -1 && matchNum <= 5) { // 匹配成功
//                 selectHotSearch.push(item.title); // 已匹配过
//                 text = text.replace(reg, replaceStr);
//                 matchNum++;
//             }
//         });
//         arr.push({
//             img: dto,
//             txt: text
//         });
//     });
//     return arr;
// }

/**
 * @description: A28: SEO-锚文本增加流程
 * @param {*} content  文本内容 --> Array
 * @param {*} fileContentList  图片内容 --> Array
 * @param {*} anchorText  词根内容 --> Array
 * @return {*}
 */
function dealContent(content, fileContentList, anchorText) { // 分割字符串 替换字符串
    let arr = [];
    let matchNum = 1;
    let textLength = 0;
    // A28: 非空处理
    if (content && fileContentList) {
        textLength = Math.ceil(content.length / fileContentList.length);
    }
    const selectHotSearch = []; // 保存匹配过的专题
    const keywordArr = []; // 已匹配词根数组
    const matchArr = []; // 已匹配的特殊字段数组
    if (content && fileContentList) {
        fileContentList.forEach((dto, i) => {
            let text = content.substring(i * textLength, textLength * (i + 1));
            anchorText.data && anchorText.data.forEach(item => {
                const reg = new RegExp(item.word, 'i');
                let replaceStr = '';
                const ret = reg.test(text);
                // 匹配成功
                if (ret && selectHotSearch.indexOf(item.word) == -1 && matchNum <= 5) {
                    console.log('selectHotSearch', selectHotSearch, 'item.word', item.word, selectHotSearch.indexOf(item.word));
                    const time = Date.parse(new Date());
                    replaceStr = `${time}_matchNum${matchNum}`;
                    selectHotSearch.push(item.word); // 已匹配过
                    keywordArr.push(item);
                    matchArr.push(replaceStr);
                    text = text.replace(item.word, replaceStr);
                    matchNum++;
                }
            });
            arr.push({
                img: dto,
                txt: text
            });
        });
    } else if (!fileContentList) {
        anchorText.data && anchorText.data.forEach(item => {
            const reg = new RegExp(item.word, 'i');
            let replaceStr = '';
            const ret = reg.test(content);
            // 匹配成功
            if (ret && selectHotSearch.indexOf(item.word) == -1 && matchNum <= 5) {
                const time = Date.parse(new Date());
                replaceStr = `${time}_matchNum${matchNum}`;
                selectHotSearch.push(item.word); // 已匹配过
                keywordArr.push(item);
                matchArr.push(replaceStr);
                content = content.replace(item.word, replaceStr);
                matchNum++;
            }
        });
        arr.push({
            img: '',
            txt: content
        });
    }
    // console.log('selectHotSearch', selectHotSearch);
    // console.log('keywordArr', keywordArr);
    // console.log('matchArr', matchArr);
    // console.log('arr', arr);
    arr = keywordFormat(arr, keywordArr, matchArr);
    return arr;
}

/**
 * @description: A28: 处理文字词根拼接
 * @param {*} contentArr 内容数组
 * @param {*} keywordArr 词根数组
 * @param {*} matchArr 特殊字段数组
 * @return {*}
 */
function keywordFormat(contentArr, keywordArr, matchArr) {
    const selectHotSearch = []; // 保存匹配过的专题
    const arr = [];
    contentArr && contentArr.forEach(item => {
        matchArr && matchArr.forEach((sItem, index) => {
            const reg = new RegExp(sItem, 'i');
            let replaceStr = '';
            const ret = reg.test(item.txt);
            // 匹配成功
            if (ret && selectHotSearch.indexOf(keywordArr[index].word) == -1) {
                console.log('keywordArr[index]', keywordArr[index]);
                let keywordListHtml = '';
                let newKeywordList = '';
                if (keywordArr[index].objList && keywordArr[index].objList.length > 0) {
                    // 关键词拼接
                    keywordArr[index].objList.forEach((keywordItem, keywordIndex) => {
                        if (keywordIndex < 5) {
                            keywordListHtml += `<span class="keyWordItem"><a class="keyWordText" href="${keywordItem.url}" target="_blank">${keywordItem.name}</a></span>`;
                        }
                    });
                    newKeywordList = `<span class="keyWordListBox">${keywordListHtml}</span>`;
                    replaceStr = `<span class="keyWordBox"><a class="keyWordHref" href="${keywordArr[index].objList[0].url}" target="_blank">${keywordArr[index].word}</a>${newKeywordList}</span>`;
                }
                selectHotSearch.push(keywordArr[index].word); // 已匹配过
                item.txt = item.txt.replace(sItem, replaceStr);
            }
        });
        arr.push({
            img: item.img,
            txt: item.txt
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
            // 如果为主站站点
            if (targetItem.sort === '4') {
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
    fileurl,
    guessLikeList,
    relevantList,
    anchorText
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
        hotRecData,
        guessLikeList,
        relevantList
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
    const hotpotSearchData = Array.isArray(results.hotpotSearch.data) ? results.hotpotSearch.data : [];
    const topicList = hotpotSearchData.slice(0, 20); // 用于匹配超链接

    const textString = results.fileDetailTxt && results.fileDetailTxt.data || '';

    let picArr = results.list && results.list.data && results.list.data.transcodeInfo && results.list.data.transcodeInfo.fileContentList || '';
    if (picArr && picArr.length > 6) {
        picArr = picArr.slice(0, 6);
    }
    const newTextArr = dealContent(textString, picArr, anchorText);
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

    // const paradigm4RelevantData = Array.isArray(results.paradigm4Relevant.data) ? results.paradigm4Relevant.data : [];
    // results.relevantList = paradigm4RelevantData.slice(0, 10);

    // A25需求：获取字典数据
    results.dictionaryData = results.dictionaryData.data;


    // 热门搜索    推荐专题
    // results.relevantList = results.paradigm4Relevant.data.slice(0, 10);
    // results.guessLikeList = results.paradigm4Relevant.data.slice(-21);

    // 对最新资料  推荐专题数据处理

    // results.hotTopicSearch = hotpotSearchData.slice(0, 20);
    // results.hotTopicSeo = hotpotSearchData.slice(-21);

    // console.log('hotTopicSearch', results.hotTopicSearch, 'dictionaryData', results.dictionaryData);

    // A25需求：pc主站蜘蛛页-热点搜索-专题入口逻辑处理
    // results.hotTopicSearch = formatSpacialLink(results.hotTopicSearch, results.dictionaryData);
    // A25需求：pc主站蜘蛛页-推荐专题-专题入口逻辑处理
    // results.hotTopicSeo = formatSpacialLink(results.hotTopicSeo, results.dictionaryData);

    // console.log('hotTopicSeo', results.hotTopicSeo);

    results.type = type;
    results.fileDetailArr = newTextArr;
    const subTitle = fileDetailTxt.data && fileDetailTxt.data.slice(0, 266) || '';
    results.fileSummary = results.list.data.fileInfo.title + subTitle;
    // console.log('xxxxxxx:', subTitle);
    // console.log('---------', results.fileSummary);
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

    // const editorInfo = await getEditorInfo(req, res, list);
    const editorInfo = {};
    const fileDetailTxt = await getFileDetailTxt(req, res);
    const recommendInfo = await getRecommendInfo(req, res, list);
    const paradigm4Relevant = {
        data: []
    }; // 防止没有数据
    let hotpotSearch = {
        data: []
    }; // 热门搜索  推荐专题
    let hotRecData = {
        data: []
    };
    let newsRec = {
        data: []
    };
    let guessLikeList = {
        data: []
    };
    let relevantList = {
        data: []
    };
    let anchorText = {
        data: []
    };
    let hotTopicSearch = {
        data: []
    };
    let hotTopicSeo = {
        data: []
    };
    const paradigm4RelevantUseId = recommendInfo.data[0] && recommendInfo.data[0].useId;
    const hotpotSearchUseId = recommendInfo.data[1] && recommendInfo.data[1].useId;
    // if (paradigm4RelevantUseId) {
    //     paradigm4Relevant = await getParadigm4Relevant(req, res, list, recommendInfo, userID);
    // }
    if (hotpotSearchUseId) {
        hotpotSearch = await getHotpotSearch(req, res, list, recommendInfo, userID);
    }
    hotTopicSeo = await getHotTopicSeo(req, res);
    // A28: 获取'热点搜索'数据列表
    hotTopicSearch = await getHotTopicSearch(req, res);
    // const hotTopicSeo = {};
    hotRecData = await getHotRecData(req, res);
    newsRec = await getNewsRec(req, res);
    // 获取字典数组
    const dictionaryData = await getDictionaryData(req, res);
    // A28: 获取'你可能还喜欢'数据列表
    guessLikeList = await getGuessLikeList(req, res);
    // A28: 获取'相关资料'数据列表
    relevantList = await getRelevantList(req, res);
    // A28: 获取蜘蛛详情页－锚文本数据列表
    anchorText = await getAnchorText(req, res);

    // console.log('newsRec', newsRec);
    // console.log('hotRecData', hotRecData);
    // console.log('hotTopicSeo', hotTopicSeo);
    // console.log('anchorText', anchorText);
    // console.log('hotpotSearch', hotpotSearch);
    // console.log('relevantList', relevantList);

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
        fileurl,
        guessLikeList,
        relevantList,
        anchorText
    });
});
module.exports = {
    index: renderPage
};
