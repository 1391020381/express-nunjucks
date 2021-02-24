
define(function (require, exports, module) {
    require("../cmd-lib/toast");
    var method = require("../application/method");
    var api = require("../application/api");
    var login = require("../application/checkLogin");
    var isLogin = require('../application/effect.js').isLogin;
    var paradigm4Report = require('../common/paradigm4-report');
    var pageParams = window.pageConfig.page || {};
    var userInfo = {};
    var userData = '';
    var recommendInfoItem = {}, paradigm4GuessData = [];
    var formatEnum = {
        'doc': 'DOC',
        'ppt': 'PPT',
        'pdf': 'PDF',
        'xls': 'XLS',
        'txt': 'TXT'
    }
    isLogin(init, false);

    function init(data) {
        userInfo = data;
        // 获取他人主页信息
        getOtherUser();
        
        $(document).on('click', '.format-title', function () {
            $('.format-list').toggle();
            if ($('.format-title').find('i').hasClass('rotate')) {
                $('.format-title').find('i').removeClass('rotate');
            } else {
                $(this).find('i').addClass('rotate');
            }
        });
        
        $(document).on('click', '.format-list-item', function () {
            var format = $(this).attr('format');
            var curHref = window.location.href.split('?')[0];
            var curQuery = '';
            var sortField = method.getQueryString('sort');
            if (sortField && format) {
                curQuery = '?sort=' + sortField + '&format=' + format; 
            } else if (!sortField && format) {
                curQuery = '?format=' + format; 
            } else if (sortField && !format) {
                curQuery = '?sort=' + sortField;
            }
            window.location.href = curHref + curQuery;
        });

        $(document).on('click', '.hot-file ul li', function () {
            var itemId = $(this).data('id');
            paradigm4Report.eventReport(itemId, paradigm4GuessData, recommendInfoItem);
        });
    }

    function getOtherUser() {
        $.ajax({
            url: api.user.getOtherUser,
            type: "get",
            data: {
                uid: pageParams.uid
            },
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (res) {
                if (res.code == '0') {
                    userData = res.data;
                    userData.readSum = userData.readSum > 10000 ? (userData.readSum / 10000).toFixed(1) + 'w+' : userData.readSum
                    userData.downSum = userData.downSum > 10000 ? (userData.downSum / 10000).toFixed(1) + 'w+' : userData.downSum
                    userData.fileSize = userData.fileSize > 10000 ? (userData.fileSize / 10000).toFixed(1) + 'w+' : userData.fileSize
                    var _html = template.compile(require('./template/userPage/index.html'))({ data: userData });
                    $(".container").html(_html);
                    var isMasterVip = userData.isVip && userData.vipSiteList.indexOf(4) >= 0;
                    var isOfficeVip = userData.isVip && userData.vipSiteList.indexOf(0) >= 0;
                    if (!isMasterVip) {
                        $('.personal-header .person-info-left .whole-station-vip').hide();
                    }
                    if (!isOfficeVip) {
                        $('.personal-header .person-info-left .office-vip').hide();
                    }
                    fetchHotRecommList();
                    recommend();
                } else {
                    $.toast({
                        text: res.message,
                        delay: 3000,
                    });
                }
            }
        });
    }

    function recommend() { //推荐位 第四范式
        $ajax(api.recommend.recommendConfigInfo, 'post', ['ishare_personality']).then(function (res) {
            if (res.code == '0') {
                paradigm4Relevant(res.data);
            } else {
                $.toast({
                    text: res.message,
                    delay: 3000,
                });
            }
        });
    }

    function paradigm4Relevant(data) {
        var requestId = Math.random().toString().slice(-10);
        var userId = method.getCookie('userId') || method.getCookie('visitor_id');
        var sceneID = data[0].useId;
        $ajax('/detail/like/' + sceneID, 'POST', {
            requestId: requestId,
            userId: userId
        }).then(function (res) {
            var _html = template.compile(require('./template/userPage/rightList.html'))({ rightList: res.data });
            $('.hot-file ul').html(_html);
            paradigm4GuessData = res.data;
            recommendInfoItem = data[0];
            recommendInfoItem.requestId = requestId;
            paradigm4Report.pageView(paradigm4GuessData, recommendInfoItem);//上报第四范式      
        })
    }

    // 返回分页链接构造器
    function renderCurrentUrl() {
        var sortField = method.getQueryString('sort');
        var format = method.getQueryString('format') || '';
        var curHref = window.location.href.split('?')[0];
        var curQuery = '';
        if (sortField && format) {
            curQuery = '?sort=' + sortField + '&format=' + format + '&page='; 
        } else if (!sortField && format) {
            curQuery = '?format=' + format + '&page='; 
        } else if (sortField && !format) {
            curQuery = '?sort=' + sortField + '&page=';
        } else {
            curQuery = '?page=';
        }
        return curHref + curQuery;
    }

    /**
     * 获取热门最新资料列表
     * @param current {number} 当前分页
     * @param sortField {string} 排序方式  downNum热门 createTime最新
     * @param format {string} 格式
     * */ 
    function fetchHotRecommList() { //热门 推荐  
        var current = method.getQueryString('page') || 1;
        var sortField = method.getQueryString('sort') || 'downNum';
        var format = method.getQueryString('format') || '';
        var currentUrl = renderCurrentUrl();
        
        $.ajax({
            url: api.user.getSearchList,
            type: "post",
            data: JSON.stringify({
                currentPage: current,
                pageSize: 40,
                sortField: sortField,   
                format: format,
                uid: pageParams.uid
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (res) {
                if (res.code == '0') {
                    var arr = [];
                    res.data.totalPages = res.data.totalPages > 40 ? 40 : res.data.totalPages;
                    for (var i = 0; i < res.data.totalPages; i++) {
                        arr.push(i)
                    }
                    res.data.totalPages = arr;
                    var _html = template.compile(require('./template/userPage/userPageList.html'))(
                        { 
                            uid: pageParams.uid,
                            list: res.data, 
                            currentPage: current, 
                            sortField: sortField,
                            format: format,
                            formatName: formatEnum[format] || '格式',
                            currentUrl: currentUrl
                        }
                    );
                    $(".personal-container .left").html(_html);
                } else {
                    $.toast({
                        text: res.message,
                        delay: 3000,
                    });
                }
            }
        });
    }
    
});