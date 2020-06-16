define(function(require , exports , module){
    var homeRecentlySee = require("./template/homeRecentlySee.html")
    var _homeRecentlySeeTemplate = template.compile(homeRecentlySee)({});
    $(".recently-see").html(_homeRecentlySeeTemplate);
    $(".recently-downloads").html(_homeRecentlySeeTemplate)
});