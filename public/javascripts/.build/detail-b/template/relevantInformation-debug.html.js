define("dist/detail-b/template/relevantInformation-debug.html", [], '<!--相关资料-->\n\n <h2 class="related-data-title">相关推荐</h2>\n  <ul class="related-data-list">\n         {{each RelevantInformationList as item}}\n             <li  class="item" data-id="{{item.id}}">\n                <a class="item-link" href="/f/{{item.id}}.html" target="_blank" data-id="{{item.id}}" class="_blank">\n                    {{ if item.cover_url }}\n                     <img class="img" src="{{item.cover_url}}" alt="{{item.name}}"/>\n                    {{ else }}\n                     <img class="img" src="{{cdnUrl}}/images/default-picture.png" alt="{{item.name}}"/>\n                    {{ /if}}\n                      <p class="item-name">{{item.name}}</p>\n                </a>\n             </li>\n         {{/each}}\n  </ul>');