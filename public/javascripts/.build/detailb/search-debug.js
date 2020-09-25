define("dist/detailb/search-debug", [ "./template/history_tmp-debug.html", "./template/hot_search_tmp-debug.html" ], function(require, exports, module) {
    var history_tmp = require("./template/history_tmp-debug.html");
    var hot_search_tmp = require("./template/hot_search_tmp-debug.html");
    var historyArr = JSON.parse(localStorage.getItem("lhistory"));
    var hotSearchData = JSON.parse(sessionStorage.getItem("hotSearch"));
    if (historyArr) {
        var _html = template.compile(history_tmp)({
            data: historyArr
        });
        $(".search-history-list").html(_html);
    }
    $("ul.search-history-list li").length > 0 ? $(".delete-history-ele").show() : $(".delete-history-ele").hide();
    //点击出现搜索页
    $(".btn-m-search").on("click", function(e) {
        e.stopPropagation();
        if (sessionStorage.getItem("hotSearch")) {
            buildHotSearchHtml(hotSearchData);
        } else {
            getHotSearch();
        }
        $("#search-bd-con").hide();
        $(".search-dialog").show();
        $("#search-input").focus();
    });
    //输入框
    $(document).on("keyup", "#search-input", function(e) {
        var keycode = e.keyCode;
        if ($(this).val()) {
            $(".btn-input-delete").show();
            $(".btn-cancel").css("color", "#f25125");
            $(".search-main:eq(0):visible").hide();
            $(".search-main:eq(1):hidden").show();
            getBaiduData($(this).val());
        } else {
            $(".search-main:eq(0):hidden").show();
            $(".search-main:eq(1):visible").hide();
            $(".btn-input-delete").hide();
            $(".btn-cancel").css("color", "#444");
        }
        if (keycode == 13) {
            searchFn();
        }
    });
    //搜索点击
    $(document).on("click", ".btn-cancel", function(e) {
        e && e.stopPropagation();
        searchFn();
    });
    //返回
    $(document).on("click", ".js_back", function(e) {
        e && e.stopPropagation();
        $(".search-dialog").hide();
        $("#search-bd-con").show();
        $("#search-input").blur();
    });
    //清空
    $(document).on("click", ".btn-input-delete", function(e) {
        $(this).hide();
        $("#search-input").val("");
    });
    //热门搜索
    $(document).on("click", "#search-hot-box", function(e) {
        var hotData = $(e.target).text();
        mergeFn(hotData);
    });
    //清空历史
    $(document).on("click", ".delete-history-ele", function(e) {
        $(this).hide();
        $(".search-dialog .search-history-list").hide();
        localStorage.removeItem("lhistory");
    });
    //单个清楚历史记录
    $(document).on("click", ".btn-delete", function(e) {
        if ($("ul.search-history-list li").length) {
            var d = $(this).data("html");
            removeTag(d);
            $(this).closest("li").remove();
        }
        $("ul.search-history-list li").length > 0 ? $(".delete-history-ele").show() : $(".delete-history-ele").hide();
    });
    $(".search-dialog .search-list").on("click", "a", function(e) {
        var val = $(this).data("html");
        if (val) {
            mergeFn(val);
        }
    });
    //搜索
    var searchFn = function() {
        var _val = $("#search-input").val();
        _val = _val ? _val.replace(/^\s+|\s+$/gm, "") : "";
        if (!_val) {
            $.toast({
                text: "搜索内容为空"
            });
            return;
        }
        mergeFn(_val);
        gotoUrl(_val);
    };
    //获取热门搜索数据
    var getHotSearch = function() {
        $.ajax(api.getHotSearch, {
            type: "get",
            async: false,
            dataType: "json"
        }).done(function(res) {
            if (res.code == 0) {
                buildHotSearchHtml(res.data);
                sessionStorage.setItem("hotSearch", JSON.stringify(res.data));
            }
        }).fail(function(e) {
            $.toast({
                text: "error",
                delay: 2e3
            });
        });
    };
    //构建热门数据
    var buildHotSearchHtml = function(d) {
        if (d) {
            var _html = template.compile(hot_search_tmp)({
                data: d
            });
            $("#search-hot-box").html(_html);
        }
    };
    //跳转
    var gotoUrl = function(sword) {
        window.location.href = "/search/home.html?ft=all&cond=" + encodeURIComponent(encodeURIComponent(sword));
    };
    //获取百度数据
    var getBaiduData = function(val) {
        $.getScript("//sp0.baidu.com/5a1Fazu8AA54nxGko9WTAnF6hhy/su?wd=" + encodeURIComponent(val) + "&p=3&cb=window.baidu_searchsug&t=" + new Date().getTime());
    };
    /*百度搜索建议回调方法*/
    window.baidu_searchsug = function(data) {
        var sword = $(".search-dialog .s-input").val();
        sword = sword ? sword.replace(/^\s+|\s+$/gm, "") : "";
        if (sword.length > 0) {
            if (data && data.s) {
                var condArr = data.s;
                if (condArr.length > 0) {
                    var max = Math.min(condArr.length, 10);
                    var _html = [];
                    for (var i = 0; i < max; i++) {
                        var searchurl = "/search/home.html?ft=all&cond=" + encodeURIComponent(encodeURIComponent(condArr[i]));
                        _html.push('<li><a href="' + searchurl + '"  data-html="' + condArr[i] + '" >' + condArr[i].replace(new RegExp("(" + sword + ")", "gm"), "<span class='search-font'>$1</span>") + "</a></li>");
                    }
                    $(".search-dialog .search-main .search-list").html(_html.join(""));
                }
            }
        }
    };
    //合并数据
    var mergeFn = function(d) {
        if (historyArr) {
            if ($.inArray(d, historyArr) === -1) {
                historyArr.unshift(d);
            }
        } else {
            historyArr = [ d ];
        }
        localStorage.setItem("lhistory", JSON.stringify(historyArr));
    };
    var removeTag = function(val) {
        var index = $.inArray(val, historyArr);
        if (index > -1) {
            historyArr.splice(index, 1);
        }
        localStorage.setItem("lhistory", JSON.stringify(historyArr));
    };
});