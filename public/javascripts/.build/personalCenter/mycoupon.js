define("dist/personalCenter/mycoupon", [ "../application/api", "../application/urlConfig", "../application/method", "./template/simplePagination.html", "../application/effect", "../application/checkLogin", "../application/login", "../common/bilog", "base64", "../cmd-lib/util", "../report/config", "../cmd-lib/myDialog", "../cmd-lib/toast", "../application/iframe/iframe-messenger", "../application/iframe/messenger", "../common/baidu-statistics", "./home", "swiper", "../common/recommendConfigInfo", "../common/template/swiper_tmp.html", "./template/homeRecentlySee.html", "./template/vipPrivilegeList.html", "./template/mycoupon.html" ], function(require, exports, module) {
    var api = require("../application/api");
    var method = require("../application/method");
    var type = window.pageConfig && window.pageConfig.page.type;
    var simplePagination = require("./template/simplePagination.html");
    var isLogin = require("../application/effect").isLogin;
    var getUserCentreInfo = require("./home").getUserCentreInfo;
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
                    var mycoupon = require("./template/mycoupon.html");
                    var _mycouponTemplate = template.compile(mycoupon)({
                        list: list || [],
                        mycouponType: type || "0"
                    });
                    $(".personal-center-mycoupon").html(_mycouponTemplate);
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