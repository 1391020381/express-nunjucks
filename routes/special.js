var express = require("express");
var router = express.Router();
var specialController = require('../controllers/special');
var error = require('../common/error');

//专题展示页面.
router.get('/node/s/*.html',function(req , res , next){
    try{
        new specialController(req,res)
        //specialController.render(req, res);
    
    }catch(e){
        error(req , res , next);
    }
});
module.exports = router;