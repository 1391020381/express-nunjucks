var async = require("async");
var render = require("../common/render");
var server = require("../models/index");
var appConfig = require("../config/app-config");
var urlencode = require('urlencode');
//测试
module.exports = {
    render: function(res, req) {
            console.log('1---------1')
            return render("special/index", {},res, req);
            // return async.series({}, function (err, results) {
            //     render("special/index", results, res, req);
            // })
    }
}