module.exports = {
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
    timeFormat: function (style, time) {
        if (!time) return '';
        var d = new Date(time);
        var year = d.getFullYear();       //年
        var month = d.getMonth() + 1;     //月
        var day = d.getDate();            //日
        var hh = d.getHours();            //时
        var mm = d.getMinutes();          //分
        var ss = d.getSeconds();          //秒
        var clock = year + "-";
        if (month < 10) {
            month += '0';
        }
        if (day < 10) {
            day += '0';
        }
        if (hh < 10) {
            hh += '0';
        }
        if (mm < 10) {
            mm += '0';
        }

        if (ss < 10) {
            ss += '0';
        }
        if (style === 'yyyy-mm-dd') {
            return year + '-' + month + '-' + day;
        }
        // yyyy-mm-dd HH:mm:ss
        return year + '-' + month + '-' + day + ' ' + hh + ':' + mm + ':' + ss;
    },
    getCategoryId: function (pathname) {
        var regExp = /(?<=(\/c\/)).+(?=(.html))/;
        var matchResult = pathname.match(regExp);
        if (matchResult && matchResult.length > 0) {
            var splitArr = matchResult[0].split('_');
            return splitArr[0];
        }
        return '';
    },
    getCategoryParam: function (pathname) {
        var res = null;
        var regExp = /(?<=(\/c\/)).+(?=(.html))/;
        var matchResult = pathname.match(regExp);
        if (matchResult && matchResult.length > 0) {
            var partArr = matchResult[0].split('-');
            if (partArr.length > 1) {
                var subArr = partArr[0];
                res = {
                    cid: subArr.split('_')[0],
                    order: partArr[1] || 'all',
                    page: subArr.split('_')[1],
                    specifics: [],
                    subUrl: matchResult[0]
                };
                if (partArr.length > 2) {
                    for (var t = 2; t < partArr.length; t++) {
                        var as = partArr[t];
                        res.specifics.push(as);
                    }
                }
            } else {
                res = {
                    cid: partArr[0],
                    order: 'all',
                    page: 1,
                    specifics: []
                }
            }
        }
        return res;
    }
};