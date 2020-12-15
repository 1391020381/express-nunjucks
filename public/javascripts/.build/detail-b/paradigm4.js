/**
 * 第四范式操作数据上报
 */
define("dist/detail-b/paradigm4", [], function(require, exports, module) {
    if (window.paradigm4.paradigm4Guess || window.paradigm4.paradigm4Relevant) {
        setTimeout(function() {
            action();
        });
    }
    // 行为上报方法
    function action() {
        var clientToken = "689a073a474249da8a7e7c04a3d7c7eb";
        var date = new Date();
        var year = date.getFullYear();
        var mon = date.getMonth() + 1;
        var month = mon > 9 ? mon : "0" + mon;
        var day = date.getDate() > 9 ? date.getDate() : "0" + date.getDate();
        var time = date.toTimeString().split("GMT")[0].trim();
        var dateParams = year + "-" + month + "-" + day + " " + time;
        var paradigm4 = window.paradigm4 || {};
        var paradigm4Guess = paradigm4.paradigm4Guess || [];
        var requestID_rele = paradigm4.requestID_rele || "";
        var requestID_guess = paradigm4.requestID_guess || "";
        var paradigm4Relevant = paradigm4.paradigm4Relevant || [];
        var recommendInfoData_rele = paradigm4.recommendInfoData_rele || {};
        var recommendInfoData_guess = paradigm4.recommendInfoData_guess || {};
        var sceneIDRelevant = recommendInfoData_rele.useId || "";
        var sceneIDGuess = recommendInfoData_guess.useId || "";
        var userId = paradigm4.userId;
        // 相关推荐
        var actionsRelevant = [];
        if (paradigm4Relevant != "null" && paradigm4Relevant) {
            paradigm4Relevant.forEach(function(item) {
                actionsRelevant.push({
                    itemId: item.item_id,
                    actionTime: date.getTime(),
                    action: "show",
                    itemSetId: recommendInfoData_rele.materialId || "",
                    sceneId: sceneIDRelevant,
                    userId: userId,
                    context: item.context,
                    requestId: requestID_rele
                });
            });
        }
        // 猜你喜欢
        var actionsGuess = [];
        if (paradigm4Guess != "null" && paradigm4Guess) {
            paradigm4Guess.forEach(function(item) {
                actionsGuess.push({
                    itemId: item.item_id,
                    actionTime: date.getTime(),
                    action: "show",
                    itemSetId: recommendInfoData_guess.materialId || "",
                    sceneId: sceneIDGuess,
                    userId: userId,
                    context: item.context,
                    requestId: requestID_guess
                });
            });
        }
        var data = JSON.stringify({
            date: dateParams,
            actions: [].concat(actionsRelevant, actionsGuess)
        });
        $.post("https://nbrecsys.4paradigm.com/action/api/log?clientToken=" + clientToken, data, function(data) {});
        //猜你喜欢点击
        $(".guessyoulike").find(".item").click(function() {
            var itemId = $(this).data("id") || "";
            var context = "";
            for (var i = 0; i < paradigm4Guess.length; i++) {
                if (paradigm4Guess[i].item_id == itemId) {
                    context = paradigm4Guess[i].context;
                    break;
                }
            }
            var date = new Date();
            var time = date.toTimeString().split("GMT")[0].trim();
            var dateParams = year + "-" + month + "-" + day + " " + time;
            var guessyoulikeData = JSON.stringify({
                date: dateParams,
                actions: [ {
                    itemId: itemId,
                    actionTime: date.getTime(),
                    action: "detailPageShow",
                    itemSetId: recommendInfoData_guess.materialId || "",
                    sceneId: sceneIDGuess,
                    userId: userId,
                    context: context,
                    requestId: requestID_guess
                } ]
            });
            $.post("https://nbrecsys.4paradigm.com/action/api/log?clientToken=" + clientToken, guessyoulikeData, function(data) {});
        });
        //相关推荐点击
        $(".related-data-list").find("li").click(function() {
            var itemId = $(this).data("id") || "";
            var context = "";
            for (var i = 0; i < paradigm4Relevant.length; i++) {
                if (paradigm4Relevant[i].item_id == itemId) {
                    context = paradigm4Relevant[i].context;
                    break;
                }
            }
            var date = new Date();
            var time = date.toTimeString().split("GMT")[0].trim();
            var dateParams = year + "-" + month + "-" + day + " " + time;
            var paradigm4RelevantData = JSON.stringify({
                date: dateParams,
                actions: [ {
                    itemId: itemId,
                    actionTime: date.getTime(),
                    action: "detailPageShow",
                    itemSetId: recommendInfoData_rele.materialId || "",
                    sceneId: sceneIDRelevant,
                    userId: userId,
                    context: context,
                    requestId: requestID_rele
                } ]
            });
            $.post("https://nbrecsys.4paradigm.com/action/api/log?clientToken=" + clientToken, paradigm4RelevantData, function(data) {});
            var params = window.pageConfig.params;
            iask_web.track_event("NE017", "fileListNormalClick", "click", {
                moduleID: "guesslike",
                moduleName: "猜你喜欢",
                filePostion: $(this).index() + 1,
                salePrice: params.productPrice,
                saleType: params.productType,
                fileCategoryID: params.classid1 + "||" + params.classid2 + "||" + params.classid3,
                fileCategoryName: params.classidName1 + "||" + params.classidName2 + "||" + params.classidName3
            });
        });
    }
});