define(function (require, exports, module) {
    var type = window.pageConfig&&window.pageConfig.page.type
    var getUserCentreInfo = require('./home.js').getUserCentreInfo
    var isLogin = require('../application/effect.js').isLogin
    var api = require('../application/api');
    var method = require("../application/method"); 
    var simplePagination = require("./template/simplePagination.html")
    var mywallet = require("./template/mywallet.html") 
    var mywalletType = window.pageConfig&&window.pageConfig.page.mywalletType

    var  areaData = require('../common/area.js')
    var  bankData = require('../common/bankData.js')
    var provinceList = []
    var cityList = []
    var specialCity = ['北京市','天津市','重庆市','上海市','澳门','香港']
    var userFinanceAccountInfo = {}
   var auditStatusList = [  // 提现记录审核状态
       {
           0:'待审核',
           1:'审核通过',
           2:'审核不通过'
       }
   ]
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

    if(type=='mywallet'){
        isLogin(initCallback,true)
    }
    function initCallback(){
       getUserCentreInfo()
       if(mywalletType  == '1'){
        $(document).on('click','.balance-reflect',function(e){
            $("#dialog-box").dialog({
                html: $('#withdrawal-application-dialog').html(),
                'closeOnClickModal':false
            }).open();
           })
           var _mywalletTemplate = template.compile(mywallet)({list:[],mywalletType:mywalletType});
           $('.personal-center-mywallet').html(_mywalletTemplate)
       }   
        if(mywalletType == '2'){
            getWithdrawalRecord()
        }
        if(mywalletType == '3'){
            getFinanceAccountInfo()
        }
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

   function handleWithdrawalRecordData(res){
    var list = []
    res = withdrawalRecordData
    $(res.data.rows).each(function(index,item){
        item.withdrawTime = new Date(item.withdrawId).format("yyyy-MM-dd")
        item.withdrawPrice = item.withdrawPrice?(item.withdrawPrice/100).toFixed(2):'-'
        item.holdingTaxPrice = item.holdingTaxPrice?(item.holdingTaxPrice/100).toFixed(2):'-'
        item.transferTax = item.transferTax?(item.transferTax/100).toFixed(2):'-'
        item.auditStatusDesc = auditStatusList[item.auditStatus]
        item.finalPrice = item.finalPrice?(item.finalPrice/100).toFixed(2):'-'
        
        list.push(item)
    })
    var _mywalletTemplate = template.compile(mywallet)({list:list,mywalletType:mywalletType});
    $('.personal-center-mywallet').html(_mywalletTemplate)
    handlePagination(res.data.totalPages,res.data.currentPage) 
    }
    
   function getFinanceAccountInfo(){
    handleFinanceAccountInfo()  
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
                
           }else{
            $.toast({
                text:res.msg,
                delay : 3000,
            }) 
           }
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

    function editFinanceAccount(params){
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
});