var express = require('express');
var router = express.Router();
var serverErrorController = require("../controllers/503");
var error = require('../common/error');
router.get('/node/503.html', function(req, res) {
    try{
        serverErrorController.index(req , res );
    }catch(e){
        error(req , res , next);
    }
});

module.exports = router;
