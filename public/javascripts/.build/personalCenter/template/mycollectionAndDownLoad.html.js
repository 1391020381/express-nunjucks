define("dist/personalCenter/template/mycollectionAndDownLoad.html", [], '<div class="mycollection-anddownLoad">\n   <p class="title">\n       {{ if type == \'mycollection\' }}\n        <span class="title-desc">我的收藏</span>\n        <span class="file-num">{{totalSize}}篇</span>\n        {{else if type ==\'mydownloads\'}}\n             <span class="title-desc">我的下载</span>\n             <span class="file-num">{{totalSize}}篇</span>\n        {{/if}}\n   </p>\n   <table class="table-list">\n  <tr class="table-title">\n     {{ if type == \'mycollection\' }}\n    <th  class="file-title">资料标题</th>\n    <th  class="action-time" style="width:100px;">收藏时间</th>\n  {{else if type ==\'mydownloads\'}}\n      <th  class="file-title">资料标题</th>\n      <th  class="action-time" style="width:100px;">下载时间</th>\n  {{/if}}\n  </tr>\n\n  <tr class="table-item">\n     \n    {{if list.length>0}}\n    \n    {{ each list}}\n          <tr class="table-item">\n             <td class="file-content">\n                <a  target="_blank" href={{\'/f/\'+ list[$index].fileId+\'.html\'}}>\n                <span class="file-type ico-data {{\'ico-\'+ list[$index].format}}"></span>\n                <p class="file-name">{{list[$index].title}}</p>\n                </a>\n             </td>\n    <td class="operation-time">\n       <span>{{list[$index].downloadTime}}</span> \n    </td>\n  </tr>\n\n    {{/each}}\n\n    {{ else}}\n     <div class="empty-data">\n          <img class="empty-img" src="{{cdnUrl}}/images/personalCenter/mycollection-empty-data.png"/>\n          <p class="empty-desc">空空如也~</p>\n     </div>\n    {{/if}}\n</table> \n\n<div class="pagination-wrapper">\n        \n</div>\n</div>');