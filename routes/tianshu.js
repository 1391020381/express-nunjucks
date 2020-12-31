var express = require('express');
var router = express.Router();
var tianshuController = require('../controllers/tianshu');
var error = require('../common/error');

router.post('/detail/like/:sceneID', tianshuController.like);


module.exports = router;