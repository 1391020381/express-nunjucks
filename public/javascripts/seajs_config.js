var b = !_head;
var dist = b ? "src" : "dist";
var development = !b;

window.development = development;
//静态文件加载指定地址
typeof _head == "undefined" && (_head = '');

seajs.config({
    paths: {
        'static': _head + '/',
        'style': _head + '/stylesheets',
        'dist': _head + '/javascripts/' + dist,
        'jqueryplugins': _head + '/javascripts/sea-modules/jquery',
    },
    alias: {
        // '$': 'jquery/jquery/1.8.3/jquery.js',
        // 'jquery': 'jquery/jquery/1.8.3/jquery.js',
        'swiper': 'jquery/swiper/3.2.7/swiper.min.js',
        'base64': 'base64/base64.js',
    },

    preload: [],// 预加载项
    // map : [
    //     [/^(.*)\.js$/i, '$1\.js?v=' + _version]
    // ],
    debug: !development
});
