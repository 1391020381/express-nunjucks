define(function (require, exports, module) { // 需要判断时候是否要登录 是否点击
    // 试读完毕后, 修改 继续阅读 按钮的文字 而且修改后 事件的逻辑 走下载逻辑
    var  downLoad =  require("./download").downLoad;
    var method = require("../application/method");
    var login = require("../application/checkLogin");
    var common = require('./common');
     var  readMore =  $('.red-color')
     var pageText = $('.page-text .endof-trial-reading')
     var pageNum = $('.page-num')
     // productType		int	商品类型 1：免费文档，3 在线文档 4 vip特权文档 5 付费文档 6 私有文档
     // 是否登录  method.getCookie('cuk')
     // 是否可以下载  window.pageConfig.page.isDownload
     // productPrice		long	商品价格 > 0 的只有 vip特权 个数,和 付费文档 金额 单位分
     var productType = window.pageConfig.page.productType
     var productPrice = window.pageConfig.page.productPrice
     var cuk = method.getCookie('cuk')
     var isDownload = window.pageConfig.page.isDownload  // 'n' 屏蔽下载
     var ui = method.getCookie('ui')?JSON.parse(method.getCookie('ui')):{}
    function readMoreTextEvent(){ // 文件下载接口的返回数据
        if(method.getCookie('cuk')){
            downLoad()
       }else{
        login.notifyLoginInterface(function (data) {
            common.afterLogin(data);
         }) 
       }
    }

    module.exports = {
        changeText:changeReadMoreText,
        readMoreTextEvent:readMoreTextEvent
    }

    // 1. 预览完成 修改文案 登录的后也要更新
    // 2 点击事件
    function changeReadMoreText(){
     var    textContent = ''
        switch (productType) {
           case '5' : // 付费
           if(isDownload!='n'){
            textContent =  '下载到本地阅读'
           }else{
            textContent =  '¥'+ (productPrice*0.8).toFixed(2) +'获取该资料'
           }
          
           break
           case '1' :
           textContent = '下载到本地阅读'
           break
           case '3':
             if(ui.isVip !='1'){
                textContent = '开通VIP寻找资料'
             }else{
                textContent = '寻找资料'
             }  
             break
             case '4':
               if(isDownload=='n'){
                textContent = '开通VIP 下载资料'
               }else{
                textContent = '下载到本地阅读'
               }  
              break
              default: 
           
        }
        readMore.text(textContent)
        pageText.show()
        if(pageNum.text() == -1){
            pageNum.text(0)
        }
    }
});