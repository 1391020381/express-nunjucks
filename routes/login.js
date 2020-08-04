// 一些不作展示的中间页，只用于配合java进行数据传递
var express = require("express");
var router = express.Router();
var error = require('../common/error');
var render = require("../common/render");

// 登录中间页
router.get('/node/loginMiddle.html', function (req, res, next) {
    try {
        console.log("登录中间页============");
        render('login/loginMiddle', {}, req, res);
    } catch (e) {
        error(req, res, next);
    }
});

module.exports = router;