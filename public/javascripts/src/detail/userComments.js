define(function (require) {
    // var method = require('../application/method');
    var api = require('../application/api');
    var simplePagination = require('./template/simplePagination.html');
    var userComments = require('./template/userComments.html');
    var fid = window.pageConfig.params.g_fileId;
    var tagsList = [];
    getHotLableDataList(fid);
    function getHotLableDataList(fileid) {
        $.ajax({
            url: api.comment.getHotLableDataList + '?fid=' + fileid, //
            type: 'GET',
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (res) {
                if (res.code == '0') {
                    tagsList = res.data;
                    getUserComments(1);
                }
            }
        });
    }
    function getUserComments(currentPage, lableId) {
        $.ajax({
            url: api.comment.getFileComment + '?fid=' + fid + '&lableId=' + lableId + '&currentPage=' + currentPage + '&pageSize=15',
            type: 'GET',
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (res) {
                if (res.code == '0') {
                    if (res.data.rows && res.data.rows.length) {
                        var temp = [];
                        $(res.data.rows).each(function (index, item) {
                            var m = {
                                photoPicURL: item.photoPicURL,
                                nickName: item.nickName,
                                score: new Array(Number(item.score)),
                                content: item.content ? item.content : '该用户暂无评论',
                                createTime: new Date(item.createTime).formatDate('yyyy-MM-dd')
                            };
                            temp.push(m);
                        });
                        var list = [];
                        if (lableId && lableId != undefined) { // 单个筛选
                            $(tagsList).each(function (index, item) {
                                if (item.id == lableId) {
                                    list.push({
                                        id: item.id,
                                        name: item.name,
                                        active: true
                                    });
                                } else {
                                    list.push({
                                        id: item.id,
                                        name: item.name,
                                        active: false
                                    });
                                }
                            });
                        } else {
                            list = tagsList;
                        }
                        var _userCommentsTemplate = template.compile(userComments)({ userComments: temp || [], tagsList: list || [], lableId: lableId });
                        $('.user-comments-container').html(_userCommentsTemplate);

                        var guessYouLikeHeight = $('.guess-you-like-warpper').outerHeight(true) || 0;
                        var userEvaluation = $('.user-comments-container').outerHeight(true) || 0;
                        var currentPage = $('.detail-con').length;
                        var temp = guessYouLikeHeight + userEvaluation + 30;
                        var bottomHeight = currentPage == 1 || currentPage == 2 || currentPage == 3 ? temp + 123 : temp;

                        $('.detail-footer').css({
                            'position': 'absolute',
                            'left': '0px',
                            'right': '0px',
                            'bottom': bottomHeight + 'px',
                            'width': '890px'
                        });
                        $('.copyright-container').css({
                            'bottom': bottomHeight + 'px',
                            'marginBottom': '-40px'
                        });


                        handlePagination(res.data.totalPages, res.data.currentPage);
                    }
                }
            }
        });
    }
    function handlePagination(totalPages, currentPage) {
        var simplePaginationTemplate = template.compile(simplePagination)({ paginationList: new Array(totalPages || 0), currentPage: currentPage });
        $('.pagination-wrapper').html(simplePaginationTemplate);
        $('.pagination-wrapper').on('click', '.page-item', function (e) {
            var paginationCurrentPage = $(this).attr('data-currentPage');
            if (!paginationCurrentPage) {
                return;
            }
            var lableId = $('.evaluation-tags .tag-active').attr('data-id');
            getUserComments(paginationCurrentPage, lableId);
        });
    }

    $(document).on('click', '.doc-main-br .user-comments-container .evaluation-tags .tag', function () {
        var id = $(this).attr('data-id');
        getUserComments(1, id);
    });
});