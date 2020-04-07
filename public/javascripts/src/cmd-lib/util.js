/**
 * @Description: 工具类
 */

define(function(require, exports, module) {
    // var $ = require("$");
    var utils = {
        //节流函数 func 是传入执行函数，wait是定义执行间隔时间
        throttle : function(func , wait ){
            var last,deferTimer;
            return function(args){
                var that = this;
                var _args = arguments;
                //当前时间
                var now = +new Date();
                //将当前时间和上一次执行函数时间对比
                //如果差值大于设置的等待时间就执行函数
                if(last && now < last + wait){
                    clearTimeout(deferTimer)
                    deferTimer = setTimeout(function(){
                        last = now;
                        func.apply(that, _args);
                    },wait)
                }else{
                    last = now;
                    func.apply(that , _args);
                }
            }
        },
        //防抖函数 func 是传入执行函数，wait是定义执行间隔时间
        debounce : function(func , wait){
            //缓存一个定时器id 
            var timer = 0;
            var that = this;
            return function(args){
                if(timer) clearTimeout(timer);
                timer = setTimeout(function(){
                    func.apply(that , args);
                },wait)
            }
        },
        //判断是否微信浏览器
        isWeChatBrow:function(){
            var ua = navigator.userAgent.toLowerCase();
            var isWeixin = (ua.indexOf('micromessenger') != -1);
            if (isWeixin) {
                return true;
            }else{
                return false;
            }
        },
        //识别是ios 还是 android
        getWebAppUA:function(){
            var res = 0;//非IOS
            var ua = navigator.userAgent.toLowerCase();
            if (/iphone|ipad|ipod/.test(ua)) {
                res = 1;
            } else if (/android/.test(ua)) {
                res = 0;
            }
            return res;
        },
        //判断IE8以下浏览器
        validateIE8 : function () {
            if ($.browser.msie && ( $.browser.version == "8.0"
                || $.browser.version == "7.0"
                || $.browser.version == "6.0")){
                return true;
            }else{
                return false;
            }
        },
        //判断IE9以下浏览器
        validateIE9 : function () {
            if ($.browser.msie && (($.browser.version == "9.0")
                || $.browser.version == "8.0"
                || $.browser.version == "7.0"
                || $.browser.version == "6.0")){
                return true;
            }else{
                return false;
            }
        },
        //获取来源地址 gio上报使用
        getReferrer:function(){
            var referrer = document.referrer;
            var res = "";
            if (/https?\:\/\/[^\s]*wenku.so.com.*$/g.test(referrer)) {
                res = '360wenku';
            } else if (/https?\:\/\/[^\s]*so.com.*$/g.test(referrer)) {
                res = '360';
            } else if (/https?\:\/\/[^\s]*baidu.com.*$/g.test(referrer)) {
                res = 'baidu';
            } else if (/https?\:\/\/[^\s]*sogou.com.*$/g.test(referrer)) {
                res = 'sogou';
            } else if (/https?\:\/\/[^\s]*sm.cn.*$/g.test(referrer)) {
                res = 'sm';
            }  else if (/https?\:\/\/[^\s]*ishare.iask.sina.com.cn.*$/g.test(referrer)) {
                res = 'ishare';
            } else if (/https?\:\/\/[^\s]*iask.sina.com.cn.*$/g.test(referrer)) {
                res = 'iask';
            }
            return res;
        },
        getPageRef:function(fid){
            var that = this;
            var ref = 0;
            if(that.is360cookie(fid)||that.is360cookie("360")){
                ref = 1;
            }
            if (that.is360wkCookie()){
                ref = 3;
            }
            return ref;
        },
        is360cookie : function(val){
            var that = this;
            var rso = that.getCookie('_r_so');
            if(rso){
                var split = rso.split("_");
                for (var i=0;i<split.length;i++) {
                    if(split[i] == val){
                        return true;
                    }
                }
            }
            return false;
        },
        add360wkCookie : function(){
            this.setCookieWithExpPath('_360hz', '1',1000*60*30, '/');
        },
        is360wkCookie : function(){
            return getCookie("_360hz") == null?false:true;
        },
        getCookie : function(name){
            var arr = document.cookie.match(new RegExp("(^| )"+name+"=([^;]*)(;|$)"));
            if(arr !== null){
                return unescape(arr[2]);
            }
            return null;
        },
        setCookieWithExpPath : function(name, value, timeOut, path) {
            var exp = new Date();
            exp.setTime(exp.getTime() + timeOut);
            document.cookie = name + "=" + escape(value) + ";path=" + path + ";expires=" + exp.toGMTString();
        },
        //gio数据上报上一级页面来源
        findRefer:function(){
            var referrer = document.referrer;
            var res = 'other';
            if (/https?\:\/\/[^\s]*\/f\/.*$/g.test(referrer)) {
                res = 'pindex';
            } else if (/https?\:\/\/[^\s]*\/d\/.*$/g.test(referrer)) {
                res = 'landing';
            } else if (/https?\:\/\/[^\s]*\/c\/.*$/g.test(referrer)) {
                res = 'pcat';
            } else if (/https?\:\/\/[^\s]*\/search\/.*$/g.test(referrer)) {
                res = 'psearch';
            } else if (/https?\:\/\/[^\s]*\/t\/.*$/g.test(referrer)) {
                res = 'ptag';
            } else if (/https?\:\/\/[^\s]*\/[u|n]\/.*$/g.test(referrer)) {
                res = 'popenuser';
            } else if (/https?\:\/\/[^\s]*\/ucenter\/.*$/g.test(referrer)) {
                res = 'puser';
            }  else if (/https?\:\/\/[^\s]*ishare.iask.sina.com.cn.$/g.test(referrer)) {
                res = 'ishareindex';
            } else if (/https?\:\/\/[^\s]*\/theme\/.*$/g.test(referrer)) {
                res = 'theme';
            }  else  if (/https?\:\/\/[^\s]*wenku.so.com.*$/g.test(referrer)) {
                res = '360wenku';
            } else  if (/https?\:\/\/[^\s]*so.com.*$/g.test(referrer)) {
                res = '360';
            } else if (/https?\:\/\/[^\s]*baidu.com.*$/g.test(referrer)) {
                res = 'baidu';
            } else if (/https?\:\/\/[^\s]*sogou.com.*$/g.test(referrer)) {
                res = 'sogou';
            } else if (/https?\:\/\/[^\s]*sm.cn.*$/g.test(referrer)) {
                res = 'sm';
            }  else if (/https?\:\/\/[^\s]*ishare.iask.sina.com.cn.*$/g.test(referrer)) {
                res = 'ishare';
            } else if (/https?\:\/\/[^\s]*iask.sina.com.cn.*$/g.test(referrer)) {
                res = 'iask';
            }
            return res;
        },
        /*通用对话框(alert)*/
        showAlertDialog : function (title, content, callback) {
            var bgMask = $(".common-bgMask");
            var dialog = $(".common-dialog");
            /*标题*/
            dialog.find("h2[name='title']").text(title);
            /*内容*/
            dialog.find("span[name='content']").html(content);
            /*文件下载dialog关闭按钮事件*/
            dialog.find("a.close,a.btn-dialog").unbind("click").click(function () {
                bgMask.hide();
                dialog.hide();
                /*回调*/
                if (callback && !$(this).hasClass("close")) callback();
            });
            bgMask.show();
            dialog.show();
        },
        browserVersion: function (userAgent) {
            var isOpera = userAgent.indexOf("Opera") > -1; //判断是否Opera浏览器
            var isIE = userAgent.indexOf("compatible") > -1
                && userAgent.indexOf("MSIE") > -1 && !isOpera; //判断是否IE浏览器
            var isEdge = userAgent.indexOf("Edge") > -1; //判断是否IE的Edge浏览器
            var isFF = userAgent.indexOf("Firefox") > -1; //判断是否Firefox浏览器
            var isSafari = userAgent.indexOf("Safari") > -1
                && userAgent.indexOf("Chrome") === -1; //判断是否Safari浏览器
            var isChrome = userAgent.indexOf("Chrome") > -1
                && userAgent.indexOf("Safari") > -1; //判断Chrome浏览器

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
            return 'unKnow'
        },
        getBrowserInfo : function (userAgent){
            var Sys = {};
            var ua = userAgent.toLowerCase();
            var re =/(msie|firefox|chrome|opera|version|trident).*?([\d.]+)/;
            var m = ua.match(re);
            if (m && m.length>=2){
                Sys.browser = m[1].replace(/version/, "'safari")||'unknow';
                Sys.ver = m[2]||'1.0.0';
            }else{
                Sys.browser = 'unknow';
                Sys.ver = '1.0.0';
            }

            return Sys.browser+"/"+Sys.ver;
       }
    }
    //return utils;
    module.exports = utils;
});