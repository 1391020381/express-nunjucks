/**
 * @Description: toast.js
 *
 */
define(function(require, exports, module) {
    //var $ = require("$");
    (function($,win,doc){

        function Toast(options){
            this.options = {
                text:'我是toast提示',
                icon:'',
                delay : 3000,
                callback:false
            };
            //默认参数扩展
            if(options && $.isPlainObject(options)){
                $.extend(true, this.options , options);
            };
            this.init();
        };
        Toast.prototype.init = function(){
            var that = this;
            that.body 		= $('body');
            that.toastWrap = $('<div class="ui-toast" style="position:fixed;width:200px;height:60px;line-height:60px;text-align:center;background:#000;opacity:0.8;filter:alpha(opacity=80);top:40%;left:50%;margin-left:-100px;margin-top:-30px;border-radius:4px">');
            that.toastIcon = $('<i class="icon"></i>');
            that.toastText = $('<span class="ui-toast-text" style="color:#fff">' + that.options.text + '</span>');
    
            that._creatDom();
            that.show();
            that.hide();
        };
        Toast.prototype._creatDom = function(){
            var that = this;
            if(that.options.icon){
                that.toastWrap.append(that.toastIcon.addClass(that.options.icon));
            }
            that.toastWrap.append(that.toastText);
            that.body.append(that.toastWrap);
        };
        Toast.prototype.show = function(){
            var that = this;
            setTimeout(function(){
                that.toastWrap.removeClass('hide').addClass('show');
            },50);
        };
        Toast.prototype.hide = function(){
            var that = this;
            setTimeout(function(){
                that.toastWrap.removeClass('show').addClass('hide');
                that.toastWrap.remove();
                that.options.callback && that.options.callback();
            },that.options.delay);
        };
    
        $.toast = function(options){
            return new Toast(options);
        }

    })($,window,document)
});