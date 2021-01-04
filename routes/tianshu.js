var express = require('express');
var router = express.Router();
var tianshuController = require('../controllers/tianshu');
var error = require('../common/error');

router.post('/detail/like/:sceneID', tianshuController.like);

router.post('/detail/relevant/:sceneID',tianshuController.relevant);

module.exports = router;