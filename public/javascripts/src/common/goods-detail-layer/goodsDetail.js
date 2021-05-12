define(function (require, exports, module) {
    var api = require('../../application/api');
    var method = require('../../application/method');
    // 商品兑换提示弹窗
    var exchangeTipsLayerService = require('../../common/exchange-tips-layer/index');

    return {
        // 弹窗id
        layerIndex: null,
        // 商品信息
        goodsData: null,
        // 用户爱问币数量
        iaskCoinNum: 0,
        // 成功或失败回调
        callback: null,

        /**
         * public 外部可调
         * 初始化
         * @param layerIndex    弹窗id
         * @param goodsData     商品信息
         * @param iaskCoinNum   用户爱问币数量
         * @param callback      兑换成功或失败都触发此回调
         */
        init: function (layerIndex, goodsData, iaskCoinNum, callback) {
            var that = this;
            that.layerIndex = layerIndex;
            that.goodsData = goodsData || {};
            that.iaskCoinNum = iaskCoinNum || 0;
            that.callback = callback;

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
                var coinNum = that.goodsData.price || 0;
                if (that.goodsData.hasExchange) {
                    that.layerMsg('积分商品剩余数量为0');
                } else if (coinNum > that.iaskCoinNum) {
                    that.layerMsg('爱问币余额不足');
                } else {
                    // 获取商品信息
                    var goodsData = that.goodsData || {};
                    // 关闭详情弹窗---清除详情弹窗内数据
                    that.closeLayer();
                    // 弹出确认框
                    exchangeTipsLayerService.confirm(coinNum, function () {
                        // 获取用户信息
                        var userStr = method.getCookie('ui') || '{}';
                        var userInfo = JSON.parse(userStr);
                        // 开启兑换
                        that.exchangeGoodsByCoin(userInfo, goodsData);
                    });
                }
            });
        },
        // 解绑事件
        unBindEvent: function () {
            $('.jsGoodsDetailCloseBtn').off('click');
            $('.jsGoodsDetailLayerExchange').off('click');
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
            $.toast({
                text: message,
                delay: 2000
            });
        },

        /**
         * 兑换积分商品
         * @param   userInfo    用户信息
         * @param   goodsData   商品信息
         */
        exchangeGoodsByCoin: function (userInfo, goodsData) {
            var that = this;
            var host = window._env === 'local' ? 'https://dev-ishare.iask.com.cn/' : window.location.origin;
            var params = {
                // 商品id
                goodsId: goodsData.id,
                // 商品名称
                goodsName: goodsData.goodsName,
                // 物品类型 1-购买资料 2-购买VIP 4-购买爱问豆 8-下载特权 9-优享资料 10-免费资料 11-vip专享资料 15-VIP专享资料（商品） 16-免费资料（商品）
                goodsType: 17,

                // 订单金额 单位分
                payPrice: goodsData.price,
                // 支付类型 wechat-微信支付 alipay-支付宝 iask-平台内购(爱问豆) baidu-百度收银台 ishare-站内支付
                payType: 'ishare',

                // 买家id
                buyerUserId: userInfo.uid,
                // 买家姓名
                buyerUserName: userInfo.nickName,
                // 站点(字典表) 0-办公 1-教育 2-建筑 3-超级会员 4-主站 5超级合同 6超级PPT 7合同通 8爱问法律
                channelSource: 4,
                // 客户端(字典表) 0-pc 1-m版  2-android  3-ios 4-快应用  5-百度小程序端 6-微信浏览器
                // 7-微信小程序 701-微信爱问办公模板小程序 702-微信爱问文件管理小程序 703-微信爱问模板小程序
                // 704-微信爱问福利社小程序 101-马甲站01
                sourceMode: 0,
                // 否使用优惠券，1未使用，2使用
                isVouchers: 1,
                host: host,
                referrer: document.referrer || document.URL,
                // 来源网址 0-正常 1-360 2-小米
                ref: 0
            };
            method.customPost(api.order.downloadOrder, params, function (res) {
                if (res && res.code === '0') {
                    var msg = '商品已发放到当前账户，请注意查收';
                    // 商品类型:1优惠券 2vip套餐
                    if (goodsData.goodsType === 1) {
                        msg = '优惠券已发放到当前账户，请注意查收';
                    }
                    // 显示兑换成功弹窗
                    exchangeTipsLayerService.success({
                        msg: msg,
                        url: goodsData.skipLinks
                    });
                } else {
                    that.layerMsg(res && res.message ? res.message : '兑换失败，请重试');
                }

                // 触发回调-告知外部跟新积分商品列表
                if (typeof that.callback === 'function') {
                    that.callback();
                }
            }, function () {
                that.layerMsg('系统错误，请重试');
            });
        }
    };
});
