/**
 * 个人中心
 */

var render = require("../common/render");
module.exports = {
    home:function(req,res){
        var results = {
            type:'home'
        }
        render("personalCenter/index", results, req, res);
    },
    mydownloads: function (req, res) {
        var results = {
            type:'mydownloads'
        }
        render("personalCenter/index", results, req, res);
    },
    mycollection: function (req, res) {
        var results = {
            type:'mycollection'
        }
        render("personalCenter/index", results, req, res);
    },
    myuploads: function (req, res) {
        var results = {
            type:'myuploads',
            myuploadType:req.query.myuploadType || 1
        }
        render("personalCenter/index", results, req, res);
    },
    vip: function (req, res) {
        var results = {
            type:'myvip',
            vipTableType:req.query.vipTableType 
        }
        render("personalCenter/index", results, req, res);
    },
    myorder:function(req,res){
        var results = {
            type:'myorder',
            myorderType:req.query.myorderType
        }
        render("personalCenter/index", results, req, res);
    },
    mycoupon:function(req,res){
        var results = {
            type:'mycoupon',
            mycouponType:req.query.mycouponType
        }
        render("personalCenter/index", results, req, res);
    },
    accountsecurity:function(req,res){
        var results = {
            type:'accountsecurity'
        }
        render("personalCenter/index", results, req, res);
    },
    personalinformation:function(req,res){
        var results = {
            type:'personalinformation'
        }
        render("personalCenter/index", results, req, res);
    },
    mywallet:function(req,res){
        var results = {
            type:'mywallet'
        }
        render("personalCenter/index", results, req, res);
    },
    redirectionURL:function(req,res){
        render("personalCenter/redirectionURL", {}, req, res);
    },
    userPage:function(req,res){
        render("personalCenter/userPage", {}, req, res);
    },
};