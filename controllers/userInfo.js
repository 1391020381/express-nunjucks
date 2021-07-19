/**
 * @Description: 404
 */
const async = require('async');
const render = require('../common/render');
const request = require('request');
const server = require('../models/index');
const api = require('../api/api');
const appConfig = require('../config/app-config');
const moment = require('moment');
const util = require('../common/util');
const { file } = require('../api/api');

module.exports = {
    index: function (req, res) {
        return async.series({
            userInfo: function (callback) {
                //    console.log('req.cookies:',req.cookies)
                // console.log('appConfig.site', appConfig.site);
                const opt = {
                    method: 'GET',
                    url: appConfig.apiNewBaselPath + api.user.getUserInfo,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authrization': req.cookies.cuk,
                        'site': appConfig.site
                    }
                };
                request(opt, (err, res1, body) => {
                    if (body) {
                        const data = JSON.parse(body);
                        console.log('请求地址get-------------------:', opt.url);
                        // console.log('请求地址headers-------------------:', opt.headers);
                        console.log('返回code------:' + data.code, '返回message-------:' + data.message);
                        if (data.code == 0 && data.data) {
                            callback(null, data);
                        } else {
                            callback(null, null);
                        }
                    } else {
                        callback(null, null);
                    }
                });
            },
            rightsVipMemberDetail: function (callback) {
                const opt = {
                    method: 'POST',
                    url: appConfig.apiNewBaselPath + api.coupon.getVipAllMemberDetail,
                    body: JSON.stringify({
                        memberCodeList: ['PREVILEGE_NUM', 'PAY_DISCOUNT'],
                        siteList:[appConfig.site]
                    }),
                    headers: {
                        'Content-Type': 'application/json',
                        'Authrization': req.cookies.cuk
                    }
                };
                request(opt, (err, res1, body) => {
                    if (body) {
                        const data = JSON.parse(body);
                        console.log('请求地址post-------------------:', opt.url);
                        console.log('请求参数-------------------:', opt.body);
                        console.log('返回code------:' + data.code, '返回message-------:' + data.message);
                        if (data.code == 0 && data.data) {
                            callback(null, data);
                        } else {
                            callback(null, null);
                        }
                    } else {
                        callback(null, null);
                    }
                });
            }
        }, (err, results) => {
            // console.log('userInfo-results:-------------:', results)
            let userInfo = {};
            let rightsVipMemberDetail = {};
            let userInfoCode = '0';
            let rightsVipMemberDetailCode = '0';

            let masterRightsVipMemberDetail = {};

            let officeRightsVipMemberDetail = {};

            if (results.userInfo && results.userInfo.code == '0') {
                userInfo = results.userInfo && results.userInfo.data;
            } else {
                userInfoCode = results.userInfo && results.userInfo.code;
            }

            if (results.rightsVipMemberDetail && results.rightsVipMemberDetail.code == '0') { // 在前端页面
                //  console.log('rightsVipMemberDetail:',results.rightsVipMemberDetail)

                results.rightsVipMemberDetail && results.rightsVipMemberDetail.data.forEach(item => { // site 使用范围 0-办公,1-教育,2-建筑,3-超级会员,4-主站       fileDiscount   PAY_DISCOUNT的特权
                    if (item.site == '4') { // 主站
                        let fileDiscount = '';
                        let expireTime = '';
                        expireTime = item.endDate ? moment(item.endDate).format('YYYY-MM-DD') : '';

                        if (item.memberPointList) {
                            item.memberPointList.forEach(memberPoint => {
                                if (memberPoint.code == 'PAY_DISCOUNT') { // 折扣
                                    fileDiscount = memberPoint.value;
                                }

                            });
                        }
                        masterRightsVipMemberDetail = Object.assign({}, item, { fileDiscount: fileDiscount, isMasterVip: item.vipStatus, isVip: item.vipStatus, expireTime: expireTime });
                    }
                    if (item.site == '0') { // 办公
                        let fileDiscount = '';
                        let expireTime = '';
                        expireTime = item.endDate ? moment(item.endDate).format('YYYY-MM-DD') : '';

                        if (item.memberPointList) {
                            item.memberPointList.forEach(memberPoint => {
                                if (memberPoint.code == 'PAY_DISCOUNT') { // 折扣
                                    fileDiscount = memberPoint.value;

                                }

                            });
                        }

                        officeRightsVipMemberDetail = Object.assign({}, item, { fileDiscount: fileDiscount, isVip: item.vipStatus, expireTime: expireTime });
                    }
                });
                // var fileDiscount = results.rightsVipMemberDetail.data.memberPoint&&results.rightsVipMemberDetail.data.memberPoint.value,
                // rightsVipMemberDetail = Object.assign({},results.rightsVipMemberDetail.data,{isVip:results.rightsVipMemberDetail.data.vipStatus,expireTime: results.rightsVipMemberDetail.data.endDate?moment(results.rightsVipMemberDetail.data.endDate).format('YYYY-MM-DD'):'',fileDiscount:fileDiscount})


                rightsVipMemberDetail = Object.assign({}, masterRightsVipMemberDetail, { isOfficeVip: officeRightsVipMemberDetail.isVip, officeVipExpireTime: officeRightsVipMemberDetail.expireTime });
            } else {
                rightsVipMemberDetailCode = results.rightsVipMemberDetail && results.rightsVipMemberDetail.code;
            }

            const code = userInfoCode == 0 && rightsVipMemberDetailCode == 0 ? '0' : 1;
            // console.log('userInfo:',JSON.stringify(userInfo),'rightsVipMemberDetail:',JSON.stringify(rightsVipMemberDetail))

            const data = Object.assign({}, userInfo, rightsVipMemberDetail);
            res.json(Object.assign({}, results, { data: data, code: code }));
        });
    }
};
