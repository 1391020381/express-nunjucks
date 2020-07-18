define("dist/personalCenter/template/myuploads-debug.html", [], '<div class="myuploads">\n     <p class="myuploads-title">\n        <span class="title-desc">我的上传</span>\n        <span class="file-num">{{totalPages}}篇</span>\n    </p>\n    <ul class="myuploads-tabs tabs" >\n        <li  class="{{ myuploadType == \'1\' ? \'tab-active tab\':\'tab\'}}"><a href="/node/personalCenter/myuploads.html?myuploadType=1">公开资料</a></li>\n        <li class="{{ myuploadType == \'2\' ? \'tab-active tab\' :\'tab\'}}"><a href="/node/personalCenter/myuploads.html?myuploadType=2">付费资料</a></li>\n        <li class="{{ myuploadType == \'3\' ? \'tab-active tab\' :\'tab\'}}"><a href="/node/personalCenter/myuploads.html?myuploadType=3">私有资料</a></li>\n        <li class="{{ myuploadType == \'4\' ? \'tab-active tab\' :\'tab\'}}"><a href="/node/personalCenter/myuploads.html?myuploadType=4">审核中</a></li>\n        <li class="{{ myuploadType == \'5\' ? \'tab-active tab\' :\'tab\'}}"><a href="/node/personalCenter/myuploads.html?myuploadType=5">未通过</a></li>\n    </ul>\n    {{ if list.length}}\n        \n         {{ if  myuploadType !== \'4\'}}\n          <label class="table-title" >\n            <img class="delete-icon" data-deleteType=\'deleteSome\' src="{{cdnUrl}}/images/personalCenter/delete-icon.png">\n            <span class="delete-desc">删除</span>\n            <span class="myuploads-nums">0篇</span>\n        </label>\n         {{/if}}\n    {{/if }}\n    <table class="myuploads-table-list">\n        <tr class="myuploads-table-head">\n                <th style="{{myuploadType == \'1\'? \'width:400px;\':myuploadType == \'2\'?\'width:400px;\':\'\'}}">\n                <label for="all">\n                   {{ if myuploadType !== \'4\'}}\n                      <input  type="checkbox"  id="all" value="all"/>\n                     <span></span>\n                   {{/if}}\n                   <span style="margin-left: 5px;">资料标题</span>\n                </label>\n            </th>\n            {{ if myuploadType != \'4\' }}\n                 <th style="width:100px;"></th>\n            {{/if}}\n            {{ if myuploadType == \'1\'}}\n                     <th style="width:100px;">价格</th>\n                        <th style="width:100px;">浏览量</th>\n                        <th style="width:100px;">下载量</th>\n            {{/if}}\n             {{if myuploadType == \'2\'}}\n                        <th style="width:100px;">价格</th>\n                        <th style="width:100px;">浏览量</th>\n                        <th style="width:100px;">下载量</th>\n                    {{/if}} \n            <th style="width:100px;">上传时间</th>\n        </tr>\n          {{each list}}\n                <tr class="table-item">\n            <td>\n                <label for={{list[$index].id}} class="label">\n                     {{ if myuploadType !== \'4\'}}\n                    <input id={{list[$index].id}} type="checkbox" class="label-input"/>\n                    <span></span>\n                    {{/if}}\n                    <span  class="file-icon ico-data {{\'ico-\'+ list[$index].format}}"></span>\n                    {{if myuploadType !== \'4\' && myuploadType !== \'5\'}}\n                      <span class="file-title"><a href="/f/{{list[$index].id}}.html"  target="_blank">{{list[$index].title}}</a></span>\n                    {{else}}\n                      <span class="file-title">{{list[$index].title}}</span>\n                    {{/if}}\n                </label>\n            </td>\n              {{ if myuploadType != \'4\' }}\n             <td><img class="delete-icon" data-id={{list[$index].id}} src="{{cdnUrl}}/images/personalCenter/delete-icon.png"></td>\n             {{/if}}\n\n             {{ if myuploadType == \'1\'}}\n                          <td class="td-text">{{list[$index].userFilePrice}}</td>\n                          <td class="td-text">{{list[$index].readNum > 10000 ? list[$index].readNum/10000+\'w\' : list[$index].readNum}}</td>\n                          <td class="td-text">{{list[$index].downNum > 10000 ? list[$index].downNum/10000+\'w\' : list[$index].downNum}}</td>\n             {{/if}}\n               {{if myuploadType == \'2\'}}\n                          <td class="td-text">{{list[$index].userFilePrice}}</td>\n                          <td class="td-text">{{list[$index].readNum > 10000 ? list[$index].readNum/10000+\'w\' : list[$index].readNum}}</td>\n                          <td class="td-text">{{list[$index].downNum > 10000 ? list[$index].downNum/10000+\'w\' : list[$index].downNum}}</td>\n                 {{/if}}\n            <td class="td-text">{{list[$index].createtime}}</td>\n        </tr>\n          {{/each}}\n    </table>\n    <div class="pagination-wrapper">\n        \n    </div>\n</div>');