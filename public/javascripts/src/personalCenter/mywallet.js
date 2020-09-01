define(function (require, exports, module) {
    require('../cmd-lib/jquery.datepicker.js')
    var type = window.pageConfig&&window.pageConfig.page.type
    var getUserCentreInfo = require('./home.js').getUserCentreInfo
    var isLogin = require('../application/effect.js').isLogin
    var api = require('../application/api');
    var method = require("../application/method"); 
    var walletDetailsId = ''
    require("../cmd-lib/upload/Q");
    require("../cmd-lib/upload/Q.Uploader");

    var simplePagination = require("./template/simplePagination.html")
    var mywallet = require("./template/mywallet.html") 
    var mywalletType = window.pageConfig&&window.pageConfig.page.mywalletType
    var  utils = require("../cmd-lib/util")
    var  areaData = require('../common/area.js')
    var  bankData = require('../common/bankData.js')
    var closeRewardPop = require('./dialog').closeRewardPop
    var invoicePicture =  {}    // 发票照片信息
    var balance = ''      // 账号余额
    var canWithPrice = '' // 提现余额
    var financeAccountInfo = {}   // 财务信息
    var provinceList = []
    var cityList = []
    var specialCity = ['北京市','天津市','重庆市','上海市','澳门','香港']
    var userFinanceAccountInfo = {}
   var auditStatusList =   {  // 提现记录审核状态
           0:'待审核',
           1:'审核通过',
           2:'审核不通过'
       }
   

   var myWalletStatusList = {
    0:'系统自动确认',
    1:'审待确认',
    2:'审核待确认',
    3:'已确认',
    4:'已挂起'
}
  var sellerTypeList = { // 卖家类型
      0:'个人',
      1:'机构'
  }   
   
   var withdrawalRecordData = { // 提现信息数据
    code:'1',
    data:{
        currentPage:1,
        pageSize:20,
        totalPages:100,
        rows:[
            {
                withdrawId:'123456789',
                withdrawTime: new Date().getTime(),
                withdrawPrice: 100,
                holdingTaxPrice:100,
                transferTax:100,
                auditStatus:0,
                NoPassReason:'信息不全,无法提现',
                finalPrice:100
            },
            {
                withdrawId:'123456789',
                withdrawTime: new Date().getTime(),
                withdrawPrice: 1000,
                holdingTaxPrice:1000,
                transferTax:1000,
                auditStatus:0,
                NoPassReason:'信息不全,无法提现',
                finalPrice:1000
            }
        ]
    }
}

   var accountFinance = {
    code:'1',
    data:{
        userTypeName:'个人用户',
        bankAccountName:'大大大夏',
        bankAccountNo:'6214838658185278',
        province:"广东省",
        city:"深圳市",
        bankName:"招商银行",
        bankBranchName:'高新园招商银行支行',
        isEdit:false
    }
   }
   
   var myWalletList = {
       code:'1',
       data:{
           rows:[
            {
             id:'1',
             settleBatchNo:"123456789",
             sellerId:'1',
             sellerNickname:"行云流水justdoit",
             batchNo:'987654321',
             settleStartDate:new Date().getTime(),
             settleEndDate:new Date().getTime(),
             status:0,
             sellerType:0,
             totalTransactionAmount:123456789
            },
            {
             id:'1',
             settleBatchNo:"123456789",
             sellerId:'1',
             sellerNickname:"行云流水justdoit",
             batchNo:'987654321',
             settleStartDate:new Date().getTime(),
             settleEndDate:new Date().getTime(),
             status:0,
             sellerType:0,
             totalTransactionAmount:123456789
            }
        ],
        currentPage:1,
        totalPages:200
       }
   }
    if(type=='mywallet'){
        isLogin(initCallback,true)
    }
    function initCallback(){
       getUserCentreInfo()
       if(mywalletType  == '1'){
           var params = {
               currentPage:1,
               pageSize:20,
               settleStartDate:'',
               settleEndDate:""
           }
           handleMyWalletListData()
           getMyWalletList(params)
           getAccountBalance()
           getFinanceAccountInfo() // 查询用户财务信息 , 当 提现按钮可点击时,财务信息不完成，需要先补充财务信息
          
       }   
        if(mywalletType == '2'){
            getWithdrawalRecord()
        }
        if(mywalletType == '3'){
            getFinanceAccountInfo()
        }
    }
  
    function getAccountBalance(){ // 获取账户余额
        $.ajax({
            headers:{
                'Authrization':method.getCookie('cuk')
            },
            url: api.mywallet.getAccountBalance,
            type: "GET",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (res) {
               if(res.code == '0'){
                     balance = res.data.balance?(res.data.balance/100).toFixed(2):0
                     canWithPrice = res.data.canWithPrice?(res.data.canWithPrice/100).toFixed(2):0
                     $('.mywallet .balance-sum').text(balance)
               }else{
                $('.mywallet .balance-sum').text(0)
                $.toast({
                    text:res.msg,
                    delay : 3000,
                }) 
               }
            },
            error:function(error){
                console.log('getAccountBalance:',error)
            }
        })
    }
    function withdrawal(){ // 提现
        $.ajax({
            headers:{
                'Authrization':method.getCookie('cuk')
            },
            url: api.mywallet.withdrawal,
            type: "POST",
            data: JSON.stringify({
                currentPage:currentPage || 1,
                pageSize:20
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (res) {
               if(res.code == '0'){
                    console.log('withdrawal:',res)
                  
               }else{
                $.toast({
                    text:res.msg,
                    delay : 3000,
                })
               }
            },
            error:function(error){
              
                $.toast({
                    text:error.msg||'提现失败',
                    delay : 3000,
                })
            }
        })
    }

    function getMyWalletList(params){ // 我的钱包收入
        $.ajax({
            headers:{
                'Authrization':method.getCookie('cuk')
            },
            url: api.mywallet.getMyWalletList,
            type: "POST",
            data: JSON.stringify(params),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (res) {
               if(res.code == '0'){
                    console.log('getMyWalletList:',res)
                  
               }else{
                $.toast({
                    text:res.msg,
                    delay : 3000,
                })
               }
            },
            error:function(error){
              
                $.toast({
                    text:error.msg||'getMyWalletList',
                    delay : 3000,
                })
            }
        })
    }

    function getPersonalAccountTax(withPrice){ // 查询个人提现扣税结算
        $.ajax({
            headers:{
                'Authrization':method.getCookie('cuk')
            },
            url: api.mywallet.getPersonalAccountTax + '?withPrice=' + withPrice,
            type: "GET",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (res) {
               if(res.code == '0'){
                    
               }else{
                $.toast({
                    text:res.msg,
                    delay : 3000,
                }) 
               }
            },
            error:function(error){
                console.log('getPersonalAccountTax:',error)
            }
        })

    }
    function getWithdrawalRecord(currentPage){ // 查询提现记录
        handleWithdrawalRecordData({})

        $.ajax({
            headers:{
                'Authrization':method.getCookie('cuk')
            },
            url: api.mywallet.getWithdrawalRecord,
            type: "POST",
            data: JSON.stringify({
                currentPage:currentPage || 1,
                pageSize:20
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (res) {
               if(res.code == '0'){
                    console.log('getWithdrawalRecord:',res)
                  
               }else{
                $.toast({
                    text:res.msg,
                    delay : 3000,
                })
               }
            },
            error:function(error){
              
                $.toast({
                    text:error.msg||'查询提现记录失败',
                    delay : 3000,
                })
            }
        })
    }
    function exportMyWalletDetail(id,email){ // 我的钱包明细导出
        $.ajax({
            headers:{
                'Authrization':method.getCookie('cuk')
            },
            url: api.mywallet.exportMyWalletDetail,
            type: "POST",
            data: JSON.stringify({
                id:currentPage || 1,
                email:''
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (res) {
               if(res.code == '0'){
                    console.log('exportMyWalletDetail:',res)  
               }else{
                $.toast({
                    text:res.msg,
                    delay : 3000,
                })
               }
            },
            error:function(error){
              
                $.toast({
                    text:error.msg||'我的钱包明细导出失败',
                    delay : 3000,
                })
            }
        })
    }
   function handleWithdrawalRecordData(res){
    var list = []
    res = withdrawalRecordData
    $(res.data.rows).each(function(index,item){
        item.withdrawTime = new Date(item.withdrawTime).format("yyyy-MM-dd")
        item.withdrawPrice = item.withdrawPrice?(item.withdrawPrice/100).toFixed(2):'-'
        item.holdingTaxPrice = item.holdingTaxPrice?(item.holdingTaxPrice/100).toFixed(2):'-'
        item.transferTax = item.transferTax?(item.transferTax/100).toFixed(2):'-'
        item.auditStatusDesc = auditStatusList[item.auditStatus]
        item.finalPrice = item.finalPrice?(item.finalPrice/100).toFixed(2):'-'
        
        list.push(item)
    })
    var _mywalletTemplate = template.compile(mywallet)({list:list||[],mywalletType:mywalletType});
    $('.personal-center-mywallet').html(_mywalletTemplate)
    handlePagination(res.data.totalPages,res.data.currentPage) 
    }

    function handleMyWalletListData(res){ 
        var list = []
        res = myWalletList
        $(res.data.rows).each(function(index,item){
            item.settleStartDate = new Date(item.settleStartDate).format("yyyy-MM-dd")
            item.settleEndDate  = new Date(item.settleEndDate).format("yyyy-MM-dd")
            item.statusDesc = myWalletStatusList[item.status]
            item.sellerTypeDesc = sellerTypeList[item.sellerType]
            item.totalTransactionAmount = item.totalTransactionAmount?(item.totalTransactionAmount/100).toFixed(2):''
            item.batchNo = item.batchNo
            list.push(item)
        })
        var _mywalletTemplate = template.compile(mywallet)({list:list||[],mywalletType:mywalletType});
        $('.personal-center-mywallet').html(_mywalletTemplate)
         var currentDate =   new Date(new Date().getTime()).format("yyyy-MM-dd")
        $('.start-time-input').datePicker({maxDate:currentDate});
        $('.end-time-input').datePicker({maxDate:currentDate});
        handlePagination(res.data.totalPages,res.data.currentPage) 
        
    }
    
   function getFinanceAccountInfo(){ // 查询个人财务信息
    $.ajax({
        headers:{
            'Authrization':method.getCookie('cuk')
        },
        url: api.mywallet.getFinanceAccountInfo,
        type: "GET",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (res) {
           if(res.code == '0'){
            financeAccountInfo = res.data
            if(mywalletType == '3'){
                handleFinanceAccountInfo(res)  
            }
           }else{
            $.toast({
                text:res.msg,
                delay : 3000,
            }) 
           }
           handleFinanceAccountInfo({})  
        },
        error:function(error){
            console.log('queryUserBindInfo:',error)
        }
    })
   } 

   function handleFinanceAccountInfo(res){ // 
      res = accountFinance
      userFinanceAccountInfo = res.data
      getProvinceAndCityList(res.data)
      var _mywalletTemplate = template.compile(mywallet)({financeAccountInfo:res.data||{},provinceList:provinceList,cityList:cityList,bankList:bankData,mywalletType:mywalletType});
      $('.personal-center-mywallet').html(_mywalletTemplate)
      $('.item-province').val(res.data.province)
     $('.item-city').val(res.data.city)
     
    $('.item-bank').val(res.data.bankName)
    res.data.bankName == '其他'?$('.mywallet .item-bank-name').show():$('.mywallet .item-bank-name').hide()
   }
   
   function getProvinceAndCityList(financeAccountInfo){
    // userInfoInfomation = userInfo
    $(areaData).each(function(index,itemCity){
        provinceList.push(itemCity.name)
        if(itemCity.name == financeAccountInfo.province&& specialCity.indexOf(financeAccountInfo.province)>-1){
            $(itemCity.city).each(function(index,itemArea){
                $(itemArea.area).each(function(index,area){
                    cityList.push(area)
                })
            })
        }else if(itemCity.name == financeAccountInfo.province&& specialCity.indexOf(financeAccountInfo.province)==-1){
            $(itemCity.city).each(function(index,city){
                cityList.push(city.name)
            })
        } else  if(!financeAccountInfo.city){
            $(areaData[0].city[0].area).each(function(index,area){
                cityList.push(area)
            })
        }
    })
    console.log('provinceList:',provinceList,'cityList:',cityList)
}

    function handlePagination(totalPages,currentPage){
        var _simplePaginationTemplate = template.compile(simplePagination)({paginationList:new Array(totalPages||0),currentPage:currentPage});
        $(".pagination-wrapper").html(_simplePaginationTemplate)
        $('.pagination-wrapper').on('click','.page-item',function(e){
            var paginationCurrentPage = $(this).attr("data-currentPage")
            if(!paginationCurrentPage){
                return
            }
            if(mywalletType == '2'){
                getWithdrawalRecord(paginationCurrentPage)
            }
           
        })
       }

    function editFinanceAccount(params){  // 编辑个人财务信息
        $.ajax({
            headers:{
                'Authrization':method.getCookie('cuk')
            },
            url: api.mywallet.editFinanceAccount,
            type: "POST",
            data: JSON.stringify(params),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (res) {
               if(res.code == '0'){
                    console.log('editFinanceAccount:',res)
                  
               }else{
                $.toast({
                    text:res.msg,
                    delay : 3000,
                })
               }
            },
            error:function(error){
              
                $.toast({
                    text:error.msg||'编辑用户财务信息失败',
                    delay : 3000,
                })
            }
        })
    }
    $(document).on('change','.mywallet .item-province',function(e){ // 北京市 天津市 重庆市  上海市 澳门 香港
        var provinceName = $(this).val()
        var  str = ''
        var cityList = []  
       $(areaData).each(function(index,itemCity){
          if(provinceName == itemCity.name && specialCity.indexOf(provinceName)>-1){
              $(itemCity.city).each(function(index,itemArea){
                  $(itemArea.area).each(function(index,area){
                      cityList.push(area)
                  })
              })
          }else{
            if(provinceName == itemCity.name){
                $(itemCity.city).each(function(index,city){
                    cityList.push(city.name)
                })
            }  
          }
       }) 
        

        $(cityList).each(function(index,city){
          str +='<option value="'+city +'">'+city +'</option>' 
        })
       
        $('.mywallet .item-city').html(str);
    })   
    $(document).on('click','.mywallet .submit-btn',function(e){
        var bankAccountName = $('.mywallet .account-name .item-content').text()
        var bankAccountNo = $('.mywallet .item-openingbank-num').val()
        var province = $('.mywallet .item-province').val()
        var city = $('.mywallet .item-city').val()
        var bankName = $('.mywallet .item-bank').val() == '其他'?$('mywallet .item-bank-name').val():$('.mywallet .item-bank').val()
        var bankBranchName = $('.mywallet .item-openingbank-name').val()
        
        if(userFinanceAccountInfo.isEdit){
            if(!province&&(errMsg = '请选择所在省')||!city&&(errMsg='请选择所在的市')||!bankName&&(errMsg='请选择银行')||!bankBranchName&&(errMsg='请填写开户行全称')||!bankAccountNo&&(errMsg='请填写收款银行卡号')){
                $.toast({
                    text:errMsg,
                    delay : 3000,
                })
                return
            }
            var params = {
                bankAccountName:bankAccountName,
                bankAccountNo: bankAccountNo,
                province: province,
                city:city,
                bankName:bankName,
                bankBranchName:bankBranchName,
            }
            editFinanceAccount(params)
        }
    })

    $(document).on('change','.withdrawal-application-dialog .amount',function(e){ // 查询个人提现扣税结算
        var withdrawPrice = $(this).val()
        utils.debounce(getPersonalAccountTax(withdrawPrice),1000)
    })

    $(document).on('click','.withdrawal-application-dialog .confirm-btn',function(e){ // 申请提现
       
    })
    $(document).on('click','.withdrawal-application-dialog .cancel-btn',function(e){ // 隐藏dialog
        closeRewardPop()
    })

    $(document).on('click','.balance-reflect',function(e){
        var financeaccountinfoIsComplete = financeAccountInfo.bankAccountName&&financeAccountInfo.bankAccountNo&&financeAccountInfo.province&&financeAccountInfo.city&&financeAccountInfo.bankName&&financeAccountInfo.bankBranchName&&financeAccountInfo.userTypeName?true:false
        // balance = 200
        if(balance&&+balance>100){
            if(financeaccountinfoIsComplete){
                $("#dialog-box").dialog({
                    html: $('#withdrawal-application-dialog').html(),
                    'closeOnClickModal':false
                }).open();
                uploadfile()
            }else{
                $("#dialog-box").dialog({
                    html: $('#go2FinanceAccount-dialog').html(),
                    'closeOnClickModal':false
                }).open(); 
            }
           
        }else{
            $.toast({
                text:'账户余额大于100元才可以提现',
                icon:'',
                delay : 2000,
                callback:false
            })
        }
      
       })
   
    $(document).on('click','.survey-content .export-details-btn',function(e){
    walletDetailsId  =  $(this).attr("data-id")
     $("#dialog-box").dialog({
        html: $('#send-email-dialog').html(),
        'closeOnClickModal':false
    }).open();
    })   
    $(document).on('click','.send-email-dialog .submit-btn',function(e){

        exportMyWalletDetail(walletDetailsId,email) 
    })
    function uploadfile(){
        var E = Q.event,
        Uploader = Q.Uploader;
        var uploader = new Uploader({
            url:location.protocol+"//upload.ishare.iask.com/ishare-upload/picUploadCatalog",
            target: [document.getElementById('upload-target')],
            upName:'file',
            dataType: "application/json",
            multiple: false,
            data: {fileCatalog:'ishare'},
            allows: ".jpg,.jpeg,.gif,.png", //允许上传的文件格式
            maxSize: 3 * 1024 * 1024,                //允许上传的最大文件大小,字节,为0表示不限(仅对支持的浏览器生效)
            //每次上传都会发送的参数(POST方式)
            on: {
                //添加之前触发
                add: function (task) {
                    //task.limited存在值的任务不会上传，此处无需返回false
                    switch (task.limited) {
                        case 'ext': return  $.toast({
                            text: "不支持此格式上传",
                        });
                        case 'size': return $.toast({
                            text: "资料不能超过3M",
                        }); 
                    }
                    
                    // console.log(task)
                    //自定义判断，返回false时该文件不会添加到上传队列
                },
                //上传完成后触发
                complete: function (task) {
                    if(task.limited) {
                        return false;
                    }
                    var res = JSON.parse(task.response);
                    if(res.data&&res.data.picKey){
                         $('.img-preview .img').attr('src',res.data.preUrl + res.data.picKey)
                         $('.img-preview .re-upload').text('重新上传')
                    }else{
                        $.toast({
                            text:'上传失败，重新上传',
                            icon:'',
                            delay : 2000,
                            callback:false
                        })
                    }
                }
            }
        });
       
    }
});