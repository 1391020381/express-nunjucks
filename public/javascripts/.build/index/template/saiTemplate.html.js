define("dist/index/template/saiTemplate.html", [], "{{each data as item i}}\n<li><a href=\"{{data.type==1?'/f/'+item.id+'.html':data.type==2?item.contentUrl:'/node/s/'+item.id+'.html'}}\" target=\"_blank\">{{data.type==2?item.contentName:item.title}}</a></li>\n{{/each}}  \n");