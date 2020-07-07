var express = require("express");
var router = express.Router();
var authController = require("../controllers/authentication");
var error = require('../common/error');

//认证首页
router.get('/node/auth/index.html', function (req, res, next) {
    try {
        authController.index(req, res);
    } catch (e) {
        error(req, res, next);
    }
});
//机构认证
router.get('/node/auth/user.html', function (req, res, next) {
    try {
        authController.user(req, res);
    } catch (e) {
        error(req, res, next);
    }
});
//机构认证
router.get('/node/auth/org.html', function (req, res, next) {
    try {
        authController.org(req, res);
    } catch (e) {
        error(req, res, next);
    }
});
module.exports = router;