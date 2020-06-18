/**
 * 前端交互性API
 **/
define(function (require, exports, module) {
    var router = "/gateway/pc";
    var gateway = '/gateway'
    module.exports = {
        // 用户相关
        user: {
            // 登录
            login: router + '/usermanage/checkLogin',
            // 登出
            loginOut: '',
            // 我的收藏
             collect: router + '/usermanage/collect',
            // 透传老系统web登录信息接口
            getJessionId: router + '/usermanage/getJessionId',
            //优惠券提醒
            getSessionInfo: router + '/usermanage/getSessionInfo',
            addFeedback:gateway+'/feedback/addFeedback', //新增反馈
            getFeedbackType:gateway + '/feedback/getFeedbackType' //获取反馈问题类型
        },
        // 查询用户发券资格接口
        // sale: {
        //     querySeniority: router + '/sale/querySeniority',
        // },
        normalFileDetail: {
            // 添加评论
            addComment: router + '/fileSync/addComment',
            // 举报
            reportContent: router + '/fileSync/addFeedback',
            // 是否已收藏
            isStore: router + '/fileSync/getFileCollect',
            // 取消或者关注
            collect: router + '/fileSync/collect',
            // 文件预下载
            filePreDownLoad: gateway + '/content/getPreFileDownUrl',
            // 文件下载
            fileDownLoad: router + '/action/downloadUrl',  
            // 下载获取地址接口
            getFileDownLoadUrl: gateway + '/content/getFileDownUrl',
            // 文件打分
            appraise: router + '/fileSync/appraise',
            // 文件预览判断接口
            getPrePageInfo: router + '/fileSync/prePageInfo',
            // 文件是否已下载
            hasDownLoad: router + '/fileSync/isDownload'
        },
        officeFileDetail: {},
        search: {
            //搜索服务--API接口--运营位数据--异步
            byPosition: router + '/operating/byPosition',
            specialTopic: gateway + '/search/specialTopic/lisPage'   // 专题热点查询
        },
        sms: {
            // 获取短信验证码
            getCaptcha: router + '/usermanage/getSmsYzCode',
            sendCorpusDownloadMail: gateway + '/content/fileSendEmail/sendCorpusDownloadMail'
        },
        pay: {
            // 购买成功后,在页面自动下载文档
            successBuyDownLoad: router + '/action/downloadNow',
            // 绑定订单
            bindUser: router + '/order/bindUser'
        },
        coupon:{
            rightsSaleVouchers:  gateway + "/rights/sale/vouchers",
            rightsSaleQueryPersonal:gateway + '/rights/sale/queryPersonal',
            querySeniority: gateway + '/rights/sale/querySeniority',
        },
        // vouchers:router+'/sale/vouchers',
        order:{
            bindOrderByOrderNo:router+'/order/bindOrderByOrderNo',
            unloginOrderDown:router+'/order/unloginOrderDown',
            createOrderInfo: gateway + '/order/create/orderInfo',
            rightsVipGetUserMember:gateway + "/rights/vip/getUserMember"
        },
        getHotSearch:router+'/search/getHotSearch',
        special:{
            fileSaveOrupdate:gateway + '/comment/collect/fileSaveOrupdate' // 收藏与取消收藏
        },
        upload:{
            getCategory:gateway + '/content/category/getSimplenessInfo', // 获取所有分类
            createFolder:gateway + '/content/saveUserFolder', // 获取所有分类
            getFolder:gateway + '/content/getUserFolders', // 获取所有分类
            saveUploadFile:gateway + '/content/webUploadFile'
        },
        recommend:{
            recommendConfigInfo:gateway + '/recommend/config/info',
            recommendConfigRuleInfo:gateway + '/recommend/config/ruleInfo'
        }
    }
});