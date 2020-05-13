var express = require("express");
var router = express.Router();
var feedbackController = require("../controllers/feedback");
var error = require('../common/error');

//意见反馈页面.
router.get('/node/feedback/feedback.html',function(req , res , next){
    console.log('意见反馈页面')
    try{
        feedbackController.index(req , res );
    }catch(e){
        error(req , res , next);
    }
});

module.exports = router;