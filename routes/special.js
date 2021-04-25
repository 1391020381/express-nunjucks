const express = require('express');
const router = express.Router();
const specialController = require('../controllers/special');


// 专题展示页面.

router.get('/node/s/*.html*', specialController.render);
router.get('/t/*.html',specialController.render)
router.get('/theme/*.html',specialController.render)
module.exports = router;
