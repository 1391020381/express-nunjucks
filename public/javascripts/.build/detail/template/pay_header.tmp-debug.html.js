define("dist/detail/template/pay_header.tmp-debug.html", [], '{{ if data.isDownload != \'n\' }}\n    {{if data.vipFreeFlag == 1}}\n           <a class="btn-data-new " pcTrackContent="downloadBtn-0"  data-toggle="download" loginOffer="downloadBtn-0">立即下载</a>\n    {{else}}\n          {{ if data.perMin == "3"}}\n                {{if data.isVip == 1 && data.vipDiscountFlag == 1 && data.ownVipDiscountFlag == 1}}\n                            {{if data.status!=2}}\n                                <a class="btn-data-new js-buy-open " pcTrackContent="buyBtn-1"  data-type="file">立即购买</a>\n                                <div class="header-price-warp header-price-more">\n                                    <p class="price vip-price">&yen; {{(data.moneyPrice*1000/1250).toFixed(2)}}</p>\n                                    <p class="origin-price">原价&yen;{{data.moneyPrice}}</p>\n                                </div>\n                            {{else}}\n                                 <a class="btn-data-new " pcTrackContent="downloadBtn-0"  data-toggle="download" loginOffer="downloadBtn-0">立即下载</a>\n                            {{/if}}\n                {{else if data.isVip == 0 && data.vipDiscountFlag == 1 && data.ownVipDiscountFlag== 1}}\n                            {{if data.status!=2}}\n                                <a class="btn-data-new js-buy-open " pcTrackContent="buyBtn-1"  data-type="file">立即购买</a>\n                                <div class="header-price-warp header-price-more">\n                                    <p class="price">&yen;{{data.moneyPrice}}</p>\n                                    <p class="vip-sale-price">会员价&yen;{{(data.moneyPrice*1000/1250).toFixed(2)}}起</p>\n                                </div>\n                            {{else}}\n                                 <a class="btn-data-new " pcTrackContent="downloadBtn-0"  data-toggle="download" loginOffer="downloadBtn-0">立即下载</a>\n                            {{/if}}\n                {{else}}\n                            {{if data.status!=2}}\n                                <a class="btn-data-new js-buy-open " pcTrackContent="buyBtn-1"  data-type="file">立即购买</a>\n                                <div class="header-price-warp">\n                                    <p class="price">&yen;{{data.moneyPrice}}</p>\n                                </div>\n                            {{else}}\n                                <a class="btn-data-new " pcTrackContent="downloadBtn-0"  data-toggle="download" loginOffer="downloadBtn-0">立即下载</a>\n                            {{/if}}\n\n                {{/if}}\n          {{else}}\n                {{ if data.volume >0 }}\n                                <a class="btn-data-new " pcTrackContent="downloadBtn-0"  data-toggle="download" loginOffer="downloadBtn-0">立即下载</a>\n                                <p class="btn-text"><span>{{data.volume}}</span>下载券</p>\n                {{else}}\n                        <a class="btn-data-new " pcTrackContent="downloadBtn-0"  data-toggle="download" loginOffer="downloadBtn-0">立即下载</a>\n                {{/if}}\n          {{/if}}\n    {{/if}}\n{{/if}}');