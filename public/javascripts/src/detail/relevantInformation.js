

define(function (require) {
    // 相关资料
    var paradigm4Report = require('../common/paradigm4-report');
    var method = require('../application/method');
    var api = require('../application/api');
    var relevantInformation = require('./template/relevantInformation.html');
    var userId = method.getCookie('userId') ? method.getCookie('userId') : method.getCookie('visitor_id');
    var requestId = Math.random().toString().slice(-10);// requestID是用来标注推荐服务请求的ID，是长度范围在8~18位的随机字符串

    var fid = window.pageConfig.params && window.pageConfig.params.g_fileId;
    var title = window.pageConfig.params && window.pageConfig.params.file_title;

    var params = {
        'userId': userId,
        'requestId': requestId,
        'itemId': fid,
        'itemTitle': title
    };

    function action(relevantInformationData, relevantInformationRecommendConfig) {
        var paradigm4Relevant = relevantInformationData;
        var relevantRecommendInfoData = relevantInformationRecommendConfig;
        if (relevantInformationData.length) {
            paradigm4Report.pageView(relevantInformationData, relevantInformationRecommendConfig);
            trackEvent('NE006', 'modelView', 'view', {
                moduleID: 'relevant',
                moduleName: '相关推荐模块曝光'
            });
        }
        // 相关推荐点击
        $(document).on('click', '.related-data-list li', function () {
            var itemId = $(this).data('id') || '';
            var fileName = $(this).data('name') || '';
            var params = window.pageConfig.params;
            trackEvent('NE017', 'fileListNormalClick', 'click', {
                moduleID: 'relevant',
                moduleName: '相关推荐',
                filePostion: $(this).index() + 1,
                fileID: itemId,
                fileName: fileName,
                saleType: params.productType,
                fileCategoryID: params.classid1 + '||' + params.classid2 + '||' + params.classid3,
                fileCategoryName: params.classidName1 + '||' + params.classidName2 + '||' + params.classidName3
            });
            paradigm4Report.eventReport(itemId, paradigm4Relevant, relevantRecommendInfoData);
        });
    }

    $ajax(api.recommend.recommendConfigInfo, 'post', ['ishare_pc_relevant']).then(function (recommendConfig) {
        if (recommendConfig.code == '0'&&recommendConfig.data&&recommendConfig.data.length) {
            var sceneID = recommendConfig.data[0].useId;
            var relevantInformationRecommendConfig = $.extend({}, recommendConfig.data[0], { requestId: requestId });
            if (sceneID) {
                $ajax('/detail/relevant/' + sceneID, 'POST', params).then(function (res) {
                    if (res.code == '200') {
                        var relevantInformationData = [];
                        $.each(res.data, function (index, item) {
                            relevantInformationData.push({
                                id: item.itemId || '',
                                format: item.categoryLevel5 || '',
                                name: item.title || '',
                                cover_url: item.coverUrl || '',
                                url: item.url || '',
                                item_read_cnt: item.item_read_cnt,
                                context: item.context
                            });
                        });

                        var relevantInformationTemplate = template.compile(relevantInformation)({
                            RelevantInformationList: relevantInformationData.slice(0, 4)
                        });
                        $('.related-data').html(relevantInformationTemplate);
                    }
                    action(relevantInformationData, relevantInformationRecommendConfig);
                });
            }
        }
    });

});
