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
        },
        paySuccess:{
            descs:[
                {
                    desc:'支付成功页面banner',
                    pageId:'PC_M_SR_ub',
                    list:[] 
                }
            ],
            pageIds:['PC_M_SR_ub'] 
        },
        downSuccess:{
            descs:[
                {
                    desc:'下载成功页面banner',
                    pageId:'PC_M_DOWN_SUC_banner',
                    list:[] 
                }
            ],
            pageIds:['PC_M_DOWN_SUC_banner'] 
        }
    }
});