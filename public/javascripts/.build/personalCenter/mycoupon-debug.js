define("dist/personalCenter/mycoupon-debug", [ "../application/api-debug", "../application/urlConfig-debug", "../application/method-debug", "./template/simplePagination-debug.html", "../application/effect-debug", "../application/checkLogin-debug", "../application/login-debug", "../application/loginOperationLogic-debug", "../cmd-lib/jqueryMd5-debug", "../common/bindphone-debug", "../cmd-lib/myDialog-debug", "../cmd-lib/toast-debug", "../application/iframe/iframe-messenger-debug", "../application/iframe/messenger-debug", "../common/baidu-statistics-debug", "../common/loginType-debug", "../common/associateWords-debug", "./home-debug", "swiper-debug", "../common/recommendConfigInfo-debug", "../common/template/swiper_tmp-debug.html", "./template/homeRecentlySee-debug.html", "./template/vipPrivilegeList-debug.html", "./template/mycoupon-debug.html" ], function(require) {
    var api = require("../application/api-debug");
    var method = require("../application/method-debug");
    var type = window.pageConfig && window.pageConfig.page.type;
    var simplePagination = require("./template/simplePagination-debug.html");
    var isLogin = require("../application/effect-debug").isLogin;
    var getUserCentreInfo = require("./home-debug").getUserCentreInfo;
    if (type == "mycoupon") {
        isLogin(initData, true);
    }
    function initData(data) {
        getUserCentreInfo(null, data);
        rightsSaleQueryUsing();
    }
    function rightsSaleQueryUsing(pageNumber) {
        type = method.getParam("mycouponType") || 0;
        pageNumber = pageNumber || 1;
        $.ajax({
            headers: {
                Authrization: method.getCookie("cuk")
            },
            // url: api.coupon.queryUsing + '?type=' + type?type:0 + '&cuk=d476d0ef8266997b520ad99638a21d0073827bcbfc6c4616d29ee61005b28931&pageNumber='+ pageNumber?pageNumber:0 + '&pageSize=10',
            url: api.coupon.queryUsing + "?type=" + type + "&pageNumber=" + pageNumber + "&pageSize=20",
            type: "GET",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function(res) {
                if (res.code == "0") {
                    console.log("rightsSaleQueryUsing:", res.data && res.data.list);
                    var formatDate = method.formatDate;
                    Date.prototype.format = formatDate;
                    var list = [];
                    $(res.data.list).each(function(index, item) {
                        var beginDate = new Date(item.beginDate).format("yyyy-MM-dd");
                        var endDate = new Date(item.endDate).format("yyyy-MM-dd");
                        item.beginDate = beginDate;
                        item.endDate = endDate;
                        list.push(item);
                    });
                    var mycoupon = require("./template/mycoupon-debug.html");
                    var mycouponTemplate = template.compile(mycoupon)({
                        list: list || [],
                        mycouponType: type || "0"
                    });
                    $(".personal-center-mycoupon").html(mycouponTemplate);
                    handlePagination(res.data.totalPages, res.data.pageNumber);
                } else {
                    $.toast({
                        text: res.message,
                        delay: 3e3
                    });
                }
            },
            error: function(error) {
                console.log("rightsSaleQueryUsing:", error);
            }
        });
    }
    function handlePagination(totalPages, currentPage) {
        var simplePaginationTemplate = template.compile(simplePagination)({
            paginationList: new Array(totalPages || 0),
            currentPage: currentPage
        });
        $(".pagination-wrapper").html(simplePaginationTemplate);
        $(".pagination-wrapper").on("click", ".page-item", function(e) {
            var paginationCurrentPage = $(this).attr("data-currentPage");
            if (!paginationCurrentPage) {
                return;
            }
            rightsSaleQueryUsing(paginationCurrentPage);
        });
    }
});