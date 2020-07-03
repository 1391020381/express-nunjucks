define("dist/common/recommendConfigInfo", [], function(require, exports, module) {
    return {
        search: {
            descs: [ //搜索页推荐位
            {
                desc: "搜索页顶部banner",
                pageId: "PC_M_SR_ub",
                list: []
            }, {
                desc: "搜索页右侧banner",
                pageId: "PC_M_SR_rb",
                list: []
            }, {
                desc: "搜索页底部banner",
                pageId: "PC_M_SR_downb",
                list: []
            } ],
            pageIds: [ "PC_M_SR_ub", "PC_M_SR_rb", "PC_M_SR_downb" ]
        },
        paySuccess: {
            descs: [ {
                desc: "支付成功页面banner",
                pageId: "PC_M_PAY_SUC_banner",
                list: []
            } ],
            pageIds: [ "PC_M_PAY_SUC_banner" ]
        },
        downSuccess: {
            descs: [ {
                desc: "下载成功页面banner",
                pageId: "PC_M_DOWN_SUC_banner",
                list: []
            } ],
            pageIds: [ "PC_M_DOWN_SUC_banner" ]
        },
        vipPrivilegeList: {
            descs: [ {
                desc: "个人中心我的vip,vip权益列表",
                pageId: "PC_M_USER_vip",
                list: []
            } ],
            pageIds: [ "PC_M_USER_vip" ]
        },
        personalCenterHome: {
            descs: [ {
                desc: "个人中心首页,bannber",
                pageId: "PC_M_USER_banner",
                list: []
            } ],
            pageIds: [ "PC_M_USER_banner" ]
        },
        myVipRightsList: {
            descs: [ {
                desc: "个人中心我的vip,bannber",
                pageId: "PC_M_USER_VIP_banner",
                list: []
            } ],
            pageIds: [ "PC_M_USER_VIP_banner" ]
        },
        myVipRightsList: {
            descs: [ {
                desc: "个人中心首页/我的VIP页的VIP权益缩略图",
                pageId: "PC_M_USER_vip",
                list: []
            } ],
            pageIds: [ "PC_M_USER_vip" ]
        }
    };
});