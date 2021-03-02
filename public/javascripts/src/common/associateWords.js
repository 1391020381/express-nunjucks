/**
 * A20 公共的热词联想模块
 * */

define(function (require, exports, module) {
    var associateWords = {
        searchList: [],
        init: function() {
            $('#search-detail-input').keyup(function () {
                var value = this.value;
                if (value) {
                    $.ajax({
                        url: 'http://sp0.baidu.com/5a1Fazu8AA54nxGko9WTAnF6hhy/su?wd=' + value,
                        type: 'GET',
                        dataType: 'jsonp',
                        jsonp: 'cb',
                        jsonpCallback: 'soso',
                        success: function (data) {
                            $('.lately-list li').remove();
                            associateWords.searchList = data.s;
                            var content = '';
                            for (var i = 0, len = associateWords.searchList.length; i < len; i++) {
                                var el = associateWords.searchList[i];
                                content += '<li><a href ="/search/home.html?ft=all&cond=' + encodeURIComponent(encodeURIComponent(el)) + '" target="_blank">' + el + '</a></li>';
                                $('.lately-list').html(content);
                            }
                        }
                    });
                } else {
                    associateWords.searchList = [];
                    $('.lately-list').html('');
                }
            });

            $('#search-detail-input').focus(function () {
                if (!$(this).hasClass('input-focus')) {
                    $(this).addClass('input-focus');
                }
                $('.detail-lately').css({display: 'block'});
            });

            $('#search-detail-input').blur(function () {
                var $this = $(this);
                setTimeout(function() {
                    if ($this.hasClass('input-focus')) {
                        $this.removeClass('input-focus');
                    }
                    $('.detail-lately').css({display: 'none'});
                }, 200);
            });
        }
    };

    return associateWords;
});