/**
 * @Description: 项目启动文件
 */

const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const nunjucks = require('nunjucks');
const useragent = require('express-useragent');
const proxy = require('http-proxy-middleware');

const session = require('express-session');
// var redisStore = require('connect-redis')(session);
const log4js = require('./lib/log4js').getLogger('APP');
const router = require('./routes/index');
const appConfig = require('./config/app-config');
const app = express();

// 获取useragent
app.use(useragent.express());

// 配置开发环境，端口等
// process.env.ENV = appConfig.env;
process.env.PORT = appConfig.port;

// 视图
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

// 使用 nunjucks templating
const env = nunjucks.configure(app.get('views'), {
    autoescape: false, // 关闭自动转义 用于渲染富文本
    noCache: true,
    watch: true,
    express: app
});


const helper = require('./helper/helper')(env);
// set favicon.ico
app.use(favicon(path.join(__dirname, '/public/images/favicon.ico')));

// 本地开发环境反向代理

const restream = function (proxyReq, req, res, options) {
    if (req.body) {
        const bodyData = JSON.stringify(req.body);
        // incase if content-type is application/x-www-form-urlencoded -> we need to change to application/json
        proxyReq.setHeader('Content-Type', 'application/json');
        proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
        // stream the content
        proxyReq.write(bodyData);
    }
};

if (appConfig.env == 'local' || appConfig.env == 'debug') {
    app.use('/gateway', proxy({
        // 目标后端服务地址
        //  target: 'http://ishare.iask.sina.com.cn',
        target: appConfig.newBasePath,
        changeOrigin: true,
        secure: false,
        onProxyReq: restream
    }));
}


app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// create application/x-www-form-urlencoded parser
app.use(
    bodyParser.urlencoded({
        extended: false
    })
);
app.use(cookieParser());

// 使用 session 中间件
// app.use(session({
//     secret :  'secret', // 对session id 相关的cookie 进行签名
//     resave : true,
//     saveUninitialized: false, // 是否保存未初始化的会话
//     cookie : {
//         maxAge : 1000 * 60 * 3, // 设置 session 的有效时间，单位毫秒
//     },
// }));

app.use(express.static(path.join(__dirname, 'public')));


// 中间件，为所有请求记录日志
app.use((req, res, next) => {
    log4js.info(req.url);
    next();
});


// 首页
app.use('/', router);


app.use((err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }
    if (appConfig.env === 'local' || appConfig.env === 'dev' || appConfig.env === 'test' || appConfig.env === 'debug') {
        console.log(err.message);
        res.status(err.status || 500);
        res.send({
            status: 0,
            message: err.message,
            error: err,
            statck: err.stack
        });
    } else {
        log4js.info({
            status: 0,
            message: err.message,
            error: err,
            statck: err.stack
        });
        res.redirect(`/node/503.html?fid=${req.params.id}`);
    }

});

process.on('uncaughtException', (err) => {
    console.log('uncaughtException:', err.message, err.stack);
    process.exit(1);
});

module.exports = app;