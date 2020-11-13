/**
 * @Description: 上传页
 */
var async = require("async");
var render = require("../common/render");
var request = require('request');
var Api = require("../api/api");
var appConfig = require("../config/app-config");
var recommendConfigInfo = require('../common/recommendConfigInfo')
var util = require('../common/util');


module.exports = {
    index: function (req, res) {
        return async.series({
            geSearchBannerList:function(callback){
                var opt = {
                    method: 'POST',
                    url: appConfig.apiNewBaselPath + Api.recommendConfigInfo,
                    body:JSON.stringify(recommendConfigInfo.details.searchBanner.pageId),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                };
                request(opt,function(err,res1,body){
                    if(body){
                        var data = JSON.parse(body);
                        console.log('请求地址post-------------------:',opt.url)
                        console.log('请求参数-------------------:', opt.body)
                        console.log('返回code------:'+data.code,'返回message-------:'+data.message)
                        if (data.code == 0 ){
                            // console.log('getTopBannerList:',data)
                            callback(null, util.handleRecommendData(data.data[0]&&data.data[0].list||[]));
                        }else{
                            callback(null,null)
                        }
                    }else{
                      callback(null,null)
                    }
                })
            },
        } , function(err, results){
            // console.log(results)
            render("upload/index", results, req, res);
        })
    }
};