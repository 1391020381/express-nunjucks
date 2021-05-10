// 顶部栏消息中心相关处理
define(function (require, exports, module) {
    var method = require('../../application/method');

    var messageDropdownHtml = require('./dropdownItem.html');

    // 认证协议弹窗
    var agreementLayerService = require('../../common/agreement-layer/index');
    // 评价弹窗
    var evaluateLayerService = require('../../common/evaluate-layer/index');

    return {
        // 是否关闭
        isShowMessagePopup: false,

        // 初始化
        init: function () {
            var that = this;

            $(function () {
                // that.initMessage();
                that.bindEvent();

                // agreementLayerService.open(function () {
                //     console.log('认证协议弹窗-确认回调');
                // });
            });
        },
        // 绑定事件
        bindEvent: function () {
            var that = this;

            // 点击消息中心图标
            $('.jsMessageOpenPopup').on('click', function (e) {
                e.stopPropagation();
                that.isShowMessagePopup = !that.isShowMessagePopup;

                if (that.isShowMessagePopup) {
                    that.findRewardRecordList(10, true);
                } else {
                    $('.JsMessageDropdown').hide();
                    // 保存关闭状态24小时--再次刷新不会再次默认展示一条
                    method.setCookieWithExpPath('MESSAGE_CENTER_INIT', true, 24 * 60 * 60 * 1000);
                }
            });

            // 关闭消息中心-点击展示下拉
            $('.jsMessageClosePopup').on('click', function (e) {
                e.stopPropagation();

                that.isShowMessagePopup = false;
                $('.JsMessageDropdown').hide();
                // 保存关闭状态24小时--再次刷新不会再次默认展示一条
                method.setCookieWithExpPath('MESSAGE_CENTER_INIT', true, 24 * 60 * 60 * 1000);
            });
        },
        // 初始化获取一条记录
        initMessage: function () {
            var isNoInitShow = method.getCookie('MESSAGE_CENTER_INIT');

            // 如果已经关闭过，进入页面不会展示
            if (!isNoInitShow) {
                this.findRewardRecordList(1, false);
            }
        },

        // 获取发放奖励通知列表
        findRewardRecordList: function (pageSize, showDate) {
            var that = this;
            var dataList = [];
            for (var i = 0; i < pageSize; i++) {
                dataList.push({
                    name: '购买VIP赠送最多十个字符' + i,
                    date: '2020-05-24',
                    content: '+300爱问币'
                });
            }
            if (!showDate && dataList.length <= 0) {
                return;
            }
            var initHtml = that.renderDropdown(dataList, showDate);
            // 添加dom
            $('.jsMessageDropdownList').html(initHtml);
            // 展示下拉
            $('.JsMessageDropdown').show();
        },
        // 渲染消息记录列表
        renderDropdown(dataList, showDate) {
            return template.compile(messageDropdownHtml)({
                dataList: dataList,
                showDate: showDate
            });
        }
    };
});
