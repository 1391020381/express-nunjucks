define("dist/detail/template/HotSpotSearch-debug.html", [], '<!--热点搜索-->\n<div class="hot-spot-search">\n    <h2 class="hot-spot-search-title">热点搜索<h2>\n    <ul class="hot-items">\n         {{each hotSpotSearchList}}\n             <li class="item">\n                <a href={{hotSpotSearchList[$index].url}}>{{hotSpotSearchList[$index].value}}</a>\n             </li>\n        {{/each}}  \n    </ul>\n</div>');