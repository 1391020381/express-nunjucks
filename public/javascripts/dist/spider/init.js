/*! ishare_pc_website
*author:Jersey */

define("dist/spider/init",["./fixedTopBar"],function(a,b,c){a("./fixedTopBar");var d={init:function(){this.switchRec()},switchRec:function(){$(".recmend-tab").on("click",".tab-item",function(){$(this).addClass("current").siblings().removeClass("current");var a=$(this).index();$(".switch_content_wrap").eq(a).addClass("current").siblings().removeClass("current")})},reloadPage:function(a){location.href=location.origin+location.pathname+"?type="+a}};d.init()}),define("dist/spider/fixedTopBar",[],function(a,b,c){var d=$(".new-detail-header"),e=d.height();$(window).scroll(function(){var a=$(this).scrollTop();a-e>=0?d.addClass("new-detail-header-fix"):d.removeClass("new-detail-header-fix")})});
//# sourceMappingURL=dist/js-source-map/ishare-web-pc.js.map