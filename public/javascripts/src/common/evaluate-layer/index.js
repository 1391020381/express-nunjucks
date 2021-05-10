define(function (require, exports, module) {
    var api = require('../../application/api');
    var method = require('../../application/method');
    var loginModel = require('../../application/checkLogin');
    // 业务模板和js
    var evaluateLayerTpl = require('./evaluate.html');
    var evaluateLayerModel = require('./evaluate');

    return {
        // 编辑弹窗id
        currentLayerIndex: null,

        /**
         * 打开评价弹窗
         * @param fileInfo {{fid,title,format}}   资料信息
         * @param isLook                          是否为查看
         * @param callback                        评价成功回调
         */
        open: function (fileInfo, isLook, callback) {
            var that = this;
            if (!fileInfo || !fileInfo.fid) {
                that.layerMsg('资料id不能为空');
                return;
            }
            // 判断是否登录
            if (method.getCookie('cuk')) {
                // 先关闭弹窗
                that.closeLayer();
                if (isLook) {
                    // 查询评价信息
                    method.customGet(api.comment.getPersoDataInfo, {
                        fid: fileInfo.fid
                    }, function (res) {
                        if (res && res.code === '0') {
                            if (res.data) {
                                that.openLayer(fileInfo, res.data, callback);
                            } else {
                                that.layerMsg('评价信息为空');
                            }
                        } else {
                            that.layerMsg(res && res.message ? res.message : '评价信息获取失败，请稍后重试');
                        }
                    }, function () {
                        that.layerMsg('评价信息获取失败，请稍后重试');
                    });
                } else {
                    that.openLayer(fileInfo, null, callback);
                }
            } else {
                loginModel.notifyLoginInterface();
            }
        },
        /**
         * 弹窗逻辑
         * @param fileInfo      资料数据
         * @param evaluateInfo  评价数据
         * @param callback      评价成功回调
         */
        openLayer: function (fileInfo, evaluateInfo, callback) {
            var that = this;
            // 拿到数据进行渲染
            var tpl = template.compile(evaluateLayerTpl)({
                fileInfo: fileInfo,
                evaluateInfo: evaluateInfo
            });
            that.currentLayerIndex = layer.open({
                // 确保只打开一个弹窗
                id: 'evaluateEditLayer',
                skin: 'g-noBg-layer',
                type: 1,
                title: false,
                closeBtn: 0,
                area: ['477px'],
                shade: 0.8,
                shadeClose: true,
                content: tpl,
                success: function (layero, index) {
                    evaluateLayerModel.init(fileInfo, evaluateInfo, index, callback);
                },
                end: function () {}
            });
        },
        // 关闭弹窗
        closeLayer: function () {
            if (this.currentLayerIndex) {
                layer.close(this.currentLayerIndex);
                this.currentLayerIndex = null;
            }
        },
        // 提示
        layerMsg: function (message) {
            layer.msg(message, {offset: ['200px']});
        }
    };
});
