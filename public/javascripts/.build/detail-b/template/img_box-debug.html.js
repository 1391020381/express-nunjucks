define("dist/detail-b/template/img_box-debug.html", [], '{{each data as value i}}\n{{if ptype == \'txt\'}}\n<div class="detail-con first-style  article-page source-link mt10" data-num="{{data[i].noPage}}">\n    <div class="detail-inner article-main">\n        <div class="data-detail {{if ptype == \'ppt\'}} ppt-format-style {{else}}  other-format-style  {{/if}}">\n            {{#data[i].imgSrc}}\n        </div>\n    </div>\n</div>\n{{else}}\n{{if ptype == \'svg\'}}\n{{if data[i].svgSrc}}\n<div class="detail-con third-style   article-page source-link mt10" data-num="{{data[i].noPage}}">\n    <div class="detail-inner article-main">\n        <div class="data-detail {{if ptype == \'ppt\'}} ppt-format-style {{else}}  other-format-style  {{/if}}">\n            <embed data-src="{{data[i].svgSrc}}" src="{{data[i].svgSrc}}" width="100%" height="100%"\n                type="image/svg+xml" pluginspage="//www.adobe.com/svg/viewer/install/" />\n            {{if !copy}}\n            <article class="detail-holder"></article>\n            {{/if}}    \n        </div>\n    </div>\n</div>\n{{/if}}\n{{else}}\n{{if data[i].imgSrc }}\n<div class="detail-con second-style  article-page source-link mt10" data-num="{{data[i].noPage}}">\n    <div class="detail-inner article-main">\n        <div class="data-detail {{if ptype == \'ppt\'}} ppt-format-style {{else}}  other-format-style  {{/if}}">\n            <img data-src="{{data[i].imgSrc}}" src="{{data[i].imgSrc}}" alt="" class="img-png lazy"\n                style="width: 100%;height: auto">\n        </div>\n    </div>\n</div>\n{{/if}}\n{{/if}}\n{{/if}}\n{{/each}}');