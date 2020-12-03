/**
 * @Description: 详情页
 */

const render = require("../common/render");
const server = require("../models/index");

const cc = require('../common/cc')
const renderPage = cc(async (req, res) => {
    var results = {}
    render("loginMiddle/index", results, req, res);
})


module.exports = {
    render: renderPage
}






























