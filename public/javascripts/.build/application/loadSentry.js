define("dist/application/loadSentry", [ "../application/method" ], function(require, exports, module) {
    var method = require("../application/method");
    var dtd = $.Deferred();
    // 新建一个deferred对象
    function loadScript(url) {
        var script = document.createElement("script");
        script.type = "text/javascript";
        if (script.readyState) {
            //IE
            script.onreadystatechange = function() {
                if (script.readyState == "loaded" || script.readyState == "complete") {
                    script.onreadystatechange = null;
                    // callback();
                    dtd.resolve();
                }
            };
        } else {
            //Others
            script.onload = function() {
                //callback();
                dtd.resolve();
            };
        }
        script.src = url;
        document.getElementsByTagName("head")[0].appendChild(script);
        return dtd;
    }
    if (!method.isIe8()) {
        var cdnUrl = window._head;
        var url1 = cdnUrl ? "/" + cdnUrl + "/javascripts/sea-modules/sentry/sentry-5.27.6-bundle.min.js" : "/javascripts/sea-modules/sentry/sentry-5.27.6-bundle.min.js";
        var url2 = cdnUrl ? "/" + cdnUrl + "/javascripts/sea-modules/sentry/sentry-tracing-5.27.6-bundle.tracing.min.js" : "/javascripts/sea-modules/sentry/sentry-tracing-5.27.6-bundle.tracing.min.js";
        var url3 = cdnUrl ? "/" + cdnUrl + "/javascripts/sea-modules/sentry/sentry-3.26.4-raven.min.js" : "/javascripts/sea-modules/sentry/sentry-3.26.4-raven.min.js";
        loadScript(url1).then(function() {
            loadScript(url2).then(function() {
                setTimeout(function() {
                    Sentry.init({
                        dsn: "http://1c2e7350f62e41f581a7b24026a0ff10@192.168.1.199:9000/2",
                        release: "node-pc@" + .01,
                        integrations: Sentry.Integrations.BrowserTracing ? [ new Sentry.Integrations.BrowserTracing() ] : [],
                        tracesSampleRate: 1,
                        autoSessionTracking: true
                    });
                }, 200);
            });
        });
    }
});