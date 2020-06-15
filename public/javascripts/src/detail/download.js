define(function (require, exports, module) {
    // var $ = require("$");
    var method = require("../application/method");
    require("../cmd-lib/myDialog");
    require("../cmd-lib/toast");
    require("../cmd-lib/loading");
    var utils = require("../cmd-lib/util");
    var gioInfo = require("../cmd-lib/gioInfo");
    var common = require('./common');
    var login = require('../application/checkLogin');
    var api = require('../application/api');
    var downLoadReport = $.extend({}, gioData);   // init.js 中引入的 report中在 window上挂载了 gioData 
    var ref = utils.getPageRef(window.pageConfig.params.g_fileId);      //用户来源
    var expendScoreNum_var = '';    //用户下载文档成功后消耗的积分数量
    var expendNum_var = '';         //用户下载文档成功后消耗下载券、下载特权或现金的数量
    var fid = window.pageConfig.params.g_fileId; // 文件id
    var tpl_android = $("#tpl-down-android").html();    //下载app  项目全局 没有 这个 classId
    var  file_title = window.pageConfig.params.file_title
    //详情页异常信息提示弹框
    var $tpl_down_text = $("#tpl-down-text");    // 在 详情index.html中引入的 dialog.html 用有  一些弹框模板
    // 文档已下载
    var $tpl_down_finished = $('#tpl-down-finished');
    // 是vip
    var $integral_download_vip = $('#integral-download-vip');
    // 非vip
    var $integral_download_normal = $('#integral-download-normal');
    //下载券下载 vip
    var $volume_download_vip = $('#volume-download-vip');
    //下载券下载 普通用户
    var $volume_download_normal = $('#volume-download-normal');

    var $have_privilege = $('#have_privilege');
    // vip专享下载--扣除下载特权
    var $permanent_privilege = $('#permanent_privilege');
    // 扣除下载特权--但不够扣
    var $permanent_privilege_not = $('#permanent_privilege_not');
    // vip 免费下载次数达上限提醒
    var $vipFreeDownCounts   =$('#vipFreeDownCounts');
    // 非VIP 免费下载次数达上限提醒
    var $freeDownCounts   =$('#freeDownCounts');
    //
    // 弹窗加入VIP
    var $download_join_vip = $('#download-join-vip');

    var userData = null;


    downLoadReport.docPageType_var = pageConfig.page.ptype;
    downLoadReport.fileUid_var = pageConfig.params.file_uid;

    //下载跳转公用
    var publicDownload = function () {
        method.delCookie("event_data_down", "/");
        if (window.pageConfig.page.isDownload === 'n') {
            return;
        }
         // 文件预下载
        // filePreDownLoad: router + '/action/downloadCheck',
        method.get(api.normalFileDetail.filePreDownLoad + '?fid=' + fid, function (res) {
            if (res.code == 0) {
                //阻塞下载gio上报
                bouncedType(res);
                docDLFail(res.data.status);
                // 42000  42001 42002  私有文件禁止下载 ,文件禁止下载,下载过于频繁,您已被限制下载，
            } else if (res.code == 42000 || res.code == 42001 || res.code == 42002 || res.code == 42003) {
                $("#dialog-box").dialog({
                    html: $tpl_down_text.html().replace(/\$msg/, res.msg),
                }).open();
            } else if (res.code == 40001) {
                login.notifyLoginInterface(function (data) {
                    userData = data;
                });
            } else if (res.code == 42011) {
                method.compatibleIESkip("/pay/vip.html",true);
            } else {
                $("#dialog-box").dialog({
                    html: $tpl_down_text.html().replace(/\$msg/, res.msg),
                }).open();
            }
        }, '')
    };

    //上报数据处理-下载成功
    var docDLSuccess = function (consume, flag) {
        //消费类型
        downLoadReport.expendType_var = gioInfo.downloadConsumeMap[consume];

        //如果不是下载过添加这2个字段
        if (flag) {
            //消耗的积分数量
            downLoadReport.expendScoreNum_var = expendScoreNum_var;
            //消耗的消耗下载券数量
            downLoadReport.expendNum_var = expendNum_var;
        }

        //防止上报字段错误
        if (downLoadReport.downloadLimited_var) {
            delete downLoadReport.downloadLimited_var
        }

        __pc__.gioTrack("docDLSuccess", downLoadReport);
    };

    //上报数据处理-下载受限
    var docDLFail = function (status) {
        if (gioInfo.downloadLimitedCodeMap[status]) {
            downLoadReport.downloadLimited_var = gioInfo.downloadLimitedCodeMap[status];
            __pc__.gioTrack("docDLFail", downLoadReport);
        }
    };
   
    var bouncedType = function (res) { //屏蔽下载的 后台返回 文件不存在需要怎么提示
        // productType		int	商品类型 1：免费文档，3 在线文档 4 vip特权文档 5 付费文档 6 私有文档
        // productPrice		long	商品价格 > 0 的只有 vip特权 个数,和 付费文档 金额 单位元
        var $dialogBox = $("#dialog-box");
        fid = window.pageConfig.params.g_fileId;
        switch (res.data.checkStatus) {
            // 下载
            case 0:   // 原来 status 100
                var browserEnv = method.browserType();
                method.delCookie("event_data_down", "/");
                if (res.data.score > 0) {
                    expendScoreNum_var = res.data.score * 1;
                } else if (res.data.volume > 0) {
                    expendNum_var = res.data.volume * 1;
                } else if (window.pageConfig.params.file_volume > 0 && res.data.privilege > 0) {//消耗下载特权数量
                    expendNum_var = 1;
                }
                docDLSuccess(res.data.consume, true);
                if (browserEnv === 'IE' || browserEnv === 'Edge') {
                    // window.location.href = res.data.downloadURL;
                    method.compatibleIESkip(res.data.fileDownUrl,false);
                } else if (browserEnv === 'Firefox') {
                    // window.location.href = decodeURIComponent(res.data.downloadURL);
                    var fileDownUrl = res.data.fileDownUrl;
                    var sub = fileDownUrl.lastIndexOf('&fn=');
                    var sub_url1 = fileDownUrl.substr(0, sub + 4);
                    var sub_ur2 = decodeURIComponent(fileDownUrl.substr(sub + 4, fileDownUrl.length));
                    var fid = window.pageConfig.params.g_fileId;
                    // window.location.href = sub_url1 + sub_ur2;
                    method.compatibleIESkip(sub_url1 + sub_ur2,false);
                    var url = '/node/f/downsucc.html?fid=' + fid + '&url=' + encodeURIComponent(res.data.fileDownUrl);
                    goNewTab(url);
                } else {
                    // window.location.href = res.data.downloadURL;
                    // method.compatibleIESkip(res.data.fileDownUrl,false);
                    var fid = window.pageConfig.params.g_fileId;
                    var url = '/node/f/downsucc.html?fid=' + fid + '&title='+ encodeURIComponent(file_title) +  '&url=' + encodeURIComponent(res.data.fileDownUrl);
                    goNewTab(url);
                }
                break;
            
           
                
            // 已下载过    
            // case 7:
            //     downLoad(res.data.status);
            //     break;
            // 原来判断通过    
            // case 0:
            //     downLoad();
            //     break;
            // 超过了当日下载阈值,
            // 资料是付费，用户未购买
            case 8:
                // goPage(res)
                var fid = window.pageConfig.params.g_fileId;
                var format = window.pageConfig.params.file_format;
                var title = window.pageConfig.params.file_title;
                var params = '';
                var ref = utils.getPageRef(fid);
                //文件信息存入cookie方便gio上报
                method.setCookieWithExpPath('rf', JSON.stringify(gioPayDocReport), 5 * 60 * 1000, '/');
                method.setCookieWithExp('f', JSON.stringify({ fid: fid, title: title, format: format }), 5 * 60 * 1000, '/');
                params = '?orderNo=' + fid + '&checkStatus='+ res.data.checkStatus + '&referrer=' + document.referrer;
                // window.location.href = "/pay/payConfirm.html" + params;
                method.compatibleIESkip("/pay/payConfirm.html" + params,false);
                break;
            case 1:
                // $dialogBox.dialog({
                //     html: $tpl_down_text.html().replace(/\$msg/, '您已经超过了当日下载量')
                // }).open();
                // break;
                var ui = method.getCookie('ui')?JSON.parse(decodeURIComponent(method.getCookie('ui'))):{isVip:''}
                if (ui.isVip === '1') {
                            $("#dialog-box").dialog({
                                html: $vipFreeDownCounts.html(),
                            }).open();
                        }else {
                            $("#dialog-box").dialog({
                                html: $freeDownCounts.html(),
                            }).open();
                        }
                        break;
            // 下载过于频繁
            case 2:
                $dialogBox.dialog({
                    html: $tpl_down_text.html().replace(/\$msg/, '您当日下载过于频繁,一分钟后再下载')
                }).open();
                break;
            // 下载券不足并且积分也不足
            // case 3:
            //     var fid = window.pageConfig.params.g_fileId;
            //     var state = window.pageConfig.params.file_state;
            //     var isVip = window.pageConfig.params.isVip;
            //     var showTips = 0;
            //     if ((state == 5 || state == 6) && isVip == 0) {//专享资料 非vip用户
            //         showTips = 1;
            //     } else if (state == 2 && isVip == 0) {//下载券资料 非vip用户
            //         showTips = 2;
            //     }
            //     var format = window.pageConfig.params.file_format;
            //     var title = window.pageConfig.params.file_title;
            //     method.setCookieWithExp('f', JSON.stringify({ fid: fid, title: title, format: format }), 5 * 60 * 1000, '/');
            //     var params = '?fid=' + fid + '&ft=' + format + '&name=' + encodeURIComponent(encodeURIComponent(title)) + '&ref=' + ref + '&showTips=' + showTips;
            //     var url = '/pay/vip.html' + params;
            //     if (userData.isVip === '1') {
            //         url = '/pay/privilege.html?fid=' + fid + '&ref=' + ref;
            //     }
            //     goLocalTab(url);
            //     break;
            // 下载券不足并且积分充足  积分兑换下载
            // case 4:
            //     if (userData.isVip === '1') {
            //         $dialogBox.dialog({
            //             html: $integral_download_vip.html().replace(/\$volume/, res.data.volume)
            //                 .replace(/\$title/, pageConfig.params.file_title.substr(0, 20))
            //                 .replace(/\$fileSize/, pageConfig.params.file_size)
            //                 .replace(/\$code/, res.data.status)
            //         }).open();
            //     } else {
            //         $dialogBox.dialog({
            //             html: $integral_download_normal.html()
            //                 .replace(/\$title/, pageConfig.params.file_title.substr(0, 20))
            //                 .replace(/\$fileSize/, pageConfig.params.file_size)
            //                 .replace(/\$ovolume/, res.data.ovolume)
            //                 .replace(/\$evolume/, res.data.nvolume)
            //                 .replace(/\$code/, res.data.status)
            //         }).open();
            //     }
            //     break;
            // 下载券足够   使用下载券下载
            // case 5:
            //     if (userData.isVip === '1') {
            //         $dialogBox.dialog({
            //             html: $volume_download_vip.html()
            //                 .replace(/\$title/, pageConfig.params.file_title.substr(0, 20))
            //                 .replace(/\$fileSize/, pageConfig.params.file_size)
            //                 .replace(/\$ovolume/, res.data.ovolume)
            //                 .replace(/\$volume/, res.data.volume)
            //                 .replace(/\$code/, res.data.status)
            //         }).open();
            //     } else {
            //         $dialogBox.dialog({
            //             html: $volume_download_normal.html()
            //                 .replace(/\$title/, pageConfig.params.file_title.substr(0, 20))
            //                 .replace(/\$fileSize/, pageConfig.params.file_size)
            //                 .replace(/\$ovolume/, res.data.ovolume)
            //                 .replace(/\$volume/, res.data.volume)
            //                 .replace(/\$code/, res.data.status)
            //         }).open();
            //     }
            //     break;
            // 下载特权足够
            // case 9:
            //     $dialogBox.dialog({
            //         html: $have_privilege.html()
            //             .replace(/\$title/, pageConfig.params.file_title.substr(0, 20))
            //             .replace(/\$fileSize/, pageConfig.params.file_size)
            //             .replace(/\$privilege/, res.data.privilege)
            //             .replace(/\$code/, res.data.status)
            //     }).open();
            //     break;
            // 下载限制黑名单
            // case -1:
            //     $dialogBox.dialog({
            //         html: $tpl_down_text.html().replace(/\$msg/, '您的账号已被禁止下载，如有疑问联系平台！')
            //     }).open();
            //     break;
            // 用户不是vip不能下
            case 10:
                var fid = window.pageConfig.params.g_fileId;
                var state = window.pageConfig.params.file_state;
                var isVip = window.pageConfig.params.isVip;
                var showTips = 1;
                // if ((state == 5 || state == 6) && isVip == 0) {//专享资料 非vip用户
                //     showTips = 1;
                // }
                var format = window.pageConfig.params.file_format;
                var title = window.pageConfig.params.file_title;
                method.setCookieWithExp('f', JSON.stringify({ fid: fid, title: title, format: format }), 5 * 60 * 1000, '/');
                var params = '?fid=' + fid + '&ft=' + format +  '&checkStatus=' + res.data.checkStatus +'&name=' + encodeURIComponent(encodeURIComponent(title)) + '&ref=' + ref + '&showTips=' + showTips;
                goLocalTab('/pay/vip.html' + params);
                break;
          // vip专享下载--扣除下载特权    
            // case 12:
            //     $dialogBox.dialog({
            //         html: $permanent_privilege.html()
            //             .replace(/\$title/, pageConfig.params.file_title.substr(0, 20))
            //             .replace(/\$fileSize/, pageConfig.params.file_size)
            //             .replace(/\$privilege/, res.data.privilege)
            //             .replace(/\$code/, res.data.status)
            //     }).open();
            //     break;
            // vip专享下载--扣除下载特权但不够扣    
            case 13:
                $dialogBox.dialog({
                    html: $permanent_privilege_not.html()
                        .replace(/\$title/, pageConfig.params.file_title.substr(0, 20))
                        .replace(/\$fileSize/, pageConfig.params.file_size)
                        .replace(/\$code/, res.data.status)
                        .replace(/\$privilege/, res.data.privilege)
                        .replace(/\$productPrice/, res.data.productPrice)
                }).open();
                break;
             // 在线文档不支持下载       
            case 17:
                $dialogBox.dialog({
                    html: $tpl_down_text.html().replace(/\$msg/, '在线文档不支持下载')
                }).open();
            break;
            // 免费下载次数不足    
            // case 15:
            //     if (userData.isVip === '1') {
            //         $("#dialog-box").dialog({
            //             html: $vipFreeDownCounts.html(),
            //         }).open();
            //     }else {
            //         $("#dialog-box").dialog({
            //             html: $freeDownCounts.html(),
            //         }).open();
            //     }
            //     break;
            // 验证码不正确
            case 99:
                break;
            // 显示验证码
            case 98:
                break;
            // 已下载过
            default:
        }
    };

    /**
     * 预下载
     */
    var preDownLoad = function () {
        //gio上报-下载按钮点击
        if (!method.getCookie("cuk")) {

            login.notifyLoginInterface(function (data) {
                userData = data;
                publicDownload();
                common.afterLogin(data);
            });

            if ($(this).attr("loginOffer")) {
                method.setCookieWithExpPath('_loginOffer', $(this).attr("loginOffer"), 1000 * 60 * 60 * 1, '/');
            }
            method.setCookieWithExpPath('event_data_down', 'down', 1000 * 60 * 60 * 1, '/');

        } else if (method.getCookie("cuk") && !userData) {
            login.getLoginData(function (data) {
                userData = data;
                publicDownload();
                common.afterLogin(data);
            })
        } else if (method.getCookie("cuk") && userData) {
            publicDownload();
        }
        __pc__.gioTrack("docDetailDLClick", downLoadReport);

    };

    var downLoad = function () {
        // 文件下载 /action/downloadUrl?fid=文件id&code=验证码,预下载返回需要验证码
        var url = api.normalFileDetail.fileDownLoad + '?fid=' + window.pageConfig.params.g_fileId + "&code=" + (code ? code : '');
        $.ajax({
            async: false,
            type: "GET",
            url: url,
            dataType: "json",
            success: function (data) {
                bouncedType(data);
            }
        });
    };
    
   /**
    * 
    * 获取下载获取地址接口
    */
    var handleFileDownUrl = function(){
        if (method.getCookie("cuk")){
            // 判断文档类型 假设是 productType = 4 vip特权文档 需要先请求预下载接口
           if(window.pageConfig.page.productType == 4){
            $.ajax({
                url: api.normalFileDetail.filePreDownLoad,
                type: "POST",
                data: JSON.stringify({
                    "clientType": 0,
                    "fid": fid,  
                    "sourceType": 1
                  }),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (res) {
                        console.log(res)
                        if(res.code == '0'){
                          if(res.data.checkStatus == 0 && res.data.consumeStatus ==2){ // consumeStatus == 2 用下载特权消费的
                            $dialogBox.dialog({
                                html: $permanent_privilege.html()
                                    .replace(/\$title/, pageConfig.params.file_title.substr(0, 20))
                                    .replace(/\$fileSize/, pageConfig.params.file_size)
                                    .replace(/\$privilege/, res.data.privilege||0)
                                    .replace(/\$productPrice/, res.data.productPrice||0)
                                    .replace(/\$code/, res.data.status)
                            }).open();
                          }else{
                            getFileDownLoadUrl()
                          }
                        }
                }
            })
           }else{
            getFileDownLoadUrl()
           }  
        }else{
            login.notifyLoginInterface(function (data) {
                common.afterLogin(data);
                userData = data
                handleFileDownUrl()
            }); 
        }
    }

    var getFileDownLoadUrl  = function (){
        $.ajax({
            url: api.normalFileDetail.getFileDownLoadUrl,
            type: "POST",
            data: JSON.stringify({
                "clientType": 0,
                "fid": fid,  
                "sourceType": 1
              }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (res) {
                    console.log(res)
                    if(res.code == '0'){
                        bouncedType(res);
                    }
            }
        })
    }
    /**
     * 跳转到新的tab
     * @param href
     */
    var goNewTab = function (href) {
        // var $a = $("#ishare-h-tab-a");
        // if ($a.length > 0) {
        //     $a.attr("href", href);
        // } else {
        //     var referLink = "<a id='ishare-h-tab-a' class='ishare-h-tab-a' style='display: none;' target='_blank' href='" + href + "'><p>.</p></a>";
        //     $('body').append(referLink);
        // }
        // $('#ishare-h-tab-a p').trigger('click');
        method.compatibleIESkip(href,true);
    };

    var goLocalTab = function (href) {
        // var $a = $("#ishare-h-tab-a");
        // if ($a.length > 0) {
        //     $a.attr("href", href);
        // } else {
        //     var referLink = "<a id='ishare-h-tab-a' class='ishare-h-tab-a' style='display: none;'  href='" + href + "'><p>.</p></a>";
        //     $('body').append(referLink);
        // }
        // $('#ishare-h-tab-a p').trigger('click');
        // window.open(href);
        method.compatibleIESkip(href,false);
    };

    //已经登录 并且有触发支付点击
    var downCookie = method.getCookie('event_data_down');
    if (method.getCookie('cuk') && downCookie == 'down') {
        method.delCookie("event_data_down", "/");
        //唤起下载
        preDownLoad();
    }
    var $dialogBox = $('#dialog-box');

    // 弹窗下载
    $dialogBox.on('click', '.btn-dialog-download', function () {
        var code = $(this).attr('data-code');
        if (code) {
            // downLoad(code);
          //  handleFileDownUrl()
          getFileDownLoadUrl()

        }
    });
    // 跳转VIP,或者特权页面
    // $dialogBox.on('click', '.dialog-btn-joinVip', function () {
    //     var type = $(this).attr('data-type');
    //     if (type === 'vip') {
    //         goLocalTab('/pay/vip.html');
    //     } else if (type === 'privilege') {
    //         goLocalTab('/pay/privilege.html');
    //     }
    // });

    //点击预下载按钮
    $(document).on("click", '[data-toggle="download"]', function (e) {
      //  preDownLoad();
    //   debugger
    handleFileDownUrl()
    })
    //用app保存
    $(document).on("click", ".sava-app", function (e) {
        $("#dialog-box").dialog({
            html: tpl_android,
        }).open();
    });
    
   module.exports = {
    downLoad:handleFileDownUrl
   }
});