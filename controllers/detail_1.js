/**
 * @Description: 详情页
 */

const render = require("../common/render");
const server = require("../models/index");
const util = require('../common/util');
const cc = require('../common/cc')
const recommendConfigInfo = require('../common/recommendConfigInfo')
const Api = require("../api/api");
const appConfig = require("../config/app-config");


const defaultResultsData = { freeAdv:false,copy:false,reward:{},recommendInfoData_rele: {}, recommendInfoData_guess: {}, paradigm4Guess: {}, paradigm4Relevant: {}, list: { data: { svgFlag: true, supportSvg: true, fileContentList: [], svgPathList: [], isDownload: 'no' } } } // 确保私有 删除  404 显示用户信息 用户可以登录

const renderPage = cc(async (req, res) => {

    let userID = Math.random().toString().slice(-15); //标注用户的ID，
    const flag = req.params.id.includes('-nbhh')
    const redirectUrl = await getRedirectUrl(req, res)

    if (redirectUrl.data) {
        if (redirectUrl.data.targetLink) {
            var url = redirectUrl.data.type == 1 ? req.protocol + '://' + redirectUrl.data.targetLink : req.protocol + '://' + req.hostname + '/f/' + redirectUrl.data.targetLink + '.html';
            res.redirect(url);
        }
    }
    const list = await getList(req, res)
    if (list.code == 'G-404') { // 文件不存在
        var results = Object.assign({}, defaultResultsData, { showFlag: false, statusCode: '404', isDetailRender: true })
        res.status(404)
        render("detail/index", results, req, res);
        return
    }
    if (list.data) {
        userID = list.data.fileInfo.uid && list.data.fileInfo.uid.slice(0, 10) || ''; //来标注用户的ID，
        let uid = req.cookies.ui ? JSON.parse(req.cookies.ui).uid : ''
        let cuk = req.cookies.cuk
        let data = list.data;
        let fileInfo = data.fileInfo
        if (fileInfo.site == 0) {
            // 跳转到办公携带参数修改

            var officeParams = 'utm_source=ishare&utm_medium=ishare&utm_content=ishare&utm_campaign=ishare&utm_term=ishare';
            res.redirect(`https://office.iask.com/f/${fileInfo.id}.html?` + officeParams);
            return
        }
        if (fileInfo.showflag !== 'y') { // 文件删除
            var searchQuery = `?ft=all&cond=${encodeURIComponent(encodeURIComponent(fileInfo.title))}`
            var results = Object.assign({}, { showFlag: false, searchQuery, statusCode: '404', isDetailRender: true }, defaultResultsData)
            res.status(404)
            render("detail/index", results, req, res);
            return
        }
        if (fileInfo.productType == 6) {
            if (cuk && fileInfo.uid && fileInfo.uid == uid) {

            } else {
                var searchQuery = `?ft=all&cond=${encodeURIComponent(encodeURIComponent(fileInfo.title))}`
                var results = Object.assign({}, { showFlag: false, searchQuery, isPrivate: true, statusCode: '302', isDetailRender: true }, defaultResultsData)
                res.status(302)
                render("detail/index", results, req, res);
                return
            }
        }
    }
    const specialTopic  = await getSpecialTopic(req,res,list)
    const topBannerList = await getTopBannerList(req, res)
    const searchBannerList = await getSearchBannerList(req, res)
    const bannerList = await getBannerList(req, res, list)
    const crumbList = await getCrumbList(req, res, list)
    const memberList = await getUserVipRights(req, res); // 权益列表
    const cateList = await getCategoryList(req, res);  
    const recommendInfo = await getRecommendInfo(req, res, list)
    let paradigm4Guess = []
    let paradigm4Relevant = []
    if (recommendInfo) {
        paradigm4Relevant = await getParadigm4Relevant(req, res, list, recommendInfo, userID)
        paradigm4Guess = await getParadigm4Guess(req, res, list, recommendInfo, userID)
    }
    const filePreview = await getFilePreview(req, res, list)
    const commentDataList = await getFileComment(req,res)
    handleDetalData(
        req,
        res,
        redirectUrl,
        list,
        topBannerList,
        searchBannerList,
        bannerList,
        memberList,
        cateList,
        recommendInfo,
        paradigm4Relevant,
        paradigm4Guess,
        filePreview,
        crumbList,
        userID,
        specialTopic,
        commentDataList
    )
})


module.exports = {
    render: renderPage
}

