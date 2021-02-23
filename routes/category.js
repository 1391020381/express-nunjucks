/**
 * A20
 * 取消蜘蛛模板
 * url规范：
 *   结构：/c/分类ID/属性项_属性ID/
 *   不要带.html
 * */ 

var express = require("express");
var router = express.Router();
var categoryController = require("../controllers/category");
var error = require('../common/error');

//分类页
router.get('/c/:id*.html', categoryController.getData);

// 分类页【A20】
router.get('/c/:cId', categoryController.getData);

router.get('/c/:cId/:sId', categoryController.getData);

// router.get('/zhizhuc/:id*.html', categoryController.getData);
module.exports = router;