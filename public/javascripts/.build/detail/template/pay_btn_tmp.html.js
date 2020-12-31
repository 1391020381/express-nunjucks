define("dist/detail/template/pay_btn_tmp.html", [], '<div class="bottom-fix qwe">\n        {{if data.productType == "3"}}\n            <!--仅在线阅读-->\n            {{if data.isVip == 1}}\n                <div class="data-item fl">\n                    <h2 class="data-title fl"><i class="ico-big-data ico-big-{{data.format}}"></i>{{data.title}}</h2>\n                    <span class="online-read">仅供在线阅读</span>\n                </div>\n                <div class="integral-con fr">\n                    <a id="searchRes" class="btn-fix-vip fl" ><i class="icon-detail"></i>寻找资料</a>\n                </div>\n\n            {{else}}\n                <div class="data-item fl">\n                    <h2 class="data-title fl"><i class="ico-big-data ico-big-{{data.format}}"></i>{{data.title}}</h2>\n                    <span class="online-read">仅供在线阅读</span>\n                </div>\n                <div class="integral-con fr">\n                    <a class="btn-fix-vip js-buy-open fl " pcTrackContent="joinVip-2"  data-type="vip">开通VIP，享更多特权</a>\n                </div>\n            {{/if}}\n        {{else}}\n            <!--VIP免费-->\n            {{if data.productType == 4}}\n                <div class="data-item fl">\n                    <h2 class="data-title fl"><i class="ico-big-data ico-big-{{data.format}}"></i>{{data.title}}</h2>\n                </div>\n                <div class="integral-con fr">\n                    {{ if data.status != 2 }}\n                        <span style="float:left;margin-right:15px;">{{ data.productPrice }}个下载特权</span>\n                    {{ /if }}\n                    <a class="btn-fix-bottom fl " pcTrackContent="downloadBtn-3"  data-toggle="download">立即下载</a>\n                </div>\n            {{else}}\n                {{if data.productType == "5" }}\n                    <!--现金文档 -->\n                    <!--专享8折 加入vip8折购买 立即下载 立即购买-->\n                      {{if data.isVip == 1 && data.vipDiscountFlag == 1 }}\n                        <div class="data-item fl">\n                            <h2 class="data-title fl">\n                                <i class="ico-big-data ico-big-{{data.format}}"></i>{{data.title}}\n                            </h2>\n                        </div>\n                        <div class="integral-con fr">\n                            {{if data.status!=2}}\n                                <div class="price-con price-more fl">\n                                     <p class="price vip-price">¥{{data.productPrice}}</p>\n                                    <p class="origin-price">原价&yen; {{data.productPrice}}</p>\n                                </div>\n                                 <a class="btn-fix-bottom js-buy-open fl " pcTrackContent="buyBtn-3"  data-type="file">立即下载</a>\n                            {{else}}\n                                 <a class="btn-fix-bottom fl " pcTrackContent="downloadBtn-3"  data-toggle="download">立即下载</a>\n                            {{/if}}\n                        </div>\n                        <!--&& data.ownVipDiscountFlag== 1-->\n                      {{else if data.isVip != 1 && data.vipDiscountFlag == 1 }}\n                        <div class="data-item fl">\n                            <h2 class="data-title fl"><i class="ico-big-data ico-big-{{data.format}}"></i>{{data.title}}</h2>\n                        </div>\n                        <div class="integral-con fr">\n                            {{if data.status!=2}}\n                                <div class="price-con price-more fl">\n                                    <!--现金文档价格 -->\n                                    <p class="price" style="">&yen;{{data.productPrice}}</p>\n                                    <!--现金文档 有折扣 非vip会员 -->\n                                  \n                                      <p class="vip-sale-price">会员价&yen;<span class="js-original-price">{{data.productPrice}}</span></p>\n                                </div>\n                                <a class="btn-fix-bottom btn-fix-border js-buy-open fl " pcTrackContent="buyBtn-3"  data-type="file">立即下载</a>\n                            {{else}}\n                                 <a class="btn-fix-bottom fl " pcTrackContent="downloadBtn-3"  data-toggle="download">立即下载</a>\n                            {{/if}}\n                        </div>\n                      {{else}}\n                        <div class="data-item fl">\n                            <h2 class="data-title fl">\n                                <i class="ico-big-data ico-big-{{data.format}}"></i>{{data.title}}\n                            </h2>\n                        </div>\n\n                        <div class="integral-con fr">\n                            {{if data.status!=2}}\n                                <div class="price-con fl">\n                                    <!--现金文档价格 -->\n                                     <p class="price" style="">¥{{data.productPrice}}</p>\n                                </div>\n                                <a class="btn-fix-bottom js-buy-open  fl " pcTrackContent="buyBtn-3"  loginOffer="buyBtn-2" data-type="file">立即下载</a>\n                            {{else}}\n                                <a class="btn-fix-bottom fl " pcTrackContent="downloadBtn-3"  data-toggle="download">立即下载</a>\n                            {{/if}}\n                        </div>\n                    {{/if}}\n                {{else}}\n                    <!--vip-->\n                    {{if data.isVip == 1}}\n                            <div class="data-item fl">\n                                <h2 class="data-title fl">\n                                    <i class="ico-big-data ico-big-{{data.format}}"></i>{{data.title}}\n                                </h2>\n                            </div>\n                            <div class="integral-con fr">\n                                {{if data.volume > 0}}\n                                    <div class="price-con fl">\n                                        <p class="price">{{data.volume}}下载券</p>\n                                    </div>\n                                {{/if}}\n                                <a class="btn-fix-bottom  fl " pcTrackContent="downloadBtn-3"  data-toggle="download">立即下载</a>\n                            </div>\n                    {{else}}\n                        {{if data.volume > 0}}\n\n                            <div class="data-item fl">\n                                <h2 class="data-title fl">\n                                    <i class="ico-big-data ico-big-{{data.format}}"></i>{{data.title}}\n                                </h2>\n                            </div>\n\n                            <div class="integral-con fr">\n                                <div class="price-con fl">\n                                    <p class="price" style="">{{data.volume}}下载券</p>\n                                </div>\n                                <a class="btn-fix-bottom  fl " pcTrackContent="downloadBtn-3"  data-toggle="download" >立即下载</a>\n                            </div>\n                        {{else}}\n                            <div class="data-item fl">\n                                <h2 class="data-title fl">\n                                    <i class="ico-big-data ico-big-{{data.format}}"></i>{{data.title}}\n                                </h2>\n                            </div>\n\n                            <div class="integral-con fr">\n                                <a class="btn-fix-bottom  fl " pcTrackContent="downloadBtn-3"  data-toggle="download" >立即下载</a>\n                            </div>\n                        {{/if}}\n                    {{/if}}\n                {{/if}}\n            {{/if}}\n        {{/if}}\n</div>\n');