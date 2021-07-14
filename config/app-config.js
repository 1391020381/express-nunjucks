/**
* 系统配置
*/
const env = process.env.NODE_ENV || 'prod';
const config = {
    debug: {
        env: env,
        apiBasePath: 'http://ishare.iask.sina.com.cn/gateway/pc',
        apiNewBaselPath: 'http://ishare.iask.sina.com.cn/gateway',
        newBasePath: 'http://ishare.iask.sina.com.cn',
        // 日志输入路径
        logPath: '/data/logs/node-pc/',
        // 服务端口-自定义
        port: 3004,
        static3: '',
        loginUrl: 'http://login-ishare.iask.com.cn/gateway/cas/login/jump?redirectUrl=',
        payUrl: 'http://open-ishare.iask.com.cn',
        upload: '//upload-ishare.iask.com',
        bilogUrl: 'https://dw.iask.com.cn/ishare/jsonp',
        officeUrl: 'http://office.iask.com',
        ejunshi: 'http://dev.ejunshi.com',
        fileConvertSite: 'http://dev.pdf.iask.com'
    },
    local: {
        env: env,
        // apiBasePath: 'http://pre-ishare.iask.com.cn/gateway/pc',
        // apiNewBaselPath: 'http://pre-ishare.iask.com.cn/gateway',
        // newBasePath: 'http://pre-ishare.iask.com.cn',
        // loginUrl: 'http://pre-login-ishare.iask.com.cn/gateway/cas/login/jump?redirectUrl=',
        // apiBasePath: 'http://test-gateway.pc.ishare.iasktest.com/gateway/pc',
        // apiNewBaselPath: 'http://test-gateway.pc.ishare.iasktest.com/gateway',
        // newBasePath: 'http://test-gateway.pc.ishare.iasktest.com',
        apiBasePath: 'http://dev-gateway.pc.ishare.iasktest.com/gateway/pc',
        apiNewBaselPath: 'http://dev-gateway.pc.ishare.iasktest.com/gateway',
        newBasePath: 'http://dev-gateway.pc.ishare.iasktest.com',
        // 日志输入路径
        logPath: '/data/logs/node-pc/',
        // 服务端口-自定义
        port: 3004,
        static3: '',
        payUrl: 'http://dev-open-ishare.iask.com.cn',
        upload: '//dev-upload-ishare.iask.com',
        bilogUrl: 'https://dev-dw.iask.com.cn/ishare/jsonp',
        officeUrl: 'http://dev-office.iask.com',
        ejunshi: 'http://dev.ejunshi.com',
        fileConvertSite: 'http://dev-pdf.iask.com'
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
        loginUrl: 'http://dev-login-ishare.iask.com.cn/gateway/cas/login/jump?redirectUrl=',
        payUrl: 'http://dev-open-ishare.iask.com.cn',
        upload: '//dev-upload-ishare.iask.com',
        bilogUrl: 'https://dev-dw.iask.com.cn/ishare/jsonp',
        officeUrl: 'http://dev-office.iask.com',
        ejunshi: 'http://dev.ejunshi.com',
        fileConvertSite: 'http://dev-pdf.iask.com'
    },
    test: {
        env: env,
        apiBasePath: 'http://test-gateway.pc.ishare.iasktest.com/gateway/pc',
        apiNewBaselPath: 'http://test-gateway.pc.ishare.iasktest.com/gateway',
        newBasePath: 'http://test-gateway.pc.ishare.iasktest.com',
        loginUrl: 'http://test-login-ishare.iask.com.cn/gateway/cas/login/jump?redirectUrl=',
        // 日志输入路径
        logPath: '/data/logs/node-pc/',
        // 服务端口-自定义
        port: 3004,
        static3: '//test-static3.iask.cn/',
        payUrl: 'http://test-open-ishare.iask.com.cn',
        upload: '//test-upload-ishare.iask.com',
        bilogUrl: 'https://test-dw.iask.com.cn/ishare/jsonp',
        officeUrl: 'http://test-office.iask.com',
        ejunshi: 'http://test.ejunshi.com',
        fileConvertSite: 'http://test-pdf.iask.com'
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
        loginUrl: 'http://pre-login-ishare.iask.com.cn/gateway/cas/login/jump?redirectUrl=',
        payUrl: 'http://pre-open-ishare.iask.com.cn',
        upload: '//pre-upload-ishare.iask.com',
        bilogUrl: 'https://pre-dw.iask.com.cn/ishare/jsonp',
        officeUrl: 'http://pre-office.iask.com',
        ejunshi: 'http://pre.ejunshi.com',
        fileConvertSite: 'http://pre-pdf.iask.com'
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
        loginUrl: 'http://login-ishare.iask.com.cn/gateway/cas/login/jump?redirectUrl=',
        payUrl: 'http://open-ishare.iask.com.cn',
        upload: '//upload-ishare.iask.com',
        bilogUrl: 'https://dw.iask.com.cn/ishare/jsonp',
        officeUrl: 'http://office.iask.com',
        ejunshi: 'http://ejunshi.com',
        fileConvertSite: 'http://pdf.iask.com'
    }
};


module.exports = Object.assign({}, config[env], { site: 4, terminal: 0 });
