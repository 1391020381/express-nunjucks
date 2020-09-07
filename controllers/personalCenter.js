/**
 * 个人中心
 */

var render = require("../common/render");
module.exports = {
    home:function(req,res){
        var results = {
            type:'home',
            noPersonalCenter:true   //  登录后 浮层 无个人中心
        }
        render("personalCenter/index", results, req, res);
    },
    mydownloads: function (req, res) {
        var results = {
            type:'mydownloads',
            noPersonalCenter:true
        }
        render("personalCenter/index", results, req, res);
    },
    mycollection: function (req, res) {
        var results = {
            type:'mycollection',
            noPersonalCenter:true
        }
        render("personalCenter/index", results, req, res);
    },
    myuploads: function (req, res) {
        var results = {
            type:'myuploads',
            myuploadType:req.query.myuploadType || 1,
            noPersonalCenter:true
        }
        render("personalCenter/index", results, req, res);
    },
    vip: function (req, res) {
        var results = {
            type:'myvip',
            vipTableType:req.query.vipTableType ,
            noPersonalCenter:true
        }
        render("personalCenter/index", results, req, res);
    },
    myorder:function(req,res){
        var results = {
            type:'myorder',
            myorderType:req.query.myorderType || '1',
            noPersonalCenter:true
        }
        render("personalCenter/index", results, req, res);
    },
    mycoupon:function(req,res){
        var results = {
            type:'mycoupon',
            mycouponType:req.query.mycouponType,
            noPersonalCenter:true
        }
        render("personalCenter/index", results, req, res);
    },
    accountsecurity:function(req,res){
        var results = {
            type:'accountsecurity',
            noPersonalCenter:true
        }
        render("personalCenter/index", results, req, res);
    },
    personalinformation:function(req,res){
        var results = {
            type:'personalinformation',
            noPersonalCenter:true
        }
        render("personalCenter/index", results, req, res);
    },
    mywallet:function(req,res){
        var results = {
            type:'mywallet',
            mywalletType:req.query.mywalletType|| '1',
            noPersonalCenter:true
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