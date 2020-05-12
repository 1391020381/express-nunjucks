var express = require("express");
var router = express.Router();
var render = require("../common/render");
var payController = require("../controllers/pay");
var couponController = require("../controllers/coupon");
var error = require('../common/error');

//购买vip
router.get('/pay/vip.html',function(req , res , next){
    try{
        console.log("进入vip列表页============");
        payController.vip(req , res );
    }catch(e){
        error(req , res , next);
        return;
    }
});
//购买下载特权
router.get('/pay/privilege.html',function(req , res , next){
    try{
        console.log("进入下载特权列表页============");
        payController.privilege(req , res );
    }catch(e){
        error(req , res , next);
        return;
    }
});
//支付确认页面
router.get('/pay/payConfirm.html',function(req , res , next){
    try{
        console.log("支付确认页============");
        payController.payConfirm(req , res );
    }catch(e){
        error(req , res , next);
        return;
    }
});

//支付二维码
router.get('/pay/payQr.html',function(req , res , next){
    try{
        console.log("生成二维码===============");
        payController.payQr(req , res);
    }catch(e){
        error(req , res , next);
        return;
    }
});

//响应二维码扫描
router.get('/notm/scanQr',function(req , res , next){
    try{
        console.log("响应二维码扫描=============");
        payController.scanQr(req , res);
    }catch(e){
        error(req , res , next);
        return;
    }
});

//支付成功页面
router.get('/pay/success.html',function(req , res , next){
    console.log('支付成功页面:',req.useragent.source)
    try{
        console.log("支付成功页面===============");
        payController.success(req , res);
    }catch(e){
        error(req , res , next);
        return;
    }
});

//支付失败页面
router.get('/pay/fail.html',function(req , res , next){
    try{
        console.log("支付失败页面===============");
        payController.fail(req , res);
    }catch(e){
        error(req , res , next);
        return;
    }
});

//////////////ajax请求//////////////
//下单
router.post('/pay/order',function(req , res , next){
    try{
        console.log("ajax下单===============");
        payController.order(req , res);
    }catch(e){
        error(req , res , next);
        return;
    }
});
//下单
router.post('/pay/orderFile',function(req , res , next){
    try{
        console.log("ajax老系统文件下单===============");
        payController.orderFile(req , res);
    }catch(e){
        error(req , res , next);
        return;
    }
});
//免登陆下单
router.post('/pay/orderUnlogin',function(req , res , next){
    try{
        console.log("免登陆下单===============");
        payController.orderUnlogin(req , res);
    }catch(e){
        error(req , res , next);
        return;
    }
});
//支付订单状态
router.post('/pay/orderStatus',function(req , res , next){
    try{
        console.log("查询订单状态===============");
        payController.orderStatus(req , res);
    }catch(e){
        error(req , res , next);
        return;
    }
});
//免登陆下载
router.post('/pay/paperDown',function(req , res , next){
    try{
        console.log("查询订单状态===============");
        payController.visitorDownload(req , res);
    }catch(e){
        error(req , res , next);
        return;
    }
});
//免登陆支付订单状态
router.get('/pay/orderStatusUlogin',function(req , res , next){
    try{
        console.log("免登陆查询订单状态===============");
        payController.orderStatusUlogin(req , res);
    }catch(e){
        error(req , res , next);
        return;
    }
});
//网页支付宝
router.get('/pay/webAlipay',function(req , res , next){
    try{
        console.log("网页支付宝===============");
        payController.webAlipay(req , res);
    }catch(e){
        error(req , res , next);
        return;
    }
});
//发送验证码
router.post('/pay/sms',function(req , res , next){
    try{
        console.log("发送验证码===============");
        payController.sms(req , res);
    }catch(e){
        error(req , res , next);
        return;
    }
});
//绑定手机号
router.post('/pay/bindMobile',function(req , res , next){
    try{
        console.log("绑定手机号===============");
        payController.bind(req , res);
    }catch(e){
        error(req , res , next);
        return;
    }
});
//扫码绑定手机号
router.get('/pay/bindUnlogin',function(req , res , next){
    try{
        console.log("绑定手机号===============");
        payController.bindUnlogin(req , res);
    }catch(e){
        error(req , res , next);
        return;
    }
});
//获取优惠券列表
router.get('/node/coupon/issueCoupon',function(req , res , next){
    try{
        console.log("获取优惠券列表===============");
        couponController.couponList(req , res);
    }catch(e){
        error(req , res , next);
        return;
    }
});
//查询优个人惠券
router.get('/node/coupon/queryPersonal',function(req , res , next){
    try{
        console.log("获取个人优惠券===============");
        couponController.personalCoupon(req , res);
    }catch(e){
        error(req , res , next);
        return;
    }
});
//领取优惠券
router.post('/node/coupon/bringCoupon',function(req , res , next){
    try{
        console.log("获取个人优惠券===============");
        couponController.bringCoupon(req , res);
    }catch(e){
        error(req , res , next);
        return;
    }
});
//查询文件类型
router.get('/node/confirmType',function(req , res , next){
    try{
        console.log("查询文件类型===============");
        payController.getFileType(req , res);
    }catch(e){
        error(req , res , next);
        return;
    }
});


module.exports = router;