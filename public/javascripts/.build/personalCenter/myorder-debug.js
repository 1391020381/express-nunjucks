define("dist/personalCenter/myorder-debug", [ "../application/method-debug", "../application/api-debug", "./effect-debug", "../application/checkLogin-debug", "../application/app-debug", "../application/element-debug", "../application/template-debug", "../application/extend-debug", "../common/bilog-debug", "base64-debug", "../cmd-lib/util-debug", "../report/config-debug", "../report/init-debug", "../report/handler-debug", "../report/columns-debug", "../application/helper-debug", "//static3.iask.cn/resource/js/plugins/pc.iask.login.min-debug", "./home-debug", "swiper-debug", "../common/recommendConfigInfo-debug", "../common/template/swiper_tmp-debug.html", "./template/homeRecentlySee-debug.html", "./template/vipPrivilegeList-debug.html", "./template/simplePagination-debug.html", "./template/myorder-debug.html" ], function(require, exports, module) {
    var method = require("../application/method-debug");
    var api = require("../application/api-debug");
    var type = window.pageConfig && window.pageConfig.page.type;
    var isLogin = require("./effect-debug").isLogin;
    var getUserCentreInfo = require("./home-debug").getUserCentreInfo;
    var myorderType = window.pageConfig && window.pageConfig.page.myorderType;
    var simplePagination = require("./template/simplePagination-debug.html");
    var orderStatusList = {
        0: "待支付",
        1: "支付进行中",
        2: "支付成功",
        3: "支付失败",
        4: "订单取消"
    };
    var refundStatusDescList = {
        0: "未申请退款",
        1: "退款申请中",
        2: "退款审核中",
        3: "退款审核不通过",
        4: "退款成功",
        5: "退款失败",
        7: "退款异常"
    };
    var goodsTypeList = {
        1: {
            desc: "购买资料",
            checkStatus: 8
        },
        2: {
            desc: "购买VIP",
            checkStatus: 10
        },
        8: {
            desc: "购买下载特权",
            checkStatus: 13
        }
    };
    if (type == "myorder") {
        isLogin(initData);
    }
    function initData() {
        getUserCentreInfo();
        queryOrderlistByCondition();
    }
    $(".personal-center-myorder").click(".item-operation", function(event) {
        // 需要根据 goodsType 转换为 checkStatus(下载接口)
        var goodsType = $(event.target).attr("data-goodstype");
        var fid = $(event.target).attr("data-fid");
        var orderNo = $(event.target).attr("data-orderno");
        var checkStatus = goodsTypeList[goodsType].checkStatus;
        method.compatibleIESkip("/pay/payQr.html?type=" + checkStatus + "&orderNo=" + orderNo + "&fid=" + fid, true);
    });
    function queryOrderlistByCondition(currentPage) {
        var orderStatus = method.getParam("myorderType") == "1" ? "" : method.getParam("myorderType");
        $.ajax({
            url: api.order.queryOrderlistByCondition,
            type: "POST",
            data: JSON.stringify({
                orderStatus: orderStatus,
                userOpt: "0",
                currentPage: currentPage || 1,
                pageSize: 20,
                sortStr: "orderTime"
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function(res) {
                console.log("queryOrderlistByCondition:", res);
                if (res.code == "0") {
                    var list = [];
                    var formatDate = method.formatDate;
                    Date.prototype.format = formatDate;
                    if (res.data && res.data.rows) {
                        res.data.rows.forEach(function(item) {
                            item.payPrice = (item.payPrice / 100).toFixed(2);
                            item.orderTime = new Date(item.orderTime).format("yyyy-MM-dd");
                            if (item.refundStatus == 0 || !item.refundStatus) {
                                item.orderStatusDesc = orderStatusList[item.orderStatus];
                            } else {
                                item.orderStatusDesc = refundStatusDescList[item.orderStatus];
                            }
                            list.push(item);
                        });
                    }
                    var myorder = require("./template/myorder-debug.html");
                    var _myorderTemplate = template.compile(myorder)({
                        list: list || [],
                        myorderType: myorderType
                    });
                    $(".personal-center-myorder").html(_myorderTemplate);
                    handlePagination(res.data.totalPages, res.data.currentPage);
                } else {
                    $.toast({
                        text: res.msg,
                        delay: 3e3
                    });
                }
            },
            error: function(error) {
                console.log("queryOrderlistByCondition:", error);
            }
        });
    }
    function handlePagination(totalPages, currentPage) {
        var _simplePaginationTemplate = template.compile(simplePagination)({
            paginationList: new Array(totalPages || 0),
            currentPage: currentPage
        });
        $(".pagination-wrapper").html(_simplePaginationTemplate);
        $(".pagination-wrapper").on("click", ".page-item", function(e) {
            var paginationCurrentPage = $(this).attr("data-currentPage");
            if (!paginationCurrentPage) {
                return;
            }
            queryOrderlistByCondition(paginationCurrentPage);
        });
    }
});