function getRedirectUrl(req, res) {
    req.body = {
        sourceLink: req.protocol + '://' + req.hostname + req.url
    }
    return server.$http(appConfig.apiNewBaselPath + Api.file.redirectUrl, 'post', req, res, true)
}

function getList(req, res) {
    req.body = {
        clientType: 0,
        fid: req.params.id,
        sourceType: 0,
        site:4
    }
    return server.$http(appConfig.apiNewBaselPath + Api.file.getFileDetailNoTdk, 'post', req, res, true)
}

function getTopBannerList(req, res) {
    req.body = recommendConfigInfo.details.topBanner.pageId
    return server.$http(appConfig.apiNewBaselPath + Api.recommendConfigInfo, 'post', req, res, true)
}

function getSearchBannerList(req, res) {
    req.body = recommendConfigInfo.details.searchBanner.pageId
    return server.$http(appConfig.apiNewBaselPath + Api.recommendConfigInfo, 'post', req, res, true)
}

function getBannerList(req, res, list) {
    let format = list.data.fileInfo.format
    let classid1 = list.data.fileInfo.classid1
    let classid2 = list.data.fileInfo.classid2
    req.body = dealParam(format, classid1, classid2)
    return server.$http(appConfig.apiNewBaselPath + Api.recommendConfigRuleInfo, 'post', req, res, true)
}

function getCrumbList(req, res, list) {
    // let classId = list.data.fileInfo.classId
    // let spcClassId = list.data.fileInfo.spcClassId
    // let isGetClassType = list.data.fileInfo.isGetClassType
    // req.body = {
    //     classId: classId,
    //     spcClassId: spcClassId,
    //     isGetClassType: isGetClassType
    // }
    // return server.$http(appConfig.apiNewBaselPath + Api.file.navCategory, 'post', req, res, true)
    return { data: [] };
}

function getSpecialTopic(req,res,list){
    req.body = {
        currentPage:1,
        pageSize:5,
        topicName: list.data.fileInfo.title,
        siteCode:'4' 
    }
    return server.$http(appConfig.apiNewBaselPath + Api.search.associatedWords, 'post', req, res, true)
}

function getRecommendInfo(req, res, list) {
    const productType = list.data.fileInfo.productType
    const classid1 = list.data.fileInfo.classid1
    let format = list.data.fileInfo.format
    // 必须是主站 不是私密文件 文件类型必须是 教育类||专业资料 ||经济管理 ||生活休闲 || 办公频道文件 
    // (classid1 == '1816' || classid1 == '1820' || classid1 == '1821' || classid1 == '1819' || classid1 == '1818')
    if (productType != '6') {
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
        if(classid1 == '10339'){
            classid1 = '1819'
        }
        if(classid1 == '1823'){
            classid1 = '1821'
        }
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
            default:   pageIds = [rele_pageId.replace('jy', 'shxx'), guess_pageId.replace('jy', 'shxx')];
        }
        req.body = pageIds
        // '/gateway/recommend/config/info' 
        return server.$http(appConfig.apiNewBaselPath + Api.recommendConfigInfo, 'post', req, res, true)
    } else {
        return null
    }

}

function getParadigm4Relevant(req, res, list, recommendInfo, userID) {
    let requestID_rele = Math.random().toString().slice(-10);//requestID是用来标注推荐服务请求的ID，是长度范围在8~18位的随机字符串

    let recommendInfoData_rele = recommendInfo.data[0] || {} //相关资料
    req.requestID_rele = requestID_rele
    req.recommendInfoData_rele = recommendInfoData_rele
    if (recommendInfoData_rele.useId) {
        let sceneIDRelevant = recommendInfoData_rele.useId || '';
        req.body = { "itemID": list.data.fileInfo.fid, "itemTitle": list.data.fileInfo.title }
        let url = `https://nbrecsys.4paradigm.com/api/v0/recom/recall?requestID=${requestID_rele}&sceneID=${sceneIDRelevant}&userID=${userID}`
        return server.$http(url, 'post', req, res, true);
    } else {
        return null
    }
}

