/*! ishare_pc_website
*author:Jersey */
define("dist/authentication/org",["../cmd-lib/upload/Q","../cmd-lib/upload/Q.Uploader","./fixedTopBar","./msgVer","../cmd-lib/toast","../cmd-lib/util","../application/effect","../application/checkLogin","../application/api","../application/method"],function(a,b,c){a("../cmd-lib/upload/Q"),a("../cmd-lib/upload/Q.Uploader"),a("./fixedTopBar"),a("./msgVer"),a("../cmd-lib/toast");var d=(a("../cmd-lib/util"),a("../application/effect").isLogin),e=!0,f=null;d(f,e);var g={nickName:"",validateFrom:/^1[3456789]\d{9}$/,init:function(){this.selectBind(),this.delUploadImg(),this.checkedRules(),this.queryCerinfo(),$(".js-submit").click(function(){g.submitData()}),$("body").click(function(){$(".jqTransformSelectWrapper ul").slideUp()}),setTimeout(function(){g.uploadfile()},500)},queryCerinfo:function(){$.ajax("/gateway/user/certification/getInstitutions",{type:"get"}).done(function(a){"0"==a.code&&3==a.data.auditStatus&&($(".dialog-limit").show(),$("#bgMask").show())}).fail(function(a){console.log("error==="+a)})},selectBind:function(){$(".js-select").click(function(a){$(this).siblings("ul").slideToggle(),a.stopPropagation()}),$(".jqTransformSelectWrapper ul").on("click","li a",function(){$(".jqTransformSelectWrapper ul").find("li a").removeClass("selected"),$(this).addClass("selected"),$(".jqTransformSelectWrapper ul").slideUp(),$(this).parents("ul").siblings(".js-select").find("span").text($(this).text()),$(this).parents("ul").siblings(".js-select").find("span").attr("authType",$(this).attr("index"))})},uploadfile:function(){var a="";$(".btn-rz-upload").on("click",function(){a=$(this)});var b=(Q.event,Q.Uploader);new b({url:location.protocol+"//upload.ishare.iask.com/ishare-upload/picUploadCatalog",target:[document.getElementById("upload-target"),document.getElementById("upload-target2")],upName:"file",dataType:"application/json",multiple:!1,data:{fileCatalog:"ishare"},allows:".jpg,.jpeg,.gif,.png",maxSize:3145728,on:{add:function(b){switch(b.limited){case"ext":return $.toast({text:"不支持此格式上传"});case"size":return $.toast({text:"资料不能超过3M"})}if("upload-target"==a.attr("id")){var c=b.file,d=new FileReader;d.readAsDataURL(c),d.onload=function(a){var c=this.result,d=new Image;d.src=c,d.onload=function(){widthRadio=d.naturalWidth/d.naturalHeight,1!=widthRadio&&($.toast({text:"要求尺寸200*200像素"}),b.limited=!0)}}}},complete:function(b){if(console.log(b,"task"),b.limited)return!1;var c=JSON.parse(b.response);a.attr("val",c.data.picKey),a.siblings(".rz-upload-pic").find("img").attr("src",c.data.preUrl+c.data.picKey),a.siblings(".rz-upload-pic").find(".delete-ele").show()}}})},delUploadImg:function(){$(".delete-ele").click(function(){$(this).hide(),"upload-target2"==$(this).parents(".rz-main-dd").find(".btn-rz-upload").attr("id")?$(this).siblings("img").attr("src","../../../images/auth/pic_zj.jpg"):$(this).siblings("img").attr("src","../../../images/auth/pic_sfz_z.jpg"),$(this).parents(".rz-main-dd").find(".btn-rz-upload").attr("val","")})},checkedRules:function(){$(".rz-label .check-con").click(function(){$(".rz-label .check-con").toggleClass("checked")})},submitData:function(){if(!$(".js-organize-name").val().trim())return $.toast({text:"请输入机构名称",icon:"",delay:2e3,callback:!1}),!1;if(!$(".js-cer-code").val().trim())return $.toast({text:"请输入社会信用代码",icon:"",delay:2e3,callback:!1}),!1;if(!$("#upload-target").attr("val"))return $.toast({text:"请上传企业logo",icon:"",delay:2e3,callback:!1}),!1;if(!$("#upload-target2").attr("val"))return $.toast({text:"请上传营业执照",icon:"",delay:2e3,callback:!1}),!1;if(!g.validateFrom.test($(".js-phone").val().trim()))return $.toast({text:"请输入正确的手机号码",icon:"",delay:2e3,callback:!1}),!1;if(!$(".js-msg-val").val().trim())return $.toast({text:"请输入短信验证码",icon:"",delay:2e3,callback:!1}),!1;if(!$(".js-mail").val().trim())return $.toast({text:"请输入电子邮箱",icon:"",delay:2e3,callback:!1}),!1;var a={nickName:g.nickName,organizeIndustryType:$(".js-organize").attr("authtype"),industryType:$(".js-industry").attr("authtype"),organizeName:$(".js-organize-name").val().trim(),organizeWebsite:$(".js-website").val().trim(),organizeProfile:$(".js-brief").val().trim(),organizeAddress:$(".js-add").val().trim(),socialCreditCode:$(".js-cer-code").val().trim(),logoPic:$("#upload-target").attr("val"),businessLicensePic:$("#upload-target2").attr("val"),contactNumber:$(".js-phone").val().trim(),email:$(".js-mail").val().trim(),smsId:$(".js-msg").attr("smsId"),checkCode:$(".js-msg-val").val().trim()};return $(".rz-label .check-con").hasClass("checked")?(a=JSON.stringify(a),void $.ajax("/gateway/user/certification/institutions",{type:"POST",data:a,contentType:"application/json"}).done(function(a){"0"==a.code?$.toast({text:a.msg,icon:"",delay:2e3,callback:function(){location.reload()}}):$.toast({text:a.msg,icon:"",delay:2e3})}).fail(function(a){console.log("error==="+a)})):($.toast({text:"请勾选用户认证协议",icon:"",delay:2e3,callback:!1}),!1)}};g.init()}),define("dist/cmd-lib/upload/Q",[],function(a,b,c){!function(a,b){"use strict";function c(a,c){return a!==b?a:c}function d(a){return"[object Function]"===A.call(a)}function e(a){return"number"==typeof a&&a>0&&a===Math.floor(a)}function f(a,b){return d(a)?a.apply(b,C.call(arguments,2)):void 0}function g(a,c,d){if(!a||!c)return a;for(var e in c)e!=b&&B.call(c,e)&&(d||a[e]===b)&&(a[e]=c[e]);return a}function h(a,b){if(b!==!1&&!/^[\],:{}\s]*$/.test(a.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,"@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]").replace(/(?:^|:|,)(?:\s*\[)+/g,"")))throw new Error("JSON SyntaxError");try{return new Function("return "+a)()}catch(c){}}function i(a,c){1>=c&&(c*=100),a.style.opacity!=b?a.style.opacity=c/100:a.style.filter!=b&&(a.style.filter="alpha(opacity="+parseInt(c)+")")}function j(a,b){var c=0,d=0,e=a.offsetWidth,f=a.offsetHeight;do c+=a.offsetLeft,d+=a.offsetTop,a=a.offsetParent;while(a&&a!=b);return{left:c,top:d,width:e,height:f}}function k(a,b,c,d){for(var e=a[c||b],f=[];e;){if(1==e.nodeType){if(!d)return e;f.push(e)}e=e[b]}return d?f:null}function l(a){return a.previousElementSibling||k(a,"previousSibling",null,!1)}function m(a){return a.nextElementSibling||k(a,"nextSibling",null,!1)}function n(a){return a.firstElementChild||k(a,"nextSibling","firstChild",!1)}function o(a){return a.lastElementChild||k(a,"previousSibling","lastChild",!1)}function p(a){return a.children||k(a,"nextSibling","firstChild",!0)}function q(a,b,c){var d=document.createElement(a);return b&&(d.className=b),c&&(d.innerHTML=c),d}function r(a,b){var c=q("div","",a);return b?c.childNodes:n(c)}function s(b){var c=b||a.event;return c.target||(c.target=c.srcElement),c}function t(a,b,c,d){var e=function(f){c.call(a,s(f)),d&&F(a,b,e)};return E(a,b,e),d?void 0:{stop:function(){F(a,b,e)}}}function u(a,b){if(d(a[b]))a[b]();else if(a.fireEvent)a.fireEvent("on"+b);else if(a.dispatchEvent){var c=document.createEvent("HTMLEvents");c.initEvent(b,!0,!0),a.dispatchEvent(c)}}function v(a,b,c){var d=s(a);b!==!1&&(d.preventDefault?d.preventDefault():d.returnValue=!1),c!==!1&&(d.stopPropagation?d.stopPropagation():d.cancelBubble=!0)}function w(a){return G.test(a)}function x(a){if(!w(a))return!0;var c=RegExp.lastMatch.length,d=a.indexOf("/",c),e=a.slice(0,-1!=d?d:b);return e.toLowerCase()==(location.protocol+"//"+location.host).toLowerCase()}function y(a,b,c){a=+a,b=b||1024;for(var d=0,f="number"==typeof b,g=1,h=e(c)?c:f?100:b.length;a>=g&&h>d;)g*=f?b:b[d],d++;return d&&g>a&&(g/=f?b:b.last(),d--),{value:d?a/g:a,level:d}}function z(a,d){if(d=d===!0?{all:!0}:d||{},isNaN(a)||a==b||0>a){var e=d.error||"--";return d.all?{text:e}:e}var f=y(a,d.steps,d.limit),g=f.value,h=g.toFixed(c(d.digit,2));return d.trim!==!1&&-1!=h.lastIndexOf(".")&&(h=h.replace(/\.?0+$/,"")),f.text=h+(d.join||"")+(d.units||H)[f.level+(d.start||0)],d.all?f:f.text}var A=Object.prototype.toString,B=Object.prototype.hasOwnProperty,C=Array.prototype.slice;g(Object,{forEach:function(a,b,c){for(var d in a)B.call(a,d)&&b.call(c,d,a[d],a)}}),g(Array.prototype,{forEach:function(a,b){for(var c=this,d=0,e=c.length;e>d;d++)d in c&&a.call(b,c[d],d,c)}}),g(Date,{now:function(){return+new Date}});var D;(a.ActiveXObject||a.msIndexedDB)&&(D=document.documentMode||(a.XMLHttpRequest?7:6)),a.JSON||(a.JSON={}),JSON.parse||(JSON.parse=h);var E,F;document.addEventListener?(E=function(a,b,c){a.addEventListener(b,c,!1)},F=function(a,b,c){a.removeEventListener(b,c,!1)}):document.attachEvent&&(E=function(a,b,c){a.attachEvent("on"+b,c)},F=function(a,b,c){a.detachEvent("on"+b,c)});var G=/^https?:\/\//i,H=["B","KB","MB","GB","TB","PB","EB"],I={def:c,isFunc:d,isUInt:e,fire:f,extend:g,ie:D,setOpacity:i,getOffset:j,walk:k,getPrev:l,getNext:m,getFirst:n,getLast:o,getChilds:p,createEle:q,parseHTML:r,isHttpURL:w,isSameHost:x,parseLevel:y,formatSize:z};D&&(I["ie"+(6>D?6:D)]=!0),I.event={fix:s,stop:v,trigger:u,add:t},a.Q=I}(window)}),define("dist/cmd-lib/upload/Q.Uploader",[],function(a,b,c){!function(a,b){"use strict";function c(a){m(L,a,!0)}function d(a){var b=j.Lang;switch(a){case F:return b.status_ready;case G:return b.status_processing;case H:return b.status_complete;case I:return b.status_skip;case J:return b.status_cancel;case K:return b.status_error}return a}function e(){var b=a.XMLHttpRequest;b&&(new b).upload&&a.FormData&&(z=!0);var c=document.createElement("input");c.type="file",A=!!c.files,B=z}function f(a,b){var c=a.lastIndexOf(b);return-1!=c?a.slice(c):""}function g(a){if(a){for(var b=a.split(","),c={},d=0,e=b.length;e>d;d++)c[b[d]]=!0;return c}}function h(a,b){a.attachEvent?a.attachEvent("onload",b):a.addEventListener("load",b,!1)}function i(a,b,c){if(b&&!(0>=b)){var d,e=Date.now();if(c>=b)return d=e-a.startTime,d?a.avgSpeed=Math.min(Math.round(1e3*b/d),b):a.speed||(a.avgSpeed=a.speed=b),a.time=d||0,void(a.endTime=e);d=e-a.lastTime,200>d||(a.speed=Math.min(Math.round(1e3*(c-a.loaded)/d),a.total),a.lastTime=e)}}function j(a){var b=this,c=a||{};b.guid=c.guid||"uploader"+ ++C,b.list=[],b.map={},b.index=0,b.started=!1,b.set(c)._init()}var k=Q.def,l=Q.fire,m=Q.extend,n=Q.getFirst,o=Q.getLast,p=JSON.parse,q=Q.createEle,r=Q.parseHTML,s=Q.setOpacity,t=Q.getOffset,u=Q.md5File,v=Q.event,w=v.add,x=v.trigger,y=v.stop,z=!1,A=!1,B=!1,C=0,D=0,E=0,F=0,G=1,H=2,I=-1,J=-2,K=-3,L={};j.prototype={constructor:j,set:function(a){var c=this,d=m(a,c.ops);c.url=d.url,c.dataType=d.dataType||"json",c.data=d.data,c.targets=d.target||[],c.targets.forEach||(c.targets=[c.targets]),c.target=c.targets[0],c.html5=z&&!!k(d.html5,!0),c.multiple=A&&c.html5&&!!k(d.multiple,!0),c.clickTrigger=B&&!!k(d.clickTrigger,!0),c.workerThread=c.html5?d.workerThread||1:1,c.workerIdle=c.workerThread,c.auto=d.auto!==!1,c.upName=d.upName||"upfile",c.accept=d.accept||d.allows,c.isDir=d.isDir,c.allows=g(d.allows),c.disallows=g(d.disallows),c.maxSize=+d.maxSize||0,c.isSlice=!!d.isSlice,c.chunkSize=+d.chunkSize||2097152,c.isQueryState=!!k(d.isQueryState,c.isSlice),c.isMd5=!!k(d.isMd5,c.isSlice),c.isUploadAfterHash=d.isUploadAfterHash!==!1,c.sliceRetryCount=d.sliceRetryCount==b?2:+d.sliceRetryCount||0,c.container=d.container||document.body,d.getPos&&(c.getPos=d.getPos);var e=d.UI||{};return e.init&&(c.init=e.init),e.draw&&(c.draw=e.draw),e.update&&(c.update=e.update),e.over&&(c.over=e.over),c.fns=d.on||{},c.ops=d,c.accept&&!c.clickTrigger&&c.resetInput(),c},_init:function(){var a=this;if(!a._inited){a._inited=!0;var c=a.guid,d=a.container,e=q("div","upload-input "+c);if(d.appendChild(e),a.boxInput=e,!a.html5){var f="upload_iframe_"+c,g='<iframe class="u-iframe" name="'+f+'"></iframe><form class="u-form" action="" method="post" enctype="multipart/form-data" target="'+f+'"></form>',i=q("div","upload-html4 "+c,g);d.appendChild(i);var j=n(i),k=o(i);a.iframe=j,a.form=k,h(j,function(){if(0==a.workerIdle){var c;try{c=j.contentWindow.document.body.innerHTML}catch(d){}a.complete(b,H,c)}})}return a.targets.forEach(function(b){a.clickTrigger?w(b,"click",function(b){a.fire("select",b)!==!1&&(a.resetInput(),x(a.inputFile,"click"))}):w(b,"mouseover",function(b){a.target=this,a.updatePos()})}),a.clickTrigger||(w(e,"click",function(b){a.fire("select",b)===!1&&y(b)}),s(e,0),a.resetInput()),a.fire("init"),a.run("init")}},resetInput:function(){var a=this,b=a.boxInput;if(!b)return a;b.innerHTML='<input type="file" name="'+a.upName+'"'+(a.accept?'accept="'+a.accept+'"':"")+(a.isDir?'webkitdirectory=""':"")+' style="'+(a.clickTrigger?"visibility: hidden;":"font-size:100px;")+'"'+(a.multiple?' multiple="multiple"':"")+">";var c=n(b);return w(c,"change",function(b){a.add(this),a.html5||a.resetInput()}),a.inputFile=c,a.updatePos()},updatePos:function(a){var b=this;if(b.clickTrigger)return b;var c=b.getPos||t,d=b.boxInput,e=n(d),f=b.target,g=f.offsetWidth,h=f.offsetHeight,i=0==g?{left:-1e4,top:-1e4}:c(f);return d.style.width=e.style.width=g+"px",d.style.height=e.style.height=h+"px",d.style.left=i.left+"px",d.style.top=i.top+"px",a&&(d.style.zIndex=++E),b},fire:function(a,b,c){if(!c)return l(this.fns[a],this,b);var d=this.fns[a+"Async"];return d?l(d,this,b,c):void c(l(this.fns[a],this,b))},run:function(a,b){var c=this[a];return c&&l(c,this,b),this},addTask:function(a,b){if(a||b){var c,d;b?(c=b.webkitRelativePath||b.name||b.fileName,d=0===b.size?0:b.size||b.fileSize):(c=f(a.value,"\\").slice(1)||a.value,d=-1);var e,g=this,h=f(c,".").toLowerCase();g.disallows&&g.disallows[h]||g.allows&&!g.allows[h]?e="ext":-1!=d&&g.maxSize&&d>g.maxSize&&(e="size");var i={id:++D,name:c,ext:h,size:d,input:a,file:b,state:e?I:F};return e&&(i.limited=e,i.disabled=!0),g.fire("add",i,function(a){a===!1||i.disabled||i.limited||(i.index=g.list.length,g.list.push(i),g.map[i.id]=i,g.run("draw",i),g.auto&&g.start())}),i}},add:function(a){var c=this;if("INPUT"==a.tagName){var d=a.files;if(d)for(var e=0,f=d.length;f>e;e++)c.addTask(a,d[e]);else c.addTask(a)}else c.addTask(b,a)},addList:function(a){for(var b=0,c=a.length;c>b;b++)this.add(a[b])},get:function(a){return a!=b?this.map[a]:void 0},cancel:function(a,b){var c=this,d=c.get(a);if(d){var e=d.state;if(e!=F&&e!=G)return c;if(e==G){var f=d.xhr;if(f)return f.abort(),c;c.iframe.contentWindow.location="about:blank"}return b?c:c.complete(d,J)}},remove:function(a){var b=this.get(a);b&&(b.state==G&&this.cancel(a),b.deleted=!0,this.fire("remove",b))},start:function(){var a=this,b=a.workerIdle,c=a.list,d=a.index,e=c.length;if(a.started||(a.started=!0),0>=e||d>=e||0>=b)return a;var f=c[d];return a.index++,a.upload(f)},upload:function(a){var b=this;return!a||a.state!=F||a.skip||a.deleted?b.start():(a.url=b.url,b.workerIdle--,b.fire("upload",a,function(c){return c===!1?b.complete(a,I):void(b.html5&&a.file?b._upload_html5_ready(a):a.input?b._upload_html4(a):b.complete(a,I))}),b)},_process_xhr_headers:function(a){var b=this.ops,c=function(b,c){a.setRequestHeader(b,c)};L.headers&&Object.forEach(L.headers,c),b.headers&&Object.forEach(b.headers,c)},queryState:function(a,c){var d=this,e=d.url,f=new XMLHttpRequest,g=["action=query","hash="+(a.hash||encodeURIComponent(a.name)),"fileName="+encodeURIComponent(a.name)];return-1!=a.size&&g.push("fileSize="+a.size),d._process_params(a,function(a,c){g.push(encodeURIComponent(a)+"="+(c!=b?encodeURIComponent(c):""))},"dataQuery"),a.queryUrl=e+(-1==e.indexOf("?")?"?":"&")+g.join("&"),d.fire("sliceQuery",a),f.open("GET",a.queryUrl),d._process_xhr_headers(f),f.onreadystatechange=function(){if(4==f.readyState){var b,e;if(f.status>=200&&f.status<400)if(b=f.responseText,"ok"===b?e={ret:1}:b&&(e=p(b)),e&&"number"!=typeof e||(e={ret:0,start:e}),a.response=b,a.json=e,1==e.ret)a.queryOK=!0,d.cancel(a.id,!0).complete(a,H);else{var g=+e.start||0;g!=Math.floor(g)&&(g=0),a.sliceStart=g}l(c,d,f)}},f.onerror=function(){l(c,d,f)},f.send(null),d},_upload_html5_ready:function(a){var b=this,c=function(){a.state!=H&&(b.isSlice?b._upload_slice(a):b._upload_html5(a))},d=function(c){b.fire("hash",a,function(){a.hash&&b.isQueryState&&a.state!=H?b.queryState(a,c):c()})},e=function(c){if(b.isMd5&&u){var e=b.fns.hashProgress;u(a.file,function(b,e){a.hash=b,a.timeHash=e,d(c)},function(c){l(e,b,a,c)})}else d(c)};return b.isUploadAfterHash?e(c):(c(),e()),b},_process_params:function(a,b,c){c=c||"data",L.data&&Object.forEach(L.data,b),this.data&&Object.forEach(this.data,b),a&&a[c]&&Object.forEach(a[c],b)},_upload_html5:function(a){var b=this,c=new XMLHttpRequest;a.xhr=c,c.upload.addEventListener("progress",function(c){b.progress(a,c.total,c.loaded)},!1),c.addEventListener("load",function(c){b.complete(a,H,c.target.responseText)},!1),c.addEventListener("error",function(){b.complete(a,K)},!1),c.addEventListener("abort",function(){b.complete(a,J)},!1);var d=new FormData;b._process_params(a,function(a,b){d.append(a,b)}),d.append(b.upName,a.blob||a.file,a.name),c.open("POST",a.url),b._process_xhr_headers(c),b.fire("send",a,function(e){return e===!1?b.complete(a,I):(c.send(d),void b._afterSend(a))})},_upload_html4:function(a){var b=this,c=b.form,d=a.input;return d._uploaded?b.complete(a,H):(d._uploaded=!0,d.name=b.upName,c.innerHTML="",c.appendChild(d),c.action=a.url,b._process_params(a,function(a,b){c.appendChild(r('<input type="hidden" name="'+a+'" value="'+b+'">'))}),void b.fire("send",a,function(d){return d===!1?b.complete(a,I):(c.submit(),void b._afterSend(a))}))},_afterSend:function(a){a.lastTime=a.startTime=Date.now(),a.state=G,this._lastTask=a,this.progress(a)},progress:function(a,b,c){b||(b=a.size),(!c||0>c)&&(c=0);var d=a.state||F;c>b&&(c=b),c>0&&d==F&&(a.state=d=G);var e=d==H;e&&(b=c=a.size),i(a,b,c),a.total=b,a.loaded=c,this.fire("progress",a),this.run("update",a)},_process_response:function(a,b){a.response=b,b&&"json"==this.dataType&&(a.json=p(b))},complete:function(a,c,d){var e=this;return a||1!=e.workerThread||(a=e._lastTask),a&&(c!=b&&(a.state=c),(a.state==G||c==H)&&(a.state=H,e.progress(a,a.size,a.size)),d!==b&&e._process_response(a,d)),e.run("update",a).run("over",a),c==J&&e.fire("cancel",a),e.fire("complete",a),e.workerIdle++,e.started&&e.start(),e}},j.extend=function(a,b){m(j.prototype,a,b)},e(),m(j,{support:{html5:z,multiple:A},READY:F,PROCESSING:G,COMPLETE:H,SKIP:I,CANCEL:J,ERROR:K,UI:{},Lang:{status_ready:"准备中",status_processing:"上传中",status_complete:"已完成",status_skip:"已跳过",status_cancel:"已取消",status_error:"已失败"},setup:c,getStatusText:d}),Q.Uploader=j}(window)}),define("dist/authentication/fixedTopBar",[],function(a,b,c){var d=$(".new-detail-header"),e=d.height();$(window).scroll(function(){var a=$(this).scrollTop();a-e>=0?d.addClass("new-detail-header-fix"):d.removeClass("new-detail-header-fix")})}),define("dist/authentication/msgVer",["dist/cmd-lib/toast"],function(a,b,c){a("dist/cmd-lib/toast");var d={validateFrom:/^1[3456789]\d{9}$/,phone:"",textCode:"",downCountNum:60,isDisableMsg:!1,avaliPhone:!1,smsId:"",valiPhone:function(){return console.log(this.phone),this.validateFrom.test(this.phone)},initial:function(){$(".js-submit").click(this.sendData),$(".js-msg").click(this.getTextCode),$(".js-phone").on("keyup",function(){d.phone=$(".js-phone").val().trim()})},getTextCode:function(){d.valiPhone()?d.avaliPhone=!0:$.toast({text:"请输入正确的手机号码",icon:"",delay:2e3,callback:!1}),!d.isDisableMsg&&d.avaliPhone&&(d.downCountLimt(),d.pictureVerify())},downCountLimt:function(){var a=this.downCountNum,b=this;d.isDisableMsg=!0,$(".js-msg").addClass("btn-send-code-no");var c=setInterval(function(){a--,$(".js-msg").text(a+"秒"),1>a&&(clearInterval(c),b.isDisableMsg=!1,$(".js-msg").removeClass("btn-send-code-no"),$(".js-msg").text("获取验证码"))},1e3)},pictureVerify:function(a,b,c,e){var f={mobile:d.phone,nationCode:"86",businessCode:"6",terminal:"pc",appId:a,randstr:b,ticket:c,onOff:e};f=JSON.stringify(f),$.ajax("/gateway/cas/sms/sendSms",{type:"POST",data:f,contentType:"application/json"}).done(function(a){"0"==a.code?(d.smsId=a.data.smsId,$(".js-msg").attr("smsId",a.data.smsId),$.toast({text:a.msg,icon:"",delay:2e3,callback:!1})):"2112"==a.code?d.showCaptchaProcess(d.pictureVerify):$.toast({text:a.msg,icon:"",delay:2e3,callback:!1})}).fail(function(a){console.log("error==="+a)})},showCaptchaProcess:function(a){d.showCaptcha(a)},showCaptcha:function(a){var b,c="2071307690";b||(b=new TencentCaptcha(c,d.captCallback,{bizState:a})),b.show()},captCallback:function(a){0===a.ret&&a.bizState(a.appid,a.randstr,a.ticket,1)}};d.initial()}),define("dist/cmd-lib/toast",[],function(a,b,c){!function(a,b,c){function d(b){this.options={text:"我是toast提示",icon:"",delay:3e3,callback:!1},b&&a.isPlainObject(b)&&a.extend(!0,this.options,b),this.init()}d.prototype.init=function(){var b=this;b.body=a("body"),b.toastWrap=a('<div class="ui-toast" style="position:fixed;width:200px;height:60px;line-height:60px;text-align:center;background:#000;opacity:0.8;filter:alpha(opacity=80);top:40%;left:50%;margin-left:-100px;margin-top:-30px;border-radius:4px;z-index:10000">'),b.toastIcon=a('<i class="icon"></i>'),b.toastText=a('<span class="ui-toast-text" style="color:#fff">'+b.options.text+"</span>"),b._creatDom(),b.show(),b.hide()},d.prototype._creatDom=function(){var a=this;a.options.icon&&a.toastWrap.append(a.toastIcon.addClass(a.options.icon)),a.toastWrap.append(a.toastText),a.body.append(a.toastWrap)},d.prototype.show=function(){var a=this;setTimeout(function(){a.toastWrap.removeClass("hide").addClass("show")},50)},d.prototype.hide=function(){var a=this;setTimeout(function(){a.toastWrap.removeClass("show").addClass("hide"),a.toastWrap.remove(),a.options.callback&&a.options.callback()},a.options.delay)},a.toast=function(a){return new d(a)}}($,window,document)}),define("dist/cmd-lib/util",[],function(a,b,c){var d={throttle:function(a,b){var c,d;return function(e){var f=this,g=arguments,h=+new Date;c&&c+b>h?(clearTimeout(d),d=setTimeout(function(){c=h,a.apply(f,g)},b)):(c=h,a.apply(f,g))}},debounce:function(a,b){var c=0,d=this;return function(e){c&&clearTimeout(c),c=setTimeout(function(){a.apply(d,e)},b)}},isWeChatBrow:function(){var a=navigator.userAgent.toLowerCase(),b=-1!=a.indexOf("micromessenger");return b?!0:!1},getWebAppUA:function(){var a=0,b=navigator.userAgent.toLowerCase();return/iphone|ipad|ipod/.test(b)?a=1:/android/.test(b)&&(a=0),a},validateIE8:function(){return!$.browser.msie||"8.0"!=$.browser.version&&"7.0"!=$.browser.version&&"6.0"!=$.browser.version?!1:!0},validateIE9:function(){return!$.browser.msie||"9.0"!=$.browser.version&&"8.0"!=$.browser.version&&"7.0"!=$.browser.version&&"6.0"!=$.browser.version?!1:!0},getReferrer:function(){var a=document.referrer,b="";return/https?\:\/\/[^\s]*wenku.so.com.*$/g.test(a)?b="360wenku":/https?\:\/\/[^\s]*so.com.*$/g.test(a)?b="360":/https?\:\/\/[^\s]*baidu.com.*$/g.test(a)?b="baidu":/https?\:\/\/[^\s]*sogou.com.*$/g.test(a)?b="sogou":/https?\:\/\/[^\s]*sm.cn.*$/g.test(a)?b="sm":/https?\:\/\/[^\s]*ishare.iask.sina.com.cn.*$/g.test(a)?b="ishare":/https?\:\/\/[^\s]*iask.sina.com.cn.*$/g.test(a)&&(b="iask"),b},getPageRef:function(a){var b=this,c=0;return(b.is360cookie(a)||b.is360cookie("360"))&&(c=1),b.is360wkCookie()&&(c=3),c},is360cookie:function(a){var b=this,c=b.getCookie("_r_so");if(c)for(var d=c.split("_"),e=0;e<d.length;e++)if(d[e]==a)return!0;return!1},add360wkCookie:function(){this.setCookieWithExpPath("_360hz","1",18e5,"/")},is360wkCookie:function(){return null==getCookie("_360hz")?!1:!0},getCookie:function(a){var b=document.cookie.match(new RegExp("(^| )"+a+"=([^;]*)(;|$)"));return null!==b?unescape(b[2]):null},setCookieWithExpPath:function(a,b,c,d){var e=new Date;e.setTime(e.getTime()+c),document.cookie=a+"="+escape(b)+";path="+d+";expires="+e.toGMTString()},findRefer:function(){var a=document.referrer,b="other";return/https?\:\/\/[^\s]*\/f\/.*$/g.test(a)?b="pindex":/https?\:\/\/[^\s]*\/d\/.*$/g.test(a)?b="landing":/https?\:\/\/[^\s]*\/c\/.*$/g.test(a)?b="pcat":/https?\:\/\/[^\s]*\/search\/.*$/g.test(a)?b="psearch":/https?\:\/\/[^\s]*\/t\/.*$/g.test(a)?b="ptag":/https?\:\/\/[^\s]*\/[u|n]\/.*$/g.test(a)?b="popenuser":/https?\:\/\/[^\s]*\/ucenter\/.*$/g.test(a)?b="puser":/https?\:\/\/[^\s]*ishare.iask.sina.com.cn.$/g.test(a)?b="ishareindex":/https?\:\/\/[^\s]*\/theme\/.*$/g.test(a)?b="theme":/https?\:\/\/[^\s]*wenku.so.com.*$/g.test(a)?b="360wenku":/https?\:\/\/[^\s]*so.com.*$/g.test(a)?b="360":/https?\:\/\/[^\s]*baidu.com.*$/g.test(a)?b="baidu":/https?\:\/\/[^\s]*sogou.com.*$/g.test(a)?b="sogou":/https?\:\/\/[^\s]*sm.cn.*$/g.test(a)?b="sm":/https?\:\/\/[^\s]*ishare.iask.sina.com.cn.*$/g.test(a)?b="ishare":/https?\:\/\/[^\s]*iask.sina.com.cn.*$/g.test(a)&&(b="iask"),b},showAlertDialog:function(a,b,c){var d=$(".common-bgMask"),e=$(".common-dialog");e.find("h2[name='title']").text(a),e.find("span[name='content']").html(b),e.find("a.close,a.btn-dialog").unbind("click").click(function(){d.hide(),e.hide(),c&&!$(this).hasClass("close")&&c()}),d.show(),e.show()},browserVersion:function(a){var b=a.indexOf("Opera")>-1,c=a.indexOf("compatible")>-1&&a.indexOf("MSIE")>-1&&!b,d=a.indexOf("Edge")>-1,e=a.indexOf("Firefox")>-1,f=a.indexOf("Safari")>-1&&-1===a.indexOf("Chrome"),g=a.indexOf("Chrome")>-1&&a.indexOf("Safari")>-1;if(c){var h=new RegExp("MSIE (\\d+\\.\\d+);");h.test(a);var i=parseFloat(RegExp.$1);return 7===i?"IE7":8===i?"IE8":9===i?"IE9":10===i?"IE10":11===i?"IE11":12===i?"IE12":"IE"}return b?"Opera":d?"Edge":e?"Firefox":f?"Safari":g?"Chrome":"unKnow"},getBrowserInfo:function(a){var b={},c=a.toLowerCase(),d=/(msie|firefox|chrome|opera|version|trident).*?([\d.]+)/,e=c.match(d);return e&&e.length>=2?(b.browser=e[1].replace(/version/,"'safari")||"unknow",b.ver=e[2]||"1.0.0"):(b.browser="unknow",b.ver="1.0.0"),b.browser+"/"+b.ver},timeFormat:function(a,b){if(!b)return"";var c=new Date(b),d=c.getFullYear(),e=c.getMonth()+1,f=c.getDate(),g=c.getHours(),h=c.getMinutes(),i=c.getSeconds();return 10>e&&(e+="0"),10>f&&(f+="0"),10>g&&(g+="0"),10>h&&(h+="0"),10>i&&(i+="0"),"yyyy-mm-dd"===a?d+"-"+e+"-"+f:d+"-"+e+"-"+f+" "+g+":"+h+":"+i}};c.exports=d}),define("dist/application/effect",["dist/application/checkLogin","dist/application/api","dist/application/method","dist/application/method"],function(a,b,c){function d(a,b){!f.getCookie("cuk")&&b?e.notifyLoginInterface(function(b){a&&a(b),i(b)}):f.getCookie("cuk")&&e.getLoginData(function(b){a&&a(b),i(b)})}var e=a("dist/application/checkLogin"),f=a("dist/application/method");$(".unLogin").on("click",function(){e.notifyLoginInterface(function(a){i(a)})}),$(".login-text").on("click",function(){e.notifyLoginInterface(function(a){i(a)})}),$(".js-sync").on("click",function(){e.syncUserInfoInterface(function(a){i(a)})}),$(".btn-exit").on("click",function(){e.ishareLogout()}),$(".js-buy-open").click(function(){"vip"==$(this).attr("data-type")&&(location.href="/pay/vip.html")}),$(".vip-join-con").click(function(){f.compatibleIESkip("/node/rights/vip.html",!0)}),$(".btn-new-search").click(function(){var a=$(".new-input").val()?$(".new-input").val().replace(/^\s+|\s+$/gm,""):$(".new-input").attr("placeholder");a&&f.compatibleIESkip("/search/home.html?ft=all&cond="+encodeURIComponent(encodeURIComponent(a)),!0)}),$(".new-input").on("keydown",function(a){if(13===a.keyCode){var b=$(".new-input").val()?$(".new-input").val().replace(/^\s+|\s+$/gm,""):$(".new-input").attr("placeholder");b&&f.compatibleIESkip("/search/home.html?ft=all&cond="+encodeURIComponent(encodeURIComponent(b)),!0)}});var g=$(".new-detail-header"),h=g.height();$(window).scroll(function(){var a=$(this).scrollTop();a-h>=0?g.addClass("new-detail-header-fix"):g.removeClass("new-detail-header-fix")});var i=function(a){var b=$("#unLogin"),c=$("#haveLogin"),d=$(".btn-user-more"),e=$(".vip-status"),g=($(".icon-iShare"),$(".top-user-more"));d.text(1==a.isVip?"续费":"开通");var h=null;"6"===f.getCookie("file_state")&&$(".vip-title").eq(0).show(),1==a.isVip?(h=e.find('p[data-type="2"]'),h.find(".expire_time").html(a.expireTime),h.show().siblings().hide(),g.addClass("top-vip-more"),$(".isVip-show").find("span").html(a.expireTime),$(".isVip-show").removeClass("hide")):1==a.userType?(h=e.find('p[data-type="3"]'),c.removeClass("user-con-vip"),h.show().siblings().hide()):0==a.isVip?c.removeClass("user-con-vip"):2==a.isVip&&$(".vip-title").hide(),b.hide(),c.find(".user-link .user-name").html(a.nickName),c.find(".user-link img").attr("src",a.weiboImage),c.find(".top-user-more .name").html(a.nickName),c.find(".top-user-more img").attr("src",a.weiboImage),c.show(),window.pageConfig.params.isVip=a.isVip;var i=a.fileDiscount;i?i/=100:i=.8,window.pageConfig.params.fileDiscount=i,$("#ip-uid").val(a.userId),$("#ip-isVip").val(a.isVip),$("#ip-mobile").val(a.mobile)};return{refreshTopBar:i,isLogin:d}}),define("dist/application/checkLogin",["dist/application/api","dist/application/method"],function(a,b,c){var d=a("dist/application/api"),e=a("dist/application/method"),d=a("dist/application/api");c.exports={getIds:function(){var a=window.pageConfig&&window.pageConfig.params?window.pageConfig.params:null,b=window.pageConfig&&window.pageConfig.access?window.pageConfig.access:null,c=[];a&&(a.classid1&&c.push(a.classid1),a.classid2&&c.push(a.classid2),a.classid3&&c.push(a.classid3));var d=a&&c.length>0?c.join("-"):"",e=b?b.fileId||a.g_fileId||"":"",f=window.pageConfig&&window.pageConfig.classIds?window.pageConfig.classIds:"";return!d&&(d=f),{clsId:d,fid:e}},notifyLoginInterface:function(a){var b=this;if(!e.getCookie("cuk")){var c=window.pageConfig&&window.pageConfig.page?window.pageConfig.page.ptype||"index":"index";$.loginPop("login",{terminal:"PC",businessSys:"ishare",domain:document.domain,ptype:c,clsId:this.getIds().clsId,fid:this.getIds().fid},function(c){b.getLoginData(a)})}},listenLoginStatus:function(a){var b=this;$.loginPop("login_wx_code",{terminal:"PC",businessSys:"ishare",domain:document.domain,ptype:"ishare",popup:"hidden",clsId:this.getIds().clsId,fid:this.getIds().fid},function(){b.getLoginData(a)})},notifyCheckInterface:function(){e.getCookie("cuk")&&$.loginPop("checkCode",{terminal:"PC",businessSys:"ishare",domain:document.domain,clsId:this.getIds().clsId,fid:this.getIds().fid},function(a){"0"==a.code&&e.get(d.user.getJessionId,function(a){},"")})},syncUserInfoInterface:function(a){var b=this;e.getCookie("cuk")&&e.get(d.user.getJessionId,function(c){0==c.code&&b.getLoginData(a)},"")},getUserData:function(a){e.getCookie("cuk")&&e.get(d.coupon.querySeniority,function(b){b&&0==b.code&&a(b.data)},"")},getLoginData:function(a){var b=this;try{e.get(d.user.login,function(c){if(0==c.code&&c.data){if(a&&"function"==typeof a){a(c.data);try{window.pageConfig.params.isVip=c.data.isVip,window.pageConfig.page.uid=c.data.userId}catch(d){}}try{var f={uid:c.data.userId,isVip:c.data.isVip,tel:c.data.mobile};e.setCookieWithExpPath("ui",JSON.stringify(f),18e5,"/")}catch(g){}}else 40001==c.code&&b.ishareLogout()})}catch(c){console.log(c)}},ishareLogout:function(){e.delCookie("cuk","/",".sina.com.cn"),e.delCookie("cuk","/",".iask.com.cn"),e.delCookie("cuk","/",".iask.com"),e.delCookie("sid","/",".iask.sina.com.cn"),e.delCookie("sid","/",".iask.com.cn"),e.delCookie("sid","/",".sina.com.cn"),e.delCookie("sid","/",".ishare.iask.com.cn"),e.delCookie("sid","/",".office.iask.com"),e.delCookie("sid_ishare","/",".iask.sina.com.cn"),e.delCookie("sid_ishare","/",".iask.com.cn"),e.delCookie("sid_ishare","/",".sina.com.cn"),e.delCookie("sid_ishare","/",".ishare.iask.com.cn"),e.delCookie("_1st_l","/"),e.delCookie("ui","/"),$.get(d.user.loginOut,function(a){console.log("loginOut:",a),0==a.code&&(window.location.href=window.location.href)})}}}),define("dist/application/api",[],function(a,b,c){var d="/gateway/pc",e="/gateway";c.exports={user:{getUserInfo:"/node/api/getUserInfo",login:d+"/usermanage/checkLogin",loginOut:e+"/pc/usermanage/logout",collect:d+"/usermanage/collect",newCollect:e+"/content/collect/getUserFileList",getJessionId:d+"/usermanage/getJessionId",getSessionInfo:d+"/usermanage/getSessionInfo",addFeedback:e+"/feedback/addFeedback",getFeedbackType:e+"/feedback/getFeedbackType",sendSms:e+"/cas/sms/sendSms",queryBindInfo:e+"/cas/user/queryBindInfo",thirdCodelogin:e+"/cas/login/thirdCode",userBindMobile:e+"/cas/user/bindMobile",checkIdentity:e+"/cas/sms/checkIdentity",userBindThird:e+"/cas/user/bindThird",untyingThird:e+"/cas/user/untyingThird",
setUpPassword:e+"/cas/user/setUpPassword",getUserCentreInfo:e+"/user/getUserCentreInfo",editUser:e+"/user/editUser",getFileBrowsePage:e+"/content/fileBrowse/getFileBrowsePage",getDownloadRecordList:e+"/content/getDownloadRecordList",getUserFileList:e+"/content/collect/getUserFileList",getMyUploadPage:e+"/content/getMyUploadPage",getOtherUser:e+"/user/getOthersCentreInfo",getSearchList:e+"/search/content/byCondition"},normalFileDetail:{addComment:d+"/fileSync/addComment",reportContent:d+"/fileSync/addFeedback",isStore:d+"/fileSync/getFileCollect",collect:d+"/fileSync/collect",filePreDownLoad:e+"/content/getPreFileDownUrl",fileDownLoad:d+"/action/downloadUrl",getFileDownLoadUrl:e+"/content/getFileDownUrl",appraise:d+"/fileSync/appraise",getPrePageInfo:d+"/fileSync/prePageInfo",hasDownLoad:d+"/fileSync/isDownload"},officeFileDetail:{},search:{byPosition:d+"/operating/byPosition",specialTopic:e+"/search/specialTopic/lisPage"},sms:{getCaptcha:d+"/usermanage/getSmsYzCode",sendCorpusDownloadMail:e+"/content/fileSendEmail/sendCorpusDownloadMail"},pay:{successBuyDownLoad:d+"/action/downloadNow",bindUser:d+"/order/bindUser",scanOrderInfo:e+"/order/scan/orderInfo"},coupon:{rightsSaleVouchers:e+"/rights/sale/vouchers",rightsSaleQueryPersonal:e+"/rights/sale/queryPersonal",querySeniority:e+"/rights/sale/querySeniority",queryUsing:e+"/rights/sale/queryUsing",getMemberPointRecord:e+"/rights/vip/getMemberPointRecord",getBuyRecord:e+"/rights/vip/getBuyRecord"},order:{bindOrderByOrderNo:d+"/order/bindOrderByOrderNo",unloginOrderDown:d+"/order/unloginOrderDown",createOrderInfo:e+"/order/create/orderInfo",rightsVipGetUserMember:e+"/rights/vip/getUserMember",getOrderStatus:e+"/order/get/orderStatus",queryOrderlistByCondition:e+"/order/query/listByCondition",getOrderInfo:e+"/order/get/orderInfo"},getHotSearch:d+"/search/getHotSearch",special:{fileSaveOrupdate:e+"/comment/collect/fileSaveOrupdate",getCollectState:e+"/comment/zc/getUserFileZcState",setCollect:e+"/content/collect/file"},upload:{getCategory:e+"/content/category/getSimplenessInfo",createFolder:e+"/content/saveUserFolder",getFolder:e+"/content/getUserFolders",saveUploadFile:e+"/content/webUploadFile",batchDeleteUserFile:e+"/content/batchDeleteUserFile"},recommend:{recommendConfigInfo:e+"/recommend/config/info",recommendConfigRuleInfo:e+"/recommend/config/ruleInfo"},reportBrowse:{fileBrowseReportBrowse:e+"/content/fileBrowse/reportBrowse"}}}),define("dist/application/method",[],function(require,exports,module){return{keyMap:{ishare_detail_access:"ISHARE_DETAIL_ACCESS",ishare_office_detail_access:"ISHARE_OFFICE_DETAIL_ACCESS"},async:function(a,b,c,d,e){$.ajax(a,{type:d||"post",data:e,async:!1,dataType:"json",headers:{"cache-control":"no-cache",Pragma:"no-cache"}}).done(function(a){b&&b(a)}).fail(function(a){console.log("error==="+c)})},get:function(a,b,c){$.ajaxSetup({cache:!1}),this.async(a,b,c,"get")},post:function(a,b,c,d,e){this.async(a,b,c,d,e)},postd:function(a,b,c){this.async(a,b,!1,!1,c)},random:function(a,b){return Math.floor(Math.random()*(b-a))+a},setCookieWithExpPath:function(a,b,c,d){var e=new Date;e.setTime(e.getTime()+c),document.cookie=a+"="+escape(b)+";path="+d+";expires="+e.toGMTString()},setCookieWithExp:function(a,b,c,d){var e=new Date;e.setTime(e.getTime()+c),d?document.cookie=a+"="+escape(b)+";path="+d+";expires="+e.toGMTString():document.cookie=a+"="+escape(b)+";expires="+e.toGMTString()},getCookie:function(a){var b=document.cookie.match(new RegExp("(^| )"+a+"=([^;]*)(;|$)"));return null!==b?unescape(b[2]):null},delCookie:function(a,b,c){var d=new Date;d.setTime(d.getTime()-1);var e=this.getCookie(a);null!=e&&(b&&c?document.cookie=a+"= '' ;domain="+c+";expires="+d.toGMTString()+";path="+b:b?document.cookie=a+"= '' ;expires="+d.toGMTString()+";path="+b:document.cookie=a+"="+e+";expires="+d.toGMTString())},getQueryString:function(a){var b=new RegExp("(^|&)"+a+"=([^&]*)(&|$)","i"),c=window.location.search.substr(1).match(b);return null!=c?unescape(c[2]):null},url2Obj:function(a){for(var b={},c=a.split("?"),d=c[1].split("&"),e=0;e<d.length;e++){var f=d[e].split("=");b[f[0]]=f[1]}return b},getParam:function(a){a=a.replace(/[\[]/,"\\[").replace(/[\]]/,"\\]");var b="[\\?&]"+a+"=([^&#]*)",c=new RegExp(b),d=c.exec(window.location.href);return null==d?"":decodeURIComponent(d[1].replace(/\+/g," "))},getLocalData:function(a){try{if(localStorage&&localStorage.getItem){var b=localStorage.getItem(a);return null===b?null:JSON.parse(b)}return console.log("浏览器不支持html localStorage getItem"),null}catch(c){return null}},setLocalData:function(a,b){localStorage&&localStorage.setItem?(localStorage.removeItem(a),localStorage.setItem(a,JSON.stringify(b))):console.log("浏览器不支持html localStorage setItem")},browserType:function(){var a=navigator.userAgent,b=a.indexOf("Opera")>-1;return b?"Opera":a.indexOf("compatible")>-1&&a.indexOf("MSIE")>-1&&!b?"IE":a.indexOf("Edge")>-1?"Edge":a.indexOf("Firefox")>-1?"Firefox":a.indexOf("Safari")>-1&&-1===a.indexOf("Chrome")?"Safari":a.indexOf("Chrome")>-1&&a.indexOf("Safari")>-1?"Chrome":void 0},validateIE9:function(){return!(!$.browser.msie||"9.0"!==$.browser.version&&"8.0"!==$.browser.version&&"7.0"!==$.browser.version&&"6.0"!==$.browser.version)},compareTime:function(a,b){return a&&b?Math.abs((b-a)/1e3/60/60/24):""},changeURLPar:function(url,arg,arg_val){var pattern=arg+"=([^&]*)",replaceText=arg+"="+arg_val;if(url.match(pattern)){var tmp="/("+arg+"=)([^&]*)/gi";return tmp=url.replace(eval(tmp),replaceText)}return url.match("[?]")?url+"&"+replaceText:url+"?"+replaceText},getUrlAllParams:function(a){if("undefined"==typeof a)var b=decodeURI(location.search);else var b="?"+a.split("?")[1];var c=new Object;if(-1!=b.indexOf("?"))for(var d=b.substr(1),e=d.split("&"),f=0;f<e.length;f++)c[e[f].split("=")[0]]=decodeURI(e[f].split("=")[1]);return c},getQueryString:function(a){var b=new RegExp("(^|&)"+a+"=([^&]*)(&|$)","i"),c=window.location.search.substr(1).match(b);return null!=c?unescape(c[2]):null},compatibleIESkip:function(a,b){var c=document.createElement("a");c.href=a,c.style.display="none",b&&(c.target="_blank"),document.body.appendChild(c),c.click()},testEmail:function(a){var b=/^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;return b.test(a)?!0:!1},testPhone:function(a){return/^1(3|4|5|7|8)\d{9}$/.test(a)?!0:!1},handleRecommendData:function(a){var b=[];return a.forEach(function(a){var c={};1==a.type&&(a.linkUrl="/f/"+a.tprId+".html",c=a),2==a.type&&(c=a),3==a.type&&(a.linkUrl="/node/s/"+a.tprId+".html",c=a),b.push(c)}),console.log(b),b},formatDate:function(a){var b={"M+":this.getMonth()+1,"d+":this.getDate(),"h+":this.getHours(),"m+":this.getMinutes(),"s+":this.getSeconds(),"q+":Math.floor((this.getMonth()+3)/3),S:this.getMilliseconds()};/(y+)/.test(a)&&(a=a.replace(RegExp.$1,(this.getFullYear()+"").substr(4-RegExp.$1.length)));for(var c in b)new RegExp("("+c+")").test(a)&&(a=a.replace(RegExp.$1,1==RegExp.$1.length?b[c]:("00"+b[c]).substr((""+b[c]).length)));return a}}});