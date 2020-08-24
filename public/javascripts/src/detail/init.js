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
    var productType = window.pageConfig.params&&window.pageConfig.params.productType
    if(productType == '4'){
        require('../common/baidu-statistics.js').initBaiduStatistics('504d2c29e8aefe02ad5d66207e4de083')
    }
    if(productType == '5'){
        require('../common/baidu-statistics.js').initBaiduStatistics('c0fb058099c13a527871d024b1d809f8') 
    }
}
);