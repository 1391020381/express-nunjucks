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
                    'dist/detail/index.js': ['.build/detail/index.js'],
                    'dist/detail/detail.js': ['.build/detail/detail.js'],
                }
            }
        },
        //压缩js
        uglify: {
            options: {
                sourceMap: 'dist/js-source-map/ishare-web-pc.js.map',
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
                    compress: true,
                    ieCompat: true,
                },
                files: {
                    // "../stylesheets/ishare_public.css": "../stylesheets/ishare_public.less",
                }
            }
        },

        //压缩图片大小
        imagemin: {
            dist: {
                options: {
                    optimizationLevel: 3 //定义 PNG 图片优化水平
                },
                files: [
                    {
                        expand: true,
                        cwd: '../images',
                        src: ['**/*.{png,jpg,jpeg,gif}'],//优化 img 目录下所有 png/jpg/jpeg 图片
                        dest: '../images' //优化后的图片保存位置，覆盖旧图片，并且不作提示（建议新建一个目录）
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
    grunt.registerTask('build', ['devcode', 'less', 'transport', 'concat', 'uglify', 'copy', 'clean', 'imagemin']);
}
