var express = require('express');
var router = express.Router();
var detailController = require('../controllers/detail')
var detailController_1 = require('../controllers/detail_1')
var spiderController = require("../controllers/spider.js");
var queryOrderController = require("../controllers/queryOrder");
var error = require('../common/error');

router.get('/node/f/downsucc.html',function(req , res , next){
    try{
        console.log("详情页下载成功页面.......",+new Date());
        detailController.success(req , res);
    }catch(e){
        error(req , res , next);
    }
});

router.get('/node/f/downfail.html',function(req , res , next){
    try{
        console.log("详情页失败页面.......",+new Date());
        detailController.fail(req , res);
    }catch(e){
        error(req , res , next);
    }
});
//资料详情页


router.get('/f/:id*.html*',detailController_1.render)
router.get('/zhizhu/:id*.html*',spiderController.index)










// 订单查询页
router.get('/node/queryOrder',function(req , res , next){
    try{
        queryOrderController.render(req , res );
    }catch(e){
        error(req , res , next);
        return;
    }
});

module.exports = router;