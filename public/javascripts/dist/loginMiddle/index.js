/*! ishare_pc_website
*author:Jersey */

define("dist/loginMiddle/index",["../application/urlConfig","../application/api","../application/method"],function(a,b,c){function d(a,b,c){$ajax(f.user.thirdLoginRedirect,"POST",{terminal:"0",thirdType:c,code:a,businessSys:"ishare",site:e.site},"",{jsId:l}).then(function(a){"0"==a.code?(window.loginType=c,g.setCookieWithExpPath("cuk",a.data.access_token,1e3*a.data.expires_in,"/"),g.setCookieWithExpPath("loginType",loginType,1e3*a.data.expires_in,"/"),$.ajaxSetup({headers:{Authrization:g.getCookie("cuk")}}),$ajax("/node/api/getUserInfo","GET").then(function(a){trackEventLogin(a.data.userId),trackEvent("SE001","loginResult","query",{loginResult:"1",failMsg:"",loginType:window.loginType&&window.loginType}),setTimeout(function(){window.open(h,"_self")},600)}).fail(function(a){window.open(h,"_self")})):window.open(h,"_self")})}var e=a("../application/urlConfig"),f=a("../application/api"),g=a("../application/method"),h=g.getParam("redirectUrl"),i=g.getParam("code"),j=g.getParam("channel"),k=g.getParam("clientCode"),l=g.getLoginSessionId();d(i,j,k)}),define("dist/application/urlConfig",[],function(a,b,c){var d=window.env,e={debug:{ajaxUrl:"",payUrl:"http://open-ishare.iask.com.cn",upload:"//upload-ishare.iask.com",appId:"wxb8af2801b7be4c37",bilogUrl:"https://dw.iask.com.cn/ishare/jsonp",officeUrl:"http://office.iask.com",ejunshi:"http://dev.ejunshi.com"},local:{ajaxUrl:"",payUrl:"http://test-open-ishare.iask.com.cn",upload:"//dev-upload-ishare.iask.com",appId:"wxb8af2801b7be4c37",bilogUrl:"https://dev-dw.iask.com.cn/ishare/jsonp",officeUrl:"http://dev-office.iask.com",ejunshi:"http://dev.ejunshi.com"},dev:{ajaxUrl:"",payUrl:"http://dev-open-ishare.iask.com.cn",upload:"//dev-upload-ishare.iask.com",appId:"wxb8af2801b7be4c37",bilogUrl:"https://dev-dw.iask.com.cn/ishare/jsonp",officeUrl:"http://dev-office.iask.com",ejunshi:"http://dev.ejunshi.com"},test:{ajaxUrl:"",payUrl:"http://test-open-ishare.iask.com.cn",upload:"//test-upload-ishare.iask.com",appId:"wxb8af2801b7be4c37",bilogUrl:"https://test-dw.iask.com.cn/ishare/jsonp",officeUrl:"http://test-office.iask.com",ejunshi:"http://test.ejunshi.com"},pre:{ajaxUrl:"",payUrl:"http://pre-open-ishare.iask.com.cn",upload:"//pre-upload-ishare.iask.com",appId:"wxca8532521e94faf4",bilogUrl:"https://pre-dw.iask.com.cn/ishare/jsonp",officeUrl:"http://pre-office.iask.com",ejunshi:"http://pre.ejunshi.com"},prod:{ajaxUrl:"",payUrl:"http://open-ishare.iask.com.cn",upload:"//upload-ishare.iask.com",appId:"wxca8532521e94faf4",bilogUrl:"https://dw.iask.com.cn/ishare/jsonp",officeUrl:"http://office.iask.com",ejunshi:"http://ejunshi.com"}};return $.extend({},e[d],{site:4,terminal:0})}),define("dist/application/api",["dist/application/urlConfig"],function(a,b,c){var d=a("dist/application/urlConfig"),e=d.ajaxUrl+"/gateway/pc",f=d.ajaxUrl+"/gateway";c.exports={user:{userWxAuthState:f+"/cas/user/wxAuthState",dictionaryData:f+"/market/dictionaryData/$code",checkSso:f+"/cas/login/checkSso",loginByPsodOrVerCode:f+"/cas/login/authorize",getLoginQrcode:f+"/cas/login/qr_code",loginByWeChat:f+"/cas/login/gzh_scan",getUserInfo:"/node/api/getUserInfo",thirdLoginRedirect:f+"/cas/login/redirect",loginOut:f+"/cas/login/logout",newCollect:f+"/content/collect/getUserFileList",addFeedback:f+"/feedback/addFeedback",getFeedbackType:f+"/feedback/getFeedbackType",sendSms:f+"/cas/sms/sendSms",queryBindInfo:f+"/cas/user/queryBindInfo",thirdCodelogin:f+"/cas/login/thirdCode",userBindMobile:f+"/cas/user/bindMobile",checkIdentity:f+"/cas/sms/checkIdentity",userBindThird:f+"/cas/user/bindThird",untyingThird:f+"/cas/user/untyingThird",setUpPassword:f+"/cas/user/setUpPassword",getUserCentreInfo:f+"/user/getUserCentreInfo",editUser:f+"/user/editUser",getFileBrowsePage:f+"/content/fileBrowse/getFileBrowsePage",getDownloadRecordList:f+"/content/getDownloadRecordList",getUserFileList:f+"/content/collect/getUserFileList",getMyUploadPage:f+"/content/getMyUploadPage",getOtherUser:f+"/user/getOthersCentreInfo",getSearchList:f+"/search/content/byCondition",getVisitorId:f+"/user/getVisitorId",getCoinIaskBalance:f+"/account/user/getCoinIaskBalance",getCoinIaskList:f+"/account/user/getCoinIaskList",taskUserActionRecordReport:f+"/task/userActionRecord/report",updateAgreementTime:f+"/user/certification/updateAgreementTime"},normalFileDetail:{filePreDownLoad:f+"/content/getPreFileDownUrl",getFileDownLoadUrl:f+"/content/getFileDownUrl",getPrePageInfo:f+"/content/getPreRead",sendmail:f+"/content/sendmail/findFile",getFileDetailNoTdk:f+"/content/getFileDetailNoTdk"},officeFileDetail:{},search:{specialTopic:f+"/search/specialTopic/lisPage"},sms:{sendCorpusDownloadMail:f+"/content/fileSendEmail/sendCorpusDownloadMail",fileSendEmailVisitor:f+"/content/fileSendEmail/visitor"},pay:{bindUser:f+"/order/bind/loginUser",scanOrderInfo:f+"/order/scan/orderInfo",getBuyAutoRenewList:f+"/order/buy/autoRenewList",cancelAutoRenew:f+"/order/cancel/autoRenew/"},coupon:{rightsSaleVouchers:f+"/rights/sale/vouchers",rightsSaleQueryPersonal:f+"/rights/sale/queryPersonal",querySeniority:f+"/rights/sale/querySeniority",queryUsing:f+"/rights/sale/queryUsing",getMemberPointRecord:f+"/rights/vip/getMemberPointRecord",getBuyRecord:f+"/rights/vip/getBuyRecord",getTask:f+"/rights/task/get",receiveTask:f+"/rights/task/receive",taskHasEnable:f+"/rights/task/hasEnable"},order:{reportOrderError:f+"/order/message/save",bindOrderByOrderNo:f+"/order/bind/byOrderNo",unloginOrderDown:e+"/order/unloginOrderDown",createOrderInfo:f+"/order/create/orderInfo",rightsVipGetUserMember:f+"/rights/vip/getUserMember",getOrderStatus:f+"/order/get/orderStatus",queryOrderlistByCondition:f+"/order/query/listByCondition",getOrderInfo:f+"/order/get/orderInfo",downloadOrder:f+"/order/create/downloadOrder"},getHotSearch:f+"/cms/search/content/hotWords",special:{fileSaveOrupdate:f+"/comment/zan/fileSaveOrupdate",getCollectState:f+"/comment/zc/getUserFileZcState",setCollect:f+"/content/collect/file"},upload:{getWebAllFileCategory:f+"/content/fileCategory/getWebAll",createFolder:f+"/content/saveUserFolder",getFolder:f+"/content/getUserFolders",saveUploadFile:f+"/content/webUploadFile",picUploadCatalog:"/ishare-upload/picUploadCatalog",fileUpload:"/ishare-upload/fileUpload",batchDeleteUserFile:f+"/content/batchDeleteUserFile"},recommend:{recommendConfigInfo:f+"/recommend/config/info",recommendConfigRuleInfo:f+"/recommend/config/ruleInfo"},reportBrowse:{fileBrowseReportBrowse:f+"/content/fileBrowse/reportBrowse"},mywallet:{getAccountBalance:f+"/account/balance/getGrossIncome",withdrawal:f+"/account/with/apply",getWithdrawalRecord:f+"/account/withd/getPersonList",editFinanceAccount:f+"/account/finance/edit",getFinanceAccountInfo:f+"/account/finance/getInfo",getPersonalAccountTax:f+"/account/tax/getPersonal",getMyWalletList:f+"/settlement/settle/getMyWalletList",exportMyWalletDetail:f+"/settlement/settle/exportMyWalletDetail"},authentication:{getInstitutions:f+"/user/certification/getInstitutions",institutions:f+"/user/certification/institutions",getPersonalCertification:f+"/user/certification/getPersonal",personalCertification:f+"/user/certification/personal"},seo:{listContentInfos:f+"/seo/exposeContent/contentInfo/listContentInfos"},wechat:{getWechatSignature:f+"/message/wechat/info/getWechatSignature"},comment:{getLableList:f+"/comment/lable/dataList",getStarLevelList:f+"/comment/lable/getStarLevelList",addComment:f+"/comment/eval/add",getHotLableDataList:f+"/comment/lable/hotDataList",getFileComment:f+"/comment/eval/dataList",getPersoDataInfo:f+"/comment/eval/persoDataInfo",getQualifications:f+"/comment/eval/getQualifications"},iaskCoin:{getCoinIaskBalance:f+"/account/user/getCoinIaskBalance"},exchange:{exchangeGoodsList:f+"/exchange/integralGoods/exchangeGoodsList",exchangeGoodsDetail:f+"/exchange/integralGoods/exchangeGoodsDetail/$id"},task:{dailyTaskList:f+"/task/taskList/daily",noviceTaskList:f+"/task/taskList/novice",taskNotifyList:f+"/task/taskList/done"}}}),define("dist/application/method",[],function(require,exports,module){return{keyMap:{ishare_detail_access:"ISHARE_DETAIL_ACCESS",ishare_office_detail_access:"ISHARE_OFFICE_DETAIL_ACCESS"},async:function(a,b,c,d,e){$.ajax(a,{type:d||"post",data:e,async:!1,dataType:"json",headers:{"cache-control":"no-cache",Pragma:"no-cache",Authrization:this.getCookie("cuk")}}).done(function(a){b&&b(a)}).fail(function(a){console.log("error==="+c)})},get:function(a,b,c){$.ajaxSetup({cache:!1}),this.async(a,b,c,"get")},post:function(a,b,c,d,e){this.async(a,b,c,d,e)},postd:function(a,b,c){this.async(a,b,!1,!1,c)},customAjax:function(a){var b=this,c=this.getCookie("cuk");$.ajax({type:a.type||"POST",timeout:a.timeout||3e4,async:a.async,cache:a.cache,headers:{Authrization:c,"cache-control":"no-cache",Pragma:"no-cache"},statusCode:{401:function(){b.delCookie("cuk","/"),b.delCookie("cuk","/",".sina.com.cn"),b.delCookie("cuk","/",".iask.com.cn"),b.delCookie("cuk","/",".iask.com"),$.toast({text:"请重新登录",delay:2e3})}},contentType:a.contentType||"application/json;charset=utf-8",dataType:a.dataType||"json",url:a.url,data:a.data,success:a.success,error:a.error})},customGet:function(a,b,c,d,e){this.customAjax({type:"GET",url:a,async:e===!1?e:!0,cache:!1,data:b,success:c,error:d})},customPost:function(a,b,c,d,e){this.customAjax({type:"POST",url:a,async:e===!1?e:!0,data:b?JSON.stringify(b):b,success:c,error:d})},random:function(a,b){return Math.floor(Math.random()*(b-a))+a},setCookieWithExpPath:function(a,b,c,d){var e=new Date;e.setTime(e.getTime()+c),document.cookie=a+"="+escape(b)+";path="+d+";expires="+e.toGMTString()},setCookieWithExp:function(a,b,c,d){var e=new Date;e.setTime(e.getTime()+c),d?document.cookie=a+"="+escape(b)+";path="+d+";expires="+e.toGMTString():document.cookie=a+"="+escape(b)+";expires="+e.toGMTString()},getCookie:function(a){var b=document.cookie.match(new RegExp("(^| )"+a+"=([^;]*)(;|$)"));return null!==b?unescape(b[2]):null},delCookie:function(a,b,c){var d=new Date;d.setTime(d.getTime()-1);var e=this.getCookie(a);null!=e&&(b&&c?document.cookie=a+"= '' ;domain="+c+";expires="+d.toGMTString()+";path="+b:b?document.cookie=a+"= '' ;expires="+d.toGMTString()+";path="+b:document.cookie=a+"="+e+";expires="+d.toGMTString())},getQueryString:function(a){var b=new RegExp("(^|&)"+a+"=([^&]*)(&|$)","i"),c=window.location.search.substr(1).match(b);return null!=c?unescape(c[2]):null},url2Obj:function(a){for(var b={},c=a.split("?"),d=c[1].split("&"),e=0;e<d.length;e++){var f=d[e].split("=");b[f[0]]=f[1]}return b},getParam:function(a){a=a.replace(/[\[]/,"\\[").replace(/[\]]/,"\\]");var b="[\\?&]"+a+"=([^&#]*)",c=new RegExp(b),d=c.exec(window.location.href);return null==d?"":decodeURIComponent(d[1].replace(/\+/g," "))},getLocalData:function(a){try{if(localStorage&&localStorage.getItem){var b=localStorage.getItem(a);return null===b?null:JSON.parse(b)}return console.log("浏览器不支持html localStorage getItem"),null}catch(c){return null}},setLocalData:function(a,b){localStorage&&localStorage.setItem?(localStorage.removeItem(a),localStorage.setItem(a,JSON.stringify(b))):console.log("浏览器不支持html localStorage setItem")},browserType:function(){var a=navigator.userAgent,b=a.indexOf("Opera")>-1;return b?"Opera":a.indexOf("compatible")>-1&&a.indexOf("MSIE")>-1&&!b?"IE":a.indexOf("Edge")>-1?"Edge":a.indexOf("Firefox")>-1?"Firefox":a.indexOf("Safari")>-1&&-1===a.indexOf("Chrome")?"Safari":a.indexOf("Chrome")>-1&&a.indexOf("Safari")>-1?"Chrome":void 0},validateIE9:function(){return Boolean($.browser.msie&&("9.0"===$.browser.version||"8.0"===$.browser.version||"7.0"===$.browser.version||"6.0"===$.browser.version))},compareTime:function(a,b){return a&&b?Math.abs((b-a)/1e3/60/60/24):""},changeURLPar:function(url,arg,arg_val){var pattern=arg+"=([^&]*)",replaceText=arg+"="+arg_val;if(url.match(pattern)){var tmp="/("+arg+"=)([^&]*)/gi";return tmp=url.replace(eval(tmp),replaceText)}return url.match("[?]")?url+"&"+replaceText:url+"?"+replaceText},getUrlAllParams:function(a){if("undefined"==typeof a)var b=decodeURI(location.search);else var b="?"+a.split("?")[1];var c=new Object;if(-1!=b.indexOf("?"))for(var d=b.substr(1),e=d.split("&"),f=0;f<e.length;f++)c[e[f].split("=")[0]]=decodeURI(e[f].split("=")[1]);return c},compatibleIESkip:function(a,b){setTimeout(function(){var c=document.createElement("a");c.href=a,c.style.display="none",b&&(c.target="_blank"),document.body.appendChild(c),c.click()},350)},testEmail:function(a){var b=/^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;return b.test(a)?!0:!1},testPhone:function(a){return/^1(3|4|5|6|7|8|9)\d{9}$/.test(a)?!0:!1},handleRecommendData:function(a){var b=[];return $(a).each(function(a,c){var d={};1==c.type&&(c.linkUrl="/f/"+c.tprId+".html",d=c),2==c.type&&(d=c),3==c.type&&(c.linkUrl="/node/s/"+c.tprId+".html",d=c),b.push(d)}),console.log(b),b},formatDate:function(a){var b={"M+":this.getMonth()+1,"d+":this.getDate(),"h+":this.getHours(),"m+":this.getMinutes(),"s+":this.getSeconds(),"q+":Math.floor((this.getMonth()+3)/3),S:this.getMilliseconds()};/(y+)/.test(a)&&(a=a.replace(RegExp.$1,String(this.getFullYear()).substr(4-RegExp.$1.length)));for(var c in b)new RegExp("("+c+")").test(a)&&(a=a.replace(RegExp.$1,1==RegExp.$1.length?b[c]:("00"+b[c]).substr(String(b[c]).length)));return a},formatDateV2:function(a,b){var c=new Date(b),d={"M+":c.getMonth()+1,"d+":c.getDate(),"h+":c.getHours(),"m+":c.getMinutes(),"s+":c.getSeconds(),"q+":Math.floor((c.getMonth()+3)/3),S:c.getMilliseconds()};/(y+)/.test(a)&&(a=a.replace(RegExp.$1,String(c.getFullYear()).substr(4-RegExp.$1.length)));for(var e in d)new RegExp("("+e+")").test(a)&&(a=a.replace(RegExp.$1,1==RegExp.$1.length?d[e]:("00"+d[e]).substr(String(d[e]).length)));return a},getReferrer:function(){var a=document.referrer,b="";return/https?\:\/\/[^\s]*so.com.*$/g.test(a)?b="360":/https?\:\/\/[^\s]*baidu.com.*$/g.test(a)?b="baidu":/https?\:\/\/[^\s]*sogou.com.*$/g.test(a)?b="sogou":/https?\:\/\/[^\s]*sm.cn.*$/g.test(a)&&(b="sm"),b},judgeSource:function(a){a||(a={}),a.searchEngine="";var b="";if(b=utils.getQueryVariable("from"),b||(b=sessionStorage.getItem("webWxFrom")||utils.getCookie("webWxFrom")),b)a.source=b,sessionStorage.setItem("webWxFrom",b),sessionStorage.removeItem("webReferrer");else{var c=sessionStorage.getItem("webReferrer")||utils.getCookie("webReferrer");if(c||(c=document.referrer),c){sessionStorage.setItem("webReferrer",c),sessionStorage.removeItem("webWxFrom"),c=c.toLowerCase();for(var d=new Array("google.","baidu.","360.","sogou.","shenma.","bing."),e=new Array("google","baidu","360","sogou","shenma","bing"),f=0,g=d.length;g>f;f++)c.indexOf(d[f])>=0&&(a.source="searchEngine",a.searchEngine=e[f])}c&&a.source||(utils.isWeChatBrow()?a.source="wechat":a.source="outLink")}return a},randomString:function(a){a=a||4;for(var b="ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678",c=b.length,d="",e=0;a>e;e++)d+=b.charAt(Math.floor(Math.random()*c));return d},saveLoginToken:function(a,b){b=b||2592e6,this.setCookieWithExpPath("cuk",a,b,"/")},getLoginToken:function(){return this.getCookie("cuk")||""},delLoginToken:function(){this.delCookie("cuk","/")},saveLoginSessionId:function(a){var b=(new Date).getTime(),c=a.split("_"),d=c[1]||0,e=d-b;this.setCookieWithExpPath("ish_jssid",a,e,"/")},getLoginSessionId:function(){return this.getCookie("ish_jssid")||""},isIe8:function(){return Array.isArray?!0:!1}}});
//# sourceMappingURL=dist/js-source-map/ishare-web-pc.js.map