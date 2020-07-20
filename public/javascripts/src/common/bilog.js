define(function (require, exports, module) {
    //var $ = require("$");
    var base64 = require("base64").Base64;
    var util = require("../cmd-lib/util");
    var method = require("../application/method");
    var config = require('./../report/config');//参数配置
    // var payTypeMapping = ['', '免费', '下载券', '现金', '仅供在线阅读', 'VIP免费', 'VIP特权'];
    // var payTypeMapping = ['', 'free', 'down', 'cost', 'online', 'vipFree', 'vipOnly'];
    var payTypeMapping = ['', 'free', '', 'online', 'vipOnly', 'cost']; //productType=1：免费文档，3 在线文档 4 vip特权文档 5 付费文档 6 私有文档
    // var fsourceEnum = {
    //     user: '用户上传', editor: '编辑上传', history: '历史资料1', history2: '历史资料2',
    //     other_collection_site: '外包采集站点', ishare_collection_site: '自行采集站点',
    //     other_collection_keyword: '外包采集关键字', ishare_collection_keyword: '自行采集关键字',
    //     baiduwenku_collection_site: '百度文库采集源', ishare_collection_microdisk: '自行采集微盘',
    // };
    var ip = method.getCookie('ip') || getIpAddress();
    var cid = method.getCookie('cid');
    if (!cid) {
        cid = new Date().getTime() + "" + Math.random();
        method.setCookieWithExp('cid', cid, 30 * 24 * 60 * 60 * 1000, '/');
    }
    var time = new Date().getTime() + "" + Math.random();
    var min30 = 1000 * 60 * 30;
    var sessionID = sessionStorage.getItem('sessionID') || '';
    function setSessionID() {
        sessionStorage.setItem('sessionID', time);
    }
    if (!sessionID) {
        setSessionID();
    }
    if (time - sessionID > min30) {
        setSessionID();
    }
    var initData = {
        eventType: '',//事件类型
        eventID: '',//事件编号
        eventName: '',//事件英文名字
        eventTime: String(new Date().getTime()),//事件触发时间戳（毫秒）
        reportTime: String(new Date().getTime()),//上报时间戳（毫秒）
        sdkVersion: 'V1.0.3',//sdk版本
        terminalType: '0',//软件终端类型  0-PC，1-M，2-快应用，3-安卓APP，4-IOS APP，5-微信小程序，6-今日头条小程序，7-百度小程序
        loginStatus: method.getCookie("cuk") ? 1 : 0,//登录状态 0 未登录 1 登录
        visitID: method.getCookie("gr_user_id") || '',//访客id
        userID: '',//用户ID
        sessionID: sessionStorage.getItem('sessionID') || cid || '',//会话ID
        productName: 'ishare',//产品名称
        productCode: '0',//产品代码
        productVer: 'V4.5.0',//产品版本
        pageID: '',//当前页面编号
        pageName: '',//当前页面的名称
        pageURL: '',//当前页面URL
        ip: ip || '',//IP地址
        resolution: document.documentElement.clientWidth + '*' + document.documentElement.clientHeight,//设备屏幕分辨率
        browserVer: util.getBrowserInfo(navigator.userAgent),//浏览器类型
        osType: getDeviceOs(),//操作系统类型

        //非必填
        moduleID: '',
        moduleName: '',
        appChannel: '',//应用下载渠道 仅针对APP移动端
        prePageID: '',//上一个页面编号
        prePageName: '',//上一个页面的名称
        prePageURL: document.referrer,//上一个页面URL
        domID: '',//当前触发DOM的编号 仅针对click
        domName: '',//当前触发DOM的名称 仅针对click
        domURL: '',//当前触发DOM的URL 仅针对click
        location: '',//位置（经纬度）仅针对移动端
        deviceID: '',//设备号 仅针对移动端
        deviceBrand: '',//移动设备品牌（厂商） 仅针对移动端
        deviceModel: '',//移动设备机型型号 仅针对移动端
        deviceLanguage: navigator.language,//设备语言
        mac: '',//MAC地址
        osVer: '',//操作系统版本 仅针对移动端
        networkType: '',//联网方式 仅针对移动端
        networkProvider: '',//网络运营商代码 仅针对移动端，非WIFI下传
        "var": {},// ishare  业务埋点
    };
    var userInfo = method.getCookie('ui');
    if (userInfo) {
        userInfo = JSON.parse(userInfo);
        initData.userID = userInfo.uid || '';
    }

    setPreInfo(document.referrer, initData);

    function setPreInfo(referrer, initData) {
        if (new RegExp('/f/').test(referrer)
            && !new RegExp('referrer=').test(referrer)
            && !new RegExp('/f/down').test(referrer)) {
            var statuCode = $('.ip-page-statusCode')
            if(statuCode == '404'){
                initData.prePageID = 'PC-M-404'; 
                initData.prePageName = '资料被删除';
            }else if(statuCode == '302'){
                initData.prePageID = 'PC-M-FSM'; 
                initData.prePageName = '资料私有';
            } else{
                initData.prePageID = 'PC-M-FD';
                initData.prePageName = '资料详情页';
            } 
        } else if (new RegExp('/pay/payConfirm.html').test(referrer)) {
            initData.prePageID = 'PC-M-PAY-F-L';
            initData.prePageName = '支付页-付费资料-列表页';
        } else if (new RegExp('/pay/payQr.html\\?type=2').test(referrer)) {
            initData.prePageID = 'PC-M-PAY-F-QR';
            initData.prePageName = '支付页-付费资料-支付页';
        } else if (new RegExp('/pay/vip.html').test(referrer)) {
            initData.prePageID = 'PC-M-PAY-VIP-L';
            initData.prePageName = '支付页-VIP-套餐列表页';
        } else if (new RegExp('/pay/payQr.html\\?type=0').test(referrer)) {
            initData.prePageID = 'PC-M-PAY-VIP-QR';
            initData.prePageName = '支付页-VIP-支付页';
        } else if (new RegExp('/pay/privilege.html').test(referrer)) {
            initData.prePageID = 'PC-M-PAY-PRI-L';
            initData.prePageName = '支付页-下载特权-套餐列表页';
        } else if (new RegExp('/pay/payQr.html\\?type=1').test(referrer)) {
            initData.prePageID = 'PC-M-PAY-PRI-QR';
            initData.prePageName = '支付页-下载特权-支付页';
        } else if (new RegExp('/pay/success').test(referrer)) {
            initData.prePageID = 'PC-M-PAY-SUC';
            initData.prePageName = '支付成功页';
        } else if (new RegExp('/pay/fail').test(referrer)) {
            initData.prePageID = 'PC-M-PAY-FAIL';
            initData.prePageName = '支付失败页';
        }else if (new RegExp('/node/f/downsucc.html').test(referrer)) {
            if(/unloginFlag=1/.test(referrer)){
                initData.prePageID = 'PC-M-FDPAY-SUC';
                initData.prePageName = '免登购买成功页';
            }else{
                initData.prePageID = 'PC-M-DOWN-SUC';
                initData.prePageName = '下载成功页';
            }
        } else if (new RegExp('/node/f/downfail.html').test(referrer)) {
            initData.prePageID = 'PC-M-DOWN-FAIL';
            initData.prePageName = '下载失败页';
        }else if (new RegExp('/search/home.html').test(referrer)) {
            initData.prePageID = 'PC-M-SR';
            initData.prePageName = '搜索关键词';
        }else if(new RegExp('/node/404.html').test(referrer)){
            initData.prePageID = 'PC-M-404';
            initData.prePageName = '404错误页';
        }else if(new RegExp('/node/503.html').test(referrer)){
            initData.prePageID = 'PC-M-500';
            initData.prePageName = '500错误页';
        }else if(new RegExp('/node/personalCenter/home.html').test(referrer)){
            initData.prePageID = 'PC-M-USER';
            initData.prePageName = '个人中心-首页';
        }else if(new RegExp('/node/personalCenter/myuploads.html').test(referrer)){
            initData.prePageID = 'PC-M-USER-MU';
            initData.prePageName = '个人中心-我的上传页';
        }else if(new RegExp('/node/personalCenter/mycollection.html').test(referrer)){
            initData.prePageID = 'PC-M-USER-CL';
            initData.prePageName = '个人中心-我的收藏页';
        }else if(new RegExp('/node/personalCenter/mydownloads.html').test(referrer)){
            initData.prePageID = 'PC-M-USER-MD';
            initData.prePageName = '个人中心-我的下载页';
        }else if(new RegExp('/node/personalCenter/vip.html').test(referrer)){
            initData.prePageID = 'PC-M-USER-VIP';
            initData.prePageName = '个人中心-我的VIP';
        }else if(new RegExp('/node/personalCenter/mycoupon.html').test(referrer)){
            initData.prePageID = 'PC-M-USER-MS';
            initData.prePageName = '个人中心-我的优惠券页';
        }else if(new RegExp('/node/personalCenter/accountsecurity.html').test(referrer)){
            initData.prePageID = 'PC-M-USER-ATM';
            initData.prePageName = '个人中心-账号与安全页';
        }else if(new RegExp('/node/personalCenter/personalinformation.html').test(referrer)){
            initData.prePageID = 'PC-M-USER-ATF';
            initData.prePageName = '个人中心-个人信息页';
        }else if(new RegExp('/node/personalCenter/myorder.html').test(referrer)){
            initData.prePageID = 'PC-M-USER-ORD';
            initData.prePageName = '个人中心-我的订单';
        }
    }

    //获取ip地址
    function getIpAddress() {
        $.getScript("//ipip.iask.cn/iplookup/search?format=js", function (response, status) {
            if (status === 'success') {
                method.setCookieWithExp('ip', remote_ip_info['ip'], 5 * 60 * 1000, '/');
                initData.ip = remote_ip_info['ip'];
            } else {
                console.error('ipip获取ip信息error');
            }
        });
    }
    //获得操作系统类型
    function getDeviceOs() {
        var name = '';
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
        setTimeout(function () {
            console.log(params,'页面上报');
            $.getJSON("https://dw.iask.com.cn/ishare/jsonp?data=" + base64.encode(JSON.stringify(params)) + "&jsoncallback=?", function (data) {
                console.log(data);
            });
        })
    }
    // 埋点引擎
    function handle(commonData, customData) {
        var resultData = commonData;
        if (commonData && customData) {
            for (var key in commonData) {
                if (key === 'var') {
                    for (var item in customData) {
                        resultData['var'][item] = customData[item];
                    }
                } else {
                    if (customData[key]) {
                        resultData[key] = customData[key];
                    }
                }
            }
            console.log('埋点参数:',resultData)
            push(resultData);
        }
    }

    //全部页面都要上报
    function normalPageView() {
        var commonData = JSON.parse(JSON.stringify(initData));
        setPreInfo(document.referrer, commonData);
        var customData = { channel: '' };
        var bc = method.getCookie('bc');
        if (bc) {
            customData.channel = bc;
        }
        commonData.eventType = 'page';
        commonData.eventID = 'NE001';
        commonData.eventName = 'normalPageView';
        commonData.pageID = $("#ip-page-id").val() || '';
        commonData.pageName = $("#ip-page-name").val() || '';
        commonData.pageURL = window.location.href;
        var searchEngine = getSearchEngine()
        var source = getSource(searchEngine)
        $.extend(customData, {source:source,searchEngine:searchEngine});
        handle(commonData, customData);
    }
    //详情页
    function fileDetailPageView() {
        var customData = {
            fileID: window.pageConfig.params.g_fileId,
            fileName: window.pageConfig.params.file_title,
            fileCategoryID: window.pageConfig.params.classid1 + '||' + window.pageConfig.params.classid2 + '||' + window.pageConfig.params.classid3,
            fileCategoryName: window.pageConfig.params.classidName1 + '||' + window.pageConfig.params.classidName2 + '||' + window.pageConfig.params.classidName3,
            filePrice: window.pageConfig.params.moneyPrice,
            fileCouponCount: window.pageConfig.params.file_volume,
            filePayType: payTypeMapping[window.pageConfig.params.file_state],
            fileFormat: window.pageConfig.params.file_format,
            fileProduceType: window.pageConfig && window.pageConfig.params ? window.pageConfig.params.fsource : '',
            fileCooType: '',
            fileUploaderID: window.pageConfig.params.file_uid,
        };
        var is360 = window.pageConfig && window.pageConfig.params ? window.pageConfig.params.is360 : '';
        if (/https?\:\/\/[^\s]*so.com.*$/g.test(document.referrer) && !/https?\:\/\/[^\s]*wenku.so.com.*$/g.test(document.referrer) && is360 == 'true') {
            customData.fileCooType = '360onebox';
            method.setCookieWithExp('bc', '360onebox', 30 * 60 * 1000, '/');
        }
        if (/https?\:\/\/[^\s]*wenku.so.com.*$/g.test(document.referrer)) {
            customData.fileCooType = '360wenku';
            method.setCookieWithExp('bc', '360wenku', 30 * 60 * 1000, '/');
        }
        if (/https?\:\/\/[^\s]*wenku.so.com.*$/g.test(document.referrer)) {
            customData.fileCooType = '360wenku';
            method.setCookieWithExp('bc', '360wenku', 30 * 60 * 1000, '/');
        }
        var commonData = JSON.parse(JSON.stringify(initData));
        setPreInfo(document.referrer, commonData);
        commonData.eventType = 'page';
        commonData.eventID = 'SE002';
        commonData.eventName = 'fileDetailPageView';
        commonData.pageID = $("#ip-page-id").val() || '';
        commonData.pageName = $("#ip-page-name").val() || '';
        commonData.pageURL = window.location.href;

        method.setCookieWithExp('bf', JSON.stringify(customData), 30 * 60 * 1000, '/');

        handle(commonData, customData);
    }
    //文件购买结果页
    function payFileResult(customData) {
        var commonData = JSON.parse(JSON.stringify(initData));
        setPreInfo(document.referrer, commonData);
        commonData.eventType = 'page';
        commonData.eventID = 'SE009';
        commonData.eventName = 'payFileResult';
        commonData.pageID = $("#ip-page-id").val() || '';
        commonData.pageName = $("#ip-page-name").val() || '';
        commonData.pageURL = window.location.href;
        if(!customData.fileID){
            customData.fileID = method.getParam('fid') || $("#ip-page-fid").val();
        }
        if(!customData.filePayType){
            var state = $("#ip-page-fstate").val() || 1;
            customData.filePayType = payTypeMapping[state];
        }

        handle(commonData, customData);
    }
    //vip购买结果页
    function payVipResult(customData) {
        var commonData = JSON.parse(JSON.stringify(initData));
        setPreInfo(document.referrer, commonData);
        commonData.eventType = 'page';
        commonData.eventID = 'SE011';
        commonData.eventName = 'payVipResult';
        commonData.pageID = $("#ip-page-id").val() || '';
        commonData.pageName = $("#ip-page-name").val() || '';
        commonData.pageURL = window.location.href;
        if (!customData.orderID){
            customData.orderID = method.getParam('orderNo') || '';
        }
        handle(commonData, customData);
    }
    //下载特权购买结果页
    function payPrivilegeResult(customData) {
        var commonData = JSON.parse(JSON.stringify(initData));
        setPreInfo(document.referrer, commonData);
        commonData.eventType = 'page';
        commonData.eventID = 'SE013';
        commonData.eventName = 'payPrivilegeResult';
        commonData.pageID = $("#ip-page-id").val() || '';
        commonData.pageName = $("#ip-page-name").val() || '';
        commonData.pageURL = window.location.href;
        handle(commonData, customData);
    }
    //下载结果页
    function downResult(customData) {
        var commonData = JSON.parse(JSON.stringify(initData));
        setPreInfo(document.referrer, commonData);
        commonData.eventType = 'page';
        commonData.eventID = 'SE014';
        commonData.eventName = 'downResult';
        commonData.pageID = $("#ip-page-id").val() || '';
        commonData.pageName = $("#ip-page-name").val() || '';
        commonData.pageURL = window.location.href;
        handle(commonData, customData);
    }

    function searchResult(customData){ //导出页面使用
        var commonData = JSON.parse(JSON.stringify(initData));
        commonData.eventType = 'page';
        commonData.eventID = 'SE015';
        commonData.eventName = 'searchPageView';
        setPreInfo(document.referrer, commonData);
        commonData.pageID = 'PC-M-SR' || '';
        commonData.pageName = $("#ip-page-name").val() || '';
        customData.keyWords = $('.new-input').val()||$('.new-input').attr('placeholder')
       
        commonData.pageURL = window.location.href;
        handle(commonData, customData);
    }

    //页面级事件
    $(function () {
        setTimeout(function () {
            var pid = $("#ip-page-id").val();
            if ('PC-M-FD' == pid) {//详情页
                fileDetailPageView();
            }
            if ('PC-O-SR' != pid) {//不是办公频道搜索结果页
                normalPageView();
            }
            var payVipResultData = {
                payResult: 1,
                orderID: method.getParam('orderNo') || '',
                couponID: $(".pay-coupon-wrap").attr("vid") || '',
                coupon: $(".pay-coupon-wrap p.chose-ele").text() || '',
                orderPayType: '', orderPayPrice: '', vipID: '', vipName: '', vipPrice: '',
            };
            var payPriResultData = {
                payResult: 1,
                orderID: method.getParam('orderNo') || '',
                couponID: $(".pay-coupon-wrap").attr("vid") || '',
                coupon: $(".pay-coupon-wrap p.chose-ele").text() || '',
                orderPayType: '', orderPayPrice: '', fileID: '', fileName: '', fileCategoryID: '', fileCategoryName: '',
                filePayType: '', fileFormat: '', fileProduceType: '', fileCooType: '', fileUploaderID: '', privilegeID: '', privilegeName: '', privilegePrice: '',
            };
            var payFileResultData = {
                payResult: 1,
                orderID: method.getParam('orderNo') || '',
                couponID: $(".pay-coupon-wrap").attr("vid") || '',
                coupon: $(".pay-coupon-wrap p.chose-ele").text() || '',
                orderPayType: '', orderPayPrice: '', fileID: '', fileName: '', fileCategoryID: '', fileCategoryName: '',
                filePayType: '', fileFormat: '', fileProduceType: '', fileCooType: '', fileUploaderID: '', filePrice: '',
                fileSalePrice: '',
            };
            var bf = method.getCookie('bf');
            var br = method.getCookie('br');
            var href = window.location.href;
            if ('PC-M-PAY-SUC' == pid || 'PC-O-PAY-SUC' == pid) {//支付成功页
                if (href.indexOf("type=0") > -1) {//vip购买成功页
                    if (br) {
                        trans(JSON.parse(br), payVipResultData);
                    }
                    payVipResult(payVipResultData);
                } else if (href.indexOf("type=1") > -1) {//下载特权购买成功页
                    if (bf) {
                        trans(JSON.parse(bf), payPriResultData);
                    }
                    if (br) {
                        trans(JSON.parse(br), payPriResultData);
                    }
                    payPrivilegeResult(payPriResultData);
                } else if (href.indexOf("type=2") > -1) {//文件购买成功页
                    if (bf) {
                        trans(JSON.parse(bf), payFileResultData);
                    }
                    var br = method.getCookie('br');
                    if (br) {
                        trans(JSON.parse(br), payFileResultData);
                    }
                    payFileResult(payFileResultData);
                }
            } else if ('PC-M-PAY-FAIL' == pid || 'PC-O-PAY-FAIL' == pid) {//支付失败页
                if (href.indexOf("type=0") > -1) {//vip购买失败页
                    if (br) {
                        trans(JSON.parse(br), payVipResultData);
                    }
                    payVipResultData.payResult = 0;
                    payVipResult(payVipResultData);
                } else if (href.indexOf("type=1") > -1) {//下载特权购买失败页
                    if (bf) {
                        trans(JSON.parse(bf), payPriResultData);
                    }
                    if (br) {
                        trans(JSON.parse(br), payPriResultData);
                    }
                    payPriResultData.payResult = 0;
                    payPrivilegeResult(payPriResultData);
                } else if (href.indexOf("type=2") > -1) {//文件购买失败页
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
                fileID: '', fileName: '', fileCategoryID: '', fileCategoryName: '', filePayType: ''
            };
            if ('PC-M-DOWN-SUC' == pid) {//下载成功页
                var bf = method.getCookie('bf');
                if (bf) {
                    trans(JSON.parse(bf), downResultData);
                }
                downResultData.downResult = 1;
                downResult(downResultData);
            } else if ('PC-M-DOWN-FAIL' == pid) {//下载失败页
                var bf = method.getCookie('bf');
                if (bf) {
                    trans(JSON.parse(bf), downResultData);
                }
                downResultData.downResult = 0;
                downResult(downResultData);
            }

        }, 1000);
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
    $(document).delegate('.' + config.EVENT_NAME, 'click', function (event) {//动态绑定点击事件
        // debugger
        var that = $(this);
        var cnt = that.attr(config.BILOG_CONTENT_NAME);//上报事件类型
        console.log('cnt:',cnt)
        if (cnt) {
            setTimeout(function () {
                clickEvent(cnt, that);
            })
        }
    });

    function clickCenter(eventID, eventName, domId, domName, customData) {
        var commonData = JSON.parse(JSON.stringify(initData));
        setPreInfo(document.referrer, commonData);
        commonData.eventType = 'click';
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
    function clickEvent(cnt, that,moduleID) {
        var ptype = $("#ip-page-type").val();
        if (ptype == 'pindex') {//详情页
            var customData = {
                fileID: '', fileName: '', fileCategoryID: '', fileCategoryName: '', filePayType: '', fileFormat: '', fileProduceType: '', fileCooType: '', fileUploaderID: '',
            };
            var bf = method.getCookie('bf');
            if (bf) {
                trans(JSON.parse(bf), customData);
            }
            if (cnt == 'fileDetailUpDown' || cnt == 'fileDetailMiddleDown' || cnt == 'fileDetailBottomDown') {
                customData.downType = '';
                if (cnt == 'fileDetailUpDown') {
                    clickCenter('SE003', 'fileDetailDownClick', 'fileDetailUpDown', '资料详情页顶部立即下载', customData);
                } else if (cnt == 'fileDetailMiddleDown') {
                    clickCenter('SE003', 'fileDetailDownClick', 'fileDetailMiddleDown', '资料详情页中部立即下载', customData);
                } else if (cnt == 'fileDetailBottomDown') {
                    clickCenter('SE003', 'fileDetailDownClick', 'fileDetailBottomDown', '资料详情页底部立即下载', customData);
                }
                delete customData.downType;
            } else if (cnt == 'fileDetailUpBuy') {
                clickCenter('SE004', 'fileDetailBuyClick', 'fileDetailUpBuy', '资料详情页顶部立即购买', customData);
            } else if (cnt == 'fileDetailMiddleBuy') {
                clickCenter('SE004', 'fileDetailBuyClick', 'fileDetailMiddleBuy', '资料详情页中部立即购买', customData);
            } else if (cnt == 'fileDetailBottomBuy') {
                clickCenter('SE004', 'fileDetailBuyClick', 'fileDetailBottomBuy', '资料详情页底部立即购买', customData);
            } else if (cnt == 'fileDetailMiddleOpenVip8') {
                clickCenter('SE005', 'fileDetailOpenVipClick', 'fileDetailMiddleOpenVip8', '资料详情页中部开通vip，8折购买', customData);
            } else if (cnt == 'fileDetailBottomOpenVip8') {
                clickCenter('SE005', 'fileDetailOpenVipClick', 'fileDetailBottomOpenVip8', '资料详情页底部开通vip，8折购买', customData);
            } else if (cnt == 'fileDetailMiddleOpenVipPr') {
                clickCenter('SE005', 'fileDetailOpenVipClick', 'fileDetailMiddleOpenVipPr', '资料详情页中部开通vip，享更多特权', customData);
            } else if (cnt == 'fileDetailBottomOpenVipPr') {
                clickCenter('SE005', 'fileDetailOpenVipClick', 'fileDetailBottomOpenVipPr', '资料详情页底部开通vip，享更多特权', customData);
            } else if (cnt == 'fileDetailComment') { // 详情评论功能已下架
                // clickCenter('SE006', 'fileDetailCommentClick', 'fileDetailComment', '资料详情页评论', customData);
            } else if (cnt == 'fileDetailScore') {
                var score = that.find(".on:last").text();
                customData.fileScore = score ? score : '';
                clickCenter('SE007', 'fileDetailScoreClick', 'fileDetailScore', '资料详情页评分', customData);
                delete customData.fileScore;
            }
        }
        if (cnt == 'payFile') {
            var customData = {
                orderID: method.getParam('orderNo') || '',
                couponID: $(".pay-coupon-wrap").attr("vid") || '',
                coupon: $(".pay-coupon-wrap p.chose-ele").text() || '',
                fileID: '', fileName: '', fileCategoryID: '', fileCategoryName: '',
                filePayType: '', fileFormat: '', fileProduceType: '',
                fileCooType: '', fileUploaderID: '', filePrice: '', fileSalePrice: '',
            };
            var bf = method.getCookie('bf');
            if (bf) {
                trans(JSON.parse(bf), customData);
            }
            clickCenter('SE008', 'payFileClick', 'payFile', '支付页-付费资料-立即支付', customData);
        } else if (cnt == 'payVip') {
            var customData = {
                orderID: method.getParam('orderNo') || '',
                vipID: $(".ui-tab-nav-item.active").data('vid'),
                vipName: $(".ui-tab-nav-item.active p.vip-time").text() || '',
                vipPrice: $(".ui-tab-nav-item.active p.vip-price strong").text() || '',
                couponID: $(".pay-coupon-wrap").attr("vid") || '',
                coupon: $(".pay-coupon-wrap p.chose-ele").text() || '',
            };
            clickCenter('SE010', 'payVipClick', 'payVip', '支付页-VIP-立即支付', customData);
        } else if (cnt == 'payPrivilege') {
            var customData = {
                orderID: method.getParam('orderNo') || '',
                couponID: $(".pay-coupon-wrap").attr("vid") || '',
                coupon: $(".pay-coupon-wrap p.chose-ele").text() || '',
                // privilegeID: $(".ui-tab-nav-item.active").data('pid') || '',
                privilegeName: $(".ui-tab-nav-item.active p.privilege-price").text() || '',
                privilegePrice: $(".ui-tab-nav-item.active").data('activeprice') || '',
                fileID: '', fileName: '', fileCategoryID: '', fileCategoryName: '', filePayType: '', fileFormat: '',
                fileProduceType: '', fileCooType: '', fileUploaderID: '',
            };
            var bf = method.getCookie('bf');
            if (bf) {
                trans(JSON.parse(bf), customData);
            }
            clickCenter('SE012', 'payPrivilegeClick', 'payPrivilege', '支付页-下载特权-立即支付', customData);
        }else if(cnt == 'searchResult'){
            customData = {
                fileID: that.attr('data-fileId'),
                fileName: that.attr('data-fileName'),
                keyWords:$('.new-input').val()||$('.new-input').attr('placeholder')
            };
            clickCenter('SE016', 'normalClick', 'searchResultClick', '搜索结果页点击', customData);
        }

        var customData = {
            phone: $("#ip-mobile").val() || '',
            vipStatus: $("#ip-isVip").val() || '',
            channel: '', cashBalance: '', integralNumber: '', idolNumber: '', fileCategoryID: '', fileCategoryName: '',
        };
        if (userInfo) {
            customData.vipStatus = userInfo.isVip || '';
            customData.phone = userInfo.tel || '';
        }
        var bc = method.getCookie('bc');
        if (bc) {
            customData.channel = bc;
        }

        if (cnt == 'paySuccessBacDown') {
            clickCenter('NE002', 'normalClick', 'paySuccessBacDown', '支付成功页-返回下载', customData);
        } else if (cnt == 'paySuccessOpenVip') {
            clickCenter('NE002', 'normalClick', 'paySuccessOpenVip', '支付成功页-开通VIP', customData);
        } else if (cnt == 'downSuccessOpenVip') {
            clickCenter('NE002', 'normalClick', 'downSuccessOpenVip', '下载成功页-开通VIP', customData);
        } else if (cnt == 'downSuccessContinueVip') {
            clickCenter('NE002', 'normalClick', 'downSuccessContinueVip', '下载成功页-续费VIP', customData);
        } else if (cnt == 'downSuccessBacDetail') {
            clickCenter('NE002', 'normalClick', 'downSuccessBacDetail', '下载成功页-返回详情页', customData);
        } else if (cnt == 'downSuccessBindPhone') {
            clickCenter('NE002', 'normalClick', 'downSuccessBindPhone', '下载成功页-立即绑定', customData);
        }else if(cnt =='viewExposure'){
            customData.moduleID = moduleID
            clickCenter('NE006', 'modelView', '', '', customData);
        }else if(cnt == 'similarFileClick'){
            customData={
                fileID: window.pageConfig.params.g_fileId,
                fileName: window.pageConfig.params.file_title,
                fileCategoryID: window.pageConfig.params.classid1 + '||' + window.pageConfig.params.classid2 + '||' + window.pageConfig.params.classid3,
                fileCategoryName: window.pageConfig.params.classidName1 + '||' + window.pageConfig.params.classidName2 + '||' + window.pageConfig.params.classidName3,
                filePayType: payTypeMapping[window.pageConfig.params.file_state]
            }
            clickCenter('SE017', 'fileListNormalClick', 'similarFileClick', '资料列表常规点击', customData);
        }else if(cnt =='underSimilarFileClick'){
            customData={
                fileID: window.pageConfig.params.g_fileId,
                fileName: window.pageConfig.params.file_title,
                fileCategoryID: window.pageConfig.params.classid1 + '||' + window.pageConfig.params.classid2 + '||' + window.pageConfig.params.classid3,
                fileCategoryName: window.pageConfig.params.classidName1 + '||' + window.pageConfig.params.classidName2 + '||' + window.pageConfig.params.classidName3,
                filePayType: payTypeMapping[window.pageConfig.params.file_state]
            }
            clickCenter('SE017', 'fileListNormalClick', 'underSimilarFileClick', '点击底部猜你喜欢内容时', customData);
        }else if(cnt == 'downSucSimilarFileClick'){
            clickCenter('SE017', 'fileListNormalClick', 'downSucSimilarFileClick', '下载成功页猜你喜欢内容时', customData); 
        }else if(cnt == 'markFileClick'){
            customData={
                fileID: window.pageConfig.params.g_fileId,
                fileName: window.pageConfig.params.file_title,
                fileCategoryID: window.pageConfig.params.classid1 + '||' + window.pageConfig.params.classid2 + '||' + window.pageConfig.params.classid3,
                fileCategoryName: window.pageConfig.params.classidName1 + '||' + window.pageConfig.params.classidName2 + '||' + window.pageConfig.params.classidName3,
                filePayType: payTypeMapping[window.pageConfig.params.file_state],
                markRusult: 1
            }
            clickCenter('SE019', 'markClick', 'markFileClick', '资料收藏点击', customData); 
        }else if(cnt == 'vipRights'){
            clickCenter('NE002', 'normalClick', 'vipRights', '侧边栏-vip权益', customData); 
        }else if(cnt == 'seen'){
            clickCenter('NE002', 'normalClick', 'seen', '侧边栏-我看过的', customData); 
        }else if(cnt == 'mark'){
            clickCenter('NE002', 'normalClick', 'mark', '侧边栏-我的收藏', customData); 
        }else if(cnt == 'customerService'){
            clickCenter('NE002', 'normalClick', 'customerService', '侧边栏-联系客服', customData); 
        }else if(cnt == 'downApp'){
            clickCenter('NE002', 'normalClick', 'downApp', '侧边栏-下载APP', customData); 
        }else if(cnt == 'follow'){
            clickCenter('NE002', 'normalClick', 'follow', '侧边栏-关注领奖', customData); 
        }
    }
    function getSearchEngine(){
        // baidu：百度
        // google:谷歌
        // 360:360搜索
        // sougou:搜狗
        // shenma:神马搜索
        // bing:必应
        var referrer = document.referrer;
        var res = "";
        if (/https?\:\/\/[^\s]*so.com.*$/g.test(referrer)) { 
            res = '360';
        } else if (/https?\:\/\/[^\s]*baidu.com.*$/g.test(referrer)) {
            res = 'baidu';
        } else if (/https?\:\/\/[^\s]*sogou.com.*$/g.test(referrer)) {
            res = 'sogou';
        } else if (/https?\:\/\/[^\s]*sm.cn.*$/g.test(referrer)) {
            res = 'sm';
        }else if(/https?\:\/\/[^\s]*google.com.*$/g.test(referrer)){
            res = 'google';
        } else if(/https?\:\/\/[^\s]*bing.com.*$/g.test(referrer)){
            res = 'bing';
        } 
        return res;
    }
    function getSource(searchEngine){
        var referrer = document.referrer;
        var orgigin = location.origin
        var source = ''
        if(searchEngine){ //搜索引擎
            source = 'searchEngine'
        }else if(referrer&&referrer.indexOf(orgigin)!==-1){ // 正常访问
           source = 'vist'
        }else {
            source = 'outLink'
        }
        return source
    }
    module.exports = {
        clickEvent:function($this){
            var cnt = $this.attr(config.BILOG_CONTENT_NAME)
            console.log('cnt-导出的:',cnt)
            if(cnt){
                setTimeout(function(){
                    clickEvent(cnt,$this)
                })
            }
        },
        viewExposure:function($this,moduleID){
            var cnt = 'viewExposure'
            if(cnt){
                setTimeout(function(){
                    clickEvent(cnt,$this,moduleID)
                })
            } 
        },
        searchResult:searchResult
    }
});