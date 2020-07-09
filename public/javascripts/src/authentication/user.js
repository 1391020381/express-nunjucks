define(function(require , exports , module){
    require("../cmd-lib/upload/Q");
    require("../cmd-lib/upload/Q.Uploader");
    require("./fixedTopBar");
    require("./msgVer");
    require('../cmd-lib/toast');
    var utils = require("../cmd-lib/util");
    var login = require("../application/checkLogin");
    var refreshTopBar = require("./login");
    var userObj= {
        nickName: '',
        validateFrom:/^1[3456789]\d{9}$/,
        init:function(){
            this.beforeInit();
            this.selectBind();
            this.delUploadImg();
            this.checkedRules();
            this.queryCerinfo()
            $('.js-submit').click(function(){
                userObj.submitData();
            })
            $('body').click(function(){
                    $('.jqTransformSelectWrapper ul').slideUp()
            })
            setTimeout(function(){
                userObj.uploadfile();
            },500)
             // 登录
             $('.user-login,.login-open-vip').on('click', function () {
                if (!utils.getCookie('cuk')) {
                    login.notifyLoginInterface(function (data) {
                        refreshTopBar(data);
                        userObj.nickName = data.nickName;
                        $('.js-count').text(data.nickName)
                    });
                }
            });
            // 退出登录
            $('.btn-exit').click(function(){
                login.ishareLogout()
            })
            // 头部搜索跳转
            $('.btn-new-search').click(function(){
                var searVal = $('#search-detail-input').val()
                window.open('/search/home.html'+ '?' + 'ft=all' + '&cond='+ encodeURIComponent(encodeURIComponent(searVal)))
            }) 
        },
        beforeInit:function(){
            if (!utils.getCookie('cuk')) {
                login.notifyLoginInterface(function (data) {
                   if (data) {
                        userObj.nickName = data.nickName;
                        $('.js-count').text(data.nickName)
                        refreshTopBar(data);
                   }
                });
            }else {
                login.getLoginData(function (data) {
                    if (data) {
                        userObj.nickName = data.nickName;
                        $('.js-count').text(data.nickName)
                        refreshTopBar(data);
                        
                   }
                });
            }
        },
         // 查询认证信息
         queryCerinfo:function(){
            $.ajax('/gateway/user/certification/getPersonal', {
                type:"get"
            }).done(function(data){
                if(data.code=="0"){
                    if(data.data.auditStatus==3) {
                        $('.dialog-limit').show();
                       $('#bgMask').show()
                    }
                }

            }).fail(function(e){
                console.log("error==="+e);
            })
        },
       //认证类型选
       selectBind:function(){
           $('.js-select').click(function(e){
               $(this).siblings('ul').slideToggle();
               e.stopPropagation()
           });
           $('.jqTransformSelectWrapper ul').on('click','li a',function(){
                $('.jqTransformSelectWrapper ul').find('li a').removeClass('selected')
                $(this).addClass('selected');
                $('.jqTransformSelectWrapper ul').slideUp()
                $('.js-select span').text($(this).text())
                $('.js-select span').attr('authType',$(this).attr('index'))

           })
       },
        //图片上传
        uploadfile:function(){
            var currentTarget = ''
            $('.btn-rz-upload').on('click',function(){
                currentTarget =$(this);
            })
            var E = Q.event,
            Uploader = Q.Uploader;
            var uploader = new Uploader({
                url:location.protocol+"//upload.ishare.iask.com/ishare-upload/picUploadCatalog",
                target: [$('#js-id-front')[0],$('#js-id-back')[0],$('#js-id-hand')[0],$('#js-cer')[0]],
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
                        currentTarget.attr('val',res.data.picKey);
                        currentTarget.siblings('.rz-upload-pic').find('img').attr('src',res.data.preUrl+res.data.picKey);
                        currentTarget.siblings('.rz-upload-pic').find('.delete-ele').show()
                    }
                }
            });
           
        },
        // 删除已上传的图片
        delUploadImg:function() {
            $('.delete-ele').click(function(){
                $(this).hide()
                if($(this).parents('.rz-main-dd').find('.btn-rz-upload').attr('id') =='upload-target2') {
                    $(this).siblings('img').attr('src','../../../images/auth/pic_zj.jpg')
                }else {
                    $(this).siblings('img').attr('src','../../../images/auth/pic_sfz_z.jpg')
                }
                $(this).parents('.rz-main-dd').find('.btn-rz-upload').attr('val','')
            })
        },
        //勾选和取消协议
        checkedRules:function() {
            $('.rz-label .check-con').click(function(){
                $('.rz-label .check-con').toggleClass('checked')
            })
        },
        // 提交数据
        submitData:function(){
            // nickName	否	String	昵称
            // realName	是	String	真实姓名
            // authType	是	Integer	认证类型；0:中小学教师；1:大学或高职教师；2:网络营销；3:IT/互联网；4:医学；5: 建筑工程；6: 金融/证券；7: 汽车/机械/制造；8: 其他；9: 设计师
            // idCardNo	是	String	身份证号码
            // idCardFrontPic	是	String	身份证正面照片
            // idCardBackPic	是	String	身份证背面照片
            // handFrontIdCardPic	否	String	手持身份证照
            // credentialsPic	否	String	证件材料照片
            // authAppellation	否	String	认证称谓
            // workUnit	否	String	工作单位
            // personProfile	否	String	个人简介
            // personWeibo	否	String	个人微博
            // phoneNumber	是	String	手机号码
            // qqNumber	否	String	qq号码
            // smsId	是	String	验证码id
            // checkCode	是	String	验证码
            var params = {
                nickName:userObj.nickName,
                realName:$('.js-realName').val().trim(),
                authType:Number($('.js-authType').attr('authtype')),
                idCardNo:$('.js-idCardNo').val().trim(),
                idCardFrontPic:$('#js-id-front').attr('val'),
                idCardBackPic:$('#js-id-back').attr('val'),
                handFrontIdCardPic:$('#js-id-hand').attr('val'),
                credentialsPic:$('#js-cer').attr('val'),
                authAppellation:$('.js-authAppellation').val().trim(),
                workUnit:$('.js-workUnit').val().trim(),
                personProfile:$('.js-personProfile').val().trim(),
                personWeibo:$('.js-personWeibo').val().trim(),
                phoneNumber:$('.js-phone').val().trim(),
                qqNumber:$('.js-qqNumber').val().trim(),
                smsId:$('.js-msg').attr('smsId'),
                checkCode:$('.js-msg-val').val().trim()
            }
            if(!params.realName) {
                $.toast({
                    text:'请输入真实姓名',
                    icon:'',
                    delay : 2000,
                    callback:false
                })
                return false;
            }
            if(!params.idCardNo) {
                $.toast({
                    text:'请输入身份证号码',
                    icon:'',
                    delay : 2000,
                    callback:false
                })
                return false;
            }
            if(!params.idCardFrontPic) {
                $.toast({
                    text:'请上传身份证正面照片',
                    icon:'',
                    delay : 2000,
                    callback:false
                })
                return false;
            }
            if(!params.idCardBackPic) {
                $.toast({
                    text:'请上传身份证背面照片',
                    icon:'',
                    delay : 2000,
                    callback:false
                })
                return false;
            }
            if(!params.handFrontIdCardPic) {
                $.toast({
                    text:'请上传手持身份证照',
                    icon:'',
                    delay : 2000,
                    callback:false
                })
                return false;
            }
            if(!params.credentialsPic) {
                $.toast({
                    text:'请上传证件材料照片',
                    icon:'',
                    delay : 2000,
                    callback:false
                })
                return false;
            }
            if(!params.phoneNumber) {
                $.toast({
                    text:'请输入正确的手机号码',
                    icon:'',
                    delay : 2000,
                    callback:false
                })
                return false;
            }
            if(!params.checkCode) {
                $.toast({
                    text:'请输入手机验证码',
                    icon:'',
                    delay : 2000,
                    callback:false
                })
                return false;
            }
            if(!$('.rz-label .check-con').hasClass('checked')) {
                $.toast({
                    text:'请勾选用户认证协议',
                    icon:'',
                    delay : 2000,
                    callback:false
                })
                return false;
            }
            params = JSON.stringify(params)
            $.ajax('/gateway/user/certification/personal', {
                type:"POST",
                data:params,
                contentType:'application/json'
            }).done(function(data){
                if(data.code=="0"){
                    $.toast({
                        text:data.msg,
                        icon:'',
                        delay : 2000,
                        callback:function(){
                            location.reload()
                        }
                    })
                }else{
                    $.toast({
                        text:data.msg,
                        icon:'',
                        delay : 2000,
                        callback:false
                    })
                }

            }).fail(function(e){
                console.log("error==="+e);
            })
        }
   }
   userObj.init();
});