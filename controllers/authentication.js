/**
 * @Description: 认证
 */
var async = require("async");
var render = require("../common/render");
var server = require("../models/index");
var request = require('request');
var api = require("../api/api");
var appConfig = require("../config/app-config");
var recommendConfigInfo = require('../common/recommendConfigInfo')
var util = require('../common/util');

module.exports = {
    index: function (req, res) {
        return async.series({
            geSearchBannerList:function(callback){
                callback(null,null)
            },
        } , function(err, results){
            // console.log(results)
            render("authentication/index", results, req, res);
        })
    },
    user:function (req, res) {
        return async.series({
            list:function(callback){
                // /gateway/user/certification/getPersonal
                server.get(appConfig.apiNewBaselPath+api.auth.user, callback, req);
            },
        } , function(err, results){
            var results;
            if(results.list.data && results.list.data.auditStatus ==3){
                results = {};
            }else if(results.list.data){
                results = results.list.data;
                results.isEdit = true
            }else{
                results = {};
            }
            results.authTypeArr = [{val:0,title:'中小学教师'},{val:1,title:'大学或高职教师'},{val:2,title:'网络营销'},{val:3,title:'IT/互联网'},{val:4,title:'医学'},{val:5,title:'建筑工程'},{val:6,title:'金融/证券'},{val:7,title:'汽车/机械/制造'},{val:8,title:'其他'},{val:9,title:'设计师'}]
            
            // console.log(results.auditStatus,'auditStatus')
           
            render("authentication/user", results, req, res);
        })
    },
    org:function (req, res) {
        return async.series({
            list:function(callback){
                server.get(appConfig.apiNewBaselPath+api.auth.org, callback, req);
            },
        } , function(err, results){
            console.log(results.list,'results.list')
            var results;
            if(results.list.data && results.list.data.auditStatus ==3){
                results = {};
            }else if(results.list.data){
                results = results.list.data;
                results.isEdit = true
            }else{
                results = {};
            }
            results.organizeIndustryArr = [
                {val:0,title:'企业'},
                {val:1,title:'学校'},
                {val:2,title:'网络营销'},
                {val:3,title:'IT/互联网'},
                {val:4,title:'医学'}
            ]
            results.industryTypeArr = [
                {val:0,title:'教育'},
                {val:1,title:'法律'},
                {val:2,title:'建筑/房地产'},
                {val:3,title:'制造加工'},
                {val:4,title:'通信电子'},
                {val:5,title:'农林牧渔'},
                {val:6,title:'健康/医学'},
                {val:7,title:'IT/互联网'},
                {val:8,title:'水利电力'},
                {val:9,title:'公关广告'},
                {val:10,title:'行业资讯'},
                {val:11,title:'金融'},
                {val:12,title:'石油化工'},
                {val:13,title:'人文艺术'},
                {val:14,title:'军事/航天/航空'},
                {val:15,title:'餐饮美食'},
                {val:16,title:'交通运输'},
                {val:17,title:'出版行业'},
                {val:18,title:'娱乐休闲'},
                {val:19,title:'生活科普'},
                {val:20,title:'学术/科研'},
                {val:21,title:'能源矿产'},
                {val:22,title:'文化传媒'},
                {val:23,title:'体育'},
                {val:24,title:'旅游'},
                {val:25,title:'政府'},
                {val:26,title:'其他'}
            ]
            render("authentication/org", results, req, res);
        })
    }
};