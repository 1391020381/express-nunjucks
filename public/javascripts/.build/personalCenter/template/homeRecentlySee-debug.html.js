define("dist/personalCenter/template/homeRecentlySee-debug.html", [], '  <!--home页面最近看过 最近下载-->\n        {{ if flag == \'recentlySee\' }}\n             <p class="recently-see-title">最近看过</p>\n        {{else}}\n                 <p class="recently-see-title">最近下载</p>\n        {{/if}}\n     \n        <ul class="recently-see-items">\n         {{each data}}\n             <li class="item">\n                <a class="item-link"  target="_blank" href={{\'/f/\'+ data[$index].fileid+\'.html\'}}>\n                <div class="item-link-left">\n                  <img class="item-link-left-img"  src="{{cdnUrl}}/images/detail/pic_data_normal.jpg" alt=""/>\n                 <span  class="item-link-left-icon ico-data {{\'ico-\'+ data[$index].format}}"  ><span>\n                </div>\n                <div class="item-link-right">\n                    <p class="item-link-right-desc">\n                                {{data[$index].name}}\n                            </p>\n                    <p class="item-link-right-other">\n                        {{ if data[$index].totalPage }}\n                             <span class="other-read">{{data[$index].totalPage}}页</span>\n                        {{/if}}\n                    </p>\n                </div>\n              </a> \n            </li>\n         {{/each}}   \n       </ul>');