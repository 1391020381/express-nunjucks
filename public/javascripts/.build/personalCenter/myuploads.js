define("dist/personalCenter/myuploads", [ "../application/method", "../application/api", "./template/myuploads.html", "./template/simplePagination.html", "../application/effect", "../application/checkLogin", "../application/login", "../cmd-lib/jqueryMd5", "../common/bilog", "base64", "../cmd-lib/util", "../report/config", "../cmd-lib/myDialog", "../cmd-lib/toast", "../common/bindphone", "../common/baidu-statistics", "./home", "swiper", "../common/recommendConfigInfo", "../common/template/swiper_tmp.html", "./template/homeRecentlySee.html", "./template/vipPrivilegeList.html" ], function(require, exports, module) {
    var method = require("../application/method");
    var type = window.pageConfig && window.pageConfig.page.type;
    var api = require("../application/api");
    var myuploads = require("./template/myuploads.html");
    var simplePagination = require("./template/simplePagination.html");
    var isLogin = require("../application/effect").isLogin;
    var getUserCentreInfo = require("./home").getUserCentreInfo;
    var idList = [];
    // 保存 要删除的文件id
    if (type == "myuploads") {
        isLogin(initData, true);
    }
    function initData() {
        getUserCentreInfo();
        getMyUploadPage();
    }
    function getMyUploadPage(currentPage) {
        // 分页查询我的上传
        var status = method.getParam("myuploadType") || 1;
        $.ajax({
            headers: {
                Authrization: method.getCookie("cuk")
            },
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
                    $(res.data.rows).each(function(index, item) {
                        var userFilePrice = "";
                        if (item.userFileType == 1) {
                            userFilePrice = "免费";
                        }
                        if (item.userFileType == 4) {
                            //  userFilePrice = userFilePrice + '个特权'
                            userFilePrice = "--";
                        }
                        if (item.userFileType == 5) {
                            userFilePrice = "￥" + (item.userFilePrice / 100).toFixed(2) + "元";
                        }
                        item.userFilePrice = userFilePrice;
                        var createtime = new Date(item.createtime).format("yyyy-MM-dd");
                        item.createtime = createtime;
                        item.readNum = item.readNum > 1e4 ? (item.readNum / 1e4).toFixed(1) + "w" : item.readNum;
                        item.downNum = item.downNum > 1e4 ? (item.downNum / 1e4).toFixed(1) + "w" : item.downNum;
                        list.push(item);
                    });
                    var myuploadType = window.pageConfig.page && window.pageConfig.page.myuploadType || 1;
                    var _myuploadsTemplate = template.compile(myuploads)({
                        list: list || [],
                        totalPages: res.data.totalSize,
                        myuploadType: myuploadType
                    });
                    $(".personal-center-myuploads").html(_myuploadsTemplate);
                    handlePagination(res.data.totalPages, res.data.currentPage);
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
    $(document).on("click", ".myuploads .label-input", function(event) {
        // 切换checkbox选中的状态样式
        console.log($(this).attr("checked"));
        if ($(this).attr("checked")) {
            // checked
            $(this).parent().parent().parent().addClass("table-item-active");
        } else {
            $(this).parent().parent().parent().removeClass("table-item-active");
            $(".myuploads-table-list #all").attr("checked", false);
        }
        var checkedNumber = $(".myuploads-table-list input:checkbox:checked");
        var labelInputNum = $(".myuploads-table-list .label-input");
        if (checkedNumber.length) {
            $(".myuploads .myuploads-nums").text(checkedNumber.length + "篇");
        } else {
            $(".myuploads .myuploads-nums").text(0 + "篇");
        }
        if (checkedNumber.length == labelInputNum.length) {
            $(".myuploads-table-list #all").attr("checked", true);
        } else {
            $(".myuploads-table-list #all").attr("checked", false);
        }
    });
    $(document).on("click", ".myuploads-table-list #all", function(event) {
        // 全选
        console.log($(this).attr("checked"));
        if ($(this).attr("checked")) {
            $(".myuploads-table-list .label-input").attr("checked", "checked");
            $(".myuploads-table-list .table-item").addClass("table-item-active");
        } else {
            $(".myuploads-table-list .label-input").attr("checked", false);
            $(".myuploads-table-list .table-item").removeClass("table-item-active");
        }
        var checkedNumber = $(".myuploads-table-list input:checkbox:checked");
        if (checkedNumber.length) {
            $(".myuploads .myuploads-nums").text(checkedNumber.length - 1 + "篇");
        } else {
            $(".myuploads .myuploads-nums").text(0 + "篇");
        }
    });
    $(document).on("click", ".delete-icon", function(event) {
        // 删除选中的文件  可能是全选
        idList = [];
        var isChecked = $(this).parent().parent().find(".label-input").attr("checked");
        // var isCheckedAll = $('.myuploads-table-list #all').attr('checked')
        var deleteType = $(this).attr("data-deleteType");
        console.log("isChecked:", isChecked);
        if (!deleteType) {
            // 单个删除   $(this).attr('data-id') 有值
            idList.push($(this).attr("data-id"));
            $("#dialog-box").dialog({
                html: $("#myuploads-delete-dialog").html().replace(/\$deleteNum/, 1)
            }).open();
            return false;
        }
        if (deleteType == "deleteSome" && $(".myuploads-table-list .label-input:checked").length > 0) {
            // 不一定是全部删除,是删除选中的
            $(".myuploads-table-list .label-input:checked").each(function(i) {
                idList.push($(this).attr("id"));
            });
            console.log("idList:", idList);
            console.log("全部删除");
            $("#dialog-box").dialog({
                html: $("#myuploads-delete-dialog").html().replace(/\$deleteNum/, idList.length)
            }).open();
            return false;
        }
    });
    $("#dialog-box").on("click", ".delete-tip-dialog .confirm-btn", function(e) {
        console.log("idList:", idList);
        batchDeleteUserFile();
    });
    function batchDeleteUserFile() {
        $.ajax({
            headers: {
                Authrization: method.getCookie("cuk")
            },
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