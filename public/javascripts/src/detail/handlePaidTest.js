// vip专享文档 以 付费文档的格式购买
define(function (require) {
    var api = require('../application/api');
    var url = api.user.dictionaryData.replace('$code', 'PaidTest');
    var price = ''
    var desc = ''
    function getPaidTestData(){
        if(!price && !desc){
            $ajax(url, 'GET', '', false).done(function (res) {
                if (res.code == 0 && res.data && res.data.length) {
                    $.each(res.data, function (index, item) {
                        if(item.pcode == 0){
                            price = item.pname
                            desc = item.pvalue
                            changePaidTestHtml(price,desc)
                        }
                    })
                }
            });
        }else{
            changePaidTestHtml(price,desc)
        }

    }
    function changePaidTestHtml(price,desc){
        $('.integral-con .integral-con-price').text(price)
        $('.integral-con .integral-con-desc').text(desc)
        $('.integral-con .integral-con-content').attr("price",price)
        $('.integral-con .integral-con-content').attr("desc",desc)
        $('.integral-con .integral-con-content').show()
    }
    return {
        getPaidTestData:getPaidTestData
    }
})
