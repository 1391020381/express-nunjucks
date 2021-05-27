const express = require('express');
const router = express.Router();
const specialController = require('../controllers/special');

// 专题列表
const specialArr = [
    '/node/s',
    '/t',
    '/theme',
    '/zt',
    '/top',
    '/sou',
    '/view',
    '/cp',
    '/mulu',
    '/leimu'
];


// 专题展示页面.

specialArr.forEach(item => {
    router.get(`${item}/*.html*`,function(req,res,next){
        console.log('专题页' + item);
        req.mulu = item;
        next()
    }, specialController.render);
})



// router.get('/t/*.html*',function(req,res,next){
//     console.log('专题页/t')
//     req.mulu = '/t'
//     next()
// },specialController.render);

// router.get('/theme/*.html*',function(req,res,next){
//     console.log('专题页/theme')
//     req.mulu = '/theme'
//     next()
// },specialController.render);

module.exports = router;
