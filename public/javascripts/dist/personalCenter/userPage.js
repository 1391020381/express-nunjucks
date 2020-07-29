/*! ishare_pc_website
*author:Jersey */
define("dist/personalCenter/userPage",["../application/method","../application/api","../application/checkLogin","../application/effect","../cmd-lib/toast","./template/userPage/index.html","./template/userPage/rightList.html","./template/userPage/userPageList.html"],function(a,b,c){function d(){e(),$(document).on("click",".js-page-item",function(){m=$(this).attr("data-currentPage"),h()}),$(document).on("click",".tab-item",function(){var a=$(this);m=1,$(".tab-item").removeClass("active"),setTimeout(function(){a.addClass("active")},0),n=$(this).attr("type"),h()}),$(document).on("click",".format-title",function(){$(".format-list").toggle(),$(".format-title").find("i").hasClass("rotate")?$(".format-title").find("i").removeClass("rotate"):$(this).find("i").addClass("rotate")}),$(document).on("click",".format-list-item",function(){m=1,o=$(this).attr("format"),h()})}function e(){$.ajax({url:j.user.getOtherUser,type:"get",data:{uid:i.getQueryString("uid")},contentType:"application/json; charset=utf-8",dataType:"json",success:function(b){if("0"==b.code){l=b.data,l.readSum=l.readSum>1e4?(l.readSum/1e4).toFixed(1)+"w+":l.readSum,l.downSum=l.downSum>1e4?(l.downSum/1e4).toFixed(1)+"w+":l.downSum,l.fileSize=l.fileSize>1e4?(l.fileSize/1e4).toFixed(1)+"w+":l.fileSize;var c=template.compile(a("./template/userPage/index.html"))({data:l});$(".container").html(c),h(),f()}else $.toast({text:b.msg,delay:3e3})}})}function f(){$.ajax({url:j.recommend.recommendConfigInfo,type:"post",data:JSON.stringify(["Q_M_FD_hot_home"]),contentType:"application/json; charset=utf-8",dataType:"json",success:function(a){"0"==a.code?g(a.data):$.toast({text:a.msg,delay:3e3})}})}function g(b){var c=Math.random().toString().slice(-10),d=i.getQueryString("uid").slice(0,10)||"",e=b[0].useId;$.ajax({url:"https://nbrecsys.4paradigm.com/api/v0/recom/recall?requestID="+c+"&sceneID="+e+"&userID="+d,type:"post",data:JSON.stringify({page:0}),contentType:"application/json; charset=utf-8",dataType:"json",success:function(b){var c=template.compile(a("./template/userPage/rightList.html"))({rightList:b});$(".hot-file ul").html(c)}})}function h(){$.ajax({url:j.user.getSearchList,type:"post",data:JSON.stringify({currentPage:parseInt(m),pageSize:16,sortField:n,format:o,uid:i.getQueryString("uid")}),contentType:"application/json; charset=utf-8",dataType:"json",success:function(b){if("0"==b.code){for(var c=[],d=0;d<b.data.totalPages;d++)c.push(d);b.data.totalPages=c;var e=template.compile(a("./template/userPage/userPageList.html"))({list:b.data,currentPage:m,sortField:n});$(".personal-container .left").html(e)}else $.toast({text:b.msg,delay:3e3})}})}var i=a("../application/method"),j=a("../application/api"),k=(a("../application/checkLogin"),a("../application/effect").isLogin);a("../cmd-lib/toast");var l="",m=1,n="downNum",o="",p=!1,q=null;k(q,p),d()}),define("dist/application/method",[],function(require,exports,module){return{keyMap:{ishare_detail_access:"ISHARE_DETAIL_ACCESS",ishare_office_detail_access:"ISHARE_OFFICE_DETAIL_ACCESS"},async:function(a,b,c,d,e){$.ajax(a,{type:d||"post",data:e,async:!1,dataType:"json",headers:{"cache-control":"no-cache",Pragma:"no-cache"}}).done(function(a){b&&b(a)}).fail(function(a){console.log("error==="+c)})},get:function(a,b,c){$.ajaxSetup({cache:!1}),this.async(a,b,c,"get")},post:function(a,b,c,d,e){this.async(a,b,c,d,e)},postd:function(a,b,c){this.async(a,b,!1,!1,c)},random:function(a,b){return Math.floor(Math.random()*(b-a))+a},setCookieWithExpPath:function(a,b,c,d){var e=new Date;e.setTime(e.getTime()+c),document.cookie=a+"="+escape(b)+";path="+d+";expires="+e.toGMTString()},setCookieWithExp:function(a,b,c,d){var e=new Date;e.setTime(e.getTime()+c),d?document.cookie=a+"="+escape(b)+";path="+d+";expires="+e.toGMTString():document.cookie=a+"="+escape(b)+";expires="+e.toGMTString()},getCookie:function(a){var b=document.cookie.match(new RegExp("(^| )"+a+"=([^;]*)(;|$)"));return null!==b?unescape(b[2]):null},delCookie:function(a,b,c){var d=new Date;d.setTime(d.getTime()-1);var e=this.getCookie(a);null!=e&&(b&&c?document.cookie=a+"= '' ;domain="+c+";expires="+d.toGMTString()+";path="+b:b?document.cookie=a+"= '' ;expires="+d.toGMTString()+";path="+b:document.cookie=a+"="+e+";expires="+d.toGMTString())},getQueryString:function(a){var b=new RegExp("(^|&)"+a+"=([^&]*)(&|$)","i"),c=window.location.search.substr(1).match(b);return null!=c?unescape(c[2]):null},url2Obj:function(a){for(var b={},c=a.split("?"),d=c[1].split("&"),e=0;e<d.length;e++){var f=d[e].split("=");b[f[0]]=f[1]}return b},getParam:function(a){a=a.replace(/[\[]/,"\\[").replace(/[\]]/,"\\]");var b="[\\?&]"+a+"=([^&#]*)",c=new RegExp(b),d=c.exec(window.location.href);return null==d?"":decodeURIComponent(d[1].replace(/\+/g," "))},getLocalData:function(a){try{if(localStorage&&localStorage.getItem){var b=localStorage.getItem(a);return null===b?null:JSON.parse(b)}return console.log("浏览器不支持html localStorage getItem"),null}catch(c){return null}},setLocalData:function(a,b){localStorage&&localStorage.setItem?(localStorage.removeItem(a),localStorage.setItem(a,JSON.stringify(b))):console.log("浏览器不支持html localStorage setItem")},browserType:function(){var a=navigator.userAgent,b=a.indexOf("Opera")>-1;return b?"Opera":a.indexOf("compatible")>-1&&a.indexOf("MSIE")>-1&&!b?"IE":a.indexOf("Edge")>-1?"Edge":a.indexOf("Firefox")>-1?"Firefox":a.indexOf("Safari")>-1&&-1===a.indexOf("Chrome")?"Safari":a.indexOf("Chrome")>-1&&a.indexOf("Safari")>-1?"Chrome":void 0},validateIE9:function(){return!(!$.browser.msie||"9.0"!==$.browser.version&&"8.0"!==$.browser.version&&"7.0"!==$.browser.version&&"6.0"!==$.browser.version)},compareTime:function(a,b){return a&&b?Math.abs((b-a)/1e3/60/60/24):""},changeURLPar:function(url,arg,arg_val){var pattern=arg+"=([^&]*)",replaceText=arg+"="+arg_val;if(url.match(pattern)){var tmp="/("+arg+"=)([^&]*)/gi";return tmp=url.replace(eval(tmp),replaceText)}return url.match("[?]")?url+"&"+replaceText:url+"?"+replaceText},getUrlAllParams:function(a){if("undefined"==typeof a)var b=decodeURI(location.search);else var b="?"+a.split("?")[1];var c=new Object;if(-1!=b.indexOf("?"))for(var d=b.substr(1),e=d.split("&"),f=0;f<e.length;f++)c[e[f].split("=")[0]]=decodeURI(e[f].split("=")[1]);return c},getQueryString:function(a){var b=new RegExp("(^|&)"+a+"=([^&]*)(&|$)","i"),c=window.location.search.substr(1).match(b);return null!=c?unescape(c[2]):null},compatibleIESkip:function(a,b){var c=document.createElement("a");c.href=a,c.style.display="none",b&&(c.target="_blank"),document.body.appendChild(c),c.click()},testEmail:function(a){var b=/^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;return b.test(a)?!0:!1},testPhone:function(a){return/^1(3|4|5|7|8)\d{9}$/.test(a)?!0:!1},handleRecommendData:function(a){var b=[];return $(a).each(function(a,c){var d={};1==c.type&&(c.linkUrl="/f/"+c.tprId+".html",d=c),2==c.type&&(d=c),3==c.type&&(c.linkUrl="/node/s/"+c.tprId+".html",d=c),b.push(d)}),console.log(b),b},formatDate:function(a){var b={"M+":this.getMonth()+1,"d+":this.getDate(),"h+":this.getHours(),"m+":this.getMinutes(),"s+":this.getSeconds(),"q+":Math.floor((this.getMonth()+3)/3),S:this.getMilliseconds()};/(y+)/.test(a)&&(a=a.replace(RegExp.$1,(this.getFullYear()+"").substr(4-RegExp.$1.length)));for(var c in b)new RegExp("("+c+")").test(a)&&(a=a.replace(RegExp.$1,1==RegExp.$1.length?b[c]:("00"+b[c]).substr((""+b[c]).length)));return a},getReferrer:function(){var a=document.referrer,b="";return/https?\:\/\/[^\s]*so.com.*$/g.test(a)?b="360":/https?\:\/\/[^\s]*baidu.com.*$/g.test(a)?b="baidu":/https?\:\/\/[^\s]*sogou.com.*$/g.test(a)?b="sogou":/https?\:\/\/[^\s]*sm.cn.*$/g.test(a)&&(b="sm"),b},judgeSource:function(a){a||(a={}),a.searchEngine="";var b="";if(b=utils.getQueryVariable("from"),b||(b=sessionStorage.getItem("webWxFrom")||utils.getCookie("webWxFrom")),b)a.source=b,sessionStorage.setItem("webWxFrom",b),sessionStorage.removeItem("webReferrer");else{var c=sessionStorage.getItem("webReferrer")||utils.getCookie("webReferrer");if(c||(c=document.referrer),c){sessionStorage.setItem("webReferrer",c),sessionStorage.removeItem("webWxFrom"),c=c.toLowerCase();for(var d=new Array("google.","baidu.","360.","sogou.","shenma.","bing."),e=new Array("google","baidu","360","sogou","shenma","bing"),f=0,g=d.length;g>f;f++)c.indexOf(d[f])>=0&&(a.source="searchEngine",a.searchEngine=e[f])}c&&a.source||(utils.isWeChatBrow()?a.source="wechat":a.source="outLink")}return a}}}),define("dist/application/api",[],function(a,b,c){var d="/gateway/pc",e="/gateway";c.exports={user:{getUserInfo:"/node/api/getUserInfo",login:d+"/usermanage/checkLogin",loginOut:e+"/pc/usermanage/logout",collect:d+"/usermanage/collect",newCollect:e+"/content/collect/getUserFileList",getJessionId:d+"/usermanage/getJessionId",getSessionInfo:d+"/usermanage/getSessionInfo",addFeedback:e+"/feedback/addFeedback",getFeedbackType:e+"/feedback/getFeedbackType",sendSms:e+"/cas/sms/sendSms",queryBindInfo:e+"/cas/user/queryBindInfo",thirdCodelogin:e+"/cas/login/thirdCode",userBindMobile:e+"/cas/user/bindMobile",checkIdentity:e+"/cas/sms/checkIdentity",userBindThird:e+"/cas/user/bindThird",untyingThird:e+"/cas/user/untyingThird",setUpPassword:e+"/cas/user/setUpPassword",getUserCentreInfo:e+"/user/getUserCentreInfo",editUser:e+"/user/editUser",getFileBrowsePage:e+"/content/fileBrowse/getFileBrowsePage",getDownloadRecordList:e+"/content/getDownloadRecordList",getUserFileList:e+"/content/collect/getUserFileList",getMyUploadPage:e+"/content/getMyUploadPage",getOtherUser:e+"/user/getOthersCentreInfo",getSearchList:e+"/search/content/byCondition"},normalFileDetail:{addComment:d+"/fileSync/addComment",reportContent:d+"/fileSync/addFeedback",isStore:d+"/fileSync/getFileCollect",collect:d+"/fileSync/collect",filePreDownLoad:e+"/content/getPreFileDownUrl",fileDownLoad:d+"/action/downloadUrl",getFileDownLoadUrl:e+"/content/getFileDownUrl",appraise:d+"/fileSync/appraise",getPrePageInfo:d+"/fileSync/prePageInfo",hasDownLoad:d+"/fileSync/isDownload"},officeFileDetail:{},search:{byPosition:d+"/operating/byPosition",specialTopic:e+"/search/specialTopic/lisPage"},sms:{getCaptcha:d+"/usermanage/getSmsYzCode",sendCorpusDownloadMail:e+"/content/fileSendEmail/sendCorpusDownloadMail"},pay:{successBuyDownLoad:d+"/action/downloadNow",bindUser:d+"/order/bindUser",scanOrderInfo:e+"/order/scan/orderInfo"},coupon:{rightsSaleVouchers:e+"/rights/sale/vouchers",rightsSaleQueryPersonal:e+"/rights/sale/queryPersonal",querySeniority:e+"/rights/sale/querySeniority",queryUsing:e+"/rights/sale/queryUsing",getMemberPointRecord:e+"/rights/vip/getMemberPointRecord",getBuyRecord:e+"/rights/vip/getBuyRecord"},order:{bindOrderByOrderNo:d+"/order/bindOrderByOrderNo",unloginOrderDown:d+"/order/unloginOrderDown",createOrderInfo:e+"/order/create/orderInfo",rightsVipGetUserMember:e+"/rights/vip/getUserMember",getOrderStatus:e+"/order/get/orderStatus",queryOrderlistByCondition:e+"/order/query/listByCondition",getOrderInfo:e+"/order/get/orderInfo"},getHotSearch:d+"/search/getHotSearch",special:{fileSaveOrupdate:e+"/comment/collect/fileSaveOrupdate",getCollectState:e+"/comment/zc/getUserFileZcState",setCollect:e+"/content/collect/file"},upload:{getCategory:e+"/content/category/getSimplenessInfo",createFolder:e+"/content/saveUserFolder",getFolder:e+"/content/getUserFolders",saveUploadFile:e+"/content/webUploadFile",batchDeleteUserFile:e+"/content/batchDeleteUserFile"},recommend:{recommendConfigInfo:e+"/recommend/config/info",recommendConfigRuleInfo:e+"/recommend/config/ruleInfo"},reportBrowse:{fileBrowseReportBrowse:e+"/content/fileBrowse/reportBrowse"}}}),define("dist/application/checkLogin",["dist/application/api","dist/application/method"],function(a,b,c){var d=a("dist/application/api"),e=a("dist/application/method"),d=a("dist/application/api");c.exports={getIds:function(){var a=window.pageConfig&&window.pageConfig.params?window.pageConfig.params:null,b=window.pageConfig&&window.pageConfig.access?window.pageConfig.access:null,c=[];a&&(a.classid1&&c.push(a.classid1),a.classid2&&c.push(a.classid2),a.classid3&&c.push(a.classid3));var d=a&&c.length>0?c.join("-"):"",e=b?b.fileId||a.g_fileId||"":"",f=window.pageConfig&&window.pageConfig.classIds?window.pageConfig.classIds:"";return!d&&(d=f),{clsId:d,fid:e}},notifyLoginInterface:function(a){var b=this;if(!e.getCookie("cuk")){var c=window.pageConfig&&window.pageConfig.page?window.pageConfig.page.ptype||"index":"index";$.loginPop("login",{terminal:"PC",businessSys:"ishare",domain:document.domain,ptype:c,clsId:this.getIds().clsId,fid:this.getIds().fid},function(c){b.getLoginData(a)})}},listenLoginStatus:function(a){var b=this;$.loginPop("login_wx_code",{terminal:"PC",businessSys:"ishare",domain:document.domain,ptype:"ishare",popup:"hidden",clsId:this.getIds().clsId,fid:this.getIds().fid},function(){b.getLoginData(a)})},notifyCheckInterface:function(){e.getCookie("cuk")&&$.loginPop("checkCode",{terminal:"PC",businessSys:"ishare",domain:document.domain,clsId:this.getIds().clsId,fid:this.getIds().fid},function(a){"0"==a.code&&e.get(d.user.getJessionId,function(a){},"")})},syncUserInfoInterface:function(a){var b=this;e.getCookie("cuk")&&e.get(d.user.getJessionId,function(c){0==c.code&&b.getLoginData(a)},"")},getUserData:function(a){e.getCookie("cuk")&&e.get(d.coupon.querySeniority,function(b){b&&0==b.code&&a(b.data)},"")},getLoginData:function(a){var b=this;try{e.get(d.user.login,function(c){if(0==c.code&&c.data){if(a&&"function"==typeof a){a(c.data);try{window.pageConfig.params.isVip=c.data.isVip,window.pageConfig.page.uid=c.data.userId}catch(d){}}try{var f={uid:c.data.userId,isVip:c.data.isVip,tel:c.data.mobile};e.setCookieWithExpPath("ui",JSON.stringify(f),18e5,"/")}catch(g){}}else 40001==c.code&&b.ishareLogout()})}catch(c){console.log(c)}},ishareLogout:function(){e.delCookie("cuk","/",".sina.com.cn"),e.delCookie("cuk","/",".iask.com.cn"),e.delCookie("cuk","/",".iask.com"),e.delCookie("sid","/",".iask.sina.com.cn"),e.delCookie("sid","/",".iask.com.cn"),e.delCookie("sid","/",".sina.com.cn"),e.delCookie("sid","/",".ishare.iask.com.cn"),e.delCookie("sid","/",".office.iask.com"),e.delCookie("sid_ishare","/",".iask.sina.com.cn"),e.delCookie("sid_ishare","/",".iask.com.cn"),e.delCookie("sid_ishare","/",".sina.com.cn"),e.delCookie("sid_ishare","/",".ishare.iask.com.cn"),e.delCookie("_1st_l","/"),e.delCookie("ui","/"),$.get(d.user.loginOut,function(a){console.log("loginOut:",a),0==a.code&&(window.location.href=window.location.href)})}}}),define("dist/application/effect",["dist/application/checkLogin","dist/application/api","dist/application/method","dist/application/method"],function(a,b,c){function d(a,b,c){!f.getCookie("cuk")&&b?e.notifyLoginInterface(function(b){a&&a(b),c&&c(b),i(b)}):f.getCookie("cuk")&&e.getLoginData(function(b){a&&a(b),i(b)})}var e=a("dist/application/checkLogin"),f=a("dist/application/method");$("#unLogin").on("click",function(){e.notifyLoginInterface(function(a){i(a)})}),$(".btn-exit").on("click",function(){e.ishareLogout()}),$(".top-user-more .js-buy-open").click(function(){"vip"==$(this).attr("data-type")&&(location.href="/pay/vip.html")}),$(".vip-join-con").click(function(){f.compatibleIESkip("/node/rights/vip.html",!0)}),$(".btn-new-search").click(function(){if(new RegExp("/search/home.html").test(location.href)){var a=window.location.href.substring(0,window.location.href.indexOf("?"))+"?ft=all",b=$(".new-input").val()?$(".new-input").val().replace(/^\s+|\s+$/gm,""):$(".new-input").attr("placeholder");window.location.href=f.changeURLPar(a,"cond",encodeURIComponent(encodeURIComponent(b)))}else{var b=$(".new-input").val()?$(".new-input").val().replace(/^\s+|\s+$/gm,""):$(".new-input").attr("placeholder");b&&f.compatibleIESkip("/search/home.html?ft=all&cond="+encodeURIComponent(encodeURIComponent(b)),!0)}}),$(".new-input").on("keydown",function(a){if(new RegExp("/search/home.html").test(location.href)&&13===a.keyCode){var b=window.location.href.substring(0,window.location.href.indexOf("?"))+"?ft=all",c=$(".new-input").val()?$(".new-input").val().replace(/^\s+|\s+$/gm,""):$(".new-input").attr("placeholder");window.location.href=f.changeURLPar(b,"cond",encodeURIComponent(encodeURIComponent(c)))}else if(13===a.keyCode){var c=$(".new-input").val()?$(".new-input").val().replace(/^\s+|\s+$/gm,""):$(".new-input").attr("placeholder");c&&f.compatibleIESkip("/search/home.html?ft=all&cond="+encodeURIComponent(encodeURIComponent(c)),!0)}});var g=$(".new-detail-header"),h=g.height();$(window).scroll(function(){var a=$(this).scrollTop();a-h>=0?g.addClass("new-detail-header-fix"):g.removeClass("new-detail-header-fix")});var i=function(a){var b=$("#unLogin"),c=$("#haveLogin"),d=$(".btn-user-more"),e=$(".vip-status"),g=($(".icon-iShare"),$(".top-user-more"));d.text(1==a.isVip?"续费":"开通");var h=null;"6"===f.getCookie("file_state")&&$(".vip-title").eq(0).show(),1==a.isVip?(h=e.find('p[data-type="2"]'),h.find(".expire_time").html(a.expireTime),h.show().siblings().hide(),g.addClass("top-vip-more"),$(".isVip-show").find("span").html(a.expireTime),$(".isVip-show").removeClass("hide"),$(".vip-privilege-btn").html("立即续费")):1==a.userType?(h=e.find('p[data-type="3"]'),c.removeClass("user-con-vip"),h.show().siblings().hide()):0==a.isVip?c.removeClass("user-con-vip"):2==a.isVip&&$(".vip-title").hide(),b.hide(),c.find(".user-link .user-name").html(a.nickName),c.find(".user-link img").attr("src",a.weiboImage),c.find(".top-user-more .name").html(a.nickName),c.find(".top-user-more img").attr("src",a.weiboImage),c.show(),window.pageConfig.params&&(window.pageConfig.params.isVip=a.isVip);var i=a.fileDiscount;i?i/=100:i=.8,window.pageConfig.params&&(window.pageConfig.params.fileDiscount=i),$("#ip-uid").val(a.userId),$("#ip-isVip").val(a.isVip),$("#ip-mobile").val(a.mobile)};return{refreshTopBar:i,isLogin:d}}),define("dist/cmd-lib/toast",[],function(a,b,c){!function(a,b,c){function d(b){this.options={text:"我是toast提示",icon:"",delay:3e3,callback:!1},b&&a.isPlainObject(b)&&a.extend(!0,this.options,b),this.init()}d.prototype.init=function(){var b=this;b.body=a("body"),b.toastWrap=a('<div class="ui-toast" style="position:fixed;width:200px;height:60px;line-height:60px;text-align:center;background:#000;opacity:0.8;filter:alpha(opacity=80);top:40%;left:50%;margin-left:-100px;margin-top:-30px;border-radius:4px;z-index:10000">'),b.toastIcon=a('<i class="icon"></i>'),b.toastText=a('<span class="ui-toast-text" style="color:#fff">'+b.options.text+"</span>"),b._creatDom(),b.show(),b.hide()},d.prototype._creatDom=function(){var a=this;a.options.icon&&a.toastWrap.append(a.toastIcon.addClass(a.options.icon)),a.toastWrap.append(a.toastText),a.body.append(a.toastWrap)},d.prototype.show=function(){var a=this;setTimeout(function(){a.toastWrap.removeClass("hide").addClass("show")},50)},d.prototype.hide=function(){var a=this;setTimeout(function(){a.toastWrap.removeClass("show").addClass("hide"),a.toastWrap.remove(),a.options.callback&&a.options.callback()},a.options.delay)},a.toast=function(a){return new d(a)}}($,window,document)}),define("dist/personalCenter/template/userPage/index.html",[],'<div class="personal-header">\n    <div class="person-info">\n        <img src="{{data.photoPicURL}}" alt="">\n        <div class="person-info-left">\n            <p>{{data.nickName}} {{ if data.isAuth==1 }}<i></i>{{/if}}</p>\n            <p>{{ data.userTypeId==1 ? \'普通\' : data.userTypeId==2 ? \'个人\' : \'机构\'}}认证</p>\n        </div>\n    </div>\n    <div class="decrition">个人简介：{{data.cfcDescribe ? data.cfcDescribe : \'暂无简介\'}}</div>    \n</div>\n<div class="personal-container cf">\n    <div class="left fl">\n      \n    </div>\n    <div class="right fl">\n       <div class="right-top">\n           <div class="right-top-item">\n               <p>{{data.readSum}}</p>\n               <p>浏览量</p>\n           </div>\n           <div class="right-top-item">\n               <p>{{data.downSum}}</p>\n               <p>下载量</p>\n           </div>\n           <div class="right-top-item">\n               <p>{{data.fileSize}}</p>\n               <p>资料数</p>\n           </div>\n       </div>\n       <div class="hot-file">\n           <div class="title">热门资料</div>\n           <ul>\n           \n           </ul>\n       </div>\n   </div>\n</div>\n'),define("dist/personalCenter/template/userPage/rightList.html",[],'{{ each rightList as item i }}\n<li>\n    <a href="/f/{{item.item_id}}.html">\n        <div class="info">\n            <p>{{item.title}}</p>\n            <p>{{item.item_read_cnt ? item.item_read_cnt + \'阅读\' : \'\'}}</p>\n        </div>\n        <div class="pic">\n            <img src="{{item.cover_url}}" alt="">\n            <span class="ico-data pos ico-{{item.extra1}}"></span>\n        </div>\n        \n    </a>\n   \n</li>\n{{/each}}'),define("dist/personalCenter/template/userPage/userPageList.html",[],'<div class="title">TA的资料</div>\n<div class="tab">\n    <div class="tab-item {{sortField==\'downNum\' ? \'active\' : \'\' }}" type=\'downNum\'><a href="javascript:;">热门</a></div>\n    <div class="tab-item {{sortField==\'createTime\' ? \'active\' : \'\' }}" type=\'createTime\'><a href="javascript:;">最新</a></div>\n    <div class="format">\n        <div class="format-title">格式<i></i></div>\n        <div class="format-list">\n            <div class="format-list-item" format=\'\'>全部</div>\n            <div class="format-list-item" format=\'doc\'>DOC</div>\n            <div class="format-list-item" format=\'ppt\'>PPT</div>\n            <div class="format-list-item" format=\'pdf\'>PDF</div>\n            <div class="format-list-item" format=\'xls\'>XLS</div>\n            <div class="format-list-item" format=\'txt\'>TXT</div>\n        </div>\n     </div> \n </div>\n<ul>\n    {{ each list.rows as item i }}\n    <li>\n        <a href="/f/{{item.id}}.html">\n         <div class="pic">\n             {{ if item.fileSmallPic }}\n             <img src="{{\'http://pic.iask.com.cn/\'+item.fileSmallPic}}" alt="">\n             {{else}}\n             <img src="/images/default-picture.png" alt="">\n             {{/if}}\n             <span class="ico-data pos ico-{{item.format}}"></span>\n         </div>\n         \n         <div class="info">\n             <p>{{item.title}}</p>\n             <p>{{item.readNum}}阅读 &nbsp; &nbsp;  {{item.totalPage}}页</p>\n         </div>\n        </a>\n    </li>\n    {{/each}}\n</ul>\n<!-- 暂无记录 -->\n{{ if list.rows.length == 0 }}\n<div class="no-record">暂无记录</div>\n{{/if}}\n{{ if list.totalPages.length >1}}\n <div class="pagination-wrapper">\n     <div class="page-list pagination">\n         <div class="page-item js-page-item first" data-currentPage="1">首页</div>\n         {{if currentPage>1}}\n         <div class="page-item js-page-item prev" data-currentPage={{currentPage-1}}>上一页</div> \n         {{/if}}\n         {{each list.totalPages}}\n             {{ if $index >currentPage-3 && $index <=+currentPage +3 }}\n             <div class="page-item js-page-item {{ currentPage == $index+1 ? \'active\':\'\'}}"  data-currentPage={{+$index+1}}>\n                 {{$index+1}}\n             </div>\n             {{/if}}\n         {{/each}}\n\n         {{if currentPage <= list.totalPages.length -3}}\n             <div class="page-more page-item">...</div>\n         {{/if}}\n         {{if currentPage < list.totalPages.length}}\n            <div class="page-item js-page-item" data-currentPage={{+currentPage+1}}>下一页</div>\n          {{/if}}\n         <div class="page-item js-page-item" data-currentPage={{list.totalPages.length}}>尾页</div>\n </div>\n</div>\n{{/if}}');