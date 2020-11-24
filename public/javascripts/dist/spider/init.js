define("dist/spider/init", [ "./fixedTopBar" ], function(require, exports, module) {
    require("./fixedTopBar");
    var obj = {
        init: function() {
            this.switchRec();
        },
        switchRec: function() {
            $(".recmend-tab").on("click", ".tab-item", function() {
                $(this).addClass("current").siblings().removeClass("current");
                var _index = $(this).index();
                $(".switch_content_wrap").eq(_index).addClass("current").siblings().removeClass("current");
            });
        },
        reloadPage: function(data) {
            location.href = location.origin + location.pathname + "?type=" + data;
        }
    };
    obj.init();
});

define("dist/spider/fixedTopBar", [], function(require, exports, module) {
    //详情页头部悬浮
    var $detailHeader = $(".new-detail-header");
    var headerHeight = $detailHeader.height();
    $(window).scroll(function() {
        var detailTop = $(this).scrollTop();
        if (detailTop - headerHeight >= 0) {
            $detailHeader.addClass("new-detail-header-fix");
        } else {
            $detailHeader.removeClass("new-detail-header-fix");
        }
    });
});
