function handle(id) {
    if (id){
        try {
            (function () {
                var hm = document.createElement("script");
                hm.src = "https://hm.baidu.com/hm.js?" + id;
                var s = document.getElementsByTagName("script")[0];
                s.parentNode.insertBefore(hm, s);
            })();
        } catch (e) {
            console.error(id,e);
        }
    }
}
handle('b27ecfe0b04082ad29168fc7f4774213');
