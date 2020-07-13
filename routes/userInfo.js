var express = require('express');
var router = express.Router();
var userInfoController = require("../controllers/userInfo.js");
var error = require('../common/error');
//404页面-由于404页面在java端 故重新写个404地址
router.get('/node/api/getUserInfo', function(req, res,next) {
    try{
        userInfoController.index(req , res);
    }catch(e){
        error(req , res , next);
    }
});

module.exports = router;