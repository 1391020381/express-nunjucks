/**
 * @Description: 详情页
 */

const render = require('../common/render');
const server = require('../models/index');
const util = require('../common/util');
const cc = require('../common/cc');
const recommendConfigInfo = require('../common/recommendConfigInfo');
const Api = require('../api/api');
const appConfig = require('../config/app-config');

const defaultResultsData = { list: { data: { svgFlag: true, supportSvg: true, contentPathList: [], svgPathList: [], isDownload: 'no' } } }; // 确保私有 删除  404 显示用户信息 用户可以登录

const renderPage = cc(async (req, res) => {

    const userID = req.cookies.userId || req.cookies.visitor_id || Math.random().toString().slice(-15); // 标注用户的ID

    const redirectUrl = await getRedirectUrl(req, res);

    if (redirectUrl.data) {
        if (redirectUrl.data.targetLink) {
            const url = redirectUrl.data.type == 1 ? req.protocol + '://' + redirectUrl.data.targetLink : req.protocol + '://' + req.hostname + '/f/' + redirectUrl.data.targetLink + '.html';
            res.redirect(301, url);
        }
    }
    const list = await getList(req, res);

    if (list.code == 'G-404') { // 文件不存在
        const results = Object.assign({}, defaultResultsData, { showFlag: false, statusCode: '404', isDetailRender: true });
        res.status(404);
        render('detail/index', results, req, res);
        return;
    }

    if (list.data) {
        const uid = req.cookies.ui ? JSON.parse(req.cookies.ui).uid : '';
        const cuk = req.cookies.cuk;
        const data = list.data;
        const fileInfo = data.fileInfo;
        if (fileInfo.site == 0) {
            // 跳转到办公携带参数修改
            const officeParams = 'utm_source=ishare&utm_medium=ishare&utm_content=ishare&utm_campaign=ishare&utm_term=ishare';
            res.redirect(301, `https://office.iask.com/f/${fileInfo.id}.html?` + officeParams);
            return;
        }
        if (fileInfo.showflag !== 'y') { // 文件删除
            const searchQuery = `?ft=all&cond=${encodeURIComponent(encodeURIComponent(fileInfo.title))}`;
            const results = Object.assign({}, { showFlag: false, searchQuery, statusCode: '404', isDetailRender: true }, defaultResultsData);
            res.status(404);
            render('detail/index', results, req, res);
            return;
        }
        if (fileInfo.productType == 6) {
            if (cuk && fileInfo.uid && fileInfo.uid == uid) {

            } else {
                const searchQuery = `?ft=all&cond=${encodeURIComponent(encodeURIComponent(fileInfo.title))}`;
                const results = Object.assign({}, { showFlag: false, searchQuery, isPrivate: true, statusCode: '302', isDetailRender: true }, defaultResultsData);
                res.status(302);
                render('detail/index', results, req, res);
                return;
            }
        }
        // 【A20如果该文件是txt格式】
        if (fileInfo.format.toLowerCase() === 'txt') {
            const txtContentList = await fetchTxtContentList(data.transcodeInfo.contentPathList);
            list.data.transcodeInfo.contentPathList = [...txtContentList];
        }
    }

    const topBannerList = await getTopBannerList(req, res);
    const searchBannerList = await getSearchBannerList(req, res);
    const bannerList = await getBannerList(req, res, list);
    const rightTopBanner = await getRightBannerList(req, res);
    console.log('rightTopBanner:', JSON.stringify(rightTopBanner));
    const crumbList = await getCrumbList(req, res, list);
    const cateList = await getCategoryList(req, res);

    const filePreview = {};

    handleDetalData({ req, res, redirectUrl, list, topBannerList, searchBannerList, bannerList, cateList, filePreview, crumbList, userID, rightTopBanner });
});


module.exports = {
    render: renderPage
};

function getRedirectUrl(req, res) {
    req.body = {
        sourceLink: req.protocol + '://' + req.hostname + req.url
    };
    return server.$http(appConfig.apiNewBaselPath + Api.file.redirectUrl, 'post', req, res, true);
}

function getList(req, res) {
    req.body = {
        clientType: 0,
        fid: req.params.id,
        sourceType: 0,
        site: 4
    };
    return server.$http(appConfig.apiNewBaselPath + Api.file.getFileDetailNoTdk, 'post', req, res, true);
}

function getTopBannerList(req, res) {
    req.body = recommendConfigInfo.details.topBanner.pageId;
    return server.$http(appConfig.apiNewBaselPath + Api.recommendConfigInfo, 'post', req, res, true);
}

