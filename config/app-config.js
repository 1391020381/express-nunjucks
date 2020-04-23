/**
* 系统配置
*/
module.exports = {
    //环境配置
    env: process.env.NODE_ENV,
    apiBasePath: 'http://ishare.zuul.api:8769/gateway/pc',
    apiSpecialPath:'http://ishare.zuul.api:8769/gateway',
    // 日志输入路径
    logPath: '/data/logs/ishare/node-pc/',
    newBasePath: 'http://ishare.zuul.api:8769',
    //服务端口-自定义
    port: 3004
};