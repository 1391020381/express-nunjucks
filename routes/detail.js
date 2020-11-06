var express = require('express');
var router = express.Router();

var detailController = require('../controllers/detail')
var spiderController_1 = require("../controllers/spider_1");
var spiderController_2 = require("../controllers/spider_2")
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


router.get('/f/:id*.html*',detailController.render)
router.get('/zhizhu/:id*.html*',spiderController_1.index)

router.get('/z/:id*.html*', spiderController_2.index);








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