function getRightBannerList(req, res) {
    req.body = recommendConfigInfo.details.rightToBanner.pageId;
    return server.$http(appConfig.apiNewBaselPath + Api.recommendConfigInfo, 'post', req, res, true);
}

function getSearchBannerList(req, res) {
    req.body = recommendConfigInfo.details.searchBanner.pageId;
    return server.$http(appConfig.apiNewBaselPath + Api.recommendConfigInfo, 'post', req, res, true);
}

function getBannerList(req, res, list) {
    const format = list.data.fileInfo.format;
    const classid1 = list.data.fileInfo.classid1;
    const classid2 = list.data.fileInfo.classid2;
    req.body = dealParam(format, classid1, classid2);
    return server.$http(appConfig.apiNewBaselPath + Api.recommendConfigRuleInfo, 'post', req, res, true);
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
    return server.$http(appConfig.apiNewBaselPath + Api.index.navList, 'post', req, res, true);
}

function getFilePreview(req, res, list) {
    const validateIE9 = req.headers['user-agent'] ? ['IE9', 'IE8', 'IE7', 'IE6'].indexOf(util.browserVersion(req.headers['user-agent'])) === -1 ? 0 : 1 : 0;
    req.body = {
        fid: list.data.fileInfo.id,
        validateIE9: validateIE9,
        site: 4
    };
    return server.$http(appConfig.apiNewBaselPath + Api.file.preReadPageLimit, 'post', req, res, true);
}

// 获取txt列表
function fetchTxtContentList(contentPathList) {
    if (contentPathList.length) {
        const promiseList = contentPathList.map(item => {
            return fetchContentForTxt(item);
        });
        return new Promise((resolve) => {
            Promise.all(promiseList).then(resArr => {
                resolve(resArr);
            }).catch(() => {
                console.log('获取txt数据出错！');
                resolve([]);
            });
        });
    }
}

// 获取txt数据
function fetchContentForTxt(txtPath) {
    return server.$httpTxt(txtPath);
}


function handleDetalData({ req, res, redirectUrl, list, topBannerList, searchBannerList, bannerList, cateList, recommendInfo, filePreview, crumbList, userID, rightTopBanner}) {

    if (topBannerList.data) {
        if (req.cookies.isHideDetailTopbanner) {
            topBannerList = [];
        } else {
            topBannerList = util.handleRecommendData(topBannerList.data[0] && topBannerList.data[0].list || []);
        }
    }
    if (searchBannerList.data) {
        searchBannerList = util.handleRecommendData(searchBannerList.data[0] && searchBannerList.data[0].list || []);
    }
    if(rightTopBanner&&rightTopBanner.data){
        const tempList = util.handleRecommendData(rightTopBanner.data[0]&&rightTopBanner.data[0].list||[]);
        const classId = list.data.fileInfo.classid;
        rightTopBanner = {list:[]};
        tempList.list.forEach(item => {
            if(item.copywriting1.indexOf(classId)>-1){
                rightTopBanner.list.push(item);
            }
        });
    }
    if (bannerList.data) {
        const detailBannerList = {
            'rightBottomBanner': [],
            'titleBottomBanner': [],
            'turnPageOneBanner': [],
            'turnPageTwoBanner': []
        };
        bannerList.data.forEach(item => {
            detailBannerList[item.id] = util.handleRecommendData(item.fileRecommend && item.fileRecommend.list || []);
        });
    }

    const fileInfo = list.data.fileInfo;
    fileInfo.readTimes = Math.ceil((fileInfo.praiseNum + fileInfo.collectNum) * 1.9);
    list = Object.assign({}, { data: Object.assign({}, list.data.fileInfo, list.data.transcodeInfo) });

    if (!list.data.contentPathList) {
        list.data.contentPathList = [];
        list.data.isConvert = 0;
    }
    if (!list.data.svgPathList) {
        list.data.svgPathList = [];
        list.data.isConvert = 0;
    }

    const results = Object.assign({}, {
        redirectUrl: redirectUrl,
        getTopBannerList: topBannerList,
        rightTopBanner:rightTopBanner,
        geSearchBannerList: searchBannerList,
        getBannerList: bannerList,
        crumbList,
        cateList: cateList.data && cateList.data.length ? cateList.data : [],
        recommendInfo,
        filePreview: {
            data: {}
        }
    }, { list: list });
    const svgPathList = results.list.data.svgPathList;
    results.list.data.supportSvg = req.headers['user-agent'] ? ['IE9', 'IE8', 'IE7', 'IE6'].indexOf(util.browserVersion(req.headers['user-agent'])) === -1 : false;
    results.list.data.svgFlag = Boolean(svgPathList && svgPathList.length > 0);
    if (results.list.data.supportSvg && results.list.data.svgFlag) {
        results.list.data.totalPage = results.list.data.svgPage;
    } else {
        results.list.data.totalPage = results.list.data.pngPage;
    }

    // 构造预读页数数据
    let initReadPage = Math.min(list.data.contentPathList.length, results.list.data.preRead, 4);
    // 360传递页数
    const pageFrom360 = req.query.page || 0;
    if (pageFrom360 > 0) {
        if (pageFrom360 < preRead) {
            initReadPage = pageFrom360;
        } else {
            initReadPage = results.list.data.preRead;
        }
        results.filePreview.data.is360page = true;
    } else {
        results.filePreview.data.is360page = false;
    }
    results.filePreview.data.preRead = results.list.data.preRead;
    results.filePreview.data.initReadPage = initReadPage;
    results.filePreview.data.status = 1;

    results.crumbList.data.isGetClassType = fileInfo.isGetClassType || 0;
    // getInitPage(req, results);
    results.showFlag = true;
    results.isDetailRender = true;

    console.log('返回的最新的预读页数：', JSON.stringify(results));

    render('detail/index', results, req, res);
    // if (results.list.data && results.list.data.abTest) {
    //     render("detail/index", results, req, res);
    // } else {
    //     render("detail/index", results, req, res);
    // }
}

