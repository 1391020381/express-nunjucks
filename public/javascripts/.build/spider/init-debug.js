define("dist/spider/init-debug", [ "./fixedTopBar-debug" ], function(require, exports, module) {
    require("./fixedTopBar-debug");
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