/*! ishare_pc_website
*author:Jersey */
define("dist/login/loginMiddle",["../application/iframe/iframe-child","../application/iframe/messenger"],function(a,b,c){a("../application/iframe/iframe-child")}),define("dist/application/iframe/iframe-child",["dist/application/iframe/messenger"],function(a){function b(a){var b=this;this.messenger=new c(a.id,a.projectName),this.timeOut=864e5,this.messenger.addTarget(window.parent,a.ssoId),this.messenger.listen(function(a){var c=JSON.parse(a);console.log("服务端sso传回数据",c),c&&c.token?b.setJsCode(a,c.expires):b.delJsCode()})}var c=a("dist/application/iframe/messenger");b.prototype.setJsCode=function(a,b){if(this.isEmpty(a))throw new Error("缺少【jsCode】参数值");this.timeOut=this.isEmpty(b)?this.timeOut:b,this.setCookie("cuk",a,this.timeOut,"/")},b.prototype.delJsCode=function(){this.delCookie("cuk","/")},b.prototype.getCookie=function(a){var b=document.cookie.match(new RegExp("(^| )"+a+"=([^;]*)(;|$)"));return null!==b?unescape(b[2]):null},b.prototype.setCookie=function(a,b,c,d){var e=new Date;e.setTime(e.getTime()+c),document.cookie=a+"="+escape(b)+";path="+d+";expires="+e.toGMTString()},b.prototype.delCookie=function(a,b,c){var d=new Date;d.setTime(d.getTime()-1);var e=this.getCookie(a);null!=e&&(b&&c?document.cookie=a+"= '' ;domain="+c+";expires="+d.toGMTString()+";path="+b:b?document.cookie=a+"= '' ;expires="+d.toGMTString()+";path="+b:document.cookie=a+"="+e+";expires="+d.toGMTString())},b.prototype.isEmpty=function(a){return null==a||""==a||0==a.length||void 0==a||"undefined"==a?!0:!1}}),define("dist/application/iframe/messenger",[],function(){function a(a,b,c){var d="";if(arguments.length<2?d="target error - target and name are both required":"object"!=typeof a?d="target error - target itself must be window object":"string"!=typeof b&&(d="target error - target name must be string type"),d)throw new Error(d);this.target=a,this.name=b,this.prefix=c}function b(a,b){this.targets={},this.name=a,this.listenFunc=[],this.prefix=b||c,this.initListen()}var c="[PROJECT_NAME]",d="postMessage"in window;return d?a.prototype.send=function(a){this.target.postMessage(this.prefix+"|"+this.name+"__Messenger__"+a,"*")}:a.prototype.send=function(a){var b=window.navigator[this.prefix+this.name];if("function"!=typeof b)throw new Error("target callback function is not defined");b(this.prefix+a,window)},b.prototype.addTarget=function(b,c){var d=new a(b,c,this.prefix);this.targets[c]=d},b.prototype.initListen=function(){var a=this,b=function(b){if("object"==typeof b&&b.data&&(b=b.data),"string"==typeof b)for(var c=b.split("__Messenger__"),b=c[1],d=c[0].split("|"),e=d[0],f=d[1],g=0;g<a.listenFunc.length;g++)e+f===a.prefix+a.name&&a.listenFunc[g](b)};d?"addEventListener"in document?window.addEventListener("message",b,!1):"attachEvent"in document&&window.attachEvent("onmessage",b):window.navigator[this.prefix+this.name]=b},b.prototype.listen=function(a){for(var b=0,c=this.listenFunc.length,d=!1;c>b;b++)if(this.listenFunc[b]==a){d=!0;break}d||this.listenFunc.push(a)},b.prototype.clear=function(){this.listenFunc=[]},b.prototype.send=function(a){var b,c=this.targets;for(b in c)c.hasOwnProperty(b)&&c[b].send(a)},b});