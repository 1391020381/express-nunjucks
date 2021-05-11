define(function (require, exports, module) {
    var api = require('../../application/api');
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
        var id = data.id
        var coinNum = data.coinNum
        var url = api.exchange.exchangeGoodsDetail.replace('$id', id);
        $ajax(url, 'GET','', false).done(function (res) {
            if (res.code == 0) {
                var goodsData = {
                    description: res.data.description, // 商品说明
                    exchangeType: 1, // 	 兑换类型: 1爱问币
                    goodsName: res.data.goodsName, // 	积分商品名称
                    hasExchange: false, // 	是否兑换完 true-已兑完 false-剩余
                    id: res.data.id, // 	积分商品id
                    pictureUrl: res.data.pictureUrl, // 	积分商品图片url
                    price: res.data.price, // 	兑换金额
                    skipLinks: res.data.skipLinks, // 	跳转链接
                    useExchangeCount:res.data.useExchangeCount, // 	已兑换总次数
                    goodsType:res.data.goodsType  // 商品类型:1优惠券 2vip套餐
                };
                openLayer(goodsData, coinNum);
            }else{
                layerMsg(res.message)
            }
        });
    }

    // 展开弹窗
    function openLayer(goodsData, coinNum) {
        // description	 商品说明
        // exchangeType	 兑换类型: 1爱问币
        // goodsName	积分商品名称
        // hasExchange	是否兑换完 true-已兑完 false-剩余
        // id	积分商品id
        // pictureUrl	积分商品图片url
        // price	兑换金额
        // skipLinks	跳转链接
        // useExchangeCount	已兑换总次数
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
