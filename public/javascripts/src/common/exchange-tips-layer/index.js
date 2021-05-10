define(function (require, exports, module) {
    // 业务模板和js =====
    // 确认兑换弹窗
    var exchangeConfirmLayerHtml = require('./confirm.html');
    var exchangeConfirmLayerJs = require('./confirm');
    // 兑换成功弹窗
    var exchangeSuccessLayerHtml = require('./success.html');
    var exchangeSuccessLayerJs = require('./success');

    /**
     * 确认兑换弹窗
     * @param coinNum 爱问币数量
     * @param confirmCb 确认回调
     */
    function confirm(coinNum, confirmCb) {
        var confirmHtml = template.compile(exchangeConfirmLayerHtml)({
            coinNum: coinNum || 0
        });
        layer.open({
            // 确保只打开一个弹窗
            id: 'exchangeTipsConfirmLayer',
            skin: 'g-noBg-layer',
            type: 1,
            title: false,
            closeBtn: 0,
            area: ['477px', '266px'],
            shade: 0.8,
            shadeClose: false,
            content: confirmHtml,
            success: function (layero, index) {
                exchangeConfirmLayerJs.init(index, confirmCb);
            },
            end: function () {
                exchangeConfirmLayerJs.destroy();
            }
        });
    }

    /**
     * 兑换成功提示弹窗
     * @param data {{msg,url}} 提示文本，跳转链接
     */
    function success(data) {
        var successHtml = template.compile(exchangeSuccessLayerHtml)({
            msg: data ? data.msg : '',
            url: data ? data.url : ''
        });
        layer.open({
            // 确保只打开一个弹窗
            id: 'exchangeTipsSuccessLayer',
            skin: 'g-noBg-layer',
            type: 1,
            title: false,
            closeBtn: 0,
            area: ['477px', '266px'],
            shade: 0.8,
            shadeClose: false,
            content: successHtml,
            success: function (layero, index) {
                exchangeSuccessLayerJs.init(index);
            },
            end: function () {
                exchangeSuccessLayerJs.destroy();
            }
        });
    }

    // 提示
    function layerMsg(message) {
        layer.msg(message, {offset: ['200px']});
    }

    return {
        confirm: confirm,
        success: success
    };
});
