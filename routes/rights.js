var express = require("express");
var router = express.Router();
var rightController = require("../controllers/rights");
var error = require('../common/error');

//VIP权益展示页面.
router.get('/node/rights/vip.html',function(req , res , next){
    try{
        rightController.index(req , res );
    }catch(e){
        error(req , res , next);
    }
});

module.exports = router;