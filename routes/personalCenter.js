var express = require('express');
var router = express.Router();
// var render = require('../common/render');
var personalCenter = require("../controllers/personalCenter");
var error = require('../common/error');

router.get('/node/personalCenter/home.html', function(req, res) {
    try{
        personalCenter.home(req , res );
    }catch(e){
        error(req , res , next);
    }
});

router.get('/node/personalCenter/mydownloads.html', function(req, res) {
    try{
        personalCenter.mydownloads(req , res );
    }catch(e){
        error(req , res , next);
    }
});
router.get('/node/personalCenter/mycollection.html', function(req, res) {
    try{
        personalCenter.mycollection(req , res );
    }catch(e){
        error(req , res , next);
    }
});
router.get('/node/personalCenter/myuploads.html', function(req, res) {
    try{
        personalCenter.myuploads(req , res );
    }catch(e){
        error(req , res , next);
    }
});


router.get('/node/personalCenter/vip.html', function(req, res) {
    try{
        personalCenter.vip(req , res );
    }catch(e){
        error(req , res , next);
    }
});

router.get('/node/personalCenter/myorder.html', function(req, res) {
    try{
        personalCenter.myorder(req , res );
    }catch(e){
        error(req , res , next);
    }
});


router.get('/node/personalCenter/mycoupon.html', function(req, res) {  
    try{
        personalCenter.mycoupon(req , res );
    }catch(e){
        error(req , res , next);
    }
});

router.get('/node/personalCenter/accountsecurity.html', function(req, res) {  
    try{
        personalCenter.accountsecurity(req , res );
    }catch(e){
        error(req , res , next);
    }
});


router.get('/node/personalCenter/personalinformation.html', function(req, res) {  
    try{
        personalCenter.personalinformation(req , res );
    }catch(e){
        error(req , res , next);
    }
});


router.get('/node/personalCenter/mywallet.html', function(req, res) {  
    try{
        personalCenter.mywallet(req , res );
    }catch(e){
        error(req , res , next);
    }
});

router.get('/node/redirectionURL.html', function(req, res) {  
    try{
        personalCenter.redirectionURL(req , res );
    }catch(e){
        error(req , res , next);
    }
});

module.exports = router;