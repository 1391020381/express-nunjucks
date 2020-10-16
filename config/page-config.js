/**
*   页面相关配置
*/
var fs = require("fs");
var path = require("path");
var static3 = require('./app-config').static3
var env =  require('./app-config').env
var data = fs.readFileSync(path.resolve(__dirname,'../config/version.properties.text'),'utf-8');
var version = "";
var url = "";
var surl = "";



if (env=='local' ||env == 'debug') {
    return;
} else if (data) {
    console.log('-----------data',data)
    version = data.split("=")[1].replace(/^\s*/, "").replace(/\s*$/, "");
    url = static3 + version;
    surl = static3 + 'stat_pc';
}

module.exports = {
    //页面定义加载的url  https://static3.iask.cn/v2019004041628
    cdn : url,
    staticUrl:surl,
    //版本
    version : version
}