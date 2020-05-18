define(function(require , exports , module){
    require("./login");
    require('../cmd-lib/toast');
    require("../cmd-lib/upload/Q");
    require("../cmd-lib/upload/Q.Uploader");
    var utils = require("../cmd-lib/util");
    var api = require('../application/api');
    var tmpList = require('./template/list.html')
    var uploadObj = {
        uploadFiles:[],
        addFiles:[],
        Allcategory:[],
        init:function(){
            uploadObj.checkHook();
            uploadObj.tabSwitch();
            uploadObj.upload();
            uploadObj.getAllcategory();
            uploadObj.categoryOption();
            // uploadObj.createFolder('的哥文件夹');
            uploadObj.saveUploadFile()
        },
        getDom:function(){

        },
        checkHook:function(){
            // 勾选上传编辑文件
            $(document).on('click','.data-checked',function(){
                $(this).toggleClass('checked-active')
            })
        },
        tabSwitch:function(){
            //切换tab
            var index = 0;
            $('.tab').on('click','.tabItem',function(){
                $(this).addClass('active').siblings().removeClass('active');
                index = $(this).index();
                $('.imgUpload').find('img').hide();
                $('.imgUpload').find('img').eq(index).show();
            })
        },
        upload:function(){
            var Uploader = Q.Uploader;
            var uploader = new Uploader({
                url:"/ishare-upload/fileUpload",
                target: document.getElementById("upload-target"),
                upName:'file',
                dataType: "application/json",
                multiple: true,
                workerThread:20,
                // view: document.getElementById("upload-view"),
                allows: ".word,.pdf,.ppt,.txt,.xls,.xlsx", //允许上传的文件格式
                maxSize: 2 * 1024 * 1024,                //允许上传的最大文件大小,字节,为0表示不限(仅对支持的浏览器生效)
                //每次上传都会发送的参数(POST方式)
                /*
                    上传回调事件：
                    init,          //上传管理器初始化完毕后触发
                    select,        //点击上传按钮准备选择上传文件之前触发,返回false可禁止选择文件
                    add[Async],    //添加任务之前触发,返回false将跳过该任务
                    upload[Async], //上传任务之前触发,返回false将跳过该任务
                    send[Async],   //发送数据之前触发,返回false将跳过该任务
                    cancel,        //取消上传任务后触发
                    remove,        //移除上传任务后触发
                    progress,      //上传进度发生变化后触发(仅html5模式有效)
                    complete       //上传完成后触发
                */
                on: {
                    //添加之前触发
                    add: function (task) {
                        //task.limited存在值的任务不会上传，此处无需返回false
                        switch (task.limited) {
                            case 'ext': return  $.toast({
                                text: "不支持此格式上传",
                            });
                            case 'size': return $.toast({
                                text: "允许上传的最大文件大小为：" + Q.formatSize(this.ops.maxSize)+','+task.name+'上传失败',
                            }); 
                        }
                        //自定义判断，返回false时该文件不会添加到上传队列
                        //return false;
                        uploadObj.uploadFiles = uploadObj.uploadFiles.concat(task)
                        console.log(uploadObj.uploadFiles);
                        uploadObj.publicFileRener()
                    },
                    //任务移除后触发
                    remove: function (task) {
                        console.log(task.name + ": 已移除!");
                    },
                    //上传之前触发
                    upload: function (task) {
                        //exe文件可以添加，但不会上传
                        if (task.ext == ".exe") return false;
                        //可针对单独的任务配置参数(POST方式)
                        // console.log(task)
                    },
                    //上传完成后触发
                    complete: function (task) {
                        console.log('%%%%%%%%%%%%%%')
                        var res = JSON.parse(task.response);
                        // console.log(res.data.fail)
                        // console.log(res.data.success)
                        uploadObj.uploadFiles = uploadObj.uploadFiles.concat(res.data.fail,res.data.success);
                        $('.secondStep').show();
                        $('.firstStep').hide();
                        //this.list  为上传任务列表
                        //this.index 为当前上传任务索引
                        if (this.index >= this.list.length - 1) {
                            //所有任务上传完成
                            console.log(uploadObj.uploadFiles)
                            console.log("所有任务上传完成：" + new Date());
                        }
                    }
                }
            });
        },
        drop_upload:function(){

        },
        getAllcategory:function(){
            var params = {
                deeplevel: 3,
                    id:"0"
            }
            params = JSON.stringify(params)
            $.ajax({
                type: 'post',
                url: api.upload.getCategory,
                contentType: "application/json;charset=utf-8",
                data: params,
                success: function (res) {
                    if (res.code == 0) {
                        uploadObj.Allcategory = res.data.categoryList;
                    } else {
                        utils.showAlertDialog("温馨提示", res.msg);
                    }
                },
                complete: function () {
                    
                }
            })
        },
        categoryOption:function(){
            $('.doc-list').on('click','.js-fenlei',function(){
                $(this).siblings('.fenlei').toggle()
            })
            $('.doc-list').on('hover','li',function(){
                $(this).addClass('active').siblings('li').removeClass('active');
                $(this).find('ul li').removeClass('active');
                $(this).parents('.date-con-in').css({overflowY:'auto'})
               
            })
            $('.doc-list').on('hover','.date-con-first li',function(){
                $(this).parents('.date-con-in').css({width:'282px',overflow: 'hidden scroll'})

            })
          
            $('.doc-list').on('hover','.date-con-sec li',function(){
                $(this).parents('.date-con-in').css({width:'423px',overflow: 'hidden scroll'})
               
            })
            $('.doc-list').on('click','.doc-li',function(event){
                $('.doc-list').find('.fenlei').hide()
             },false)
            $('.doc-list').on('click','.date-con-in li',function(event){
                event.stopPropagation()
                var text = '';
               if ($('.date-con-first>li.active a').attr('cid')) {
                    text += $('.date-con-first>li.active a').attr('name')
                    if ($('.date-con-sec>li.active a').attr('cid')) {
                        text += '>'+$('.date-con-sec>li.active a').attr('name')
                        if ($('.date-con-third>li.active a').attr('cid')) {
                            text += '>'+$('.date-con-third>li.active a').attr('name')
                        }
                    }
                    $('.choose-text.fenleiTtile').text(text)
                    $('.doc-list').find('.fenlei').hide()
               }
            })
           
        },
        createFolder:function(name){
            var params = {
                name: name
            }
            params = JSON.stringify(params)
            $.ajax({
                type: 'post',
                url: api.upload.createFolder,
                contentType: "application/json;charset=utf-8",
                data: params,
                success: function (res) {
                    if (res.code == 0) {
                        uploadObj.getFolder()
                    } else {
                        
                    }
                },
                complete: function () {
                    
                }
            })
        },
        getFolder:function(){
            var params = {
                deeplevel: 3,
                    id:"0"
            }
            params = JSON.stringify(params)
            $.ajax({
                type: 'post',
                url: api.upload.getFolder,
                contentType: "application/json;charset=utf-8",
                data: params,
                success: function (res) {
                    if (res.code == 0) {
                       
                    } else {
                        
                    }
                },
                complete: function () {
                    
                }
            })
        },
        publicFileRener:function(){
            var _html = template.compile(tmpList)(uploadObj);
            $('.doc-list').html(_html)
        },
        saveUploadFile:function(){
            var params = {
                classid: "9055",
                classname: "简历模板",
                description: "这个文件很牛",
                files: [
                  {
                    extension: "xls",
                    fileName: "链接导入模板111.xls",
                    path: "X6g6wDTyb.xls",
                    size: 20992
                  }
                ],
                folderId: "5ebf9a531fc06b73f4b87b11",
                folderName: "的哥文件夹",
                permin: "1",
                preRead: 5,
                uid: "string",
                userFilePrice: 100,
                userFileType: 5
              }
            params = JSON.stringify(params)
            $.ajax({
                type: 'post',
                url: api.upload.saveUploadFile,
                contentType: "application/json;charset=utf-8",
                data: params,
                success: function (res) {
                    if (res.code == 0) {
                       
                    } else {
                        
                    }
                },
                complete: function () {
                    
                }
            })
        }
    }
    uploadObj.init();
});