// 初始页数 计算页数,去缓存
function getInitPage(req, results) {
    const filePreview = results.filePreview;
    if (filePreview) {
        if (results.list.data.state === 3) { // 1:免费文档 2:下载券文档 3:付费文档 4:仅供在线阅读 5:VIP免费文档 6:VIP特权文档
            const content = results.list.data.url || results.list.data.contentPathList[0]; //  contentPathList 存储文件所有内容（不超过50页）；Array的每个值代表一个结果
            const bytes = filePreview.data.pinfo.bytes || {}; // bytes 转码预览html文本md5
            const newImgUrl = [];
            for (const key in bytes) {
                const page = bytes[key];
                const param = page[0] + '-' + page[1];
                const newUrl = changeURLPar(content, 'range', param);
                newImgUrl.push(newUrl);
            }
            results.list.data.contentPathList = newImgUrl;
        }
        // 接口限制可预览页数
        if (!results.filePreview.data) {
            results.filePreview.data = {};
        }
        const contentPathList = results.list.data && results.list.data.contentPathList;
        let preRead = results.filePreview.data.preRead = results.list.data.preRead;

        if (!preRead) {
            preRead = results.filePreview.data.preRead = 50;
        }
        // 页面默认初始渲染页数

        let initReadPage = Math.min(contentPathList.length, preRead, 4);
        // 360传递页数
        const pageFrom360 = req.query.page || 0;
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
    const pattern = arg + '=([^&]*)';
    const replaceText = arg + '=' + arg_val;
    if (url.match(pattern)) {
        let tmp = '/(' + arg + '=)([^&]*)/gi';
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
function dealParam(format, classid1, classid2) {// 处理详情推荐位参数
    const defaultType = 'all';
    const params = [
        {
            id: 'rightBottomBanner',
            pageIds: [ //
                `PC_M_FD_${format}_${classid2}_rd`,
                `PC_M_FD_${format}_${classid1}_rd`,
                `PC_M_FD_${defaultType}_${classid2}_rd`,
                `PC_M_FD_${defaultType}_${classid1}_rd`
            ]
        },
        {
            id: 'titleBottomBanner',
            pageIds: [
                `PC_M_FD_${format}_${classid2}_ub`,
                `PC_M_FD_${format}_${classid1}_ub`,
                `PC_M_FD_${defaultType}_${classid2}_ub`,
                `PC_M_FD_${defaultType}_${classid1}_ub`
            ]
        },
        {
            id: 'turnPageOneBanner',
            pageIds: [
                `PC_M_FD_${format}_${classid2}_fy1b`,
                `PC_M_FD_${format}_${classid1}_fy1b`,
                `PC_M_FD_${defaultType}_${classid2}_fy1b`,
                `PC_M_FD_${defaultType}_${classid1}_fy1b`
            ]
        },
        {
            id: 'turnPageTwoBanner',
            pageIds: [
                `PC_M_FD_${format}_${classid2}_fy2b`,
                `PC_M_FD_${format}_${classid1}_fy2b`,
                `PC_M_FD_${defaultType}_${classid2}_fy2b`,
                `PC_M_FD_${defaultType}_${classid1}_fy2b`
            ]
        }
    ];
    return params;
}