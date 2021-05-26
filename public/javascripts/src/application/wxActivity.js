
// 微信红包
define(function (require, exports, module) {
    var method = require('../application/method');
    var api = require('./api');
    var pageName = window.pageConfig.page && window.pageConfig.page.pageName;
    // 首页 详情 登录领取红包
    $(document).on('click', '.loginRedPacket-dialog .close-btn', function (e) {
        trackEvent('NE002', 'normalClick', 'click', {
            domID: 'close',
            domName: '关闭'
        });
        if (pageName == 'detail') {
            method.setCookieWithExpPath('isShowDetailALoginRedPacket', 1);
        } else {
            method.setCookieWithExpPath('isShowIndexLoginRedPacket', 1);

        }
        $('.loginRedPacket-dialog').hide();
    });

    $(document).on('click', '.loginRedPacket-dialog .loginRedPacket-content', function (e) { // 区分路径 首页  详情A  详情B
        trackEvent('NE002', 'normalClick', 'click', {
            domID: 'confirm',
            domName: '确定'
        });
        if (pageName == 'detail') {
            $('#detail-unLogin').trigger('click');
        } else {
            $('.index-header .notLogin').trigger('click');

        }
        //  $('.loginRedPacket-dialog').hide()
    });

    function isHasPcMLogin() {
        $.ajax({
            url: api.user.dictionaryData.replace('$code', 'sceneSwitch'),
            type: 'GET',
            async: false,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            cache: false,
            success: function (res) { // loginRedPacket-dialog
                console.log(res);
                if (res.code == 0 && res.data && res.data.length) {
                    $.each(res.data, function (inidex, item) {
                        if (item.pcode == 'PC-M-Login') {
                            if (pageName == 'detail' && !method.getCookie('isShowDetailALoginRedPacket')) {
                                $('.loginRedPacket-dialog').removeClass('hide');
                                trackEvent('NE006', 'modelView', 'view', {
                                    moduleID: 'activityFloat',
                                    moduleName: '活动浮层'
                                });
                            } else if (pageName == 'index' && !method.getCookie('isShowIndexLoginRedPacket')) {
                                $('.loginRedPacket-dialog').removeClass('hide');
                                trackEvent('NE006', 'modelView', 'view', {
                                    moduleID: 'activityFloat',
                                    moduleName: '活动浮层'
                                });
                            }

                        }
                    });

                }
            }
        });
    }

    return {
        isHasPcMLogin: isHasPcMLogin
    };
});
