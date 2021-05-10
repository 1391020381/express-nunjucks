define(function (require, exports, module) {
    var api = require('../../application/api');
    var method = require('../../application/method');
    var evaluateLayerLabelTpl = require('./evaluate-label.html');

    return {
        // 弹窗id
        layerIndex: null,
        // 资料信息
        fileInfo: {},
        // 评价数据
        evaluateInfo: null,
        // 评价成功回调
        successCallback: null,
        // 标签集合
        labelList: [],
        // 评分-选中星号
        score: 0,

        /**
         * 初始化
         * @param fileInfo {{fid,title,format}} 资料信息
         * @param evaluateInfo                  评价数据
         * @param layerIndex                    弹窗id
         * @param callback                      评价成功回调
         */
        init: function (fileInfo, evaluateInfo, layerIndex, callback) {
            var that = this;
            that.fileInfo = fileInfo || {};
            that.layerIndex = layerIndex;
            that.successCallback = callback;
            // todo 存在默认评价数据，显示默认的评价信息，可重新编辑，如后续有此需求可放开
            // that.initSetValue(evaluateInfo);

            // dom加载完毕
            $('.jsEvaluatePopup').ready(function () {
                that.bindEvent();
            });
        },
        // 事件绑定
        bindEvent: function () {
            var that = this;
            var $btn = $('.jsEvaluateBtn');
            var $starEvaluate = $('.jsEvaluateStar');
            var $star = $starEvaluate.find('.star');
            var starLen = $star.length;
            var $labelEvaluate = $('.jsEvaluateLabel');

            // 关闭弹窗
            $('.jsEvaluateCloseBtn').on('click', function (e) {
                e.stopPropagation();
                that.close();
            });

            // 星号
            $starEvaluate.on('mouseover', function (e) {
                e.stopPropagation();
                var $target = $(e.target);
                if ($target.hasClass('star')) {
                    // 评分
                    var score = $target.data('score');
                    // 星号勾选
                    that.selectToStar(score, starLen, $star);
                }
            }).on('mouseout', function (e) {
                e.stopPropagation();
                // 星号勾选
                that.selectToStar(that.score, starLen, $star);
            }).on('click', function (e) {
                e.stopPropagation();
                var $target = $(e.target);
                if ($target.hasClass('star')) {
                    // 移除按钮禁止状态
                    $btn.removeClass('btn-disabled');
                    // 评分
                    var score = $target.data('score');
                    // 保存评分
                    that.score = score;
                    // 星号勾选
                    that.selectToStar(score, starLen, $star);
                    // 查询标签
                    that.getLabelList(score, function (labelList) {
                        that.labelList = labelList;
                        // 拿到数据进行渲染
                        var tpl = template.compile(evaluateLayerLabelTpl)({
                            labelList: labelList
                        });
                        $labelEvaluate.html(tpl);
                        // 更新位置
                        that.setLayerPosition();
                    });
                }
            });

            // 选择标签
            $labelEvaluate.on('click', function (e) {
                e.stopPropagation();
                var $target = $(e.target);
                if ($target.hasClass('label-item')) {
                    if ($target.hasClass('active')) {
                        $target.removeClass('active');
                    } else {
                        $target.addClass('active');
                    }
                }
            });

            // 提交
            $btn.on('click', function (e) {
                e.stopPropagation();
                that.submit();
            });
        },
        // 初始化设置数据
        initSetValue: function (evaluateInfo) {
            if (!evaluateInfo) {return;}
            var that = this;
            var $btn = $('.jsEvaluateBtn');
            var $labelEvaluate = $('.jsEvaluateLabel');
            var $star = $('.jsEvaluateStar').find('.star');
            var labels = evaluateInfo.labels || [];
            that.score = evaluateInfo.score || 0;

            // 星号勾选
            that.selectToStar(that.score, $star.length, $star);
            $('.jsEvaluateDesc').val(evaluateInfo.content);
            // 移除按钮禁止状态
            $btn.removeClass('btn-disabled');
            // 查询标签
            that.getLabelList(that.score, function (labelList) {
                that.labelList = labelList;
                // 拿到数据进行渲染
                var tpl = template.compile(evaluateLayerLabelTpl)({
                    labelList: labelList
                });
                $labelEvaluate.html(tpl);
                var $label = $('.jsEvaluateLabel').find('.label-item');

                $label.each(function (index, element) {
                    for (var i = 0, len = labels.length; i < len; i++) {
                        var item = labels[i];
                        if (item.id === labelList[index].id) {
                            $(element).addClass('active');
                        }
                    }
                });
                // 更新位置
                that.setLayerPosition();
            });
        },
        /**
         * 获取资料评价标签
         * @params score {number} 评分
         * callback {function} 回调函数
         */
        getLabelList: function (score, callback) {
            var that = this;
            var fid = that.fileInfo.fid;
            if (!fid || score <= 0) {
                callback([]);
                return;
            }
            // 用户评价1星，显示差评标签；
            // 用户评价2-3星，显示中评标签；
            // 用户评价4-5星，显示好评标签
            var evalAttitude = 0;
            if (score <= 1) {
                evalAttitude = 2;
            } else if (score <= 3) {
                evalAttitude = 1;
            } else if (score <= 5) {
                evalAttitude = 0;
            }
            method.customGet(api.comment.getStarLevelList, {
                // 评价态度：0-好评、1-中立、2-差评
                evalAttitude: evalAttitude,
                // 资料id
                fid: fid,
                pageSize: 12
            }, function (res) {
                var labelList = [];
                if (res.code === '0') {
                    labelList = res.data;
                }
                callback(labelList);
            }, function () {
                callback([]);
            });
        },
        /**
         * 星号勾选
         * @param score     星号分数
         * @param starLen   星号总个数
         * @param $star     星号dom
         */
        selectToStar: function (score, starLen, $star) {
            for (var i = 0; i < starLen; i++) {
                if (i < score) {
                    $($star[i]).addClass('active');
                } else {
                    $($star[i]).removeClass('active');
                }
            }
        },
        // 提交评论
        submit: function () {
            var that = this;
            if (that.score <= 0) {return;}
            var fid = that.fileInfo.fid;
            // 勾选标签
            var labels = [];
            var $label = $('.jsEvaluateLabel').find('.label-item');
            $label.each(function (index, element) {
                if ($(element).hasClass('active')) {
                    labels.push(that.labelList[index]);
                }
            });
            method.customPost(api.comment.addComment, {
                fid: fid,
                labels: labels,
                site: 0,
                terminal: 0,
                score: that.score,
                content: $('.jsEvaluateDesc').val()
            }, function (res) {
                if (res.code === '0') {
                    that.layerMsg('提交成功');
                    // 成功回调
                    if (typeof that.successCallback === 'function') {
                        that.successCallback();
                    }
                    that.close();
                } else {
                    that.layerMsg(res && res.message ? res.message : '提交失败');
                    that.close();
                }
            }, function () {
                that.layerMsg('提交失败');
                that.close();
            });
        },
        // 关闭弹窗
        close: function () {
            if (this.layerIndex) {
                layer.close(this.layerIndex);
                this.layerIndex = null;
            }
        },
        // 重新设置layer位置
        setLayerPosition: function () {
            var that = this;
            setTimeout(function () {
                // 重新设置layer
                layer.style(that.layerIndex, {
                    height: $('.jsEvaluatePopup').height()
                });
                $(window).resize();
            }, 100);
        },
        // 提示
        layerMsg: function (message) {
            layer.msg(message, {offset: ['200px']});
        }
    };
});
