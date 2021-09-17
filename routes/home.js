const express = require('express');
const router = express.Router();
const indexController = require('../controllers/index');
const error = require('../common/error');

// 上传页
router.get('/', (req, res, next) => {
    // try{
    //     console.log('主页')

    //     indexController.render(1,res , req );
    // }catch(e){
    //     error(req , res , next);
    // }
    (async function(){
        await indexController.render(res, req, next);
    })().catch(e => {
        next(e);
    });
});
module.exports = router;