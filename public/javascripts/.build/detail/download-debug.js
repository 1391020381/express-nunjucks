define("dist/detail/download-debug", [ "../application/method-debug", "../cmd-lib/myDialog-debug", "../cmd-lib/toast-debug", "../cmd-lib/loading-debug", "../cmd-lib/util-debug", "../cmd-lib/gioInfo-debug", "./common-debug", "../application/api-debug", "../application/urlConfig-debug", "./template/pay_btn_tmp-debug.html", "./template/pay_middle_tmp-debug.html", "./template/pay_header.tmp-debug.html", "../common/loginType-debug", "../application/checkLogin-debug", "../application/login-debug", "../common/bilog-debug", "base64-debug", "../report/config-debug", "../application/iframe/iframe-messenger-debug", "../application/iframe/messenger-debug", "../common/baidu-statistics-debug" ], function(require, exports, module) {
    // var $ = require("$");
    var method = require("../application/method-debug");
    require("../cmd-lib/myDialog-debug");
    require("../cmd-lib/toast-debug");
    require("../cmd-lib/loading-debug");
    var utils = require("../cmd-lib/util-debug");
    var gioInfo = require("../cmd-lib/gioInfo-debug");
    var common = require("./common-debug");
    var login = require("../application/checkLogin-debug");
    var api = require("../application/api-debug");
    var clickEvent = require("../common/bilog-debug").clickEvent;
    var fid = window.pageConfig.params.g_fileId;
    // 文件id
    var tpl_android = $("#tpl-down-android").html();
    //下载app  项目全局 没有 这个 classId
    var file_title = window.pageConfig.params.file_title;
    //详情页异常信息提示弹框
    var $tpl_down_text = $("#tpl-down-text");
    // 在 详情index.html中引入的 dialog.html 用有  一些弹框模板
    // 文档已下载
    // vip专享下载--扣除下载特权
    var $permanent_privilege = $("#permanent_privilege");
    // 扣除下载特权--但不够扣
    var $permanent_privilege_not = $("#permanent_privilege_not");
    // vip 免费下载次数达上限提醒
    var $vipFreeDownCounts = $("#vipFreeDownCounts");
    // 非VIP 免费下载次数达上限提醒
    var $freeDownCounts = $("#freeDownCounts");
    //
    var userData = null;
    //下载跳转公用
    var publicDownload = function() {
        method.delCookie("event_data_down", "/");
        if (window.pageConfig.page.isDownload === "n") {
            return;
        }
        // 文件预下载
        method.get(api.normalFileDetail.filePreDownLoad + "?fid=" + fid, function(res) {
            if (res.code == 0) {
                //阻塞下载gio上报
                bouncedType(res);
                docDLFail(res.data.status);
            } else if (res.code == 42e3 || res.code == 42001 || res.code == 42002 || res.code == 42003) {
                $("#dialog-box").dialog({
                    html: $tpl_down_text.html().replace(/\$msg/, res.message)
                }).open();
            } else if (res.code == 40001) {
                login.notifyLoginInterface(function(data) {
                    userData = data;
                });
            } else if (res.code == 42011) {
                method.compatibleIESkip("/pay/vip.html", false);
            } else {
                $("#dialog-box").dialog({
                    html: $tpl_down_text.html().replace(/\$msg/, res.message)
                }).open();
            }
        }, "");
    };
    //上报数据处理-下载受限
    var docDLFail = function(status) {
        if (gioInfo.downloadLimitedCodeMap[status]) {
            downLoadReport.downloadLimited_var = gioInfo.downloadLimitedCodeMap[status];
            __pc__.gioTrack("docDLFail", downLoadReport);
        }
    };
    var bouncedType = function(res) {
        //屏蔽下载的 后台返回 文件不存在需要怎么提示
        var $dialogBox = $("#dialog-box");
        fid = window.pageConfig.params.g_fileId;
        switch (res.data.checkStatus) {
          // 下载
            case 0:
            // 原来 status 100
            var browserEnv = method.browserType();
            method.delCookie("event_data_down", "/");
            if (res.data.score > 0) {
                expendScoreNum_var = res.data.score * 1;
            } else if (res.data.volume > 0) {
                expendNum_var = res.data.volume * 1;
            } else if (window.pageConfig.params.file_volume > 0 && res.data.privilege > 0) {
                //消耗下载特权数量
                expendNum_var = 1;
            }
            if (browserEnv === "IE" || browserEnv === "Edge") {
                var fid = window.pageConfig.params.g_fileId;
                var consumeStatus = res.data.consumeStatus;
                var url = "/node/f/downsucc.html?fid=" + fid + "&consumeStatus=" + consumeStatus + "&url=" + encodeURIComponent(res.data.fileDownUrl);
                goNewTab(url);
            } else if (browserEnv === "Firefox") {
                var fid = window.pageConfig.params.g_fileId;
                var consumeStatus = res.data.consumeStatus;
                var url = "/node/f/downsucc.html?fid=" + fid + "&consumeStatus=" + consumeStatus + "&url=" + encodeURIComponent(res.data.fileDownUrl);
                goNewTab(url);
            } else {
                var fid = window.pageConfig.params.g_fileId;
                var consumeStatus = res.data.consumeStatus;
                var url = "/node/f/downsucc.html?fid=" + fid + "&consumeStatus=" + consumeStatus + "&title=" + encodeURIComponent(file_title) + "&url=" + encodeURIComponent(res.data.fileDownUrl);
                goNewTab(url);
            }
            break;

          case 8:
            var fid = window.pageConfig.params.g_fileId;
            var format = window.pageConfig.params.file_format;
            var title = window.pageConfig.params.file_title;
            var params = "";
            var ref = utils.getPageRef(fid);
            method.setCookieWithExpPath("rf", JSON.stringify({}), 5 * 60 * 1e3, "/");
            method.setCookieWithExp("f", JSON.stringify({
                fid: fid,
                title: title,
                format: format
            }), 5 * 60 * 1e3, "/");
            params = "?orderNo=" + fid + "&checkStatus=" + res.data.checkStatus + "&referrer=" + document.referrer;
            method.compatibleIESkip("/pay/payConfirm.html" + params, false);
            break;

          case 1:
            var ui = method.getCookie("ui") ? JSON.parse(decodeURIComponent(method.getCookie("ui"))) : {
                isVip: ""
            };
            if (ui.isVip == "1") {
                $("#dialog-box").dialog({
                    html: $vipFreeDownCounts.html()
                }).open();
            } else {
                $("#dialog-box").dialog({
                    html: $freeDownCounts.html()
                }).open();
            }
            break;

          // 下载过于频繁
            case 2:
            $dialogBox.dialog({
                html: $tpl_down_text.html().replace(/\$msg/, "您当日下载过于频繁,一分钟后再下载")
            }).open();
            break;

          case 10:
            var fid = window.pageConfig.params.g_fileId;
            var showTips = 1;
            var format = window.pageConfig.params.file_format;
            var title = window.pageConfig.params.file_title;
            var productType = window.pageConfig.params.productType;
            var userFileType = window.pageConfig.params.userFileType;
            var userFilePrice = window.pageConfig.params.userFilePrice;
            method.setCookieWithExp("f", JSON.stringify({
                fid: fid,
                title: title,
                format: format
            }), 5 * 60 * 1e3, "/");
            if (productType == "4") {
                var params = "?fid=" + fid + "&ft=" + format + "&checkStatus=" + res.data.checkStatus + "&name=" + encodeURIComponent(encodeURIComponent(title)) + "&ref=" + ref + "&showTips=" + showTips + "&productType=" + productType + "&userFileType=" + userFileType + "&userFilePrice=" + userFilePrice;
            } else {
                var params = "?fid=" + fid + "&ft=" + format + "&checkStatus=" + res.data.checkStatus + "&name=" + encodeURIComponent(encodeURIComponent(title)) + "&ref=" + ref + "&showTips=" + showTips;
            }
            goLocalTab("/pay/vip.html" + params);
            break;

          case 13:
            $dialogBox.dialog({
                html: $permanent_privilege_not.html().replace(/\$title/, pageConfig.params.file_title.substr(0, 20)).replace(/\$fileSize/, pageConfig.params.file_size).replace(/\$code/, res.data.status).replace(/\$privilege/, res.data.privilege).replace(/\$productPrice/, res.data.productPrice)
            }).open();
            break;

          // 在线文档不支持下载       
            case 17:
            $dialogBox.dialog({
                html: $tpl_down_text.html().replace(/\$msg/, "在线文档不支持下载")
            }).open();
            break;

          // 验证码不正确
            case 99:
            break;

          // 显示验证码
            case 98:
            break;

          // 已下载过
            default:        }
    };
    /**
     * 预下载
     */
    var preDownLoad = function() {
        //gio上报-下载按钮点击
        if (!method.getCookie("cuk")) {
            login.notifyLoginInterface(function(data) {
                userData = data;
                publicDownload();
                common.afterLogin(data);
            });
            if ($(this).attr("loginOffer")) {
                method.setCookieWithExpPath("_loginOffer", $(this).attr("loginOffer"), 1e3 * 60 * 60 * 1, "/");
            }
            method.setCookieWithExpPath("event_data_down", "down", 1e3 * 60 * 60 * 1, "/");
        } else if (method.getCookie("cuk") && !userData) {
            login.getLoginData(function(data) {
                userData = data;
                publicDownload();
                common.afterLogin(data);
            });
        } else if (method.getCookie("cuk") && userData) {
            publicDownload();
        }
        __pc__.gioTrack("docDetailDLClick", downLoadReport);
    };
    /**
    * 
    * 获取下载获取地址接口
    */
    var handleFileDownUrl = function() {
        if (method.getCookie("cuk")) {
            // 判断文档类型 假设是 productType = 4 vip特权文档 需要先请求预下载接口
            if (window.pageConfig.page.productType == 4) {
                $.ajax({
                    headers: {
                        Authrization: method.getCookie("cuk")
                    },
                    url: api.normalFileDetail.filePreDownLoad,
                    type: "POST",
                    data: JSON.stringify({
                        clientType: 0,
                        fid: fid,
                        sourceType: 1
                    }),
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function(res) {
                        console.log(res);
                        if (res.code == "0") {
                            if (res.data.checkStatus == 0 && res.data.consumeStatus == 2) {
                                // consumeStatus == 2 用下载特权消费的
                                $dialogBox.dialog({
                                    html: $permanent_privilege.html().replace(/\$title/, pageConfig.params.file_title.substr(0, 20)).replace(/\$fileSize/, pageConfig.params.file_size).replace(/\$privilege/, res.data.privilege || 0).replace(/\$productPrice/, res.data.productPrice || 0).replace(/\$code/, res.data.status)
                                }).open();
                            } else {
                                getFileDownLoadUrl();
                            }
                        } else {
                            $.toast({
                                text: res.message || "预下载失败",
                                delay: 2e3
                            });
                        }
                    }
                });
            } else {
                getFileDownLoadUrl();
            }
        } else {
            login.notifyLoginInterface(function(data) {
                common.afterLogin(data);
                userData = data;
                handleFileDownUrl();
            });
        }
    };
    var getFileDownLoadUrl = function() {
        $.ajax({
            headers: {
                Authrization: method.getCookie("cuk")
            },
            url: api.normalFileDetail.getFileDownLoadUrl,
            type: "POST",
            data: JSON.stringify({
                clientType: 0,
                fid: fid,
                sourceType: 1
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function(res) {
                console.log(res);
                if (res.code == "0") {
                    if (res.data.productType == "4" && res.data.orderNo) {
                        clickEvent("createOrder", {
                            orderID: res.data.orderNo
                        });
                    }
                    bouncedType(res);
                } else {
                    $.toast({
                        text: res.message || "下载失败",
                        delay: 2e3
                    });
                }
            }
        });
    };
    /**
     * 跳转到新的tab
     * @param href
     */
    var goNewTab = function(href) {
        method.compatibleIESkip(href, false);
    };
    var goLocalTab = function(href) {
        method.compatibleIESkip(href, false);
    };
    //已经登录 并且有触发支付点击
    var downCookie = method.getCookie("event_data_down");
    if (method.getCookie("cuk") && downCookie == "down") {
        method.delCookie("event_data_down", "/");
        //唤起下载
        preDownLoad();
    }
    var $dialogBox = $("#dialog-box");
    // 弹窗下载
    $dialogBox.on("click", ".btn-dialog-download", function() {
        var code = $(this).attr("data-code");
        if (code) {
            // downLoad(code);
            //  handleFileDownUrl()
            getFileDownLoadUrl();
        }
    });
    //点击预下载按钮
    $(document).on("click", '[data-toggle="download"]', function(e) {
        handleFileDownUrl();
    });
    //用app保存
    $(document).on("click", ".sava-app", function(e) {
        $("#dialog-box").dialog({
            html: tpl_android
        }).open();
    });
    window.downLoad = handleFileDownUrl;
    // js-buy-open
    module.exports = {
        downLoad: handleFileDownUrl
    };
});