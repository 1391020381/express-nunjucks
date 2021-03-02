const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/upload');
const error = require('../common/error');

// 上传页
router.get('/node/upload.html', (req, res, next) => {
    try{
        uploadController.index(req, res );
    }catch(e){
        error(req, res, next);
    }
});
router.post('/node/fileUpload', (req, res, next) => {
    console.log('文件上传请求');
    try{
        uploadController.fileUpload(req, res );
    }catch(e){
        error(req, res, next);
    }
});

module.exports = router;