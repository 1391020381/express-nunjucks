define(function(require , exports , module){
    require("./simplePagination.js")
    var type = window.pageConfig&&window.pageConfig.page.type
    if(type == 'myuploads'){
        var myuploads = require("./template/myuploads.html")
        var simplePagination = require("./template/simplePagination.html")
        var _myuploadsTemplate = template.compile(myuploads)({});
        $(".personal-center-myuploads").html(_myuploadsTemplate)
        var _simplePaginationTemplate = template.compile(simplePagination)({paginationList:new Array(100),currentPage:1});
        $(".pagination-wrapper").html(_simplePaginationTemplate)
        $('.pagination-wrapper').on('click','.page-item',function(e){
            console.log($(this).attr("data-currentPage"))
            var currentPage = $(this).attr("data-currentPage")
            var _simplePaginationTemplate = template.compile(simplePagination)({paginationList:new Array(100),currentPage:currentPage});
          $(".pagination-wrapper").html(_simplePaginationTemplate)
        })
    } 
});