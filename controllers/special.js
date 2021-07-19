const _ = require('lodash');
const render = require('../common/render');
const server = require('../models/index');
const appConfig = require('../config/app-config');
const api = require('../api/api');
const util = require('../common/util');
const cc = require('../common/cc');


function getFindSpecialTopic(req, res, paramsObj) {
    const url = appConfig.apiNewBaselPath + api.special.findSpecialTopic.replace(/\$id/, paramsObj.specialTopicId);
    return server.$http(url, 'get', req, res, true);
}

// A25需求：请求字典列表
function getDictionaryData(req, res) {
    const url = appConfig.apiNewBaselPath + api.dictionaryData.replace(/\$code/, 'themeModel');
    return server.$http(url, 'get', req, res, true);
}

function getListTopicContents(req, res, paramsObj, specialList) {
    let arr = [];
    let uid = '';
    if (paramsObj.topicPropertyQueryDTOList.length > 0) {
        arr = util.getPropertyParams(paramsObj.topicPropertyQueryDTOList, specialList);
    }
    uid = req.cookies.userId;
    req.body = {
        uid: uid,
        specialTopicId: paramsObj.specialTopicId, // 专题id
        dimensionId: paramsObj.dimensionId || '', // 维度id
        topicPropertyQueryDTOList: arr || [],
        sortFlag: Number(paramsObj.sortFlag) || 0, // 排序,0-综合排序,1-最新上传
        currentPage: Number(paramsObj.currentPage) || 1,
        pageSize: 40
    };

    return server.$http(appConfig.apiNewBaselPath + api.special.listTopicContents, 'post', req, res, true);
}

function getSpecialTopic(req, res, topicName) {
    req.body = {
        currentPage: 1,
        pageSize: 30,
        siteCode: '4',
        topicName: topicName // 需要依赖 专题的名称
    };
    return server.$http(appConfig.apiNewBaselPath + api.special.specialTopic, 'post', req, res);
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
    return server.$http(appConfig.apiNewBaselPath + api.special.newRandomRecommend, 'post', req, res, true);
}
function getRecommendList(req, res) {
    req.body = {
        pageIds: [util.pageIds.special.friendLink]
    };
    return server.$http(appConfig.apiNewBaselPath + api.recommend.configInfo2, 'post', req, res);
}

function handleDataResult(req, res, detail, listData, specialTopic, dictionaryDataList, paramsObj, tdkData, recommendList, uid, hotTopicSeo) {
    const data = detail.data || {};
    // 处理tag标签选中
    let dimlist = {};
    if (data && data.dimensionStatus == 0) { // 开启了维度

        if (paramsObj.dimensionId) {
            const index = _.findIndex(data.specialTopicDimensionDOList, ['dimensionId', paramsObj.dimensionId]);
            dimlist = data.specialTopicDimensionDOList[index]; // 当前的维度列表
        } else {
            dimlist = data.specialTopicDimensionDOList && data.specialTopicDimensionDOList[0]; // 当前的维度列表
        }
    } else { // 没有开启维度
        data ? dimlist.specialTopicPropertyGroupDOList = data.specialTopicPropertyGroupDOList : '';
    }


    // 添加全部
    if (dimlist) {
        dimlist.specialTopicPropertyGroupDOList && dimlist.specialTopicPropertyGroupDOList.map((firstItem, firstIndex) => {
            firstItem.specialTopicPropertyDOList.unshift({
                propertyId: 'all',
                propertyName: '全部',
                active: true,
                ids: firstItem.propertyGroupId + '_all'
            });
            firstItem.specialTopicPropertyDOList && firstItem.specialTopicPropertyDOList.map((secondItem, secondIndex) => {
                secondItem.ids = firstItem.propertyGroupId + '_' + secondItem.propertyId;

            });
        });
        // 查找到当前分类  及选中的tag
        const currentArr = [];
        dimlist.specialTopicPropertyGroupDOList && dimlist.specialTopicPropertyGroupDOList.map((firstItem, firstIndex) => {
            firstItem.specialTopicPropertyDOList.map((secondItem, secondIndex) => {
                if (paramsObj.topicPropertyQueryDTOList.includes(secondItem.ids)) {
                    currentArr.push({
                        firstIndex: firstIndex,
                        secondIndex: secondIndex
                    });
                }
            });
        });
        currentArr && currentArr.map(item => {
            dimlist.specialTopicPropertyGroupDOList[item.firstIndex].specialTopicPropertyDOList.map(res => {
                res.active = false;
            });
            dimlist.specialTopicPropertyGroupDOList[item.firstIndex].specialTopicPropertyDOList[item.secondIndex].active = true;
        });

        // data.specialLength = dimlist.specialTopicPropertyGroupDOList && dimlist.specialTopicPropertyGroupDOList.length; // 分类的长度
        data.specialTopicPropertyGroupDOList = dimlist.specialTopicPropertyGroupDOList;

        paramsObj.topicPropertyQueryDTOList = JSON.stringify(paramsObj.topicPropertyQueryDTOList);

    }

    // 最大20页
    const pageIndexArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40];
    if (listData.data && listData.data.totalPages < 40) {
        pageIndexArr.length = listData.data.totalPages;
    }
    const canonicalUrl = paramsObj.currentPage > 1 ? `${req.templateCodeType}/${paramsObj.specialTopicId}.html` : '';
    _.set(listData, 'data.tdk', tdkData);
    // console.log('hotTopicSeo:', JSON.stringify(hotTopicSeo));
    const results = {
        data: data,
        list: listData,
        hotTopicSeo:hotTopicSeo&&hotTopicSeo.data||[],
        specialTopic: specialTopic,
        pageIndexArr: pageIndexArr,
        urlParams: paramsObj,
        isOpen: req.cookies.isOpen,
        uid: uid,
        dictionaryDataList: dictionaryDataList,
        tdk: {
            canonicalUrl: canonicalUrl
        },
        friendLink: recommendList,
        mulu: req.mulu
    };

    render('special/index', results, req, res);
}

