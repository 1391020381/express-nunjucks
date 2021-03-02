define(function (require, exports, moudle) {
    // var $ = require("$");
    var api = require('../application/api');
    var method = require('../application/method');


    function formatTel(mobile) {
        var value = mobile.replace(/\D/g, '').substring(0, 11);
        var valueLen = value.length;
        if (valueLen > 3 && valueLen < 8) {
            value = value.replace(/^(...)/g, '$1 ');
        } else if (valueLen >= 8) {
            value = value.replace(/^(...)(....)/g, '$1 $2 ');
        }
        return value;
    }

    function handle(flag) {
        if (flag == '1') {
            // 334
            var mobile = $('#mobile').val();
            $('.carding-error').hide();
            if (mobile) {
                $('#mobile').val(formatTel(mobile));
                $('.btn-binding-code').removeClass('btn-code-no');
            } else {
                $('.btn-binding-code').addClass('btn-code-no');
            }

        }
    }


    $(function () {
        // debugger
        // 手机区号选择
        var $choiceCon = $('.phone-choice');
        var pageType = $('#ip-page-type').val();// 页面类型
        var $checkCode = $('#ip-checkCode');// 手机验证码
        var $mobile = $('#mobile');// 手机号
        var $captcha = $('.login-input-item.img-code-item');// 图形验证码div
        var $loginError = $('.carding-error span');// 错误提醒位置

        $choiceCon.find('.phone-num').click(function (e) {
            e.stopPropagation();
            if ($(this).siblings('.phone-more').is(':hidden')) {
                $(this).parent().addClass('phone-choice-show');
                $(this).siblings('.phone-more').show();
            } else {
                $(this).parent().removeClass('phone-choice-show');
                $(this).siblings('.phone-more').hide();
            }
        });
        $('.phone-more').find('a').click(function () {
            var countryNum = $(this).find('.number-con').find('em').text();
            $choiceCon.find('.phone-num').find('em').text(countryNum);
            $choiceCon.removeClass('phone-choice-show');
            $choiceCon.find('.phone-more').hide();
        });

        // 手机号格式化(xxx xxxx xxxx)
        $(document).on('keyup', '#mobile', function () {
            handle(1);
        });

        // enter 键
        $(document).keyup(function (event) {
            if (event.keyCode == 13) {
                $('.btn-phone-login').trigger('click');
            }
        });


        // 绑定
        $('.btn-bind').click(function () {
            if ($(this).hasClass('btn-code-no')) {
                return;
            }
            var mobile = $mobile.val().replace(/\s/g, '');
            var checkCode = $checkCode.val();
            var nationCode = $('.phone-num em').text();
            if (/^\s*$/g.test(mobile)) {
                $loginError.text('请输入手机号码!').parent().show();
                return;
            }
            if (/^\s*$/g.test(checkCode)) {
                $loginError.text('请输入验证码!').parent().show();
                return;
            }
            var params = {
                'nationCode': nationCode,
                'mobile': mobile,
                'smsId': $checkCode.attr('smsId'),
                'checkCode': checkCode
            };
            // $.post('/pay/bindMobile', params, function (data) {
            //     if (data) {
            //         if (data.code == '0') {
            //             $(".binging-main").hide();
            //             $(".binging-success").show();
            //         } else {
            //             $loginError.text(data.msg).parent().show();
            //             $(".carding-error").show();
            //         }
            //     }
            // }, 'json');
            userBindMobile(mobile, $checkCode.attr('smsId'), checkCode);
            function userBindMobile(mobile, smsId, checkCode){ // 绑定手机号接口
                $.ajax({
                    headers:{
                        'Authrization':method.getCookie('cuk')
                    },
                    url: api.user.userBindMobile,
                    type: 'POST',
                    contentType: 'application/json; charset=utf-8',
                    data:JSON.stringify({
                        terminal:'pc',
                        mobile:mobile,
                        nationCode:$('.phone-choice .phone-num em').text(),
                        smsId:smsId,
                        checkCode:checkCode
                    }),
                    dataType: 'json',
                    success: function (res) {
                        if(res.code == '0'){
                            $('.binging-main').hide();
                            $('.binging-success').show();
                        }else{
                            $loginError.text(res.message).parent().show();
                            $('.carding-error').show();
                        }
                    },
                    error:function(error){
                        console.log('userBindMobile:', error);
                    }
                });
            }
        });

        var captcha = function (appId, randstr, ticket, onOff) {
            var _this = $('.binging-main .yz-link');
            if ($(_this).hasClass('btn-code-no')) {
                return;
            }
            var mobile = $mobile.val().replace(/\s/g, '');
            if (/^\s*$/g.test(mobile)) {
                $loginError.text('请输入手机号码!').parent().show();
                return;
            }
            $loginError.parent().hide();
            var param = JSON.stringify({
                // 'phoneNo': mobile,
                // 'businessCode': $(_this).siblings('input[name="businessCode"]').val(),
                // 'appId': appId,
                // 'randstr': randstr,
                // 'ticket': ticket,
                // 'onOff': onOff
                mobile:mobile,
                nationCode:$('.phone-choice .phone-num em').text(),
                businessCode:$(_this).siblings('input[name="businessCode"]').val(), // 功能模块（1-注册模块、2-找回密码、3-修改密码、4-登录、5-绑定/更换手机号手机号（会检查手机号是否被使用过）、6-旧手机号获取验证码）
                terminal:'pc',
                'appId': appId,
                'randstr': randstr,
                'ticket': ticket,
                'onOff': onOff
            });
            $.ajax({
                type: 'POST',
                // url: api.sms.getCaptcha,
                url:api.user.sendSms,
                contentType: 'application/json;charset=utf-8',
                dataType: 'json',
                data: param,
                success: function (data) {
                    if (data) {
                        if (data.code == '0') {
                            $checkCode.removeAttr('smsId');
                            $checkCode.attr('smsId', data.data.smsId);
                            var yzTime$ = $(_this).siblings('.yz-time');
                            yzTime$.addClass('btn-code-no');
                            yzTime$.show();
                            $(_this).hide();
                            $('.btn-none-bind').hide();
                            $('.btn-bind').show();
                            // $(".btn-binging").removeClass("btn-binging-no");
                            (function countdown() {
                                var yzt = yzTime$.text().replace(/秒后重发$/g, '');
                                yzt = /^\d+$/g.test(yzt) ? Number(yzt) : 60;
                                if (yzt && yzt >= 0)
                                    yzTime$.text(--yzt + '秒后重发');
                                if (yzt <= 0) {
                                    yzTime$.text('60秒后重发').hide();
                                    $(_this).text('重获验证码').show();
                                    return;
                                }
                                setTimeout(countdown, 1000);
                            })();
                            // 单日单ip发送验证码超过3次
                        }
                        // 单日单ip发送验证码超过3次
                        else if (data.code == '411015') {
                            showCaptcha(captcha);
                        } else if (data.code == '411033') {
                            // 图形验证码错误
                            $loginError.text('图形验证码错误').parent().show();
                        } else {
                            $loginError.text(data.message).parent().show();
                        }
                    } else {
                        $loginError.text('发送短信失败').parent().show();
                    }
                }
            });
        };
        /* 获取短信验证码*/
        $('.binging-main').delegate('.yz-link', 'click', function () {
            captcha('', '', '', '');
        });
    });

    /**
     * 天御验证码相关功能
     */
    var capt;
    var showCaptcha = function (options) {
        var appId = '2071307690';
        if (!capt) {
            capt = new TencentCaptcha(appId, captchaCallback, {'bizState': options});
        }
        capt.show();
    };

    var captchaCallback = function (res) {
        // res（用户主动关闭验证码）= {ret: 2, ticket: null}
        // res（验证成功） = {ret: 0, ticket: "String", randstr: "String"}
        if (res.ret === 0) {
            res.bizState(res.appid, res.randstr, res.ticket, 1);
        }
    };
    return {
        showCaptcha:showCaptcha
    };
});