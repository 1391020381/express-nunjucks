define(function(require , exports , module){
    require("../cmd-lib/upload/Q");
    require("../cmd-lib/upload/Q.Uploader");
    require("./fixedTopBar");
    require("./msgVer");
    require('../cmd-lib/toast');
    var utils = require("../cmd-lib/util");
    var method = require("../application/method");
    var isLogin = require('../application/effect.js').isLogin;
    var isAutoLogin = true;
    var callback = null;
    isLogin(function(data){
        $('.js-count').text(data.nickName);
    },isAutoLogin,function(){
        location.reload()
    });
    var orgObj = {
        nickName: '',
        validateFrom:/^1[3456789]\d{9}$/,
        init:function(){
            this.selectBind();
            this.delUploadImg();
            this.checkedRules();
            if(method.getCookie('cuk')) {
                this.queryCerinfo()
            }
            $('.js-submit').click(function(){
                if (method.getCookie('cuk')){
                    orgObj.submitData();
                }else{
                    isLogin(null,isAutoLogin) 
                }
               
            })
            $('body').click(function(){
                 $('.jqTransformSelectWrapper ul').slideUp()
            })
            setTimeout(function(){
                orgObj.uploadfile();
            },800)
        },
        // 查询认证信息
        queryCerinfo:function(){
            $.ajax('/gateway/user/certification/getInstitutions', {
                type:"get"
            }).done(function(data){
                if(data.code=="0"){
                    if(data.data&&data.data.auditStatus==3) {
                       $('.dialog-limit').show();
                       $('#bgMask').show()
                    }else if(data.data) {
                        if(data.data.auditStatus ==0||data.data.auditStatus ==1){
                            $('.header-process .process-item').eq(1).addClass('step-now').siblings().removeClass('step-now')
                        }else if(data.data.auditStatus==2) {
                            $('.header-process .process-item').eq(2).addClass('step-now').siblings().removeClass('step-now')
                        }
                        $('.js-realName').val(data.data.realName).attr('disabled','disabled');
                        var organizeIndustryArr = [
                            {val:0,title:'企业'},
                            {val:1,title:'学校'},
                            {val:2,title:'网络营销'},
                            {val:3,title:'IT/互联网'},
                            {val:4,title:'医学'}
                        ]
                        var industryTypeArr = [
                            {val:0,title:'教育'},
                            {val:1,title:'法律'},
                            {val:2,title:'建筑/房地产'},
                            {val:3,title:'制造加工'},
                            {val:4,title:'通信电子'},
                            {val:5,title:'农林牧渔'},
                            {val:6,title:'健康/医学'},
                            {val:7,title:'IT/互联网'},
                            {val:8,title:'水利电力'},
                            {val:9,title:'公关广告'},
                            {val:10,title:'行业资讯'},
                            {val:11,title:'金融'},
                            {val:12,title:'石油化工'},
                            {val:13,title:'人文艺术'},
                            {val:14,title:'军事/航天/航空'},
                            {val:15,title:'餐饮美食'},
                            {val:16,title:'交通运输'},
                            {val:17,title:'出版行业'},
                            {val:18,title:'娱乐休闲'},
                            {val:19,title:'生活科普'},
                            {val:20,title:'学术/科研'},
                            {val:21,title:'能源矿产'},
                            {val:22,title:'文化传媒'},
                            {val:23,title:'体育'},
                            {val:24,title:'旅游'},
                            {val:25,title:'政府'},
                            {val:26,title:'其他'}
                        ]
                        $('.js-organize span').text(organizeIndustryArr[data.data.organizeIndustryType].title);
                        $('.js-organlist').remove();
                        $('.js-industry span').text(industryTypeArr[data.data.industryType].title);
                        $('.js-industryTypeList').remove();
                        $('.js-organize-name').val(data.data.organizeName).attr('disabled','disabled');
                        $('.js-website').val(data.data.organizeWebsite).attr('disabled','disabled');
                        $('.js-brief').val(data.data.organizeProfile).attr('disabled','disabled');
                        $('.js-add').val(data.data.organizeAddress).attr('disabled','disabled');
                        $('.js-cer-code').val(data.data.socialCreditCode).attr('disabled','disabled');
                        $('.js-logoPic img').attr('src',data.data.logoPic);
                        $('#upload-target').removeAttr('id')
                        $('.js-businessLicensePic img').attr('src',data.data.businessLicensePic);
                        $('#upload-target2').removeAttr('id')
                        $('.js-phone').val(data.data.contactNumber).attr('disabled','disabled');
                        $('.js-mail').val(data.data.email).attr('disabled','disabled');
                        $('.js-msg').attr('disabled','disabled');
                        $('.js-edit').hide()
                        
                        
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
                 $(this).parents('ul').siblings('.js-select').find('span').text($(this).text())
                 $(this).parents('ul').siblings('.js-select').attr('authType',$(this).attr('index'))
 
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
                target: [document.getElementById("upload-target"),document.getElementById("upload-target2")],
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
                         //读取图片数据
                         if (currentTarget.attr('id') =='upload-target') {
                            var file = task.file;
                            var fileReader = new FileReader();
                            fileReader.readAsDataURL(file); //根据图片路径读取图片
                            fileReader.onload = function(e) {
                                var base64 = this.result;
                                var img = new Image();
                                img.src = base64;
                                img.onload = function() {
                                    widthRadio = img.naturalWidth/img.naturalHeight;
                                    if (widthRadio !=1) {
                                        $.toast({
                                                text: "要求尺寸200*200像素",
                                            });
                                        task.limited  = true  
                                    }
                                }
                            }
                         }
                        
                        // console.log(task)
                        //自定义判断，返回false时该文件不会添加到上传队列
                    },
                    //上传完成后触发
                    complete: function (task) {
                        console.log(task,'task')
                        if(task.limited) {
                            return false;
                        }
                        var res = JSON.parse(task.response);
                        if(res.data&&res.data.picKey) {
                            currentTarget.attr('val',res.data.picKey);
                            currentTarget.siblings('.rz-upload-pic').find('img').attr('src',res.data.preUrl+res.data.picKey);
                            currentTarget.siblings('.rz-upload-pic').find('.delete-ele').show()
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
            // organizeIndustryType	是	Integer	原来机构行业，名字改为“所属类型”所属类型；0:企业；1:学校；2:网络营销；3:IT/互联网；4:医学
            // industryType	是	Integer	所属行业：0-教育、1-法律、2-建筑/房地产、3-制造加工、4-通信电子、5-农林牧渔、6-健康/医学、7-IT/互联网、8-水利电力、9-公关广告、10-行业资讯、 
            // 11-金融、12-石油化工、13-人文艺术、14-军事/航天/航空、15-餐饮美食、16-交通运输、17-出版行业、18-娱乐休闲、19-生活科普、20-学术/科研、21-能源矿产、22-文化传媒、23-体育、24-旅游、25-政府、26-其他
            // organizeName	是	String	机构名称
            // organizeWebsite	否	String	机构官网
            // organizeProfile	否	String	机构简介
            // organizeAddress	否	String	机构地址
            // socialCreditCode	是	String	统一社会信用代码
            // logoPic	是	String	企业logo图片
            // businessLicensePic	是	String	营业执照图片
            // contactNumber	是	String	联系电话(手机号码)
            // email	是	String	邮箱地址
            // smsId	是	String	验证码id
            // checkCode	是	String	验证码
            if(!$('.js-organize-name').val().trim()) {
                $.toast({
                    text:'请输入机构名称',
                    icon:'',
                    delay : 2000,
                    callback:false
                })
                return false;
            }
            if(!$('.js-cer-code').val().trim()) {
                $.toast({
                    text:'请输入社会信用代码',
                    icon:'',
                    delay : 2000,
                    callback:false
                })
                return false;
            }
            if(!$('#upload-target').attr('val')) {
                $.toast({
                    text:'请上传企业logo',
                    icon:'',
                    delay : 2000,
                    callback:false
                })
                return false;
            }
            if(!$('#upload-target2').attr('val')) {
                $.toast({
                    text:'请上传营业执照',
                    icon:'',
                    delay : 2000,
                    callback:false
                })
                return false;
            }
            if(!orgObj.validateFrom.test($('.js-phone').val().trim())) {
                $.toast({
                    text:'请输入正确的手机号码',
                    icon:'',
                    delay : 2000,
                    callback:false
                })
                return false;
            }
            if(!$('.js-msg-val').val().trim()) {
                $.toast({
                    text:'请输入短信验证码',
                    icon:'',
                    delay : 2000,
                    callback:false
                })
                return false;
            }
            if(!$('.js-mail').val().trim()) {
                $.toast({
                    text:'请输入电子邮箱',
                    icon:'',
                    delay : 2000,
                    callback:false
                })
                return false;
            }
           
            var params = {
                nickName:orgObj.nickName,
                organizeIndustryType:$('.js-organize').attr('authtype'),
                industryType:$('.js-industry').attr('authtype'),
                organizeName:$('.js-organize-name').val().trim(),
                organizeWebsite:$('.js-website').val().trim(),
                organizeProfile:$('.js-brief').val().trim(),
                organizeAddress:$('.js-add').val().trim(),
                socialCreditCode:$('.js-cer-code').val().trim(),
                logoPic:$('#upload-target').attr('val'),
                businessLicensePic:$('#upload-target2').attr('val'),
                contactNumber:$('.js-phone').val().trim(),
                email:$('.js-mail').val().trim(),
                smsId:$('.js-msg').attr('smsId'),
                checkCode:$('.js-msg-val').val().trim()
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
            params = JSON.stringify(params);

            $.ajax('/gateway/user/certification/institutions', {
                type:"POST",
                data:params,
                contentType:'application/json'
            }).done(function(data){
                if(data.code=="0"){
                    $.toast({
                        text:'提交成功',
                        icon:'',
                        delay : 3000,
                        callback:function(){
                            location.reload()
                        }
                    })
                }else{
                    $.toast({
                        text:data.msg,
                        icon:'',
                        delay : 2000,
                       
                    })
                }

            }).fail(function(e){
                console.log("error==="+e);
            })
        }
    }
    orgObj.init();
 });