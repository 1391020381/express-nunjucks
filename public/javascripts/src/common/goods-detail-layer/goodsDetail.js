define(function (require, exports, module) {

    return {
        // 弹窗id
        layerIndex: null,
        // 商品信息
        goodsData: null,

        /**
         * public 外部可调
         * 初始化
         * @param layerIndex    弹窗id
         * @param goodsData     商品信息
         */
        init: function (layerIndex, goodsData) {
            var that = this;
            that.layerIndex = layerIndex;
            that.goodsData = goodsData;

            // 等待dom加载完毕
            $('.jsGoodsDetailLayer').ready(function () {
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
            this.goodsData = null;
            // 解绑事件
            this.unBindEvent();
        },
        // 绑定事件
        bindEvent: function () {
            var that = this;

            // 关闭弹窗
            $('.jsGoodsDetailCloseBtn').on('click', function (e) {
                e.stopPropagation();
                that.closeLayer();
            });

            // 立即兑换
            $('.jsGoodsDetailLayerExchange').on('click', function (e) {
                e.stopPropagation();

            });
        },
        // 解绑事件
        unBindEvent: function () {
            $('.jsGoodsDetailCloseBtn').off('click');
        },
        // 关闭弹窗
        closeLayer: function () {
            var layerIndex = this.layerIndex;
            if (layerIndex) {
                layer.close(layerIndex);
            }
        },
        // 提示
        layerMsg: function (message) {
            layer.msg(message, {offset: ['200px']});
        }

    };
});
