// vip专享文档 以 付费文档的格式购买
define(function (require) {
    var api = require('../application/api');
    var url = api.user.dictionaryData.replace('$code', 'PaidTest');
    var flag = false
    var price = ''
    var desc = ''
    function getPaidTestData(){
        if(!price && !desc){
            $ajax(url, 'GET', '', false).done(function (res) {
                if (res.code == 0 && res.data && res.data.length) {
                    $.each(res.data, function (index, item) {
                        if(item.pcode == 4){
                            flag = true
                            price = item.pvalue
                            desc = item.desc
                            changePaidTestHtml(price,desc)
                        }
                    })
                }else{
                    changePaidTestHtml()
                }
            });
        }else{
            changePaidTestHtml(price,desc)
        }

    }
    function changePaidTestHtml(price,desc){
        if(price&&desc){
        $('.integral-con .integral-con-price').text(price/100)
        $('.integral-con .integral-con-desc').text(desc)
        $('.integral-con .integral-con-content').attr("price",price/100)
        $('.integral-con .integral-con-content').attr("desc",desc)
        $('.integral-con .integral-con-content').show()

        $('.integral-con .btn-fix-bottom-normal').hide()
        $('.integral-con .integral-con-vipnum').hide() // 消耗多少特权
        }else{
            $('.integral-con .integral-con-content').hide()
            $('.integral-con .btn-fix-bottom-vip').hide()
            $('.btn-fix-bottom .bought').hide()
        }
    }
    return {
        getPaidTestData:getPaidTestData
    }
})
