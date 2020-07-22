
var render = require("../common/render");
module.exports = {
    index: function (req, res) {
        render("login/index", {}, req, res);
    },
};