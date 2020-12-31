
define(function (require, exports, module) {
 var method = require('../application/method')   
var dtd = $.Deferred(); // 新建一个deferred对象

function loadScript(url) {

    var script = document.createElement("script")
    script.type = "text/javascript";
  
    if (script.readyState) { //IE
      script.onreadystatechange = function() {
        if (script.readyState == "loaded" ||
          script.readyState == "complete") {
          script.onreadystatechange = null;
         // callback();
         　dtd.resolve(); // 改变deferred对象的执行状态
        }
      };
    } else { //Others
      script.onload = function() {
        //callback();
        　dtd.resolve(); // 改变deferred对象的执行状态
      };
    }
  
    script.src = url;
    document.getElementsByTagName("head")[0].appendChild(script);
    return dtd
  }
 
  if(method.isIe8()){
    var cdnUrl = window._head 
    var env = window.env
    var url1 =  cdnUrl? '/' + cdnUrl + "/javascripts/sea-modules/sentry/sentry-5.27.6-bundle.min.js":"/javascripts/sea-modules/sentry/sentry-5.27.6-bundle.min.js"
    var url2 = cdnUrl? '/' + cdnUrl + "/javascripts/sea-modules/sentry/sentry-tracing-5.27.6-bundle.tracing.min.js":"/javascripts/sea-modules/sentry/sentry-tracing-5.27.6-bundle.tracing.min.js"
    var url3 = cdnUrl? '/' + cdnUrl + "/javascripts/sea-modules/sentry/sentry-3.26.4-raven.min.js":"/javascripts/sea-modules/sentry/sentry-3.26.4-raven.min.js"
    loadScript(url1).then(function(){
        
        loadScript(url2).then(function(){
            
            setTimeout(function(){
              if(Sentry){
                Sentry.init({
                  dsn: (env =='pre'||env == 'prod')?"https://c37a5f8c8d9b44f9ab05398cbbfa2dd8@sentry-ishare.iask.com.cn/2":"http://1c2e7350f62e41f581a7b24026a0ff10@192.168.1.199:9000/2",
                  release: "node-pc@" + 0.01,
                 integrations: Sentry.Integrations.BrowserTracing?[new Sentry.Integrations.BrowserTracing()]:[],
                  tracesSampleRate: 1.0,
                  autoSessionTracking: true
                });
              }
             
                //   console.log(333333333333333333)
                //   Sentry.captureException(JSON.stringify({
                //     a:3333,
                //     url:location.href,
                //     params:JSON.stringify({a:1,b:2}),
                //     data:{d:1}
                // }),{
                //   tags: {
                //     title: "4444",
                //   }
                // })
            },100)
        })
    })  
}
  
})

  