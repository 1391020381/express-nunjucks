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
        },
        // 查询用户发券资格接口
        sale: {
            querySeniority: router + '/sale/querySeniority',
        },
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
            filePreDownLoad: router + '/action/downloadCheck',
            // 文件下载
            fileDownLoad: router + '/action/downloadUrl',
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
        },
        sms: {
            // 获取短信验证码
            getCaptcha: router + '/usermanage/getSmsYzCode',
        },
        pay: {
            // 购买成功后,在页面自动下载文档
            successBuyDownLoad: router + '/action/downloadNow'
        },
        vouchers:router+'/sale/vouchers',
        order:{
            bindOrderByOrderNo:router+'/order/bindOrderByOrderNo',
            unloginOrderDown:router+'/order/unloginOrderDown'
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
        }
    }
});