/*! ishare_pc_website
*author:Jersey */

define("dist/pay/paymentResult",["../common/baidu-statistics","../application/method","../cmd-lib/toast2","../application/api","../application/urlConfig","./payRestult.html"],function(a){function b(){$.ajax({url:d.order.getOrderInfo,type:"POST",data:JSON.stringify({orderNo:f}),contentType:"application/json; charset=utf-8",dataType:"json",success:function(a){console.log("getOrderInfo:",a);var b=e.formatDate;if(Date.prototype.format=b,"0"==a.code){a.data.payPrice=(a.data.payPrice/100).toFixed(2),a.data.orderTime=new Date(a.data.orderTime).format("yyyy-MM-dd");var d=template.compile(g)({orderInfo:a.data});$(".payment .payment-content").html(d),1==a.data.goodsType&&h("payFileResult",{payresult:1,orderid:f,orderpaytype:a.data.payType}),2==a.data.goodsType&&h("payVipResult",{payresult:1,orderid:f,orderpaytype:a.data.payType})}else{$.toast({text:a.message,delay:3e3});var i=location.href,j=JSON.stringify({orderNo:f})+JSON.stringify(data.message);c(i,j)}},error:function(a){console.log("getOrderInfo:",a);var b=location.href,d=JSON.stringify({orderNo:f})+JSON.stringify(a);c(b,d)}})}function c(a,b){$.ajax({type:"post",url:d.order.reportOrderError,headers:{Authrization:e.getCookie("cuk")},contentType:"application/json;charset=utf-8",data:JSON.stringify({url:a,message:b,userId:f}),success:function(a){console.log("reportOrderError:",a)},complete:function(){console.log("请求完成")}})}console.log("聚合支付码"),a("../common/baidu-statistics").initBaiduStatistics("17cdd3f409f282dc0eeb3785fcf78a66"),a("../cmd-lib/toast2");var d=a("../application/api"),e=a("../application/method"),f=e.getParam("orderNo"),g=a("./payRestult.html"),h=a("../common/baidu-statistics").handleBaiduStatisticsPush;b(),$(document).on("click",".btn-wrap",function(){console.log("重新支付"),$.toast({text:"请重新扫码支付",delay:3e3})})});var _hmt=_hmt||[];define("dist/common/baidu-statistics",["dist/application/method"],function(a,b,c){function d(a){if(a){_hmt.push(["_setAccount",a]);for(var b in _hmt.cmd){if(b==a)return;try{!function(){var b=document.createElement("script");b.src="https://hm.baidu.com/hm.js?"+a;var c=document.getElementsByTagName("script")[0];c.parentNode.insertBefore(b,c)}()}catch(c){console.error(a,c)}}}}function e(a,b){var c=h[a];"fileDetailPageView"==a&&(b=c),"payFileResult"==a&&(b=$.extend(c,{payresult:b.payresult,orderid:b.orderNo,orderpaytype:b.orderpaytype})),_hmt.push(["_trackCustomEvent",a,b]),console.log("百度统计:",a,b)}var f=a("dist/application/method"),g=window.pageConfig&&window.pageConfig.params,h={fileDetailPageView:{loginstatus:f.getCookie("cuk")?1:0,userid:window.pageConfig&&window.pageConfig.userId||"",pageid:"PC-M-FD",fileid:g&&g.g_fileId,filecategoryname:g&&g.classidName1+"||"+g&&g.classidName2+"||"+g&&g.classidName3,filepaytype:g&&g.productType||"",filecootype:"",fileformat:g&&g.file_format||""},payFileResult:{loginstatus:f.getCookie("cuk")?1:0,userid:window.pageConfig&&window.pageConfig.userId||"",pageid:"PC-M-FD",pagename:"",payresult:"",orderid:"",orderpaytype:"",orderpayprice:"",fileid:"",filename:"",fileprice:"",filecategoryname:"",fileformat:"",filecootype:"",fileuploaderid:""},payVipResult:{loginstatus:f.getCookie("cuk")?1:0,userid:"",pageid:"PC-M-FD",pagename:"",payresult:"",orderid:"",orderpaytype:"",orderpayprice:"",fileid:"",filename:"",fileprice:"",filecategoryname:"",fileformat:"",filecootype:"",fileuploaderid:""},loginResult:{pagename:$("#ip-page-id").val(),pageid:$("#ip-page-name").val(),loginType:"",userid:"",loginResult:""}};return{initBaiduStatistics:d,handleBaiduStatisticsPush:e}}),define("dist/application/method",[],function(require,exports,module){return{keyMap:{ishare_detail_access:"ISHARE_DETAIL_ACCESS",ishare_office_detail_access:"ISHARE_OFFICE_DETAIL_ACCESS"},async:function(a,b,c,d,e){$.ajax(a,{type:d||"post",data:e,async:!1,dataType:"json",headers:{"cache-control":"no-cache",Pragma:"no-cache",Authrization:this.getCookie("cuk")}}).done(function(a){b&&b(a)}).fail(function(a){console.log("error==="+c)})},get:function(a,b,c){$.ajaxSetup({cache:!1}),this.async(a,b,c,"get")},post:function(a,b,c,d,e){this.async(a,b,c,d,e)},postd:function(a,b,c){this.async(a,b,!1,!1,c)},customAjax:function(a){var b=this,c=this.getCookie("cuk"),d=this.getLoginSessionId();$.ajax({type:a.type||"POST",timeout:a.timeout||3e4,async:a.async,cache:a.cache,headers:{Authrization:c,"cache-control":"no-cache",Pragma:"no-cache",isharejsid:d},statusCode:{401:function(){b.delCookie("cuk","/"),b.delCookie("cuk","/",".sina.com.cn"),b.delCookie("cuk","/",".iask.com.cn"),b.delCookie("cuk","/",".iask.com"),$.toast({text:"请重新登录",delay:2e3})}},contentType:a.contentType||"application/json;charset=utf-8",dataType:a.dataType||"json",url:a.url,data:a.data,success:a.success,error:a.error})},customGet:function(a,b,c,d,e){this.customAjax({type:"GET",url:a,async:e===!1?e:!0,cache:!1,data:b,success:c,error:d})},customPost:function(a,b,c,d,e){this.customAjax({type:"POST",url:a,async:e===!1?e:!0,data:b?JSON.stringify(b):b,success:c,error:d})},random:function(a,b){return Math.floor(Math.random()*(b-a))+a},setCookieWithExpPath:function(a,b,c,d){var e=new Date;e.setTime(e.getTime()+c),document.cookie=a+"="+escape(b)+";path="+d+";expires="+e.toGMTString()},setCookieWithExp:function(a,b,c,d){var e=new Date;e.setTime(e.getTime()+c),d?document.cookie=a+"="+escape(b)+";path="+d+";expires="+e.toGMTString():document.cookie=a+"="+escape(b)+";expires="+e.toGMTString()},getCookie:function(a){var b=document.cookie.match(new RegExp("(^| )"+a+"=([^;]*)(;|$)"));return null!==b?unescape(b[2]):null},delCookie:function(a,b,c){var d=new Date;d.setTime(d.getTime()-1);var e=this.getCookie(a);null!=e&&(b&&c?document.cookie=a+"= '' ;domain="+c+";expires="+d.toGMTString()+";path="+b:b?document.cookie=a+"= '' ;expires="+d.toGMTString()+";path="+b:document.cookie=a+"="+e+";expires="+d.toGMTString())},getQueryString:function(a){var b=new RegExp("(^|&)"+a+"=([^&]*)(&|$)","i"),c=window.location.search.substr(1).match(b);return null!=c?unescape(c[2]):null},url2Obj:function(a){for(var b={},c=a.split("?"),d=c[1].split("&"),e=0;e<d.length;e++){var f=d[e].split("=");b[f[0]]=f[1]}return b},getParam:function(a){a=a.replace(/[\[]/,"\\[").replace(/[\]]/,"\\]");var b="[\\?&]"+a+"=([^&#]*)",c=new RegExp(b),d=c.exec(window.location.href);return null==d?"":decodeURIComponent(d[1].replace(/\+/g," "))},getParamsByName:function(a,b){b=b.replace(/[\[]/,"\\[").replace(/[\]]/,"\\]");var c="[\\?&#]"+b+"=([^&#]*)",d=new RegExp(c),e=d.exec(a);return null==e?"":decodeURIComponent(e[1].replace(/\+/g," "))},getLocalData:function(a){try{if(localStorage&&localStorage.getItem){var b=localStorage.getItem(a);return null===b?null:JSON.parse(b)}return console.log("浏览器不支持html localStorage getItem"),null}catch(c){return null}},setLocalData:function(a,b){localStorage&&localStorage.setItem?(localStorage.removeItem(a),localStorage.setItem(a,JSON.stringify(b))):console.log("浏览器不支持html localStorage setItem")},browserType:function(){var a=navigator.userAgent,b=a.indexOf("Opera")>-1;return b?"Opera":a.indexOf("compatible")>-1&&a.indexOf("MSIE")>-1&&!b?"IE":a.indexOf("Edge")>-1?"Edge":a.indexOf("Firefox")>-1?"Firefox":a.indexOf("Safari")>-1&&-1===a.indexOf("Chrome")?"Safari":a.indexOf("Chrome")>-1&&a.indexOf("Safari")>-1?"Chrome":void 0},validateIE9:function(){return Boolean($.browser.msie&&("9.0"===$.browser.version||"8.0"===$.browser.version||"7.0"===$.browser.version||"6.0"===$.browser.version))},compareTime:function(a,b){return a&&b?Math.abs((b-a)/1e3/60/60/24):""},changeURLPar:function(url,arg,arg_val){var pattern=arg+"=([^&]*)",replaceText=arg+"="+arg_val;if(url.match(pattern)){var tmp="/("+arg+"=)([^&]*)/gi";return tmp=url.replace(eval(tmp),replaceText)}return url.match("[?]")?url+"&"+replaceText:url+"?"+replaceText},getUrlAllParams:function(a){if("undefined"==typeof a)var b=decodeURI(location.search);else var b="?"+a.split("?")[1];var c=new Object;if(-1!=b.indexOf("?"))for(var d=b.substr(1),e=d.split("&"),f=0;f<e.length;f++)c[e[f].split("=")[0]]=decodeURI(e[f].split("=")[1]);return c},compatibleIESkip:function(a,b){setTimeout(function(){var c=document.createElement("a");c.href=a,c.style.display="none",b&&(c.target="_blank"),document.body.appendChild(c),c.click()},350)},testEmail:function(a){var b=/^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/;return b.test(a)?!0:!1},testPhone:function(a){return/^1(3|4|5|6|7|8|9)\d{9}$/.test(a)?!0:!1},handleRecommendData:function(a,b){var c=[];return console.log("list",a,"dictionaryList",b),$(a).each(function(a,d){var e={};if(1==d.type&&(d.linkUrl="/f/"+d.tprId+".html",e=d),2==d.type&&(e=d),3==d.type&&d.tprId&&d.expand&&d.expand.templateCode&&Array.isArray(b)){const f=d.expand.templateCode;var g=b.filter(function(a){return a.pcode===f});g[0]&&(4===g[0].order?(d.linkUrl=g[0].pvalue+"/"+d.tprId+".html",e=d):(d.linkUrl=g[0].desc+g[0].pvalue+"/"+d.tprId+".html",e=d))}e.type&&c.push(e)}),console.log(c),c},formatDate:function(a){var b={"M+":this.getMonth()+1,"d+":this.getDate(),"h+":this.getHours(),"m+":this.getMinutes(),"s+":this.getSeconds(),"q+":Math.floor((this.getMonth()+3)/3),S:this.getMilliseconds()};/(y+)/.test(a)&&(a=a.replace(RegExp.$1,String(this.getFullYear()).substr(4-RegExp.$1.length)));for(var c in b)new RegExp("("+c+")").test(a)&&(a=a.replace(RegExp.$1,1==RegExp.$1.length?b[c]:("00"+b[c]).substr(String(b[c]).length)));return a},formatDateV2:function(a,b){var c=new Date(b),d={"M+":c.getMonth()+1,"d+":c.getDate(),"h+":c.getHours(),"m+":c.getMinutes(),"s+":c.getSeconds(),"q+":Math.floor((c.getMonth()+3)/3),S:c.getMilliseconds()};/(y+)/.test(a)&&(a=a.replace(RegExp.$1,String(c.getFullYear()).substr(4-RegExp.$1.length)));for(var e in d)new RegExp("("+e+")").test(a)&&(a=a.replace(RegExp.$1,1==RegExp.$1.length?d[e]:("00"+d[e]).substr(String(d[e]).length)));return a},getReferrer:function(){var a=document.referrer,b="";return/https?\:\/\/[^\s]*so.com.*$/g.test(a)?b="360":/https?\:\/\/[^\s]*baidu.com.*$/g.test(a)?b="baidu":/https?\:\/\/[^\s]*sogou.com.*$/g.test(a)?b="sogou":/https?\:\/\/[^\s]*sm.cn.*$/g.test(a)&&(b="sm"),b},judgeSource:function(a){a||(a={}),a.searchEngine="";var b="";if(b=utils.getQueryVariable("from"),b||(b=sessionStorage.getItem("webWxFrom")||utils.getCookie("webWxFrom")),b)a.source=b,sessionStorage.setItem("webWxFrom",b),sessionStorage.removeItem("webReferrer");else{var c=sessionStorage.getItem("webReferrer")||utils.getCookie("webReferrer");if(c||(c=document.referrer),c){sessionStorage.setItem("webReferrer",c),sessionStorage.removeItem("webWxFrom"),c=c.toLowerCase();for(var d=new Array("google.","baidu.","360.","sogou.","shenma.","bing."),e=new Array("google","baidu","360","sogou","shenma","bing"),f=0,g=d.length;g>f;f++)c.indexOf(d[f])>=0&&(a.source="searchEngine",a.searchEngine=e[f])}c&&a.source||(utils.isWeChatBrow()?a.source="wechat":a.source="outLink")}return a},randomString:function(a){a=a||4;for(var b="ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678",c=b.length,d="",e=0;a>e;e++)d+=b.charAt(Math.floor(Math.random()*c));return d},saveLoginToken:function(a,b){b=b||7776e6,this.setCookieWithExpPath("cuk",a,b,"/")},delLoginToken:function(){this.delCookie("ui","/"),this.delCookie("userId","/"),this.delCookie("cuk","/"),this.delCookie("cuk","/",".sina.com.cn"),this.delCookie("cuk","/",".iask.com.cn"),this.delCookie("cuk","/",".iask.com")},getLoginToken:function(){return this.getCookie("cuk")||""},saveLoginSessionId:function(a){this.setCookieWithExpPath("ISHJSSID",a,7776e6,"/")},delLoginSessionId:function(){this.delCookie("ISHJSSID","/")},getLoginSessionId:function(){return this.getCookie("ISHJSSID")||""},isIe8:function(){return Array.isArray?!0:!1}}}),define("dist/cmd-lib/toast2",[],function(a,b,c){!function(a,b,c){function d(b){this.options={text:"我是toast提示",icon:"",delay:3e3,callback:!1},b&&a.isPlainObject(b)&&a.extend(!0,this.options,b),this.init()}d.prototype.init=function(){var b=this;b.body=a("body"),b.toastWrap=a('<div class="ui-toast" style="position:fixed;min-width:200px;padding:0 10px;height:60px;line-height:60px;text-align:center;background:#000;opacity:0.8;filter:alpha(opacity=80);top:50%;left:50%;border-radius:4px;z-index:99999999">'),b.toastIcon=a('<i class="icon"></i>'),b.toastText=a('<span class="ui-toast-text" style="color:#fff">'+b.options.text+"</span>"),b._creatDom(),b.show(),b.hide()},d.prototype._creatDom=function(){var a=this;a.options.icon&&a.toastWrap.append(a.toastIcon.addClass(a.options.icon)),a.toastWrap.append(a.toastText),a.body.append(a.toastWrap)},d.prototype.show=function(){var a=this;setTimeout(function(){a.toastWrap.removeClass("hide").addClass("show")},50)},d.prototype.hide=function(){var a=this;setTimeout(function(){a.toastWrap.removeClass("show").addClass("hide"),a.toastWrap.remove(),a.options.callback&&a.options.callback()},a.options.delay)},a.toast=function(a){return new d(a)}}($,window,document)}),define("dist/application/api",["dist/application/urlConfig"],function(a,b,c){var d=a("dist/application/urlConfig"),e=d.ajaxUrl+"/gateway/pc",f=d.ajaxUrl+"/gateway";c.exports={user:{userWxAuthState:f+"/cas/user/wxAuthState",dictionaryData:f+"/market/dictionaryData/$code",checkSso:f+"/cas/login/checkSso",loginByPsodOrVerCode:f+"/cas/login/authorize",getLoginQrcode:f+"/cas/login/qr_code",loginByWeChat:f+"/cas/login/gzh_scan",getUserInfo:"/node/api/getUserInfo",thirdLoginRedirect:f+"/cas/login/redirect",loginOut:f+"/cas/login/logout",newCollect:f+"/content/collect/getUserFileList",addFeedback:f+"/feedback/addFeedback",getFeedbackType:f+"/feedback/getFeedbackType",sendSms:f+"/cas/sms/sendSms",queryBindInfo:f+"/cas/user/queryBindInfo",thirdCodelogin:f+"/cas/login/thirdCode",userBindMobile:f+"/cas/user/bindMobile",checkIdentity:f+"/cas/sms/checkIdentity",userBindThird:f+"/cas/user/bindThird",untyingThird:f+"/cas/user/untyingThird",setUpPassword:f+"/cas/user/setUpPassword",getUserCentreInfo:f+"/user/getUserCentreInfo",editUser:f+"/user/editUser",getFileBrowsePage:f+"/content/fileBrowse/getFileBrowsePage",getDownloadRecordList:f+"/content/getDownloadRecordList",getUserFileList:f+"/content/collect/getUserFileList",getMyUploadPage:f+"/content/getMyUploadPage",getOtherUser:f+"/user/getOthersCentreInfo",getSearchList:f+"/search/content/byCondition",getVisitorId:f+"/user/getVisitorId",getCoinIaskBalance:f+"/account/user/getCoinIaskBalance",getCoinIaskList:f+"/account/user/getCoinIaskList",taskUserActionRecordReport:f+"/task/userActionRecord/report",updateAgreementTime:f+"/user/certification/updateAgreementTime"},normalFileDetail:{filePreDownLoad:f+"/content/getPreFileDownUrl",getFileDownLoadUrl:f+"/content/getFileDownUrl",getPrePageInfo:f+"/content/getPreRead",sendmail:f+"/content/sendmail/findFile",getFileDetailNoTdk:f+"/content/getFileDetailNoTdk"},officeFileDetail:{},search:{specialTopic:f+"/search/specialTopic/lisPage"},sms:{sendCorpusDownloadMail:f+"/content/fileSendEmail/sendCorpusDownloadMail",fileSendEmailVisitor:f+"/content/fileSendEmail/visitor"},pay:{bindUser:f+"/order/bind/loginUser",scanOrderInfo:f+"/order/scan/orderInfo",getBuyAutoRenewList:f+"/order/buy/autoRenewList",cancelAutoRenew:f+"/order/cancel/autoRenew/"},coupon:{rightsSaleVouchers:f+"/rights/sale/vouchers",rightsSaleQueryPersonal:f+"/rights/sale/queryPersonal",querySeniority:f+"/rights/sale/querySeniority",queryUsing:f+"/rights/sale/queryUsing",getMemberPointRecord:f+"/rights/vip/getMemberPointRecord",getBuyRecord:f+"/rights/vip/getBuyRecord",getTask:f+"/rights/task/get",receiveTask:f+"/rights/task/receive",taskHasEnable:f+"/rights/task/hasEnable"},order:{reportOrderError:f+"/order/message/save",bindOrderByOrderNo:f+"/order/bind/byOrderNo",unloginOrderDown:e+"/order/unloginOrderDown",createOrderInfo:f+"/order/create/orderInfo",rightsVipGetUserMember:f+"/rights/vip/getUserMember",getOrderStatus:f+"/order/get/orderStatus",queryOrderlistByCondition:f+"/order/query/listByCondition",getOrderInfo:f+"/order/get/orderInfo",downloadOrder:f+"/order/create/downloadOrder",orderStatus:f+"/order/get/statusFromOut/$orderNo"},getHotSearch:f+"/cms/search/content/hotWords",special:{fileSaveOrupdate:f+"/comment/zan/fileSaveOrupdate",getCollectState:f+"/comment/zc/getUserFileZcState",setCollect:f+"/content/collect/file"},upload:{getWebAllFileCategory:f+"/content/fileCategory/getWebAll",createFolder:f+"/content/saveUserFolder",getFolder:f+"/content/getUserFolders",saveUploadFile:f+"/content/webUploadFile",picUploadCatalog:"/ishare-upload/picUploadCatalog",fileUpload:"/ishare-upload/fileUpload",batchDeleteUserFile:f+"/content/batchDeleteUserFile"},recommend:{recommendConfigInfo:f+"/recommend/config/info",recommendConfigRuleInfo:f+"/recommend/config/ruleInfo"},reportBrowse:{fileBrowseReportBrowse:f+"/content/fileBrowse/reportBrowse"},mywallet:{getAccountBalance:f+"/account/balance/getGrossIncome",withdrawal:f+"/account/with/apply",getWithdrawalRecord:f+"/account/withd/getPersonList",editFinanceAccount:f+"/account/finance/edit",getFinanceAccountInfo:f+"/account/finance/getInfo",getPersonalAccountTax:f+"/account/tax/getPersonal",getMyWalletList:f+"/settlement/settle/getMyWalletList",exportMyWalletDetail:f+"/settlement/settle/exportMyWalletDetail"},authentication:{getInstitutions:f+"/user/certification/getInstitutions",institutions:f+"/user/certification/institutions",getPersonalCertification:f+"/user/certification/getPersonal",personalCertification:f+"/user/certification/personal"},seo:{listContentInfos:f+"/seo/exposeContent/contentInfo/listContentInfos"},wechat:{getWechatSignature:f+"/message/wechat/info/getWechatSignature"},comment:{getLableList:f+"/comment/lable/dataList",getStarLevelList:f+"/comment/lable/getStarLevelList",addComment:f+"/comment/eval/add",getHotLableDataList:f+"/comment/lable/hotDataList",getFileComment:f+"/comment/eval/dataList",getPersoDataInfo:f+"/comment/eval/persoDataInfo",getQualifications:f+"/comment/eval/getQualifications"},iaskCoin:{getCoinIaskBalance:f+"/account/user/getCoinIaskBalance"},exchange:{exchangeGoodsList:f+"/exchange/integralGoods/exchangeGoodsList",exchangeGoodsDetail:f+"/exchange/integralGoods/exchangeGoodsDetail/$id"},task:{dailyTaskList:f+"/task/taskList/daily",noviceTaskList:f+"/task/taskList/novice",taskNotifyList:f+"/task/taskList/done"}}}),define("dist/application/urlConfig",[],function(a,b,c){var d=window.env,e=window.payUrl,f=window.upload,g=window.bilogUrl,h=window.officeUrl,i=window.ejunshi,j=window.fileConvertSite,k={debug:{},local:{},dev:{},test:{},pre:{},prod:{}};return k[d]={payUrl:e,upload:f,bilogUrl:g,officeUrl:h,ejunshi:i,fileConvertSite:j,ajaxUrl:"",fileConvertSitePath:{pdftoword:"/converter/pdftoword/",pdfencrypt:"/converter/pdfencrypt/",pdfmerge:"/converter/pdfmerge/",pdfsplit:"/converter/pdfsplit/",wordtopdf:"/converter/wordtopdf/"}},$.extend({},k[d],{site:4,terminal:"0"})}),define("dist/pay/payRestult.html",[],'<div class="payment-title">\n    {{ if orderInfo.orderStatus == 2}}\n    <span class="payment-title-icon success"></span>\n    <span class="payment-title-desc">支付成功</span>\n    <span class="payment-title-info">请在电脑网站完成后续操作</span>\n    {{/if}}\n    {{ if orderInfo.orderStatus == 3}}\n    <span class="payment-title-icon error"></span>\n    <span class="payment-title-desc">支付失败</span>\n    {{/if}}\n\n</div>\n<ul class="order-list">\n    <li class="list-item">\n        <span class="item-title">支付方式:</span>\n        {{ if orderInfo.payType == \'wechat\'}}\n            <span class="item-desc">微信支付</span>\n        {{/if}}\n            {{ if orderInfo.payType == \'alipay\'}}\n            <span class="item-desc">支付宝支付</span>\n        {{/if}}\n    </li>\n    <li class="list-item">\n        <span class="item-title">订单金额:</span>\n        <span class="item-desc">¥ {{orderInfo.payPrice}}</span>\n    </li>\n    <li class="list-item orderTime">\n        <span class="item-title">创建时间:</span>\n        <span class="item-desc">{{orderInfo.orderTime}}</span>\n    </li>\n    <li class="list-item">\n        <span class="item-title">商户单号:</span>\n        <span class="item-desc">{{orderInfo.payNo}}</span>\n    </li>\n    <li class="list-item">\n        <span class="item-title">商品名称:</span>\n        <span class="item-desc">{{orderInfo.goodsName}}</span>\n    </li>\n</ul> \n<div class="payment-info">\n    请截图保存订单详情，以便查询使用\n</div>\n{{ if orderInfo.orderStatus == 3 }}\n    <div class="btn-wrap">\n        <div class="payment-btn">重新支付</div>\n    </div>\n{{ /if }}\n\n\n');
//# sourceMappingURL=dist/js-source-map/ishare-web-pc.js.map