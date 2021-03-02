const express = require('express');
const router = express.Router();
// var render = require('../common/render');
const nofindController = require('../controllers/404');
const error = require('../common/error');
// 404页面-由于404页面在java端 故重新写个404地址
router.get('/node/404.html', (req, res) => {
    try{
        nofindController.index(req, res );
    }catch(e){
        error(req, res, next);
    }
});

module.exports = router;
