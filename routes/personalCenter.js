const express = require('express');
const router = express.Router();
// var render = require('../common/render');
const personalCenter = require('../controllers/personalCenter');
const error = require('../common/error');

// router.get('/node/personalCenter/home.html', function(req, res) {
//     try{
//         personalCenter.home(req , res );
//     }catch(e){
//         error(req , res , next);
//     }
// });

router.get('/node/personalCenter/home.html', personalCenter.home);

router.get('/node/personalCenter/mydownloads.html', personalCenter.mydownloads);

router.get('/node/personalCenter/mycollection.html', personalCenter.mycollection);

router.get('/node/personalCenter/myuploads.html', personalCenter.myuploads);

router.get('/node/personalCenter/vip.html', personalCenter.vip);

router.get('/node/personalCenter/myorder.html', personalCenter.myorder);

router.get('/node/personalCenter/mycoupon.html', personalCenter.mycoupon);

router.get('/node/personalCenter/accountsecurity.html', personalCenter.accountsecurity);

router.get('/node/personalCenter/personalinformation.html', personalCenter.personalinformation);

router.get('/node/personalCenter/mywallet.html', personalCenter.mywallet);

router.get('/node/redirectionURL.html', (req, res) => {
    try {
        personalCenter.redirectionURL(req, res);
    } catch (e) {
        error(req, res, next);
    }
});

router.get('/u/:uid', (req, res) => {
    try {
        personalCenter.userPage(req, res);
    } catch (e) {
        error(req, res, next);
    }
});

module.exports = router;