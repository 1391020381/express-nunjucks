/**
 * 百度统计代码.
 */
var _hmt = _hmt || [];// 此变量百度统计需要

function handle(id) {
    if (id) {
        try {
            (function () {
                var hm = document.createElement('script');
                hm.src = 'https://hm.baidu.com/hm.js?' + id;
                var s = document.getElementsByTagName('script')[0];
                s.parentNode.insertBefore(hm, s);
            })();
        } catch (e) {
            console.error(id, e);
        }
    }
}

var ptype = window.pageConfig && window.pageConfig.page ? window.pageConfig.page.ptype : '';
var isDownload = window.pageConfig && window.pageConfig.page ? window.pageConfig.page.isDownload : '';
var permin = window.pageConfig && window.pageConfig.params ? window.pageConfig.params.g_permin : '';
var classid1 = window.pageConfig && window.pageConfig.params ? window.pageConfig.params.classid1 : '';
var fsource = window.pageConfig && window.pageConfig.params ? window.pageConfig.params.fsource : '';
var ftype = window.pageConfig && window.pageConfig.report ? window.pageConfig.report.ftype : '';
var href = window.location.href;

// 全站统计代码
handle('17cdd3f409f282dc0eeb3785fcf78a66');

// 办公频道页面统计代码  办公频道独立出来了
// if (/[^\s]*office*/g.test(ptype)) {
//     handle('f29420f2e7af9940a77bdf51b3346df9');
// }

// 详情页统计代码
// if (bdHref.indexOf("/f/")>-1) {
//     handle('804df340e392ac0a0dcf0809c9b894ba');
// }

var pid = $('#ip-page-id').val();
if (pid == 'PC-M-FD') {
    handle('804df340e392ac0a0dcf0809c9b894ba');
}

if (ftype == 'vipfree' || ftype == 'volume' || ftype == 'free') {// 广告专用代码文统计代码
    if (pageConfig.params && pageConfig.params.site == '4') {
        handle('5b34d9c5f60b9ef8d04b9665ba6cfbed');
    }
}
if (ftype == 'vipfree') {// VIP专享文档代码文统计代码
    handle('504d2c29e8aefe02ad5d66207e4de083');
}
if (ftype == 'volume') {// 下载券文档代码文统计代码
    handle('85aca3562322010736fa195e92637d01');
}
if (ftype == 'free') {// 免费文档代码文统计代码
    handle('c0fb058099c13a527871d024b1d809f8');
}
if (permin == 3) {// 现金文档的统计代码
    handle('66d98d644484ac70244d8540d05c66a5');
}
if (isDownload === 'n') {// 仅在线阅读
    handle('d25993d661748d50556cf664b1ee67b9');
}

// 详情页所属一级分类
if (classid1 == '1818') {// PC-ishare办公文书
    handle('3fe0cd95a78f2eb28655ea2dd39dfb97');
} else if (classid1 == '1821') {// PC-ishare经济管理
    handle('7315ee476767b051b048995560f807f0');
} else if (classid1 == '1816') {// PC-ishare教育资源
    handle('6512a66181dbb2ea03b2b8fc4648babc');
} else if (classid1 == '1820') {// PC-ishare专业资料
    handle('8412afc511d2600dd3f1e2646e4770c3');
} else if (classid1 == '10339') {// 其他
    handle('3424aee254a20527e13edf981b9d372d');
} else if (classid1 == '1823') {// 考试资料
    handle('a5ae466b793ddf36f52bcc1577f1bd3f');
}

// js 数组是否包含字符串
Array.prototype.contain = function (val) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == val) {
            return true;
        }
    }
    return false;
};

// 采集内容
var collections = [
    'ishare_collection_site',
    'ishare_collection_microdisk',
    'ishare_collection_keyword',
    'other_collection_site',
    'other_collection_microdisk',
    'other_collection_keyword'
];

if (fsource && collections.contain(fsource)) {
    handle('2b130e1e8c750a564b3db40d28bf4f43');
}
