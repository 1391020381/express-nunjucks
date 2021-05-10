define(function (require, exports, module) {
    var method = require('../../application/method');
    // 业务模板和js
    var goodsDetailLayerHtml = require('./goodsDetail.html');
    var goodsDetailLayerJs = require('./goodsDetail');

    /**
     * 爱问币规则弹窗
     * @param data {{goodsId,coinNum}} 商品id，用户拥有的爱问币数量
     */
    function open(data) {
        getGoodsDetail(data);
    }

    /**
     * 查询商品详情
     * @param data {{goodsId,coinNum}}
     */
    function getGoodsDetail(data) {
        var goodsId = data.goodsId || '';
        var coinNum = data.coinNum || 0;
        method.customGet('/gateway/order/get/commodityInfo/' + goodsId, null, function (res) {
            if (res && res.code === '0' && res.data) {
                openLayer(res.data, coinNum);
            } else {
                layerMsg('获取商品详情失败');
            }
        }, function () {
            layerMsg('获取商品详情失败');
        });
    }

    // 展开弹窗
    function openLayer(goodsData, coinNum) {
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
                goodsDetailLayerJs.init(index, goodsData);
            },
            end: function () {
                goodsDetailLayerJs.destroy();
            }
        });
    }

    // 提示
    function layerMsg(message) {
        layer.msg(message, {offset: ['200px']});
    }

    return {
        open: open
    };
});
