/*
 * @Description: 后端交互性API
 * @Author: Jersey
 */
console.log(process.env.NODE_ENV, 'process.env.NODE_ENV');
// dev 本地开发环境 test 测试 、预发环境 prod  生产环境  
module.exports = {
    file: {
        // 文件详情 (正文)
        // fileDetail: '/file/$id',
        fileDetail: '/content/getFileDetail',
        // 文档详情扩展的信息（统计）
        fileExternal: '/fileSync/statistics/$fid',
        // 面包屑 -导航
        fileCrumb: '/file/getCategory?isGetClassType=$isGetClassType&spcClassId=$spcClassId&classId=$classId',
        // 相关资料 (右侧)
        fileList: '/file/getRelateFiles?fid=$fid&limit=$limit',
        // 评论列表
        commentList: '/file/getComments?fid=$fid',
        // 限制预读页数
        preReadPageLimit: '/fileSync/prePageInfo?fid=$fid&validateIE9=$validateIE9',
        relateFile: '/file/queryOwnerDownloadList?ownerId=$ownerId&fid=$fid',
        getAdv: '/file/getAdv?fid=$fid&advertBatchId=$advertBatchId&taskId=$taskId',
        getUserFileZcState:'/comment/zc/getUserFileZcState'
    },
    pay: {
        getVip: '/order/vipPackage',                //获取vip套餐列表(old)
        getVipList:'/rights/vip/getVipPacks',          //获取VIP套餐列表(new)
        getPrivilege: '/order/privilegePackage',    //获取下载特权列表
        order: '/order/create',                     //下单
        orderUnlogin: '/order/nolandcreate',        //免登陆下单
        qr: '/order/check/$orderNo',                //生成二维码
        handle: '/pay/handleQr',                    //处理二维码
        status: '/order/status/$orderNo',           //订单状态
        orderStatusUlogin: '/order/nolandstatus', //订单状态
        webAlipay: '/pay/createAliQr',              //网页支付宝支付
        sms: '/usermanage/getSmsYzCode',            //发送验证码
        bind: '/usermanage/bindMobile',              //绑定手机号
        bindUnlogin: '/order/bindUser',               //免登陆绑定手机号
        visitorDownload: '/visitor/download',   //免登下载
        orderPoint: '/order/point/$orderNo',         //订单埋点
    },
    office: {
        //办公频道 搜索
        search: {
            // 查询全部分类
            category: '/channel/categorys',
            // 导航分类及属性
            categoryTitle: '/channel/getCategoryCid',
            // 首页列表查询
            contents: '/office/index',
            // 联想词
            linkWords: '/office/getHotSearchList?cond=$cond',
            //搜索导航
            navCategorys: '/channel/navCategorys'
        }
    },
    search: {
        //搜索服务--API接口--条件搜索--同步
        byCondition: '/search/byCondition',
        //搜索服务--API接口--搜索页搜索关联词数据--同步
        associatedWords: '/search/associatedWords'
    },
    userInfo: '/gateway/webapi/usermanage/checkLogin',      //获取用户信息
    queryOrderPc: '/order/bindOrderByOrderNo',
    recommendInfo: '/recommend/info', // 动态获取第四范式场景id 物料库id
    special:{
        findSpecialTopic:'/special/specialTopic/findSpecialTopic/$id',  //查询专题信息接口
        listTopicContents:'/special/specialTopicContent/listTopicContents',  //分页查询接口
        specialTopic:'/search/specialTopic/lisPage'   // 专题热点查询
    },
    tdk:{
        getTdkByUrl:'/gateway/content/tdkmanage/findByUrl?url=$url',
    }
};


