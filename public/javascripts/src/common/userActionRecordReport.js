define(function (require, exports, module) {
    var method = require('../application/method');
    var api = require('../application/api');
    function Browse10s(params){
        if(method.getCookie('cuk')){
            setTimeout(function(){
                userActionRecordReport(params);
            }, 10*1000);
        }
    }
    function userActionRecordReport(params){
        var temp = $.extend({}, params, {
            reportTime:new Date().getTime(),
            uid:method.getCookie('userId')
        });
        $ajax(api.user.taskUserActionRecordReport, 'post', temp).then(function (res) {
            console.log('paradigm4:', res);
        });
    }
    return {
        Browse10s:Browse10s
    };
});
