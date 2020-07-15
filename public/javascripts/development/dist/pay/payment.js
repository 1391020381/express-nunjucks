/*! ishare_pc_website
*author:Jersey */
define("dist/pay/payment",["../cmd-lib/toast","../common/baidu-statistics","../application/method","../application/api"],function(a,b,c){function d(){$.ajax({url:h.pay.scanOrderInfo,type:"POST",data:JSON.stringify({orderNo:k,code:j,payType:"true"==m?"wechat":"alipay",host:location.origin}),contentType:"application/json; charset=utf-8",dataType:"json",success:function(a){if(console.log("scanOrderInfo:",a),"0"==a.code){var b=(i.getParam("payPrice")/100).toFixed(2),c=i.getParam("goodsName");if(b&&$(".pay-price .price").text(b),c&$(".goodsName").text(c),a.data.needRedirect)return void(location.href=a.data.returnUrl);"true"==m?e(a.data.appId,a.data.timeStamp,a.data.nonceStr,a.data.prepayId,a.data.paySign):"true"==n&&f(a.data.aliPayUrl)}else $.toast({text:a.msg||"scanOrderInfo错误",delay:3e3})},error:function(a){console.log("scanOrderInfo:",a)}})}function e(a,b,c,d,e){function f(){WeixinJSBridge.invoke("getBrandWCPayRequest",{appId:a,timeStamp:b,nonceStr:c,"package":"prepay_id="+d,signType:"MD5",paySign:e},function(a){console.log("wechatPay:",a),"get_brand_wcpay_request:ok"==a.err_msg?(8==l&&o("payFileResult",{payresult:1,orderid:k,orderpaytype:"wechat"}),(10==l||13==l)&&o("payVipResult",{payresult:1,orderid:k,orderpaytype:"wechat"}),g(k)):"get_brand_wcpay_request:fail"==a.err_msg&&(8==l&&o("payFileResult",{payresult:0,orderid:k,orderpaytype:"wechat"}),(10==l||13==l)&&o("payVipResult",{payresult:0,orderid:k,orderpaytype:"wechat"}),$.toast({text:"支付失败",delay:3e3}),g(k))})}"undefined"==typeof WeixinJSBridge?document.addEventListener?document.addEventListener("WeixinJSBridgeReady",f,!1):document.attachEvent&&(document.attachEvent("WeixinJSBridgeReady",f),document.attachEvent("onWeixinJSBridgeReady",f)):f()}function f(a){$(".payment").html(a),$("form").attr("target","_blank")}function g(a){location.href=location.origin+"/pay/paymentresult?orderNo="+a}a("../cmd-lib/toast"),a("../common/baidu-statistics").initBaiduStatistics("17cdd3f409f282dc0eeb3785fcf78a66");var h=a("../application/api"),i=a("../application/method"),j=i.getParam("code"),k=i.getParam("orderNo"),l=i.getParam("checkStatus"),m=window.pageConfig.page&&window.pageConfig.page.isWeChat,n=window.pageConfig.page&&window.pageConfig.page.isAliPay,o=a("../common/baidu-statistics").handleBaiduStatisticsPush;console.log("scanOrderInfo-start"),d(),$(document).on("click",".pay-confirm",function(a){console.log("pay-confirm"),d()})}),define("dist/cmd-lib/toast",[],function(a,b,c){!function(a,b,c){function d(b){this.options={text:"我是toast提示",icon:"",delay:3e3,callback:!1},b&&a.isPlainObject(b)&&a.extend(!0,this.options,b),this.init()}d.prototype.init=function(){var b=this;b.body=a("body"),b.toastWrap=a('<div class="ui-toast" style="position:fixed;width:200px;height:60px;line-height:60px;text-align:center;background:#000;opacity:0.8;filter:alpha(opacity=80);top:40%;left:50%;margin-left:-100px;margin-top:-30px;border-radius:4px;z-index:10000">'),b.toastIcon=a('<i class="icon"></i>'),b.toastText=a('<span class="ui-toast-text" style="color:#fff">'+b.options.text+"</span>"),b._creatDom(),b.show(),b.hide()},d.prototype._creatDom=function(){var a=this;a.options.icon&&a.toastWrap.append(a.toastIcon.addClass(a.options.icon)),a.toastWrap.append(a.toastText),a.body.append(a.toastWrap)},d.prototype.show=function(){var a=this;setTimeout(function(){a.toastWrap.removeClass("hide").addClass("show")},50)},d.prototype.hide=function(){var a=this;setTimeout(function(){a.toastWrap.removeClass("show").addClass("hide"),a.toastWrap.remove(),a.options.callback&&a.options.callback()},a.options.delay)},a.toast=function(a){return new d(a)}}($,window,document)});var _hmt=_hmt||[];define("dist/common/baidu-statistics",["dist/application/method"],function(a,b,c){function d(a){if(a)try{!function(){var b=document.createElement("script");b.src="//hm.baidu.com/hm.js?"+a;var c=document.getElementsByTagName("script")[0];c.parentNode.insertBefore(b,c)}()}catch(b){console.error(a,b)}}function e(a,b){var c=h[a];"fileDetailPageView"==a&&(b=c),"payFileResult"==a&&(b=$.extend(c,{payresult:b.payresult,orderid:b.orderNo,orderpaytype:b.orderpaytype})),"payVipResult"==a&&(b=$.extend(c,{payresult:b.payresult,orderid:b.orderNo,orderpaytype:b.orderpaytype})),_hmt.push(["_trackCustomEvent",a,b]),console.log("百度统计:",a,b)}var f=a("dist/application/method"),g=window.pageConfig.params,h={fileDetailPageView:{loginstatus:f.getCookie("cuk")?1:0,userid:window.pageConfig.userId||"",pageid:"PC-M-FD",fileid:g&&g.g_fileId,filecategoryname:g&&g.classidName1+"||"+g&&g.classidName2+"||"+g&&g.classidName3,filepaytype:g&&g.productType||"",filecootype:"",fileformat:g&&g.file_format||""},payFileResult:{loginstatus:f.getCookie("cuk")?1:0,userid:window.pageConfig.userId||"",pageid:"PC-M-FD",pagename:"",payresult:"",orderid:"",orderpaytype:"",orderpayprice:"",fileid:"",filename:"",fileprice:"",filecategoryname:"",fileformat:"",filecootype:"",fileuploaderid:""},payVipResult:{loginstatus:f.getCookie("cuk")?1:0,userid:"",pageid:"PC-M-FD",pagename:"",payresult:"",orderid:"",orderpaytype:"",orderpayprice:"",fileid:"",filename:"",fileprice:"",filecategoryname:"",fileformat:"",filecootype:"",fileuploaderid:""}};return{initBaiduStatistics:d,handleBaiduStatisticsPush:e}}),define("dist/application/method",[],function(require,exports,module){return{keyMap:{ishare_detail_access:"ISHARE_DETAIL_ACCESS",ishare_office_detail_access:"ISHARE_OFFICE_DETAIL_ACCESS"},async:function(a,b,c,d,e){$.ajax(a,{type:d||"post",data:e,async:!1,dataType:"json",headers:{"cache-control":"no-cache",Pragma:"no-cache"}}).done(function(a){b&&b(a)}).fail(function(a){console.log("error==="+c)})},get:function(a,b,c){$.ajaxSetup({cache:!1}),this.async(a,b,c,"get")},post:function(a,b,c,d,e){this.async(a,b,c,d,e)},postd:function(a,b,c){this.async(a,b,!1,!1,c)},random:function(a,b){return Math.floor(Math.random()*(b-a))+a},setCookieWithExpPath:function(a,b,c,d){var e=new Date;e.setTime(e.getTime()+c),document.cookie=a+"="+escape(b)+";path="+d+";expires="+e.toGMTString()},setCookieWithExp:function(a,b,c,d){var e=new Date;e.setTime(e.getTime()+c),d?document.cookie=a+"="+escape(b)+";path="+d+";expires="+e.toGMTString():document.cookie=a+"="+escape(b)+";expires="+e.toGMTString()},getCookie:function(a){var b=document.cookie.match(new RegExp("(^| )"+a+"=([^;]*)(;|$)"));return null!==b?unescape(b[2]):null},delCookie:function(a,b,c){var d=new Date;d.setTime(d.getTime()-1);var e=this.getCookie(a);null!=e&&(b&&c?document.cookie=a+"= '' ;domain="+c+";expires="+d.toGMTString()+";path="+b:b?document.cookie=a+"= '' ;expires="+d.toGMTString()+";path="+b:document.cookie=a+"="+e+";expires="+d.toGMTString())},getQueryString:function(a){var b=new RegExp("(^|&)"+a+"=([^&]*)(&|$)","i"),c=window.location.search.substr(1).match(b);return null!=c?unescape(c[2]):null},url2Obj:function(a){for(var b={},c=a.split("?"),d=c[1].split("&"),e=0;e<d.length;e++){var f=d[e].split("=");b[f[0]]=f[1]}return b},getParam:function(a){a=a.replace(/[\[]/,"\\[").replace(/[\]]/,"\\]");var b="[\\?&]"+a+"=([^&#]*)",c=new RegExp(b),d=c.exec(window.location.href);return null==d?"":decodeURIComponent(d[1].replace(/\+/g," "))},getLocalData:function(a){try{if(localStorage&&localStorage.getItem){var b=localStorage.getItem(a);return null===b?null:JSON.parse(b)}return console.log("浏览器不支持html localStorage getItem"),null}catch(c){return null}},setLocalData:function(a,b){localStorage&&localStorage.setItem?(localStorage.removeItem(a),localStorage.setItem(a,JSON.stringify(b))):console.log("浏览器不支持html localStorage setItem")},browserType:function(){var a=navigator.userAgent,b=a.indexOf("Opera")>-1;return b?"Opera":a.indexOf("compatible")>-1&&a.indexOf("MSIE")>-1&&!b?"IE":a.indexOf("Edge")>-1?"Edge":a.indexOf("Firefox")>-1?"Firefox":a.indexOf("Safari")>-1&&-1===a.indexOf("Chrome")?"Safari":a.indexOf("Chrome")>-1&&a.indexOf("Safari")>-1?"Chrome":void 0},validateIE9:function(){return!(!$.browser.msie||"9.0"!==$.browser.version&&"8.0"!==$.browser.version&&"7.0"!==$.browser.version&&"6.0"!==$.browser.version)},compareTime:function(a,b){return a&&b?Math.abs((b-a)/1e3/60/60/24):""},changeURLPar:function(url,arg,arg_val){var pattern=arg+"=([^&]*)",replaceText=arg+"="+arg_val;if(url.match(pattern)){var tmp="/("+arg+"=)([^&]*)/gi";return tmp=url.replace(eval(tmp),replaceText)}return url.match("[?]")?url+"&"+replaceText:url+"?"+replaceText},getUrlAllParams:function(a){if("undefined"==typeof a)var b=decodeURI(location.search);else var b="?"+a.split("?")[1];var c=new Object;if(-1!=b.indexOf("?"))for(var d=b.substr(1),e=d.split("&"),f=0;f<e.length;f++)c[e[f].split("=")[0]]=decodeURI(e[f].split("=")[1]);return c},getQueryString:function(a){var b=new RegExp("(^|&)"+a+"=([^&]*)(&|$)","i"),c=window.location.search.substr(1).match(b);return null!=c?unescape(c[2]):null},compatibleIESkip:function(a,b){var c=document.createElement("a");c.href=a,c.style.display="none",b&&(c.target="_blank"),document.body.appendChild(c),c.click()},testEmail:function(a){var b=/^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;return b.test(a)?!0:!1},testPhone:function(a){return/^1(3|4|5|7|8)\d{9}$/.test(a)?!0:!1},handleRecommendData:function(a){var b=[];return $(a).each(function(a,c){var d={};1==c.type&&(c.linkUrl="/f/"+c.tprId+".html",d=c),2==c.type&&(d=c),3==c.type&&(c.linkUrl="/node/s/"+c.tprId+".html",d=c),b.push(d)}),console.log(b),b},formatDate:function(a){var b={"M+":this.getMonth()+1,"d+":this.getDate(),"h+":this.getHours(),"m+":this.getMinutes(),"s+":this.getSeconds(),"q+":Math.floor((this.getMonth()+3)/3),S:this.getMilliseconds()};/(y+)/.test(a)&&(a=a.replace(RegExp.$1,(this.getFullYear()+"").substr(4-RegExp.$1.length)));for(var c in b)new RegExp("("+c+")").test(a)&&(a=a.replace(RegExp.$1,1==RegExp.$1.length?b[c]:("00"+b[c]).substr((""+b[c]).length)));return a}}}),define("dist/application/api",[],function(a,b,c){var d="/gateway/pc",e="/gateway";c.exports={user:{getUserInfo:"/node/api/getUserInfo",login:d+"/usermanage/checkLogin",loginOut:e+"/pc/usermanage/logout",collect:d+"/usermanage/collect",newCollect:e+"/content/collect/getUserFileList",getJessionId:d+"/usermanage/getJessionId",getSessionInfo:d+"/usermanage/getSessionInfo",addFeedback:e+"/feedback/addFeedback",getFeedbackType:e+"/feedback/getFeedbackType",sendSms:e+"/cas/sms/sendSms",queryBindInfo:e+"/cas/user/queryBindInfo",thirdCodelogin:e+"/cas/login/thirdCode",userBindMobile:e+"/cas/user/bindMobile",checkIdentity:e+"/cas/sms/checkIdentity",userBindThird:e+"/cas/user/bindThird",untyingThird:e+"/cas/user/untyingThird",setUpPassword:e+"/cas/user/setUpPassword",getUserCentreInfo:e+"/user/getUserCentreInfo",editUser:e+"/user/editUser",getFileBrowsePage:e+"/content/fileBrowse/getFileBrowsePage",getDownloadRecordList:e+"/content/getDownloadRecordList",getUserFileList:e+"/content/collect/getUserFileList",getMyUploadPage:e+"/content/getMyUploadPage",getOtherUser:e+"/user/getOthersCentreInfo",getSearchList:e+"/search/content/byCondition"},normalFileDetail:{addComment:d+"/fileSync/addComment",reportContent:d+"/fileSync/addFeedback",isStore:d+"/fileSync/getFileCollect",collect:d+"/fileSync/collect",filePreDownLoad:e+"/content/getPreFileDownUrl",fileDownLoad:d+"/action/downloadUrl",getFileDownLoadUrl:e+"/content/getFileDownUrl",appraise:d+"/fileSync/appraise",getPrePageInfo:d+"/fileSync/prePageInfo",hasDownLoad:d+"/fileSync/isDownload"},officeFileDetail:{},search:{byPosition:d+"/operating/byPosition",specialTopic:e+"/search/specialTopic/lisPage"},sms:{getCaptcha:d+"/usermanage/getSmsYzCode",sendCorpusDownloadMail:e+"/content/fileSendEmail/sendCorpusDownloadMail"},pay:{successBuyDownLoad:d+"/action/downloadNow",bindUser:d+"/order/bindUser",scanOrderInfo:e+"/order/scan/orderInfo"},coupon:{rightsSaleVouchers:e+"/rights/sale/vouchers",rightsSaleQueryPersonal:e+"/rights/sale/queryPersonal",querySeniority:e+"/rights/sale/querySeniority",queryUsing:e+"/rights/sale/queryUsing",getMemberPointRecord:e+"/rights/vip/getMemberPointRecord",getBuyRecord:e+"/rights/vip/getBuyRecord"},order:{bindOrderByOrderNo:d+"/order/bindOrderByOrderNo",unloginOrderDown:d+"/order/unloginOrderDown",createOrderInfo:e+"/order/create/orderInfo",rightsVipGetUserMember:e+"/rights/vip/getUserMember",getOrderStatus:e+"/order/get/orderStatus",queryOrderlistByCondition:e+"/order/query/listByCondition",getOrderInfo:e+"/order/get/orderInfo"},getHotSearch:d+"/search/getHotSearch",special:{fileSaveOrupdate:e+"/comment/collect/fileSaveOrupdate",getCollectState:e+"/comment/zc/getUserFileZcState",setCollect:e+"/content/collect/file"},upload:{getCategory:e+"/content/category/getSimplenessInfo",createFolder:e+"/content/saveUserFolder",getFolder:e+"/content/getUserFolders",saveUploadFile:e+"/content/webUploadFile",batchDeleteUserFile:e+"/content/batchDeleteUserFile"},recommend:{recommendConfigInfo:e+"/recommend/config/info",recommendConfigRuleInfo:e+"/recommend/config/ruleInfo"},reportBrowse:{fileBrowseReportBrowse:e+"/content/fileBrowse/reportBrowse"}}});