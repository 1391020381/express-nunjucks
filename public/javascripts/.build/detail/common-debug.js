define("dist/detail/common-debug", [ "../application/method-debug", "../application/api-debug", "../application/urlConfig-debug", "./template/pay_btn_tmp-debug.html", "./template/pay_middle_tmp-debug.html", "./template/pay_header.tmp-debug.html" ], function(require, exports, module) {
    // var $ = require("$");
    var method = require("../application/method-debug");
    var api = require("../application/api-debug");
    var pay_btn_tmp = require("./template/pay_btn_tmp-debug.html");
    var pay_middle_tmp = require("./template/pay_middle_tmp-debug.html");
    var pay_header_tmp = require("./template/pay_header.tmp-debug.html");
    var userData = null;
    var pageConfig = window.pageConfig && window.pageConfig;
    // 页面信息
    // productType  1  4  5 
    var initData = {
        fileDiscount: "80",
        isDownload: pageConfig.page.isDownload,
        //仅在线阅读
        vipFreeFlag: pageConfig.params.vipFreeFlag,
        //是否VIP免费
        isVip: 0,
        //是否VIP
        perMin: pageConfig.params.g_permin,
        //是否现金文档
        vipDiscountFlag: pageConfig.params.vipDiscountFlag,
        ownVipDiscountFlag: pageConfig.params.ownVipDiscountFlag,
        volume: pageConfig.params.file_volume,
        //下载券数量
        moneyPrice: pageConfig.params.moneyPrice,
        fid: pageConfig.params.g_fileId,
        title: pageConfig.page.fileName,
        format: pageConfig.params.file_format,
        cdnUrl: _head,
        productType: pageConfig.page.productType,
        // 商品类型 1：免费文档，3 在线文档 4 vip特权文档 5 付费文档 6 私有文档
        productPrice: pageConfig.page.productPrice
    };
    /**
     * 刷新头部信息
     * @param data checkLogin 返回数据
     */
    var reloadHeader = function(data) {
        var $unLogin = $("#detail-unLogin"), // unLogin
        $hasLogin = $("#haveLogin"), $top_user_more = $(".top-user-more"), $icon_iShare_text = $(".icon-iShare-text"), $btn_user_more = $(".btn-user-more"), $vip_status = $(".vip-status"), $icon_iShare = $(".icon-iShare");
        // 顶部右侧的消息
        $(".top-bar .news").removeClass("hide").find("#user-msg").text(data.msgCount);
        $icon_iShare_text.html(data.isVip === "1" ? "续费VIP" : "开通VIP");
        $btn_user_more.text(data.isVip === "1" ? "续费" : "开通");
        if (data.isVip === "0") {
            $(".open-vip").show().siblings("a").hide();
        } else {
            $(".xf-open-vip").show().siblings("a").hide();
        }
        var $target = null;
        //vip
        if (data.isVip == 1) {
            $target = $vip_status.find('p[data-type="2"]');
            $target.find(".expire_time").html(data.expireTime);
            $target.show().siblings().hide();
            $top_user_more.addClass("top-vip-more");
        } else if (data.userType == 1) {
            $target = $vip_status.find('p[data-type="3"]');
            $target.show().siblings().hide();
        }
        $unLogin.hide();
        $hasLogin.find(".icon-detail").html(data.nickName);
        $hasLogin.find("img").attr("src", data.photoPicURL);
        $top_user_more.find("img").attr("src", data.photoPicURL);
        $top_user_more.find("#userName").html(data.nickName);
        $hasLogin.show();
        //右侧导航栏.
        /* ==>头像,昵称 是否会员文案提示.*/
        $(".user-avatar img").attr("src", data.photoPicURL);
        $(".name-wrap .name-text").html(data.nickName);
        if (data.isVip === "1") {
            var txt = "您的VIP将于" + data.expireTime + "到期,剩余" + data.privilege + "次下载特权";
            $(".detail-right-normal-wel").html(txt);
            $(".detail-right-vip-wel").html("会员尊享权益");
            $(".btn-mui").hide();
            $("#memProfit").html("VIP权益");
        } else {
            $(".mui-privilege-list li").removeClass("hide");
        }
    };
    /**
     * 登录后,要刷新顶部.中间,底部内容
     */
    var reloadingPartOfPage = function() {
        $("#footer-btn").html(template.compile(pay_btn_tmp)({
            data: initData
        }));
    };
    /**
     * 重新刷新价格显示
     */
    var reSetOriginalPrice = function() {
        var originalPrice = 0;
        if (initData.vipDiscountFlag == "1") {
            originalPrice = initData.isVip == 1 ? (initData.moneyPrice * (initData.fileDiscount / 100)).toFixed(2) : (initData.moneyPrice * (80 / 100)).toFixed(2);
            // 8折
            $(".js-original-price").html(originalPrice);
            if (initData.isVip == 1) {
                $(".vip-price").html("&yen;" + (initData.moneyPrice * (initData.fileDiscount / 100)).toFixed(2));
            } else {
                $(".vip-price").html("&yen;" + (initData.moneyPrice * (80 / 100)).toFixed(2));
            }
        }
        if (initData.productType === "5" && initData.vipDiscountFlag == "1") {
            originalPrice = userData.isVip == 1 ? (initData.moneyPrice * (initData.fileDiscount / 100)).toFixed(2) : (initData.moneyPrice * (80 / 100)).toFixed(2);
            $(".js-original-price").html(originalPrice);
            var savePrice = userData.isVip == 1 ? (initData.moneyPrice * (initData.fileDiscount / 100)).toFixed(2) : (initData.moneyPrice * (80 / 100)).toFixed(2);
            $("#vip-save-money").html(savePrice);
            $(".js-original-price").html(savePrice);
        }
    };
    /**
     * 查询是否已经收藏
     */
    // var queryStoreFlag = function () {
    //     method.get(api.normalFileDetail.isStore + '?fid=' + initData.fid, function (res) {
    //         if (res.code == 0) {
    //             var $btn_collect = $('#btn-collect');
    //             if (res.data === 1) {
    //                 $btn_collect.addClass('btn-collect-success');
    //             } else {
    //                 $btn_collect.removeClass('btn-collect-success')
    //             }
    //         } else if (res.code == 40001) {
    //             setTimeout(function () {
    //                 method.delCookie('cuk', "/", ".sina.com.cn");
    //             }, 0)
    //         }
    //     });
    // };
    /**
     * 文件预览判断接口
     */
    var filePreview = function(obj) {
        var validateIE9 = method.validateIE9() ? 1 : 0;
        var pageConfig = window.pageConfig;
        var params = "?fid=" + pageConfig.params.g_fileId + "&validateIE9=" + validateIE9;
        $.ajax({
            headers: {
                Authrization: method.getCookie("cuk")
            },
            url: api.normalFileDetail.getPrePageInfo,
            type: "POST",
            data: JSON.stringify({
                fid: pageConfig.params.g_fileId,
                validateIE9: validateIE9
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function(res) {
                if (res.code == 0) {
                    pageConfig.page.preRead = res.data && res.data.preRead || 50;
                    var num = method.getParam("page");
                    if (num > 0) {
                        pageConfig.page.is360page = "true";
                        pageConfig.page.initReadPage = Math.min(num, 50);
                    }
                    pageConfig.page.status = initData.status = res.data && res.data.status;
                    // 0 未登录、转化失败、未购买 2 已购买、本人文件
                    // 修改继续阅读文案要判断是否购买过  
                    if (initData.productType == "5" || initData.productType == "3") {
                        window.changeText();
                    }
                    if (pageConfig.params.file_state === "3") {
                        var content = res.data.url || pageConfig.imgUrl[0];
                        var bytes = res.data.pinfo && res.data.pinfo.bytes || {};
                        var newimgUrl = [];
                        for (var key in bytes) {
                            var page = bytes[key];
                            var param = page[0] + "-" + page[1];
                            var newUrl = method.changeURLPar(content, "range", param);
                            newimgUrl.push(newUrl);
                        }
                        pageConfig.imgUrl = newimgUrl;
                    }
                    //http://swf.ishare.down.sina.com.cn/xU0VKvC0nR.jpg?ssig=%2FAUC98cRYf&Expires=1573301887&KID=sina,ishare&range=0-501277
                    if (method.getCookie("cuk")) {
                        reloadingPartOfPage();
                    }
                    reSetOriginalPrice();
                    if (obj) {
                        // js-buy-open
                        if (res.data && res.data.status == 2) {
                            window.downLoad();
                        } else {
                            obj.callback(obj.type, obj.data);
                        }
                    }
                }
            }
        });
    };
    return {
        initData: initData,
        userData: userData,
        beforeLogin: function() {},
        afterLogin: function(data, obj) {
            userData = data;
            initData.isVip = parseInt(data.isVip, 10);
            initData.fileDiscount = data.fileDiscount;
            window.pageConfig.page.fileDiscount = data.fileDiscount;
            reloadHeader(data);
            // queryStoreFlag();
            filePreview(obj);
        }
    };
});