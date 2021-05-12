define(function (require, exports, module) {
    var api = require('../../application/api');
    var method = require('../../application/method');
    var iaskCoinTableHtml = require('./table.html');

    return {
        // 弹窗id
        layerIndex: null,
        // 页码
        currentPage: 1,

        /**
         * public 外部可调
         * 初始化
         * @param layerIndex 弹窗id
         */
        init: function (layerIndex) {
            var that = this;
            that.layerIndex = layerIndex;

            // 等待dom加载完毕
            $('.jsIaskCoinLayer').ready(function () {
                that.findTableList();
                that.bindEvent();
            });
        },
        /**
         * public 外部可调
         * 弹窗相关数据重置，事件解绑
         */
        destroy: function () {
            // 重置数据
            this.layerIndex = null;
            // 解绑事件
            this.unBindEvent();
        },
        // 绑定事件
        bindEvent: function () {
            var that = this;

            // 关闭弹窗
            $('.jsIaskCoinCloseBtn').on('click', function (e) {
                e.stopPropagation();
                that.closeLayer();
            });

            // 分页-事件代理
            $(document).on('click', '.jsIaskCoinPagination', function (e) {
                e.stopPropagation();
                var $target = $(e.target);
                if ($target.hasClass('page-item')) {
                    // 更新页码
                    that.currentPage = $target.data('pagenum');
                    // 查询数据
                    that.findTableList();
                }
            });
        },
        // 解绑事件
        unBindEvent: function () {
            $('.jsIaskCoinCloseBtn').off('click');
        },
        // 关闭弹窗
        closeLayer: function () {
            var layerIndex = this.layerIndex;
            if (layerIndex) {
                layer.close(layerIndex);
            }
        },

        // 查询爱问币明细
        findTableList: function () {
            var that = this;
            var currentPage = that.currentPage;
            // action	动作名称（业务名称）
            // changeNumber	变动积分数量（增加用正数，减扣用负数）
            // createTime	创建时间
            method.customGet(api.user.getCoinIaskList, {
                currentPage: currentPage,
                pageSize: 20
            }, function (res) {
                if (res && res.code === '0' && res.data && res.data.rows) {
                    that.renderTable({
                        rows: res.data.rows,
                        currentPage: currentPage,
                        totalPages: res.data.totalPages,
                        totalSize: res.data.totalSize
                    });
                }
            });
        },
        // 渲染列表
        renderTable: function (data) {
            var that = this;
            // 处理日期
            var tableHtml = template.compile(iaskCoinTableHtml)({
                currentPage: data.currentPage,
                totalPages: data.totalPages,
                totalSize: data.totalSize,
                dataList: data.rows || [],
                pagingList: that.initPagination(data.currentPage, data.totalPages),
                formatDate: method.formatDateV2
            });
            $('.jsIaskCoinTable').html(tableHtml);
        },
        /**
         * 构造分页器
         * @param current {number} 当前页
         * @param total {number} 总页数
         * @param show 控制[...]前边展示按钮个数
         * @returns pageList {array} 分页器
         * @description 最多构造6个按钮，两个[...]按钮代表中间页
         */
        initPagination: function (current, total, show) {
            current = current || 1;
            total = total || 0;
            show = show || 1;
            var pageList = [];
            var str = String(current);
            for (var j = 1; j <= show; j++) {
                if (current - j > 1) {
                    str = current - j + ',' + str;
                }
                if (current + j < total) {
                    str = str + ',' + (current + j);
                }
            }
            if (current - (show + 1) > 1) {
                str = '...,' + str;
            }
            if (current > 1) {
                str = 1 + ',' + str;
            }
            if (current + show + 1 < total) {
                str = str + ',...';
            }
            if (current < total) {
                str = str + ',' + total;
            }
            var strList = str.split(',');
            for (var i = 0, len = strList.length; i < len; i++) {
                var pageItem = {};
                if (strList[i] === '...') {
                    var curValue = Number(strList[i - 1]) + Number(strList[i + 1]);
                    pageItem = {
                        value: Math.ceil(curValue / 2),
                        label: '...'
                    };
                } else {
                    pageItem = {
                        value: strList[i],
                        label: strList[i]
                    };
                }
                pageList.push(pageItem);
            }
            return pageList;
        }
    };
});
