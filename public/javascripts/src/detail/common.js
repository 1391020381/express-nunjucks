define(function (require, exports, module) {
    // var $ = require("$");
    var method = require("../application/method");
    var api = require('../application/api');
    var pay_btn_tmp = require("./template/pay_btn_tmp.html");
    var pay_middle_tmp = require("./template/pay_middle_tmp.html");
    var pay_header_tmp = require("./template/pay_header.tmp.html");
    var userData = null;
    // 页面信息
   // productType  1  4  5 
    var initData = {
        isDownload: window.pageConfig.page.isDownload,                   //仅在线阅读
        vipFreeFlag: window.pageConfig.params.vipFreeFlag,               //是否VIP免费
        isVip: 0,                                                        //是否VIP
        perMin: window.pageConfig.params.g_permin,                       //是否现金文档
        vipDiscountFlag: window.pageConfig.params.vipDiscountFlag,
        ownVipDiscountFlag: window.pageConfig.params.ownVipDiscountFlag,
        volume: window.pageConfig.params.file_volume,                    //下载券数量
        moneyPrice:window.pageConfig.params.moneyPrice,
        fid: window.pageConfig.params.g_fileId,
        title: window.pageConfig.page.fileName,
        format: window.pageConfig.params.file_format,
        cdnUrl: _head,
        productType:window.pageConfig.page.productType,  // 商品类型 1：免费文档，3 在线文档 4 vip特权文档 5 付费文档 6 私有文档
        productPrice:window.pageConfig.page.productPrice  // 商品价格 > 0 的只有 vip特权 个数,和 付费文档 金额 单位分
    };

    /**
     * 刷新头部信息
     * @param data checkLogin 返回数据
     */
    var reloadHeader = function (data) {
        var $unLogin = $('#unLogin'),
            $hasLogin = $('#haveLogin'),
            $top_user_more = $('.top-user-more'),
            $icon_iShare_text = $('.icon-iShare-text'),
            $btn_user_more = $('.btn-user-more'),
            $vip_status = $('.vip-status'),
            $icon_iShare = $(".icon-iShare");
        // 顶部右侧的消息
        $('.top-bar .news').removeClass('hide').find('#user-msg').text(data.msgCount);
        $icon_iShare_text.html(data.isVip === '1' ? '续费VIP' : '开通VIP');
        $btn_user_more.text(data.isVip === '1' ? '续费' : '开通');

        if (data.isVip === '0') {
            $('.open-vip').show().siblings('a').hide();
        } else {
            $('.xf-open-vip').show().siblings('a').hide();
        }

        var $target = null;
        //vip
        if (data.isVip == 1) {
            $target = $vip_status.find('p[data-type="2"]');
            $target.find('.expire_time').html(data.expireTime);
            $target.show().siblings().hide();
            $top_user_more.addClass('top-vip-more');
            //vip 已经 过期
        } else if (data.userType == 1) {
            $target = $vip_status.find('p[data-type="3"]');
            $target.show().siblings().hide();
        }

        $unLogin.hide();
        $hasLogin.find('.icon-detail').html(data.nickName);
        $hasLogin.find('img').attr('src', data.weiboImage);
        $top_user_more.find('img').attr('src', data.weiboImage);
        $top_user_more.find('#userName').html(data.nickName);
        $hasLogin.show();

        //右侧导航栏.
        /* ==>头像,昵称 是否会员文案提示.*/
        $('.user-avatar img').attr('src', data.weiboImage);
        $('.name-wrap .name-text').html(data.nickName);
        if (data.isVip === '1') {
            var txt = '您的VIP将于' + data.expireTime + '到期,剩余' + data.privilege + '次下载特权';
            $('.detail-right-normal-wel').html(txt);
            $('.detail-right-vip-wel').html('会员尊享权益');
            $('.btn-mui').hide();
            $('#memProfit').html('VIP权益');
        } else {
            $('.mui-privilege-list li').removeClass('hide');
        }

    };

    /**
     * 登录后,要刷新顶部.中间,底部内容
     */
    var reloadingPartOfPage = function () {
        $("#footer-btn").html(template.compile(pay_btn_tmp)({data: initData})); // footer-btn 详情底部固定栏  /views/detail/fixed.html
      //  $("#middle-btn").html(template.compile(pay_middle_tmp)({data: initData})); // middle-btn 详情正文部分按钮 /views/detail/middleBtn.html
      //  $("#headerBtn").html(template.compile(pay_header_tmp)({data: initData}));  // headerBtn  详情头部立即下载按钮  产品暂时注释掉 header的立即下载按钮
    };

    /**
     * 重新刷新价格显示
     */
    var reSetOriginalPrice = function () {
        var originalPrice = 0;
        if (initData.isVip == 1 && initData.vipDiscountFlag == '1') { // initData.isVip == 1 && initData.vipDiscountFlag && initData.ownVipDiscountFlag
            // originalPrice = ((initData.moneyPrice * 1000) / 1250).toFixed(2);
            originalPrice = initData.moneyPrice ;
            $(".js-original-price").html(originalPrice);
            // var fileDiscount = userData.fileDiscount;
            // if (fileDiscount && fileDiscount !== 80) {
            //     $('.vip-price').html('&yen;' + (initData.moneyPrice * (fileDiscount / 100)).toFixed(2));
            // }
            $('.vip-price').html('&yen;' + (initData.moneyPrice * (80 / 100)).toFixed(2));
        }
        if ((initData.productType === '4'||initData.productType === '5') && initData.vipDiscountFlag == '1') { // initData.perMin === '3' && initData.vipDiscountFlag && initData.ownVipDiscountFlag
            // originalPrice = ((initData.moneyPrice * 1000) / 1250).toFixed(2);
            originalPrice = initData.moneyPrice 
            $(".js-original-price").html(originalPrice);
          //  var savePrice = (initData.moneyPrice - originalPrice).toFixed(2);
            var savePrice = (params.moneyPrice *0.8).toFixed(2);
            $('#vip-save-money').html(savePrice);
            $('.js-original-price').html(savePrice);
        }
    };

    /**
     * 查询是否已经收藏
     */
    var queryStoreFlag = function () {
        method.get(api.normalFileDetail.isStore + '?fid=' + initData.fid, function (res) {
            if (res.code == 0) {
                var $btn_collect = $('#btn-collect');
                if (res.data === 1) {
                    $btn_collect.addClass('btn-collect-success');
                } else {
                    $btn_collect.removeClass('btn-collect-success')
                }
            } else if (res.code == 40001) {
                setTimeout(function () {
                    method.delCookie('cuk', "/", ".sina.com.cn");
                }, 0)
            }
        });
    };


    /**
     * 文件预览判断接口
     */
    var filePreview = function () {
        var validateIE9 = method.validateIE9() ? 1 : 0;
        var pageConfig = window.pageConfig;
        var params = '?fid=' + pageConfig.params.g_fileId + '&validateIE9=' + validateIE9;
        method.get(api.normalFileDetail.getPrePageInfo + params, function (res) {
            if (res.code == 0) {
                pageConfig.page.preRead = res.data.preRead || 50;
                var num = method.getParam('page');
                if (num > 0) {
                    pageConfig.page.is360page = 'true';
                    pageConfig.page.initReadPage = Math.min(num, 50);
                }
                pageConfig.page.status = initData.status = res.data.status;  // 0 未登录、转化失败、未购买 2 已购买、本人文件
                if (pageConfig.params.file_state === '3') {
                    var content = res.data.url || pageConfig.imgUrl[0];
                    var bytes = res.data.pinfo.bytes || {};
                    var newimgUrl = [];
                    for (var key in bytes) {
                        var page = bytes[key];
                        var param = page[0] + '-' + page[1];
                        var newUrl = method.changeURLPar(content, 'range', param);
                        newimgUrl.push(newUrl);
                    }
                    pageConfig.imgUrl = newimgUrl;
                }
                //http://swf.ishare.down.sina.com.cn/xU0VKvC0nR.jpg?ssig=%2FAUC98cRYf&Expires=1573301887&KID=sina,ishare&range=0-501277
                if (method.getCookie('cuk')) {
                    reloadingPartOfPage();
                }
                reSetOriginalPrice();
            }
        })
    };

    return {
        initData: initData,
        userData: userData,
        beforeLogin: function () {
        },
        afterLogin: function (data) {
            userData = data;
            initData.isVip = parseInt(data.isVip, 10);
            reloadHeader(data);
            // queryStoreFlag();
            filePreview();
        }
    }
});