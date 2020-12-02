var express = require('express');
var router = express.Router();
var loginMiddle = require('../controllers/loginMiddle')


router.get('/login-middle.html*', loginMiddle.render);
module.exports = router;