function getThemeModel(req, res) { // 获取专题相关配置
    const url = appConfig.apiNewBaselPath + api.dictionaryData.replace(/\$code/, 'themeModel');
    return server.$http(url, 'get', req, res, true);
}

function handleThemeModel({
    themeModelData,
    templateCode,
    req,
    specialTopicId
}) {
    const themeModelMap = {};
    // '/node/s/test001.html'.replace(new RegExp('\/' + 'specialTopicId' +  '.html', 'ig'),'')
    const reg = new RegExp('\/' + specialTopicId + '.html', 'ig');
    const currentPath = req.mulu;
    const templateCodeType = req.templateCodeType;
    console.log('currentPath:', currentPath);
    if (themeModelData && themeModelData.length) {
        themeModelData.forEach(item => {
            const pcode = item.pcode.trim();
            if (!themeModelMap[pcode]) {
                themeModelMap[pcode] = item;
            }
        });
        console.log('themeModelMap', themeModelMap, 'templateCode', templateCode, 'themeModelMap[templateCode]', themeModelMap[templateCode]);
        if (themeModelMap[templateCode]) {
            const desc = themeModelMap[templateCode].order; // 站点
            const pvalue = themeModelMap[templateCode].pvalue; // 目录
            const pcode = themeModelMap[templateCode].pcode; // 模板标识
            console.log(desc, appConfig.site, pvalue, currentPath, desc == appConfig.site && pvalue == currentPath);
            console.log('pcode', pcode, 'templateCodeType', templateCodeType);
            if (pcode == templateCodeType && pvalue == currentPath) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    } else {
        return false; // 404
    }
}
const renderPage = cc(async (req, res) => {
    const {
        data: themeModelData
    } = await getThemeModel(req, res);
    const paramsObj = util.getSpecialParams(req.url);

    const detail = await getFindSpecialTopic(req, res, paramsObj);
    // 获取字典数组
    const dictionaryData = await getDictionaryData(req, res);
    let specialList = [];
    // if (detail.data.templateCode !== 'ishare_zt_model1' || !detail.data) {
    //     res.redirect('/node/404.html');
    //     return;
    // }
    const uid = req.cookies.userId;
    const isRender = handleThemeModel({
        themeModelData,
        templateCode: detail.data.templateCode,
        req,
        specialTopicId: paramsObj.specialTopicId
    });
    console.log('isRender', isRender);
    if (!isRender) {
        res.redirect('/node/404.html');
        return;
    }
    if (paramsObj.dimensionId && detail.data.dimensionStatus == 0) { // 获取当前当前的维度列表
        const index = _.findIndex(detail.data.specialTopicDimensionDOList, ['dimensionId', paramsObj.dimensionId]);
        specialList = detail.data.specialTopicDimensionDOList[index].specialTopicPropertyGroupDOList; // 当前维度下的分类
    } else { // 无维度的情况
        specialList = detail.data.specialTopicPropertyGroupDOList; //
    }
    const listData = await getListTopicContents(req, res, paramsObj, specialList);


    const topicName = detail.data.topicName;
    const str = topicName.length <= 12 ? topicName + '_' + topicName : topicName; // 专题字数小于等于12时
    const tdkData = {
        pageTable: '专题页',
        url: req.templateCodeType + '/' + paramsObj.specialTopicId + '.html',
        title: paramsObj.currentPage > 1 ? topicName + '_' + topicName + '下载 _第' + paramsObj.currentPage + '页_爱问共享资料' : str + '下载 - 爱问共享资料',
        description: '爱问共享资料提供优质的' + topicName + '下载，可编辑，可替换，更多' + topicName + '资料，快来爱问共享资料下载!',
        keywords: topicName + ',' + topicName + '下载'
    };

    const hotTopicSeo = await getHotTopicSeo(req, res);
    const specialData = await getSpecialTopic(req, res, detail.data.topicName);
    const specialTopic = specialData.data && specialData.data.rows || [];
    const dictionaryDataList = dictionaryData.data;
    console.log('specialTopic', specialTopic);
    // console.log('dictionaryDataList', dictionaryDataList);
    // A25需求：pc主站-专题页热门搜索-专题入口逻辑处理
    if (specialTopic && dictionaryDataList) {
        specialTopic.forEach((specialTopicItem, index) => {
            // console.log('specialTopicItem', specialTopicItem);
            const targetItem = dictionaryDataList.find(dictionaryItem => dictionaryItem.pcode === specialTopicItem.templateCode);
            // console.log('targetItem', targetItem);
            if (targetItem) {
                if (targetItem.order === 4) {
                    specialTopic[index].newRouterUrl = `${targetItem.pvalue}/${specialTopicItem.id}.html`;
                } else {
                    specialTopic[index].newRouterUrl = `${targetItem.desc}${targetItem.pvalue}/${specialTopicItem.id}.html`;
                }
            } else {
                specialTopic[index].newRouterUrl = '';
            }
        });
        // console.log('specialTopic', specialTopic);
    }

    let recommendList = [];
    const recommendListData = await getRecommendList(req, res);
    if(recommendListData.data&&recommendListData.data.length){
        recommendListData.data.forEach(item => {
            // 友情链接
            recommendList = util.dealHref(item, dictionaryDataList).list || [];
        });
    }
    handleDataResult(req, res, detail, listData, specialTopic, dictionaryDataList, paramsObj, tdkData, recommendList, uid, hotTopicSeo);
});


module.exports = {
    render: renderPage
};
