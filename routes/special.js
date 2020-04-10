var express = require("express");
var router = express.Router();
var specialController = require('../controllers/special');
var error = require('../common/error');
//专题展示页面.
router.get('/node/s/123.html',function(req , res , next){
    console.log('专题页')
    try{
        console.log("页面请求开始.......");
        console.time();
        specialController.render(req , res);
        console.timeEnd();
    }catch(e){
        error(req , res , next);
    }
});
module.exports = router;