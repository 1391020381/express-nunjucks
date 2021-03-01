/**
 * 个人中心
 */

const render = require("../common/render");
const cc = require('../common/cc')
const appConfig = require("../config/app-config");
const api = require("../api/api");
const server = require("../models/index");

function getUserCentreInfo(req, res) {
    const url = appConfig.apiNewBaselPath + api.user.getUserCentreInfo + "?scope=4";
    return server.$http(url, 'get', req, res, true);
}

function getRightsVipMemberDetail(req, res) {
    req.body = {
        memberCodeList: ['PREVILEGE_NUM', 'PAY_DISCOUNT']
    }
    return server.$http(appConfig.apiNewBaselPath + api.coupon.getVipAllMemberDetail, 'post', req, res, true)
}

function userWxAuthState(req, res) {
    let url = appConfig.apiNewBaselPath + api.user.userWxAuthState
    return server.$http(url, 'get', req, res, true)
}

function getOtherUserInfo(req, res) {
    const url = appConfig.apiNewBaselPath + api.user.getOtherUser + '?uid=' + req.params.uid;
    return server.$http(url, 'get', req, res, true);
}

/**
 * 获取热门最新资料列表
 * @param current {number} 当前分页
 * @param sortField {string} 排序方式  downNum热门 createTime最新
 * @param format {string} 格式
 * */ 
function fetchHotRecommList(req, res) {
    const current = req.query.page || 1;
    const sortField = req.query.sort || 'downNum';
    const format = req.query.format || '';
    const uid = req.params.uid;
    req.body = {
        currentPage: current,
        pageSize: 40,
        sortField: sortField,   
        format: format,
        uid: uid
    };
    return server.$http(appConfig.apiNewBaselPath + api.user.getSearchList, 'post', req, res, true);
}

const renderPersonalCenter = async (req, res) => {
    let cuk = req.cookies.cuk
    let results = {
        type: req.query.type || 'home',
        myuploadType: req.query.myuploadType,
        vipTableType: req.query.vipTableType,
        myorderType: req.query.myorderType || '1',
        mycouponType: req.query.mycouponType,
        mywalletType: req.query.mywalletType || '1',
        noPersonalCenter: true,
        userInfo: {}
    }
    if (cuk) {
        results.userInfo = await getUserCentreInfo(req, res)
        let rightsVipMemberDetail = await getRightsVipMemberDetail(req, res)
        let userWxAuthStateResult = await userWxAuthState(req, res)
        results.isWxAuth = userWxAuthStateResult.data.isWxAuth
        results.isMasterVip = 0
        results.isOfficeVip = 0
        rightsVipMemberDetail.data.forEach(item => {  // site 使用范围 0-办公,1-教育,2-建筑,3-超级会员,4-主站       fileDiscount   PAY_DISCOUNT的特权
            if (item.site == '4') {  // 主站
                results.isMasterVip = item.vipStatus
            }
            if (item.site == '0') {   // 办公
                results.isOfficeVip = item.vipStatus
            }
        })
    }
    render("personalCenter/index", results, req, res);
};

// 返回他人主页页面信息
const renderUserPage = async (req, res) => {
    // 格式枚举
    let formatEnum = {
        'doc': 'DOC',
        'ppt': 'PPT',
        'pdf': 'PDF',
        'xls': 'XLS',
        'txt': 'TXT'
    };
    
    let nickName = '';
    let curQuery = '';
    // 用户信息
    let userData = {};
    let tableData = [];
    let totalPages = [];

    let sortField = req.query.sort;
    let format = req.query.format || '';

    if (sortField && format) {
        curQuery = '?sort=' + sortField + '&format=' + format + '&page='; 
    } else if (!sortField && format) {
        curQuery = '?format=' + format + '&page='; 
    } else if (sortField && !format) {
        curQuery = '?sort=' + sortField + '&page=';
    } else {
        curQuery = '?page=';
    }

    try {
        let otherUserInfo = await getOtherUserInfo(req, res);
        let searchData = await fetchHotRecommList(req, res);
        // 处理个人信息
        if (otherUserInfo && otherUserInfo.code == 0) {
            userData = {...otherUserInfo.data};
            nickName = userData ? userData.nickName : '';
        }
        // 处理列表信息
        if (searchData && searchData.code == 0) {
            tableData = searchData.data && searchData.data.rows ? searchData.data.rows : [];
            let totalPageNum = searchData.data.totalPages > 40 ? 40 : searchData.data.totalPages;
            for (var i = 0; i < totalPageNum; i++) {
                totalPages.push(i)
            } 
        }
    } catch (e) {
        console.log(JSON.stringify(e));
    }
    render("personalCenter/userPage", {
        uid: req.params.uid,
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
        currentUrl: curQuery,
        currentPage: req.query.page || 1,
        sortField: req.query.sort || 'downNum',
        formatName: formatEnum[format] || '格式'
    }, req, res);
}

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
        render("personalCenter/redirectionURL", {}, req, res);
    },
    userPage: cc(renderUserPage),
};