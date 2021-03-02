const express = require('express');
const router = express.Router();
const render = require('../common/render');
const searchController = require('../controllers/search');
const error = require('../common/error');

// 购买vip
router.get('/search/home.html', (req, res, next) => {
    try{
        searchController.getData(req, res );
    }catch(e){
        error(req, res, next);
        return;
    }
});

module.exports = router;