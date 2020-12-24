module.exports = function (grunt) {
    grunt.initConfig({
        // 加载元数据
        pke: grunt.file.readJSON("package.json"),
        devcode: {
            options: {
                html: true,
                js: true,
                css: true,
                clean: true,
                block: {
                    open: 'devcode',
                    close: 'endcode'
                }
            },
            dist: {
                options: {
                    source: '',
                    dest: '.build',
                    env: 'debug'
                }
            }
        },
        transport: {
            options: {
                paths: ['.',],
                alias: '<%= pke.spm.alias %>'
            },
            all: {
                options: {
                    idleading: 'dist/',
                    paths: ['src']
                },
                files: [{
                    cwd: 'src',
                    src: ['**/*.js', '**/*.html'],
                    dest: '.build'
                }]
            }
        },
        concat: {
            options: {
                paths: ['.'],
                include: 'relative'
            },
            all: {
                options: {
                    paths: ['dist'],
                    include: 'relative'
                },
                files: {
                    'dist/application/app.js': ['.build/application/app.js'],
                    'dist/detail-b/init.js': ['.build/detail-b/init.js'],
                    'dist/detail/init.js': ['.build/detail/init.js'],
                    'dist/detail/success.js': ['.build/detail/success.js'],
                    'dist/detail/fail.js': ['.build/detail/fail.js'],
                    'dist/pay/init.js': ['.build/pay/init.js'],
                    'dist/pay/cashbar.js': ['.build/pay/cashbar.js'],
                    'dist/search/init.js': ['.build/search/init.js'],
                    'dist/office/pay/init.js': ['.build/office/pay/init.js'],
                    'dist/office/pay/cashbar.js': ['.build/office/pay/cashbar.js'],
                    'dist/queryOrder/query.js': ['.build/queryOrder/query.js'],
                    'dist/queryOrder/init.js': ['.build/queryOrder/init.js'],
                    'dist/office/search/init.js': ['.build/office/search/init.js'],
                    'dist/rights/index.js': ['.build/rights/index.js'],
                    'dist/special/init.js': ['.build/special/init.js'],
                    'dist/upload/init.js': ['.build/upload/init.js'],
                    'dist/feedback/init.js': ['.build/feedback/init.js'],
                    'dist/404/init.js': ['.build/404/init.js'],
                    'dist/503/init.js': ['.build/503/init.js'],
                    'dist/personalCenter/init.js': ['.build/personalCenter/init.js'],
                    'dist/personalCenter/redirectionURL.js': ['.build/personalCenter/redirectionURL.js'],
                    'dist/personalCenter/userPage.js': ['.build/personalCenter/userPage.js'],
                    'dist/pay/payment.js': ['.build/pay/payment.js'],
                    'dist/pay/paymentResult.js': ['.build/pay/paymentResult.js'],
                    'dist/pay/payRedirect.js': ['.build/pay/payRedirect.js'],
                    'dist/index/init.js': ['.build/index/init.js'],
                    'dist/spider/init.js': ['.build/spider/init.js'],
                    'dist/earth/init.js': ['.build/earth/init.js'],
                    'dist/authentication/index.js': ['.build/authentication/index.js'],
                    'dist/authentication/org.js': ['.build/authentication/org.js'],
                    'dist/authentication/user.js': ['.build/authentication/user.js'],
                    'dist/category/index.js': ['.build/category/index.js'],
                    'dist/login/loginMiddle.js': ['.build/login/loginMiddle.js'],
                    'dist/loginMiddle/index.js': ['.build/loginMiddle/index.js'],
                    
                }
            }
        },
        //压缩js
        uglify: {
            options: {
                //头部信息
                banner: '/*! <%= pke.name %>\n*author:<%= pke.author %> */\n'
            },
            buildall: {
                //执行所有文件，先执行concat，再执行uglify
                files: [{
                    expand: true,
                    cwd: 'dist',
                    src: ['**/*.js', '!**/*-debug.js'],
                    dest: 'dist'
                }]
            }
        },
        //less 转 css
        less: {
            development: {
                options: {
                    sourceMap: true,
                    compress: true
                },
                files: {
                    "../stylesheets/ishare_public.css": "../stylesheets/ishare_public.less",
                    "../stylesheets/ishare_detail_b.css": "../stylesheets/ishare_detail_b.less",
                    "../stylesheets/ishare_detail.css": "../stylesheets/ishare_detail.less",
                    "../stylesheets/pay/ishare_pay.css": "../stylesheets/pay/ishare_pay.less",
                    "../stylesheets/search/ishare_search.css": "../stylesheets/search/ishare_search.less",
                    "../stylesheets/ishare_coupon_list.css": "../stylesheets/ishare_coupon_list.less",
                    "../stylesheets/ishare_ishare_coupon.css": "../stylesheets/ishare_coupon.less",
                    "../stylesheets/ishare_coupon_ad.css": "../stylesheets/ishare_coupon_ad.less",
                    "../stylesheets/rights/ishare_rights.css": "../stylesheets/rights/ishare_rights.less",
                    "../stylesheets/rights/rights.css": "../stylesheets/rights/rights.less",
                    "../stylesheets/special/ishare_special.css": "../stylesheets/special/ishare_special.less",
                    "../stylesheets/feedback/feedback.css": "../stylesheets/feedback/feedback.less",
                    "../stylesheets/personalCenter/personalCenter.css": "../stylesheets/personalCenter/personalCenter.less",
                    "../stylesheets/authentication/index.css": "../stylesheets/authentication/index.less",
                    "../stylesheets/authentication/user.css": "../stylesheets/authentication/user.less",
                    "../stylesheets/authentication/org.css": "../stylesheets/authentication/org.less",
                    "../stylesheets/category/category.css": "../stylesheets/category/category.less",
                    "../stylesheets/earth/index.css": "../stylesheets/earth/index.less",
                    "../stylesheets/spider/spider.css": "../stylesheets/spider/spider.less",
                }
            }
        },

        //压缩图片大小
        imagemin:{
            dist :{
                options :{
                    optimizationLevel : 3 //定义 PNG 图片优化水平
                },
                files:[
                    {
                        expand:true,
                        cwd : '../images',
                        src : ['**/*.{png,jpg,jpeg,gif}'],//优化 img 目录下所有 png/jpg/jpeg 图片
                        dest : '../images' //优化后的图片保存位置，覆盖旧图片，并且不作提示（建议新建一个目录）
                    }
                ]
            }
        },
        copy: {
            main: {
                files: [
                    {
                        'development/seajs_config.js': ['.build/seajs_config.js']
                    }, {
                        expand: true,
                        cwd: 'dist/',
                        src: ['**'],
                        dest: 'development/dist/'
                    }, {
                        expand: true,
                        cwd: 'sea-modules/',
                        src: ['**'],
                        dest: 'development/sea-modules/'
                    }
                ]
            }
        },
        clean: {
            spm: ['.build']
        }
    });

    //加载任务
    grunt.loadNpmTasks('grunt-cmd-transport');
    grunt.loadNpmTasks('grunt-cmd-concat');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-devcode');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.registerTask('css', ['less']);
    grunt.registerTask('build', ['devcode', 'less', 'transport', 'concat', 'uglify', 'copy', 'clean','imagemin']);
}