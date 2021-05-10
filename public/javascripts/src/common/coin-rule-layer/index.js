define(function (require, exports, module) {
    // 业务模板和js
    var coinRuleLayerHtml = require('./coinRule.html');
    var coinRuleLayerJs = require('./coinRule');

    /**
     * 爱问币规则弹窗
     */
    function open() {
        layer.open({
            // 确保只打开一个弹窗
            id: 'coinRuleLayer',
            skin: 'g-noBg-layer',
            type: 1,
            title: false,
            closeBtn: 0,
            area: ['668px', '547px'],
            shade: 0.8,
            shadeClose: false,
            content: coinRuleLayerHtml,
            success: function (layero, index) {
                coinRuleLayerJs.init(index);
            },
            end: function () {
                coinRuleLayerJs.destroy();
            }
        });
    }

    return {
        open: open
    };
});
