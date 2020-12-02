define("dist/personalCenter/mycollectionAndDownLoad-debug", [ "../application/method-debug", "../application/api-debug", "../application/urlConfig-debug", "./template/mycollectionAndDownLoad-debug.html", "./template/simplePagination-debug.html", "./dialog-debug", "../application/effect-debug", "../application/checkLogin-debug", "../application/login-debug", "../common/bilog-debug", "base64-debug", "../cmd-lib/util-debug", "../report/config-debug", "../cmd-lib/myDialog-debug", "../cmd-lib/toast-debug", "../application/iframe/iframe-messenger-debug", "../application/iframe/messenger-debug", "../common/baidu-statistics-debug", "../common/loginType-debug", "./home-debug", "swiper-debug", "../common/recommendConfigInfo-debug", "../common/template/swiper_tmp-debug.html", "./template/homeRecentlySee-debug.html", "./template/vipPrivilegeList-debug.html", "./template/receiveCoupon-debug.html", "./template/commentDialogContent-debug.html" ], function(require, exports, module) {
    var method = require("../application/method-debug");
    var api = require("../application/api-debug");
    var mycollectionAndDownLoad = require("./template/mycollectionAndDownLoad-debug.html");
    var simplePagination = require("./template/simplePagination-debug.html");
    var closeRewardPop = require("./dialog-debug").closeRewardPop;
    var isLogin = require("../application/effect-debug").isLogin;
    var getUserCentreInfo = require("./home-debug").getUserCentreInfo;
    var type = window.pageConfig && window.pageConfig.page.type;
    var clickEvent = require("../common/bilog-debug").clickEvent;
    var utils = require("../cmd-lib/util-debug");
    var receiveCoupon = require("./template/receiveCoupon-debug.html");
    var commentDialogContent = require("./template/commentDialogContent-debug.html");
    var score = 0;
    var isAppraise = 0;
    var tagList = [];
    // 评论标签
    var taskList = {};
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
                        text: res.message,
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
                        text: res.message,
                        delay: 3e3
                    });
                }
            },
            error: function(error) {
                console.log("getUserFileList:", error);
            }
        });
    }
    // 获取评价标签
    function getLabelList(fid, format, title, isAppraise) {
        $.ajax({
            headers: {
                Authrization: method.getCookie("cuk")
            },
            url: api.comment.getLableList + "?pageSize=15&fid=" + fid,
            // 
            type: "GET",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function(res) {
                if (res.code == "0") {
                    tagList = res.data;
                    var data = {
                        fid: fid,
                        format: format,
                        title: title,
                        labelList: res.data,
                        isAppraise: isAppraise
                    };
                    var evaluationDialogContent = template.compile(commentDialogContent)({
                        data: data
                    });
                    $("#dialog-box").dialog({
                        html: $("#evaluation-dialog").html().replace(/\$content/, evaluationDialogContent)
                    }).open();
                } else {
                    $.toast({
                        text: res.message,
                        delay: 3e3
                    });
                }
            },
            error: function(error) {
                console.log("queryUserBindInfo:", error);
            }
        });
    }
    // 添加评论 
    function addComment(params) {
        $.ajax({
            headers: {
                Authrization: method.getCookie("cuk")
            },
            url: api.comment.addComment,
            //
            type: "POST",
            data: JSON.stringify(params),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function(res) {
                if (res.code == "0") {
                    $.toast({
                        text: "评价成功",
                        delay: 3e3
                    });
                    score = 0;
                    closeRewardPop();
                    getTaskList(params.fid);
                } else {
                    $.toast({
                        text: res.message,
                        delay: 3e3
                    });
                }
            },
            error: function(error) {
                console.log("getDownloadRecordList:", error);
            }
        });
    }
    // 获取文件评论
    function getFileComment(fid, title, format) {
        $.ajax({
            url: api.comment.getPersoDataInfo + "?fid=" + fid,
            //,
            type: "GET",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function(res) {
                if (res && res.code == "0") {
                    var data = {
                        fid: fid,
                        format: format,
                        title: title,
                        labelList: res.data.labels,
                        isAppraise: 1,
                        content: res.data.content,
                        scores: new Array(+res.data.score)
                    };
                    var evaluationDialogContent = template.compile(commentDialogContent)({
                        data: data
                    });
                    $("#dialog-box").dialog({
                        html: $("#evaluation-dialog").html().replace(/\$content/, evaluationDialogContent)
                    }).open();
                }
            }
        });
    }
    // 获取任务列表接口
    function getTaskList(fid) {
        $.ajax({
            url: api.coupon.getTask,
            type: "POST",
            data: JSON.stringify({
                key: fid,
                taskCode: "evaluate"
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function(res) {
                if (res && res.code == "0") {
                    taskList = res.data || {};
                    taskList.fid = fid;
                    if (taskList.id) {
                        startTaskReceive(taskList || {
                            rewardContent: [],
                            rewardType: tagList.rewardType
                        });
                    } else {
                        getDownloadRecordList();
                    }
                }
            }
        });
    }
    // 开始弹出领取优惠券的弹窗
    function startTaskReceive(taskList) {
        if (!taskList.rewardContent.length) return;
        var data = {
            code: taskList.code,
            id: taskList.id,
            rewardType: taskList.rewardType,
            list: taskList.rewardContent.slice(0, 2)
        };
        var _html = template.compile(receiveCoupon)({
            data: data
        });
        var isVip = taskList.rewardType == 1 ? true : false;
        var vipClass = isVip ? "coupon-item-vip" : "";
        $("#dialog-box").dialog({
            html: $("#getcoupon-dialog").html().replace(/\$content/, _html).replace(/\$rewardType/, vipClass)
        }).open();
    }
    $(document).on("click", ".personal-center-mydownloads .evaluate-btn", function(event) {
        console.log("evaluate-btn");
        var format = $(this).attr("data-format");
        var title = $(this).attr("data-title");
        var fid = $(this).attr("data-fid");
        isAppraise = $(this).attr("data-isappraise");
        // 1 此文件评价过
        // isAppraise = 1
        if (isAppraise == 1) {
            getFileComment(fid, title, format);
        } else {
            getLabelList(fid, format, title, isAppraise);
        }
    });
    $(document).on("click", ".personal-center-dialog .evaluation-confirm", function(event) {
        if (isAppraise == 1) {
            closeRewardPop();
            isAppraise = 0;
            return;
        }
        if (score + 1 > 0) {
            var labels = [];
            $.each($(".evaluation-dialog input:checkbox:checked"), function() {
                var id = $(this).val();
                $(tagList).each(function(index, item) {
                    if (item.id == id) {
                        labels.push({
                            id: id,
                            name: item.name
                        });
                    }
                });
            });
            var params = {
                content: $(".evaluation-dialog .evaluation-desc .desc-input").val(),
                fid: $(".evaluation-dialog .file-title").attr("data-fid"),
                labels: labels,
                score: score + 1,
                site: 4,
                terminal: 0
            };
            addComment(params);
        } else {
            $.toast({
                text: "请选择评分",
                delay: 3e3
            });
        }
    });
    $(document).on("click", ".personal-center-dialog .file-rates .start", function(e) {
        var isAppraise = $(this).attr("data-isappraise");
        var starts = $(".personal-center-dialog .file-rates .start");
        score = $(this).index();
        if (isAppraise != 1) {
            // 未评论  也就是评论
            starts.removeClass("start-active");
            starts.slice(0, score + 1).addClass("start-active");
            $(".evaluation-dialog .evaluation-confirm").css({
                background: "#F25125",
                color: "#FFFFFF"
            });
        }
    });
    $("#dialog-box").on("click", ".close-btn", function(e) {
        var bilogContent = $(this).attr("bilogContent");
        if (bilogContent) {
            clickEvent($(this));
            getDownloadRecordList();
        }
        closeRewardPop();
    });
    // 绑定立即领取按钮回调
    $(document).on("click", ".coupon-dialog-wrap .coupon-dialog-footer", function(e) {
        var parmas = {
            key: taskList.fid,
            taskCode: taskList.code
        };
        clickEvent($(this));
        $.ajax({
            url: api.coupon.receiveTask,
            //
            headers: {
                Authrization: method.getCookie("cuk")
            },
            type: "POST",
            data: JSON.stringify(parmas),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function(res) {
                closeRewardPop();
                taskList = {};
                if (res && res.code == "0") {
                    // 重新刷新页面
                    $.toast({
                        text: "领取任务成功",
                        delay: 3e3
                    });
                    getDownloadRecordList();
                } else {
                    $.toast({
                        text: res.message,
                        delay: 3e3
                    });
                }
            }
        });
    });
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