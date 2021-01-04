/**
 * 文档详情
 **/
let async = require("async")
server = require("../models/index")

module.exports = {
    like: async (req, res) => {
        req.body = {
            "request":{
            "userId":req.body.userId,
            "requestId":req.body.requestId
            }
        }
        let list = await server.$http(`https://tianshu.4paradigm.com/api/v0/recom/recall?sceneID=${req.params.sceneID}`, 'post', req, res, true)
     
        res.send(list).end()
    },
    relevant:async(req,res)=>{
        req.body = {
            request:{
            "userId":req.body.userId,
            "requestId":req.body.requestId,
            "itemId":req.body.itemId, 
            "itemTitle":req.body.itemTitle
             }
        }
        let list = await server.$http(`https://tianshu.4paradigm.com/api/v0/recom/recall?sceneID=${req.params.sceneID}`, 'post', req, res, true)
        res.send(list).end()
    }
};