define("dist/personalCenter/template/commentDialogContent-debug.html", [], '<p class="evaluation-title">\n                 <span class="file-type ico-data ico-{{data.format}}"></span>\n                 <span class="file-title" data-fid="{{data.fid}}">{{data.title}}</span>\n             </p>\n             {{if data.isAppraise == 1}}\n                       <div class="file-rates file-rates-isAppraise">\n                           <span class="start-title">您的评分</span>\n                           {{each data.scores as m}}\n                               <span class="start start-active" data-isappraise="1"></span>\n                           {{/each}}\n                      </div>\n             {{else}}\n                <div class="file-rates"> \n                <span class="start" data-isappraise="0"></span>\n                <span class="start" data-isappraise="0"></span>\n                <span class="start" data-isappraise="0"></span>\n                <span class="start" data-isappraise="0"></span>\n                <span class="start" data-isappraise="0"></span>\n             </div>\n             {{/if}}\n             \n             <div class="evaluation-tags">\n                    {{ if data.isAppraise == 1}}\n                      <p class="tags-title">评价标签</p>\n                    {{/if}}\n                    {{each data.labelList as v i}}\n                           {{if data.isAppraise == 1}}\n                            <label  class="tag"><span class="tag-desc" style=" background: #FCE8E2;color: #222222;">{{v.name}}</span></label>\n                           {{else}}\n                         <label class="tag" for="{{v.id}}">\n                         <input type="checkbox" name="tag" value="{{v.id}}" id="{{v.id}}" class="label-input"/>\n                          <span class="tag-desc">{{v.name}}</span>\n                        </label>   \n                        {{/if}}            \n                     {{/each}}                                 \n             </div>\n              {{if data.isAppraise == 1}}\n             <p class="evaluation-desc-title">评价内容</p>\n             {{/if}}\n             <div class="evaluation-desc">\n               {{if data.isAppraise == 1}}\n                 <span>{{data.content}}</span>\n               {{else}}\n                <textarea class="desc-input" placeholder="其他想说的" maxlength=\'500\'></textarea>\n                \n               {{/if}}\n             </div>\n          {{if data.isAppraise == 1}}\n           <div class="evaluation-confirm" style="background: rgb(242, 81, 37);color: rgb(255, 255, 255);">关闭</div>\n         {{else}}\n        <div class="evaluation-confirm" >提交评价</div>\n        {{/if}}');