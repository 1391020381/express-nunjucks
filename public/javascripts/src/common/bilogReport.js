/**
 * 自由埋点数据上报
 */
define(function (require, exports, module) {
    
    function trackEvent(evnetID,eventName,eventType,params){
        setTimeout(function(){
            iask_web.track_event(evnetID, eventName, eventType, params);
        },350)
       // iask_web.track_event(evnetID, eventName, eventType, params);
    }
    function trackEventLogin(userId){
        iask_web.login(userId)
    } 
    return {
        trackEvent:trackEvent,
        trackEventLogin:trackEventLogin
    }
});