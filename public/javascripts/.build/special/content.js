define("dist/special/content", [ "../application/method" ], function(require, exports, module) {
    var method = require("../application/method");
    toggleMore();
    toggleTag();
    searchTab();
    console.log(window.pageConfig);
    $(".btn-fresh").on("click", function() {
        window.location.reload();
    });
    $(".search-list-info a").hover(function() {
        var text = $(this).parent().siblings(".search-img-box").find(".title-hover");
        $(this).addClass("active");
        text.removeClass("hide");
        text.addClass("active");
    }, function() {
        var text = $(this).parent().siblings(".search-img-box").find(".title-hover");
        $(this).removeClass("active");
        text.removeClass("active");
        text.addClass("hide");
    });
    //更多筛选  切换函数
    function toggleMore() {
        var searchScreen = $(".search-screen");
        var searchItem = $(".search-item");
        searchScreen.on("click", function() {
            if (searchScreen.children().eq(0).text() === "更多筛选") {
                searchScreen.children().eq(0).text("收起筛选");
                searchItem.removeClass("hide");
                method.setCookieWithExpPath("isOpen", 1);
            } else {
                searchScreen.children().eq(0).text("更多筛选");
                searchItem.eq(2).addClass("hide");
                searchItem.eq(3).addClass("hide");
                method.setCookieWithExpPath("isOpen", 0);
            }
            searchScreen.children().eq(1).toggleClass("screen-less");
        });
    }
    function toggleTag() {
        $(document).on("click", ".search-ele", function() {
            var ids = $(this).attr("data-ids");
            var idsArr = ids.split("-"), subArr = [];
            if (idsArr.length > 1) {
                var currentTag = {
                    propertyGroupId: idsArr[2] && idsArr[2].split("_")[0],
                    propertyId: idsArr[2] && idsArr[2].split("_")[1]
                };
                var originArr = pageConfig.urlParams.topicPropertyQueryDTOList ? JSON.parse(pageConfig.urlParams.topicPropertyQueryDTOList) : [];
                if (originArr.length > 0) {
                    //之前是否有选中tag
                    originArr.map(function(res, index) {
                        subArr.push({
                            propertyGroupId: res.split("_")[0],
                            propertyId: res.split("_")[1]
                        });
                    });
                    subArr = subArr.filter(function(res, index) {
                        //过滤相同分类的tag
                        return currentTag.propertyGroupId != res.propertyGroupId;
                    });
                    subArr.push(currentTag);
                } else {
                    subArr.push(currentTag);
                }
            }
            //console.log(subArr,'subArr')
            //重新拼装url
            var url = "", s = "";
            subArr.map(function(res, index) {
                url += res.propertyGroupId + "_" + res.propertyId + "-";
            });
            url = url.substring(0, url.length - 1);
            location.href = "/node/s/" + idsArr[0] + "-" + idsArr[1] + "-" + url + ".html";
        });
        $(document).on("click", ".js-tab-page", function() {
            //直接替换页数
            var currentPage = $(".office-page-paging .active").attr("value");
            var nextpage = $(this).attr("value");
            var url = window.location.pathname;
            var i = url.indexOf("_");
            if (i > -1) {
                url = changeStr(url, i + 1, nextpage, currentPage);
            } else {
                //默认情况下
                url = "/node/s/" + pageConfig.urlParams.specialTopicId + "_" + page + "_" + pageConfig.urlParams.sortFlag + ".html";
            }
            location.href = url;
        });
    }
    function changeStr(str, index, changeStr, currentPage) {
        return str.substr(0, index) + changeStr + str.substr(index + currentPage.length);
    }
    function searchTab() {
        $(".search-tab").on("click", function() {
            var url = $(this).attr("data-url");
            var originArr = pageConfig.urlParams.topicPropertyQueryDTOList ? JSON.parse(pageConfig.urlParams.topicPropertyQueryDTOList) : [];
            if (originArr.length > 0) {
                location.href = url + "-" + originArr.join("-") + ".html";
            } else {
                location.href = url + ".html";
            }
        });
    }
    function cloneDeep(obj) {
        var objArray = Array.isArray(obj) ? [] : {};
        if (obj && typeof obj === "object") {
            for (var key in obj) {
                if (obj.hasOwnProperty(key)) {
                    obj[key] && typeof obj[key] === "object" ? objArray[key] = cloneDeep(obj[key]) : objArray[key] = obj[key];
                }
            }
        }
        return objArray;
    }
    function getUrl(data) {
        var str = "";
        for (var key in data) {
            if (data.hasOwnProperty(key)) {
                data[key] || data[key] === 0 ? str += "&" + key + "=" + encodeURIComponent(data[key]) : "";
            }
        }
        return "?" + str.substring(1);
    }
});