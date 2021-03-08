const express = require('express');
const router = express.Router();
const loginMiddle = require('../controllers/loginMiddle');


router.get('/login-middle.html*', loginMiddle.render);
module.exports = router;