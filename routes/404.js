var express = require('express');
var router = express.Router();
// var render = require('../common/render');
var nofindController = require("../controllers/404");
var error = require('../common/error');
//404页面-由于404页面在java端 故重新写个404地址
router.get('/node/404.html', function(req, res) {
    try{
        nofindController.index(req , res );
    }catch(e){
        error(req , res , next);
    }
});

module.exports = router;
