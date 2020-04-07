var express = require("express");
var router = express.Router();
var render = require("../common/render");
var searchController = require("../controllers/search");
var error = require('../common/error');

//购买vip
router.get('/search/home.html',function(req , res , next){
    try{
        searchController.getData(req , res );
    }catch(e){
        error(req , res , next);
        return;
    }
});

module.exports = router;