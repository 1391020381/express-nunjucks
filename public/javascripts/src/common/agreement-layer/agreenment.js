define(function (require, exports, module) {

    return {
        // 弹窗id
        layerIndex: null,
        // 确认回调
        confirmCb: null,
        // 倒计时
        duration: 10,
        // 定时器id
        timerId: null,

        /**
         * public 外部可调
         * 初始化
         * @param layerIndex 弹窗id
         * @param confirmCb  确认回调
         */
        init: function (layerIndex, confirmCb) {
            var that = this;
            that.layerIndex = layerIndex;
            that.confirmCb = confirmCb;
            that.duration = 10;

            // 等待dom加载完毕
            $('.jsAgreementLayer').ready(function () {
                that.bindEvent();

                var $jsAgreementConfirm = $('.jsAgreementConfirm');
                var $countdown = $jsAgreementConfirm.children('.countdown');
                var $duration = $countdown.children('.duration');
                // 开启定时器
                that.timerId = setInterval(function () {
                    if (that.duration <= 0) {
                        window.clearInterval(that.timerId);
                        that.timerId = null;
                        $jsAgreementConfirm.removeClass('disabled');
                        $countdown.hide();
                    } else {
                        $duration.text(that.duration);
                        that.duration--;
                    }
                }, 1000)
            })
        },
        /**
         * public 外部可调
         * 弹窗相关数据重置，事件解绑
         */
        destroy: function () {
            // 重置数据
            this.layerIndex = null;
            // 清除定时器
            if (this.timerId) {
                window.clearInterval(this.timerId);
                this.timerId = null;
            }
            // 解绑事件
            this.unBindEvent();
        },
        // 绑定事件
        bindEvent: function () {
            var that = this;

            // 关闭弹窗
            $('.jsAgreementCloseBtn').on('click', function (e) {
                e.stopPropagation();
                that.closeLayer();
            })

            // 确认
            $('.jsAgreementConfirm').on('click', function (e) {
                e.stopPropagation();
                // 倒计时结束
                if (that.duration <= 0) {
                    if (typeof that.confirmCb === 'function') {
                        that.confirmCb();
                    }
                    that.closeLayer();
                }
            })
        },
        // 解绑事件
        unBindEvent: function () {
            $('.jsAgreementCloseBtn').off('click');
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
    }
})
