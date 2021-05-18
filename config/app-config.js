/**
* 系统配置
*/
const env = process.env.NODE_ENV || 'prod';
const config = {
    debug: {
        env: env,
        // apiBasePath: 'http://ishare.iask.sina.com.cn/gateway/pc',
        // apiNewBaselPath: 'http://ishare.iask.sina.com.cn/gateway',
        // newBasePath: 'http://ishare.iask.sina.com.cn',
        // loginUrl:'//login-ishare.iask.com.cn',
        apiBasePath: 'http://pre-ishare.iask.com.cn/gateway/pc',
        apiNewBaselPath: 'http://pre-ishare.iask.com.cn/gateway',
        newBasePath: 'http://pre-ishare.iask.com.cn',
        loginUrl: '//pre-login-ishare.iask.com.cn',
        // 日志输入路径
        logPath: '/data/logs/node-pc/',
        // 服务端口-自定义
        port: 3004,
        static3: '',
        officeUrl: 'http://office.iask.com'
    },
    local: {
        env: env,
        // apiBasePath: 'http://dev-gateway.pc.ishare.iasktest.com/gateway/pc',
        // apiNewBaselPath: 'http://dev-gateway.pc.ishare.iasktest.com/gateway',
        // newBasePath: 'http://dev-gateway.pc.ishare.iasktest.com',
        // loginUrl: '//dev-login-ishare.iask.com.cn',
        // loginUrl:'http://127.0.0.1:8085',
        apiBasePath: 'http://test-ishare.iask.com.cn/gateway/pc',
        apiNewBaselPath: 'http://test-ishare.iask.com.cn/gateway',
        newBasePath: 'http://test-gateway.pc.ishare.iasktest.com',
        // loginUrl:'//test-login-ishare.iask.com.cn',
        // 日志输入路径
        logPath: '/data/logs/node-pc/',
        // 服务端口-自定义
        port: 3004,
        static3: '',
        officeUrl: 'http://dev-office.iask.com'
    },
    dev: {
        env: env,
        apiBasePath: 'http://dev-gateway.pc.ishare.iasktest.com/gateway/pc',
        apiNewBaselPath: 'http://dev-gateway.pc.ishare.iasktest.com/gateway',
        newBasePath: 'http://dev-gateway.pc.ishare.iasktest.com',
        // 日志输入路径
        logPath: '/data/logs/node-pc/',
        // 服务端口-自定义
        port: 3004,
        static3: '//dev-static3.iask.cn/',
        officeUrl: 'http://dev-office.iask.com',
        loginUrl: '//dev-login-ishare.iask.com.cn'
    },
    test: {
        env: env,
        apiBasePath: 'http://test-gateway.pc.ishare.iasktest.com/gateway/pc',
        apiNewBaselPath: 'http://test-gateway.pc.ishare.iasktest.com/gateway',
        newBasePath: 'http://test-gateway.pc.ishare.iasktest.com',
        // 日志输入路径
        logPath: '/data/logs/node-pc/',
        // 服务端口-自定义
        port: 3004,
        static3: '//test-static3.iask.cn/',
        officeUrl: 'http://test-office.iask.com',
        loginUrl: '//test-login-ishare.iask.com.cn'
    },
    pre: {
        env: env,
        apiBasePath: 'http://pre-gateway.pc.ishare.iaskonline.com/gateway/pc',
        apiNewBaselPath: 'http://pre-gateway.pc.ishare.iaskonline.com/gateway',
        newBasePath: 'http://pre-gateway.pc.ishare.iaskonline.com',
        // 日志输入路径
        logPath: '/data/logs/node-pc/',
        // 服务端口-自定义
        port: 3004,
        static3: '//pre-static3.iask.cn/',
        officeUrl: 'http://pre-office.iask.com',
        loginUrl: '//pre-login-ishare.iask.com.cn'
    },
    prod: {
        env: env,
        apiBasePath: 'http://gateway.pc.ishare.iaskonline.com/gateway/pc',
        apiNewBaselPath: 'http://gateway.pc.ishare.iaskonline.com/gateway',
        newBasePath: 'http://gateway.pc.ishare.iaskonline.com',
        // 日志输入路径
        logPath: '/data/logs/node-pc/',
        // 服务端口-自定义
        port: 3004,
        static3: '//static3.iask.cn/',
        officeUrl: 'http://office.iask.com',
        loginUrl: '//login-ishare.iask.com.cn'
    }
};


module.exports = Object.assign({},config[env],{site:4,terminal:0})
