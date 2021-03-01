/**
 * 第四范式操作数据上报
 */
define("dist/common/paradigm4-report", [ "../application/method" ], function(require, exports, module) {
    var method = require("../application/method");
    var paradigm4 = {
        // 第四范式相关使用node代理一层
        url: "/detail/actionslog",
        commonParam: function() {
            var date = new Date();
            var year = date.getFullYear();
            var mon = date.getMonth() + 1;
            var month = mon > 9 ? mon : "0" + mon;
            var day = date.getDate() > 9 ? date.getDate() : "0" + date.getDate();
            var time = date.toTimeString().split("GMT")[0].trim();
            var dateParams = year + "-" + month + "-" + day + " " + time;
            return dateParams;
        },
        pageView: function(paradigm4Arr, recommendInfoItem) {
            //页面曝光
            var dateParams = this.commonParam();
            var userId = method.getCookie("userId") || method.getCookie("visitor_id");
            var clientToken = recommendInfoItem.token;
            // var serverUrl=this.url+'?clientToken=' + clientToken;  
            var serverUrl = this.url + "/" + clientToken;
            // 相关推荐
            var actionsRelevant = [];
            $(paradigm4Arr).each(function(index, item) {
                actionsRelevant.push({
                    itemId: item.id || item.itemId,
                    actionTime: new Date().getTime(),
                    action: "show",
                    itemSetId: recommendInfoItem.materialId || "",
                    //物料库的ID
                    sceneId: recommendInfoItem.useId,
                    //推荐服务的ID
                    userId: userId,
                    context: item.context,
                    requestId: recommendInfoItem.requestId,
                    lib: "pc-node",
                    deviceId: "pc-node"
                });
            });
            var data = {
                date: dateParams,
                actions: actionsRelevant
            };
            $ajax(serverUrl, "post", data).then(function(res) {
                console.log("paradigm4:", res);
            });
        },
        eventReport: function(itemId, paradigm4Arr, recommendInfoItem) {
            //点击上报
            var dateParams = this.commonParam();
            var userId = method.getCookie("userId") || method.getCookie("visitor_id");
            var clientToken = recommendInfoItem.token;
            // var serverUrl=this.url+'?clientToken=' + clientToken;
            var serverUrl = this.url + "/" + clientToken;
            var context = "";
            $(paradigm4Arr).each(function(index, item) {
                item.id == itemId || item.itemId == itemId ? context = item.context : "";
            });
            var params = {
                date: dateParams,
                actions: [ {
                    itemId: itemId,
                    actionTime: new Date().getTime(),
                    action: "detailPageShow",
                    itemSetId: recommendInfoItem.materialId || "",
                    sceneId: recommendInfoItem.useId,
                    userId: userId,
                    context: context,
                    requestId: recommendInfoItem.requestId,
                    lib: "pc-node",
                    deviceId: "pc-node"
                } ]
            };
            $ajax(serverUrl, "post", params).then(function(res) {
                console.log("paradigm4:", res);
            });
        }
    };
    return paradigm4;
});