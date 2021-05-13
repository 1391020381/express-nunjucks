define(function (require, exports, module) {
    // 业务模板和js
    var agreementLayerHtml = require('./agreement.html');
    var agreementLayerJs = require('./agreenment');

    /**
     * 认证协议弹窗
     * @param confirmCb 确认回调
     * @param noShowClose 是否展示关闭按钮,默认展示
     */
    function open(confirmCb, noShowClose) {
        var agreementHtml = template.compile(agreementLayerHtml)({
            noShowClose: noShowClose
        });
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
            content: agreementHtml,
            success: function (layero, index) {
                agreementLayerJs.init(index, confirmCb);
                trackEvent('NE006', 'modelView', 'view', {
                    moduleID: 'agreement',
                    moduleName: '协同弹窗曝光'
                });
            },
            end: function () {
                agreementLayerJs.destroy();
            }
        });
    }

    return {
        open: open
    };
});
