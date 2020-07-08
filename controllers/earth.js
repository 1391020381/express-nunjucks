/**
 * @Description: 网站地图
 */
var async = require("async");
var render = require("../common/render");
var server = require("../models/index");
var request = require('request');
var Api = require("../api/api");
var appConfig = require("../config/app-config");
var recommendConfigInfo = require('../common/recommendConfigInfo')
var util = require('../common/util');
var currentPage = 1;
var prex = 'a';
var type = 'f'
module.exports = {
    index: function (req, res) {
        return async.series({
            maplist:function(callback){
                // currentPage	Integer	是	页码
                // pageSize	Integer	是	每页记录数
                // prex	String	是	网站地图前缀 eg： a开头的字
                var paramsArr = req.params.id.split('-');
                type = paramsArr[0];
                currentPage = paramsArr[2]||1;
                prex = paramsArr[1]||'a';
                // console.log(paramsArr,'paramsArr')
                req.body = {
                    currentPage:currentPage,
                    pageSize:600,
                    prex:prex,
                    siteCode:4
                };
               if(type == 'f') {
                    server.post(appConfig.apiNewBaselPath+Api.map.list, callback, req);
                    console.log(appConfig.apiNewBaselPath+Api.map.list)
               }else {
                    server.post(appConfig.apiNewBaselPath+Api.map.topic, callback, req);
               }
                
            },
        } , function(err, results){
            console.log(JSON.stringify(results))
            var list = results.maplist.data.rows.map(item=>{
                if (type == 'f') {
                    var obj ={};
                    obj.linkurl = '/f/'+item.id +'.html';
                    obj.title = item.title;
                    return obj;
                }else {
                    var obj ={};
                    obj.linkurl = '/node/s/'+item.specialTopicId +'.html';
                    obj.title = item.topicName;
                    return obj;
                }
            })
            var resultdata = {};
            resultdata.currentPage = currentPage;
            var pageArr = [];
            var
            for(var i =0; i<60; i++) {
                pageArr.push(i+1);
            }
            resultdata.pageArr = pageArr;
            resultdata.initialCapitalArr = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z']
            
            resultdata.initialArr = resultdata.initialCapitalArr.map(item=>{
                return item.toLowerCase();
            })
            resultdata.initialArr.push('09');
            resultdata.initialCapitalArr.push('0-9')
            resultdata.list = list;
            resultdata.prex = prex;
            resultdata.inialPrex = prex.toUpperCase()=='09'?'0-9':prex.toUpperCase();
            resultdata.type = type;
           
           
            render("earth/index", resultdata, req, res);
        })
    }
};