var express = require("express");
var router = express.Router();
var indexController = require("../controllers/index");
var error = require('../common/error');

//上传页
router.get('/',function(req , res , next){
    try{
        console.log('主页')
        indexController.render(res , req );
    }catch(e){
        error(req , res , next);
    }
});
module.exports = router;