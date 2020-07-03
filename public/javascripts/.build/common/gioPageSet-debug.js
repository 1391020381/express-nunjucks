define("dist/common/gioPageSet-debug", [], function(require, exports, module) {
    module.exports = {
        gioPageSet: function(data) {
            //页面级 埋点上报
            var referrer = document.referrer;
            var href = window.location.href;
            var sourcePage = null;
            var currentPageType = null;
            var config = {
                home: new RegExp("ishare.iask.sina.com.cn/").test(referrer),
                homeCurrent: new RegExp("ishare.iask.sina.com.cn/").test(href),
                ishareindex: "ishareindex",
                f: new RegExp("ishare.iask.sina.com.cn/f/").test(referrer),
                fCurrent: new RegExp("ishare.iask.sina.com.cn/f/").test(href),
                pindex: "pindex",
                c: new RegExp("ishare.iask.sina.com.cn/c/").test(referrer),
                cCurrent: new RegExp("ishare.iask.sina.com.cn/c/").test(href),
                pcat: "pcat",
                search: new RegExp("ishare.iask.sina.com.cn/search/").test(referrer),
                searchCurrent: new RegExp("ishare.iask.sina.com.cn/search/").test(href),
                psearch: "psearch",
                ucenter: new RegExp("ishare.iask.sina.com.cn/ucenter/").test(referrer),
                ucenterCurrent: new RegExp("ishare.iask.sina.com.cn/ucenter/").test(href),
                puser: "puser",
                t: new RegExp("ishare.iask.sina.com.cn/t/").test(referrer),
                tCurrent: new RegExp("ishare.iask.sina.com.cn/t/").test(href),
                ptag: "ptag",
                d: new RegExp("ishare.iask.sina.com.cn/d/").test(referrer),
                dCurrent: new RegExp("ishare.iask.sina.com.cn/d/").test(href),
                landing: "landing",
                themeindex: new RegExp("ishare.iask.sina.com.cn/theme").test(referrer),
                themeindexCurrent: new RegExp("ishare.iask.sina.com.cn/theme").test(href),
                theme: "theme",
                u: new RegExp("ishare.iask.sina.com.cn/u/").test(referrer),
                uCurrent: new RegExp("ishare.iask.sina.com.cn/u/").test(href),
                n: new RegExp("ishare.iask.sina.com.cn/n/").test(referrer),
                nCurrent: new RegExp("ishare.iask.sina.com.cn/n/").test(href),
                popenuser: "popenuser"
            };
            //来源页面
            if (config.search) {
                sourcePage = config.psearch;
            } else if (config.themeindex) {
                sourcePage = config.theme;
            } else if (config.d) {
                sourcePage = config.landing;
            } else if (config.t) {
                sourcePage = config.ptag;
            } else if (config.ucenter) {
                sourcePage = config.puser;
            } else if (config.c) {
                sourcePage = config.pcat;
            } else if (config.f) {
                sourcePage = config.pindex;
            } else if (config.u || config.n) {
                sourcePage = config.popenuser;
            } else if (config.home) {
                sourcePage = config.ishareindex;
            } else {
                sourcePage = "other";
            }
            //页面类型
            if (config.searchCurrent) {
                currentPageType = config.psearch;
            } else if (config.themeindexCurrent) {
                currentPageType = config.theme;
            } else if (config.dCurrent) {
                currentPageType = config.landing;
            } else if (config.tCurrent) {
                currentPageType = config.ptag;
            } else if (config.ucenterCurrent) {
                currentPageType = config.puser;
            } else if (config.cCurrent) {
                currentPageType = config.pcat;
            } else if (config.fCurrent) {
                currentPageType = config.pindex;
            } else if (config.uCurrent || config.nCurrent) {
                currentPageType = config.popenuser;
            } else if (config.homeCurrent) {
                currentPageType = config.ishareindex;
            } else {
                currentPageType = "other";
            }
            //currentUrl_pvar  sourcePage_pvar currentPageType_pvar     这三个参数是页面级埋点 必传参数
            // 其他参数  的 值  由调用 页面确认；
            var params = {
                currentUrl_pvar: decodeURIComponent(decodeURIComponent(href)),
                // 当前地址
                sourcePage_pvar: sourcePage,
                //来源页面
                currentPageType_pvar: currentPageType
            };
            for (var key in data) {
                params[key] = data[key];
            }
            __pc__.gioPage(params);
        }
    };
});