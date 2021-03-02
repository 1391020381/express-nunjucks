const express = require('express');
const router = express.Router();
const detailController = require('../controllers/detail');
const detailController_1 = require('../controllers/detail_1');
const spiderController = require('../controllers/spider.js');
const queryOrderController = require('../controllers/queryOrder');
const error = require('../common/error');

router.get('/node/f/downsucc.html', (req, res, next) => {
    try {
        console.log('详情页下载成功页面.......', Number(new Date()));
        detailController.success(req, res);
    } catch (e) {
        error(req, res, next);
    }
});

router.get('/node/f/downfail.html', (req, res, next) => {
    try {
        console.log('详情页失败页面.......', Number(new Date()));
        detailController.fail(req, res);
    } catch (e) {
        error(req, res, next);
    }
});
// 资料详情页


router.get('/f/:id*.html*', detailController_1.render);
router.get('/zhizhu/:id*.html*', spiderController.index);

// 订单查询页
router.get('/node/queryOrder', (req, res, next) => {
    try {
        queryOrderController.render(req, res);
    } catch (e) {
        error(req, res, next);
        return;
    }
});

module.exports = router;