define(function (require, exports, module) {

    return {
        // 弹窗id
        layerIndex: null,

        /**
         * public 外部可调
         * 初始化
         * @param layerIndex 弹窗id
         */
        init: function (layerIndex) {
            var that = this;
            that.layerIndex = layerIndex;

            // 等待dom加载完毕
            $('.jsExchangeTipsSuccessLayer').ready(function () {
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
            $('.jsExchangeTipsSuccessClose').on('click', function (e) {
                e.stopPropagation();
                that.closeLayer();
            });

            // 确认使用
            $('.jsExchangeTipsSuccessUse').on('click', function (e) {
                e.stopPropagation();
                var url = $(this).data('url');
                if (url) {
                    // 跳转
                    window.open(url, '_blank');
                }
                that.closeLayer();
            });
        },
        // 解绑事件
        unBindEvent: function () {
            $('.jsExchangeTipsSuccessClose').off('click');
            $('.jsExchangeTipsSuccessUse').off('click');
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
