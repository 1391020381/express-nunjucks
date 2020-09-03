var express = require('express');
var router = express.Router();
var detailController = require('../controllers/detail');
var spiderController = require("../controllers/spider");
var spiderController1 = require("../controllers/spider1");
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
router.get('/f/:id*.html*',function(req , res , next){
    console.log('资料详情----------------------')
    try{
        if (req.params.id.includes('-nbhh')) {
            // 蜘蛛模板
            spiderController.index(req, res);
        }else{
            console.log("页面请求开始.......");
            console.time();
            detailController.render(req , res);
            console.timeEnd();
        }    
    }catch(e){
        error(req , res , next);
    }
});

router.get('/z/:id*.html*',function(req , res , next){
    console.log('新蜘蛛模板资料详情----------------------')
    try{
        if (req.params.id.includes('-nbhh')) {
            // 蜘蛛模板
            spiderController1.index(req, res);
        } else{
            console.log("页面请求开始.......");
            console.time();
            detailController.render(req , res);
            console.timeEnd();
        }     
    }catch(e){
        error(req , res , next);
    }
});








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