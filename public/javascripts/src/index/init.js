define(function (require,exports,moudle) {
    require('../application/suspension')
    var slider = require('../common/slider');//轮播插件
    var login = require("../application/checkLogin");
    var utils = require("../cmd-lib/util");
    var method = require("../application/method");
    var login = require("../application/checkLogin");
    var api = require("../application/api");
    var headTip = require("./template/saiTemplate.html");
                            
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
            var num = -1*recomandSlide.index*302+'px';
           $('.swiper-wrapper').animate({'margin-left':num})
        }
    }
    var indexObject = {
        initial:function(){
            // 精选专题多图轮播
            setTimeout(function () {
                recomandSlide.init();
            },1000)
            //banner轮播图
            new slider("J_office_banner","J_office_focus","J_office_prev","J_office_next");
            this.tabswitchFiles();
            this.tabswitchSeo();
            this.beforeInit();
            this.freshSeoData();
            this.searchWordHook();
             // 登录
             $('.notLogin').on('click', function () {
                if (!utils.getCookie('cuk')) {
                    login.notifyLoginInterface(function (data) {
                        indexObject.refreshTopBar(data);
                    });
                }
            });
            // 退出登录
            $('.loginOut').click(function(){
                login.ishareLogout()
            })
            $('.js-vaip—avatar').click(function(){
                var url = '/node/personalCenter/home.html';
                if (!utils.getCookie('cuk')) {
                    login.notifyLoginInterface(function (data) {
                        indexObject.refreshTopBar(data);
                        window.open(url)
                    });
                }else{
                    window.open(url)
                }
               
            })
        },
        beforeInit:function(){
            if (utils.getCookie('cuk')) {
                login.getLoginData(function (data) {
                    if (data) {
                        indexObject.refreshTopBar(data);
                   }
                });
            }
            // 自动轮播热词
            indexObject.hotWordAuto()
        },
        // 自动轮播热词
        hotWordAuto:function(){
            var i =0;
            var length = $('.search-container .label-ele').length;
            var timer = setInterval(function(){
               i++;
               if(i == length) {
                   i = 0
               }
               var val = $('.search-container .label-ele').eq(i).find('a').text();
               $('.search-container .search-input').val(val)
            },2500)
            $('.search-bar input').on('focus',function(){
                clearInterval(timer)
            })
            $('.search-bar input').on('blur',function(){
                timer = setInterval(function(){
                    i++;
                    if(i == length) {
                        i = 0
                    }
                    var val = $('.search-container .label-ele').eq(i).find('a').text();
                    $('.search-container .search-input').val(val)
                 },2500)
            })
        },
        // 点击搜索
        searchWordHook:function(){
            var searVal = '';
            $('.search-container .icon-search').click(function(){
                searVal = $('.search-container .search-input').val();
                window.open('/search/home.html'+ '?' + 'ft=all' + '&cond='+ encodeURIComponent(encodeURIComponent(searVal)))
            })
            $('.search-container .search-input').keydown(function(e) {  
                if (e.keyCode == 13) {  
                    searVal = $('.search-container .search-input').val();
                    window.open('/search/home.html'+ '?' + 'ft=all' + '&cond='+ encodeURIComponent(encodeURIComponent(searVal)))
                }  
            });  
        },
        tabswitchFiles:function(){
            // 精选资料切换
            $('.recmond-tab').find('li').on('click',function(){
                $(this).addClass('current').siblings().removeClass('current');
                var _index = $(this).index();
               $(this).parents('.recmond-con').find('.content-list').eq(_index).addClass('current').siblings().removeClass('current');
            })
        },
        tabswitchSeo:function(){
            // 晒内容专区切换
            $('.seo-upload-new').find('.upload-title').on('click',function(){
                $(this).addClass('active').siblings().removeClass('active');
                var _index = $(this).index();
               $(this).parents('.seo-upload-new').find('.upload-list').eq(_index).addClass('current').siblings().removeClass('current');
            })
        },
        //换一换
        freshSeoData:function(){
            var url = '';
                var data = {
                    type: 'new',
                    currentPage:1,
                    pageSize:12
                };
                var dataType = 1;
                var newIndex = 0;
                var topicndex = 0;
            $('.js-fresh').click(function(){
                var type = $('.seo-upload-new .active').attr('type');
                var $list = $('.seo-upload-new .upload-list')
               if(type == 'rectopic') {
                    dataType =2;
                    $list = $list[1]
                    data = {
                        contentType: 100,
                        clientType:1,
                        pageSize:12,
                        clientType:0
                    }
                    url = '/gateway/seo/exposeContent/contentInfo/listContentInfos';
                    getData(url,data,dataType,$list)
               }else if(type == 'new'){
                    newIndex++;
                    newIndex = newIndex>3?0:newIndex;
                    var start = newIndex*12;
                    var end = (newIndex+1)*12;
                    $('.upload-list').eq(0).find('li').addClass('hide')
                   for(var i=start;i<end;i++) {
                       $('.upload-list').eq(0).find('li').eq(i).removeClass('hide')
                   }
               }else if(type == 'topic'){
                    topicndex++;
                    topicndex = topicndex>3?0:topicndex;
                    var start = topicndex*12;
                    var end = (topicndex+1)*12;
                    $('.upload-list').eq(2).find('li').addClass('hide')
                    for(var i=start;i<end;i++) {
                        $('.upload-list').eq(2).find('li').eq(i).removeClass('hide')
                    }
               }
               
            })
            
            function getData(url,data,dataType,$list){
                data = JSON.stringify(data);
                $.ajax({
                    async: false,
                    type: "post",
                    url: url,
                    data:data,
                    dataType: "json",
                    contentType:'application/json',
                    success: function (data) {
                       if(data.code =="0") {
                        data.data.type = dataType;
                        var _html = template.compile(headTip)({ data: data.data });
                        $($list).html(_html)
                        
                       }
                    }
                });
            }
        },
        //刷新topbar
        refreshTopBar:function (data) {
            var $unLogin = $('.notLogin');
            var $hasLogin = $('.hasLogin');
            var $btn_user_more = $('.btn-user-more');
            $unLogin.hide();
            $hasLogin.find('.user-link .user-name').html(data.nickName);
            $hasLogin.find('.user-link img').attr('src', data.photoPicURL);
            $('.user-top .avatar-frame img').attr('src', data.photoPicURL);
            $hasLogin.find('.top-user-more .name').html(data.nickName);
            $('.user-state .user-name').text(data.nickName)
            $hasLogin.show();
            console.log('data:',data)
            // data.isVip = 0
             
            var wholeStationVip = data.isMasterVip == 1?'<p class="whole-station-vip"><span class="whole-station-vip-icon"></span><span class="endtime">'+ data.expireTime +'到期</span></p>':''    
            var officeVip = data.isOfficeVip==1?'<p class="office-vip"><span class="office-vip-icon"></span><span class="endtime">'+ data.officeVipExpireTime +'到期</span></p>':''
            var infoDescContent = wholeStationVip + officeVip

            if(data.isMasterVip == 1 || data.isOfficeVip == 1) {  
                $('.user-state .vip-icon').addClass('vip-avaliable')
                $('.userOperateBtn.gocenter').removeClass('hide').siblings('.userOperateBtn').addClass('hide');
              //  var expireStr = data.expireTime+'到期'
                
                // $('.user-state .info-des').text(expireStr);
                $('.user-state .info-des').html(infoDescContent);
                $('.user-state').addClass('vipstate')
                $('.js-vip-open').hide()
            }else{
                $('.userOperateBtn.goVip').removeClass('hide').siblings('.userOperateBtn').addClass('hide');
                $('.user-state .info-des').text('你还不是VIP');
            }
        }
     }
     indexObject.initial()
     require('../common/baidu-statistics.js').initBaiduStatistics('adb0f091db00ed439bf000f2c5cbaee7')
     require('../common/baidu-statistics.js').initBaiduStatistics('17cdd3f409f282dc0eeb3785fcf78a66')
})