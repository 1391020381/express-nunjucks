define("dist/detail-b/template/guessYouLike-debug.html", [], '<!--猜你喜欢-->\n\n\n<div class="guessyoulike"  >\n    <div class="guess-you-like">\n    <h2 class="guess-you-like-title">你可能还喜欢</h2>\n    <ul class="guess-you-like-itmes">\n    {{each paradigm4GuessData as item}}\n          <li class="item" bilogContent="underSimilarFileClick" data-id="{{item.id}}">\n            <a class="item-link" href="/f/{{item.id}}.html" target="_blank">\n                  <div class="item-content">\n                      {{ if item.cover_url }}\n                         <img class="img"  src="{{item.cover_url}}" alt="{{item.name}}"/>\n                        {{ else }}\n                        <img class="item-link-left-img"  src="{{cdnUrl}}/images/detail/pic_data_normal.jpg" alt="{{item.name}}"/>\n                       {{ /if }}\n                 <p class="item-desc">{{item.name}}</p>\n                  <div class="pic-mask"></div>\n                   <span class="pic-download">立即下载</span> \n                  </div>\n\n            </a>\n        </li>\n     {{/each}}\n    </ul>\n</div>\n</div>');