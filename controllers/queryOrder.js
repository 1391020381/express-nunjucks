
const async = require('async');
const render = require('../common/render');
const server = require('../models/index');
const appConfig = require('../config/app-config');
const urlencode = require('urlencode');
// 测试
module.exports = {
    render: function(res, req) {
        // console.log('1---------1')
        return async.series({}, (err, results) => {
            render('queryOrder/index', results, res, req);
        });
    }
};