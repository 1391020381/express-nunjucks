define(function (require, exports, module) { // 需要判断时候是否要登录 是否点击
    // 试读完毕后, 修改 继续阅读 按钮的文字 而且修改后 事件的逻辑 走下载逻辑
     function changeText(){
      var  downLoad =  require("./download").downLoad;
      var method = require("../application/method");
      var common = require('./common');
       var  readMore =  $('.red-color')
     
      
       // productType		int	商品类型 1：免费文档，3 在线文档 4 vip特权文档 5 付费文档 6 私有文档
       // 是否登录  method.getCookie('cuk')
       // 是否可以下载  window.pageConfig.page.isDownload
       // productPrice		long	商品价格 > 0 的只有 vip特权 个数,和 付费文档 金额 单位分
       var productType = window.pageConfig.page.productType
       var productPrice = window.pageConfig.page.productPrice
       var cuk = method.getCookie('cuk')
       var isDownload = window.pageConfig.page.isDownload
       var ui = method.getCookie('ui')?JSON.parse(method.getCookie('ui')):{}
       if(method.getCookie('cuk')){
            downLoad(changeReadMoreText)
       }else{
        login.notifyLoginInterface(function (data) {
            common.afterLogin(data);
         }) 
       }
    }
    function changeReadMoreText(data){ // 文件下载接口的返回数据
        switch(data.checkStatus){  //  
            case 8:
                textContent = '¥'+ data.productPrice +'获取该资料'
                break
            case  0:
                textContent = '下载到本地阅读'
                break
            case 17:
                  if(ui.isVip){
                     textContent = '寻找资料' 
                  }else{
                      textContent = '开通VIP,享受更多特权'
                  }  
            case 13:
                textContent = '开通VIP下载资料'    
        }
        readMore.text(textContent)
    }

    module.exports = {
        changeText:changeText
    }
});