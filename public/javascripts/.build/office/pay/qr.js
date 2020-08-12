define("dist/office/pay/qr", [ "../../cmd-lib/util", "../../cmd-lib/qr/qrcode.min", "../../cmd-lib/qr/jquery.qrcode.min" ], function(require, exports, moudle) {
    // var $ = require("$");
    var utils = require("../../cmd-lib/util");
    var QRCode = require("../../cmd-lib/qr/qrcode.min");
    var qrcode = require("../../cmd-lib/qr/jquery.qrcode.min");
    return {
        /**
         * 生成二维码
         * @param cnt 内容
         * @param id 填充元素id
         * @param width 宽
         * @param height 高
         */
        createQrCode: function(cnt, id, width, height) {
            if (cnt) {
                try {
                    console.log("生成二维码start");
                    $("#" + id).html("");
                    var qrcode = new QRCode(document.getElementById(id), {
                        width: width,
                        height: height
                    });
                    qrcode.clear();
                    qrcode.makeCode(cnt);
                    console.log("生成二维码end");
                    $("#" + id + " img").hide();
                } catch (e) {
                    console.info(cnt + ":生成二维码异常");
                }
            }
        },
        /**
         * IE8 以下
         * @param url
         * @param id  div id
         * @param width
         * @param height
         */
        generateIE8QRCode: function(url, id, width, height) {
            $("#" + id).html("");
            $("#" + id).qrcode({
                render: "table",
                // 渲染方式有table方式（IE兼容）和canvas方式
                width: width,
                //宽度
                height: height,
                //高度
                text: url,
                //内容id，id，
                typeNumber: -1,
                //计算模式
                correctLevel: 2,
                //二维码纠错级别
                background: "#ffffff",
                //背景颜色
                foreground: "#000000"
            });
        }
    };
});