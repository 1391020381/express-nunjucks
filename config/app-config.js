/**
* 系统配置
*/
module.exports = { // http://ishare.iask.sina.com.cn/
    //环境配置
    env: process.env.NODE_ENV,
    apiBasePath: 'http://ishare.gateway.api.pc:8769/gateway/pc',
    apiNewBaselPath:'http://ishare.gateway.api.pc:8769/gateway',
    newBasePath:'http://ishare.gateway.api.pc:8769',
    // apiBasePath: 'http://dev-ishare.iask.com.cn:8769/gateway/pc',
    // apiNewBaselPath:'http://dev-ishare.iask.com.cn:8769/gateway',
    // newBasePath:'http://dev-ishare.iask.com.cn:8769',
    // 日志输入路径
    logPath: '/data/logs/node-pc/',
    //服务端口-自定义
    port: 3004
};