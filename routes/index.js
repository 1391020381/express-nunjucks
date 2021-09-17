
const express = require('express');
const router = express.Router();
const routes = require('./routes');

for (let i = 0; i < routes.length; i++) {
    router.use('/', require('./' + routes[i]));
}

module.exports = router;
