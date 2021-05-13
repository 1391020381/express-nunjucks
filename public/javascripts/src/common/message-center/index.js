// 顶部栏消息中心相关处理
define(function (require, exports, module) {
    var api = require('../../application/api');
    var method = require('../../application/method');
    var messageDropdownHtml = require('./dropdownItem.html');

    return {
        // 下拉框展示状态（非初始化下拉框）
        isShowMessagePopup: false,
        // 是否为初始化展示一条的下拉框--任何主动点击展开下拉框操作需重置此状态
        isInitOneMessage: false,
        // 是否为已登录情况下的多次执行
        isMoreInitToLogin: false,

        // 因目前部分页面存在登录后刷新--故在初始化时需执行消息中心初始化
        // 还存在部分页面登录后不刷新页面--故需要在登陆接口中执行消息中心初始化
        // 初始化
        init: function () {
            var that = this;

            $(function () {
                if (method.getCookie('cuk')) {
                    // 已登录情况下再次触发的初始化-不在触发后续流程
                    if (that.isMoreInitToLogin) {
                        return;
                    }
                    that.isMoreInitToLogin = true;
                    $('.jsGlobalMessageCenter').show();
                    that.initMessage();
                    that.bindEvent();
                }
            });
        },
        // 绑定事件
        bindEvent: function () {
            var that = this;

            // 下拉容器
            var $jsMessageDropdown = $('.jsMessageDropdown');

            // 点击消息中心图标-先关闭初始化一条下拉框-再展示消息下拉框
            $('.jsMessageOpenPopup')
                .off('click')
                .on('click', function (e) {
                    e.stopPropagation();
                    // 初次点击消息图标--重置初始化下拉框
                    if (that.isInitOneMessage) {
                        that.isInitOneMessage = false;
                        that.saveInitCloseStatus();
                    }
                    that.isShowMessagePopup = !that.isShowMessagePopup;
                    if (that.isShowMessagePopup) {
                        that.findRewardRecordList(10);
                    } else {
                        $jsMessageDropdown.hide();
                    }
                });

            // 关闭消息中心下拉框--包含初次展示下拉框和多条消息下拉框
            $('.jsMessageClosePopup')
                .off('click')
                .on('click', function (e) {
                    e.stopPropagation();
                    // 如果点击的是初始化展示一条的下拉框中关闭按钮-保存关闭状态
                    if (that.isInitOneMessage) {
                        that.isInitOneMessage = false;
                        that.saveInitCloseStatus();
                    } else {
                        that.isShowMessagePopup = false;
                    }
                    $jsMessageDropdown.hide();
                });

            // 移出消息中心，关闭下拉--初始化展开的下拉，不关闭
            $('.jsGlobalMessageCenter')
                .off('mouseleave')
                .on('mouseleave', function (e) {
                    e.stopPropagation();
                    if (!that.isInitOneMessage) {
                        that.isShowMessagePopup = false;
                        $jsMessageDropdown.hide();
                    }
                });
        },
        // 初始化获取一条记录
        initMessage: function () {
            var initVal = this.getInitCloseStatus();
            // 如果已经关闭过，进入页面不会展示
            if (initVal !== '1') {
                this.isInitOneMessage = true;
                this.findRewardRecordList(1, this.isInitOneMessage);
            }
        },

        /**
         * 获取发放奖励通知列表
         * @param pageSize      获取条数
         * @param isInit        是否初始化获取
         */
        findRewardRecordList: function (pageSize, isInit) {
            var that = this;
            var params = {
                // 查询数量 默认查全部
                limit: pageSize,
                // 站点
                site: 4,
                // 终端
                terminal: 0
            };
            method.customPost(api.task.taskNotifyList, params, function (res) {
                var dataList = [];
                if (res && res.code === '0' && res.data) {
                    dataList = res.data;
                }
                // for (var i = 0; i < pageSize; i++) {
                //     dataList.push({
                //         createTime: new Date().getTime(),
                //         content: '购买VIP赠送最多十个字符<br>购买VIP赠送最多十个字符，+300爱问币'
                //     });
                // }
                that.renderDropdown(dataList, isInit);
            }, function () {
                that.renderDropdown([], isInit);
            });
        },
        // 渲染消息记录列表
        renderDropdown(dataList, isInit) {
            var len = dataList.length;
            // 无数据时-隐藏红点
            // if (len <= 0) {
            //     $('.jsMessageOpenPopup .badge').hide();
            // } else {
            //     $('.jsMessageOpenPopup .badge').show();
            // }
            // 如果是展示初始化下拉框且无数据
            if (isInit && len <= 0) {
                return;
            }
            var dropItemHtml = template.compile(messageDropdownHtml)({
                dataList: dataList,
                showDate: !isInit,
                formatDate: method.formatDateV2
            });
            // 添加dom
            $('.jsMessageDropdownList').html(dropItemHtml);
            // 展示下拉
            $('.jsMessageDropdown').show();
        },
        // 保存关闭状态24小时--再次刷新不会再次默认展示一条
        saveInitCloseStatus: function () {
            method.setCookieWithExpPath('message_center', 1, 24 * 60 * 60 * 1000, '/');
        },
        getInitCloseStatus: function () {
            return method.getCookie('message_center');
        }
    };
});
