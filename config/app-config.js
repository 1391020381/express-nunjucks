/**
* 系统配置
*/
const env = process.env.NODE_ENV || 'local'
const config = {
    debug:{
        env: env,
        apiBasePath: 'http://ishare.iask.sina.com.cn/gateway/pc',
        apiNewBaselPath: 'http://ishare.iask.sina.com.cn/gateway',
        newBasePath: 'http://ishare.iask.sina.com.cn',
        // 日志输入路径
        logPath: '/data/logs/node-pc/',
        //服务端口-自定义
        port: 3004,
        static3:'',
        upload:"http://upload.ishare.iask.com/ishare-upload/picUploadCatalog"
    },
    local: {
        env: env,
        apiBasePath: 'http://192.168.1.50:8769/gateway/pc',
        apiNewBaselPath: 'http://192.168.1.50:8769/gateway',
        newBasePath: 'http://192.168.1.50:8769/',
        // apiBasePath: 'http://dev-app-ishare-iask.com.cn/gateway/pc',
        // apiNewBaselPath: 'http://dev-app-ishare-iask.com.cn/gateway',
        // newBasePath: 'http://dev-app-ishare-iask.com.cn',
        // 日志输入路径
        logPath: '/data/logs/node-pc/',
        //服务端口-自定义
        port: 3004,
        static3:'',
        upload:"http://dev-upload.ishare.iask.com/ishare-upload/picUploadCatalog"
    },
    dev: {
        env: env,
        apiBasePath: 'http://192.168.1.50:8769/gateway/pc',
        apiNewBaselPath: 'http://192.168.1.50:8769/gateway',
        newBasePath: 'http://192.168.1.50:8769/',
        // apiBasePath: 'http://ishare.gateway.api.pc:8769/gateway/pc',
        // apiNewBaselPath: 'http://ishare.gateway.api.pc:8769/gateway',
        // newBasePath: 'http://ishare.gateway.api.pc:8769',
        // 日志输入路径
        logPath: '/data/logs/node-pc/',
        //服务端口-自定义
        port: 3004,
        static3:'//dev-static3.iask.cn/',
        upload:"http://dev-upload.ishare.iask.com/ishare-upload/picUploadCatalog"
    },
    test: {
        env: env,
        apiBasePath: 'http://ishare.gateway.api.pc:8769/gateway/pc',
        apiNewBaselPath: 'http://ishare.gateway.api.pc:8769/gateway',
        newBasePath: 'http://ishare.gateway.api.pc:8769',
        // 日志输入路径
        logPath: '/data/logs/node-pc/',
        //服务端口-自定义
        port: 3004,
        static3:'//test-static3.iask.cn/',
        upload:"http://test-upload.ishare.iask.com/ishare-upload/picUploadCatalog"
    },
    pre: {
        env: env,
        apiBasePath: 'http://ishare.gateway.api.pc:8769/gateway/pc',
        apiNewBaselPath: 'http://ishare.gateway.api.pc:8769/gateway',
        newBasePath: 'http://ishare.gateway.api.pc:8769',
        // 日志输入路径
        logPath: '/data/logs/node-pc/',
        //服务端口-自定义
        port: 3004,
        static3:'//pre-static3.iask.cn/',
        upload:"http://pre-upload.ishare.iask.com/ishare-upload/picUploadCatalog"
    },
    prod: {
        env: env,
        apiBasePath: 'http://ishare.gateway.api.pc:8769/gateway/pc',
        apiNewBaselPath: 'http://ishare.gateway.api.pc:8769/gateway',
        newBasePath: 'http://ishare.gateway.api.pc:8769',
        // 日志输入路径
        logPath: '/data/logs/node-pc/',
        //服务端口-自定义
        port: 3004,
        static3:'//static3.iask.cn/',
        upload:"http://prod-upload.ishare.iask.com/ishare-upload/picUploadCatalog"
    }
}


module.exports = config[env]