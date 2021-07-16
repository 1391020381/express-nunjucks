/**
 * 分类页
 * 1、分类页取消蜘蛛模板：
   2、url规范：
        结构：/c/分类ID/属性项_属性ID/；
        不要带.html；
        由于链接规则由后台生成，前端不需要限制226个字符，由后续后端迭代优化；
 */
const render = require('../common/render');
const server = require('../models/index');
const api = require('../api/api');
const appConfig = require('../config/app-config');
const util = require('../common/util');
const cc = require('../common/cc');

const getData = cc(async (req, res) => {

    const { cId, sId } = req.params;
    let navFatherId = '';
    let categoryName = '';
    // 分解cId字符串【categoryId-分类id format-格式 sortField-排序 currentPage-分页】
    const cIds = cId ? cId.split('_') : [];
    const categoryId = cIds[0] ? cIds[0] : '';
    const format = cIds[1] ? cIds[1].toLowerCase() : 'all';
    const currentPage = cIds[2] ? Number(cIds[2]) : 1;
    const sortField = cIds[3] ? cIds[3] : '';
    // 当前选中的选中的属性组list
    const urlSelectId = [];
    const urlSelectOb = {}; // 去重利器
    const sIds = sId ? sId.split('-') : [];
    if (sIds.length) {
        for (let i = 0, len = sIds.length; i < len; i++) {
            const sIdItems = sIds[i].split('_');
            // 如果有属性值
            if (sIdItems[1]) {
                urlSelectOb[sIdItems[0]] = sIdItems[1];
            }
        }
    }

    for (const attr in urlSelectOb) {
        urlSelectId.push({
            attributeGroupId: attr,
            attributeId: urlSelectOb[attr]
        });
    }

    const redirectUrl = await getRedirectUrl(req, res);
    if (redirectUrl.data) {
        if (redirectUrl.data.targetLink) {
            const url = redirectUrl.data.type == 1 ? req.protocol + '://' + redirectUrl.data.targetLink : req.protocol + '://' + req.hostname + '/c/' + redirectUrl.data.targetLink + '.html';
            res.redirect(301, url);
        }
    }

    const categoryTitle = await getCategoryTitle(req, res, categoryId, urlSelectId);

    if (categoryTitle.data && categoryTitle.data.level1) {
        categoryTitle.data.level1.forEach(item => {
            if (item.select == 1) {
                navFatherId = item.nodeCode;
                categoryName = item.name;
            }
        });
    }


    // 获取 属性组和id
    const selectId = [];
    const specificsIdList = [];

    // 构造属性url
    if (categoryTitle.data && categoryTitle.data.specificsInfos) {
        categoryTitle.data.specificsInfos.forEach(item => {
            if (item.select == '1') {
                // 去掉groupId
                const newUrlSelectOb = { ...urlSelectOb };
                delete newUrlSelectOb[item.id];
                item['surl'] = formatObToStr(newUrlSelectOb);
                item.subSpecificsList.forEach(k => {
                    if (k.select == '1') {
                        selectId.push({
                            attributeGroupId: item.id,
                            attributeId: k.id
                        });
                        specificsIdList.push(k.id);
                        k['surl'] = sId;
                    } else {
                        const newUrlSelectOb = { ...urlSelectOb };
                        newUrlSelectOb[item.id] = k.id;
                        k['surl'] = formatObToStr(newUrlSelectOb);
                    }
                });
            } else {
                item['surl'] = sId ? sId : '';
                item.subSpecificsList.forEach(k => {
                    if (k.select == '1') {
                        selectId.push({
                            attributeGroupId: item.id,
                            attributeId: k.id
                        });
                        specificsIdList.push(k.id);
                        k['surl'] = sId;
                    } else {
                        const newUrlSelectOb = { ...urlSelectOb };
                        newUrlSelectOb[item.id] = k.id;
                        k['surl'] = formatObToStr(newUrlSelectOb);
                    }
                });
            }
        });
    }
    let recommendList = {};
    let categoryPage = {};
    if (navFatherId) {
        categoryPage = { // 分类页
            topbanner: `PC_M_FC_all_${navFatherId}_topbanner`, // 顶部banner图
            rightbanner: `PC_M_FC_all_${navFatherId}_rightbanner`, // 分类页-右侧banner
            zhuanti: `PC_M_FC_all_${navFatherId}_zhuanti`, // 分类页-右侧专题
            friendLink: 'PC_M_FC_yqlj' // 友情链接
        };
        recommendList = await getRecommendList(req, res, categoryPage);
        console.log('recommendList:', JSON.stringify(recommendList));
    }
    const list = await getList(req, res, categoryId, sortField, format, currentPage, specificsIdList);
    const tdk = await getTdk(req, res, categoryId, sIds);
    const words = await getWords(req, res, categoryName);
    // 获取字典数组
    const dictionaryData = await getDictionaryData(req, res);
    handleResultData(
        req,
        res,
        categoryTitle,
        recommendList,
        list,
        tdk,
        words,
        dictionaryData,
        categoryId,
        currentPage,
        format,
        sortField,
        navFatherId,
        selectId,
        categoryPage
    );
});

