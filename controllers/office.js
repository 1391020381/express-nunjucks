/**
 * office Controller
 * 办公频道 搜索页
 */
var async = require("async");
var server = require("../models/index");
var appConfig = require("../config/app-config");
var api = require("../api/api");
var render = require("../common/render");
var util = require("../common/util");
var categoryId = '';
var page = 1;
var specifics = [];
var cond = '';
var fileType = 'all';
var order = 'all';
var subUrl = '';
var list = function (req) {
    return {
        // 全部分类
        category: function (callback) {
            server.get(appConfig.apiBasePath + api.office.search.category, callback, req, true);
        },
        // 导航分类及属性
        categoryTitle: function (callback) {
            var paramAnalysis = util.getCategoryParam(req.url);
            // 类目页的时候.location.pathname 包含分页编号等信息
            if (paramAnalysis) {
                categoryId = paramAnalysis.cid || '';
                page = paramAnalysis.page;
                specifics = paramAnalysis.specifics;
                order = paramAnalysis.order;
                subUrl = paramAnalysis.subUrl;
                cond = '';
            } else {
                // 搜索页得时候,通过地址栏get方式传递
                var query = req.query;
                categoryId = query.cid || '';
                page = query.page || 1;
                order = query.order || 'all';
                fileType = query.fileType || 'all';
                cond = query.cond || '';
            }
            req.body = {
                cid: categoryId,
                page: page,
                specifics: specifics,
                order: order,
                fileType: fileType
            };
            server.post(appConfig.apiBasePath + api.office.search.categoryTitle, callback, req, true);
        },
        // 列表
        contents: function (callback) {
            req.body = {
                cid: categoryId,
                page: page,
                specifics: specifics,
                fileType: fileType,
                cond: cond,
                order: order
            };
            server.post(appConfig.apiBasePath + api.office.search.contents, callback, req);
        },

    }
};
var search = function (req) {
    return {
        // 全部分类
        category: function (callback) {
            server.get(appConfig.apiBasePath + api.office.search.category, callback, req, true);
        },
        navCategorys: function (callback) {
            server.get(appConfig.apiBasePath + api.office.search.navCategorys, callback, req, true)
        },

        // 热词
        hotWords: function (callback) {
            server.get(appConfig.apiBasePath + api.office.search.linkWords.replace(/\$cond/, req.query.cond || ""), callback, req, true);
        },

        // 列表
        contents: function (callback) {
            req.body = {
                cid: '',
                page: req.query.page || 1,
                specifics: [],
                fileType: req.query.fileType || "all",
                cond: req.query.cond || "",
                order: req.query.order || "all"
            };
            server.post(appConfig.apiBasePath + api.office.search.contents, callback, req);
        },

    }
};
module.exports = {
    // 办公频道类目
    category: function (req, res) {
        return async.series(list(req), function (err, result) {
            // console.log(result,'result***********')
            //最大20页
            var pageIndexArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
            var data = result && result.contents.data;
            if (data && data.officeCategory) {
                if (data.officeCategory && data.officeCategory.page < 20) {
                    pageIndexArr.length = data.officeCategory.page;
                }
            }
            result.reqParams = {
                cid: categoryId,
                page: page,
                specifics: specifics,
                fileType: fileType,
                order: order,
                cond: cond,
                pageIndexArr: pageIndexArr,
                subUrl: subUrl,
                flag: 'true'//分类页
            };

            //tkd 后端部分接口写的是tkd字段
            const tdk = result.contents.data && (result.contents.data.tdk || result.contents.data.tkd) || {};

            // 遍历classId
            var classArr = []
            // 一、二级
            result.categoryTitle.data.navCategorys.forEach(element => {
                element.checked && classArr.push(element.parentId, element.categoryId)
            });
            // 三级
            result.categoryTitle.data.subCategorys.forEach(element => {
                element.checked && classArr.push(element.categoryId)
            });
            // 最后一级匹配
            if (classArr[classArr.length - 1] != categoryId) classArr.push(categoryId)
            result.classIds = classArr.join('-')


            result.list = {
                data: {
                    tdk: tdk
                },
            };

            render('office/category/index.html', result, req, res);
        });
    },
    // 办公频道类目页搜索
    search: function (req, res) {
        return async.series(search(req), function (err, result) {
            //最大20页
            var pageIndexArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
            var data = result.contents.data;
            if (data && data.officeCategory) {
                if (data.officeCategory && data.officeCategory.page < 20) {
                    pageIndexArr.length = data.officeCategory.page;
                }
            }
            result.reqParams = {
                cid: categoryId,
                page: req.query.page || 1,
                specifics: specifics,
                fileType: req.query.fileType || 'all',
                order: req.query.order || 'all',
                cond: decodeURIComponent(req.query.cond) || '',
                pageIndexArr: pageIndexArr,
                flag: 'false'//搜索页
            };

            const tdk = result.contents.data && (result.contents.data.tdk || result.contents.data.tkd) || {};
            result.list = {
                data: {
                    tdk: tdk
                },
            };
            // console.log(result, 'resultsearch===')
            render('office/category/index.html', result, req, res);
        });
    },
};