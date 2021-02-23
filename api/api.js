/*
 * @Description: 后端交互性API
 * @Author: Jersey
 */
console.log(process.env.NODE_ENV, 'process.env.NODE_ENV');
// dev 本地开发环境 test 测试 、预发环境 prod  生产环境  
module.exports = {
    file: {
        
        fileDetail: '/content/getFileDetail',
        getFileDetailNoTdk: '/content/getFileDetailNoTdk',
        // 面包屑 -导航
        fileCrumb: '/file/getCategory?isGetClassType=$isGetClassType&spcClassId=$spcClassId&classId=$classId',
        navCategory:'/content/category/navCategory',
        // 评论列表
        commentList: '/file/getComments?fid=$fid',
        // 限制预读页数
        preReadPageLimit: '/content/file/getPrePageInfo',
        relateFile: '/file/queryOwnerDownloadList?ownerId=$ownerId&fid=$fid',
        getAdv: '/file/getAdv?fid=$fid&advertBatchId=$advertBatchId&taskId=$taskId',
        getUserFileZcState:'/comment/zc/getUserFileZcState',
        // 是否重定向
        redirectUrl:'/seo/link/getLinkByUrl'
    },
    coupon:{
        rightsSaleVouchers:   "/rights/sale/vouchers",
        rightsSaleQueryPersonal:'/rights/sale/queryPersonal',
        querySeniority:  '/rights/sale/querySeniority',
        getRightsVipMemberDetail:'/rights/vip/memberDetail',
        getVipAllMemberDetail:'/rights/vip/allMemberDetail'
    },
    pay: {
        getVipList:'/rights/vip/getVipPacks',          //获取VIP套餐列表(new)
       
        getPrivilege: '/rights/vip/getPrivilegePacks',    //获取下载特权列表
        order: '/order/create',                     //下单
        orderUnlogin: '/order/create/orderInfo',        //免登陆下单
        qr: '/order/check/$orderNo',                //生成二维码
        handle: '/pay/handleQr',                    //处理二维码
        status: '/order/get/orderInfo',           //订单状态
        orderStatusUlogin: '/order/get/orderStatus', //订单状态
        webAlipay: '/pay/createAliQr',              //网页支付宝支付
        bindUnlogin: '/order/bindUser',               //免登陆绑定手机号
        visitorDownload: '/visitor/download',   //免登下载
        downloadVisitor: '/content/download/visitorDow', // 免登下载
        orderPoint: '/order/point/$orderNo',         //订单埋点
    },
    search: {
        //搜索服务--API接口--条件搜索--同步
        byCondition: '/search/content/byCondition',
        //搜索服务--API接口--搜索页搜索关联词数据--同步
        associatedWords: '/search/specialTopic/lisPage'
    },
    user:{
       userWxAuthState:'/cas/user/wxAuthState',
       getUserInfo:'/user/getUserInfo',
       getUserCentreInfo:'/user/getUserCentreInfo',
       getOtherUser: '/user/getOthersCentreInfo',//他人信息主页
    },
    userInfo: '/gateway/webapi/usermanage/checkLogin',      //获取用户信息
    recommendInfo: '/recommend/info', // 动态获取第四范式场景id 物料库id
    recommendConfigRuleInfo:'/recommend/config/ruleInfo',
    recommendConfigInfo:'/recommend/config/info',
    special:{
        findSpecialTopic:'/special/specialTopic/findSpecialTopic/$id',  //查询专题信息接口
        listTopicContents:'/special/specialTopicContent/listTopicContents',  //分页查询接口
        specialTopic:'/search/specialTopic/lisPage'   // 专题热点查询
    },
    tdk:{
        // 【A20接入新的tdk规则】
        getTdkByUrl:'/seo/tdk/getTdkDetail',
        // getTdkByUrl:'/seo/tdkmanage/findByUrl?url=$url',
    },
    category:{//分类页
        list:'/search/content/byCondition', //查询列表
        words:'/search/specialTopic/lisPage', //热点搜索
        recommendList:'/recommend/config/info', //推荐位
        navForCpage:'/market/nodeManage/getLevelNodeByNodeCode', //分类导航
    },
    map:{//地图
        list:'/search/content/setmap',
        topic:'/search/specialTopic/lisPage'
    },
    spider:{
        details:'/content/getFileDetailNoTdk',
        crumbList:'/content/category/navCategory',
        editorInfo:'/user/getOthersCentreInfo?uid=$uid',
        fileDetailTxt:'/content/file/getFileBody',
        hotpotSearch:'/search/content/getSimilar',
        hotTopicSearch:'/search/specialTopic/lisPage',
        newRecData:'/search/content/randomRecommend',
        hotRecData:'/seo/exposeContent/contentInfo/listContentInfos',
        
    },
    index:{
        recommendList:'/recommend/config/info', //推荐位
        navList:'/market/nodeManage/getChildNodeBySiteAndTemrinal',
        randomRecommend:'/search/content/randomRecommend',
        // listContentInfos:'/seo/exposeContent/contentInfo/listContentInfos'
        listContentInfos:'/seo/exposeContent/contentInfo/listContents'
    },
    order:{
      getOrderInfo: "/gateway/order/get/orderInfo"
    },
    auth:{
        user:'/user/certification/getPersonal',
        org:'/user/certification/getInstitutions'
    },
    comment:{
        getFileComment:  '/comment/eval/dataList' // 详情评论
     }
};


