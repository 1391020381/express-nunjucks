define("dist/personalCenter/template/simplePagination.html", [], '{{ if paginationList.length >1}}\n  <ul class="page-list pagination">\n        <li class="page-item first" data-currentPage="1">首页</li>\n        {{if currentPage>1}}\n        <li class="page-item prev" data-currentPage={{currentPage-1}}>上一页</li> \n        {{/if}}\n        {{ if paginationList.length>1}}\n            {{each paginationList}}\n                {{if $index >=0}}\n                     {{ if $index<+currentPage+3 }}\n                   {{if $index>=currentPage-3}}\n                          {{if currentPage == $index+1}}\n                                   <li class=\'page-item active\'  data-currentPage={{$index +1}}>\n                                       {{$index+1}}\n                                    </li>\n                          {{else}}\n                                <li class=\'page-item\' data-currentPage={{$index+1}}>\n                                       {{$index+1}}\n                                </li>\n                          {{/if}}\n                   {{/if}}\n               {{ /if }}\n                {{/if}}\n           {{/each}}\n\n           {{if currentPage <= paginationList.length -3}}\n                <li class="page-more page-item">...</li>\n           {{/if}}\n           {{if currentPage < paginationList.length}}\n             <li class="page-item" data-currentPage={{currentPage+1}}>下一页</li>\n          {{/if}}\n           <li class="page-item" data-currentPage={{paginationList.length}}>尾页</li>\n        {{/if}}  \n  </ul>\n\n{{/if}}');