module.exports = {
    getData: getData
};
// 处理埋点需要上报的分类id和分类名称
function dealCategoryTitle(cateData){
    const idArr=[], nameArr=[];// 选中的分类1 2 3 4 5级
    const level1 = cateData.level1 ? cateData.level1 : [];
    const level2 = cateData.level2 ? cateData.level2 : [];
    const level3 = cateData.level3 ? cateData.level3 : [];
    const level4 = cateData.level4 ? cateData.level4 : [];
    const level5 = cateData.level5 ? cateData.level5 : [];
    const levelList = [...level1, ...level2, ...level3, ...level4, ...level5];
    levelList.forEach(item => {
        if(item.select == 1){
            idArr.push(item.nodeCode);
            nameArr.push(item.name);
        }
    });
    return {
        idArr:idArr.join('||'),
        nameArr:nameArr.join('||')
    };
}

// 根据分类节点获取所属分类和属性【A20】
function getCategoryTitle(req, res, categoryId, urlSelectId) {
    req.body = {
        nodeCode: categoryId,
        attributeGroupList: urlSelectId
    };
    return server.$http(appConfig.apiNewBaselPath + api.category.navForCpage, 'post', req, res, true);
}

function getRecommendList(req, res, categoryPage) {
    const params = [];
    for (const k in categoryPage) {
        params.push(categoryPage[k]);
    }
    req.body = params;
    return server.$http(appConfig.apiNewBaselPath + api.category.recommendList, 'post', req, res, true);
}

function getList(req, res, categoryId, sortField, format, currentPage, specificsIdList) {
    req.body = {
        nodeCode: categoryId,
        sortField: sortField == 'default' ? '' : sortField,
        format: format == 'all' ? '' : format,
        currentPage: currentPage,
        pageSize: 40,
        specificsIdList: specificsIdList
    };
    return server.$http(appConfig.apiNewBaselPath + api.category.list, 'post', req, res, true);
}

function getTdk(req, res, categoryId, sIds) {
    req.body = {
        attributes: [...sIds],
        classId: categoryId,
        page: 1,
        site: 4,
        terminal: 0
    };
    return server.$http(appConfig.apiNewBaselPath + api.tdk.getTdkByUrl, 'post', req, res, true);
}

// 获取跳转链接
function getRedirectUrl(req, res) {
    req.body = {
        sourceLink: req.protocol + '://' + req.hostname + req.url
    };
    return server.$http(appConfig.apiNewBaselPath + api.file.redirectUrl, 'post', req, res, true);
}

// 根据分类名称获取热词
function getWords(req, res, categoryName) {
    req.body = {
        currentPage: 1,
        pageSize: 6,
        siteCode: 4,
        topicName: categoryName
    };
    return server.$http(appConfig.apiNewBaselPath + api.category.words, 'post', req, res, true);
}

// A25需求：请求字典列表
function getDictionaryData(req, res) {
    // console.log('reqreqreq', req, 'resresres', res);
    const url = appConfig.apiNewBaselPath + api.dictionaryData.replace(/\$code/, 'themeModel');
    return server.$http(url, 'get', req, res, true);
}

/**
 * 专有方法，将对象转换为字符串
 * @param obj {object} 对象
 * @returns str {string} 字符串
 * */
function formatObToStr(obj) {
    let str = '';
    for (const attr in obj) {
        str = str + '-' + attr + '_' + obj[attr];
    }
    return str ? str.substring(1, str.length) + '/' : '';
}

