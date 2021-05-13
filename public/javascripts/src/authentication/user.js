define(function (require, exports, module) {
    require('../cmd-lib/upload/Q');
    require('../cmd-lib/upload/Q.Uploader');
    require('./fixedTopBar');
    require('./msgVer');
    require('../cmd-lib/toast');
    var api = require('../application/api');
    var urlConfig = require('../application/urlConfig');
    var utils = require('../cmd-lib/util');
    var method = require('../application/method');
    var isLogin = require('../application/effect.js').isLogin;
    var isAutoLogin = true;
    var phoneTemplate = require('./template/bindPhone.html');
    var auditTemplate = require('./template/audit.html');
    var successTemplate = require('./template/success.html');
    var errorTemplate = require('./template/error.html');
    var authenticationBox = $('#authentication-box');
    // 认证协议弹窗
    var agreementLayerService = require('../common/agreement-layer/index');
    var userObj = {
        nickName: '',
        validateFrom: /^1[3456789]\d{9}$/,
        emailForm: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
        init: function () {
            this.selectBind();
            this.eventBind();
            this.delUploadImg();
            this.checkedRules();
            if (method.getCookie('cuk')) {
                this.queryCerinfo();
            }
            $('.js-submit').click(function () {
                // userObj.submitData();
                if (method.getCookie('cuk')) {
                    userObj.submitData();
                } else {
                    isLogin(null, isAutoLogin);
                }
            });
            $('body').click(function () {
                $('.jqTransformSelectWrapper ul').slideUp();
            });
            setTimeout(function () {
                userObj.uploadfile();
            }, 800);
        },

        // 弹出认证审核窗口
        dialogAudit: function() {
            var _html = template.compile(auditTemplate)();
            authenticationBox.html(_html).show();
        },

        // 弹出认证成功窗口
        dialogSuccess: function() {
            var _html = template.compile(successTemplate)();
            authenticationBox.html(_html).show();
        },

        // 弹出认证失败窗口
        dialogError: function() {
            var _html = template.compile(errorTemplate)();
            authenticationBox.html(_html).show();
        },

        // 查询认证信息
        // auditStatus  0-待审核、1-审核中、2-审核通过、3-审核不通过
        queryCerinfo: function () {
            $.ajax(api.authentication.getPersonalCertification, { // /gateway/user/certification/getPersonal
                type: 'get'
            }).done(function (data) {
                if (data.data && data.data.auditStatus != 3) {
                    if (data.data.auditStatus == 0 || data.data.auditStatus == 1) {
                        $('.header-title').text('信息审核中，请耐心等候');
                        $('.header-process .process-item').eq(1).addClass('step-now').siblings().removeClass('step-now');
                        userObj.dialogAudit();
                    } else if (data.data.auditStatus == 2) {
                        $('.header-title').text('你已完成个人认证');
                        $('.header-process .process-item').eq(2).addClass('step-now').siblings().removeClass('step-now');
                        userObj.dialogSuccess();
                    }

                    $('.js-nickName').val(data.data.nickName).attr('disabled', 'disabled');
                    $('.js-realName').val(data.data.authName).attr('disabled', 'disabled');
                    var Authtype = [
                        { val: 0, title: '中小学教师' },
                        { val: 1, title: '大学或高职教师' },
                        { val: 2, title: '网络营销' },
                        { val: 3, title: 'IT/互联网' },
                        { val: 4, title: '医学' },
                        { val: 5, title: '建筑工程' },
                        { val: 6, title: '金融/证券' },
                        { val: 7, title: '汽车/机械/制造' },
                        { val: 8, title: '其他' },
                        { val: 9, title: '设计师' }
                    ];
                    $('.js-authType').text(Authtype[data.data.authType].title);
                    $('.js-authTypeList').remove();
                    $('.js-idCardNo').val(data.data.idCardNo).attr('disabled', 'disabled');
                    $('.js-idCardFrontPic img').attr('src', data.data.idCardFrontPic);
                    $('#js-id-front').removeAttr('id');
                    $('.js-idCardBackPic img').attr('src', data.data.idCardBackPic);
                    $('#js-id-back').removeAttr('id');
                    $('.js-handFrontIdCardPic img').attr('src', data.data.handFrontIdCardPic);
                    $('#js-id-hand').removeAttr('id');
                    $('.js-credentialsPic img').attr('src', data.data.credentialsPic);
                    $('#js-cer').removeAttr('id');
                    $('.js-authAppellation').val(data.data.authAppellation).attr('disabled', 'disabled');
                    $('.js-workUnit').val(data.data.workUnit).attr('disabled', 'disabled');
                    $('.js-personProfile').val(data.data.personProfile).attr('disabled', 'disabled');
                    $('.js-personWeibo').val(data.data.personWeibo).attr('disabled', 'disabled');
                    $('.js-phone').val(data.data.phoneNumber).attr('disabled', 'disabled');
                    $('.js-qqNumber').val(data.data.qqNumber).attr('disabled', 'disabled');
                    $('.js-email').val(data.data.email).attr('disabled', 'disabled');
                    $('.js-msg').attr('disabled', 'disabled');
                    $('.js-edit').hide();
                } else if (data.data && data.data.auditStatus == 3) {
                    userObj.dialogError();
                }

            }).fail(function (e) {
                console.log('error===' + e);
            });
        },

        // 事件绑定
        eventBind: function() {
            $('#authentication-box').on('click', '.modal-close', function() {
                console.log('关闭弹窗');
                $(authenticationBox).html('').hide();
            });
        },

        // 认证类型选
        selectBind: function () {
            $('.js-select').click(function (e) {
                $(this).siblings('ul').slideToggle();
                e.stopPropagation();
            });
            $('.jqTransformSelectWrapper ul').on('click', 'li a', function () {
                $('.jqTransformSelectWrapper ul').find('li a').removeClass('selected');
                $(this).addClass('selected');
                $('.jqTransformSelectWrapper ul').slideUp();
                $('.js-select span').text($(this).text());
                $('.js-select span').attr('authType', $(this).attr('index'));
            });
        },

        // 图片上传
        uploadfile: function () {
            var currentTarget = '';
            $('.btn-rz-upload').on('click', function () {
                currentTarget = $(this);
            });
            var E = Q.event,
                Uploader = Q.Uploader;
            var uploader = new Uploader({
                url: urlConfig.upload + api.upload.picUploadCatalog,
                target: [$('#js-id-front')[0], $('#js-id-back')[0], $('#js-id-hand')[0], $('#js-cer')[0]],
                upName: 'file',
                dataType: 'application/json',
                multiple: false,
                data: { fileCatalog: 'ishare' },
                allows: '.jpg,.jpeg,.gif,.png', // 允许上传的文件格式
                maxSize: 3 * 1024 * 1024, // 允许上传的最大文件大小,字节,为0表示不限(仅对支持的浏览器生效)
                // 每次上传都会发送的参数(POST方式)
                on: {
                    // 添加之前触发
                    add: function (task) {
                        // task.limited存在值的任务不会上传，此处无需返回false
                        switch (task.limited) {
                            case 'ext': return $.toast({
                                text: '不支持此格式上传'
                            });
                            case 'size': return $.toast({
                                text: '资料不能超过3M'
                            });
                        }
                        // console.log(task)
                        // 自定义判断，返回false时该文件不会添加到上传队列
                    },
                    // 上传完成后触发
                    complete: function (task) {
                        if (task.limited) {
                            return false;
                        }
                        var res = JSON.parse(task.response);
                        if (res.data && res.data.picKey) {
                            currentTarget.attr('val', res.data.picKey);
                            currentTarget.siblings('.rz-upload-pic').find('img').attr('src', res.data.preUrl + res.data.picKey);
                            currentTarget.siblings('.rz-upload-pic').find('.delete-ele').show();
                        } else {
                            $.toast({
                                text: '上传失败，重新上传',
                                icon: '',
                                delay: 2000,
                                callback: false
                            });
                        }
                    }
                }
            });

        },

        // 删除已上传的图片
        delUploadImg: function () {
            $('.delete-ele').click(function () {
                $(this).hide();
                if ($(this).parents('.rz-main-dd').find('.btn-rz-upload').attr('id') == 'upload-target2') {
                    $(this).siblings('img').attr('src', '../../../images/auth/pic_zj.jpg');
                } else {
                    $(this).siblings('img').attr('src', '../../../images/auth/pic_sfz_z.jpg');
                }
                $(this).parents('.rz-main-dd').find('.btn-rz-upload').attr('val', '');
            });
        },

        // 勾选和取消协议
        checkedRules: function () {
            $('.rz-label .check-con').click(function () {
                $('.rz-label .check-con').toggleClass('checked');
            });
        },

        // 提交数据
        submitData: function () {
            // nickName	是	String	昵称
            // realName	是	String	真实姓名
            // authType	是	Integer	认证类型；0:中小学教师；1:大学或高职教师；2:网络营销；3:IT/互联网；4:医学；5: 建筑工程；6: 金融/证券；7: 汽车/机械/制造；8: 其他；9: 设计师
            // idCardNo	是	String	身份证号码
            // idCardFrontPic	是	String	身份证正面照片
            // idCardBackPic	是	String	身份证背面照片
            // handFrontIdCardPic	是	String	手持身份证照
            // credentialsPic	是	String	证件材料照片
            // authAppellation	是	String	认证称谓
            // workUnit	否	String	工作单位
            // personProfile	否	String	个人简介
            // personWeibo	否	String	个人微博
            // phoneNumber	是	String	手机号码
            // qqNumber	是	String	qq号码
            // email    是  String  email号码
            // smsId	是	String	验证码id
            // checkCode	是	String	验证码
            var params = {
                nickName: $('.js-nickName').val().trim(),
                authName: $('.js-realName').val().trim(),
                authType: Number($('.js-authType').attr('authtype')),
                idCardNo: $('.js-idCardNo').val().trim(),
                idCardFrontPic: $('#js-id-front').attr('val'),
                idCardBackPic: $('#js-id-back').attr('val'),
                handFrontIdCardPic: $('#js-id-hand').attr('val'),
                credentialsPic: $('#js-cer').attr('val'),
                authAppellation: $('.js-authAppellation').val().trim(),
                workUnit: $('.js-workUnit').val().trim(),
                personProfile: $('.js-personProfile').val().trim(),
                personWeibo: $('.js-personWeibo').val().trim(),
                phoneNumber: $('.js-phone').text(),
                qqNumber: $('.js-qqNumber').val().trim(),
                email: $('.js-email').val().trim(),
                smsId: $('.js-msg').attr('smsId'),
                checkCode: $('.js-msg-val').val().trim(),
                agreementTime:new Date(new Date().getTime()).formatDate('yyyy-MM-dd hh:mm:ss')
            };
            if (!params.nickName) {
                $.toast({
                    text: '请输入账号昵称',
                    icon: '',
                    delay: 2000,
                    callback: false
                });
                return false;
            }
            if (!params.authName) {
                $.toast({
                    text: '请输入真实姓名',
                    icon: '',
                    delay: 2000,
                    callback: false
                });
                return false;
            }
            if (!params.idCardNo) {
                $.toast({
                    text: '请输入身份证号码',
                    icon: '',
                    delay: 2000,
                    callback: false
                });
                return false;
            }
            if (!params.idCardFrontPic) {
                $.toast({
                    text: '请上传身份证正面照片',
                    icon: '',
                    delay: 2000,
                    callback: false
                });
                return false;
            }
            if (!params.idCardBackPic) {
                $.toast({
                    text: '请上传身份证背面照片',
                    icon: '',
                    delay: 2000,
                    callback: false
                });
                return false;
            }
            if (!params.handFrontIdCardPic) {
                $.toast({
                    text: '请上传手持身份证照',
                    icon: '',
                    delay: 2000,
                    callback: false
                });
                return false;
            }
            if (!params.credentialsPic) {
                $.toast({
                    text: '请上传证件材料',
                    icon: '',
                    delay: 2000,
                    callback: false
                });
                return false;
            }
            if (!params.authAppellation) {
                $.toast({
                    text: '请输入认证称谓',
                    icon: '',
                    delay: 2000,
                    callback: false
                });
                return false;
            }
            if (!params.qqNumber) {
                $.toast({
                    text: '请输入QQ号',
                    icon: '',
                    delay: 2000,
                    callback: false
                });
                return false;
            }
            if (!userObj.emailForm.test(params.email)) {
                $.toast({
                    text: '请输入正确的邮箱地址',
                    icon: '',
                    delay: 2000,
                    callback: false
                });
                return false;
            }
            if (!params.checkCode) {
                $.toast({
                    text: '请输入手机验证码',
                    icon: '',
                    delay: 2000,
                    callback: false
                });
                return false;
            }
            // if (!$('.rz-label .check-con').hasClass('checked')) {
            //     $.toast({
            //         text: '请勾选用户认证协议',
            //         icon: '',
            //         delay: 2000,
            //         callback: false
            //     });
            //     return false;
            // }
            agreementLayerService.open(function () {
                params = JSON.stringify(params);
                $.ajax(api.authentication.personalCertification, { // /gateway/user/certification/personal
                    type: 'POST',
                    data: params,
                    contentType: 'application/json'
                }).done(function (data) {
                    if (data.code == '0') {
                        $.toast({
                            text: '提交成功',
                            icon: '',
                            delay: 3000,
                            callback: function () {
                                location.reload();
                            }
                        });
                    } else {
                        $.toast({
                            text: data.message,
                            icon: '',
                            delay: 2000,
                            callback: false
                        });
                    }

                }).fail(function (e) {
                    console.log('error===' + e);
                });
            });
        }
    };

    isLogin(function (data) {
        if (data.mobile) {
            $('.js-phone').text(data.mobile);
            userObj.init();
        } else {
            var _html = template.compile(phoneTemplate)();
            authenticationBox.html(_html).show();
        }
    }, isAutoLogin, function () {
        location.reload();
    });

});
