/*! ishare_pc_website
*author:Jersey */
define("dist/detail/fail",["../common/bilog","base64","../cmd-lib/util","../application/method","../report/config"],function(a,b,c){a("../common/bilog")}),define("dist/common/bilog",["base64","dist/cmd-lib/util","dist/application/method","dist/report/config"],function(a,b,c){function d(){sessionStorage.setItem("sessionID",z)}function e(a,b){!new RegExp("/f/").test(a)||new RegExp("referrer=").test(a)||new RegExp("/f/down").test(a)?new RegExp("/pay/payConfirm.html").test(a)?(b.prePageID="PC-M-PAY-F-L",b.prePageName="支付页-付费资料-列表页"):new RegExp("/pay/payQr.html\\?type=2").test(a)?(b.prePageID="PC-M-PAY-F-QR",b.prePageName="支付页-付费资料-支付页"):new RegExp("/pay/vip.html").test(a)?(b.prePageID="PC-M-PAY-VIP-L",b.prePageName="支付页-VIP-套餐列表页"):new RegExp("/pay/payQr.html\\?type=0").test(a)?(b.prePageID="PC-M-PAY-VIP-QR",b.prePageName="支付页-VIP-支付页"):new RegExp("/pay/privilege.html").test(a)?(b.prePageID="PC-M-PAY-PRI-L",b.prePageName="支付页-下载特权-套餐列表页"):new RegExp("/pay/payQr.html\\?type=1").test(a)?(b.prePageID="PC-M-PAY-PRI-QR",b.prePageName="支付页-下载特权-支付页"):new RegExp("/pay/success").test(a)?(b.prePageID="PC-M-PAY-SUC",b.prePageName="支付成功页"):new RegExp("/pay/fail").test(a)?(b.prePageID="PC-M-PAY-FAIL",b.prePageName="支付失败页"):new RegExp("/node/f/downsucc.html").test(a)?/unloginFlag=1/.test(a)?(b.prePageID="PC-M-FDPAY-SUC",b.prePageName="免登购买成功页"):(b.prePageID="PC-M-DOWN-SUC",b.prePageName="下载成功页"):new RegExp("/node/f/downfail.html").test(a)?(b.prePageID="PC-M-DOWN-FAIL",b.prePageName="下载失败页"):new RegExp("/search/home.html").test(a)&&(b.prePageID="M-M-SR",b.prePageName="搜索结果页"):(b.prePageID="PC-M-FD",b.prePageName="资料详情页")}function f(){$.getScript("//ipip.iask.cn/iplookup/search?format=js",function(a,b){"success"===b?(u.setCookieWithExp("ip",remote_ip_info.ip,3e5,"/"),C.ip=remote_ip_info.ip):console.error("ipip获取ip信息error")})}function g(){var a="";return-1!=window.navigator.userAgent.indexOf("Windows NT 10.0")?a="Windows 10":-1!=window.navigator.userAgent.indexOf("Windows NT 6.2")?a="Windows 8":-1!=window.navigator.userAgent.indexOf("Windows NT 6.1")?a="Windows 7":-1!=window.navigator.userAgent.indexOf("Windows NT 6.0")?a="Windows Vista":-1!=window.navigator.userAgent.indexOf("Windows NT 5.1")?a="Windows XP":-1!=window.navigator.userAgent.indexOf("Windows NT 5.0")?a="Windows 2000":-1!=window.navigator.userAgent.indexOf("Mac")?a="Mac/iOS":-1!=window.navigator.userAgent.indexOf("X11")?a="UNIX":-1!=window.navigator.userAgent.indexOf("Linux")&&(a="Linux"),a}function h(a){setTimeout(function(){console.log(a),$.getJSON("https://dw.iask.com.cn/ishare/jsonp?data="+s.encode(JSON.stringify(a))+"&jsoncallback=?",function(a){console.log(a)})})}function i(a,b){var c=a;if(a&&b){for(var d in a)if("var"===d)for(var e in b)c["var"][e]=b[e];else b[d]&&(c[d]=b[d]);console.log("埋点参数:",c),h(c)}}function j(){var a=JSON.parse(JSON.stringify(C));e(document.referrer,a);var b={channel:""},c=u.getCookie("bc");c&&(b.channel=c),a.eventType="page",a.eventID="NE001",a.eventName="normalPageView",a.pageID=$("#ip-page-id").val()||"",a.pageName=$("#ip-page-name").val()||"",a.pageURL=window.location.href,i(a,b)}function k(){var a={fileID:window.pageConfig.params.g_fileId,fileName:window.pageConfig.params.file_title,fileCategoryID:window.pageConfig.params.classid1+"||"+window.pageConfig.params.classid2+"||"+window.pageConfig.params.classid3,fileCategoryName:window.pageConfig.params.classidName1+"||"+window.pageConfig.params.classidName2+"||"+window.pageConfig.params.classidName3,filePrice:window.pageConfig.params.moneyPrice,fileCouponCount:window.pageConfig.params.file_volume,filePayType:w[window.pageConfig.params.file_state],fileFormat:window.pageConfig.params.file_format,fileProduceType:window.pageConfig&&window.pageConfig.params?window.pageConfig.params.fsource:"",fileCooType:"",fileUploaderID:window.pageConfig.params.file_uid},b=window.pageConfig&&window.pageConfig.params?window.pageConfig.params.is360:"";/https?\:\/\/[^\s]*so.com.*$/g.test(document.referrer)&&!/https?\:\/\/[^\s]*wenku.so.com.*$/g.test(document.referrer)&&"true"==b&&(a.fileCooType="360onebox",u.setCookieWithExp("bc","360onebox",18e5,"/")),/https?\:\/\/[^\s]*wenku.so.com.*$/g.test(document.referrer)&&(a.fileCooType="360wenku",u.setCookieWithExp("bc","360wenku",18e5,"/"));var c=JSON.parse(JSON.stringify(C));e(document.referrer,c),c.eventType="page",c.eventID="SE002",c.eventName="fileDetailPageView",c.pageID=$("#ip-page-id").val()||"",c.pageName=$("#ip-page-name").val()||"",c.pageURL=window.location.href,u.setCookieWithExp("bf",JSON.stringify(a),18e5,"/"),i(c,a)}function l(a){var b=JSON.parse(JSON.stringify(C));if(e(document.referrer,b),b.eventType="page",b.eventID="SE009",b.eventName="payFileResult",b.pageID=$("#ip-page-id").val()||"",b.pageName=$("#ip-page-name").val()||"",b.pageURL=window.location.href,a.fileID||(a.fileID=u.getParam("fid")||$("#ip-page-fid").val()),!a.filePayType){var c=$("#ip-page-fstate").val()||1;a.filePayType=w[c]}i(b,a)}function m(a){var b=JSON.parse(JSON.stringify(C));e(document.referrer,b),b.eventType="page",b.eventID="SE011",b.eventName="payVipResult",b.pageID=$("#ip-page-id").val()||"",b.pageName=$("#ip-page-name").val()||"",b.pageURL=window.location.href,a.orderID||(a.orderID=u.getParam("orderNo")||""),i(b,a)}function n(a){var b=JSON.parse(JSON.stringify(C));e(document.referrer,b),b.eventType="page",b.eventID="SE013",b.eventName="payPrivilegeResult",b.pageID=$("#ip-page-id").val()||"",b.pageName=$("#ip-page-name").val()||"",b.pageURL=window.location.href,i(b,a)}function o(a){var b=JSON.parse(JSON.stringify(C));e(document.referrer,b),b.eventType="page",b.eventID="SE014",b.eventName="downResult",b.pageID=$("#ip-page-id").val()||"",b.pageName=$("#ip-page-name").val()||"",b.pageURL=window.location.href,i(b,a)}function p(a,b){for(var c in b)a[c]&&(b[c]=a[c])}function q(a,b,c,d,f){var g=JSON.parse(JSON.stringify(C));e(document.referrer,g),g.eventType="click",g.eventID=a,g.eventName=b,g.pageID=$("#ip-page-id").val(),g.pageName=$("#ip-page-name").val(),g.pageURL=window.location.href,g.domID=c,g.domName=d,g.domURL=window.location.href,i(g,f)}function r(a,b,c){var d=$("#ip-page-type").val();if("pindex"==d){var e={fileID:"",fileName:"",fileCategoryID:"",fileCategoryName:"",filePayType:"",fileFormat:"",fileProduceType:"",fileCooType:"",fileUploaderID:""},f=u.getCookie("bf");if(f&&p(JSON.parse(f),e),"fileDetailUpDown"==a||"fileDetailMiddleDown"==a||"fileDetailBottomDown"==a)e.downType="","fileDetailUpDown"==a?q("SE003","fileDetailDownClick","fileDetailUpDown","资料详情页顶部立即下载",e):"fileDetailMiddleDown"==a?q("SE003","fileDetailDownClick","fileDetailMiddleDown","资料详情页中部立即下载",e):"fileDetailBottomDown"==a&&q("SE003","fileDetailDownClick","fileDetailBottomDown","资料详情页底部立即下载",e),delete e.downType;else if("fileDetailUpBuy"==a)q("SE004","fileDetailBuyClick","fileDetailUpBuy","资料详情页顶部立即购买",e);else if("fileDetailMiddleBuy"==a)q("SE004","fileDetailBuyClick","fileDetailMiddleBuy","资料详情页中部立即购买",e);else if("fileDetailBottomBuy"==a)q("SE004","fileDetailBuyClick","fileDetailBottomBuy","资料详情页底部立即购买",e);else if("fileDetailMiddleOpenVip8"==a)q("SE005","fileDetailOpenVipClick","fileDetailMiddleOpenVip8","资料详情页中部开通vip，8折购买",e);else if("fileDetailBottomOpenVip8"==a)q("SE005","fileDetailOpenVipClick","fileDetailBottomOpenVip8","资料详情页底部开通vip，8折购买",e);else if("fileDetailMiddleOpenVipPr"==a)q("SE005","fileDetailOpenVipClick","fileDetailMiddleOpenVipPr","资料详情页中部开通vip，享更多特权",e);else if("fileDetailBottomOpenVipPr"==a)q("SE005","fileDetailOpenVipClick","fileDetailBottomOpenVipPr","资料详情页底部开通vip，享更多特权",e);else if("fileDetailComment"==a)q("SE006","fileDetailCommentClick","fileDetailComment","资料详情页评论",e);else if("fileDetailScore"==a){var g=b.find(".on:last").text();e.fileScore=g?g:"",q("SE007","fileDetailScoreClick","fileDetailScore","资料详情页评分",e),delete e.fileScore}}if("payFile"==a){var e={orderID:u.getParam("orderNo")||"",couponID:$(".pay-coupon-wrap").attr("vid")||"",coupon:$(".pay-coupon-wrap p.chose-ele").text()||"",fileID:"",fileName:"",fileCategoryID:"",fileCategoryName:"",filePayType:"",fileFormat:"",fileProduceType:"",fileCooType:"",fileUploaderID:"",filePrice:"",fileSalePrice:""},f=u.getCookie("bf");f&&p(JSON.parse(f),e),q("SE008","payFileClick","payFile","支付页-付费资料-立即支付",e)}else if("payVip"==a){var e={orderID:u.getParam("orderNo")||"",vipID:$(".ui-tab-nav-item.active").data("vid"),vipName:$(".ui-tab-nav-item.active p.vip-time").text()||"",vipPrice:$(".ui-tab-nav-item.active p.vip-price strong").text()||"",couponID:$(".pay-coupon-wrap").attr("vid")||"",coupon:$(".pay-coupon-wrap p.chose-ele").text()||""};q("SE010","payVipClick","payVip","支付页-VIP-立即支付",e)}else if("payPrivilege"==a){var e={orderID:u.getParam("orderNo")||"",couponID:$(".pay-coupon-wrap").attr("vid")||"",coupon:$(".pay-coupon-wrap p.chose-ele").text()||"",privilegeName:$(".ui-tab-nav-item.active p.privilege-price").text()||"",privilegePrice:$(".ui-tab-nav-item.active").data("activeprice")||"",fileID:"",fileName:"",fileCategoryID:"",fileCategoryName:"",filePayType:"",fileFormat:"",fileProduceType:"",fileCooType:"",fileUploaderID:""},f=u.getCookie("bf");f&&p(JSON.parse(f),e),q("SE012","payPrivilegeClick","payPrivilege","支付页-下载特权-立即支付",e)}var e={phone:$("#ip-mobile").val()||"",vipStatus:$("#ip-isVip").val()||"",channel:"",cashBalance:"",integralNumber:"",idolNumber:"",fileCategoryID:"",fileCategoryName:""};D&&(e.vipStatus=D.isVip||"",e.phone=D.tel||"");var h=u.getCookie("bc");h&&(e.channel=h),"paySuccessBacDown"==a?q("NE002","normalClick","paySuccessBacDown","支付成功页-返回下载",e):"paySuccessOpenVip"==a?q("NE002","normalClick","paySuccessOpenVip","支付成功页-开通VIP",e):"downSuccessOpenVip"==a?q("NE002","normalClick","downSuccessOpenVip","下载成功页-开通VIP",e):"downSuccessContinueVip"==a?q("NE002","normalClick","downSuccessContinueVip","下载成功页-续费VIP",e):"downSuccessBacDetail"==a?q("NE002","normalClick","downSuccessBacDetail","下载成功页-返回详情页",e):"downSuccessBindPhone"==a?q("NE002","normalClick","downSuccessBindPhone","下载成功页-立即绑定",e):"searchresult"==a?q("SE016","normalClick","searchResultClick","搜索结果页点击",e):"viewExposure"==a?(e.moduleID=c,q("SE006","modelView","","",e)):"similarFileClick"==a?q("SE017","fileListNormalClick","similarFileClick","资料列表常规点击",e):"underSimilarFileClick"==a?q("SE017","fileListNormalClick","underSimilarFileClick","点击底部猜你喜欢内容时",e):"downSucSimilarFileClick"==a?q("SE017","fileListNormalClick","downSucSimilarFileClick","下载成功页猜你喜欢内容时",e):"markFileClick"==a&&q("SE019","markClick","markFileClick","资料收藏点击",e)}var s=a("base64").Base64,t=a("dist/cmd-lib/util"),u=a("dist/application/method"),v=a("dist/report/config"),w=["","free","down","cost","online","vipFree","vipOnly"],x=u.getCookie("ip")||f(),y=u.getCookie("cid");y||(y=(new Date).getTime()+""+Math.random(),u.setCookieWithExp("cid",y,2592e6,"/"));var z=(new Date).getTime()+""+Math.random(),A=18e5,B=sessionStorage.getItem("sessionID")||"";B||d(),z-B>A&&d();var C={eventType:"",eventID:"",eventName:"",eventTime:String((new Date).getTime()),reportTime:String((new Date).getTime()),sdkVersion:"V1.0.3",terminalType:"0",loginStatus:u.getCookie("cuk")?1:0,visitID:u.getCookie("gr_user_id")||"",userID:"",sessionID:sessionStorage.getItem("sessionID")||y||"",productName:"ishare",productCode:"0",productVer:"V4.5.0",pageID:"",pageName:"",pageURL:"",ip:x||"",resolution:document.documentElement.clientWidth+"*"+document.documentElement.clientHeight,browserVer:t.getBrowserInfo(navigator.userAgent),osType:g(),moduleID:"",moduleName:"",appChannel:"",prePageID:"",prePageName:"",prePageURL:document.referrer,domID:"",domName:"",domURL:"",location:"",deviceID:"",deviceBrand:"",deviceModel:"",deviceLanguage:navigator.language,mac:"",osVer:"",networkType:"",networkProvider:"","var":{}},D=u.getCookie("ui");D&&(D=JSON.parse(D),C.userID=D.uid||""),e(document.referrer,C),$(function(){setTimeout(function(){var a=$("#ip-page-id").val();"PC-M-FD"==a&&k(),"PC-O-SR"!=a&&j();var b={payResult:1,orderID:u.getParam("orderNo")||"",couponID:$(".pay-coupon-wrap").attr("vid")||"",coupon:$(".pay-coupon-wrap p.chose-ele").text()||"",orderPayType:"",orderPayPrice:"",vipID:"",vipName:"",vipPrice:""},c={payResult:1,orderID:u.getParam("orderNo")||"",couponID:$(".pay-coupon-wrap").attr("vid")||"",coupon:$(".pay-coupon-wrap p.chose-ele").text()||"",orderPayType:"",orderPayPrice:"",fileID:"",fileName:"",fileCategoryID:"",fileCategoryName:"",filePayType:"",fileFormat:"",fileProduceType:"",fileCooType:"",fileUploaderID:"",privilegeID:"",privilegeName:"",privilegePrice:""},d={payResult:1,orderID:u.getParam("orderNo")||"",couponID:$(".pay-coupon-wrap").attr("vid")||"",coupon:$(".pay-coupon-wrap p.chose-ele").text()||"",orderPayType:"",orderPayPrice:"",fileID:"",fileName:"",fileCategoryID:"",fileCategoryName:"",filePayType:"",fileFormat:"",fileProduceType:"",fileCooType:"",fileUploaderID:"",filePrice:"",fileSalePrice:""},e=u.getCookie("bf"),f=u.getCookie("br"),g=window.location.href;if("PC-M-PAY-SUC"==a||"PC-O-PAY-SUC"==a){if(g.indexOf("type=0")>-1)f&&p(JSON.parse(f),b),m(b);else if(g.indexOf("type=1")>-1)e&&p(JSON.parse(e),c),f&&p(JSON.parse(f),c),n(c);else if(g.indexOf("type=2")>-1){e&&p(JSON.parse(e),d);var f=u.getCookie("br");f&&p(JSON.parse(f),d),l(d)}}else("PC-M-PAY-FAIL"==a||"PC-O-PAY-FAIL"==a)&&(g.indexOf("type=0")>-1?(f&&p(JSON.parse(f),b),b.payResult=0,m(b)):g.indexOf("type=1")>-1?(e&&p(JSON.parse(e),c),f&&p(JSON.parse(f),c),c.payResult=0,n(c)):g.indexOf("type=2")>-1&&(e&&p(JSON.parse(e),d),f&&p(JSON.parse(f),d),d.payResult=0,l(d)));var h={downResult:1,fileID:"",fileName:"",fileCategoryID:"",fileCategoryName:"",filePayType:""};if("PC-M-DOWN-SUC"==a){var e=u.getCookie("bf");e&&p(JSON.parse(e),h),h.downResult=1,o(h)}else if("PC-M-DOWN-FAIL"==a){var e=u.getCookie("bf");e&&p(JSON.parse(e),h),h.downResult=0,o(h)}},1e3)}),$(document).delegate("."+v.EVENT_NAME,"click",function(a){var b=$(this),c=b.attr(v.BILOG_CONTENT_NAME);console.log("cnt:",c),c&&setTimeout(function(){r(c,b)})}),c.exports={clickEvent:function(a){var b=a.attr(v.BILOG_CONTENT_NAME);console.log("cnt-导出的:",b),b&&setTimeout(function(){r(b,a)})},viewExposure:function(a){var b="viewExposure";b&&setTimeout(function(){r(b,$this,a)})}}}),define("dist/cmd-lib/util",[],function(a,b,c){var d={throttle:function(a,b){var c,d;return function(e){var f=this,g=arguments,h=+new Date;c&&c+b>h?(clearTimeout(d),d=setTimeout(function(){c=h,a.apply(f,g)},b)):(c=h,a.apply(f,g))}},debounce:function(a,b){var c=0,d=this;return function(e){c&&clearTimeout(c),c=setTimeout(function(){a.apply(d,e)},b)}},isWeChatBrow:function(){var a=navigator.userAgent.toLowerCase(),b=-1!=a.indexOf("micromessenger");return b?!0:!1},getWebAppUA:function(){var a=0,b=navigator.userAgent.toLowerCase();return/iphone|ipad|ipod/.test(b)?a=1:/android/.test(b)&&(a=0),a},validateIE8:function(){return!$.browser.msie||"8.0"!=$.browser.version&&"7.0"!=$.browser.version&&"6.0"!=$.browser.version?!1:!0},validateIE9:function(){return!$.browser.msie||"9.0"!=$.browser.version&&"8.0"!=$.browser.version&&"7.0"!=$.browser.version&&"6.0"!=$.browser.version?!1:!0},getReferrer:function(){var a=document.referrer,b="";return/https?\:\/\/[^\s]*wenku.so.com.*$/g.test(a)?b="360wenku":/https?\:\/\/[^\s]*so.com.*$/g.test(a)?b="360":/https?\:\/\/[^\s]*baidu.com.*$/g.test(a)?b="baidu":/https?\:\/\/[^\s]*sogou.com.*$/g.test(a)?b="sogou":/https?\:\/\/[^\s]*sm.cn.*$/g.test(a)?b="sm":/https?\:\/\/[^\s]*ishare.iask.sina.com.cn.*$/g.test(a)?b="ishare":/https?\:\/\/[^\s]*iask.sina.com.cn.*$/g.test(a)&&(b="iask"),b},getPageRef:function(a){var b=this,c=0;return(b.is360cookie(a)||b.is360cookie("360"))&&(c=1),b.is360wkCookie()&&(c=3),c},is360cookie:function(a){var b=this,c=b.getCookie("_r_so");if(c)for(var d=c.split("_"),e=0;e<d.length;e++)if(d[e]==a)return!0;return!1},add360wkCookie:function(){this.setCookieWithExpPath("_360hz","1",18e5,"/")},is360wkCookie:function(){return null==getCookie("_360hz")?!1:!0},getCookie:function(a){var b=document.cookie.match(new RegExp("(^| )"+a+"=([^;]*)(;|$)"));return null!==b?unescape(b[2]):null},setCookieWithExpPath:function(a,b,c,d){var e=new Date;e.setTime(e.getTime()+c),document.cookie=a+"="+escape(b)+";path="+d+";expires="+e.toGMTString()},findRefer:function(){var a=document.referrer,b="other";return/https?\:\/\/[^\s]*\/f\/.*$/g.test(a)?b="pindex":/https?\:\/\/[^\s]*\/d\/.*$/g.test(a)?b="landing":/https?\:\/\/[^\s]*\/c\/.*$/g.test(a)?b="pcat":/https?\:\/\/[^\s]*\/search\/.*$/g.test(a)?b="psearch":/https?\:\/\/[^\s]*\/t\/.*$/g.test(a)?b="ptag":/https?\:\/\/[^\s]*\/[u|n]\/.*$/g.test(a)?b="popenuser":/https?\:\/\/[^\s]*\/ucenter\/.*$/g.test(a)?b="puser":/https?\:\/\/[^\s]*ishare.iask.sina.com.cn.$/g.test(a)?b="ishareindex":/https?\:\/\/[^\s]*\/theme\/.*$/g.test(a)?b="theme":/https?\:\/\/[^\s]*wenku.so.com.*$/g.test(a)?b="360wenku":/https?\:\/\/[^\s]*so.com.*$/g.test(a)?b="360":/https?\:\/\/[^\s]*baidu.com.*$/g.test(a)?b="baidu":/https?\:\/\/[^\s]*sogou.com.*$/g.test(a)?b="sogou":/https?\:\/\/[^\s]*sm.cn.*$/g.test(a)?b="sm":/https?\:\/\/[^\s]*ishare.iask.sina.com.cn.*$/g.test(a)?b="ishare":/https?\:\/\/[^\s]*iask.sina.com.cn.*$/g.test(a)&&(b="iask"),b},showAlertDialog:function(a,b,c){var d=$(".common-bgMask"),e=$(".common-dialog");e.find("h2[name='title']").text(a),e.find("span[name='content']").html(b),e.find("a.close,a.btn-dialog").unbind("click").click(function(){d.hide(),e.hide(),c&&!$(this).hasClass("close")&&c()}),d.show(),e.show()},browserVersion:function(a){var b=a.indexOf("Opera")>-1,c=a.indexOf("compatible")>-1&&a.indexOf("MSIE")>-1&&!b,d=a.indexOf("Edge")>-1,e=a.indexOf("Firefox")>-1,f=a.indexOf("Safari")>-1&&-1===a.indexOf("Chrome"),g=a.indexOf("Chrome")>-1&&a.indexOf("Safari")>-1;if(c){var h=new RegExp("MSIE (\\d+\\.\\d+);");h.test(a);var i=parseFloat(RegExp.$1);return 7===i?"IE7":8===i?"IE8":9===i?"IE9":10===i?"IE10":11===i?"IE11":12===i?"IE12":"IE"}return b?"Opera":d?"Edge":e?"Firefox":f?"Safari":g?"Chrome":"unKnow"},getBrowserInfo:function(a){var b={},c=a.toLowerCase(),d=/(msie|firefox|chrome|opera|version|trident).*?([\d.]+)/,e=c.match(d);return e&&e.length>=2?(b.browser=e[1].replace(/version/,"'safari")||"unknow",b.ver=e[2]||"1.0.0"):(b.browser="unknow",b.ver="1.0.0"),b.browser+"/"+b.ver}};c.exports=d}),define("dist/application/method",[],function(require,exports,module){return{keyMap:{ishare_detail_access:"ISHARE_DETAIL_ACCESS",ishare_office_detail_access:"ISHARE_OFFICE_DETAIL_ACCESS"},async:function(a,b,c,d,e){$.ajax(a,{type:d||"post",data:e,async:!1,dataType:"json",headers:{"cache-control":"no-cache",Pragma:"no-cache"}}).done(function(a){b&&b(a)}).fail(function(a){console.log("error==="+c)})},get:function(a,b,c){$.ajaxSetup({cache:!1}),this.async(a,b,c,"get")},post:function(a,b,c,d,e){this.async(a,b,c,d,e)},postd:function(a,b,c){this.async(a,b,!1,!1,c)},random:function(a,b){return Math.floor(Math.random()*(b-a))+a},setCookieWithExpPath:function(a,b,c,d){var e=new Date;e.setTime(e.getTime()+c),document.cookie=a+"="+escape(b)+";path="+d+";expires="+e.toGMTString()},setCookieWithExp:function(a,b,c,d){var e=new Date;e.setTime(e.getTime()+c),d?document.cookie=a+"="+escape(b)+";path="+d+";expires="+e.toGMTString():document.cookie=a+"="+escape(b)+";expires="+e.toGMTString()},getCookie:function(a){var b=document.cookie.match(new RegExp("(^| )"+a+"=([^;]*)(;|$)"));return null!==b?unescape(b[2]):null},delCookie:function(a,b,c){var d=new Date;d.setTime(d.getTime()-1);var e=this.getCookie(a);null!=e&&(b&&c?document.cookie=a+"= '' ;domain="+c+";expires="+d.toGMTString()+";path="+b:b?document.cookie=a+"= '' ;expires="+d.toGMTString()+";path="+b:document.cookie=a+"="+e+";expires="+d.toGMTString())},getQueryString:function(a){var b=new RegExp("(^|&)"+a+"=([^&]*)(&|$)","i"),c=window.location.search.substr(1).match(b);return null!=c?unescape(c[2]):null},url2Obj:function(a){for(var b={},c=a.split("?"),d=c[1].split("&"),e=0;e<d.length;e++){var f=d[e].split("=");b[f[0]]=f[1]}return b},getParam:function(a){a=a.replace(/[\[]/,"\\[").replace(/[\]]/,"\\]");var b="[\\?&]"+a+"=([^&#]*)",c=new RegExp(b),d=c.exec(window.location.href);return null==d?"":decodeURIComponent(d[1].replace(/\+/g," "))},getLocalData:function(a){try{if(localStorage&&localStorage.getItem){var b=localStorage.getItem(a);return null===b?null:JSON.parse(b)}return console.log("浏览器不支持html localStorage getItem"),null}catch(c){return null}},setLocalData:function(a,b){localStorage&&localStorage.setItem?(localStorage.removeItem(a),localStorage.setItem(a,JSON.stringify(b))):console.log("浏览器不支持html localStorage setItem")},browserType:function(){var a=navigator.userAgent,b=a.indexOf("Opera")>-1;return b?"Opera":a.indexOf("compatible")>-1&&a.indexOf("MSIE")>-1&&!b?"IE":a.indexOf("Edge")>-1?"Edge":a.indexOf("Firefox")>-1?"Firefox":a.indexOf("Safari")>-1&&-1===a.indexOf("Chrome")?"Safari":a.indexOf("Chrome")>-1&&a.indexOf("Safari")>-1?"Chrome":void 0},validateIE9:function(){return!(!$.browser.msie||"9.0"!==$.browser.version&&"8.0"!==$.browser.version&&"7.0"!==$.browser.version&&"6.0"!==$.browser.version)},compareTime:function(a,b){return a&&b?Math.abs((b-a)/1e3/60/60/24):""},changeURLPar:function(url,arg,arg_val){var pattern=arg+"=([^&]*)",replaceText=arg+"="+arg_val;if(url.match(pattern)){var tmp="/("+arg+"=)([^&]*)/gi";return tmp=url.replace(eval(tmp),replaceText)}return url.match("[?]")?url+"&"+replaceText:url+"?"+replaceText},getUrlAllParams:function(a){if("undefined"==typeof a)var b=decodeURI(location.search);else var b="?"+a.split("?")[1];var c=new Object;if(-1!=b.indexOf("?"))for(var d=b.substr(1),e=d.split("&"),f=0;f<e.length;f++)c[e[f].split("=")[0]]=decodeURI(e[f].split("=")[1]);return c},compatibleIESkip:function(a,b){var c=document.createElement("a");c.href=a,c.style.display="none",b&&(c.target="_blank"),document.body.appendChild(c),c.click()},testEmail:function(a){var b=/^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;return b.test(a)?!0:!1},testPhone:function(a){return/^1(3|4|5|7|8)\d{9}$/.test(a)?!0:!1}}}),define("dist/report/config",[],function(a,b,c){return{COOKIE_FLAG:"_dplf",COOKIE_CIDE:"_dpcid",COOKIE_CUK:"cuk",COOKIE_TIMEOUT:3e6,SERVER_URL:"/dataReport",UACTION_URL:"/uAction",EVENT_NAME:"pc_click",CONTENT_NAME:"pcTrackContent",BILOG_CONTENT_NAME:"bilogContent",ishareTrackEvent:"_ishareTrackEvent",eventCookieFlag:"_eventCookieFlag",EVENT_REPORT:!1,AUTO_PV:!1}});