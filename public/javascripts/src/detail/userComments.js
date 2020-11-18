define(function (require, exports, module){
    var method = require("../application/method");
    var api = require('../application/api');
    var simplePagination = require("./template/simplePagination.html")
    var userComments = require('./template/userComments.html')
   

    var _userCommentsTemplate = template.compile(userComments)({userComments:[],tags:[]});
    $(".user-comments-container").html(_userCommentsTemplate);
    handlePagination(40,1)  



    function getUserComments(currentPage) {
        $.ajax({
            url: api.search.specialTopic,
            type: "POST",
            data: JSON.stringify({
                            currentPage:1,
                            pageSize:5
                        }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (res) {
               if(res.code == '0'){
                if(res.data.rows&&res.data.rows.length){
                  var _userCommentsTemplate = template.compile(userComments)({userComments:res.data||[],tags:[]});
                  $(".user-comments-container").html(_userCommentsTemplate);
                  handlePagination(res.data.totalPages,res.data.currentPage)  
                }
               }
            }
        })
    }
    function handlePagination(totalPages,currentPage){
        var _simplePaginationTemplate = template.compile(simplePagination)({paginationList:new Array(totalPages||0),currentPage:currentPage});
        $(".pagination-wrapper").html(_simplePaginationTemplate)
        $('.pagination-wrapper').on('click','.page-item',function(e){
            var paginationCurrentPage = $(this).attr("data-currentPage")
            if(!paginationCurrentPage){
                return
            }
            getUserComments(paginationCurrentPage)
        })
       }
})