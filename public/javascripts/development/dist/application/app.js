/*! ishare_pc_website
*author:Jersey */
define("dist/application/app",["./method","./element","./template","./extend","../report/init","../report/handler","../cmd-lib/util","../report/columns","../report/config","./helper","//static3.iask.cn/resource/js/plugins/pc.iask.login.min"],function(a,b,c){var d=a("./method");return a("./element"),a("./extend"),a("../report/init"),window.template=a("./template"),a("./helper"),a("//static3.iask.cn/resource/js/plugins/pc.iask.login.min.js"),window.getCookie=d.getCookie,{method:d,v:"1.0.1"}}),define("dist/application/method",[],function(require,exports,module){return{keyMap:{ishare_detail_access:"ISHARE_DETAIL_ACCESS",ishare_office_detail_access:"ISHARE_OFFICE_DETAIL_ACCESS"},async:function(a,b,c,d,e){$.ajax(a,{type:d||"post",data:e,async:!1,dataType:"json",headers:{"cache-control":"no-cache",Pragma:"no-cache"}}).done(function(a){b&&b(a)}).fail(function(a){console.log("error==="+c)})},get:function(a,b,c){$.ajaxSetup({cache:!1}),this.async(a,b,c,"get")},post:function(a,b,c,d,e){this.async(a,b,c,d,e)},postd:function(a,b,c){this.async(a,b,!1,!1,c)},random:function(a,b){return Math.floor(Math.random()*(b-a))+a},setCookieWithExpPath:function(a,b,c,d){var e=new Date;e.setTime(e.getTime()+c),document.cookie=a+"="+escape(b)+";path="+d+";expires="+e.toGMTString()},setCookieWithExp:function(a,b,c,d){var e=new Date;e.setTime(e.getTime()+c),d?document.cookie=a+"="+escape(b)+";path="+d+";expires="+e.toGMTString():document.cookie=a+"="+escape(b)+";expires="+e.toGMTString()},getCookie:function(a){var b=document.cookie.match(new RegExp("(^| )"+a+"=([^;]*)(;|$)"));return null!==b?unescape(b[2]):null},delCookie:function(a,b,c){var d=new Date;d.setTime(d.getTime()-1);var e=this.getCookie(a);null!=e&&(b&&c?document.cookie=a+"= '' ;domain="+c+";expires="+d.toGMTString()+";path="+b:b?document.cookie=a+"= '' ;expires="+d.toGMTString()+";path="+b:document.cookie=a+"="+e+";expires="+d.toGMTString())},getQueryString:function(a){var b=new RegExp("(^|&)"+a+"=([^&]*)(&|$)","i"),c=window.location.search.substr(1).match(b);return null!=c?unescape(c[2]):null},url2Obj:function(a){for(var b={},c=a.split("?"),d=c[1].split("&"),e=0;e<d.length;e++){var f=d[e].split("=");b[f[0]]=f[1]}return b},getParam:function(a){a=a.replace(/[\[]/,"\\[").replace(/[\]]/,"\\]");var b="[\\?&]"+a+"=([^&#]*)",c=new RegExp(b),d=c.exec(window.location.href);return null==d?"":decodeURIComponent(d[1].replace(/\+/g," "))},getLocalData:function(a){try{if(localStorage&&localStorage.getItem){var b=localStorage.getItem(a);return null===b?null:JSON.parse(b)}return console.log("浏览器不支持html localStorage getItem"),null}catch(c){return null}},setLocalData:function(a,b){localStorage&&localStorage.setItem?(localStorage.removeItem(a),localStorage.setItem(a,JSON.stringify(b))):console.log("浏览器不支持html localStorage setItem")},browserType:function(){var a=navigator.userAgent,b=a.indexOf("Opera")>-1;return b?"Opera":a.indexOf("compatible")>-1&&a.indexOf("MSIE")>-1&&!b?"IE":a.indexOf("Edge")>-1?"Edge":a.indexOf("Firefox")>-1?"Firefox":a.indexOf("Safari")>-1&&-1===a.indexOf("Chrome")?"Safari":a.indexOf("Chrome")>-1&&a.indexOf("Safari")>-1?"Chrome":void 0},validateIE9:function(){return!(!$.browser.msie||"9.0"!==$.browser.version&&"8.0"!==$.browser.version&&"7.0"!==$.browser.version&&"6.0"!==$.browser.version)},compareTime:function(a,b){return a&&b?Math.abs((b-a)/1e3/60/60/24):""},changeURLPar:function(url,arg,arg_val){var pattern=arg+"=([^&]*)",replaceText=arg+"="+arg_val;if(url.match(pattern)){var tmp="/("+arg+"=)([^&]*)/gi";return tmp=url.replace(eval(tmp),replaceText)}return url.match("[?]")?url+"&"+replaceText:url+"?"+replaceText},getUrlAllParams:function(a){if("undefined"==typeof a)var b=decodeURI(location.search);else var b="?"+a.split("?")[1];var c=new Object;if(-1!=b.indexOf("?"))for(var d=b.substr(1),e=d.split("&"),f=0;f<e.length;f++)c[e[f].split("=")[0]]=decodeURI(e[f].split("=")[1]);return c},compatibleIESkip:function(a,b){var c=document.createElement("a");c.href=a,c.style.display="none",b&&(c.target="_blank"),document.body.appendChild(c),c.click()},testEmail:function(a){var b=/^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;return b.test(a)?!0:!1},testPhone:function(a){return/^1(3|4|5|7|8)\d{9}$/.test(a)?!0:!1}}}),define("dist/application/element",["dist/application/method","dist/application/template"],function(a,b,c){a("dist/application/method"),a("dist/application/template");if(window.pageConfig&&window.pageConfig.hotData){JSON.parse(window.pageConfig.hotData)}var d=function(a){var b={ele:a,init:function(){return this.ele[0].addEventListener("click",function(){$("html, body").animate({scrollTop:0},120)},!1),window.addEventListener("scroll",this,!1),this},handleEvent:function(a){var b=$(document).scrollTop();$(window).height();return b>100?this.ele.show():this.ele.hide(),b>10?$(".m-header").addClass("header-fix"):$(".m-header").removeClass("header-fix"),this}};b.init().handleEvent()};$("#backToTop").length&&d&&d($("#backToTop"))}),!function(){function a(a){return a.replace(t,"").replace(u,",").replace(v,"").replace(w,"").replace(x,"").split(/^$|,+/)}function b(a){return"'"+a.replace(/('|\\)/g,"\\$1").replace(/\r/g,"\\r").replace(/\n/g,"\\n")+"'"}function c(c,d){function e(a){return m+=a.split(/\n/).length-1,k&&(a=a.replace(/[\n\r\t\s]+/g," ").replace(/<!--.*?-->/g,"")),a&&(a=s[1]+b(a)+s[2]+"\n"),a}function f(b){var c=m;if(j?b=j(b,d):g&&(b=b.replace(/\n/g,function(){return m++,"$line="+m+";"})),0===b.indexOf("=")){var e=l&&!/^=[=#]/.test(b);if(b=b.replace(/^=[=#]?|[\s;]*$/g,""),e){var f=b.replace(/\s*\([^\)]+\)/,"");n[f]||/^(include|print)$/.test(f)||(b="$escape("+b+")")}else b="$string("+b+")";b=s[1]+b+s[2]}return g&&(b="$line="+c+";"+b),r(a(b),function(a){if(a&&!p[a]){var b;b="print"===a?u:"include"===a?v:n[a]?"$utils."+a:o[a]?"$helpers."+a:"$data."+a,w+=a+"="+b+",",p[a]=!0}}),b+"\n"}var g=d.debug,h=d.openTag,i=d.closeTag,j=d.parser,k=d.compress,l=d.escape,m=1,p={$data:1,$filename:1,$utils:1,$helpers:1,$out:1,$line:1},q="".trim,s=q?["$out='';","$out+=",";","$out"]:["$out=[];","$out.push(",");","$out.join('')"],t=q?"$out+=text;return $out;":"$out.push(text);",u="function(){var text=''.concat.apply('',arguments);"+t+"}",v="function(filename,data){data=data||$data;var text=$utils.$include(filename,data,$filename);"+t+"}",w="'console.log(3316)';var $utils=this,$helpers=$utils.$helpers,"+(g?"$line=0,":""),x=s[0],y="return new String("+s[3]+");";r(c.split(h),function(a){a=a.split(i);var b=a[0],c=a[1];1===a.length?x+=e(b):(x+=f(b),c&&(x+=e(c)))});var z=w+x+y;g&&(z="try{"+z+"}catch(e){throw {filename:$filename,name:'Render Error',message:e.message,line:$line,source:"+b(c)+".split(/\\n/)[$line-1].replace(/^[\\s\\t]+/,'')};}");try{var A=new Function("$data","$filename",z);return A.prototype=n,A}catch(B){throw B.temp="function anonymous($data,$filename) {"+z+"}",B}}var d=function(a,b){return"string"==typeof b?q(b,{filename:a}):g(a,b)};d.version="3.0.0",d.config=function(a,b){e[a]=b};var e=d.defaults={openTag:"<%",closeTag:"%>",escape:!0,cache:!0,compress:!1,parser:null},f=d.cache={};d.render=function(a,b){return q(a,b)};var g=d.renderFile=function(a,b){var c=d.get(a)||p({filename:a,name:"Render Error",message:"Template not found"});return b?c(b):c};d.get=function(a){var b;if(f[a])b=f[a];else if("object"==typeof document){var c=document.getElementById(a);if(c){var d=(c.value||c.innerHTML).replace(/^\s*|\s*$/g,"");b=q(d,{filename:a})}}return b};var h=function(a,b){return"string"!=typeof a&&(b=typeof a,"number"===b?a+="":a="function"===b?h(a.call(a)):""),a},i={"<":"&#60;",">":"&#62;",'"':"&#34;","'":"&#39;","&":"&#38;"},j=function(a){return i[a]},k=function(a){return h(a).replace(/&(?![\w#]+;)|[<>"']/g,j)},l=Array.isArray||function(a){return"[object Array]"==={}.toString.call(a)},m=function(a,b){var c,d;if(l(a))for(c=0,d=a.length;d>c;c++)b.call(a,a[c],c,a);else for(c in a)b.call(a,a[c],c)},n=d.utils={$helpers:{},$include:g,$string:h,$escape:k,$each:m};d.helper=function(a,b){o[a]=b};var o=d.helpers=n.$helpers;d.onerror=function(a){var b="Template Error\n\n";for(var c in a)b+="<"+c+">\n"+a[c]+"\n\n";"object"==typeof console&&console.error(b)};var p=function(a){return d.onerror(a),function(){return"{Template Error}"}},q=d.compile=function(a,b){function d(c){try{return new i(c,h)+""}catch(d){return b.debug?p(d)():(b.debug=!0,q(a,b)(c))}}b=b||{};for(var g in e)void 0===b[g]&&(b[g]=e[g]);var h=b.filename;try{var i=c(a,b)}catch(j){return j.filename=h||"anonymous",j.name="Syntax Error",p(j)}return d.prototype=i.prototype,d.toString=function(){return i.toString()},h&&b.cache&&(f[h]=d),d},r=n.$each,s="break,case,catch,continue,debugger,default,delete,do,else,false,finally,for,function,if,in,instanceof,new,null,return,switch,this,throw,true,try,typeof,var,void,while,with,abstract,boolean,byte,char,class,const,double,enum,export,extends,final,float,goto,implements,import,int,interface,long,native,package,private,protected,public,short,static,super,synchronized,throws,transient,volatile,arguments,let,yield,undefined",t=/\/\*[\w\W]*?\*\/|\/\/[^\n]*\n|\/\/[^\n]*$|"(?:[^"\\]|\\[\w\W])*"|'(?:[^'\\]|\\[\w\W])*'|[\s\t\n]*\.[\s\t\n]*[$\w\.]+/g,u=/[^\w$]+/g,v=new RegExp(["\\b"+s.replace(/,/g,"\\b|\\b")+"\\b"].join("|"),"g"),w=/^\d[^,]*|,\d[^,]*/g,x=/^,+|,+$/g;e.openTag="{{",e.closeTag="}}";var y=function(a,b){var c=b.split(":"),d=c.shift(),e=c.join(":")||"";return e&&(e=", "+e),"$helpers."+d+"("+a+e+")"};e.parser=function(a,b){a=a.replace(/^\s/,"");var c=a.split(" "),e=c.shift(),f=c.join(" ");switch(e){case"if":a="if("+f+"){";break;case"else":c="if"===c.shift()?" if("+c.join(" ")+")":"",a="}else"+c+"{";break;case"/if":a="}";break;case"each":var g=c[0]||"$data",h=c[1]||"as",i=c[2]||"$value",j=c[3]||"$index",k=i+","+j;"as"!==h&&(g="[]"),a="$each("+g+",function("+k+"){";break;case"/each":a="});";break;case"echo":a="print("+f+");";break;case"print":case"include":a=e+"("+c.join(",")+");";break;default:if(-1!==f.indexOf("|")){var l=b.escape;0===a.indexOf("#")&&(a=a.substr(1),l=!1);for(var m=0,n=a.split("|"),o=n.length,p=l?"$escape":"$string",q=p+"("+n[m++]+")";o>m;m++)q=y(q,n[m]);a="=#"+q}else a=d.helpers[e]?"=#"+e+"("+c.join(",")+");":"="+a}return a},"function"==typeof define?define("dist/application/template",[],function(){return d}):"undefined"!=typeof exports?module.exports=d:this.template=d}(),define("dist/application/extend",[],function(a,b,c){String.prototype.format||(String.prototype.format=function(){var a=arguments;return this.replace(/{(\d+)}/g,function(b,c){return"undefined"!=typeof a[c]?a[c]:b})}),String.prototype.trim||(String.prototype.trim=function(){return this.replace(/^\s*/,"").replace(/\s*$/,"")}),String.prototype.stripTags||(String.prototype.stripTags=function(){return this.replace(/<\/?[^>]+>/gi,"")})}),define("dist/report/init",["dist/report/handler","dist/cmd-lib/util","dist/report/columns","dist/report/config","dist/application/method"],function(a,b,c){a("dist/report/handler")}),define("dist/report/handler",["dist/cmd-lib/util","dist/report/columns","dist/report/config","dist/application/method"],function(a,b,c){function d(a,b){this.options=$.extend(!0,g,a),this.config=$.extend(!0,h,b),this.init()}var e,f=a("dist/cmd-lib/util"),g=a("dist/report/columns"),h=a("dist/report/config"),i=a("dist/application/method");d.prototype={init:function(){this.client(),this.send(0,this.format()),this.send(2,(new Date).getTime()),gio&&pageConfig.report&&gio("page.set",pageConfig.report)},client:function(){var a="";pageConfig.page&&(a=pageConfig.page.uid||""),!a&&i.getCookie(this.config.COOKIE_CUK)&&(a="logined"),this.options.uid=a,i.getCookie(this.config.COOKIE_CIDE)?e=i.getCookie(this.config.COOKIE_CIDE):(e=(new Date).getTime()+""+Math.random(),i.setCookieWithExpPath(this.options.cid,e,2592e6,"/")),this.options.usource=f.getReferrer(),this.options.cid=e,this.clickWatch()},getIpAddress:function(){var a=this;$.getScript("//ipip.iask.cn/iplookup/search?format=js",function(b,c){"success"===c?a.options=$.extend(!0,a.options,{city:remote_ip_info.cityCode,province:remote_ip_info.provinceCode,ip:remote_ip_info.ip}):console.error("ipip获取ip信息error")})},clickWatch:function(){var a=this;$(document).delegate("."+this.config.EVENT_NAME,"click",function(b){var c=$(this).attr(a.config.CONTENT_NAME);a.setCurrEventCon(c),($.browser.msie&&$.browser.version<=8&&a.mousePosition(b).x>=0||b.originalEvent&&b.originalEvent.isTrusted)&&c&&a.push([a.config.CONTENT_NAME,c]),$(this).trigger("init",b)})},gioTrack:function(a,b){gio&&b&&gio("track",a,b)},gioPage:function(a){gio&&a&&gio("page.set",a)},push:function(a,b){a instanceof Array&&a&&a.length>1&&(a.shift(),a.length>0&&a[0]==this.config.eventCookieFlag&&(a.shift(),this.handleCookieFlag(a.join("_"))),this.options.clickName=a[0]);var c=this.format();this.send(1,c),b&&b(c)},handleCookieFlag:function(a){try{var b=i.getCookie(this.config.COOKIE_FLAG);if(b){var c=JSON.parse(b);c.v=a,c.t=(new Date).getTime(),i.setCookieWithExpPath(this.config.COOKIE_FLAG,JSON.stringify(c),3e6,"/")}}catch(d){}},format:function(){try{var a=this.options,b=[a.cid,a.uid,a.ptype,a.usource,a.fsource,a.ftype,a.format,a.cate,a.cateName,a.cate1,a.cate2,a.ip,a.province,a.city,a.clickName,a.time,a.timestamp];return b.join("_")}catch(c){}},send:function(a,b){i.get(this.config.SERVER_URL+"?"+a+"_"+encodeURIComponent(b),function(){},"")},mousePosition:function(a){try{return a=a||window.event,a.pageX||a.pageY?{x:a.pageX,y:a.pageY}:{x:a.clientX+document.body.scrollLeft-document.body.clientLeft,y:a.clientY+document.body.scrollTop-document.body.clientTop}}catch(b){}},uActionReport:function(a){$.get(this.uActionUrl+"?"+encodeURIComponent(a)+"_"+(new Date).getTime(),function(a,b){})},setCurrEventCon:function(a){i.setCookieWithExpPath("_dpclkcnt",a,3e5,"/")}},window._dataReport=new d(window.pageConfig.report),window.__pc__=window._dataReport;try{!function(){var a=document.createElement("script");a.src="//hm.baidu.com/hm.js?adb0f091db00ed439bf000f2c5cbaee7";var b=document.getElementsByTagName("script")[0];b.parentNode.insertBefore(a,b)}()}catch(j){}}),define("dist/cmd-lib/util",[],function(a,b,c){var d={throttle:function(a,b){var c,d;return function(e){var f=this,g=arguments,h=+new Date;c&&c+b>h?(clearTimeout(d),d=setTimeout(function(){c=h,a.apply(f,g)},b)):(c=h,a.apply(f,g))}},debounce:function(a,b){var c=0,d=this;return function(e){c&&clearTimeout(c),c=setTimeout(function(){a.apply(d,e)},b)}},isWeChatBrow:function(){var a=navigator.userAgent.toLowerCase(),b=-1!=a.indexOf("micromessenger");return b?!0:!1},getWebAppUA:function(){var a=0,b=navigator.userAgent.toLowerCase();return/iphone|ipad|ipod/.test(b)?a=1:/android/.test(b)&&(a=0),a},validateIE8:function(){return!$.browser.msie||"8.0"!=$.browser.version&&"7.0"!=$.browser.version&&"6.0"!=$.browser.version?!1:!0},validateIE9:function(){return!$.browser.msie||"9.0"!=$.browser.version&&"8.0"!=$.browser.version&&"7.0"!=$.browser.version&&"6.0"!=$.browser.version?!1:!0},getReferrer:function(){var a=document.referrer,b="";return/https?\:\/\/[^\s]*wenku.so.com.*$/g.test(a)?b="360wenku":/https?\:\/\/[^\s]*so.com.*$/g.test(a)?b="360":/https?\:\/\/[^\s]*baidu.com.*$/g.test(a)?b="baidu":/https?\:\/\/[^\s]*sogou.com.*$/g.test(a)?b="sogou":/https?\:\/\/[^\s]*sm.cn.*$/g.test(a)?b="sm":/https?\:\/\/[^\s]*ishare.iask.sina.com.cn.*$/g.test(a)?b="ishare":/https?\:\/\/[^\s]*iask.sina.com.cn.*$/g.test(a)&&(b="iask"),b},getPageRef:function(a){var b=this,c=0;return(b.is360cookie(a)||b.is360cookie("360"))&&(c=1),b.is360wkCookie()&&(c=3),c},is360cookie:function(a){var b=this,c=b.getCookie("_r_so");if(c)for(var d=c.split("_"),e=0;e<d.length;e++)if(d[e]==a)return!0;return!1},add360wkCookie:function(){this.setCookieWithExpPath("_360hz","1",18e5,"/")},is360wkCookie:function(){return null==getCookie("_360hz")?!1:!0},getCookie:function(a){var b=document.cookie.match(new RegExp("(^| )"+a+"=([^;]*)(;|$)"));return null!==b?unescape(b[2]):null},setCookieWithExpPath:function(a,b,c,d){var e=new Date;e.setTime(e.getTime()+c),document.cookie=a+"="+escape(b)+";path="+d+";expires="+e.toGMTString()},findRefer:function(){var a=document.referrer,b="other";return/https?\:\/\/[^\s]*\/f\/.*$/g.test(a)?b="pindex":/https?\:\/\/[^\s]*\/d\/.*$/g.test(a)?b="landing":/https?\:\/\/[^\s]*\/c\/.*$/g.test(a)?b="pcat":/https?\:\/\/[^\s]*\/search\/.*$/g.test(a)?b="psearch":/https?\:\/\/[^\s]*\/t\/.*$/g.test(a)?b="ptag":/https?\:\/\/[^\s]*\/[u|n]\/.*$/g.test(a)?b="popenuser":/https?\:\/\/[^\s]*\/ucenter\/.*$/g.test(a)?b="puser":/https?\:\/\/[^\s]*ishare.iask.sina.com.cn.$/g.test(a)?b="ishareindex":/https?\:\/\/[^\s]*\/theme\/.*$/g.test(a)?b="theme":/https?\:\/\/[^\s]*wenku.so.com.*$/g.test(a)?b="360wenku":/https?\:\/\/[^\s]*so.com.*$/g.test(a)?b="360":/https?\:\/\/[^\s]*baidu.com.*$/g.test(a)?b="baidu":/https?\:\/\/[^\s]*sogou.com.*$/g.test(a)?b="sogou":/https?\:\/\/[^\s]*sm.cn.*$/g.test(a)?b="sm":/https?\:\/\/[^\s]*ishare.iask.sina.com.cn.*$/g.test(a)?b="ishare":/https?\:\/\/[^\s]*iask.sina.com.cn.*$/g.test(a)&&(b="iask"),b},showAlertDialog:function(a,b,c){var d=$(".common-bgMask"),e=$(".common-dialog");e.find("h2[name='title']").text(a),e.find("span[name='content']").html(b),e.find("a.close,a.btn-dialog").unbind("click").click(function(){d.hide(),e.hide(),c&&!$(this).hasClass("close")&&c()}),d.show(),e.show()},browserVersion:function(a){var b=a.indexOf("Opera")>-1,c=a.indexOf("compatible")>-1&&a.indexOf("MSIE")>-1&&!b,d=a.indexOf("Edge")>-1,e=a.indexOf("Firefox")>-1,f=a.indexOf("Safari")>-1&&-1===a.indexOf("Chrome"),g=a.indexOf("Chrome")>-1&&a.indexOf("Safari")>-1;if(c){var h=new RegExp("MSIE (\\d+\\.\\d+);");h.test(a);var i=parseFloat(RegExp.$1);return 7===i?"IE7":8===i?"IE8":9===i?"IE9":10===i?"IE10":11===i?"IE11":12===i?"IE12":"IE"}return b?"Opera":d?"Edge":e?"Firefox":f?"Safari":g?"Chrome":"unKnow"},getBrowserInfo:function(a){var b={},c=a.toLowerCase(),d=/(msie|firefox|chrome|opera|version|trident).*?([\d.]+)/,e=c.match(d);return e&&e.length>=2?(b.browser=e[1].replace(/version/,"'safari")||"unknow",b.ver=e[2]||"1.0.0"):(b.browser="unknow",b.ver="1.0.0"),b.browser+"/"+b.ver}};c.exports=d}),define("dist/report/columns",[],function(a,b,c){return{cid:"",uid:"",ptype:"",usource:"",fsource:"",ftype:"",format:"",cate:"",cateName:"",cate1:"",cate2:"",ip:"",province:"",city:"",clickName:"",time:"",timestamp:""}}),define("dist/report/config",[],function(a,b,c){return{COOKIE_FLAG:"_dplf",COOKIE_CIDE:"_dpcid",COOKIE_CUK:"cuk",COOKIE_TIMEOUT:3e6,SERVER_URL:"/dataReport",UACTION_URL:"/uAction",EVENT_NAME:"pc_click",CONTENT_NAME:"pcTrackContent",BILOG_CONTENT_NAME:"bilogContent",ishareTrackEvent:"_ishareTrackEvent",eventCookieFlag:"_eventCookieFlag",EVENT_REPORT:!1,AUTO_PV:!1}}),define("dist/application/helper",[],function(a,b,c){template.helper("encodeValue",function(a){return encodeURIComponent(encodeURIComponent(a))})});