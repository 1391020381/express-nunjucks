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

const defaultResultsData = { list: { data: { svgFlag: true, supportSvg: true, contentPathList: [], svgPathList: [], isDownload: 'no' } } } // 确保私有 删除  404 显示用户信息 用户可以登录

const renderPage = cc(async (req, res) => {

    let userID = req.cookies.userId || req.cookies.visitor_id || Math.random().toString().slice(-15); //标注用户的ID

    const redirectUrl = await getRedirectUrl(req, res)

    if (redirectUrl.data) {
        if (redirectUrl.data.targetLink) {
            var url = redirectUrl.data.type == 1 ? req.protocol + '://' + redirectUrl.data.targetLink : req.protocol + '://' + req.hostname + '/f/' + redirectUrl.data.targetLink + '.html';
            res.redirect(301, url);
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
        let uid = req.cookies.ui ? JSON.parse(req.cookies.ui).uid : ''
        let cuk = req.cookies.cuk
        let data = list.data;
        let fileInfo = data.fileInfo
        if (fileInfo.site == 0) {
            // 跳转到办公携带参数修改
            var officeParams = 'utm_source=ishare&utm_medium=ishare&utm_content=ishare&utm_campaign=ishare&utm_term=ishare';
            res.redirect(301, `https://office.iask.com/f/${fileInfo.id}.html?` + officeParams);
            return;
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
        // 【A20如果该文件是txt格式】
        if (fileInfo.format.toLowerCase() === 'txt') {
            const txtContentList = await fetchTxtContentList(data.transcodeInfo.contentPathList);
            list.data.transcodeInfo.contentPathList = [...txtContentList];
        }
    }

    const topBannerList = await getTopBannerList(req, res)
    const searchBannerList = await getSearchBannerList(req, res)
    const bannerList = await getBannerList(req, res, list)

    const crumbList = await getCrumbList(req, res, list)
    const cateList = await getCategoryList(req, res);
    const filePreview = await getFilePreview(req, res, list)

    handleDetalData({ req, res, redirectUrl, list, topBannerList, searchBannerList, bannerList, cateList, filePreview, crumbList, userID })
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
        site: 4
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

// 获取txt列表
function fetchTxtContentList(contentPathList) {
    if (contentPathList.length) {
        let promiseList = contentPathList.map(item => {
            return fetchContentForTxt(item);
        })
        return new Promise((resolve) => {
            Promise.all(promiseList).then(resArr => {
                resolve(resArr);
            }).catch(() => {
                console.log('获取txt数据出错！');
                resolve([]);
            })
        });
    }
}

// 获取txt数据
function fetchContentForTxt(txtPath) {
    return server.$httpTxt(txtPath);
}


function handleDetalData({ req, res, redirectUrl, list, topBannerList, searchBannerList, bannerList, cateList, recommendInfo, filePreview, crumbList, userID }) {

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
    if (bannerList.data) {
        let detailBannerList = {
            'rightTopBanner': [],
            'rightBottomBanner': [],
            'titleBottomBanner': [],
            'turnPageOneBanner': [],
            'turnPageTwoBanner': []
        }
        bannerList.data.forEach(item => {
            detailBannerList[item.id] = util.handleRecommendData(item.fileRecommend && item.fileRecommend.list || [])
        })
    }

    let fileInfo = list.data.fileInfo
    fileInfo.readTimes = Math.ceil((fileInfo.praiseNum + fileInfo.collectNum) * 1.9)
    var list = Object.assign({}, { data: Object.assign({}, list.data.fileInfo, list.data.transcodeInfo) })

    if (!list.data.contentPathList) {
        list.data.contentPathList = []
        list.data.isConvert = 0
    }
    if (!list.data.svgPathList) {
        list.data.svgPathList = []
        list.data.isConvert = 0
    }

    var results = Object.assign({}, {
        redirectUrl: redirectUrl,
        getTopBannerList: topBannerList,
        geSearchBannerList: searchBannerList,
        getBannerList: bannerList,
        crumbList,
        cateList: cateList.data && cateList.data.length ? cateList.data : [],
        recommendInfo,
        filePreview,
    }, { list: list });
    var svgPathList = results.list.data.svgPathList;
    results.list.data.supportSvg = req.headers['user-agent'] ? ['IE9', 'IE8', 'IE7', 'IE6'].indexOf(util.browserVersion(req.headers['user-agent'])) === -1 : false;
    results.list.data.svgFlag = !!(svgPathList && svgPathList.length > 0);
    results.crumbList.data.isGetClassType = fileInfo.isGetClassType || 0;
    getInitPage(req, results);
    results.showFlag = true;
    results.isDetailRender = true;
    
    render("detail/index", results, req, res);
    // if (results.list.data && results.list.data.abTest) {
    //     render("detail/index", results, req, res);
    // } else {
    //     render("detail/index", results, req, res);
    // }
}

// 初始页数 计算页数,去缓存
function getInitPage(req, results) {
    let filePreview = results.filePreview;
    if (filePreview) {
        if (results.list.data.state === 3) {   // 1:免费文档 2:下载券文档 3:付费文档 4:仅供在线阅读 5:VIP免费文档 6:VIP特权文档
            let content = results.list.data.url || results.list.data.contentPathList[0];  //  contentPathList 存储文件所有内容（不超过50页）；Array的每个值代表一个结果
            let bytes = filePreview.data.pinfo.bytes || {}; // bytes 转码预览html文本md5
            let newImgUrl = [];
            for (var key in bytes) {
                var page = bytes[key];
                var param = page[0] + '-' + page[1];
                var newUrl = changeURLPar(content, 'range', param);
                newImgUrl.push(newUrl);
            }
            results.list.data.contentPathList = newImgUrl;
        }
        // 接口限制可预览页数
        if (!results.filePreview.data) {
            results.filePreview.data = {}
        }
        let contentPathList = results.list.data && results.list.data.contentPathList
        let preRead = results.filePreview.data.preRead = results.list.data.preRead

        if (!preRead) {
            preRead = results.filePreview.data.preRead = 50;
        }
        // 页面默认初始渲染页数

        let initReadPage = Math.min(contentPathList.length, preRead, 4);
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