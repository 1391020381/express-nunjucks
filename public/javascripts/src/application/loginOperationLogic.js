define(function (require, exports, module) {

    // import api from "../../common/api";
    // import "../../common/myDialog";
    // import method from "../../common/method";
    // import showCaptcha from "../../common/bindphone";
    // import IframeMessenger from "../../common/iframe-messenger";
    require('../cmd-lib/jqueryMd5.js');
    var api = require('../application/api');
    var method = require('../application/method');
    var showCaptcha = require('../common/bindphone').showCaptcha;
    var urlConfig = require('./urlConfig')

    myWindow = ''; // 保存第三方授权时,打开的标签
    var smsId = ''; // 验证码
    var myWindow = ''; // 保存 openWindow打开的对象
    var sceneId = ''; // 微信二维码的场景id
    var mobile = ''; // 获取验证码手机号
    var businessCode = ''; // 获取验证码的场景
    var timer = null; // 二维码过期
    var setIntervalTimer = null; // 保存轮询微信登录的定时器
    var expires_in = ''; // 二位码过期时间
    var jsId = '';
    var cid = '';
    var messenger = ''; // 记录当前那个 iframeMessager监听到数据
    var originUrl = ''; // 保存调用登录的页面url
    var redirectUrl = '';
    var bilogUrl = '';
    var visitor_id = '';
    var bilog = {}; // 数据上报参数

    var successFun = '';

    window.loginTypeList = {
        type: 'wechat',
        values: {
            0: 'wechat', // 微信登录
            1: 'qq', // qq登录
            2: 'weibo', // 微博登录
            3: 'phoneCode', // 手机号+验证码
            4: 'phonePw'// 手机号+密码
        }
    }; //   保存登录方式在 登录数上报时使用
    $(document).on('click', '.login-content .login-type-list .login-type-weixin .weixin-icon', function (e) { // 切换到微信登录
        $('.login-content .verificationCode-login').hide();
        $(' .login-content .password-login').hide();
        $('.login-content .weixin-login').show();
        window.loginTypeList.type = window.loginTypeList.values[0];
    });

    $(document).on('click', '.login-content .login-type-list .login-type-verificationCode', function (e) { // 切换到验证码
        $('.login-content .password-login').hide();
        $('.login-content .weixin-login').hide();
        $('.login-content .verificationCode-login').show();

        window.loginTypeList.type = window.loginTypeList.values[3];
        iask_web.track_event('NE002', 'normalClick', 'click', {
            domID:'mobileLogin',
            domName:'登录页短信验证码登录'
        });
    });

    $(document).on('click', '.login-content .login-type-list .login-type-password', function (e) { // 切换到密码登录
        $('.login-content .weixin-login').hide();
        $('.login-content .verificationCode-login').hide();
        $('.login-content .password-login').show();

        window.loginTypeList.type = window.loginTypeList.values[4];
        iask_web.track_event('NE002', 'normalClick', 'click', {
            domID:'pwLogin',
            domName:'登录页密码登录'
        });

    });

    $(document).on('click', '.login-content  .login-type-list .login-type', function () { // 第三方登录
        var loginType = $(this).attr('data-logintype'); // qq  weibo
        if (loginType) {
            handleThirdCodelogin(loginType);
            if (loginType == 'qq') {
                window.loginTypeList.type = window.loginTypeList.values[1];
                iask_web.track_event('NE002', 'normalClick', 'click', {
                    domID:'qqLogin',
                    domName:'登录页QQ登录'
                });

            }
            if (loginType == 'weibo') {
                window.loginTypeList.type = window.loginTypeList.values[2];
                iask_web.track_event('NE002', 'normalClick', 'click', {
                    domID:'weiboLogin',
                    domName:'登录页微博登录'
                });

            }
        }

    });
    $(document).on('click', '.login-content .login-btn', function (e) { //  密码和验证码登录
        var logintype = $(this).attr('data-logintype');
        var nationCode = '';
        var mobile = '';
        if (logintype == 'verificationCode') {
            nationCode = $('.login-content .verificationCode-login .phone-num').text().replace(/\+/, '').trim();
            var checkCode = $('.login-content .verificationCode-login .verification-code').val();
            mobile = $('.login-content .verificationCode-login .telphone').val().trim();
            if (!method.testPhone(mobile) && nationCode == '86') {
                showErrorTip('verificationCode-login', true, '手机号错误');

                return;
            }
            if (!checkCode || checkCode && checkCode.length !== 4) {

                showErrorTip('verificationCode-login', true, '验证码错误');
                return;
            }

            showErrorTip('verificationCode-login', false, '');
            loginByPsodOrVerCode('codeLogin', mobile, nationCode, smsId, checkCode, ''); // mobile 在获取验证码时 在全局mobile保存
            iask_web.track_event('NE002', 'normalClick', 'click', {
                domID:'login',
                domName:'登录页登录按钮'
            });
            return;
        }
        if (logintype == 'password') { // mobile

            nationCode = $('.login-content.password-login .phone-num').text().replace(/\+/, '').trim();
            var password = $('.login-content .password-login .password .login-password:visible').val().trim();
            mobile = $('.login-content .password-login .telphone').val().trim();
            if (!method.testPhone(mobile) && nationCode == 86) {

                showErrorTip('password-login', true, '手机号错误');
                return;
            }

            loginByPsodOrVerCode('ppLogin', mobile, nationCode, '', '', password);
            iask_web.track_event('NE002', 'normalClick', 'click', {
                domID:'login',
                domName:'登录页登录按钮'
            });
            return;
        }
    });

    $(document).on('click', '.qr-refresh', function (e) { // 刷新微信登录二维码   包括游客登录页面

        getLoginQrcode('', '', true);
    });


    $(document).on('click', '.login-content .getVerificationCode', function (e) { // 获取验证码   在 getVerificationCode元素上 添加标识   0 获取验证码    1 倒计时   2 重新获取验证码
        var authenticationCodeType = $(this).attr('data-authenticationCodeType');
        var telphone = $('.login-content .verificationCode-login .input-mobile .telphone').val();
        var nationCode = $('.login-content .verificationCode-login .phone-num').text().replace(/\+/, '').trim();
        if (nationCode == '86') {
            if (!method.testPhone(telphone)) {

                showErrorTip('verificationCode-login', true, '手机号错误');
                return;
            } else {

                showErrorTip('verificationCode-login', false, '');
            }
            if (authenticationCodeType == 0 || authenticationCodeType == 2) { // 获取验证码
                businessCode = 4;

                sendSms();
                iask_web.track_event('NE002', 'normalClick', 'click', {
                    domID:'getValidateCode',
                    domName:'登录页获取验证码'
                });

            }
        } else {
            if (authenticationCodeType == 0 || authenticationCodeType == 2) { // 获取验证码
                businessCode = 4;

                sendSms();
                iask_web.track_event('NE002', 'normalClick', 'click', {
                    domID:'getValidateCode',
                    domName:'登录页获取验证码'
                });

            }
        }

    });
    $(document).on('input', '.login-content .verificationCode-login .telphone', function (e) {
        mobile = $(this).val();
        var verificationCode = $('.login-content .verificationCode-login .verification-code').val();
        var nationCode = $('.login-content .verificationCode-login .phone-num').text().replace(/\+/, '').trim();
        if (mobile.length > 11) {
            $('.login-content .telphone').val(mobile.slice(0, 11));
        }
        if (nationCode == '86') { // 国内号码
            if (method.testPhone(mobile.slice(0, 11))) {

                showErrorTip('verificationCode-login', false, '');
                $('.login-content .getVerificationCode').addClass('getVerificationCode-active');
                if (verificationCode && verificationCode.length >= 4) {
                    $('.login-content .verificationCode-login .login-btn').removeClass('login-btn-disable');
                    $('.login-content .verificationCode-login .login-btn').addClass('login-btn-active');
                }
            } else {
                if (mobile && mobile.length >= 11) {

                    showErrorTip('verificationCode-login', true, '手机号错误');
                    return;
                }
                $('.login-content .getVerificationCode').removeClass('getVerificationCode-active');
                $('.login-content .verificationCode-login .login-btn').removeClass('login-btn-active');
                $('.login-content .verificationCode-login .login-btn').addClass('login-btn-disable');


            }
        } else {
            if (mobile) {
                $('.login-content .getVerificationCode').addClass('getVerificationCode-active');
                if (verificationCode && verificationCode.length >= 4) {
                    $('.login-content .verificationCode-login .login-btn').removeClass('login-btn-disable');
                    $('.login-content .verificationCode-login .login-btn').addClass('login-btn-active');
                }
            } else {
                $('.login-contentx .getVerificationCode').removeClass('getVerificationCode-active');
                $('.login-content .verificationCode-login .login-btn').removeClass('login-btn-active');
                $('.login-content .verificationCode-login .login-btn').addClass('login-btn-disable');
            }
        }

    });
    $(document).on('input', '.login-content .verification-code', function (e) { //
        var nationCode = $('.login-content .verificationCode-login .phone-num').text().replace(/\+/, '').trim();
        var mobile = $('.login-content .verificationCode-login .telphone').val();
        var verificationCode = $(this).val();
        if (verificationCode.length > 4) {
            $('.login-content .verification-code').val(verificationCode.slice(0, 4));
        }
        if (verificationCode && verificationCode.length >= 4) {

            showErrorTip('verificationCode-login', false, '');
        }
        if (nationCode == '86') {
            if (verificationCode && verificationCode.length >= 4 && method.testPhone(mobile)) {
                $('.login-content .verificationCode-login .login-btn').removeClass('login-btn-disable');
                $('.login-content .verificationCode-login .login-btn').addClass('login-btn-active');
            } else {
                $('.login-content .verificationCode-login .login-btn').removeClass('login-btn-active');
                $('.login-content .verificationCode-login .login-btn').addClass('login-btn-disable');
            }
        } else {
            if (verificationCode && verificationCode.length >= 4 && mobile) {
                $('.login-content .verificationCode-login .login-btn').removeClass('login-btn-disable');
                $('.login-content .verificationCode-login .login-btn').addClass('login-btn-active');
            } else {
                $('.login-content .verificationCode-login .login-btn').removeClass('login-btn-active');
                $('.login-content .verificationCode-login .login-btn').addClass('login-btn-disable');
            }
        }

    });
    $(document).on('input', '.login-content .password-login .telphone', function () { //
        var nationCode = $('.login-content .password-login .phone-num').text().replace(/\+/, '').trim();
        mobile = $(this).val();
        if (mobile.length > 11) {
            $('.login-content.password-login .telphone').val(mobile.slice(0, 11));
        }
        if (nationCode == '86') {
            if (method.testPhone(mobile.slice(0, 11))) {

                showErrorTip('password-login', false, '');
                // 此时密码格式正确
                var loginPassword = $('.login-content .password-login .password .login-password:visible').val();
                if (loginPassword && loginPassword.length >= 6 && loginPassword && loginPassword.length <= 8) {
                    $('.login-content .password-login .login-btn').removeClass('login-btn-disable');
                    $('.login-content .password-login .login-btn').addClass('login-btn-active');
                }
            } else {
                if (mobile && mobile.length >= 11) {

                    showErrorTip('password-login', true, '手机号错误');
                    return;
                }
                $('.login-content .password-login .login-btn').removeClass('login-btn-active');
                $('.login-content .password-login .login-btn').addClass('login-btn-disable');
            }
        } else {
            if (mobile) {
                showErrorTip('password-login', false, '');
                if (loginPassword && loginPassword.length >= 6 && loginPassword && loginPassword.length <= 8) {
                    $('.login-content .password-login .login-btn').removeClass('login-btn-disable');
                    $('.login-content .password-login .login-btn').addClass('login-btn-active');
                }
            } else {

                $('.login-content .password-login .login-btn').removeClass('login-btn-active');
                $('.login-content .password-login .login-btn').addClass('login-btn-disable');
            }
        }
    });
    $(document).on('input', '.login-content .password-login .login-password', function () {
        var nationCode = $('.login-content .password-login .phone-num').text().replace(/\+/, '').trim();
        var password = $(this).val();
        var telphone = $('.login-content .password-login .telphone').val();
        if (password && password.length > 0) {
            $('.login-content .password-login .password .eye').show();
        } else {
            $('.login-content .password-login .password .close-eye').hide();
        }
        if (password.length > 16) {
            $('.login-content  .password-login .login-password').val(password.slice(0, 16));
        }

        if (nationCode == '86') {
            if (method.testPhone(telphone) && password) {
                $('.login-content .password-login .login-btn').removeClass('login-btn-disable');
                $('.login-content .password-login .login-btn').addClass('login-btn-active');
            } else {
                $('.login-content .password-login .login-btn').removeClass('login-btn-active');
                $('.login-content .password-login .login-btn').addClass('login-btn-disable');
            }
        } else {
            if (telphone && password) {
                $('.login-content .password-login .login-btn').removeClass('login-btn-disable');
                $('.login-content .password-login .login-btn').addClass('login-btn-active');
            } else {
                $('.login-content .password-login .login-btn').removeClass('login-btn-active');
                $('.login-content .password-login .login-btn').addClass('login-btn-disable');
            }
        }

    });

    $(document).on('click', '.login-content .password-login .close-eye', function () {
        var textInput = $('.login-content .password-login .text-input');
        textInput.hide();
        $('.login-content .password-login .password-input').val(textInput.val());
        $('.login-content .password-login .password-input').show();
        $('.login-content .password-login .password .close-eye').hide();
        $('.login-content .password-login .password .eye').show();
    });
    $(document).on('click', '.login-content .password-login .eye', function () {
        var passwordInput = $('.login-content .password-login .password-input');
        passwordInput.hide();
        $('.login-content .password-login .text-input').val(passwordInput.val());
        $('.login-content .password-login .text-input').show();
        $('.login-content .password-login .password .eye').hide();
        $('.login-content .password-login .password .close-eye').show();

    });


    $(document).on('click', '.login-dialog .close-btn', function (e) {
        closeRewardPop();
    });


    // 选择区号的逻辑
    $(document).on('click', '.login-content .phone-choice', function (e) {
        $(this).addClass('phone-choice-show');
        $('.login-content .phone-more').show();

        return false;

    });
    $(document).on('click', '.login-content .phone-more .phone-ele', function (e) {
        var areaNum = $(this).find('.number-con em').text();

        $('.login-content .phone-choice .phone-num .add').text('+' + areaNum);
        $('.login-content.phone-choice').removeClass('phone-choice-show');
        $('.login-content.phone-more').hide();
        $('.login-content input').val('');
        $('.login-content .getVerificationCode').removeClass('getVerificationCode-active');
        $('.login-content .login-btn').removeClass('login-btn-active');
        $('.login-content .login-btn').addClass('login-btn-disable');
        showErrorTip('verificationCode-login', false, '');
        showErrorTip('password-login', false, '');
        return false;
    });
    $(document).on('click', '.login-content', function (e) {
        $('.login-content .phone-choice').removeClass('phone-choice-show');
        $('.login-content .phone-more').hide();
    });
    $(document).on('click', '.login-content', function (e) {
        $('.login-content .phone-choice').removeClass('phone-choice-show');
        $('.login-content .phone-more').hide();
    });


    function loginInSuccess(userData){
        var loginType = window.loginTypeList.type;
        window.loginType = loginType; // 获取用户信息时埋点需要
        method.setCookieWithExpPath('cuk', userData.access_token, userData.expires_in * 1000, '/');
        method.setCookieWithExpPath('loginType', loginType, userData.expires_in * 1000, '/');
        $.ajaxSetup({
            headers: {
                'Authrization': method.getCookie('cuk')
            }
        });
        successFun && successFun();
        closeRewardPop();
    }
    function closeRewardPop() {
        $('.common-bgMask').hide();
        $('.detail-bg-mask').hide();
        // $('.login-content').hide();
        $('#dialog-box').hide();
        clearInterval(setIntervalTimer);
    }
    function showErrorTip(type, isShow, msg) {
        if (isShow) {
            if (type == 'verificationCode-login') {
                $('.login-content .verificationCode-login .errortip .error-tip').text(msg);
                $('.login-content .verificationCode-login .errortip').show();
            } else if (type == 'password-login') {
                $('.login-content .password-login .errortip .error-tip').text(msg);
                $('.login-content .password-login .errortip').show();
            }
        } else {
            if (type == 'verificationCode-login') {
                $('.login-content .verificationCode-login .errortip .error-tip').text('');
                $('.login-content .verificationCode-login .errortip').hide();
            } else if (type == 'password-login') {
                $('.login-content .password-login .errortip .error-tip').text('');
                $('.login-content .password-login .errortip').hide();
            }
        }

    }


    // 微信登录
    function getLoginQrcode(temp, fid, isqrRefresh, isTouristLogin, callback) { // 生成二维码 或刷新二维码 callback 在游客下载成功页面登录的callback
        $.ajax({
            headers: {
                jsId:jsId
            },
            url: api.user.getLoginQrcode,
            type: 'POST',
            data: JSON.stringify({
                cid: cid || '',
                site: urlConfig.site,
                fid: fid || '',
                sceneId: sceneId,
                domain: encodeURIComponent(document.domain)
            }),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (res) {

                if (res.code == '0') {
                    isShowQrInvalidtip(false);
                    expires_in = res.data && res.data.expires_in;
                    sceneId = res.data && res.data.sceneId;
                    countdown();
                    if (isTouristLogin || isqrRefresh) {
                        $('.tourist-login .qrcode-default').hide();
                        $('.tourist-login #login-qr').attr('src', res.data.url);
                        $('.tourist-login #login-qr').show();
                    } else {
                        $('.login-content .qrcode-default').hide();
                        $('.login-content #login-qr').attr('src', res.data.url);
                        $('.login-content #login-qr').show();

                    }
                    setIntervalTimer = setInterval(function () {
                        loginByWeChat(cid);
                    }, 4000);
                } else {
                    clearInterval(setIntervalTimer);
                    $.toast({
                        text:res.message,
                        delay : 3000
                    });
                }
            },
            error: function (error) {

                $.toast({
                    text:error.message,
                    delay : 3000
                });
            }
        });
    }
    function isShowQrInvalidtip(flag) { // 普通微信登录  游客微信登录

        if (flag) {

            $('.login-qrContent .login-qr-invalidtip').show();
            $('.login-qrContent .qr-invalidtip').show();
            $('.login-qrContent .qr-refresh').show();
        } else {
            $('.login-qrContent .login-qr-invalidtip').hide();
            $('.login-qrContent .qr-invalidtip').hide();
            $('.login-qrContent .qr-refresh').hide();

        }
    }
    function countdown() { // 二维码失效倒计时
        if (expires_in <= 0) {
            clearTimeout(timer);
            clearInterval(setIntervalTimer);
            $('.login-content .qrcode-default').hide();
            isShowQrInvalidtip(true);

        } else {
            expires_in--;
            timer = setTimeout(countdown, 1000);
        }
    }
    function loginByWeChat(cid, fid) { // 微信扫码登录  返回 access_token 通过 access_token(cuk)
        $.ajax({
            headers: {
                jsId:jsId
            },
            url: api.user.loginByWeChat,
            type: 'POST',
            data: JSON.stringify({
                sceneId: sceneId, // 公众号登录二维码id
                terminal:urlConfig.terminal,
                site:urlConfig.site,
                cid: cid,
                fid: fid || '1816',
                domain: encodeURIComponent(document.domain)
            }),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (res) {

                if (res.code == '0') {
                    clearInterval(setIntervalTimer);
                    loginInSuccess(res.data);
                } else {
                    if (res.code != '411046') { //  411046 用户未登录
                        clearInterval(setIntervalTimer);

                        $.toast({
                            text:res.message,
                            delay : 3000
                        });
                    }
                }
            },
            error: function (error) {
                $.toast({
                    text:error.message,
                    delay : 3000
                });
            }
        });
    }


    // QQ 微博 登录


    function handleThirdCodelogin(loginType) {

        var clientCode = loginType;
        var channel = 1; // 使用渠道：1:登录；2:绑定

        //  var locationUrl = window.location.origin ? window.location.origin : window.location.protocol + '//' + window.location.hostname
        //  var locationUrl = originUrl
        var locationUrl = window.location.origin?window.location.origin:window.location.protocol + '//' + window.location.hostname;
        // var location = locationUrl + '/node/redirectionURL.html' + '?clientCode=' + clientCode
        // var location = locationUrl + '/login-middle.html' + '?clientCode=' + clientCode +  '&redirectUrl=' + encodeURIComponent(redirectUrl)
        var redirectUrl = window.location.href;
        var location = locationUrl + '/login-middle.html' + '?clientCode=' + clientCode + '&redirectUrl=' + encodeURIComponent(redirectUrl);
        // var url = locationUrl + api.user.thirdCodelogin + '?clientCode=' + clientCode + '&channel=' + channel + '&terminal=pc' + '&businessSys=ishare' + '&location=' + encodeURIComponent(location)
        var url = locationUrl + api.user.thirdCodelogin + '?clientCode=' + clientCode + '&channel=' + channel + '&terminal=pc' + '&businessSys=ishare' + '&location=' + encodeURIComponent(location);
        openWindow(url);
    }
    function openWindow(url) { // 第三方打开新的标签页
        var iWidth = 585;
        var iHeight = 525;
        var iTop = (window.screen.availHeight - 30 - iHeight) / 2;
        var iLeft = (window.screen.availWidth - 10 - iWidth) / 2;
        var param = 'height=' + iHeight + ',width=' + iWidth + ',top=' + iTop + ',left=' + iLeft + ',toolbar=no, menubar=no, scrollbars=no, status=no, location=yes, resizable=yes';
        myWindow = window.open(url, '_parent', param);
    }

    function thirdLoginRedirect(code, channel, clientCode) { // 根据授权code 获取 access_token
        $.ajax({
            headers: {
                jsId:jsId
            },
            url: api.user.thirdLoginRedirect,
            type: 'POST',
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify({
                thirdType: clientCode,
                code: code,
                businessSys: 'ishare',
                terminal:urlConfig.terminal,
                site:urlConfig.site,
            }),
            dataType: 'json',
            success: function (res) {
                if (res.code == '0') {
                    myWindow.close();
                    loginInSuccess(res.data);
                } else {
                    $.toast({
                        text:res.message,
                        delay : 3000
                    });
                    myWindow.close();
                }
            },
            error: function (error) {
                myWindow.close();

                $.toast({
                    text:error.message,
                    delay : 3000
                });
            }
        });
    }

    window.clientDefineBindThirdUser = thirdLoginRedirect;

    function sendSms(appId, randstr, ticket, onOff) { // 发送短信验证码
        $.ajax({
            url: api.user.sendSms,
            headers: {
                jsId:jsId
            },
            type: 'POST',
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify({
                mobile: mobile,
                nationCode: $('.login-content .verificationCode-login .phone-num').text().replace(/\+/, '').trim(),
                businessCode: businessCode, // 功能模块（1-注册模块、2-找回密码、3-修改密码、4-登录、5-绑定/更换手机号手机号（会检查手机号是否被使用过）、6-旧手机号获取验证码）
                terminal: 'pc',
                'appId': appId,
                'randstr': randstr,
                'ticket': ticket,
                'onOff': onOff
            }),
            dataType: 'json',
            success: function (res) {
                if (res.code == '0') {

                    smsId = res.data.smsId;
                    var authenticationCode = $('.login-content .getVerificationCode');
                    authenticationCode.attr('data-authenticationCodeType', 1); // 获取验证码
                    var timer = null;
                    var textNumber = 60;
                    (function countdown() {
                        if (textNumber <= 0) {
                            clearTimeout(timer);
                            authenticationCode.text('重新获取验证码');
                            authenticationCode.css({
                                'fontSize': '13px',
                                'color': '#fff',
                                'borderColor': '#eee'
                            });
                            authenticationCode.attr('data-authenticationCodeType', 2); // 可以重新获取验证码
                        } else {
                            authenticationCode.text(textNumber--);
                            authenticationCode.css({
                                'color': '#999999',
                                'backgroundColor': '#E9E8E5',
                                'borderColor': '#eee'
                            });
                            timer = setTimeout(countdown, 1000);
                        }
                    })();
                } else if (res.code == '411015') { // 单日ip获取验证码超过三次
                    showCaptcha(sendSms);
                } else if (res.code == '411033') { // 图形验证码错误
                    $.toast({
                        text:'图形验证码错误',
                        delay : 3000
                    });
                } else {
                    $.toast({
                        text:res.message,
                        delay : 3000
                    });
                }
            },

            error: function (error) {
                $.toast({
                    text:error.message,
                    delay : 3000
                });
            }
        });
    }

    function loginByPsodOrVerCode(loginType, mobile, nationCode, smsId, checkCode, password) { // 通过密码或验证码登录
        $.ajax({
            url: api.user.loginByPsodOrVerCode,
            type: 'POST',
            headers: {
                jsId:jsId
            },
            data: JSON.stringify({
                loginType: loginType,
                mobile: mobile,
                nationCode: nationCode,
                smsId: smsId,
                checkCode: checkCode,
                password: $.md5(password),
                terminal:urlConfig.terminal,
                site:urlConfig.site,
            }),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (res) {

                if (res.code == '0') {
                    loginInSuccess(res.data);
                } else {

                    if (checkCode) {
                        showErrorTip('verificationCode-login', true, res.message);
                    } else {
                        showErrorTip('password-login', true, res.message);
                    }

                }
            },
            error: function (error) {
                $.toast({
                    text:error.message,
                    delay : 3000
                });
            }
        });
    }

    function isHasPcMLogin(){
        $.ajax({
            url: api.user.dictionaryData.replace('$code', 'sceneSwitch'),
            type: 'GET',
            async: false,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            cache: false,
            success: function (res) { // loginRedPacket-dialog
                console.log(res);
                var pccodeList = [];
                if (res.code == 0 && res.data && res.data.length) {
                    $.each(res.data, function(index, item){
                        pccodeList.push(item.pcode);
                    });
                }
                if(pccodeList.indexOf('PC-M-Login')!=-1){
                    $('.login-redpacket').show();
                    $('.login-type-list').css('margin-top', '21px');
                }else{
                    $('.login-redpacket').hide();
                    $('.login-type-list').removeAttr('style');
                }
            }
        });
    }
    function loginInit(params, callback) {
        successFun = callback; // 保存传入的回调
        jsId = params.jsId;
        cid = params.cid || params.clsId;
        originUrl = params.originUrl;
        redirectUrl = params.redirectUrl;
        bilogUrl = params.bilogUrl;
        visitor_id = params.visitor_id;
        bilog = {
            sessionID:params.sessionID,
            deviceID:params.deviceID,
            persistedTime:params.persistedTime,
            sessionReferrer:params.sessionReferrer,
            sessionStartTime:params.sessionStartTime,
            updatedTime:params.updatedTime,
            visitID:params.visitID
        };
        getLoginQrcode(params.cid, params.fid);
        isHasPcMLogin();
    }
    return {
        loginInit: loginInit
    };
});


