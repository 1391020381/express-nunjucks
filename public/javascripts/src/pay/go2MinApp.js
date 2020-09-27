define(function (require, exports, module) {
    var utils = require("../cmd-lib/util");
    var api = require("../application/api")
    var urlConfig = require('../application/urlConfig')
    require("../cmd-lib/toast2");
    // 微信环境内
    if(utils.isWeChatBrow()){
        getWechatSignature()
    }

    function getWechatSignature(){
        $.ajax({
            type: 'post',
            url: api.wechat.getWechatSignature,
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            data:JSON.stringify({
                // appId:'wxb78229eb7470875b',
                // appId:'wxb8af2801b7be4c37',
                appId:urlConfig.appId,
                url:window.location.href
            }),
            success: function (res) { 
                console.log('getWechatSignature:',res)
                if (res.code == 0) {
                    wxAPI(res.data)
                }else{
                    $.toast({
                        text: res.msg,
                        delay: 2000
                    });
                }
            },
            error:function(error){
                console.log('getWechatSignature:',error)
                $.toast({
                    text:error.msg||'getWechatSignature错误',
                    delay : 3000,
                }) 
            }
        })
    }

    function wxAPI(data){
        wx.config({
            debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印
            appId: data.appId, // 必填，公众号的唯一标识
            timestamp: data.timestamp, // 必填，生成签名的时间戳
            nonceStr: data.nonceStr, // 必填，生成签名的随机串
            signature: data.signature,// 必填，签名
            jsApiList: [
                "onMenuShareTimeline"
            ], // 必填，需要使用的JS接口列表
            openTagList: ['wx-open-launch-weapp'] // 可选，需要使用的开放标签列表，例如['wx-open-launch-app']
          })
    
          wx.ready(function () {
            // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中
            console.log('微信信息验证')
        });

        wx.error(function (res) {
            console.log('微信回调:',res)
            // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名
          })
    } 


})