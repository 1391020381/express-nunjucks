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
    },
    actionsLog:async(req,res)=>{
        req.body = {
            "date": req.body.date,
            "actions": req.body.actions,
        }
        let result = await server.$http(`https://tianshu.4paradigm.com/cess/data-ingestion/actions/recom/api/log?clientToken=${req.params.clientToken}`, 'post', req, res, true)
        res.send(result).end()
    }
};