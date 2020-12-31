var express = require('express');
var router = express.Router();
var tianshuController = require('../controllers/tianshu');
var error = require('../common/error');

router.post('/detail/like/:sceneID', function (req, res, next) {
    try {
        console.log('获取猜你喜欢数据=========');
        tianshuController.like(req, res);
    } catch (e) {
        error(req, res, next);
    }
});


module.exports = router;