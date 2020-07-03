define("dist/personalCenter/home", [ "../application/method", "../application/api", "./template/homeRecentlySee.html", "./effect", "../application/checkLogin", "../application/app", "../application/element", "../application/template", "../application/extend", "../common/bilog", "base64", "../cmd-lib/util", "../report/config", "../report/init", "../report/handler", "../report/columns", "../application/helper", "//static3.iask.cn/resource/js/plugins/pc.iask.login.min" ], function(require, exports, module) {
    var method = require("../application/method");
    var api = require("../application/api");
    var homeRecentlySee = require("./template/homeRecentlySee.html");
    var type = window.pageConfig && window.pageConfig.page.type;
    var isLogin = require("./effect").isLogin;
    if (type == "home") {
        isLogin(initData);
    }
    function initData() {
        getUserCentreInfo();
        getFileBrowsePage();
        getDownloadRecordList();
    }
    function getUserCentreInfo(callback) {
        $.ajax({
            url: api.user.getUserCentreInfo + "?scope=4",
            type: "GET",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function(res) {
                if (res.code == "0") {
                    console.log("getUserCentreInfo:", res);
                    // compilerTemplate(res.data)
                    $(".personal-center-menu .personal-profile .personal-img").attr("src", res.data.photoPicURL);
                    $(".personal-center-menu .personal-profile .personal-nickname .nickname").text(res.data.nickName);
                    $(".personal-center-menu .personal-profile .personal-id .id").text(res.data.id ? "用户ID:" + res.data.id : "用户ID:");
                    var isVipMaster = res.data.isVipMaster;
                    var volume = res.data.volume;
                    // 下载券数量
                    var aibeans = res.data.aibeans;
                    if (!isVipMaster) {
                        $(".personal-center-menu .personal-profile .personal-nickname .level-icon").hide();
                    }
                    if (volume) {
                        $(".personal-center-home .volume").text(volume ? volume : 0);
                    }
                    if (aibeans) {
                        $(".personal-center-home .aibeans").text(aibeans ? aibeans : 0);
                    }
                    callback && callback(res.data);
                } else {
                    $.toast({
                        text: res.msg || "查询用户信息失败",
                        delay: 3e3
                    });
                }
            },
            error: function(error) {
                console.log("getUserCentreInfo:", error);
            }
        });
    }
    function getFileBrowsePage() {
        //分页获取用户的历史浏览记录
        $.ajax({
            url: api.user.getFileBrowsePage,
            type: "POST",
            data: JSON.stringify({
                currentPage: 1,
                pageSize: 20
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function(res) {
                if (res.code == "0") {
                    console.log("getFileBrowsePage:", res);
                    // data.rows
                    var data = [ {
                        id: 1,
                        fileid: "EN6sFTSAvh",
                        format: "doc",
                        totalPage: 50,
                        name: "关于口腔健康的十大常识您 大常识您康小学问"
                    }, {
                        id: 1,
                        fileid: "EN6sFTSAvh",
                        format: "pdf",
                        totalPage: 55,
                        name: "关于口腔健康的十大常识您 大常识您康小学问"
                    }, {
                        id: 1,
                        fileid: "EN6sFTSAvh",
                        format: "doc",
                        totalPage: 56,
                        name: "关于口腔健康的十大常识您 大常识您康小学问"
                    } ];
                    var _homeRecentlySeeTemplate = template.compile(homeRecentlySee)({
                        flag: "recentlySee",
                        data: data
                    });
                    $(".recently-see").html(_homeRecentlySeeTemplate);
                } else {
                    $.toast({
                        text: res.msg,
                        delay: 3e3
                    });
                }
            },
            error: function(error) {
                console.log("getFileBrowsePage:", error);
            }
        });
    }
    function getDownloadRecordList() {
        //用户下载记录接口
        $.ajax({
            url: api.user.getDownloadRecordList,
            type: "POST",
            data: JSON.stringify({
                currentPage: 1,
                pageSize: 20
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function(res) {
                if (res.code == "0") {
                    console.log("getFileBrowsePage:", res);
                    // 复用模板,需要转换接口返回的key
                    var data = [];
                    if (res.data && res.data.rows.length) {
                        res.data.rows.forEach(function(item) {
                            data.push({
                                id: 1,
                                fileid: item.fid,
                                format: item.format,
                                totalPage: "",
                                name: item.title
                            });
                        });
                    }
                    var data = [ {
                        id: 1,
                        fileid: "EN6sFTSAvh",
                        format: "doc",
                        totalPage: 50,
                        name: "关于口腔健康的十大常识您 大常识您康小学问"
                    }, {
                        id: 1,
                        fileid: "EN6sFTSAvh",
                        format: "pdf",
                        totalPage: 55,
                        name: "关于口腔健康的十大常识您 大常识您康小学问"
                    }, {
                        id: 1,
                        fileid: "EN6sFTSAvh",
                        format: "doc",
                        totalPage: 56,
                        name: "关于口腔健康的十大常识您 大常识您康小学问"
                    } ];
                    var _homeRecentlySeeTemplate = template.compile(homeRecentlySee)({
                        flag: "recentlydownloads",
                        data: data
                    });
                    $(".recently-downloads").html(_homeRecentlySeeTemplate);
                } else {
                    $.toast({
                        text: res.msg,
                        delay: 3e3
                    });
                }
            },
            error: function(error) {
                console.log("getFileBrowsePage:", error);
            }
        });
    }
    return {
        getUserCentreInfo: getUserCentreInfo
    };
});