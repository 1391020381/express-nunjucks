/**
* 系统配置
*/
const NODE_ENV = process.env.NODE_ENV;

module.exports = {
    //环境配置
    env: process.env.NODE_ENV,
    apiBasePath:  'http://ishare.gateway.api.pc:8769/gateway/pc',
    apiSpecialPath:'http://ishare.gateway.api.pc:8769/gateway',
    // 日志输入路径
    logPath: '/data/logs/ishare/node-pc/',
    newBasePath:'http://ishare.gateway.api.pc:8769',
    //服务端口-自定义
    port: 3004
};