var appConfig = require("../config/app-config");
var pageConfig = require("../config/page-config");

module.exports = (path, results, req, res) => {
    //render统一处理，方便统一处理一些全局数据（登录信息，参数等等）
    // console.log("path============================" + path);
    // console.log("url============================" + req.url);
    // console.log('cuk-JSESSIONID===============' + 'cuk=' + req.cookies.cuk + ' ;JSESSIONID=' + req.cookies.JSESSIONID);
    // console.log('cdn===============' + pageConfig.cdn);
    // console.log('version===============' + pageConfig.version);
    res.render(path, {
        results: results,
        params: req.params,
        query: req.query,
        path: req.url,
        timeStamp: +new Date(),
        env: appConfig.env,
        apiBasePath: appConfig.apiBasePath,
        cdnUrl: pageConfig.cdn,
        staticUrl: pageConfig.staticUrl,
        version: pageConfig.version,
        loginUrl:appConfig.loginUrl,
        currentYear:(new Date).getFullYear()
    })
};