define(function(require , exports , module){
   var method = require("../application/method");
   var api = require('../application/api');
   var mycollectionAndDownLoad = require('./template/mycollectionAndDownLoad.html')
   var simplePagination = require("./template/simplePagination.html")
   
   initData()
  function initData(){
    var type = window.pageConfig&&window.pageConfig.page.type
    if(type =='mycollection'){
       getUserFileList()
       var _mycollectionAndDownLoadTemplate = template.compile(mycollectionAndDownLoad)({type:'mycollection',list:[]});
       $(".personal-center-mycollection").html(_mycollectionAndDownLoadTemplate);
    }else{
       getDownloadRecordList()
    }
  }

   function getDownloadRecordList(currentPage){ //用户下载记录接口
      $.ajax({
          url: api.user.getDownloadRecordList,
          type: "POST",
          data: JSON.stringify({
              currentPage:currentPage||1,
              pageSize:10
          }),
          contentType: "application/json; charset=utf-8",
          dataType: "json",
          success: function (res) {
             if(res.code == '0'){
                  console.log('getDownloadRecordList:',res)
                  var formatDate = method.formatDate
                  Date.prototype.format = formatDate
                  var list = []
                  res.data.rows.forEach(item=>{
                    var downloadTime = new Date(item.downloadTime).format("yyyy-MM-dd")
                     item.downloadTime = downloadTime
                     list.push(item)
                  })
                   
                  var _mycollectionAndDownLoadTemplate = template.compile(mycollectionAndDownLoad)({type:'mydownloads',list:list||[]});
                  $(".personal-center-mydownloads").html(_mycollectionAndDownLoadTemplate);
                  handlePagination(res.data.totalPages,res.data.currentPage)
             }else{
              $.toast({
                  text:res.msg,
                  delay : 3000,
              })
             }
          },
          error:function(error){
              console.log('getDownloadRecordList:',error)
          }
      })
  }
   


  function getUserFileList(){  // 查询个人收藏列表
   $.ajax({
      url: api.user.getUserFileList,
      type: "POST",
      data: JSON.stringify({
          pageNumber:1,
          pageSize:10,
          sidx:0, // 排序字段：0=收藏时间；1=资料格式 默认值 0
          order:'-1'  // 排序顺序，1=升序, -1=降序 默认值 -1
      }),
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      success: function (res) {
         if(res.code == '0'){
              console.log('getUserFileList:',res)
              
         }else{
          $.toast({
              text:res.msg,
              delay : 3000,
          })
         }
      },
      error:function(error){
          console.log('getUserFileList:',error)
      }
  })
  }
    



  // 分页
  function handlePagination(totalPages,currentPage){
    var _simplePaginationTemplate = template.compile(simplePagination)({paginationList:new Array(totalPages||0),currentPage:currentPage});
    $(".pagination-wrapper").html(_simplePaginationTemplate)
    $('.pagination-wrapper').on('click','.page-item',function(e){
        var paginationCurrentPage = $(this).attr("data-currentPage")
        if(!paginationCurrentPage){
            return
        }
        getDownloadRecordList(paginationCurrentPage)
    //     var _simplePaginationTemplate = template.compile(simplePagination)({paginationList:new Array(totalPages||0),currentPage:paginationCurrentPage});
    //   $(".pagination-wrapper").html(_simplePaginationTemplate)
    })
  } 
});