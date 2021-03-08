const express = require('express');
const router = express.Router();
const authController = require('../controllers/authentication');
const error = require('../common/error');

// 认证首页
router.get('/node/auth/index.html', (req, res, next) => {
    try {
        authController.index(req, res);
    } catch (e) {
        error(req, res, next);
    }
});
// 机构认证
router.get('/node/auth/user.html', (req, res, next) => {
    try {
        authController.user(req, res);
    } catch (e) {
        error(req, res, next);
    }
});
// 机构认证
router.get('/node/auth/org.html', (req, res, next) => {
    try {
        authController.org(req, res);
    } catch (e) {
        error(req, res, next);
    }
});
module.exports = router;