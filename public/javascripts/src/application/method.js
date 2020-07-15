define(function (require, exports, module) {
    //var $ = require("$");
    return {
        // 常量映射表
        keyMap: {
            // 访问详情页 localStorage
            ishare_detail_access: 'ISHARE_DETAIL_ACCESS',
            ishare_office_detail_access: 'ISHARE_OFFICE_DETAIL_ACCESS'
        },
        async: function (url, callback, msg, method, data) {
            $.ajax(url, {
                type: method || "post",
                data: data,
                async: false,
                dataType: "json",
                headers: {
                    'cache-control': 'no-cache',
                    'Pragma': 'no-cache'
                }
            }).done(function (data) {
                callback && callback(data);
            }).fail(function (e) {
                console.log("error===" + msg);
            })
        },
        get: function (u, c, m) {
            $.ajaxSetup({ cache: false });
            this.async(u, c, m, 'get');
        },
        post: function (u, c, m, g, d) {
            this.async(u, c, m, g, d)
        },
        postd: function (u, c, d) {
            this.async(u, c, false, false, d)
        },
        //随机数
        random: function (min, max) {
            return Math.floor(Math.random() * (max - min)) + min;
        },
        // 写cookie（过期时间）
        setCookieWithExpPath: function (name, value, timeOut, path) {
            var now = new Date();
            now.setTime(now.getTime() + timeOut);
            document.cookie = name + "=" + escape(value) + ";path=" + path + ";expires=" + now.toGMTString();
        },
        //提供360结算方法
        setCookieWithExp: function (name, value, timeOut, path) {
            var exp = new Date();
            exp.setTime(exp.getTime() + timeOut);
            if (path) {
                document.cookie = name + "=" + escape(value) + ";path=" + path + ";expires=" + exp.toGMTString();
            } else {
                document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
            }
        },
        //读 cookie
        getCookie: function (name) {
            var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
            if (arr !== null) {
                return unescape(arr[2]);
            }
            return null;
        },
        //删除cookie
        delCookie: function (name, path, domain) {
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
        getQueryString: function (name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) {
                return unescape(r[2]);
            }
            return null;
        },
        url2Obj: function (url) {
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
        getParam: function (name) {
            name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
            var regexS = "[\\?&]" + name + "=([^&#]*)";
            var regex = new RegExp(regexS);
            var results = regex.exec(window.location.href);
            if (results == null) {
                return "";
            }
            return decodeURIComponent(results[1].replace(/\+/g, " "));
        },
        // 获取本地 localStorage 数据
        getLocalData: function (key) {
            try {
                if (localStorage && localStorage.getItem) {
                    var val = localStorage.getItem(key);
                    return val === null ? null : JSON.parse(val);
                } else {
                    console.log('浏览器不支持html localStorage getItem');
                    return null
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
            var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
            var isOpera = userAgent.indexOf("Opera") > -1;
            if (isOpera) { //判断是否Opera浏览器
                return 'Opera';
            }
            if (userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera) { //判断是否IE浏览器
                return 'IE';
            }
            if (userAgent.indexOf("Edge") > -1) { //判断是否IE的Edge浏览器
                return "Edge"
            }
            if (userAgent.indexOf("Firefox") > -1) {//判断是否Firefox浏览器
                return "Firefox"
            }
            if (userAgent.indexOf("Safari") > -1 && userAgent.indexOf("Chrome") === -1) {  //判断是否Safari浏览器
                return "Safari"
            }
            if (userAgent.indexOf("Chrome") > -1 && userAgent.indexOf("Safari") > -1) { //判断Chrome浏览器
                return "Chrome"
            }
        },
        //判断IE9以下浏览器
        validateIE9: function () {
            return !!($.browser.msie && (($.browser.version === "9.0")
                || $.browser.version === "8.0"
                || $.browser.version === "7.0"
                || $.browser.version === "6.0"));
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
        //获取url全部参数
        getUrlAllParams: function (urlStr) {
            if (typeof urlStr == "undefined") {
                var url = decodeURI(location.search); //获取url中"?"符后的字符串
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
        getQueryString: function (name) {
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
        compatibleIESkip: function (url, flag) {
            var referLink = document.createElement('a');
            referLink.href = url;
            referLink.style.display = 'none';
            if (flag) {
                referLink.target = '_blank';
            }
            document.body.appendChild(referLink);
            referLink.click();
        },
        testEmail:function(val){
            var reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
            if(reg.test(val)){
               return true    //正确
            }else{
               return false
            }
        },
        testPhone:function(val){
            if(/^1(3|4|5|7|8)\d{9}$/.test(val)){ 
                return true; 
            }else{
                return false
            } 
        },
        handleRecommendData:function(list){
            var arr = []
            $(list).each(function(index,item){
                var temp = {}
                if(item.type == 1){ // 资料 
                    // temp = Object.assign({},item,{linkUrl:`/f/${item.tprId}.html`})
                    item.linkUrl = '/f/'+ item.tprId+'.html'
                    temp = item
                }
                if(item.type == 2){ // 链接
                    temp = item
                }
                if(item.type == 3){ // 专题页
                    // temp = Object.assign({},item,{linkUrl:`/node/s/${item.tprId}.html`})
                    item.linkUrl = '/node/s/'+ item.tprId + '.html'
                    temp = item
                }
                arr.push(temp)
            })
            console.log(arr)
            return arr
        },
        formatDate:function(fmt){
            var o = {
                "M+": this.getMonth() + 1, //月份
                "d+": this.getDate(), //日
                "h+": this.getHours(), //小时
                "m+": this.getMinutes(), //分
                "s+": this.getSeconds(), //秒
                "q+": Math.floor((this.getMonth() + 3) / 3), //季度
                "S": this.getMilliseconds() //毫秒
            };
            if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
            for (var k in o)
                if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            return fmt;
        }
    }
});