var express = require("express");
var router = express.Router();
var uploadController = require("../controllers/upload");
var error = require('../common/error');

//上传页
router.get('/node/upload.html',function(req , res , next){
    try{
        uploadController.index(req , res );
    }catch(e){
        error(req , res , next);
    }
});
router.post('/node/fileUpload',function(req , res , next){
    console.log('文件上传请求')
    try{
        uploadController.fileUpload(req , res );
    }catch(e){
        error(req , res , next);
    }
});

module.exports = router;