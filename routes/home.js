const express = require('express');
const router = express.Router();


router.get('/', (req, res, next) => {
    res.render('home');
});
router.get('/detail', (req, res, next) => {
    res.render('detail');
});
module.exports = router;
