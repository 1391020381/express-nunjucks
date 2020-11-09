define("dist/personalCenter/mycollectionAndDownLoad-debug", [ "../application/method-debug", "../application/api-debug", "../application/urlConfig-debug", "./template/mycollectionAndDownLoad-debug.html", "./template/simplePagination-debug.html", "../application/effect-debug", "../application/checkLogin-debug", "../application/login-debug", "../common/bilog-debug", "base64-debug", "../cmd-lib/util-debug", "../report/config-debug", "../cmd-lib/myDialog-debug", "../cmd-lib/toast-debug", "../application/iframe/iframe-messenger-debug", "../application/iframe/messenger-debug", "../common/baidu-statistics-debug", "./home-debug", "swiper-debug", "../common/recommendConfigInfo-debug", "../common/template/swiper_tmp-debug.html", "./template/homeRecentlySee-debug.html", "./template/vipPrivilegeList-debug.html" ], function(require, exports, module) {
    var method = require("../application/method-debug");
    var api = require("../application/api-debug");
    var mycollectionAndDownLoad = require("./template/mycollectionAndDownLoad-debug.html");
    var simplePagination = require("./template/simplePagination-debug.html");
    var isLogin = require("../application/effect-debug").isLogin;
    var getUserCentreInfo = require("./home-debug").getUserCentreInfo;
    var type = window.pageConfig && window.pageConfig.page.type;
    if (type == "mycollection" || type == "mydownloads") {
        isLogin(initData, true);
    }
    function initData(data) {
        if (type == "mycollection") {
            getUserCentreInfo(null, data);
            getUserFileList();
        } else if (type == "mydownloads") {
            getUserCentreInfo(null, data);
            getDownloadRecordList();
        }
    }
    function getDownloadRecordList(currentPage) {
        //用户下载记录接口
        $.ajax({
            headers: {
                Authrization: method.getCookie("cuk")
            },
            url: api.user.getDownloadRecordList,
            type: "POST",
            data: JSON.stringify({
                currentPage: currentPage || 1,
                pageSize: 20
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function(res) {
                if (res.code == "0") {
                    console.log("getDownloadRecordList:", res);
                    var formatDate = method.formatDate;
                    Date.prototype.format = formatDate;
                    var list = [];
                    $(res.data.rows).each(function(index, item) {
                        var downloadTime = new Date(item.downloadTime).format("yyyy-MM-dd");
                        item.downloadTime = downloadTime;
                        item.fileId = item.id;
                        list.push(item);
                    });
                    var _mycollectionAndDownLoadTemplate = template.compile(mycollectionAndDownLoad)({
                        type: "mydownloads",
                        list: list || [],
                        totalSize: res.data.totalSize || 0
                    });
                    $(".personal-center-mydownloads").html(_mycollectionAndDownLoadTemplate);
                    handlePagination(res.data.totalPages, res.data.currentPage, "mydownloads");
                } else {
                    $.toast({
                        text: res.msg,
                        delay: 3e3
                    });
                }
            },
            error: function(error) {
                console.log("getDownloadRecordList:", error);
            }
        });
    }
    function getUserFileList(currentPage) {
        // 查询个人收藏列表
        var pageNumber = currentPage || 1;
        $.ajax({
            headers: {
                Authrization: method.getCookie("cuk")
            },
            url: api.user.getUserFileList + "?pageNumber=" + pageNumber + "&pageSize=20&sidx=0&order=-1",
            type: "GET",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function(res) {
                if (res.code == "0") {
                    console.log("getUserFileList:", res);
                    // 复用我的下载模板,需要处理接口的字段
                    var formatDate = method.formatDate;
                    Date.prototype.format = formatDate;
                    var list = [];
                    $(res.data.rows).each(function(index, item) {
                        var collectTime = new Date(item.collectTime).format("yyyy-MM-dd");
                        var temp = {
                            format: item.format,
                            title: item.title,
                            fileId: item.fileId,
                            downloadTime: collectTime
                        };
                        list.push(temp);
                    });
                    var _mycollectionAndDownLoadTemplate = template.compile(mycollectionAndDownLoad)({
                        type: "mycollection",
                        list: list || [],
                        totalSize: res.data.totalSize || 0
                    });
                    $(".personal-center-mycollection").html(_mycollectionAndDownLoadTemplate);
                    handlePagination(res.data.totalPages, res.data.currentPage, "mycollection");
                } else {
                    $.toast({
                        text: res.msg,
                        delay: 3e3
                    });
                }
            },
            error: function(error) {
                console.log("getUserFileList:", error);
            }
        });
    }
    // 分页
    function handlePagination(totalPages, currentPage, flag) {
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
            if (flag == "mycollection") {
                // 点击分页后重新请求数据
                getUserFileList(paginationCurrentPage);
            }
            if (flag == "mydownloads") {
                getDownloadRecordList(paginationCurrentPage);
            }
        });
    }
});