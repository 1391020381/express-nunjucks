const express = require('express');
const router = express.Router();
const specialController = require('../controllers/special');


// 专题展示页面.

router.get('/node/s/*.html*',function(req,res,next){
    req.mulu = '/node/s'
    next()
}, specialController.render);
router.get('/t/*.html*',function(req,res,next){
    req.mulu = '/t'
    next()
},specialController.render)
router.get('/theme/*.html*',function(req,res,next){
    req.mulu = '/theme'
    next()
},specialController.render)
module.exports = router;
