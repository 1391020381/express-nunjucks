/**
*   页面相关配置
*/
var fs = require("fs");
var path = require("path");

var data = fs.readFileSync(path.resolve(__dirname,'../config/version.properties.text'),'utf-8');
var version = "";
var url = "";
var surl = "";

if (process.env.NODE_ENV =='local') {
    return;
} else if (data) {
    console.log('-----------data',data)
    version = data.split("=")[1].replace(/^\s*/, "").replace(/\s*$/, "");
    url = '//static3.iask.cn/' + version;
    surl = '//static3.iask.cn/stat_pc';
}

module.exports = {
    //页面定义加载的url  https://static3.iask.cn/v2019004041628
    cdn : url,
    staticUrl:surl,
    //版本
    version : version
}