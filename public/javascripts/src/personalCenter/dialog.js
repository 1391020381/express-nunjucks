define(function(require , exports , module){
    var type = window.pageConfig&&window.pageConfig.page.type
    if(type == 'myuploads'){
        // $("#dialog-box").dialog({
        //     html: $('#myuploads-delete-dialog').html(),
        // }).open();
    }
 
    
    if(type=='mywallet'){
        $("#dialog-box").dialog({
            html: $('#mywallet-tip-dialog').html(),
        }).open();
    }
    // $('#dialog-box').on('click','.submit-btn',function(e){
        
    // })
        
    $('#dialog-box').on('click','.close-btn',function(e){
        closeRewardPop();
    })
    $('#dialog-box').on('click','.cancel-btn',function(e){
        closeRewardPop();
    })
    function closeRewardPop(){
        $(".common-bgMask").hide();
        $(".detail-bg-mask").hide();
        $('#dialog-box').hide();
    } 
    return {
        closeRewardPop:closeRewardPop
    }
});