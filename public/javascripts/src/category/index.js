define(function (require, exports, module) {
    require("./fixedTopBar");
    require('../application/suspension')
    var slider = require('../common/slider');//轮播插件
    var utils = require("../cmd-lib/util");
    var login = require("../application/checkLogin");
    var refreshTopBar = require("./login");
    var obj = {
        reqParams: pageConfig.reqParams,
        init:function(){
            new slider("J_categoty_banner");
            new slider("j-rightBanner")
            this.selectMenu();
            this.pageOperate();
            this.fomatSelect();
            this.sortSelect();
             // 登录
             $('.user-login,.login-open-vip').on('click', function () {
                if (!utils.getCookie('cuk')) {
                    login.notifyLoginInterface(function (data) {
                        refreshTopBar(data)
                    });
                }
            });
            // 退出登录
            $('.btn-exit').click(function(){
                login.ishareLogout()
            })
            // 头部搜索跳转
            $('.btn-new-search').click(function(){
                var searVal = $('#search-detail-input').val()
                window.open('/search/home.html'+ '?' + 'ft=all' + '&cond='+ encodeURIComponent(encodeURIComponent(searVal)))
            }) 
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