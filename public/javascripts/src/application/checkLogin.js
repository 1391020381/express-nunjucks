/**
 * 登录相关
 */
define(function (require, exports, module) {

    var api = require('./api');
    var method = require("./method");
    var api = require("./api");
    var showLoginDialog = require('./login').showLoginDialog
    require('../common/baidu-statistics.js').initBaiduStatistics('17cdd3f409f282dc0eeb3785fcf78a66')
    var handleBaiduStatisticsPush = require('../common/baidu-statistics.js').handleBaiduStatisticsPush
   
    module.exports = {
        getIds: function () {
            // 详情页
           
            var params = window.pageConfig && window.pageConfig.params ? window.pageConfig.params : null;
            var access = window.pageConfig && window.pageConfig.access ? window.pageConfig.access : null;

            var classArr = []
            var clsId = params ? params.classid : ''

            var fid = access ? (access.fileId || params.g_fileId || '') : '';

            // 类目页
            var classIds = params && params.classIds ? params.classIds : '';
            !clsId && (clsId = classIds)

            return {
                clsId: clsId,
                fid: fid
            }
        },
        /**
         * description  唤醒登录界面
         * @param callback 回调函数
         */
        notifyLoginInterface: function (callback) {
            var _self = this;
            if (!method.getCookie('cuk')) {

                var ptype = window.pageConfig && window.pageConfig.page ? (window.pageConfig.page.ptype || 'index') : 'index';
                var clsId = this.getIds().clsId
                var fid = this.getIds().fid
                showLoginDialog({clsId: clsId, fid: fid}, function () {
                    console.log('loginCallback')
                    _self.getLoginData(callback, 'isFirstLogin')
                })

            }
        },
        listenLoginStatus: function (callback) {
            var _self = this;
            $.loginPop('login_wx_code', {
                "terminal": "PC",
                "businessSys": "ishare",
                'domain': document.domain,
                "ptype": "ishare",
                "popup": "hidden",
                "clsId": this.getIds().clsId,
                "fid": this.getIds().fid
            }, function () {

                _self.getLoginData(callback);

            })
        },
        /**
         * description  优惠券提醒 查询用户发券资格-pc
         * @param callback 回调函数
         */
        getUserData: function (callback) {
            if (method.getCookie('cuk')) {
                method.get(api.coupon.querySeniority, function (res) {
                    if (res && res.code == 0) {
                        callback(res.data)
                    }
                }, '');
            }
        },
        /**
         * 获取用户信息
         * @param callback 回调函数
         */
        getLoginData: function (callback, isFirstLogin) {
            var _self = this;
            try {
                method.get('/node/api/getUserInfo', function (res) { // api.user.login
                    if (res.code == 0 && res.data) {
                        if (isFirstLogin) {
                           
                            handleBaiduStatisticsPush('loginResult', {
                                loginType: window.loginType && window.loginType.type,
                                phone: res.data.mobile,
                                userid: res.data.userId,
                                loginResult: "1"
                            })
                            iask_web.login(res.data.userId)
                            iask_web.track_event('SE001', "loginResult", 'query', {
                                loginResult:'1',
                                failMsg:'',
                                loginType: res.formData
                            });
                            window.location.reload();
                        }
                        if (callback && typeof callback == "function") {
                           
                            callback(res.data);
                            try {
                                window.pageConfig.params.isVip = res.data.isVip;
                                window.pageConfig.page.uid = res.data.userId;

                            } catch (err) { }
                        }

                        try {
                            var userInfo = {
                                uid: res.data.userId,
                                isVip: res.data.isVip,
                                tel: res.data.mobile
                            }
                            method.setCookieWithExpPath("ui", JSON.stringify(userInfo), 30 * 60 * 1000, "/");
                        } catch (e) {
                        }

                    } else {
                        
                        handleBaiduStatisticsPush('loginResult', {
                            loginType: window.loginType && window.loginType.type,
                            phone: '',
                            userid: res.data.userId,
                            loginResult: "0"
                        })
                        _self.ishareLogout();
                    }

                });
            } catch (e) {
                console.log(e)
            }

        },
        /**
         * 退出
         */
        ishareLogout: function () {
            var that = this;
            $.ajax({
                url: api.user.loginOut,
                type: "GET",
                headers: {
                    'cache-control': 'no-cache',
                    'Pragma': 'no-cache',
                    'jsId': method.getLoginSessionId()
                },
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                cache: false,
                data: null,
                success: function (res) {
                    console.log('loginOut:', res)
                    if (res.code == 0) {
                        iask_web.logout()
                        window.location.reload();
                    } else {
                        $.toast({
                            text: res.message,
                            delay: 3000,
                        })
                    }
                }
            })
            // 删域名cookie
            method.delCookie("cuk", "/", ".sina.com.cn");
            method.delCookie("cuk", "/", ".iask.com.cn");
            method.delCookie("cuk", "/", ".iask.com");
            method.delCookie("cuk", "/");

            method.delCookie("sid", "/", ".iask.sina.com.cn");
            method.delCookie("sid", "/", ".iask.com.cn");
            method.delCookie("sid", "/", ".sina.com.cn");
            method.delCookie("sid", "/", ".ishare.iask.com.cn");
            method.delCookie("sid", "/", ".office.iask.com");

            method.delCookie("sid_ishare", "/", ".iask.sina.com.cn");
            method.delCookie("sid_ishare", "/", ".iask.com.cn");
            method.delCookie("sid_ishare", "/", ".sina.com.cn");
            method.delCookie("sid_ishare", "/", ".ishare.iask.com.cn");
            // 删除第一次登录标识
            method.delCookie("_1st_l", "/");
            method.delCookie("ui", "/");
        }
    }

});