/**
 * @Description:
 * tab选项  defaultIndex:默认项  event:事件
 * activeClass:选中class  is_slide:是否可滑动
 * lazy : 默认点击图片不懒加载
 * @Author: your name
 */

define(function(require, exports, module) {
    //var $ = require("$");
    (function($,doc,win){
        $.fn.extend({   
            tab:function(params){
                var config = {
                    defaultIndex : 0,
                    event : 'click',
                    activeClass : 'active',
                    is_slide : false ,
                    data_attribute : 'src' ,
                    lazy : false ,
                    element : 'ul',
                    callback:false
                }

                var that = this;

                var options = $.extend(true , config , params),
                    winHeight = $(window).outerWidth();
                var tab = $(this).find('.ui-tab-nav-item'),
                    tabContent = $(this).find('.ui-tab-content');
                
                //是否有默认选项值
                if(config.defaultIndex){
                    tab.removeClass(config.activeClass).eq(config.defaultIndex).addClass(config.activeClass);
                    tabContent.children(options.element).eq(config.defaultIndex).show().siblings().hide();
                }

                //滑动
                if(options.is_slide){
                    tabContent.addClass('swiper-wrapper').children(options.element).show();
                }

                tab.on(options.event , function(){
                    var index = $(this).index();
                    $(this).addClass( options.activeClass ).siblings().removeClass( options.activeClass );
                    if(options.is_slide){
                        tabContent.css({
                            'transform':'translate3D(' + (-winHeight * index) + 'px,0,0)',
                            '-webkit-transform':'translate3D(' + (-winHeight * index) + 'px,0,0)'
                        });
                    }else{
                        tabContent.children(options.element).eq(index).show().siblings().hide();
                    }

                    if(options.lazy && $(this).attr("lazy") !== 'a'){
                        var top = $(window).scrollTop();
                        var sTop = top <=0 ? top + 1 : top - 1;
                        $(window).scrollTop(sTop).scrollTop(top);
                    }

                    if(options.lazy){$(this).attr("lazy","a");}
                    that._callback(options.callback,$(this));
                })
            },
            _callback:function(cb,element){
                if(cb && (typeof(cb) === 'function')){
                    cb.call(this,element);
                }
            },
        })
    })($,window,document)
})