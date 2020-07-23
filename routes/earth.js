var express = require("express");
var router = express.Router();
var earthController = require("../controllers/earth");
var error = require('../common/error');

//认证首页
router.get('/index/:id*.html*', function (req, res, next) {
    try {
        earthController.index(req, res);
    } catch (e) {
        error(req, res, next);
    }
});
module.exports = router;