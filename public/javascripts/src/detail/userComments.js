define(function (require, exports, module){
    var method = require("../application/method");
    var api = require('../application/api');
    var simplePagination = require("./template/simplePagination.html")
    var userComments = require('./template/userComments.html')
    var fid = window.pageConfig.params.g_fileId 
    getHotLableDataList(fid)
    function getHotLableDataList(fid) {
        $.ajax({
            url: 'http://yapi.ishare.iasktest.com/mock/79/lable/hotDataList',// api.comment.getHotLableDataList,
            type: "POST",
            data: JSON.stringify({
                            fid
                        }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (res) {
               if(res.code == '0'){
                getUserComments(1,res.data)
               }
            }
        })
    }
    function getUserComments(currentPage,tagsList) {
        $.ajax({
            url: api.comment.getFileComment,
            type: "POST",
            data: JSON.stringify({
                            currentPage:currentPage|| 1,
                            pageSize:5
                        }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (res) {
               if(res.code == '0'){
                if(res.data.rows&&res.data.rows.length){
                  var _userCommentsTemplate = template.compile(userComments)({userComments:res.data||[],tagsList:tagsList||[]});
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

    $(document).on('click','.doc-main-br .user-comments-container .evaluation-tags',function(){
        var id = $(this).attr('data-id')
        if(id != 'all'){
            
        }
    })   
})