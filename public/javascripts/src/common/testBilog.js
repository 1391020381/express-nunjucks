/**
 * 测试立即下载埋点数据直接上报  （以后需删除）
 */
define(function (require, exports, module) {
    $(".btn-fix-bottom").on('click',function(){
        if(window.pageConfig.page.abTest=='a'){
            trackEvent('SE060', "fileDetailDownClick", 'page', {
                domID:'btn-fix-bottom-a',
                domName:'立即下载'
            });
        }else{
            trackEvent('SE060', "fileDetailDownClick", 'page', {
                domID:'btn-fix-bottom-b',
                domName:'立即下载'
            });
        }
      
    })
    $(".btn-read-more").on('click',function(){
        if(window.pageConfig.page.abTest=='a'){
            if($(this).find(".red-color").text()!=='点击可继续阅读 >'){
                trackEvent('SE060', "fileDetailDownClick", 'page', {
                    domID:'btn-read-more-a',
                    domName:'继续阅读-立即下载'
                });
            }
        }else{
            if($(this).find(".red-color").text()!=='点击可继续阅读 >'){
                trackEvent('SE060', "fileDetailDownClick", 'page', {
                    domID:'btn-read-more-b',
                    domName:'继续阅读-立即下载'
                });
            }
        }
     
    })
});