/**
 * 文档详情
 **/
let async = require("async")
server = require("../models/index")

module.exports = {
    like: (req, res) => {
        return async.series({
            list: function (callback) {
                req.body = {
                    "request":{
                    "userId":req.body.userId,
                    "requestId":req.body.requestId
                    }
                }
                server.post(`https://tianshu.4paradigm.com/api/v0/recom/recall?sceneID=${req.params.sceneID}`, callback, req);
            }
        }, function (err, results) {
            res.send(results.list).end();
        })
    }
};