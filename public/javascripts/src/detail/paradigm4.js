/**
 * 第四范式操作数据上报
 */
define(function (require, exports, module) {
    
    var paradigm4Report = require('../common/paradigm4-report')
        setTimeout(function () {
           // action();
        })
    

    // 行为上报方法
    function action() {
       
        var paradigm4 = window.paradigm4 || {};
       
        var paradigm4Relevant = paradigm4.paradigm4Relevant.data || []; // 第四范式相关推荐
        var relevantRecommendInfoData = paradigm4.relevantRecommendInfoData.data[0] || {}
       
        
        var paradigm4Data = window.paradigm4Data || {}

        paradigm4Report.pageView(paradigm4Relevant,relevantRecommendInfoData)

        //猜你喜欢点击
        $(document).on('click','.guess-you-like .item',function(){
            var itemId = $(this).data('id') || '';
            paradigm4Report.eventReport(itemId,paradigm4Data.paradigm4Guess,paradigm4Data.recommendConfig)
        })
        

        //相关推荐点击
        $(document).on('click','.related-data-list li',function(){
            var itemId = $(this).data('id') || '';
            paradigm4Report.eventReport(itemId,paradigm4Relevant,relevantRecommendInfoData)
        })
        
    }
});