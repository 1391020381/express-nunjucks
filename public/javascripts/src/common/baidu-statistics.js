// 百度统计 自定义数据上传

define(function (require, exports, moudle) {
    var _hmt = _hmt || [];//此变量百度统计需要

    function handle(id) {
        if (id){
            try {
                (function () {
                    var hm = document.createElement("script");
                    hm.src = "//hm.baidu.com/hm.js?" + id;
                    var s = document.getElementsByTagName("script")[0];
                    s.parentNode.insertBefore(hm, s);
                })();
            } catch (e) {
                console.error(id,e);
            }
        }
    }
  function handleBaiduStatisticsPush(key,value){ // vlaue是对象
    _hmt.push('',[key, value]);
  }
  return {
    initBaiduStatistics:handle,  
    handleBaiduStatisticsPush:handleBaiduStatisticsPush
  }
});