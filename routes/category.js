var express = require("express");
var router = express.Router();
var categoryController = require("../controllers/category");
var error = require('../common/error');

//分类页
// router.get('/c/:id*.html', function (req, res, next) {
//     try {
//         categoryController.getData(req, res);
//     } catch (e) {
//         error(req, res, next);
//     }
// });
router.get('/c/:id*.html', categoryController.getData);
router.get('/zhizhuc/:id*.html', categoryController.getData);
module.exports = router;