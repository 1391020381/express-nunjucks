/*
 * @Description: 首页路由
 */
const express = require('express');
const router = express.Router();
const routes = require('./routes');

for (let i = 0; i < routes.length; i++) {
    router.use('/', require('./' + routes[i]));
}

// router.use('/', require('./404')); // 404必须要放最后
module.exports = router;