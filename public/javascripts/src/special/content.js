define(function(require , exports , module){ 
    toggleMore();
    toggleTag();
    console.log(window.pageConfig)
         //更多筛选  切换函数
    function toggleMore() {
        var searchScreen = $('.search-screen');
        var searchItem = $('.search-item');
        searchScreen.on('click', function () {
            if (searchScreen.children().eq(0).text() === '更多筛选') {
                searchScreen.children().eq(0).text('收起筛选');
                searchItem.removeClass('hide');
            } else {
                searchScreen.children().eq(0).text('更多筛选');
                searchItem.eq(2).addClass('hide');
                searchItem.eq(3).addClass('hide');
            }
            searchScreen.children().eq(1).toggleClass('screen-less');
        })
    }
    
    function toggleTag(){
        $(document).on('click','.search-ele',function(){
            var ids = $(this).attr('data-ids');
            var idsArr=ids.split('-'),subArr=[];
            console.log(idsArr,'idsArr')
            if(idsArr.length>1){
                var currentTag={
                    propertyGroupId:idsArr[2] && idsArr[2].split('_')[0],
                    propertyId:idsArr[2] && idsArr[2].split('_')[1],
                }
                console.log(currentTag,'currentTag')
                var originArr=pageConfig.urlParams.topicPropertyQueryDTOList ? JSON.parse(pageConfig.urlParams.topicPropertyQueryDTOList): [];
                
                if(originArr.length>0){ //之前是否有选中tag
                    originArr.map(function(res,index){
                        subArr.push({
                            propertyGroupId:res.split('_')[0],
                            propertyId:res.split('_')[1]
                        })
                    })
                    subArr.map(function(res,index){ //解决同一级的切换 并替换
                        
                        if(currentTag.propertyGroupId==res.propertyGroupId){ 
                            res.propertyId=currentTag.propertyId
                        }else{
                            subArr.push(currentTag);
                        }   
                    })
                }else{
                    subArr.push(currentTag);
                }
            }
           console.log(subArr,'subArr')
            //重新拼装url
            var url='';
            subArr.map(function(res,index){
                url+=res.propertyGroupId+"_"+res.propertyId+'-'
            })
            url=url.substring(0, url.length - 1)
            location.href="/node/s/"+idsArr[0] + "-"+idsArr[1]+"-"+url+".html";

        })
    }

    function cloneDeep(obj){
        var objArray=Array.isArray(obj) ? [] : {};
        if(obj && typeof obj ==="object"){
            for (var key in obj) {
                if (obj.hasOwnProperty(key)) {
                    obj[key] && typeof obj[key] === "object" ? objArray[key]=cloneDeep(obj[key]) : objArray[key]=obj[key];
                }
            }
        }
        return objArray
    }
    function getUrl(data) {
        var str='';
        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                data[key] || data[key]===0 ? str+="&"+key+"="+encodeURIComponent(data[key]):''
            }
        }
        return "?"+str.substring(1)
    }

});