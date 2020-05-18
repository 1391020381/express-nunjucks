define(function (require, exports, module) {
    return {
        search:{
            descs:[ //搜索页推荐位
                {   
                    desc:'搜索页顶部banner',
                    pageId:'PC_M_SR_ub',
                    list:[]
                },
                {  
                    desc:'搜索页右侧banner',
                    pageId:'PC_M_SR_rb',
                    list:[]
                },
                {  
                    desc:'搜索页底部banner',
                    pageId:'PC_M_SR_downb',
                    list:[]
                }
            ],
            pageIds:['PC_M_SR_ub','PC_M_SR_rb','PC_M_SR_downb'] ,
        }
    }
});