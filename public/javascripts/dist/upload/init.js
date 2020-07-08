define("dist/upload/init", [ "./fixedTopBar", "./upload", "../application/suspension", "../application/method", "../application/checkLogin", "../application/api", "../application/app", "../application/element", "../application/template", "../application/extend", "../common/bilog", "base64", "../cmd-lib/util", "../report/config", "../report/init", "../report/handler", "../report/columns", "../application/helper", "//static3.iask.cn/resource/js/plugins/pc.iask.login.min", "../cmd-lib/toast", "../cmd-lib/upload/Q", "../cmd-lib/upload/Q.Uploader", "./template/list.html", "./template/list_pravite.html" ], function(require, exports, module) {
    require("./fixedTopBar");
    require("./upload");
    require("../application/suspension");
});

define("dist/upload/fixedTopBar", [], function(require, exports, module) {
    //详情页头部悬浮
    var $detailHeader = $(".new-detail-header");
    var headerHeight = $detailHeader.height();
    $(window).scroll(function() {
        var detailTop = $(this).scrollTop();
        if (detailTop - headerHeight >= 0) {
            $detailHeader.addClass("new-detail-header-fix");
        } else {
            $detailHeader.removeClass("new-detail-header-fix");
        }
    });
});

define("dist/upload/upload", [ "dist/application/suspension", "dist/application/method", "dist/application/checkLogin", "dist/application/api", "dist/application/app", "dist/application/element", "dist/application/template", "dist/application/extend", "dist/common/bilog", "base64", "dist/cmd-lib/util", "dist/report/config", "dist/report/init", "dist/report/handler", "dist/report/columns", "dist/application/helper", "//static3.iask.cn/resource/js/plugins/pc.iask.login.min", "dist/upload/fixedTopBar", "dist/cmd-lib/toast", "dist/cmd-lib/upload/Q", "dist/cmd-lib/upload/Q.Uploader" ], function(require, exports, module) {
    require("dist/application/suspension");
    require("dist/upload/fixedTopBar");
    require("dist/cmd-lib/toast");
    require("dist/cmd-lib/upload/Q");
    require("dist/cmd-lib/upload/Q.Uploader");
    var login = require("dist/application/checkLogin");
    var utils = require("dist/cmd-lib/util");
    var api = require("dist/application/api");
    var tmpList = require("dist/upload/template/list.html");
    //公开资料模板
    var tmpList2 = require("dist/upload/template/list_pravite.html");
    //私密资料模板
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
            uploadObj.beforeInit();
            setTimeout(function() {
                uploadObj.upload();
            }, 500);
            $("body").click(function() {
                $(".fenlei").hide();
                $(".folder").hide();
                $(".permin").hide();
                $(".money").hide();
            });
            // 登录
            $(".user-login,.login-open-vip").on("click", function() {
                if (!utils.getCookie("cuk")) {
                    login.notifyLoginInterface(function(data) {
                        uploadObj.refreshTopBar(data);
                    });
                }
            });
            // 退出登录
            $(".btn-exit").click(function() {
                login.ishareLogout();
            });
            // 头部搜索跳转
            $(".btn-new-search").click(function() {
                var searVal = $("#search-detail-input").val();
                window.open("/search/home.html" + "?" + "ft=all" + "&cond=" + encodeURIComponent(encodeURIComponent(searVal)));
            });
        },
        beforeInit: function() {
            if (!utils.getCookie("cuk")) {
                login.notifyLoginInterface(function(data) {
                    if (data) {
                        uploadObj.isAuth = data.isAuth == "0" ? false : true;
                        uploadObj.refreshTopBar(data);
                    }
                });
            } else {
                login.getLoginData(function(data) {
                    if (data) {
                        uploadObj.isAuth = data.isAuth == "0" ? false : true;
                        uploadObj.refreshTopBar(data);
                    }
                });
            }
        },
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
                url: location.protocol + "//upload.ishare.iask.com/ishare-upload/fileUpload",
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
                        if (!utils.getCookie("cuk")) {
                            login.notifyLoginInterface(function(data) {
                                if (data) {
                                    uploadObj.isAuth = data.isAuth == "0" ? false : true;
                                    uploadObj.refreshTopBar(data);
                                }
                            });
                            return false;
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
                deeplevel: 3,
                id: "0"
            };
            params = JSON.stringify(params);
            $.ajax({
                type: "post",
                url: api.upload.getCategory,
                contentType: "application/json;charset=utf-8",
                data: params,
                success: function(res) {
                    if (res.code == 0) {
                        res.data.categoryList.forEach(function(layer1) {
                            if (layer1.categoryList) {
                                layer1.categoryList.forEach(function(layer2) {
                                    if (layer2.categoryList) {
                                        layer2.categoryList.forEach(function(layer3) {
                                            layer3.last = 1;
                                        });
                                    } else {
                                        layer2.last = 1;
                                    }
                                });
                            } else {
                                layer1.last = 1;
                            }
                        });
                        uploadObj.Allcategory = res.data.categoryList;
                    } else {
                        utils.showAlertDialog("温馨提示", res.msg);
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
            $(".doc-list").on("hover", "li", function() {
                $(this).addClass("active").siblings("li").removeClass("active");
                // $(this).find('ul li').removeClass('active');
                $(this).parents(".date-con-in").css({
                    overflowY: "auto"
                });
            });
            $(".doc-list").on("hover", ".date-con-first li", function() {
                $(this).parents(".date-con-in").css({
                    width: "282px",
                    overflow: "hidden scroll"
                });
            });
            $(".doc-list").on("hover", ".date-con-sec li", function() {
                var itemWidth = "282px";
                if ($(this).find("a").attr("last")) {
                    itemWidth = "282px";
                } else {
                    itemWidth = "423px";
                }
                $(this).parents(".date-con-in").css({
                    width: itemWidth,
                    overflow: "hidden scroll"
                });
            });
            $(".doc-list").on("hover", ".date-con-third li", function() {
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
                            text: res.msg
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
                    $.toast({
                        text: "上传中......",
                        delay: 1e6
                    });
                    if (locker) {
                        return false;
                    }
                    locker = true;
                    $.ajax({
                        type: "post",
                        url: api.upload.saveUploadFile,
                        contentType: "application/json;charset=utf-8",
                        data: params,
                        success: function(res) {
                            locker = false;
                            $("body").find(".ui-toast").hide();
                            if (res.code == 0) {
                                $(".secondStep").hide();
                                $(".successWrap").show();
                            } else {
                                $.toast({
                                    text: res.msg
                                });
                            }
                        },
                        complete: function() {
                            locker = false;
                            $("body").find(".ui-toast").hide();
                        }
                    });
                }
            });
        },
        //刷新topbar
        refreshTopBar: function(data) {
            var $unLogin = $("#unLogin");
            var $hasLogin = $("#haveLogin");
            var $btn_user_more = $(".btn-user-more");
            var $vip_status = $(".vip-status");
            var $icon_iShare = $(".icon-iShare");
            var $top_user_more = $(".top-user-more");
            $btn_user_more.text(data.isVip == 1 ? "续费" : "开通");
            var $target = null;
            if (data.msgCount) {
                $(".top-bar .news").removeClass("hide").find("#user-msg").text(data.msgCount);
            }
            //VIP专享资料
            if (utils.getCookie("file_state") === "6") {
                $(".vip-title").eq(0).show();
            }
            //vip
            if (data.isVip == 1) {
                $target = $vip_status.find('p[data-type="2"]');
                $target.find(".expire_time").html(data.expireTime);
                $target.show().siblings().hide();
                $top_user_more.addClass("top-vip-more");
                $(".isVip-show").find("span").html(data.expireTime);
                $(".isVip-show").removeClass("hide");
            } else if (data.userType == 1) {
                $target = $vip_status.find('p[data-type="3"]');
                $hasLogin.removeClass("user-con-vip");
                $target.show().siblings().hide();
            } else if (data.isVip == 0) {
                $hasLogin.removeClass("user-con-vip");
                // 用户不是vip,但是登录啦,隐藏 登录后开通 显示 开通
                $(".btn-join-vip").eq(0).hide();
                $(".btn-join-vip").eq(1).show();
            } else if (data.isVip == 2) {
                $(".vip-title").hide();
            }
            $unLogin.hide();
            $hasLogin.find(".user-link .user-name").html(data.nickName);
            $hasLogin.find(".user-link img").attr("src", data.weiboImage);
            $hasLogin.find(".top-user-more .name").html(data.nickName);
            $hasLogin.find(".top-user-more img").attr("src", data.weiboImage);
            $hasLogin.show();
            window.pageConfig.params.isVip = data.isVip;
            var fileDiscount = data.fileDiscount;
            if (fileDiscount) {
                fileDiscount = fileDiscount / 100;
            } else {
                fileDiscount = .8;
            }
            window.pageConfig.params.fileDiscount = fileDiscount;
            $("#ip-uid").val(data.userId);
            $("#ip-isVip").val(data.isVip);
            $("#ip-mobile").val(data.mobile);
        }
    };
    uploadObj.init();
});

define("dist/application/suspension", [ "dist/application/method", "dist/application/checkLogin", "dist/application/api", "dist/application/app", "dist/application/element", "dist/application/template", "dist/application/extend", "dist/common/bilog", "base64", "dist/cmd-lib/util", "dist/report/config", "dist/report/init", "dist/report/handler", "dist/report/columns", "dist/application/helper", "//static3.iask.cn/resource/js/plugins/pc.iask.login.min" ], function(require, exports, module) {
    //var $ = require("$");
    var method = require("dist/application/method");
    var login = require("dist/application/checkLogin");
    // 右侧滚动
    var app = require("dist/application/app");
    var api = require("dist/application/api");
    var clickEvent = require("dist/common/bilog").clickEvent;
    scrollMenu();
    function scrollMenu() {
        //右侧悬浮 js
        var $fixBtn = $(".fixed-op").find(".J_menu");
        var $fixFull = $(".fixed-right-full");
        var $anWrap = $fixFull.find(".fixed-detail-wrap");
        function fixAn(start, index, $this) {
            index = index || 0;
            if (start && index === 1) {
                // index === 1 || index === 2
                if (method.getCookie("cuk")) {
                    rightSlideShow(index);
                    $anWrap.animate({
                        right: "61px"
                    }, 500);
                } else {
                    login.notifyLoginInterface(function(data) {
                        refreshDomTree($anWrap, index, data);
                    });
                }
            } else {
                $anWrap.animate({
                    right: "-307px"
                }, 200);
            }
            if (start && index === 0) {
                // $(".mui-user-wrap").css("visibility", "visible");
                // $(".mui-sel-wrap").css("visibility", "hidden");
                // $(".mui-collect-wrap").css("visibility", "hidden");
                if (method.getCookie("cuk")) {
                    window.open("/node/rights/vip.html", "target");
                } else {
                    login.notifyLoginInterface(function(data) {
                        refreshDomTree(null, index, data);
                        window.open("/node/rights/vip.html", "target");
                    });
                }
            } else if (index === 1) {
                $(".mui-user-wrap").css("visibility", "hidden");
                $(".mui-sel-wrap").css("visibility", "visible");
            } else if (index === 2) {
                $(".mui-user-wrap").css("visibility", "hidden");
                $(".mui-sel-wrap").css("visibility", "hidden");
                //  $(".mui-collect-wrap").css("visibility", "visible");
                method.compatibleIESkip("/node/upload.html", true);
            } else if (index === 4 || index === 6) {
                $anWrap.animate({
                    right: "-307px"
                }, 200);
            }
        }
        $(".btn-detail-back").on("click", function() {
            fixAn(false, $(this));
            $fixBtn.removeClass("active");
        });
        $(document).on("click", function() {
            var $this = $(this);
            fixAn(false, $this);
            $fixBtn.removeClass("active");
        });
        // 开通vip
        $fixFull.on("click", ".js-buy-open", function() {
            // window.open('/pay/vip.html');
            method.compatibleIESkip("/pay/vip.html", true);
        });
        $(".op-menu-wrap").click(function(e) {
            e.stopPropagation();
        });
        $fixBtn.on("click", function() {
            var index = $(this).index();
            if ($(this).attr("bilogContent")) {
                // 侧边栏数据上报
                clickEvent($(this));
            }
            if ($(this).hasClass("active")) {
                $(this).removeClass("active");
                fixAn(false, $(this));
            } else {
                $(this).addClass("active").siblings().removeClass("active");
                fixAn(true, index, $(this));
            }
        });
        $(window).bind("resize ready", resizeWindow);
        function resizeWindow(e) {
            var newWindowHeight = $(window).height();
            if (newWindowHeight >= 920) {
                $fixFull.removeClass("fixed-min-height");
            } else {
                $fixFull.addClass("fixed-min-height");
            }
        }
    }
    function refreshDomTree($anWrap, index, data) {
        var $unLogin = $("#unLogin"), $hasLogin = $("#haveLogin"), $top_user_more = $(".top-user-more"), $icon_iShare_text = $(".icon-iShare-text"), $btn_user_more = $(".btn-user-more"), $vip_status = $(".vip-status");
        $icon_iShare_text.html(data.isVip == "1" ? "续费VIP" : "开通VIP");
        $btn_user_more.text(data.isVip == "1" ? "续费" : "开通");
        if (data.isVip == "0") {
            $(".open-vip").show().siblings("a").hide();
        } else {
            $(".xf-open-vip").show().siblings("a").hide();
        }
        var $target = null;
        if (data.isVip == "1") {
            $target = $vip_status.find('p[data-type="2"]');
            $target.find(".expire_time").html(data.expireTime);
            $target.show().siblings().hide();
        } else if (data.isVip == "1" && data.userType == "2") {
            $target = $vip_status.find('p[data-type="3"]');
            $target.show().siblings().hide();
        }
        $unLogin.hide();
        $hasLogin.find(".icon-detail").html(data.nickName);
        $hasLogin.find("img").attr("src", data.weiboImage);
        $top_user_more.find("img").attr("src", data.weiboImage);
        $top_user_more.find("#userName").html(data.nickName);
        $hasLogin.show();
        //右侧导航栏.
        /* ==>头像,昵称 是否会员文案提示.*/
        $(".user-avatar img").attr("src", data.weiboImage);
        $(".name-wrap .name-text").html(data.nickName);
        if (data.isVip == "1") {
            var txt = "您的VIP将于" + data.expireTime + "到期,剩余" + data.privilege + "次下载特权";
            $(".detail-right-normal-wel").html(txt);
            $(".detail-right-vip-wel").html("会员尊享权益");
            $(".btn-mui").hide();
            $("#memProfit").html("VIP权益");
        } else {
            $(".mui-privilege-list li").removeClass("hide");
        }
        rightSlideShow(index);
        // 发现有调用传入$anWrap 为 null ，因此作此判断
        if ($anWrap) {
            $anWrap.animate({
                right: "61px"
            }, 500);
        }
    }
    function rightSlideShow(index) {
        if (index === 1) {
            accessList();
        } else if (index === 2) {
            myCollect();
        }
    }
    /**
     * 我看过的
     */
    function accessList() {
        var accessKey = method.keyMap.ishare_detail_access;
        var list = method.getLocalData(accessKey);
        var $seenRecord = $("#seenRecord"), arr = [];
        if (list && list.length) {
            list = list.slice(0, 20);
            for (var k = 0; k < list.length; k++) {
                var item = list[k];
                var $li = '<li><i class="ico-data ico-' + item.format + '"></i><a target="_blank" href="/f/' + item.fileId + '.html">' + item.title + "</a></li>";
                arr.push($li);
            }
            $seenRecord.html(arr.join(""));
        } else {
            $seenRecord.hide().siblings(".mui-data-null").show();
        }
    }
    /**
     * 我的收藏
     */
    // function myCollect() {
    //     var params = {
    //         pageNum: 1,
    //         pageSize: 20
    //     };
    //     $.ajax(api.user.collect, {
    //         type: "get",
    //         async: false,
    //         data: params,
    //         dataType: "json"
    //     }).done(function (res) {
    //         if (res.code == 0) {
    //             collectRender(res.data)
    //         }
    //     }).fail(function (e) {
    //         console.log("error===" + e);
    //     })
    // }
    //新的我的收藏列表
    function myCollect() {
        var params = {
            pageNumber: 1,
            pageSize: 20,
            sidx: 0,
            order: -1
        };
        $.ajax(api.user.newCollect, {
            type: "get",
            async: false,
            data: params,
            dataType: "json"
        }).done(function(res) {
            if (res.code == 0) {
                collectRender(res.data.rows);
            }
        }).fail(function(e) {
            console.log("error===" + e);
        });
    }
    /**
     * 意见反馈
     * @param list
     */
    $(".op-feedback").on("click", function() {
        var curr = window.location.href;
        // window.open('/feedAndComp/userFeedback?url=' + encodeURIComponent(curr));
        // method.compatibleIESkip('/feedAndComp/userFeedback?url=' + encodeURIComponent(curr),true);
        // window.location.href = '/feedAndComp/userFeedback?url='+encodeURIComponent(curr);
        method.compatibleIESkip("/node/feedback/feedback.html?url=" + encodeURIComponent(curr), true);
    });
    $("#go-back-top").on("click", function() {
        $("body,html").animate({
            scrollTop: 0
        }, 200);
    });
    try {
        //引入美洽客服
        (function(m, ei, q, i, a, j, s) {
            m[i] = m[i] || function() {
                (m[i].a = m[i].a || []).push(arguments);
            };
            j = ei.createElement(q), s = ei.getElementsByTagName(q)[0];
            j.async = true;
            j.charset = "UTF-8";
            j.src = "//static.meiqia.com/dist/meiqia.js?_=t";
            s.parentNode.insertBefore(j, s);
        })(window, document, "script", "_MEIQIA");
        _MEIQIA("entId", "149498");
        // 初始化成功后调用美洽 showPanel
        _MEIQIA("allSet", function() {
            _MEIQIA("showPanel");
        });
        // 在这里开启手动模式（必须紧跟美洽的嵌入代码）
        _MEIQIA("manualInit");
    } catch (e) {}
    // 联系客服
    $(".btn-mui-contact").on("click", function() {
        _MEIQIA("init");
    });
    function collectRender(list) {
        var $myCollect = $("#myCollect"), arr = [];
        if (!list || !list.length) {
            $myCollect.siblings(".mui-data-null").removeClass("hide");
        } else {
            var subList = list.slice(0, 20);
            for (var k = 0; k < subList.length; k++) {
                var item = subList[k];
                var $li = '<li><i class="ico-data ico-' + item.format + '"></i><a target="_blank" href="/f/' + item.fileId + '.html">' + item.title + "</a></li>";
                arr.push($li);
            }
            $myCollect.html(arr.join(""));
            if (list.length > 20) {
                $myCollect.siblings(".btn-mui-fix").removeClass("hide");
            }
        }
    }
    module.exports = {
        usermsg: function(data) {
            //右侧导航栏.
            /* ==>头像,昵称 是否会员文案提示.*/
            $(".user-avatar img").attr("src", data.weiboImage);
            $(".name-wrap .name-text").html(data.nickName);
            if (data.isVip == "1") {
                var txt = "您的VIP将于" + data.expireTime + "到期,剩余" + data.privilege + "次下载特权";
                $(".detail-right-normal-wel").html(txt);
                $(".detail-right-vip-wel").html("会员尊享权益");
                $(".btn-mui").hide();
                $("#memProfit").html("VIP权益");
            } else {
                $(".mui-privilege-list li").removeClass("hide");
            }
        }
    };
});

