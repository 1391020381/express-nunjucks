define(function (require, exports, module) {

    return {
        // 常量映射表
        keyMap: {
            // 访问详情页 localStorage
            ishare_detail_access: 'ISHARE_DETAIL_ACCESS',
            ishare_office_detail_access: 'ISHARE_OFFICE_DETAIL_ACCESS'
        },
        async: function (url, callback, msg, method, data) {
            $.ajax(url, {
                type: method || 'post',
                data: data,
                async: false,
                dataType: 'json',
                headers: {
                    'cache-control': 'no-cache',
                    'Pragma': 'no-cache',
                    'Authrization': this.getCookie('cuk')
                }
            }).done(function (data) {
                callback && callback(data);
            }).fail(function (e) {
                console.log('error===' + msg);
            });
        },
        get: function (u, c, m) {
            $.ajaxSetup({ cache: false });
            this.async(u, c, m, 'get');
        },
        post: function (u, c, m, g, d) {
            this.async(u, c, m, g, d);
        },
        postd: function (u, c, d) {
            this.async(u, c, false, false, d);
        },
        // todo A24 ========== start
        // ajax请求-包装一层，后续所有接口调用都用此方法替换
        customAjax: function (options) {
            var self = this;
            var cuk = this.getCookie('cuk');
            var jsId = this.getLoginSessionId();
            $.ajax({
                type: options.type || 'POST',
                timeout: options.timeout || 30000,
                async: options.async,
                cache: options.cache,
                headers: {
                    // 携带登录token
                    'Authrization': cuk,
                    'cache-control': 'no-cache',
                    'Pragma': 'no-cache',
                    'isharejsid': jsId
                },
                statusCode: {
                    // code码全局处理
                    401: function () {
                        self.delCookie('cuk', '/');
                        self.delCookie('cuk', '/', '.sina.com.cn');
                        self.delCookie('cuk', '/', '.iask.com.cn');
                        self.delCookie('cuk', '/', '.iask.com');
                        $.toast({
                            text: '请重新登录',
                            delay: 2000
                        });
                    }
                },
                contentType: options.contentType || 'application/json;charset=utf-8',
                dataType: options.dataType || 'json',
                url: options.url,
                data: options.data,
                success: options.success,
                error: options.error
            });
        },
        // get请求
        customGet: function (url, params, success, error, isAsync) {
            this.customAjax({
                type: 'GET',
                url: url,
                async: isAsync === false ? isAsync : true,
                cache: false,
                data: params,
                success: success,
                error: error
            });
        },
        // post请求
        customPost: function (url, params, success, error, isAsync) {
            this.customAjax({
                type: 'POST',
                url: url,
                async: isAsync === false ? isAsync : true,
                data: params ? JSON.stringify(params) : params,
                success: success,
                error: error
            });
        },
        // todo A24 ========== end
        // 随机数
        random: function (min, max) {
            return Math.floor(Math.random() * (max - min)) + min;
        },
        // 写cookie（过期时间）
        setCookieWithExpPath: function (name, value, timeOut, path) {
            var now = new Date();
            now.setTime(now.getTime() + timeOut);
            document.cookie = name + '=' + escape(value) + ';path=' + path + ';expires=' + now.toGMTString();
        },
        // 提供360结算方法
        setCookieWithExp: function (name, value, timeOut, path) {
            var exp = new Date();
            exp.setTime(exp.getTime() + timeOut);
            if (path) {
                document.cookie = name + '=' + escape(value) + ';path=' + path + ';expires=' + exp.toGMTString();
            } else {
                document.cookie = name + '=' + escape(value) + ';expires=' + exp.toGMTString();
            }
        },
        // 读 cookie
        getCookie: function (name) {
            var arr = document.cookie.match(new RegExp('(^| )' + name + '=([^;]*)(;|$)'));
            if (arr !== null) {
                return unescape(arr[2]);
            }
            return null;
        },
        // 删除cookie
        delCookie: function (name, path, domain) {
            var now = new Date();
            now.setTime(now.getTime() - 1);
            var cval = this.getCookie(name);
            if (cval != null) {
                if (path && domain) {
                    document.cookie = name + '= \'\' ' + ';domain=' + domain + ';expires=' + now.toGMTString() + ';path=' + path;
                } else if (path) {
                    document.cookie = name + '= \'\' ' + ';expires=' + now.toGMTString() + ';path=' + path;
                } else {
                    document.cookie = name + '=' + cval + ';expires=' + now.toGMTString();
                }
            }
        },
        // 获取 url 参数值
        getQueryString: function (name) {
            var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
            var r = window.location.search.substr(1).match(reg);
            if (r != null) {
                return unescape(r[2]);
            }
            return null;
        },
        url2Obj: function (url) {
            var obj = {};
            var arr1 = url.split('?');
            var arr2 = arr1[1].split('&');
            for (var i = 0; i < arr2.length; i++) {
                var res = arr2[i].split('=');
                obj[res[0]] = res[1];
            }
            return obj;
        },
        // 获取url中参数的值
        getParam: function (name) {
            name = name.replace(/[\[]/, '\\\[').replace(/[\]]/, '\\\]');
            var regexS = '[\\?&]' + name + '=([^&#]*)';
            var regex = new RegExp(regexS);
            var results = regex.exec(window.location.href);
            if (results == null) {
                return '';
            }
            return decodeURIComponent(results[1].replace(/\+/g, ' '));
        },
        getParamsByName: function (url, name) {
            name = name.replace(/[\[]/, '\\\[').replace(/[\]]/, '\\\]');
            var regexS = '[\\?&#]' + name + '=([^&#]*)';
            var regex = new RegExp(regexS);
            var results = regex.exec(url);
            if (results == null) {
                return '';
            }
            return decodeURIComponent(results[1].replace(/\+/g, ' '));
        },
        // 获取本地 localStorage 数据
        getLocalData: function (key) {
            try {
                if (localStorage && localStorage.getItem) {
                    var val = localStorage.getItem(key);
                    return val === null ? null : JSON.parse(val);
                } else {
                    console.log('浏览器不支持html localStorage getItem');
                    return null;
                }
            } catch (e) {
                return null;
            }
        },
        // 获取本地 localStorage 数据
        setLocalData: function (key, val) {
            if (localStorage && localStorage.setItem) {
                localStorage.removeItem(key);
                localStorage.setItem(key, JSON.stringify(val));
            } else {
                console.log('浏览器不支持html localStorage setItem');
            }
        },
        // 浏览器环境判断
        browserType: function () {
            var userAgent = navigator.userAgent; // 取得浏览器的userAgent字符串
            var isOpera = userAgent.indexOf('Opera') > -1;
            if (isOpera) { // 判断是否Opera浏览器
                return 'Opera';
            }
            if (userAgent.indexOf('compatible') > -1 && userAgent.indexOf('MSIE') > -1 && !isOpera) { // 判断是否IE浏览器
                return 'IE';
            }
            if (userAgent.indexOf('Edge') > -1) { // 判断是否IE的Edge浏览器
                return 'Edge';
            }
            if (userAgent.indexOf('Firefox') > -1) {// 判断是否Firefox浏览器
                return 'Firefox';
            }
            if (userAgent.indexOf('Safari') > -1 && userAgent.indexOf('Chrome') === -1) { // 判断是否Safari浏览器
                return 'Safari';
            }
            if (userAgent.indexOf('Chrome') > -1 && userAgent.indexOf('Safari') > -1) { // 判断Chrome浏览器
                return 'Chrome';
            }
        },
        // 判断IE9以下浏览器
        validateIE9: function () {
            return Boolean($.browser.msie && ($.browser.version === '9.0' ||
                $.browser.version === '8.0' ||
                $.browser.version === '7.0' ||
                $.browser.version === '6.0'));
        },
        // 计算两个2个时间相差的天数
        compareTime: function (startTime, endTime) {
            if (!startTime || !endTime) return '';
            return Math.abs((endTime - startTime) / 1000 / 60 / 60 / 24);
        },


        // 修改参数 有参数则修改 无则加
        changeURLPar: function (url, arg, arg_val) {
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
        },
        // 获取url全部参数
        getUrlAllParams: function (urlStr) {
            if (typeof urlStr == 'undefined') {
                var url = decodeURI(location.search); // 获取url中"?"符后的字符串
            } else {
                // eslint-disable-next-line
                var url = '?' + urlStr.split('?')[1];
            }
            var theRequest = new Object();
            if (url.indexOf('?') != -1) {
                var str = url.substr(1);
                var strs = str.split('&');
                for (var i = 0; i < strs.length; i++) {
                    theRequest[strs[i].split('=')[0]] = decodeURI(strs[i].split('=')[1]);
                }
            }
            return theRequest;
        },
        // 获取 url 参数值
        // getQueryString: function (name) {
        //     var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
        //     var r = window.location.search.substr(1).match(reg);
        //     if (r != null) {
        //         return unescape(r[2]);
        //     }
        //     return null;
        // },
        /**
         * 兼容ie document.referrer的页面跳转 替代 window.location.href   window.open
         * @param url
         * @param flag 是否新窗口打开
         */
        compatibleIESkip: function (url, flag) {
            setTimeout(function () {
                var referLink = document.createElement('a');
                referLink.href = url;
                referLink.style.display = 'none';
                if (flag) {
                    referLink.target = '_blank';
                }
                document.body.appendChild(referLink);
                referLink.click();
            }, 350);
        },
        testEmail: function (val) {
            var reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
            if (reg.test(val)) {
                return true; // 正确
            } else {
                return false;
            }
        },
        testPhone: function (val) {
            if (/^1(3|4|5|6|7|8|9)\d{9}$/.test(val)) {
                return true;
            } else {
                return false;
            }
        },
        handleRecommendData: function (list, dictionaryList) {
            var arr = [];
            $(list).each(function (index, item) {
                var temp = {};
                if (item.type == 1) { // 资料
                    // temp = Object.assign({},item,{linkUrl:`/f/${item.tprId}.html`})
                    item.linkUrl = '/f/' + item.tprId + '.html';
                    temp = item;
                }
                if (item.type == 2) { // 链接
                    temp = item;
                }
                if (item.type == 3 && item.tprId && item.expand && item.expand.templateCode && Array.isArray(dictionaryList)) { // 专题页
                    // 专题--且存在模板标识
                    const templateCode = item.expand.templateCode;
                    var targetItem = dictionaryData.filter(function(sItem){
                        // console.log(item.pcode, HotSpotList[i].templateCode);
                        return sItem.pcode === templateCode;
                    });
                    console.log('findArr', findArr[0]);
                    if (targetItem[0]) {
                        if (targetItem[0].order === 4) {
                            // 追加字段-如果为办公站点
                            item.linkUrl = targetItem[0].pvalue + '/' + item.tprId + '.html';
                            temp = item;
                        } else {
                            // 追加字段-非办公站点
                            item.linkUrl = targetItem[0].desc + targetItem[0].pvalue + '/' + item.tprId + '.html';
                            temp = item;
                        }
                    }
                }
                arr.push(temp);
            });
            console.log(arr);
            return arr;
        },
        formatDate: function (fmt) {
            var o = {
                'M+': this.getMonth() + 1, // 月份
                'd+': this.getDate(), // 日
                'h+': this.getHours(), // 小时
                'm+': this.getMinutes(), // 分
                's+': this.getSeconds(), // 秒
                'q+': Math.floor((this.getMonth() + 3) / 3), // 季度
                'S': this.getMilliseconds() // 毫秒
            };
            if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, String(this.getFullYear()).substr(4 - RegExp.$1.length));
            for (var k in o)
                if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(String(o[k]).length));
            return fmt;
        },
        formatDateV2: function (fmt, time) {
            var date = new Date(time);
            var o = {
                'M+': date.getMonth() + 1, // 月份
                'd+': date.getDate(), // 日
                'h+': date.getHours(), // 小时
                'm+': date.getMinutes(), // 分
                's+': date.getSeconds(), // 秒
                'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
                'S': date.getMilliseconds() // 毫秒
            };
            if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, String(date.getFullYear()).substr(4 - RegExp.$1.length));
            for (var k in o)
                if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(String(o[k]).length));
            return fmt;
        },
        getReferrer: function () {
            var referrer = document.referrer;
            var res = '';
            if (/https?\:\/\/[^\s]*so.com.*$/g.test(referrer)) {
                res = '360';
            } else if (/https?\:\/\/[^\s]*baidu.com.*$/g.test(referrer)) {
                res = 'baidu';
            } else if (/https?\:\/\/[^\s]*sogou.com.*$/g.test(referrer)) {
                res = 'sogou';
            } else if (/https?\:\/\/[^\s]*sm.cn.*$/g.test(referrer)) {
                res = 'sm';
            }
            return res;
        },
        judgeSource: function (ishareBilog) {
            if (!ishareBilog) {
                ishareBilog = {};
            }
            ishareBilog.searchEngine = '';
            var from = '';
            from = utils.getQueryVariable('from');
            if (!from) {
                from = sessionStorage.getItem('webWxFrom') || utils.getCookie('webWxFrom');
            }
            if (from) {
                ishareBilog.source = from;
                sessionStorage.setItem('webWxFrom', from);
                sessionStorage.removeItem('webReferrer');
            } else {
                var referrer = sessionStorage.getItem('webReferrer') || utils.getCookie('webReferrer');
                if (!referrer) {
                    referrer = document.referrer;
                }
                if (referrer) {
                    sessionStorage.setItem('webReferrer', referrer);
                    sessionStorage.removeItem('webWxFrom');
                    referrer = referrer.toLowerCase(); // 转为小写
                    var webSites = new Array('google.', 'baidu.', '360.', 'sogou.', 'shenma.', 'bing.');
                    var searchEngineArr = new Array('google', 'baidu', '360', 'sogou', 'shenma', 'bing');
                    for (var i = 0, l = webSites.length; i < l; i++) {
                        if (referrer.indexOf(webSites[i]) >= 0) {
                            ishareBilog.source = 'searchEngine';
                            ishareBilog.searchEngine = searchEngineArr[i];
                        }
                    }
                }
                if (!referrer || !ishareBilog.source) {
                    if (utils.isWeChatBrow()) {
                        ishareBilog.source = 'wechat';
                    } else {
                        ishareBilog.source = 'outLink';
                    }
                }
            }
            return ishareBilog;
        },
        // 随机数
        randomString: function (len) {
            len = len || 4;
            var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
            /** **默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
            var maxPos = $chars.length;
            var pwd = '';
            for (var i = 0; i < len; i++) {
                pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
            }
            return pwd;
        },
        // 登录状态保存 默认30天
        saveLoginToken: function (token, timeout) {
            timeout = timeout || 7776000000;
            this.setCookieWithExpPath('cuk', token, timeout, '/');
        },
        // 清除
        delLoginToken: function () {
            this.delCookie('ui', '/');
            this.delCookie('userId', '/');
            this.delCookie('cuk', '/');
            this.delCookie('cuk', '/', '.sina.com.cn');
            this.delCookie('cuk', '/', '.iask.com.cn');
            this.delCookie('cuk', '/', '.iask.com');
        },
        // 获取
        getLoginToken: function () {
            return this.getCookie('cuk') || '';
        },
        // 登录id保存
        saveLoginSessionId: function (id) {
            // 保存30天
            this.setCookieWithExpPath('ISHJSSID', id, 7776000000, '/');
        },
        // 删除登录sessionId
        delLoginSessionId: function () {
            this.delCookie('ISHJSSID', '/');
        },
        // 获取登录sessionId
        getLoginSessionId: function () {
            return this.getCookie('ISHJSSID') || '';
        },
        isIe8: function isIe8() {
            // var DEFAULT_VERSION = 8.0;
            // var ua = navigator.userAgent.toLowerCase();
            // var isIE = ua.indexOf("msie")>-1;
            // var safariVersion;
            // if(isIE){
            // safariVersion =  ua.match(/msie ([\d.]+)/)[1];
            // }
            // if(safariVersion <= DEFAULT_VERSION ){
            //    return true
            // }else{
            //     return false
            // }
            if (Array.isArray) {
                return true;
            } else {
                return false;
            }
        }
    };
});

