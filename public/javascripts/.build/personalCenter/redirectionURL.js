define("dist/personalCenter/redirectionURL", [ "../application/method" ], function(require, exports, module) {
    var method = require("../application/method");
    var code = method.getParam("code");
    var channel = method.getParam("channel");
    var clientCode = method.getParam("clientCode");
    window.opener.handleBindThird(code, channel, clientCode);
});