define("dist/application/method", [], function(require, exports, module) {
    //var $ = require("$");
    return {
        // 常量映射表
        keyMap: {
            // 访问详情页 localStorage
            ishare_detail_access: "ISHARE_DETAIL_ACCESS",
            ishare_office_detail_access: "ISHARE_OFFICE_DETAIL_ACCESS"
        },
        async: function(url, callback, msg, method, data) {
            $.ajax(url, {
                type: method || "post",
                data: data,
                async: false,
                dataType: "json",
                headers: {
                    "cache-control": "no-cache",
                    Pragma: "no-cache"
                }
            }).done(function(data) {
                callback && callback(data);
            }).fail(function(e) {
                console.log("error===" + msg);
            });
        },
        get: function(u, c, m) {
            $.ajaxSetup({
                cache: false
            });
            this.async(u, c, m, "get");
        },
        post: function(u, c, m, g, d) {
            this.async(u, c, m, g, d);
        },
        postd: function(u, c, d) {
            this.async(u, c, false, false, d);
        },
        //随机数
        random: function(min, max) {
            return Math.floor(Math.random() * (max - min)) + min;
        },
        // 写cookie（过期时间）
        setCookieWithExpPath: function(name, value, timeOut, path) {
            var now = new Date();
            now.setTime(now.getTime() + timeOut);
            document.cookie = name + "=" + escape(value) + ";path=" + path + ";expires=" + now.toGMTString();
        },
        //提供360结算方法
        setCookieWithExp: function(name, value, timeOut, path) {
            var exp = new Date();
            exp.setTime(exp.getTime() + timeOut);
            if (path) {
                document.cookie = name + "=" + escape(value) + ";path=" + path + ";expires=" + exp.toGMTString();
            } else {
                document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
            }
        },
        //读 cookie
        getCookie: function(name) {
            var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
            if (arr !== null) {
                return unescape(arr[2]);
            }
            return null;
        },
        //删除cookie
        delCookie: function(name, path, domain) {
            var now = new Date();
            now.setTime(now.getTime() - 1);
            var cval = this.getCookie(name);
            if (cval != null) {
                if (path && domain) {
                    document.cookie = name + "= '' " + ";domain=" + domain + ";expires=" + now.toGMTString() + ";path=" + path;
                } else if (path) {
                    document.cookie = name + "= '' " + ";expires=" + now.toGMTString() + ";path=" + path;
                } else {
                    document.cookie = name + "=" + cval + ";expires=" + now.toGMTString();
                }
            }
        },
        //获取 url 参数值
        getQueryString: function(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) {
                return unescape(r[2]);
            }
            return null;
        },
        url2Obj: function(url) {
            var obj = {};
            var arr1 = url.split("?");
            var arr2 = arr1[1].split("&");
            for (var i = 0; i < arr2.length; i++) {
                var res = arr2[i].split("=");
                obj[res[0]] = res[1];
            }
            return obj;
        },
        //获取url中参数的值
        getParam: function(name) {
            name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
            var regexS = "[\\?&]" + name + "=([^&#]*)";
            var regex = new RegExp(regexS);
            var results = regex.exec(window.location.href);
            if (results == null) {
                return "";
            }
            return decodeURIComponent(results[1].replace(/\+/g, " "));
        },
        // 获取本地 localStorage 数据
        getLocalData: function(key) {
            try {
                if (localStorage && localStorage.getItem) {
                    var val = localStorage.getItem(key);
                    return val === null ? null : JSON.parse(val);
                } else {
                    console.log("浏览器不支持html localStorage getItem");
                    return null;
                }
            } catch (e) {
                return null;
            }
        },
        // 获取本地 localStorage 数据
        setLocalData: function(key, val) {
            if (localStorage && localStorage.setItem) {
                localStorage.removeItem(key);
                localStorage.setItem(key, JSON.stringify(val));
            } else {
                console.log("浏览器不支持html localStorage setItem");
            }
        },
        // 浏览器环境判断
        browserType: function() {
            var userAgent = navigator.userAgent;
            //取得浏览器的userAgent字符串
            var isOpera = userAgent.indexOf("Opera") > -1;
            if (isOpera) {
                //判断是否Opera浏览器
                return "Opera";
            }
            if (userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera) {
                //判断是否IE浏览器
                return "IE";
            }
            if (userAgent.indexOf("Edge") > -1) {
                //判断是否IE的Edge浏览器
                return "Edge";
            }
            if (userAgent.indexOf("Firefox") > -1) {
                //判断是否Firefox浏览器
                return "Firefox";
            }
            if (userAgent.indexOf("Safari") > -1 && userAgent.indexOf("Chrome") === -1) {
                //判断是否Safari浏览器
                return "Safari";
            }
            if (userAgent.indexOf("Chrome") > -1 && userAgent.indexOf("Safari") > -1) {
                //判断Chrome浏览器
                return "Chrome";
            }
        },
        //判断IE9以下浏览器
        validateIE9: function() {
            return !!($.browser.msie && ($.browser.version === "9.0" || $.browser.version === "8.0" || $.browser.version === "7.0" || $.browser.version === "6.0"));
        },
        // 计算两个2个时间相差的天数
        compareTime: function(startTime, endTime) {
            if (!startTime || !endTime) return "";
            return Math.abs((endTime - startTime) / 1e3 / 60 / 60 / 24);
        },
        // 修改参数 有参数则修改 无则加
        changeURLPar: function(url, arg, arg_val) {
            var pattern = arg + "=([^&]*)";
            var replaceText = arg + "=" + arg_val;
            if (url.match(pattern)) {
                var tmp = "/(" + arg + "=)([^&]*)/gi";
                tmp = url.replace(eval(tmp), replaceText);
                return tmp;
            } else {
                if (url.match("[?]")) {
                    return url + "&" + replaceText;
                } else {
                    return url + "?" + replaceText;
                }
            }
        },
        //获取url全部参数
        getUrlAllParams: function(urlStr) {
            if (typeof urlStr == "undefined") {
                var url = decodeURI(location.search);
            } else {
                var url = "?" + urlStr.split("?")[1];
            }
            var theRequest = new Object();
            if (url.indexOf("?") != -1) {
                var str = url.substr(1);
                var strs = str.split("&");
                for (var i = 0; i < strs.length; i++) {
                    theRequest[strs[i].split("=")[0]] = decodeURI(strs[i].split("=")[1]);
                }
            }
            return theRequest;
        },
        //获取 url 参数值
        getQueryString: function(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) {
                return unescape(r[2]);
            }
            return null;
        },
        /**
         * 兼容ie document.referrer的页面跳转 替代 window.location.href   window.open
         * @param url
         * @param flag 是否新窗口打开
         */
        compatibleIESkip: function(url, flag) {
            var referLink = document.createElement("a");
            referLink.href = url;
            referLink.style.display = "none";
            if (flag) {
                referLink.target = "_blank";
            }
            document.body.appendChild(referLink);
            referLink.click();
        },
        testEmail: function(val) {
            var reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
            if (reg.test(val)) {
                return true;
            } else {
                return false;
            }
        },
        testPhone: function(val) {
            if (/^1(3|4|5|7|8)\d{9}$/.test(val)) {
                return true;
            } else {
                return false;
            }
        },
        handleRecommendData: function(list) {
            var arr = [];
            list.forEach(function(item) {
                var temp = {};
                if (item.type == 1) {
                    // 资料 
                    // temp = Object.assign({},item,{linkUrl:`/f/${item.tprId}.html`})
                    item.linkUrl = "/f/" + item.tprId + ".html";
                    temp = item;
                }
                if (item.type == 2) {
                    // 链接
                    temp = item;
                }
                if (item.type == 3) {
                    // 专题页
                    // temp = Object.assign({},item,{linkUrl:`/node/s/${item.tprId}.html`})
                    item.linkUrl = "/node/s/" + item.tprId + ".html";
                    temp = item;
                }
                arr.push(temp);
            });
            console.log(arr);
            return arr;
        },
        formatDate: function(fmt) {
            var o = {
                "M+": this.getMonth() + 1,
                //月份
                "d+": this.getDate(),
                //日
                "h+": this.getHours(),
                //小时
                "m+": this.getMinutes(),
                //分
                "s+": this.getSeconds(),
                //秒
                "q+": Math.floor((this.getMonth() + 3) / 3),
                //季度
                S: this.getMilliseconds()
            };
            if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
            for (var k in o) if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
            return fmt;
        }
    };
});

/**
 * 登录相关
 */
define("dist/application/checkLogin", [ "dist/application/api", "dist/application/method" ], function(require, exports, module) {
    //var $ = require("$");
    var api = require("dist/application/api");
    var method = require("dist/application/method");
    var api = require("dist/application/api");
    module.exports = {
        getIds: function() {
            // 详情页
            var params = window.pageConfig && window.pageConfig.params ? window.pageConfig.params : null;
            var access = window.pageConfig && window.pageConfig.access ? window.pageConfig.access : null;
            var classArr = [];
            if (params) {
                params.classid1 && classArr.push(params.classid1);
                params.classid2 && classArr.push(params.classid2);
                params.classid3 && classArr.push(params.classid3);
            }
            var clsId = params ? classArr.length > 0 ? classArr.join("-") : "" : "";
            var fid = access ? access.fileId || params.g_fileId || "" : "";
            // 类目页
            var classIds = window.pageConfig && window.pageConfig.classIds ? window.pageConfig.classIds : "";
            !clsId && (clsId = classIds);
            return {
                clsId: clsId,
                fid: fid
            };
        },
        /**
         * description  唤醒登录界面
         * @param callback 回调函数
         */
        notifyLoginInterface: function(callback) {
            var _self = this;
            if (!method.getCookie("cuk")) {
                __pc__.push([ "pcTrackContent", "loginDialogLoad" ]);
                var ptype = window.pageConfig && window.pageConfig.page ? window.pageConfig.page.ptype || "index" : "index";
                $.loginPop("login", {
                    terminal: "PC",
                    businessSys: "ishare",
                    domain: document.domain,
                    ptype: ptype,
                    clsId: this.getIds().clsId,
                    fid: this.getIds().fid
                }, function(data) {
                    // 透传
                    // method.get(api.user.getJessionId, function (res) {
                    _self.getLoginData(callback);
                });
            }
        },
        listenLoginStatus: function(callback) {
            var _self = this;
            $.loginPop("login_wx_code", {
                terminal: "PC",
                businessSys: "ishare",
                domain: document.domain,
                ptype: "ishare",
                popup: "hidden",
                clsId: this.getIds().clsId,
                fid: this.getIds().fid
            }, function() {
                // method.get(api.user.getJessionId, function (res) {
                // if (res.code == 0) {
                _self.getLoginData(callback);
            });
        },
        /**
         * description  唤醒校验界面
         */
        notifyCheckInterface: function() {
            if (method.getCookie("cuk")) {
                $.loginPop("checkCode", {
                    terminal: "PC",
                    businessSys: "ishare",
                    domain: document.domain,
                    clsId: this.getIds().clsId,
                    fid: this.getIds().fid
                }, function(data) {
                    if (data.code == "0") {
                        method.get(api.user.getJessionId, function(res) {}, "");
                    }
                });
            }
        },
        /**
         * description  免登录透传用户信息
         * @param callback 回调函数
         */
        syncUserInfoInterface: function(callback) {
            var _self = this;
            if (method.getCookie("cuk")) {
                method.get(api.user.getJessionId, function(res) {
                    if (res.code == 0) {
                        _self.getLoginData(callback);
                    }
                }, "");
            }
        },
        /**
        * description  优惠券提醒 查询用户发券资格-pc
        * @param callback 回调函数
        */
        getUserData: function(callback) {
            if (method.getCookie("cuk")) {
                method.get(api.coupon.querySeniority, function(res) {
                    if (res && res.code == 0) {
                        callback(res.data);
                    }
                }, "");
            }
        },
        /**
         * 获取用户信息
         * @param callback 回调函数
         */
        getLoginData: function(callback) {
            var _self = this;
            try {
                method.get(api.user.login, function(res) {
                    if (res.code == 0 && res.data) {
                        if (callback && typeof callback == "function") {
                            callback(res.data);
                            try {
                                window.pageConfig.params.isVip = res.data.isVip;
                                window.pageConfig.page.uid = res.data.userId;
                            } catch (err) {}
                        }
                        try {
                            var userInfo = {
                                uid: res.data.userId,
                                isVip: res.data.isVip,
                                tel: res.data.mobile
                            };
                            method.setCookieWithExpPath("ui", JSON.stringify(userInfo), 30 * 60 * 1e3, "/");
                        } catch (e) {}
                    } else if (res.code == 40001) {
                        _self.ishareLogout();
                    }
                });
            } catch (e) {}
        },
        /**
         * 退出
         */
        ishareLogout: function() {
            //删域名cookie
            method.delCookie("cuk", "/", ".sina.com.cn");
            method.delCookie("cuk", "/", ".iask.com.cn");
            method.delCookie("cuk", "/", ".iask.com");
            //微信扫码登录sceneId
            method.delCookie("sid", "/", ".iask.sina.com.cn");
            method.delCookie("sid", "/", ".iask.com.cn");
            method.delCookie("sid", "/", ".sina.com.cn");
            method.delCookie("sid", "/", ".ishare.iask.com.cn");
            method.delCookie("sid", "/", ".office.iask.com");
            method.delCookie("sid_ishare", "/", ".iask.sina.com.cn");
            method.delCookie("sid_ishare", "/", ".iask.com.cn");
            method.delCookie("sid_ishare", "/", ".sina.com.cn");
            method.delCookie("sid_ishare", "/", ".ishare.iask.com.cn");
            //删除第一次登录标识
            method.delCookie("_1st_l", "/");
            method.delCookie("ui", "/");
            // $.post("/logout", function () {
            //     window.location.href = window.location.href;
            // });
            $.post(api.user.loginOut, function() {
                window.location.href = window.location.href;
            });
        }
    };
});

/**
 * 前端交互性API
 **/
define("dist/application/api", [], function(require, exports, module) {
    var router = "/gateway/pc";
    var gateway = "/gateway";
    module.exports = {
        // 用户相关
        user: {
            // 登录
            login: router + "/usermanage/checkLogin",
            // 登出
            loginOut: gateway + "/pc/usermanage/logout",
            // 我的收藏
            collect: router + "/usermanage/collect",
            newCollect: gateway + "/content/collect/getUserFileList",
            // 透传老系统web登录信息接口
            getJessionId: router + "/usermanage/getJessionId",
            //优惠券提醒
            getSessionInfo: router + "/usermanage/getSessionInfo",
            addFeedback: gateway + "/feedback/addFeedback",
            //新增反馈
            getFeedbackType: gateway + "/feedback/getFeedbackType",
            //获取反馈问题类型
            sendSms: gateway + "/cas/sms/sendSms",
            // 发送短信验证码
            queryBindInfo: gateway + "/cas/user/queryBindInfo",
            // 查询用户绑定信息
            thirdCodelogin: gateway + "/cas/login/thirdCode",
            // /cas/login/thirdCode
            userBindMobile: gateway + "/cas/user/bindMobile",
            // 绑定手机号接口
            checkIdentity: gateway + "/cas/sms/checkIdentity",
            // 身份验证账号
            userBindThird: gateway + "/cas/user/bindThird",
            // 绑定第三方账号接口
            untyingThird: gateway + "/cas/user/untyingThird",
            // 解绑第三方
            setUpPassword: gateway + "/cas/user/setUpPassword",
            // 设置密码
            getUserCentreInfo: gateway + "/user/getUserCentreInfo",
            editUser: gateway + "/user/editUser",
            // 编辑用户信息
            getFileBrowsePage: gateway + "/content/fileBrowse/getFileBrowsePage",
            //分页获取用户的历史浏览记录
            getDownloadRecordList: gateway + "/content/getDownloadRecordList",
            //用户下载记录接口
            getUserFileList: gateway + "/content/collect/getUserFileList",
            // 查询个人收藏列表
            getMyUploadPage: gateway + "/content/getMyUploadPage",
            // 分页查询我的上传(公开资料，付费资料，私有资料，审核中，未通过)
            getOtherUser: gateway + "/user/getOthersCentreInfo",
            //他人信息主页 
            getSearchList: gateway + "/search/content/byCondition"
        },
        // 查询用户发券资格接口
        // sale: {
        //     querySeniority: router + '/sale/querySeniority',
        // },
        normalFileDetail: {
            // 添加评论
            addComment: router + "/fileSync/addComment",
            // 举报
            reportContent: router + "/fileSync/addFeedback",
            // 是否已收藏
            isStore: router + "/fileSync/getFileCollect",
            // 取消或者关注
            collect: router + "/fileSync/collect",
            // 文件预下载
            filePreDownLoad: gateway + "/content/getPreFileDownUrl",
            // 文件下载
            fileDownLoad: router + "/action/downloadUrl",
            // 下载获取地址接口
            getFileDownLoadUrl: gateway + "/content/getFileDownUrl",
            // 文件打分
            appraise: router + "/fileSync/appraise",
            // 文件预览判断接口
            getPrePageInfo: router + "/fileSync/prePageInfo",
            // 文件是否已下载
            hasDownLoad: router + "/fileSync/isDownload"
        },
        officeFileDetail: {},
        search: {
            //搜索服务--API接口--运营位数据--异步
            byPosition: router + "/operating/byPosition",
            specialTopic: gateway + "/search/specialTopic/lisPage"
        },
        sms: {
            // 获取短信验证码
            getCaptcha: router + "/usermanage/getSmsYzCode",
            sendCorpusDownloadMail: gateway + "/content/fileSendEmail/sendCorpusDownloadMail"
        },
        pay: {
            // 购买成功后,在页面自动下载文档
            successBuyDownLoad: router + "/action/downloadNow",
            // 绑定订单
            bindUser: router + "/order/bindUser",
            scanOrderInfo: gateway + "/order/scan/orderInfo"
        },
        coupon: {
            rightsSaleVouchers: gateway + "/rights/sale/vouchers",
            rightsSaleQueryPersonal: gateway + "/rights/sale/queryPersonal",
            querySeniority: gateway + "/rights/sale/querySeniority",
            queryUsing: gateway + "/rights/sale/queryUsing",
            getMemberPointRecord: gateway + "/rights/vip/getMemberPointRecord",
            getBuyRecord: gateway + "/rights/vip/getBuyRecord"
        },
        vouchers: router + "/sale/vouchers",
        order: {
            bindOrderByOrderNo: router + "/order/bindOrderByOrderNo",
            unloginOrderDown: router + "/order/unloginOrderDown",
            createOrderInfo: gateway + "/order/create/orderInfo",
            rightsVipGetUserMember: gateway + "/rights/vip/getUserMember",
            getOrderStatus: gateway + "/order/get/orderStatus",
            queryOrderlistByCondition: gateway + "/order/query/listByCondition",
            getOrderInfo: gateway + "/order/get/orderInfo"
        },
        getHotSearch: router + "/search/getHotSearch",
        special: {
            fileSaveOrupdate: gateway + "/comment/collect/fileSaveOrupdate",
            // 收藏与取消收藏
            getCollectState: gateway + "/comment/zc/getUserFileZcState",
            //获取收藏状态
            setCollect: gateway + "/content/collect/file"
        },
        upload: {
            getCategory: gateway + "/content/category/getSimplenessInfo",
            // 获取所有分类
            createFolder: gateway + "/content/saveUserFolder",
            // 获取所有分类
            getFolder: gateway + "/content/getUserFolders",
            // 获取所有分类
            saveUploadFile: gateway + "/content/webUploadFile",
            batchDeleteUserFile: gateway + "/content/batchDeleteUserFile"
        },
        recommend: {
            recommendConfigInfo: gateway + "/recommend/config/info",
            recommendConfigRuleInfo: gateway + "/recommend/config/ruleInfo"
        },
        reportBrowse: {
            fileBrowseReportBrowse: gateway + "/content/fileBrowse/reportBrowse"
        }
    };
});

