/**
 * 办公频道搜索页即类目页
 */
var express = require('express');
var router = express.Router();
var officeController = require('../controllers/office');
var error = require('../common/error');
// 办公频道类目
router.get('/node/c/*.html', function (req, res, next) {
    try {
        officeController.category(req, res);
    } catch (e) {
        error(req, res, next);
    }
});

// 办公频道搜索
router.get('/node/office/search.html', function (req, res, next) {
    try {
        officeController.search(req, res);
    } catch (e) {
        error(req, res, next);
    }
});

module.exports = router;
