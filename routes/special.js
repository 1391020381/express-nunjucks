var express = require("express");
var router = express.Router();
var specialController = require('../controllers/special');


//专题展示页面.

router.get('/node/s/*.html*',specialController.render);
module.exports = router;