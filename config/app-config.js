/**
* 系统配置
*/
const NODE_ENV = process.env.NODE_ENV;
const DEV_API_BASE_PATH = 'http://192.168.1.50:8769';
module.exports = {
    //环境配置
    env: process.env.NODE_ENV,
    apiBasePath: NODE_ENV === 'development' ? DEV_API_BASE_PATH + '/gateway/pc' : 'http://ishare.gateway.api.pc:8769/gateway/pc',
    apiSpecialPath: NODE_ENV === 'development' ? DEV_API_BASE_PATH + '/gateway' : 'http://ishare.gateway.api.pc:8769/gateway',
    // 日志输入路径
    logPath: '/data/logs/ishare/node-pc/',
    newBasePath: NODE_ENV === 'development' ? DEV_API_BASE_PATH : 'http://ishare.gateway.api.pc:8769',
    //服务端口-自定义
    port: 3004
};