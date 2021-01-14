define(function (require, exports, module) {
   require("../common/testBilog")
    require("../cmd-lib/lazyload");
    require("../cmd-lib/myDialog");
    require("../cmd-lib/loading");
   require("./userComments.js")
   require('./guessYouLike.js')
   require('./relevantInformation.js')
   require("./download");
    require("./index");
    require("./search");
  
    require("./paging");
    require('./expand');
    
    require("./buyUnlogin");
    
   
    require('./banner.js')
    require('../common/baidu-statistics.js').initBaiduStatistics('17cdd3f409f282dc0eeb3785fcf78a66')
    require('../common/baidu-statistics.js').initBaiduStatistics('adb0f091db00ed439bf000f2c5cbaee7')
    var productType = window.pageConfig.params&&window.pageConfig.params.productType
    if(productType == '4'){
        require('../common/baidu-statistics.js').initBaiduStatistics('504d2c29e8aefe02ad5d66207e4de083')
    }
    if(productType == '1'){
        require('../common/baidu-statistics.js').initBaiduStatistics('c0fb058099c13a527871d024b1d809f8') 
    }
}
);