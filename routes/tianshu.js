const express = require('express');
const router = express.Router();
const tianshuController = require('../controllers/tianshu');
const error = require('../common/error');

router.post('/detail/like/:sceneID', tianshuController.like);

router.post('/detail/relevant/:sceneID', tianshuController.relevant);
router.post('/detail/actionslog/:clientToken', tianshuController.actionsLog);
module.exports = router;