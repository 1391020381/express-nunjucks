define("dist/personalCenter/mycoupon-debug", [ "../application/api-debug", "../application/method-debug", "./template/simplePagination-debug.html", "./effect-debug", "../application/checkLogin-debug", "../application/app-debug", "../application/element-debug", "../application/template-debug", "../application/extend-debug", "../common/bilog-debug", "base64-debug", "../cmd-lib/util-debug", "../report/config-debug", "../report/init-debug", "../report/handler-debug", "../report/columns-debug", "../application/helper-debug", "//static3.iask.cn/resource/js/plugins/pc.iask.login.min-debug", "./home-debug", "./template/homeRecentlySee-debug.html", "./template/mycoupon-debug.html" ], function(require, exports, module) {
    var api = require("../application/api-debug");
    var method = require("../application/method-debug");
    var type = window.pageConfig && window.pageConfig.page.type;
    var simplePagination = require("./template/simplePagination-debug.html");
    var isLogin = require("./effect-debug").isLogin;
    var getUserCentreInfo = require("./home-debug").getUserCentreInfo;
    if (type == "mycoupon") {
        isLogin(initData);
    }
    function initData() {
        getUserCentreInfo();
        rightsSaleQueryUsing();
    }
    function rightsSaleQueryUsing(pageNumber) {
        type = method.getParam("mycouponType") || 0;
        pageNumber = pageNumber || 1;
        $.ajax({
            // url: api.coupon.queryUsing + '?type=' + type?type:0 + '&cuk=d476d0ef8266997b520ad99638a21d0073827bcbfc6c4616d29ee61005b28931&pageNumber='+ pageNumber?pageNumber:0 + '&pageSize=10',
            url: api.coupon.queryUsing + "?type=" + type + "&pageNumber=" + pageNumber + "&pageSize=20",
            type: "GET",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function(res) {
                if (res.code == "0") {
                    console.log("rightsSaleQueryUsing:", res.data && res.data.list);
                    var list = res.data.list;
                    var mycoupon = require("./template/mycoupon-debug.html");
                    var _mycouponTemplate = template.compile(mycoupon)({
                        list: list || [],
                        mycouponType: type || "0"
                    });
                    $(".personal-center-mycoupon").html(_mycouponTemplate);
                    handlePagination(res.data.total, res.data.pageNumber);
                } else {
                    $.toast({
                        text: res.msg,
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
            rightsSaleQueryUsing(paginationCurrentPage);
        });
    }
});