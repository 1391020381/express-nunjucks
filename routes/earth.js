const express = require('express');
const router = express.Router();
const earthController = require('../controllers/earth');
const error = require('../common/error');

// 认证首页
router.get('/index/:id*.html*', (req, res, next) => {
    try {
        earthController.index(req, res);
    } catch (e) {
        error(req, res, next);
    }
});
module.exports = router;