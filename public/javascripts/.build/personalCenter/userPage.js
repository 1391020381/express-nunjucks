define("dist/personalCenter/userPage", [ "../application/method", "../application/api", "../application/checkLogin", "../application/login", "../cmd-lib/jqueryMd5", "../common/bilog", "base64", "../cmd-lib/util", "../report/config", "../cmd-lib/myDialog", "../cmd-lib/toast", "../common/bindphone", "../common/baidu-statistics", "../application/effect", "./template/userPage/index.html", "./template/userPage/rightList.html", "./template/userPage/userPageList.html" ], function(require, exports, module) {
    var method = require("../application/method");
    var api = require("../application/api");
    var login = require("../application/checkLogin");
    // require('./effect.js')
    var isLogin = require("../application/effect").isLogin;
    require("../cmd-lib/toast");
    var userInfo = {};
    var userData = "", currentPage = 1, sortField = "downNum", format = "";
    var isAutoLogin = false;
    var callback = null;
    isLogin(init, isAutoLogin);
    // init()
    function init(data) {
        userInfo = data;
        getOtherUser();
        $(document).on("click", ".js-page-item", function() {
            currentPage = $(this).attr("data-currentPage");
            hotList();
        });
        $(document).on("click", ".tab-item", function() {
            var self = $(this);
            currentPage = 1;
            $(".tab-item").removeClass("active");
            setTimeout(function() {
                self.addClass("active");
            }, 0);
            sortField = $(this).attr("type");
            hotList();
        });
        $(document).on("click", ".format-title", function() {
            $(".format-list").toggle();
            if ($(".format-title").find("i").hasClass("rotate")) {
                $(".format-title").find("i").removeClass("rotate");
            } else {
                $(this).find("i").addClass("rotate");
            }
        });
        $(document).on("click", ".format-list-item", function() {
            currentPage = 1;
            format = $(this).attr("format");
            hotList();
        });
    }
    function getOtherUser() {
        $.ajax({
            url: api.user.getOtherUser,
            type: "get",
            data: {
                uid: method.getQueryString("uid")
            },
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function(res) {
                if (res.code == "0") {
                    userData = res.data;
                    userData.readSum = userData.readSum > 1e4 ? (userData.readSum / 1e4).toFixed(1) + "w+" : userData.readSum;
                    userData.downSum = userData.downSum > 1e4 ? (userData.downSum / 1e4).toFixed(1) + "w+" : userData.downSum;
                    userData.fileSize = userData.fileSize > 1e4 ? (userData.fileSize / 1e4).toFixed(1) + "w+" : userData.fileSize;
                    var _html = template.compile(require("./template/userPage/index.html"))({
                        data: userData
                    });
                    $(".container").html(_html);
                    var isMasterVip = userData.isVip && userData.vipSiteList.indexOf(4) >= 0;
                    var isOfficeVip = userData.isVip && userData.vipSiteList.indexOf(0) >= 0;
                    if (!isMasterVip) {
                        $(".personal-header .person-info-left .whole-station-vip").hide();
                    }
                    if (!isOfficeVip) {
                        $(".personal-header .person-info-left .office-vip").hide();
                    }
                    hotList();
                    recommend();
                } else {
                    $.toast({
                        text: res.msg,
                        delay: 3e3
                    });
                }
            }
        });
    }
    function recommend() {
        //推荐位 第四范式
        $.ajax({
            url: api.recommend.recommendConfigInfo,
            type: "post",
            data: JSON.stringify([ "Q_M_FD_hot_home" ]),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function(res) {
                if (res.code == "0") {
                    paradigm4Relevant(res.data);
                } else {
                    $.toast({
                        text: res.msg,
                        delay: 3e3
                    });
                }
            }
        });
    }
    function paradigm4Relevant(data) {
        var requestID_rele = Math.random().toString().slice(-10);
        var userID = method.getQueryString("uid").slice(0, 10) || "";
        //来标注用户的ID
        var sceneIDRelevant = data[0].useId;
        $.ajax({
            url: "https://nbrecsys.4paradigm.com/api/v0/recom/recall?requestID=" + requestID_rele + "&sceneID=" + sceneIDRelevant + "&userID=" + userID,
            type: "post",
            data: JSON.stringify({
                page: 0
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function(res) {
                var _html = template.compile(require("./template/userPage/rightList.html"))({
                    rightList: res
                });
                $(".hot-file ul").html(_html);
            }
        });
    }
    function hotList() {
        //热门 推荐    
        $.ajax({
            url: api.user.getSearchList,
            type: "post",
            data: JSON.stringify({
                currentPage: parseInt(currentPage),
                pageSize: 16,
                sortField: sortField,
                //createTime最新
                format: format,
                uid: method.getQueryString("uid")
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function(res) {
                if (res.code == "0") {
                    var arr = [];
                    for (var i = 0; i < res.data.totalPages; i++) {
                        arr.push(i);
                    }
                    res.data.totalPages = arr;
                    var _html = template.compile(require("./template/userPage/userPageList.html"))({
                        list: res.data,
                        currentPage: currentPage,
                        sortField: sortField
                    });
                    $(".personal-container .left").html(_html);
                } else {
                    $.toast({
                        text: res.msg,
                        delay: 3e3
                    });
                }
            }
        });
    }
});