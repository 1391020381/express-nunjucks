/**
 * 第四范式操作数据上报
 */
define(function (require, exports, module) {

    var method = require("../application/method");
    var paradigm4={
        url:'https://tianshu.4paradigm.com/cess/data-ingestion/actions/recom/api/log',
        commonParam:function(){
            var date = new Date();
            var year = date.getFullYear();
            var mon = date.getMonth() + 1;
            var month = mon > 9 ? mon : '0' + mon;
            var day = date.getDate() > 9 ? date.getDate() : '0' + date.getDate();
            var time = date.toTimeString().split('GMT')[0].trim();
            var dateParams = year + '-' + month + '-' + day + ' ' + time;
            return dateParams
        },
        pageView:function(paradigm4Arr,recommendInfoItem){ //页面曝光
            var dateParams=this.commonParam();
            var userId = method.getCookie("userId") || method.getCookie("visitor_id");
            var clientToken = recommendInfoItem.token || '1qaz2wsx3edc';
            var serverUrl=this.url+'?clientToken=' + clientToken;  
            // 相关推荐
            var actionsRelevant = [];
            paradigm4Arr.forEach(function (item) {
                actionsRelevant.push({
                    "itemId": item.itemId,
                    "actionTime": new Date().getTime(),
                    "action": "show",
                    "itemSetId": recommendInfoItem.materialId || '',//物料库的ID
                    "sceneId": recommendInfoItem.useId,//推荐服务的ID
                    "userId": userId,
                    "context": item.context,
                    "requestId": recommendInfoItem.requestId
                })
            });
        
            var data = JSON.stringify({
                "date": dateParams,
                "actions": actionsRelevant,
            })

            $.ajax({
                type: 'post',
                url: serverUrl,
                contentType: "application/json;charset=utf-8",
                dataType: "json",
                data: data,
            })
        },
        eventReport:function(itemId,paradigm4Arr,recommendInfoItem){//点击上报
            var dateParams=this.commonParam();
            var userId = method.getCookie("userId") || method.getCookie("visitor_id");
            var clientToken = recommendInfoItem.token || '1qaz2wsx3edc';
            var serverUrl=this.url+'?clientToken=' + clientToken;
            var context='';
            paradigm4Arr.forEach(function(item){
                item.itemId==itemId ? context=item.context : '';
            })
            var params = JSON.stringify({
                "date": dateParams,
                "actions": [{
                    "itemId": itemId,
                    "actionTime": new Date().getTime(),
                    "action": "show",
                    "itemSetId": recommendInfoItem.materialId || '',
                    "sceneId": recommendInfoItem.useId,
                    "userId": userId,
                    "context": context,
                    "requestId": recommendInfoItem.requestId
                }]
            })    
            $.ajax({
                type: 'post',
                url: serverUrl,
                contentType: "application/json;charset=utf-8",
                dataType: "json",
                data: params,
            })
        }
    }
    return paradigm4
});