function getParadigm4Guess(req, res, list, recommendInfo, userID) {
    let recommendInfoData_guess = recommendInfo.data[1] || {}; // 个性化 猜你喜欢
    let requestID_guess = Math.random().toString().slice(-10);//requestID是用来标注推荐服务请求的ID，是长度范围在8~18位的随机字符串
    req.requestID_guess = requestID_guess
    if (recommendInfoData_guess.useId) {
        let sceneIDGuess = recommendInfoData_guess.useId || '';
        req.body = { "itemID": list.data.fileInfo.fid, "itemTitle": list.data.fileInfo.title }
        let url = `https://nbrecsys.4paradigm.com/api/v0/recom/recall?requestID=${requestID_guess}&sceneID=${sceneIDGuess}&userID=${userID}`
        return server.$http(url, 'post', req, res, true)
    } else {
        return null
    }
}

// 进入页面获取该用户VIP权益点
function getUserVipRights(req, res) {
    if (req.cookies.cuk) {
        req.body = {
            memberCodeList: ['COPY', 'FREE_ADV'] // ['COPY', 'FREE_ADV', 'REWARD']
        };
        return server.$http(appConfig.apiNewBaselPath + Api.coupon.getVipAllMemberDetail, 'post', req, res, true)
    } else {
        return null;
    }
}

// 获取页面分类列表
function getCategoryList(req, res) {
    req.body = {
        level: 2,
        site: 4,
        terminal: 0
    };
    return server.$http(appConfig.apiNewBaselPath + Api.index.navList, 'post', req, res, true)
}

function getFilePreview(req, res, list) {
    let validateIE9 = req.headers['user-agent'] ? ['IE9', 'IE8', 'IE7', 'IE6'].indexOf(util.browserVersion(req.headers['user-agent'])) === -1 ? 0 : 1 : 0;
    req.body = {
        fid: list.data.fileInfo.fid,
        validateIE9: validateIE9
    }
    return server.$http(appConfig.apiNewBaselPath + Api.file.preReadPageLimit, 'post', req, res, true)
}

