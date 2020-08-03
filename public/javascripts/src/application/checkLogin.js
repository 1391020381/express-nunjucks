/**
 * 登录相关
 */
define(function (require, exports, module) {
    //var $ = require("$");
    var api = require('./api');
    var method = require("./method");
    var api = require("./api");
    var showLoginDialog = require('./login').showLoginDialog
    
    var  handleBaiduStatisticsPush = require('../common/baidu-statistics.js').handleBaiduStatisticsPush
    var loginResult = require('../common/bilog').loginResult
    module.exports = {
        getIds: function () {
            // 详情页
            var params = window.pageConfig && window.pageConfig.params ? window.pageConfig.params : null;
            var access = window.pageConfig && window.pageConfig.access ? window.pageConfig.access : null;
            
            var classArr = []
            if (params) {
                params.classid1 && classArr.push(params.classid1)
                params.classid2 && classArr.push(params.classid2)
                params.classid3 && classArr.push(params.classid3)
            }
            var clsId = params ? (classArr.length > 0 ? classArr.join('-') : '') : '';

            var fid = access ? (access.fileId || params.g_fileId || '') : '';

            // 类目页
            var classIds = window.pageConfig && window.pageConfig.classIds ? window.pageConfig.classIds : '';
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
                // __pc__.push(['pcTrackContent', 'loginDialogLoad']);
                var ptype = window.pageConfig && window.pageConfig.page ? (window.pageConfig.page.ptype || 'index') : 'index';
                var clsId = this.getIds().clsId
                var fid  = this.getIds().fid
                showLoginDialog({clsId:clsId,fid:fid},function(){
                    console.log('loginCallback')
                    _self.getLoginData(callback)
                })
             
                // $.loginPop('login', { 
                //     "terminal": "PC", 
                //     "businessSys": "ishare", 
                //     "domain": document.domain, 
                //     "ptype": ptype,
                //     "clsId": this.getIds().clsId,
                //     "fid": this.getIds().fid
                // }, function (data) {
                //     // 透传
                //     // method.get(api.user.getJessionId, function (res) {
                //     _self.getLoginData(callback);
                //     // }, '');
                // });
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
                // method.get(api.user.getJessionId, function (res) {
                // if (res.code == 0) {
                _self.getLoginData(callback);
                // }
                // }, '');
            })
        },
        /**
         * description  唤醒校验界面
         */
        notifyCheckInterface: function () {
            if (method.getCookie('cuk')) {
                $.loginPop('checkCode', { 
                    "terminal": "PC", 
                    "businessSys": "ishare", 
                    "domain": document.domain,
                    "clsId": this.getIds().clsId,
                    "fid": this.getIds().fid
                }, function (data) {
                    if (data.code == '0') {
                        method.get(api.user.getJessionId, function (res) { }, '');
                    }
                });
            }
        },
        /**
         * description  免登录透传用户信息
         * @param callback 回调函数
         */
        syncUserInfoInterface: function (callback) {
            var _self = this;
            if (method.getCookie('cuk')) {
                method.get(api.user.getJessionId, function (res) {
                    if (res.code == 0) {
                        _self.getLoginData(callback);
                    }
                }, '');
            }
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
        getLoginData: function (callback) {
            var _self = this;
            try{
                method.get('/node/api/getUserInfo', function (res) { // api.user.login
                    if (res.code == 0 && res.data) {
                        loginResult('','loginResult',{loginType:window.loginType&&window.loginType.type,phone:res.data.mobile,userid: res.data.userId,loginResult:"1"})
                        handleBaiduStatisticsPush('loginResult',{loginType:window.loginType&&window.loginType.type,phone:res.data.mobile,userid: res.data.userId,loginResult:"1"})
                        if (callback && typeof callback == "function") {
                            callback(res.data);
                            try {
                                window.pageConfig.params.isVip = res.data.isVip;
                                window.pageConfig.page.uid = res.data.userId;
                                // console.log(res.data);
                                // method.setCookieWithExpPath("uid", res.data.userId, 30 * 60 * 1000, "/");
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
                       
                    } else  {
                        loginResult('','loginResult',{loginType:window.loginType&&window.loginType.type,phone:'',userid: '',loginResult:"0"})
                        handleBaiduStatisticsPush('loginResult',{loginType:window.loginType&&window.loginType.type,phone:'',userid: res.data.userId,loginResult:"0"})
                        _self.ishareLogout();
                    }

                });
            }catch(e){
                console.log(e)
            }
  
        },
        /**
         * 退出
         */
        ishareLogout: function () {
            //删域名cookie
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
            //删除第一次登录标识
            method.delCookie("_1st_l", "/");
            method.delCookie("ui", "/");
            // $.post("/logout", function () {
            //     window.location.href = window.location.href;
            // });
            $.get(api.user.loginOut, function (res) {
                console.log('loginOut:',res)
                if(res.code == 0){
                    window.location.href = window.location.href;
                }
            });
        }
    }

});