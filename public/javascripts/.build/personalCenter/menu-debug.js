define("dist/personalCenter/menu-debug", [], function(require, exports, module) {
    $(".personal-menu .menus-desc").click(function(e) {
        console.log(e);
        $(this).toggleClass("menus-desc-active");
        $(this).siblings().toggle();
    });
});