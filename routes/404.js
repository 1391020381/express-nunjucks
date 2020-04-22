var express = require('express');
var router = express.Router();
var render = require('../common/render');
//404页面-由于404页面在java端 故重新写个404地址
router.get('/node/404.html', function(req, res) {
    render("404", {
        title: 'No Found'
    }, req, res);
});

module.exports = router;
