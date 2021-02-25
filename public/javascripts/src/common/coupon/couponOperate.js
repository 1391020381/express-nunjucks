/**
 * 用优惠券
 */
define(function (require, exports, module) {
    // var $ = require("$");
    require('../../cmd-lib/toast');
    var method = require("../../application/method");
    var couponOptions = require("./template/options.html");

    var couponObj = {
        _index: 0,
        data: [], // 此为可用的优惠券
        undata: [], // 此为不可用的优惠券
        price: 10,
        maxCouponLimit: null,
        couponType: 2,//0是现金文档，1是vip
        cashPrice: 0,//现金文档
        vipPrice: 0,//vip
        useCouponFlag: 1,
        isVip: 0,
        fileDiscount: 0.8, //是VIP 会有个动态折扣
        initial: function () {
            //区别现金购买还是vip购买
            couponObj.queryPageType();
            //点击页面其他地方收起优惠券
            $('body').click(function () {
                if (!$('.coupon-down').is(':hidden')) {
                    $('.coupon-down').hide();
                    $('.select-wrap').removeClass('select-wrap-down');
                }
            });
            if (couponObj.couponType == 0 || couponObj.couponType == 1) {
                couponObj.price = couponObj.getOrderPrice();
                try {
                    couponObj.isVip = window.pageConfig.params.isVip || 0;
                } catch (e) {
                    couponObj.isVip = 0;
                }
                var fileDiscount = window.pageConfig.params.fileDiscount;
                couponObj.fileDiscount = fileDiscount || 0.8; // 是VIP的话就有动态折扣
                //获取数据
                couponObj.getCouponData(couponObj.couponType);
                // 优惠券选择点击
                couponObj.selectCouponOption();
                //优惠券选择弹窗
                couponObj.operateCouponModule();
                // 切换vip套餐
                couponObj.switchVipSeries();
                //如果支持vip打折
                // if (pageConfig.params.vipDiscountFlag == 1 && pageConfig.params.ownVipDiscountFlag == 1 && pageConfig.params.g_permin == 3 && couponObj.isVip == 0) {
                //     $('.vip-share-text').show();
                //     couponObj.vipDiscountFreeAmount();
                // }

                if (pageConfig.params.vipDiscountFlag == 1 && pageConfig.params.g_permin == 3 && couponObj.isVip == 0) {
                    $('.vip-share-text').show();
                    couponObj.vipDiscountFreeAmount();
                }
            }
        },

        /**
         * 获取订单价格
         */
        getOrderPrice: function () {
            var oprice = 0;
            if (couponObj.couponType == 1) { // 如果是VIP购买场景
                // 当前选择选择态的套餐【活动价/原价】
                    oprice = $('.js-tab').find('.ui-tab-nav-item.active').data('price')
            } else {
                if (pageConfig.params) {
                    oprice = pageConfig.params.moneyPrice
                }
            }
            return oprice;
        },

        /**
         * 确定页面
         */
        queryPageType: function () {
            var pathName = location.pathname;
            if (pathName == "/pay/vip.html") {
                couponObj.couponType = 1; // vip购买页
            } else if (pathName == "/pay/payConfirm.html") {
                couponObj.couponType = 0;
                var referrerHref = document.referrer
                $('.btn-back').attr('href', referrerHref)
                // $('.btn-back').attr('href', "//ishare.iask.sina.com.cn/f/" + method.getParam('orderNo') + '.html')
            }
        },

        /**
         * 获取优惠券数据
         */
        getCouponData: function (type) {
            var oprice = couponObj.price;
            var url = '/node/coupon/queryPersonal';
            var data = {
                type: type,
                price: oprice,
                terminal: 0
            }
            // 筛选可用的优惠券【A20】
            var dataList = {
                validList: [],
                invalidList: []
            };
            $.get(url, data, function (res) {
                if (res.code == 0) {
                    if (res.data) {
                        if (res.data.list) {
                            if (res.data.list.length > 0) {
                                var data = JSON.parse(JSON.stringify(res.data.list));
                                // 删除大于订单金额的优惠券
                                dataList = couponObj.delInvalidData(data, oprice);
                            }
                            couponObj.useCouponFlag = 1;//初始化
                        }
                    }
                }
                var list = dataList.validList.concat(dataList.invalidList);
                var _html = template.compile(couponOptions)({ data: list });
                $('.coupon-down .select-text').html(_html);
                // 判断是否可用【A20】
                couponObj.data = dataList.validList;
                couponObj.undata = dataList.invalidList;
                couponObj.updateCouponOption(0);
            })
        },

        /**
         * 获得vip 8折省多少元
         */
        vipDiscountFreeAmount: function () {
            var discountPrice = (couponObj.price * couponObj.fileDiscount).toFixed(2)
            var Freeprice = ((couponObj.price * 100 - discountPrice * 100) / 100).toFixed(2);
            $('#vipDiscountFreeAmount').text(Freeprice)
        },

        /**
         * 点击选择框展开或收拢优惠券弹窗
         */
        operateCouponModule: function () {
            $('.pay-coupon-wrap').on('click', '.chose-ele', function (event) {
                var dataList = couponObj.data.concat(couponObj.undata);
                if (dataList.length > 0) {
                    $('.coupon-down').toggle();
                    $('.select-wrap').toggleClass('select-wrap-down');
                    event.stopPropagation();
                }
            })
        },

        /**
         * 点击选择优惠券
         */
        selectCouponOption: function () {
            $('.coupon-down').on('click', '.select-ele', function (event) {
                $('.coupon-down').hide();
                event.stopPropagation();
                // 相对可选元素的位置【A20】
                var _index = $(this).index('.select-ele');
                $('.select-wrap').toggleClass('select-wrap-down');
                couponObj._index = _index;
                couponObj.useCouponFlag = 1;//初始化
                couponObj.updateCouponOption(_index);
            });

            $('.coupon-down').on('click', '.select-ele-disable', function (event) {
                event.stopPropagation();
                $.toast({
                    text: '该券不满足使用条件',
                    delay: 2000,
                });
            });
        },

        /**
         * 更新选择框提示
         */
        updateCouponOption: function (_index) {
            if (couponObj.data.length == _index) {
                // 选择最后一个就是放弃优惠券
                if (_index == 0) {
                    //    如果没有优惠券
                    var text = '<span class="no-user">无可用</span>'
                    $('.select-text .chose-ele').html(text);
                    couponObj.useCouponFlag = 0
                } else {
                    var textHtml = couponObj.data.length + '个可用';
                    $('.select-text .chose-ele').html(textHtml);
                    couponObj.quitCouponUse()
                }
                $('.pay-coupon-wrap').removeAttr('vid');
                $('.pay-coupon-wrap').removeAttr('svuId');

            } else {
                $('.pay-coupon-wrap').attr('vid', couponObj.data[_index].vid);
                $('.pay-coupon-wrap').attr('svuId', couponObj.data[_index].svuId);

                var domHtml = $('.coupon-down').find('.select-text .select-ele').eq(_index).html()
                $('.select-text .chose-ele').html(domHtml);
                // 存在最大优惠限制
                if (couponObj.data[_index].manCouponAmount) {
                    couponObj.maxCouponLimit = couponObj.data[_index].manCouponAmount;
                } else {
                    couponObj.maxCouponLimit = null;
                }
            }
            couponObj.updatePrice()
        },

        /**
         * 放弃优惠券使用
         */
        quitCouponUse: function () {
            couponObj.maxCouponLimit = null;
            couponObj.useCouponFlag = 0;
            var tips = '';
            $('.price-text-con #discountPrice').text(tips);
            couponObj.updatePrice()
        },

        /**
         * 更新价钱优惠说明提示
         */
        updatePriceTip: function () {
            var couponAmount = couponObj.getDiscountPrice();
            var oprice = couponObj.getOrderPrice();
            var tips = '';
            if (couponObj.couponType == 1) {
                // 购买vip
             
                var activeTip = '';
              
                //放弃使用优惠券
                if (couponAmount == 0) {
                        tips = '';
                } else {
                    // 使用优惠券
                    tips = '(' + activeTip + '使用优惠券优惠' + couponAmount + '元)';
                }
            } else {
                // 现金文档 
                var vipDiscountTip = "";
                var isVipDiscount = false;
                if (pageConfig.params.vipDiscountFlag == 1 && pageConfig.params.g_permin == 3 && couponObj.isVip == 1) {
                    var afterCouponPrice = ((oprice * 100 - couponAmount * 100) / 100).toFixed(2);
                    var vipDiscount = ((afterCouponPrice * 100 - (afterCouponPrice * couponObj.fileDiscount).toFixed(2) * 100) / 100).toFixed(2);
                    vipDiscountTip = 'VIP权益优惠' + vipDiscount + '元'
                    isVipDiscount = true;
                }
                if (couponAmount == 0) {
                    if (isVipDiscount) {
                        tips = '(' + vipDiscountTip + ')';
                    } else {
                        tips = '';
                    }
                } else {
                    tips = '(' + vipDiscountTip + '使用优惠券优惠' + couponAmount + '元)';
                }

            }
            if (couponObj.couponType == 0) {
                $('.price-text-con .original-text').text(tips);
            } else if (couponObj.couponType == 1) {
                $('.price-text-con #discountPrice').text(tips);
                $('.price-text-con #discountPrice').show()
            }
        },

        /**
         * 切换vip套餐
         */
        switchVipSeries: function () {
            $('.js-tab').on('click', '.ui-tab-nav-item', function (event) {
                couponObj.price = couponObj.getOrderPrice();
                // 选择框提示
                couponObj._index = 0;
                couponObj.getCouponData(1);
            })
        },

        /**
         * 更新支付价钱
         */
        updatePrice: function () { // couponType: 2,//0是现金文档，1是vip
            var discountNum;
            if (couponObj.useCouponFlag == 0) {
                // 如果flag = 0，表示不使用优惠券或者没有优惠券
                discountNum = 0;
            } else {
                discountNum = couponObj.getDiscountPrice();
            }
            var lastedPrice = 0;
            var isRenewal = $('.js-tab .ui-tab-nav-item.active').attr('data-isautorenew') == '1'? $('.renewal-radio #renewal').attr('checked'):''
            var renewalPrice = $('.renewal-radio .renewal-desc .price').text()
            if (couponObj.couponType == 1) { // vip
                var oprice = isRenewal?renewalPrice:couponObj.price 
                lastedPrice = ((oprice * 100 - discountNum * 100) / 100).toFixed(2);
            } else if (couponObj.couponType == 0) {  //现金
                var vipDiscountPrice = 0, oprice = pageConfig.params.moneyPrice;
                var params = pageConfig.params;
                if (params.vipDiscountFlag == 1 && params.g_permin == 3 && couponObj.isVip == 1) {
                    var afterCouponPrice = ((oprice * 100 - discountNum * 100) / 100).toFixed(2);
                    var vipDiscountPrice = ((afterCouponPrice * 100 - (afterCouponPrice * couponObj.fileDiscount).toFixed(2) * 100) / 100).toFixed(2);
                }
                lastedPrice = ((couponObj.price * 100 - discountNum * 100 - vipDiscountPrice * 100) / 100).toFixed(2);
            }
           
            if (couponObj.couponType == 1) {
                    $('#activePrice').text(lastedPrice);
            } else {
                    $('.price-text-con .price').text(lastedPrice);  
            }
            couponObj.updatePriceTip()
        },

        /**
         * 计算优惠金额
         */
        getDiscountPrice: function () {
            //如果flag==0；不适用优惠券
            var isRenewal = $('.js-tab .ui-tab-nav-item.active').attr('data-isautorenew') == '1'? $('.renewal-radio #renewal').attr('checked'):''
            var renewalPrice = $('.renewal-radio .renewal-desc .price').text()
            var _index = couponObj._index;
            var data = couponObj.data;
            var oprice = isRenewal?renewalPrice:couponObj.price;
            var couponAmount = 0;
            if (couponObj.useCouponFlag == 0) {
                couponAmount = 0;
            } else {
                if (data[_index].type == 1) { // 如果是满减券
                    var couponAmount = data[_index].couponAmount;
                } else { // 如果是折扣卷
                    var discount = data[_index].discount;
                    var discountPrice = (oprice * discount * 0.1).toFixed(2);
                    couponAmount = ((oprice * 100 - discountPrice * 100) / 100).toFixed(2);
                }
                if (couponObj.maxCouponLimit && couponObj.maxCouponLimit <= couponAmount) {
                    couponAmount = couponObj.maxCouponLimit;
                }
            }
            return couponAmount;
        },

        /**
         * 删选大于订单金额的优惠券【筛选可用/不可用】
         */
        delInvalidData: function (data, oprice) {
            var data = JSON.parse(JSON.stringify(data))
            var oprice = oprice ? oprice : 0;
            var validList = [], invalidList = [];
            // data.map(function (v, i) {
            //     if (v.couponAmount) {
            //         if (v.couponAmount - oprice > 0 || v.couponAmount == oprice) {
            //             invalidIndex.push(i);
            //         }
            //     }
            // })
            // if (invalidIndex.length > 0) {
            //     for (var index = invalidIndex.length - 1; index > -1; index--) {
            //         data.splice(invalidIndex[index], 1)
            //     }
            // }
            // return data;
            for (var index = 0; index < data.length; index++) {
                var element = data[index];
                if (element.couponAmount && element.couponAmount - oprice >= 0) {
                    element['vStatus'] = 3;
                    invalidList.push(element);
                } else {
                    if (element.vStatus == 3) {
                        invalidList.push(element);
                    } else {
                        validList.push(element);
                    }
                }
            }
            return {
                validList: validList,
                invalidList: invalidList
            };
        },
        
    }

    couponObj.initial();
    return couponObj
})