define("dist/application/app", [ "dist/application/method", "dist/application/element", "dist/application/template", "dist/application/extend", "dist/common/bilog", "base64", "dist/cmd-lib/util", "dist/report/config", "dist/report/init", "dist/report/handler", "dist/report/columns", "dist/application/helper", "//static3.iask.cn/resource/js/plugins/pc.iask.login.min" ], function(require, exports, module) {
    var method = require("dist/application/method");
    require("dist/application/element");
    require("dist/application/extend");
    var bilog = require("dist/common/bilog");
    require("dist/report/init");
    window.template = require("dist/application/template");
    require("dist/application/helper");
    require("//static3.iask.cn/resource/js/plugins/pc.iask.login.min.js");
    //此方法是为了解决外部登录找不到此方法
    window.getCookie = method.getCookie;
    return {
        method: method,
        v: "1.0.1",
        bilog: bilog
    };
});

define("dist/application/element", [ "dist/application/method", "dist/application/template" ], function(require, exports, module) {
    //var $ = require("$");
    var method = require("dist/application/method");
    var template = require("dist/application/template");
    //获取热点搜索全部数据
    if (window.pageConfig && window.pageConfig.hotData) {
        var hot_data = JSON.parse(window.pageConfig.hotData);
        var arr = [];
        var darwData = [];
        function unique(min, max) {
            var index = method.random(min, max);
            if ($.inArray(index, arr) === -1) {
                arr.push(index);
                darwData.push(hot_data[index]);
                if (arr.length < 10) {
                    unique(0, hot_data.length);
                }
            } else {
                unique(0, hot_data.length);
            }
            return darwData;
        }
    }
    //返回顶部
    var fn_goTop = function($id) {
        var Obj = {
            ele: $id,
            init: function() {
                this.ele[0].addEventListener("click", function() {
                    $("html, body").animate({
                        scrollTop: 0
                    }, 120);
                }, false);
                window.addEventListener("scroll", this, false);
                return this;
            },
            handleEvent: function(evt) {
                var top = $(document).scrollTop(), height = $(window).height();
                top > 100 ? this.ele.show() : this.ele.hide();
                if (top > 10) {
                    $(".m-header").addClass("header-fix");
                } else {
                    $(".m-header").removeClass("header-fix");
                }
                return this;
            }
        };
        Obj.init().handleEvent();
    };
    $("#backToTop").length && fn_goTop && fn_goTop($("#backToTop"));
});

