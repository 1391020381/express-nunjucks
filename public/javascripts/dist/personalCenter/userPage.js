define("dist/personalCenter/userPage", [ "../application/method", "../application/api", "../application/checkLogin", "../application/login", "../cmd-lib/jqueryMd5", "../common/bilog", "base64", "../cmd-lib/util", "../report/config", "../cmd-lib/myDialog", "../cmd-lib/toast", "../common/bindphone", "../common/baidu-statistics", "../application/effect", "./template/userPage/index.html", "./template/userPage/rightList.html", "./template/userPage/userPageList.html" ], function(require, exports, module) {
    var method = require("../application/method");
    var api = require("../application/api");
    var login = require("../application/checkLogin");
    // require('./effect.js')
    var isLogin = require("../application/effect").isLogin;
    require("../cmd-lib/toast");
    var userInfo = {};
    var userData = "", currentPage = 1, sortField = "downNum", format = "";
    var isAutoLogin = false;
    var callback = null;
    isLogin(init, isAutoLogin);
    // init()
    function init(data) {
        userInfo = data;
        getOtherUser();
        $(document).on("click", ".js-page-item", function() {
            currentPage = $(this).attr("data-currentPage");
            hotList();
        });
        $(document).on("click", ".tab-item", function() {
            var self = $(this);
            currentPage = 1;
            $(".tab-item").removeClass("active");
            setTimeout(function() {
                self.addClass("active");
            }, 0);
            sortField = $(this).attr("type");
            hotList();
        });
        $(document).on("click", ".format-title", function() {
            $(".format-list").toggle();
            if ($(".format-title").find("i").hasClass("rotate")) {
                $(".format-title").find("i").removeClass("rotate");
            } else {
                $(this).find("i").addClass("rotate");
            }
        });
        $(document).on("click", ".format-list-item", function() {
            currentPage = 1;
            format = $(this).attr("format");
            hotList();
        });
    }
    function getOtherUser() {
        $.ajax({
            url: api.user.getOtherUser,
            type: "get",
            data: {
                uid: method.getQueryString("uid")
            },
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function(res) {
                if (res.code == "0") {
                    userData = res.data;
                    userData.readSum = userData.readSum > 1e4 ? (userData.readSum / 1e4).toFixed(1) + "w+" : userData.readSum;
                    userData.downSum = userData.downSum > 1e4 ? (userData.downSum / 1e4).toFixed(1) + "w+" : userData.downSum;
                    userData.fileSize = userData.fileSize > 1e4 ? (userData.fileSize / 1e4).toFixed(1) + "w+" : userData.fileSize;
                    var _html = template.compile(require("./template/userPage/index.html"))({
                        data: userData
                    });
                    $(".container").html(_html);
                    if (userInfo.isMasterVip !== 1) {
                        $(".personal-header .person-info-left .whole-station-vip").hide();
                    }
                    if (userInfo.isOfficeVip !== 1) {
                        $(".personal-header .person-info-left .office-vip").hide();
                    }
                    hotList();
                    recommend();
                } else {
                    $.toast({
                        text: res.msg,
                        delay: 3e3
                    });
                }
            }
        });
    }
    function recommend() {
        //推荐位 第四范式
        $.ajax({
            url: api.recommend.recommendConfigInfo,
            type: "post",
            data: JSON.stringify([ "Q_M_FD_hot_home" ]),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function(res) {
                if (res.code == "0") {
                    paradigm4Relevant(res.data);
                } else {
                    $.toast({
                        text: res.msg,
                        delay: 3e3
                    });
                }
            }
        });
    }
    function paradigm4Relevant(data) {
        var requestID_rele = Math.random().toString().slice(-10);
        var userID = method.getQueryString("uid").slice(0, 10) || "";
        //来标注用户的ID
        var sceneIDRelevant = data[0].useId;
        $.ajax({
            url: "https://nbrecsys.4paradigm.com/api/v0/recom/recall?requestID=" + requestID_rele + "&sceneID=" + sceneIDRelevant + "&userID=" + userID,
            type: "post",
            data: JSON.stringify({
                page: 0
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function(res) {
                var _html = template.compile(require("./template/userPage/rightList.html"))({
                    rightList: res
                });
                $(".hot-file ul").html(_html);
            }
        });
    }
    function hotList() {
        //热门 推荐    
        $.ajax({
            url: api.user.getSearchList,
            type: "post",
            data: JSON.stringify({
                currentPage: parseInt(currentPage),
                pageSize: 16,
                sortField: sortField,
                //createTime最新
                format: format,
                uid: method.getQueryString("uid")
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function(res) {
                if (res.code == "0") {
                    var arr = [];
                    for (var i = 0; i < res.data.totalPages; i++) {
                        arr.push(i);
                    }
                    res.data.totalPages = arr;
                    var _html = template.compile(require("./template/userPage/userPageList.html"))({
                        list: res.data,
                        currentPage: currentPage,
                        sortField: sortField
                    });
                    $(".personal-container .left").html(_html);
                } else {
                    $.toast({
                        text: res.msg,
                        delay: 3e3
                    });
                }
            }
        });
    }
});

define("dist/application/method", [], function(require, exports, module) {
    return {
        // 常量映射表
        keyMap: {
            // 访问详情页 localStorage
            ishare_detail_access: "ISHARE_DETAIL_ACCESS",
            ishare_office_detail_access: "ISHARE_OFFICE_DETAIL_ACCESS"
        },
        async: function(url, callback, msg, method, data) {
            $.ajax(url, {
                type: method || "post",
                data: data,
                async: false,
                dataType: "json",
                headers: {
                    "cache-control": "no-cache",
                    Pragma: "no-cache",
                    Authrization: this.getCookie("cuk")
                }
            }).done(function(data) {
                callback && callback(data);
            }).fail(function(e) {
                console.log("error===" + msg);
            });
        },
        get: function(u, c, m) {
            $.ajaxSetup({
                cache: false
            });
            this.async(u, c, m, "get");
        },
        post: function(u, c, m, g, d) {
            this.async(u, c, m, g, d);
        },
        postd: function(u, c, d) {
            this.async(u, c, false, false, d);
        },
        //随机数
        random: function(min, max) {
            return Math.floor(Math.random() * (max - min)) + min;
        },
        // 写cookie（过期时间）
        setCookieWithExpPath: function(name, value, timeOut, path) {
            var now = new Date();
            now.setTime(now.getTime() + timeOut);
            document.cookie = name + "=" + escape(value) + ";path=" + path + ";expires=" + now.toGMTString();
        },
        //提供360结算方法
        setCookieWithExp: function(name, value, timeOut, path) {
            var exp = new Date();
            exp.setTime(exp.getTime() + timeOut);
            if (path) {
                document.cookie = name + "=" + escape(value) + ";path=" + path + ";expires=" + exp.toGMTString();
            } else {
                document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
            }
        },
        //读 cookie
        getCookie: function(name) {
            var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
            if (arr !== null) {
                return unescape(arr[2]);
            }
            return null;
        },
        //删除cookie
        delCookie: function(name, path, domain) {
            var now = new Date();
            now.setTime(now.getTime() - 1);
            var cval = this.getCookie(name);
            if (cval != null) {
                if (path && domain) {
                    document.cookie = name + "= '' " + ";domain=" + domain + ";expires=" + now.toGMTString() + ";path=" + path;
                } else if (path) {
                    document.cookie = name + "= '' " + ";expires=" + now.toGMTString() + ";path=" + path;
                } else {
                    document.cookie = name + "=" + cval + ";expires=" + now.toGMTString();
                }
            }
        },
        //获取 url 参数值
        getQueryString: function(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) {
                return unescape(r[2]);
            }
            return null;
        },
        url2Obj: function(url) {
            var obj = {};
            var arr1 = url.split("?");
            var arr2 = arr1[1].split("&");
            for (var i = 0; i < arr2.length; i++) {
                var res = arr2[i].split("=");
                obj[res[0]] = res[1];
            }
            return obj;
        },
        //获取url中参数的值
        getParam: function(name) {
            name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
            var regexS = "[\\?&]" + name + "=([^&#]*)";
            var regex = new RegExp(regexS);
            var results = regex.exec(window.location.href);
            if (results == null) {
                return "";
            }
            return decodeURIComponent(results[1].replace(/\+/g, " "));
        },
        // 获取本地 localStorage 数据
        getLocalData: function(key) {
            try {
                if (localStorage && localStorage.getItem) {
                    var val = localStorage.getItem(key);
                    return val === null ? null : JSON.parse(val);
                } else {
                    console.log("浏览器不支持html localStorage getItem");
                    return null;
                }
            } catch (e) {
                return null;
            }
        },
        // 获取本地 localStorage 数据
        setLocalData: function(key, val) {
            if (localStorage && localStorage.setItem) {
                localStorage.removeItem(key);
                localStorage.setItem(key, JSON.stringify(val));
            } else {
                console.log("浏览器不支持html localStorage setItem");
            }
        },
        // 浏览器环境判断
        browserType: function() {
            var userAgent = navigator.userAgent;
            //取得浏览器的userAgent字符串
            var isOpera = userAgent.indexOf("Opera") > -1;
            if (isOpera) {
                //判断是否Opera浏览器
                return "Opera";
            }
            if (userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera) {
                //判断是否IE浏览器
                return "IE";
            }
            if (userAgent.indexOf("Edge") > -1) {
                //判断是否IE的Edge浏览器
                return "Edge";
            }
            if (userAgent.indexOf("Firefox") > -1) {
                //判断是否Firefox浏览器
                return "Firefox";
            }
            if (userAgent.indexOf("Safari") > -1 && userAgent.indexOf("Chrome") === -1) {
                //判断是否Safari浏览器
                return "Safari";
            }
            if (userAgent.indexOf("Chrome") > -1 && userAgent.indexOf("Safari") > -1) {
                //判断Chrome浏览器
                return "Chrome";
            }
        },
        //判断IE9以下浏览器
        validateIE9: function() {
            return !!($.browser.msie && ($.browser.version === "9.0" || $.browser.version === "8.0" || $.browser.version === "7.0" || $.browser.version === "6.0"));
        },
        // 计算两个2个时间相差的天数
        compareTime: function(startTime, endTime) {
            if (!startTime || !endTime) return "";
            return Math.abs((endTime - startTime) / 1e3 / 60 / 60 / 24);
        },
        // 修改参数 有参数则修改 无则加
        changeURLPar: function(url, arg, arg_val) {
            var pattern = arg + "=([^&]*)";
            var replaceText = arg + "=" + arg_val;
            if (url.match(pattern)) {
                var tmp = "/(" + arg + "=)([^&]*)/gi";
                tmp = url.replace(eval(tmp), replaceText);
                return tmp;
            } else {
                if (url.match("[?]")) {
                    return url + "&" + replaceText;
                } else {
                    return url + "?" + replaceText;
                }
            }
        },
        //获取url全部参数
        getUrlAllParams: function(urlStr) {
            if (typeof urlStr == "undefined") {
                var url = decodeURI(location.search);
            } else {
                var url = "?" + urlStr.split("?")[1];
            }
            var theRequest = new Object();
            if (url.indexOf("?") != -1) {
                var str = url.substr(1);
                var strs = str.split("&");
                for (var i = 0; i < strs.length; i++) {
                    theRequest[strs[i].split("=")[0]] = decodeURI(strs[i].split("=")[1]);
                }
            }
            return theRequest;
        },
        //获取 url 参数值
        getQueryString: function(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) {
                return unescape(r[2]);
            }
            return null;
        },
        /**
         * 兼容ie document.referrer的页面跳转 替代 window.location.href   window.open
         * @param url
         * @param flag 是否新窗口打开
         */
        compatibleIESkip: function(url, flag) {
            var referLink = document.createElement("a");
            referLink.href = url;
            referLink.style.display = "none";
            if (flag) {
                referLink.target = "_blank";
            }
            document.body.appendChild(referLink);
            referLink.click();
        },
        testEmail: function(val) {
            var reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
            if (reg.test(val)) {
                return true;
            } else {
                return false;
            }
        },
        testPhone: function(val) {
            if (/^1(3|4|5|6|7|8|9)\d{9}$/.test(val)) {
                return true;
            } else {
                return false;
            }
        },
        handleRecommendData: function(list) {
            var arr = [];
            $(list).each(function(index, item) {
                var temp = {};
                if (item.type == 1) {
                    // 资料 
                    // temp = Object.assign({},item,{linkUrl:`/f/${item.tprId}.html`})
                    item.linkUrl = "/f/" + item.tprId + ".html";
                    temp = item;
                }
                if (item.type == 2) {
                    // 链接
                    temp = item;
                }
                if (item.type == 3) {
                    // 专题页
                    // temp = Object.assign({},item,{linkUrl:`/node/s/${item.tprId}.html`})
                    item.linkUrl = "/node/s/" + item.tprId + ".html";
                    temp = item;
                }
                arr.push(temp);
            });
            console.log(arr);
            return arr;
        },
        formatDate: function(fmt) {
            var o = {
                "M+": this.getMonth() + 1,
                //月份
                "d+": this.getDate(),
                //日
                "h+": this.getHours(),
                //小时
                "m+": this.getMinutes(),
                //分
                "s+": this.getSeconds(),
                //秒
                "q+": Math.floor((this.getMonth() + 3) / 3),
                //季度
                S: this.getMilliseconds()
            };
            if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
            for (var k in o) if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
            return fmt;
        },
        getReferrer: function() {
            var referrer = document.referrer;
            var res = "";
            if (/https?\:\/\/[^\s]*so.com.*$/g.test(referrer)) {
                res = "360";
            } else if (/https?\:\/\/[^\s]*baidu.com.*$/g.test(referrer)) {
                res = "baidu";
            } else if (/https?\:\/\/[^\s]*sogou.com.*$/g.test(referrer)) {
                res = "sogou";
            } else if (/https?\:\/\/[^\s]*sm.cn.*$/g.test(referrer)) {
                res = "sm";
            }
            return res;
        },
        judgeSource: function(ishareBilog) {
            if (!ishareBilog) {
                ishareBilog = {};
            }
            ishareBilog.searchEngine = "";
            var from = "";
            from = utils.getQueryVariable("from");
            if (!from) {
                from = sessionStorage.getItem("webWxFrom") || utils.getCookie("webWxFrom");
            }
            if (from) {
                ishareBilog.source = from;
                sessionStorage.setItem("webWxFrom", from);
                sessionStorage.removeItem("webReferrer");
            } else {
                var referrer = sessionStorage.getItem("webReferrer") || utils.getCookie("webReferrer");
                if (!referrer) {
                    referrer = document.referrer;
                }
                if (referrer) {
                    sessionStorage.setItem("webReferrer", referrer);
                    sessionStorage.removeItem("webWxFrom");
                    referrer = referrer.toLowerCase();
                    //转为小写
                    var webSites = new Array("google.", "baidu.", "360.", "sogou.", "shenma.", "bing.");
                    var searchEngineArr = new Array("google", "baidu", "360", "sogou", "shenma", "bing");
                    for (var i = 0, l = webSites.length; i < l; i++) {
                        if (referrer.indexOf(webSites[i]) >= 0) {
                            ishareBilog.source = "searchEngine";
                            ishareBilog.searchEngine = searchEngineArr[i];
                        }
                    }
                }
                if (!referrer || !ishareBilog.source) {
                    if (utils.isWeChatBrow()) {
                        ishareBilog.source = "wechat";
                    } else {
                        ishareBilog.source = "outLink";
                    }
                }
            }
            return ishareBilog;
        }
    };
});

/**
 * 前端交互性API
 **/
define("dist/application/api", [], function(require, exports, module) {
    var router = "/gateway/pc";
    var gateway = "/gateway";
    module.exports = {
        // 用户相关
        user: {
            // 登录
            loginByPsodOrVerCode: gateway + "/cas/login/authorize",
            // 通过密码和验证码登录
            getLoginQrcode: gateway + "/cas/login/qrcode",
            // 生成公众号登录二维码
            loginByWeChat: gateway + "/cas/login/gzhScan",
            // 公众号扫码登录
            getUserInfo: "/node/api/getUserInfo",
            // node聚合的接口获取用户信息
            thirdLoginRedirect: gateway + "/cas/login/redirect",
            // 根据第三方授权的code,获取 access_token
            // login: router + '/usermanage/checkLogin',
            // 登出
            loginOut: gateway + "/cas/login/logout",
            // 我的收藏
            newCollect: gateway + "/content/collect/getUserFileList",
            // 透传老系统web登录信息接口
            // getJessionId: router + '/usermanage/getJessionId',
            //优惠券提醒
            // getSessionInfo: router + '/usermanage/getSessionInfo',
            addFeedback: gateway + "/feedback/addFeedback",
            //新增反馈
            getFeedbackType: gateway + "/feedback/getFeedbackType",
            //获取反馈问题类型
            sendSms: gateway + "/cas/sms/sendSms",
            // 发送短信验证码
            queryBindInfo: gateway + "/cas/user/queryBindInfo",
            // 查询用户绑定信息
            thirdCodelogin: gateway + "/cas/login/thirdCode",
            // /cas/login/thirdCode 第三方授权
            userBindMobile: gateway + "/cas/user/bindMobile",
            // 绑定手机号接口
            checkIdentity: gateway + "/cas/sms/checkIdentity",
            // 身份验证账号
            userBindThird: gateway + "/cas/user/bindThird",
            // 绑定第三方账号接口
            untyingThird: gateway + "/cas/user/untyingThird",
            // 解绑第三方
            setUpPassword: gateway + "/cas/user/setUpPassword",
            // 设置密码
            getUserCentreInfo: gateway + "/user/getUserCentreInfo",
            editUser: gateway + "/user/editUser",
            // 编辑用户信息
            getFileBrowsePage: gateway + "/content/fileBrowse/getFileBrowsePage",
            //分页获取用户的历史浏览记录
            getDownloadRecordList: gateway + "/content/getDownloadRecordList",
            //用户下载记录接口
            getUserFileList: gateway + "/content/collect/getUserFileList",
            // 查询个人收藏列表
            getMyUploadPage: gateway + "/content/getMyUploadPage",
            // 分页查询我的上传(公开资料，付费资料，私有资料，审核中，未通过)
            getOtherUser: gateway + "/user/getOthersCentreInfo",
            //他人信息主页 
            getSearchList: gateway + "/search/content/byCondition"
        },
        normalFileDetail: {
            // 添加评论
            // addComment: router + '/fileSync/addComment',
            // 举报
            // reportContent: router + '/fileSync/addFeedback',
            // 是否已收藏
            // isStore: router + '/fileSync/getFileCollect',
            // 取消或者关注
            // collect: router + '/fileSync/collect',
            // 文件预下载
            filePreDownLoad: gateway + "/content/getPreFileDownUrl",
            // 文件下载
            // fileDownLoad: router + '/action/downloadUrl',  
            // 下载获取地址接口
            getFileDownLoadUrl: gateway + "/content/getFileDownUrl",
            // 文件打分
            // appraise: router + '/fileSync/appraise',
            // 文件预览判断接口
            // getPrePageInfo: router + '/fileSync/prePageInfo',
            getPrePageInfo: gateway + "/content/file/getPrePageInfo"
        },
        officeFileDetail: {},
        search: {
            //搜索服务--API接口--运营位数据--异步
            // byPosition: router + '/operating/byPosition',
            specialTopic: gateway + "/search/specialTopic/lisPage"
        },
        sms: {
            // 获取短信验证码
            // getCaptcha: router + '/usermanage/getSmsYzCode',
            sendCorpusDownloadMail: gateway + "/content/fileSendEmail/sendCorpusDownloadMail"
        },
        pay: {
            // 购买成功后,在页面自动下载文档
            // successBuyDownLoad: router + '/action/downloadNow',
            // 绑定订单
            bindUser: gateway + "/order/bind/loginUser",
            scanOrderInfo: gateway + "/order/scan/orderInfo"
        },
        coupon: {
            rightsSaleVouchers: gateway + "/rights/sale/vouchers",
            rightsSaleQueryPersonal: gateway + "/rights/sale/queryPersonal",
            querySeniority: gateway + "/rights/sale/querySeniority",
            queryUsing: gateway + "/rights/sale/queryUsing",
            getMemberPointRecord: gateway + "/rights/vip/getMemberPointRecord",
            getBuyRecord: gateway + "/rights/vip/getBuyRecord"
        },
        // vouchers:router+'/sale/vouchers',
        order: {
            // bindOrderByOrderNo:router+'/order/bindOrderByOrderNo',
            bindOrderByOrderNo: gateway + "/order/bind/byOrderNo",
            unloginOrderDown: router + "/order/unloginOrderDown",
            createOrderInfo: gateway + "/order/create/orderInfo",
            rightsVipGetUserMember: gateway + "/rights/vip/getUserMember",
            getOrderStatus: gateway + "/order/get/orderStatus",
            queryOrderlistByCondition: gateway + "/order/query/listByCondition",
            getOrderInfo: gateway + "/order/get/orderInfo"
        },
        // getHotSearch:router+'/search/getHotSearch',
        getHotSearch: gateway + "/cms/search/content/hotWords",
        special: {
            fileSaveOrupdate: gateway + "/comment/collect/fileSaveOrupdate",
            // 收藏与取消收藏
            getCollectState: gateway + "/comment/zc/getUserFileZcState",
            //获取收藏状态
            setCollect: gateway + "/content/collect/file"
        },
        upload: {
            getCategory: gateway + "/content/category/getSimplenessInfo",
            // 获取所有分类
            createFolder: gateway + "/content/saveUserFolder",
            // 获取所有分类
            getFolder: gateway + "/content/getUserFolders",
            // 获取所有分类
            saveUploadFile: gateway + "/content/webUploadFile",
            batchDeleteUserFile: gateway + "/content/batchDeleteUserFile"
        },
        recommend: {
            recommendConfigInfo: gateway + "/recommend/config/info",
            recommendConfigRuleInfo: gateway + "/recommend/config/ruleInfo"
        },
        reportBrowse: {
            fileBrowseReportBrowse: gateway + "/content/fileBrowse/reportBrowse"
        },
        mywallet: {
            getAccountBalance: gateway + "/account/balance/getGrossIncome",
            // 账户余额信息
            withdrawal: gateway + "/account/with/apply",
            // 申请提现
            getWithdrawalRecord: gateway + "/account/withd/getPersonList",
            // 查询用户提现记录
            editFinanceAccount: gateway + "/account/finance/edit",
            // 编辑用户财务信息
            getFinanceAccountInfo: gateway + "/account/finance/getInfo",
            // 查询用户财务信息
            getPersonalAccountTax: gateway + "/account/tax/getPersonal",
            // 查询个人提现扣税结算
            getPersonalAccountTax: gateway + "/account/tax/getPersonal",
            // 查询个人提现扣税结算
            getMyWalletList: gateway + "/settlement/settle/getMyWalletList",
            // 我的钱包收入
            exportMyWalletDetail: gateway + "/settlement/settle/exportMyWalletDetail"
        }
    };
});

/**
 * 登录相关
 */
define("dist/application/checkLogin", [ "dist/application/api", "dist/application/method", "dist/application/login", "dist/cmd-lib/jqueryMd5", "dist/common/bilog", "base64", "dist/cmd-lib/util", "dist/report/config", "dist/cmd-lib/myDialog", "dist/cmd-lib/toast", "dist/common/bindphone", "dist/common/baidu-statistics" ], function(require, exports, module) {
    var api = require("dist/application/api");
    var method = require("dist/application/method");
    var api = require("dist/application/api");
    var showLoginDialog = require("dist/application/login").showLoginDialog;
    require("dist/common/baidu-statistics").initBaiduStatistics("17cdd3f409f282dc0eeb3785fcf78a66");
    var handleBaiduStatisticsPush = require("dist/common/baidu-statistics").handleBaiduStatisticsPush;
    var loginResult = require("dist/common/bilog").loginResult;
    module.exports = {
        getIds: function() {
            // 详情页
            var params = window.pageConfig && window.pageConfig.params ? window.pageConfig.params : null;
            var access = window.pageConfig && window.pageConfig.access ? window.pageConfig.access : null;
            var classArr = [];
            var clsId = params ? params.classid : "";
            var fid = access ? access.fileId || params.g_fileId || "" : "";
            // 类目页
            var classIds = params && params.classIds ? params.classIds : "";
            !clsId && (clsId = classIds);
            return {
                clsId: clsId,
                fid: fid
            };
        },
        /**
         * description  唤醒登录界面
         * @param callback 回调函数
         */
        notifyLoginInterface: function(callback) {
            var _self = this;
            if (!method.getCookie("cuk")) {
                var ptype = window.pageConfig && window.pageConfig.page ? window.pageConfig.page.ptype || "index" : "index";
                var clsId = this.getIds().clsId;
                var fid = this.getIds().fid;
                showLoginDialog({
                    clsId: clsId,
                    fid: fid
                }, function() {
                    console.log("loginCallback");
                    _self.getLoginData(callback);
                });
            }
        },
        listenLoginStatus: function(callback) {
            var _self = this;
            $.loginPop("login_wx_code", {
                terminal: "PC",
                businessSys: "ishare",
                domain: document.domain,
                ptype: "ishare",
                popup: "hidden",
                clsId: this.getIds().clsId,
                fid: this.getIds().fid
            }, function() {
                _self.getLoginData(callback);
            });
        },
        /**
        * description  优惠券提醒 查询用户发券资格-pc
        * @param callback 回调函数
        */
        getUserData: function(callback) {
            if (method.getCookie("cuk")) {
                method.get(api.coupon.querySeniority, function(res) {
                    if (res && res.code == 0) {
                        callback(res.data);
                    }
                }, "");
            }
        },
        /**
         * 获取用户信息
         * @param callback 回调函数
         */
        getLoginData: function(callback) {
            var _self = this;
            try {
                method.get("/node/api/getUserInfo", function(res) {
                    // api.user.login
                    if (res.code == 0 && res.data) {
                        loginResult("", "loginResult", {
                            loginType: window.loginType && window.loginType.type,
                            phone: res.data.mobile,
                            loginResult: "1"
                        });
                        handleBaiduStatisticsPush("loginResult", {
                            loginType: window.loginType && window.loginType.type,
                            phone: res.data.mobile,
                            userid: res.data.userId,
                            loginResult: "1"
                        });
                        if (callback && typeof callback == "function") {
                            callback(res.data);
                            try {
                                window.pageConfig.params.isVip = res.data.isVip;
                                window.pageConfig.page.uid = res.data.userId;
                            } catch (err) {}
                        }
                        try {
                            var userInfo = {
                                uid: res.data.userId,
                                isVip: res.data.isVip,
                                tel: res.data.mobile
                            };
                            method.setCookieWithExpPath("ui", JSON.stringify(userInfo), 30 * 60 * 1e3, "/");
                        } catch (e) {}
                    } else {
                        loginResult("", "loginResult", {
                            loginType: window.loginType && window.loginType.type,
                            phone: "",
                            userid: "",
                            loginResult: "0"
                        });
                        handleBaiduStatisticsPush("loginResult", {
                            loginType: window.loginType && window.loginType.type,
                            phone: "",
                            userid: res.data.userId,
                            loginResult: "0"
                        });
                        _self.ishareLogout();
                    }
                });
            } catch (e) {
                console.log(e);
            }
        },
        /**
         * 退出
         */
        ishareLogout: function() {
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
            $.get(api.user.loginOut, function(res) {
                console.log("loginOut:", res);
                if (res.code == 0) {
                    window.location.href = window.location.href;
                } else {
                    $.toast({
                        text: res.msg,
                        delay: 3e3
                    });
                }
            });
        }
    };
});

define("dist/application/login", [ "dist/cmd-lib/jqueryMd5", "dist/common/bilog", "base64", "dist/cmd-lib/util", "dist/application/method", "dist/report/config", "dist/application/api", "dist/cmd-lib/myDialog", "dist/cmd-lib/toast", "dist/common/bindphone" ], function(require, exports, module) {
    require("dist/cmd-lib/jqueryMd5");
    myWindow = "";
    // 保存第三方授权时,打开的标签
    var smsId = "";
    // 验证码
    var myWindow = "";
    // 保存 openWindow打开的对象
    var sceneId = "";
    // 微信二维码的场景id
    var mobile = "";
    // 获取验证码手机号
    var businessCode = "";
    // 获取验证码的场景
    var timer = null;
    // 二维码过期
    var setIntervalTimer = null;
    // 保存轮询微信登录的定时器
    var expires_in = "";
    // 二位码过期时间
    var loginCallback = null;
    // 保存调用登录dialog 时传入的函数 并在 登录成功后调用
    var touristLoginCallback = null;
    // 保存游客登录的传入的回调函数
    var normalPageView = require("dist/common/bilog").normalPageView;
    window.loginType = {
        type: "wechat",
        values: {
            0: "wechat",
            //微信登录
            1: "qq",
            //qq登录
            2: "weibo",
            //微博登录
            3: "phoneCode",
            //手机号+验证码
            4: "phonePw"
        }
    };
    //   保存登录方式在 登录数上报时使用
    var api = require("dist/application/api");
    var method = require("dist/application/method");
    require("dist/cmd-lib/myDialog");
    require("dist/cmd-lib/toast");
    var showCaptcha = require("dist/common/bindphone").showCaptcha;
    $(document).on("click", "#dialog-box .login-type-list .login-type-weixin .weixin-icon", function(e) {
        // 切换到微信登录
        $("#dialog-box .login-content .verificationCode-login").hide();
        $("#dialog-box .login-content .password-login").hide();
        $("#dialog-box .login-content .weixin-login").show();
        window.loginType.type = window.loginType.values[0];
    });
    $(document).on("click", "#dialog-box .login-type-list .login-type-verificationCode", function(e) {
        // 切换到验证码
        $("#dialog-box .login-content .password-login").hide();
        $("#dialog-box .login-content .weixin-login").hide();
        $("#dialog-box .login-content .verificationCode-login").show();
        window.loginType.type = window.loginType.values[3];
    });
    $(document).on("click", "#dialog-box .login-type-list .login-type-password", function(e) {
        // 切换到密码登录
        $("#dialog-box .login-content .weixin-login").hide();
        $("#dialog-box .login-content .verificationCode-login").hide();
        $("#dialog-box .login-content .password-login").show();
        window.loginType.type = window.loginType.values[4];
    });
    $(document).on("click", "#dialog-box .login-type-list .login-type", function() {
        // 第三方登录
        var loginType = $(this).attr("data-logintype");
        // qq  weibo
        if (loginType) {
            handleThirdCodelogin(loginType);
            if (loginType == "qq") {
                window.loginType.type = window.loginType.values[1];
            }
            if (loginType == "weibo") {
                window.loginType.type = window.loginType.values[2];
            }
        }
    });
    $(document).on("click", "#dialog-box .login-btn", function(e) {
        //  密码和验证码登录
        var logintype = $(this).attr("data-logintype");
        if (logintype == "verificationCode") {
            var nationCode = $("#dialog-box .verificationCode-login .phone-num").text().replace(/\+/, "").trim();
            var checkCode = $("#dialog-box .verificationCode-login .verification-code").val();
            var mobile = $("#dialog-box .verificationCode-login .telphone").val().trim();
            if (!method.testPhone(mobile) && nationCode == "86") {
                showErrorTip("verificationCode-login", true, "手机号错误");
                return;
            }
            if (!checkCode || checkCode && checkCode.length !== 4) {
                showErrorTip("verificationCode-login", true, "验证码错误");
                return;
            }
            showErrorTip("verificationCode-login", false, "");
            loginByPsodOrVerCode("codeLogin", mobile, nationCode, smsId, checkCode, "");
            // mobile 在获取验证码时 在全局mobile保存
            return;
        }
        if (logintype == "password") {
            // mobile
            var nationCode = $("#dialog-box .password-login .phone-num").text().replace(/\+/, "").trim();
            var password = $("#dialog-box .password-login .password .login-password:visible").val().trim();
            var mobile = $("#dialog-box .password-login .telphone").val().trim();
            if (!method.testPhone(mobile) && nationCode == 86) {
                showErrorTip("password-login", true, "手机号错误");
                return;
            }
            loginByPsodOrVerCode("ppLogin", mobile, nationCode, "", "", password);
            return;
        }
    });
    $(document).on("click", ".qr-refresh", function(e) {
        // 刷新微信登录二维码   包括游客登录页面
        getLoginQrcode("", "", true);
    });
    $(document).on("click", "#dialog-box .getVerificationCode", function(e) {
        // 获取验证码   在 getVerificationCode元素上 添加标识   0 获取验证码    1 倒计时   2 重新获取验证码
        var authenticationCodeType = $(this).attr("data-authenticationCodeType");
        var telphone = $("#dialog-box .verificationCode-login .input-mobile .telphone").val();
        var nationCode = $("#dialog-box .verificationCode-login .phone-num").text().replace(/\+/, "").trim();
        if (nationCode == "86") {
            if (!method.testPhone(telphone)) {
                showErrorTip("verificationCode-login", true, "手机号错误");
                return;
            } else {
                showErrorTip("verificationCode-login", false, "");
            }
            if (authenticationCodeType == 0 || authenticationCodeType == 2) {
                // 获取验证码 
                businessCode = 4;
                sendSms();
            }
        } else {
            if (authenticationCodeType == 0 || authenticationCodeType == 2) {
                // 获取验证码 
                businessCode = 4;
                sendSms();
            }
        }
    });
    $(document).on("input", "#dialog-box .verificationCode-login .telphone", function(e) {
        mobile = $(this).val();
        var verificationCode = $("#dialog-box .verificationCode-login .verification-code").val();
        var nationCode = $("#dialog-box .verificationCode-login .phone-num").text().replace(/\+/, "").trim();
        if (mobile.length > 11) {
            $("#dialog-box .telphone").val(mobile.slice(0, 11));
        }
        if (nationCode == "86") {
            // 国内号码
            if (method.testPhone(mobile.slice(0, 11))) {
                showErrorTip("verificationCode-login", false, "");
                $("#dialog-box .getVerificationCode").addClass("getVerificationCode-active");
                if (verificationCode && verificationCode.length >= 4) {
                    $("#dialog-box .verificationCode-login .login-btn").removeClass("login-btn-disable");
                    $("#dialog-box .verificationCode-login .login-btn").addClass("login-btn-active");
                }
            } else {
                if (mobile && mobile.length >= 11) {
                    showErrorTip("verificationCode-login", true, "手机号错误");
                    return;
                }
                $("#dialog-box .getVerificationCode").removeClass("getVerificationCode-active");
                $("#dialog-box .verificationCode-login .login-btn").removeClass("login-btn-active");
                $("#dialog-box .verificationCode-login .login-btn").addClass("login-btn-disable");
            }
        } else {
            if (mobile) {
                $("#dialog-box .getVerificationCode").addClass("getVerificationCode-active");
                if (verificationCode && verificationCode.length >= 4) {
                    $("#dialog-box .verificationCode-login .login-btn").removeClass("login-btn-disable");
                    $("#dialog-box .verificationCode-login .login-btn").addClass("login-btn-active");
                }
            } else {
                $("#dialog-box .getVerificationCode").removeClass("getVerificationCode-active");
                $("#dialog-box .verificationCode-login .login-btn").removeClass("login-btn-active");
                $("#dialog-box .verificationCode-login .login-btn").addClass("login-btn-disable");
            }
        }
    });
    $(document).on("input", "#dialog-box .verification-code", function(e) {
        // 
        var nationCode = $("#dialog-box .verificationCode-login .phone-num").text().replace(/\+/, "").trim();
        mobile = $("#dialog-box .verificationCode-login .telphone").val();
        verificationCode = $(this).val();
        if (verificationCode.length > 4) {
            $("#dialog-box .verification-code").val(verificationCode.slice(0, 4));
        }
        if (verificationCode && verificationCode.length >= 4) {
            showErrorTip("verificationCode-login", false, "");
        }
        if (nationCode == "86") {
            if (verificationCode && verificationCode.length >= 4 && method.testPhone(mobile)) {
                $("#dialog-box .verificationCode-login .login-btn").removeClass("login-btn-disable");
                $("#dialog-box .verificationCode-login .login-btn").addClass("login-btn-active");
            } else {
                $("#dialog-box .verificationCode-login .login-btn").removeClass("login-btn-active");
                $("#dialog-box .verificationCode-login .login-btn").addClass("login-btn-disable");
            }
        } else {
            if (verificationCode && verificationCode.length >= 4 && mobile) {
                $("#dialog-box .verificationCode-login .login-btn").removeClass("login-btn-disable");
                $("#dialog-box .verificationCode-login .login-btn").addClass("login-btn-active");
            } else {
                $("#dialog-box .verificationCode-login .login-btn").removeClass("login-btn-active");
                $("#dialog-box .verificationCode-login .login-btn").addClass("login-btn-disable");
            }
        }
    });
    $(document).on("input", "#dialog-box .password-login .telphone", function() {
        // 
        var nationCode = $("#dialog-box .password-login .phone-num").text().replace(/\+/, "").trim();
        mobile = $(this).val();
        if (mobile.length > 11) {
            $("#dialog-box .password-login .telphone").val(mobile.slice(0, 11));
        }
        if (nationCode == "86") {
            if (method.testPhone(mobile.slice(0, 11))) {
                showErrorTip("password-login", false, "");
                // 此时密码格式正确
                var loginPassword = $("#dialog-box .password-login .password .login-password:visible").val();
                if (loginPassword && loginPassword.length >= 6 && loginPassword && loginPassword.length <= 8) {
                    $("#dialog-box .password-login .login-btn").removeClass("login-btn-disable");
                    $("#dialog-box .password-login .login-btn").addClass("login-btn-active");
                }
            } else {
                if (mobile && mobile.length >= 11) {
                    showErrorTip("password-login", true, "手机号错误");
                    return;
                }
                $("#dialog-box .password-login .login-btn").removeClass("login-btn-active");
                $("#dialog-box .password-login .login-btn").addClass("login-btn-disable");
            }
        } else {
            if (mobile) {
                showErrorTip("password-login", false, "");
                if (loginPassword && loginPassword.length >= 6 && loginPassword && loginPassword.length <= 8) {
                    $("#dialog-box .password-login .login-btn").removeClass("login-btn-disable");
                    $("#dialog-box .password-login .login-btn").addClass("login-btn-active");
                }
            } else {
                $("#dialog-box .password-login .login-btn").removeClass("login-btn-active");
                $("#dialog-box .password-login .login-btn").addClass("login-btn-disable");
            }
        }
    });
    $(document).on("input", "#dialog-box .password-login .login-password", function() {
        var nationCode = $("#dialog-box .password-login .phone-num").text().replace(/\+/, "").trim();
        var password = $(this).val();
        var telphone = $("#dialog-box .password-login .telphone").val();
        if (password && password.length > 0) {
            $("#dialog-box .password-login .password .eye").show();
        } else {
            $("#dialog-box .password-login .password .close-eye").hide();
        }
        if (password.length > 16) {
            $("#dialog-box .password-login .login-password").val(password.slice(0, 16));
        }
        if (nationCode == "86") {
            if (method.testPhone(telphone) && password) {
                $("#dialog-box .password-login .login-btn").removeClass("login-btn-disable");
                $("#dialog-box .password-login .login-btn").addClass("login-btn-active");
            } else {
                $("#dialog-box .password-login .login-btn").removeClass("login-btn-active");
                $("#dialog-box .password-login .login-btn").addClass("login-btn-disable");
            }
        } else {
            if (telphone && password) {
                $("#dialog-box .password-login .login-btn").removeClass("login-btn-disable");
                $("#dialog-box .password-login .login-btn").addClass("login-btn-active");
            } else {
                $("#dialog-box .password-login .login-btn").removeClass("login-btn-active");
                $("#dialog-box .password-login .login-btn").addClass("login-btn-disable");
            }
        }
    });
    $(document).on("click", "#dialog-box .password-login .close-eye", function() {
        var textInput = $("#dialog-box .password-login .text-input");
        textInput.hide();
        $("#dialog-box .password-login .password-input").val(textInput.val());
        $("#dialog-box .password-login .password-input").show();
        $("#dialog-box .password-login .password .close-eye").hide();
        $("#dialog-box .password-login .password .eye").show();
    });
    $(document).on("click", "#dialog-box .password-login .eye", function() {
        var passwordInput = $("#dialog-box .password-login .password-input");
        passwordInput.hide();
        $("#dialog-box .password-login .text-input").val(passwordInput.val());
        $("#dialog-box .password-login .text-input").show();
        $("#dialog-box .password-login .password .eye").hide();
        $("#dialog-box .password-login .password .close-eye").show();
    });
    $(document).on("click", "#dialog-box  .close-btn", function(e) {
        closeRewardPop();
    });
    $(document).on("click", "#dialog-box .tourist-purchase-dialog .tabs .tab", function(e) {
        var dataType = $(this).attr("data-type");
        $("#dialog-box .tourist-purchase-dialog .tabs .tab").removeClass("tab-active");
        $(this).addClass("tab-active");
        if (dataType == "tourist-purchase") {
            $("#dialog-box .tourist-purchase-dialog .login-content").hide();
            $("#dialog-box .tourist-purchase-dialog .tourist-purchase-content").show();
        }
        if (dataType == "login-purchase") {
            normalPageView("loginResultPage");
            $("#dialog-box .tourist-purchase-dialog .tourist-purchase-content").hide();
            $("#dialog-box .tourist-purchase-dialog .login-content").show();
        }
    });
    // 选择区号的逻辑 
    $(document).on("click", "#dialog-box .phone-choice", function(e) {
        $(this).addClass("phone-choice-show");
        $("#dialog-box .phone-more").show();
        return false;
    });
    $(document).on("click", "#dialog-box .phone-more .phone-ele", function(e) {
        var areaNum = $(this).find(".number-con em").text();
        $("#dialog-box .phone-choice .phone-num .add").text("+" + areaNum);
        $("#dialog-box .phone-choice").removeClass("phone-choice-show");
        $("#dialog-box .phone-more").hide();
        $("#dialog-box input").val("");
        $("#dialog-box .getVerificationCode").removeClass("getVerificationCode-active");
        $("#dialog-box .login-btn").removeClass("login-btn-active");
        $("#dialog-box .login-btn").addClass("login-btn-disable");
        showErrorTip("verificationCode-login", false, "");
        showErrorTip("password-login", false, "");
        return false;
    });
    $(document).on("click", ".login-dialog", function(e) {
        $("#dialog-box .phone-choice").removeClass("phone-choice-show");
        $("#dialog-box .phone-more").hide();
    });
    $(document).on("click", ".login-content", function(e) {
        $("#dialog-box .phone-choice").removeClass("phone-choice-show");
        $("#dialog-box .phone-more").hide();
    });
    function closeRewardPop() {
        $(".common-bgMask").hide();
        $(".detail-bg-mask").hide();
        $("#dialog-box").hide();
        clearInterval(setIntervalTimer);
    }
    function showErrorTip(type, isShow, msg) {
        if (isShow) {
            if (type == "verificationCode-login") {
                $("#dialog-box .verificationCode-login .errortip .error-tip").text(msg);
                $("#dialog-box .verificationCode-login .errortip").show();
            } else if (type == "password-login") {
                $("#dialog-box .password-login .errortip .error-tip").text(msg);
                $("#dialog-box .password-login .errortip").show();
            }
        } else {
            if (type == "verificationCode-login") {
                $("#dialog-box .verificationCode-login .errortip .error-tip").text("");
                $("#dialog-box .verificationCode-login .errortip").hide();
            } else if (type == "password-login") {
                $("#dialog-box .password-login .errortip .error-tip").text("");
                $("#dialog-box .password-login .errortip").hide();
            }
        }
    }
    // 微信登录
    function getLoginQrcode(cid, fid, isqrRefresh, isTouristLogin, callback) {
        // 生成二维码 或刷新二维码 callback 在游客下载成功页面登录的callback
        $.ajax({
            url: api.user.getLoginQrcode,
            type: "POST",
            data: JSON.stringify({
                cid: cid || "",
                site: "1",
                fid: fid || "",
                sceneId: sceneId,
                domain: encodeURIComponent(document.domain)
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function(res) {
                if (res.code == "0") {
                    isShowQrInvalidtip(false);
                    expires_in = res.data && res.data.expires_in;
                    sceneId = res.data && res.data.sceneId;
                    countdown();
                    if (isTouristLogin || isqrRefresh) {
                        $(".tourist-login .qrcode-default").hide();
                        $(".tourist-login #login-qr").attr("src", res.data.url);
                        $(".tourist-login #login-qr").show();
                        if (callback) {
                            touristLoginCallback = callback;
                        }
                    } else {
                        $("#dialog-box .qrcode-default").hide();
                        $("#dialog-box #login-qr").attr("src", res.data.url);
                        $("#dialog-box #login-qr").show();
                    }
                    setIntervalTimer = setInterval(function() {
                        loginByWeChat();
                    }, 4e3);
                } else {
                    clearInterval(setIntervalTimer);
                    $.toast({
                        text: res.msg,
                        delay: 3e3
                    });
                }
            },
            error: function(error) {
                $.toast({
                    text: error.msg || "生成二维码接口错误",
                    delay: 3e3
                });
            }
        });
    }
    function isShowQrInvalidtip(flag) {
        // 普通微信登录  游客微信登录
        if (flag) {
            $(".login-qrContent .login-qr-invalidtip").show();
            $(".login-qrContent .qr-invalidtip").show();
            $(".login-qrContent .qr-refresh").show();
        } else {
            $(".login-qrContent .login-qr-invalidtip").hide();
            $(".login-qrContent .qr-invalidtip").hide();
            $(".login-qrContent .qr-refresh").hide();
        }
    }
    function countdown() {
        // 二维码失效倒计时
        if (expires_in <= 0) {
            clearTimeout(timer);
            clearInterval(setIntervalTimer);
            $("#dialog-box .qrcode-default").hide();
            isShowQrInvalidtip(true);
        } else {
            expires_in--;
            timer = setTimeout(countdown, 1e3);
        }
    }
    function loginByWeChat(cid, fid) {
        // 微信扫码登录  返回 access_token 通过 access_token(cuk)
        $.ajax({
            url: api.user.loginByWeChat,
            type: "POST",
            data: JSON.stringify({
                sceneId: sceneId,
                // 公众号登录二维码id
                site: "1",
                site: "1",
                cid: cid,
                fid: fid || "1816",
                domain: encodeURIComponent(document.domain)
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function(res) {
                if (res.code == "0") {
                    clearInterval(setIntervalTimer);
                    method.setCookieWithExpPath("cuk", res.data.access_token, res.data.expires_in * 1e3, "/");
                    closeRewardPop();
                    loginCallback && loginCallback();
                    touristLoginCallback && touristLoginCallback();
                    $.ajaxSetup({
                        headers: {
                            Authrization: method.getCookie("cuk")
                        }
                    });
                } else {
                    if (res.code != "411046") {
                        //  411046 用户未登录
                        clearInterval(setIntervalTimer);
                        $.toast({
                            text: res.msg,
                            delay: 3e3
                        });
                    }
                }
            },
            error: function(error) {
                $.toast({
                    text: error.msg || "公众号登录二维码",
                    delay: 3e3
                });
            }
        });
    }
    // QQ 微博 登录
    function handleThirdCodelogin(loginType) {
        var clientCode = loginType;
        var channel = 1;
        // 使用渠道：1:登录；2:绑定
        var locationUrl = window.location.origin ? window.location.origin : window.location.protocol + "//" + window.location.hostname;
        var location = locationUrl + "/node/redirectionURL.html" + "?clientCode=" + clientCode;
        var url = locationUrl + api.user.thirdCodelogin + "?clientCode=" + clientCode + "&channel=" + channel + "&terminal=pc" + "&businessSys=ishare" + "&location=" + encodeURIComponent(location);
        openWindow(url);
    }
    function openWindow(url) {
        // 第三方打开新的标签页
        var iWidth = 585;
        var iHeight = 525;
        var iTop = (window.screen.availHeight - 30 - iHeight) / 2;
        var iLeft = (window.screen.availWidth - 10 - iWidth) / 2;
        var param = "height=" + iHeight + ",width=" + iWidth + ",top=" + iTop + ",left=" + iLeft + ",toolbar=no, menubar=no, scrollbars=no, status=no, location=yes, resizable=yes";
        myWindow = window.open(url, "", param);
    }
    function thirdLoginRedirect(code, channel, clientCode) {
        // 根据授权code 获取 access_token
        $.ajax({
            url: api.user.thirdLoginRedirect,
            type: "POST",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({
                terminal: "0",
                thirdType: clientCode,
                code: code,
                businessSys: "ishare"
            }),
            dataType: "json",
            success: function(res) {
                if (res.code == "0") {
                    method.setCookieWithExpPath("cuk", res.data && res.data.access_token, res.data.expires_in * 1e3, "/");
                    closeRewardPop();
                    loginCallback && loginCallback();
                    touristLoginCallback && touristLoginCallback();
                    myWindow.close();
                    $.ajaxSetup({
                        headers: {
                            Authrization: method.getCookie("cuk")
                        }
                    });
                } else {
                    $.toast({
                        text: res.msg,
                        delay: 3e3
                    });
                    myWindow.close();
                }
            },
            error: function(error) {
                myWindow.close();
                $.toast({
                    text: error.msg,
                    delay: 3e3
                });
            }
        });
    }
    window.thirdLoginRedirect = thirdLoginRedirect;
    function sendSms(appId, randstr, ticket, onOff) {
        // 发送短信验证码
        $.ajax({
            url: api.user.sendSms,
            type: "POST",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({
                mobile: mobile,
                nationCode: $("#dialog-box .verificationCode-login .phone-num").text().replace(/\+/, "").trim(),
                businessCode: businessCode,
                // 功能模块（1-注册模块、2-找回密码、3-修改密码、4-登录、5-绑定/更换手机号手机号（会检查手机号是否被使用过）、6-旧手机号获取验证码）
                terminal: "pc",
                appId: appId,
                randstr: randstr,
                ticket: ticket,
                onOff: onOff
            }),
            dataType: "json",
            success: function(res) {
                if (res.code == "0") {
                    smsId = res.data.smsId;
                    var authenticationCode = $("#dialog-box .getVerificationCode");
                    authenticationCode.attr("data-authenticationCodeType", 1);
                    // 获取验证码
                    var timer = null;
                    var textNumber = 60;
                    (function countdown() {
                        if (textNumber <= 0) {
                            clearTimeout(timer);
                            authenticationCode.text("重新获取验证码");
                            authenticationCode.css({
                                "font-size": "13px",
                                color: "#fff",
                                "border-color": "#eee"
                            });
                            authenticationCode.attr("data-authenticationCodeType", 2);
                        } else {
                            authenticationCode.text(textNumber--);
                            authenticationCode.css({
                                color: "#fff",
                                "border-color": "#eee"
                            });
                            timer = setTimeout(countdown, 1e3);
                        }
                    })();
                } else if (res.code == "411015") {
                    // 单日ip获取验证码超过三次
                    showCaptcha(sendSms);
                } else if (res.code == "411033") {
                    // 图形验证码错误
                    $.toast({
                        text: "图形验证码错误",
                        delay: 3e3
                    });
                } else {
                    $.toast({
                        text: res.msg,
                        delay: 3e3
                    });
                }
            },
            error: function(error) {
                $.toast({
                    text: error.msg || "获取验证码错误",
                    delay: 3e3
                });
            }
        });
    }
    function loginByPsodOrVerCode(loginType, mobile, nationCode, smsId, checkCode, password) {
        // 通过密码或验证码登录
        $.ajax({
            url: api.user.loginByPsodOrVerCode,
            type: "POST",
            data: JSON.stringify({
                loginType: loginType,
                terminal: "pc",
                mobile: mobile,
                nationCode: nationCode,
                smsId: smsId,
                checkCode: checkCode,
                password: $.md5(password)
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function(res) {
                if (res.code == "0") {
                    method.setCookieWithExpPath("cuk", res.data.access_token, res.data.expires_in * 1e3, "/");
                    closeRewardPop();
                    loginCallback && loginCallback();
                    touristLoginCallback && touristLoginCallback();
                    $.ajaxSetup({
                        headers: {
                            Authrization: method.getCookie("cuk")
                        }
                    });
                } else {
                    if (checkCode) {
                        showErrorTip("verificationCode-login", true, res.msg);
                    } else {
                        showErrorTip("password-login", true, res.msg);
                    }
                }
            },
            error: function(error) {
                $.toast({
                    text: error.msg || "验证码或密码登录错误",
                    delay: 3e3
                });
            }
        });
    }
    function showLoginDialog(params, callback) {
        loginCallback = callback;
        var loginDialog = $("#login-dialog");
        normalPageView("loginResultPage");
        $("#dialog-box").dialog({
            html: loginDialog.html(),
            closeOnClickModal: false
        }).open(getLoginQrcode(params.clsId, params.fid));
    }
    function showTouristPurchaseDialog(params, callback) {
        // 游客购买的回调函数
        touristLoginCallback = callback;
        var touristPurchaseDialog = $("#tourist-purchase-dialog");
        $("#dialog-box").dialog({
            html: touristPurchaseDialog.html(),
            closeOnClickModal: false
        }).open(getLoginQrcode(params.clsId, params.fid));
    }
    return {
        showLoginDialog: showLoginDialog,
        showTouristPurchaseDialog: showTouristPurchaseDialog,
        getLoginQrcode: getLoginQrcode
    };
});

/**
* jQuery MD5 hash algorithm function
* 
* <code>
* Calculate the md5 hash of a String 
* String $.md5 ( String str )
* </code>
* 
* Calculates the MD5 hash of str using the 绂� RSA Data Security, Inc. MD5 Message-Digest Algorithm, and returns that hash. 
* MD5 (Message-Digest algorithm 5) is a widely-used cryptographic hash function with a 128-bit hash value. MD5 has been employed in a wide variety of security applications, and is also commonly used to check the integrity of data. The generated hash is also non-reversable. Data cannot be retrieved from the message digest, the digest uniquely identifies the data.
* MD5 was developed by Professor Ronald L. Rivest in 1994. Its 128 bit (16 byte) message digest makes it a faster implementation than SHA-1.
* This script is used to process a variable length message into a fixed-length output of 128 bits using the MD5 algorithm. It is fully compatible with UTF-8 encoding. It is very useful when u want to transfer encrypted passwords over the internet. If you plan using UTF-8 encoding in your project don't forget to set the page encoding to UTF-8 (Content-Type meta tag). 
* This function orginally get from the WebToolkit and rewrite for using as the jQuery plugin.
* 
* Example
* Code
* <code>
* $.md5("I'm Persian."); 
* </code>
* Result
* <code>
* "b8c901d0f02223f9761016cfff9d68df"
* </code>
* 
* @alias Muhammad Hussein Fattahizadeh < muhammad [AT] semnanweb [DOT] com >
* @link http://www.semnanweb.com/jquery-plugin/md5.html
* @see http://www.webtoolkit.info/
* @license http://www.gnu.org/licenses/gpl.html [GNU General Public License]
* @param {jQuery} {md5:function(string))
* @return string
*/
define("dist/cmd-lib/jqueryMd5", [], function(require, exports, module) {
    (function($) {
        var rotateLeft = function(lValue, iShiftBits) {
            return lValue << iShiftBits | lValue >>> 32 - iShiftBits;
        };
        var addUnsigned = function(lX, lY) {
            var lX4, lY4, lX8, lY8, lResult;
            lX8 = lX & 2147483648;
            lY8 = lY & 2147483648;
            lX4 = lX & 1073741824;
            lY4 = lY & 1073741824;
            lResult = (lX & 1073741823) + (lY & 1073741823);
            if (lX4 & lY4) return lResult ^ 2147483648 ^ lX8 ^ lY8;
            if (lX4 | lY4) {
                if (lResult & 1073741824) return lResult ^ 3221225472 ^ lX8 ^ lY8; else return lResult ^ 1073741824 ^ lX8 ^ lY8;
            } else {
                return lResult ^ lX8 ^ lY8;
            }
        };
        var F = function(x, y, z) {
            return x & y | ~x & z;
        };
        var G = function(x, y, z) {
            return x & z | y & ~z;
        };
        var H = function(x, y, z) {
            return x ^ y ^ z;
        };
        var I = function(x, y, z) {
            return y ^ (x | ~z);
        };
        var FF = function(a, b, c, d, x, s, ac) {
            a = addUnsigned(a, addUnsigned(addUnsigned(F(b, c, d), x), ac));
            return addUnsigned(rotateLeft(a, s), b);
        };
        var GG = function(a, b, c, d, x, s, ac) {
            a = addUnsigned(a, addUnsigned(addUnsigned(G(b, c, d), x), ac));
            return addUnsigned(rotateLeft(a, s), b);
        };
        var HH = function(a, b, c, d, x, s, ac) {
            a = addUnsigned(a, addUnsigned(addUnsigned(H(b, c, d), x), ac));
            return addUnsigned(rotateLeft(a, s), b);
        };
        var II = function(a, b, c, d, x, s, ac) {
            a = addUnsigned(a, addUnsigned(addUnsigned(I(b, c, d), x), ac));
            return addUnsigned(rotateLeft(a, s), b);
        };
        var convertToWordArray = function(string) {
            var lWordCount;
            var lMessageLength = string.length;
            var lNumberOfWordsTempOne = lMessageLength + 8;
            var lNumberOfWordsTempTwo = (lNumberOfWordsTempOne - lNumberOfWordsTempOne % 64) / 64;
            var lNumberOfWords = (lNumberOfWordsTempTwo + 1) * 16;
            var lWordArray = Array(lNumberOfWords - 1);
            var lBytePosition = 0;
            var lByteCount = 0;
            while (lByteCount < lMessageLength) {
                lWordCount = (lByteCount - lByteCount % 4) / 4;
                lBytePosition = lByteCount % 4 * 8;
                lWordArray[lWordCount] = lWordArray[lWordCount] | string.charCodeAt(lByteCount) << lBytePosition;
                lByteCount++;
            }
            lWordCount = (lByteCount - lByteCount % 4) / 4;
            lBytePosition = lByteCount % 4 * 8;
            lWordArray[lWordCount] = lWordArray[lWordCount] | 128 << lBytePosition;
            lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
            lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
            return lWordArray;
        };
        var wordToHex = function(lValue) {
            var WordToHexValue = "", WordToHexValueTemp = "", lByte, lCount;
            for (lCount = 0; lCount <= 3; lCount++) {
                lByte = lValue >>> lCount * 8 & 255;
                WordToHexValueTemp = "0" + lByte.toString(16);
                WordToHexValue = WordToHexValue + WordToHexValueTemp.substr(WordToHexValueTemp.length - 2, 2);
            }
            return WordToHexValue;
        };
        var uTF8Encode = function(string) {
            string = string.replace(/\x0d\x0a/g, "\n");
            var output = "";
            for (var n = 0; n < string.length; n++) {
                var c = string.charCodeAt(n);
                if (c < 128) {
                    output += String.fromCharCode(c);
                } else if (c > 127 && c < 2048) {
                    output += String.fromCharCode(c >> 6 | 192);
                    output += String.fromCharCode(c & 63 | 128);
                } else {
                    output += String.fromCharCode(c >> 12 | 224);
                    output += String.fromCharCode(c >> 6 & 63 | 128);
                    output += String.fromCharCode(c & 63 | 128);
                }
            }
            return output;
        };
        $.extend({
            md5: function(string) {
                var x = Array();
                var k, AA, BB, CC, DD, a, b, c, d;
                var S11 = 7, S12 = 12, S13 = 17, S14 = 22;
                var S21 = 5, S22 = 9, S23 = 14, S24 = 20;
                var S31 = 4, S32 = 11, S33 = 16, S34 = 23;
                var S41 = 6, S42 = 10, S43 = 15, S44 = 21;
                string = uTF8Encode(string);
                x = convertToWordArray(string);
                a = 1732584193;
                b = 4023233417;
                c = 2562383102;
                d = 271733878;
                for (k = 0; k < x.length; k += 16) {
                    AA = a;
                    BB = b;
                    CC = c;
                    DD = d;
                    a = FF(a, b, c, d, x[k + 0], S11, 3614090360);
                    d = FF(d, a, b, c, x[k + 1], S12, 3905402710);
                    c = FF(c, d, a, b, x[k + 2], S13, 606105819);
                    b = FF(b, c, d, a, x[k + 3], S14, 3250441966);
                    a = FF(a, b, c, d, x[k + 4], S11, 4118548399);
                    d = FF(d, a, b, c, x[k + 5], S12, 1200080426);
                    c = FF(c, d, a, b, x[k + 6], S13, 2821735955);
                    b = FF(b, c, d, a, x[k + 7], S14, 4249261313);
                    a = FF(a, b, c, d, x[k + 8], S11, 1770035416);
                    d = FF(d, a, b, c, x[k + 9], S12, 2336552879);
                    c = FF(c, d, a, b, x[k + 10], S13, 4294925233);
                    b = FF(b, c, d, a, x[k + 11], S14, 2304563134);
                    a = FF(a, b, c, d, x[k + 12], S11, 1804603682);
                    d = FF(d, a, b, c, x[k + 13], S12, 4254626195);
                    c = FF(c, d, a, b, x[k + 14], S13, 2792965006);
                    b = FF(b, c, d, a, x[k + 15], S14, 1236535329);
                    a = GG(a, b, c, d, x[k + 1], S21, 4129170786);
                    d = GG(d, a, b, c, x[k + 6], S22, 3225465664);
                    c = GG(c, d, a, b, x[k + 11], S23, 643717713);
                    b = GG(b, c, d, a, x[k + 0], S24, 3921069994);
                    a = GG(a, b, c, d, x[k + 5], S21, 3593408605);
                    d = GG(d, a, b, c, x[k + 10], S22, 38016083);
                    c = GG(c, d, a, b, x[k + 15], S23, 3634488961);
                    b = GG(b, c, d, a, x[k + 4], S24, 3889429448);
                    a = GG(a, b, c, d, x[k + 9], S21, 568446438);
                    d = GG(d, a, b, c, x[k + 14], S22, 3275163606);
                    c = GG(c, d, a, b, x[k + 3], S23, 4107603335);
                    b = GG(b, c, d, a, x[k + 8], S24, 1163531501);
                    a = GG(a, b, c, d, x[k + 13], S21, 2850285829);
                    d = GG(d, a, b, c, x[k + 2], S22, 4243563512);
                    c = GG(c, d, a, b, x[k + 7], S23, 1735328473);
                    b = GG(b, c, d, a, x[k + 12], S24, 2368359562);
                    a = HH(a, b, c, d, x[k + 5], S31, 4294588738);
                    d = HH(d, a, b, c, x[k + 8], S32, 2272392833);
                    c = HH(c, d, a, b, x[k + 11], S33, 1839030562);
                    b = HH(b, c, d, a, x[k + 14], S34, 4259657740);
                    a = HH(a, b, c, d, x[k + 1], S31, 2763975236);
                    d = HH(d, a, b, c, x[k + 4], S32, 1272893353);
                    c = HH(c, d, a, b, x[k + 7], S33, 4139469664);
                    b = HH(b, c, d, a, x[k + 10], S34, 3200236656);
                    a = HH(a, b, c, d, x[k + 13], S31, 681279174);
                    d = HH(d, a, b, c, x[k + 0], S32, 3936430074);
                    c = HH(c, d, a, b, x[k + 3], S33, 3572445317);
                    b = HH(b, c, d, a, x[k + 6], S34, 76029189);
                    a = HH(a, b, c, d, x[k + 9], S31, 3654602809);
                    d = HH(d, a, b, c, x[k + 12], S32, 3873151461);
                    c = HH(c, d, a, b, x[k + 15], S33, 530742520);
                    b = HH(b, c, d, a, x[k + 2], S34, 3299628645);
                    a = II(a, b, c, d, x[k + 0], S41, 4096336452);
                    d = II(d, a, b, c, x[k + 7], S42, 1126891415);
                    c = II(c, d, a, b, x[k + 14], S43, 2878612391);
                    b = II(b, c, d, a, x[k + 5], S44, 4237533241);
                    a = II(a, b, c, d, x[k + 12], S41, 1700485571);
                    d = II(d, a, b, c, x[k + 3], S42, 2399980690);
                    c = II(c, d, a, b, x[k + 10], S43, 4293915773);
                    b = II(b, c, d, a, x[k + 1], S44, 2240044497);
                    a = II(a, b, c, d, x[k + 8], S41, 1873313359);
                    d = II(d, a, b, c, x[k + 15], S42, 4264355552);
                    c = II(c, d, a, b, x[k + 6], S43, 2734768916);
                    b = II(b, c, d, a, x[k + 13], S44, 1309151649);
                    a = II(a, b, c, d, x[k + 4], S41, 4149444226);
                    d = II(d, a, b, c, x[k + 11], S42, 3174756917);
                    c = II(c, d, a, b, x[k + 2], S43, 718787259);
                    b = II(b, c, d, a, x[k + 9], S44, 3951481745);
                    a = addUnsigned(a, AA);
                    b = addUnsigned(b, BB);
                    c = addUnsigned(c, CC);
                    d = addUnsigned(d, DD);
                }
                var tempValue = wordToHex(a) + wordToHex(b) + wordToHex(c) + wordToHex(d);
                return tempValue.toLowerCase();
            }
        });
    })(jQuery);
});

define("dist/common/bilog", [ "base64", "dist/cmd-lib/util", "dist/application/method", "dist/report/config" ], function(require, exports, module) {
    //var $ = require("$");
    var base64 = require("base64").Base64;
    var util = require("dist/cmd-lib/util");
    var method = require("dist/application/method");
    var config = require("dist/report/config");
    //参数配置
    // var payTypeMapping = ['', '免费', '下载券', '现金', '仅供在线阅读', 'VIP免费', 'VIP特权'];
    // var payTypeMapping = ['', 'free', 'down', 'cost', 'online', 'vipFree', 'vipOnly'];
    var payTypeMapping = [ "", "free", "", "online", "vipOnly", "cost" ];
    //productType=1：免费文档，3 在线文档 4 vip特权文档 5 付费文档 6 私有文档
    // var fsourceEnum = {
    //     user: '用户上传', editor: '编辑上传', history: '历史资料1', history2: '历史资料2',
    //     other_collection_site: '外包采集站点', ishare_collection_site: '自行采集站点',
    //     other_collection_keyword: '外包采集关键字', ishare_collection_keyword: '自行采集关键字',
    //     baiduwenku_collection_site: '百度文库采集源', ishare_collection_microdisk: '自行采集微盘',
    // };
    var ip = method.getCookie("ip") || getIpAddress();
    var cid = method.getCookie("cid");
    if (!cid) {
        cid = new Date().getTime() + "" + Math.random();
        method.setCookieWithExp("cid", cid, 30 * 24 * 60 * 60 * 1e3, "/");
    }
    var time = new Date().getTime() + "" + Math.random();
    var min30 = 1e3 * 60 * 30;
    var sessionID = sessionStorage.getItem("sessionID") || "";
    function setSessionID() {
        sessionStorage.setItem("sessionID", time);
    }
    if (!sessionID) {
        setSessionID();
    }
    if (time - sessionID > min30) {
        setSessionID();
    }
    var initData = {
        eventType: "",
        //事件类型
        eventID: "",
        //事件编号
        eventName: "",
        //事件英文名字
        eventTime: String(new Date().getTime()),
        //事件触发时间戳（毫秒）
        reportTime: String(new Date().getTime()),
        //上报时间戳（毫秒）
        sdkVersion: "V1.0.3",
        //sdk版本
        terminalType: "0",
        //软件终端类型  0-PC，1-M，2-快应用，3-安卓APP，4-IOS APP，5-微信小程序，6-今日头条小程序，7-百度小程序
        loginStatus: method.getCookie("cuk") ? 1 : 0,
        //登录状态 0 未登录 1 登录
        visitID: method.getCookie("visitor_id") || "",
        //访客id
        userID: "",
        //用户ID
        sessionID: sessionStorage.getItem("sessionID") || cid || "",
        //会话ID
        productName: "ishare",
        //产品名称
        productCode: "0",
        //产品代码
        productVer: "V4.5.0",
        //产品版本
        pageID: "",
        //当前页面编号
        pageName: "",
        //当前页面的名称
        pageURL: "",
        //当前页面URL
        ip: ip || "",
        //IP地址
        resolution: document.documentElement.clientWidth + "*" + document.documentElement.clientHeight,
        //设备屏幕分辨率
        browserVer: util.getBrowserInfo(navigator.userAgent),
        //浏览器类型
        osType: getDeviceOs(),
        //操作系统类型
        //非必填
        moduleID: "",
        moduleName: "",
        appChannel: "",
        //应用下载渠道 仅针对APP移动端
        prePageID: "",
        //上一个页面编号
        prePageName: "",
        //上一个页面的名称
        prePageURL: document.referrer,
        //上一个页面URL
        domID: "",
        //当前触发DOM的编号 仅针对click
        domName: "",
        //当前触发DOM的名称 仅针对click
        domURL: "",
        //当前触发DOM的URL 仅针对click
        location: "",
        //位置（经纬度）仅针对移动端
        deviceID: "",
        //设备号 仅针对移动端
        deviceBrand: "",
        //移动设备品牌（厂商） 仅针对移动端
        deviceModel: "",
        //移动设备机型型号 仅针对移动端
        deviceLanguage: navigator.language,
        //设备语言
        mac: "",
        //MAC地址
        osVer: "",
        //操作系统版本 仅针对移动端
        networkType: "",
        //联网方式 仅针对移动端
        networkProvider: "",
        //网络运营商代码 仅针对移动端，非WIFI下传
        "var": {}
    };
    var userInfo = method.getCookie("ui");
    if (userInfo) {
        userInfo = JSON.parse(userInfo);
        initData.userID = userInfo.uid || "";
    }
    setPreInfo(document.referrer, initData);
    function setPreInfo(referrer, initData) {
        // 获取访客id
        initData.visitID = method.getCookie("visitor_id");
        if (new RegExp("/f/").test(referrer) && !new RegExp("referrer=").test(referrer) && !new RegExp("/f/down").test(referrer)) {
            var statuCode = $(".ip-page-statusCode");
            if (statuCode == "404") {
                initData.prePageID = "PC-M-404";
                initData.prePageName = "资料被删除";
            } else if (statuCode == "302") {
                initData.prePageID = "PC-M-FSM";
                initData.prePageName = "资料私有";
            } else {
                initData.prePageID = "PC-M-FD";
                initData.prePageName = "资料详情页";
            }
        } else if (new RegExp("/pay/payConfirm.html").test(referrer)) {
            initData.prePageID = "PC-M-PAY-F-L";
            initData.prePageName = "支付页-付费资料-列表页";
        } else if (new RegExp("/pay/payQr.html\\?type=2").test(referrer)) {
            initData.prePageID = "PC-M-PAY-F-QR";
            initData.prePageName = "支付页-付费资料-支付页";
        } else if (new RegExp("/pay/vip.html").test(referrer)) {
            initData.prePageID = "PC-M-PAY-VIP-L";
            initData.prePageName = "支付页-VIP-套餐列表页";
        } else if (new RegExp("/pay/payQr.html\\?type=0").test(referrer)) {
            initData.prePageID = "PC-M-PAY-VIP-QR";
            initData.prePageName = "支付页-VIP-支付页";
        } else if (new RegExp("/pay/privilege.html").test(referrer)) {
            initData.prePageID = "PC-M-PAY-PRI-L";
            initData.prePageName = "支付页-下载特权-套餐列表页";
        } else if (new RegExp("/pay/payQr.html\\?type=1").test(referrer)) {
            initData.prePageID = "PC-M-PAY-PRI-QR";
            initData.prePageName = "支付页-下载特权-支付页";
        } else if (new RegExp("/pay/success").test(referrer)) {
            initData.prePageID = "PC-M-PAY-SUC";
            initData.prePageName = "支付成功页";
        } else if (new RegExp("/pay/fail").test(referrer)) {
            initData.prePageID = "PC-M-PAY-FAIL";
            initData.prePageName = "支付失败页";
        } else if (new RegExp("/node/f/downsucc.html").test(referrer)) {
            if (/unloginFlag=1/.test(referrer)) {
                initData.prePageID = "PC-M-FDPAY-SUC";
                initData.prePageName = "免登购买成功页";
            } else {
                initData.prePageID = "PC-M-DOWN-SUC";
                initData.prePageName = "下载成功页";
            }
        } else if (new RegExp("/node/f/downfail.html").test(referrer)) {
            initData.prePageID = "PC-M-DOWN-FAIL";
            initData.prePageName = "下载失败页";
        } else if (new RegExp("/search/home.html").test(referrer)) {
            initData.prePageID = "PC-M-SR";
            initData.prePageName = "搜索关键词";
        } else if (new RegExp("/node/404.html").test(referrer)) {
            initData.prePageID = "PC-M-404";
            initData.prePageName = "404错误页";
        } else if (new RegExp("/node/503.html").test(referrer)) {
            initData.prePageID = "PC-M-500";
            initData.prePageName = "500错误页";
        } else if (new RegExp("/node/personalCenter/home.html").test(referrer)) {
            initData.prePageID = "PC-M-USER";
            initData.prePageName = "个人中心-首页";
        } else if (new RegExp("/node/personalCenter/myuploads.html").test(referrer)) {
            initData.prePageID = "PC-M-USER-MU";
            initData.prePageName = "个人中心-我的上传页";
        } else if (new RegExp("/node/personalCenter/mycollection.html").test(referrer)) {
            initData.prePageID = "PC-M-USER-CL";
            initData.prePageName = "个人中心-我的收藏页";
        } else if (new RegExp("/node/personalCenter/mydownloads.html").test(referrer)) {
            initData.prePageID = "PC-M-USER-MD";
            initData.prePageName = "个人中心-我的下载页";
        } else if (new RegExp("/node/personalCenter/vip.html").test(referrer)) {
            initData.prePageID = "PC-M-USER-VIP";
            initData.prePageName = "个人中心-我的VIP";
        } else if (new RegExp("/node/personalCenter/mycoupon.html").test(referrer)) {
            initData.prePageID = "PC-M-USER-MS";
            initData.prePageName = "个人中心-我的优惠券页";
        } else if (new RegExp("/node/personalCenter/accountsecurity.html").test(referrer)) {
            initData.prePageID = "PC-M-USER-ATM";
            initData.prePageName = "个人中心-账号与安全页";
        } else if (new RegExp("/node/personalCenter/personalinformation.html").test(referrer)) {
            initData.prePageID = "PC-M-USER-ATF";
            initData.prePageName = "个人中心-个人信息页";
        } else if (new RegExp("/node/personalCenter/myorder.html").test(referrer)) {
            initData.prePageID = "PC-M-USER-ORD";
            initData.prePageName = "个人中心-我的订单";
        }
    }
    //获取ip地址
    function getIpAddress() {
        $.getScript("//ipip.iask.cn/iplookup/search?format=js", function(response, status) {
            if (status === "success") {
                method.setCookieWithExp("ip", remote_ip_info["ip"], 5 * 60 * 1e3, "/");
                initData.ip = remote_ip_info["ip"];
            } else {
                console.error("ipip获取ip信息error");
            }
        });
    }
    //获得操作系统类型
    function getDeviceOs() {
        var name = "";
        if (window.navigator.userAgent.indexOf("Windows NT 10.0") != -1) {
            name = "Windows 10";
        } else if (window.navigator.userAgent.indexOf("Windows NT 6.2") != -1) {
            name = "Windows 8";
        } else if (window.navigator.userAgent.indexOf("Windows NT 6.1") != -1) {
            name = "Windows 7";
        } else if (window.navigator.userAgent.indexOf("Windows NT 6.0") != -1) {
            name = "Windows Vista";
        } else if (window.navigator.userAgent.indexOf("Windows NT 5.1") != -1) {
            name = "Windows XP";
        } else if (window.navigator.userAgent.indexOf("Windows NT 5.0") != -1) {
            name = "Windows 2000";
        } else if (window.navigator.userAgent.indexOf("Mac") != -1) {
            name = "Mac/iOS";
        } else if (window.navigator.userAgent.indexOf("X11") != -1) {
            name = "UNIX";
        } else if (window.navigator.userAgent.indexOf("Linux") != -1) {
            name = "Linux";
        }
        return name;
    }
    // 埋点上报 请求
    function push(params) {
        setTimeout(function() {
            console.log(params, "页面上报");
            $.getJSON("https://dw.iask.com.cn/ishare/jsonp?data=" + base64.encode(JSON.stringify(params)) + "&jsoncallback=?", function(data) {
                console.log(data);
            });
        });
    }
    // 埋点引擎
    function handle(commonData, customData) {
        var resultData = commonData;
        if (commonData && customData) {
            for (var key in commonData) {
                if (key === "var") {
                    for (var item in customData) {
                        resultData["var"][item] = customData[item];
                    }
                } else {
                    if (customData[key]) {
                        resultData[key] = customData[key];
                    }
                }
            }
            console.log("埋点参数:", resultData);
            push(resultData);
        }
    }
    //全部页面都要上报
    function normalPageView(loginResult) {
        var commonData = JSON.parse(JSON.stringify(initData));
        setPreInfo(document.referrer, commonData);
        var customData = {
            channel: ""
        };
        var bc = method.getCookie("bc");
        if (bc) {
            customData.channel = bc;
        }
        commonData.eventType = "page";
        commonData.eventID = "NE001";
        commonData.eventName = "normalPageView";
        if (loginResult == "loginResultPage") {
            // clickCenter('SE001', 'loginResult', 'PLOGIN', '登录页', customData);
            commonData.pageID = "PC-M-LOGIN";
            commonData.pageName = "登录页";
        } else {
            commonData.pageID = $("#ip-page-id").val() || "";
            commonData.pageName = $("#ip-page-name").val() || "";
        }
        commonData.pageURL = window.location.href;
        var searchEngine = getSearchEngine();
        var source = getSource(searchEngine);
        $.extend(customData, {
            source: source,
            searchEngine: searchEngine
        });
        handle(commonData, customData);
    }
    //详情页
    function fileDetailPageView() {
        var customData = {
            fileID: window.pageConfig.params.g_fileId,
            fileName: window.pageConfig.params.file_title,
            fileCategoryID: window.pageConfig.params.classid1 + "||" + window.pageConfig.params.classid2 + "||" + window.pageConfig.params.classid3,
            fileCategoryName: window.pageConfig.params.classidName1 + "||" + window.pageConfig.params.classidName2 + "||" + window.pageConfig.params.classidName3,
            filePrice: window.pageConfig.params.moneyPrice,
            fileCouponCount: window.pageConfig.params.file_volume,
            filePayType: payTypeMapping[window.pageConfig.params.file_state],
            fileFormat: window.pageConfig.params.file_format,
            fileProduceType: window.pageConfig && window.pageConfig.params ? window.pageConfig.params.fsource : "",
            fileCooType: "",
            fileUploaderID: window.pageConfig.params.file_uid
        };
        var is360 = window.pageConfig && window.pageConfig.params ? window.pageConfig.params.is360 : "";
        if (/https?\:\/\/[^\s]*so.com.*$/g.test(document.referrer) && !/https?\:\/\/[^\s]*wenku.so.com.*$/g.test(document.referrer) && is360 == "true") {
            customData.fileCooType = "360onebox";
            method.setCookieWithExp("bc", "360onebox", 30 * 60 * 1e3, "/");
        }
        if (/https?\:\/\/[^\s]*wenku.so.com.*$/g.test(document.referrer)) {
            customData.fileCooType = "360wenku";
            method.setCookieWithExp("bc", "360wenku", 30 * 60 * 1e3, "/");
        }
        if (/https?\:\/\/[^\s]*wenku.so.com.*$/g.test(document.referrer)) {
            customData.fileCooType = "360wenku";
            method.setCookieWithExp("bc", "360wenku", 30 * 60 * 1e3, "/");
        }
        var commonData = JSON.parse(JSON.stringify(initData));
        setPreInfo(document.referrer, commonData);
        commonData.eventType = "page";
        commonData.eventID = "SE002";
        commonData.eventName = "fileDetailPageView";
        commonData.pageID = $("#ip-page-id").val() || "";
        commonData.pageName = $("#ip-page-name").val() || "";
        commonData.pageURL = window.location.href;
        method.setCookieWithExp("bf", JSON.stringify(customData), 30 * 60 * 1e3, "/");
        handle(commonData, customData);
    }
    //下载结果页
    function downResult(customData) {
        var commonData = JSON.parse(JSON.stringify(initData));
        setPreInfo(document.referrer, commonData);
        commonData.eventType = "page";
        commonData.eventID = "SE014";
        commonData.eventName = "downResult";
        commonData.pageID = $("#ip-page-id").val() || "";
        commonData.pageName = $("#ip-page-name").val() || "";
        commonData.pageURL = window.location.href;
        handle(commonData, customData);
    }
    function searchResult(customData) {
        //导出页面使用
        var commonData = JSON.parse(JSON.stringify(initData));
        commonData.eventType = "page";
        commonData.eventID = "SE015";
        commonData.eventName = "searchPageView";
        setPreInfo(document.referrer, commonData);
        commonData.pageID = "PC-M-SR" || "";
        commonData.pageName = $("#ip-page-name").val() || "";
        customData.keyWords = $(".new-input").val() || $(".new-input").attr("placeholder");
        commonData.pageURL = window.location.href;
        handle(commonData, customData);
    }
    //页面级事件
    $(function() {
        setTimeout(function() {
            var pid = $("#ip-page-id").val();
            if ("PC-M-FD" == pid) {
                //详情页
                fileDetailPageView();
            }
            if ("PC-O-SR" != pid) {
                //不是办公频道搜索结果页
                normalPageView();
            }
            var bf = method.getCookie("bf");
            var br = method.getCookie("br");
            var href = window.location.href;
            var downResultData = {
                downResult: 1,
                fileID: "",
                fileName: "",
                fileCategoryID: "",
                fileCategoryName: "",
                filePayType: ""
            };
            if ("PC-M-DOWN-SUC" == pid) {
                //下载成功页
                var bf = method.getCookie("bf");
                if (bf) {
                    trans(JSON.parse(bf), downResultData);
                }
                downResultData.downResult = 1;
                downResult(downResultData);
            } else if ("PC-M-DOWN-FAIL" == pid) {
                //下载失败页
                var bf = method.getCookie("bf");
                if (bf) {
                    trans(JSON.parse(bf), downResultData);
                }
                downResultData.downResult = 0;
                downResult(downResultData);
            }
        }, 1e3);
    });
    //对象值传递
    function trans(from, to) {
        for (var i in to) {
            if (from[i]) {
                to[i] = from[i];
            }
        }
    }
    //点击事件
    $(document).delegate("." + config.EVENT_NAME, "click", function(event) {
        //动态绑定点击事件
        // debugger
        var that = $(this);
        var cnt = that.attr(config.BILOG_CONTENT_NAME);
        //上报事件类型
        console.log("cnt:", cnt);
        if (cnt) {
            setTimeout(function() {
                clickEvent(cnt, that);
            });
        }
    });
    function clickCenter(eventID, eventName, domId, domName, customData) {
        var commonData = JSON.parse(JSON.stringify(initData));
        setPreInfo(document.referrer, commonData);
        commonData.eventType = "click";
        commonData.eventID = eventID;
        commonData.eventName = eventName;
        if (eventID == "SE001") {
            commonData.pageID = "PC-M-LOGIN";
            commonData.pageName = "登录页";
        } else {
            commonData.pageID = $("#ip-page-id").val();
            commonData.pageName = $("#ip-page-name").val();
        }
        commonData.pageURL = window.location.href;
        commonData.domID = domId;
        commonData.domName = domName;
        commonData.domURL = window.location.href;
        handle(commonData, customData);
    }
    //点击事件
    function clickEvent(cnt, that, moduleID, params) {
        var ptype = $("#ip-page-type").val();
        if (ptype == "pindex") {
            //详情页
            var customData = {
                fileID: "",
                fileName: "",
                fileCategoryID: "",
                fileCategoryName: "",
                filePayType: "",
                fileFormat: "",
                fileProduceType: "",
                fileCooType: "",
                fileUploaderID: ""
            };
            var bf = method.getCookie("bf");
            if (bf) {
                trans(JSON.parse(bf), customData);
            }
            if (cnt == "fileDetailUpDown" || cnt == "fileDetailMiddleDown" || cnt == "fileDetailBottomDown") {
                customData.downType = "";
                if (cnt == "fileDetailUpDown") {
                    clickCenter("SE003", "fileDetailDownClick", "fileDetailUpDown", "资料详情页顶部立即下载", customData);
                } else if (cnt == "fileDetailMiddleDown") {
                    clickCenter("SE003", "fileDetailDownClick", "fileDetailMiddleDown", "资料详情页中部立即下载", customData);
                } else if (cnt == "fileDetailBottomDown") {
                    clickCenter("SE003", "fileDetailDownClick", "fileDetailBottomDown", "资料详情页底部立即下载", customData);
                }
                delete customData.downType;
            } else if (cnt == "fileDetailUpBuy") {
                clickCenter("SE004", "fileDetailBuyClick", "fileDetailUpBuy", "资料详情页顶部立即购买", customData);
            } else if (cnt == "fileDetailMiddleBuy") {
                clickCenter("SE004", "fileDetailBuyClick", "fileDetailMiddleBuy", "资料详情页中部立即购买", customData);
            } else if (cnt == "fileDetailBottomBuy") {
                clickCenter("SE004", "fileDetailBuyClick", "fileDetailBottomBuy", "资料详情页底部立即购买", customData);
            } else if (cnt == "fileDetailMiddleOpenVip8") {
                clickCenter("SE005", "fileDetailOpenVipClick", "fileDetailMiddleOpenVip8", "资料详情页中部开通vip，8折购买", customData);
            } else if (cnt == "fileDetailBottomOpenVip8") {
                clickCenter("SE005", "fileDetailOpenVipClick", "fileDetailBottomOpenVip8", "资料详情页底部开通vip，8折购买", customData);
            } else if (cnt == "fileDetailMiddleOpenVipPr") {
                clickCenter("SE005", "fileDetailOpenVipClick", "fileDetailMiddleOpenVipPr", "资料详情页中部开通vip，享更多特权", customData);
            } else if (cnt == "fileDetailBottomOpenVipPr") {
                clickCenter("SE005", "fileDetailOpenVipClick", "fileDetailBottomOpenVipPr", "资料详情页底部开通vip，享更多特权", customData);
            } else if (cnt == "fileDetailComment") {} else if (cnt == "fileDetailScore") {
                var score = that.find(".on:last").text();
                customData.fileScore = score ? score : "";
                clickCenter("SE007", "fileDetailScoreClick", "fileDetailScore", "资料详情页评分", customData);
                delete customData.fileScore;
            }
        }
        if (cnt == "payFile") {
            var customData = {
                orderID: method.getParam("orderNo") || "",
                couponID: $(".pay-coupon-wrap").attr("vid") || "",
                coupon: $(".pay-coupon-wrap p.chose-ele").text() || "",
                fileID: "",
                fileName: "",
                fileCategoryID: "",
                fileCategoryName: "",
                filePayType: "",
                fileFormat: "",
                fileProduceType: "",
                fileCooType: "",
                fileUploaderID: "",
                filePrice: "",
                fileSalePrice: ""
            };
            var bf = method.getCookie("bf");
            if (bf) {
                trans(JSON.parse(bf), customData);
            }
            clickCenter("SE008", "payFileClick", "payFile", "支付页-付费资料-立即支付", customData);
        } else if (cnt == "payVip") {
            var customData = {
                orderID: method.getParam("orderNo") || "",
                vipID: $(".ui-tab-nav-item.active").data("vid"),
                vipName: $(".ui-tab-nav-item.active p.vip-time").text() || "",
                vipPrice: $(".ui-tab-nav-item.active p.vip-price strong").text() || "",
                couponID: $(".pay-coupon-wrap").attr("vid") || "",
                coupon: $(".pay-coupon-wrap p.chose-ele").text() || ""
            };
            clickCenter("SE010", "payVipClick", "payVip", "支付页-VIP-立即支付", customData);
        } else if (cnt == "payPrivilege") {
            var customData = {
                orderID: method.getParam("orderNo") || "",
                couponID: $(".pay-coupon-wrap").attr("vid") || "",
                coupon: $(".pay-coupon-wrap p.chose-ele").text() || "",
                // privilegeID: $(".ui-tab-nav-item.active").data('pid') || '',
                privilegeName: $(".ui-tab-nav-item.active p.privilege-price").text() || "",
                privilegePrice: $(".ui-tab-nav-item.active").data("activeprice") || "",
                fileID: "",
                fileName: "",
                fileCategoryID: "",
                fileCategoryName: "",
                filePayType: "",
                fileFormat: "",
                fileProduceType: "",
                fileCooType: "",
                fileUploaderID: ""
            };
            var bf = method.getCookie("bf");
            if (bf) {
                trans(JSON.parse(bf), customData);
            }
            clickCenter("SE012", "payPrivilegeClick", "payPrivilege", "支付页-下载特权-立即支付", customData);
        } else if (cnt == "searchResult") {
            customData = {
                fileID: that.attr("data-fileId"),
                fileName: that.attr("data-fileName"),
                keyWords: $(".new-input").val() || $(".new-input").attr("placeholder")
            };
            clickCenter("SE016", "normalClick", "searchResultClick", "搜索结果页点击", customData);
        } else if (cnt == "loginResult") {
            initData.loginStatus = method.getCookie("cuk") ? 1 : 0, //登录状态 0 未登录 1 登录
            // $.extend(customData, params);
            clickCenter("SE001", "loginResult", "PC-M-LOGIN", "登录页", params);
        }
        var customData = {
            phone: $("#ip-mobile").val() || "",
            vipStatus: $("#ip-isVip").val() || "",
            channel: "",
            cashBalance: "",
            integralNumber: "",
            idolNumber: "",
            fileCategoryID: "",
            fileCategoryName: ""
        };
        if (userInfo) {
            customData.vipStatus = userInfo.isVip || "";
            customData.phone = userInfo.tel || "";
        }
        var bc = method.getCookie("bc");
        if (bc) {
            customData.channel = bc;
        }
        if (cnt == "paySuccessBacDown") {
            clickCenter("NE002", "normalClick", "paySuccessBacDown", "支付成功页-返回下载", customData);
        } else if (cnt == "paySuccessOpenVip") {
            clickCenter("NE002", "normalClick", "paySuccessOpenVip", "支付成功页-开通VIP", customData);
        } else if (cnt == "downSuccessOpenVip") {
            clickCenter("NE002", "normalClick", "downSuccessOpenVip", "下载成功页-开通VIP", customData);
        } else if (cnt == "downSuccessContinueVip") {
            clickCenter("NE002", "normalClick", "downSuccessContinueVip", "下载成功页-续费VIP", customData);
        } else if (cnt == "downSuccessBacDetail") {
            clickCenter("NE002", "normalClick", "downSuccessBacDetail", "下载成功页-返回详情页", customData);
        } else if (cnt == "downSuccessBindPhone") {
            clickCenter("NE002", "normalClick", "downSuccessBindPhone", "下载成功页-立即绑定", customData);
        } else if (cnt == "viewExposure") {
            customData.moduleID = moduleID;
        } else if (cnt == "similarFileClick") {
            customData = {
                fileID: window.pageConfig.params.g_fileId,
                fileName: window.pageConfig.params.file_title,
                fileCategoryID: window.pageConfig.params.classid1 + "||" + window.pageConfig.params.classid2 + "||" + window.pageConfig.params.classid3,
                fileCategoryName: window.pageConfig.params.classidName1 + "||" + window.pageConfig.params.classidName2 + "||" + window.pageConfig.params.classidName3,
                filePayType: payTypeMapping[window.pageConfig.params.file_state]
            };
            clickCenter("SE017", "fileListNormalClick", "similarFileClick", "资料列表常规点击", customData);
        } else if (cnt == "underSimilarFileClick") {
            customData = {
                fileID: window.pageConfig.params.g_fileId,
                fileName: window.pageConfig.params.file_title,
                fileCategoryID: window.pageConfig.params.classid1 + "||" + window.pageConfig.params.classid2 + "||" + window.pageConfig.params.classid3,
                fileCategoryName: window.pageConfig.params.classidName1 + "||" + window.pageConfig.params.classidName2 + "||" + window.pageConfig.params.classidName3,
                filePayType: payTypeMapping[window.pageConfig.params.file_state]
            };
            clickCenter("SE017", "fileListNormalClick", "underSimilarFileClick", "点击底部猜你喜欢内容时", customData);
        } else if (cnt == "downSucSimilarFileClick") {
            clickCenter("SE017", "fileListNormalClick", "downSucSimilarFileClick", "下载成功页猜你喜欢内容时", customData);
        } else if (cnt == "markFileClick") {
            customData = {
                fileID: window.pageConfig.params.g_fileId,
                fileName: window.pageConfig.params.file_title,
                fileCategoryID: window.pageConfig.params.classid1 + "||" + window.pageConfig.params.classid2 + "||" + window.pageConfig.params.classid3,
                fileCategoryName: window.pageConfig.params.classidName1 + "||" + window.pageConfig.params.classidName2 + "||" + window.pageConfig.params.classidName3,
                filePayType: payTypeMapping[window.pageConfig.params.file_state],
                markRusult: 1
            };
            clickCenter("SE019", "markClick", "markFileClick", "资料收藏点击", customData);
        } else if (cnt == "vipRights") {
            clickCenter("NE002", "normalClick", "vipRights", "侧边栏-vip权益", customData);
        } else if (cnt == "seen") {
            clickCenter("NE002", "normalClick", "seen", "侧边栏-我看过的", customData);
        } else if (cnt == "mark") {
            clickCenter("NE002", "normalClick", "mark", "侧边栏-我的收藏", customData);
        } else if (cnt == "customerService") {
            clickCenter("NE002", "normalClick", "customerService", "侧边栏-联系客服", customData);
        } else if (cnt == "downApp") {
            clickCenter("NE002", "normalClick", "downApp", "侧边栏-下载APP", customData);
        } else if (cnt == "follow") {
            clickCenter("NE002", "normalClick", "follow", "侧边栏-关注领奖", customData);
        }
    }
    function getSearchEngine() {
        // baidu：百度
        // google:谷歌
        // 360:360搜索
        // sougou:搜狗
        // shenma:神马搜索
        // bing:必应
        var referrer = document.referrer;
        var res = "";
        if (/https?\:\/\/[^\s]*so.com.*$/g.test(referrer)) {
            res = "360";
        } else if (/https?\:\/\/[^\s]*baidu.com.*$/g.test(referrer)) {
            res = "baidu";
        } else if (/https?\:\/\/[^\s]*sogou.com.*$/g.test(referrer)) {
            res = "sogou";
        } else if (/https?\:\/\/[^\s]*sm.cn.*$/g.test(referrer)) {
            res = "sm";
        } else if (/https?\:\/\/[^\s]*google.com.*$/g.test(referrer)) {
            res = "google";
        } else if (/https?\:\/\/[^\s]*bing.com.*$/g.test(referrer)) {
            res = "bing";
        }
        return res;
    }
    function getSource(searchEngine) {
        var referrer = document.referrer;
        var orgigin = location.origin;
        var source = "";
        if (searchEngine) {
            //搜索引擎
            source = "searchEngine";
        } else if (referrer && referrer.indexOf(orgigin) !== -1) {
            // 正常访问
            source = "vist";
        } else {
            source = "outLink";
        }
        return source;
    }
    // todo 埋点相关公共方法 =====
    // todo 埋点上报请求---新增
    function reportToBlack(result) {
        console.log("自有埋点上报结果", result);
        setTimeout(function() {
            $.getJSON("https://dw.iask.com.cn/ishare/jsonp?data=" + base64.encode(JSON.stringify(result)) + "&jsoncallback=?", function(data) {});
        });
    }
    module.exports = {
        normalPageView: function(loginResult) {
            normalPageView(loginResult);
        },
        clickEvent: function($this) {
            var cnt = $this.attr(config.BILOG_CONTENT_NAME);
            console.log("cnt-导出的:", cnt);
            if (cnt) {
                setTimeout(function() {
                    clickEvent(cnt, $this);
                });
            }
        },
        viewExposure: function($this, moduleID) {
            var cnt = "viewExposure";
            if (cnt) {
                setTimeout(function() {
                    clickEvent(cnt, $this, moduleID);
                });
            }
        },
        loginResult: function($this, moduleID, params) {
            var cnt = "loginResult";
            if (cnt) {
                setTimeout(function() {
                    clickEvent(cnt, "", moduleID, params);
                });
            }
        },
        searchResult: searchResult,
        // todo 后续优化-公共处理==============
        // todo 自有埋点公共数据
        getBilogCommonData: function getBilogCommonData() {
            setPreInfo(document.referrer, initData);
            return initData;
        },
        reportToBlack: reportToBlack
    };
});

/**
 * @Description: 工具类
 */
define("dist/cmd-lib/util", [], function(require, exports, module) {
    // var $ = require("$");
    var utils = {
        //节流函数 func 是传入执行函数，wait是定义执行间隔时间
        throttle: function(func, wait) {
            var last, deferTimer;
            return function(args) {
                var that = this;
                var _args = arguments;
                //当前时间
                var now = +new Date();
                //将当前时间和上一次执行函数时间对比
                //如果差值大于设置的等待时间就执行函数
                if (last && now < last + wait) {
                    clearTimeout(deferTimer);
                    deferTimer = setTimeout(function() {
                        last = now;
                        func.apply(that, _args);
                    }, wait);
                } else {
                    last = now;
                    func.apply(that, _args);
                }
            };
        },
        //防抖函数 func 是传入执行函数，wait是定义执行间隔时间
        debounce: function(func, wait) {
            //缓存一个定时器id 
            var timer = 0;
            var that = this;
            return function(args) {
                if (timer) clearTimeout(timer);
                timer = setTimeout(function() {
                    func.apply(that, args);
                }, wait);
            };
        },
        //判断是否微信浏览器
        isWeChatBrow: function() {
            var ua = navigator.userAgent.toLowerCase();
            var isWeixin = ua.indexOf("micromessenger") != -1;
            if (isWeixin) {
                return true;
            } else {
                return false;
            }
        },
        //识别是ios 还是 android
        getWebAppUA: function() {
            var res = 0;
            //非IOS
            var ua = navigator.userAgent.toLowerCase();
            if (/iphone|ipad|ipod/.test(ua)) {
                res = 1;
            } else if (/android/.test(ua)) {
                res = 0;
            }
            return res;
        },
        //判断IE8以下浏览器
        validateIE8: function() {
            if ($.browser.msie && ($.browser.version == "8.0" || $.browser.version == "7.0" || $.browser.version == "6.0")) {
                return true;
            } else {
                return false;
            }
        },
        //判断IE9以下浏览器
        validateIE9: function() {
            if ($.browser.msie && ($.browser.version == "9.0" || $.browser.version == "8.0" || $.browser.version == "7.0" || $.browser.version == "6.0")) {
                return true;
            } else {
                return false;
            }
        },
        //获取来源地址 gio上报使用
        getReferrer: function() {
            var referrer = document.referrer;
            var res = "";
            if (/https?\:\/\/[^\s]*wenku.so.com.*$/g.test(referrer)) {
                res = "360wenku";
            } else if (/https?\:\/\/[^\s]*so.com.*$/g.test(referrer)) {
                res = "360";
            } else if (/https?\:\/\/[^\s]*baidu.com.*$/g.test(referrer)) {
                res = "baidu";
            } else if (/https?\:\/\/[^\s]*sogou.com.*$/g.test(referrer)) {
                res = "sogou";
            } else if (/https?\:\/\/[^\s]*sm.cn.*$/g.test(referrer)) {
                res = "sm";
            } else if (/https?\:\/\/[^\s]*ishare.iask.sina.com.cn.*$/g.test(referrer)) {
                res = "ishare";
            } else if (/https?\:\/\/[^\s]*iask.sina.com.cn.*$/g.test(referrer)) {
                res = "iask";
            }
            return res;
        },
        getPageRef: function(fid) {
            var that = this;
            var ref = 0;
            if (that.is360cookie(fid) || that.is360cookie("360")) {
                ref = 1;
            }
            if (that.is360wkCookie()) {
                ref = 3;
            }
            return ref;
        },
        is360cookie: function(val) {
            var that = this;
            var rso = that.getCookie("_r_so");
            if (rso) {
                var split = rso.split("_");
                for (var i = 0; i < split.length; i++) {
                    if (split[i] == val) {
                        return true;
                    }
                }
            }
            return false;
        },
        add360wkCookie: function() {
            this.setCookieWithExpPath("_360hz", "1", 1e3 * 60 * 30, "/");
        },
        is360wkCookie: function() {
            return getCookie("_360hz") == null ? false : true;
        },
        getCookie: function(name) {
            var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
            if (arr !== null) {
                return unescape(arr[2]);
            }
            return null;
        },
        setCookieWithExpPath: function(name, value, timeOut, path) {
            var exp = new Date();
            exp.setTime(exp.getTime() + timeOut);
            document.cookie = name + "=" + escape(value) + ";path=" + path + ";expires=" + exp.toGMTString();
        },
        //gio数据上报上一级页面来源
        findRefer: function() {
            var referrer = document.referrer;
            var res = "other";
            if (/https?\:\/\/[^\s]*\/f\/.*$/g.test(referrer)) {
                res = "pindex";
            } else if (/https?\:\/\/[^\s]*\/d\/.*$/g.test(referrer)) {
                res = "landing";
            } else if (/https?\:\/\/[^\s]*\/c\/.*$/g.test(referrer)) {
                res = "pcat";
            } else if (/https?\:\/\/[^\s]*\/search\/.*$/g.test(referrer)) {
                res = "psearch";
            } else if (/https?\:\/\/[^\s]*\/t\/.*$/g.test(referrer)) {
                res = "ptag";
            } else if (/https?\:\/\/[^\s]*\/[u|n]\/.*$/g.test(referrer)) {
                res = "popenuser";
            } else if (/https?\:\/\/[^\s]*\/ucenter\/.*$/g.test(referrer)) {
                res = "puser";
            } else if (/https?\:\/\/[^\s]*ishare.iask.sina.com.cn.$/g.test(referrer)) {
                res = "ishareindex";
            } else if (/https?\:\/\/[^\s]*\/theme\/.*$/g.test(referrer)) {
                res = "theme";
            } else if (/https?\:\/\/[^\s]*wenku.so.com.*$/g.test(referrer)) {
                res = "360wenku";
            } else if (/https?\:\/\/[^\s]*so.com.*$/g.test(referrer)) {
                res = "360";
            } else if (/https?\:\/\/[^\s]*baidu.com.*$/g.test(referrer)) {
                res = "baidu";
            } else if (/https?\:\/\/[^\s]*sogou.com.*$/g.test(referrer)) {
                res = "sogou";
            } else if (/https?\:\/\/[^\s]*sm.cn.*$/g.test(referrer)) {
                res = "sm";
            } else if (/https?\:\/\/[^\s]*ishare.iask.sina.com.cn.*$/g.test(referrer)) {
                res = "ishare";
            } else if (/https?\:\/\/[^\s]*iask.sina.com.cn.*$/g.test(referrer)) {
                res = "iask";
            }
            return res;
        },
        /*通用对话框(alert)*/
        showAlertDialog: function(title, content, callback) {
            var bgMask = $(".common-bgMask");
            var dialog = $(".common-dialog");
            /*标题*/
            dialog.find("h2[name='title']").text(title);
            /*内容*/
            dialog.find("span[name='content']").html(content);
            /*文件下载dialog关闭按钮事件*/
            dialog.find("a.close,a.btn-dialog").unbind("click").click(function() {
                bgMask.hide();
                dialog.hide();
                /*回调*/
                if (callback && !$(this).hasClass("close")) callback();
            });
            bgMask.show();
            dialog.show();
        },
        browserVersion: function(userAgent) {
            var isOpera = userAgent.indexOf("Opera") > -1;
            //判断是否Opera浏览器
            var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera;
            //判断是否IE浏览器
            var isEdge = userAgent.indexOf("Edge") > -1;
            //判断是否IE的Edge浏览器
            var isFF = userAgent.indexOf("Firefox") > -1;
            //判断是否Firefox浏览器
            var isSafari = userAgent.indexOf("Safari") > -1 && userAgent.indexOf("Chrome") === -1;
            //判断是否Safari浏览器
            var isChrome = userAgent.indexOf("Chrome") > -1 && userAgent.indexOf("Safari") > -1;
            //判断Chrome浏览器
            if (isIE) {
                var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
                reIE.test(userAgent);
                var fIEVersion = parseFloat(RegExp["$1"]);
                if (fIEVersion === 7) {
                    return "IE7";
                } else if (fIEVersion === 8) {
                    return "IE8";
                } else if (fIEVersion === 9) {
                    return "IE9";
                } else if (fIEVersion === 10) {
                    return "IE10";
                } else if (fIEVersion === 11) {
                    return "IE11";
                } else if (fIEVersion === 12) {
                    return "IE12";
                } else {
                    return "IE";
                }
            }
            if (isOpera) {
                return "Opera";
            }
            if (isEdge) {
                return "Edge";
            }
            if (isFF) {
                return "Firefox";
            }
            if (isSafari) {
                return "Safari";
            }
            if (isChrome) {
                return "Chrome";
            }
            return "unKnow";
        },
        getBrowserInfo: function(userAgent) {
            var Sys = {};
            var ua = userAgent.toLowerCase();
            var re = /(msie|firefox|chrome|opera|version|trident).*?([\d.]+)/;
            var m = ua.match(re);
            if (m && m.length >= 2) {
                Sys.browser = m[1].replace(/version/, "'safari") || "unknow";
                Sys.ver = m[2] || "1.0.0";
            } else {
                Sys.browser = "unknow";
                Sys.ver = "1.0.0";
            }
            return Sys.browser + "/" + Sys.ver;
        },
        timeFormat: function(style, time) {
            if (!time) return "";
            var d = new Date(time);
            var year = d.getFullYear();
            //年
            var month = d.getMonth() + 1;
            //月
            var day = d.getDate();
            //日
            var hh = d.getHours();
            //时
            var mm = d.getMinutes();
            //分
            var ss = d.getSeconds();
            //秒
            var clock = year + "-";
            if (month < 10) {
                month += "0";
            }
            if (day < 10) {
                day += "0";
            }
            if (hh < 10) {
                hh += "0";
            }
            if (mm < 10) {
                mm += "0";
            }
            if (ss < 10) {
                ss += "0";
            }
            if (style === "yyyy-mm-dd") {
                return year + "-" + month + "-" + day;
            }
            // yyyy-mm-dd HH:mm:ss
            return year + "-" + month + "-" + day + " " + hh + ":" + mm + ":" + ss;
        }
    };
    //return utils;
    module.exports = utils;
});

define("dist/report/config", [], function(require, exports, module) {
    return {
        COOKIE_FLAG: "_dplf",
        //cookie存储地址
        COOKIE_CIDE: "_dpcid",
        //客户端id cookie地址存储
        COOKIE_CUK: "cuk",
        COOKIE_TIMEOUT: 1e3 * 60 * 50,
        //过期时间
        // SERVER_URL: '/dataReport',                  //接口地址
        SERVER_URL: "/",
        UACTION_URL: "/uAction",
        //用户阅读文档数据上传url
        EVENT_NAME: "pc_click",
        //绑定事件名称
        CONTENT_NAME: "pcTrackContent",
        //上报事件内容名称
        BILOG_CONTENT_NAME: "bilogContent",
        //bilog上报事件内容名称
        ishareTrackEvent: "_ishareTrackEvent",
        //兼容旧事件
        eventCookieFlag: "_eventCookieFlag",
        EVENT_REPORT: false,
        //浏览页事件级上报是否开启
        // 以下为配置项
        AUTO_PV: false
    };
});

/**
 * @Description: jQuery dialog plugin
 */
define("dist/cmd-lib/myDialog", [], function(require, exports, module) {
    //var jQuery = require("$");
    (function($) {
        $.extend($.fn, {
            dialog: function(options) {
                return this.each(function() {
                    var dialog = $.data(this, "diglog");
                    if (!dialog) {
                        dialog = new $.dialog(options, this);
                        $.data(this, "dialog", dialog);
                    }
                });
            }
        });
        var common = {
            zIndex: 1e3,
            getZindex: function() {
                return this.zIndex += 100;
            },
            dialog: {}
        };
        $.dialog = function(options, el) {
            if (arguments.length) {
                this._init(options, el);
            }
        };
        $.dialog.prototype = {
            options: {
                title: "title",
                //标题
                dragable: false,
                //拖拽暂时未实现
                cache: true,
                html: "",
                //template
                width: "auto",
                height: "auto",
                cannelBtn: true,
                //关闭按钮
                confirmlBtn: true,
                //确认按钮
                cannelText: "关闭",
                //按钮文字
                confirmText: "确定",
                //
                showFooter: true,
                onClose: false,
                //关闭回调
                onOpen: false,
                //打开回调
                callback: false,
                showLoading: false,
                loadingTxt: "处理中...",
                onConfirm: false,
                //confirm callback
                onCannel: false,
                //onCannel callback
                getContent: false,
                //getContent callback
                zIndex: common.zIndex,
                closeOnClickModal: true,
                getZindex: function() {
                    return common.zIndex += 100;
                },
                mask_tpl: '<div class="dialog-mask" data-page="mask" style="z-index:' + common.zIndex + ';"></div>'
            },
            //初始化
            _init: function(options, el) {
                this.options = $.extend(true, this.options, options);
                this.element = $(el);
                this._build(this.options.html);
                this._bindEvents();
            },
            //初始化渲染组件html
            _build: function(html) {
                var _html, footer = "", cfBtn = "", clBtn = "", bodyContent = '<div class="body-content"></div>';
                if (html) {
                    _html = html;
                } else {
                    if (this.options.confirmlBtn) {
                        cfBtn = '<button class="confirm">' + this.options.confirmText + "</button>";
                    }
                    if (this.options.cannelBtn) {
                        clBtn = '<button class="cannel">' + this.options.cannelText + "</button>";
                    }
                    if (this.options.showFooter) {
                        footer = '<div class="footer">                                    <div class="buttons">                                        ' + cfBtn + "                                        " + clBtn + "                                    </div>                                </div>";
                    }
                    if (this.options.showFooter) {
                        var h = this.options.height - 80 + "px";
                        bodyContent = '<div class="body-content" style="height:' + h + ';"></div>';
                    } else {
                        bodyContent = '<div class="body-content" style="height:' + this.options.height + ';"></div>';
                    }
                    _html = '<div class="m-dialog" style="z-index:' + this.options.getZindex + ';">								<div class="m-d-header">									<h2 style="width:' + this.options.width + ';">' + this.options.title + '</h2>									<a href="javascript:;" class="btn-close">X</a>								</div>								<div class="m-d-body" style="width:' + this.options.width + ";height:" + this.options.height + ';">									' + bodyContent + "                                </div>" + footer + "</div>";
                }
                if (!$(document).find('[data-page="mask"]').length) {
                    $("body").append(this.options.mask_tpl);
                }
                this.element.html(_html);
            },
            _center: function() {
                var d = this.element.find(".dialog");
                d.css({
                    left: ($(document).width() - d.width()) / 2,
                    top: (document.documentElement.clientHeight - d.height()) / 2 + $(document).scrollTop()
                });
            },
            _bindEvents: function() {
                var that = this;
                this.element.delegate(".close,.cancel", "click", function(e) {
                    e && e.preventDefault();
                    that.close(that.options.onClose);
                });
                $(document).delegate('[data-page="mask"]', "click", function(e) {
                    if (that.options.closeOnClickModal) {
                        e && e.preventDefault();
                        that.close(that.options.onClose);
                    }
                });
                this.element.delegate(".cannel", "click", function(e) {
                    e && e.preventDefault();
                    that._cannel(that.options.onCannel);
                });
                this.element.delegate(".confirm", "click", function(e) {
                    e && e.preventDefault();
                    if ($(this).hasClass("disable")) {
                        return;
                    }
                    if (that.options.showLoading) {
                        $(this).addClass("disable");
                        $(this).html(that.options.loadingTxt);
                    }
                    that._confirm(that.options.onConfirm);
                });
            },
            close: function(cb) {
                this._hide(cb);
                this.clearCache();
            },
            open: function(cb) {
                this._callback(cb);
                this.element.show();
                $('[data-page="mask"]').show();
                //this._center();
                this.clearCache();
            },
            _hide: function(cb) {
                this.element.hide();
                $('[data-page="mask"]').hide();
                if (cb && typeof cb === "function") {
                    this._callback(cb);
                }
            },
            clearCache: function() {
                if (!this.options.cache) {
                    this.element.data("dialog", "");
                }
            },
            _callback: function(cb) {
                if (cb && typeof cb === "function") {
                    cb.call(this);
                }
            },
            _cannel: function(cb) {
                this._hide(cb);
                this.clearCache();
            },
            _confirm: function(cb) {
                if (!this.options.callback) {
                    this._hide(cb);
                    this.clearCache();
                } else {
                    return cb();
                }
            },
            getElement: function() {
                return this.element;
            },
            _getOptions: function() {
                return this.options;
            },
            _setTxt: function(t) {
                return this.element.find(".confirm").html(t);
            },
            destroy: function() {
                var that = this;
                that.element.remove();
            }
        };
        $.extend($.fn, {
            open: function(cb) {
                $(this).data("dialog") && $(this).data("dialog").open(cb);
            },
            close: function(cb) {
                $(this).data("dialog") && $(this).data("dialog").close(cb);
            },
            clear: function() {
                $(this).data("dialog") && $(this).data("dialog").clearCache();
            },
            getOptions: function() {
                return $(this).data("dialog") && $(this).data("dialog")._getOptions();
            },
            getEl: function() {
                return $(this).data("dialog") && $(this).data("dialog").getElement();
            },
            setTxt: function(t) {
                $(this).data("dialog") && $(this).data("dialog")._setTxt(t);
            },
            destroy: function() {
                $(this).data("dialog") && $(this).data("dialog").destroy(t);
            }
        });
    })(jQuery);
});

/**
 * @Description: toast.js
 *
 */
define("dist/cmd-lib/toast", [], function(require, exports, module) {
    //var $ = require("$");
    (function($, win, doc) {
        function Toast(options) {
            this.options = {
                text: "我是toast提示",
                icon: "",
                delay: 3e3,
                callback: false
            };
            //默认参数扩展
            if (options && $.isPlainObject(options)) {
                $.extend(true, this.options, options);
            }
            this.init();
        }
        Toast.prototype.init = function() {
            var that = this;
            that.body = $("body");
            that.toastWrap = $('<div class="ui-toast" style="position:fixed;min-width:200px;padding:0 10px;height:60px;line-height:60px;text-align:center;background:#000;opacity:0.8;filter:alpha(opacity=80);top:40%;left:50%;margin-left:-100px;margin-top:-30px;border-radius:4px;z-index:99999999">');
            that.toastIcon = $('<i class="icon"></i>');
            that.toastText = $('<span class="ui-toast-text" style="color:#fff">' + that.options.text + "</span>");
            that._creatDom();
            that.show();
            that.hide();
        };
        Toast.prototype._creatDom = function() {
            var that = this;
            if (that.options.icon) {
                that.toastWrap.append(that.toastIcon.addClass(that.options.icon));
            }
            that.toastWrap.append(that.toastText);
            that.body.append(that.toastWrap);
        };
        Toast.prototype.show = function() {
            var that = this;
            setTimeout(function() {
                that.toastWrap.removeClass("hide").addClass("show");
            }, 50);
        };
        Toast.prototype.hide = function() {
            var that = this;
            setTimeout(function() {
                that.toastWrap.removeClass("show").addClass("hide");
                that.toastWrap.remove();
                that.options.callback && that.options.callback();
            }, that.options.delay);
        };
        $.toast = function(options) {
            return new Toast(options);
        };
    })($, window, document);
});

define("dist/common/bindphone", [ "dist/application/api", "dist/application/method" ], function(require, exports, moudle) {
    //var $ = require("$");
    var api = require("dist/application/api");
    var method = require("dist/application/method");
    /**
     * 获取图形验证码
     */
    function getCaptcha() {
        var mobile = $("#ip-mobile").val().replace(/\s/g, "");
        if (mobile) {
            $(".login-error span").parent().hide();
            $.get("/cas/captcha/get?mobile=" + mobile, function(data, status) {
                if (status == "success") {
                    /*$(".unlock-pic").html('<img src="'+data+'" onclick="getCaptcha();" width="80" height="42">')*/
                    $(".img-code-item .unlock-pic img").attr("src", data);
                } else {
                    console.log("获取图形验证码异常");
                }
            });
        } else {
            $(".login-error span").text("请输入手机号").parent().show();
        }
    }
    function formatTel(mobile) {
        var value = mobile.replace(/\D/g, "").substring(0, 11);
        var valueLen = value.length;
        if (valueLen > 3 && valueLen < 8) {
            value = value.replace(/^(...)/g, "$1 ");
        } else if (valueLen >= 8) {
            value = value.replace(/^(...)(....)/g, "$1 $2 ");
        }
        return value;
    }
    function handle(flag) {
        if (flag == "1") {
            //334
            var mobile = $("#mobile").val();
            $(".carding-error").hide();
            if (mobile) {
                $("#mobile").val(formatTel(mobile));
                $(".btn-binding-code").removeClass("btn-code-no");
            } else {
                $(".btn-binding-code").addClass("btn-code-no");
            }
        }
    }
    /**
     * 验证码验证
     * @param callback
     */
    function fcheckCode(callback) {
        $.post("/cas-api/checkCode", {
            nationCode: $(".phone-num em").text(),
            mobile: $("#ip-mobile").val().replace(/\s/g, ""),
            smsId: $("#ip-smsId").val(),
            checkCode: $("#ip-checkCode").val()
        }, callback);
    }
    /**
     * 验证提示
     * @param nationCode
     * @param mobile
     * @returns {*}
     */
    function checkMsg(nationCode, mobile) {
        var msg = null;
        if (!mobile) {
            msg = "请输入手机号";
        } else {
            msg = $.checkMobile(nationCode, mobile);
        }
        return msg;
    }
    function checkBindingMobile(uid) {
        $.get("/ucenter/checkUserBindMobile?uid=" + uid, function(data) {
            alert(data);
        });
    }
    var ValidateClick = function() {
        this.callback = null;
        /**
         *  定时器
         */
        function TimerClock() {
            this.maxTimes = 60;
            //计时周期
            this.times = 1e3;
            //计时步伐
            this.timer = null;
            this.ele = null;
            this.callback = null;
            this.beforeShow = null;
            /**
             *
             * @param ele
             * @param beforeShow 执行前处理 返回true 继续 false 终止
             * @param callback回调函数
             */
            this.showTimeClock = function(ele, beforeShow, callback) {
                //倒计时
                this.ele = ele;
                this.beforeShow = beforeShow;
                if (!this.beforeShow()) {
                    return;
                }
                this.ele.text(this.maxTimes);
                var that = this;
                this.callback = callback;
                this.timer = setInterval(function(args) {
                    that.countDown();
                }, this.times);
            };
            /**
             * 每秒计数
             */
            this.countDown = function() {
                if (this.maxTimes > 0) {
                    this.maxTimes = this.maxTimes - 1;
                    this.ele.text(this.maxTimes);
                } else {
                    clearInterval(this.timer);
                    this.callback();
                }
            };
        }
        this.execute = function(data, callbcak) {
            this.callback = callbcak;
            var mobile = $("#ip-mobile").val().replace(/\s/g, "");
            var nationCode = $(".phone-num em").text();
            var captcha = $.trim($captcha.find("input").val());
            //去空格
            var msg = null;
            if (msg = checkMsg(nationCode, mobile)) {
                //$mobile.find('.error-text').text(msg).show();
                $loginError.text(msg).parent().show();
                return;
            }
            //发送短信
            this.sendSms("&nationCode=" + nationCode + "&mobile=" + mobile + "&businessCode=" + data["businessCode"] + "&captcha=" + captcha);
        };
        this.showTimeClock = function() {
            var $checkCode = $(".input-code-div");
            //设置时间倒计时
            new TimerClock().showTimeClock($checkCode.find(".validate-text em"), function() {
                $checkCode.find(".validate-link").hide();
                $checkCode.find(".validate-text").show();
                return true;
            }, function() {
                $checkCode.find(".validate-text").hide();
                $checkCode.find(".validate-link").text("重新获取验证码").show();
            });
        };
        /**
         *  //发送短信
         * @param data
         * @param callback
         */
        this.sendSms = function(data) {
            var _this = this;
            $.get("/cas-api/sendSms?" + getPdata("terminal") + "&" + getPdata("businessSys") + data, _this.callback);
        };
    };
    //检查图形验证码是否正确
    function checkCaptcha(mobile, captcha, callback) {
        $.get("/cas/captcha/check?mobile=" + mobile + "&captcha=" + captcha, callback);
    }
    //检查手机号是否已注册
    function checkMobileRegister(mobile, callback) {
        $.get("/cas/checkMobileRegister?mobile=" + mobile, callback);
    }
    $(function() {
        // debugger
        //手机区号选择
        var $choiceCon = $(".phone-choice");
        var pageType = $("#ip-page-type").val();
        //页面类型
        var $checkCode = $("#ip-checkCode");
        //手机验证码
        var $mobile = $("#mobile");
        //手机号
        var $captcha = $(".login-input-item.img-code-item");
        //图形验证码div
        var $loginError = $(".carding-error span");
        //错误提醒位置
        $choiceCon.find(".phone-num").click(function(e) {
            e.stopPropagation();
            if ($(this).siblings(".phone-more").is(":hidden")) {
                $(this).parent().addClass("phone-choice-show");
                $(this).siblings(".phone-more").show();
            } else {
                $(this).parent().removeClass("phone-choice-show");
                $(this).siblings(".phone-more").hide();
            }
        });
        $(".phone-more").find("a").click(function() {
            var countryNum = $(this).find(".number-con").find("em").text();
            $choiceCon.find(".phone-num").find("em").text(countryNum);
            $choiceCon.removeClass("phone-choice-show");
            $choiceCon.find(".phone-more").hide();
        });
        //手机号格式化(xxx xxxx xxxx)
        $(document).on("keyup", "#mobile", function() {
            handle(1);
        });
        //enter 键
        $(document).keyup(function(event) {
            if (event.keyCode == 13) {
                $(".btn-phone-login").trigger("click");
            }
        });
        //绑定
        $(".btn-bind").click(function() {
            if ($(this).hasClass("btn-code-no")) {
                return;
            }
            var mobile = $mobile.val().replace(/\s/g, "");
            var checkCode = $checkCode.val();
            var nationCode = $(".phone-num em").text();
            if (/^\s*$/g.test(mobile)) {
                $loginError.text("请输入手机号码!").parent().show();
                return;
            }
            if (/^\s*$/g.test(checkCode)) {
                $loginError.text("请输入验证码!").parent().show();
                return;
            }
            var params = {
                nationCode: nationCode,
                mobile: mobile,
                smsId: $checkCode.attr("smsId"),
                checkCode: checkCode
            };
            // $.post('/pay/bindMobile', params, function (data) {
            //     if (data) {
            //         if (data.code == '0') {
            //             $(".binging-main").hide();
            //             $(".binging-success").show();
            //         } else {
            //             $loginError.text(data.msg).parent().show();
            //             $(".carding-error").show();
            //         }
            //     }
            // }, 'json');
            userBindMobile(mobile, $checkCode.attr("smsId"), checkCode);
            function userBindMobile(mobile, smsId, checkCode) {
                // 绑定手机号接口
                $.ajax({
                    headers: {
                        Authrization: method.getCookie("cuk")
                    },
                    url: api.user.userBindMobile,
                    type: "POST",
                    contentType: "application/json; charset=utf-8",
                    data: JSON.stringify({
                        terminal: "pc",
                        mobile: mobile,
                        nationCode: $(".phone-choice .phone-num em").text(),
                        smsId: smsId,
                        checkCode: checkCode
                    }),
                    dataType: "json",
                    success: function(res) {
                        if (res.code == "0") {
                            $(".binging-main").hide();
                            $(".binging-success").show();
                        } else {
                            $loginError.text(res.msg).parent().show();
                            $(".carding-error").show();
                        }
                    },
                    error: function(error) {
                        console.log("userBindMobile:", error);
                    }
                });
            }
        });
        var captcha = function(appId, randstr, ticket, onOff) {
            var _this = $(".binging-main .yz-link");
            if ($(_this).hasClass("btn-code-no")) {
                return;
            }
            var mobile = $mobile.val().replace(/\s/g, "");
            if (/^\s*$/g.test(mobile)) {
                $loginError.text("请输入手机号码!").parent().show();
                return;
            }
            $loginError.parent().hide();
            var param = JSON.stringify({
                // 'phoneNo': mobile,
                // 'businessCode': $(_this).siblings('input[name="businessCode"]').val(),
                // 'appId': appId,
                // 'randstr': randstr,
                // 'ticket': ticket,
                // 'onOff': onOff
                mobile: mobile,
                nationCode: $(".phone-choice .phone-num em").text(),
                businessCode: $(_this).siblings('input[name="businessCode"]').val(),
                // 功能模块（1-注册模块、2-找回密码、3-修改密码、4-登录、5-绑定/更换手机号手机号（会检查手机号是否被使用过）、6-旧手机号获取验证码）
                terminal: "pc",
                appId: appId,
                randstr: randstr,
                ticket: ticket,
                onOff: onOff
            });
            $.ajax({
                type: "POST",
                // url: api.sms.getCaptcha,
                url: api.user.sendSms,
                contentType: "application/json;charset=utf-8",
                dataType: "json",
                data: param,
                success: function(data) {
                    if (data) {
                        if (data.code == "0") {
                            $checkCode.removeAttr("smsId");
                            $checkCode.attr("smsId", data.data.smsId);
                            var yzTime$ = $(_this).siblings(".yz-time");
                            yzTime$.addClass("btn-code-no");
                            yzTime$.show();
                            $(_this).hide();
                            $(".btn-none-bind").hide();
                            $(".btn-bind").show();
                            // $(".btn-binging").removeClass("btn-binging-no");
                            (function countdown() {
                                var yzt = yzTime$.text().replace(/秒后重发$/g, "");
                                yzt = /^\d+$/g.test(yzt) ? Number(yzt) : 60;
                                if (yzt && yzt >= 0) yzTime$.text(--yzt + "秒后重发");
                                if (yzt <= 0) {
                                    yzTime$.text("60秒后重发").hide();
                                    $(_this).text("重获验证码").show();
                                    return;
                                }
                                setTimeout(countdown, 1e3);
                            })();
                        } else if (data.code == "411015") {
                            showCaptcha(captcha);
                        } else if (data.code == "411033") {
                            //图形验证码错误
                            $loginError.text("图形验证码错误").parent().show();
                        } else {
                            $loginError.text(data.msg).parent().show();
                        }
                    } else {
                        $loginError.text("发送短信失败").parent().show();
                    }
                }
            });
        };
        /*获取短信验证码*/
        $(".binging-main").delegate(".yz-link", "click", function() {
            captcha("", "", "", "");
        });
    });
    /**
     * 天御验证码相关功能
     */
    var capt;
    var showCaptcha = function(options) {
        var appId = "2071307690";
        if (!capt) {
            capt = new TencentCaptcha(appId, captchaCallback, {
                bizState: options
            });
        }
        capt.show();
    };
    var captchaCallback = function(res) {
        // res（用户主动关闭验证码）= {ret: 2, ticket: null}
        // res（验证成功） = {ret: 0, ticket: "String", randstr: "String"}
        if (res.ret === 0) {
            res.bizState(res.appid, res.randstr, res.ticket, 1);
        }
    };
    return {
        showCaptcha: showCaptcha
    };
});

// 百度统计 自定义数据上传
var _hmt = _hmt || [];

//此变量百度统计需要  需全局变量
define("dist/common/baidu-statistics", [ "dist/application/method" ], function(require, exports, moudle) {
    var method = require("dist/application/method");
    var fileParams = window.pageConfig && window.pageConfig.params;
    var eventNameList = {
        fileDetailPageView: {
            loginstatus: method.getCookie("cuk") ? 1 : 0,
            userid: window.pageConfig && window.pageConfig.userId || "",
            pageid: "PC-M-FD",
            fileid: fileParams && fileParams.g_fileId,
            filecategoryname: fileParams && fileParams.classidName1 + "||" + fileParams && fileParams.classidName2 + "||" + fileParams && fileParams.classidName3,
            filepaytype: fileParams && fileParams.productType || "",
            // 文件类型
            filecootype: "",
            // 文件来源   
            fileformat: fileParams && fileParams.file_format || ""
        },
        payFileResult: {
            loginstatus: method.getCookie("cuk") ? 1 : 0,
            userid: window.pageConfig && window.pageConfig.userId || "",
            pageid: "PC-M-FD",
            pagename: "",
            payresult: "",
            orderid: "",
            orderpaytype: "",
            orderpayprice: "",
            fileid: "",
            filename: "",
            fileprice: "",
            filecategoryname: "",
            fileformat: "",
            filecootype: "",
            fileuploaderid: ""
        },
        payVipResult: {
            loginstatus: method.getCookie("cuk") ? 1 : 0,
            userid: "",
            pageid: "PC-M-FD",
            pagename: "",
            payresult: "",
            orderid: "",
            orderpaytype: "",
            orderpayprice: "",
            fileid: "",
            filename: "",
            fileprice: "",
            filecategoryname: "",
            fileformat: "",
            filecootype: "",
            fileuploaderid: ""
        },
        loginResult: {
            pagename: $("#ip-page-id").val(),
            pageid: $("#ip-page-name").val(),
            loginType: "",
            userid: "",
            loginResult: ""
        }
    };
    function handle(id) {
        if (id) {
            try {
                (function() {
                    var hm = document.createElement("script");
                    hm.src = "https://hm.baidu.com/hm.js?" + id;
                    var s = document.getElementsByTagName("script")[0];
                    s.parentNode.insertBefore(hm, s);
                })();
            } catch (e) {
                console.error(id, e);
            }
        }
    }
    function handleBaiduStatisticsPush(eventName, params) {
        // vlaue是对象
        var temp = eventNameList[eventName];
        if (eventName == "fileDetailPageView") {
            params = temp;
        }
        if (eventName == "payFileResult") {
            params = $.extend(temp, {
                payresult: params.payresult,
                orderid: params.orderNo,
                orderpaytype: params.orderpaytype
            });
        }
        if (eventName == "payVipResult") {
            params = $.extend(temp, {
                payresult: params.payresult,
                orderid: params.orderNo,
                orderpaytype: params.orderpaytype
            });
        }
        if (eventName == "loginResult") {
            params = $.extend(temp, {
                loginType: params.loginType,
                userid: params.userid,
                loginResult: params.loginResult
            });
        }
        _hmt.push([ "_trackCustomEvent", eventName, params ]);
        console.log("百度统计:", eventName, params);
    }
    return {
        initBaiduStatistics: handle,
        handleBaiduStatisticsPush: handleBaiduStatisticsPush
    };
});

// 通用头部的逻辑
define("dist/application/effect", [ "dist/application/checkLogin", "dist/application/api", "dist/application/method", "dist/application/login", "dist/cmd-lib/jqueryMd5", "dist/common/bilog", "base64", "dist/cmd-lib/util", "dist/report/config", "dist/cmd-lib/myDialog", "dist/cmd-lib/toast", "dist/common/bindphone", "dist/common/baidu-statistics", "dist/application/method" ], function(require, exports, module) {
    var checkLogin = require("dist/application/checkLogin");
    var method = require("dist/application/method");
    $("#unLogin").on("click", function() {
        checkLogin.notifyLoginInterface(function(data) {
            refreshTopBar(data);
        });
    });
    $(".loginOut").on("click", function() {
        checkLogin.ishareLogout();
    });
    $(".top-user-more .js-buy-open").click(function() {
        //  头像续费vip也有使用到
        if ($(this).attr("data-type") == "vip") {
            location.href = "/pay/vip.html";
        }
    });
    $(".vip-join-con").click(function() {
        method.compatibleIESkip("/node/rights/vip.html", true);
    });
    $(".btn-new-search").click(function() {
        if (new RegExp("/search/home.html").test(location.href)) {
            var href = window.location.href.substring(0, window.location.href.indexOf("?")) + "?ft=all";
            var sword = $(".new-input").val() ? $(".new-input").val().replace(/^\s+|\s+$/gm, "") : $(".new-input").attr("placeholder");
            window.location.href = method.changeURLPar(href, "cond", encodeURIComponent(encodeURIComponent(sword)));
        } else {
            var sword = $(".new-input").val() ? $(".new-input").val().replace(/^\s+|\s+$/gm, "") : $(".new-input").attr("placeholder");
            if (sword) {
                method.compatibleIESkip("/search/home.html?ft=all&cond=" + encodeURIComponent(encodeURIComponent(sword)), true);
            }
        }
    });
    $(".new-input").on("keydown", function(e) {
        if (new RegExp("/search/home.html").test(location.href) && e.keyCode === 13) {
            var href = window.location.href.substring(0, window.location.href.indexOf("?")) + "?ft=all";
            var sword = $(".new-input").val() ? $(".new-input").val().replace(/^\s+|\s+$/gm, "") : $(".new-input").attr("placeholder");
            window.location.href = method.changeURLPar(href, "cond", encodeURIComponent(encodeURIComponent(sword)));
        } else {
            if (e.keyCode === 13) {
                var sword = $(".new-input").val() ? $(".new-input").val().replace(/^\s+|\s+$/gm, "") : $(".new-input").attr("placeholder");
                if (sword) {
                    method.compatibleIESkip("/search/home.html?ft=all&cond=" + encodeURIComponent(encodeURIComponent(sword)), true);
                }
            }
        }
    });
    var $detailHeader = $(".new-detail-header");
    var headerHeight = $detailHeader.height();
    $(window).scroll(function() {
        var detailTop = $(this).scrollTop();
        if (detailTop - headerHeight >= 0) {
            $detailHeader.addClass("new-detail-header-fix");
        } else {
            $detailHeader.removeClass("new-detail-header-fix");
        }
    });
    //刷新topbar
    var refreshTopBar = function(data) {
        var $unLogin = $("#unLogin");
        var $hasLogin = $("#haveLogin");
        var $btn_user_more = $(".btn-user-more");
        var $vip_status = $(".vip-status");
        var $icon_iShare = $(".icon-iShare");
        var $top_user_more = $(".top-user-more");
        $btn_user_more.text(data.isVip == 1 ? "续费" : "开通");
        var $target = null;
        //VIP专享资料
        if (method.getCookie("file_state") === "6") {
            $(".vip-title").eq(0).show();
        }
        //vip
        if (data.isVip == 1) {
            $target = $vip_status.find('p[data-type="2"]');
            $target.find(".expire_time").html(data.expireTime);
            $target.show().siblings().hide();
            $top_user_more.addClass("top-vip-more");
            $(".isVip-show").find("span").html(data.expireTime);
            $(".isVip-show").removeClass("hide");
            $(".vip-privilege-btn").html("立即续费");
        } else if (data.userType == 1) {
            $target = $vip_status.find('p[data-type="3"]');
            $hasLogin.removeClass("user-con-vip");
            $target.show().siblings().hide();
        } else if (data.isVip == 0) {
            $hasLogin.removeClass("user-con-vip");
        } else if (data.isVip == 2) {
            console.log("data.isVip:", data.isVip);
        }
        $unLogin.hide();
        $hasLogin.find(".user-link .user-name").html(data.nickName);
        $hasLogin.find(".user-link img").attr("src", data.photoPicURL);
        $hasLogin.find(".top-user-more .name").html(data.nickName);
        $hasLogin.find(".top-user-more img").attr("src", data.photoPicURL);
        $hasLogin.show();
        if (window.pageConfig.params) {
            window.pageConfig.params.isVip = data.isVip;
        }
        var fileDiscount = data.fileDiscount;
        if (fileDiscount) {
            fileDiscount = fileDiscount / 100;
        } else {
            fileDiscount = .8;
        }
        if (window.pageConfig.params) {
            window.pageConfig.params.fileDiscount = fileDiscount;
        }
        $("#ip-uid").val(data.userId);
        $("#ip-isVip").val(data.isVip);
        $("#ip-mobile").val(data.mobile);
    };
    function isLogin(callback, isAutoLogin, callback2) {
        if (!method.getCookie("cuk") && isAutoLogin) {
            checkLogin.notifyLoginInterface(function(data) {
                callback && callback(data);
                callback2 && callback2(data);
                refreshTopBar(data);
            });
        } else if (method.getCookie("cuk")) {
            checkLogin.getLoginData(function(data) {
                // callback2&&callback2()
                callback && callback(data);
                refreshTopBar(data);
            });
        }
    }
    return {
        refreshTopBar: refreshTopBar,
        isLogin: isLogin
    };
});

define("dist/personalCenter/template/userPage/index.html", [], '<div class="personal-header">\n    <div class="person-info">\n        <img src="{{data.photoPicURL}}" alt="">\n        <div class="person-info-left">\n            <p>{{data.nickName}} <img class="whole-station-vip"/><img class="office-vip"/> {{ if data.isAuth==1 }}<i></i>{{/if}}</p>\n            <p>{{ data.userTypeId==1 ? \'普通\' : data.userTypeId==2 ? \'个人\' : \'机构\'}}认证</p>\n        </div>\n    </div>\n    <div class="decrition">个人简介：{{data.cfcDescribe ? data.cfcDescribe : \'暂无简介\'}}</div>    \n</div>\n<div class="personal-container cf">\n    <div class="left fl">\n      \n    </div>\n    <div class="right fl">\n       <div class="right-top">\n           <div class="right-top-item">\n               <p>{{data.readSum}}</p>\n               <p>浏览量</p>\n           </div>\n           <div class="right-top-item">\n               <p>{{data.downSum}}</p>\n               <p>下载量</p>\n           </div>\n           <div class="right-top-item">\n               <p>{{data.fileSize}}</p>\n               <p>资料数</p>\n           </div>\n       </div>\n       <div class="hot-file">\n           <div class="title">热门资料</div>\n           <ul>\n           \n           </ul>\n       </div>\n   </div>\n</div>\n');

define("dist/personalCenter/template/userPage/rightList.html", [], '{{ each rightList as item i }}\n<li>\n    <a href="/f/{{item.item_id}}.html">\n        <div class="info">\n            <p>{{item.title}}</p>\n            <p>{{item.item_read_cnt ? item.item_read_cnt + \'阅读\' : \'\'}}</p>\n        </div>\n        <div class="pic">\n            <img src="{{item.cover_url}}" alt="">\n            <span class="ico-data pos ico-{{item.extra1}}"></span>\n        </div>\n        \n    </a>\n   \n</li>\n{{/each}}');

define("dist/personalCenter/template/userPage/userPageList.html", [], '<div class="title">TA的资料</div>\n<div class="tab">\n    <div class="tab-item {{sortField==\'downNum\' ? \'active\' : \'\' }}" type=\'downNum\'><a href="javascript:;">热门</a></div>\n    <div class="tab-item {{sortField==\'createTime\' ? \'active\' : \'\' }}" type=\'createTime\'><a href="javascript:;">最新</a></div>\n    <div class="format">\n        <div class="format-title">格式<i></i></div>\n        <div class="format-list">\n            <div class="format-list-item" format=\'\'>全部</div>\n            <div class="format-list-item" format=\'doc\'>DOC</div>\n            <div class="format-list-item" format=\'ppt\'>PPT</div>\n            <div class="format-list-item" format=\'pdf\'>PDF</div>\n            <div class="format-list-item" format=\'xls\'>XLS</div>\n            <div class="format-list-item" format=\'txt\'>TXT</div>\n        </div>\n     </div> \n </div>\n<ul>\n    {{ each list.rows as item i }}\n    <li>\n        <a href="/f/{{item.id}}.html">\n         <div class="pic">\n             {{ if item.fileSmallPic }}\n             <img src="{{\'http://pic.iask.com.cn/\'+item.fileSmallPic}}" alt="">\n             {{else}}\n             <img src="/images/default-picture.png" alt="">\n             {{/if}}\n             <span class="ico-data pos ico-{{item.format}}"></span>\n         </div>\n         \n         <div class="info">\n             <p>{{item.title}}</p>\n             <p>{{item.readNum}}阅读 &nbsp; &nbsp;  {{item.totalPage}}页</p>\n         </div>\n        </a>\n    </li>\n    {{/each}}\n</ul>\n<!-- 暂无记录 -->\n{{ if list.rows.length == 0 }}\n<div class="no-record">暂无记录</div>\n{{/if}}\n{{ if list.totalPages.length >1}}\n <div class="pagination-wrapper">\n     <div class="page-list pagination">\n         <div class="page-item js-page-item first" data-currentPage="1">首页</div>\n         {{if currentPage>1}}\n         <div class="page-item js-page-item prev" data-currentPage={{currentPage-1}}>上一页</div> \n         {{/if}}\n         {{each list.totalPages}}\n             {{ if $index >currentPage-3 && $index <=+currentPage +3 }}\n             <div class="page-item js-page-item {{ currentPage == $index+1 ? \'active\':\'\'}}"  data-currentPage={{+$index+1}}>\n                 {{$index+1}}\n             </div>\n             {{/if}}\n         {{/each}}\n\n         {{if currentPage <= list.totalPages.length -3}}\n             <div class="page-more page-item">...</div>\n         {{/if}}\n         {{if currentPage < list.totalPages.length}}\n            <div class="page-item js-page-item" data-currentPage={{+currentPage+1}}>下一页</div>\n          {{/if}}\n         <div class="page-item js-page-item" data-currentPage={{list.totalPages.length}}>尾页</div>\n </div>\n</div>\n{{/if}}');
