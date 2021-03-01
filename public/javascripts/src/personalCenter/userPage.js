
define(function (require, exports, module) {
    require("../cmd-lib/toast");
    var method = require("../application/method");
    var api = require("../application/api");
    var login = require("../application/checkLogin");
    var isLogin = require('../application/effect.js').isLogin;
    var paradigm4Report = require('../common/paradigm4-report');
    var pageParams = window.pageConfig.page || {};
    var userInfo = {};
    var recommendInfoItem = {}, paradigm4GuessData = [];
    isLogin(init, false);

    function init(data) {
        userInfo = data;
        // 第四范式热门资料
        recommend();
        
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

});