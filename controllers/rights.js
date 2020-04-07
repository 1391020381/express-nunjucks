/**
 * VIP 权益落地页面
 */

var render = require("../common/render");
module.exports = {
    index: function (req, res) {
        render("rights/index", {}, req, res);
    },
};