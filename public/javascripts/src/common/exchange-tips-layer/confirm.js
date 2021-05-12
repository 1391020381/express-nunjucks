define(function (require, exports, module) {

    return {
        // 弹窗id
        layerIndex: null,
        // 确认回调
        confirmCb: null,

        /**
         * public 外部可调
         * 初始化
         * @param layerIndex 弹窗id
         * @param confirmCb 确认回调
         */
        init: function (layerIndex, confirmCb) {
            var that = this;
            that.layerIndex = layerIndex;
            that.confirmCb = confirmCb;

            // 等待dom加载完毕
            $('.jsExchangeTipsConfirmLayer').ready(function () {
                that.bindEvent();
            });
        },
        /**
         * public 外部可调
         * 弹窗相关数据重置，事件解绑
         */
        destroy: function () {
            // 重置数据
            this.layerIndex = null;
            // 解绑事件
            this.unBindEvent();
        },
        // 绑定事件
        bindEvent: function () {
            var that = this;

            // 关闭弹窗
            $('.jsExchangeTipsConfirmClose').on('click', function (e) {
                e.stopPropagation();
                that.closeLayer();
            });

            // 确认兑换
            $('.jsExchangeTipsConfirm').on('click', function (e) {
                e.stopPropagation();
                if (typeof that.confirmCb === 'function') {
                    that.confirmCb();
                }
                that.closeLayer();
            });
        },
        // 解绑事件
        unBindEvent: function () {
            $('.jsExchangeTipsConfirmClose').off('click');
            $('.jsExchangeTipsConfirm').off('click');
        },
        // 关闭弹窗
        closeLayer: function () {
            var layerIndex = this.layerIndex;
            if (layerIndex) {
                layer.close(layerIndex);
            }
        }
    };
});
