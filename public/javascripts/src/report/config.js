define(function(require , exports , module){
    return {
        COOKIE_FLAG: '_dplf',                       //cookie存储地址
        COOKIE_CIDE: '_dpcid',                      //客户端id cookie地址存储
        COOKIE_CUK : 'cuk',
        COOKIE_TIMEOUT: 1000*60*50,                 //过期时间
        SERVER_URL: '/dataReport',                  //接口地址
        UACTION_URL: '/uAction',                     //用户阅读文档数据上传url
        EVENT_NAME:'pc_click',                      //绑定事件名称
        CONTENT_NAME :'pcTrackContent',             //上报事件内容名称
        BILOG_CONTENT_NAME: 'bilogContent',         //bilog上报事件内容名称
        ishareTrackEvent:'_ishareTrackEvent',       //兼容旧事件
        eventCookieFlag : '_eventCookieFlag',
        EVENT_REPORT:false,                         //浏览页事件级上报是否开启
        // 以下为配置项
        AUTO_PV: false,                             //进入页面或者刷新时自动调用pageView开关
    }
})