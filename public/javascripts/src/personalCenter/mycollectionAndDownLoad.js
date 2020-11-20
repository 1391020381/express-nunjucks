


define(function(require , exports , module){
   var method = require("../application/method");
   var api = require('../application/api');
   var mycollectionAndDownLoad = require('./template/mycollectionAndDownLoad.html')
   var simplePagination = require("./template/simplePagination.html")
   var closeRewardPop = require('./dialog').closeRewardPop
   var isLogin = require('../application/effect.js').isLogin
   var getUserCentreInfo = require('./home.js').getUserCentreInfo
   var type = window.pageConfig&&window.pageConfig.page.type
   var clickEvent = require('../common/bilog').clickEvent
   var utils = require("../cmd-lib/util");
   var receiveCoupon = require('./template/receiveCoupon.html')
   var labelList = require('./template/labelList.html')
   var score = 0
   var tagList = []  // 评论标签
   var taskList = []
   if(type =='mycollection'||type =='mydownloads'){
      isLogin(initData,true)
   }
  function initData(data){
    if(type =='mycollection'){
        getUserCentreInfo(null,data) 
       getUserFileList()
    }else if(type == 'mydownloads'){
      getUserCentreInfo(null,data) 
       getDownloadRecordList()
    }
  }

   function getDownloadRecordList(currentPage){ //用户下载记录接口
      $.ajax({
         headers:{
            'Authrization':method.getCookie('cuk')
         },
          url: api.user.getDownloadRecordList,
          type: "POST",
          data: JSON.stringify({
              currentPage:currentPage||1,
              pageSize:20
          }),
          contentType: "application/json; charset=utf-8",
          dataType: "json",
          success: function (res) {
             if(res.code == '0'){
                  console.log('getDownloadRecordList:',res)
                  var formatDate = method.formatDate
                  Date.prototype.format = formatDate
                  var list = []
                  $(res.data.rows).each(function(index,item){
                    var downloadTime = new Date(item.downloadTime).format("yyyy-MM-dd")
                     item.downloadTime = downloadTime
                     item.fileId = item.id
                     list.push(item)
                  })
                   
                  var _mycollectionAndDownLoadTemplate = template.compile(mycollectionAndDownLoad)({type:'mydownloads',list:list||[],totalSize:res.data.totalSize||0});
                  $(".personal-center-mydownloads").html(_mycollectionAndDownLoadTemplate);
                  handlePagination(res.data.totalPages,res.data.currentPage,'mydownloads')
             }else{
              $.toast({
                  text:res.message,
                  delay : 3000,
              })
             }
          },
          error:function(error){
              console.log('getDownloadRecordList:',error)
          }
      })
  }
   


  function getUserFileList(currentPage){  // 查询个人收藏列表
    var pageNumber = currentPage || 1
   $.ajax({
      headers:{
        'Authrization':method.getCookie('cuk')
      },
      url: api.user.getUserFileList + '?pageNumber=' + pageNumber + '&pageSize=20&sidx=0&order=-1',
      type: "GET",
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      success: function (res) {
         if(res.code == '0'){
              console.log('getUserFileList:',res)
              // 复用我的下载模板,需要处理接口的字段
              var formatDate = method.formatDate
              Date.prototype.format = formatDate
             var list = []
              $(res.data.rows).each(function(index,item){
                var collectTime = new Date(item.collectTime).format("yyyy-MM-dd")
                  var temp = {
                    format:item.format,
                    title:item.title,
                    fileId:item.fileId,
                    downloadTime:collectTime
                  }
                  list.push(temp)
              })
              var _mycollectionAndDownLoadTemplate = template.compile(mycollectionAndDownLoad)({type:'mycollection',list:list||[],totalSize:res.data.totalSize||0});
              $(".personal-center-mycollection").html(_mycollectionAndDownLoadTemplate);   
              handlePagination(res.data.totalPages,res.data.currentPage,'mycollection') 
         }else{
          $.toast({
              text:res.message,
              delay : 3000,
          })
         }
      },
      error:function(error){
          console.log('getUserFileList:',error)
      }
  })
  }
    
 
// 获取评价标签
function getLabelList(fid,format,title,isAppraise) { 
    $.ajax({
        headers: {
            'Authrization': method.getCookie('cuk')
        },
        url:   'http://yapi.ishare.iasktest.com/mock/79/lable/dataList' ,  // api.comment.getLableList + '?fid=' + fid
        type: "GET",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (res) {
            if (res.code == '0') {
                 tagList = res.data
                 var tags = template.compile(labelList)({labelList:res.data,isAppraise:isAppraise})
                $("#dialog-box").dialog({
                    html: $('#evaluation-dialog').html().replace(/\$format/, format).replace(/\$title/, title).replace(/\$tags/, tags).replace(/\$$isAppraise/,isAppraise).replace(/\$fid/,fid),
                }).open();
            } else {
                $.toast({
                    text: res.message,
                    delay: 3000,
                })    
            }
        },
        error: function (error) {
            console.log('queryUserBindInfo:', error)
        }
    })
}
// 添加评论 

function addComment(params){
    $.ajax({
        headers:{
           'Authrization':method.getCookie('cuk')
        },
         url:  'http://yapi.ishare.iasktest.com/mock/79/eval/add', //api.comment.addComment,
         type: "POST",
         data: JSON.stringify(params),
         contentType: "application/json; charset=utf-8",
         dataType: "json",
         success: function (res) {
            if(res.code == '0'){
                $.toast({
                    text:'评价成功',
                    delay : 3000,
                })
                score = 0
                closeRewardPop()
                getTaskList(params.fid)
            }else{
             $.toast({
                 text:res.message,
                 delay : 3000,
             })
            }
         },
         error:function(error){
             console.log('getDownloadRecordList:',error)
         }
     })
}

// 获取任务列表接口
function getTaskList(fid) { // todo
      $.ajax({
          url: 'http://yapi.ishare.iasktest.com/mock/142/task/get', //api.coupon.getTask,
          type: "GET",
          data: params,
          type: "POST",
          data: JSON.stringify({
              key:fid,
              taskCode:'evaluate'
          }),
          contentType: "application/json; charset=utf-8",
          dataType: "json",
          success: function(res) {
              if (res && res.code == '0') {
                  taskList = res.data && res.data.list ? res.data.list : [];
                  startTaskReceive(taskList)
              }
          }
      });
  
}

    // 开始弹出领取优惠券的弹窗
function startTaskReceive(taskList) {
      if (!taskList.length) return;
      var data = {
          list: taskList.slice(0, 2)
      };
      var _html = template.compile(receiveCoupon)({ data: data });
      $("#dialog-box").dialog({
        html: $('#getcoupon-dialog').html().replace(/\$content/, _html),
    }).open();
  }


  $(document).on('click','.personal-center-mydownloads .evaluate-btn',function(event){
    console.log('evaluate-btn')
    var format = $(this).attr("data-format")
    var title = $(this).attr('data-title')
    var fid = $(this).attr('data-id')
    var isAppraise = $(this).attr('data-isappraise')   // 1 此文件评价过
    getLabelList(fid,format,title,isAppraise)
})

$(document).on('click','.personal-center-dialog .evaluation-confirm',function(event){
    if(score>0){
        var  labels = []
        $.each($('.evaluation-dialog input:checkbox:checked'),function(){
                 var id = $(this).val()
                $(tagList).each(function(index,item){
                    if(item.id == id){
                        labels.push({
                            id:id,
                            name:item.name
                        })
                    }
                })
        });
        var params = {
            content:$('.evaluation-dialog .evaluation-desc').text(),
            fid:$('.evaluation-dialog .file-title').attr('data-fid'),
            labels:labels,
            score:score,
            site:0,
            terminal:0
         }
         addComment(params)
    }else{
        $.toast({
            text:'请选择评分',
            delay : 3000,
        })
    }
})

$(document).on('click','.personal-center-dialog .file-rates .start',function(e){
  var isAppraise  = $(this).attr('data-isappraise')
  var  starts = $('.personal-center-dialog .file-rates .start')
       score = $(this).index()
  if(isAppraise!=1){  // 未评论  也就是评论
      starts.removeClass('start-active')
      starts.slice(0,score+1).addClass('start-active')
      $('.evaluation-dialog .evaluation-confirm').css({ background: '#F25125',color: '#FFFFFF'}) //  $('.evaluation-dialog .evaluation-confirm').removeAttr("style");
  }
})


  // 绑定定时弹窗关闭按钮

  $('#dialog-box').on('click','.close-btn',function(e){
    clickEvent($(this))
    closeRewardPop();
})
  // 绑定立即领取按钮回调
  $(document).on('click', '.coupon-dialog-wrap .coupon-dialog-footer', function(e) {
      var parmas = {
          type: 2,
          source: 1,
          site: 4,
      };
      clickEvent($(this))
      $.ajax({
          url: api.coupon.rightsSaleVouchers,
          headers: {
              'Authrization': method.getCookie('cuk')
          },
          type: "POST",
          data: JSON.stringify(parmas),
          contentType: "application/json; charset=utf-8",
          dataType: "json",
          success: function(res) {
              closeRewardPop()
              if (res && res.code == '0') {
                  // 重新刷新页面
                //  window.location.reload();
              } else {
                  utils.showAlertDialog("温馨提示",  res.message || '领取失败');
              }
          }
      })

  });
  // 分页
  function handlePagination(totalPages,currentPage,flag){
    var _simplePaginationTemplate = template.compile(simplePagination)({paginationList:new Array(totalPages||0),currentPage:currentPage});
    $(".pagination-wrapper").html(_simplePaginationTemplate)
    $('.pagination-wrapper').on('click','.page-item',function(e){
        var paginationCurrentPage = $(this).attr("data-currentPage")
        if(!paginationCurrentPage){
            return
        }
        if(flag == 'mycollection'){  // 点击分页后重新请求数据
            getUserFileList(paginationCurrentPage)
        }
        if(flag == 'mydownloads'){
            getDownloadRecordList(paginationCurrentPage)
        }
       
    //     var _simplePaginationTemplate = template.compile(simplePagination)({paginationList:new Array(totalPages||0),currentPage:paginationCurrentPage});
    //   $(".pagination-wrapper").html(_simplePaginationTemplate)
    })
  } 
});