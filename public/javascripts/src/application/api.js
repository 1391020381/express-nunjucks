/**
 * 前端交互性API
 **/
define(function (require, exports, module) {
    var urlConfig = require('./urlConfig')
    var router = urlConfig.ajaxUrl + "/gateway/pc";
    var gateway = urlConfig.ajaxUrl + '/gateway'
    module.exports = {
        // 用户相关
        user: {
            // 登录
            loginByPsodOrVerCode:gateway + '/cas/login/authorize', // 通过密码和验证码登录
            getLoginQrcode:gateway + '/cas/login/qrcode', // 生成公众号登录二维码
            loginByWeChat:gateway + '/cas/login/gzhScan', // 公众号扫码登录
            getUserInfo : '/node/api/getUserInfo',  // node聚合的接口获取用户信息
            thirdLoginRedirect: gateway + '/cas/login/redirect', // 根据第三方授权的code,获取 access_token
            loginOut: gateway + '/cas/login/logout',
            // 我的收藏
            newCollect:gateway+'/content/collect/getUserFileList',
            addFeedback:gateway+'/feedback/addFeedback', //新增反馈
            getFeedbackType:gateway + '/feedback/getFeedbackType', //获取反馈问题类型
            sendSms: gateway + '/cas/sms/sendSms', // 发送短信验证码
            queryBindInfo: gateway + '/cas/user/queryBindInfo',  // 查询用户绑定信息
            thirdCodelogin:gateway + '/cas/login/thirdCode',   // /cas/login/thirdCode 第三方授权
            userBindMobile:gateway + '/cas/user/bindMobile',   // 绑定手机号接口
            checkIdentity:gateway + '/cas/sms/checkIdentity', // 身份验证账号
            userBindThird:gateway + '/cas/user/bindThird', // 绑定第三方账号接口
            untyingThird:gateway + '/cas/user/untyingThird', // 解绑第三方
            setUpPassword:gateway + '/cas/user/setUpPassword',  // 设置密码
            getUserCentreInfo:gateway + '/user/getUserCentreInfo',
            editUser:gateway + '/user/editUser', // 编辑用户信息
            getFileBrowsePage: gateway + '/content/fileBrowse/getFileBrowsePage', //分页获取用户的历史浏览记录
            getDownloadRecordList:gateway + '/content/getDownloadRecordList', //用户下载记录接口
            getUserFileList:gateway + '/content/collect/getUserFileList', // 查询个人收藏列表
            getMyUploadPage:gateway + '/content/getMyUploadPage',   // 分页查询我的上传(公开资料，付费资料，私有资料，审核中，未通过)
            getOtherUser:gateway +'/user/getOthersCentreInfo',//他人信息主页 
            getSearchList:gateway+'/search/content/byCondition', //他人信息主页 热门与最新
            getVisitorId: gateway + '/user/getVisitorId'   // 获取游客id
        },
        normalFileDetail: {
            // 文件预下载
            filePreDownLoad: gateway + '/content/getPreFileDownUrl', 
            // 下载获取地址接口
            getFileDownLoadUrl: gateway + '/content/getFileDownUrl',
            // 文件打分
            // 文件预览判断接口
            getPrePageInfo:gateway + '/content/file/getPrePageInfo',
            sendmail: gateway +  '/content/sendmail/findFile',
            getFileDetailNoTdk:gateway + '/content/getFileDetailNoTdk'
        
        },
        officeFileDetail: {},
        search: {
            specialTopic: gateway + '/search/specialTopic/lisPage'   // 专题热点查询
        },
        sms: {
            // 获取短信验证码
            sendCorpusDownloadMail: gateway + '/content/fileSendEmail/sendCorpusDownloadMail'
        },
        pay: {
            // 购买成功后,在页面自动下载文档
            // 绑定订单
            bindUser: gateway + '/order/bind/loginUser',
            scanOrderInfo: gateway + '/order/scan/orderInfo'
        },
        coupon:{
            rightsSaleVouchers:  gateway + "/rights/sale/vouchers",
            rightsSaleQueryPersonal:gateway + '/rights/sale/queryPersonal',
            querySeniority: gateway + '/rights/sale/querySeniority',
            queryUsing:gateway + '/rights/sale/queryUsing',
            getMemberPointRecord:gateway + '/rights/vip/getMemberPointRecord',
            getBuyRecord:gateway + '/rights/vip/getBuyRecord'
        },
        order:{
          
            bindOrderByOrderNo:gateway +'/order/bind/byOrderNo',
            unloginOrderDown:router+'/order/unloginOrderDown',
            createOrderInfo: gateway + '/order/create/orderInfo',
            rightsVipGetUserMember:gateway + "/rights/vip/getUserMember",
            getOrderStatus:gateway + "/order/get/orderStatus",
            queryOrderlistByCondition:gateway  + '/order/query/listByCondition',
            getOrderInfo:gateway + '/order/get/orderInfo'
        },
        getHotSearch:gateway+'/cms/search/content/hotWords',
        special:{
            fileSaveOrupdate:gateway + '/comment/collect/fileSaveOrupdate', // 收藏与取消收藏
            getCollectState:gateway+'/comment/zc/getUserFileZcState',  //获取收藏状态
            setCollect:gateway+'/content/collect/file'  //新的收藏接口
        },
        upload:{
            getCategory:gateway + '/content/category/getSimplenessInfo', // 获取所有分类
            createFolder:gateway + '/content/saveUserFolder', // 获取所有分类
            getFolder:gateway + '/content/getUserFolders', // 获取所有分类
            saveUploadFile:gateway + '/content/webUploadFile',
            batchDeleteUserFile:gateway + '/content/batchDeleteUserFile',//用户批量删除自己文件接口
        },
        recommend:{
            recommendConfigInfo:gateway + '/recommend/config/info',
            recommendConfigRuleInfo:gateway + '/recommend/config/ruleInfo'
        },
        reportBrowse:{
            fileBrowseReportBrowse:gateway + '/content/fileBrowse/reportBrowse',
        },
        mywallet:{
            getAccountBalance: gateway + '/account/balance/getGrossIncome', // 账户余额信息
            withdrawal: gateway + '/account/with/apply', // 申请提现
            getWithdrawalRecord:gateway + '/account/withd/getPersonList', // 查询用户提现记录
            editFinanceAccount: gateway + '/account/finance/edit', // 编辑用户财务信息
            getFinanceAccountInfo:gateway + '/account/finance/getInfo', // 查询用户财务信息
           getPersonalAccountTax:gateway + '/account/tax/getPersonal', // 查询个人提现扣税结算
           getPersonalAccountTax:gateway + '/account/tax/getPersonal', // 查询个人提现扣税结算
           getMyWalletList: gateway + '/settlement/settle/getMyWalletList', // 我的钱包收入
           exportMyWalletDetail:gateway + '/settlement/settle/exportMyWalletDetail'  // 我的钱包明细导出
        },
        authentication:{
            getInstitutions:gateway +  '/user/certification/getInstitutions' ,
            institutions : gateway + '/user/certification/institutions',
            getPersonalCertification:gateway + '/gateway/user/certification/getPersonal',
            personalCertification :gateway + '/gateway/user/certification/personal'
        },
        seo:{
            listContentInfos: gateway + '/seo/exposeContent/contentInfo/listContentInfos' 
        }
    }
});