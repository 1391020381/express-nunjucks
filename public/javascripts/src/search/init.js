define(function (require, exports, module) {
    var urlConfig = require('../application/urlConfig')
    var method = require('../application/method');
    var isLogin = require('../application/effect.js').isLogin;
    var isAutoLogin = false;
    var callback = null;
    isLogin(callback, isAutoLogin);
    require('./search');
    require('./banner');

    require('../application/suspension');
    var cond = decodeURIComponent(decodeURIComponent(method.getParam('cond')));
    trackEvent('NE030', 'pageTypeView', 'page', {
        pageID: 'SR',
        pageName: '搜索结果页'
    });

    trackEvent('SE015', 'searchPageView', 'page', {
        keyWords: cond
    });

    $('.landing-txt-list .li-file').on('click', function () {
        var fileID = $(this).attr('data-fileId');
        var fileName = $(this).attr('data-fileName');
        console.log($(this))
        trackEvent('SE016', 'searchResultClick', 'click', {
            filePostion: $(this).index() + 1,
            keyWords: cond,
            fileID: fileID,
            fileName: fileName
        });
    });
    $('.js-go2FileConvert').on('click', function (e) {
        e.stopPropagation()
        e.preventDefault();
        trackEvent('NE002', 'normalClick', 'click', {
            domID: 'transClick',
            domName: '格式转换入口点击'
        });
        var convertType = $(this).attr('data-convert-type')
        var href = urlConfig.fileConvertSite + urlConfig.fileConvertSitePath[convertType]
        method.compatibleIESkip(href, true)
    })
});
