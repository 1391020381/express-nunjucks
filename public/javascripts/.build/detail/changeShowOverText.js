define("dist/detail/changeShowOverText", [ "./download", "../application/method", "../cmd-lib/myDialog", "../cmd-lib/toast", "../cmd-lib/loading", "../cmd-lib/util", "./common", "../application/api", "../application/urlConfig", "./template/pay_btn_tmp.html", "./template/pay_middle_tmp.html", "./template/pay_header.tmp.html", "../common/loginType", "../application/checkLogin", "../application/login", "../application/loginOperationLogic", "../cmd-lib/jqueryMd5", "../common/bindphone", "../application/iframe/iframe-messenger", "../application/iframe/messenger", "../common/baidu-statistics", "./index", "../application/suspension", "../application/app", "../application/element", "../application/template", "../application/extend", "../common/bilogReport", "../application/effect", "../application/helper", "../application/single-login" ], function(require, exports, module) {
    // 需要判断时候是否要登录 是否点击
    // 试读完毕后, 修改 继续阅读 按钮的文字 而且修改后 事件的逻辑 走下载逻辑
    var downLoad = require("./download").downLoad;
    var method = require("../application/method");
    var login = require("../application/checkLogin");
    var common = require("./common");
    var api = require("../application/api");
    var goPage = require("./index").goPage;
    var readMore = $(".red-color");
    var pageText = $(".page-text .endof-trial-reading");
    var pageNum = $(".page-num");
    var preRead = window.pageConfig.page && window.pageConfig.page.preRead || 50;
    var imgTotalPage = window.pageConfig.imgUrl.length;
    // productType		int	商品类型 1：免费文档，3 在线文档 4 vip特权文档 5 付费文档 6 私有文档
    // 是否登录  method.getCookie('cuk')
    // 是否可以下载  window.pageConfig.page.isDownload
    // productPrice		long	商品价格 > 0 的只有 vip特权 个数,和 付费文档 金额 单位分
    var productType = window.pageConfig.page.productType;
    var productPrice = window.pageConfig.page.productPrice;
    var vipDiscountFlag = window.pageConfig.params.vipDiscountFlag;
    var cuk = method.getCookie("cuk");
    var isDownload = window.pageConfig.page.isDownload;
    // 'n' 屏蔽下载
    var ui = method.getCookie("ui") ? JSON.parse(method.getCookie("ui")) : {};
    function readMoreTextEvent() {
        // 文件下载接口的返回数据
        if (method.getCookie("cuk")) {
            if (productType == 3) {
                // 发送邮箱
                if (ui.isVip == "1") {
                    sentEmail();
                } else {
                    goPage("vip");
                }
            } else {
                downLoad();
            }
        } else {
            method.setCookieWithExpPath("download-qqweibo", 1, 1e3 * 60 * 60 * 1, "/");
            // qq weibo 登录添加标记
            if (productType == 5) {
                $("#footer-btn .js-buy-open").trigger("click");
            } else {
                login.notifyLoginInterface(function(data) {
                    var loginType = window.loginType;
                    console.log("loginType:", loginType);
                    if (loginType !== "qq" || loginType !== "weibo") {
                        method.delCookie("download-qqweibo", "/");
                    }
                    common.afterLogin(data);
                    if (productType == 3) {
                        // 发送邮箱
                        if (data.isVip == "1") {
                            sentEmail();
                        } else {
                            goPage("vip");
                        }
                    } else {
                        downLoad(true);
                    }
                });
            }
        }
    }
    // 查询单个站点单个权限信息
    function getWebsitVipRightInfo() {
        var params = {
            site: 4,
            memberCode: "REWARD"
        };
        $.ajax("/gateway/rights/vip/memberDetail", {
            type: "POST",
            data: JSON.stringify(params),
            dataType: "json",
            contentType: "application/json"
        }).done(function(res) {
            if (res.code == 0) {
                window.pageConfig.reward = {
                    unit: res.data.memberPoint ? res.data.memberPoint.unit : 1,
                    value: res.data.memberPoint ? res.data.memberPoint.value : 0
                };
            }
        }).fail(function(e) {
            $.toast({
                text: "发送失败，请重试",
                delay: 2e3
            });
        });
    }
    function sentEmail() {
        // 寻找相关资料  
        var params = window.pageConfig.params;
        trackEvent("NE029", "fileNomalClick", "click", {
            domID: "sendemail",
            domName: "发送邮箱",
            fileID: params.g_fileId,
            fileName: params.file_title,
            saleType: params.productType
        });
        $("body,html").animate({
            scrollTop: $("#littleApp").offset().top - 60
        }, 200);
        // var reward = window.pageConfig.reward;
        // if (reward.value == "-1") { // 老用户VIP正常弹起
        //     $("#dialog-box").dialog({
        //         html: $('#reward-mission-pop').html(),
        //     }).open();
        // } else if (reward.unit == 1 && reward.value == '0') { // 当天次数用完
        //     $("#dialog-box").dialog({
        //         html: $('#reward-error-pop').html(),
        //     }).open();
        // } else if (reward.unit == 0 && reward.value == '0') { // 一次性用完
        //     $("#dialog-box").dialog({
        //         html: $('#reward-error1-pop').html(),
        //     }).open();
        // } else if (reward.value > 0) { // 正常弹起
        //     $("#dialog-box").dialog({
        //         html: $('#reward-success-pop').html()
        //           .replace(/\$value/, reward.value),
        //     }).open();
        // }
        setTimeout(function() {
            $("#dialog-box").dialog({
                html: $("#reward-mission-pop").html()
            }).open();
        }, 50);
        setTimeout(bindEventPop, 500);
        function bindEventPop() {
            console.log(6666);
            // 绑定关闭悬赏任务弹窗pop
            // 绑定邮箱的值
            if ($(".m-reward-pop #email")) {
                $(".m-reward-pop #email").val(window.pageConfig.email);
            }
            // 绑定关闭悬赏任务弹窗pop
            $(".m-reward-pop .close-btn").on("click", function() {
                closeRewardPop();
            });
            // 绑定我明白了按钮回调
            $(".m-reward-pop .understand-btn").on("click", function() {
                closeRewardPop();
            });
            // submit提交
            $(".m-reward-pop .submit-btn").on("click", function() {
                var userId = window.pageConfig.userId;
                if (!userId) {
                    closeRewardPop();
                    $.toast({
                        text: "该功能仅对VIP用户开放",
                        delay: 3e3
                    });
                    return;
                }
                var reg = /^[0-9a-zA-Z_.-]+[@][0-9a-zA-Z_.-]+([.][a-zA-Z]+){1,2}$/;
                var mailVal = $(".m-reward-pop .form-ipt").val();
                var tips = $(".m-reward-pop .form-verify-tips");
                tips.hide();
                if (!reg.test(mailVal)) {
                    tips.show();
                    return;
                }
                var params = {
                    userId: userId,
                    fid: window.pageConfig.params.g_fileId,
                    email: mailVal,
                    channelSource: 4
                };
                $.ajax(api.normalFileDetail.sendmail, {
                    // /gateway/content/sendmail/findFile
                    type: "POST",
                    data: JSON.stringify(params),
                    dataType: "json",
                    contentType: "application/json"
                }).done(function(res) {
                    if (res.code == 0) {
                        closeRewardPop();
                        $.toast({
                            text: "发送成功",
                            delay: 2e3
                        });
                    } else if (res.code == 401100) {
                        $.toast({
                            text: "该功能仅对VIP用户开放",
                            delay: 2e3
                        });
                    } else {
                        $.toast({
                            text: "发送失败，请重试",
                            delay: 2e3
                        });
                    }
                }).fail(function(e) {
                    $.toast({
                        text: "发送失败，请重试",
                        delay: 2e3
                    });
                });
            });
            // 关闭任务pop
            function closeRewardPop() {
                $(".common-bgMask").hide();
                $(".detail-bg-mask").hide();
                $("#dialog-box").hide();
            }
        }
    }
    window.changeText = changeReadMoreText;
    module.exports = {
        changeText: changeReadMoreText,
        readMoreTextEvent: readMoreTextEvent
    };
    // 1. 预览完成 修改文案 登录的后也要更新
    // 2 点击事件
    function changeReadMoreText() {
        var status = window.pageConfig.page.status;
        var fileDiscount = window.pageConfig.page.fileDiscount;
        var currentPage = $(".detail-con").length;
        var textContent = "";
        switch (productType) {
          case "5":
            // 付费
            if (currentPage >= preRead || currentPage >= imgTotalPage) {
                if (ui.isVip == "1" && vipDiscountFlag == "1") {
                    // textContent =  '¥'+ (productPrice*0.8).toFixed(2) +'获取该资料'
                    textContent = "¥" + (productPrice * (fileDiscount / 100)).toFixed(2) + "获取该资料";
                } else {
                    textContent = "¥" + (+productPrice).toFixed(2) + "获取该资料";
                }
                if (status == 2) {
                    textContent = currentPage >= preRead || currentPage >= imgTotalPage ? "下载到本地阅读" : textContent;
                }
            } else {
                textContent = "点击可继续阅读 >";
            }
            break;

          case "1":
            textContent = "下载到本地阅读";
            break;

          case "3":
            if (currentPage >= preRead || currentPage >= imgTotalPage) {
                if (ui.isVip != "1") {
                    textContent = "开通VIP寻找资料";
                } else {
                    textContent = "寻找资料";
                }
            } else {
                textContent = "点击可继续阅读 >";
            }
            break;

          case "4":
            if (isDownload == "n") {
                textContent = "开通VIP 下载资料";
            } else {
                if (status != 2) {
                    textContent = productPrice + "个下载特权，下载到本地阅读";
                } else {
                    textContent = "下载到本地阅读";
                }
            }
            break;

          default:        }
        readMore.text(textContent);
        if (currentPage >= preRead || currentPage >= imgTotalPage) {
            pageText.show();
        }
        var currentPage = pageNum.text().trim();
        if (currentPage == -1 || currentPage == 0) {
            var page = imgTotalPage - preRead >= 0 ? imgTotalPage - preRead : 0;
            pageNum.text(page);
        }
    }
});