// 获取详情评论  用于加载更多定位
function getFileComment(req,res){ 
    let fid = req.params.id
    const url=  appConfig.apiNewBaselPath + Api.comment.getFileComment + '?fid='+ fid + '&currentPage=1&pageSize=15' ;
    return server.$http(url,'get', req, res, true);
}
function handleDetalData(
    req,
    res,
    redirectUrl,
    list,
    topBannerList,
    searchBannerList,
    bannerListData,
    memberList,
    cateList,
    recommendInfo,
    paradigm4Relevant,
    paradigm4Guess,
    filePreview,
    crumbList,
    userID,
    specialTopic,
    commentDataList
) {

    if (topBannerList.data) {
        if (req.cookies.isHideDetailTopbanner) {
            topBannerList = []
        } else {
            topBannerList = util.handleRecommendData(topBannerList.data[0] && topBannerList.data[0].list || [])
        }
    }
    if (searchBannerList.data) {
        searchBannerList = util.handleRecommendData(searchBannerList.data[0] && searchBannerList.data[0].list || [])
    }
    if (bannerListData.data) {
        const bannerList = {
            'rightTopBanner': [],
            'rightBottomBanner': [],
            'titleBottomBanner': [],
            'turnPageOneBanner': [],
            'turnPageTwoBanner': []
        }
        bannerListData.data.forEach(item => {
            bannerList[item.id] = util.handleRecommendData(item.fileRecommend && item.fileRecommend.list || [])
        })
    }

    // 
    let fileInfo = list.data.fileInfo
    fileInfo.readTimes = Math.ceil((fileInfo.praiseNum + fileInfo.collectNum) * 1.9)
    var list = Object.assign({}, { data: Object.assign({}, list.data.fileInfo, list.data.transcodeInfo) })
    if (!list.data.fileContentList) {
        list.data.fileContentList = []
        list.data.isConvert = 0
    }
    if (!list.data.svgPathList) {
        list.data.svgPathList = []
        list.data.isConvert = 0
    }

    
    var results = Object.assign({}, {
        isHasComment:commentDataList.data.totalPages>0?1:0,
        redirectUrl: redirectUrl,
        getTopBannerList: topBannerList,
        geSearchBannerList: searchBannerList,
        getBannerList: bannerListData,
        crumbList,
        cateList: cateList.data && cateList.data.length ? cateList.data : [],
        recommendInfo,
        paradigm4Relevant,
        paradigm4Guess,
        filePreview,
        freeAdv: false,
        copy: false,
        reward: {unit: 1, value: '0'},
        specialTopic:specialTopic.data.rows
    }, { list: list });
    
   
    var svgPathList = results.list.data.svgPathList;
    results.list.data.supportSvg = req.headers['user-agent'] ? ['IE9', 'IE8', 'IE7', 'IE6'].indexOf(util.browserVersion(req.headers['user-agent'])) === -1 : false;
    results.list.data.svgFlag = !!(svgPathList && svgPathList.length > 0);
    results.crumbList.data.isGetClassType = fileInfo.isGetClassType || 0;
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
                item_read_cnt: item.item_read_cnt
            }
        })

        results.RelevantInformationList = {}   // RelevantInformationList 接口被注释 为了 不修改页面取数据的格式,自己在 results上添加一个RelevantInformationList
        results.RelevantInformationList.data = paradigm4RelevantMap.slice(0, 4) || [];
        results.requestID_rele = req.requestID_rele;
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
                item_read_cnt: item.item_read_cnt
            }
        })
        results.paradigm4GuessData = paradigm4Guess || [];
        results.requestID_guess = req.requestID_guess;
        results.userID = userID;
    }

    // 获取主站是否可以复制SVG，展示广告的功能
    if (memberList && memberList.data) {
        const memberCode = memberList.data.find(item => item.site == 4);
        const { isVip = false, memberPointList = [] } = memberCode;
        const freeAdv = memberPointList.find(item => item.code == 'FREE_ADV');
        const copy = memberPointList.find(item => item.code == 'COPY');
        // const reward = memberPointList.find(item => item.code == 'REWARD');
        results.freeAdv = isVip && freeAdv.value == '1' ? true : false;
        results.copy = isVip && copy.value == '1' ? true : false;
        results.reward = {unit: 1, value: '0'}; // isVip ? {...reward} : {unit: 1, value: '0'};
    }

    results.recommendInfoData_rele = req.recommendInfoData_rele || {};
    results.recommendInfoData_guess = req.recommendInfoData_guess || {};
    results.showFlag = true
    results.isDetailRender = true
    // console.log('获取详情数据：', JSON.stringify(results))
    if (results.list.data && results.list.data.abTest) {
        render("detail-b/index", results, req, res);
    } else {
        render("detail/index", results, req, res);
    }
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
            results.list.data.fileContentList = newImgUrl;
        }
        // 接口限制可预览页数
        if (!results.filePreview.data) {
            results.filePreview.data = {}
        }
        let fileContentList = results.list.data && results.list.data.fileContentList
        let preRead = results.filePreview.data.preRead = results.list.data.preRead

        if (!preRead) {
            preRead = results.filePreview.data.preRead = 50;
        }
        // 页面默认初始渲染页数

        let initReadPage = Math.min(fileContentList.length, preRead, 4);
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
function dealParam(format, classid1, classid2) {//处理详情推荐位参数
    var defaultType = 'all'
    var params = [
        {
            id: 'rightTopBanner',
            pageIds: [
                `PC_M_FD_${format}_${classid2}_ru`,
                `PC_M_FD_${format}_${classid1}_ru`,
                `PC_M_FD_${defaultType}_${classid2}_ru`,
                `PC_M_FD_${defaultType}_${classid1}_ru`,
            ]
        },
        {
            id: 'rightBottomBanner',
            pageIds: [ //
                `PC_M_FD_${format}_${classid2}_rd`,
                `PC_M_FD_${format}_${classid1}_rd`,
                `PC_M_FD_${defaultType}_${classid2}_rd`,
                `PC_M_FD_${defaultType}_${classid1}_rd`,
            ]
        },
        {
            id: 'titleBottomBanner',
            pageIds: [
                `PC_M_FD_${format}_${classid2}_ub`,
                `PC_M_FD_${format}_${classid1}_ub`,
                `PC_M_FD_${defaultType}_${classid2}_ub`,
                `PC_M_FD_${defaultType}_${classid1}_ub`,
            ]
        },
        {
            id: 'turnPageOneBanner',
            pageIds: [
                `PC_M_FD_${format}_${classid2}_fy1b`,
                `PC_M_FD_${format}_${classid1}_fy1b`,
                `PC_M_FD_${defaultType}_${classid2}_fy1b`,
                `PC_M_FD_${defaultType}_${classid1}_fy1b`,
            ]
        },
        {
            id: 'turnPageTwoBanner',
            pageIds: [
                `PC_M_FD_${format}_${classid2}_fy2b`,
                `PC_M_FD_${format}_${classid1}_fy2b`,
                `PC_M_FD_${defaultType}_${classid2}_fy2b`,
                `PC_M_FD_${defaultType}_${classid1}_fy2b`,
            ]
        }
    ]
    return params
}