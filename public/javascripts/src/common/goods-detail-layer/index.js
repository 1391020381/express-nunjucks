define(function (require, exports, module) {
    var api = require('../../application/api');
    var method = require('../../application/method');
    // 业务模板和js
    var goodsDetailLayerHtml = require('./goodsDetail.html');
    var goodsDetailLayerJs = require('./goodsDetail');

    /**
     * 爱问币规则弹窗
     * @param data {{id,coinNum}} 商品id，用户拥有的爱问币数量
     * @param callback            兑换成功或失败都触发此回调
     */
    function open(data, callback) {
        getGoodsDetail(data, callback);
    }

    /**
     * 查询商品详情
     * @param data {{id,coinNum}} 商品id，用户拥有的爱问币数量
     * @param callback            兑换成功或失败都触发此回调
     */
    function getGoodsDetail(data, callback) {
        var id = data.id;
        var coinNum = data.coinNum;
        var url = api.exchange.exchangeGoodsDetail.replace('$id', id);
        method.customGet(url, null, function (res) {
            if (res && res.code === '0') {
                openLayer(res.data, coinNum, callback);
            } else {
                layerMsg(res && res.message ? res.message : '积分商品详情获取失败');
            }
        });
    }

    /**
     * 展开弹窗
     * @param goodsData           商品数据
     * @param coinNum             用户爱问币数量
     * @param callback            兑换成功或失败都触发此回调
     */
    function openLayer(goodsData, coinNum, callback) {
        // description	商品说明
        // exchangeCount 可兑换总次数
        // exchangeType	兑换类型: 1爱问币
        // goodsName	积分商品名称
        // goodsType	商品类型:1优惠券 2vip套餐
        // goodsTypeId	商品类型Id
        // hasExchange	是否兑换完 true-已兑完 false-剩余
        // id	积分商品id
        // pictureUrl	积分商品图片url
        // price	兑换金额
        // skipLinks 跳转链接
        // useExchangeCount 已兑换总次数
        var goodsHtml = template.compile(goodsDetailLayerHtml)({
            // 商品信息
            data: goodsData,
            // 获取用户所拥有的爱问币数量
            coinNum: coinNum
        });
        layer.open({
            // 确保只打开一个弹窗
            id: 'goodsDetailLayer',
            skin: 'g-noBg-layer',
            type: 1,
            title: false,
            closeBtn: 0,
            area: ['501px'],
            shade: 0.8,
            shadeClose: false,
            content: goodsHtml,
            success: function (layero, index) {
                goodsDetailLayerJs.init(index, goodsData, coinNum, callback);
            },
            end: function () {
                goodsDetailLayerJs.destroy();
            }
        });
    }

    // 提示
    function layerMsg(message) {
        $.toast({
            text: message,
            delay: 2000
        });
    }

    return {
        open: open
    };
});
