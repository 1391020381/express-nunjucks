define(function(require , exports , module){
    var method = require("../application/method");
    var isLogin = require('../application/effect.js').isLogin;
    var isAutoLogin = false;
    var callback = null;
    isLogin(callback,isAutoLogin)
    require('./search');
    require('./banner')
    
    require('../application/suspension')
    var cond = decodeURIComponent(decodeURIComponent(method.getParam('cond')))
    iask_web.track_event('NE030', "pageTypeView", 'page', {
        pageID:'SR',
        pageName:"搜索结果页"
    });
    iask_web.track_event('SE015', "pageTypeView", 'page', {
        keyWords:cond
    });
    $('.landing-txt-list .li-file').on('click',function(){
        var fileID = $(this).attr('data-fileId')
        var fileName = $(this).attr('data-fileName')
        iask_web.track_event('SE016', "searchResultClick", 'click', {
            filePostion:$(this).index() + 1,
            keyWords:cond,
            fileID:fileID,
            fileName:fileName
        });
    })
});