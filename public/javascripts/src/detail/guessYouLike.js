

define(function (require) {

    var paradigm4Report = require('../common/paradigm4-report');
    var method = require('../application/method');
    var api = require('../application/api');
    var guessYouLike = require('./template/guessYouLike.html');
    var userId = method.getCookie('userId') ? method.getCookie('userId') : method.getCookie('visitor_id');
    var requestId = Math.random().toString().slice(-10);// requestID是用来标注推荐服务请求的ID，是长度范围在8~18位的随机字符串
    // 【A20作为是否已经上报的标识】
    var isActioned = false;
    var pageParams = window.pageConfig && window.pageConfig.params || {};
    var params = { 'userId': userId, 'requestId': requestId, itemId: pageParams.g_fileId, itemTitle: pageParams.file_title };
    function action(paradigm4GuessData, paradigm4GuessRecommendConfig) {
        var paradigm4GuessDatas = paradigm4GuessData;
        var paradigm4GuessRecommendConfigs = paradigm4GuessRecommendConfig;
        $(window).on('scroll', function () {
            // 计算出当前猜你喜欢dom在页面中的位置
            // 【A20当前模块曝光到1/3的内容时，才上报曝光事件到第四范式】
            // 浏览器可视区域的高度
            var itemsClient = $(window).height();
            var itemsHeight = $('.guess-you-like-itmes').height();
            var itemsThreshold = itemsHeight / 3;
            var itemsTop = parseInt($('.guess-you-like-itmes').offset().top);
            var scroll = $(document).scrollTop(); // 滚动高度
            if (scroll + itemsClient - 60 - itemsTop >= itemsThreshold) {
                if (!isActioned) {
                    isActioned = true;
                    if (paradigm4GuessDatas.length) {
                        paradigm4Report.pageView(paradigm4GuessDatas, paradigm4GuessRecommendConfigs);
                        trackEvent('NE006', 'modelView', 'view', {
                            moduleID: 'personalityDSC',
                            moduleName: '猜你喜欢'
                        });
                    }
                }
            }
        });

        // 猜你喜欢点击
        $(document).on('click', '.guess-you-like .item', function () {
            var itemId = $(this).data('id') || '';
            var fileName = $(this).data('name') || '';
            var params = window.pageConfig.params;
            trackEvent('NE017', 'fileListNormalClick', 'click', {
                moduleID: 'personalityDSC',
                moduleName: '猜你喜欢',
                filePostion: $(this).index() + 1,
                fileID: itemId,
                fileName: fileName,
                saleType: params.productType,
                fileCategoryID: params.classid1 + '||' + params.classid2 + '||' + params.classid3,
                fileCategoryName: params.classidName1 + '||' + params.classidName2 + '||' + params.classidName3
            });
            paradigm4Report.eventReport(itemId, paradigm4GuessData, paradigm4GuessRecommendConfig);
        });
    }

    $ajax(api.recommend.recommendConfigInfo, 'post', {pageIds:['ishare_personality']}).then(function (recommendConfig) {
        if (recommendConfig.code == '0'&&recommendConfig.data&&recommendConfig.data.length) {
            var sceneID = recommendConfig.data[0].useId;
            var paradigm4GuessRecommendConfig = $.extend({}, recommendConfig.data[0], { requestId: requestId });
            if (sceneID) {
                $ajax('/detail/like/' + sceneID, 'POST', params).then(function (res) {
                    if (res.code == '200') {
                        window.paradigm4Data = {
                            paradigm4Guess: res.data
                        };
                        var paradigm4GuessData = [];
                        $.each(res.data, function (index, item) {
                            paradigm4GuessData.push({
                                id: item.itemId || '',
                                format: item.categoryLevel5 || '',
                                name: item.title || '',
                                cover_url: item.coverUrl || '',
                                url: item.url || '',
                                item_read_cnt: item.item_read_cnt,
                                context: item.context
                            });
                        });
                        var guessYouLikeTemplate = template.compile(guessYouLike)({ paradigm4GuessData: paradigm4GuessData });

                        $('.guess-you-like-warpper').html(guessYouLikeTemplate);

                        var guessYouLikeHeight = $('.guess-you-like-warpper').outerHeight(true) || 0;
                        var userEvaluation = $('.user-comments-container').outerHeight(true) || 0;
                        var currentPage = $('.detail-con').length;
                        var temp = guessYouLikeHeight + userEvaluation + 30;
                        var bottomHeight = currentPage == 1 || currentPage == 2 || currentPage == 3 ? temp + 123 : temp;
                        $('.detail-footer').css({
                            'position': 'absolute',
                            'left': '0px',
                            'right': '0px',
                            'bottom': bottomHeight + 'px',
                            'width': '890px'
                        });
                    }
                    action(paradigm4GuessData, paradigm4GuessRecommendConfig);
                });
            }
        }
    });
});
