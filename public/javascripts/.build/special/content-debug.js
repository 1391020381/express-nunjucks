define("dist/special/content-debug", [ "swiper-debug", "../application/method-debug", "../application/api-debug", "../application/urlConfig-debug", "../common/template/swiper_tmp-debug.html", "../common/recommendConfigInfo-debug" ], function(require, exports, module) {
    require("swiper-debug");
    var method = require("../application/method-debug");
    var api = require("../application/api-debug");
    var topBnnerTemplate = require("../common/template/swiper_tmp-debug.html");
    var recommendConfigInfo = require("../common/recommendConfigInfo-debug");
    toggleMore();
    // toggleTag();
    // searchTab();
    console.log(window.pageConfig);
    $(".btn-fresh").on("click", function() {
        window.location.reload();
    });
    // 更多筛选  切换函数
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
                    // 之前是否有选中tag
                    originArr.map(function(res, index) {
                        subArr.push({
                            propertyGroupId: res.split("_")[0],
                            propertyId: res.split("_")[1]
                        });
                    });
                    subArr = subArr.filter(function(res, index) {
                        // 过滤相同分类的tag
                        return currentTag.propertyGroupId != res.propertyGroupId;
                    });
                    subArr.push(currentTag);
                } else {
                    subArr.push(currentTag);
                }
            }
            // console.log(subArr,'subArr')
            // 重新拼装url
            var url = "", s = "";
            subArr.map(function(res, index) {
                url += res.propertyGroupId + "_" + res.propertyId + "-";
            });
            url = url.substring(0, url.length - 1);
            location.href = "/node/s/" + idsArr[0] + "-" + idsArr[1] + "-" + url + ".html";
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
    gebyPosition();
    function gebyPosition() {
        $.ajax({
            url: api.recommend.recommendConfigInfo,
            type: "POST",
            data: JSON.stringify(recommendConfigInfo.specialRightBanner.pageIds),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function(res) {
                if (res.code == "0") {
                    res.data.forEach(function(item) {
                        // 匹配 组装数据
                        recommendConfigInfo.specialRightBanner.descs.forEach(function(desc) {
                            if (item.pageId == desc.pageId) {
                                desc.list = method.handleRecommendData(item.list);
                            }
                        });
                    });
                    console.log(recommendConfigInfo);
                    recommendConfigInfo.specialRightBanner.descs.forEach(function(item) {
                        if (item.list.length) {
                            if (item.pageId == "ishare_ztbanner") {
                                var _topBannerHtml = template.compile(topBnnerTemplate)({
                                    topBanner: item.list,
                                    className: "swiper-right-container"
                                });
                                $(".right-banner").html(_topBannerHtml);
                                new Swiper(".swiper-right-container", {
                                    direction: "horizontal",
                                    loop: item.list.length > 1 ? true : false,
                                    autoplay: 3e3
                                });
                            }
                        }
                    });
                }
            }
        });
    }
    // 顶部专题标题收藏逻辑
    $(".search-adv-warper .special-collect").on("mouseover", function() {
        $(".new-header-inter .logo-drag-tips").css("display", "block");
    });
    $(".search-adv-warper .special-collect").on("mouseout", function() {
        $(".new-header-inter .logo-drag-tips").removeAttr("style");
    });
});