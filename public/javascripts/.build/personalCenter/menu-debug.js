define("dist/personalCenter/menu-debug", [], function(require, exports, module) {
    $(".personal-menu .menus-desc").click(function(e) {
        console.log(e);
        // console.log($(this).parent().siblings())
        // $(this).parent().siblings().hide()
        $(this).siblings().toggle();
    });
});