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
    userPage: function (req, res) {
        render("personalCenter/userPage", {
            uid: req.params.uid
        }, req, res);
    },
};