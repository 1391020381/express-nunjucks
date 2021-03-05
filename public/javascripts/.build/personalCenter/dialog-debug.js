define("dist/personalCenter/dialog-debug", [], function(require, exports, module) {
    $("#dialog-box").on("click", ".close-btn", function(e) {
        closeRewardPop();
    });
    $("#dialog-box").on("click", ".cancel-btn", function(e) {
        closeRewardPop();
    });
    function closeRewardPop() {
        $(".common-bgMask").hide();
        $(".detail-bg-mask").hide();
        $("#dialog-box").hide();
    }
    return {
        closeRewardPop: closeRewardPop
    };
});