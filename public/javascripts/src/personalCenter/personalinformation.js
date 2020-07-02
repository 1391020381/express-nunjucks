define(function(require , exports , module){
    var api = require('../application/api');
    var method = require("../application/method");
    require('../cmd-lib/jquery.datepicker.js')
    var  areaData = require('../common/area.js')
    var provinceList = []
    var cityList = []
    var userInfoInfomation = {}
    var type = window.pageConfig&&window.pageConfig.page.type
    var isLogin = require('./effect.js').isLogin
    var getUserCentreInfo = require('./home.js').getUserCentreInfo
    if(type == 'personalinformation'){
        isLogin(initData)
    }
    function initData(){
        getUserCentreInfo(getUserCentreInfoCallBack)
    }
    function getUserCentreInfoCallBack(userInfo,editUser){
        console.log('userInfo:',userInfo)
        getProvinceAndCityList(userInfo)
        var personalinformation = require("./template/personalinformation.html")
        // userInfo.prov = '北京市'
        // userInfo.city ='西城区'
            var _personalinformationTemplate = template.compile(personalinformation)({userInfo:userInfo,provinceList:provinceList,cityList:cityList,editUser:editUser});
            $(".personal-center-personalinformation").html(_personalinformationTemplate);
            if(birthday){  // $('#date-input').val() 获取日志
                var formatDate = method.formatDate
                Date.prototype.dateFormatting = formatDate
                var birthday = userInfo.birthday? new Date( userInfo.birthday).format("yyyy-MM-dd"):''
                $('.item-date-input').datePicker(birthday);
            }else{
                $('.item-date-input').datePicker();
            } 
    }
    function getProvinceAndCityList(userInfo){
        userInfoInfomation = userInfo
        areaData.forEach(function(item){
            provinceList.push(item.name)
            if(item.name == userInfo.city){
                if(item.city){
                    item.city.forEach(function(itemCity){
                         cityList.push(itemCity.name)
                    })
                }
            }else{
                areaData[0].city[0].area.forEach(function(itemCity){
                    cityList.push(itemCity)
                })
            }
        })
        console.log('provinceList:',provinceList,'cityList:',cityList)
    }
   
    function editUser(gender,birthday,prov,city,email){
        $.ajax({
            url: api.user.editUser,
            type: "POST",
            data: JSON.stringify({
                gender:gender =='男'?'M':'F',
                birthday:birthday,
                prov:prov,
                city:city,
                email:email
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (res) {
               if(res.code == '0'){
                console.log('editUser:',res)
                initData()
               }else{
                $.toast({
                    text:res.msg,
                    delay : 3000,
                })
               }
            },
            error:function(error){
                console.log('editUser:',error)
            }
        })
    }

    $(document).on('click','.personalinformation .edit-information',function(e){ // active-input      
      var edit = $(this).attr('data-edit')
      if(edit == 'edit'){
        getUserCentreInfoCallBack(userInfoInfomation,'editUser')
      }else if(edit == 'save'){
        var province = $('.item-province-select').val()
        var city = $('.item-city-select').val()
        var sex = $('.item-sex-select').val()
        var birthday = $('.item-date-input').val()
        var email = $('.item-email-input').val()
        var errMsg = ''
        if(!province&&(errMsg = '请选择所在省')||!city&&(errMsg='请选择所在的市')||!sex&&(errMsg='请选择性别')||!birthday&&(errMsg='请选择生日')||!email&&(errMsg='请填写邮箱')){
            $.toast({
                text:errMsg,
                delay : 3000,
            })
            return
        }
        editUser(sex,new Date(birthday).getTime(),province,city,email)
      }else if(edit == 'cancel'){
        getUserCentreInfoCallBack(userInfoInfomation,'')
      }
    })

    $(document).on('change','.personalinformation .item-province-select',function(e){ // 北京市 天津市 重庆市  上海市 澳门 香港
          var provinceName = $(this).val()
          var  str = ''
          var cityList = []  
          var specialCity = ['北京市','天津市','重庆市','上海市','澳门','香港']
         areaData.forEach(function(itemCity){
            if(provinceName == itemCity.name && specialCity.indexOf(provinceName)>-1){
                itemCity.city.forEach(function(itemArea){
                    itemArea.area.forEach(function(area){
                        cityList.push(area)
                    })
                })
            }else{
              if(provinceName == itemCity.name){
                  itemCity.city.forEach(function(city){
                      cityList.push(city.name)
                  })
              }  
            }
         }) 
          

          cityList.forEach(function(city){
            str +='<option value="'+city +'">'+city +'</option>' 
          })
         
          $('.personalinformation .item-city-select').html(str);
    })
});
