define(function(require , exports , module){
    require('../cmd-lib/toast');
    var bindPhone = {
        validateFrom:/^1[3456789]\d{9}$/,
        phone:'',
        textCode:'',
        downCountNum:60,
        isDisableMsg:false,
        avaliPhone:false,
        smsId:'',
        valiPhone:function(){
            console.log(this.phone)
           return this.validateFrom.test(this.phone)
        },
        initial:function(){
            $('.js-submit').click(this.sendData);
            $('.js-msg').click(this.getTextCode);
            $('.js-phone').on('keyup',function(){
                bindPhone.phone = $('.js-phone').val().trim();
            })
        },
        getTextCode:function(){
            if(bindPhone.valiPhone()) {
                bindPhone.avaliPhone = true
            }else {
                $.toast({
                    text:'请输入正确的手机号码',
                    icon:'',
                    delay : 2000,
                    callback:false
                })
            }
            if(!bindPhone.isDisableMsg && bindPhone.avaliPhone){
                bindPhone.downCountLimt()
                bindPhone.pictureVerify()
            }
        },
        downCountLimt:function(){
            var num = this.downCountNum
            var that = this
            bindPhone.isDisableMsg = true;
            $('.js-msg').addClass('btn-send-code-no');
            var timer = setInterval(function(){
                num--
                $('.js-msg').text(num+'秒')
                if(num<1){
                    clearInterval(timer);
                    that.isDisableMsg = false;
                    $('.js-msg').removeClass('btn-send-code-no');
                    $('.js-msg').text('获取验证码')
                }
            },1000)
        },
        // 图形验证码
        pictureVerify:function(appid,randstr,ticket,onoff){
            var params = {mobile:bindPhone.phone,nationCode:'86','businessCode':'6',terminal:'pc',appId:appid,randstr:randstr,ticket:ticket,onOff:onoff};
            params = JSON.stringify(params)
            $.ajax('/gateway/cas/sms/sendSms', { 
                type:"POST",
                data:params,
                contentType:'application/json'
            }).done(function(data){
                if(data.code=="0"){
                    bindPhone.smsId = data.data.smsId;
                    $('.js-msg').attr('smsId',data.data.smsId)
                    $.toast({
                        text:'短信发送成功',
                        icon:'',
                        delay : 2000,
                        callback:false
                    })
                }else if(data.code=="2112"){
                    bindPhone.showCaptchaProcess(bindPhone.pictureVerify)
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
        },
        showCaptchaProcess:function(options){
            bindPhone.showCaptcha(options);
        },
        showCaptcha:function(options){
            var appId="2071307690";
            var capt;
            if(!capt){
                capt = new TencentCaptcha(appId, bindPhone.captCallback, {'bizState':options});
            }
            capt.show();
        },
        captCallback:function (res) {
            if (res.ret === 0) {
                res.bizState(res.appid,res.randstr,res.ticket,1);
            }
        }
    }
    bindPhone.initial();

})