/*! ishare_pc_website
*author:Jersey */
define("dist/application/app",["./method","./element","./template","./extend","../common/bilog","base64","../cmd-lib/util","../report/config","../report/init","../report/handler","../report/columns","./helper","//static3.iask.cn/resource/js/plugins/pc.iask.login.min"],function(a,b,c){var d=a("./method");a("./element"),a("./extend");var e=a("../common/bilog");return a("../report/init"),window.template=a("./template"),a("./helper"),a("//static3.iask.cn/resource/js/plugins/pc.iask.login.min.js"),window.getCookie=d.getCookie,{method:d,v:"1.0.1",bilog:e}}),define("dist/application/method",[],function(require,exports,module){return{keyMap:{ishare_detail_access:"ISHARE_DETAIL_ACCESS",ishare_office_detail_access:"ISHARE_OFFICE_DETAIL_ACCESS"},async:function(a,b,c,d,e){$.ajax(a,{type:d||"post",data:e,async:!1,dataType:"json",headers:{"cache-control":"no-cache",Pragma:"no-cache"}}).done(function(a){b&&b(a)}).fail(function(a){console.log("error==="+c)})},get:function(a,b,c){$.ajaxSetup({cache:!1}),this.async(a,b,c,"get")},post:function(a,b,c,d,e){this.async(a,b,c,d,e)},postd:function(a,b,c){this.async(a,b,!1,!1,c)},random:function(a,b){return Math.floor(Math.random()*(b-a))+a},setCookieWithExpPath:function(a,b,c,d){var e=new Date;e.setTime(e.getTime()+c),document.cookie=a+"="+escape(b)+";path="+d+";expires="+e.toGMTString()},setCookieWithExp:function(a,b,c,d){var e=new Date;e.setTime(e.getTime()+c),d?document.cookie=a+"="+escape(b)+";path="+d+";expires="+e.toGMTString():document.cookie=a+"="+escape(b)+";expires="+e.toGMTString()},getCookie:function(a){var b=document.cookie.match(new RegExp("(^| )"+a+"=([^;]*)(;|$)"));return null!==b?unescape(b[2]):null},delCookie:function(a,b,c){var d=new Date;d.setTime(d.getTime()-1);var e=this.getCookie(a);null!=e&&(b&&c?document.cookie=a+"= '' ;domain="+c+";expires="+d.toGMTString()+";path="+b:b?document.cookie=a+"= '' ;expires="+d.toGMTString()+";path="+b:document.cookie=a+"="+e+";expires="+d.toGMTString())},getQueryString:function(a){var b=new RegExp("(^|&)"+a+"=([^&]*)(&|$)","i"),c=window.location.search.substr(1).match(b);return null!=c?unescape(c[2]):null},url2Obj:function(a){for(var b={},c=a.split("?"),d=c[1].split("&"),e=0;e<d.length;e++){var f=d[e].split("=");b[f[0]]=f[1]}return b},getParam:function(a){a=a.replace(/[\[]/,"\\[").replace(/[\]]/,"\\]");var b="[\\?&]"+a+"=([^&#]*)",c=new RegExp(b),d=c.exec(window.location.href);return null==d?"":decodeURIComponent(d[1].replace(/\+/g," "))},getLocalData:function(a){try{if(localStorage&&localStorage.getItem){var b=localStorage.getItem(a);return null===b?null:JSON.parse(b)}return console.log("浏览器不支持html localStorage getItem"),null}catch(c){return null}},setLocalData:function(a,b){localStorage&&localStorage.setItem?(localStorage.removeItem(a),localStorage.setItem(a,JSON.stringify(b))):console.log("浏览器不支持html localStorage setItem")},browserType:function(){var a=navigator.userAgent,b=a.indexOf("Opera")>-1;return b?"Opera":a.indexOf("compatible")>-1&&a.indexOf("MSIE")>-1&&!b?"IE":a.indexOf("Edge")>-1?"Edge":a.indexOf("Firefox")>-1?"Firefox":a.indexOf("Safari")>-1&&-1===a.indexOf("Chrome")?"Safari":a.indexOf("Chrome")>-1&&a.indexOf("Safari")>-1?"Chrome":void 0},validateIE9:function(){return!(!$.browser.msie||"9.0"!==$.browser.version&&"8.0"!==$.browser.version&&"7.0"!==$.browser.version&&"6.0"!==$.browser.version)},compareTime:function(a,b){return a&&b?Math.abs((b-a)/1e3/60/60/24):""},changeURLPar:function(url,arg,arg_val){var pattern=arg+"=([^&]*)",replaceText=arg+"="+arg_val;if(url.match(pattern)){var tmp="/("+arg+"=)([^&]*)/gi";return tmp=url.replace(eval(tmp),replaceText)}return url.match("[?]")?url+"&"+replaceText:url+"?"+replaceText},getUrlAllParams:function(a){if("undefined"==typeof a)var b=decodeURI(location.search);else var b="?"+a.split("?")[1];var c=new Object;if(-1!=b.indexOf("?"))for(var d=b.substr(1),e=d.split("&"),f=0;f<e.length;f++)c[e[f].split("=")[0]]=decodeURI(e[f].split("=")[1]);return c},getQueryString:function(a){var b=new RegExp("(^|&)"+a+"=([^&]*)(&|$)","i"),c=window.location.search.substr(1).match(b);return null!=c?unescape(c[2]):null},compatibleIESkip:function(a,b){var c=document.createElement("a");c.href=a,c.style.display="none",b&&(c.target="_blank"),document.body.appendChild(c),c.click()},testEmail:function(a){var b=/^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;return b.test(a)?!0:!1},testPhone:function(a){return/^1(3|4|5|7|8)\d{9}$/.test(a)?!0:!1},handleRecommendData:function(a){var b=[];return a.forEach(function(a){var c={};1==a.type&&(a.linkUrl="/f/"+a.tprId+".html",c=a),2==a.type&&(c=a),3==a.type&&(a.linkUrl="/node/s/"+a.tprId+".html",c=a),b.push(c)}),console.log(b),b},formatDate:function(a){var b={"M+":this.getMonth()+1,"d+":this.getDate(),"h+":this.getHours(),"m+":this.getMinutes(),"s+":this.getSeconds(),"q+":Math.floor((this.getMonth()+3)/3),S:this.getMilliseconds()};/(y+)/.test(a)&&(a=a.replace(RegExp.$1,(this.getFullYear()+"").substr(4-RegExp.$1.length)));for(var c in b)new RegExp("("+c+")").test(a)&&(a=a.replace(RegExp.$1,1==RegExp.$1.length?b[c]:("00"+b[c]).substr((""+b[c]).length)));return a}}}),define("dist/application/element",["dist/application/method","dist/application/template"],function(a,b,c){a("dist/application/method"),a("dist/application/template");if(window.pageConfig&&window.pageConfig.hotData){JSON.parse(window.pageConfig.hotData)}var d=function(a){var b={ele:a,init:function(){return this.ele[0].addEventListener("click",function(){$("html, body").animate({scrollTop:0},120)},!1),window.addEventListener("scroll",this,!1),this},handleEvent:function(a){var b=$(document).scrollTop();$(window).height();return b>100?this.ele.show():this.ele.hide(),b>10?$(".m-header").addClass("header-fix"):$(".m-header").removeClass("header-fix"),this}};b.init().handleEvent()};$("#backToTop").length&&d&&d($("#backToTop"))}),!function(){function a(a){return a.replace(t,"").replace(u,",").replace(v,"").replace(w,"").replace(x,"").split(/^$|,+/)}function b(a){return"'"+a.replace(/('|\\)/g,"\\$1").replace(/\r/g,"\\r").replace(/\n/g,"\\n")+"'"}function c(c,d){function e(a){return m+=a.split(/\n/).length-1,k&&(a=a.replace(/[\n\r\t\s]+/g," ").replace(/<!--.*?-->/g,"")),a&&(a=s[1]+b(a)+s[2]+"\n"),a}function f(b){var c=m;if(j?b=j(b,d):g&&(b=b.replace(/\n/g,function(){return m++,"$line="+m+";"})),0===b.indexOf("=")){var e=l&&!/^=[=#]/.test(b);if(b=b.replace(/^=[=#]?|[\s;]*$/g,""),e){var f=b.replace(/\s*\([^\)]+\)/,"");n[f]||/^(include|print)$/.test(f)||(b="$escape("+b+")")}else b="$string("+b+")";b=s[1]+b+s[2]}return g&&(b="$line="+c+";"+b),r(a(b),function(a){if(a&&!p[a]){var b;b="print"===a?u:"include"===a?v:n[a]?"$utils."+a:o[a]?"$helpers."+a:"$data."+a,w+=a+"="+b+",",p[a]=!0}}),b+"\n"}var g=d.debug,h=d.openTag,i=d.closeTag,j=d.parser,k=d.compress,l=d.escape,m=1,p={$data:1,$filename:1,$utils:1,$helpers:1,$out:1,$line:1},q="".trim,s=q?["$out='';","$out+=",";","$out"]:["$out=[];","$out.push(",");","$out.join('')"],t=q?"$out+=text;return $out;":"$out.push(text);",u="function(){var text=''.concat.apply('',arguments);"+t+"}",v="function(filename,data){data=data||$data;var text=$utils.$include(filename,data,$filename);"+t+"}",w="'console.log(3316)';var $utils=this,$helpers=$utils.$helpers,"+(g?"$line=0,":""),x=s[0],y="return new String("+s[3]+");";r(c.split(h),function(a){a=a.split(i);var b=a[0],c=a[1];1===a.length?x+=e(b):(x+=f(b),c&&(x+=e(c)))});var z=w+x+y;g&&(z="try{"+z+"}catch(e){throw {filename:$filename,name:'Render Error',message:e.message,line:$line,source:"+b(c)+".split(/\\n/)[$line-1].replace(/^[\\s\\t]+/,'')};}");try{var A=new Function("$data","$filename",z);return A.prototype=n,A}catch(B){throw B.temp="function anonymous($data,$filename) {"+z+"}",B}}var d=function(a,b){return"string"==typeof b?q(b,{filename:a}):g(a,b)};d.version="3.0.0",d.config=function(a,b){e[a]=b};var e=d.defaults={openTag:"<%",closeTag:"%>",escape:!0,cache:!0,compress:!1,parser:null},f=d.cache={};d.render=function(a,b){return q(a,b)};var g=d.renderFile=function(a,b){var c=d.get(a)||p({filename:a,name:"Render Error",message:"Template not found"});return b?c(b):c};d.get=function(a){var b;if(f[a])b=f[a];else if("object"==typeof document){var c=document.getElementById(a);if(c){var d=(c.value||c.innerHTML).replace(/^\s*|\s*$/g,"");b=q(d,{filename:a})}}return b};var h=function(a,b){return"string"!=typeof a&&(b=typeof a,"number"===b?a+="":a="function"===b?h(a.call(a)):""),a},i={"<":"&#60;",">":"&#62;",'"':"&#34;","'":"&#39;","&":"&#38;"},j=function(a){return i[a]},k=function(a){return h(a).replace(/&(?![\w#]+;)|[<>"']/g,j)},l=Array.isArray||function(a){return"[object Array]"==={}.toString.call(a)},m=function(a,b){var c,d;if(l(a))for(c=0,d=a.length;d>c;c++)b.call(a,a[c],c,a);else for(c in a)b.call(a,a[c],c)},n=d.utils={$helpers:{},$include:g,$string:h,$escape:k,$each:m};d.helper=function(a,b){o[a]=b};var o=d.helpers=n.$helpers;d.onerror=function(a){var b="Template Error\n\n";for(var c in a)b+="<"+c+">\n"+a[c]+"\n\n";"object"==typeof console&&console.error(b)};var p=function(a){return d.onerror(a),function(){return"{Template Error}"}},q=d.compile=function(a,b){function d(c){try{return new i(c,h)+""}catch(d){return b.debug?p(d)():(b.debug=!0,q(a,b)(c))}}b=b||{};for(var g in e)void 0===b[g]&&(b[g]=e[g]);var h=b.filename;try{var i=c(a,b)}catch(j){return j.filename=h||"anonymous",j.name="Syntax Error",p(j)}return d.prototype=i.prototype,d.toString=function(){return i.toString()},h&&b.cache&&(f[h]=d),d},r=n.$each,s="break,case,catch,continue,debugger,default,delete,do,else,false,finally,for,function,if,in,instanceof,new,null,return,switch,this,throw,true,try,typeof,var,void,while,with,abstract,boolean,byte,char,class,const,double,enum,export,extends,final,float,goto,implements,import,int,interface,long,native,package,private,protected,public,short,static,super,synchronized,throws,transient,volatile,arguments,let,yield,undefined",t=/\/\*[\w\W]*?\*\/|\/\/[^\n]*\n|\/\/[^\n]*$|"(?:[^"\\]|\\[\w\W])*"|'(?:[^'\\]|\\[\w\W])*'|[\s\t\n]*\.[\s\t\n]*[$\w\.]+/g,u=/[^\w$]+/g,v=new RegExp(["\\b"+s.replace(/,/g,"\\b|\\b")+"\\b"].join("|"),"g"),w=/^\d[^,]*|,\d[^,]*/g,x=/^,+|,+$/g;e.openTag="{{",e.closeTag="}}";var y=function(a,b){var c=b.split(":"),d=c.shift(),e=c.join(":")||"";return e&&(e=", "+e),"$helpers."+d+"("+a+e+")"};e.parser=function(a,b){a=a.replace(/^\s/,"");var c=a.split(" "),e=c.shift(),f=c.join(" ");switch(e){case"if":a="if("+f+"){";break;case"else":c="if"===c.shift()?" if("+c.join(" ")+")":"",a="}else"+c+"{";break;case"/if":a="}";break;case"each":var g=c[0]||"$data",h=c[1]||"as",i=c[2]||"$value",j=c[3]||"$index",k=i+","+j;"as"!==h&&(g="[]"),a="$each("+g+",function("+k+"){";break;case"/each":a="});";break;case"echo":a="print("+f+");";break;case"print":case"include":a=e+"("+c.join(",")+");";break;default:if(-1!==f.indexOf("|")){var l=b.escape;0===a.indexOf("#")&&(a=a.substr(1),l=!1);for(var m=0,n=a.split("|"),o=n.length,p=l?"$escape":"$string",q=p+"("+n[m++]+")";o>m;m++)q=y(q,n[m]);a="=#"+q}else a=d.helpers[e]?"=#"+e+"("+c.join(",")+");":"="+a}return a},"function"==typeof define?define("dist/application/template",[],function(){return d}):"undefined"!=typeof exports?module.exports=d:this.template=d}(),define("dist/application/extend",[],function(a,b,c){String.prototype.format||(String.prototype.format=function(){var a=arguments;return this.replace(/{(\d+)}/g,function(b,c){return"undefined"!=typeof a[c]?a[c]:b})}),String.prototype.trim||(String.prototype.trim=function(){return this.replace(/^\s*/,"").replace(/\s*$/,"")}),String.prototype.stripTags||(String.prototype.stripTags=function(){return this.replace(/<\/?[^>]+>/gi,"")})}),define("dist/common/bilog",["base64","dist/cmd-lib/util","dist/application/method","dist/report/config"],function(a,b,c){function d(){sessionStorage.setItem("sessionID",A)}function e(a,b){!new RegExp("/f/").test(a)||new RegExp("referrer=").test(a)||new RegExp("/f/down").test(a)?new RegExp("/pay/payConfirm.html").test(a)?(b.prePageID="PC-M-PAY-F-L",b.prePageName="支付页-付费资料-列表页"):new RegExp("/pay/payQr.html\\?type=2").test(a)?(b.prePageID="PC-M-PAY-F-QR",b.prePageName="支付页-付费资料-支付页"):new RegExp("/pay/vip.html").test(a)?(b.prePageID="PC-M-PAY-VIP-L",b.prePageName="支付页-VIP-套餐列表页"):new RegExp("/pay/payQr.html\\?type=0").test(a)?(b.prePageID="PC-M-PAY-VIP-QR",b.prePageName="支付页-VIP-支付页"):new RegExp("/pay/privilege.html").test(a)?(b.prePageID="PC-M-PAY-PRI-L",b.prePageName="支付页-下载特权-套餐列表页"):new RegExp("/pay/payQr.html\\?type=1").test(a)?(b.prePageID="PC-M-PAY-PRI-QR",b.prePageName="支付页-下载特权-支付页"):new RegExp("/pay/success").test(a)?(b.prePageID="PC-M-PAY-SUC",b.prePageName="支付成功页"):new RegExp("/pay/fail").test(a)?(b.prePageID="PC-M-PAY-FAIL",b.prePageName="支付失败页"):new RegExp("/node/f/downsucc.html").test(a)?/unloginFlag=1/.test(a)?(b.prePageID="PC-M-FDPAY-SUC",b.prePageName="免登购买成功页"):(b.prePageID="PC-M-DOWN-SUC",b.prePageName="下载成功页"):new RegExp("/node/f/downfail.html").test(a)?(b.prePageID="PC-M-DOWN-FAIL",b.prePageName="下载失败页"):new RegExp("/search/home.html").test(a)&&(b.prePageID="PC-M-SR",b.prePageName="搜索关键词"):(b.prePageID="PC-M-FD",b.prePageName="资料详情页")}function f(){$.getScript("//ipip.iask.cn/iplookup/search?format=js",function(a,b){"success"===b?(v.setCookieWithExp("ip",remote_ip_info.ip,3e5,"/"),D.ip=remote_ip_info.ip):console.error("ipip获取ip信息error")})}function g(){var a="";return-1!=window.navigator.userAgent.indexOf("Windows NT 10.0")?a="Windows 10":-1!=window.navigator.userAgent.indexOf("Windows NT 6.2")?a="Windows 8":-1!=window.navigator.userAgent.indexOf("Windows NT 6.1")?a="Windows 7":-1!=window.navigator.userAgent.indexOf("Windows NT 6.0")?a="Windows Vista":-1!=window.navigator.userAgent.indexOf("Windows NT 5.1")?a="Windows XP":-1!=window.navigator.userAgent.indexOf("Windows NT 5.0")?a="Windows 2000":-1!=window.navigator.userAgent.indexOf("Mac")?a="Mac/iOS":-1!=window.navigator.userAgent.indexOf("X11")?a="UNIX":-1!=window.navigator.userAgent.indexOf("Linux")&&(a="Linux"),a}function h(a){setTimeout(function(){console.log(a),$.getJSON("https://dw.iask.com.cn/ishare/jsonp?data="+t.encode(JSON.stringify(a))+"&jsoncallback=?",function(a){console.log(a)})})}function i(a,b){var c=a;if(a&&b){for(var d in a)if("var"===d)for(var e in b)c["var"][e]=b[e];else b[d]&&(c[d]=b[d]);console.log("埋点参数:",c),h(c)}}function j(){var a=JSON.parse(JSON.stringify(D));e(document.referrer,a);var b={channel:""},c=v.getCookie("bc");c&&(b.channel=c),a.eventType="page",a.eventID="NE001",a.eventName="normalPageView",a.pageID=$("#ip-page-id").val()||"",a.pageName=$("#ip-page-name").val()||"",a.pageURL=window.location.href,i(a,b)}function k(){var a={fileID:window.pageConfig.params.g_fileId,fileName:window.pageConfig.params.file_title,fileCategoryID:window.pageConfig.params.classid1+"||"+window.pageConfig.params.classid2+"||"+window.pageConfig.params.classid3,fileCategoryName:window.pageConfig.params.classidName1+"||"+window.pageConfig.params.classidName2+"||"+window.pageConfig.params.classidName3,filePrice:window.pageConfig.params.moneyPrice,fileCouponCount:window.pageConfig.params.file_volume,filePayType:x[window.pageConfig.params.file_state],fileFormat:window.pageConfig.params.file_format,fileProduceType:window.pageConfig&&window.pageConfig.params?window.pageConfig.params.fsource:"",fileCooType:"",fileUploaderID:window.pageConfig.params.file_uid},b=window.pageConfig&&window.pageConfig.params?window.pageConfig.params.is360:"";/https?\:\/\/[^\s]*so.com.*$/g.test(document.referrer)&&!/https?\:\/\/[^\s]*wenku.so.com.*$/g.test(document.referrer)&&"true"==b&&(a.fileCooType="360onebox",v.setCookieWithExp("bc","360onebox",18e5,"/")),/https?\:\/\/[^\s]*wenku.so.com.*$/g.test(document.referrer)&&(a.fileCooType="360wenku",v.setCookieWithExp("bc","360wenku",18e5,"/"));var c=JSON.parse(JSON.stringify(D));e(document.referrer,c),c.eventType="page",c.eventID="SE002",c.eventName="fileDetailPageView",c.pageID=$("#ip-page-id").val()||"",c.pageName=$("#ip-page-name").val()||"",c.pageURL=window.location.href,v.setCookieWithExp("bf",JSON.stringify(a),18e5,"/"),i(c,a)}function l(a){var b=JSON.parse(JSON.stringify(D));if(e(document.referrer,b),b.eventType="page",b.eventID="SE009",b.eventName="payFileResult",b.pageID=$("#ip-page-id").val()||"",b.pageName=$("#ip-page-name").val()||"",b.pageURL=window.location.href,a.fileID||(a.fileID=v.getParam("fid")||$("#ip-page-fid").val()),!a.filePayType){var c=$("#ip-page-fstate").val()||1;a.filePayType=x[c]}i(b,a)}function m(a){var b=JSON.parse(JSON.stringify(D));e(document.referrer,b),b.eventType="page",b.eventID="SE011",b.eventName="payVipResult",b.pageID=$("#ip-page-id").val()||"",b.pageName=$("#ip-page-name").val()||"",b.pageURL=window.location.href,a.orderID||(a.orderID=v.getParam("orderNo")||""),i(b,a)}function n(a){var b=JSON.parse(JSON.stringify(D));e(document.referrer,b),b.eventType="page",b.eventID="SE013",b.eventName="payPrivilegeResult",b.pageID=$("#ip-page-id").val()||"",b.pageName=$("#ip-page-name").val()||"",b.pageURL=window.location.href,i(b,a)}function o(a){var b=JSON.parse(JSON.stringify(D));e(document.referrer,b),b.eventType="page",b.eventID="SE014",b.eventName="downResult",b.pageID=$("#ip-page-id").val()||"",b.pageName=$("#ip-page-name").val()||"",b.pageURL=window.location.href,i(b,a)}function p(a){var b=JSON.parse(JSON.stringify(D));b.eventType="page",b.eventID="SE015",b.eventName="searchPageView",e(document.referrer,b),b.pageID="PC-M-SR",b.pageName=$("#ip-page-name").val()||"",b.pageURL=window.location.href,i(b,a)}function q(a,b){for(var c in b)a[c]&&(b[c]=a[c])}function r(a,b,c,d,f){var g=JSON.parse(JSON.stringify(D));e(document.referrer,g),g.eventType="click",g.eventID=a,g.eventName=b,g.pageID=$("#ip-page-id").val(),g.pageName=$("#ip-page-name").val(),g.pageURL=window.location.href,g.domID=c,g.domName=d,g.domURL=window.location.href,i(g,f)}function s(a,b,c){var d=$("#ip-page-type").val();if("pindex"==d){var e={fileID:"",fileName:"",fileCategoryID:"",fileCategoryName:"",filePayType:"",fileFormat:"",fileProduceType:"",fileCooType:"",fileUploaderID:""},f=v.getCookie("bf");if(f&&q(JSON.parse(f),e),"fileDetailUpDown"==a||"fileDetailMiddleDown"==a||"fileDetailBottomDown"==a)e.downType="","fileDetailUpDown"==a?r("SE003","fileDetailDownClick","fileDetailUpDown","资料详情页顶部立即下载",e):"fileDetailMiddleDown"==a?r("SE003","fileDetailDownClick","fileDetailMiddleDown","资料详情页中部立即下载",e):"fileDetailBottomDown"==a&&r("SE003","fileDetailDownClick","fileDetailBottomDown","资料详情页底部立即下载",e),delete e.downType;else if("fileDetailUpBuy"==a)r("SE004","fileDetailBuyClick","fileDetailUpBuy","资料详情页顶部立即购买",e);else if("fileDetailMiddleBuy"==a)r("SE004","fileDetailBuyClick","fileDetailMiddleBuy","资料详情页中部立即购买",e);else if("fileDetailBottomBuy"==a)r("SE004","fileDetailBuyClick","fileDetailBottomBuy","资料详情页底部立即购买",e);else if("fileDetailMiddleOpenVip8"==a)r("SE005","fileDetailOpenVipClick","fileDetailMiddleOpenVip8","资料详情页中部开通vip，8折购买",e);else if("fileDetailBottomOpenVip8"==a)r("SE005","fileDetailOpenVipClick","fileDetailBottomOpenVip8","资料详情页底部开通vip，8折购买",e);else if("fileDetailMiddleOpenVipPr"==a)r("SE005","fileDetailOpenVipClick","fileDetailMiddleOpenVipPr","资料详情页中部开通vip，享更多特权",e);else if("fileDetailBottomOpenVipPr"==a)r("SE005","fileDetailOpenVipClick","fileDetailBottomOpenVipPr","资料详情页底部开通vip，享更多特权",e);else if("fileDetailComment"==a)r("SE006","fileDetailCommentClick","fileDetailComment","资料详情页评论",e);else if("fileDetailScore"==a){var g=b.find(".on:last").text();e.fileScore=g?g:"",r("SE007","fileDetailScoreClick","fileDetailScore","资料详情页评分",e),delete e.fileScore}}if("payFile"==a){var e={orderID:v.getParam("orderNo")||"",couponID:$(".pay-coupon-wrap").attr("vid")||"",coupon:$(".pay-coupon-wrap p.chose-ele").text()||"",fileID:"",fileName:"",fileCategoryID:"",fileCategoryName:"",filePayType:"",fileFormat:"",fileProduceType:"",fileCooType:"",fileUploaderID:"",filePrice:"",fileSalePrice:""},f=v.getCookie("bf");f&&q(JSON.parse(f),e),r("SE008","payFileClick","payFile","支付页-付费资料-立即支付",e)}else if("payVip"==a){var e={orderID:v.getParam("orderNo")||"",vipID:$(".ui-tab-nav-item.active").data("vid"),vipName:$(".ui-tab-nav-item.active p.vip-time").text()||"",vipPrice:$(".ui-tab-nav-item.active p.vip-price strong").text()||"",couponID:$(".pay-coupon-wrap").attr("vid")||"",coupon:$(".pay-coupon-wrap p.chose-ele").text()||""};r("SE010","payVipClick","payVip","支付页-VIP-立即支付",e)}else if("payPrivilege"==a){var e={orderID:v.getParam("orderNo")||"",couponID:$(".pay-coupon-wrap").attr("vid")||"",coupon:$(".pay-coupon-wrap p.chose-ele").text()||"",privilegeName:$(".ui-tab-nav-item.active p.privilege-price").text()||"",privilegePrice:$(".ui-tab-nav-item.active").data("activeprice")||"",fileID:"",fileName:"",fileCategoryID:"",fileCategoryName:"",filePayType:"",fileFormat:"",fileProduceType:"",fileCooType:"",fileUploaderID:""},f=v.getCookie("bf");f&&q(JSON.parse(f),e),r("SE012","payPrivilegeClick","payPrivilege","支付页-下载特权-立即支付",e)}else"searchResult"==a&&(e={fileID:b.attr("data-fileId"),fileName:b.attr("data-fileName"),keyWords:$("#scondition").val()},r("SE016","normalClick","searchResultClick","搜索结果页点击",e));var e={phone:$("#ip-mobile").val()||"",vipStatus:$("#ip-isVip").val()||"",channel:"",cashBalance:"",integralNumber:"",idolNumber:"",fileCategoryID:"",fileCategoryName:""};E&&(e.vipStatus=E.isVip||"",e.phone=E.tel||"");var h=v.getCookie("bc");h&&(e.channel=h),"paySuccessBacDown"==a?r("NE002","normalClick","paySuccessBacDown","支付成功页-返回下载",e):"paySuccessOpenVip"==a?r("NE002","normalClick","paySuccessOpenVip","支付成功页-开通VIP",e):"downSuccessOpenVip"==a?r("NE002","normalClick","downSuccessOpenVip","下载成功页-开通VIP",e):"downSuccessContinueVip"==a?r("NE002","normalClick","downSuccessContinueVip","下载成功页-续费VIP",e):"downSuccessBacDetail"==a?r("NE002","normalClick","downSuccessBacDetail","下载成功页-返回详情页",e):"downSuccessBindPhone"==a?r("NE002","normalClick","downSuccessBindPhone","下载成功页-立即绑定",e):"viewExposure"==a?(e.moduleID=c,r("SE006","modelView","","",e)):"similarFileClick"==a?(e={fileID:window.pageConfig.params.g_fileId,fileName:window.pageConfig.params.file_title,fileCategoryID:window.pageConfig.params.classid1+"||"+window.pageConfig.params.classid2+"||"+window.pageConfig.params.classid3,fileCategoryName:window.pageConfig.params.classidName1+"||"+window.pageConfig.params.classidName2+"||"+window.pageConfig.params.classidName3,filePayType:x[window.pageConfig.params.file_state]},r("SE017","fileListNormalClick","similarFileClick","资料列表常规点击",e)):"underSimilarFileClick"==a?r("SE017","fileListNormalClick","underSimilarFileClick","点击底部猜你喜欢内容时",e):"downSucSimilarFileClick"==a?r("SE017","fileListNormalClick","downSucSimilarFileClick","下载成功页猜你喜欢内容时",e):"markFileClick"==a?(e={fileID:window.pageConfig.params.g_fileId,fileName:window.pageConfig.params.file_title,fileCategoryID:window.pageConfig.params.classid1+"||"+window.pageConfig.params.classid2+"||"+window.pageConfig.params.classid3,fileCategoryName:window.pageConfig.params.classidName1+"||"+window.pageConfig.params.classidName2+"||"+window.pageConfig.params.classidName3,filePayType:x[window.pageConfig.params.file_state],markRusult:1},r("SE019","markClick","markFileClick","资料收藏点击",e)):"vipRights"==a?r("NE002","normalClick","vipRights","侧边栏-vip权益",e):"seen"==a?r("NE002","normalClick","seen","侧边栏-我看过的",e):"mark"==a?r("NE002","normalClick","mark","侧边栏-我的收藏",e):"customerService"==a?r("NE002","normalClick","customerService","侧边栏-联系客服",e):"downApp"==a?r("NE002","normalClick","downApp","侧边栏-下载APP",e):"follow"==a&&r("NE002","normalClick","follow","侧边栏-关注领奖",e)}var t=a("base64").Base64,u=a("dist/cmd-lib/util"),v=a("dist/application/method"),w=a("dist/report/config"),x=["","free","","online","vipOnly","cost"],y=v.getCookie("ip")||f(),z=v.getCookie("cid");z||(z=(new Date).getTime()+""+Math.random(),v.setCookieWithExp("cid",z,2592e6,"/"));var A=(new Date).getTime()+""+Math.random(),B=18e5,C=sessionStorage.getItem("sessionID")||"";C||d(),A-C>B&&d();var D={eventType:"",eventID:"",eventName:"",eventTime:String((new Date).getTime()),reportTime:String((new Date).getTime()),sdkVersion:"V1.0.3",terminalType:"0",loginStatus:v.getCookie("cuk")?1:0,visitID:v.getCookie("gr_user_id")||"",userID:"",sessionID:sessionStorage.getItem("sessionID")||z||"",productName:"ishare",productCode:"0",productVer:"V4.5.0",pageID:"",pageName:"",pageURL:"",ip:y||"",resolution:document.documentElement.clientWidth+"*"+document.documentElement.clientHeight,browserVer:u.getBrowserInfo(navigator.userAgent),osType:g(),moduleID:"",moduleName:"",appChannel:"",prePageID:"",prePageName:"",prePageURL:document.referrer,domID:"",domName:"",domURL:"",location:"",deviceID:"",deviceBrand:"",deviceModel:"",deviceLanguage:navigator.language,mac:"",osVer:"",networkType:"",networkProvider:"","var":{}},E=v.getCookie("ui");E&&(E=JSON.parse(E),D.userID=E.uid||""),e(document.referrer,D),$(function(){setTimeout(function(){var a=$("#ip-page-id").val();"PC-M-FD"==a&&k(),"PC-O-SR"!=a&&j();var b={payResult:1,orderID:v.getParam("orderNo")||"",couponID:$(".pay-coupon-wrap").attr("vid")||"",coupon:$(".pay-coupon-wrap p.chose-ele").text()||"",orderPayType:"",orderPayPrice:"",vipID:"",vipName:"",vipPrice:""},c={payResult:1,orderID:v.getParam("orderNo")||"",couponID:$(".pay-coupon-wrap").attr("vid")||"",coupon:$(".pay-coupon-wrap p.chose-ele").text()||"",orderPayType:"",orderPayPrice:"",fileID:"",fileName:"",fileCategoryID:"",fileCategoryName:"",filePayType:"",fileFormat:"",fileProduceType:"",fileCooType:"",fileUploaderID:"",privilegeID:"",privilegeName:"",privilegePrice:""},d={payResult:1,orderID:v.getParam("orderNo")||"",couponID:$(".pay-coupon-wrap").attr("vid")||"",coupon:$(".pay-coupon-wrap p.chose-ele").text()||"",orderPayType:"",orderPayPrice:"",fileID:"",fileName:"",fileCategoryID:"",fileCategoryName:"",filePayType:"",fileFormat:"",fileProduceType:"",fileCooType:"",fileUploaderID:"",filePrice:"",fileSalePrice:""},e=v.getCookie("bf"),f=v.getCookie("br"),g=window.location.href;if("PC-M-PAY-SUC"==a||"PC-O-PAY-SUC"==a){if(g.indexOf("type=0")>-1)f&&q(JSON.parse(f),b),m(b);else if(g.indexOf("type=1")>-1)e&&q(JSON.parse(e),c),f&&q(JSON.parse(f),c),n(c);else if(g.indexOf("type=2")>-1){e&&q(JSON.parse(e),d);var f=v.getCookie("br");f&&q(JSON.parse(f),d),l(d)}}else("PC-M-PAY-FAIL"==a||"PC-O-PAY-FAIL"==a)&&(g.indexOf("type=0")>-1?(f&&q(JSON.parse(f),b),b.payResult=0,m(b)):g.indexOf("type=1")>-1?(e&&q(JSON.parse(e),c),f&&q(JSON.parse(f),c),c.payResult=0,n(c)):g.indexOf("type=2")>-1&&(e&&q(JSON.parse(e),d),f&&q(JSON.parse(f),d),d.payResult=0,l(d)));var h={downResult:1,fileID:"",fileName:"",fileCategoryID:"",fileCategoryName:"",filePayType:""};if("PC-M-DOWN-SUC"==a){var e=v.getCookie("bf");e&&q(JSON.parse(e),h),h.downResult=1,o(h)}else if("PC-M-DOWN-FAIL"==a){var e=v.getCookie("bf");e&&q(JSON.parse(e),h),h.downResult=0,o(h)}},1e3)}),$(document).delegate("."+w.EVENT_NAME,"click",function(a){var b=$(this),c=b.attr(w.BILOG_CONTENT_NAME);console.log("cnt:",c),c&&setTimeout(function(){s(c,b)})}),c.exports={clickEvent:function(a){var b=a.attr(w.BILOG_CONTENT_NAME);console.log("cnt-导出的:",b),b&&setTimeout(function(){s(b,a)})},viewExposure:function(a,b){var c="viewExposure";c&&setTimeout(function(){s(c,a,b)})},searchResult:p}}),define("dist/cmd-lib/util",[],function(a,b,c){var d={throttle:function(a,b){var c,d;return function(e){var f=this,g=arguments,h=+new Date;c&&c+b>h?(clearTimeout(d),d=setTimeout(function(){c=h,a.apply(f,g)},b)):(c=h,a.apply(f,g))}},debounce:function(a,b){var c=0,d=this;return function(e){c&&clearTimeout(c),c=setTimeout(function(){a.apply(d,e)},b)}},isWeChatBrow:function(){var a=navigator.userAgent.toLowerCase(),b=-1!=a.indexOf("micromessenger");return b?!0:!1},getWebAppUA:function(){var a=0,b=navigator.userAgent.toLowerCase();return/iphone|ipad|ipod/.test(b)?a=1:/android/.test(b)&&(a=0),a},validateIE8:function(){return!$.browser.msie||"8.0"!=$.browser.version&&"7.0"!=$.browser.version&&"6.0"!=$.browser.version?!1:!0},validateIE9:function(){return!$.browser.msie||"9.0"!=$.browser.version&&"8.0"!=$.browser.version&&"7.0"!=$.browser.version&&"6.0"!=$.browser.version?!1:!0},getReferrer:function(){var a=document.referrer,b="";return/https?\:\/\/[^\s]*wenku.so.com.*$/g.test(a)?b="360wenku":/https?\:\/\/[^\s]*so.com.*$/g.test(a)?b="360":/https?\:\/\/[^\s]*baidu.com.*$/g.test(a)?b="baidu":/https?\:\/\/[^\s]*sogou.com.*$/g.test(a)?b="sogou":/https?\:\/\/[^\s]*sm.cn.*$/g.test(a)?b="sm":/https?\:\/\/[^\s]*ishare.iask.sina.com.cn.*$/g.test(a)?b="ishare":/https?\:\/\/[^\s]*iask.sina.com.cn.*$/g.test(a)&&(b="iask"),b},getPageRef:function(a){var b=this,c=0;return(b.is360cookie(a)||b.is360cookie("360"))&&(c=1),b.is360wkCookie()&&(c=3),c},is360cookie:function(a){var b=this,c=b.getCookie("_r_so");if(c)for(var d=c.split("_"),e=0;e<d.length;e++)if(d[e]==a)return!0;return!1},add360wkCookie:function(){this.setCookieWithExpPath("_360hz","1",18e5,"/")},is360wkCookie:function(){return null==getCookie("_360hz")?!1:!0},getCookie:function(a){var b=document.cookie.match(new RegExp("(^| )"+a+"=([^;]*)(;|$)"));return null!==b?unescape(b[2]):null},setCookieWithExpPath:function(a,b,c,d){var e=new Date;e.setTime(e.getTime()+c),document.cookie=a+"="+escape(b)+";path="+d+";expires="+e.toGMTString()},findRefer:function(){var a=document.referrer,b="other";return/https?\:\/\/[^\s]*\/f\/.*$/g.test(a)?b="pindex":/https?\:\/\/[^\s]*\/d\/.*$/g.test(a)?b="landing":/https?\:\/\/[^\s]*\/c\/.*$/g.test(a)?b="pcat":/https?\:\/\/[^\s]*\/search\/.*$/g.test(a)?b="psearch":/https?\:\/\/[^\s]*\/t\/.*$/g.test(a)?b="ptag":/https?\:\/\/[^\s]*\/[u|n]\/.*$/g.test(a)?b="popenuser":/https?\:\/\/[^\s]*\/ucenter\/.*$/g.test(a)?b="puser":/https?\:\/\/[^\s]*ishare.iask.sina.com.cn.$/g.test(a)?b="ishareindex":/https?\:\/\/[^\s]*\/theme\/.*$/g.test(a)?b="theme":/https?\:\/\/[^\s]*wenku.so.com.*$/g.test(a)?b="360wenku":/https?\:\/\/[^\s]*so.com.*$/g.test(a)?b="360":/https?\:\/\/[^\s]*baidu.com.*$/g.test(a)?b="baidu":/https?\:\/\/[^\s]*sogou.com.*$/g.test(a)?b="sogou":/https?\:\/\/[^\s]*sm.cn.*$/g.test(a)?b="sm":/https?\:\/\/[^\s]*ishare.iask.sina.com.cn.*$/g.test(a)?b="ishare":/https?\:\/\/[^\s]*iask.sina.com.cn.*$/g.test(a)&&(b="iask"),b},showAlertDialog:function(a,b,c){var d=$(".common-bgMask"),e=$(".common-dialog");e.find("h2[name='title']").text(a),e.find("span[name='content']").html(b),e.find("a.close,a.btn-dialog").unbind("click").click(function(){d.hide(),e.hide(),c&&!$(this).hasClass("close")&&c()}),d.show(),e.show()},browserVersion:function(a){var b=a.indexOf("Opera")>-1,c=a.indexOf("compatible")>-1&&a.indexOf("MSIE")>-1&&!b,d=a.indexOf("Edge")>-1,e=a.indexOf("Firefox")>-1,f=a.indexOf("Safari")>-1&&-1===a.indexOf("Chrome"),g=a.indexOf("Chrome")>-1&&a.indexOf("Safari")>-1;if(c){var h=new RegExp("MSIE (\\d+\\.\\d+);");h.test(a);var i=parseFloat(RegExp.$1);return 7===i?"IE7":8===i?"IE8":9===i?"IE9":10===i?"IE10":11===i?"IE11":12===i?"IE12":"IE"}return b?"Opera":d?"Edge":e?"Firefox":f?"Safari":g?"Chrome":"unKnow"},getBrowserInfo:function(a){var b={},c=a.toLowerCase(),d=/(msie|firefox|chrome|opera|version|trident).*?([\d.]+)/,e=c.match(d);return e&&e.length>=2?(b.browser=e[1].replace(/version/,"'safari")||"unknow",b.ver=e[2]||"1.0.0"):(b.browser="unknow",b.ver="1.0.0"),b.browser+"/"+b.ver}};c.exports=d}),define("dist/report/config",[],function(a,b,c){return{COOKIE_FLAG:"_dplf",COOKIE_CIDE:"_dpcid",COOKIE_CUK:"cuk",COOKIE_TIMEOUT:3e6,SERVER_URL:"/dataReport",UACTION_URL:"/uAction",EVENT_NAME:"pc_click",CONTENT_NAME:"pcTrackContent",BILOG_CONTENT_NAME:"bilogContent",ishareTrackEvent:"_ishareTrackEvent",eventCookieFlag:"_eventCookieFlag",EVENT_REPORT:!1,AUTO_PV:!1}}),define("dist/report/init",["dist/report/handler","dist/cmd-lib/util","dist/report/columns","dist/report/config","dist/application/method"],function(a,b,c){a("dist/report/handler")}),define("dist/report/handler",["dist/cmd-lib/util","dist/report/columns","dist/report/config","dist/application/method"],function(a,b,c){function d(a,b){this.options=$.extend(!0,g,a),this.config=$.extend(!0,h,b),this.init()}var e,f=a("dist/cmd-lib/util"),g=a("dist/report/columns"),h=a("dist/report/config"),i=a("dist/application/method");
d.prototype={init:function(){this.client(),this.send(0,this.format()),this.send(2,(new Date).getTime()),gio&&pageConfig.report&&gio("page.set",pageConfig.report)},client:function(){var a="";pageConfig.page&&(a=pageConfig.page.uid||""),!a&&i.getCookie(this.config.COOKIE_CUK)&&(a="logined"),this.options.uid=a,i.getCookie(this.config.COOKIE_CIDE)?e=i.getCookie(this.config.COOKIE_CIDE):(e=(new Date).getTime()+""+Math.random(),i.setCookieWithExpPath(this.options.cid,e,2592e6,"/")),this.options.usource=f.getReferrer(),this.options.cid=e,this.clickWatch()},getIpAddress:function(){var a=this;$.getScript("//ipip.iask.cn/iplookup/search?format=js",function(b,c){"success"===c?a.options=$.extend(!0,a.options,{city:remote_ip_info.cityCode,province:remote_ip_info.provinceCode,ip:remote_ip_info.ip}):console.error("ipip获取ip信息error")})},clickWatch:function(){var a=this;$(document).delegate("."+this.config.EVENT_NAME,"click",function(b){var c=$(this).attr(a.config.CONTENT_NAME);a.setCurrEventCon(c),($.browser.msie&&$.browser.version<=8&&a.mousePosition(b).x>=0||b.originalEvent&&b.originalEvent.isTrusted)&&c&&a.push([a.config.CONTENT_NAME,c]),$(this).trigger("init",b)})},gioTrack:function(a,b){gio&&b&&gio("track",a,b)},gioPage:function(a){gio&&a&&gio("page.set",a)},push:function(a,b){a instanceof Array&&a&&a.length>1&&(a.shift(),a.length>0&&a[0]==this.config.eventCookieFlag&&(a.shift(),this.handleCookieFlag(a.join("_"))),this.options.clickName=a[0]);var c=this.format();this.send(1,c),b&&b(c)},handleCookieFlag:function(a){try{var b=i.getCookie(this.config.COOKIE_FLAG);if(b){var c=JSON.parse(b);c.v=a,c.t=(new Date).getTime(),i.setCookieWithExpPath(this.config.COOKIE_FLAG,JSON.stringify(c),3e6,"/")}}catch(d){}},format:function(){try{var a=this.options,b=[a.cid,a.uid,a.ptype,a.usource,a.fsource,a.ftype,a.format,a.cate,a.cateName,a.cate1,a.cate2,a.ip,a.province,a.city,a.clickName,a.time,a.timestamp];return b.join("_")}catch(c){}},send:function(a,b){i.get(this.config.SERVER_URL+"?"+a+"_"+encodeURIComponent(b),function(){},"")},mousePosition:function(a){try{return a=a||window.event,a.pageX||a.pageY?{x:a.pageX,y:a.pageY}:{x:a.clientX+document.body.scrollLeft-document.body.clientLeft,y:a.clientY+document.body.scrollTop-document.body.clientTop}}catch(b){}},uActionReport:function(a){$.get(this.uActionUrl+"?"+encodeURIComponent(a)+"_"+(new Date).getTime(),function(a,b){})},setCurrEventCon:function(a){i.setCookieWithExpPath("_dpclkcnt",a,3e5,"/")}},window._dataReport=new d(window.pageConfig.report),window.__pc__=window._dataReport;try{!function(){var a=document.createElement("script");a.src="//hm.baidu.com/hm.js?adb0f091db00ed439bf000f2c5cbaee7";var b=document.getElementsByTagName("script")[0];b.parentNode.insertBefore(a,b)}()}catch(j){}}),define("dist/report/columns",[],function(a,b,c){return{cid:"",uid:"",ptype:"",usource:"",fsource:"",ftype:"",format:"",cate:"",cateName:"",cate1:"",cate2:"",ip:"",province:"",city:"",clickName:"",time:"",timestamp:""}}),define("dist/application/helper",[],function(a,b,c){template.helper("encodeValue",function(a){return encodeURIComponent(encodeURIComponent(a))})});