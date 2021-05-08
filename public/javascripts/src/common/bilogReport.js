/**
 * 自由埋点数据上报
 */
define(function (require, exports, module) {

    function trackEvent(evnetID, eventName, eventType, params, isNoTimeout) {
        if (isNoTimeout) {
            iask_web.track_event(evnetID, eventName, eventType, params);
        } else {
            setTimeout(function () {
                iask_web.track_event(evnetID, eventName, eventType, params);
            }, 350);
        }
    }

    function trackEventLogin(userId) {
        iask_web.login(userId);
    }

    return {
        trackEvent: trackEvent,
        trackEventLogin: trackEventLogin
    };
});
