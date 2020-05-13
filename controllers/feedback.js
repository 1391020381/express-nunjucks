/**
 * 意见反馈
 */

var render = require("../common/render");
module.exports = {
    index: function (req, res) {
        render("feedback/index", {}, req, res);
    },
};