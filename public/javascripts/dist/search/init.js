/*! ishare_pc_website
*author:Jersey */
define("dist/search/init",["./login","../application/checkLogin","../application/method","../application/api","../application/app","../application/element","../application/template","../application/extend","../report/init","../report/handler","../cmd-lib/util","../report/columns","../report/config","../application/helper","//static3.iask.cn/resource/js/plugins/pc.iask.login.min","../application/suspension","./search","swiper","../common/gioPageSet"],function(a,b,c){a("./login"),a("./search")}),define("dist/search/login",["dist/application/checkLogin","dist/application/method","dist/application/api","dist/application/app","dist/application/element","dist/application/template","dist/application/extend","dist/report/init","dist/report/handler","dist/cmd-lib/util","dist/report/columns","dist/report/config","dist/application/helper","//static3.iask.cn/resource/js/plugins/pc.iask.login.min","dist/application/suspension"],function(a,b,c){function d(a){$(".user-info-div").show();var b=$("#unLogin"),c=$("#haveLogin"),d=$(".btn-user-more"),e=$(".vip-status"),g=$(".user-info-div").find(".icon-iShare"),h=$(".top-user-more"),i=$(".join-vip-ele").find("span"),j=$(".btn-join-vip");$("#user-msg").text(a.msgCount);var k=null;"0"==a.isVip?(g.removeClass("icon-vip"),k=e.find('p[data-type="0"]'),k.show().siblings().hide(),j.eq(1).show().siblings().hide()):"1"==a.isVip?(k=e.find('p[data-type="1"]'),k.find(".expire_time").text(a.expireTime),k.show().siblings().hide(),h.addClass("top-vip-more"),d.text("续费"),i.text("续费"),j.eq(2).show().siblings().hide(),$(".tui-search-vip").hide()):"1"==a.userType&&(k=e.find('p[data-type="2"]'),k.show().siblings().hide()),b.hide(),c.find(".user-link .user-name").html(a.nickName),c.find(".user-link img").attr("src",a.weiboImage),c.find(".top-user-more .user-name").html(a.nickName),c.find(".top-user-more img").attr("src",a.weiboImage),c.show(),f.usermsg(a)}var e=a("dist/application/checkLogin"),f=(a("dist/application/app"),a("dist/application/method"),a("dist/application/suspension"));$(".tui-search-vip").show(),e.getLoginData(function(a){d(a)}),$("#a-login-link").on("click",function(){e.notifyLoginInterface(function(a){d(a)})}),$(".btn-no-login").on("click",function(){e.notifyLoginInterface(function(a){d(a)})}),$(".js-sync").on("click",function(){e.syncUserInfoInterface(function(a){d(a)})}),$(".btn-exit").on("click",function(){e.ishareLogout()})}),define("dist/application/checkLogin",["dist/application/method","dist/application/api"],function(a,b,c){var d=a("dist/application/method"),e=a("dist/application/api");c.exports={getIds:function(){var a=window.pageConfig&&window.pageConfig.params?window.pageConfig.params:null,b=window.pageConfig&&window.pageConfig.access?window.pageConfig.access:null,c=[];a&&(a.classid1&&c.push(a.classid1),a.classid2&&c.push(a.classid2),a.classid3&&c.push(a.classid3));var d=a&&c.length>0?c.join("-"):"",e=b?b.fileId||a.g_fileId||"":"",f=window.pageConfig&&window.pageConfig.classIds?window.pageConfig.classIds:"";return!d&&(d=f),{clsId:d,fid:e}},notifyLoginInterface:function(a){var b=this;if(!d.getCookie("cuk")){__pc__.push(["pcTrackContent","loginDialogLoad"]);var c=window.pageConfig&&window.pageConfig.page?window.pageConfig.page.ptype||"index":"index";$.loginPop("login",{terminal:"PC",businessSys:"ishare",domain:document.domain,ptype:c,clsId:this.getIds().clsId,fid:this.getIds().fid},function(c){b.getLoginData(a)})}},listenLoginStatus:function(a){var b=this;$.loginPop("login_wx_code",{terminal:"PC",businessSys:"ishare",domain:document.domain,ptype:"ishare",popup:"hidden",clsId:this.getIds().clsId,fid:this.getIds().fid},function(){b.getLoginData(a)})},notifyCheckInterface:function(){d.getCookie("cuk")&&$.loginPop("checkCode",{terminal:"PC",businessSys:"ishare",domain:document.domain,clsId:this.getIds().clsId,fid:this.getIds().fid},function(a){"0"==a.code&&d.get(e.user.getJessionId,function(a){},"")})},syncUserInfoInterface:function(a){var b=this;d.getCookie("cuk")&&d.get(e.user.getJessionId,function(c){0==c.code&&b.getLoginData(a)},"")},getUserData:function(a){d.getCookie("cuk")&&d.get(e.sale.querySeniority,function(b){b&&0==b.code&&a(b.data)},"")},getLoginData:function(a){var b=this;try{d.get(e.user.login,function(c){if(0==c.code&&c.data){if(a&&"function"==typeof a){a(c.data);try{window.pageConfig.params.isVip=c.data.isVip,window.pageConfig.page.uid=c.data.userId}catch(e){}}try{var f={uid:c.data.userId,isVip:c.data.isVip,tel:c.data.mobile};d.setCookieWithExpPath("ui",JSON.stringify(f),18e5,"/")}catch(g){}}else 40001==c.code&&b.ishareLogout()})}catch(c){}},ishareLogout:function(){d.delCookie("cuk","/",".sina.com.cn"),d.delCookie("cuk","/",".iask.com.cn"),d.delCookie("cuk","/",".iask.com"),d.delCookie("sid","/",".iask.sina.com.cn"),d.delCookie("sid","/",".iask.com.cn"),d.delCookie("sid","/",".sina.com.cn"),d.delCookie("sid","/",".ishare.iask.com.cn"),d.delCookie("sid","/",".office.iask.com"),d.delCookie("sid_ishare","/",".iask.sina.com.cn"),d.delCookie("sid_ishare","/",".iask.com.cn"),d.delCookie("sid_ishare","/",".sina.com.cn"),d.delCookie("sid_ishare","/",".ishare.iask.com.cn"),d.delCookie("_1st_l","/"),d.delCookie("ui","/"),$.post("/logout",function(){window.location.href=window.location.href})}}}),define("dist/application/method",[],function(require,exports,module){return{keyMap:{ishare_detail_access:"ISHARE_DETAIL_ACCESS",ishare_office_detail_access:"ISHARE_OFFICE_DETAIL_ACCESS"},async:function(a,b,c,d,e){$.ajax(a,{type:d||"post",data:e,async:!1,dataType:"json",headers:{"cache-control":"no-cache",Pragma:"no-cache"}}).done(function(a){b&&b(a)}).fail(function(a){console.log("error==="+c)})},get:function(a,b,c){$.ajaxSetup({cache:!1}),this.async(a,b,c,"get")},post:function(a,b,c,d,e){this.async(a,b,c,d,e)},postd:function(a,b,c){this.async(a,b,!1,!1,c)},random:function(a,b){return Math.floor(Math.random()*(b-a))+a},setCookieWithExpPath:function(a,b,c,d){var e=new Date;e.setTime(e.getTime()+c),document.cookie=a+"="+escape(b)+";path="+d+";expires="+e.toGMTString()},setCookieWithExp:function(a,b,c,d){var e=new Date;e.setTime(e.getTime()+c),d?document.cookie=a+"="+escape(b)+";path="+d+";expires="+e.toGMTString():document.cookie=a+"="+escape(b)+";expires="+e.toGMTString()},getCookie:function(a){var b=document.cookie.match(new RegExp("(^| )"+a+"=([^;]*)(;|$)"));return null!==b?unescape(b[2]):null},delCookie:function(a,b,c){var d=new Date;d.setTime(d.getTime()-1);var e=this.getCookie(a);null!=e&&(b&&c?document.cookie=a+"= '' ;domain="+c+";expires="+d.toGMTString()+";path="+b:b?document.cookie=a+"= '' ;expires="+d.toGMTString()+";path="+b:document.cookie=a+"="+e+";expires="+d.toGMTString())},getQueryString:function(a){var b=new RegExp("(^|&)"+a+"=([^&]*)(&|$)","i"),c=window.location.search.substr(1).match(b);return null!=c?unescape(c[2]):null},url2Obj:function(a){for(var b={},c=a.split("?"),d=c[1].split("&"),e=0;e<d.length;e++){var f=d[e].split("=");b[f[0]]=f[1]}return b},getParam:function(a){a=a.replace(/[\[]/,"\\[").replace(/[\]]/,"\\]");var b="[\\?&]"+a+"=([^&#]*)",c=new RegExp(b),d=c.exec(window.location.href);return null==d?"":decodeURIComponent(d[1].replace(/\+/g," "))},getLocalData:function(a){try{if(localStorage&&localStorage.getItem){var b=localStorage.getItem(a);return null===b?null:JSON.parse(b)}return console.log("浏览器不支持html localStorage getItem"),null}catch(c){return null}},setLocalData:function(a,b){localStorage&&localStorage.setItem?(localStorage.removeItem(a),localStorage.setItem(a,JSON.stringify(b))):console.log("浏览器不支持html localStorage setItem")},browserType:function(){var a=navigator.userAgent,b=a.indexOf("Opera")>-1;return b?"Opera":a.indexOf("compatible")>-1&&a.indexOf("MSIE")>-1&&!b?"IE":a.indexOf("Edge")>-1?"Edge":a.indexOf("Firefox")>-1?"Firefox":a.indexOf("Safari")>-1&&-1===a.indexOf("Chrome")?"Safari":a.indexOf("Chrome")>-1&&a.indexOf("Safari")>-1?"Chrome":void 0},validateIE9:function(){return!(!$.browser.msie||"9.0"!==$.browser.version&&"8.0"!==$.browser.version&&"7.0"!==$.browser.version&&"6.0"!==$.browser.version)},compareTime:function(a,b){return a&&b?Math.abs((b-a)/1e3/60/60/24):""},changeURLPar:function(url,arg,arg_val){var pattern=arg+"=([^&]*)",replaceText=arg+"="+arg_val;if(url.match(pattern)){var tmp="/("+arg+"=)([^&]*)/gi";return tmp=url.replace(eval(tmp),replaceText)}return url.match("[?]")?url+"&"+replaceText:url+"?"+replaceText},getUrlAllParams:function(a){if("undefined"==typeof a)var b=decodeURI(location.search);else var b="?"+a.split("?")[1];var c=new Object;if(-1!=b.indexOf("?"))for(var d=b.substr(1),e=d.split("&"),f=0;f<e.length;f++)c[e[f].split("=")[0]]=decodeURI(e[f].split("=")[1]);return c},compatibleIESkip:function(a,b){var c=document.createElement("a");c.href=a,c.style.display="none",b&&(c.target="_blank"),document.body.appendChild(c),c.click()}}}),define("dist/application/api",[],function(a,b,c){var d="/gateway/pc",e="/gateway";c.exports={user:{login:d+"/usermanage/checkLogin",loginOut:"",collect:d+"/usermanage/collect",getJessionId:d+"/usermanage/getJessionId",getSessionInfo:d+"/usermanage/getSessionInfo"},sale:{querySeniority:d+"/sale/querySeniority"},normalFileDetail:{addComment:d+"/fileSync/addComment",reportContent:d+"/fileSync/addFeedback",isStore:d+"/fileSync/getFileCollect",collect:d+"/fileSync/collect",filePreDownLoad:d+"/action/downloadCheck",fileDownLoad:d+"/action/downloadUrl",appraise:d+"/fileSync/appraise",getPrePageInfo:d+"/fileSync/prePageInfo",hasDownLoad:d+"/fileSync/isDownload"},officeFileDetail:{},search:{byPosition:d+"/operating/byPosition"},sms:{getCaptcha:d+"/usermanage/getSmsYzCode"},pay:{successBuyDownLoad:d+"/action/downloadNow"},vouchers:d+"/sale/vouchers",order:{bindOrderByOrderNo:d+"/order/bindOrderByOrderNo",unloginOrderDown:d+"/order/unloginOrderDown"},getHotSearch:d+"/search/getHotSearch",special:{fileSaveOrupdate:e+"/comment/collect/fileSaveOrupdate"}}}),define("dist/application/app",["dist/application/method","dist/application/element","dist/application/template","dist/application/extend","dist/report/init","dist/report/handler","dist/cmd-lib/util","dist/report/columns","dist/report/config","dist/application/helper","//static3.iask.cn/resource/js/plugins/pc.iask.login.min"],function(a,b,c){var d=a("dist/application/method");return a("dist/application/element"),a("dist/application/extend"),a("dist/report/init"),window.template=a("dist/application/template"),a("dist/application/helper"),a("//static3.iask.cn/resource/js/plugins/pc.iask.login.min.js"),window.getCookie=d.getCookie,{method:d,v:"1.0.1"}}),define("dist/application/element",["dist/application/method","dist/application/template"],function(a,b,c){a("dist/application/method"),a("dist/application/template");if(window.pageConfig&&window.pageConfig.hotData){JSON.parse(window.pageConfig.hotData)}var d=function(a){var b={ele:a,init:function(){return this.ele[0].addEventListener("click",function(){$("html, body").animate({scrollTop:0},120)},!1),window.addEventListener("scroll",this,!1),this},handleEvent:function(a){var b=$(document).scrollTop();$(window).height();return b>100?this.ele.show():this.ele.hide(),b>10?$(".m-header").addClass("header-fix"):$(".m-header").removeClass("header-fix"),this}};b.init().handleEvent()};$("#backToTop").length&&d&&d($("#backToTop"))}),!function(){function a(a){return a.replace(t,"").replace(u,",").replace(v,"").replace(w,"").replace(x,"").split(/^$|,+/)}function b(a){return"'"+a.replace(/('|\\)/g,"\\$1").replace(/\r/g,"\\r").replace(/\n/g,"\\n")+"'"}function c(c,d){function e(a){return m+=a.split(/\n/).length-1,k&&(a=a.replace(/[\n\r\t\s]+/g," ").replace(/<!--.*?-->/g,"")),a&&(a=s[1]+b(a)+s[2]+"\n"),a}function f(b){var c=m;if(j?b=j(b,d):g&&(b=b.replace(/\n/g,function(){return m++,"$line="+m+";"})),0===b.indexOf("=")){var e=l&&!/^=[=#]/.test(b);if(b=b.replace(/^=[=#]?|[\s;]*$/g,""),e){var f=b.replace(/\s*\([^\)]+\)/,"");n[f]||/^(include|print)$/.test(f)||(b="$escape("+b+")")}else b="$string("+b+")";b=s[1]+b+s[2]}return g&&(b="$line="+c+";"+b),r(a(b),function(a){if(a&&!p[a]){var b;b="print"===a?u:"include"===a?v:n[a]?"$utils."+a:o[a]?"$helpers."+a:"$data."+a,w+=a+"="+b+",",p[a]=!0}}),b+"\n"}var g=d.debug,h=d.openTag,i=d.closeTag,j=d.parser,k=d.compress,l=d.escape,m=1,p={$data:1,$filename:1,$utils:1,$helpers:1,$out:1,$line:1},q="".trim,s=q?["$out='';","$out+=",";","$out"]:["$out=[];","$out.push(",");","$out.join('')"],t=q?"$out+=text;return $out;":"$out.push(text);",u="function(){var text=''.concat.apply('',arguments);"+t+"}",v="function(filename,data){data=data||$data;var text=$utils.$include(filename,data,$filename);"+t+"}",w="'console.log(3316)';var $utils=this,$helpers=$utils.$helpers,"+(g?"$line=0,":""),x=s[0],y="return new String("+s[3]+");";r(c.split(h),function(a){a=a.split(i);var b=a[0],c=a[1];1===a.length?x+=e(b):(x+=f(b),c&&(x+=e(c)))});var z=w+x+y;g&&(z="try{"+z+"}catch(e){throw {filename:$filename,name:'Render Error',message:e.message,line:$line,source:"+b(c)+".split(/\\n/)[$line-1].replace(/^[\\s\\t]+/,'')};}");try{var A=new Function("$data","$filename",z);return A.prototype=n,A}catch(B){throw B.temp="function anonymous($data,$filename) {"+z+"}",B}}var d=function(a,b){return"string"==typeof b?q(b,{filename:a}):g(a,b)};d.version="3.0.0",d.config=function(a,b){e[a]=b};var e=d.defaults={openTag:"<%",closeTag:"%>",escape:!0,cache:!0,compress:!1,parser:null},f=d.cache={};d.render=function(a,b){return q(a,b)};var g=d.renderFile=function(a,b){var c=d.get(a)||p({filename:a,name:"Render Error",message:"Template not found"});return b?c(b):c};d.get=function(a){var b;if(f[a])b=f[a];else if("object"==typeof document){var c=document.getElementById(a);if(c){var d=(c.value||c.innerHTML).replace(/^\s*|\s*$/g,"");b=q(d,{filename:a})}}return b};var h=function(a,b){return"string"!=typeof a&&(b=typeof a,"number"===b?a+="":a="function"===b?h(a.call(a)):""),a},i={"<":"&#60;",">":"&#62;",'"':"&#34;","'":"&#39;","&":"&#38;"},j=function(a){return i[a]},k=function(a){return h(a).replace(/&(?![\w#]+;)|[<>"']/g,j)},l=Array.isArray||function(a){return"[object Array]"==={}.toString.call(a)},m=function(a,b){var c,d;if(l(a))for(c=0,d=a.length;d>c;c++)b.call(a,a[c],c,a);else for(c in a)b.call(a,a[c],c)},n=d.utils={$helpers:{},$include:g,$string:h,$escape:k,$each:m};d.helper=function(a,b){o[a]=b};var o=d.helpers=n.$helpers;d.onerror=function(a){var b="Template Error\n\n";for(var c in a)b+="<"+c+">\n"+a[c]+"\n\n";"object"==typeof console&&console.error(b)};var p=function(a){return d.onerror(a),function(){return"{Template Error}"}},q=d.compile=function(a,b){function d(c){try{return new i(c,h)+""}catch(d){return b.debug?p(d)():(b.debug=!0,q(a,b)(c))}}b=b||{};for(var g in e)void 0===b[g]&&(b[g]=e[g]);var h=b.filename;try{var i=c(a,b)}catch(j){return j.filename=h||"anonymous",j.name="Syntax Error",p(j)}return d.prototype=i.prototype,d.toString=function(){return i.toString()},h&&b.cache&&(f[h]=d),d},r=n.$each,s="break,case,catch,continue,debugger,default,delete,do,else,false,finally,for,function,if,in,instanceof,new,null,return,switch,this,throw,true,try,typeof,var,void,while,with,abstract,boolean,byte,char,class,const,double,enum,export,extends,final,float,goto,implements,import,int,interface,long,native,package,private,protected,public,short,static,super,synchronized,throws,transient,volatile,arguments,let,yield,undefined",t=/\/\*[\w\W]*?\*\/|\/\/[^\n]*\n|\/\/[^\n]*$|"(?:[^"\\]|\\[\w\W])*"|'(?:[^'\\]|\\[\w\W])*'|[\s\t\n]*\.[\s\t\n]*[$\w\.]+/g,u=/[^\w$]+/g,v=new RegExp(["\\b"+s.replace(/,/g,"\\b|\\b")+"\\b"].join("|"),"g"),w=/^\d[^,]*|,\d[^,]*/g,x=/^,+|,+$/g;e.openTag="{{",e.closeTag="}}";var y=function(a,b){var c=b.split(":"),d=c.shift(),e=c.join(":")||"";return e&&(e=", "+e),"$helpers."+d+"("+a+e+")"};e.parser=function(a,b){a=a.replace(/^\s/,"");var c=a.split(" "),e=c.shift(),f=c.join(" ");switch(e){case"if":a="if("+f+"){";break;case"else":c="if"===c.shift()?" if("+c.join(" ")+")":"",a="}else"+c+"{";break;case"/if":a="}";break;case"each":var g=c[0]||"$data",h=c[1]||"as",i=c[2]||"$value",j=c[3]||"$index",k=i+","+j;"as"!==h&&(g="[]"),a="$each("+g+",function("+k+"){";break;case"/each":a="});";break;case"echo":a="print("+f+");";break;case"print":case"include":a=e+"("+c.join(",")+");";break;default:if(-1!==f.indexOf("|")){var l=b.escape;0===a.indexOf("#")&&(a=a.substr(1),l=!1);for(var m=0,n=a.split("|"),o=n.length,p=l?"$escape":"$string",q=p+"("+n[m++]+")";o>m;m++)q=y(q,n[m]);a="=#"+q}else a=d.helpers[e]?"=#"+e+"("+c.join(",")+");":"="+a}return a},"function"==typeof define?define("dist/application/template",[],function(){return d}):"undefined"!=typeof exports?module.exports=d:this.template=d}(),define("dist/application/extend",[],function(a,b,c){String.prototype.format||(String.prototype.format=function(){var a=arguments;return this.replace(/{(\d+)}/g,function(b,c){return"undefined"!=typeof a[c]?a[c]:b})}),String.prototype.trim||(String.prototype.trim=function(){return this.replace(/^\s*/,"").replace(/\s*$/,"")}),String.prototype.stripTags||(String.prototype.stripTags=function(){return this.replace(/<\/?[^>]+>/gi,"")})}),define("dist/report/init",["dist/report/handler","dist/cmd-lib/util","dist/report/columns","dist/report/config","dist/application/method"],function(a,b,c){a("dist/report/handler")}),define("dist/report/handler",["dist/cmd-lib/util","dist/report/columns","dist/report/config","dist/application/method"],function(a,b,c){function d(a,b){this.options=$.extend(!0,g,a),this.config=$.extend(!0,h,b),this.init()}var e,f=a("dist/cmd-lib/util"),g=a("dist/report/columns"),h=a("dist/report/config"),i=a("dist/application/method");d.prototype={init:function(){this.client(),this.send(0,this.format()),this.send(2,(new Date).getTime()),gio&&pageConfig.report&&gio("page.set",pageConfig.report)},client:function(){var a="";pageConfig.page&&(a=pageConfig.page.uid||""),!a&&i.getCookie(this.config.COOKIE_CUK)&&(a="logined"),this.options.uid=a,i.getCookie(this.config.COOKIE_CIDE)?e=i.getCookie(this.config.COOKIE_CIDE):(e=(new Date).getTime()+""+Math.random(),i.setCookieWithExpPath(this.options.cid,e,2592e6,"/")),this.options.usource=f.getReferrer(),this.options.cid=e,this.clickWatch()},getIpAddress:function(){var a=this;$.getScript("//ipip.iask.cn/iplookup/search?format=js",function(b,c){"success"===c?a.options=$.extend(!0,a.options,{city:remote_ip_info.cityCode,province:remote_ip_info.provinceCode,ip:remote_ip_info.ip}):console.error("ipip获取ip信息error")})},clickWatch:function(){var a=this;$(document).delegate("."+this.config.EVENT_NAME,"click",function(b){var c=$(this).attr(a.config.CONTENT_NAME);a.setCurrEventCon(c),($.browser.msie&&$.browser.version<=8&&a.mousePosition(b).x>=0||b.originalEvent&&b.originalEvent.isTrusted)&&c&&a.push([a.config.CONTENT_NAME,c]),$(this).trigger("init",b)})},gioTrack:function(a,b){gio&&b&&gio("track",a,b)},gioPage:function(a){gio&&a&&gio("page.set",a)},push:function(a,b){a instanceof Array&&a&&a.length>1&&(a.shift(),a.length>0&&a[0]==this.config.eventCookieFlag&&(a.shift(),this.handleCookieFlag(a.join("_"))),this.options.clickName=a[0]);var c=this.format();this.send(1,c),b&&b(c)},handleCookieFlag:function(a){try{var b=i.getCookie(this.config.COOKIE_FLAG);if(b){var c=JSON.parse(b);c.v=a,c.t=(new Date).getTime(),i.setCookieWithExpPath(this.config.COOKIE_FLAG,JSON.stringify(c),3e6,"/")}}catch(d){}},format:function(){try{var a=this.options,b=[a.cid,a.uid,a.ptype,a.usource,a.fsource,a.ftype,a.format,a.cate,a.cateName,a.cate1,a.cate2,a.ip,a.province,a.city,a.clickName,a.time,a.timestamp];return b.join("_")}catch(c){}},send:function(a,b){i.get(this.config.SERVER_URL+"?"+a+"_"+encodeURIComponent(b),function(){},"")},mousePosition:function(a){try{return a=a||window.event,a.pageX||a.pageY?{x:a.pageX,y:a.pageY}:{x:a.clientX+document.body.scrollLeft-document.body.clientLeft,y:a.clientY+document.body.scrollTop-document.body.clientTop}}catch(b){}},uActionReport:function(a){$.get(this.uActionUrl+"?"+encodeURIComponent(a)+"_"+(new Date).getTime(),function(a,b){})},setCurrEventCon:function(a){i.setCookieWithExpPath("_dpclkcnt",a,3e5,"/")}},window._dataReport=new d(window.pageConfig.report),window.__pc__=window._dataReport;try{!function(){var a=document.createElement("script");a.src="//hm.baidu.com/hm.js?adb0f091db00ed439bf000f2c5cbaee7";var b=document.getElementsByTagName("script")[0];b.parentNode.insertBefore(a,b)}()}catch(j){}}),define("dist/cmd-lib/util",[],function(a,b,c){var d={throttle:function(a,b){var c,d;return function(e){var f=this,g=arguments,h=+new Date;c&&c+b>h?(clearTimeout(d),d=setTimeout(function(){c=h,a.apply(f,g)},b)):(c=h,a.apply(f,g))}},debounce:function(a,b){var c=0,d=this;return function(e){c&&clearTimeout(c),c=setTimeout(function(){a.apply(d,e)},b)}},isWeChatBrow:function(){var a=navigator.userAgent.toLowerCase(),b=-1!=a.indexOf("micromessenger");return b?!0:!1},getWebAppUA:function(){var a=0,b=navigator.userAgent.toLowerCase();return/iphone|ipad|ipod/.test(b)?a=1:/android/.test(b)&&(a=0),a},validateIE8:function(){return!$.browser.msie||"8.0"!=$.browser.version&&"7.0"!=$.browser.version&&"6.0"!=$.browser.version?!1:!0},validateIE9:function(){return!$.browser.msie||"9.0"!=$.browser.version&&"8.0"!=$.browser.version&&"7.0"!=$.browser.version&&"6.0"!=$.browser.version?!1:!0},getReferrer:function(){var a=document.referrer,b="";return/https?\:\/\/[^\s]*wenku.so.com.*$/g.test(a)?b="360wenku":/https?\:\/\/[^\s]*so.com.*$/g.test(a)?b="360":/https?\:\/\/[^\s]*baidu.com.*$/g.test(a)?b="baidu":/https?\:\/\/[^\s]*sogou.com.*$/g.test(a)?b="sogou":/https?\:\/\/[^\s]*sm.cn.*$/g.test(a)?b="sm":/https?\:\/\/[^\s]*ishare.iask.sina.com.cn.*$/g.test(a)?b="ishare":/https?\:\/\/[^\s]*iask.sina.com.cn.*$/g.test(a)&&(b="iask"),b},getPageRef:function(a){var b=this,c=0;return(b.is360cookie(a)||b.is360cookie("360"))&&(c=1),b.is360wkCookie()&&(c=3),c},is360cookie:function(a){var b=this,c=b.getCookie("_r_so");if(c)for(var d=c.split("_"),e=0;e<d.length;e++)if(d[e]==a)return!0;return!1},add360wkCookie:function(){this.setCookieWithExpPath("_360hz","1",18e5,"/")},is360wkCookie:function(){return null==getCookie("_360hz")?!1:!0},getCookie:function(a){var b=document.cookie.match(new RegExp("(^| )"+a+"=([^;]*)(;|$)"));return null!==b?unescape(b[2]):null},setCookieWithExpPath:function(a,b,c,d){var e=new Date;e.setTime(e.getTime()+c),document.cookie=a+"="+escape(b)+";path="+d+";expires="+e.toGMTString()},findRefer:function(){var a=document.referrer,b="other";return/https?\:\/\/[^\s]*\/f\/.*$/g.test(a)?b="pindex":/https?\:\/\/[^\s]*\/d\/.*$/g.test(a)?b="landing":/https?\:\/\/[^\s]*\/c\/.*$/g.test(a)?b="pcat":/https?\:\/\/[^\s]*\/search\/.*$/g.test(a)?b="psearch":/https?\:\/\/[^\s]*\/t\/.*$/g.test(a)?b="ptag":/https?\:\/\/[^\s]*\/[u|n]\/.*$/g.test(a)?b="popenuser":/https?\:\/\/[^\s]*\/ucenter\/.*$/g.test(a)?b="puser":/https?\:\/\/[^\s]*ishare.iask.sina.com.cn.$/g.test(a)?b="ishareindex":/https?\:\/\/[^\s]*\/theme\/.*$/g.test(a)?b="theme":/https?\:\/\/[^\s]*wenku.so.com.*$/g.test(a)?b="360wenku":/https?\:\/\/[^\s]*so.com.*$/g.test(a)?b="360":/https?\:\/\/[^\s]*baidu.com.*$/g.test(a)?b="baidu":/https?\:\/\/[^\s]*sogou.com.*$/g.test(a)?b="sogou":/https?\:\/\/[^\s]*sm.cn.*$/g.test(a)?b="sm":/https?\:\/\/[^\s]*ishare.iask.sina.com.cn.*$/g.test(a)?b="ishare":/https?\:\/\/[^\s]*iask.sina.com.cn.*$/g.test(a)&&(b="iask"),b},showAlertDialog:function(a,b,c){var d=$(".common-bgMask"),e=$(".common-dialog");e.find("h2[name='title']").text(a),e.find("span[name='content']").html(b),e.find("a.close,a.btn-dialog").unbind("click").click(function(){d.hide(),e.hide(),c&&!$(this).hasClass("close")&&c()}),d.show(),e.show()},browserVersion:function(a){var b=a.indexOf("Opera")>-1,c=a.indexOf("compatible")>-1&&a.indexOf("MSIE")>-1&&!b,d=a.indexOf("Edge")>-1,e=a.indexOf("Firefox")>-1,f=a.indexOf("Safari")>-1&&-1===a.indexOf("Chrome"),g=a.indexOf("Chrome")>-1&&a.indexOf("Safari")>-1;if(c){var h=new RegExp("MSIE (\\d+\\.\\d+);");h.test(a);var i=parseFloat(RegExp.$1);return 7===i?"IE7":8===i?"IE8":9===i?"IE9":10===i?"IE10":11===i?"IE11":12===i?"IE12":"IE"}return b?"Opera":d?"Edge":e?"Firefox":f?"Safari":g?"Chrome":"unKnow"},getBrowserInfo:function(a){var b={},c=a.toLowerCase(),d=/(msie|firefox|chrome|opera|version|trident).*?([\d.]+)/,e=c.match(d);return e&&e.length>=2?(b.browser=e[1].replace(/version/,"'safari")||"unknow",b.ver=e[2]||"1.0.0"):(b.browser="unknow",b.ver="1.0.0"),b.browser+"/"+b.ver}};c.exports=d}),define("dist/report/columns",[],function(a,b,c){return{cid:"",uid:"",ptype:"",usource:"",fsource:"",ftype:"",format:"",cate:"",cateName:"",cate1:"",cate2:"",ip:"",province:"",city:"",clickName:"",time:"",timestamp:""}}),define("dist/report/config",[],function(a,b,c){return{COOKIE_FLAG:"_dplf",COOKIE_CIDE:"_dpcid",COOKIE_CUK:"cuk",COOKIE_TIMEOUT:3e6,SERVER_URL:"/dataReport",UACTION_URL:"/uAction",EVENT_NAME:"pc_click",CONTENT_NAME:"pcTrackContent",BILOG_CONTENT_NAME:"bilogContent",ishareTrackEvent:"_ishareTrackEvent",eventCookieFlag:"_eventCookieFlag",EVENT_REPORT:!1,AUTO_PV:!1}}),define("dist/application/helper",[],function(a,b,c){template.helper("encodeValue",function(a){return encodeURIComponent(encodeURIComponent(a))})}),define("dist/application/suspension",["dist/application/method","dist/application/checkLogin","dist/application/api","dist/application/app","dist/application/element","dist/application/template","dist/application/extend","dist/report/init","dist/report/handler","dist/cmd-lib/util","dist/report/columns","dist/report/config","dist/application/helper","//static3.iask.cn/resource/js/plugins/pc.iask.login.min"],function(a,b,c){function d(){function a(a,b){b=b||0,!a||1!==b&&2!==b?g.animate({right:"-307px"},200):j.getCookie("cuk")?(f(b),g.animate({right:"61px"},500)):k.notifyLoginInterface(function(a){e(g,b,a)}),a&&0===b?j.getCookie("cuk")?window.open("/node/rights/vip.html","target"):k.notifyLoginInterface(function(a){e(null,b,a),window.open("/node/rights/vip.html","target")}):1===b?($(".mui-user-wrap").css("visibility","hidden"),$(".mui-sel-wrap").css("visibility","visible"),$(".mui-collect-wrap").css("visibility","hidden")):2===b?($(".mui-user-wrap").css("visibility","hidden"),$(".mui-sel-wrap").css("visibility","hidden"),$(".mui-collect-wrap").css("visibility","visible")):(4===b||6===b)&&g.animate({right:"-307px"},200)}function b(a){var b=$(window).height();b>=920?d.removeClass("fixed-min-height"):d.addClass("fixed-min-height")}var c=$(".fixed-op").find(".J_menu"),d=$(".fixed-right-full"),g=d.find(".fixed-detail-wrap");$(".btn-detail-back").on("click",function(){a(!1),c.removeClass("active")}),$(document).on("click",function(){a(!1),c.removeClass("active")}),d.on("click",".js-buy-open",function(){j.compatibleIESkip("/pay/vip.html",!0)}),$(".op-menu-wrap").click(function(a){a.stopPropagation()}),c.on("click",function(){var b=$(this).index();$(this).hasClass("active")?($(this).removeClass("active"),a(!1)):($(this).addClass("active").siblings().removeClass("active"),a(!0,b))}),$(window).bind("resize ready",b)}function e(a,b,c){var d=$("#unLogin"),e=$("#haveLogin"),g=$(".top-user-more"),h=$(".icon-iShare-text"),i=$(".btn-user-more"),j=$(".vip-status");h.html("1"==c.isVip?"续费VIP":"开通VIP"),i.text("1"==c.isVip?"续费":"开通"),"0"==c.isVip?$(".open-vip").show().siblings("a").hide():$(".xf-open-vip").show().siblings("a").hide();var k=null;if("1"==c.isVip?(k=j.find('p[data-type="2"]'),k.find(".expire_time").html(c.expireTime),k.show().siblings().hide()):"1"==c.isVip&&"2"==c.userType&&(k=j.find('p[data-type="3"]'),k.show().siblings().hide()),d.hide(),e.find(".icon-detail").html(c.nickName),e.find("img").attr("src",c.weiboImage),g.find("img").attr("src",c.weiboImage),g.find("#userName").html(c.nickName),e.show(),$(".user-avatar img").attr("src",c.weiboImage),$(".name-wrap .name-text").html(c.nickName),"1"==c.isVip){var l="您的VIP将于"+c.expireTime+"到期,剩余"+c.privilege+"次下载特权";$(".detail-right-normal-wel").html(l),$(".detail-right-vip-wel").html("会员尊享权益"),$(".btn-mui").hide(),$("#memProfit").html("VIP权益")}else $(".mui-privilege-list li").removeClass("hide");f(b),a&&a.animate({right:"61px"},500)}function f(a){1===a?g():2===a&&h()}function g(){var a=j.keyMap.ishare_detail_access,b=j.getLocalData(a),c=$("#seenRecord"),d=[];if(b&&b.length){b=b.slice(0,20);for(var e=0;e<b.length;e++){var f=b[e],g='<li><i class="ico-data ico-'+f.format+'"></i><a target="_blank" href="/f/'+f.fileId+'.html">'+f.title+"</a></li>";d.push(g)}c.html(d.join(""))}else c.hide().siblings(".mui-data-null").show()}function h(){var a={pageNum:1,pageSize:20};$.ajax(l.user.collect,{type:"get",async:!1,data:a,dataType:"json"}).done(function(a){0==a.code&&i(a.data)}).fail(function(a){console.log("error==="+a)})}function i(a){var b=$("#myCollect"),c=[];if(a&&a.length){for(var d=a.slice(0,20),e=0;e<d.length;e++){var f=d[e],g='<li><i class="ico-data ico-'+f.format+'"></i><a target="_blank" href="/f/'+f.fileId+'.html">'+f.name+"</a></li>";c.push(g)}b.html(c.join("")),a.length>20&&b.siblings(".btn-mui-fix").removeClass("hide")}else b.siblings(".mui-data-null").removeClass("hide")}var j=a("dist/application/method"),k=a("dist/application/checkLogin"),l=(a("dist/application/app"),a("dist/application/api"));d(),$(".op-feedback").on("click",function(){var a=window.location.href;j.compatibleIESkip("/feedAndComp/userFeedback?url="+encodeURIComponent(a),!0)}),$("#go-back-top").on("click",function(){$("body,html").animate({scrollTop:0},200)});try{!function(a,b,c,d,e,f,g){a[d]=a[d]||function(){(a[d].a=a[d].a||[]).push(arguments)},f=b.createElement(c),g=b.getElementsByTagName(c)[0],f.async=!0,f.charset="UTF-8",f.src="//static.meiqia.com/dist/meiqia.js?_=t",g.parentNode.insertBefore(f,g)}(window,document,"script","_MEIQIA"),_MEIQIA("entId","149498"),_MEIQIA("allSet",function(){_MEIQIA("showPanel")}),_MEIQIA("manualInit")}catch(m){}$(".btn-mui-contact").on("click",function(){_MEIQIA("init")}),c.exports={usermsg:function(a){if($(".user-avatar img").attr("src",a.weiboImage),$(".name-wrap .name-text").html(a.nickName),"1"==a.isVip){var b="您的VIP将于"+a.expireTime+"到期,剩余"+a.privilege+"次下载特权";$(".detail-right-normal-wel").html(b),$(".detail-right-vip-wel").html("会员尊享权益"),$(".btn-mui").hide(),$("#memProfit").html("VIP权益")}else $(".mui-privilege-list li").removeClass("hide")}}}),define("dist/search/search",["dist/application/method","dist/application/api","swiper","dist/common/gioPageSet"],function(a,b,c){function d(){var a=decodeURIComponent(decodeURIComponent(p.getParam("cond")));r.gioPageSet({searchContent_pvar:a})}function e(){$.ajax({url:q.search.byPosition,type:"POST",data:JSON.stringify({position:"SOLR_BANNER",count:6,client:"pc"}),contentType:"application/json; charset=utf-8",dataType:"json",success:function(a){var b=$(".banner").find(".swiper-wrapper"),c=document.createDocumentFragment();if(a.data=a.data||[],a.data.forEach(function(a,b){var d=document.createElement("a");d.href=a.url,d.className="swiper-slide",d.style.backgroundImage="url("+a.img+")",c.appendChild(d)}),b.html(c),a.data.length>1){new Swiper(".swiper-container",{direction:"horizontal",loop:!0,autoplay:3e3})}}})}function f(){var a=$("#scondition"),b=$("#searchBtn");b.on("click",function(){var b=a.val().trim()||"";b=b.replace(/\s+/g,""),/\S/.test(b)&&g("cond",b)}),a.on("keydown",function(b){if(13===b.keyCode){var c=a.val().trim()||"";c=c.replace(/\s+/g,""),/\S/.test(c)&&g("cond",c)}})}function g(a,b){var c=window.location.href.substring(0,window.location.href.indexOf("?"));window.location.href=p.changeURLPar(c,a,encodeURIComponent(encodeURIComponent(b.substr(0,20))))}function h(){var a=$(".related-search-list").find("a").get(),b=$(".landing-hot-list").find("a").get(),c=a.concat(b);c.forEach(function(a,b){$(a).click(function(){var b=$(a).text().trim();g("cond",b)})})}function i(){var a=$(".search-item"),b=m(a);b.forEach(function(b,c){var d=$(b).find(".search-ele"),e=m(d);e.forEach(function(b,d){$(b).on("click",function(){$(b).addClass("active").siblings().removeClass("active");var d=a.eq(c).find(".search-title").attr("value"),e=$(b).attr("value");s[d]=e,s.pageIndex=1,j(s)})})})}function j(a){var b=window.location.href;for(var c in a)b=p.changeURLPar(b,c,a[c]);
window.location.href=b}function k(){var a=$(".search-result").find(".screen-ele"),b=m(a);b.forEach(function(b,c){$(b).on("click",function(){a.eq(c).addClass("current").siblings().removeClass("current");var b=a.eq(c).attr("value");j({sequence:b,pageIndex:1})})})}function l(){var a=$(".header-box"),b=$(a).offset().top;$(window).on("scroll",function(){var c=$(window).scrollTop();$(a).css("position",c>b?"fixed":"static"),$(a).css("top",c>b?"0px":"")})}function m(a){return Array.prototype.slice.call(a,0)}function n(){var a=$(".search-screen"),b=$(".search-item ");a.on("click",function(){"更多筛选"===a.children().eq(0).text()?(a.children().eq(0).text("收起筛选"),b.removeClass("hide")):(a.children().eq(0).text("更多筛选"),b.eq(2).addClass("hide"),b.eq(3).addClass("hide")),a.children().eq(1).toggleClass("screen-less")})}function o(){var a=$(".office-page"),b=a.find(".btn-page-long"),c=a.find(".btn-page"),d=a.find(".page-ele"),e=d.length-1,f=p.getParam("pageIndex"),g=f-1;g=g>0?g:0,d.eq(g).addClass("active").siblings().removeClass("active"),g>0&&(b.eq(0).show(),c.eq(0).show()),0!==g&&g!==e&&(d.eq(g-2).show(),d.eq(g-1).show(),d.eq(g).show(),d.eq(g+1).show(),d.eq(g+2).show(),g-2>0?d.eq(g-2).before('<span class="page-point">...</span>'):null,e-1>g+2?d.eq(g+2).after('<span class="page-point">...</span>'):null),0===g&&(b.eq(0).hide(),c.eq(0).hide(),d.eq(1).show(),d.eq(2).show(),d.eq(3).show(),d.eq(4).show(),d.eq(4).after('<span class="page-point">...</span>')),g===e&&(b.eq(1).hide(),c.eq(1).hide(),d.eq(e-4).show(),d.eq(e-3).show(),d.eq(e-2).show(),d.eq(e-1).show(),d.eq(e-4).before('<span class="page-point">...</span>')),g>0&&e>g&&(b.show(),c.show()),d.eq(0).show(),d.eq(e).show(),d.click(function(){var a=$(this).attr("value")-0+1;j({pageIndex:a})}),b.eq(0).click(function(){j({pageIndex:1})}),b.eq(1).click(function(){f?e+1>=g+1&&j({pageIndex:g+2}):j({pageIndex:2})}),c.eq(0).click(function(){j({pageIndex:g})}),c.eq(1).click(function(){j({pageIndex:e+1})})}var p=a("dist/application/method"),q=a("dist/application/api");a("swiper");var r=a("dist/common/gioPageSet");d(),f(),e(),i(),n(),k(),l(),h(),o();var s={}}),define("dist/common/gioPageSet",[],function(a,b,c){c.exports={gioPageSet:function(a){var b=document.referrer,c=window.location.href,d=null,e=null,f={home:new RegExp("ishare.iask.sina.com.cn/").test(b),homeCurrent:new RegExp("ishare.iask.sina.com.cn/").test(c),ishareindex:"ishareindex",f:new RegExp("ishare.iask.sina.com.cn/f/").test(b),fCurrent:new RegExp("ishare.iask.sina.com.cn/f/").test(c),pindex:"pindex",c:new RegExp("ishare.iask.sina.com.cn/c/").test(b),cCurrent:new RegExp("ishare.iask.sina.com.cn/c/").test(c),pcat:"pcat",search:new RegExp("ishare.iask.sina.com.cn/search/").test(b),searchCurrent:new RegExp("ishare.iask.sina.com.cn/search/").test(c),psearch:"psearch",ucenter:new RegExp("ishare.iask.sina.com.cn/ucenter/").test(b),ucenterCurrent:new RegExp("ishare.iask.sina.com.cn/ucenter/").test(c),puser:"puser",t:new RegExp("ishare.iask.sina.com.cn/t/").test(b),tCurrent:new RegExp("ishare.iask.sina.com.cn/t/").test(c),ptag:"ptag",d:new RegExp("ishare.iask.sina.com.cn/d/").test(b),dCurrent:new RegExp("ishare.iask.sina.com.cn/d/").test(c),landing:"landing",themeindex:new RegExp("ishare.iask.sina.com.cn/theme").test(b),themeindexCurrent:new RegExp("ishare.iask.sina.com.cn/theme").test(c),theme:"theme",u:new RegExp("ishare.iask.sina.com.cn/u/").test(b),uCurrent:new RegExp("ishare.iask.sina.com.cn/u/").test(c),n:new RegExp("ishare.iask.sina.com.cn/n/").test(b),nCurrent:new RegExp("ishare.iask.sina.com.cn/n/").test(c),popenuser:"popenuser"};d=f.search?f.psearch:f.themeindex?f.theme:f.d?f.landing:f.t?f.ptag:f.ucenter?f.puser:f.c?f.pcat:f.f?f.pindex:f.u||f.n?f.popenuser:f.home?f.ishareindex:"other",e=f.searchCurrent?f.psearch:f.themeindexCurrent?f.theme:f.dCurrent?f.landing:f.tCurrent?f.ptag:f.ucenterCurrent?f.puser:f.cCurrent?f.pcat:f.fCurrent?f.pindex:f.uCurrent||f.nCurrent?f.popenuser:f.homeCurrent?f.ishareindex:"other";var g={currentUrl_pvar:decodeURIComponent(decodeURIComponent(c)),sourcePage_pvar:d,currentPageType_pvar:e};for(var h in a)g[h]=a[h];__pc__.gioPage(g)}}});