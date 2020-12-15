/*! ishare_pc_website
*author:Jersey */
define("dist/rights/index",["../application/method","../application/checkLogin","../application/api","../application/urlConfig","../application/login","../cmd-lib/myDialog","../cmd-lib/toast","../application/iframe/iframe-messenger","../application/iframe/messenger","../common/baidu-statistics","../application/effect","../common/loginType"],function(a,b,c){function d(){g.getCookie("cuk")&&h.getLoginData(function(a){i.refreshTopBar(a),e(a),1===a.isOfficeVip?k.html("立即续费"):k.html("立即开通"),1===a.isMasterVip?l.html("立即续费"):l.html("立即开通")})}function e(a){1===a.isOfficeVip?(k.html("立即续费"),n.addClass("i-vip-blue"),n.removeClass("i-vip-gray2")):(n.removeClass("i-vip-blue"),n.addClass("i-vip-gray2")),1===a.isMasterVip?(l.html("立即续费"),m.addClass("i-vip-yellow"),m.removeClass("i-vip-gray1")):(m.removeClass("i-vip-yellow"),m.addClass("i-vip-gray1")),$(".jsUserImage").attr("src",a.photoPicURL),$(".jsUserName").text(a.nickName);var b=g.getCookie("login_type");$(".jsLoginType").text(b?"( "+o[b]+" )":"")}function f(){l.on("click",function(){event.stopPropagation(),g.getCookie("cuk")?g.compatibleIESkip("/pay/vip.html",!1):h.notifyLoginInterface(function(a){i.refreshTopBar(a),e(a),g.compatibleIESkip("/pay/vip.html",!1)})}),k.on("click",function(){window.open(j.officeUrl+"/pay/vip.html","_blank")})}var g=a("../application/method"),h=a("../application/checkLogin"),i=a("../application/effect"),j=a("../application/urlConfig"),k=$(".JsPayOfficeVip"),l=$(".JsPayMainVip"),m=$(".JsMainIcon"),n=$(".JsOfficeIcon"),o={wechat:"微信登陆",weibo:"微博登陆",qq:"QQ登陆",phonePw:"密码登陆",phoneCode:"验证码登陆"};d(),f()}),define("dist/application/method",[],function(require,exports,module){return{keyMap:{ishare_detail_access:"ISHARE_DETAIL_ACCESS",ishare_office_detail_access:"ISHARE_OFFICE_DETAIL_ACCESS"},async:function(a,b,c,d,e){$.ajax(a,{type:d||"post",data:e,async:!1,dataType:"json",headers:{"cache-control":"no-cache",Pragma:"no-cache",Authrization:this.getCookie("cuk")}}).done(function(a){b&&b(a)}).fail(function(a){console.log("error==="+c)})},get:function(a,b,c){$.ajaxSetup({cache:!1}),this.async(a,b,c,"get")},post:function(a,b,c,d,e){this.async(a,b,c,d,e)},postd:function(a,b,c){this.async(a,b,!1,!1,c)},random:function(a,b){return Math.floor(Math.random()*(b-a))+a},setCookieWithExpPath:function(a,b,c,d){var e=new Date;e.setTime(e.getTime()+c),document.cookie=a+"="+escape(b)+";path="+d+";expires="+e.toGMTString()},setCookieWithExp:function(a,b,c,d){var e=new Date;e.setTime(e.getTime()+c),d?document.cookie=a+"="+escape(b)+";path="+d+";expires="+e.toGMTString():document.cookie=a+"="+escape(b)+";expires="+e.toGMTString()},getCookie:function(a){var b=document.cookie.match(new RegExp("(^| )"+a+"=([^;]*)(;|$)"));return null!==b?unescape(b[2]):null},delCookie:function(a,b,c){var d=new Date;d.setTime(d.getTime()-1);var e=this.getCookie(a);null!=e&&(b&&c?document.cookie=a+"= '' ;domain="+c+";expires="+d.toGMTString()+";path="+b:b?document.cookie=a+"= '' ;expires="+d.toGMTString()+";path="+b:document.cookie=a+"="+e+";expires="+d.toGMTString())},getQueryString:function(a){var b=new RegExp("(^|&)"+a+"=([^&]*)(&|$)","i"),c=window.location.search.substr(1).match(b);return null!=c?unescape(c[2]):null},url2Obj:function(a){for(var b={},c=a.split("?"),d=c[1].split("&"),e=0;e<d.length;e++){var f=d[e].split("=");b[f[0]]=f[1]}return b},getParam:function(a){a=a.replace(/[\[]/,"\\[").replace(/[\]]/,"\\]");var b="[\\?&]"+a+"=([^&#]*)",c=new RegExp(b),d=c.exec(window.location.href);return null==d?"":decodeURIComponent(d[1].replace(/\+/g," "))},getLocalData:function(a){try{if(localStorage&&localStorage.getItem){var b=localStorage.getItem(a);return null===b?null:JSON.parse(b)}return console.log("浏览器不支持html localStorage getItem"),null}catch(c){return null}},setLocalData:function(a,b){localStorage&&localStorage.setItem?(localStorage.removeItem(a),localStorage.setItem(a,JSON.stringify(b))):console.log("浏览器不支持html localStorage setItem")},browserType:function(){var a=navigator.userAgent,b=a.indexOf("Opera")>-1;return b?"Opera":a.indexOf("compatible")>-1&&a.indexOf("MSIE")>-1&&!b?"IE":a.indexOf("Edge")>-1?"Edge":a.indexOf("Firefox")>-1?"Firefox":a.indexOf("Safari")>-1&&-1===a.indexOf("Chrome")?"Safari":a.indexOf("Chrome")>-1&&a.indexOf("Safari")>-1?"Chrome":void 0},validateIE9:function(){return!(!$.browser.msie||"9.0"!==$.browser.version&&"8.0"!==$.browser.version&&"7.0"!==$.browser.version&&"6.0"!==$.browser.version)},compareTime:function(a,b){return a&&b?Math.abs((b-a)/1e3/60/60/24):""},changeURLPar:function(url,arg,arg_val){var pattern=arg+"=([^&]*)",replaceText=arg+"="+arg_val;if(url.match(pattern)){var tmp="/("+arg+"=)([^&]*)/gi";return tmp=url.replace(eval(tmp),replaceText)}return url.match("[?]")?url+"&"+replaceText:url+"?"+replaceText},getUrlAllParams:function(a){if("undefined"==typeof a)var b=decodeURI(location.search);else var b="?"+a.split("?")[1];var c=new Object;if(-1!=b.indexOf("?"))for(var d=b.substr(1),e=d.split("&"),f=0;f<e.length;f++)c[e[f].split("=")[0]]=decodeURI(e[f].split("=")[1]);return c},getQueryString:function(a){var b=new RegExp("(^|&)"+a+"=([^&]*)(&|$)","i"),c=window.location.search.substr(1).match(b);return null!=c?unescape(c[2]):null},compatibleIESkip:function(a,b){var c=document.createElement("a");c.href=a,c.style.display="none",b&&(c.target="_blank"),document.body.appendChild(c),c.click()},testEmail:function(a){var b=/^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;return b.test(a)?!0:!1},testPhone:function(a){return/^1(3|4|5|6|7|8|9)\d{9}$/.test(a)?!0:!1},handleRecommendData:function(a){var b=[];return $(a).each(function(a,c){var d={};1==c.type&&(c.linkUrl="/f/"+c.tprId+".html",d=c),2==c.type&&(d=c),3==c.type&&(c.linkUrl="/node/s/"+c.tprId+".html",d=c),b.push(d)}),console.log(b),b},formatDate:function(a){var b={"M+":this.getMonth()+1,"d+":this.getDate(),"h+":this.getHours(),"m+":this.getMinutes(),"s+":this.getSeconds(),"q+":Math.floor((this.getMonth()+3)/3),S:this.getMilliseconds()};/(y+)/.test(a)&&(a=a.replace(RegExp.$1,(this.getFullYear()+"").substr(4-RegExp.$1.length)));for(var c in b)new RegExp("("+c+")").test(a)&&(a=a.replace(RegExp.$1,1==RegExp.$1.length?b[c]:("00"+b[c]).substr((""+b[c]).length)));return a},getReferrer:function(){var a=document.referrer,b="";return/https?\:\/\/[^\s]*so.com.*$/g.test(a)?b="360":/https?\:\/\/[^\s]*baidu.com.*$/g.test(a)?b="baidu":/https?\:\/\/[^\s]*sogou.com.*$/g.test(a)?b="sogou":/https?\:\/\/[^\s]*sm.cn.*$/g.test(a)&&(b="sm"),b},judgeSource:function(a){a||(a={}),a.searchEngine="";var b="";if(b=utils.getQueryVariable("from"),b||(b=sessionStorage.getItem("webWxFrom")||utils.getCookie("webWxFrom")),b)a.source=b,sessionStorage.setItem("webWxFrom",b),sessionStorage.removeItem("webReferrer");else{var c=sessionStorage.getItem("webReferrer")||utils.getCookie("webReferrer");if(c||(c=document.referrer),c){sessionStorage.setItem("webReferrer",c),sessionStorage.removeItem("webWxFrom"),c=c.toLowerCase();for(var d=new Array("google.","baidu.","360.","sogou.","shenma.","bing."),e=new Array("google","baidu","360","sogou","shenma","bing"),f=0,g=d.length;g>f;f++)c.indexOf(d[f])>=0&&(a.source="searchEngine",a.searchEngine=e[f])}c&&a.source||(utils.isWeChatBrow()?a.source="wechat":a.source="outLink")}return a},randomString:function(a){a=a||4;for(var b="ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678",c=b.length,d="",e=0;a>e;e++)d+=b.charAt(Math.floor(Math.random()*c));return d},saveLoginToken:function(a,b){b=b||2592e6,this.setCookieWithExpPath("cuk",a,b,"/")},getLoginToken:function(){return this.getCookie("cuk")||""},delLoginToken:function(){this.delCookie("cuk","/")},saveLoginSessionId:function(a){var b=(new Date).getTime(),c=a.split("_"),d=c[1]||0,e=d-b;this.setCookieWithExpPath("ish_jssid",a,e,"/")},getLoginSessionId:function(){return this.getCookie("ish_jssid")||""},isIe8:function(){var a,b=8,c=navigator.userAgent.toLowerCase(),d=c.indexOf("msie")>-1;return d&&(a=c.match(/msie ([\d.]+)/)[1]),b>=a?!0:!1}}}),define("dist/application/checkLogin",["dist/application/api","dist/application/urlConfig","dist/application/method","dist/application/login","dist/cmd-lib/myDialog","dist/cmd-lib/toast","dist/application/iframe/iframe-messenger","dist/application/iframe/messenger","dist/common/baidu-statistics"],function(a,b,c){var d=a("dist/application/api"),e=a("dist/application/method"),d=a("dist/application/api"),f=a("dist/application/login").showLoginDialog;a("dist/common/baidu-statistics").initBaiduStatistics("17cdd3f409f282dc0eeb3785fcf78a66");var g=a("dist/common/baidu-statistics").handleBaiduStatisticsPush;c.exports={getIds:function(){var a=window.pageConfig&&window.pageConfig.params?window.pageConfig.params:null,b=window.pageConfig&&window.pageConfig.access?window.pageConfig.access:null,c=a?a.classid:"",d=b?b.fileId||a.g_fileId||"":"",e=a&&a.classIds?a.classIds:"";return!c&&(c=e),{clsId:c,fid:d}},notifyLoginInterface:function(a){var b=this;if(!e.getCookie("cuk")){var c=(window.pageConfig&&window.pageConfig.page?window.pageConfig.page.ptype||"index":"index",this.getIds().clsId),d=this.getIds().fid;f({clsId:c,fid:d},function(){console.log("loginCallback"),b.getLoginData(a,"isFirstLogin")})}},listenLoginStatus:function(a){var b=this;$.loginPop("login_wx_code",{terminal:"PC",businessSys:"ishare",domain:document.domain,ptype:"ishare",popup:"hidden",clsId:this.getIds().clsId,fid:this.getIds().fid},function(){b.getLoginData(a)})},getUserData:function(a){e.getCookie("cuk")&&e.get(d.coupon.querySeniority,function(b){b&&0==b.code&&a(b.data)},"")},getLoginData:function(a,b){var c=this;try{e.get("/node/api/getUserInfo",function(d){if(0==d.code&&d.data){if(b&&(g("loginResult",{loginType:window.loginType&&window.loginType.type,phone:d.data.mobile,userid:d.data.userId,loginResult:"1"}),iask_web.login(d.data.userId),iask_web.track_event("SE001","loginResult","query",{loginResult:"1",failMsg:"",loginType:d.formData}),window.location.reload()),$(".loginRedPacket-dialog").hide(),a&&"function"==typeof a){a(d.data);try{window.pageConfig.params.isVip=d.data.isVip,window.pageConfig.page.uid=d.data.userId}catch(f){}}try{var h={uid:d.data.userId,isVip:d.data.isVip,tel:d.data.mobile};e.setCookieWithExpPath("ui",JSON.stringify(h),18e5,"/")}catch(i){}}else g("loginResult",{loginType:window.loginType&&window.loginType.type,phone:"",userid:d.data.userId,loginResult:"0"}),c.ishareLogout()})}catch(d){console.log(d)}},ishareLogout:function(){$.ajax({url:d.user.loginOut,type:"GET",headers:{"cache-control":"no-cache",Pragma:"no-cache",jsId:e.getLoginSessionId()},contentType:"application/json; charset=utf-8",dataType:"json",cache:!1,data:null,success:function(a){console.log("loginOut:",a),0==a.code?(iask_web.logout(),window.location.reload()):$.toast({text:a.message,delay:3e3})}}),e.delCookie("cuk","/",".sina.com.cn"),e.delCookie("cuk","/",".iask.com.cn"),e.delCookie("cuk","/",".iask.com"),e.delCookie("cuk","/"),e.delCookie("sid","/",".iask.sina.com.cn"),e.delCookie("sid","/",".iask.com.cn"),e.delCookie("sid","/",".sina.com.cn"),e.delCookie("sid","/",".ishare.iask.com.cn"),e.delCookie("sid","/",".office.iask.com"),e.delCookie("sid_ishare","/",".iask.sina.com.cn"),e.delCookie("sid_ishare","/",".iask.com.cn"),e.delCookie("sid_ishare","/",".sina.com.cn"),e.delCookie("sid_ishare","/",".ishare.iask.com.cn"),e.delCookie("_1st_l","/"),e.delCookie("ui","/")}}}),define("dist/application/api",["dist/application/urlConfig"],function(a,b,c){var d=a("dist/application/urlConfig"),e=d.ajaxUrl+"/gateway/pc",f=d.ajaxUrl+"/gateway";c.exports={user:{userWxAuthState:f+"/cas/user/wxAuthState",dictionaryData:f+"/market/dictionaryData/$code",checkSso:f+"/cas/login/checkSso",loginByPsodOrVerCode:f+"/cas/login/authorize",getLoginQrcode:f+"/cas/login/qrcode",loginByWeChat:f+"/cas/login/gzhScan",getUserInfo:"/node/api/getUserInfo",thirdLoginRedirect:f+"/cas/login/redirect",loginOut:f+"/cas/login/logout",newCollect:f+"/content/collect/getUserFileList",addFeedback:f+"/feedback/addFeedback",getFeedbackType:f+"/feedback/getFeedbackType",sendSms:f+"/cas/sms/sendSms",queryBindInfo:f+"/cas/user/queryBindInfo",thirdCodelogin:f+"/cas/login/thirdCode",userBindMobile:f+"/cas/user/bindMobile",checkIdentity:f+"/cas/sms/checkIdentity",userBindThird:f+"/cas/user/bindThird",untyingThird:f+"/cas/user/untyingThird",setUpPassword:f+"/cas/user/setUpPassword",getUserCentreInfo:f+"/user/getUserCentreInfo",editUser:f+"/user/editUser",getFileBrowsePage:f+"/content/fileBrowse/getFileBrowsePage",getDownloadRecordList:f+"/content/getDownloadRecordList",getUserFileList:f+"/content/collect/getUserFileList",getMyUploadPage:f+"/content/getMyUploadPage",getOtherUser:f+"/user/getOthersCentreInfo",getSearchList:f+"/search/content/byCondition",getVisitorId:f+"/user/getVisitorId"},normalFileDetail:{filePreDownLoad:f+"/content/getPreFileDownUrl",getFileDownLoadUrl:f+"/content/getFileDownUrl",getPrePageInfo:f+"/content/file/getPrePageInfo",sendmail:f+"/content/sendmail/findFile",getFileDetailNoTdk:f+"/content/getFileDetailNoTdk"},officeFileDetail:{},search:{specialTopic:f+"/search/specialTopic/lisPage"},sms:{sendCorpusDownloadMail:f+"/content/fileSendEmail/sendCorpusDownloadMail",fileSendEmailVisitor:f+"/content/fileSendEmail/visitor"},pay:{bindUser:f+"/order/bind/loginUser",scanOrderInfo:f+"/order/scan/orderInfo",getBuyAutoRenewList:f+"/order/buy/autoRenewList",cancelAutoRenew:f+"/order/cancel/autoRenew/"},coupon:{rightsSaleVouchers:f+"/rights/sale/vouchers",rightsSaleQueryPersonal:f+"/rights/sale/queryPersonal",querySeniority:f+"/rights/sale/querySeniority",queryUsing:f+"/rights/sale/queryUsing",getMemberPointRecord:f+"/rights/vip/getMemberPointRecord",getBuyRecord:f+"/rights/vip/getBuyRecord",getTask:f+"/rights/task/get",receiveTask:f+"/rights/task/receive",taskHasEnable:f+"/rights/task/hasEnable"},order:{reportOrderError:f+"/order/message/save",bindOrderByOrderNo:f+"/order/bind/byOrderNo",unloginOrderDown:e+"/order/unloginOrderDown",createOrderInfo:f+"/order/create/orderInfo",rightsVipGetUserMember:f+"/rights/vip/getUserMember",getOrderStatus:f+"/order/get/orderStatus",queryOrderlistByCondition:f+"/order/query/listByCondition",getOrderInfo:f+"/order/get/orderInfo"},getHotSearch:f+"/cms/search/content/hotWords",special:{fileSaveOrupdate:f+"/comment/zan/fileSaveOrupdate",getCollectState:f+"/comment/zc/getUserFileZcState",setCollect:f+"/content/collect/file"},upload:{getWebAllFileCategory:f+"/content/fileCategory/getWebAll",createFolder:f+"/content/saveUserFolder",getFolder:f+"/content/getUserFolders",saveUploadFile:f+"/content/webUploadFile",picUploadCatalog:"/ishare-upload/picUploadCatalog",fileUpload:"/ishare-upload/fileUpload",batchDeleteUserFile:f+"/content/batchDeleteUserFile"},recommend:{recommendConfigInfo:f+"/recommend/config/info",recommendConfigRuleInfo:f+"/recommend/config/ruleInfo"},reportBrowse:{fileBrowseReportBrowse:f+"/content/fileBrowse/reportBrowse"},mywallet:{getAccountBalance:f+"/account/balance/getGrossIncome",withdrawal:f+"/account/with/apply",getWithdrawalRecord:f+"/account/withd/getPersonList",editFinanceAccount:f+"/account/finance/edit",getFinanceAccountInfo:f+"/account/finance/getInfo",getPersonalAccountTax:f+"/account/tax/getPersonal",getPersonalAccountTax:f+"/account/tax/getPersonal",getMyWalletList:f+"/settlement/settle/getMyWalletList",exportMyWalletDetail:f+"/settlement/settle/exportMyWalletDetail"},authentication:{getInstitutions:f+"/user/certification/getInstitutions",institutions:f+"/user/certification/institutions",getPersonalCertification:f+"/user/certification/getPersonal",personalCertification:f+"/user/certification/personal"},seo:{listContentInfos:f+"/seo/exposeContent/contentInfo/listContentInfos"},wechat:{getWechatSignature:f+"/message/wechat/info/getWechatSignature"},comment:{getLableList:f+"/comment/lable/dataList",addComment:f+"/comment/eval/add",getHotLableDataList:f+"/comment/lable/hotDataList",getFileComment:f+"/comment/eval/dataList",getPersoDataInfo:f+"/comment/eval/persoDataInfo"}}}),define("dist/application/urlConfig",[],function(a,b,c){var d=window.env,e={debug:{ajaxUrl:"",payUrl:"http://open-ishare.iask.com.cn",upload:"//upload-ishare.iask.com",appId:"wxb8af2801b7be4c37",bilogUrl:"https://dw.iask.com.cn/ishare/jsonp",officeUrl:"http://office.iask.com",ejunshi:"http://dev.ejunshi.com"},local:{ajaxUrl:"",payUrl:"http://dev-open-ishare.iask.com.cn",upload:"//dev-upload-ishare.iask.com",appId:"wxb8af2801b7be4c37",bilogUrl:"https://dev-dw.iask.com.cn/ishare/jsonp",officeUrl:"http://dev-office.iask.com",ejunshi:"http://dev.ejunshi.com"},dev:{ajaxUrl:"",payUrl:"http://dev-open-ishare.iask.com.cn",upload:"//dev-upload-ishare.iask.com",appId:"wxb8af2801b7be4c37",bilogUrl:"https://dev-dw.iask.com.cn/ishare/jsonp",officeUrl:"http://dev-office.iask.com",ejunshi:"http://dev.ejunshi.com"},test:{ajaxUrl:"",payUrl:"http://test-open-ishare.iask.com.cn",upload:"//test-upload-ishare.iask.com",appId:"wxb8af2801b7be4c37",bilogUrl:"https://test-dw.iask.com.cn/ishare/jsonp",officeUrl:"http://test-office.iask.com",ejunshi:"http://test.ejunshi.com"},pre:{ajaxUrl:"",payUrl:"http://pre-open-ishare.iask.com.cn",upload:"//pre-upload-ishare.iask.com",appId:"wxca8532521e94faf4",bilogUrl:"https://pre-dw.iask.com.cn/ishare/jsonp",officeUrl:"http://pre-office.iask.com",ejunshi:"http://pre.ejunshi.com"},prod:{ajaxUrl:"",payUrl:"http://open-ishare.iask.com.cn",upload:"//upload-ishare.iask.com",appId:"wxca8532521e94faf4",bilogUrl:"https://dw.iask.com.cn/ishare/jsonp",officeUrl:"http://office.iask.com",ejunshi:"http://ejunshi.com"}};return e[d]}),define("dist/application/login",["dist/application/method","dist/cmd-lib/myDialog","dist/cmd-lib/toast","dist/application/urlConfig","dist/application/iframe/iframe-messenger","dist/application/iframe/messenger"],function(a,b,c){function d(a,b,c){var d=$("#"+b)[0];n[b].addTarget(d),d.onload=function(){console.log("$iframe.onload:",n[b]),n[b].send({isOpen:!0,cid:c.clsId,fid:c.fid,jsId:c.jsId,redirectUrl:window.location.href,originUrl:p[o],bilogUrl:l.bilogUrl,visitor_id:k.getCookie("visitor_id")})},n[b].listen(function(b){console.log("客户端监听-数据",b),b.userData?i(b.userData,b.formData,a):j(b.formData)}),$("#dialog-box .login-dialog .close-btn").on("click",function(){n[b].send({isOpen:!1}),h()})}function e(a,b){iask_web.track_event("NE006","modelView","view",{moduleID:"login",moduleName:"登录弹窗"});var c=$("#login-dialog"),e=k.getLoginSessionId();$.extend(a,{jsId:e}),$("#dialog-box").dialog({html:c.html(),closeOnClickModal:!1}).open(d(b,"I_SHARE",a))}function f(a,b){iask_web.track_event("NE006","modelView","view",{moduleID:"login",moduleName:"登录弹窗"});var c=k.getLoginSessionId();$.extend(a,{jsId:c});var e=$("#tourist-purchase-dialog");$("#dialog-box").dialog({html:e.html(),closeOnClickModal:!1}).open(d(b,"I_SHARE_T0URIST_PURCHASE",a))}function g(a,b){var c=k.getLoginSessionId();$.extend(a,{jsId:c});var e=$("#tourist-login").html();$(".carding-info-bottom.unloginStatus .qrWrap").html(e),$("#tourist-login").remove(),d(b,"I_SHARE_T0URIST_LOGIN",a)}function h(){$(".common-bgMask").hide(),$(".detail-bg-mask").hide(),$("#dialog-box").hide()}function i(a,b,c){window.loginType=b,k.setCookieWithExpPath("cuk",a.access_token,1e3*a.expires_in,"/"),k.setCookieWithExpPath("loginType",b,1e3*a.expires_in,"/"),$.ajaxSetup({headers:{Authrization:k.getCookie("cuk")}}),c&&c(),h()}function j(a){h()}var k=a("dist/application/method");a("dist/cmd-lib/myDialog"),a("dist/cmd-lib/toast");var l=a("dist/application/urlConfig"),m=a("dist/application/iframe/iframe-messenger"),n={I_SHARE:new m({clientId:"MAIN_I_SHARE_LOGIN",projectName:"I_SHARE",ssoId:"I_SHARE_SSO_LOGIN"}),I_SHARE_T0URIST_PURCHASE:new m({clientId:"MAIN_I_SHARE_T0URIST_PURCHASE",projectName:"I_SHARE",ssoId:"I_SHARE_SSO_T0URIST_PURCHASE"}),I_SHARE_T0URIST_LOGIN:new m({clientId:"MAIN_I_SHARE_T0URIST_LOGIN",projectName:"I_SHARE",ssoId:"I_SHARE_SSO_T0URIST_LOGIN"})},o=window.env,p={local:"http://127.0.0.1:8085",dev:"http://dev-ishare.iask.com.cn",test:"http://test-ishare.iask.com.cn",pre:"http://pre-ishare.iask.com.cn",prod:"http://ishare.iask.sina.com.cn"};return $("#dialog-box").on("click",".close-btn",function(a){h()}),$(document).on("click",".tourist-purchase-dialog .tabs .tab",function(a){var b=$(this).attr("data-type");$(" .tourist-purchase-dialog .tabs .tab").removeClass("tab-active"),$(this).addClass("tab-active"),"tourist-purchase"==b&&(iask_web.track_event("NE006","modelView","view",{moduleID:"noLgFPayCon",moduleName:"免登录资料支付弹窗"}),$(".tourist-purchase-dialog #I_SHARE_T0URIST_PURCHASE").hide(),$(".tourist-purchase-dialog .tourist-purchase-content").show()),"login-purchase"==b&&(iask_web.track_event("NE006","modelView","view",{moduleID:"login",moduleName:"登录弹窗"}),$(".tourist-purchase-dialog .tourist-purchase-content").hide(),$(".tourist-purchase-dialog #I_SHARE_T0URIST_PURCHASE").show())}),{showLoginDialog:e,showTouristPurchaseDialog:f,showTouristLogin:g}}),define("dist/cmd-lib/myDialog",[],function(a,b,c){!function(a){a.extend(a.fn,{dialog:function(b){return this.each(function(){var c=a.data(this,"diglog");c||(c=new a.dialog(b,this),a.data(this,"dialog",c))})}});var b={zIndex:1e3,getZindex:function(){return this.zIndex+=100},dialog:{}};a.dialog=function(a,b){arguments.length&&this._init(a,b)},a.dialog.prototype={options:{title:"title",dragable:!1,cache:!0,html:"",width:"auto",height:"auto",cannelBtn:!0,confirmlBtn:!0,cannelText:"关闭",confirmText:"确定",showFooter:!0,onClose:!1,onOpen:!1,callback:!1,showLoading:!1,loadingTxt:"处理中...",onConfirm:!1,onCannel:!1,getContent:!1,zIndex:b.zIndex,closeOnClickModal:!0,getZindex:function(){return b.zIndex+=100},mask_tpl:'<div class="dialog-mask" data-page="mask" style="z-index:'+b.zIndex+';"></div>'},_init:function(b,c){this.options=a.extend(!0,this.options,b),this.element=a(c),this._build(this.options.html),this._bindEvents()},_build:function(b){var c,d="",e="",f="",g='<div class="body-content"></div>';if(b)c=b;else{if(this.options.confirmlBtn&&(e='<button class="confirm">'+this.options.confirmText+"</button>"),this.options.cannelBtn&&(f='<button class="cannel">'+this.options.cannelText+"</button>"),this.options.showFooter&&(d='<div class="footer">                                    <div class="buttons">                                        '+e+"                                        "+f+"                                    </div>                                </div>"),this.options.showFooter){var h=this.options.height-80+"px";g='<div class="body-content" style="height:'+h+';"></div>'}else g='<div class="body-content" style="height:'+this.options.height+';"></div>';c='<div class="m-dialog" style="z-index:'+this.options.getZindex+';">								<div class="m-d-header">									<h2 style="width:'+this.options.width+';">'+this.options.title+'</h2>									<a href="javascript:;" class="btn-close">X</a>								</div>								<div class="m-d-body" style="width:'+this.options.width+";height:"+this.options.height+';">									'+g+"                                </div>"+d+"</div>"}a(document).find('[data-page="mask"]').length||a("body").append(this.options.mask_tpl),this.element.html(c)},_center:function(){var b=this.element.find(".dialog");b.css({left:(a(document).width()-b.width())/2,top:(document.documentElement.clientHeight-b.height())/2+a(document).scrollTop()})},_bindEvents:function(){var b=this;this.element.delegate(".close,.cancel","click",function(a){a&&a.preventDefault(),b.close(b.options.onClose)}),a(document).delegate('[data-page="mask"]',"click",function(a){b.options.closeOnClickModal&&(a&&a.preventDefault(),b.close(b.options.onClose))}),this.element.delegate(".cannel","click",function(a){a&&a.preventDefault(),b._cannel(b.options.onCannel)}),this.element.delegate(".confirm","click",function(c){c&&c.preventDefault(),a(this).hasClass("disable")||(b.options.showLoading&&(a(this).addClass("disable"),a(this).html(b.options.loadingTxt)),b._confirm(b.options.onConfirm))})},close:function(a){this._hide(a),this.clearCache()},open:function(b){this._callback(b),this.element.show(),a('[data-page="mask"]').show(),this.clearCache()},_hide:function(b){this.element.hide(),a('[data-page="mask"]').hide(),b&&"function"==typeof b&&this._callback(b)},clearCache:function(){this.options.cache||this.element.data("dialog","")},_callback:function(a){a&&"function"==typeof a&&a.call(this)},_cannel:function(a){this._hide(a),this.clearCache()},_confirm:function(a){return this.options.callback?a():(this._hide(a),void this.clearCache())},getElement:function(){return this.element},_getOptions:function(){return this.options},_setTxt:function(a){return this.element.find(".confirm").html(a)},destroy:function(){var a=this;a.element.remove()}},a.extend(a.fn,{open:function(b){a(this).data("dialog")&&a(this).data("dialog").open(b)},close:function(b){a(this).data("dialog")&&a(this).data("dialog").close(b)},clear:function(){a(this).data("dialog")&&a(this).data("dialog").clearCache()},getOptions:function(){return a(this).data("dialog")&&a(this).data("dialog")._getOptions()},getEl:function(){return a(this).data("dialog")&&a(this).data("dialog").getElement()},setTxt:function(b){a(this).data("dialog")&&a(this).data("dialog")._setTxt(b)},destroy:function(){a(this).data("dialog")&&a(this).data("dialog").destroy(t)}})}(jQuery)}),define("dist/cmd-lib/toast",[],function(a,b,c){!function(a,b,c){function d(b){this.options={text:"我是toast提示",icon:"",delay:3e3,callback:!1},b&&a.isPlainObject(b)&&a.extend(!0,this.options,b),this.init()}d.prototype.init=function(){var b=this;b.body=a("body"),b.toastWrap=a('<div class="ui-toast" style="position:fixed;min-width:200px;padding:0 10px;height:60px;line-height:60px;text-align:center;background:#000;opacity:0.8;filter:alpha(opacity=80);top:40%;left:50%;margin-left:-100px;margin-top:-30px;border-radius:4px;z-index:99999999">'),b.toastIcon=a('<i class="icon"></i>'),b.toastText=a('<span class="ui-toast-text" style="color:#fff">'+b.options.text+"</span>"),b._creatDom(),b.show(),b.hide()},d.prototype._creatDom=function(){var a=this;a.options.icon&&a.toastWrap.append(a.toastIcon.addClass(a.options.icon)),a.toastWrap.append(a.toastText),a.body.append(a.toastWrap)},d.prototype.show=function(){var a=this;setTimeout(function(){a.toastWrap.removeClass("hide").addClass("show")},50)},d.prototype.hide=function(){var a=this;setTimeout(function(){a.toastWrap.removeClass("show").addClass("hide"),a.toastWrap.remove(),a.options.callback&&a.options.callback()},a.options.delay)},a.toast=function(a){return new d(a)}}($,window,document)}),define("dist/application/iframe/iframe-messenger",["dist/application/iframe/messenger"],function(a){function b(a){this.clientId=a.clientId,this.ssoId=a.ssoId,this.messenger=new c(a.clientId,a.projectName)}var c=a("dist/application/iframe/messenger");return b.prototype.addTarget=function(a){this.messenger.addTarget(a.contentWindow,this.ssoId)},b.prototype.listen=function(a){var b=this;this.messenger.listen(function(c){c&&(c=JSON.parse(c),c.id===b.ssoId&&"function"==typeof a&&a(c))})},b.prototype.send=function(a){var b=this;b.messenger.targets[b.ssoId].send(JSON.stringify({id:b.clientId,data:a}))},b}),define("dist/application/iframe/messenger",[],function(){function a(a,b,c){var d="";if(arguments.length<2?d="target error - target and name are both required":"object"!=typeof a?d="target error - target itself must be window object":"string"!=typeof b&&(d="target error - target name must be string type"),d)throw new Error(d);this.target=a,this.name=b,this.prefix=c}function b(a,b){this.targets={},this.name=a,this.listenFunc=[],this.prefix=b||c,this.initListen()}var c="[PROJECT_NAME]",d="postMessage"in window;return d?a.prototype.send=function(a){this.target.postMessage(this.prefix+"|"+this.name+"__Messenger__"+a,"*")}:a.prototype.send=function(a){var b=window.navigator[this.prefix+this.name];if("function"!=typeof b)throw new Error("target callback function is not defined");b(this.prefix+a,window)},b.prototype.addTarget=function(b,c){var d=new a(b,c,this.prefix);this.targets[c]=d},b.prototype.initListen=function(){var a=this,b=function(b){if("object"==typeof b&&b.data&&(b=b.data),"string"==typeof b)for(var c=b.split("__Messenger__"),b=c[1],d=c[0].split("|"),e=d[0],f=d[1],g=0;g<a.listenFunc.length;g++)e+f===a.prefix+a.name&&a.listenFunc[g](b)};d?"addEventListener"in document?window.addEventListener("message",b,!1):"attachEvent"in document&&window.attachEvent("onmessage",b):window.navigator[this.prefix+this.name]=b},b.prototype.listen=function(a){for(var b=0,c=this.listenFunc.length,d=!1;c>b;b++)if(this.listenFunc[b]==a){d=!0;break}d||this.listenFunc.push(a)},b.prototype.clear=function(){this.listenFunc=[]},b.prototype.send=function(a){var b,c=this.targets;for(b in c)c.hasOwnProperty(b)&&c[b].send(a)},b});var _hmt=_hmt||[];define("dist/common/baidu-statistics",["dist/application/method"],function(a,b,c){function d(a){if(a)try{!function(){var b=document.createElement("script");b.src="https://hm.baidu.com/hm.js?"+a;var c=document.getElementsByTagName("script")[0];c.parentNode.insertBefore(b,c)}()}catch(b){console.error(a,b)}}function e(a,b){var c=h[a];"fileDetailPageView"==a&&(b=c),"payFileResult"==a&&(b=$.extend(c,{payresult:b.payresult,orderid:b.orderNo,orderpaytype:b.orderpaytype})),"payVipResult"==a&&(b=$.extend(c,{payresult:b.payresult,orderid:b.orderNo,orderpaytype:b.orderpaytype})),"loginResult"==a&&(b=$.extend(c,{loginType:b.loginType,userid:b.userid,loginResult:b.loginResult})),_hmt.push(["_trackCustomEvent",a,b]),console.log("百度统计:",a,b)}var f=a("dist/application/method"),g=window.pageConfig&&window.pageConfig.params,h={fileDetailPageView:{loginstatus:f.getCookie("cuk")?1:0,userid:window.pageConfig&&window.pageConfig.userId||"",pageid:"PC-M-FD",fileid:g&&g.g_fileId,filecategoryname:g&&g.classidName1+"||"+g&&g.classidName2+"||"+g&&g.classidName3,filepaytype:g&&g.productType||"",filecootype:"",fileformat:g&&g.file_format||""},payFileResult:{loginstatus:f.getCookie("cuk")?1:0,userid:window.pageConfig&&window.pageConfig.userId||"",pageid:"PC-M-FD",pagename:"",payresult:"",orderid:"",orderpaytype:"",orderpayprice:"",fileid:"",filename:"",fileprice:"",filecategoryname:"",fileformat:"",filecootype:"",fileuploaderid:""},payVipResult:{loginstatus:f.getCookie("cuk")?1:0,userid:"",pageid:"PC-M-FD",pagename:"",payresult:"",orderid:"",orderpaytype:"",orderpayprice:"",fileid:"",filename:"",fileprice:"",filecategoryname:"",fileformat:"",filecootype:"",fileuploaderid:""},loginResult:{pagename:$("#ip-page-id").val(),pageid:$("#ip-page-name").val(),loginType:"",userid:"",loginResult:""}};return{initBaiduStatistics:d,handleBaiduStatisticsPush:e}}),define("dist/application/effect",["dist/application/checkLogin","dist/application/api","dist/application/urlConfig","dist/application/method","dist/application/login","dist/cmd-lib/myDialog","dist/cmd-lib/toast","dist/application/iframe/iframe-messenger","dist/application/iframe/messenger","dist/common/baidu-statistics","dist/application/method","dist/common/loginType"],function(a,b,c){function d(a,b,c){!g.getCookie("cuk")&&b?f.notifyLoginInterface(function(b){a&&a(b),c&&c(b),l(b)}):g.getCookie("cuk")?f.getLoginData(function(b){a&&a(b),l(b)}):b||a&&a()}function e(){$.ajax({url:h.user.dictionaryData.replace("$code","PC-M-Login"),type:"GET",async:!1,contentType:"application/json; charset=utf-8",dataType:"json",cache:!1,success:function(a){if(console.log(a),0==a.code&&a.data&&a.data.length){var b=a.data[0];if("PC-M-Login"==b.pcode){var c=window.pageConfig.page&&window.pageConfig.page.abTest;("a"!=c||g.getCookie("isShowDetailALoginRedPacket"))&&("b"!=c||g.getCookie("isShowDetailBLoginRedPacket"))?"index"!=c||g.getCookie("isShowIndexLoginRedPacket")||($(".loginRedPacket-dialog").removeClass("hide"),iask_web.track_event("NE006","modelView","view",{moduleID:"activityFloat",moduleName:"活动浮层"})):($(".loginRedPacket-dialog").removeClass("hide"),iask_web.track_event("NE006","modelView","view",{moduleID:"activityFloat",moduleName:"活动浮层"}))}}}})}var f=a("dist/application/checkLogin"),g=a("dist/application/method"),h=a("dist/application/api"),i=a("dist/common/loginType");
$("#unLogin").on("click",function(){f.notifyLoginInterface(function(a){l(a)})}),$(".loginOut").on("click",function(){var a=window.pageConfig.page&&window.pageConfig.page.pageName;"personalCenter"==a&&iask_web.track_event("NE002","normalClick","click",{domID:"exit",domName:"退出登录"}),f.ishareLogout()}),$(".top-user-more .js-buy-open").click(function(){"vip"==$(this).attr("data-type")&&(location.href="/pay/vip.html")}),$(".vip-join-con").click(function(){g.compatibleIESkip("/node/rights/vip.html",!0)}),$(".btn-new-search").click(function(){if(new RegExp("/search/home.html").test(location.href)){var a=window.location.href.substring(0,window.location.href.indexOf("?"))+"?ft=all",b=$(".new-input").val()?$(".new-input").val().replace(/^\s+|\s+$/gm,""):$(".new-input").attr("placeholder");window.location.href=g.changeURLPar(a,"cond",encodeURIComponent(encodeURIComponent(b)))}else{var b=$(".new-input").val()?$(".new-input").val().replace(/^\s+|\s+$/gm,""):$(".new-input").attr("placeholder");b&&g.compatibleIESkip("/search/home.html?ft=all&cond="+encodeURIComponent(encodeURIComponent(b)),!0)}}),$(".new-input").on("keydown",function(a){if(new RegExp("/search/home.html").test(location.href)&&13===a.keyCode){var b=window.location.href.substring(0,window.location.href.indexOf("?"))+"?ft=all",c=$(".new-input").val()?$(".new-input").val().replace(/^\s+|\s+$/gm,""):$(".new-input").attr("placeholder");window.location.href=g.changeURLPar(b,"cond",encodeURIComponent(encodeURIComponent(c)))}else if(13===a.keyCode){var c=$(".new-input").val()?$(".new-input").val().replace(/^\s+|\s+$/gm,""):$(".new-input").attr("placeholder");c&&g.compatibleIESkip("/search/home.html?ft=all&cond="+encodeURIComponent(encodeURIComponent(c)),!0)}});var j=$(".new-detail-header"),k=j.height();$(window).scroll(function(){var a=$(this).scrollTop();a-k>=0?j.addClass("new-detail-header-fix"):j.removeClass("new-detail-header-fix")});var l=function(a){var b=a.nickName&&a.nickName.length>4?a.nickName.slice(0,4)+"...":a.nickName,c=$("#unLogin"),d=$("#haveLogin");c.hide(),d.find(".user-link .user-name").html(b),d.find(".user-link img").attr("src",a.photoPicURL),d.find(".top-user-more .name").html(b),d.find(".top-user-more img").attr("src",a.photoPicURL),d.find(".user-link .user-name").text(b);var e=i[g.getCookie("loginType")];d.find(".user-link .user-loginType").text(e?e+"登录":""),d.show();var f=$(".JsPayOfficeVip"),h=$(".JsPayMainVip"),j=$(".JsMainIcon"),k=$(".JsOfficeIcon");1===a.isOfficeVip?(f.html("立即续费"),k.addClass("i-vip-blue"),k.removeClass("i-vip-gray2")):(k.removeClass("i-vip-blue"),k.addClass("i-vip-gray2")),1===a.isMasterVip?(h.html("立即续费"),j.addClass("i-vip-yellow"),j.removeClass("i-vip-gray1")):(j.removeClass("i-vip-yellow"),j.addClass("i-vip-gray1")),$(".jsUserImage").attr("src",a.photoPicURL),$(".jsUserName").text(a.nickName),window.pageConfig.params&&(window.pageConfig.params.isVip=a.isVip);var l=a.fileDiscount;l?l/=100:l=.8,window.pageConfig.params&&(window.pageConfig.params.fileDiscount=l),$("#ip-uid").val(a.userId),$("#ip-isVip").val(a.isVip),$("#ip-mobile").val(a.mobile)};return e(),$(document).on("click",".loginRedPacket-dialog .close-btn",function(a){iask_web.track_event("NE002","normalClick","click",{domID:"close",domName:"关闭"});var b=window.pageConfig.page&&window.pageConfig.page.abTest;"a"==b?g.setCookieWithExpPath("isShowDetailALoginRedPacket",1):"b"==b?g.setCookieWithExpPath("isShowDetailBLoginRedPacket",1):g.setCookieWithExpPath("isShowIndexLoginRedPacket",1),$(".loginRedPacket-dialog").hide()}),$(document).on("click",".loginRedPacket-dialog .loginRedPacket-content",function(a){iask_web.track_event("NE002","normalClick","click",{domID:"confirm",domName:"确定"});var b=window.pageConfig.page&&window.pageConfig.page.abTest;"a"==b?$("#detail-unLogin").trigger("click"):"b"==b?$("#detail-unLogin").trigger("click"):$(".index-header .notLogin").trigger("click")}),{refreshTopBar:l,isLogin:d}}),define("dist/common/loginType",[],function(a,b,c){return{wechat:"微信",qq:"QQ",weibo:"微博",phoneCode:"验证码",phonePw:"密码"}});