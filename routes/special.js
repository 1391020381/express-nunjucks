const express = require('express');
const router = express.Router();
const specialController = require('../controllers/special');

// 专题列表
const specialArr = [
    {
        type: 'ishare_zt_model1',
        link: '/node/s'
    },
    {
        type: 'ishare_zt_model_tag',
        link: '/t'
    },
    {
        type: 'ishare_zt_model_theme',
        link: '/theme'
    },
    {
        type: 'ishare_zt_model_zt',
        link: '/zt'
    },
    {
        type: 'ishare_zt_model_top',
        link: '/top'
    },
    {
        type: 'ishare_zt_model_sou',
        link: '/sou'
    },
    {
        type: 'ishare_zt_model_view',
        link: '/view'
    },
    {
        type: 'ishare_zt_model_cp',
        link: '/cp'
    },
    {
        type: 'ishare_zt_model_mulu',
        link: '/mulu'
    },
    {
        type: 'ishare_zt_model_leimu',
        link: '/leimu'
    }
];


// 专题展示页面.

specialArr.forEach(item => {
    router.get(`${item.link}/*.html*`,function(req,res,next){
        console.log('专题页' + item);
        req.mulu = item.link;
        req.templateCodeType = item.type;
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
