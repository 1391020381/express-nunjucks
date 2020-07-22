var express = require("express");
var router = express.Router();
var loginController = require("../controllers/login");
var error = require('../common/error');

//意见反馈页面.
router.get('/node/login.html*',function(req , res , next){
    console.log('login')
    try{
        loginController.index(req , res );
    }catch(e){
        error(req , res , next);
    }
});

module.exports = router;