/**
 * @Description: 项目启动文件 
 */

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var nunjucks = require('nunjucks');
var useragent = require('express-useragent');
let proxy = require('http-proxy-middleware');
//var url = require('url');
var session = require('express-session');
//var redisStore = require('connect-redis')(session);
var log4js = require('./lib/log4js').getLogger('APP');
var router = require('./routes/index');
var appConfig = require('./config/app-config');
var app = express();

//获取useragent
app.use(useragent.express());

//配置开发环境，端口等
// process.env.ENV = appConfig.env;
process.env.PORT = appConfig.port;

//视图
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

//使用 nunjucks templating
var env = nunjucks.configure(app.get('views'), {
    autoescape: false,//关闭自动转义 用于渲染富文本
    noCache: true,
    watch: true,
    express: app
});



var helper = require('./helper/helper')(env);
// set favicon.ico
app.use(favicon(path.join(__dirname, '/public/images/favicon.ico')));

app.use(logger('dev'));
app.use(bodyParser.urlencoded({extended:false}));
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


//中间件，为所有请求记录日志
app.use(function (req, res, next) {
    log4js.info(req.url);
    next();
})


//首页
app.use('/', router);

// //本地开发环境反向代理
// if(process.env.NODE_ENV == 1){
//     app.use('/', proxy({
//         //目标后端服务地址
//         // target: 'http://localhost:8082/',
//         target: 'http://192.168.1.53:8082/',
//         pathRewrite: {
//           '^/' : ''
//         },
//         changeOrigin: true
//     }))
// }


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    // var err = new Error('Not Found');
    // err.status = 404;
    // next(err);
    res.redirect('/html/404.html');
});

// development error handler
// will print stacktrace
if (appConfig.env === 'dev') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.send({
            status: 0,
            message: err.message,
            error: err
        })
    });
}

// production error handler
// will print stacktrace
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.send({
        status: 0,
        message: err.message,
        error: {}
    })
});

module.exports = app;