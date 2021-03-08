/**
 * 个人中心
 */

const render = require('../common/render');
const cc = require('../common/cc');
const appConfig = require('../config/app-config');
const api = require('../api/api');
const server = require('../models/index');

function getUserCentreInfo(req, res) {
    const url = appConfig.apiNewBaselPath + api.user.getUserCentreInfo + '?scope=4';
    return server.$http(url, 'get', req, res, true);
}

function getRightsVipMemberDetail(req, res) {
    req.body = {
        memberCodeList: ['PREVILEGE_NUM', 'PAY_DISCOUNT']
    };
    return server.$http(appConfig.apiNewBaselPath + api.coupon.getVipAllMemberDetail, 'post', req, res, true);
}

function userWxAuthState(req, res) {
    const url = appConfig.apiNewBaselPath + api.user.userWxAuthState;
    return server.$http(url, 'get', req, res, true);
}

function getOtherUserInfo(req, res) {
    const uid = req.params.uid;
    const uids = uid ? uid.split('_') : [];
    const userId = uids[0] ? uids[0] : '';
    const url = appConfig.apiNewBaselPath + api.user.getOtherUser + '?uid=' + userId;
    return server.$http(url, 'get', req, res, true);
}

/**
 * 获取热门最新资料列表
 * @param current {number} 当前分页
 * @param sortField {string} 排序方式  downNum热门 createTime最新
 * @param format {string} 格式
 * */
function fetchHotRecommList(req, res) {
    // 解析uid,分解参数
    const uid = req.params.uid;
    const uids = uid ? uid.split('_') : [];
    const userId = uids[0] ? uids[0] : '';
    const sortField = uids[1] ? uids[1] : 'downNum';
    const format = uids[2] ? uids[2] : 'all';
    const currentPage = uids[3] ? uids[3] : 1;
    console.log('打印当前的请求参数：', userId, JSON.stringify(uids));
    req.body = {
        currentPage: currentPage,
        pageSize: 40,
        sortField: sortField,
        format: format == 'all' ? '' : format,
        uid: userId
    };
    return server.$http(appConfig.apiNewBaselPath + api.user.getSearchList, 'post', req, res, true);
}

const renderPersonalCenter = async (req, res) => {
    const cuk = req.cookies.cuk;
    const results = {
        type: req.query.type || 'home',
        myuploadType: req.query.myuploadType,
        vipTableType: req.query.vipTableType,
        myorderType: req.query.myorderType || '1',
        mycouponType: req.query.mycouponType,
        mywalletType: req.query.mywalletType || '1',
        noPersonalCenter: true,
        userInfo: {}
    };
    if (cuk) {
        results.userInfo = await getUserCentreInfo(req, res);
        const rightsVipMemberDetail = await getRightsVipMemberDetail(req, res);
        const userWxAuthStateResult = await userWxAuthState(req, res);
        results.isWxAuth = userWxAuthStateResult.data.isWxAuth;
        results.isMasterVip = 0;
        results.isOfficeVip = 0;
        rightsVipMemberDetail.data.forEach(item => { // site 使用范围 0-办公,1-教育,2-建筑,3-超级会员,4-主站       fileDiscount   PAY_DISCOUNT的特权
            if (item.site == '4') { // 主站
                results.isMasterVip = item.vipStatus;
            }
            if (item.site == '0') { // 办公
                results.isOfficeVip = item.vipStatus;
            }
        });
    }
    render('personalCenter/index', results, req, res);
};

// 返回他人主页页面信息
const renderUserPage = async (req, res) => {
    // 格式枚举
    const formatEnum = {
        'doc': 'DOC',
        'ppt': 'PPT',
        'pdf': 'PDF',
        'xls': 'XLS',
        'txt': 'TXT'
    };

    let nickName = '';
    // 用户信息
    let userData = {};
    let tableData = [];
    const totalPages = [];

    const uid = req.params.uid;
    // 解析uid,分解参数
    const uids = uid ? uid.split('_') : [];
    const userId = uids[0] ? uids[0] : '';
    const sortField = uids[1] ? uids[1] : 'downNum';
    const format = uids[2] ? uids[2] : 'all';
    const currentPage = uids[3] ? uids[3] : 1;
    const currentUrl = `/u/${userId}_${sortField}_${format}_`;
    try {
        const otherUserInfo = await getOtherUserInfo(req, res);
        const searchData = await fetchHotRecommList(req, res);
        console.log('当前的搜索数据：', JSON.stringify(searchData));
        // 处理个人信息
        if (otherUserInfo && otherUserInfo.code == 0) {
            userData = {...otherUserInfo.data};
            nickName = userData ? userData.nickName : '';
        }
        // 处理列表信息
        if (searchData && searchData.code == 0) {
            tableData = searchData.data && searchData.data.rows ? searchData.data.rows : [];
            const totalPageNum = searchData.data.totalPages > 40 ? 40 : searchData.data.totalPages;
            for (let i = 0; i < totalPageNum; i++) {
                totalPages.push(i);
            }
        }
    } catch (e) {
        console.log(JSON.stringify(e));
    }
    render('personalCenter/userPage', {
        uid: userId,
        list: {
            data: {
                tdk: {
                    title: nickName + '分享的资料 - 爱问共享资料',
                    description: ' ',
                    keywords: ' '
                }
            },
            rows: [...tableData],
            totalPages: [...totalPages]
        },
        userData: {
            photoPicURL: userData.photoPicURL,
            userTypeName: userData.userTypeId == 1 ? '普通' : userData.userTypeId == 2 ? '个人' : '机构',
            description: userData.cfcDescribe ? userData.cfcDescribe : '暂无简介',
            isMasterVip: userData.isVip && userData.vipSiteList.indexOf(4) >= 0,
            isOfficeVip: userData.isVip && userData.vipSiteList.indexOf(0) >= 0,
            readSum: userData.readSum > 10000 ? (userData.readSum / 10000).toFixed(1) + 'w+' : userData.readSum,
            downSum: userData.downSum > 10000 ? (userData.downSum / 10000).toFixed(1) + 'w+' : userData.downSum,
            fileSize: userData.fileSize > 10000 ? (userData.fileSize / 10000).toFixed(1) + 'w+' : userData.fileSize
        },
        format: format,
        currentUrl: currentUrl,
        currentPage: currentPage,
        sortField: sortField,
        formatName: formatEnum[format] || '格式'
    }, req, res);
};

module.exports = {
    home: cc(renderPersonalCenter),
    mydownloads: cc(renderPersonalCenter),
    mycollection: cc(renderPersonalCenter),
    myuploads: cc(renderPersonalCenter),
    vip: cc(renderPersonalCenter),
    myorder: cc(renderPersonalCenter),
    mycoupon: cc(renderPersonalCenter),
    accountsecurity: cc(renderPersonalCenter),
    personalinformation: cc(renderPersonalCenter),
    mywallet: cc(renderPersonalCenter),
    redirectionURL: function (req, res) {
        render('personalCenter/redirectionURL', {}, req, res);
    },
    oldUserPage: function(req, res) {
        if (req.query.uid) {
            res.redirect(`/u/${req.query.uid}/`);
        } else {
            res.redirect('/u/');
        }
    },
    userPage: cc(renderUserPage)
};