/*! ishare_pc_website
*author:Jersey */
define("dist/rights/index",["../application/method","../application/checkLogin","../application/api"],function(a,b,c){function d(a){var b=$("#unLogin"),c=$("#haveLogin"),d=$(".btn-user-more"),e=$(".vip-status"),f=$(".top-user-more");d.text(1==a.isVip?"续费VIP":"开通VIP");var g=null;$("#user-msg").text(a.msgCount),$(".message-btn").attr("href","/user/message/index?u="+a.userId),1==a.isVip?(g=e.find('p[data-type="2"]'),g.find(".expire_time").html(a.expireTime),g.show().siblings().hide(),f.addClass("top-vip-more"),h.html("立即续费")):1==a.userType?(g=e.find('p[data-type="3"]'),c.removeClass("user-con-vip"),g.show().siblings().hide()):0==a.isVip?c.removeClass("user-con-vip"):2==a.isVip&&$(".vip-title").hide(),b.addClass("hide"),c.removeClass("hide"),c.find(".user-link .user-name").html(a.nickName),c.find(".user-link img").attr("src",a.weiboImage),c.find(".top-user-more .name").html(a.nickName),c.find(".top-user-more img").attr("src",a.weiboImage)}function e(){f.getCookie("cuk")&&g.getLoginData(function(a){d(a)})}var f=a("../application/method"),g=a("../application/checkLogin"),h=$(".vip-privilege-btn");e(),h.on("click",function(){$(this).attr("data-status");f.getCookie("cuk")?f.compatibleIESkip("/pay/vip.html",!1):g.notifyLoginInterface(function(a){g.getLoginData(function(a){d(a),f.compatibleIESkip("/pay/vip.html",!1)})})}),$(".menu-items-center div").on("click",function(){var a=$(this).attr("data-type"),b=0;"privilege"===a?b=440:"material"===a&&(b=1150),$(this).addClass("index").siblings("div").removeClass("index"),$("body,html").animate({scrollTop:b},200)}),$(".vip-user-list .btn").on("click",function(){f.getCookie("cuk")?f.compatibleIESkip("/pay/vip.html",!1):g.notifyLoginInterface(function(a){g.getLoginData(function(a){f.compatibleIESkip("/pay/vip.html",!1)})})}),$(".zq-btn ").on("click","a",function(){var a=$(this),b=a.attr("data-id"),c=$("#"+b);a.addClass("linkButton").siblings("a").removeClass("linkButton"),c.removeClass("hide").siblings(".vip-img-list").addClass("hide")}),$(".btn-user-more").on("click",function(){f.compatibleIESkip("/pay/vip.html",!1)}),$(".message-btn").on("click",function(){f.getCookie("cuk")||g.notifyLoginInterface(function(a){d(a)})}),$("#unLogin").on("click",function(){f.getCookie("cuk")||g.notifyLoginInterface(function(a){d(a)})}),$(".js-logout").on("click",function(){g.ishareLogout()});var i="/feedAndComp/userFeedback?url="+encodeURIComponent(location.href);$(".user-feedback").attr("href",i)}),define("dist/application/method",[],function(require,exports,module){return{keyMap:{ishare_detail_access:"ISHARE_DETAIL_ACCESS",ishare_office_detail_access:"ISHARE_OFFICE_DETAIL_ACCESS"},async:function(a,b,c,d,e){$.ajax(a,{type:d||"post",data:e,async:!1,dataType:"json",headers:{"cache-control":"no-cache",Pragma:"no-cache"}}).done(function(a){b&&b(a)}).fail(function(a){console.log("error==="+c)})},get:function(a,b,c){$.ajaxSetup({cache:!1}),this.async(a,b,c,"get")},post:function(a,b,c,d,e){this.async(a,b,c,d,e)},postd:function(a,b,c){this.async(a,b,!1,!1,c)},random:function(a,b){return Math.floor(Math.random()*(b-a))+a},setCookieWithExpPath:function(a,b,c,d){var e=new Date;e.setTime(e.getTime()+c),document.cookie=a+"="+escape(b)+";path="+d+";expires="+e.toGMTString()},setCookieWithExp:function(a,b,c,d){var e=new Date;e.setTime(e.getTime()+c),d?document.cookie=a+"="+escape(b)+";path="+d+";expires="+e.toGMTString():document.cookie=a+"="+escape(b)+";expires="+e.toGMTString()},getCookie:function(a){var b=document.cookie.match(new RegExp("(^| )"+a+"=([^;]*)(;|$)"));return null!==b?unescape(b[2]):null},delCookie:function(a,b,c){var d=new Date;d.setTime(d.getTime()-1);var e=this.getCookie(a);null!=e&&(b&&c?document.cookie=a+"= '' ;domain="+c+";expires="+d.toGMTString()+";path="+b:b?document.cookie=a+"= '' ;expires="+d.toGMTString()+";path="+b:document.cookie=a+"="+e+";expires="+d.toGMTString())},getQueryString:function(a){var b=new RegExp("(^|&)"+a+"=([^&]*)(&|$)","i"),c=window.location.search.substr(1).match(b);return null!=c?unescape(c[2]):null},url2Obj:function(a){for(var b={},c=a.split("?"),d=c[1].split("&"),e=0;e<d.length;e++){var f=d[e].split("=");b[f[0]]=f[1]}return b},getParam:function(a){a=a.replace(/[\[]/,"\\[").replace(/[\]]/,"\\]");var b="[\\?&]"+a+"=([^&#]*)",c=new RegExp(b),d=c.exec(window.location.href);return null==d?"":decodeURIComponent(d[1].replace(/\+/g," "))},getLocalData:function(a){try{if(localStorage&&localStorage.getItem){var b=localStorage.getItem(a);return null===b?null:JSON.parse(b)}return console.log("浏览器不支持html localStorage getItem"),null}catch(c){return null}},setLocalData:function(a,b){localStorage&&localStorage.setItem?(localStorage.removeItem(a),localStorage.setItem(a,JSON.stringify(b))):console.log("浏览器不支持html localStorage setItem")},browserType:function(){var a=navigator.userAgent,b=a.indexOf("Opera")>-1;return b?"Opera":a.indexOf("compatible")>-1&&a.indexOf("MSIE")>-1&&!b?"IE":a.indexOf("Edge")>-1?"Edge":a.indexOf("Firefox")>-1?"Firefox":a.indexOf("Safari")>-1&&-1===a.indexOf("Chrome")?"Safari":a.indexOf("Chrome")>-1&&a.indexOf("Safari")>-1?"Chrome":void 0},validateIE9:function(){return!(!$.browser.msie||"9.0"!==$.browser.version&&"8.0"!==$.browser.version&&"7.0"!==$.browser.version&&"6.0"!==$.browser.version)},compareTime:function(a,b){return a&&b?Math.abs((b-a)/1e3/60/60/24):""},changeURLPar:function(url,arg,arg_val){var pattern=arg+"=([^&]*)",replaceText=arg+"="+arg_val;if(url.match(pattern)){var tmp="/("+arg+"=)([^&]*)/gi";return tmp=url.replace(eval(tmp),replaceText)}return url.match("[?]")?url+"&"+replaceText:url+"?"+replaceText},getUrlAllParams:function(a){if("undefined"==typeof a)var b=decodeURI(location.search);else var b="?"+a.split("?")[1];var c=new Object;if(-1!=b.indexOf("?"))for(var d=b.substr(1),e=d.split("&"),f=0;f<e.length;f++)c[e[f].split("=")[0]]=decodeURI(e[f].split("=")[1]);return c},compatibleIESkip:function(a,b){var c=document.createElement("a");c.href=a,c.style.display="none",b&&(c.target="_blank"),document.body.appendChild(c),c.click()}}}),define("dist/application/checkLogin",["dist/application/method","dist/application/api"],function(a,b,c){var d=a("dist/application/method"),e=a("dist/application/api");c.exports={getIds:function(){var a=window.pageConfig&&window.pageConfig.params?window.pageConfig.params:null,b=window.pageConfig&&window.pageConfig.access?window.pageConfig.access:null,c=[];a&&(a.classid1&&c.push(a.classid1),a.classid2&&c.push(a.classid2),a.classid3&&c.push(a.classid3));var d=a&&c.length>0?c.join("-"):"",e=b?b.fileId||a.g_fileId||"":"",f=window.pageConfig&&window.pageConfig.classIds?window.pageConfig.classIds:"";return!d&&(d=f),{clsId:d,fid:e}},notifyLoginInterface:function(a){var b=this;if(!d.getCookie("cuk")){__pc__.push(["pcTrackContent","loginDialogLoad"]);var c=window.pageConfig&&window.pageConfig.page?window.pageConfig.page.ptype||"index":"index";$.loginPop("login",{terminal:"PC",businessSys:"ishare",domain:document.domain,ptype:c,clsId:this.getIds().clsId,fid:this.getIds().fid},function(c){b.getLoginData(a)})}},listenLoginStatus:function(a){var b=this;$.loginPop("login_wx_code",{terminal:"PC",businessSys:"ishare",domain:document.domain,ptype:"ishare",popup:"hidden",clsId:this.getIds().clsId,fid:this.getIds().fid},function(){b.getLoginData(a)})},notifyCheckInterface:function(){d.getCookie("cuk")&&$.loginPop("checkCode",{terminal:"PC",businessSys:"ishare",domain:document.domain,clsId:this.getIds().clsId,fid:this.getIds().fid},function(a){"0"==a.code&&d.get(e.user.getJessionId,function(a){},"")})},syncUserInfoInterface:function(a){var b=this;d.getCookie("cuk")&&d.get(e.user.getJessionId,function(c){0==c.code&&b.getLoginData(a)},"")},getUserData:function(a){d.getCookie("cuk")&&d.get(e.sale.querySeniority,function(b){b&&0==b.code&&a(b.data)},"")},getLoginData:function(a){var b=this;try{d.get(e.user.login,function(c){if(0==c.code&&c.data){if(a&&"function"==typeof a){a(c.data);try{window.pageConfig.params.isVip=c.data.isVip,window.pageConfig.page.uid=c.data.userId}catch(e){}}try{var f={uid:c.data.userId,isVip:c.data.isVip,tel:c.data.mobile};d.setCookieWithExpPath("ui",JSON.stringify(f),18e5,"/")}catch(g){}}else 40001==c.code&&b.ishareLogout()})}catch(c){}},ishareLogout:function(){d.delCookie("cuk","/",".sina.com.cn"),d.delCookie("cuk","/",".iask.com.cn"),d.delCookie("cuk","/",".iask.com"),d.delCookie("sid","/",".iask.sina.com.cn"),d.delCookie("sid","/",".iask.com.cn"),d.delCookie("sid","/",".sina.com.cn"),d.delCookie("sid","/",".ishare.iask.com.cn"),d.delCookie("sid","/",".office.iask.com"),d.delCookie("sid_ishare","/",".iask.sina.com.cn"),d.delCookie("sid_ishare","/",".iask.com.cn"),d.delCookie("sid_ishare","/",".sina.com.cn"),d.delCookie("sid_ishare","/",".ishare.iask.com.cn"),d.delCookie("_1st_l","/"),d.delCookie("ui","/"),$.post("/logout",function(){window.location.href=window.location.href})}}}),define("dist/application/api",[],function(a,b,c){var d="/gateway/pc",e="/gateway";c.exports={user:{login:d+"/usermanage/checkLogin",loginOut:"",collect:d+"/usermanage/collect",getJessionId:d+"/usermanage/getJessionId",getSessionInfo:d+"/usermanage/getSessionInfo"},sale:{querySeniority:d+"/sale/querySeniority"},normalFileDetail:{addComment:d+"/fileSync/addComment",reportContent:d+"/fileSync/addFeedback",isStore:d+"/fileSync/getFileCollect",collect:d+"/fileSync/collect",filePreDownLoad:d+"/action/downloadCheck",fileDownLoad:d+"/action/downloadUrl",appraise:d+"/fileSync/appraise",getPrePageInfo:d+"/fileSync/prePageInfo",hasDownLoad:d+"/fileSync/isDownload"},officeFileDetail:{},search:{byPosition:d+"/operating/byPosition"},sms:{getCaptcha:d+"/usermanage/getSmsYzCode"},pay:{successBuyDownLoad:d+"/action/downloadNow"},special:{fileSaveOrupdate:e+"/comment/collect/fileSaveOrupdate"}}});