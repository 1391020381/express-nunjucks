const express = require('express');
const router = express.Router();
const rightController = require('../controllers/rights');
const error = require('../common/error');

// VIP权益展示页面.
router.get('/node/rights/vip.html', (req, res, next) => {
    try{
        rightController.index(req, res );
    }catch(e){
        error(req, res, next);
    }
});

module.exports = router;