/**
 * 意见反馈
 */

const render = require('../common/render');
module.exports = {
    index: function (req, res) {
        render('feedback/index', {}, req, res);
    }
};