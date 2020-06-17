define(function (require,exports,moudle) {
    var slider = require('../common/slider');//轮播插件
    var right = require('../common/right');
    var method = require("../application/method");
    var login = require("../application/checkLogin");
    var api = require("../application/api");
    // require('../common/bilog');
    /**
     * 推荐多图点击轮播
     * @type {{moreIndex: number, init: init, distance: number, domRend: domRend, index: number, slideLeft: slideLeft, slideRight: slideRight}}
     */
    var recomandSlide = {
        index:0,
        distance:0,
        moreIndex:0,
        init:function () {
            recomandSlide.moreIndex=$('.recommend-item').length-4;
            recomandSlide.slideLeft();
            recomandSlide.slideRight();
        },
        slideLeft:function () {
            $('.nextArrow').click(function () {
                if(recomandSlide.moreIndex>0 && recomandSlide.index<recomandSlide.moreIndex){
                    recomandSlide.index++;
                    recomandSlide.domRend();
                }
            })

        },
        slideRight:function () {
            $('.preArrow').click(function () {
                if(recomandSlide.index>0){
                    recomandSlide.index--;
                    recomandSlide.domRend();
                }
            })
        },
        domRend:function () {
            var num = -1*recomandSlide.index*312+'px';
           $('.swiper-wrapper') .animate({'margin-left':num})
        }


    }
    setTimeout(function () {
        recomandSlide.init();
    },1000)

    //判断页面是否大于屏幕高度
    function pageHeight(){
        var winH = $(window).height();
        var pageH = $("body").height();
        if(winH > pageH){
            $(".office-footer").addClass("office-footer-fix");
        }else{
            $(".office-footer").removeClass("office-footer-fix");
        }
    }

    /**
     * tabs
     * @param tabNav
     * @param tabItem
     * @param tabCon
     * @param tabEvent
     */
    function tabs(tabNav,tabItem,tabCon,tabEvent){
        var index = 0;
        if(tabEvent === true){
            $(tabNav).find(tabItem).mouseover(function(){
                index = $(tabNav).index(this);
                tabsFun(index,tabNav,tabCon);

            })
        }else{
            $(tabNav).find(tabItem).click(function(){
                index = $(this).index()
                tabsFun(index,tabItem,tabCon,this);
            })
        }
    }

    function tabsFun(index,tabItem,tabCon,that){
        $(that).parent().parent().parent().find(tabItem).removeClass("current").eq(index).addClass("current");
        $(that).parent().parent().parent().find(tabCon).removeClass("current").eq(index).addClass("current");
    }

    tabs('.item-nav','.nav-ele','.office-list',false);

    //hover
    /**
     *
     * @param ele
     * @param eleShow
     * @param hover
     */
    function elementHover(ele,eleShow,hover){
        $(ele).hover(
            function(){
                $(this).addClass(hover);
                $(eleShow).fadeIn("slow");
            },
            function(){
                $(this).removeClass(hover);
                $(eleShow).fadeOut("slow");
            }
        );
    }
    //办公分类展开
    elementHover(".category-item",null,"category-on");
    //办公轮播图
    new slider("J_office_banner","J_office_focus","J_office_prev","J_office_next");

    //首页列表图片触及
    elementHover(".office-list li .data-pic",null,"data-pic-hover");
    //办公返回顶部
    // backToTop(".office-back-top");
    //榜单分段控件
    elementHover(".control-nav-con .more-ele",null,"more-ele-hover");

    $('.none-btn').on('click', function () {
        var cond = encodeURIComponent(encodeURIComponent($(this).attr('data-cond')));
        window.location.href = '/search/home.html?ft=all&cond=' + cond;
    });

     // 展示更多
    $('.seo-upload-new .show-more').click(function () {
        $(this).parent().parent().css({'height':'auto'});
        $(this).parent().hide()
    })
})