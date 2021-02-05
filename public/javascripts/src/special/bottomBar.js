define(function (require, exports, module) {
    var api = require('../application/api');
    var method = require("../application/method");
    var login = require("../application/checkLogin");


    $('.search-img-box').click(function () {
        var contentId = $(this).attr('contentId')
        var fileName = $(this).attr('fileName')
        var pageConfig = window.pageConfig
        trackEvent('SE040', "ztFileEntryClick", 'click', {
            ztID: pageConfig && pageConfig.urlParams.specialTopicId,
            ztName: pageConfig && pageConfig.topicName,
            filePostion: $(this).index() + 1,
            fileID: contentId,
            fileName: fileName
        });
        window.open('/f/' + contentId + '.html', "_blank");
    })
    $('.search-list-info').click(function () {
        var contentId = $(this).attr('contentId')
        var fileName = $(this).attr('fileName')
        var pageConfig = window.pageConfig
        trackEvent('SE040', "ztFileEntryClick", 'click', {
            ztID: pageConfig && pageConfig.urlParams.specialTopicId,
            ztName: pageConfig && pageConfig.topicName,
            filePostion: $(this).index() + 1,
            fileID: contentId,
            fileName: fileName
        });
    })
    // 收藏与取消收藏功能
    var userId = ''   // 注意 在 loginStatusQuery 也可以取到 userID
    $('.search-img-box .ic-collect').click(function (event) {
        event.stopPropagation();
        var _this = $(this)
        var contentId = $(this).attr("data-contentid")
        var hasActiveClass = $(this).hasClass("active")
        function addActiveClass(collectionIsSuccessful) {
            collectionIsSuccessful && !hasActiveClass ? _this.addClass('active') : _this.removeClass('active')
        }
        if (!method.getCookie('cuk')) {
            login.notifyLoginInterface(function (data) {
                console.log('-------------------', data)
                refreshTopBar(data);
                var userId = data.userId
                fileSaveOrupdate(contentId, userId, addActiveClass, _this)
            })
        } else {
            userId = window.pageConfig.params.uid;
            fileSaveOrupdate(contentId, userId, addActiveClass, _this)
        }
    })
    // 收藏或取消收藏接口
    function fileSaveOrupdate(fid, uid, addActiveClass, _this) {
        var fn = addActiveClass
        $.ajax({
            url: api.special.setCollect,
            type: "post",
            data: JSON.stringify({ fid: fid, source: 0 }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (res) {
                if (res.code == '0') {
                    $.toast({
                        text: _this.hasClass("active") ? "取消收藏成功" : "收藏成功"
                    })
                    fn(true)
                } else {
                    fn(false)
                    $.toast({
                        text: _this.hasClass("active") ? "取消收藏失败" : "收藏失败"
                    })
                }
            }
        })
    }

    // 专题页面搜索框的逻辑
    search()
    function search() {
        var topicName = window.pageConfig.topicName // topicName
        $('#scondition').val(topicName)
        $('#searchBtn').click(function () {
            topicName = $('#scondition').val()
            var ft = $('.search-choose input[name="radio"]:checked ').val()
            window.open('/search/home.html' + '?' + 'ft=' + ft + '&cond=' + encodeURIComponent(encodeURIComponent(topicName)))
        })
    }
});