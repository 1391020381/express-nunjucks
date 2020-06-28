
define(function(require , exports , module){
    var method = require("../application/method");
    var type = window.pageConfig&&window.pageConfig.page.type
    var api = require('../application/api');
    var myuploads = require("./template/myuploads.html")
    var simplePagination = require("./template/simplePagination.html")
    initData()
    function initData(){
        if(type == 'myuploads'){
            getMyUploadPage()
            $(document).on('click','.tab',function(e){
                console.log($(this).attr('data-status'))
                changeTabStyle($(this))
            })
        } 
    }

       function getMyUploadPage(currentPage){  // 分页查询我的上传
        var status = method.getParam('myuploadType') || 1
        $.ajax({
           url: api.user.getMyUploadPage,
           type: "POST",
           data: JSON.stringify({
               currentPage:currentPage||1,
               pageSize:20,
               status:+status   // 1公开资料,2,付费资料，3，私有资料，4，审核中，5，未通过
           }),
           contentType: "application/json; charset=utf-8",
           dataType: "json",
           success: function (res) {
              if(res.code == '0'){
                   console.log('getMyUploadPage:',res)   
                   res.data =    {
                    "currentPage": 0,
                    "pageSize": 0,
                    "rows": [
                      {
                        "createtime": 1592990877659,
                        "format": "doc",
                        "id": "EN6sFTSAvh",
                        "readNum":0,
                        "downNum":12,
                        "size": "50kb",
                        "title": "关编版一年级语文下册第四单元《静夜思》课件",
                        "userFileType":4,
                        "userFilePrice":20
                      },
                      {
                        "createtime": 1592990877659,
                        "format": "doc",
                        "id": "qr6K41vLNr",
                        "readNum":0,
                        "downNum":12,
                        "size": "50kb",
                        "title": "关编版一年级语文下册第四单元《静夜思》课件",
                        "userFileType":3,
                        "userFilePrice":20
                      }
                    ],
                    "totalPages": 0,
                    "totalSize": 0
                  }
                  var formatDate = method.formatDate
                  Date.prototype.format = formatDate
                  var list = []
                  res.data.rows.forEach(item=>{
                     var userFilePrice  = ''
                     if(item.userFileType == 1){
                         userFilePrice = '免费'
                     }
                     if(item.userFileType == 4){
                         userFilePrice = userFilePrice + '个特权'
                     }
                     if(item.userFileType == 5){
                         userFilePrice = (userFilePrice/100).toFixed(2) + '元'
                     }
                     var createtime =  new Date(item.createtime).format("yyyy-MM-dd")
                     item.createtime = createtime
                     list.push(item)
                  })
                  var myuploadType =  window.pageConfig.page&&window.pageConfig.page.myuploadType || 1
                  var _myuploadsTemplate = template.compile(myuploads)({list:list||[],totalPages:res.data.totalPages,myuploadType:myuploadType});
                   $(".personal-center-myuploads").html(_myuploadsTemplate) 
                   handlePagination(res.data.totalPages,res.data.currentPage) 
              }else{
               $.toast({
                   text:res.msg,
                   delay : 3000,
               })
              }
           },
           error:function(error){
               console.log('getMyUploadPage:',error)
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
            getMyUploadPage(paginationCurrentPage)
        })
       }

       function changeTabStyle($this){
         var status = $this.attr('data-status')
         $this.siblings().removeClass('tab-active')
         $this.addClass('tab-active')
       }

});