function handleResultData(
    req,
    res,
    categoryTitle,
    recommendList,
    list,
    tdk,
    words,
    dictionaryData,
    categoryId,
    currentPage,
    format,
    sortField,
    navFatherId,
    selectId,
    categoryPage
) {
    let urlSelectId = '';
    const results = Object.assign({ categoryTitle, recommendList, list, tdk, words }) || {};
    let pageObj = {};
    let pageArr_f = [];
    const pageArr_b = [];
    let totalPages = [];
    if (results.list && results.list.data && results.list.data.rows) {
        // 页码处理
        pageObj = results.list.data;
        totalPages = pageObj.totalPages > 40 ? 40 : pageObj.totalPages;
        if (pageObj.rows.length > 0) {
            if (currentPage > 5) {
                pageArr_f = [1, '···'];
                pageArr_f.push(currentPage - 2);
                pageArr_f.push(currentPage - 1);
                pageArr_f.push(currentPage);
            } else {
                for (let i = 0; i < currentPage; i++) {
                    pageArr_f.push(i + 1);
                }
            }
            if (totalPages - 5 > currentPage) {
                pageArr_b.push(currentPage + 1);
                pageArr_b.push(currentPage + 2);
                pageArr_b.push(currentPage + 3);
                pageArr_b.push(currentPage + 4);
                pageArr_b.push(currentPage + 5);
                pageArr_b.push('···');
                pageArr_b.push(totalPages);
            } else {
                for (let i = currentPage; i < totalPages; i++) {
                    pageArr_b.push(i + 1);
                }
            }
        }
    }

    // 处理链接参数
    if (selectId && selectId.length) {
        selectId.forEach(value => {
            const valueStr = value.attributeGroupId + '_' + value.attributeId;
            urlSelectId = urlSelectId + '-' + valueStr;
        });
    }

    if (results.tdk && results.tdk.data) {
        results.list.data = results.list.data || {};
        results.list.data.tdk = results.tdk.data;
    }
    const pageIndexArr = pageArr_f.concat(pageArr_b);
    results.reqParams = {
        cid: categoryId,
        currentPage: currentPage,
        totalPages: totalPages,
        fileType: format,
        sortField: sortField == 'default' ? '' : sortField,
        pageIndexArr: pageIndexArr,
        selectId: urlSelectId ? '/' + urlSelectId : '/',
        selectUrl: urlSelectId ? '/' + urlSelectId.substring(1, urlSelectId.length) + '/' : '/'
    };
    // 推荐位 banner
    // var topbannerId = 'topbanner_' + navFatherId;
    // var rightbannerId = 'rightbanner_' + navFatherId;
    // var zhuantiId = 'zhuanti_' + navFatherId;
    const topbannerId = 'topbanner';
    const rightbannerId = 'rightbanner';
    const zhuantiId = 'zhuanti';
    const dictionaryDataList = dictionaryData.data;
    results.recommendList.data && results.recommendList.data.map(item => {
        if (item.pageId == categoryPage[topbannerId]) {
            // 顶部banner
            const topbannerList = util.handleRecommendData(item.list || [], dictionaryDataList).list || []; //
            results.topBanner = {
                recommendID:item.pageId,
                recommendName:item.name,
                list:topbannerList
            };

        } else if (item.pageId == categoryPage[rightbannerId]) {
            // 右上banner
            const rightBannerList = util.handleRecommendData(item.list || [], dictionaryDataList).list || [];
            results.righBanner = {
                recommendID:item.pageId,
                recommendName:item.name,
                list:rightBannerList
            };
        } else if (item.pageId == categoryPage[zhuantiId]) {
            // 专题
            const zhuantiList = util.handleRecommendData(item.list || [], dictionaryDataList).list || [];
            results.zhuanti = {
                recommendID:item.pageId,
                recommendName:item.name,
                list:zhuantiList
            };
        } else if (item.pageId == categoryPage.friendLink) {
            // 友情链接
            results.friendLink = util.dealHref(item, dictionaryDataList).list || [];
        }
    });

    // 热点搜索
    // results.words.data && results.words.data.rows.map(item => {
    //     item.linkurl = '/node/s/' + item.specialTopicId + '.html';
    // });

    const categoryTopic = results.words.data.rows;

    // A25需求：pc主站-专题页热门搜索-专题入口逻辑处理
    if (categoryTopic && dictionaryDataList) {
        categoryTopic.forEach((categoryTopicItem, index) => {
            // console.log('categoryTopicItem', categoryTopicItem);
            const targetItem = dictionaryDataList.find(dictionaryItem => dictionaryItem.pcode === categoryTopicItem.templateCode);
            // console.log('targetItem', targetItem);
            if (targetItem) {
                if (targetItem.order === 4) {
                    categoryTopic[index].linkurl = `${targetItem.pvalue}/${categoryTopicItem.id}.html`;
                } else {
                    categoryTopic[index].linkurl = `${targetItem.desc}${targetItem.pvalue}/${categoryTopicItem.id}.html`;
                }
            } else {
                categoryTopic[index].linkurl = '';
            }
        });
        console.log('categoryTopic', categoryTopic);
    }

    results.categoryId = categoryId; // 登录时传入当前分类id
    results.navFatherId = navFatherId; // 登录时传入当前分类id
    results.isCategoryRender = true;
    results.idArr= dealCategoryTitle(categoryTitle.data).idArr;
    results.nameArr= dealCategoryTitle(categoryTitle.data).nameArr;
    render('category/home', results, req, res);
}