/*!art-template - Template Engine | http://aui.github.com/artTemplate/*/
!function() {
    function a(a) {
        return a.replace(t, "").replace(u, ",").replace(v, "").replace(w, "").replace(x, "").split(/^$|,+/);
    }
    function b(a) {
        return "'" + a.replace(/('|\\)/g, "\\$1").replace(/\r/g, "\\r").replace(/\n/g, "\\n") + "'";
    }
    function c(c, d) {
        function e(a) {
            return m += a.split(/\n/).length - 1, k && (a = a.replace(/[\n\r\t\s]+/g, " ").replace(/<!--.*?-->/g, "")), 
            a && (a = s[1] + b(a) + s[2] + "\n"), a;
        }
        function f(b) {
            var c = m;
            if (j ? b = j(b, d) : g && (b = b.replace(/\n/g, function() {
                return m++, "$line=" + m + ";";
            })), 0 === b.indexOf("=")) {
                var e = l && !/^=[=#]/.test(b);
                if (b = b.replace(/^=[=#]?|[\s;]*$/g, ""), e) {
                    var f = b.replace(/\s*\([^\)]+\)/, "");
                    n[f] || /^(include|print)$/.test(f) || (b = "$escape(" + b + ")");
                } else b = "$string(" + b + ")";
                b = s[1] + b + s[2];
            }
            return g && (b = "$line=" + c + ";" + b), r(a(b), function(a) {
                if (a && !p[a]) {
                    var b;
                    b = "print" === a ? u : "include" === a ? v : n[a] ? "$utils." + a : o[a] ? "$helpers." + a : "$data." + a, 
                    w += a + "=" + b + ",", p[a] = !0;
                }
            }), b + "\n";
        }
        var g = d.debug, h = d.openTag, i = d.closeTag, j = d.parser, k = d.compress, l = d.escape, m = 1, p = {
            $data: 1,
            $filename: 1,
            $utils: 1,
            $helpers: 1,
            $out: 1,
            $line: 1
        }, q = "".trim, s = q ? [ "$out='';", "$out+=", ";", "$out" ] : [ "$out=[];", "$out.push(", ");", "$out.join('')" ], t = q ? "$out+=text;return $out;" : "$out.push(text);", u = "function(){var text=''.concat.apply('',arguments);" + t + "}", v = "function(filename,data){data=data||$data;var text=$utils.$include(filename,data,$filename);" + t + "}", w = "'console.log(3316)';var $utils=this,$helpers=$utils.$helpers," + (g ? "$line=0," : ""), x = s[0], y = "return new String(" + s[3] + ");";
        r(c.split(h), function(a) {
            a = a.split(i);
            var b = a[0], c = a[1];
            1 === a.length ? x += e(b) : (x += f(b), c && (x += e(c)));
        });
        var z = w + x + y;
        g && (z = "try{" + z + "}catch(e){throw {filename:$filename,name:'Render Error',message:e.message,line:$line,source:" + b(c) + ".split(/\\n/)[$line-1].replace(/^[\\s\\t]+/,'')};}");
        try {
            var A = new Function("$data", "$filename", z);
            return A.prototype = n, A;
        } catch (B) {
            throw B.temp = "function anonymous($data,$filename) {" + z + "}", B;
        }
    }
    var d = function(a, b) {
        return "string" == typeof b ? q(b, {
            filename: a
        }) : g(a, b);
    };
    d.version = "3.0.0", d.config = function(a, b) {
        e[a] = b;
    };
    var e = d.defaults = {
        openTag: "<%",
        closeTag: "%>",
        escape: !0,
        cache: !0,
        compress: !1,
        parser: null
    }, f = d.cache = {};
    d.render = function(a, b) {
        return q(a, b);
    };
    var g = d.renderFile = function(a, b) {
        var c = d.get(a) || p({
            filename: a,
            name: "Render Error",
            message: "Template not found"
        });
        return b ? c(b) : c;
    };
    d.get = function(a) {
        var b;
        if (f[a]) b = f[a]; else if ("object" == typeof document) {
            var c = document.getElementById(a);
            if (c) {
                var d = (c.value || c.innerHTML).replace(/^\s*|\s*$/g, "");
                b = q(d, {
                    filename: a
                });
            }
        }
        return b;
    };
    var h = function(a, b) {
        return "string" != typeof a && (b = typeof a, "number" === b ? a += "" : a = "function" === b ? h(a.call(a)) : ""), 
        a;
    }, i = {
        "<": "&#60;",
        ">": "&#62;",
        '"': "&#34;",
        "'": "&#39;",
        "&": "&#38;"
    }, j = function(a) {
        return i[a];
    }, k = function(a) {
        return h(a).replace(/&(?![\w#]+;)|[<>"']/g, j);
    }, l = Array.isArray || function(a) {
        return "[object Array]" === {}.toString.call(a);
    }, m = function(a, b) {
        var c, d;
        if (l(a)) for (c = 0, d = a.length; d > c; c++) b.call(a, a[c], c, a); else for (c in a) b.call(a, a[c], c);
    }, n = d.utils = {
        $helpers: {},
        $include: g,
        $string: h,
        $escape: k,
        $each: m
    };
    d.helper = function(a, b) {
        o[a] = b;
    };
    var o = d.helpers = n.$helpers;
    d.onerror = function(a) {
        var b = "Template Error\n\n";
        for (var c in a) b += "<" + c + ">\n" + a[c] + "\n\n";
        "object" == typeof console && console.error(b);
    };
    var p = function(a) {
        return d.onerror(a), function() {
            return "{Template Error}";
        };
    }, q = d.compile = function(a, b) {
        function d(c) {
            try {
                return new i(c, h) + "";
            } catch (d) {
                return b.debug ? p(d)() : (b.debug = !0, q(a, b)(c));
            }
        }
        b = b || {};
        for (var g in e) void 0 === b[g] && (b[g] = e[g]);
        var h = b.filename;
        try {
            var i = c(a, b);
        } catch (j) {
            return j.filename = h || "anonymous", j.name = "Syntax Error", p(j);
        }
        return d.prototype = i.prototype, d.toString = function() {
            return i.toString();
        }, h && b.cache && (f[h] = d), d;
    }, r = n.$each, s = "break,case,catch,continue,debugger,default,delete,do,else,false,finally,for,function,if,in,instanceof,new,null,return,switch,this,throw,true,try,typeof,var,void,while,with,abstract,boolean,byte,char,class,const,double,enum,export,extends,final,float,goto,implements,import,int,interface,long,native,package,private,protected,public,short,static,super,synchronized,throws,transient,volatile,arguments,let,yield,undefined", t = /\/\*[\w\W]*?\*\/|\/\/[^\n]*\n|\/\/[^\n]*$|"(?:[^"\\]|\\[\w\W])*"|'(?:[^'\\]|\\[\w\W])*'|[\s\t\n]*\.[\s\t\n]*[$\w\.]+/g, u = /[^\w$]+/g, v = new RegExp([ "\\b" + s.replace(/,/g, "\\b|\\b") + "\\b" ].join("|"), "g"), w = /^\d[^,]*|,\d[^,]*/g, x = /^,+|,+$/g;
    e.openTag = "{{", e.closeTag = "}}";
    var y = function(a, b) {
        var c = b.split(":"), d = c.shift(), e = c.join(":") || "";
        return e && (e = ", " + e), "$helpers." + d + "(" + a + e + ")";
    };
    e.parser = function(a, b) {
        a = a.replace(/^\s/, "");
        var c = a.split(" "), e = c.shift(), f = c.join(" ");
        switch (e) {
          case "if":
            a = "if(" + f + "){";
            break;

          case "else":
            c = "if" === c.shift() ? " if(" + c.join(" ") + ")" : "", a = "}else" + c + "{";
            break;

          case "/if":
            a = "}";
            break;

          case "each":
            var g = c[0] || "$data", h = c[1] || "as", i = c[2] || "$value", j = c[3] || "$index", k = i + "," + j;
            "as" !== h && (g = "[]"), a = "$each(" + g + ",function(" + k + "){";
            break;

          case "/each":
            a = "});";
            break;

          case "echo":
            a = "print(" + f + ");";
            break;

          case "print":
          case "include":
            a = e + "(" + c.join(",") + ");";
            break;

          default:
            if (-1 !== f.indexOf("|")) {
                var l = b.escape;
                0 === a.indexOf("#") && (a = a.substr(1), l = !1);
                for (var m = 0, n = a.split("|"), o = n.length, p = l ? "$escape" : "$string", q = p + "(" + n[m++] + ")"; o > m; m++) q = y(q, n[m]);
                a = "=#" + q;
            } else a = d.helpers[e] ? "=#" + e + "(" + c.join(",") + ");" : "=" + a;
        }
        return a;
    }, "function" == typeof define ? define("dist/application/template", [], function() {
        return d;
    }) : "undefined" != typeof exports ? module.exports = d : this.template = d;
}();

define("dist/application/extend", [], function(require, exports, module) {
    if (!String.prototype.format) {
        String.prototype.format = function() {
            var args = arguments;
            return this.replace(/{(\d+)}/g, function(match, number) {
                return typeof args[number] != "undefined" ? args[number] : match;
            });
        };
    }
    if (!String.prototype.trim) {
        String.prototype.trim = function() {
            return this.replace(/^\s*/, "").replace(/\s*$/, "");
        };
    }
    if (!String.prototype.stripTags) {
        //移除html
        String.prototype.stripTags = function() {
            return this.replace(/<\/?[^>]+>/gi, "");
        };
    }
});

define("dist/common/bilog", [ "base64", "dist/cmd-lib/util", "dist/application/method", "dist/report/config" ], function(require, exports, module) {
    //var $ = require("$");
    var base64 = require("base64").Base64;
    var util = require("dist/cmd-lib/util");
    var method = require("dist/application/method");
    var config = require("dist/report/config");
    //参数配置
    // var payTypeMapping = ['', '免费', '下载券', '现金', '仅供在线阅读', 'VIP免费', 'VIP特权'];
    // var payTypeMapping = ['', 'free', 'down', 'cost', 'online', 'vipFree', 'vipOnly'];
    var payTypeMapping = [ "", "free", "", "online", "vipOnly", "cost" ];
    //productType=1：免费文档，3 在线文档 4 vip特权文档 5 付费文档 6 私有文档
    // var fsourceEnum = {
    //     user: '用户上传', editor: '编辑上传', history: '历史资料1', history2: '历史资料2',
    //     other_collection_site: '外包采集站点', ishare_collection_site: '自行采集站点',
    //     other_collection_keyword: '外包采集关键字', ishare_collection_keyword: '自行采集关键字',
    //     baiduwenku_collection_site: '百度文库采集源', ishare_collection_microdisk: '自行采集微盘',
    // };
    var ip = method.getCookie("ip") || getIpAddress();
    var cid = method.getCookie("cid");
    if (!cid) {
        cid = new Date().getTime() + "" + Math.random();
        method.setCookieWithExp("cid", cid, 30 * 24 * 60 * 60 * 1e3, "/");
    }
    var time = new Date().getTime() + "" + Math.random();
    var min30 = 1e3 * 60 * 30;
    var sessionID = sessionStorage.getItem("sessionID") || "";
    function setSessionID() {
        sessionStorage.setItem("sessionID", time);
    }
    if (!sessionID) {
        setSessionID();
    }
    if (time - sessionID > min30) {
        setSessionID();
    }
    var initData = {
        eventType: "",
        //事件类型
        eventID: "",
        //事件编号
        eventName: "",
        //事件英文名字
        eventTime: String(new Date().getTime()),
        //事件触发时间戳（毫秒）
        reportTime: String(new Date().getTime()),
        //上报时间戳（毫秒）
        sdkVersion: "V1.0.3",
        //sdk版本
        terminalType: "0",
        //软件终端类型  0-PC，1-M，2-快应用，3-安卓APP，4-IOS APP，5-微信小程序，6-今日头条小程序，7-百度小程序
        loginStatus: method.getCookie("cuk") ? 1 : 0,
        //登录状态 0 未登录 1 登录
        visitID: method.getCookie("gr_user_id") || "",
        //访客id
        userID: "",
        //用户ID
        sessionID: sessionStorage.getItem("sessionID") || cid || "",
        //会话ID
        productName: "ishare",
        //产品名称
        productCode: "0",
        //产品代码
        productVer: "V4.5.0",
        //产品版本
        pageID: "",
        //当前页面编号
        pageName: "",
        //当前页面的名称
        pageURL: "",
        //当前页面URL
        ip: ip || "",
        //IP地址
        resolution: document.documentElement.clientWidth + "*" + document.documentElement.clientHeight,
        //设备屏幕分辨率
        browserVer: util.getBrowserInfo(navigator.userAgent),
        //浏览器类型
        osType: getDeviceOs(),
        //操作系统类型
        //非必填
        moduleID: "",
        moduleName: "",
        appChannel: "",
        //应用下载渠道 仅针对APP移动端
        prePageID: "",
        //上一个页面编号
        prePageName: "",
        //上一个页面的名称
        prePageURL: document.referrer,
        //上一个页面URL
        domID: "",
        //当前触发DOM的编号 仅针对click
        domName: "",
        //当前触发DOM的名称 仅针对click
        domURL: "",
        //当前触发DOM的URL 仅针对click
        location: "",
        //位置（经纬度）仅针对移动端
        deviceID: "",
        //设备号 仅针对移动端
        deviceBrand: "",
        //移动设备品牌（厂商） 仅针对移动端
        deviceModel: "",
        //移动设备机型型号 仅针对移动端
        deviceLanguage: navigator.language,
        //设备语言
        mac: "",
        //MAC地址
        osVer: "",
        //操作系统版本 仅针对移动端
        networkType: "",
        //联网方式 仅针对移动端
        networkProvider: "",
        //网络运营商代码 仅针对移动端，非WIFI下传
        "var": {}
    };
    var userInfo = method.getCookie("ui");
    if (userInfo) {
        userInfo = JSON.parse(userInfo);
        initData.userID = userInfo.uid || "";
    }
    setPreInfo(document.referrer, initData);
    function setPreInfo(referrer, initData) {
        if (new RegExp("/f/").test(referrer) && !new RegExp("referrer=").test(referrer) && !new RegExp("/f/down").test(referrer)) {
            var statuCode = $(".ip-page-statusCode");
            if (statuCode == "404") {
                initData.prePageID = "PC-M-FDL";
                initData.prePageName = "资料被删除";
            } else if (statuCode == "302") {
                initData.prePageID = "PC-M-FSM";
                initData.prePageName = "资料私有";
            } else {
                initData.prePageID = "PC-M-FD";
                initData.prePageName = "资料详情页";
            }
        } else if (new RegExp("/pay/payConfirm.html").test(referrer)) {
            initData.prePageID = "PC-M-PAY-F-L";
            initData.prePageName = "支付页-付费资料-列表页";
        } else if (new RegExp("/pay/payQr.html\\?type=2").test(referrer)) {
            initData.prePageID = "PC-M-PAY-F-QR";
            initData.prePageName = "支付页-付费资料-支付页";
        } else if (new RegExp("/pay/vip.html").test(referrer)) {
            initData.prePageID = "PC-M-PAY-VIP-L";
            initData.prePageName = "支付页-VIP-套餐列表页";
        } else if (new RegExp("/pay/payQr.html\\?type=0").test(referrer)) {
            initData.prePageID = "PC-M-PAY-VIP-QR";
            initData.prePageName = "支付页-VIP-支付页";
        } else if (new RegExp("/pay/privilege.html").test(referrer)) {
            initData.prePageID = "PC-M-PAY-PRI-L";
            initData.prePageName = "支付页-下载特权-套餐列表页";
        } else if (new RegExp("/pay/payQr.html\\?type=1").test(referrer)) {
            initData.prePageID = "PC-M-PAY-PRI-QR";
            initData.prePageName = "支付页-下载特权-支付页";
        } else if (new RegExp("/pay/success").test(referrer)) {
            initData.prePageID = "PC-M-PAY-SUC";
            initData.prePageName = "支付成功页";
        } else if (new RegExp("/pay/fail").test(referrer)) {
            initData.prePageID = "PC-M-PAY-FAIL";
            initData.prePageName = "支付失败页";
        } else if (new RegExp("/node/f/downsucc.html").test(referrer)) {
            if (/unloginFlag=1/.test(referrer)) {
                initData.prePageID = "PC-M-FDPAY-SUC";
                initData.prePageName = "免登购买成功页";
            } else {
                initData.prePageID = "PC-M-DOWN-SUC";
                initData.prePageName = "下载成功页";
            }
        } else if (new RegExp("/node/f/downfail.html").test(referrer)) {
            initData.prePageID = "PC-M-DOWN-FAIL";
            initData.prePageName = "下载失败页";
        } else if (new RegExp("/search/home.html").test(referrer)) {
            initData.prePageID = "PC-M-SR";
            initData.prePageName = "搜索关键词";
        } else if (new RegExp("/node/404.html").test(referrer)) {
            initData.prePageID = "PC-M-404";
            initData.prePageName = "404错误页";
        } else if (new RegExp("/node/503.html").test(referrer)) {
            initData.prePageID = "PC-M-500";
            initData.prePageName = "500错误页";
        } else if (new RegExp("/node/personalCenter/home.html").test(referrer)) {
            initData.prePageID = "PC-M-USER";
            initData.prePageName = "个人中心-首页";
        } else if (new RegExp("/node/personalCenter/myuploads.html").test(referrer)) {
            initData.prePageID = "PC-M-USER-MU";
            initData.prePageName = "个人中心-我的上传页";
        } else if (new RegExp("/node/personalCenter/mycollection.html").test(referrer)) {
            initData.prePageID = "PC-M-USER-CL";
            initData.prePageName = "个人中心-我的收藏页";
        } else if (new RegExp("/node/personalCenter/mydownloads.html").test(referrer)) {
            initData.prePageID = "PC-M-USER-MD";
            initData.prePageName = "个人中心-我的下载页";
        } else if (new RegExp("/node/personalCenter/vip.html").test(referrer)) {
            initData.prePageID = "PC-M-USER-VIP";
            initData.prePageName = "个人中心-我的VIP";
        } else if (new RegExp("/node/personalCenter/mycoupon.html").test(referrer)) {
            initData.prePageID = "PC-M-USER-MS";
            initData.prePageName = "个人中心-我的优惠券页";
        } else if (new RegExp("/node/personalCenter/accountsecurity.html").test(referrer)) {
            initData.prePageID = "PC-M-USER-ATM";
            initData.prePageName = "个人中心-账号与安全页";
        } else if (new RegExp("/node/personalCenter/personalinformation.html").test(referrer)) {
            initData.prePageID = "PC-M-USER-ATF";
            initData.prePageName = "个人中心-个人信息页";
        } else if (new RegExp("/node/personalCenter/myorder.html").test(referrer)) {
            initData.prePageID = "PC-M-USER-ORD";
            initData.prePageName = "个人中心-我的订单";
        }
    }
    //获取ip地址
    function getIpAddress() {
        $.getScript("//ipip.iask.cn/iplookup/search?format=js", function(response, status) {
            if (status === "success") {
                method.setCookieWithExp("ip", remote_ip_info["ip"], 5 * 60 * 1e3, "/");
                initData.ip = remote_ip_info["ip"];
            } else {
                console.error("ipip获取ip信息error");
            }
        });
    }
    //获得操作系统类型
    function getDeviceOs() {
        var name = "";
        if (window.navigator.userAgent.indexOf("Windows NT 10.0") != -1) {
            name = "Windows 10";
        } else if (window.navigator.userAgent.indexOf("Windows NT 6.2") != -1) {
            name = "Windows 8";
        } else if (window.navigator.userAgent.indexOf("Windows NT 6.1") != -1) {
            name = "Windows 7";
        } else if (window.navigator.userAgent.indexOf("Windows NT 6.0") != -1) {
            name = "Windows Vista";
        } else if (window.navigator.userAgent.indexOf("Windows NT 5.1") != -1) {
            name = "Windows XP";
        } else if (window.navigator.userAgent.indexOf("Windows NT 5.0") != -1) {
            name = "Windows 2000";
        } else if (window.navigator.userAgent.indexOf("Mac") != -1) {
            name = "Mac/iOS";
        } else if (window.navigator.userAgent.indexOf("X11") != -1) {
            name = "UNIX";
        } else if (window.navigator.userAgent.indexOf("Linux") != -1) {
            name = "Linux";
        }
        return name;
    }
    // 埋点上报 请求
    function push(params) {
        setTimeout(function() {
            console.log(params);
            $.getJSON("https://dw.iask.com.cn/ishare/jsonp?data=" + base64.encode(JSON.stringify(params)) + "&jsoncallback=?", function(data) {
                console.log(data);
            });
        });
    }
    // 埋点引擎
    function handle(commonData, customData) {
        var resultData = commonData;
        if (commonData && customData) {
            for (var key in commonData) {
                if (key === "var") {
                    for (var item in customData) {
                        resultData["var"][item] = customData[item];
                    }
                } else {
                    if (customData[key]) {
                        resultData[key] = customData[key];
                    }
                }
            }
            console.log("埋点参数:", resultData);
            push(resultData);
        }
    }
    //全部页面都要上报
    function normalPageView() {
        var commonData = JSON.parse(JSON.stringify(initData));
        setPreInfo(document.referrer, commonData);
        var customData = {
            channel: ""
        };
        var bc = method.getCookie("bc");
        if (bc) {
            customData.channel = bc;
        }
        commonData.eventType = "page";
        commonData.eventID = "NE001";
        commonData.eventName = "normalPageView";
        commonData.pageID = $("#ip-page-id").val() || "";
        commonData.pageName = $("#ip-page-name").val() || "";
        commonData.pageURL = window.location.href;
        var utm_source = method.getParam("utm_source");
        var utm_medium = method.getParam("utm_campaign");
        var utm_term = method.getParam("utm_campaign");
        $.extend(customData, {
            utm_source: utm_source,
            utm_medium: utm_medium,
            utm_term: utm_term
        });
        handle(commonData, customData);
    }
    //详情页
    function fileDetailPageView() {
        var customData = {
            fileID: window.pageConfig.params.g_fileId,
            fileName: window.pageConfig.params.file_title,
            fileCategoryID: window.pageConfig.params.classid1 + "||" + window.pageConfig.params.classid2 + "||" + window.pageConfig.params.classid3,
            fileCategoryName: window.pageConfig.params.classidName1 + "||" + window.pageConfig.params.classidName2 + "||" + window.pageConfig.params.classidName3,
            filePrice: window.pageConfig.params.moneyPrice,
            fileCouponCount: window.pageConfig.params.file_volume,
            filePayType: payTypeMapping[window.pageConfig.params.file_state],
            fileFormat: window.pageConfig.params.file_format,
            fileProduceType: window.pageConfig && window.pageConfig.params ? window.pageConfig.params.fsource : "",
            fileCooType: "",
            fileUploaderID: window.pageConfig.params.file_uid
        };
        var is360 = window.pageConfig && window.pageConfig.params ? window.pageConfig.params.is360 : "";
        if (/https?\:\/\/[^\s]*so.com.*$/g.test(document.referrer) && !/https?\:\/\/[^\s]*wenku.so.com.*$/g.test(document.referrer) && is360 == "true") {
            customData.fileCooType = "360onebox";
            method.setCookieWithExp("bc", "360onebox", 30 * 60 * 1e3, "/");
        }
        if (/https?\:\/\/[^\s]*wenku.so.com.*$/g.test(document.referrer)) {
            customData.fileCooType = "360wenku";
            method.setCookieWithExp("bc", "360wenku", 30 * 60 * 1e3, "/");
        }
        var commonData = JSON.parse(JSON.stringify(initData));
        setPreInfo(document.referrer, commonData);
        commonData.eventType = "page";
        commonData.eventID = "SE002";
        commonData.eventName = "fileDetailPageView";
        commonData.pageID = $("#ip-page-id").val() || "";
        commonData.pageName = $("#ip-page-name").val() || "";
        commonData.pageURL = window.location.href;
        method.setCookieWithExp("bf", JSON.stringify(customData), 30 * 60 * 1e3, "/");
        handle(commonData, customData);
    }
    //文件购买结果页
    function payFileResult(customData) {
        var commonData = JSON.parse(JSON.stringify(initData));
        setPreInfo(document.referrer, commonData);
        commonData.eventType = "page";
        commonData.eventID = "SE009";
        commonData.eventName = "payFileResult";
        commonData.pageID = $("#ip-page-id").val() || "";
        commonData.pageName = $("#ip-page-name").val() || "";
        commonData.pageURL = window.location.href;
        if (!customData.fileID) {
            customData.fileID = method.getParam("fid") || $("#ip-page-fid").val();
        }
        if (!customData.filePayType) {
            var state = $("#ip-page-fstate").val() || 1;
            customData.filePayType = payTypeMapping[state];
        }
        handle(commonData, customData);
    }
    //vip购买结果页
    function payVipResult(customData) {
        var commonData = JSON.parse(JSON.stringify(initData));
        setPreInfo(document.referrer, commonData);
        commonData.eventType = "page";
        commonData.eventID = "SE011";
        commonData.eventName = "payVipResult";
        commonData.pageID = $("#ip-page-id").val() || "";
        commonData.pageName = $("#ip-page-name").val() || "";
        commonData.pageURL = window.location.href;
        if (!customData.orderID) {
            customData.orderID = method.getParam("orderNo") || "";
        }
        handle(commonData, customData);
    }
    //下载特权购买结果页
    function payPrivilegeResult(customData) {
        var commonData = JSON.parse(JSON.stringify(initData));
        setPreInfo(document.referrer, commonData);
        commonData.eventType = "page";
        commonData.eventID = "SE013";
        commonData.eventName = "payPrivilegeResult";
        commonData.pageID = $("#ip-page-id").val() || "";
        commonData.pageName = $("#ip-page-name").val() || "";
        commonData.pageURL = window.location.href;
        handle(commonData, customData);
    }
    //下载结果页
    function downResult(customData) {
        var commonData = JSON.parse(JSON.stringify(initData));
        setPreInfo(document.referrer, commonData);
        commonData.eventType = "page";
        commonData.eventID = "SE014";
        commonData.eventName = "downResult";
        commonData.pageID = $("#ip-page-id").val() || "";
        commonData.pageName = $("#ip-page-name").val() || "";
        commonData.pageURL = window.location.href;
        handle(commonData, customData);
    }
    function searchResult(customData) {
        //导出页面使用
        var commonData = JSON.parse(JSON.stringify(initData));
        commonData.eventType = "page";
        commonData.eventID = "SE015";
        commonData.eventName = "searchPageView";
        setPreInfo(document.referrer, commonData);
        commonData.pageID = "PC-M-SR" || "";
        commonData.pageName = $("#ip-page-name").val() || "";
        commonData.pageURL = window.location.href;
        handle(commonData, customData);
    }
    //页面级事件
    $(function() {
        setTimeout(function() {
            var pid = $("#ip-page-id").val();
            if ("PC-M-FD" == pid) {
                //详情页
                fileDetailPageView();
            }
            if ("PC-O-SR" != pid) {
                //不是办公频道搜索结果页
                normalPageView();
            }
            var payVipResultData = {
                payResult: 1,
                orderID: method.getParam("orderNo") || "",
                couponID: $(".pay-coupon-wrap").attr("vid") || "",
                coupon: $(".pay-coupon-wrap p.chose-ele").text() || "",
                orderPayType: "",
                orderPayPrice: "",
                vipID: "",
                vipName: "",
                vipPrice: ""
            };
            var payPriResultData = {
                payResult: 1,
                orderID: method.getParam("orderNo") || "",
                couponID: $(".pay-coupon-wrap").attr("vid") || "",
                coupon: $(".pay-coupon-wrap p.chose-ele").text() || "",
                orderPayType: "",
                orderPayPrice: "",
                fileID: "",
                fileName: "",
                fileCategoryID: "",
                fileCategoryName: "",
                filePayType: "",
                fileFormat: "",
                fileProduceType: "",
                fileCooType: "",
                fileUploaderID: "",
                privilegeID: "",
                privilegeName: "",
                privilegePrice: ""
            };
            var payFileResultData = {
                payResult: 1,
                orderID: method.getParam("orderNo") || "",
                couponID: $(".pay-coupon-wrap").attr("vid") || "",
                coupon: $(".pay-coupon-wrap p.chose-ele").text() || "",
                orderPayType: "",
                orderPayPrice: "",
                fileID: "",
                fileName: "",
                fileCategoryID: "",
                fileCategoryName: "",
                filePayType: "",
                fileFormat: "",
                fileProduceType: "",
                fileCooType: "",
                fileUploaderID: "",
                filePrice: "",
                fileSalePrice: ""
            };
            var bf = method.getCookie("bf");
            var br = method.getCookie("br");
            var href = window.location.href;
            if ("PC-M-PAY-SUC" == pid || "PC-O-PAY-SUC" == pid) {
                //支付成功页
                if (href.indexOf("type=0") > -1) {
                    //vip购买成功页
                    if (br) {
                        trans(JSON.parse(br), payVipResultData);
                    }
                    payVipResult(payVipResultData);
                } else if (href.indexOf("type=1") > -1) {
                    //下载特权购买成功页
                    if (bf) {
                        trans(JSON.parse(bf), payPriResultData);
                    }
                    if (br) {
                        trans(JSON.parse(br), payPriResultData);
                    }
                    payPrivilegeResult(payPriResultData);
                } else if (href.indexOf("type=2") > -1) {
                    //文件购买成功页
                    if (bf) {
                        trans(JSON.parse(bf), payFileResultData);
                    }
                    var br = method.getCookie("br");
                    if (br) {
                        trans(JSON.parse(br), payFileResultData);
                    }
                    payFileResult(payFileResultData);
                }
            } else if ("PC-M-PAY-FAIL" == pid || "PC-O-PAY-FAIL" == pid) {
                //支付失败页
                if (href.indexOf("type=0") > -1) {
                    //vip购买失败页
                    if (br) {
                        trans(JSON.parse(br), payVipResultData);
                    }
                    payVipResultData.payResult = 0;
                    payVipResult(payVipResultData);
                } else if (href.indexOf("type=1") > -1) {
                    //下载特权购买失败页
                    if (bf) {
                        trans(JSON.parse(bf), payPriResultData);
                    }
                    if (br) {
                        trans(JSON.parse(br), payPriResultData);
                    }
                    payPriResultData.payResult = 0;
                    payPrivilegeResult(payPriResultData);
                } else if (href.indexOf("type=2") > -1) {
                    //文件购买失败页
                    if (bf) {
                        trans(JSON.parse(bf), payFileResultData);
                    }
                    if (br) {
                        trans(JSON.parse(br), payFileResultData);
                    }
                    payFileResultData.payResult = 0;
                    payFileResult(payFileResultData);
                }
            }
            var downResultData = {
                downResult: 1,
                fileID: "",
                fileName: "",
                fileCategoryID: "",
                fileCategoryName: "",
                filePayType: ""
            };
            if ("PC-M-DOWN-SUC" == pid) {
                //下载成功页
                var bf = method.getCookie("bf");
                if (bf) {
                    trans(JSON.parse(bf), downResultData);
                }
                downResultData.downResult = 1;
                downResult(downResultData);
            } else if ("PC-M-DOWN-FAIL" == pid) {
                //下载失败页
                var bf = method.getCookie("bf");
                if (bf) {
                    trans(JSON.parse(bf), downResultData);
                }
                downResultData.downResult = 0;
                downResult(downResultData);
            }
        }, 1e3);
    });
    //对象值传递
    function trans(from, to) {
        for (var i in to) {
            if (from[i]) {
                to[i] = from[i];
            }
        }
    }
    //点击事件
    $(document).delegate("." + config.EVENT_NAME, "click", function(event) {
        //动态绑定点击事件
        // debugger
        var that = $(this);
        var cnt = that.attr(config.BILOG_CONTENT_NAME);
        //上报事件类型
        console.log("cnt:", cnt);
        if (cnt) {
            setTimeout(function() {
                clickEvent(cnt, that);
            });
        }
    });
    function clickCenter(eventID, eventName, domId, domName, customData) {
        var commonData = JSON.parse(JSON.stringify(initData));
        setPreInfo(document.referrer, commonData);
        commonData.eventType = "click";
        commonData.eventID = eventID;
        commonData.eventName = eventName;
        commonData.pageID = $("#ip-page-id").val();
        commonData.pageName = $("#ip-page-name").val();
        commonData.pageURL = window.location.href;
        commonData.domID = domId;
        commonData.domName = domName;
        commonData.domURL = window.location.href;
        handle(commonData, customData);
    }
    //点击事件
    function clickEvent(cnt, that, moduleID) {
        var ptype = $("#ip-page-type").val();
        if (ptype == "pindex") {
            //详情页
            var customData = {
                fileID: "",
                fileName: "",
                fileCategoryID: "",
                fileCategoryName: "",
                filePayType: "",
                fileFormat: "",
                fileProduceType: "",
                fileCooType: "",
                fileUploaderID: ""
            };
            var bf = method.getCookie("bf");
            if (bf) {
                trans(JSON.parse(bf), customData);
            }
            if (cnt == "fileDetailUpDown" || cnt == "fileDetailMiddleDown" || cnt == "fileDetailBottomDown") {
                customData.downType = "";
                if (cnt == "fileDetailUpDown") {
                    clickCenter("SE003", "fileDetailDownClick", "fileDetailUpDown", "资料详情页顶部立即下载", customData);
                } else if (cnt == "fileDetailMiddleDown") {
                    clickCenter("SE003", "fileDetailDownClick", "fileDetailMiddleDown", "资料详情页中部立即下载", customData);
                } else if (cnt == "fileDetailBottomDown") {
                    clickCenter("SE003", "fileDetailDownClick", "fileDetailBottomDown", "资料详情页底部立即下载", customData);
                }
                delete customData.downType;
            } else if (cnt == "fileDetailUpBuy") {
                clickCenter("SE004", "fileDetailBuyClick", "fileDetailUpBuy", "资料详情页顶部立即购买", customData);
            } else if (cnt == "fileDetailMiddleBuy") {
                clickCenter("SE004", "fileDetailBuyClick", "fileDetailMiddleBuy", "资料详情页中部立即购买", customData);
            } else if (cnt == "fileDetailBottomBuy") {
                clickCenter("SE004", "fileDetailBuyClick", "fileDetailBottomBuy", "资料详情页底部立即购买", customData);
            } else if (cnt == "fileDetailMiddleOpenVip8") {
                clickCenter("SE005", "fileDetailOpenVipClick", "fileDetailMiddleOpenVip8", "资料详情页中部开通vip，8折购买", customData);
            } else if (cnt == "fileDetailBottomOpenVip8") {
                clickCenter("SE005", "fileDetailOpenVipClick", "fileDetailBottomOpenVip8", "资料详情页底部开通vip，8折购买", customData);
            } else if (cnt == "fileDetailMiddleOpenVipPr") {
                clickCenter("SE005", "fileDetailOpenVipClick", "fileDetailMiddleOpenVipPr", "资料详情页中部开通vip，享更多特权", customData);
            } else if (cnt == "fileDetailBottomOpenVipPr") {
                clickCenter("SE005", "fileDetailOpenVipClick", "fileDetailBottomOpenVipPr", "资料详情页底部开通vip，享更多特权", customData);
            } else if (cnt == "fileDetailComment") {
                clickCenter("SE006", "fileDetailCommentClick", "fileDetailComment", "资料详情页评论", customData);
            } else if (cnt == "fileDetailScore") {
                var score = that.find(".on:last").text();
                customData.fileScore = score ? score : "";
                clickCenter("SE007", "fileDetailScoreClick", "fileDetailScore", "资料详情页评分", customData);
                delete customData.fileScore;
            }
        }
        if (cnt == "payFile") {
            var customData = {
                orderID: method.getParam("orderNo") || "",
                couponID: $(".pay-coupon-wrap").attr("vid") || "",
                coupon: $(".pay-coupon-wrap p.chose-ele").text() || "",
                fileID: "",
                fileName: "",
                fileCategoryID: "",
                fileCategoryName: "",
                filePayType: "",
                fileFormat: "",
                fileProduceType: "",
                fileCooType: "",
                fileUploaderID: "",
                filePrice: "",
                fileSalePrice: ""
            };
            var bf = method.getCookie("bf");
            if (bf) {
                trans(JSON.parse(bf), customData);
            }
            clickCenter("SE008", "payFileClick", "payFile", "支付页-付费资料-立即支付", customData);
        } else if (cnt == "payVip") {
            var customData = {
                orderID: method.getParam("orderNo") || "",
                vipID: $(".ui-tab-nav-item.active").data("vid"),
                vipName: $(".ui-tab-nav-item.active p.vip-time").text() || "",
                vipPrice: $(".ui-tab-nav-item.active p.vip-price strong").text() || "",
                couponID: $(".pay-coupon-wrap").attr("vid") || "",
                coupon: $(".pay-coupon-wrap p.chose-ele").text() || ""
            };
            clickCenter("SE010", "payVipClick", "payVip", "支付页-VIP-立即支付", customData);
        } else if (cnt == "payPrivilege") {
            var customData = {
                orderID: method.getParam("orderNo") || "",
                couponID: $(".pay-coupon-wrap").attr("vid") || "",
                coupon: $(".pay-coupon-wrap p.chose-ele").text() || "",
                // privilegeID: $(".ui-tab-nav-item.active").data('pid') || '',
                privilegeName: $(".ui-tab-nav-item.active p.privilege-price").text() || "",
                privilegePrice: $(".ui-tab-nav-item.active").data("activeprice") || "",
                fileID: "",
                fileName: "",
                fileCategoryID: "",
                fileCategoryName: "",
                filePayType: "",
                fileFormat: "",
                fileProduceType: "",
                fileCooType: "",
                fileUploaderID: ""
            };
            var bf = method.getCookie("bf");
            if (bf) {
                trans(JSON.parse(bf), customData);
            }
            clickCenter("SE012", "payPrivilegeClick", "payPrivilege", "支付页-下载特权-立即支付", customData);
        } else if (cnt == "searchResult") {
            customData = {
                fileID: that.attr("data-fileId"),
                fileName: that.attr("data-fileName"),
                keyWords: $("#scondition").val()
            };
            clickCenter("SE016", "normalClick", "searchResultClick", "搜索结果页点击", customData);
        }
        var customData = {
            phone: $("#ip-mobile").val() || "",
            vipStatus: $("#ip-isVip").val() || "",
            channel: "",
            cashBalance: "",
            integralNumber: "",
            idolNumber: "",
            fileCategoryID: "",
            fileCategoryName: ""
        };
        if (userInfo) {
            customData.vipStatus = userInfo.isVip || "";
            customData.phone = userInfo.tel || "";
        }
        var bc = method.getCookie("bc");
        if (bc) {
            customData.channel = bc;
        }
        if (cnt == "paySuccessBacDown") {
            clickCenter("NE002", "normalClick", "paySuccessBacDown", "支付成功页-返回下载", customData);
        } else if (cnt == "paySuccessOpenVip") {
            clickCenter("NE002", "normalClick", "paySuccessOpenVip", "支付成功页-开通VIP", customData);
        } else if (cnt == "downSuccessOpenVip") {
            clickCenter("NE002", "normalClick", "downSuccessOpenVip", "下载成功页-开通VIP", customData);
        } else if (cnt == "downSuccessContinueVip") {
            clickCenter("NE002", "normalClick", "downSuccessContinueVip", "下载成功页-续费VIP", customData);
        } else if (cnt == "downSuccessBacDetail") {
            clickCenter("NE002", "normalClick", "downSuccessBacDetail", "下载成功页-返回详情页", customData);
        } else if (cnt == "downSuccessBindPhone") {
            clickCenter("NE002", "normalClick", "downSuccessBindPhone", "下载成功页-立即绑定", customData);
        } else if (cnt == "viewExposure") {
            customData.moduleID = moduleID;
            clickCenter("SE006", "modelView", "", "", customData);
        } else if (cnt == "similarFileClick") {
            customData = {
                fileID: window.pageConfig.params.g_fileId,
                fileName: window.pageConfig.params.file_title,
                fileCategoryID: window.pageConfig.params.classid1 + "||" + window.pageConfig.params.classid2 + "||" + window.pageConfig.params.classid3,
                fileCategoryName: window.pageConfig.params.classidName1 + "||" + window.pageConfig.params.classidName2 + "||" + window.pageConfig.params.classidName3,
                filePayType: payTypeMapping[window.pageConfig.params.file_state]
            };
            clickCenter("SE017", "fileListNormalClick", "similarFileClick", "资料列表常规点击", customData);
        } else if (cnt == "underSimilarFileClick") {
            clickCenter("SE017", "fileListNormalClick", "underSimilarFileClick", "点击底部猜你喜欢内容时", customData);
        } else if (cnt == "downSucSimilarFileClick") {
            clickCenter("SE017", "fileListNormalClick", "downSucSimilarFileClick", "下载成功页猜你喜欢内容时", customData);
        } else if (cnt == "markFileClick") {
            customData = {
                fileID: window.pageConfig.params.g_fileId,
                fileName: window.pageConfig.params.file_title,
                fileCategoryID: window.pageConfig.params.classid1 + "||" + window.pageConfig.params.classid2 + "||" + window.pageConfig.params.classid3,
                fileCategoryName: window.pageConfig.params.classidName1 + "||" + window.pageConfig.params.classidName2 + "||" + window.pageConfig.params.classidName3,
                filePayType: payTypeMapping[window.pageConfig.params.file_state],
                markRusult: 1
            };
            clickCenter("SE019", "markClick", "markFileClick", "资料收藏点击", customData);
        } else if (cnt == "vipRights") {
            clickCenter("NE002", "normalClick", "vipRights", "侧边栏-vip权益", customData);
        } else if (cnt == "seen") {
            clickCenter("NE002", "normalClick", "seen", "侧边栏-我看过的", customData);
        } else if (cnt == "mark") {
            clickCenter("NE002", "normalClick", "mark", "侧边栏-我的收藏", customData);
        } else if (cnt == "customerService") {
            clickCenter("NE002", "normalClick", "customerService", "侧边栏-联系客服", customData);
        } else if (cnt == "downApp") {
            clickCenter("NE002", "normalClick", "downApp", "侧边栏-下载APP", customData);
        } else if (cnt == "follow") {
            clickCenter("NE002", "normalClick", "follow", "侧边栏-关注领奖", customData);
        }
    }
    module.exports = {
        clickEvent: function($this) {
            var cnt = $this.attr(config.BILOG_CONTENT_NAME);
            console.log("cnt-导出的:", cnt);
            if (cnt) {
                setTimeout(function() {
                    clickEvent(cnt, $this);
                });
            }
        },
        viewExposure: function($this, moduleID) {
            var cnt = "viewExposure";
            if (cnt) {
                setTimeout(function() {
                    clickEvent(cnt, $this, moduleID);
                });
            }
        },
        searchResult: searchResult
    };
});

/**
 * @Description: 工具类
 */
define("dist/cmd-lib/util", [], function(require, exports, module) {
    // var $ = require("$");
    var utils = {
        //节流函数 func 是传入执行函数，wait是定义执行间隔时间
        throttle: function(func, wait) {
            var last, deferTimer;
            return function(args) {
                var that = this;
                var _args = arguments;
                //当前时间
                var now = +new Date();
                //将当前时间和上一次执行函数时间对比
                //如果差值大于设置的等待时间就执行函数
                if (last && now < last + wait) {
                    clearTimeout(deferTimer);
                    deferTimer = setTimeout(function() {
                        last = now;
                        func.apply(that, _args);
                    }, wait);
                } else {
                    last = now;
                    func.apply(that, _args);
                }
            };
        },
        //防抖函数 func 是传入执行函数，wait是定义执行间隔时间
        debounce: function(func, wait) {
            //缓存一个定时器id 
            var timer = 0;
            var that = this;
            return function(args) {
                if (timer) clearTimeout(timer);
                timer = setTimeout(function() {
                    func.apply(that, args);
                }, wait);
            };
        },
        //判断是否微信浏览器
        isWeChatBrow: function() {
            var ua = navigator.userAgent.toLowerCase();
            var isWeixin = ua.indexOf("micromessenger") != -1;
            if (isWeixin) {
                return true;
            } else {
                return false;
            }
        },
        //识别是ios 还是 android
        getWebAppUA: function() {
            var res = 0;
            //非IOS
            var ua = navigator.userAgent.toLowerCase();
            if (/iphone|ipad|ipod/.test(ua)) {
                res = 1;
            } else if (/android/.test(ua)) {
                res = 0;
            }
            return res;
        },
        //判断IE8以下浏览器
        validateIE8: function() {
            if ($.browser.msie && ($.browser.version == "8.0" || $.browser.version == "7.0" || $.browser.version == "6.0")) {
                return true;
            } else {
                return false;
            }
        },
        //判断IE9以下浏览器
        validateIE9: function() {
            if ($.browser.msie && ($.browser.version == "9.0" || $.browser.version == "8.0" || $.browser.version == "7.0" || $.browser.version == "6.0")) {
                return true;
            } else {
                return false;
            }
        },
        //获取来源地址 gio上报使用
        getReferrer: function() {
            var referrer = document.referrer;
            var res = "";
            if (/https?\:\/\/[^\s]*wenku.so.com.*$/g.test(referrer)) {
                res = "360wenku";
            } else if (/https?\:\/\/[^\s]*so.com.*$/g.test(referrer)) {
                res = "360";
            } else if (/https?\:\/\/[^\s]*baidu.com.*$/g.test(referrer)) {
                res = "baidu";
            } else if (/https?\:\/\/[^\s]*sogou.com.*$/g.test(referrer)) {
                res = "sogou";
            } else if (/https?\:\/\/[^\s]*sm.cn.*$/g.test(referrer)) {
                res = "sm";
            } else if (/https?\:\/\/[^\s]*ishare.iask.sina.com.cn.*$/g.test(referrer)) {
                res = "ishare";
            } else if (/https?\:\/\/[^\s]*iask.sina.com.cn.*$/g.test(referrer)) {
                res = "iask";
            }
            return res;
        },
        getPageRef: function(fid) {
            var that = this;
            var ref = 0;
            if (that.is360cookie(fid) || that.is360cookie("360")) {
                ref = 1;
            }
            if (that.is360wkCookie()) {
                ref = 3;
            }
            return ref;
        },
        is360cookie: function(val) {
            var that = this;
            var rso = that.getCookie("_r_so");
            if (rso) {
                var split = rso.split("_");
                for (var i = 0; i < split.length; i++) {
                    if (split[i] == val) {
                        return true;
                    }
                }
            }
            return false;
        },
        add360wkCookie: function() {
            this.setCookieWithExpPath("_360hz", "1", 1e3 * 60 * 30, "/");
        },
        is360wkCookie: function() {
            return getCookie("_360hz") == null ? false : true;
        },
        getCookie: function(name) {
            var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
            if (arr !== null) {
                return unescape(arr[2]);
            }
            return null;
        },
        setCookieWithExpPath: function(name, value, timeOut, path) {
            var exp = new Date();
            exp.setTime(exp.getTime() + timeOut);
            document.cookie = name + "=" + escape(value) + ";path=" + path + ";expires=" + exp.toGMTString();
        },
        //gio数据上报上一级页面来源
        findRefer: function() {
            var referrer = document.referrer;
            var res = "other";
            if (/https?\:\/\/[^\s]*\/f\/.*$/g.test(referrer)) {
                res = "pindex";
            } else if (/https?\:\/\/[^\s]*\/d\/.*$/g.test(referrer)) {
                res = "landing";
            } else if (/https?\:\/\/[^\s]*\/c\/.*$/g.test(referrer)) {
                res = "pcat";
            } else if (/https?\:\/\/[^\s]*\/search\/.*$/g.test(referrer)) {
                res = "psearch";
            } else if (/https?\:\/\/[^\s]*\/t\/.*$/g.test(referrer)) {
                res = "ptag";
            } else if (/https?\:\/\/[^\s]*\/[u|n]\/.*$/g.test(referrer)) {
                res = "popenuser";
            } else if (/https?\:\/\/[^\s]*\/ucenter\/.*$/g.test(referrer)) {
                res = "puser";
            } else if (/https?\:\/\/[^\s]*ishare.iask.sina.com.cn.$/g.test(referrer)) {
                res = "ishareindex";
            } else if (/https?\:\/\/[^\s]*\/theme\/.*$/g.test(referrer)) {
                res = "theme";
            } else if (/https?\:\/\/[^\s]*wenku.so.com.*$/g.test(referrer)) {
                res = "360wenku";
            } else if (/https?\:\/\/[^\s]*so.com.*$/g.test(referrer)) {
                res = "360";
            } else if (/https?\:\/\/[^\s]*baidu.com.*$/g.test(referrer)) {
                res = "baidu";
            } else if (/https?\:\/\/[^\s]*sogou.com.*$/g.test(referrer)) {
                res = "sogou";
            } else if (/https?\:\/\/[^\s]*sm.cn.*$/g.test(referrer)) {
                res = "sm";
            } else if (/https?\:\/\/[^\s]*ishare.iask.sina.com.cn.*$/g.test(referrer)) {
                res = "ishare";
            } else if (/https?\:\/\/[^\s]*iask.sina.com.cn.*$/g.test(referrer)) {
                res = "iask";
            }
            return res;
        },
        /*通用对话框(alert)*/
        showAlertDialog: function(title, content, callback) {
            var bgMask = $(".common-bgMask");
            var dialog = $(".common-dialog");
            /*标题*/
            dialog.find("h2[name='title']").text(title);
            /*内容*/
            dialog.find("span[name='content']").html(content);
            /*文件下载dialog关闭按钮事件*/
            dialog.find("a.close,a.btn-dialog").unbind("click").click(function() {
                bgMask.hide();
                dialog.hide();
                /*回调*/
                if (callback && !$(this).hasClass("close")) callback();
            });
            bgMask.show();
            dialog.show();
        },
        browserVersion: function(userAgent) {
            var isOpera = userAgent.indexOf("Opera") > -1;
            //判断是否Opera浏览器
            var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera;
            //判断是否IE浏览器
            var isEdge = userAgent.indexOf("Edge") > -1;
            //判断是否IE的Edge浏览器
            var isFF = userAgent.indexOf("Firefox") > -1;
            //判断是否Firefox浏览器
            var isSafari = userAgent.indexOf("Safari") > -1 && userAgent.indexOf("Chrome") === -1;
            //判断是否Safari浏览器
            var isChrome = userAgent.indexOf("Chrome") > -1 && userAgent.indexOf("Safari") > -1;
            //判断Chrome浏览器
            if (isIE) {
                var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
                reIE.test(userAgent);
                var fIEVersion = parseFloat(RegExp["$1"]);
                if (fIEVersion === 7) {
                    return "IE7";
                } else if (fIEVersion === 8) {
                    return "IE8";
                } else if (fIEVersion === 9) {
                    return "IE9";
                } else if (fIEVersion === 10) {
                    return "IE10";
                } else if (fIEVersion === 11) {
                    return "IE11";
                } else if (fIEVersion === 12) {
                    return "IE12";
                } else {
                    return "IE";
                }
            }
            if (isOpera) {
                return "Opera";
            }
            if (isEdge) {
                return "Edge";
            }
            if (isFF) {
                return "Firefox";
            }
            if (isSafari) {
                return "Safari";
            }
            if (isChrome) {
                return "Chrome";
            }
            return "unKnow";
        },
        getBrowserInfo: function(userAgent) {
            var Sys = {};
            var ua = userAgent.toLowerCase();
            var re = /(msie|firefox|chrome|opera|version|trident).*?([\d.]+)/;
            var m = ua.match(re);
            if (m && m.length >= 2) {
                Sys.browser = m[1].replace(/version/, "'safari") || "unknow";
                Sys.ver = m[2] || "1.0.0";
            } else {
                Sys.browser = "unknow";
                Sys.ver = "1.0.0";
            }
            return Sys.browser + "/" + Sys.ver;
        }
    };
    //return utils;
    module.exports = utils;
});

define("dist/report/config", [], function(require, exports, module) {
    return {
        COOKIE_FLAG: "_dplf",
        //cookie存储地址
        COOKIE_CIDE: "_dpcid",
        //客户端id cookie地址存储
        COOKIE_CUK: "cuk",
        COOKIE_TIMEOUT: 1e3 * 60 * 50,
        //过期时间
        // SERVER_URL: '/dataReport',                  //接口地址
        SERVER_URL: "/",
        UACTION_URL: "/uAction",
        //用户阅读文档数据上传url
        EVENT_NAME: "pc_click",
        //绑定事件名称
        CONTENT_NAME: "pcTrackContent",
        //上报事件内容名称
        BILOG_CONTENT_NAME: "bilogContent",
        //bilog上报事件内容名称
        ishareTrackEvent: "_ishareTrackEvent",
        //兼容旧事件
        eventCookieFlag: "_eventCookieFlag",
        EVENT_REPORT: false,
        //浏览页事件级上报是否开启
        // 以下为配置项
        AUTO_PV: false
    };
});

define("dist/report/init", [ "dist/report/handler", "dist/cmd-lib/util", "dist/report/columns", "dist/report/config", "dist/application/method" ], function(require, exports, module) {
    require("dist/report/handler");
});

define("dist/report/handler", [ "dist/cmd-lib/util", "dist/report/columns", "dist/report/config", "dist/application/method" ], function(require, exports, module) {
    // var $ = require("$");
    var util = require("dist/cmd-lib/util");
    var columns = require("dist/report/columns");
    //上报参数配置
    var config = require("dist/report/config");
    //参数配置
    var method = require("dist/application/method");
    var cid;
    function Report(opt, con) {
        this.options = $.extend(true, columns, opt);
        this.config = $.extend(true, config, con);
        this.init();
    }
    Report.prototype = {
        //初始化
        init: function() {
            // this.getIpAddress();
            this.client();
            this.send(0, this.format());
            this.send(2, new Date().getTime());
            if (gio && pageConfig.report) {
                gio("page.set", pageConfig.report);
            }
        },
        //初始化获取客户端信息
        //op_cid_uid_ptype_usource_fsource_ftype_format_cate_cateName_cate1_cate2_ip_province_city_clickName_time_timestamp
        client: function() {
            var uid = "";
            if (pageConfig.page) {
                uid = pageConfig.page.uid || "";
            }
            if (!uid && method.getCookie(this.config.COOKIE_CUK)) {
                uid = "logined";
            }
            this.options.uid = uid;
            if (method.getCookie(this.config.COOKIE_CIDE)) {
                cid = method.getCookie(this.config.COOKIE_CIDE);
            } else {
                cid = new Date().getTime() + "" + Math.random();
                method.setCookieWithExpPath(this.options.cid, cid, 1e3 * 60 * 60 * 24 * 30, "/");
            }
            this.options.usource = util.getReferrer();
            this.options.cid = cid;
            this.clickWatch();
        },
        //获取ip地址
        getIpAddress: function() {
            var that = this;
            $.getScript("//ipip.iask.cn/iplookup/search?format=js", function(response, status) {
                if (status === "success") {
                    that.options = $.extend(true, that.options, {
                        city: remote_ip_info["cityCode"],
                        province: remote_ip_info["provinceCode"],
                        ip: remote_ip_info["ip"]
                    });
                } else {
                    console.error("ipip获取ip信息error");
                }
            });
        },
        //监听点击事件
        //op_cid_uid_ptype_usource_fsource_ftype_format_cate_cateName_cate1_cate2_ip_province_city_clickName_time_timestamp
        clickWatch: function() {
            var that = this;
            $(document).delegate("." + this.config.EVENT_NAME, "click", function(event) {
                //动态绑定点击事件
                var cnt = $(this).attr(that.config.CONTENT_NAME);
                //上报事件类型
                that.setCurrEventCon(cnt);
                if ($.browser.msie && $.browser.version <= 8 && that.mousePosition(event).x >= 0 || event.originalEvent && event.originalEvent.isTrusted) {
                    //判断用户点击 、及内容不能为空
                    if (cnt) {
                        that.push([ that.config.CONTENT_NAME, cnt ]);
                    }
                }
                $(this).trigger("init", event);
            });
        },
        //action 事件名称 data 上报数据
        gioTrack: function(action, data) {
            if (gio && data) {
                gio("track", action, data);
            }
        },
        //页面级埋点   上报数据
        // gio('page.set','prodName_pvar','可口可乐')
        // 或
        // gio('page.set',{'prodName_pvar','可口可乐'})
        gioPage: function(keyorObj) {
            if (gio && keyorObj) {
                gio("page.set", keyorObj);
            }
        },
        //推送数据
        push: function(d, callback) {
            if (d instanceof Array) {
                if (d && d.length > 1) {
                    //新旧兼容
                    d.shift();
                    if (d.length > 0 && d[0] == this.config.eventCookieFlag) {
                        //
                        d.shift();
                        this.handleCookieFlag(d.join("_"));
                    }
                    this.options.clickName = d[0];
                }
            }
            var reportData = this.format();
            this.send(1, reportData);
            //1 点击事件上报
            callback && callback(reportData);
        },
        //cookie标示 处理
        handleCookieFlag: function(val) {
            try {
                var cookie = method.getCookie(this.config.COOKIE_FLAG);
                if (cookie) {
                    var parse = JSON.parse(cookie);
                    parse["v"] = val;
                    parse["t"] = new Date().getTime();
                    //JSON.stringify  在ie低版本下有报错需要改进
                    method.setCookieWithExpPath(this.config.COOKIE_FLAG, JSON.stringify(parse), 1e3 * 60 * 50, "/");
                }
            } catch (e) {}
        },
        //数据格式化[op_cid_uid_ptype_usource_fsource_ftype_format_cate_cateName_cate1_cate2_ip_province_city_clickName_time_timestamp];
        format: function() {
            try {
                var res = this.options;
                var data = [ res.cid, res.uid, res.ptype, res.usource, res.fsource, res.ftype, res.format, res.cate, res.cateName, res.cate1, res.cate2, res.ip, res.province, res.city, res.clickName, res.time, res.timestamp ];
                return data.join("_");
            } catch (e) {}
        },
        //数据上报
        send: function(type, browserData) {
            method.get(this.config.SERVER_URL + "?" + type + "_" + encodeURIComponent(browserData), function() {}, "");
        },
        //获取事件点击位置 用以达到判断 是否是用户点击事件
        mousePosition: function(ev) {
            try {
                ev = ev || window.event;
                if (ev.pageX || ev.pageY) {
                    return {
                        x: ev.pageX,
                        y: ev.pageY
                    };
                }
                return {
                    x: ev.clientX + document.body.scrollLeft - document.body.clientLeft,
                    y: ev.clientY + document.body.scrollTop - document.body.clientTop
                };
            } catch (e) {}
        },
        //浏览文档数据上报
        uActionReport: function(browserData) {
            $.get(this.uActionUrl + "?" + encodeURIComponent(browserData) + "_" + new Date().getTime(), function(response, status) {});
        },
        //当前点击内容
        setCurrEventCon: function(cnt) {
            method.setCookieWithExpPath("_dpclkcnt", cnt, 5 * 60 * 1e3, "/");
        }
    };
    window._dataReport = new Report(window.pageConfig.report);
    //点击数据全局对象 兼容登录系统埋点
    window.__pc__ = window._dataReport;
    try {
        var _hmt = _hmt || [];
        (function() {
            var hm = document.createElement("script");
            hm.src = "//hm.baidu.com/hm.js?adb0f091db00ed439bf000f2c5cbaee7";
            var s = document.getElementsByTagName("script")[0];
            s.parentNode.insertBefore(hm, s);
        })();
    } catch (e) {}
});

define("dist/report/columns", [], function(require, exports, module) {
    return {
        cid: "",
        //客户端id
        uid: "",
        //用户id
        ptype: "",
        //页面类型
        usource: "",
        //用户来源
        fsource: "",
        //页面来源
        ftype: "",
        //页面二级类型
        format: "",
        //页面格式
        cate: "",
        //分类
        cateName: "",
        //分类名称
        cate1: "",
        //1级分类
        cate2: "",
        //2级分类
        ip: "",
        //ip
        province: "",
        //省份
        city: "",
        //城市
        clickName: "",
        //点击事件
        time: "",
        //时间
        timestamp: ""
    };
});

define("dist/application/helper", [], function(require, exports, module) {
    template.helper("encodeValue", function(value) {
        return encodeURIComponent(encodeURIComponent(value));
    });
});

/**
 * @Description: toast.js
 *
 */
define("dist/cmd-lib/toast", [], function(require, exports, module) {
    //var $ = require("$");
    (function($, win, doc) {
        function Toast(options) {
            this.options = {
                text: "我是toast提示",
                icon: "",
                delay: 3e3,
                callback: false
            };
            //默认参数扩展
            if (options && $.isPlainObject(options)) {
                $.extend(true, this.options, options);
            }
            this.init();
        }
        Toast.prototype.init = function() {
            var that = this;
            that.body = $("body");
            that.toastWrap = $('<div class="ui-toast" style="position:fixed;width:200px;height:60px;line-height:60px;text-align:center;background:#000;opacity:0.8;filter:alpha(opacity=80);top:40%;left:50%;margin-left:-100px;margin-top:-30px;border-radius:4px;z-index:10000">');
            that.toastIcon = $('<i class="icon"></i>');
            that.toastText = $('<span class="ui-toast-text" style="color:#fff">' + that.options.text + "</span>");
            that._creatDom();
            that.show();
            that.hide();
        };
        Toast.prototype._creatDom = function() {
            var that = this;
            if (that.options.icon) {
                that.toastWrap.append(that.toastIcon.addClass(that.options.icon));
            }
            that.toastWrap.append(that.toastText);
            that.body.append(that.toastWrap);
        };
        Toast.prototype.show = function() {
            var that = this;
            setTimeout(function() {
                that.toastWrap.removeClass("hide").addClass("show");
            }, 50);
        };
        Toast.prototype.hide = function() {
            var that = this;
            setTimeout(function() {
                that.toastWrap.removeClass("show").addClass("hide");
                that.toastWrap.remove();
                that.options.callback && that.options.callback();
            }, that.options.delay);
        };
        $.toast = function(options) {
            return new Toast(options);
        };
    })($, window, document);
});

/*
* Q.js for Uploader
*/
define("dist/cmd-lib/upload/Q", [], function(require, exports, module) {
    (function(window, undefined) {
        "use strict";
        var toString = Object.prototype.toString, has = Object.prototype.hasOwnProperty, slice = Array.prototype.slice;
        //若value不为undefine,则返回value;否则返回defValue
        function def(value, defValue) {
            return value !== undefined ? value : defValue;
        }
        //检测是否为函数
        function isFunc(fn) {
            //在ie11兼容模式（ie6-8）下存在bug,当调用次数过多时可能返回不正确的结果
            //return typeof fn == "function";
            return toString.call(fn) === "[object Function]";
        }
        //检测是否为正整数
        function isUInt(n) {
            return typeof n == "number" && n > 0 && n === Math.floor(n);
        }
        //触发指定函数,如果函数不存在,则不触发
        function fire(fn, bind) {
            if (isFunc(fn)) return fn.apply(bind, slice.call(arguments, 2));
        }
        //扩展对象
        //forced:是否强制扩展
        function extend(destination, source, forced) {
            if (!destination || !source) return destination;
            for (var key in source) {
                if (key == undefined || !has.call(source, key)) continue;
                if (forced || destination[key] === undefined) destination[key] = source[key];
            }
            return destination;
        }
        //Object.forEach
        extend(Object, {
            //遍历对象
            forEach: function(obj, fn, bind) {
                for (var key in obj) {
                    if (has.call(obj, key)) fn.call(bind, key, obj[key], obj);
                }
            }
        });
        extend(Array.prototype, {
            //遍历对象
            forEach: function(fn, bind) {
                var self = this;
                for (var i = 0, len = self.length; i < len; i++) {
                    if (i in self) fn.call(bind, self[i], i, self);
                }
            }
        });
        extend(Date, {
            //获取当前日期和时间所代表的毫秒数
            now: function() {
                return +new Date();
            }
        });
        //-------------------------- browser ---------------------------
        var browser_ie;
        //ie11 开始不再保持向下兼容(例如,不再支持 ActiveXObject、attachEvent 等特性)
        if (window.ActiveXObject || window.msIndexedDB) {
            //window.ActiveXObject => ie10-
            //window.msIndexedDB   => ie11+
            browser_ie = document.documentMode || (!!window.XMLHttpRequest ? 7 : 6);
        }
        //-------------------------- json ---------------------------
        //json解析
        //secure:是否进行安全检测
        function json_decode(text, secure) {
            //安全检测
            if (secure !== false && !/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]").replace(/(?:^|:|,)(?:\s*\[)+/g, ""))) throw new Error("JSON SyntaxError");
            try {
                return new Function("return " + text)();
            } catch (e) {}
        }
        if (!window.JSON) window.JSON = {};
        if (!JSON.parse) JSON.parse = json_decode;
        //-------------------------- DOM ---------------------------
        //设置元素透明
        function setOpacity(ele, value) {
            if (value <= 1) value *= 100;
            if (ele.style.opacity != undefined) ele.style.opacity = value / 100; else if (ele.style.filter != undefined) ele.style.filter = "alpha(opacity=" + parseInt(value) + ")";
        }
        //获取元素绝对定位
        function getOffset(ele, root) {
            var left = 0, top = 0, width = ele.offsetWidth, height = ele.offsetHeight;
            do {
                left += ele.offsetLeft;
                top += ele.offsetTop;
                ele = ele.offsetParent;
            } while (ele && ele != root);
            return {
                left: left,
                top: top,
                width: width,
                height: height
            };
        }
        //遍历元素节点
        function walk(ele, walk, start, all) {
            var el = ele[start || walk];
            var list = [];
            while (el) {
                if (el.nodeType == 1) {
                    if (!all) return el;
                    list.push(el);
                }
                el = el[walk];
            }
            return all ? list : null;
        }
        //获取上一个元素节点
        function getPrev(ele) {
            return ele.previousElementSibling || walk(ele, "previousSibling", null, false);
        }
        //获取下一个元素节点
        function getNext(ele) {
            return ele.nextElementSibling || walk(ele, "nextSibling", null, false);
        }
        //获取第一个元素子节点
        function getFirst(ele) {
            return ele.firstElementChild || walk(ele, "nextSibling", "firstChild", false);
        }
        //获取最后一个元素子节点
        function getLast(ele) {
            return ele.lastElementChild || walk(ele, "previousSibling", "lastChild", false);
        }
        //获取所有子元素节点
        function getChilds(ele) {
            return ele.children || walk(ele, "nextSibling", "firstChild", true);
        }
        //创建元素
        function createEle(tagName, className, html) {
            var ele = document.createElement(tagName);
            if (className) ele.className = className;
            if (html) ele.innerHTML = html;
            return ele;
        }
        //解析html标签
        function parseHTML(html, all) {
            var box = createEle("div", "", html);
            return all ? box.childNodes : getFirst(box);
        }
        //-------------------------- event ---------------------------
        var addEvent, removeEvent;
        if (document.addEventListener) {
            //w3c
            addEvent = function(ele, type, fn) {
                ele.addEventListener(type, fn, false);
            };
            removeEvent = function(ele, type, fn) {
                ele.removeEventListener(type, fn, false);
            };
        } else if (document.attachEvent) {
            //IE
            addEvent = function(ele, type, fn) {
                ele.attachEvent("on" + type, fn);
            };
            removeEvent = function(ele, type, fn) {
                ele.detachEvent("on" + type, fn);
            };
        }
        //event简单处理
        function fix_event(event) {
            var e = event || window.event;
            //for ie
            if (!e.target) e.target = e.srcElement;
            return e;
        }
        //添加事件
        function add_event(element, type, handler, once) {
            var fn = function(e) {
                handler.call(element, fix_event(e));
                if (once) removeEvent(element, type, fn);
            };
            addEvent(element, type, fn);
            if (!once) {
                return {
                    //直接返回停止句柄 eg:var api=add_event();api.stop();
                    stop: function() {
                        removeEvent(element, type, fn);
                    }
                };
            }
        }
        //触发事件
        function trigger_event(ele, type) {
            if (isFunc(ele[type])) ele[type](); else if (ele.fireEvent) ele.fireEvent("on" + type); else if (ele.dispatchEvent) {
                var evt = document.createEvent("HTMLEvents");
                //initEvent接受3个参数:事件类型,是否冒泡,是否阻止浏览器的默认行为
                evt.initEvent(type, true, true);
                //鼠标事件,设置更多参数
                //var evt = document.createEvent("MouseEvents");
                //evt.initMouseEvent(type, true, true, ele.ownerDocument.defaultView, 1, e.screenX, e.screenY, e.clientX, e.clientY, false, false, false, false, 0, null);
                ele.dispatchEvent(evt);
            }
        }
        //阻止事件默认行为并停止事件冒泡
        function stop_event(event, isPreventDefault, isStopPropagation) {
            var e = fix_event(event);
            //阻止事件默认行为
            if (isPreventDefault !== false) {
                if (e.preventDefault) e.preventDefault(); else e.returnValue = false;
            }
            //停止事件冒泡
            if (isStopPropagation !== false) {
                if (e.stopPropagation) e.stopPropagation(); else e.cancelBubble = true;
            }
        }
        //---------------------- other ----------------------
        var RE_HTTP = /^https?:\/\//i;
        //是否http路径(以 http:// 或 https:// 开头)
        function isHttpURL(url) {
            return RE_HTTP.test(url);
        }
        //判断指定路径与当前页面是否同域(包括协议检测 eg:http与https不同域)
        function isSameHost(url) {
            if (!isHttpURL(url)) return true;
            var start = RegExp.lastMatch.length, end = url.indexOf("/", start), host = url.slice(0, end != -1 ? end : undefined);
            return host.toLowerCase() == (location.protocol + "//" + location.host).toLowerCase();
        }
        //按照进制解析数字的层级 eg:时间转化 -> parseLevel(86400,[60,60,24]) => { value=1, level=3 }
        //steps:步进,可以是固定的数字(eg:1024),也可以是具有层次关系的数组(eg:[60,60,24])
        //limit:限制解析的层级,正整数,默认为100
        function parseLevel(size, steps, limit) {
            size = +size;
            steps = steps || 1024;
            var level = 0, isNum = typeof steps == "number", stepNow = 1, count = isUInt(limit) ? limit : isNum ? 100 : steps.length;
            while (size >= stepNow && level < count) {
                stepNow *= isNum ? steps : steps[level];
                level++;
            }
            if (level && size < stepNow) {
                stepNow /= isNum ? steps : steps.last();
                level--;
            }
            return {
                value: level ? size / stepNow : size,
                level: level
            };
        }
        var UNITS_FILE_SIZE = [ "B", "KB", "MB", "GB", "TB", "PB", "EB" ];
        //格式化数字输出,将数字转为合适的单位输出,默认按照1024层级转为文件单位输出
        function formatSize(size, ops) {
            ops = ops === true ? {
                all: true
            } : ops || {};
            if (isNaN(size) || size == undefined || size < 0) {
                var error = ops.error || "--";
                return ops.all ? {
                    text: error
                } : error;
            }
            var pl = parseLevel(size, ops.steps, ops.limit), value = pl.value, text = value.toFixed(def(ops.digit, 2));
            if (ops.trim !== false && text.lastIndexOf(".") != -1) text = text.replace(/\.?0+$/, "");
            pl.text = text + (ops.join || "") + (ops.units || UNITS_FILE_SIZE)[pl.level + (ops.start || 0)];
            return ops.all ? pl : pl.text;
        }
        //---------------------- export ----------------------
        var Q = {
            def: def,
            isFunc: isFunc,
            isUInt: isUInt,
            fire: fire,
            extend: extend,
            ie: browser_ie,
            setOpacity: setOpacity,
            getOffset: getOffset,
            walk: walk,
            getPrev: getPrev,
            getNext: getNext,
            getFirst: getFirst,
            getLast: getLast,
            getChilds: getChilds,
            createEle: createEle,
            parseHTML: parseHTML,
            isHttpURL: isHttpURL,
            isSameHost: isSameHost,
            parseLevel: parseLevel,
            formatSize: formatSize
        };
        if (browser_ie) Q["ie" + (browser_ie < 6 ? 6 : browser_ie)] = true;
        Q.event = {
            fix: fix_event,
            stop: stop_event,
            trigger: trigger_event,
            add: add_event
        };
        window.Q = Q;
    })(window);
});

/// <reference path="Q.js" />
/// <reference path="Q.md5File.js" />
/*
* Q.Uploader.js 文件上传管理器 1.0
*/
define("dist/cmd-lib/upload/Q.Uploader", [], function(require, exports, module) {
    (function(window, undefined) {
        "use strict";
        var def = Q.def, fire = Q.fire, extend = Q.extend, getFirst = Q.getFirst, getLast = Q.getLast, parseJSON = JSON.parse, createEle = Q.createEle, parseHTML = Q.parseHTML, setOpacity = Q.setOpacity, getOffset = Q.getOffset, md5File = Q.md5File, E = Q.event, addEvent = E.add, triggerEvent = E.trigger, stopEvent = E.stop;
        //Object.forEach
        //Date.now
        //-------------------------------- Uploader --------------------------------
        var support_html5_upload = false, //是否支持html5(ajax)方式上传
        support_multiple_select = false, //是否支持文件多选
        support_file_click_trigger = false, //上传控件是否支持click触发文件选择 eg: input.click() => ie9及以下不支持
        UPLOADER_GUID = 0, //文件上传管理器唯一标示,多用于同一个页面存在多个管理器的情况
        UPLOAD_TASK_GUID = 0, //上传任务唯一标示
        UPLOAD_HTML4_ZINDEX = 0;
        //防止多个上传管理器的触发按钮位置重复引起的问题
        //上传状态
        var UPLOAD_STATE_READY = 0, //任务已添加,准备上传
        UPLOAD_STATE_PROCESSING = 1, //任务上传中
        UPLOAD_STATE_COMPLETE = 2, //任务上传完成
        UPLOAD_STATE_SKIP = -1, //任务已跳过(不会上传)
        UPLOAD_STATE_CANCEL = -2, //任务已取消
        UPLOAD_STATE_ERROR = -3;
        //任务已失败
        var global_settings = {};
        //Uploader全局设置
        function setup(ops) {
            extend(global_settings, ops, true);
        }
        //获取上传状态说明
        function get_upload_status_text(state) {
            var LANG = Uploader.Lang;
            switch (state) {
              case UPLOAD_STATE_READY:
                return LANG.status_ready;

              case UPLOAD_STATE_PROCESSING:
                return LANG.status_processing;

              case UPLOAD_STATE_COMPLETE:
                return LANG.status_complete;

              case UPLOAD_STATE_SKIP:
                return LANG.status_skip;

              case UPLOAD_STATE_CANCEL:
                return LANG.status_cancel;

              case UPLOAD_STATE_ERROR:
                return LANG.status_error;
            }
            return state;
        }
        //上传探测
        function detect() {
            var XHR = window.XMLHttpRequest;
            if (XHR && new XHR().upload && window.FormData) support_html5_upload = true;
            var input = document.createElement("input");
            input.type = "file";
            support_multiple_select = !!input.files;
            support_file_click_trigger = support_html5_upload;
        }
        //截取字符串
        function get_last_find(str, find) {
            var index = str.lastIndexOf(find);
            return index != -1 ? str.slice(index) : "";
        }
        //将逗号分隔的字符串转为键值对
        function split_to_map(str) {
            if (!str) return;
            var list = str.split(","), map = {};
            for (var i = 0, len = list.length; i < len; i++) {
                map[list[i]] = true;
            }
            return map;
        }
        //iframe load 事件
        //注意：低版本 ie 支持 iframe 的 onload 事件,不过是隐形的(iframe.onload 方式绑定的将不会触发),需要通过 attachEvent 来注册
        function bind_iframe_load(iframe, fn) {
            if (iframe.attachEvent) iframe.attachEvent("onload", fn); else iframe.addEventListener("load", fn, false);
        }
        //计算上传速度
        function set_task_speed(task, total, loaded) {
            if (!total || total <= 0) return;
            var nowTime = Date.now(), tick;
            //上传完毕,计算平均速度(Byte/s)
            if (loaded >= total) {
                tick = nowTime - task.startTime;
                if (tick) task.avgSpeed = Math.min(Math.round(total * 1e3 / tick), total); else if (!task.speed) task.avgSpeed = task.speed = total;
                task.time = tick || 0;
                task.endTime = nowTime;
                return;
            }
            //即时速度(Byte/s)
            tick = nowTime - task.lastTime;
            if (tick < 200) return;
            task.speed = Math.min(Math.round((loaded - task.loaded) * 1e3 / tick), task.total);
            task.lastTime = nowTime;
        }
        /*
        文件上传管理器,调用示例
        new Uploader({
            //--------------- 必填 ---------------
            url: "",            //上传路径
            target: element,    //上传按钮，可为数组
            view: element,      //上传任务视图(需加载UI接口默认实现)

            //--------------- 可选 ---------------
            html5: true,       //是否启用html5上传,若浏览器不支持,则自动禁用
            multiple: true,    //选择文件时是否允许多选,若浏览器不支持,则自动禁用(仅html5模式有效)

            clickTrigger:true, //是否启用click触发文件选择 eg: input.click() => ie9及以下不支持

            auto: true,        //添加任务后是否立即上传

            data: {},          //上传文件的同时可以指定其它参数,该参数将以POST的方式提交到服务器

            workerThread: 1,   //同时允许上传的任务数(仅html5模式有效)

            upName: "upfile",  //上传参数名称,若后台需要根据name来获取上传数据,可配置此项
            accept: "",        //指定浏览器接受的文件类型 eg:image/*,video/*
            isDir: false,      //是否是文件夹上传（仅Webkit内核浏览器和新版火狐有效）

            allows: "",        //允许上传的文件类型(扩展名),多个之间用逗号隔开
            disallows: "",     //禁止上传的文件类型(扩展名)

            maxSize: 2*1024*1024,   //允许上传的最大文件大小,字节,为0表示不限(仅对支持的浏览器生效,eg: IE10+、Firefox、Chrome)

            isSlice: false,               //是否启用分片上传，若为true，则isQueryState和isMd5默认为true
            chunkSize: 2 * 1024 * 1024,   //默认分片大小为2MB
            isQueryState:false,           //是否查询文件状态（for 秒传或续传）
            isMd5: false,                 //是否计算上传文件md5值
            isUploadAfterHash:true,       //是否在Hash计算完毕后再上传
            sliceRetryCount:2,            //分片上传失败重试次数

            container:element, //一般无需指定
            getPos:function,   //一般无需指定

            //上传回调事件(function)
            on: {
                init,          //上传管理器初始化完毕后触发
    
                select,        //点击上传按钮准备选择上传文件之前触发,返回false可禁止选择文件
                add[Async],    //添加任务之前触发,返回false将跳过该任务
                upload[Async], //上传任务之前触发,返回false将跳过该任务
                send[Async],   //发送数据之前触发,返回false将跳过该任务
    
                cancel,        //取消上传任务后触发
                remove,        //移除上传任务后触发
    
                progress,      //上传进度发生变化后触发(仅html5模式有效)
                complete       //上传完成后触发
            },

            //UI接口(function),若指定了以下方法,将忽略默认实现
            UI:{
                init,       //执行初始化操作
                draw,       //添加任务后绘制任务界面
                update,     //更新任务界面  
                over        //任务上传完成
            }
        });
    */
        function Uploader(settings) {
            var self = this, ops = settings || {};
            self.guid = ops.guid || "uploader" + ++UPLOADER_GUID;
            self.list = [];
            self.map = {};
            self.index = 0;
            self.started = false;
            self.set(ops)._init();
        }
        Uploader.prototype = {
            //修复constructor指向
            constructor: Uploader,
            set: function(settings) {
                var self = this, ops = extend(settings, self.ops);
                self.url = ops.url;
                //上传路径
                self.dataType = ops.dataType || "json";
                //返回值类型
                self.data = ops.data;
                //上传参数
                //上传按钮
                self.targets = ops.target || [];
                if (!self.targets.forEach) self.targets = [ self.targets ];
                self.target = self.targets[0];
                //当前上传按钮
                //是否以html5(ajax)方式上传
                self.html5 = support_html5_upload && !!def(ops.html5, true);
                //是否允许多选(仅在启用了html5的情形下生效)
                //在html4模式下,input是一个整体,若启用多选,将无法针对单一的文件进行操作(eg:根据扩展名筛选、取消、删除操作等)
                //若无需对文件进行操作,可通过 uploader.multiple = true 强制启用多选(不推荐)
                self.multiple = support_multiple_select && self.html5 && !!def(ops.multiple, true);
                //是否启用click触发文件选择 eg: input.click() => IE9及以下不支持
                self.clickTrigger = support_file_click_trigger && !!def(ops.clickTrigger, true);
                //允许同时上传的数量(html5有效)
                //由于设计原因,html4仅能同时上传1个任务,请不要更改
                self.workerThread = self.html5 ? ops.workerThread || 1 : 1;
                //空闲的线程数量
                self.workerIdle = self.workerThread;
                //是否在添加任务后自动开始
                self.auto = ops.auto !== false;
                //input元素的name属性
                self.upName = ops.upName || "upfile";
                //input元素的accept属性,用来指定浏览器接受的文件类型 eg:image/*,video/*
                //注意：IE9及以下不支持accept属性
                self.accept = ops.accept || ops.allows;
                //是否是文件夹上传，仅Webkit内核浏览器和新版火狐有效
                self.isDir = ops.isDir;
                //允许上传的文件类型（扩展名）,多个之间用逗号隔开 eg:.jpg,.png
                self.allows = split_to_map(ops.allows);
                //禁止上传的文件类型（扩展名）,多个之间用逗号隔开
                self.disallows = split_to_map(ops.disallows);
                //允许上传的最大文件大小,字节,为0表示不限(仅对支持的浏览器生效,eg: IE10+、Firefox、Chrome)
                self.maxSize = +ops.maxSize || 0;
                self.isSlice = !!ops.isSlice;
                //是否启用分片上传
                self.chunkSize = +ops.chunkSize || 2 * 1024 * 1024;
                //分片上传大小
                self.isQueryState = !!def(ops.isQueryState, self.isSlice);
                //是否查询文件状态（for 秒传或续传）
                self.isMd5 = !!def(ops.isMd5, self.isSlice);
                //是否计算上传文件md5值
                self.isUploadAfterHash = ops.isUploadAfterHash !== false;
                //是否在Hash计算完毕后再上传
                self.sliceRetryCount = ops.sliceRetryCount == undefined ? 2 : +ops.sliceRetryCount || 0;
                //分片上传失败重试次数
                //ie9及以下不支持click触发(即使能弹出文件选择框,也无法获取文件数据,报拒绝访问错误)
                //若上传按钮位置不确定(比如在滚动区域内),则无法触发文件选择
                //设置原则:getPos需返回上传按钮距container的坐标
                self.container = ops.container || document.body;
                //函数,获取上传按钮距container的坐标,返回格式 eg:{ left: 100, top: 100 }
                if (ops.getPos) self.getPos = ops.getPos;
                //UI接口,此处将覆盖 prototype 实现
                var UI = ops.UI || {};
                if (UI.init) self.init = UI.init;
                //执行初始化操作
                if (UI.draw) self.draw = UI.draw;
                //添加任务后绘制任务界面
                if (UI.update) self.update = UI.update;
                //更新任务界面  
                if (UI.over) self.over = UI.over;
                //任务上传完成
                //上传回调事件
                self.fns = ops.on || {};
                //上传选项
                self.ops = ops;
                if (self.accept && !self.clickTrigger) self.resetInput();
                return self;
            },
            //初始化上传管理器
            _init: function() {
                var self = this;
                if (self._inited) return;
                self._inited = true;
                var guid = self.guid, container = self.container;
                var boxInput = createEle("div", "upload-input " + guid);
                container.appendChild(boxInput);
                self.boxInput = boxInput;
                //构造html4上传所需的iframe和form
                if (!self.html5) {
                    var iframe_name = "upload_iframe_" + guid;
                    var html = '<iframe class="u-iframe" name="' + iframe_name + '"></iframe>' + '<form class="u-form" action="" method="post" enctype="multipart/form-data" target="' + iframe_name + '"></form>';
                    var boxHtml4 = createEle("div", "upload-html4 " + guid, html);
                    container.appendChild(boxHtml4);
                    var iframe = getFirst(boxHtml4), form = getLast(boxHtml4);
                    self.iframe = iframe;
                    self.form = form;
                    //html4上传完成回调
                    bind_iframe_load(iframe, function() {
                        if (self.workerIdle != 0) return;
                        var text;
                        try {
                            text = iframe.contentWindow.document.body.innerHTML;
                        } catch (e) {}
                        self.complete(undefined, UPLOAD_STATE_COMPLETE, text);
                    });
                }
                self.targets.forEach(function(target) {
                    if (self.clickTrigger) {
                        addEvent(target, "click", function(e) {
                            if (self.fire("select", e) === false) return;
                            self.resetInput();
                            //注意:ie9及以下可以弹出文件选择框,但获取不到选择数据,拒绝访问。
                            triggerEvent(self.inputFile, "click");
                        });
                    } else {
                        addEvent(target, "mouseover", function(e) {
                            self.target = this;
                            self.updatePos();
                        });
                    }
                });
                //html4点击事件
                if (!self.clickTrigger) {
                    addEvent(boxInput, "click", function(e) {
                        if (self.fire("select", e) === false) stopEvent(e);
                    });
                    setOpacity(boxInput, 0);
                    self.resetInput();
                }
                self.fire("init");
                return self.run("init");
            },
            //重置上传控件
            resetInput: function() {
                var self = this, boxInput = self.boxInput;
                if (!boxInput) return self;
                boxInput.innerHTML = '<input type="file" name="' + self.upName + '"' + (self.accept ? 'accept="' + self.accept + '"' : "") + (self.isDir ? 'webkitdirectory=""' : "") + ' style="' + (self.clickTrigger ? "visibility: hidden;" : "font-size:100px;") + '"' + (self.multiple ? ' multiple="multiple"' : "") + ">";
                var inputFile = getFirst(boxInput);
                //文件选择事件
                addEvent(inputFile, "change", function(e) {
                    self.add(this);
                    //html4 重置上传控件
                    if (!self.html5) self.resetInput();
                });
                self.inputFile = inputFile;
                return self.updatePos();
            },
            //更新上传按钮坐标(for ie)
            updatePos: function(has_more_uploader) {
                var self = this;
                if (self.clickTrigger) return self;
                var getPos = self.getPos || getOffset, boxInput = self.boxInput, inputFile = getFirst(boxInput), target = self.target, inputWidth = target.offsetWidth, inputHeight = target.offsetHeight, pos = inputWidth == 0 ? {
                    left: -1e4,
                    top: -1e4
                } : getPos(target);
                boxInput.style.width = inputFile.style.width = inputWidth + "px";
                boxInput.style.height = inputFile.style.height = inputHeight + "px";
                boxInput.style.left = pos.left + "px";
                boxInput.style.top = pos.top + "px";
                //多用于选项卡切换中上传按钮位置重复的情况
                if (has_more_uploader) boxInput.style.zIndex = ++UPLOAD_HTML4_ZINDEX;
                return self;
            },
            //触发ops上定义的回调方法,优先触发异步回调(以Async结尾)
            fire: function(action, arg, callback) {
                if (!callback) return fire(this.fns[action], this, arg);
                var asyncFun = this.fns[action + "Async"];
                if (asyncFun) return fire(asyncFun, this, arg, callback);
                callback(fire(this.fns[action], this, arg));
            },
            //运行内部方法或扩展方法(如果存在)
            run: function(action, arg) {
                var fn = this[action];
                if (fn) fire(fn, this, arg);
                return this;
            },
            //添加一个上传任务
            addTask: function(input, file) {
                if (!input && !file) return;
                var name, size;
                if (file) {
                    name = file.webkitRelativePath || file.name || file.fileName;
                    size = file.size === 0 ? 0 : file.size || file.fileSize;
                } else {
                    name = get_last_find(input.value, "\\").slice(1) || input.value;
                    size = -1;
                }
                var self = this, ext = get_last_find(name, ".").toLowerCase(), limit_type;
                if (self.disallows && self.disallows[ext] || self.allows && !self.allows[ext]) limit_type = "ext"; else if (size != -1 && self.maxSize && size > self.maxSize) limit_type = "size";
                var task = {
                    id: ++UPLOAD_TASK_GUID,
                    name: name,
                    ext: ext,
                    size: size,
                    input: input,
                    file: file,
                    state: limit_type ? UPLOAD_STATE_SKIP : UPLOAD_STATE_READY
                };
                if (limit_type) {
                    task.limited = limit_type;
                    task.disabled = true;
                }
                self.fire("add", task, function(result) {
                    if (result === false || task.disabled || task.limited) return;
                    task.index = self.list.length;
                    self.list.push(task);
                    self.map[task.id] = task;
                    self.run("draw", task);
                    if (self.auto) self.start();
                });
                return task;
            },
            //添加上传任务,自动判断input(是否多选)或file
            add: function(input_or_file) {
                var self = this;
                if (input_or_file.tagName == "INPUT") {
                    var files = input_or_file.files;
                    if (files) {
                        for (var i = 0, len = files.length; i < len; i++) {
                            self.addTask(input_or_file, files[i]);
                        }
                    } else {
                        self.addTask(input_or_file);
                    }
                } else {
                    self.addTask(undefined, input_or_file);
                }
            },
            //批量添加上传任务
            addList: function(list) {
                for (var i = 0, len = list.length; i < len; i++) {
                    this.add(list[i]);
                }
            },
            //获取指定任务
            get: function(taskId) {
                if (taskId != undefined) return this.map[taskId];
            },
            //取消上传任务
            //onlyCancel: 若为true,则仅取消上传而不触发任务完成事件
            cancel: function(taskId, onlyCancel) {
                var self = this, task = self.get(taskId);
                if (!task) return;
                var state = task.state;
                //若任务已完成,直接返回
                if (state != UPLOAD_STATE_READY && state != UPLOAD_STATE_PROCESSING) return self;
                if (state == UPLOAD_STATE_PROCESSING) {
                    //html5
                    var xhr = task.xhr;
                    if (xhr) {
                        xhr.abort();
                        //无需调用complete,html5 有自己的处理,此处直接返回
                        return self;
                    }
                    //html4
                    self.iframe.contentWindow.location = "about:blank";
                }
                return onlyCancel ? self : self.complete(task, UPLOAD_STATE_CANCEL);
            },
            //移除任务
            remove: function(taskId) {
                var task = this.get(taskId);
                if (!task) return;
                if (task.state == UPLOAD_STATE_PROCESSING) this.cancel(taskId);
                //this.list.splice(task.index, 1);
                //this.map[task.id] = undefined;
                //从数组中移除任务时,由于任务是根据index获取,若不处理index,将导致上传错乱甚至不能上传
                //此处重置上传索引,上传时会自动修正为正确的索引(程序会跳过已处理过的任务)
                //this.index = 0;
                //添加移除标记(用户可以自行操作,更灵活)
                task.deleted = true;
                this.fire("remove", task);
            },
            //开始上传
            start: function() {
                var self = this, workerIdle = self.workerIdle, list = self.list, index = self.index, count = list.length;
                if (!self.started) self.started = true;
                if (count <= 0 || index >= count || workerIdle <= 0) return self;
                var task = list[index];
                self.index++;
                return self.upload(task);
            },
            //上传任务
            upload: function(task) {
                var self = this;
                if (!task || task.state != UPLOAD_STATE_READY || task.skip || task.deleted) return self.start();
                task.url = self.url;
                self.workerIdle--;
                self.fire("upload", task, function(result) {
                    if (result === false) return self.complete(task, UPLOAD_STATE_SKIP);
                    if (self.html5 && task.file) self._upload_html5_ready(task); else if (task.input) self._upload_html4(task); else self.complete(task, UPLOAD_STATE_SKIP);
                });
                return self;
            },
            _process_xhr_headers: function(xhr) {
                var ops = this.ops;
                //设置http头(必须在 xhr.open 之后)
                var fn = function(k, v) {
                    xhr.setRequestHeader(k, v);
                };
                if (global_settings.headers) Object.forEach(global_settings.headers, fn);
                if (ops.headers) Object.forEach(ops.headers, fn);
            },
            //根据 task.hash 查询任务状态（for 秒传或续传）
            queryState: function(task, callback) {
                var self = this, url = self.url, xhr = new XMLHttpRequest();
                var params = [ "action=query", "hash=" + (task.hash || encodeURIComponent(task.name)), "fileName=" + encodeURIComponent(task.name) ];
                if (task.size != -1) params.push("fileSize=" + task.size);
                self._process_params(task, function(k, v) {
                    params.push(encodeURIComponent(k) + "=" + (v != undefined ? encodeURIComponent(v) : ""));
                }, "dataQuery");
                task.queryUrl = url + (url.indexOf("?") == -1 ? "?" : "&") + params.join("&");
                //秒传查询事件
                self.fire("sliceQuery", task);
                xhr.open("GET", task.queryUrl);
                self._process_xhr_headers(xhr);
                xhr.onreadystatechange = function() {
                    if (xhr.readyState != 4) return;
                    var responseText, json;
                    if (xhr.status >= 200 && xhr.status < 400) {
                        responseText = xhr.responseText;
                        if (responseText === "ok") json = {
                            ret: 1
                        }; else if (responseText) json = parseJSON(responseText);
                        if (!json || typeof json == "number") json = {
                            ret: 0,
                            start: json
                        };
                        task.response = responseText;
                        task.json = json;
                        if (json.ret == 1) {
                            task.queryOK = true;
                            self.cancel(task.id, true).complete(task, UPLOAD_STATE_COMPLETE);
                        } else {
                            var start = +json.start || 0;
                            if (start != Math.floor(start)) start = 0;
                            task.sliceStart = start;
                        }
                    }
                    fire(callback, self, xhr);
                };
                xhr.onerror = function() {
                    fire(callback, self, xhr);
                };
                xhr.send(null);
                return self;
            },
            //处理html5上传（包括秒传和断点续传）
            _upload_html5_ready: function(task) {
                var self = this;
                //上传处理
                var goto_upload = function() {
                    if (task.state == UPLOAD_STATE_COMPLETE) return;
                    if (self.isSlice) self._upload_slice(task); else self._upload_html5(task);
                };
                var after_hash = function(callback) {
                    //自定义hash事件
                    self.fire("hash", task, function() {
                        if (task.hash && self.isQueryState && task.state != UPLOAD_STATE_COMPLETE) self.queryState(task, callback); else callback();
                    });
                };
                //计算文件hash
                var compute_hash = function(callback) {
                    //计算上传文件md5值
                    if (self.isMd5 && md5File) {
                        var hashProgress = self.fns.hashProgress;
                        md5File(task.file, function(md5, time) {
                            task.hash = md5;
                            task.timeHash = time;
                            after_hash(callback);
                        }, function(pvg) {
                            fire(hashProgress, self, task, pvg);
                        });
                    } else {
                        after_hash(callback);
                    }
                };
                if (self.isUploadAfterHash) {
                    compute_hash(goto_upload);
                } else {
                    goto_upload();
                    compute_hash();
                }
                return self;
            },
            //处理上传参数
            _process_params: function(task, fn, prop) {
                prop = prop || "data";
                if (global_settings.data) Object.forEach(global_settings.data, fn);
                if (this.data) Object.forEach(this.data, fn);
                if (task && task[prop]) Object.forEach(task[prop], fn);
            },
            //以html5的方式上传任务
            _upload_html5: function(task) {
                var self = this, xhr = new XMLHttpRequest();
                task.xhr = xhr;
                xhr.upload.addEventListener("progress", function(e) {
                    self.progress(task, e.total, e.loaded);
                }, false);
                xhr.addEventListener("load", function(e) {
                    self.complete(task, UPLOAD_STATE_COMPLETE, e.target.responseText);
                }, false);
                xhr.addEventListener("error", function() {
                    self.complete(task, UPLOAD_STATE_ERROR);
                }, false);
                xhr.addEventListener("abort", function() {
                    self.complete(task, UPLOAD_STATE_CANCEL);
                }, false);
                var fd = new FormData();
                //处理上传参数
                self._process_params(task, function(k, v) {
                    fd.append(k, v);
                });
                // fd.append("fileName", task.name);
                fd.append(self.upName, task.blob || task.file, task.name);
                xhr.open("POST", task.url);
                self._process_xhr_headers(xhr);
                //移除自定义标头,以防止跨域上传被拦截
                //xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
                self.fire("send", task, function(result) {
                    if (result === false) return self.complete(task, UPLOAD_STATE_SKIP);
                    xhr.send(fd);
                    self._afterSend(task);
                });
            },
            //以传统方式上传任务
            _upload_html4: function(task) {
                var self = this, form = self.form, input = task.input;
                //解决多选的情况下重复上传的问题(即使如此，仍然不建议html4模式下开启多选)
                if (input._uploaded) return self.complete(task, UPLOAD_STATE_COMPLETE);
                input._uploaded = true;
                input.name = self.upName;
                form.innerHTML = "";
                form.appendChild(input);
                form.action = task.url;
                //处理上传参数
                self._process_params(task, function(k, v) {
                    form.appendChild(parseHTML('<input type="hidden" name="' + k + '" value="' + v + '">'));
                });
                self.fire("send", task, function(result) {
                    if (result === false) return self.complete(task, UPLOAD_STATE_SKIP);
                    form.submit();
                    self._afterSend(task);
                });
            },
            //已开始发送数据
            _afterSend: function(task) {
                task.lastTime = task.startTime = Date.now();
                task.state = UPLOAD_STATE_PROCESSING;
                this._lastTask = task;
                this.progress(task);
            },
            //更新进度显示
            progress: function(task, total, loaded) {
                if (!total) total = task.size;
                if (!loaded || loaded < 0) loaded = 0;
                var state = task.state || UPLOAD_STATE_READY;
                if (loaded > total) loaded = total;
                if (loaded > 0 && state == UPLOAD_STATE_READY) task.state = state = UPLOAD_STATE_PROCESSING;
                var completed = state == UPLOAD_STATE_COMPLETE;
                if (completed) total = loaded = task.size;
                //计算上传速度
                set_task_speed(task, total, loaded);
                task.total = total;
                task.loaded = loaded;
                this.fire("progress", task);
                this.run("update", task);
            },
            //处理响应数据
            _process_response: function(task, responseText) {
                task.response = responseText;
                if (!responseText) return;
                if (this.dataType == "json") task.json = parseJSON(responseText);
            },
            //完成上传
            complete: function(task, state, responseText) {
                var self = this;
                if (!task && self.workerThread == 1) task = self._lastTask;
                if (task) {
                    if (state != undefined) task.state = state;
                    if (task.state == UPLOAD_STATE_PROCESSING || state == UPLOAD_STATE_COMPLETE) {
                        task.state = UPLOAD_STATE_COMPLETE;
                        self.progress(task, task.size, task.size);
                    }
                    if (responseText !== undefined) self._process_response(task, responseText);
                }
                self.run("update", task).run("over", task);
                if (state == UPLOAD_STATE_CANCEL) self.fire("cancel", task);
                self.fire("complete", task);
                self.workerIdle++;
                if (self.started) self.start();
                return self;
            }
        };
        //扩展上传管理器
        //forced:是否强制覆盖
        Uploader.extend = function(source, forced) {
            extend(Uploader.prototype, source, forced);
        };
        //---------------------- export ----------------------
        detect();
        extend(Uploader, {
            support: {
                html5: support_html5_upload,
                multiple: support_multiple_select
            },
            READY: UPLOAD_STATE_READY,
            PROCESSING: UPLOAD_STATE_PROCESSING,
            COMPLETE: UPLOAD_STATE_COMPLETE,
            SKIP: UPLOAD_STATE_SKIP,
            CANCEL: UPLOAD_STATE_CANCEL,
            ERROR: UPLOAD_STATE_ERROR,
            //UI对象,用于多套UI共存
            UI: {},
            //默认语言
            Lang: {
                status_ready: "准备中",
                status_processing: "上传中",
                status_complete: "已完成",
                status_skip: "已跳过",
                status_cancel: "已取消",
                status_error: "已失败"
            },
            setup: setup,
            getStatusText: get_upload_status_text
        });
        Q.Uploader = Uploader;
    })(window);
});

define("dist/upload/template/list.html", [], '{{each uploadFiles as value i}}\n<li class="doc-li" index="{{i}}">\n    <span class="doc-unit">{{i+1}}</span>\n    <div class="operation">\n        <div class="doc-info succ {{value.uploadStatus ==1?\'\':\'displayNone\'}}" ><i class="icon-info icon-ok"></i>上传成功</div>\n        <div class="doc-info uploading {{value.uploadStatus ==1?\'displayNone\':value.uploadStatus ==2?\'displayNone\':\'\'}}" ><p class="doc-info-wait">上传中...</p></div>\n        <div class="doc-info fail {{value.uploadStatus ==2?\'\':\'displayNone\'}}" ><i class="icon-info icon-wrong"></i><p class="wrong-text">上传失败<!-- <a class="wrong-link">重试</a> --></p></div>\n        <a href="javascript:;" class="doc-delete js-delete" title="删除" index="{{i}}"></a>\n    </div>\n    <div class="doc-top-tt cf">\n        <div class="doc-mid cf">\n            <i class="data-checked {{value.checked?\'checked-active\':\'\'}}"></i>\n            <div class="fl" style="width:492px">\n                <div class="data-must">\n                    <span class="stars-txt">*</span>\n                    <span class="lable-name">标题:</span>\n                    <div class="data-name">\n                        <i class="ico-data ico-{{value.ext}}"></i>\n                        <input type="text" maxlength="64" class="data-input" name="fileName" value="{{value.fileName}}" index="{{i}}" >\n                    </div>\n                    <div class="warn-tip">\n                        <span>标题字数不能超过36个字</span>\n                    </div>\n                </div>\n                <div class="mt22">\n                    <div class="data-must  select-w89 select-type fl ">\n                        <span class="stars-txt">*</span>\n                        <span class="lable-name js-type">类型:</span>\n                        <div class="date-btn categoryLength js-type">\n                            <em></em>\n                            <p class="choose-text"><i>{{value.userFileType==1?\'免费资料\':\'付费资料\'}}</i></p>\n                        </div>\n                        <!-- <span class="selected-text">\n                            <em>公开资料</em>\n                            <i></i>\n                        </span> -->\n                        <ul class="select-list permin">\n                            <li>\n                                <a class="selected" permin="1">免费资料</a>\n                                <a  permin="5">付费资料</a>\n                            </li>\n                        </ul>\n                        \n                        <p class="sell-item-info">什么是 <a target="_blank" class="sell-link" href="https://iask.sina.com.cn/helpCenter/5d2837610cf2b0a59eac33a3.html">优享资料</a>?</p>\n                    </div>\n                    <div class="data-must  select-monney {{value.userFileType==1?\'displayNone\':\'\'}} js-need-money fl ml18" style="">\n                        <span class="stars-txt">*</span>\n                        <span class="lable-name">定价:</span>\n                        <div class="date-btn definePrice js-price">\n                            <em></em>\n                            <p class="choose-text moneyTitle"><i>{{value.definePrice?\'自定义\':value.userFilePrice?\'¥\'+value.userFilePrice:\'选择售价\'}}</i></p>\n                        </div>\n                        <ul class="select-list money" style="">\n                            <li>\n                                <a aval="4.9">¥4.9</a>\n                                <a aval="9.9">¥9.9</a>\n                                <a aval="14.9">¥14.9</a>\n                                <a aval="24.9">¥24.9</a>\n                                <a aval="29.9">¥29.9</a>\n                                <a aval="39.9">¥39.9</a>\n                                <a aval="49.9">¥49.9</a>\n                                <a aval="0" class="money-price_select-ele" >自定义</a>\n                            </li>\n                        </ul>\n                        <!--未选择提示 -->\n                        <span class="price-error" style="display: none;">请选择售价</span>\n                        <span class="momey-wanning {{value.definePrice?\'\':\'displayNone\'}}" name="money-wanning" >*使用自定义价格需<br>要审核通过后才生效</span>\n                        <a class="pay-item-info {{value.definePrice?\'displayNone\':\'\'}}"  target="_blank" href="https://static3.iask.cn/help/%E7%88%B1%E9%97%AE%E4%BB%B7%E6%A0%BC%E8%A7%84%E8%8C%83%E5%8F%82%E8%80%83.pdf" ><i class="icon-wen"></i>定价参考</a>\n                    </div>\n                    <div class="doc-pay-input fl ml18  js-input-money {{value.userFileType==1?\'displayNone\':value.definePrice?\'\':\'displayNone\'}}" style="">\n                        <input type="number" autocomplete="off" class="data-input "  autocomplete="off" placeholder="输入金额" name="moneyPrice"  value="{{value.userFilePrice==\'0\'?\'\':value.userFilePrice}}">\n                        <div class="select-item-info" class="moneyPriceTips">请输入售价</div>\n                    </div>\n\n                    <div class="trial-input fl js-need-money {{value.userFileType==1?\'displayNone\':\'\'}} ml18" style="">\n                        <input type="number" autocomplete="off" class="data-input" placeholder="试读页数" maxlength="4" name="preRead" value="{{value.preRead}}">\n                    </div>\n                </div>\n            </div>\n            <div class="fl rightPart">\n                <div class="clearBoth">\n                    <div class="data-must fl">\n                        <span class="stars-txt">*</span>\n                        <span class="lable-name">分类:</span>\n                        <div class="date-btn js-fenlei" style="width:210px;">\n                            <em></em>\n                            <p class="choose-text fenleiTtile"><i>{{value.fenlei?value.fenlei:\'选择分类\'}}</i></p>\n                        </div>\n                        <div class="date-con fenlei">\n                            <div class="date-con-in" >\n                                <ul class="date-con-first">\n                                    {{each Allcategory as item index}}\n                                    <li>\n                                        <a href="javascript:;" cid="{{item.id}}" last="{{item.last}}" name ="{{item.name}}">{{item.name}}</a>\n                                        <ul class="date-con-sec"  style="display: none;">\n                                            {{if item.categoryList}}\n                                            {{each item.categoryList as ctn num}}\n                                            <li >\n                                                    <a href="javascript:;" cid="{{ctn.id}}" last="{{ctn.last}}" name ="{{ctn.name}}">{{ctn.name}}</a>\n                                                    <ul class="date-con-third" style="display: none;">\n                                                        {{if ctn.categoryList}}\n                                                        {{each ctn.categoryList as item3 index3}}\n                                                        <li  ><a href="javascript:;" last="{{item3.last}}" cid="{{item3.id}}" name ="{{item3.name}}">{{item3.name}}</a></li>\n                                                        {{/each}}\n                                                        {{/if}}\n                                                    </ul>\n                                            </li>\n                                            {{/each}}\n                                            {{/if}}\n                                        </ul>\n                                    </li>\n                                    {{/each}}\n                                </ul>\n                            </div>\n                        </div>\n                        <!--未选择提示 -->\n                        <span class="must-error" style="display: none;">请选择分类</span>\n                    </div>\n                    <div class="data-must fl ml18">\n                        <span class="stars-txt">*</span>\n                        <span class="lable-name">保存到:</span>\n                        <span style="margin-left: 50px;width: 100px;" class="selected-text date-btn  js-folder-hook">\n                            <em></em>\n                            <p>{{value.folderName?value.folderName:\'选择保存至\'}}</p>\n                        </span>\n                        <ul class="select-list folder">\n                            <li>\n                                <span class="new-built js-folder-new" title="新建文件夹">新建文件夹</span>\n                                {{each folders as foldItem foldIndex}}\n                                    <span class="new-built js-folder-item" id =\'{{foldItem.id}}\' name =\'{{foldItem.name}}\'   title="新建文件夹">{{foldItem.name}}</span>\n                                {{/each}}\n                                <!-- <jsp:include page="folderTree.jsp"></jsp:include> -->\n                            </li>\n                        </ul>\n                        <span class="folder-error" style="display: none;">请选择保存文件夹</span>\n                    </div>\n                </div>\n                <div class="doc-down-con mt22">\n                    <div class="data-must">\n                        <!-- <span class="stars-txt">*</span> -->\n                        <span class="lable-name">简介:</span>\n                        <div class="down-inter cf">\n                            <div class="doc-describe fl">\n                                <textarea class="doc-text-area js-text-area" placeholder="请填写资料简介、概况或使用方法，有助提升资料的曝光率、购买率" maxlength="200">{{value.description}}</textarea>\n                                <p class="num-con"><em>0</em>/200</p>\n                            </div>\n                            <!-- <div class="doc-trial-con">\n                                <div class="doc-trial-input fl"><input type="text" class="data-input" placeholder="设置试读页数" name="preRead" maxlength="4" value=""></div>\n                            </div> -->\n                        </div>\n                    </div>\n                   \n                </div>\n            </div>\n            \n            <!-- <div class="select-item select-w89 select-pay fl ml10">\n                <span class="selected-text">\n                    <em>选择售价</em>\n                    <i></i>\n                </span>\n                <ul class="select-list score">\n                    <li>\n                        <a aval="0">免积分</a>\n                        <a aval="1">1积分</a>\n                        <a aval="5">5积分</a>\n                        <a aval="9">9积分</a>\n                        <a aval="13">13积分</a>\n                        <a aval="17">17积分</a>\n                        <a aval="21">21积分</a>\n                    </li>\n                </ul>\n                <p class="select-item-info">请选择售价</p>\n            </div> -->\n        </div>\n        <div class="doc-info err" style="display:none;"><i class="icon-info icon-error"></i><span>建议您结合文档正文完善资料标题信息<span></div>\n    </div>\n</li>\n{{/each}}');

define("dist/upload/template/list_pravite.html", [], '{{each uploadFiles as value i}}\n<li class="doc-li" index="{{i}}">\n    <span class="doc-unit">{{i+1}}</span>\n    <div class="operation">\n        <div class="doc-info succ {{value.uploadStatus ==1?\'\':\'displayNone\'}}" ><i class="icon-info icon-ok"></i>上传成功</div>\n        <div class="doc-info uploading {{value.uploadStatus ==1?\'displayNone\':value.uploadStatus ==2?\'displayNone\':\'\'}}" ><p class="doc-info-wait">上传中...</p></div>\n        <div class="doc-info fail {{value.uploadStatus ==2?\'\':\'displayNone\'}}" ><i class="icon-info icon-wrong"></i><p class="wrong-text">上传失败<!-- <a class="wrong-link">重试</a> --></p></div>\n        <a href="javascript:;" class="doc-delete js-delete" title="删除" index="{{i}}"></a>\n    </div>\n    <div class="doc-top-tt cf">\n        <div class="doc-mid cf">\n            <i class="data-checked {{value.checked?\'checked-active\':\'\'}}"></i>\n            <div class="fl" style="width:400px">\n                <div class="data-must">\n                    <span class="stars-txt">*</span>\n                    <span class="lable-name">标题:</span>\n                    <div class="data-name">\n                        <i class="ico-data ico-{{value.ext}}"></i>\n                        <input type="text" class="data-input" name="fileName" value="{{value.fileName}}" index="{{i}}" >\n                    </div>\n                    <div class="warn-tip">\n                        <span>标题字数不能超过36个字</span>\n                    </div>\n                </div>\n            </div>\n            <div class="fl rightPart">\n                <div class="clearBoth">\n                    <div class="data-must fl ml18">\n                        <span class="stars-txt">*</span>\n                        <span class="lable-name">保存到:</span>\n                        <span style="margin-left: 50px;width: 100px;" class="selected-text date-btn  js-folder-hook">\n                            <em></em>\n                            <p>{{value.folderName?value.folderName:\'选择保存至\'}}</p>\n                        </span>\n                        <ul class="select-list folder">\n                            <li>\n                                <span class="new-built js-folder-new" title="新建文件夹">新建文件夹</span>\n                                {{each folders as foldItem foldIndex}}\n                                    <span class="new-built js-folder-item" id =\'{{foldItem.id}}\' name =\'{{foldItem.name}}\'   title="新建文件夹">{{foldItem.name}}</span>\n                                {{/each}}\n                                <!-- <jsp:include page="folderTree.jsp"></jsp:include> -->\n                            </li>\n                        </ul>\n                        <span class="folder-error" style="display: none;">请选择保存文件夹</span>\n                    </div>\n                </div>\n            </div>\n        </div>\n        <div class="doc-info err" style="display:none;"><i class="icon-info icon-error"></i><span>建议您结合文档正文完善资料标题信息<span></div>\n    </div>\n</li>\n{{/each}}');
