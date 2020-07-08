define("dist/personalCenter/myuploads-debug", [ "../application/method-debug", "../application/api-debug", "./template/myuploads-debug.html", "./template/simplePagination-debug.html", "./effect-debug", "../application/checkLogin-debug", "../application/app-debug", "../application/element-debug", "../application/template-debug", "../application/extend-debug", "../common/bilog-debug", "base64-debug", "../cmd-lib/util-debug", "../report/config-debug", "../report/init-debug", "../report/handler-debug", "../report/columns-debug", "../application/helper-debug", "//static3.iask.cn/resource/js/plugins/pc.iask.login.min-debug", "./home-debug", "swiper-debug", "../common/recommendConfigInfo-debug", "../common/template/swiper_tmp-debug.html", "./template/homeRecentlySee-debug.html", "./template/vipPrivilegeList-debug.html" ], function(require, exports, module) {
    var method = require("../application/method-debug");
    var type = window.pageConfig && window.pageConfig.page.type;
    var api = require("../application/api-debug");
    var myuploads = require("./template/myuploads-debug.html");
    var simplePagination = require("./template/simplePagination-debug.html");
    var isLogin = require("./effect-debug").isLogin;
    var getUserCentreInfo = require("./home-debug").getUserCentreInfo;
    var idList = [];
    // 保存 要删除的文件id
    if (type == "myuploads") {
        isLogin(initData);
    }
    function initData() {
        getUserCentreInfo();
        getMyUploadPage();
    }
    function getMyUploadPage(currentPage) {
        // 分页查询我的上传
        var status = method.getParam("myuploadType") || 1;
        $.ajax({
            url: api.user.getMyUploadPage,
            type: "POST",
            data: JSON.stringify({
                currentPage: currentPage || 1,
                pageSize: 20,
                status: +status
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function(res) {
                if (res.code == "0") {
                    console.log("getMyUploadPage:", res);
                    var formatDate = method.formatDate;
                    Date.prototype.format = formatDate;
                    var list = [];
                    res.data.rows.forEach(function(item) {
                        var userFilePrice = "";
                        if (item.userFileType == 1) {
                            userFilePrice = "免费";
                        }
                        if (item.userFileType == 4) {
                            userFilePrice = userFilePrice + "个特权";
                        }
                        if (item.userFileType == 5) {
                            userFilePrice = (userFilePrice / 100).toFixed(2) + "元";
                        }
                        var createtime = new Date(item.createtime).format("yyyy-MM-dd");
                        item.createtime = createtime;
                        list.push(item);
                    });
                    var myuploadType = window.pageConfig.page && window.pageConfig.page.myuploadType || 1;
                    var _myuploadsTemplate = template.compile(myuploads)({
                        list: list || [],
                        totalPages: res.data.totalSize,
                        myuploadType: myuploadType
                    });
                    $(".personal-center-myuploads").html(_myuploadsTemplate);
                    handlePagination(res.data.totalSize, res.data.currentPage);
                } else {
                    $.toast({
                        text: res.msg,
                        delay: 3e3
                    });
                }
            },
            error: function(error) {
                console.log("getMyUploadPage:", error);
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
            getMyUploadPage(paginationCurrentPage);
        });
    }
    // 
    $(document).on("click", ".myuploads-table-list .label-input", function(event) {
        // 切换checkbox选中的状态样式
        console.log($(this).attr("checked"));
        if ($(this).attr("checked")) {
            // checked
            $(this).parent().parent().parent().addClass("table-item-active");
        } else {
            $(this).parent().parent().parent().removeClass("table-item-active");
            $(".myuploads-table-list #all").attr("checked", false);
        }
    });
    $(document).on("click", ".delete-icon", function(event) {
        // 删除选中的文件  可能是全选
        var isChecked = $(this).parent().parent().find(".label-input").attr("checked");
        // var isCheckedAll = $('.myuploads-table-list #all').attr('checked')
        var deleteType = $(this).attr("data-deleteType");
        console.log("isChecked:", isChecked);
        if (isChecked && !deleteType) {
            // 单个删除   $(this).attr('data-id') 有值
            idList.push($(this).attr("data-id"));
            $("#dialog-box").dialog({
                html: $("#myuploads-delete-dialog").html()
            }).open();
            return;
        }
        if (deleteType == "deleteSome" && $(".myuploads-table-list input:checked").length > 0) {
            // 不一定是全部删除,是删除选中的
            $(".myuploads-table-list input:checked").each(function(i) {
                idList.push($(this).attr("id"));
            });
            console.log("idList:", idList);
            console.log("全部删除");
            $("#dialog-box").dialog({
                html: $("#myuploads-delete-dialog").html()
            }).open();
            return;
        }
    });
    $("#dialog-box").on("click", ".delete-tip-dialog .confirm-btn", function(e) {
        batchDeleteUserFile();
    });
    $(document).on("click", ".myuploads-table-list #all", function(event) {
        // 全选
        console.log($(this).attr("checked"));
        // .attr("checked", 'checked')
        if ($(this).attr("checked")) {
            $(".myuploads-table-list .label-input").attr("checked", "checked");
        } else {
            $(".myuploads-table-list .label-input").attr("checked", false);
        }
    });
    function batchDeleteUserFile() {
        $.ajax({
            url: api.upload.batchDeleteUserFile,
            type: "POST",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(idList),
            dataType: "json",
            success: function(res) {
                if (res.code == "0") {
                    console.log("batchDeleteUserFile:", res);
                    $.toast({
                        text: "删除成功!",
                        delay: 3e3
                    });
                    closeRewardPop();
                    idList = [];
                    getMyUploadPage();
                } else {
                    $.toast({
                        text: res.msg,
                        delay: 3e3
                    });
                }
            },
            error: function(error) {
                console.log("batchDeleteUserFile:", error);
            }
        });
    }
    function closeRewardPop() {
        $(".common-bgMask").hide();
        $(".detail-bg-mask").hide();
        $("#dialog-box").hide();
    }
});