/*! ishare_pc_website
*author:Jersey */
define("dist/pay/paymentResult",["../common/baidu-statistics","../application/method","../cmd-lib/toast2","../application/api","../application/urlConfig","./payRestult.html","./go2MinApp","../cmd-lib/util"],function(a,b,c){function d(){$.ajax({url:e.order.getOrderInfo,type:"POST",data:JSON.stringify({orderNo:g}),contentType:"application/json; charset=utf-8",dataType:"json",success:function(a){console.log("getOrderInfo:",a);var b=f.formatDate;if(Date.prototype.format=b,"0"==a.code){a.data.payPrice=(a.data.payPrice/100).toFixed(2),a.data.orderTime=new Date(a.data.orderTime).format("yyyy-MM-dd");var c=template.compile(h)({orderInfo:a.data});$(".payment .payment-content").html(c),1==a.goodsType&&i("payFileResult",{payresult:1,orderid:g,orderpaytype:a.data.payType}),2==a.goodsType&&i("payVipResult",{payresult:1,orderid:g,orderpaytype:a.data.payType})}else $.toast({text:a.msg,delay:3e3})},error:function(a){console.log("getOrderInfo:",a)}})}console.log("聚合支付码"),a("../common/baidu-statistics").initBaiduStatistics("17cdd3f409f282dc0eeb3785fcf78a66"),a("../cmd-lib/toast2");var e=a("../application/api"),f=a("../application/method"),g=f.getParam("orderNo"),h=a("./payRestult.html"),i=a("../common/baidu-statistics").handleBaiduStatisticsPush;d(),a("./go2MinApp")});var _hmt=_hmt||[];define("dist/common/baidu-statistics",["dist/application/method"],function(a,b,c){function d(a){if(a)try{!function(){var b=document.createElement("script");b.src="https://hm.baidu.com/hm.js?"+a;var c=document.getElementsByTagName("script")[0];c.parentNode.insertBefore(b,c)}()}catch(b){console.error(a,b)}}function e(a,b){var c=h[a];"fileDetailPageView"==a&&(b=c),"payFileResult"==a&&(b=$.extend(c,{payresult:b.payresult,orderid:b.orderNo,orderpaytype:b.orderpaytype})),"payVipResult"==a&&(b=$.extend(c,{payresult:b.payresult,orderid:b.orderNo,orderpaytype:b.orderpaytype})),"loginResult"==a&&(b=$.extend(c,{loginType:b.loginType,userid:b.userid,loginResult:b.loginResult})),_hmt.push(["_trackCustomEvent",a,b]),console.log("百度统计:",a,b)}var f=a("dist/application/method"),g=window.pageConfig&&window.pageConfig.params,h={fileDetailPageView:{loginstatus:f.getCookie("cuk")?1:0,userid:window.pageConfig&&window.pageConfig.userId||"",pageid:"PC-M-FD",fileid:g&&g.g_fileId,filecategoryname:g&&g.classidName1+"||"+g&&g.classidName2+"||"+g&&g.classidName3,filepaytype:g&&g.productType||"",filecootype:"",fileformat:g&&g.file_format||""},payFileResult:{loginstatus:f.getCookie("cuk")?1:0,userid:window.pageConfig&&window.pageConfig.userId||"",pageid:"PC-M-FD",pagename:"",payresult:"",orderid:"",orderpaytype:"",orderpayprice:"",fileid:"",filename:"",fileprice:"",filecategoryname:"",fileformat:"",filecootype:"",fileuploaderid:""},payVipResult:{loginstatus:f.getCookie("cuk")?1:0,userid:"",pageid:"PC-M-FD",pagename:"",payresult:"",orderid:"",orderpaytype:"",orderpayprice:"",fileid:"",filename:"",fileprice:"",filecategoryname:"",fileformat:"",filecootype:"",fileuploaderid:""},loginResult:{pagename:$("#ip-page-id").val(),pageid:$("#ip-page-name").val(),loginType:"",userid:"",loginResult:""}};return{initBaiduStatistics:d,handleBaiduStatisticsPush:e}}),define("dist/application/method",[],function(require,exports,module){return{keyMap:{ishare_detail_access:"ISHARE_DETAIL_ACCESS",ishare_office_detail_access:"ISHARE_OFFICE_DETAIL_ACCESS"},async:function(a,b,c,d,e){$.ajax(a,{type:d||"post",data:e,async:!1,dataType:"json",headers:{"cache-control":"no-cache",Pragma:"no-cache",Authrization:this.getCookie("cuk")}}).done(function(a){b&&b(a)}).fail(function(a){console.log("error==="+c)})},get:function(a,b,c){$.ajaxSetup({cache:!1}),this.async(a,b,c,"get")},post:function(a,b,c,d,e){this.async(a,b,c,d,e)},postd:function(a,b,c){this.async(a,b,!1,!1,c)},random:function(a,b){return Math.floor(Math.random()*(b-a))+a},setCookieWithExpPath:function(a,b,c,d){var e=new Date;e.setTime(e.getTime()+c),document.cookie=a+"="+escape(b)+";path="+d+";expires="+e.toGMTString()},setCookieWithExp:function(a,b,c,d){var e=new Date;e.setTime(e.getTime()+c),d?document.cookie=a+"="+escape(b)+";path="+d+";expires="+e.toGMTString():document.cookie=a+"="+escape(b)+";expires="+e.toGMTString()},getCookie:function(a){var b=document.cookie.match(new RegExp("(^| )"+a+"=([^;]*)(;|$)"));return null!==b?unescape(b[2]):null},delCookie:function(a,b,c){var d=new Date;d.setTime(d.getTime()-1);var e=this.getCookie(a);null!=e&&(b&&c?document.cookie=a+"= '' ;domain="+c+";expires="+d.toGMTString()+";path="+b:b?document.cookie=a+"= '' ;expires="+d.toGMTString()+";path="+b:document.cookie=a+"="+e+";expires="+d.toGMTString())},getQueryString:function(a){var b=new RegExp("(^|&)"+a+"=([^&]*)(&|$)","i"),c=window.location.search.substr(1).match(b);return null!=c?unescape(c[2]):null},url2Obj:function(a){for(var b={},c=a.split("?"),d=c[1].split("&"),e=0;e<d.length;e++){var f=d[e].split("=");b[f[0]]=f[1]}return b},getParam:function(a){a=a.replace(/[\[]/,"\\[").replace(/[\]]/,"\\]");var b="[\\?&]"+a+"=([^&#]*)",c=new RegExp(b),d=c.exec(window.location.href);return null==d?"":decodeURIComponent(d[1].replace(/\+/g," "))},getLocalData:function(a){try{if(localStorage&&localStorage.getItem){var b=localStorage.getItem(a);return null===b?null:JSON.parse(b)}return console.log("浏览器不支持html localStorage getItem"),null}catch(c){return null}},setLocalData:function(a,b){localStorage&&localStorage.setItem?(localStorage.removeItem(a),localStorage.setItem(a,JSON.stringify(b))):console.log("浏览器不支持html localStorage setItem")},browserType:function(){var a=navigator.userAgent,b=a.indexOf("Opera")>-1;return b?"Opera":a.indexOf("compatible")>-1&&a.indexOf("MSIE")>-1&&!b?"IE":a.indexOf("Edge")>-1?"Edge":a.indexOf("Firefox")>-1?"Firefox":a.indexOf("Safari")>-1&&-1===a.indexOf("Chrome")?"Safari":a.indexOf("Chrome")>-1&&a.indexOf("Safari")>-1?"Chrome":void 0},validateIE9:function(){return!(!$.browser.msie||"9.0"!==$.browser.version&&"8.0"!==$.browser.version&&"7.0"!==$.browser.version&&"6.0"!==$.browser.version)},compareTime:function(a,b){return a&&b?Math.abs((b-a)/1e3/60/60/24):""},changeURLPar:function(url,arg,arg_val){var pattern=arg+"=([^&]*)",replaceText=arg+"="+arg_val;if(url.match(pattern)){var tmp="/("+arg+"=)([^&]*)/gi";return tmp=url.replace(eval(tmp),replaceText)}return url.match("[?]")?url+"&"+replaceText:url+"?"+replaceText},getUrlAllParams:function(a){if("undefined"==typeof a)var b=decodeURI(location.search);else var b="?"+a.split("?")[1];var c=new Object;if(-1!=b.indexOf("?"))for(var d=b.substr(1),e=d.split("&"),f=0;f<e.length;f++)c[e[f].split("=")[0]]=decodeURI(e[f].split("=")[1]);return c},getQueryString:function(a){var b=new RegExp("(^|&)"+a+"=([^&]*)(&|$)","i"),c=window.location.search.substr(1).match(b);return null!=c?unescape(c[2]):null},compatibleIESkip:function(a,b){var c=document.createElement("a");c.href=a,c.style.display="none",b&&(c.target="_blank"),document.body.appendChild(c),c.click()},testEmail:function(a){var b=/^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;return b.test(a)?!0:!1},testPhone:function(a){return/^1(3|4|5|6|7|8|9)\d{9}$/.test(a)?!0:!1},handleRecommendData:function(a){var b=[];return $(a).each(function(a,c){var d={};1==c.type&&(c.linkUrl="/f/"+c.tprId+".html",d=c),2==c.type&&(d=c),3==c.type&&(c.linkUrl="/node/s/"+c.tprId+".html",d=c),b.push(d)}),console.log(b),b},formatDate:function(a){var b={"M+":this.getMonth()+1,"d+":this.getDate(),"h+":this.getHours(),"m+":this.getMinutes(),"s+":this.getSeconds(),"q+":Math.floor((this.getMonth()+3)/3),S:this.getMilliseconds()};/(y+)/.test(a)&&(a=a.replace(RegExp.$1,(this.getFullYear()+"").substr(4-RegExp.$1.length)));for(var c in b)new RegExp("("+c+")").test(a)&&(a=a.replace(RegExp.$1,1==RegExp.$1.length?b[c]:("00"+b[c]).substr((""+b[c]).length)));return a},getReferrer:function(){var a=document.referrer,b="";return/https?\:\/\/[^\s]*so.com.*$/g.test(a)?b="360":/https?\:\/\/[^\s]*baidu.com.*$/g.test(a)?b="baidu":/https?\:\/\/[^\s]*sogou.com.*$/g.test(a)?b="sogou":/https?\:\/\/[^\s]*sm.cn.*$/g.test(a)&&(b="sm"),b},judgeSource:function(a){a||(a={}),a.searchEngine="";var b="";if(b=utils.getQueryVariable("from"),b||(b=sessionStorage.getItem("webWxFrom")||utils.getCookie("webWxFrom")),b)a.source=b,sessionStorage.setItem("webWxFrom",b),sessionStorage.removeItem("webReferrer");else{var c=sessionStorage.getItem("webReferrer")||utils.getCookie("webReferrer");if(c||(c=document.referrer),c){sessionStorage.setItem("webReferrer",c),sessionStorage.removeItem("webWxFrom"),c=c.toLowerCase();for(var d=new Array("google.","baidu.","360.","sogou.","shenma.","bing."),e=new Array("google","baidu","360","sogou","shenma","bing"),f=0,g=d.length;g>f;f++)c.indexOf(d[f])>=0&&(a.source="searchEngine",a.searchEngine=e[f])}c&&a.source||(utils.isWeChatBrow()?a.source="wechat":a.source="outLink")}return a}}}),define("dist/cmd-lib/toast2",[],function(a,b,c){!function(a,b,c){function d(b){this.options={text:"我是toast提示",icon:"",delay:3e3,callback:!1},b&&a.isPlainObject(b)&&a.extend(!0,this.options,b),this.init()}d.prototype.init=function(){var b=this;b.body=a("body"),b.toastWrap=a('<div class="ui-toast" style="position:fixed;min-width:200px;padding:0 10px;height:60px;line-height:60px;text-align:center;background:#000;opacity:0.8;filter:alpha(opacity=80);top:50%;left:50%;border-radius:4px;z-index:99999999">'),b.toastIcon=a('<i class="icon"></i>'),b.toastText=a('<span class="ui-toast-text" style="color:#fff">'+b.options.text+"</span>"),b._creatDom(),b.show(),b.hide()},d.prototype._creatDom=function(){var a=this;a.options.icon&&a.toastWrap.append(a.toastIcon.addClass(a.options.icon)),a.toastWrap.append(a.toastText),a.body.append(a.toastWrap)},d.prototype.show=function(){var a=this;setTimeout(function(){a.toastWrap.removeClass("hide").addClass("show")},50)},d.prototype.hide=function(){var a=this;setTimeout(function(){a.toastWrap.removeClass("show").addClass("hide"),a.toastWrap.remove(),a.options.callback&&a.options.callback()},a.options.delay)},a.toast=function(a){return new d(a)}}($,window,document)}),define("dist/application/api",["dist/application/urlConfig"],function(a,b,c){var d=a("dist/application/urlConfig"),e=d.ajaxUrl+"/gateway/pc",f=d.ajaxUrl+"/gateway";c.exports={user:{loginByPsodOrVerCode:f+"/cas/login/authorize",getLoginQrcode:f+"/cas/login/qrcode",loginByWeChat:f+"/cas/login/gzhScan",getUserInfo:"/node/api/getUserInfo",thirdLoginRedirect:f+"/cas/login/redirect",loginOut:f+"/cas/login/logout",newCollect:f+"/content/collect/getUserFileList",addFeedback:f+"/feedback/addFeedback",getFeedbackType:f+"/feedback/getFeedbackType",sendSms:f+"/cas/sms/sendSms",queryBindInfo:f+"/cas/user/queryBindInfo",thirdCodelogin:f+"/cas/login/thirdCode",userBindMobile:f+"/cas/user/bindMobile",checkIdentity:f+"/cas/sms/checkIdentity",userBindThird:f+"/cas/user/bindThird",untyingThird:f+"/cas/user/untyingThird",setUpPassword:f+"/cas/user/setUpPassword",getUserCentreInfo:f+"/user/getUserCentreInfo",editUser:f+"/user/editUser",getFileBrowsePage:f+"/content/fileBrowse/getFileBrowsePage",getDownloadRecordList:f+"/content/getDownloadRecordList",getUserFileList:f+"/content/collect/getUserFileList",getMyUploadPage:f+"/content/getMyUploadPage",getOtherUser:f+"/user/getOthersCentreInfo",getSearchList:f+"/search/content/byCondition",getVisitorId:f+"/user/getVisitorId"},normalFileDetail:{filePreDownLoad:f+"/content/getPreFileDownUrl",getFileDownLoadUrl:f+"/content/getFileDownUrl",getPrePageInfo:f+"/content/file/getPrePageInfo",sendmail:f+"/content/sendmail/findFile",getFileDetailNoTdk:f+"/content/getFileDetailNoTdk"},officeFileDetail:{},search:{specialTopic:f+"/search/specialTopic/lisPage"},sms:{sendCorpusDownloadMail:f+"/content/fileSendEmail/sendCorpusDownloadMail"},pay:{bindUser:f+"/order/bind/loginUser",scanOrderInfo:f+"/order/scan/orderInfo"},coupon:{rightsSaleVouchers:f+"/rights/sale/vouchers",rightsSaleQueryPersonal:f+"/rights/sale/queryPersonal",querySeniority:f+"/rights/sale/querySeniority",queryUsing:f+"/rights/sale/queryUsing",getMemberPointRecord:f+"/rights/vip/getMemberPointRecord",getBuyRecord:f+"/rights/vip/getBuyRecord"},order:{bindOrderByOrderNo:f+"/order/bind/byOrderNo",unloginOrderDown:e+"/order/unloginOrderDown",createOrderInfo:f+"/order/create/orderInfo",rightsVipGetUserMember:f+"/rights/vip/getUserMember",getOrderStatus:f+"/order/get/orderStatus",queryOrderlistByCondition:f+"/order/query/listByCondition",getOrderInfo:f+"/order/get/orderInfo"},getHotSearch:f+"/cms/search/content/hotWords",special:{fileSaveOrupdate:f+"/comment/collect/fileSaveOrupdate",getCollectState:f+"/comment/zc/getUserFileZcState",setCollect:f+"/content/collect/file"},upload:{getCategory:f+"/content/category/getSimplenessInfo",createFolder:f+"/content/saveUserFolder",getFolder:f+"/content/getUserFolders",saveUploadFile:f+"/content/webUploadFile",batchDeleteUserFile:f+"/content/batchDeleteUserFile"},recommend:{recommendConfigInfo:f+"/recommend/config/info",recommendConfigRuleInfo:f+"/recommend/config/ruleInfo"},reportBrowse:{fileBrowseReportBrowse:f+"/content/fileBrowse/reportBrowse"},mywallet:{getAccountBalance:f+"/account/balance/getGrossIncome",withdrawal:f+"/account/with/apply",getWithdrawalRecord:f+"/account/withd/getPersonList",editFinanceAccount:f+"/account/finance/edit",getFinanceAccountInfo:f+"/account/finance/getInfo",getPersonalAccountTax:f+"/account/tax/getPersonal",getPersonalAccountTax:f+"/account/tax/getPersonal",getMyWalletList:f+"/settlement/settle/getMyWalletList",exportMyWalletDetail:f+"/settlement/settle/exportMyWalletDetail"},authentication:{getInstitutions:f+"/user/certification/getInstitutions",institutions:f+"/user/certification/institutions",getPersonalCertification:f+"/gateway/user/certification/getPersonal",personalCertification:f+"/gateway/user/certification/personal"},seo:{listContentInfos:f+"/seo/exposeContent/contentInfo/listContentInfos"},wechat:{getWechatSignature:f+"/message/wechat/info/getWechatSignature"}}}),define("dist/application/urlConfig",[],function(a,b,c){var d=window.env,e={debug:{ajaxUrl:"http://192.168.100.222:3004",payUrl:"http://open-ishare.iask.com.cn",loginUrl:"",upload:"http://upload.ishare.iask.com/ishare-upload/picUploadCatalog",appId:"wxb8af2801b7be4c37"},local:{ajaxUrl:"http://192.168.100.222:3004",payUrl:"http://dev-open-ishare.iask.com.cn",loginUrl:"",upload:"http://dev-upload.ishare.iask.com/ishare-upload/picUploadCatalog",appId:"wxb8af2801b7be4c37"},dev:{ajaxUrl:"",payUrl:"http://dev-open-ishare.iask.com.cn",loginUrl:"",upload:"http://dev-upload.ishare.iask.com/ishare-upload/picUploadCatalog",appId:"wxb8af2801b7be4c37"},test:{ajaxUrl:"",payUrl:"http://test-open-ishare.iask.com.cn",loginUrl:"",upload:"http://test-upload.ishare.iask.com/ishare-upload/picUploadCatalog",appId:"wxb8af2801b7be4c37"},pre:{ajaxUrl:"",payUrl:"http://pre-open-ishare.iask.com.cn",loginUrl:"",upload:"http://pre-upload.ishare.iask.com/ishare-upload/picUploadCatalog",appId:"wxca8532521e94faf4"},prod:{ajaxUrl:"",payUrl:"http://open-ishare.iask.com.cn",loginUrl:"",upload:"http://upload.ishare.iask.com/ishare-upload/picUploadCatalog",appId:"wxca8532521e94faf4"}};return e[d]}),define("dist/pay/payRestult.html",[],' <div class="payment-title">\n       {{ if orderInfo.orderStatus == 2}}\n        <span class="payment-title-icon success"></span>\n        <span class="payment-title-desc">支付成功</span>\n        {{/if}}\n        {{ if orderInfo.orderStatus == 3}}\n        <span class="payment-title-icon error"></span>\n        <span class="payment-title-desc">支付失败</span>\n        {{/if}}\n    </div>\n    <ul class="order-list">\n        <li class="list-item">\n            <span class="item-title">支付方式:</span>\n            {{ if orderInfo.payType == \'wechat\'}}\n                <span class="item-desc">微信支付</span>\n            {{/if}}\n             {{ if orderInfo.payType == \'alipay\'}}\n                <span class="item-desc">支付宝支付</span>\n            {{/if}}\n        </li>\n        <li class="list-item">\n            <span class="item-title">订单金额:</span>\n            <span class="item-desc">¥ {{orderInfo.payPrice}}</span>\n        </li>\n        <li class="list-item orderTime">\n            <span class="item-title">创建时间:</span>\n            <span class="item-desc">{{orderInfo.orderTime}}</span>\n        </li>\n         <li class="list-item">\n            <span class="item-title">交易订单号:</span>\n            <span class="item-desc">{{orderInfo.payNo}}</span>\n        </li>\n          <li class="list-item">\n            <span class="item-title">商户订单号:</span>\n            <span class="item-desc">{{orderInfo.orderNo}}</span>\n        </li>\n         <li class="list-item">\n            <span class="item-title">商品名称:</span>\n            <span class="item-desc">{{orderInfo.goodsName}}</span>\n        </li>\n</ul> \n\n\n\n'),define("dist/pay/go2MinApp",["dist/cmd-lib/util","dist/application/api","dist/application/urlConfig","dist/cmd-lib/toast2"],function(a,b,c){function d(){$.ajax({type:"post",url:g.wechat.getWechatSignature,contentType:"application/json;charset=utf-8",dataType:"json",data:JSON.stringify({appId:h.appId,url:window.location.href}),success:function(a){console.log("getWechatSignature:",a),0==a.code?e(a.data):$.toast({text:a.msg,delay:2e3})},error:function(a){console.log("getWechatSignature:",a),$.toast({text:a.msg||"getWechatSignature错误",delay:3e3})}})}function e(a){console.log("wxAPI:",wx),wx.config({debug:!1,appId:a.appId,timestamp:a.timestamp,nonceStr:a.nonceStr,signature:a.signature,jsApiList:["onMenuShareTimeline"],openTagList:["wx-open-launch-weapp"]}),wx.ready(function(){console.log("微信信息验证")}),wx.error(function(a){console.log("微信回调:",a)})}var f=a("dist/cmd-lib/util"),g=a("dist/application/api"),h=a("dist/application/urlConfig");a("dist/cmd-lib/toast2"),f.isWeChatBrow()&&d()}),define("dist/cmd-lib/util",[],function(a,b,c){var d={throttle:function(a,b){var c,d;return function(e){var f=this,g=arguments,h=+new Date;c&&c+b>h?(clearTimeout(d),d=setTimeout(function(){c=h,a.apply(f,g)},b)):(c=h,a.apply(f,g))}},debounce:function(a,b){var c=0,d=this;return function(e){c&&clearTimeout(c),c=setTimeout(function(){a.apply(d,e)},b)}},isWeChatBrow:function(){var a=navigator.userAgent.toLowerCase(),b=-1!=a.indexOf("micromessenger");return b?!0:!1},getWebAppUA:function(){var a=0,b=navigator.userAgent.toLowerCase();return/iphone|ipad|ipod/.test(b)?a=1:/android/.test(b)&&(a=0),a},validateIE8:function(){return!$.browser.msie||"8.0"!=$.browser.version&&"7.0"!=$.browser.version&&"6.0"!=$.browser.version?!1:!0},validateIE9:function(){return!$.browser.msie||"9.0"!=$.browser.version&&"8.0"!=$.browser.version&&"7.0"!=$.browser.version&&"6.0"!=$.browser.version?!1:!0},getReferrer:function(){var a=document.referrer,b="";return/https?\:\/\/[^\s]*wenku.so.com.*$/g.test(a)?b="360wenku":/https?\:\/\/[^\s]*so.com.*$/g.test(a)?b="360":/https?\:\/\/[^\s]*baidu.com.*$/g.test(a)?b="baidu":/https?\:\/\/[^\s]*sogou.com.*$/g.test(a)?b="sogou":/https?\:\/\/[^\s]*sm.cn.*$/g.test(a)?b="sm":/https?\:\/\/[^\s]*ishare.iask.sina.com.cn.*$/g.test(a)?b="ishare":/https?\:\/\/[^\s]*iask.sina.com.cn.*$/g.test(a)&&(b="iask"),b},getPageRef:function(a){var b=this,c=0;return(b.is360cookie(a)||b.is360cookie("360"))&&(c=1),b.is360wkCookie()&&(c=3),c},is360cookie:function(a){var b=this,c=b.getCookie("_r_so");if(c)for(var d=c.split("_"),e=0;e<d.length;e++)if(d[e]==a)return!0;return!1},add360wkCookie:function(){this.setCookieWithExpPath("_360hz","1",18e5,"/")},is360wkCookie:function(){return null==getCookie("_360hz")?!1:!0},getCookie:function(a){var b=document.cookie.match(new RegExp("(^| )"+a+"=([^;]*)(;|$)"));return null!==b?unescape(b[2]):null},setCookieWithExpPath:function(a,b,c,d){var e=new Date;e.setTime(e.getTime()+c),document.cookie=a+"="+escape(b)+";path="+d+";expires="+e.toGMTString()},findRefer:function(){var a=document.referrer,b="other";return/https?\:\/\/[^\s]*\/f\/.*$/g.test(a)?b="pindex":/https?\:\/\/[^\s]*\/d\/.*$/g.test(a)?b="landing":/https?\:\/\/[^\s]*\/c\/.*$/g.test(a)?b="pcat":/https?\:\/\/[^\s]*\/search\/.*$/g.test(a)?b="psearch":/https?\:\/\/[^\s]*\/t\/.*$/g.test(a)?b="ptag":/https?\:\/\/[^\s]*\/[u|n]\/.*$/g.test(a)?b="popenuser":/https?\:\/\/[^\s]*\/ucenter\/.*$/g.test(a)?b="puser":/https?\:\/\/[^\s]*ishare.iask.sina.com.cn.$/g.test(a)?b="ishareindex":/https?\:\/\/[^\s]*\/theme\/.*$/g.test(a)?b="theme":/https?\:\/\/[^\s]*wenku.so.com.*$/g.test(a)?b="360wenku":/https?\:\/\/[^\s]*so.com.*$/g.test(a)?b="360":/https?\:\/\/[^\s]*baidu.com.*$/g.test(a)?b="baidu":/https?\:\/\/[^\s]*sogou.com.*$/g.test(a)?b="sogou":/https?\:\/\/[^\s]*sm.cn.*$/g.test(a)?b="sm":/https?\:\/\/[^\s]*ishare.iask.sina.com.cn.*$/g.test(a)?b="ishare":/https?\:\/\/[^\s]*iask.sina.com.cn.*$/g.test(a)&&(b="iask"),b},showAlertDialog:function(a,b,c){var d=$(".common-bgMask"),e=$(".common-dialog");e.find("h2[name='title']").text(a),e.find("span[name='content']").html(b),e.find("a.close,a.btn-dialog").unbind("click").click(function(){d.hide(),e.hide(),c&&!$(this).hasClass("close")&&c()}),d.show(),e.show()},browserVersion:function(a){var b=a.indexOf("Opera")>-1,c=a.indexOf("compatible")>-1&&a.indexOf("MSIE")>-1&&!b,d=a.indexOf("Edge")>-1,e=a.indexOf("Firefox")>-1,f=a.indexOf("Safari")>-1&&-1===a.indexOf("Chrome"),g=a.indexOf("Chrome")>-1&&a.indexOf("Safari")>-1;if(c){var h=new RegExp("MSIE (\\d+\\.\\d+);");h.test(a);var i=parseFloat(RegExp.$1);return 7===i?"IE7":8===i?"IE8":9===i?"IE9":10===i?"IE10":11===i?"IE11":12===i?"IE12":"IE"}return b?"Opera":d?"Edge":e?"Firefox":f?"Safari":g?"Chrome":"unKnow"},getBrowserInfo:function(a){var b={},c=a.toLowerCase(),d=/(msie|firefox|chrome|opera|version|trident).*?([\d.]+)/,e=c.match(d);return e&&e.length>=2?(b.browser=e[1].replace(/version/,"'safari")||"unknow",b.ver=e[2]||"1.0.0"):(b.browser="unknow",b.ver="1.0.0"),b.browser+"/"+b.ver},timeFormat:function(a,b){if(!b)return"";var c=new Date(b),d=c.getFullYear(),e=c.getMonth()+1,f=c.getDate(),g=c.getHours(),h=c.getMinutes(),i=c.getSeconds();return 10>e&&(e+="0"),10>f&&(f+="0"),10>g&&(g+="0"),10>h&&(h+="0"),10>i&&(i+="0"),"yyyy-mm-dd"===a?d+"-"+e+"-"+f:d+"-"+e+"-"+f+" "+g+":"+h+":"+i}};c.exports=d});