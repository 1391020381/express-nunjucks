const express = require('express');
const router = express.Router();
const serverErrorController = require('../controllers/503');
const error = require('../common/error');
router.get('/node/503.html', (req, res) => {
    try{
        serverErrorController.index(req, res );
    }catch(e){
        error(req, res, next);
    }
});

module.exports = router;
