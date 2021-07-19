/**
 * @Description: 404
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
            geSearchBannerList: function (callback) {
                const opt = {
                    method: 'POST',
                    url: appConfig.apiNewBaselPath + Api.recommend.configInfo2,
                    body: JSON.stringify({
                        pageIds:recommendConfigInfo.details.searchBanner.pageId
                    }),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                };
                request(opt, (err, res1, body) => {
                    if (body) {
                        const data = JSON.parse(body);
                        if (data.code == 0) {
                            let recommendList = [];
                            if(data.data&&data.data.length){
                                recommendList = util.handleRecommendData(data.data[0] && data.data[0].list || []);
                            }
                            callback(null, recommendList);
                        } else {
                            callback(null, null);
                        }
                    } else {
                        callback(null, null);
                    }
                });
            }
        }, (err, results) => {
            // console.log(results)
            res.status(404);
            render('404', results, req, res);
        });
    }
};
