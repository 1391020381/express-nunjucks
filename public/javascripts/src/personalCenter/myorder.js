define(function(require , exports , module){
    var type = window.pageConfig&&window.pageConfig.page.type
    var isLogin = require('./effect.js').isLogin
    var getUserCentreInfo = require('./home.js').getUserCentreInfo

    if(type == 'myorder'){
        isLogin(initData) 
    }
    
    function initData(){
        getUserCentreInfo()
        queryOrderlistByCondition()
    }
    function queryOrderlistByCondition() {  
        $.ajax({
            url: api.order.queryOrderlistByCondition,
            type: "POST",
            data:JSON.stringify({
                userId:'',
                orderStatus:'',
                startDate:'',
                endDate:'',
                userOpt:'0',
                currentPage:1,
                pageSize:10,
                sortStr:'orderTime'
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (res) {
               if(res.code == '0'){
                    console.log('getUserCentreInfo:',res)
                    var myorder = require("./template/myorder.html")
                    var _myorderTemplate = template.compile(myorder)({});
                   $(".personal-center-myorder").html(_myorderTemplate);      
               }else{
                $.toast({
                    text:res.msg||'查询用户信息失败',
                    delay : 3000,
                })
               }
            },
            error:function(error){
                console.log('getUserCentreInfo:',error)
            }
        })
    }
});