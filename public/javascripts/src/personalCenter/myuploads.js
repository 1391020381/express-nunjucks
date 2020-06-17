define(function(require , exports , module){
    require("../cmd-lib/pagination");
    var type = window.pageConfig&&window.pageConfig.page.type
    if(type == 'myuploads'){
        var myuploads = require("./template/myuploads.html")
        var _myuploadsTemplate = template.compile(myuploads)({});
        $(".personal-center-myuploads").html(_myuploadsTemplate)
        $(".pagination").pagination({
            pageCount: 10,
            totalData:100,
            current:1,
            jump: true,
            coping: true,
            homePage: '首页',
            endPage: '末页',
            prevContent: '上页',
            nextContent: '下页',
            callback: function (api) {
                console.log(api.getCurrent())
            }
        })
    } 
});