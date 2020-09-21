/**
* 系统配置
*/
const env = process.env.NODE_ENV || 'local'
const config = {
    local: {
        env: process.env.NODE_ENV,
        apiBasePath: 'http://ishare.gateway.api.pc:8769/gateway/pc',
        apiNewBaselPath: 'http://ishare.gateway.api.pc:8769/gateway',
        newBasePath: 'http://ishare.gateway.api.pc:8769',
        // 日志输入路径
        logPath: '/data/logs/node-pc/',
        //服务端口-自定义
        port: 3004,
        static3:''
    },
    dev: {
        env: process.env.NODE_ENV,
        apiBasePath: 'http://ishare.gateway.api.pc:8769/gateway/pc',
        apiNewBaselPath: 'http://ishare.gateway.api.pc:8769/gateway',
        newBasePath: 'http://ishare.gateway.api.pc:8769',
        // 日志输入路径
        logPath: '/data/logs/node-pc/',
        //服务端口-自定义
        port: 3004,
        static3:'//dev-static3.iask.cn/'
    },
    test: {
        env: process.env.NODE_ENV,
        apiBasePath: 'http://ishare.gateway.api.pc:8769/gateway/pc',
        apiNewBaselPath: 'http://ishare.gateway.api.pc:8769/gateway',
        newBasePath: 'http://ishare.gateway.api.pc:8769',
        // 日志输入路径
        logPath: '/data/logs/node-pc/',
        //服务端口-自定义
        port: 3004,
        static3:'//test-static3.iask.cn/'
    },
    pre: {
        env: process.env.NODE_ENV,
        apiBasePath: 'http://ishare.gateway.api.pc:8769/gateway/pc',
        apiNewBaselPath: 'http://ishare.gateway.api.pc:8769/gateway',
        newBasePath: 'http://ishare.gateway.api.pc:8769',
        // 日志输入路径
        logPath: '/data/logs/node-pc/',
        //服务端口-自定义
        port: 3004,
        static3:'//pre-static3.iask.cn/'
    },
    prod: {
        env: process.env.NODE_ENV,
        apiBasePath: 'http://ishare.gateway.api.pc:8769/gateway/pc',
        apiNewBaselPath: 'http://ishare.gateway.api.pc:8769/gateway',
        newBasePath: 'http://ishare.gateway.api.pc:8769',
        // 日志输入路径
        logPath: '/data/logs/node-pc/',
        //服务端口-自定义
        port: 3004,
        static3:'//static3.iask.cn/'
    }
}


module.exports = config[env]