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
                    url: appConfig.apiNewBaselPath + Api.recommendConfigInfo,
                    body: JSON.stringify(recommendConfigInfo.details.searchBanner.pageId),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                };
                request(opt, (err, res1, body) => {
                    if (body) {
                        const data = JSON.parse(body);
                        if (data.code == 0) {
                            // eslint-disable-next-line callback-return
                            callback(null, util.handleRecommendData(data.data[0] && data.data[0].list || []));
                        } else {
                            // eslint-disable-next-line callback-return
                            callback(null, null);
                        }
                    } else {
                        // eslint-disable-next-line callback-return
                        callback(null, null);
                    }
                });
            }
        }, (err, results) => {
            res.status(404);
            render('404', results, req, res);
        });
    }
};