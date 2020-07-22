define("dist/personalCenter/redirectionURL-debug", [ "../application/method-debug" ], function(require, exports, module) {
    var method = require("../application/method-debug");
    var code = method.getParam("code");
    var channel = method.getParam("channel");
    var clientCode = method.getParam("clientCode");
    window.opener.handleBindThird(code, channel, clientCode);
});