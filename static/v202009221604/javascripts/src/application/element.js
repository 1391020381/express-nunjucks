define(function(require, exports, module) {
    //var $ = require("$");
    var method = require("./method");
    var template = require("./template");

    //获取热点搜索全部数据
    if(window.pageConfig && window.pageConfig.hotData){
        var hot_data = JSON.parse(window.pageConfig.hotData);
        var arr = [];
        var darwData = [];
        function unique(min , max){
            var index = method.random(min,max);
            if($.inArray(index , arr) === -1){
                arr.push(index);
                darwData.push(hot_data[index]);
                if(arr.length < 10){
                    unique(0 , hot_data.length)
                }
            }else{
                unique(0 , hot_data.length);
            }
            return darwData;
        }
    }

    //返回顶部
    var fn_goTop = function($id){
        var Obj = {
            ele : $id,
            init : function(){
                this.ele[0].addEventListener("click",function(){
                    $("html, body").animate({scrollTop: 0 }, 120);
                },false)
                window.addEventListener("scroll", this, false);
                return this;
            },
            handleEvent:function(evt){
                var top = $(document).scrollTop(),
                    height = $(window).height();
                
                (top > 100) ? this.ele.show():this.ele.hide();

                if(top > 10){
                    $(".m-header").addClass("header-fix");
                }else{
                    $(".m-header").removeClass("header-fix");
                }
                return this;
            }
        }
        Obj.init().handleEvent();
    }
    $("#backToTop").length && fn_goTop && fn_goTop($("#backToTop"));
})
