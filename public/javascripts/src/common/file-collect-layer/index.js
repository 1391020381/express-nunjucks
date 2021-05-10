define(function (require, exports, module) {
    // 业务模板和js
    var fileCollectLayerHtml = require('./fileCollect.html');
    var fileCollectLayerJs = require('./fileCollect');

    /**
     * 爱问币规则弹窗
     */
    function open() {
        layer.open({
            // 确保只打开一个弹窗
            id: 'fileCollectLayer',
            skin: 'g-noBg-layer',
            type: 1,
            title: false,
            closeBtn: 0,
            area: ['477px', '244px'],
            shade: 0.8,
            shadeClose: false,
            content: fileCollectLayerHtml,
            success: function (layero, index) {
                fileCollectLayerJs.init(index);
            },
            end: function () {
                fileCollectLayerJs.destroy();
            }
        });
    }

    return {
        open: open
    };
});
