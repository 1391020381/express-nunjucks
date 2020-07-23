define(function (require, exports, module) {
    require("../cmd-lib/lazyload");
    require("../cmd-lib/myDialog");
    require("../cmd-lib/loading");
    // require("../detail/report");
    require("../detail/index");
    require("../detail/search");
    require("../detail/download");
    require("../detail/paging");
    require('../detail/expand');
    
    // require("../common/baidu-statistics");
    require("../detail/buyUnlogin");
    require("../common/bilog");
    require('../detail/paradigm4');
    require('../detail/banner.js')
    require('../common/baidu-statistics.js').initBaiduStatistics('17cdd3f409f282dc0eeb3785fcf78a66')
    require('../common/baidu-statistics.js').initBaiduStatistics('adb0f091db00ed439bf000f2c5cbaee7')
}
);