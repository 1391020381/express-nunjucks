const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedback');
const error = require('../common/error');

// 意见反馈页面.
router.get('/node/feedback/feedback.html*', (req, res, next) => {
    console.log('意见反馈页面');
    try{
        feedbackController.index(req, res );
    }catch(e){
        error(req, res, next);
    }
});

module.exports = router;