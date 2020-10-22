/**
* 系统配置
*/
const env = process.env.NODE_ENV  || 'local'
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
        officeUrl :'http://office.iask.com'
    },
    local: {
        env: env,
        apiBasePath: 'http://dev-gateway.pc.ishare.iasktest.com/gateway/pc',
        apiNewBaselPath: 'http://dev-gateway.pc.ishare.iasktest.com/gateway',
        newBasePath: 'http://dev-ishare.iask.com.cn'||'http://dev-gateway.pc.ishare.iasktest.com',
        // 日志输入路径
        logPath: '/data/logs/node-pc/',
        //服务端口-自定义
        port: 3004,
        static3:'',
        officeUrl :'http://dev-office.iask.com'||'http://dev-office.iask.com'
    },
    dev: {
        env: env,
        apiBasePath: 'http://dev-gateway.pc.ishare.iasktest.com/gateway/pc',
        apiNewBaselPath: 'http://dev-gateway.pc.ishare.iasktest.com/gateway',
        newBasePath: 'http://dev-gateway.pc.ishare.iasktest.com',
        // 日志输入路径
        logPath: '/data/logs/node-pc/',
        //服务端口-自定义
        port: 3004,
        static3:'//dev-static3.iask.cn/',
        officeUrl :'http://dev-office.iask.com'
    },
    test: {
        env: env,
        apiBasePath: 'http://test-gateway.pc.ishare.iasktest.com/gateway/pc',
        apiNewBaselPath: 'http://test-gateway.pc.ishare.iasktest.com/gateway',
        newBasePath: 'http://test-gateway.pc.ishare.iasktest.com',
        // 日志输入路径
        logPath: '/data/logs/node-pc/',
        //服务端口-自定义
        port: 3004,
        static3:'//test-static3.iask.cn/',
        officeUrl :'http://test-office.iask.com'
    },
    pre: {
        env: env,
        apiBasePath: 'http://pre-gateway.pc.ishare.iaskonline.com/gateway/pc',
        apiNewBaselPath: 'http://pre-gateway.pc.ishare.iaskonline.com/gateway',
        newBasePath: 'http://pre-gateway.pc.ishare.iaskonline.com',
        // 日志输入路径
        logPath: '/data/logs/node-pc/',
        //服务端口-自定义
        port: 3004,
        static3:'//pre-static3.iask.cn/',
        officeUrl :'http://pre-office.iask.com'
    },
    prod: {
        env: env,
        apiBasePath: 'http://gateway.pc.ishare.iaskonline.com/gateway/pc',
        apiNewBaselPath: 'http://gateway.pc.ishare.iaskonline.com/gateway',
        newBasePath: 'http://gateway.pc.ishare.iaskonline.com',
        // 日志输入路径
        logPath: '/data/logs/node-pc/',
        //服务端口-自定义
        port: 3004,
        static3:'//static3.iask.cn/',
        officeUrl :'http://office.iask.com'
    }
}


module.exports = config[env]