/**
 * @Description: 上传页
 */
const async = require('async');
const render = require('../common/render');
const request = require('request');
const Api = require('../api/api');
const appConfig = require('../config/app-config');
const recommendConfigInfo = require('../common/recommendConfigInfo');
const util = require('../common/util');

module.exports = {
    index: function (req, res) {
        return async.series({
            geSearchBannerList:function(callback){
                const opt = {
                    method: 'POST',
                    url: appConfig.apiNewBaselPath + Api.recommendConfigInfo,
                    body:JSON.stringify(recommendConfigInfo.details.searchBanner.pageId),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                };
                request(opt, (err, res1, body) => {
                    if(body){
                        const data = JSON.parse(body);
                        console.log('请求地址post-------------------:', opt.url);
                        console.log('请求参数-------------------:', opt.body);
                        console.log('返回code------:'+data.code, '返回message-------:'+data.message);
                        if (data.code == 0 ){
                            // console.log('getTopBannerList:',data)
                            callback(null, util.handleRecommendData(data.data[0]&&data.data[0].list||[]));
                        }else{
                            callback(null, null);
                        }
                    }else{
                        callback(null, null);
                    }
                });
            }
        }, (err, results) => {
            // console.log(results)
            render('upload/index', results, req, res);
        });
    }
};
