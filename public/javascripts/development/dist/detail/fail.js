/*! ishare_pc_website
*author:Jersey */
define("dist/detail/fail",["../common/bilog","base64","../cmd-lib/util","../application/method","../report/config"],function(a,b,c){a("../common/bilog")}),define("dist/common/bilog",["base64","dist/cmd-lib/util","dist/application/method","dist/report/config"],function(a,b,c){function d(){sessionStorage.setItem("sessionID",A)}function e(a,b){if(b.visitID=v.getCookie("visitor_id"),!new RegExp("/f/").test(a)||new RegExp("referrer=").test(a)||new RegExp("/f/down").test(a))new RegExp("/pay/payConfirm.html").test(a)?(b.prePageID="PC-M-PAY-F-L",b.prePageName="支付页-付费资料-列表页"):new RegExp("/pay/payQr.html\\?type=2").test(a)?(b.prePageID="PC-M-PAY-F-QR",b.prePageName="支付页-付费资料-支付页"):new RegExp("/pay/vip.html").test(a)?(b.prePageID="PC-M-PAY-VIP-L",b.prePageName="支付页-VIP-套餐列表页"):new RegExp("/pay/payQr.html\\?type=0").test(a)?(b.prePageID="PC-M-PAY-VIP-QR",b.prePageName="支付页-VIP-支付页"):new RegExp("/pay/privilege.html").test(a)?(b.prePageID="PC-M-PAY-PRI-L",b.prePageName="支付页-下载特权-套餐列表页"):new RegExp("/pay/payQr.html\\?type=1").test(a)?(b.prePageID="PC-M-PAY-PRI-QR",b.prePageName="支付页-下载特权-支付页"):new RegExp("/pay/success").test(a)?(b.prePageID="PC-M-PAY-SUC",b.prePageName="支付成功页"):new RegExp("/pay/fail").test(a)?(b.prePageID="PC-M-PAY-FAIL",b.prePageName="支付失败页"):new RegExp("/node/f/downsucc.html").test(a)?/unloginFlag=1/.test(a)?(b.prePageID="PC-M-FDPAY-SUC",b.prePageName="免登购买成功页"):(b.prePageID="PC-M-DOWN-SUC",b.prePageName="下载成功页"):new RegExp("/node/f/downfail.html").test(a)?(b.prePageID="PC-M-DOWN-FAIL",b.prePageName="下载失败页"):new RegExp("/search/home.html").test(a)?(b.prePageID="PC-M-SR",b.prePageName="搜索关键词"):new RegExp("/node/404.html").test(a)?(b.prePageID="PC-M-404",b.prePageName="404错误页"):new RegExp("/node/503.html").test(a)?(b.prePageID="PC-M-500",b.prePageName="500错误页"):new RegExp("/node/personalCenter/home.html").test(a)?(b.prePageID="PC-M-USER",b.prePageName="个人中心-首页"):new RegExp("/node/personalCenter/myuploads.html").test(a)?(b.prePageID="PC-M-USER-MU",b.prePageName="个人中心-我的上传页"):new RegExp("/node/personalCenter/mycollection.html").test(a)?(b.prePageID="PC-M-USER-CL",b.prePageName="个人中心-我的收藏页"):new RegExp("/node/personalCenter/mydownloads.html").test(a)?(b.prePageID="PC-M-USER-MD",b.prePageName="个人中心-我的下载页"):new RegExp("/node/personalCenter/vip.html").test(a)?(b.prePageID="PC-M-USER-VIP",b.prePageName="个人中心-我的VIP"):new RegExp("/node/personalCenter/mycoupon.html").test(a)?(b.prePageID="PC-M-USER-MS",b.prePageName="个人中心-我的优惠券页"):new RegExp("/node/personalCenter/accountsecurity.html").test(a)?(b.prePageID="PC-M-USER-ATM",b.prePageName="个人中心-账号与安全页"):new RegExp("/node/personalCenter/personalinformation.html").test(a)?(b.prePageID="PC-M-USER-ATF",b.prePageName="个人中心-个人信息页"):new RegExp("/node/personalCenter/myorder.html").test(a)&&(b.prePageID="PC-M-USER-ORD",b.prePageName="个人中心-我的订单");else{var c=$(".ip-page-statusCode");"404"==c?(b.prePageID="PC-M-404",b.prePageName="资料被删除"):"302"==c?(b.prePageID="PC-M-FSM",b.prePageName="资料私有"):(b.prePageID="PC-M-FD",b.prePageName="资料详情页")}}function f(){$.getScript("//ipip.iask.cn/iplookup/search?format=js",function(a,b){"success"===b?(v.setCookieWithExp("ip",remote_ip_info.ip,3e5,"/"),D.ip=remote_ip_info.ip):console.error("ipip获取ip信息error")})}function g(){var a="";return-1!=window.navigator.userAgent.indexOf("Windows NT 10.0")?a="Windows 10":-1!=window.navigator.userAgent.indexOf("Windows NT 6.2")?a="Windows 8":-1!=window.navigator.userAgent.indexOf("Windows NT 6.1")?a="Windows 7":-1!=window.navigator.userAgent.indexOf("Windows NT 6.0")?a="Windows Vista":-1!=window.navigator.userAgent.indexOf("Windows NT 5.1")?a="Windows XP":-1!=window.navigator.userAgent.indexOf("Windows NT 5.0")?a="Windows 2000":-1!=window.navigator.userAgent.indexOf("Mac")?a="Mac/iOS":-1!=window.navigator.userAgent.indexOf("X11")?a="UNIX":-1!=window.navigator.userAgent.indexOf("Linux")&&(a="Linux"),a}function h(a){setTimeout(function(){console.log(a,"页面上报"),$.getJSON("https://dw.iask.com.cn/ishare/jsonp?data="+t.encode(JSON.stringify(a))+"&jsoncallback=?",function(a){console.log(a)})})}function i(a,b){var c=a;if(a&&b){for(var d in a)if("var"===d)for(var e in b)c["var"][e]=b[e];else b[d]&&(c[d]=b[d]);console.log("埋点参数:",c),h(c)}}function j(a){var b=JSON.parse(JSON.stringify(D));e(document.referrer,b);var c={channel:""},d=v.getCookie("bc");d&&(c.channel=d),b.eventType="page",b.eventID="NE001",b.eventName="normalPageView",a&&(b.pageID="PLOGIN",b.pageName="登录页"),b.pageID=$("#ip-page-id").val()||"",b.pageName=$("#ip-page-name").val()||"",b.pageURL=window.location.href;var f=q(),g=r(f);$.extend(c,{source:g,searchEngine:f}),i(b,c)}function k(){var a={fileID:window.pageConfig.params.g_fileId,fileName:window.pageConfig.params.file_title,fileCategoryID:window.pageConfig.params.classid1+"||"+window.pageConfig.params.classid2+"||"+window.pageConfig.params.classid3,fileCategoryName:window.pageConfig.params.classidName1+"||"+window.pageConfig.params.classidName2+"||"+window.pageConfig.params.classidName3,filePrice:window.pageConfig.params.moneyPrice,fileCouponCount:window.pageConfig.params.file_volume,filePayType:x[window.pageConfig.params.file_state],fileFormat:window.pageConfig.params.file_format,fileProduceType:window.pageConfig&&window.pageConfig.params?window.pageConfig.params.fsource:"",fileCooType:"",fileUploaderID:window.pageConfig.params.file_uid},b=window.pageConfig&&window.pageConfig.params?window.pageConfig.params.is360:"";/https?\:\/\/[^\s]*so.com.*$/g.test(document.referrer)&&!/https?\:\/\/[^\s]*wenku.so.com.*$/g.test(document.referrer)&&"true"==b&&(a.fileCooType="360onebox",v.setCookieWithExp("bc","360onebox",18e5,"/")),/https?\:\/\/[^\s]*wenku.so.com.*$/g.test(document.referrer)&&(a.fileCooType="360wenku",v.setCookieWithExp("bc","360wenku",18e5,"/")),/https?\:\/\/[^\s]*wenku.so.com.*$/g.test(document.referrer)&&(a.fileCooType="360wenku",v.setCookieWithExp("bc","360wenku",18e5,"/"));var c=JSON.parse(JSON.stringify(D));e(document.referrer,c),c.eventType="page",c.eventID="SE002",c.eventName="fileDetailPageView",c.pageID=$("#ip-page-id").val()||"",c.pageName=$("#ip-page-name").val()||"",c.pageURL=window.location.href,v.setCookieWithExp("bf",JSON.stringify(a),18e5,"/"),i(c,a)}function l(a){var b=JSON.parse(JSON.stringify(D));e(document.referrer,b),b.eventType="page",b.eventID="SE014",b.eventName="downResult",b.pageID=$("#ip-page-id").val()||"",b.pageName=$("#ip-page-name").val()||"",b.pageURL=window.location.href,i(b,a)}function m(a){var b=JSON.parse(JSON.stringify(D));b.eventType="page",b.eventID="SE015",b.eventName="searchPageView",e(document.referrer,b),b.pageID="PC-M-SR",b.pageName=$("#ip-page-name").val()||"",a.keyWords=$(".new-input").val()||$(".new-input").attr("placeholder"),b.pageURL=window.location.href,i(b,a)}function n(a,b){for(var c in b)a[c]&&(b[c]=a[c])}function o(a,b,c,d,f){var g=JSON.parse(JSON.stringify(D));e(document.referrer,g),g.eventType="click",g.eventID=a,g.eventName=b,g.pageID=$("#ip-page-id").val(),g.pageName=$("#ip-page-name").val(),g.pageURL=window.location.href,g.domID=c,g.domName=d,g.domURL=window.location.href,i(g,f)}function p(a,b,c,d){var e=$("#ip-page-type").val();if("pindex"==e){var f={fileID:"",fileName:"",fileCategoryID:"",fileCategoryName:"",filePayType:"",fileFormat:"",fileProduceType:"",fileCooType:"",fileUploaderID:""},g=v.getCookie("bf");if(g&&n(JSON.parse(g),f),"fileDetailUpDown"==a||"fileDetailMiddleDown"==a||"fileDetailBottomDown"==a)f.downType="","fileDetailUpDown"==a?o("SE003","fileDetailDownClick","fileDetailUpDown","资料详情页顶部立即下载",f):"fileDetailMiddleDown"==a?o("SE003","fileDetailDownClick","fileDetailMiddleDown","资料详情页中部立即下载",f):"fileDetailBottomDown"==a&&o("SE003","fileDetailDownClick","fileDetailBottomDown","资料详情页底部立即下载",f),delete f.downType;else if("fileDetailUpBuy"==a)o("SE004","fileDetailBuyClick","fileDetailUpBuy","资料详情页顶部立即购买",f);else if("fileDetailMiddleBuy"==a)o("SE004","fileDetailBuyClick","fileDetailMiddleBuy","资料详情页中部立即购买",f);else if("fileDetailBottomBuy"==a)o("SE004","fileDetailBuyClick","fileDetailBottomBuy","资料详情页底部立即购买",f);else if("fileDetailMiddleOpenVip8"==a)o("SE005","fileDetailOpenVipClick","fileDetailMiddleOpenVip8","资料详情页中部开通vip，8折购买",f);else if("fileDetailBottomOpenVip8"==a)o("SE005","fileDetailOpenVipClick","fileDetailBottomOpenVip8","资料详情页底部开通vip，8折购买",f);else if("fileDetailMiddleOpenVipPr"==a)o("SE005","fileDetailOpenVipClick","fileDetailMiddleOpenVipPr","资料详情页中部开通vip，享更多特权",f);else if("fileDetailBottomOpenVipPr"==a)o("SE005","fileDetailOpenVipClick","fileDetailBottomOpenVipPr","资料详情页底部开通vip，享更多特权",f);else if("fileDetailComment"==a);else if("fileDetailScore"==a){var h=b.find(".on:last").text();f.fileScore=h?h:"",o("SE007","fileDetailScoreClick","fileDetailScore","资料详情页评分",f),delete f.fileScore}}if("payFile"==a){var f={orderID:v.getParam("orderNo")||"",couponID:$(".pay-coupon-wrap").attr("vid")||"",coupon:$(".pay-coupon-wrap p.chose-ele").text()||"",fileID:"",fileName:"",fileCategoryID:"",fileCategoryName:"",filePayType:"",fileFormat:"",fileProduceType:"",fileCooType:"",fileUploaderID:"",filePrice:"",fileSalePrice:""},g=v.getCookie("bf");g&&n(JSON.parse(g),f),o("SE008","payFileClick","payFile","支付页-付费资料-立即支付",f)}else if("payVip"==a){var f={orderID:v.getParam("orderNo")||"",vipID:$(".ui-tab-nav-item.active").data("vid"),vipName:$(".ui-tab-nav-item.active p.vip-time").text()||"",vipPrice:$(".ui-tab-nav-item.active p.vip-price strong").text()||"",couponID:$(".pay-coupon-wrap").attr("vid")||"",coupon:$(".pay-coupon-wrap p.chose-ele").text()||""};o("SE010","payVipClick","payVip","支付页-VIP-立即支付",f)}else if("payPrivilege"==a){var f={orderID:v.getParam("orderNo")||"",couponID:$(".pay-coupon-wrap").attr("vid")||"",coupon:$(".pay-coupon-wrap p.chose-ele").text()||"",privilegeName:$(".ui-tab-nav-item.active p.privilege-price").text()||"",privilegePrice:$(".ui-tab-nav-item.active").data("activeprice")||"",fileID:"",fileName:"",fileCategoryID:"",fileCategoryName:"",filePayType:"",fileFormat:"",fileProduceType:"",fileCooType:"",fileUploaderID:""},g=v.getCookie("bf");g&&n(JSON.parse(g),f),o("SE012","payPrivilegeClick","payPrivilege","支付页-下载特权-立即支付",f)}else if("searchResult"==a)f={fileID:b.attr("data-fileId"),fileName:b.attr("data-fileName"),keyWords:$(".new-input").val()||$(".new-input").attr("placeholder")},o("SE016","normalClick","searchResultClick","搜索结果页点击",f);else if("loginResult"==a){var f={pageID:"ishare",pageName:"PC-M-PLOGIN"};$.extend(f,{"var":d}),o("SE001","loginResult","PLOGIN","登录页",f)}var f={phone:$("#ip-mobile").val()||"",vipStatus:$("#ip-isVip").val()||"",channel:"",cashBalance:"",integralNumber:"",idolNumber:"",fileCategoryID:"",fileCategoryName:""};E&&(f.vipStatus=E.isVip||"",f.phone=E.tel||"");var i=v.getCookie("bc");i&&(f.channel=i),"paySuccessBacDown"==a?o("NE002","normalClick","paySuccessBacDown","支付成功页-返回下载",f):"paySuccessOpenVip"==a?o("NE002","normalClick","paySuccessOpenVip","支付成功页-开通VIP",f):"downSuccessOpenVip"==a?o("NE002","normalClick","downSuccessOpenVip","下载成功页-开通VIP",f):"downSuccessContinueVip"==a?o("NE002","normalClick","downSuccessContinueVip","下载成功页-续费VIP",f):"downSuccessBacDetail"==a?o("NE002","normalClick","downSuccessBacDetail","下载成功页-返回详情页",f):"downSuccessBindPhone"==a?o("NE002","normalClick","downSuccessBindPhone","下载成功页-立即绑定",f):"viewExposure"==a?(f.moduleID=c,o("NE006","modelView","","",f)):"similarFileClick"==a?(f={fileID:window.pageConfig.params.g_fileId,fileName:window.pageConfig.params.file_title,fileCategoryID:window.pageConfig.params.classid1+"||"+window.pageConfig.params.classid2+"||"+window.pageConfig.params.classid3,fileCategoryName:window.pageConfig.params.classidName1+"||"+window.pageConfig.params.classidName2+"||"+window.pageConfig.params.classidName3,filePayType:x[window.pageConfig.params.file_state]},o("SE017","fileListNormalClick","similarFileClick","资料列表常规点击",f)):"underSimilarFileClick"==a?(f={fileID:window.pageConfig.params.g_fileId,fileName:window.pageConfig.params.file_title,fileCategoryID:window.pageConfig.params.classid1+"||"+window.pageConfig.params.classid2+"||"+window.pageConfig.params.classid3,fileCategoryName:window.pageConfig.params.classidName1+"||"+window.pageConfig.params.classidName2+"||"+window.pageConfig.params.classidName3,filePayType:x[window.pageConfig.params.file_state]},o("SE017","fileListNormalClick","underSimilarFileClick","点击底部猜你喜欢内容时",f)):"downSucSimilarFileClick"==a?o("SE017","fileListNormalClick","downSucSimilarFileClick","下载成功页猜你喜欢内容时",f):"markFileClick"==a?(f={fileID:window.pageConfig.params.g_fileId,fileName:window.pageConfig.params.file_title,fileCategoryID:window.pageConfig.params.classid1+"||"+window.pageConfig.params.classid2+"||"+window.pageConfig.params.classid3,fileCategoryName:window.pageConfig.params.classidName1+"||"+window.pageConfig.params.classidName2+"||"+window.pageConfig.params.classidName3,filePayType:x[window.pageConfig.params.file_state],markRusult:1},o("SE019","markClick","markFileClick","资料收藏点击",f)):"vipRights"==a?o("NE002","normalClick","vipRights","侧边栏-vip权益",f):"seen"==a?o("NE002","normalClick","seen","侧边栏-我看过的",f):"mark"==a?o("NE002","normalClick","mark","侧边栏-我的收藏",f):"customerService"==a?o("NE002","normalClick","customerService","侧边栏-联系客服",f):"downApp"==a?o("NE002","normalClick","downApp","侧边栏-下载APP",f):"follow"==a&&o("NE002","normalClick","follow","侧边栏-关注领奖",f)}function q(){var a=document.referrer,b="";return/https?\:\/\/[^\s]*so.com.*$/g.test(a)?b="360":/https?\:\/\/[^\s]*baidu.com.*$/g.test(a)?b="baidu":/https?\:\/\/[^\s]*sogou.com.*$/g.test(a)?b="sogou":/https?\:\/\/[^\s]*sm.cn.*$/g.test(a)?b="sm":/https?\:\/\/[^\s]*google.com.*$/g.test(a)?b="google":/https?\:\/\/[^\s]*bing.com.*$/g.test(a)&&(b="bing"),b}function r(a){var b=document.referrer,c=location.origin,d="";return d=a?"searchEngine":b&&-1!==b.indexOf(c)?"vist":"outLink"}function s(a){console.log("自有埋点上报结果",a),setTimeout(function(){$.getJSON("https://dw.iask.com.cn/ishare/jsonp?data="+t.encode(JSON.stringify(a))+"&jsoncallback=?",function(a){})})}var t=a("base64").Base64,u=a("dist/cmd-lib/util"),v=a("dist/application/method"),w=a("dist/report/config"),x=["","free","","online","vipOnly","cost"],y=v.getCookie("ip")||f(),z=v.getCookie("cid");z||(z=(new Date).getTime()+""+Math.random(),v.setCookieWithExp("cid",z,2592e6,"/"));var A=(new Date).getTime()+""+Math.random(),B=18e5,C=sessionStorage.getItem("sessionID")||"";C||d(),A-C>B&&d();var D={eventType:"",eventID:"",eventName:"",eventTime:String((new Date).getTime()),reportTime:String((new Date).getTime()),sdkVersion:"V1.0.3",terminalType:"0",loginStatus:v.getCookie("cuk")?1:0,visitID:v.getCookie("visitor_id")||"",userID:"",sessionID:sessionStorage.getItem("sessionID")||z||"",productName:"ishare",productCode:"0",productVer:"V4.5.0",pageID:"",pageName:"",pageURL:"",ip:y||"",resolution:document.documentElement.clientWidth+"*"+document.documentElement.clientHeight,browserVer:u.getBrowserInfo(navigator.userAgent),osType:g(),moduleID:"",moduleName:"",appChannel:"",prePageID:"",prePageName:"",prePageURL:document.referrer,domID:"",domName:"",domURL:"",location:"",deviceID:"",deviceBrand:"",deviceModel:"",deviceLanguage:navigator.language,mac:"",osVer:"",networkType:"",networkProvider:"","var":{}},E=v.getCookie("ui");E&&(E=JSON.parse(E),D.userID=E.uid||""),e(document.referrer,D),$(function(){setTimeout(function(){var a=$("#ip-page-id").val();"PC-M-FD"==a&&k(),"PC-O-SR"!=a&&j();var b=v.getCookie("bf"),c=(v.getCookie("br"),window.location.href,{downResult:1,fileID:"",fileName:"",fileCategoryID:"",fileCategoryName:"",filePayType:""});if("PC-M-DOWN-SUC"==a){var b=v.getCookie("bf");b&&n(JSON.parse(b),c),c.downResult=1,l(c)}else if("PC-M-DOWN-FAIL"==a){var b=v.getCookie("bf");b&&n(JSON.parse(b),c),c.downResult=0,l(c)}},1e3)}),$(document).delegate("."+w.EVENT_NAME,"click",function(a){var b=$(this),c=b.attr(w.BILOG_CONTENT_NAME);console.log("cnt:",c),c&&setTimeout(function(){p(c,b)})}),c.exports={normalPageView:function(a){j(a)},clickEvent:function(a){var b=a.attr(w.BILOG_CONTENT_NAME);console.log("cnt-导出的:",b),b&&setTimeout(function(){p(b,a)})},viewExposure:function(a,b){var c="viewExposure";c&&setTimeout(function(){p(c,a,b)})},loginResult:function(a,b,c){var d="loginResult";d&&setTimeout(function(){p(d,"",b,c)})},searchResult:m,getBilogCommonData:function(){return e(document.referrer,D),D},reportToBlack:s}}),define("dist/cmd-lib/util",[],function(a,b,c){var d={throttle:function(a,b){var c,d;return function(e){var f=this,g=arguments,h=+new Date;c&&c+b>h?(clearTimeout(d),d=setTimeout(function(){c=h,a.apply(f,g)},b)):(c=h,a.apply(f,g))}},debounce:function(a,b){var c=0,d=this;return function(e){c&&clearTimeout(c),c=setTimeout(function(){a.apply(d,e)},b)}},isWeChatBrow:function(){var a=navigator.userAgent.toLowerCase(),b=-1!=a.indexOf("micromessenger");return b?!0:!1},getWebAppUA:function(){var a=0,b=navigator.userAgent.toLowerCase();return/iphone|ipad|ipod/.test(b)?a=1:/android/.test(b)&&(a=0),a},validateIE8:function(){return!$.browser.msie||"8.0"!=$.browser.version&&"7.0"!=$.browser.version&&"6.0"!=$.browser.version?!1:!0},validateIE9:function(){return!$.browser.msie||"9.0"!=$.browser.version&&"8.0"!=$.browser.version&&"7.0"!=$.browser.version&&"6.0"!=$.browser.version?!1:!0},getReferrer:function(){var a=document.referrer,b="";return/https?\:\/\/[^\s]*wenku.so.com.*$/g.test(a)?b="360wenku":/https?\:\/\/[^\s]*so.com.*$/g.test(a)?b="360":/https?\:\/\/[^\s]*baidu.com.*$/g.test(a)?b="baidu":/https?\:\/\/[^\s]*sogou.com.*$/g.test(a)?b="sogou":/https?\:\/\/[^\s]*sm.cn.*$/g.test(a)?b="sm":/https?\:\/\/[^\s]*ishare.iask.sina.com.cn.*$/g.test(a)?b="ishare":/https?\:\/\/[^\s]*iask.sina.com.cn.*$/g.test(a)&&(b="iask"),b},getPageRef:function(a){var b=this,c=0;return(b.is360cookie(a)||b.is360cookie("360"))&&(c=1),b.is360wkCookie()&&(c=3),c},is360cookie:function(a){var b=this,c=b.getCookie("_r_so");if(c)for(var d=c.split("_"),e=0;e<d.length;e++)if(d[e]==a)return!0;return!1},add360wkCookie:function(){this.setCookieWithExpPath("_360hz","1",18e5,"/")},is360wkCookie:function(){return null==getCookie("_360hz")?!1:!0},getCookie:function(a){var b=document.cookie.match(new RegExp("(^| )"+a+"=([^;]*)(;|$)"));return null!==b?unescape(b[2]):null},setCookieWithExpPath:function(a,b,c,d){var e=new Date;e.setTime(e.getTime()+c),document.cookie=a+"="+escape(b)+";path="+d+";expires="+e.toGMTString()},findRefer:function(){var a=document.referrer,b="other";return/https?\:\/\/[^\s]*\/f\/.*$/g.test(a)?b="pindex":/https?\:\/\/[^\s]*\/d\/.*$/g.test(a)?b="landing":/https?\:\/\/[^\s]*\/c\/.*$/g.test(a)?b="pcat":/https?\:\/\/[^\s]*\/search\/.*$/g.test(a)?b="psearch":/https?\:\/\/[^\s]*\/t\/.*$/g.test(a)?b="ptag":/https?\:\/\/[^\s]*\/[u|n]\/.*$/g.test(a)?b="popenuser":/https?\:\/\/[^\s]*\/ucenter\/.*$/g.test(a)?b="puser":/https?\:\/\/[^\s]*ishare.iask.sina.com.cn.$/g.test(a)?b="ishareindex":/https?\:\/\/[^\s]*\/theme\/.*$/g.test(a)?b="theme":/https?\:\/\/[^\s]*wenku.so.com.*$/g.test(a)?b="360wenku":/https?\:\/\/[^\s]*so.com.*$/g.test(a)?b="360":/https?\:\/\/[^\s]*baidu.com.*$/g.test(a)?b="baidu":/https?\:\/\/[^\s]*sogou.com.*$/g.test(a)?b="sogou":/https?\:\/\/[^\s]*sm.cn.*$/g.test(a)?b="sm":/https?\:\/\/[^\s]*ishare.iask.sina.com.cn.*$/g.test(a)?b="ishare":/https?\:\/\/[^\s]*iask.sina.com.cn.*$/g.test(a)&&(b="iask"),b},showAlertDialog:function(a,b,c){var d=$(".common-bgMask"),e=$(".common-dialog");e.find("h2[name='title']").text(a),e.find("span[name='content']").html(b),e.find("a.close,a.btn-dialog").unbind("click").click(function(){d.hide(),e.hide(),c&&!$(this).hasClass("close")&&c()}),d.show(),e.show()},browserVersion:function(a){var b=a.indexOf("Opera")>-1,c=a.indexOf("compatible")>-1&&a.indexOf("MSIE")>-1&&!b,d=a.indexOf("Edge")>-1,e=a.indexOf("Firefox")>-1,f=a.indexOf("Safari")>-1&&-1===a.indexOf("Chrome"),g=a.indexOf("Chrome")>-1&&a.indexOf("Safari")>-1;if(c){var h=new RegExp("MSIE (\\d+\\.\\d+);");h.test(a);var i=parseFloat(RegExp.$1);return 7===i?"IE7":8===i?"IE8":9===i?"IE9":10===i?"IE10":11===i?"IE11":12===i?"IE12":"IE"}return b?"Opera":d?"Edge":e?"Firefox":f?"Safari":g?"Chrome":"unKnow"},getBrowserInfo:function(a){var b={},c=a.toLowerCase(),d=/(msie|firefox|chrome|opera|version|trident).*?([\d.]+)/,e=c.match(d);return e&&e.length>=2?(b.browser=e[1].replace(/version/,"'safari")||"unknow",b.ver=e[2]||"1.0.0"):(b.browser="unknow",b.ver="1.0.0"),b.browser+"/"+b.ver},timeFormat:function(a,b){if(!b)return"";var c=new Date(b),d=c.getFullYear(),e=c.getMonth()+1,f=c.getDate(),g=c.getHours(),h=c.getMinutes(),i=c.getSeconds();return 10>e&&(e+="0"),10>f&&(f+="0"),10>g&&(g+="0"),10>h&&(h+="0"),10>i&&(i+="0"),"yyyy-mm-dd"===a?d+"-"+e+"-"+f:d+"-"+e+"-"+f+" "+g+":"+h+":"+i}};c.exports=d}),define("dist/application/method",[],function(require,exports,module){return{keyMap:{ishare_detail_access:"ISHARE_DETAIL_ACCESS",ishare_office_detail_access:"ISHARE_OFFICE_DETAIL_ACCESS"},async:function(a,b,c,d,e){$.ajax(a,{type:d||"post",data:e,async:!1,dataType:"json",headers:{"cache-control":"no-cache",Pragma:"no-cache"}}).done(function(a){b&&b(a)}).fail(function(a){console.log("error==="+c)})},get:function(a,b,c){$.ajaxSetup({cache:!1}),this.async(a,b,c,"get")},post:function(a,b,c,d,e){this.async(a,b,c,d,e)},postd:function(a,b,c){this.async(a,b,!1,!1,c)},random:function(a,b){return Math.floor(Math.random()*(b-a))+a},setCookieWithExpPath:function(a,b,c,d){var e=new Date;e.setTime(e.getTime()+c),document.cookie=a+"="+escape(b)+";path="+d+";expires="+e.toGMTString()},setCookieWithExp:function(a,b,c,d){var e=new Date;e.setTime(e.getTime()+c),d?document.cookie=a+"="+escape(b)+";path="+d+";expires="+e.toGMTString():document.cookie=a+"="+escape(b)+";expires="+e.toGMTString()},getCookie:function(a){var b=document.cookie.match(new RegExp("(^| )"+a+"=([^;]*)(;|$)"));return null!==b?unescape(b[2]):null},delCookie:function(a,b,c){var d=new Date;d.setTime(d.getTime()-1);var e=this.getCookie(a);null!=e&&(b&&c?document.cookie=a+"= '' ;domain="+c+";expires="+d.toGMTString()+";path="+b:b?document.cookie=a+"= '' ;expires="+d.toGMTString()+";path="+b:document.cookie=a+"="+e+";expires="+d.toGMTString())},getQueryString:function(a){var b=new RegExp("(^|&)"+a+"=([^&]*)(&|$)","i"),c=window.location.search.substr(1).match(b);return null!=c?unescape(c[2]):null},url2Obj:function(a){for(var b={},c=a.split("?"),d=c[1].split("&"),e=0;e<d.length;e++){var f=d[e].split("=");b[f[0]]=f[1]}return b},getParam:function(a){a=a.replace(/[\[]/,"\\[").replace(/[\]]/,"\\]");var b="[\\?&]"+a+"=([^&#]*)",c=new RegExp(b),d=c.exec(window.location.href);return null==d?"":decodeURIComponent(d[1].replace(/\+/g," "))},getLocalData:function(a){try{if(localStorage&&localStorage.getItem){var b=localStorage.getItem(a);return null===b?null:JSON.parse(b)}return console.log("浏览器不支持html localStorage getItem"),null}catch(c){return null}},setLocalData:function(a,b){localStorage&&localStorage.setItem?(localStorage.removeItem(a),localStorage.setItem(a,JSON.stringify(b))):console.log("浏览器不支持html localStorage setItem")},browserType:function(){var a=navigator.userAgent,b=a.indexOf("Opera")>-1;return b?"Opera":a.indexOf("compatible")>-1&&a.indexOf("MSIE")>-1&&!b?"IE":a.indexOf("Edge")>-1?"Edge":a.indexOf("Firefox")>-1?"Firefox":a.indexOf("Safari")>-1&&-1===a.indexOf("Chrome")?"Safari":a.indexOf("Chrome")>-1&&a.indexOf("Safari")>-1?"Chrome":void 0},validateIE9:function(){return!(!$.browser.msie||"9.0"!==$.browser.version&&"8.0"!==$.browser.version&&"7.0"!==$.browser.version&&"6.0"!==$.browser.version)},compareTime:function(a,b){return a&&b?Math.abs((b-a)/1e3/60/60/24):""},changeURLPar:function(url,arg,arg_val){var pattern=arg+"=([^&]*)",replaceText=arg+"="+arg_val;if(url.match(pattern)){var tmp="/("+arg+"=)([^&]*)/gi";return tmp=url.replace(eval(tmp),replaceText)}return url.match("[?]")?url+"&"+replaceText:url+"?"+replaceText},getUrlAllParams:function(a){if("undefined"==typeof a)var b=decodeURI(location.search);else var b="?"+a.split("?")[1];var c=new Object;if(-1!=b.indexOf("?"))for(var d=b.substr(1),e=d.split("&"),f=0;f<e.length;f++)c[e[f].split("=")[0]]=decodeURI(e[f].split("=")[1]);return c},getQueryString:function(a){var b=new RegExp("(^|&)"+a+"=([^&]*)(&|$)","i"),c=window.location.search.substr(1).match(b);return null!=c?unescape(c[2]):null},compatibleIESkip:function(a,b){var c=document.createElement("a");c.href=a,c.style.display="none",b&&(c.target="_blank"),document.body.appendChild(c),c.click()},testEmail:function(a){var b=/^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;return b.test(a)?!0:!1},testPhone:function(a){return/^1(3|4|5|7|8)\d{9}$/.test(a)?!0:!1},handleRecommendData:function(a){var b=[];return $(a).each(function(a,c){var d={};1==c.type&&(c.linkUrl="/f/"+c.tprId+".html",d=c),2==c.type&&(d=c),3==c.type&&(c.linkUrl="/node/s/"+c.tprId+".html",d=c),b.push(d)}),console.log(b),b},formatDate:function(a){var b={"M+":this.getMonth()+1,"d+":this.getDate(),"h+":this.getHours(),"m+":this.getMinutes(),"s+":this.getSeconds(),"q+":Math.floor((this.getMonth()+3)/3),S:this.getMilliseconds()};/(y+)/.test(a)&&(a=a.replace(RegExp.$1,(this.getFullYear()+"").substr(4-RegExp.$1.length)));for(var c in b)new RegExp("("+c+")").test(a)&&(a=a.replace(RegExp.$1,1==RegExp.$1.length?b[c]:("00"+b[c]).substr((""+b[c]).length)));return a},getReferrer:function(){var a=document.referrer,b="";return/https?\:\/\/[^\s]*so.com.*$/g.test(a)?b="360":/https?\:\/\/[^\s]*baidu.com.*$/g.test(a)?b="baidu":/https?\:\/\/[^\s]*sogou.com.*$/g.test(a)?b="sogou":/https?\:\/\/[^\s]*sm.cn.*$/g.test(a)&&(b="sm"),b},judgeSource:function(a){a||(a={}),a.searchEngine="";var b="";if(b=utils.getQueryVariable("from"),b||(b=sessionStorage.getItem("webWxFrom")||utils.getCookie("webWxFrom")),b)a.source=b,sessionStorage.setItem("webWxFrom",b),sessionStorage.removeItem("webReferrer");else{var c=sessionStorage.getItem("webReferrer")||utils.getCookie("webReferrer");if(c||(c=document.referrer),c){sessionStorage.setItem("webReferrer",c),sessionStorage.removeItem("webWxFrom"),c=c.toLowerCase();for(var d=new Array("google.","baidu.","360.","sogou.","shenma.","bing."),e=new Array("google","baidu","360","sogou","shenma","bing"),f=0,g=d.length;g>f;f++)c.indexOf(d[f])>=0&&(a.source="searchEngine",a.searchEngine=e[f])}c&&a.source||(utils.isWeChatBrow()?a.source="wechat":a.source="outLink")}return a}}}),define("dist/report/config",[],function(a,b,c){return{COOKIE_FLAG:"_dplf",COOKIE_CIDE:"_dpcid",COOKIE_CUK:"cuk",COOKIE_TIMEOUT:3e6,SERVER_URL:"/",UACTION_URL:"/uAction",EVENT_NAME:"pc_click",CONTENT_NAME:"pcTrackContent",BILOG_CONTENT_NAME:"bilogContent",ishareTrackEvent:"_ishareTrackEvent",eventCookieFlag:"_eventCookieFlag",EVENT_REPORT:!1,AUTO_PV:!1}});