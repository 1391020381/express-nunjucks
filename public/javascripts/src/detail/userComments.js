define(function (require, exports, module){
    var method = require("../application/method");
    var api = require('../application/api');
    var simplePagination = require("./template/simplePagination.html")
    var userComments = require('./template/userComments.html')
    var fid = window.pageConfig.params.g_fileId 
    var tagsList = []
    getHotLableDataList(fid)
    function getHotLableDataList(fid) {
        $.ajax({
            url: 'http://yapi.ishare.iasktest.com/mock/79/lable/hotDataList',// api.comment.getHotLableDataList + '?fid=' + fid,
            type: "GET",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (res) {
               if(res.code == '0'){
                tagsList = res.data
                getUserComments(1)
               }
            }
        })
    }
    
                                              
    function getUserComments(currentPage,lableId) { 
        $.ajax({
            url:  'http://yapi.ishare.iasktest.com/mock/79/eval/dataList',        // api.comment.getFileComment + '?fid='+ fid + '&lableId='+lableId + '&currentPage='+currentPage +'&pageSize=15'    
            type: "GET",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (res) {
               if(res.code == '0'){
                if(res.data.rows&&res.data.rows.length){
                    var temp = []
                  $(res.data.rows).each(function(index,item){
                        var m = {
                            photoPicURL:item.photoPicURL,
                            nickName:item.nickName,
                            score:item.score,
                            createTime:new Date(item.createTime).formatDate("yyyy-MM-dd")
                        }
                        temp.push(m)
                  })  
                  var _userCommentsTemplate = template.compile(userComments)({userComments:temp||[],tagsList:tagsList||[]});
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
            getUserComments(1,id)
        }
    })   
})