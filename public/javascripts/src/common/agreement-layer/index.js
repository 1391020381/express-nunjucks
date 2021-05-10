define(function (require, exports, module) {
    // 业务模板和js
    var agreementLayerHtml = require('./agreement.html');
    var agreementLayerJs = require('./agreenment');
    /**
     * 认证协议弹窗
     * @param confirmCb 确认回调
     * @param isPersonalCenterOrFileUpload 区分是否是个人中心与上传资料
     */
    function open(confirmCb,isPersonalCenterOrFileUpload) {
        layer.open({
            // 确保只打开一个弹窗
            id: 'agreementLayer',
            skin: 'g-noBg-layer',
            type: 1,
            title: false,
            closeBtn: 0,
            area: ['668px', '580px'],
            shade: 0.8,
            shadeClose: false,
            content:template.compile(agreementLayerHtml)({
                isPersonalCenterOrFileUpload:isPersonalCenterOrFileUpload
            }),
            success: function (layero, index) {
                agreementLayerJs.init(index, confirmCb);
            },
            end: function () {
                agreementLayerJs.destroy();
            }
        });
    }

    return {
        open: open
    }
})
