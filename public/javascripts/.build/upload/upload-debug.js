define("dist/upload/upload-debug", [ "../application/suspension-debug", "../application/method-debug", "../application/checkLogin-debug", "../application/api-debug", "../application/urlConfig-debug", "../application/login-debug", "../common/bilog-debug", "base64-debug", "../cmd-lib/util-debug", "../report/config-debug", "../cmd-lib/myDialog-debug", "../cmd-lib/toast-debug", "../application/iframe/iframe-messenger-debug", "../application/iframe/messenger-debug", "../common/baidu-statistics-debug", "../application/app-debug", "../application/element-debug", "../application/template-debug", "../application/extend-debug", "../application/effect-debug", "../application/helper-debug", "../application/single-login-debug", "./fixedTopBar-debug", "../cmd-lib/upload/Q-debug", "../cmd-lib/upload/Q.Uploader-debug", "./template/list-debug.html", "./template/list_pravite-debug.html" ], function(require, exports, module) {
    require("../application/suspension-debug");
    require("./fixedTopBar-debug");
    require("../cmd-lib/toast-debug");
    require("../cmd-lib/upload/Q-debug");
    require("../cmd-lib/upload/Q.Uploader-debug");
    var login = require("../application/checkLogin-debug");
    var utils = require("../cmd-lib/util-debug");
    var api = require("../application/api-debug");
    var tmpList = require("./template/list-debug.html");
    //公开资料模板
    var tmpList2 = require("./template/list_pravite-debug.html");
    //私密资料模板
    var method = require("../application/method-debug");
    var isLogin = require("../application/effect-debug").isLogin;
    var isAutoLogin = true;
    var urlConfig = require("../application/urlConfig-debug");
    var uploadObj = {
        uploadFiles: [],
        permin: 1,
        //1:公开、2:私密
        addFiles: [],
        isAuth: true,
        Allcategory: [],
        folders: [],
        allChecked: {
            classid: "",
            className: "",
            userFileType: "",
            userFilePrice: ""
        },
        init: function() {
            uploadObj.checkHook();
            uploadObj.tabSwitch();
            uploadObj.getAllcategory();
            uploadObj.categoryOption();
            uploadObj.getFolder();
            uploadObj.saveUploadFile();
            uploadObj.typeSelect();
            uploadObj.priceSelect();
            uploadObj.saveFolderOption();
            uploadObj.delete();
            // uploadObj.beforeInit();
            setTimeout(function() {
                uploadObj.upload();
            }, 500);
            $("body").click(function() {
                $(".fenlei").hide();
                $(".folder").hide();
                $(".permin").hide();
                $(".money").hide();
            });
        },
        beforeInit: function() {},
        checkHook: function() {
            // 勾选上传编辑文件
            $(document).on("click", ".data-checked", function() {
                $(this).toggleClass("checked-active");
                var itemIndex = $(this).parents(".doc-li").attr("index");
                if (itemIndex > -1) {
                    if ($(this).hasClass("checked-active")) {
                        uploadObj.uploadFiles[itemIndex].checked = true;
                    } else {
                        uploadObj.uploadFiles[itemIndex].checked = false;
                    }
                } else {
                    if ($(this).hasClass("checked-active")) {
                        uploadObj.uploadFiles.forEach(function(item) {
                            item.checked = true;
                        });
                    } else {
                        uploadObj.uploadFiles.forEach(function(item) {
                            item.checked = false;
                        });
                    }
                }
                uploadObj.publicFileRener();
            });
        },
        tabSwitch: function() {
            //切换tab
            var index = 0;
            $(".tab").on("click", ".tabItem", function() {
                $(this).addClass("active").siblings().removeClass("active");
                index = $(this).index();
                $(".imgUpload").find("img").hide();
                $(".imgUpload").find("img").eq(index).show();
                uploadObj.permin = Number(index) + 1;
            });
        },
        upload: function() {
            var E = Q.event, Uploader = Q.Uploader;
            var uploader = new Uploader({
                url: urlConfig.upload + api.upload.fileUpload,
                target: [ document.getElementById("upload-target"), document.getElementById("upload-target2") ],
                upName: "file",
                dataType: "application/json",
                multiple: true,
                // workerThread:20,
                // view: document.getElementById("upload-view"),
                allows: ".pdf,.ppt,.pptx,.txt,.xls,.xlsx,.doc,.docx",
                //允许上传的文件格式
                maxSize: 50 * 1024 * 1024,
                //允许上传的最大文件大小,字节,为0表示不限(仅对支持的浏览器生效)
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
                    init: function() {},
                    //添加之前触发
                    add: function(task) {
                        //task.limited存在值的任务不会上传，此处无需返回false
                        switch (task.limited) {
                          case "ext":
                            return $.toast({
                                text: "不支持此格式上传"
                            });

                          case "size":
                            return $.toast({
                                text: "资料过大，请压缩后重新上传"
                            });
                        }
                        //自定义判断，返回false时该文件不会添加到上传队列
                        //userFileType 1 免费 5 付费 6 私有
                        if (uploadObj.uploadFiles.length > 19) {
                            return false;
                        }
                        var ext = task.ext.split(".")[1];
                        var obj = {
                            ext: ext,
                            fileName: task.name,
                            size: task.size,
                            userFileType: 1,
                            userFilePrice: "",
                            preRead: "",
                            permin: uploadObj.permin
                        };
                        uploadObj.uploadFiles = uploadObj.uploadFiles.concat(obj);
                        $(".secondStep").show();
                        $(".firstStep").hide();
                        // console.log(uploadObj.uploadFiles);
                        // console.log(task)
                        // console.log('&&&&&&&&&&&&&&&&&&&')
                        uploadObj.publicFileRener();
                    },
                    //任务移除后触发
                    remove: function(task) {
                        console.log(task.name + ": 已移除!");
                    },
                    //上传之前触发
                    upload: function(task) {
                        //exe文件可以添加，但不会上传
                        if (task.ext == ".exe") return false;
                    },
                    // 上传进度
                    progress: function(task) {},
                    //上传完成后触发
                    complete: function(task) {
                        var res = JSON.parse(task.response);
                        uploadObj.addFiles = uploadObj.addFiles.concat(res.data.fail, res.data.success);
                        //this.list  为上传任务列表
                        //this.index 为当前上传任务索引
                        //uploadStatus 1成功 2失败
                        if (res.data.fail.length > 0) {
                            uploadObj.uploadFiles.forEach(function(item) {
                                if (item.fileName == res.data.fail[0].fileName && item.size == res.data.success[0].size) {
                                    item.uploadStatus = 2;
                                }
                            });
                        }
                        if (res.data.success.length > 0) {
                            uploadObj.uploadFiles.forEach(function(item) {
                                if (item.fileName == res.data.success[0].fileName && item.size == res.data.success[0].size) {
                                    item.uploadStatus = 1;
                                    item.path = res.data.success[0].path;
                                    item.extension = res.data.success[0].extension;
                                }
                            });
                        }
                        uploadObj.publicFileRener();
                        if (this.index >= this.list.length - 1) {}
                    }
                }
            });
            var boxDropArea = document.getElementById("drop-area");
            if (!Uploader.support.html5) {
                $(".dratTip").text("您的浏览器不支持拖拽文件上传！");
                return;
            }
            //阻止浏览器默认拖放行为
            E.add(boxDropArea, "dragleave", E.stop);
            E.add(boxDropArea, "dragenter", E.stop);
            E.add(boxDropArea, "dragover", E.stop);
            E.add(boxDropArea, "drop", function(e) {
                E.stop(e);
                //获取文件对象
                var files = e.dataTransfer.files;
                uploader.addList(files);
            });
        },
        getAllcategory: function() {
            var params = {
                type: "0"
            };
            params = JSON.stringify(params);
            $.ajax({
                headers: {
                    Authrization: method.getCookie("cuk")
                },
                type: "post",
                url: api.upload.getWebAllFileCategory,
                contentType: "application/json;charset=utf-8",
                data: params,
                success: function(res) {
                    if (res.code == 0) {
                        res.data.forEach(function(layer1) {
                            if (layer1.subList && layer1.subList.length > 0) {
                                layer1.subList.forEach(function(layer2) {
                                    if (layer2.subList && layer2.subList.length > 0) {
                                        layer2.subList.forEach(function(layer3) {
                                            layer3.last = 1;
                                        });
                                    } else {
                                        layer2.last = 0;
                                    }
                                });
                            } else {
                                layer1.last = 0;
                            }
                        });
                        // uploadObj.Allcategory = res.data.categoryList;
                        uploadObj.Allcategory = res.data;
                        console.log(uploadObj.Allcategory);
                    } else {
                        utils.showAlertDialog("温馨提示", res.message);
                    }
                },
                complete: function() {}
            });
        },
        // 分类选择
        categoryOption: function() {
            $(".doc-list").on("click", ".js-fenlei", function(e) {
                e.stopPropagation();
                $(this).siblings(".fenlei").toggle();
                $(this).siblings(".fenlei").find(".date-con-in").css({
                    width: "140px",
                    overflow: "hidden scroll"
                });
            });
            // $('.doc-list').on('hover','li',function(){
            //     $(this).addClass('active').siblings('li').removeClass('active');
            //     // $(this).find('ul li').removeClass('active');
            //     $(this).parents('.date-con-in').css({overflowY:'auto'})
            // })
            $(".doc-list").on("hover", ".date-con-first>li", function() {
                $(this).addClass("active").siblings("li").removeClass("active");
                $(".date-con-sec>li").removeClass("active");
                $(this).parents(".date-con-in").css({
                    overflowY: "auto"
                });
                $(this).parents(".date-con-in").css({
                    width: "282px",
                    overflow: "hidden scroll"
                });
            });
            $(".doc-list").on("hover", ".date-con-first", function() {
                $(this).parents(".date-con-in").css({
                    width: "282px",
                    overflow: "hidden scroll"
                });
            });
            $(".doc-list").on("hover", ".date-con-sec>li", function() {
                $(this).addClass("active").siblings("li").removeClass("active");
                $(".date-con-third>li").removeClass("active");
                var itemWidth = "282px";
                if ($(this).find("a").attr("last")) {
                    itemWidth = "282px";
                } else {
                    itemWidth = "423px";
                    var height = $(".date-con-sec").height();
                    $(".date-con-third").height("210px");
                }
                $(this).parents(".date-con-in").css({
                    width: itemWidth,
                    overflow: "hidden scroll"
                });
            });
            $(".doc-list").on("hover", ".date-con-third li", function() {
                $(this).addClass("active").siblings("li").removeClass("active");
                $(this).parents(".date-con-in").css({
                    width: "423px",
                    overflow: "hidden scroll"
                });
            });
            $(".doc-list").on("click", ".date-con-in li", function(event) {
                event.stopPropagation();
                if (!$(this).find("a").attr("last")) {
                    return false;
                }
                var text = "";
                var classid = "";
                var classname = "";
                var _index = $(event.target).parents(".doc-li").attr("index");
                if ($(".date-con-first>li.active a").attr("cid")) {
                    text += $(".date-con-first>li.active a").attr("name");
                    classname = $(".date-con-first>li.active a").attr("name");
                    classid = $(".date-con-first>li.active a").attr("cid");
                    if ($(".date-con-sec>li.active a").attr("cid")) {
                        text += ">" + $(".date-con-sec>li.active a").attr("name");
                        classname = $(".date-con-sec>li.active a").attr("name");
                        classid = $(".date-con-sec>li.active a").attr("cid");
                        if ($(".date-con-third>li.active a").attr("cid")) {
                            text += ">" + $(".date-con-third>li.active a").attr("name");
                            classname = $(".date-con-third>li.active a").attr("name");
                            classid = $(".date-con-third>li.active a").attr("cid");
                        }
                    }
                    $(".fenlei").hide();
                    if (_index > -1) {
                        $(event.target).parents(".data-must").find(".choose-text.fenleiTtile").text(text);
                        var _index = $(event.target).parents(".doc-li").attr("index");
                        uploadObj.uploadFiles[_index].classid = classid;
                        uploadObj.uploadFiles[_index].classname = classname;
                        uploadObj.uploadFiles[_index].fenlei = text;
                    } else {
                        // 底部操作
                        $(event.target).parents(".op-choose").find(".js-fenlei .fenleiTtile").text(text);
                        uploadObj.uploadFiles.forEach(function(item) {
                            if (item.checked) {
                                item.classid = classid;
                                item.className = classname;
                                item.fenlei = text;
                            }
                        });
                    }
                }
                uploadObj.publicFileRener();
            });
        },
        // 类型选择
        typeSelect: function() {
            $(".doc-list").on("click", ".js-type", function(e) {
                if (!uploadObj.isAuth) {
                    return false;
                }
                e.stopPropagation();
                $(this).siblings(".permin").toggle();
            });
            $(".doc-list").on("hover", ".permin a", function() {
                $(this).addClass("selected").siblings("a").removeClass("selected");
            });
            $(".doc-list").on("click", ".permin a", function(e) {
                var permin = $(this).attr("permin");
                var text = permin == 1 ? "免费资料" : "付费资料";
                var itemIndex = $(event.target).parents(".doc-li").attr("index");
                if (itemIndex > -1) {
                    $(this).parents(".data-must").find(".typeTitle").text(text);
                    $(event.target).parents(".data-must").find(".permin").hide();
                    if ($(this).attr("permin") == 1) {
                        $(".js-file-item").find(".doc-li").eq(itemIndex).find(".js-need-money").hide();
                    } else {
                        $(".js-file-item").find(".doc-li").eq(itemIndex).find(".js-need-money").show();
                    }
                    uploadObj.uploadFiles[itemIndex].userFileType = permin;
                } else {
                    $(this).parents(".batch-op").find(".typeTitle").text(text);
                    $(event.target).parents(".batch-op").find(".permin").hide();
                    if ($(this).attr("permin") == 1) {
                        $(".batch-op").find(".js-need-money").hide();
                    } else {
                        $(".batch-op").find(".js-need-money").show();
                    }
                    uploadObj.uploadFiles.forEach(function(item) {
                        if (item.checked) {
                            item.userFileType = permin;
                        }
                    });
                }
                uploadObj.publicFileRener();
            });
        },
        // 价钱选择
        priceSelect: function() {
            $(".doc-list").on("click", ".js-price", function(e) {
                e.stopPropagation();
                $(this).siblings(".money").toggle();
            });
            $(".doc-list").on("hover", ".money a", function() {
                $(this).addClass("selected").siblings("a").removeClass("selected");
            });
            $(".doc-list").on("click", ".money a", function(e) {
                var aval = $(this).attr("aval");
                var itemIndex = $(event.target).parents(".doc-li").attr("index");
                var text = aval == "0" ? "自定义" : "¥" + aval;
                $(this).parents(".doc-li").find(".moneyTitle").text(text);
                $(event.target).parents(".doc-li").find(".money").hide();
                if (itemIndex > -1) {
                    uploadObj.uploadFiles[itemIndex].userFilePrice = aval;
                    if (aval == "0") {
                        uploadObj.uploadFiles[itemIndex].definePrice = true;
                    } else {
                        uploadObj.uploadFiles[itemIndex].definePrice = false;
                    }
                } else {
                    if (aval == "0") {
                        $(this).parents(".batch-op").find(".js-input-money").show();
                    } else {
                        $(this).parents(".batch-op").find(".js-input-money").hide();
                    }
                    uploadObj.uploadFiles.forEach(function(item) {
                        if (item.checked) {
                            item.userFilePrice = aval;
                            if (aval == "0") {
                                item.definePrice = true;
                            }
                        }
                    });
                }
                uploadObj.publicFileRener();
            });
        },
        //  输入金额
        inputPrice: function() {
            $(".js-file-item").on("blur", ".doc-pay-input input[name='moneyPrice']", function() {
                var priceVal = $(this).val();
                if (!priceVal) {
                    $(this).siblings(".select-item-info").show().text("请输入金额");
                } else if (priceVal < 0 || priceVal == 0) {
                    $(this).siblings(".select-item-info").show().text("金额必须大于0");
                } else {
                    $(this).siblings(".select-item-info").hide();
                }
                var itemIndex = $(event.target).parents(".doc-li").attr("index");
                if (itemIndex > -1) {
                    if (priceVal > 0) {
                        uploadObj.uploadFiles[itemIndex].userFilePrice = priceVal;
                    }
                } else {
                    if (priceVal > 0) {
                        uploadObj.uploadFiles.forEach(function(item) {
                            if (item.checked) {
                                item.userFilePrice = priceVal;
                            }
                        });
                    }
                }
            });
            $(".js-file-item").on("blur", ".doc-pay-input input[name='moneyPrice']", function() {});
            $(".doc-batch-fixed").on("blur", ".doc-pay-input input[name='moneyPrice']", function() {
                var priceVal = $(this).val();
                uploadObj.uploadFiles.forEach(function(item) {
                    if (item.checked) {
                        item.userFilePrice = priceVal;
                    }
                });
                uploadObj.publicFileRener();
            });
        },
        // 试读
        inputPreRead: function() {
            $(".js-file-item").on("blur", "input[name='preRead']", function() {
                var preRead = $(this).val();
                var itemIndex = $(event.target).parents(".doc-li").attr("index");
                if (itemIndex > -1) {
                    uploadObj.uploadFiles[itemIndex].preRead = preRead;
                } else {
                    uploadObj.uploadFiles.forEach(function(item) {
                        if (item.checked) {
                            item.preRead = preRead;
                        }
                    });
                }
            });
            $(".doc-batch-fixed").on("blur", "input[name='preRead']", function() {
                var preRead = $(this).val();
                uploadObj.uploadFiles.forEach(function(item) {
                    if (item.checked) {
                        item.preRead = preRead;
                    }
                });
                uploadObj.publicFileRener();
            });
        },
        // 简介
        briefIntroduce: function() {
            $(".js-file-item").on("keyup", ".js-text-area", function() {
                if ($(this).val().length < 201) {
                    $(this).siblings(".num-con").find("em").text($(this).val().length);
                } else {
                    var val = $(this).val().substr(0, 200);
                    $(this).val(val);
                }
                var itemIndex = $(event.target).parents(".doc-li").attr("index");
                uploadObj.uploadFiles[itemIndex].description = $(this).val();
            });
        },
        // 选择保存
        saveFolderOption: function() {
            $(".doc-list").on("click", ".js-folder-hook", function(e) {
                e.stopPropagation();
                $(this).siblings(".folder").toggle();
            });
            $(".doc-list").on("click", ".js-folder-new", function() {
                $(".dialog-new-built").show();
                $("#bgMask").show();
                $(this).parent().parent().hide();
            });
            $(".doc-list").on("click", ".js-folder-item", function() {
                var text = $(this).attr("name") || "";
                var id = $(this).attr("id") || "";
                $(this).parent().parent().hide();
                var itemIndex = $(event.target).parents(".doc-li").attr("index");
                if (itemIndex > -1) {
                    $(this).parent().parent().siblings(".js-folder-hook").find("p").text(text);
                    uploadObj.uploadFiles[itemIndex].folderId = id;
                    uploadObj.uploadFiles[itemIndex].folderName = text;
                } else {
                    $(this).parent().parent().siblings(".js-folder-hook").find("em").text(text);
                    uploadObj.uploadFiles.forEach(function(item) {
                        if (item.checked) {
                            item.folderId = id;
                            item.folderName = text;
                        }
                    });
                }
                uploadObj.publicFileRener();
            });
            $(".js-newbuild-confirm").click(function() {
                var name = $('input[name="folderName"]').val().trim();
                uploadObj.createFolder(name);
            });
        },
        // 新建文件夹
        createFolder: function(name) {
            var params = {
                name: name
            };
            params = JSON.stringify(params);
            $.ajax({
                headers: {
                    Authrization: method.getCookie("cuk")
                },
                type: "post",
                url: api.upload.createFolder,
                contentType: "application/json;charset=utf-8",
                data: params,
                success: function(res) {
                    if (res.code == 0) {
                        uploadObj.getFolder();
                        $(".dialog-new-built").hide();
                        $("#bgMask").hide();
                    } else {
                        $.toast({
                            text: res.message
                        });
                    }
                },
                complete: function() {}
            });
        },
        getFolder: function() {
            var params = {
                deeplevel: 3,
                id: "0"
            };
            params = JSON.stringify(params);
            $.ajax({
                headers: {
                    Authrization: method.getCookie("cuk")
                },
                type: "post",
                url: api.upload.getFolder,
                contentType: "application/json;charset=utf-8",
                data: params,
                success: function(res) {
                    if (res.code == 0) {
                        uploadObj.folders = res.data;
                        uploadObj.publicFileRener();
                    } else {
                        uploadObj.folders = [];
                    }
                },
                complete: function() {}
            });
        },
        publicFileRener: function() {
            var _html = "";
            if (uploadObj.permin == 1) {
                _html = template.compile(tmpList)(uploadObj);
            } else {
                _html = template.compile(tmpList2)(uploadObj);
                // 隐藏底部操作
                $(".private_status").hide();
            }
            var uploadAmount = uploadObj.uploadFiles.length;
            $(".uploadAmount").text(uploadAmount);
            $(".js-file-item").html(_html);
            uploadObj.bottomCategory();
            uploadObj.inputPrice();
            uploadObj.inputPreRead();
            uploadObj.verifyRequire();
            uploadObj.briefIntroduce();
            if (uploadObj.uploadFiles.length > 19) {
                $("#upload-target2").hide();
            } else {
                $("#upload-target2").show();
            }
        },
        // 渲染底部分类&文件夹
        bottomCategory: function() {
            var _html = $(".fenlei .date-con-in").html();
            var foldhtml = $(".folder").html();
            $(".js-bottom-category").html(_html);
            $(".js-folder-con").html(foldhtml);
        },
        // 删除
        "delete": function() {
            $(".js-file-item").on("click", ".js-delete", function() {
                var index = $(this).parents(".doc-list").attr("index");
                uploadObj.uploadFiles.splice(index, 1);
                uploadObj.publicFileRener();
            });
        },
        verifyRequire: function() {
            $(".js-file-item").on("keyup", ".data-name input[name='fileName']", function() {
                if ($(this).val()) {
                    if ($(this).val().length > 64) {
                        $(this).parent().siblings(".warn-tip").show().text("标题字数不能超过64个字");
                    } else {
                        $(this).parent().siblings(".warn-tip").hide();
                    }
                } else {
                    $(this).parent().siblings(".warn-tip").show().text("标题不能为空");
                }
            });
        },
        dataVerify: function(item, index) {
            if (!item.fileName) {
                $(".js-file-item").find(".doc-li").eq(index).find(".warn-tip").show().text("标题不能为空");
            }
            if (!item.classid) {
                $(".js-file-item").find(".doc-li").eq(index).find(".must-error").show();
            }
            if (!item.folderId) {
                $(".js-file-item").find(".doc-li").eq(index).find(".folder-error").show();
            }
            if (item.userFileType == 5) {
                if (!item.definePrice && item.userFilePrice == "0") {
                    $(".js-file-item").find(".doc-li").eq(index).find(".momey-wanning").hide();
                    $(".js-file-item").find(".doc-li").eq(index).find(".pay-item-info").hide();
                    $(".js-file-item").find(".doc-li").eq(index).find(".price-error").show();
                } else if (item.userFilePrice == "0") {
                    $(".js-file-item").find(".doc-li").eq(index).find(".momey-wanning").hide();
                    $(".js-file-item").find(".doc-li").eq(index).find(".select-item-info").show();
                }
            }
        },
        // 保存
        saveUploadFile: function() {
            var locker = false;
            $(".js-submitbtn").click(function() {
                var stop = false;
                var isUnfinishUpload = false;
                var isAvaliableFile = false;
                var isChecked = false;
                var params = [];
                uploadObj.uploadFiles.forEach(function(item, index) {
                    if (item.checked) {
                        isChecked = true;
                        if (item.uploadStatus != 1) {
                            isUnfinishUpload = true;
                        } else if (item.uploadStatus == 1) {
                            isAvaliableFile = true;
                        }
                        if (uploadObj.permin == 1) {
                            if (!item.fileName || !item.folderId || !item.classid) {
                                stop = true;
                            }
                            if (item.userFileType == 5) {
                                if (item.userFilePrice == "0") {
                                    stop = true;
                                }
                            }
                        } else {
                            if (!item.fileName || !item.folderId) {
                                stop = true;
                            }
                        }
                        uploadObj.dataVerify(item, index);
                        var obj = JSON.parse(JSON.stringify(item));
                        if (item.userFileType == 5) {
                            obj.userFilePrice = item.userFilePrice * 100;
                        }
                        if (!item.userFilePrice) {
                            obj.userFilePrice = "0";
                        }
                        if (item.uploadStatus == 1) {
                            params.push(obj);
                        }
                    }
                });
                if (stop) {
                    return false;
                }
                if (!isChecked) {
                    $.toast({
                        text: "请勾选上传资料"
                    });
                    return false;
                }
                params = JSON.stringify(params);
                if (isUnfinishUpload) {
                    if (!isAvaliableFile) {
                        $.toast({
                            text: "资料未上传完成，无法保存！"
                        });
                        return false;
                    }
                    $(".js-upload-tip").show();
                    $("#bgMask").show();
                    $(".js-continue-upload").click(function() {
                        upload();
                        $("#bgMask").hide();
                        $(".js-upload-tip").hide();
                    });
                } else {
                    upload();
                }
                function upload() {
                    // $.toast({
                    //     text: '上传中......',
                    //     delay:1000000
                    // });
                    if (locker) {
                        return false;
                    }
                    locker = true;
                    $.ajax({
                        headers: {
                            Authrization: method.getCookie("cuk")
                        },
                        type: "post",
                        url: api.upload.saveUploadFile,
                        contentType: "application/json;charset=utf-8",
                        data: params,
                        success: function(res) {
                            locker = false;
                            // $('body').find('.ui-toast').hide()
                            if (res.code == 0) {
                                $(".secondStep").hide();
                                $(".successWrap").show();
                            } else {
                                $.toast({
                                    text: res.message
                                });
                            }
                        },
                        complete: function() {
                            locker = false;
                        }
                    });
                }
            });
        }
    };
    isLogin(function(data) {
        uploadObj.isAuth = data.isAuth == 1 ? true : false;
        uploadObj.init();
    }, isAutoLogin);
    $("#upload-target").click(function() {
        if (!method.getCookie("cuk")) {
            isLogin(null, isAutoLogin);
        }
    });
});