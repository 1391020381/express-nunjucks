define(function (require, exports, module) {
    // 业务模板和js
    var iaskCoinLayerHtml = require('./iaskCoin.html');
    var iaskCoinLayerJs = require('./iaskCoin');

    /**
     * 打开反馈弹窗
     */
    function open() {
        layer.open({
            // 确保只打开一个弹窗
            id: 'iaskCoinLayer',
            skin: 'g-noBg-layer',
            type: 1,
            title: false,
            closeBtn: 0,
            area: ['668px', '547px'],
            shade: 0.8,
            shadeClose: true,
            content: iaskCoinLayerHtml,
            success: function (layero, index) {
                iaskCoinLayerJs.init(index);
            },
            end: function () {
                iaskCoinLayerJs.destroy();
            }
        });
    }

    return {
        open: open
    };
});
