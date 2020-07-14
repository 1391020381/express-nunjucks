define(function (require, exports, module) {
    require("./fixedTopBar");
    require('../application/suspension')
    var slider = require('../common/slider');//轮播插件
    var utils = require("../cmd-lib/util");
    var isLogin = require('../application/effect.js').isLogin;
    var isAutoLogin = false;
    var callback = null;
    isLogin(callback,isAutoLogin);

    var obj = {
        reqParams: pageConfig.reqParams,
        init:function(){
            new slider("J_categoty_banner","J_categoty_focus","J_categoty_prev","J_categoty_next");
            new slider("j-rightBanner","J_right_focus","J_right__prev","J_right__next")
            this.selectMenu();
            this.pageOperate();
            this.fomatSelect();
            this.sortSelect();
        },
        selectMenu:function(){
            $('.js-nav-menu').click(function(){
                $(this).parent().toggleClass('selected')
            })
        },
        pageOperate:function(){
            $('.page-ele').on('click',function(){
                var currentPage = $(this).attr('value');
                obj.pageNavigate(currentPage);
            })
            $('.js-first-page').on('click',function(){
                obj.pageNavigate(1);
            })
            $('.js-previous-btn').on('click',function(){
                var page = obj.reqParams.currentPage -1
                obj.pageNavigate(page);
            })
            $('.js-next-btn').on('click',function(){
                var page = Number(obj.reqParams.currentPage)+1
                obj.pageNavigate(page);
            })
            $('.js-end-btn').on('click',function(){
                var page = obj.reqParams.totalPages
                obj.pageNavigate(page);
            })
        },
        fomatSelect:function(){
            $('.js-fomat').on('click','.search-ele',function(){
                $(this).addClass('active').siblings().removeClass('active');
                var fomat = $(this).attr('data-type');
                var sortField =obj.reqParams.sortField?'-'+obj.reqParams.sortField:'';
                var pageUrl = location.origin +'/c/'+ obj.reqParams.cid+'-'+fomat+'-p1'+sortField+'.html';
                location.href = pageUrl;
            })
           
        },
        sortSelect:function(){
            $('.js-sort').on('click','.screen-ele',function(){
                $(this).addClass('current').siblings().removeClass('current');
                var sortField =$(this).attr('value')?'-'+$(this).attr('value'):'';
                var fomat = obj.reqParams.fileType?obj.reqParams.fileType:'all';
                var pageUrl = location.origin +'/c/'+ obj.reqParams.cid+'-'+fomat+'-p1'+sortField+'.html';
                location.href = pageUrl;
            })
        },
        pageNavigate:function(page) {
            var fomat = obj.reqParams.fileType?obj.reqParams.fileType:'all';
            var page = 'p'+page;
            var sortField =obj.reqParams.sortField?'-'+obj.reqParams.sortField:'';
            var pageUrl = location.origin +'/c/'+ obj.reqParams.cid+'-'+fomat+'-'+page+sortField+'.html';
            location.href = pageUrl;
        }
    }
    obj.init()
});