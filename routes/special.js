var express = require("express");
var router = express.Router();
var specialController1 = require('../controllers/special-1');
var error = require('../common/error');

//专题展示页面.
// router.get('/node/s/*.html*',function(req , res , next){
//     try{
//         new specialController(req,res)
//         //specialController.render(req, res);
    
//     }catch(e){
//         error(req , res , next);
//     }
// });
router.get('/node/s/*.html*',specialController1.render);
module.exports = router;