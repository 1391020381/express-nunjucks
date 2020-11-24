define("dist/detail-b/template/userComments-debug.html", [], '<div class="user-comments">\n     <div class="user-evaluation">\n        <div class="evaluation-tags">\n            {{each tagsList as item }}\n                  {{if item.active}}\n                  <span class="tag tag-active" data-id="{{item.id}}">{{item.name}}</span>\n                 {{else}}\n                  <span class="tag" data-id="{{item.id}}">{{item.name}}</span>\n                 {{/if}}\n           {{/each}}  \n              {{if lableId}}\n            <span class="tag tag-all " data-id="">全部</span>\n           {{else}}\n            <span class="tag tag-all tag-active" data-id="">全部</span>\n           {{/if}}\n        </div>\n        <ul class="evaluation-list">\n            {{each userComments as comment }}\n              <li class="evaluation-item">\n                    <p class="evaluation-user-summary"> \n                       <img class="evaluation-user-avatar" src="{{comment.photoPicURL}}"/> \n                       <span class="evaluation-user-name">{{comment.nickName}}</span>\n                          {{ each comment.score as score}}\n                                 <span class="start"></span> \n                          {{/each}}\n                       <span class="evaluation-time">{{comment.createTime}}</span>\n                    </p>\n                    <p class="evaluation-desc">{{comment.content}}</p>\n              </li>\n              {{/each}}\n        </ul>\n    </div>\n<div class="pagination-wrapper">\n        \n</div>\n</div>');